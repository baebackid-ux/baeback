import { createClient } from '@supabase/supabase-js';

const SITE_URL = process.env.VITE_SITE_URL || 'https://baeback.app';

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, lastmod, changefreq = 'weekly', priority = '0.7') {
  const parts = [`  <url>`, `    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  parts.push(`    <changefreq>${changefreq}</changefreq>`);
  parts.push(`    <priority>${priority}</priority>`, `  </url>`);
  return parts.join('\n');
}

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toISOString().split('T')[0];
}

export default async function handler(_req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/barang', priority: '0.9', changefreq: 'daily' },
    { path: '/campaign', priority: '0.9', changefreq: 'daily' },
    { path: '/need-board', priority: '0.9', changefreq: 'daily' },
  ];

  const entries = staticPages.map(({ path, priority, changefreq }) =>
    urlEntry(`${SITE_URL}${path}`, null, changefreq, priority),
  );

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [{ data: items }, { data: campaigns }, { data: needs }] = await Promise.all([
      supabase
        .from('items')
        .select('id, updated_at, created_at')
        .in('status', ['available', 'reserved'])
        .order('created_at', { ascending: false })
        .limit(500),
      supabase
        .from('campaigns')
        .select('slug, updated_at, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('need_posts')
        .select('id, updated_at, created_at')
        .in('status', ['open', 'offered'])
        .order('created_at', { ascending: false })
        .limit(200),
    ]);

    for (const item of items || []) {
      entries.push(
        urlEntry(
          `${SITE_URL}/barang/${item.id}`,
          formatDate(item.updated_at || item.created_at),
          'weekly',
          '0.8',
        ),
      );
    }

    for (const campaign of campaigns || []) {
      entries.push(
        urlEntry(
          `${SITE_URL}/campaign/${campaign.slug}`,
          formatDate(campaign.updated_at || campaign.created_at),
          'daily',
          '0.8',
        ),
      );
    }

    for (const need of needs || []) {
      entries.push(
        urlEntry(
          `${SITE_URL}/need-board/${need.id}`,
          formatDate(need.updated_at || need.created_at),
          'weekly',
          '0.7',
        ),
      );
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
