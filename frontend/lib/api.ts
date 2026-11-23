import { seedProjects, seedServices, seedSections, seedSettings } from './seed';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchJSON(path: string, init?: RequestInit) {
  const base = API_BASE ? `${API_BASE}${path}` : path;
  const res = await fetch(base, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function getSettings(): Promise<Record<string, string>> {
  try { const d = await fetchJSON('/api/settings'); return { ...seedSettings, ...(d.settings || d) }; }
  catch { return seedSettings; }
}
const sampleImages: Record<string, string> = { 'villa-lumiere': '/images/editorial-architecture.jpg', 'crown-hotel': '/images/interior-editorial.jpg' };

export async function getProjects(): Promise<any[]> {
  try { const d = await fetchJSON('/api/projects'); return (d.projects || d).filter((p: any) => p.is_published !== false).map((p: any) => sampleImages[p.slug] && (!p.cover_image || ['/images/3d-facade.png', '/images/hero-3d.png', '/images/3d-process.png'].includes(p.cover_image)) ? { ...p, cover_image: sampleImages[p.slug] } : p); }
  catch { return seedProjects; }
}
export async function getServices(): Promise<any[]> {
  try { const d = await fetchJSON('/api/services'); return (d.services || d).filter((s: any) => s.is_published !== false); }
  catch { return seedServices; }
}
export async function getSections(): Promise<any[]> {
  try { const d = await fetchJSON('/api/sections'); return (d.sections || d).filter((s: any) => s.enabled !== false); }
  catch { return seedSections; }
}
export async function submitContact(payload: any) {
  return fetchJSON('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
}
export async function adminLogin(email: string, password: string) {
  return fetchJSON('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}
export async function adminFetch(path: string, init?: RequestInit) {
  return fetchJSON(path, init);
}
