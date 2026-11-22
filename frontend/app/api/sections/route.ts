import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { seedSections } from '@/lib/seed';

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ sections: seedSections });
  const { data, error } = await sb.from('website_sections').select('*').order('sort_order');
  if (error || !data?.length) return NextResponse.json({ sections: seedSections });
  return NextResponse.json({ sections: data });
}

export async function POST(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { data, error } = await sb.from('website_sections').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'create_section', entity: 'website_sections', entity_id: data.id });
  return NextResponse.json({ section: data });
}

export async function PUT(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  if (Array.isArray(body.sections)) {
    for (const s of body.sections) {
      await sb.from('website_sections').update({ sort_order: s.sort_order, updated_at: new Date().toISOString() }).eq('id', s.id);
    }
    await sb.from('audit_logs').insert({ user_email: email, action: 'reorder_sections', entity: 'website_sections' });
    return NextResponse.json({ ok: true });
  }
  const { id, ...rest } = body;
  const { data, error } = await sb.from('website_sections').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'update_section', entity: 'website_sections', entity_id: id });
  return NextResponse.json({ section: data });
}

export async function DELETE(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { error } = await sb.from('website_sections').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sb.from('audit_logs').insert({ user_email: email, action: 'delete_section', entity: 'website_sections', entity_id: id });
  return NextResponse.json({ ok: true });
}
