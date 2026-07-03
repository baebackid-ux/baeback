import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireIdempotencyKey } from '../middleware/idempotency.js';
import { abuseGuard } from '../middleware/abuseGuard.js';
import { validateDonationBody, validatePagination } from '../middleware/validate.js';
import { createDonation, getUserDonations } from '../services/donations.js';

export default function createDonationRoutes(config) {
  const router = Router();

  router.post(
    '/',
    requireAuth(config),
    requireIdempotencyKey(),
    validateDonationBody(config),
    abuseGuard(config),
    async (req, res, next) => {
      try {
        const { donation, isReplay } = await createDonation(
          config,
          req.user.id,
          req.validatedDonation,
          {
            idempotencyKey: req.idempotencyKey,
            requestId: req.requestId,
            abuseKeys: req.abuseKeys,
            ip: req.ip,
          },
        );
        res.status(isReplay ? 200 : 201).json({ data: donation, requestId: req.requestId });
      } catch (err) {
        next(err);
      }
    },
  );

  router.get('/me', requireAuth(config), validatePagination, async (req, res, next) => {
    try {
      const result = await getUserDonations(config, req.user.id, req.pagination);
      res.json({ ...result, requestId: req.requestId });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
