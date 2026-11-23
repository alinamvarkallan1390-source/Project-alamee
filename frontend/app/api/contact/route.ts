import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name || !body.email || !body.message) return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Contact service is not configured' }, { status: 503 });
  const { data, error } = await sb.from('contact_messages').insert({
    name: String(body.name).slice(0, 200), email: String(body.email).slice(0, 200),
    phone: String(body.phone || '').slice(0, 50), subject: String(body.subject || '').slice(0, 200),
    message: String(body.message).slice(0, 5000)
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, message: data });
}

export async function GET(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ messages: [] });
  const { data } = await sb.from('contact_messages').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ messages: data || [] });
}

export async function PATCH(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, is_read } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  await sb.from('contact_messages').update({ is_read }).eq('id', id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  await sb.from('contact_messages').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
