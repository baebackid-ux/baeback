import { supabase, isSupabaseConfigured } from './supabase';

export async function fetchCampaigns(page = 1, limit = 12) {
  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from('campaigns')
    .select('id,title,slug,description,target_amount,collected_amount,status,category,image_url,start_date,end_date,created_at', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

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

export async function fetchCampaign(idOrSlug) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  let query = supabase
    .from('campaigns')
    .select('id,title,slug,description,target_amount,collected_amount,status,category,image_url,start_date,end_date,created_at,updated_at');

  if (isUuid) {
    query = query.eq('id', idOrSlug);
  } else {
    query = query.eq('slug', idOrSlug);
  }

  const { data, error } = await query.single();
  if (error) throw error;
  if (!data) throw new Error('Campaign tidak ditemukan.');
  if (data.status !== 'active' && data.status !== 'completed') {
    throw new Error('Campaign tidak tersedia.');
  }

  return { data };
}

export async function submitDonation({ campaign_id, amount, message, idempotencyKey }) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Anda perlu masuk terlebih dahulu.');

  const key = idempotencyKey || crypto.randomUUID();

  // Periksa idempotency key jika disediakan
  if (idempotencyKey) {
    const { data: existing } = await supabase
      .from('donations')
      .select('id, campaign_id, amount, message, status, created_at, idempotency_key')
      .eq('idempotency_key', idempotencyKey)
      .eq('donor_id', user.id)
      .maybeSingle();

    if (existing) {
      return { data: existing, requestId: idempotencyKey };
    }
  }

  // Validasi status campaign sebelum donasi dicatat
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('id, slug, status, end_date')
    .eq('id', campaign_id)
    .single();

  if (campaignError || !campaign) throw new Error('Campaign tidak ditemukan.');
  if (campaign.status !== 'active') throw new Error('Campaign sudah tidak menerima donasi.');
  if (campaign.end_date && new Date(campaign.end_date) < new Date()) {
    throw new Error('Campaign sudah berakhir.');
  }

  const { data, error } = await supabase
    .from('donations')
    .insert({
      campaign_id,
      donor_id: user.id,
      amount,
      message,
      status: 'recorded',
      idempotency_key: key,
    })
    .select('id, campaign_id, amount, message, status, created_at, idempotency_key')
    .single();

  if (error) {
    if (error.code === '23505' && idempotencyKey) {
      const { data: replay } = await supabase
        .from('donations')
        .select('id, campaign_id, amount, message, status, created_at, idempotency_key')
        .eq('idempotency_key', idempotencyKey)
        .eq('donor_id', user.id)
        .maybeSingle();
      if (replay) return { data: replay, requestId: idempotencyKey };
    }
    throw error;
  }

  return { data, requestId: key };
}

export async function fetchMyDonations(page = 1, limit = 20) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Anda perlu masuk terlebih dahulu.');

  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from('donations')
    .select(
      'id, amount, message, status, created_at, campaign:campaigns(id, title, slug, image_url)',
      { count: 'exact' }
    )
    .eq('donor_id', user.id)
    .eq('status', 'recorded')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

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

export async function checkApiHealth() {
  return isSupabaseConfigured;
}

