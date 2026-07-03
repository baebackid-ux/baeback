import { Redis } from 'ioredis';
import { getLogger } from '../logger.js';

let client = null;
let available = false;

export async function initRedis(redisUrl) {
  if (!redisUrl) return null;

  try {
    client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 5000,
    });
    await client.connect();
    available = true;
    getLogger().info('Redis connected');
    return client;
  } catch (err) {
    getLogger().warn({ err: err.message }, 'Redis unavailable, falling back to memory');
    client = null;
    available = false;
    return null;
  }
}

export function isRedisAvailable() {
  return available && client !== null;
}

export async function redisGet(key) {
  if (!isRedisAvailable()) return null;
  try {
    const raw = await client.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function redisSet(key, value, ttlSeconds) {
  if (!isRedisAvailable()) return;
  try {
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    await client.set(`stale:${key}`, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export async function redisGetStale(key) {
  if (!isRedisAvailable()) return null;
  try {
    const raw = await client.get(`stale:${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function redisDelete(key) {
  if (!isRedisAvailable()) return;
  try {
    await client.del(key, `stale:${key}`);
  } catch {
    /* ignore */
  }
}

export async function redisDeletePrefix(prefix) {
  if (!isRedisAvailable()) return;
  try {
    const keys = await client.keys(`${prefix}*`);
    if (keys.length) await client.del(...keys);
    const staleKeys = await client.keys(`stale:${prefix}*`);
    if (staleKeys.length) await client.del(...staleKeys);
  } catch {
    /* ignore */
  }
}

export async function redisIncr(key, ttlSeconds) {
  if (!isRedisAvailable()) return null;
  try {
    const count = await client.incr(key);
    if (count === 1) await client.expire(key, ttlSeconds);
    return count;
  } catch {
    return null;
  }
}

export async function redisGetCounter(key) {
  if (!isRedisAvailable()) return null;
  try {
    const val = await client.get(key);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return null;
  }
}

export async function closeRedis() {
  if (client) {
    await client.quit().catch(() => {});
    client = null;
    available = false;
  }
}

export function getRedisClient() {
  return client;
}
