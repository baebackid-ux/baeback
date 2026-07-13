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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DIST_SSR = path.join(ROOT, 'dist-ssr');

const PUBLIC_ROUTES = [
  '/',
  '/barang',
  '/campaign',
  '/need-board',
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
        for (const item of items) {
          const route = `/barang/${item.id}`;
          routesToRender.push(route);
          routeData[route] = { item };
        }
      }

      if (campaigns) {
        for (const campaign of campaigns) {
          const route = `/campaign/${campaign.slug}`;
          routesToRender.push(route);
          routeData[route] = { campaign };
        }
      }

      if (needs) {
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

  console.log(`\nPrerendered ${routesToRender.length} routes successfully.`);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
