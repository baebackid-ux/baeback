import 'dotenv/config';
import loadConfig from './config.js';
import { createApp } from './app.js';
import { initCache, closeCache } from './lib/cache/index.js';
import { initLogger, getLogger } from './lib/logger.js';
import { initJobQueue, closeJobQueue } from './jobs/queue.js';

async function initSentry(config) {
  if (!config.sentryDsn) return;
  try {
    const Sentry = await import('@sentry/node');
    Sentry.init({
      dsn: config.sentryDsn,
      environment: config.nodeEnv,
      tracesSampleRate: config.isProduction ? 0.1 : 1.0,
    });
    getLogger().info('Sentry initialized');
  } catch (err) {
    getLogger().warn({ err: err.message }, 'Sentry init failed');
  }
}

async function start() {
  const config = loadConfig();
  initLogger(config);
  const logger = getLogger();

  await initSentry(config);
  await initCache(config);
  await initJobQueue(config);

  const app = createApp(config);
  const server = app.listen(config.port, () => {
    logger.info({ port: config.port, env: config.nodeEnv }, 'BaeBack API running');
  });

  let shuttingDown = false;

  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, 'Graceful shutdown started');

    server.close(async () => {
      await closeJobQueue();
      await closeCache();
      logger.info('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 15000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
