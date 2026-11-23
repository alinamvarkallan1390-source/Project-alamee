import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { seedProjects } from '@/lib/seed';

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ projects: seedProjects });
  const { data, error } = await sb.from('projects').select('*, project_images(*)').order('sort_order');
  if (error || !data?.length) return NextResponse.json({ projects: seedProjects });
  return NextResponse.json({ projects: data });
}

export async function POST(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const slug = body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const { data, error } = await sb.from('projects').insert({ ...body, slug, updated_at: new Date().toISOString() }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'create_project', entity: 'projects', entity_id: data.id, details: data.title });
  return NextResponse.json({ project: data });
}

export async function PUT(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { id, ...rest } = body;
  const { data, error } = await sb.from('projects').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'update_project', entity: 'projects', entity_id: id, details: data.title });
  return NextResponse.json({ project: data });
}

export async function DELETE(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { error } = await sb.from('projects').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'delete_project', entity: 'projects', entity_id: id });
  return NextResponse.json({ ok: true });
}
