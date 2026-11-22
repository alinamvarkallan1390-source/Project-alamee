import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

async function snapshot(sb: any) {
  const [settings, sections, projects, services, seo] = await Promise.all([
    sb.from('website_settings').select('*'),
    sb.from('website_sections').select('*'),
    sb.from('projects').select('*'),
    sb.from('services').select('*'),
    sb.from('seo_settings').select('*')
  ]);
  return { settings: settings.data, sections: sections.data, projects: projects.data, services: services.data, seo: seo.data };
}

export async function GET(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ versions: [] });
  const { data } = await sb.from('content_versions').select('id, label, created_by, created_at').order('created_at', { ascending: false }).limit(30);
  return NextResponse.json({ versions: data || [] });
}

export async function POST(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  if (body.action === 'rollback' && body.id) {
    const { data: v } = await sb.from('content_versions').select('*').eq('id', body.id).single();
    if (!v) return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    const snap = v.snapshot;
    for (const s of snap.settings || []) await sb.from('website_settings').upsert({ key: s.key, value: s.value, category: s.category }, { onConflict: 'key' });
    for (const s of snap.sections || []) await sb.from('website_sections').upsert({ id: s.id, key: s.key, title: s.title, subtitle: s.subtitle, content: s.content, enabled: s.enabled, sort_order: s.sort_order }, { onConflict: 'key' });
    for (const p of snap.projects || []) await sb.from('projects').upsert({ id: p.id, title: p.title, slug: p.slug, description: p.description, location: p.location, category: p.category, status: p.status, completion_date: p.completion_date, area_sqm: p.area_sqm, floors: p.floors, units: p.units, cover_image: p.cover_image, is_published: p.is_published, sort_order: p.sort_order }, { onConflict: 'id' });
    for (const s of snap.services || []) await sb.from('services').upsert({ id: s.id, title: s.title, description: s.description, icon: s.icon, sort_order: s.sort_order, is_published: s.is_published }, { onConflict: 'id' });
    for (const s of snap.seo || []) await sb.from('seo_settings').upsert({ page: s.page, title: s.title, description: s.description, keywords: s.keywords, og_image: s.og_image }, { onConflict: 'page' });
    await sb.from('audit_logs').insert({ user_email: email, action: 'rollback_version', entity: 'content_versions', entity_id: body.id });
    return NextResponse.json({ ok: true, rolledBack: body.id });
  }
  const snap = await snapshot(sb);
  const { data, error } = await sb.from('content_versions').insert({ label: body.label || `Publish ${new Date().toISOString()}`, snapshot: snap, created_by: email }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'publish_version', entity: 'content_versions', entity_id: data.id });
  return NextResponse.json({ version: data });
}

export async function DELETE(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  await sb.from('content_versions').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
