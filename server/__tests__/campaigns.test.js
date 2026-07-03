import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import loadConfig from '../config.js';

vi.mock('../lib/supabase.js', () => ({
  verifyUserToken: vi.fn(),
  checkSupabaseHealth: vi.fn(() => Promise.resolve(true)),
  getAdminClient: vi.fn(),
  runQuery: vi.fn((_config, fn) => fn()),
}));

vi.mock('../jobs/queue.js', () => ({
  enqueueDonationEvent: vi.fn(),
}));

import { getAdminClient } from '../lib/supabase.js';

describe('Campaigns API', () => {
  let app;
  const config = loadConfig();

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp(config);
  });

  it('GET /campaigns returns paginated list', async () => {
    const campaigns = [{ id: '1', title: 'Test', slug: 'test', status: 'active' }];
    const db = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: campaigns, error: null, count: 1 }),
      })),
    };
    getAdminClient.mockReturnValue(db);

    const res = await request(app).get('/api/v1/campaigns');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('GET /health returns status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.checks.supabase).toBe('ok');
  });
});
