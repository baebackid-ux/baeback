import { cacheGet, cacheGetCounter, cacheIncr, cacheSet } from '../lib/cache/index.js';
import { createError } from './errorHandler.js';

function dayKey(userId) {
  const day = new Date().toISOString().slice(0, 10);
  return `abuse:donations:day:${userId}:${day}`;
}

function campaignHourKey(userId, campaignId) {
  const hour = new Date().toISOString().slice(0, 13);
  return `abuse:donations:campaign:${userId}:${campaignId}:${hour}`;
}

function duplicateKey(userId, campaignId, amount) {
  return `abuse:donations:dup:${userId}:${campaignId}:${amount}`;
}

export function abuseGuard(config) {
  return async (req, _res, next) => {
    const userId = req.user?.id;
    const { campaign_id, amount } = req.validatedDonation || {};

    if (!userId || !campaign_id) return next();

    const dailyCount = await cacheGetCounter(dayKey(userId));
    if (dailyCount !== null && dailyCount >= config.donation.maxPerUserPerDay) {
      return next(createError(429, 'Terlalu banyak donasi hari ini. Coba lagi besok.'));
    }

    const campaignCount = await cacheGetCounter(campaignHourKey(userId, campaign_id));
    if (campaignCount !== null && campaignCount >= config.donation.maxPerUserPerCampaignPerHour) {
      return next(createError(429, 'Terlalu banyak donasi ke campaign ini. Coba lagi nanti.'));
    }

    const dupKey = duplicateKey(userId, campaign_id, amount);
    const recentDup = await cacheGet(dupKey);
    if (recentDup) {
      return next(createError(429, 'Donasi identik baru saja dicatat. Tunggu sebentar.'));
    }

    req.abuseKeys = { dayKey: dayKey(userId), campaignKey: campaignHourKey(userId, campaign_id), dupKey };
    next();
  };
}

export async function recordAbuseCounters(keys, config) {
  if (!keys) return;
  const dayTtl = 86400;
  const hourTtl = 3600;

  await cacheIncr(keys.dayKey, dayTtl);
  await cacheIncr(keys.campaignKey, hourTtl);
  await cacheSet(keys.dupKey, true, config.donation.duplicateWindowSeconds);
}
