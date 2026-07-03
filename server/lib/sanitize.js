export function sanitizeMessage(text) {
  if (!text) return null;
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"&]/g, '')
    .trim()
    .slice(0, 500) || null;
}
