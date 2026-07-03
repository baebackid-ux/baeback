import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import loadConfig from '../config.js';

const mockUser = { id: '11111111-1111-1111-1111-111111111111', email: 'test@test.com' };
const mockCampaign = {
  id: '22222222-2222-2222-2222-222222222222',
  slug: 'test-campaign',
  status: 'active',
  end_date: null,
};
const CAMPAIGN_ID = '22222222-2222-2222-2222-222222222222';

function createChainMock(resolvedValue) {
  const chain = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve(resolvedValue)),
    maybeSingle: vi.fn(() => Promise.resolve(resolvedValue)),
    insert: vi.fn(() => chain),
    order: vi.fn(() => chain),
    range: vi.fn(() => Promise.resolve(resolvedValue)),
    limit: vi.fn(() => Promise.resolve(resolvedValue)),
  };
  return chain;
}

vi.mock('../lib/supabase.js', () => ({
  verifyUserToken: vi.fn(),
  checkSupabaseHealth: vi.fn(() => Promise.resolve(true)),
  getAdminClient: vi.fn(),
  runQuery: vi.fn((_config, fn) => fn()),
  withTimeout: vi.fn((p) => p),
  withRetry: vi.fn((_c, fn) => fn()),
}));

vi.mock('../jobs/queue.js', () => ({
  enqueueDonationEvent: vi.fn(),
  initJobQueue: vi.fn(),
  closeJobQueue: vi.fn(),
}));

import { verifyUserToken, getAdminClient } from '../lib/supabase.js';

describe('Donations API', () => {
  let app;
  const config = loadConfig();

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp(config);
  });

  it('requires auth for POST /donations', async () => {
    const res = await request(app)
      .post('/api/v1/donations')
      .send({ campaign_id: CAMPAIGN_ID, amount: 50000 });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token autentikasi diperlukan.');
  });

  it('requires idempotency key', async () => {
    verifyUserToken.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/v1/donations')
      .set('Authorization', 'Bearer valid-token')
      .send({ campaign_id: CAMPAIGN_ID, amount: 50000 });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Idempotency-Key');
  });

  it('validates donation amount', async () => {
    verifyUserToken.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/v1/donations')
      .set('Authorization', 'Bearer valid-token')
      .set('Idempotency-Key', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
      .send({ campaign_id: CAMPAIGN_ID, amount: 100 });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Nominal donasi');
  });

  it('returns existing donation on idempotency replay', async () => {
    verifyUserToken.mockResolvedValue(mockUser);

    const existingDonation = {
      data: {
        id: 'don-uuid',
        campaign_id: mockCampaign.id,
        amount: 50000,
        status: 'recorded',
        idempotency_key: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      },
      error: null,
    };

    const db = {
      from: vi.fn((table) => {
        if (table === 'donations') {
          return createChainMock(existingDonation);
        }
        if (table === 'campaigns') {
          return createChainMock({ data: mockCampaign, error: null });
        }
        if (table === 'profiles') {
          return createChainMock({ data: { id: mockUser.id }, error: null });
        }
        return createChainMock({ data: null, error: null });
      }),
    };
    getAdminClient.mockReturnValue(db);

    const res = await request(app)
      .post('/api/v1/donations')
      .set('Authorization', 'Bearer valid-token')
      .set('Idempotency-Key', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
      .send({ campaign_id: CAMPAIGN_ID, amount: 50000 });

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('don-uuid');
  });

  it('does not expose raw database errors', async () => {
    verifyUserToken.mockResolvedValue(mockUser);

    const db = {
      from: vi.fn(() => createChainMock({ data: null, error: { message: 'relation "donations" does not exist', code: '42P01' } })),
    };
    getAdminClient.mockReturnValue(db);

    const res = await request(app)
      .post('/api/v1/donations')
      .set('Authorization', 'Bearer valid-token')
      .set('Idempotency-Key', '33333333-3333-3333-3333-333333333333')
      .send({ campaign_id: CAMPAIGN_ID, amount: 50000 });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.error).not.toContain('relation');
    expect(res.body.requestId).toBeDefined();
  });
});
