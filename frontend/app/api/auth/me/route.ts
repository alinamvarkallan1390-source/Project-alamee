import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  const email = requireAdmin(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ email });
}

export async function DELETE(req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('alamee_admin', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
