import { createClient } from '@supabase/supabase-js';
import { getLogger } from './logger.js';

let adminClient = null;

const RETRYABLE_CODES = new Set(['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']);
const RETRYABLE_STATUS = new Set([502, 503, 504]);

function isRetryable(error) {
  if (!error) return false;
  if (RETRYABLE_CODES.has(error.code)) return true;
  if (error.status && RETRYABLE_STATUS.has(error.status)) return true;
  if (error.message?.includes('fetch failed')) return true;
  return false;
}

export function withTimeout(promise, ms, label = 'operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timeout setelah ${ms}ms`)), ms);
    }),
  ]);
}

export async function withRetry(fn, { retries = 1, timeoutMs = 10000, label = 'query' } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await withTimeout(fn(), timeoutMs, label);
    } catch (err) {
      lastError = err;
      if (attempt < retries && isRetryable(err)) {
        getLogger().warn({ attempt: attempt + 1, label, err: err.message }, 'Retrying Supabase query');
        await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export function getAdminClient(config) {
  if (!adminClient) {
    adminClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
}

export function resetAdminClient() {
  adminClient = null;
}

export async function verifyUserToken(config, token) {
  const client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const result = await withRetry(
    () => client.auth.getUser(token),
    { timeoutMs: config.supabaseTimeoutMs, label: 'auth.getUser' },
  );

  const { data, error } = result;
  if (error || !data.user) return null;
  return data.user;
}

export async function checkSupabaseHealth(config) {
  try {
    const db = getAdminClient(config);
    const result = await withRetry(
      () => db.from('campaigns').select('id').limit(1),
      { retries: 0, timeoutMs: 5000, label: 'health.check' },
    );
    return !result.error;
  } catch {
    return false;
  }
}

export async function runQuery(config, fn, label = 'query') {
  return withRetry(fn, {
    retries: 1,
    timeoutMs: config.supabaseTimeoutMs,
    label,
  });
}
