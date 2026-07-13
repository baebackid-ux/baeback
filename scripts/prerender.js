/**
 * Static prerender script.
 *
 * Run AFTER `vite build` and `vite build --ssr` to produce fully-rendered
 * HTML files for public, SEO-critical routes. The generated files contain
 * the complete <head> (title, meta, JSON-LD) and rendered body markup so
 * crawlers that don't execute JS still see meaningful content.
 *
 * Usage:  node scripts/prerender.js
 */

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class WebSocket {};
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { blogPosts } from '../src/data/blog-posts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DIST_SSR = path.join(ROOT, 'dist-ssr');

const PUBLIC_ROUTES = [
  '/',
  '/barang',
  '/campaign',
  '/need-board',
  '/blog',
  '/login',
  '/register',
];

async function prerender() {
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

  const entryServerFile = path.join(DIST_SSR, 'entry-server.js');
  const { render } = await import(pathToFileURL(entryServerFile).href);

  const routesToRender = [...PUBLIC_ROUTES];
  const routeData = {};

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  let fetchedItems = [];
  let fetchedCampaigns = [];
  let fetchedNeeds = [];

  if (supabaseUrl && supabaseKey) {
    console.log('Fetching dynamic routes from Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      const [
        { data: items },
        { data: campaigns },
        { data: needs }
      ] = await Promise.all([
        supabase
          .from('items')
          .select('*')
          .in('status', ['available', 'reserved'])
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('campaigns')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('need_posts')
          .select('*')
          .in('status', ['open', 'offered'])
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (items) {
        fetchedItems = items;
        for (const item of items) {
          const route = `/barang/${item.id}`;
          routesToRender.push(route);
          routeData[route] = { item };
        }
      }

      if (campaigns) {
        fetchedCampaigns = campaigns;
        for (const campaign of campaigns) {
          const route = `/campaign/${campaign.slug}`;
          routesToRender.push(route);
          routeData[route] = { campaign };
        }
      }

      if (needs) {
        fetchedNeeds = needs;
        for (const need of needs) {
          const route = `/need-board/${need.id}`;
          routesToRender.push(route);
          routeData[route] = { need };
        }
      }
    } catch (err) {
      console.warn('Could not fetch dynamic routes from Supabase, skipping:', err.message);
    }
  } else {
    console.log('Supabase credentials not found. Dynamic detail routes will not be prerendered.');
  }

  // Add static blog pages
  for (const post of blogPosts) {
    const route = `/blog/${post.slug}`;
    routesToRender.push(route);
    routeData[route] = { blogPost: post };
  }

  console.log(`Starting prerendering for ${routesToRender.length} routes...\n`);

  for (const url of routesToRender) {
    const initialData = routeData[url] || {};
    globalThis.__INITIAL_DATA__ = initialData;

    const { html, head } = render(url);

    let page = template;

    let headInjection = '';
    if (head) {
      headInjection += `${head}\n`;
    }
    if (Object.keys(initialData).length > 0) {
      headInjection += `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>\n`;
    }

    if (headInjection) {
      page = page.replace('</head>', `${headInjection}</head>`);
    }

    page = page.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`,
    );

    const filePath =
      url === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, url.slice(1), 'index.html');

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, page, 'utf-8');

    console.log(`  * ${url} -> ${path.relative(ROOT, filePath)}`);
  }

  delete globalThis.__INITIAL_DATA__;

  // Clean up the temporary SSR build directory
  try {
    fs.rmSync(DIST_SSR, { recursive: true, force: true });
    console.log('Cleaned up dist-ssr temporary directory.');
  } catch (err) {
    console.warn('Failed to clean up dist-ssr:', err.message);
  }

  // --- Static Sitemap & Robots.txt Generation ---
  try {
    const SITE_URL = process.env.VITE_SITE_URL || 'https://baeback.pages.dev';
    console.log(`\nGenerating static sitemap.xml for ${SITE_URL}...`);

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

    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/barang', priority: '0.9', changefreq: 'daily' },
      { path: '/campaign', priority: '0.9', changefreq: 'daily' },
      { path: '/need-board', priority: '0.9', changefreq: 'daily' },
      { path: '/blog', priority: '0.8', changefreq: 'daily' },
    ];

    const sitemapEntries = staticPages.map(({ path, priority, changefreq }) =>
      urlEntry(`${SITE_URL}${path}`, null, changefreq, priority)
    );

    for (const item of fetchedItems) {
      sitemapEntries.push(
        urlEntry(
          `${SITE_URL}/barang/${item.id}`,
          formatDate(item.updated_at || item.created_at),
          'weekly',
          '0.8',
        )
      );
    }

    for (const campaign of fetchedCampaigns) {
      sitemapEntries.push(
        urlEntry(
          `${SITE_URL}/campaign/${campaign.slug}`,
          formatDate(campaign.updated_at || campaign.created_at),
          'daily',
          '0.8',
        )
      );
    }

    for (const need of fetchedNeeds) {
      sitemapEntries.push(
        urlEntry(
          `${SITE_URL}/need-board/${need.id}`,
          formatDate(need.updated_at || need.created_at),
          'weekly',
          '0.7',
        )
      );
    }

    for (const post of blogPosts) {
      sitemapEntries.push(
        urlEntry(
          `${SITE_URL}/blog/${post.slug}`,
          formatDate(post.date),
          'weekly',
          '0.7',
        )
      );
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...sitemapEntries,
      '</urlset>',
    ].join('\n');

    const sitemapPath = path.join(DIST, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf-8');
    console.log(`  * Generated: ${path.relative(ROOT, sitemapPath)}`);

    // Dynamic Robots.txt
    const robotsSrcPath = path.join(ROOT, 'public', 'robots.txt');
    let robotsContent = '';
    if (fs.existsSync(robotsSrcPath)) {
      robotsContent = fs.readFileSync(robotsSrcPath, 'utf-8');
      robotsContent = robotsContent.replace(
        /Sitemap:\s*https?:\/\/[^\s]+/i,
        `Sitemap: ${SITE_URL}/sitemap.xml`
      );
    } else {
      robotsContent = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml`;
    }
    const robotsDestPath = path.join(DIST, 'robots.txt');
    fs.writeFileSync(robotsDestPath, robotsContent, 'utf-8');
    console.log(`  * Generated: ${path.relative(ROOT, robotsDestPath)}`);

  } catch (sitemapErr) {
    console.warn('Failed to generate sitemap.xml / robots.txt:', sitemapErr.message);
  }

  console.log(`\nPrerendered ${routesToRender.length} routes successfully.`);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
