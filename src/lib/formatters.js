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
