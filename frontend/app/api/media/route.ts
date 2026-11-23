import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ media: [] });
  const { data } = await sb.from('media_files').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ media: data || [] });
}

export async function POST(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  // Support base64 upload (max ~4MB inline) or direct URL registration
  let url = body.url;
  if (body.data_base64 && body.file_name) {
    const buf = Buffer.from(body.data_base64, 'base64');
    const path = `${Date.now()}-${body.file_name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { error: upErr } = await sb.storage.from('media').upload(path, buf, { contentType: body.file_type || 'application/octet-stream', upsert: true });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });
    const { data: pub } = sb.storage.from('media').getPublicUrl(path);
    url = pub.publicUrl;
  }
  if (!url) return NextResponse.json({ error: 'url or data_base64 required' }, { status: 400 });
  const { data, error } = await sb.from('media_files').insert({
    url, file_name: body.file_name || url.split('/').pop(), file_type: body.file_type || '',
    file_size: body.file_size || 0, caption: body.caption || '', alt_text: body.alt_text || ''
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'upload_media', entity: 'media_files', entity_id: data.id });
  return NextResponse.json({ media: data });
}

export async function PUT(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, caption, alt_text, url } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { data, error } = await sb.from('media_files').update({ caption, alt_text, url }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ media: data });
}

export async function DELETE(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  await sb.from('media_files').delete().eq('id', id);
  await sb.from('audit_logs').insert({ user_email: email, action: 'delete_media', entity: 'media_files', entity_id: id });
  return NextResponse.json({ ok: true });
}
