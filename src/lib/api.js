import { supabase, isSupabaseConfigured } from './supabase';

export async function checkApiHealth() {
  return isSupabaseConfigured;
}
