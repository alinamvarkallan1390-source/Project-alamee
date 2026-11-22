import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { seedServices } from '@/lib/seed';

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ services: seedServices });
  const { data, error } = await sb.from('services').select('*').order('sort_order');
  if (error || !data?.length) return NextResponse.json({ services: seedServices });
  return NextResponse.json({ services: data });
}

export async function POST(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { data, error } = await sb.from('services').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'create_service', entity: 'services', entity_id: data.id });
  return NextResponse.json({ service: data });
}

export async function PUT(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { id, ...rest } = body;
  const { data, error } = await sb.from('services').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'update_service', entity: 'services', entity_id: id });
  return NextResponse.json({ service: data });
}

export async function DELETE(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { error } = await sb.from('services').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'delete_service', entity: 'services', entity_id: id });
  return NextResponse.json({ ok: true });
}
