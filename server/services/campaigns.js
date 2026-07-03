import { cacheDeletePrefix, cacheGet, cacheGetStale, cacheSet } from '../lib/cache/index.js';
import { isCircuitOpen, recordFailure, recordSuccess } from '../lib/circuitBreaker.js';
import { getAdminClient, runQuery } from '../lib/supabase.js';
import { createError } from '../middleware/errorHandler.js';

const LIST_FIELDS = 'id,title,slug,description,target_amount,collected_amount,status,category,image_url,start_date,end_date,created_at';
const DETAIL_FIELDS = `${LIST_FIELDS},updated_at`;

export async function listCampaigns(config, { page, limit, offset }) {
  const cacheKey = `campaigns:list:${page}:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  if (isCircuitOpen(config)) {
    const stale = await cacheGetStale(cacheKey);
    if (stale) return stale;
    throw createError(503, 'Layanan sementara tidak tersedia. Coba lagi nanti.');
  }

  try {
    const db = getAdminClient(config);
    const result = await runQuery(
      config,
      () => db
        .from('campaigns')
        .select(LIST_FIELDS, { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      'campaigns.list',
    );

    const { data, error, count } = result;
    if (error) throw error;

    const payload = {
      data: data ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    };

    await cacheSet(cacheKey, payload, config.cacheTtl.campaignList);
    recordSuccess();
    return payload;
  } catch {
    recordFailure(config);
    const stale = await cacheGetStale(cacheKey);
    if (stale) return stale;
    throw createError(500, 'Gagal memuat daftar campaign.');
  }
}

export async function getCampaign(config, lookup) {
  const cacheKey = `campaigns:detail:${lookup.type}:${lookup.value}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  if (isCircuitOpen(config)) {
    const stale = await cacheGetStale(cacheKey);
    if (stale) return stale;
    throw createError(503, 'Layanan sementara tidak tersedia. Coba lagi nanti.');
  }

  try {
    const db = getAdminClient(config);
    let query = db.from('campaigns').select(DETAIL_FIELDS);

    if (lookup.type === 'id') {
      query = query.eq('id', lookup.value);
    } else {
      query = query.eq('slug', lookup.value);
    }

    const { data, error } = await runQuery(config, () => query.single(), 'campaigns.detail');
    if (error || !data) throw createError(404, 'Campaign tidak ditemukan.');
    if (data.status !== 'active' && data.status !== 'completed') {
      throw createError(404, 'Campaign tidak tersedia.');
    }

    await cacheSet(cacheKey, data, config.cacheTtl.campaignDetail);
    recordSuccess();
    return data;
  } catch (err) {
    if (err.status) throw err;
    recordFailure(config);
    const stale = await cacheGetStale(cacheKey);
    if (stale) return stale;
    throw createError(500, 'Gagal memuat daftar campaign.');
  }
}

export async function invalidateCampaignCache(campaignId, slug) {
  await cacheDeletePrefix('campaigns:list:');
  if (campaignId) await cacheDeletePrefix(`campaigns:detail:id:${campaignId}`);
  if (slug) await cacheDeletePrefix(`campaigns:detail:slug:${slug}`);
}

export async function listAllCampaigns(config, { page, limit, offset }) {
  const db = getAdminClient(config);
  const { data, error, count } = await runQuery(
    config,
    () => db
      .from('campaigns')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1),
    'admin.campaigns.list',
  );

  if (error) throw createError(500, 'Gagal memuat daftar campaign.');

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

export async function createCampaign(config, payload) {
  const db = getAdminClient(config);
  const { data, error } = await runQuery(
    config,
    () => db.from('campaigns').insert(payload).select('*').single(),
    'admin.campaigns.create',
  );

  if (error) throw createError(500, 'Gagal membuat campaign.');
  await invalidateCampaignCache(data.id, data.slug);
  return data;
}

export async function updateCampaign(config, id, updates) {
  const db = getAdminClient(config);
  const { data, error } = await runQuery(
    config,
    () => db.from('campaigns').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single(),
    'admin.campaigns.update',
  );

  if (error || !data) throw createError(404, 'Campaign tidak ditemukan.');
  await invalidateCampaignCache(data.id, data.slug);
  return data;
}
