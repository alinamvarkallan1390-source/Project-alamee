import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { seedSettings } from '@/lib/seed';

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ settings: seedSettings });
  const { data, error } = await sb.from('website_settings').select('*');
  if (error) return NextResponse.json({ settings: seedSettings });
  const settings: Record<string, string> = { ...seedSettings };
  (data || []).forEach((r: any) => { settings[r.key] = r.value ?? ''; });
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const entries = Object.entries(body.settings || body).filter(([k]) => typeof k === 'string');
  for (const [key, value] of entries) {
    await sb.from('website_settings').upsert({ key, value: String(value ?? ''), updated_at: new Date().toISOString() }, { onConflict: 'key' });
  }
  await sb.from('audit_logs').insert({ user_email: email, action: 'update_settings', entity: 'website_settings', details: JSON.stringify(Object.keys(body.settings || body)) });
  return NextResponse.json({ ok: true });
}
