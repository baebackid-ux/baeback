import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Kredensial Supabase tidak ditemukan! Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY telah diatur di environment variable.'
  );
}

// Selalu aktifkan mode Supabase untuk production ready (menonaktifkan mode demo)
export const isSupabaseConfigured = true;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export function requireSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
  }

  return supabase;
}
