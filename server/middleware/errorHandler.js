import { getLogger } from '../lib/logger.js';

const PUBLIC_MESSAGES = new Set([
  'Token autentikasi diperlukan.',
  'Token tidak valid atau sudah kedaluwarsa.',
  'Campaign tidak ditemukan.',
  'Campaign tidak tersedia.',
  'Campaign sudah tidak menerima donasi.',
  'Campaign sudah berakhir.',
  'Profil pengguna tidak ditemukan.',
  'Campaign tidak menerima donasi saat ini.',
  'Gagal memuat daftar campaign.',
  'Gagal memuat riwayat donasi.',
  'campaign_id tidak valid.',
  'Parameter campaign diperlukan.',
  'Format campaign tidak valid.',
  'Header Idempotency-Key (UUID) wajib untuk donasi.',
  'Akses ditolak.',
  'Layanan sementara tidak tersedia. Coba lagi nanti.',
  'Terlalu banyak donasi hari ini. Coba lagi besok.',
  'Terlalu banyak donasi ke campaign ini. Coba lagi nanti.',
  'Donasi identik baru saja dicatat. Tunggu sebentar.',
  'Verifikasi captcha gagal.',
  'Endpoint tidak ditemukan.',
]);

function isPublicMessage(msg) {
  if (!msg) return false;
  if (PUBLIC_MESSAGES.has(msg)) return true;
  if (msg.startsWith('Nominal donasi harus antara')) return true;
  if (msg.startsWith('Pesan maksimal')) return true;
  return false;
}

export function errorHandler(err, req, res, _next) {
  const logger = getLogger();
  logger.error({
    requestId: req.requestId,
    err: err.message,
    stack: err.stack,
    status: err.status,
  });

  if (err.status && isPublicMessage(err.message)) {
    return res.status(err.status).json({ error: err.message, requestId: req.requestId });
  }

  if (err.status) {
    return res.status(err.status).json({
      error: 'Terjadi kesalahan, coba lagi nanti.',
      requestId: req.requestId,
    });
  }

  res.status(500).json({
    error: 'Terjadi kesalahan, coba lagi nanti.',
    requestId: req.requestId,
  });
}

export function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
