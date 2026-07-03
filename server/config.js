const VALID_ENVS = ['development', 'staging', 'production', 'test'];

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

function parseCorsOrigins(raw) {
  if (!raw) return ['http://localhost:5173'];
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

function loadConfig() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Variabel lingkungan wajib belum diisi: ${missing.join(', ')}`);
  }

  const nodeEnv = process.env.NODE_ENV || 'development';
  if (!VALID_ENVS.includes(nodeEnv)) {
    throw new Error(`NODE_ENV harus salah satu dari: ${VALID_ENVS.join(', ')}`);
  }

  const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGIN);

  if (nodeEnv === 'production') {
    if (corsOrigins.includes('*')) {
      throw new Error('CORS_ORIGIN tidak boleh "*" di production.');
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ')) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY tidak valid untuk production.');
    }
  }

  return {
    port: Number(process.env.PORT) || 3001,
    nodeEnv,
    isProduction: nodeEnv === 'production',
    isStaging: nodeEnv === 'staging',
    isDevelopment: nodeEnv === 'development',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    corsOrigins,
    redisUrl: process.env.REDIS_URL || null,
    logLevel: process.env.LOG_LEVEL || (nodeEnv === 'development' ? 'debug' : 'info'),
    sentryDsn: process.env.SENTRY_DSN || null,
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || null,
    supabaseTimeoutMs: Number(process.env.SUPABASE_TIMEOUT_MS) || 10000,
    cacheTtl: {
      campaignList: Number(process.env.CACHE_TTL_CAMPAIGNS) || 60,
      campaignDetail: Number(process.env.CACHE_TTL_CAMPAIGN_DETAIL) || 30,
      roleCache: Number(process.env.CACHE_TTL_ROLE) || 300,
    },
    donation: {
      minAmount: 1000,
      maxAmount: 100_000_000,
      maxMessageLength: 500,
      maxPerUserPerDay: Number(process.env.DONATION_MAX_PER_USER_DAY) || 20,
      maxPerUserPerCampaignPerHour: Number(process.env.DONATION_MAX_PER_CAMPAIGN_HOUR) || 5,
      duplicateWindowSeconds: Number(process.env.DONATION_DUPLICATE_WINDOW_SEC) || 30,
    },
    circuitBreaker: {
      failureThreshold: 3,
      resetAfterMs: 30000,
    },
  };
}

export default loadConfig;
