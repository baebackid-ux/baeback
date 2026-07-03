import * as memory from './memory.js';
import * as redis from './redis.js';

let useRedis = false;

export async function initCache(config) {
  if (config.redisUrl) {
    await redis.initRedis(config.redisUrl);
    useRedis = redis.isRedisAvailable();
  }
}

export function isUsingRedis() {
  return useRedis && redis.isRedisAvailable();
}

export async function cacheGet(key) {
  if (useRedis) return redis.redisGet(key);
  return memory.memoryGet(key);
}

export async function cacheGetStale(key) {
  if (useRedis) return redis.redisGetStale(key);
  return memory.memoryGetStale(key);
}

export async function cacheSet(key, value, ttlSeconds) {
  if (useRedis) return redis.redisSet(key, value, ttlSeconds);
  return memory.memorySet(key, value, ttlSeconds);
}

export async function cacheDelete(key) {
  if (useRedis) return redis.redisDelete(key);
  return memory.memoryDelete(key);
}

export async function cacheDeletePrefix(prefix) {
  if (useRedis) return redis.redisDeletePrefix(prefix);
  return memory.memoryDeletePrefix(prefix);
}

export async function cacheIncr(key, ttlSeconds) {
  if (useRedis) return redis.redisIncr(key, ttlSeconds);
  const current = memory.memoryGet(key) || 0;
  const next = (typeof current === 'number' ? current : 0) + 1;
  memory.memorySet(key, next, ttlSeconds);
  return next;
}

export async function cacheGetCounter(key) {
  if (useRedis) return redis.redisGetCounter(key);
  const val = memory.memoryGet(key);
  return typeof val === 'number' ? val : 0;
}

export async function closeCache() {
  await redis.closeRedis();
  memory.memoryClear();
}

export { redis };
