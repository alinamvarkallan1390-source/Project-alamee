'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@alamee.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/admin');
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-graphite px-6">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-10">
        <p className="text-center text-xs tracking-[0.4em] text-champagne uppercase">ALAMEE Admin</p>
        <h1 className="mt-3 text-center font-serif text-3xl">Secure Sign In</h1>
        <div className="mt-8 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={loading} className="w-full rounded-full bg-champagne py-3 font-semibold text-graphite disabled:opacity-50">{loading ? 'Signing in…' : 'Sign In'}</button>
          <p className="text-center text-xs text-ivory/50">Default: admin@alamee.com / Admin@2026!</p>
          <a href="/" className="block text-center text-sm text-champagne">← Back to website</a>
        </div>
      </form>
    </div>
  );
}
