import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ seo: [] });
  const { data } = await sb.from('seo_settings').select('*');
  return NextResponse.json({ seo: data || [] });
}

export async function PUT(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { data, error } = await sb.from('seo_settings').upsert({ ...body, updated_at: new Date().toISOString() }, { onConflict: 'page' }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'update_seo', entity: 'seo_settings', details: body.page });
  return NextResponse.json({ seo: data });
}
