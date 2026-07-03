import { createError } from '../middleware/errorHandler.js';

export async function verifyTurnstile(config, token, ip) {
  if (!config.turnstileSecretKey) {
    return true;
  }

  if (!token) {
    throw createError(400, 'Verifikasi captcha gagal.');
  }

  const body = new URLSearchParams({
    secret: config.turnstileSecretKey,
    response: token,
    remoteip: ip || '',
  });

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const result = await response.json();
  if (!result.success) {
    throw createError(400, 'Verifikasi captcha gagal.');
  }

  return true;
}
