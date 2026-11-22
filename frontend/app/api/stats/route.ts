import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ stats: { projects: 0, messages: 0, unread: 0, media: 0, models: 0, services: 0 } });
  const [projects, messages, media, models, services, logs] = await Promise.all([
    sb.from('projects').select('id', { count: 'exact', head: true }),
    sb.from('contact_messages').select('id, is_read', { count: 'exact' }),
    sb.from('media_files').select('id', { count: 'exact', head: true }),
    sb.from('three_d_models').select('id', { count: 'exact', head: true }),
    sb.from('services').select('id', { count: 'exact', head: true }),
    sb.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20)
  ]);
  const msgs = messages.data || [];
  return NextResponse.json({
    stats: {
      projects: projects.count || 0, messages: messages.count || 0,
      unread: msgs.filter((m: any) => !m.is_read).length,
      media: media.count || 0, models: models.count || 0, services: services.count || 0
    },
    recentLogs: logs.data || []
  });
}
