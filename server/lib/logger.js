import pino from 'pino';

let loggerInstance = null;

export function initLogger(config) {
  const isDev = config.nodeEnv === 'development';

  loggerInstance = pino({
    level: config.logLevel || (isDev ? 'debug' : 'info'),
    ...(isDev
      ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard' },
          },
        }
      : {}),
  });

  return loggerInstance;
}

export function getLogger() {
  if (!loggerInstance) {
    loggerInstance = pino({ level: 'info' });
  }
  return loggerInstance;
}
