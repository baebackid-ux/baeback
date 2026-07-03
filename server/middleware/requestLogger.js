import { randomUUID } from 'node:crypto';
import { getLogger } from '../lib/logger.js';

export function requestLogger() {
  return (req, res, next) => {
    const requestId = req.headers['x-request-id'] || randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    const start = Date.now();

    res.on('finish', () => {
      getLogger().info({
        requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
        userId: req.user?.id || null,
        ip: req.ip,
      });
    });

    next();
  };
}
