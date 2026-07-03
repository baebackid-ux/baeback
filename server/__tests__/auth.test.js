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

import { verifyUserToken } from '../lib/supabase.js';

describe('Auth middleware', () => {
  let app;
  const config = loadConfig();

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp(config);
  });

  it('rejects invalid token', async () => {
    verifyUserToken.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/v1/donations/me')
      .set('Authorization', 'Bearer invalid');

    expect(res.status).toBe(401);
  });

  it('rejects missing authorization header', async () => {
    const res = await request(app).get('/api/v1/donations/me');
    expect(res.status).toBe(401);
  });
});
