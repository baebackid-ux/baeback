import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { isUsingRedis } from './lib/cache/index.js';
import { checkSupabaseHealth } from './lib/supabase.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import createCampaignRoutes from './routes/campaigns.js';
import createDonationRoutes from './routes/donations.js';
import createAdminCampaignRoutes from './routes/admin/campaigns.js';
import { ssrBotMiddleware } from './middleware/ssrBot.js';

const startTime = Date.now();

function mountApiRoutes(app, config, prefix, donationLimiter) {
  app.get(`${prefix}/health`, async (_req, res) => {
    const supabaseOk = await checkSupabaseHealth(config);
    const redisStatus = config.redisUrl ? (isUsingRedis() ? 'ok' : 'fail') : 'skip';
    res.status(supabaseOk ? 200 : 503).json({
      status: supabaseOk ? 'ok' : 'degraded',
      checks: { supabase: supabaseOk ? 'ok' : 'fail', redis: redisStatus },
      uptime: Math.floor((Date.now() - startTime) / 1000),
      environment: config.nodeEnv,
    });
  });

  app.use(`${prefix}/campaigns`, createCampaignRoutes(config));
  app.use(`${prefix}/donations`, donationLimiter, createDonationRoutes(config));
  app.use(`${prefix}/admin/campaigns`, createAdminCampaignRoutes(config));
}

export function createApp(config) {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json({ limit: '16kb' }));
  app.use(requestLogger());
  app.use(ssrBotMiddleware());

  const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
  });

  const donationLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Terlalu banyak permintaan donasi. Coba lagi nanti.' },
  });

  app.use('/api', generalLimiter);
  mountApiRoutes(app, config, '/api/v1', donationLimiter);
  mountApiRoutes(app, config, '/api', donationLimiter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
  });

  app.use(errorHandler);

  return app;
}
