import { createError } from './errorHandler.js';
import { sanitizeMessage } from '../lib/sanitize.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateDonationBody(config) {
  return (req, _res, next) => {
    const { campaign_id, amount, message, turnstile_token } = req.body ?? {};

    if (!campaign_id || !UUID_RE.test(campaign_id)) {
      return next(createError(400, 'campaign_id tidak valid.'));
    }

    const parsedAmount = Number(amount);
    if (!Number.isInteger(parsedAmount) || parsedAmount < config.donation.minAmount || parsedAmount > config.donation.maxAmount) {
      return next(createError(400, `Nominal donasi harus antara Rp ${config.donation.minAmount.toLocaleString('id-ID')} dan Rp ${config.donation.maxAmount.toLocaleString('id-ID')}.`));
    }

    if (message !== undefined && message !== null) {
      if (typeof message !== 'string' || message.length > config.donation.maxMessageLength) {
        return next(createError(400, `Pesan maksimal ${config.donation.maxMessageLength} karakter.`));
      }
    }

    req.validatedDonation = {
      campaign_id,
      amount: parsedAmount,
      message: sanitizeMessage(message),
      turnstile_token: turnstile_token || null,
    };
    next();
  };
}

export function validateCampaignParam(req, _res, next) {
  const { idOrSlug } = req.params;
  if (!idOrSlug) {
    return next(createError(400, 'Parameter campaign diperlukan.'));
  }
  if (UUID_RE.test(idOrSlug)) {
    req.campaignLookup = { type: 'id', value: idOrSlug };
  } else if (SLUG_RE.test(idOrSlug)) {
    req.campaignLookup = { type: 'slug', value: idOrSlug };
  } else {
    return next(createError(400, 'Format campaign tidak valid.'));
  }
  next();
}

export function validatePagination(req, _res, next) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  req.pagination = { page, limit, offset: (page - 1) * limit };
  next();
}

export function validateAdminCampaignBody(req, _res, next) {
  const { title, slug, description, target_amount, category, image_url, status } = req.body ?? {};

  if (!title?.trim() || !slug?.trim() || !description?.trim()) {
    return next(createError(400, 'title, slug, dan description wajib diisi.'));
  }

  if (!SLUG_RE.test(slug)) {
    return next(createError(400, 'Format slug tidak valid.'));
  }

  const target = Number(target_amount);
  if (!Number.isInteger(target) || target <= 0) {
    return next(createError(400, 'target_amount harus bilangan bulat positif.'));
  }

  req.validatedCampaign = {
    title: title.trim(),
    slug: slug.trim(),
    description: description.trim(),
    target_amount: target,
    category: category?.trim() || null,
    image_url: image_url?.trim() || null,
    status: status || 'draft',
  };
  next();
}
