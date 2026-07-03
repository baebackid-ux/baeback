import { createError } from './errorHandler.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function requireIdempotencyKey() {
  return (req, _res, next) => {
    const key = req.headers['idempotency-key'];
    if (!key || !UUID_RE.test(key)) {
      return next(createError(400, 'Header Idempotency-Key (UUID) wajib untuk donasi.'));
    }
    req.idempotencyKey = key;
    next();
  };
}
