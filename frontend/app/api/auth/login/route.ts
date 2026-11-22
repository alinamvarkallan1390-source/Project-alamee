import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const { data } = await sb.from('admin_users').select('*').eq('email', email).single();
  if (!data || data.password_hash !== hashPassword(password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = signToken(email);
  const res = NextResponse.json({ ok: true, email, role: data.role });
  res.cookies.set('alamee_admin', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 12, sameSite: 'lax' });
  await sb.from('audit_logs').insert({ user_email: email, action: 'login', entity: 'auth' });
  return res;
}
