import { itemStatus, needStatus, postTypes, requestStatus } from './constants';

export function formatDate(value) {
  if (!value) return 'Belum tersedia';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatLocation(value) {
  return value || 'Lokasi belum diatur';
}

export function getItemStatusLabel(status) {
  return itemStatus[status] || status || 'Tersedia';
}

export function getRequestStatusLabel(status) {
  return requestStatus[status] || status || 'Diajukan';
}

export function getNeedStatusLabel(status) {
  return needStatus[status] || status || 'Masih Dibutuhkan';
}

export function getPostTypeLabel(type) {
  return postTypes[type] || 'Community Post';
}

export function summarizeText(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function formatCurrency(amount) {
  if (amount == null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCampaignProgress(collected, target) {
  if (!target) return 0;
  return Math.min(100, Math.round((collected / target) * 100));
}

export function getOptimizedImageUrl(url, width = 600) {
  if (!url) return '';
  // If it is a local asset, SVG, or data URL, do not proxy
  if (url.startsWith('/') || url.startsWith('data:') || url.includes('.svg') || url.startsWith('blob:')) {
    return url;
  }
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp`;
}
