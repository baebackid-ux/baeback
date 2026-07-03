import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

function generateRequestId() {
  return crypto.randomUUID();
}

async function getAccessToken() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function apiFetch(path, options = {}) {
  const requestId = options.requestId || generateRequestId();
  const headers = {
    'Content-Type': 'application/json',
    'X-Request-Id': requestId,
    ...options.headers,
  };

  if (options.auth) {
    const token = await getAccessToken();
    if (!token) throw new Error('Anda perlu masuk terlebih dahulu.');
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(body.error || 'Permintaan gagal.');
    err.requestId = body.requestId || response.headers.get('X-Request-Id');
    throw err;
  }

  return { ...body, requestId: body.requestId || response.headers.get('X-Request-Id') };
}

export async function fetchCampaigns(page = 1, limit = 12) {
  return apiFetch(`/campaigns?page=${page}&limit=${limit}`);
}

export async function fetchCampaign(idOrSlug) {
  return apiFetch(`/campaigns/${idOrSlug}`);
}

export async function submitDonation({ campaign_id, amount, message, turnstile_token, idempotencyKey }) {
  const key = idempotencyKey || crypto.randomUUID();
  return apiFetch('/donations', {
    method: 'POST',
    auth: true,
    headers: { 'Idempotency-Key': key },
    body: JSON.stringify({ campaign_id, amount, message, turnstile_token }),
  });
}

export async function fetchMyDonations(page = 1, limit = 20) {
  return apiFetch(`/donations/me?page=${page}&limit=${limit}`, { auth: true });
}

export async function checkApiHealth() {
  try {
    const base = import.meta.env.VITE_API_URL?.replace('/v1', '') || '/api';
    const response = await fetch(`${base}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
