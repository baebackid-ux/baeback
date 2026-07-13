import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.log('=== CEK ENV SAAT BUILD ===');
  console.log('Dari .env file (loadEnv):', Object.keys(env).filter(k => k.startsWith('VITE_')));
  console.log('Dari process.env (Cloudflare):', Object.keys(process.env).filter(k => k.startsWith('VITE_')));
  console.log('==========================');

  return {
    plugins: [react()],
    ssr: {
      noExternal: ['lenis'],
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
    },
  };
});
