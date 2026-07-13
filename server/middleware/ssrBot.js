import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cacheGet, cacheSet } from '../lib/cache/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOT_UA = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|applebot|petalbot|semrushbot|ahrefsbot|mj12bot/i;

let template = null;
let render = null;

function loadSSR() {
  if (template) return true;

  const distDir = path.resolve(__dirname, '../../dist');
  const ssrDir = path.resolve(__dirname, '../../dist-ssr');
  const templatePath = path.join(distDir, 'index.html');
  const entryPath = path.join(ssrDir, 'entry-server.js');

  if (!fs.existsSync(templatePath) || !fs.existsSync(entryPath)) {
    return false;
  }

  template = fs.readFileSync(templatePath, 'utf-8');

  return import(entryPath).then((mod) => {
    render = mod.render;
    return true;
  }).catch(() => false);
}

export function ssrBotMiddleware() {
  let ready = null;

  return async (req, res, next) => {
    if (req.path.startsWith('/api')) return next();

    const ua = req.headers['user-agent'] || '';
    if (!BOT_UA.test(ua)) return next();

    if (!ready) {
      ready = loadSSR();
    }

    const ok = await ready;
    if (!ok || !render) return next();

    const cacheKey = `ssr_bot:${req.originalUrl}`;
    try {
      const cachedPage = await cacheGet(cacheKey);
      if (cachedPage) {
        return res.status(200).set({ 'Content-Type': 'text/html' }).send(cachedPage);
      }
    } catch (cacheErr) {
      console.warn('SSR cache get failed:', cacheErr.message);
    }

    try {
      const { html, head } = render(req.originalUrl);

      let page = template;
      if (head) {
        page = page.replace('</head>', `${head}\n</head>`);
      }
      page = page.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`,
      );

      try {
        await cacheSet(cacheKey, page, 3600); // cache for 1 hour
      } catch (cacheErr) {
        console.warn('SSR cache set failed:', cacheErr.message);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).send(page);
    } catch (err) {
      console.error('SSR render error:', err.message);
      next();
    }
  };
}
