import { Router } from 'express';
import { listCampaigns, getCampaign } from '../services/campaigns.js';
import { validateCampaignParam, validatePagination } from '../middleware/validate.js';

export default function createCampaignRoutes(config) {
  const router = Router();

  router.get('/', validatePagination, async (req, res, next) => {
    try {
      const result = await listCampaigns(config, req.pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:idOrSlug', validateCampaignParam, async (req, res, next) => {
    try {
      const campaign = await getCampaign(config, req.campaignLookup);
      res.json({ data: campaign });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
