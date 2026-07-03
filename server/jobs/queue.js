import { getAdminClient, runQuery } from '../lib/supabase.js';
import { getLogger } from '../lib/logger.js';

let donationQueue = null;
let workerStarted = false;

export async function initJobQueue(config) {
  if (!config.redisUrl) {
    getLogger().info('Job queue disabled (no REDIS_URL)');
    return;
  }

  try {
    const { Queue, Worker } = await import('bullmq');
    const { getRedisClient, isRedisAvailable } = await import('../lib/cache/redis.js');

    if (!isRedisAvailable()) return;

    const connection = getRedisClient();
    donationQueue = new Queue('donation-events', { connection });

    if (!workerStarted) {
      workerStarted = true;
      new Worker(
        'donation-events',
        async (job) => {
          await processDonationEvent(config, job.data);
        },
        { connection },
      );
      getLogger().info('BullMQ donation-events worker started');
    }
  } catch (err) {
    getLogger().warn({ err: err.message }, 'BullMQ init failed, using setImmediate fallback');
    donationQueue = null;
  }
}

async function processDonationEvent(config, data) {
  const db = getAdminClient(config);
  await runQuery(
    config,
    () => db.from('donation_events').insert({
      donation_id: data.donationId,
      actor_id: data.actorId,
      request_id: data.requestId,
      event_type: data.eventType,
      payload: data.payload || {},
    }),
    'donation_events.insert',
  );
}

export function enqueueDonationEvent(config, data) {
  if (donationQueue) {
    donationQueue.add('log', data, { removeOnComplete: 100, removeOnFail: 50 }).catch((err) => {
      getLogger().warn({ err: err.message }, 'Failed to enqueue donation event');
      setImmediate(() => processDonationEvent(config, data).catch(() => {}));
    });
    return;
  }

  setImmediate(() => {
    processDonationEvent(config, data).catch((err) => {
      getLogger().warn({ err: err.message }, 'Async donation event log failed');
    });
  });
}

export async function closeJobQueue() {
  if (donationQueue) {
    await donationQueue.close().catch(() => {});
    donationQueue = null;
  }
}
