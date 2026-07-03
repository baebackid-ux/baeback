import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validateAdminCampaignBody, validatePagination } from '../../middleware/validate.js';
import { listAllCampaigns, createCampaign, updateCampaign } from '../../services/campaigns.js';

export default function createAdminCampaignRoutes(config) {
  const router = Router();

  router.use(requireAuth(config));
  router.use(requireRole(config, 'admin'));

  router.get('/', validatePagination, async (req, res, next) => {
    try {
      const result = await listAllCampaigns(config, req.pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', validateAdminCampaignBody, async (req, res, next) => {
    try {
      const campaign = await createCampaign(config, req.validatedCampaign);
      res.status(201).json({ data: campaign });
    } catch (err) {
      next(err);
    }
  });

  router.patch('/:id', async (req, res, next) => {
    try {
      const allowed = ['status', 'title', 'description', 'target_amount', 'category', 'image_url', 'end_date'];
      const updates = {};
      for (const key of allowed) {
        if (req.body?.[key] !== undefined) updates[key] = req.body[key];
      }
      if (!Object.keys(updates).length) {
        return res.status(400).json({ error: 'Tidak ada field yang diperbarui.' });
      }
      const campaign = await updateCampaign(config, req.params.id, updates);
      res.json({ data: campaign });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
