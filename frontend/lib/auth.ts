import crypto from 'crypto';

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function signToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url');
  const secret = process.env.ADMIN_JWT_SECRET || 'alamee-admin-secret-change-me';
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token: string | undefined | null): string | null {
  if (!token) return null;
  try {
    const [payload, sig] = token.split('.');
    const secret = process.env.ADMIN_JWT_SECRET || 'alamee-admin-secret-change-me';
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    if (sig !== expected) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (data.exp < Date.now()) return null;
    return data.email as string;
  } catch { return null; }
}

export function requireAdmin(req: Request): string | null {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/alamee_admin=([^;]+)/);
  return verifyToken(match?.[1]);
}
