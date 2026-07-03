import { verifyUserToken } from '../lib/supabase.js';
import { cacheGet, cacheSet } from '../lib/cache/index.js';
import { getAdminClient, runQuery } from '../lib/supabase.js';
import { createError } from './errorHandler.js';

export function requireAuth(config) {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return next(createError(401, 'Token autentikasi diperlukan.'));
    }

    const token = header.slice(7);
    const user = await verifyUserToken(config, token);
    if (!user) {
      return next(createError(401, 'Token tidak valid atau sudah kedaluwarsa.'));
    }

    req.user = user;
    next();
  };
}

export function requireRole(config, ...roles) {
  return async (req, res, next) => {
    if (!req.user?.id) {
      return next(createError(401, 'Token autentikasi diperlukan.'));
    }

    const role = await getUserRole(config, req.user.id);
    if (!roles.includes(role)) {
      return next(createError(403, 'Akses ditolak.'));
    }

    req.userRole = role;
    next();
  };
}

export async function getUserRole(config, userId) {
  const cacheKey = `role:${userId}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const db = getAdminClient(config);
  const { data } = await runQuery(
    config,
    () => db.from('profiles').select('role').eq('id', userId).single(),
    'profiles.role',
  );

  const role = data?.role || 'user';
  await cacheSet(cacheKey, role, config.cacheTtl.roleCache);
  return role;
}
