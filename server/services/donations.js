import { invalidateCampaignCache } from './campaigns.js';
import { getAdminClient, runQuery } from '../lib/supabase.js';
import { verifyTurnstile } from '../lib/turnstile.js';
import { createError } from '../middleware/errorHandler.js';
import { recordAbuseCounters } from '../middleware/abuseGuard.js';
import { enqueueDonationEvent } from '../jobs/queue.js';

const DONATION_FIELDS = 'id, campaign_id, amount, message, status, created_at, idempotency_key';

async function findByIdempotencyKey(db, config, key, userId) {
  const { data } = await runQuery(
    config,
    () => db
      .from('donations')
      .select(DONATION_FIELDS)
      .eq('idempotency_key', key)
      .eq('donor_id', userId)
      .maybeSingle(),
    'donations.idempotency',
  );
  return data;
}

export async function createDonation(config, userId, { campaign_id, amount, message, turnstile_token }, { idempotencyKey, requestId, abuseKeys, ip } = {}) {
  await verifyTurnstile(config, turnstile_token, ip);

  const db = getAdminClient(config);

  if (idempotencyKey) {
    const existing = await findByIdempotencyKey(db, config, idempotencyKey, userId);
    if (existing) {
      return { donation: existing, isReplay: true };
    }
  }

  const { data: campaign, error: campaignError } = await runQuery(
    config,
    () => db.from('campaigns').select('id, slug, status, end_date').eq('id', campaign_id).single(),
    'campaigns.validate',
  );

  if (campaignError || !campaign) throw createError(404, 'Campaign tidak ditemukan.');
  if (campaign.status !== 'active') throw createError(400, 'Campaign sudah tidak menerima donasi.');
  if (campaign.end_date && new Date(campaign.end_date) < new Date()) {
    throw createError(400, 'Campaign sudah berakhir.');
  }

  const { data: profile } = await runQuery(
    config,
    () => db.from('profiles').select('id').eq('id', userId).single(),
    'profiles.validate',
  );

  if (!profile) throw createError(403, 'Profil pengguna tidak ditemukan.');

  const insertPayload = {
    campaign_id,
    donor_id: userId,
    amount,
    message,
    status: 'recorded',
    idempotency_key: idempotencyKey || null,
  };

  const { data, error } = await runQuery(
    config,
    () => db.from('donations').insert(insertPayload).select(DONATION_FIELDS).single(),
    'donations.insert',
  );

  if (error) {
    if (error.code === '23505' && idempotencyKey) {
      const replay = await findByIdempotencyKey(db, config, idempotencyKey, userId);
      if (replay) return { donation: replay, isReplay: true };
    }
    if (error.message?.includes('Campaign tidak aktif')) {
      throw createError(400, 'Campaign tidak menerima donasi saat ini.');
    }
    throw createError(500, 'Terjadi kesalahan, coba lagi nanti.');
  }

  await recordAbuseCounters(abuseKeys, config);
  await invalidateCampaignCache(campaign.id, campaign.slug);

  enqueueDonationEvent(config, {
    donationId: data.id,
    actorId: userId,
    requestId,
    eventType: 'donation.recorded',
    payload: { campaign_id, amount },
  });

  return { donation: data, isReplay: false };
}

export async function getUserDonations(config, userId, { page, limit, offset }) {
  const db = getAdminClient(config);

  const { data, error, count } = await runQuery(
    config,
    () => db
      .from('donations')
      .select(
        'id, amount, message, status, created_at, campaign:campaigns(id, title, slug, image_url)',
        { count: 'exact' },
      )
      .eq('donor_id', userId)
      .eq('status', 'recorded')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1),
    'donations.list',
  );

  if (error) throw createError(500, 'Gagal memuat riwayat donasi.');

  return {
    data: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}
