import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ models: [] });
  const { data } = await sb.from('three_d_models').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ models: data || [] });
}

export async function POST(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  let url = body.url;
  if (body.data_base64 && body.file_name) {
    const buf = Buffer.from(body.data_base64, 'base64');
    const path = `${Date.now()}-${body.file_name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { error: upErr } = await sb.storage.from('models').upload(path, buf, { contentType: 'model/gltf-binary', upsert: true });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });
    const { data: pub } = sb.storage.from('models').getPublicUrl(path);
    url = pub.publicUrl;
  }
  if (!url) return NextResponse.json({ error: 'url or data_base64 required' }, { status: 400 });
  if (body.is_main) await sb.from('three_d_models').update({ is_main: false }).eq('is_main', true);
  const { data, error } = await sb.from('three_d_models').insert({
    name: body.name || 'Model', url, is_main: !!body.is_main,
    scale: body.scale ?? 1, position_x: body.position_x ?? 0, position_y: body.position_y ?? 0, position_z: body.position_z ?? 0,
    rotation_speed: body.rotation_speed ?? 0.3
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'upload_model', entity: 'three_d_models', entity_id: data.id });
  return NextResponse.json({ model: data });
}

export async function PUT(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { id, ...rest } = body;
  if (rest.is_main) await sb.from('three_d_models').update({ is_main: false }).eq('is_main', true);
  const { data, error } = await sb.from('three_d_models').update(rest).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ model: data });
}

export async function DELETE(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  await sb.from('three_d_models').delete().eq('id', id);
  await sb.from('audit_logs').insert({ user_email: email, action: 'delete_model', entity: 'three_d_models', entity_id: id });
  return NextResponse.json({ ok: true });
}
