import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function getSupabase() {
  if (!url || !anon) return null;
  return createClient(url, anon);
}

export function getSupabaseAdmin() {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
