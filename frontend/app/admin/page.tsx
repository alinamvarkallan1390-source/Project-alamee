'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'overview' | 'projects' | 'services' | 'sections' | 'settings' | 'media' | 'models' | 'messages' | 'seo' | 'versions';

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: any; onChange: (v: any) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs tracking-widest text-ivory/50 uppercase">{label}</span>
      <input type={type} value={value ?? ''} onChange={(e) => onChange(type === 'number' || type === 'checkbox' ? e.target.value : e.target.value)} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-2.5 text-sm" />
    </label>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [media, setMedia] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [seo, setSeo] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [editProject, setEditProject] = useState<any>(null);
  const [editService, setEditService] = useState<any>(null);
  const [editSection, setEditSection] = useState<any>(null);
  const [editSeo, setEditSeo] = useState<any>(null);

  const loadAll = async () => {
    try {
      const [s, p, sv, sec, set, m, mo, ms, se, v] = await Promise.all([
        api('/api/stats'), api('/api/projects'), api('/api/services'), api('/api/sections'),
        api('/api/settings'), api('/api/media'), api('/api/models'), api('/api/contact'),
        api('/api/seo'), api('/api/versions')
      ]);
      setStats(s.stats); setLogs(s.recentLogs || []);
      setProjects(p.projects || []); setServices(sv.services || []); setSections(sec.sections || []);
      setSettings(set.settings || {}); setMedia(m.media || []); setModels(mo.models || []);
      setMessages(ms.messages || []); setSeo(se.seo || []); setVersions(v.versions || []);
    } catch (e: any) {
      if (e.message.includes('401')) router.push('/admin/login');
    }
  };

  useEffect(() => {
    fetch('/api/auth/me').then((r) => { if (!r.ok) router.push('/admin/login'); else { setAuthed(true); loadAll(); } });
  }, []);

  const notify = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };
  const confirmDo = async (label: string, fn: () => Promise<void>) => {
    if (!window.confirm(`${label}? This cannot be undone.`)) return;
    try { await fn(); notify('Done.'); loadAll(); } catch (e: any) { notify(e.message); }
  };

  const logout = async () => { await fetch('/api/auth/me', { method: 'DELETE' }); router.push('/admin/login'); };

  if (!authed) return <div className="flex min-h-screen items-center justify-center bg-graphite">Loading…</div>;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' }, { id: 'projects', label: 'Projects' }, { id: 'services', label: 'Services' },
    { id: 'sections', label: 'Sections' }, { id: 'settings', label: 'Settings & 3D' }, { id: 'media', label: 'Media' },
    { id: 'models', label: '3D Models' }, { id: 'messages', label: 'Messages' }, { id: 'seo', label: 'SEO' }, { id: 'versions', label: 'Publish & Versions' }
  ];

  return (
    <div className="min-h-screen bg-graphite text-ivory">
      <header className="sticky top-0 z-40 border-b border-ivory/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p className="tracking-[0.3em] font-semibold">ALAMEE <span className="text-champagne">ADMIN</span></p>
          <div className="flex items-center gap-3 text-sm">
            <a href="/" className="rounded-full border border-ivory/20 px-4 py-1.5 hover:border-champagne hover:text-champagne">View Site</a>
            <button onClick={logout} className="rounded-full bg-champagne px-4 py-1.5 font-semibold text-graphite">Logout</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${tab === t.id ? 'bg-champagne text-graphite font-semibold' : 'border border-ivory/15 text-ivory/70 hover:border-champagne'}`}>{t.label}</button>
          ))}
        </nav>
      </header>

      {msg && <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-champagne px-5 py-3 font-semibold text-graphite shadow-xl">{msg}</div>}

      <main className="mx-auto max-w-7xl px-5 py-8">
        {tab === 'overview' && (
          <div>
            <h1 className="font-serif text-3xl">Dashboard</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { l: 'Projects', v: stats.projects ?? 0 }, { l: 'Messages', v: stats.messages ?? 0 },
                { l: 'Unread', v: stats.unread ?? 0 }, { l: 'Media Files', v: stats.media ?? 0 },
                { l: '3D Models', v: stats.models ?? 0 }, { l: 'Services', v: stats.services ?? 0 }
              ].map((s) => (
                <div key={s.l} className="glass rounded-2xl p-6"><p className="font-serif text-4xl gold-text">{s.v}</p><p className="mt-1 text-xs tracking-widest text-ivory/60 uppercase">{s.l}</p></div>
              ))}
            </div>
            <div className="glass mt-8 rounded-2xl p-6">
              <h2 className="font-serif text-xl">Recent Activity</h2>
              <ul className="mt-4 space-y-2 text-sm text-ivory/70">
                {logs.map((l) => <li key={l.id} className="flex justify-between border-b border-ivory/5 pb-2"><span>{l.action} · {l.entity || ''}</span><span className="text-ivory/40">{new Date(l.created_at).toLocaleString()}</span></li>)}
                {!logs.length && <li>No activity yet.</li>}
              </ul>
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <div>
            <div className="flex items-center justify-between"><h1 className="font-serif text-3xl">Projects</h1>
              <button onClick={() => setEditProject({ title: '', slug: '', description: '', location: '', category: 'Residential', status: 'Planned', completion_date: '', area_sqm: '', floors: '', units: '', cover_image: '', is_published: true, sort_order: projects.length + 1 })} className="rounded-full bg-champagne px-5 py-2 font-semibold text-graphite">+ New Project</button></div>
            <div className="mt-6 space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover_image} alt={p.title} className="h-16 w-24 rounded-xl object-cover" />
                  <div className="min-w-[200px] flex-1"><p className="font-serif text-lg">{p.title}</p><p className="text-xs text-ivory/50">{p.location} · {p.category} · {p.status} · {p.is_published ? 'Published' : 'Draft'}</p></div>
                  <button onClick={() => setEditProject(p)} className="rounded-full border border-champagne/50 px-4 py-1.5 text-sm text-champagne">Edit</button>
                  <button onClick={() => confirmDo('Delete project', async () => { await api('/api/projects', { method: 'DELETE', body: JSON.stringify({ id: p.id }) }); })} className="rounded-full border border-red-500/50 px-4 py-1.5 text-sm text-red-400">Delete</button>
                </div>
              ))}
            </div>
            {editProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-8">
                  <h2 className="font-serif text-2xl">{editProject.id ? 'Edit Project' : 'New Project'}</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Title" value={editProject.title} onChange={(v) => setEditProject({ ...editProject, title: v })} />
                    <Field label="Slug" value={editProject.slug} onChange={(v) => setEditProject({ ...editProject, slug: v })} />
                    <Field label="Location" value={editProject.location} onChange={(v) => setEditProject({ ...editProject, location: v })} />
                    <Field label="Category" value={editProject.category} onChange={(v) => setEditProject({ ...editProject, category: v })} />
                    <Field label="Status" value={editProject.status} onChange={(v) => setEditProject({ ...editProject, status: v })} />
                    <Field label="Completion Date" type="date" value={editProject.completion_date} onChange={(v) => setEditProject({ ...editProject, completion_date: v })} />
                    <Field label="Area (sqm)" type="number" value={editProject.area_sqm} onChange={(v) => setEditProject({ ...editProject, area_sqm: Number(v) })} />
                    <Field label="Floors" type="number" value={editProject.floors} onChange={(v) => setEditProject({ ...editProject, floors: Number(v) })} />
                    <Field label="Units" type="number" value={editProject.units} onChange={(v) => setEditProject({ ...editProject, units: Number(v) })} />
                    <Field label="Sort Order" type="number" value={editProject.sort_order} onChange={(v) => setEditProject({ ...editProject, sort_order: Number(v) })} />
                  </div>
                  <div className="mt-4 space-y-4">
                    <Field label="Cover Image URL" value={editProject.cover_image} onChange={(v) => setEditProject({ ...editProject, cover_image: v })} />
                    <label className="block"><span className="mb-1 block text-xs tracking-widest text-ivory/50 uppercase">Description</span>
                      <textarea rows={4} value={editProject.description || ''} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-2.5 text-sm" /></label>
                    <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={!!editProject.is_published} onChange={(e) => setEditProject({ ...editProject, is_published: e.target.checked })} /> Published</label>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={async () => { try { if (editProject.id) await api('/api/projects', { method: 'PUT', body: JSON.stringify(editProject) }); else await api('/api/projects', { method: 'POST', body: JSON.stringify(editProject) }); setEditProject(null); notify('Saved.'); loadAll(); } catch (e: any) { notify(e.message); } }} className="rounded-full bg-champagne px-6 py-2 font-semibold text-graphite">Save</button>
                    <button onClick={() => setEditProject(null)} className="rounded-full border border-ivory/20 px-6 py-2">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'services' && (
          <div>
            <div className="flex items-center justify-between"><h1 className="font-serif text-3xl">Services</h1>
              <button onClick={() => setEditService({ title: '', description: '', icon: '', sort_order: services.length + 1, is_published: true })} className="rounded-full bg-champagne px-5 py-2 font-semibold text-graphite">+ New Service</button></div>
            <div className="mt-6 space-y-3">
              {services.map((s) => (
                <div key={s.id} className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
                  <div className="min-w-[200px] flex-1"><p className="font-serif text-lg">{s.title}</p><p className="text-xs text-ivory/50">{s.description}</p></div>
                  <button onClick={() => setEditService(s)} className="rounded-full border border-champagne/50 px-4 py-1.5 text-sm text-champagne">Edit</button>
                  <button onClick={() => confirmDo('Delete service', async () => { await api('/api/services', { method: 'DELETE', body: JSON.stringify({ id: s.id }) }); })} className="rounded-full border border-red-500/50 px-4 py-1.5 text-sm text-red-400">Delete</button>
                </div>
              ))}
            </div>
            {editService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="glass w-full max-w-xl rounded-3xl p-8">
                  <h2 className="font-serif text-2xl">{editService.id ? 'Edit Service' : 'New Service'}</h2>
                  <div className="mt-6 space-y-4">
                    <Field label="Title" value={editService.title} onChange={(v) => setEditService({ ...editService, title: v })} />
                    <Field label="Icon" value={editService.icon} onChange={(v) => setEditService({ ...editService, icon: v })} />
                    <label className="block"><span className="mb-1 block text-xs tracking-widest text-ivory/50 uppercase">Description</span>
                      <textarea rows={3} value={editService.description || ''} onChange={(e) => setEditService({ ...editService, description: e.target.value })} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-2.5 text-sm" /></label>
                    <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={!!editService.is_published} onChange={(e) => setEditService({ ...editService, is_published: e.target.checked })} /> Published</label>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={async () => { try { if (editService.id) await api('/api/services', { method: 'PUT', body: JSON.stringify(editService) }); else await api('/api/services', { method: 'POST', body: JSON.stringify(editService) }); setEditService(null); notify('Saved.'); loadAll(); } catch (e: any) { notify(e.message); } }} className="rounded-full bg-champagne px-6 py-2 font-semibold text-graphite">Save</button>
                    <button onClick={() => setEditService(null)} className="rounded-full border border-ivory/20 px-6 py-2">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'sections' && (
          <div>
            <h1 className="font-serif text-3xl">Website Sections</h1>
            <p className="mt-2 text-sm text-ivory/60">Edit every heading and paragraph. Enable or disable sections. Reorder with ↑ ↓.</p>
            <div className="mt-6 space-y-3">
              {sections.map((s, i) => (
                <div key={s.id} className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
                  <div className="min-w-[220px] flex-1"><p className="font-serif text-lg">{s.title}</p><p className="text-xs text-ivory/50">{s.key} · {s.enabled ? 'Enabled' : 'Disabled'}</p></div>
                  <button onClick={async () => { const arr = [...sections]; [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]; await api('/api/sections', { method: 'PUT', body: JSON.stringify({ sections: arr.map((x, idx) => ({ id: x.id, sort_order: idx + 1 })) }) }); loadAll(); }} disabled={i === 0} className="rounded-full border border-ivory/20 px-3 py-1.5 text-sm disabled:opacity-30">↑</button>
                  <button onClick={async () => { const arr = [...sections]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; await api('/api/sections', { method: 'PUT', body: JSON.stringify({ sections: arr.map((x, idx) => ({ id: x.id, sort_order: idx + 1 })) }) }); loadAll(); }} disabled={i === sections.length - 1} className="rounded-full border border-ivory/20 px-3 py-1.5 text-sm disabled:opacity-30">↓</button>
                  <button onClick={() => setEditSection(s)} className="rounded-full border border-champagne/50 px-4 py-1.5 text-sm text-champagne">Edit</button>
                  <button onClick={() => confirmDo('Delete section', async () => { await api('/api/sections', { method: 'DELETE', body: JSON.stringify({ id: s.id }) }); })} className="rounded-full border border-red-500/50 px-4 py-1.5 text-sm text-red-400">Delete</button>
                </div>
              ))}
            </div>
            {editSection && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="glass w-full max-w-xl rounded-3xl p-8">
                  <h2 className="font-serif text-2xl">Edit Section</h2>
                  <div className="mt-6 space-y-4">
                    <Field label="Title" value={editSection.title} onChange={(v) => setEditSection({ ...editSection, title: v })} />
                    <Field label="Subtitle" value={editSection.subtitle} onChange={(v) => setEditSection({ ...editSection, subtitle: v })} />
                    <label className="block"><span className="mb-1 block text-xs tracking-widest text-ivory/50 uppercase">Content</span>
                      <textarea rows={4} value={editSection.content || ''} onChange={(e) => setEditSection({ ...editSection, content: e.target.value })} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-2.5 text-sm" /></label>
                    <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={!!editSection.enabled} onChange={(e) => setEditSection({ ...editSection, enabled: e.target.checked })} /> Enabled</label>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={async () => { try { await api('/api/sections', { method: 'PUT', body: JSON.stringify(editSection) }); setEditSection(null); notify('Saved.'); loadAll(); } catch (e: any) { notify(e.message); } }} className="rounded-full bg-champagne px-6 py-2 font-semibold text-graphite">Save</button>
                    <button onClick={() => setEditSection(null)} className="rounded-full border border-ivory/20 px-6 py-2">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h1 className="font-serif text-3xl">Settings, Appearance & 3D</h1>
            <div className="glass mt-6 grid gap-4 rounded-2xl p-6 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(settings).map(([k, v]) => (
                <Field key={k} label={k.replace(/_/g, ' ')} value={v} onChange={(val) => setSettings({ ...settings, [k]: val })} />
              ))}
            </div>
            <button onClick={async () => { try { await api('/api/settings', { method: 'PUT', body: JSON.stringify({ settings }) }); notify('Settings saved.'); loadAll(); } catch (e: any) { notify(e.message); } }} className="mt-6 rounded-full bg-champagne px-8 py-3 font-semibold text-graphite">Save All Settings</button>
          </div>
        )}

        {tab === 'media' && (
          <div>
            <h1 className="font-serif text-3xl">Media Library</h1>
            <MediaUploader onDone={() => { notify('Uploaded.'); loadAll(); }} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {media.map((m) => (
                <div key={m.id} className="glass overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.alt_text || m.file_name} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <p className="truncate text-xs text-ivory/60">{m.file_name}</p>
                    <input value={m.caption || ''} placeholder="Caption" onChange={(e) => setMedia(media.map((x) => x.id === m.id ? { ...x, caption: e.target.value } : x))} className="mt-2 w-full rounded-lg border border-ivory/15 bg-black/40 px-3 py-1.5 text-xs" />
                    <input value={m.alt_text || ''} placeholder="Alt text" onChange={(e) => setMedia(media.map((x) => x.id === m.id ? { ...x, alt_text: e.target.value } : x))} className="mt-2 w-full rounded-lg border border-ivory/15 bg-black/40 px-3 py-1.5 text-xs" />
                    <div className="mt-3 flex gap-2">
                      <button onClick={async () => { await api('/api/media', { method: 'PUT', body: JSON.stringify({ id: m.id, caption: m.caption, alt_text: m.alt_text, url: m.url }) }); notify('Saved.'); }} className="rounded-full border border-champagne/50 px-3 py-1 text-xs text-champagne">Save</button>
                      <button onClick={() => confirmDo('Delete media', async () => { await api('/api/media', { method: 'DELETE', body: JSON.stringify({ id: m.id }) }); })} className="rounded-full border border-red-500/50 px-3 py-1 text-xs text-red-400">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'models' && (
          <div>
            <h1 className="font-serif text-3xl">3D Models (GLB / GLTF)</h1>
            <ModelUploader onDone={() => { notify('Model saved.'); loadAll(); }} />
            <div className="mt-6 space-y-3">
              {models.map((m) => (
                <div key={m.id} className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
                  <div className="min-w-[220px] flex-1"><p className="font-serif text-lg">{m.name} {m.is_main && <span className="text-champagne text-sm">· MAIN</span>}</p><p className="truncate text-xs text-ivory/50">{m.url}</p><p className="text-xs text-ivory/50">Scale {m.scale} · Speed {m.rotation_speed}</p></div>
                  <button onClick={async () => { await api('/api/models', { method: 'PUT', body: JSON.stringify({ id: m.id, is_main: true }) }); notify('Set as main.'); loadAll(); }} className="rounded-full border border-champagne/50 px-4 py-1.5 text-sm text-champagne">Set Main</button>
                  <button onClick={() => confirmDo('Delete model', async () => { await api('/api/models', { method: 'DELETE', body: JSON.stringify({ id: m.id }) }); })} className="rounded-full border border-red-500/50 px-4 py-1.5 text-sm text-red-400">Delete</button>
                </div>
              ))}
              {!models.length && <p className="text-ivory/50">No custom models yet — the procedural skyscraper is live. Upload a GLB to replace it.</p>}
            </div>
          </div>
        )}

        {tab === 'messages' && (
          <div>
            <h1 className="font-serif text-3xl">Contact Messages</h1>
            <div className="mt-6 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`glass rounded-2xl p-5 ${m.is_read ? 'opacity-60' : ''}`}>
                  <div className="flex flex-wrap justify-between gap-2"><p className="font-serif text-lg">{m.name} <span className="text-sm text-ivory/50">· {m.email} {m.phone ? `· ${m.phone}` : ''}</span></p><p className="text-xs text-ivory/40">{new Date(m.created_at).toLocaleString()}</p></div>
                  <p className="mt-1 text-sm text-champagne">{m.subject}</p>
                  <p className="mt-2 text-sm text-ivory/75">{m.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={async () => { await api('/api/contact', { method: 'PATCH', body: JSON.stringify({ id: m.id, is_read: !m.is_read }) }); loadAll(); }} className="rounded-full border border-champagne/50 px-4 py-1 text-xs text-champagne">{m.is_read ? 'Mark Unread' : 'Mark Read'}</button>
                    <button onClick={() => confirmDo('Delete message', async () => { await api('/api/contact', { method: 'DELETE', body: JSON.stringify({ id: m.id }) }); })} className="rounded-full border border-red-500/50 px-4 py-1 text-xs text-red-400">Delete</button>
                  </div>
                </div>
              ))}
              {!messages.length && <p className="text-ivory/50">No messages yet.</p>}
            </div>
          </div>
        )}

        {tab === 'seo' && (
          <div>
            <div className="flex items-center justify-between"><h1 className="font-serif text-3xl">SEO</h1>
              <button onClick={() => setEditSeo({ page: 'home', title: '', description: '', keywords: '', og_image: '' })} className="rounded-full bg-champagne px-5 py-2 font-semibold text-graphite">+ New Page</button></div>
            <div className="mt-6 space-y-3">
              {seo.map((s) => (
                <div key={s.id} className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
                  <div className="min-w-[220px] flex-1"><p className="font-serif text-lg">{s.page}</p><p className="text-xs text-ivory/50">{s.title}</p></div>
                  <button onClick={() => setEditSeo(s)} className="rounded-full border border-champagne/50 px-4 py-1.5 text-sm text-champagne">Edit</button>
                </div>
              ))}
            </div>
            {editSeo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="glass w-full max-w-xl rounded-3xl p-8">
                  <h2 className="font-serif text-2xl">Edit SEO</h2>
                  <div className="mt-6 space-y-4">
                    <Field label="Page" value={editSeo.page} onChange={(v) => setEditSeo({ ...editSeo, page: v })} />
                    <Field label="Title" value={editSeo.title} onChange={(v) => setEditSeo({ ...editSeo, title: v })} />
                    <Field label="Description" value={editSeo.description} onChange={(v) => setEditSeo({ ...editSeo, description: v })} />
                    <Field label="Keywords" value={editSeo.keywords} onChange={(v) => setEditSeo({ ...editSeo, keywords: v })} />
                    <Field label="OG Image URL" value={editSeo.og_image} onChange={(v) => setEditSeo({ ...editSeo, og_image: v })} />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={async () => { try { await api('/api/seo', { method: 'PUT', body: JSON.stringify(editSeo) }); setEditSeo(null); notify('Saved.'); loadAll(); } catch (e: any) { notify(e.message); } }} className="rounded-full bg-champagne px-6 py-2 font-semibold text-graphite">Save</button>
                    <button onClick={() => setEditSeo(null)} className="rounded-full border border-ivory/20 px-6 py-2">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'versions' && (
          <div>
            <h1 className="font-serif text-3xl">Publish & Versions</h1>
            <p className="mt-2 text-sm text-ivory/60">Publish snapshots the whole site. Roll back restores any previous version.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={async () => { try { await api('/api/versions', { method: 'POST', body: JSON.stringify({ label: `Publish ${new Date().toLocaleString()}` }) }); notify('Published snapshot.'); loadAll(); } catch (e: any) { notify(e.message); } }} className="rounded-full bg-champagne px-6 py-2 font-semibold text-graphite">Publish Now</button>
              <a href="/" target="_blank" className="rounded-full border border-ivory/20 px-6 py-2">Live Preview</a>
            </div>
            <div className="mt-6 space-y-3">
              {versions.map((v) => (
                <div key={v.id} className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
                  <div className="min-w-[220px] flex-1"><p className="font-serif text-lg">{v.label}</p><p className="text-xs text-ivory/50">by {v.created_by} · {new Date(v.created_at).toLocaleString()}</p></div>
                  <button onClick={() => confirmDo('Roll back to this version', async () => { await api('/api/versions', { method: 'POST', body: JSON.stringify({ action: 'rollback', id: v.id }) }); })} className="rounded-full border border-champagne/50 px-4 py-1.5 text-sm text-champagne">Roll Back</button>
                  <button onClick={() => confirmDo('Delete version', async () => { await api('/api/versions', { method: 'DELETE', body: JSON.stringify({ id: v.id }) }); })} className="rounded-full border border-red-500/50 px-4 py-1.5 text-sm text-red-400">Delete</button>
                </div>
              ))}
              {!versions.length && <p className="text-ivory/50">No versions yet.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function MediaUploader({ onDone }: { onDone: () => void }) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const upload = async () => {
    setBusy(true);
    try {
      if (file) {
        const buf = await file.arrayBuffer();
        const b64 = toBase64(buf);
        await api('/api/media', { method: 'POST', body: JSON.stringify({ data_base64: b64, file_name: file.name, file_type: file.type, file_size: file.size }) });
      } else if (url) {
        await api('/api/media', { method: 'POST', body: JSON.stringify({ url }) });
      }
      setUrl(''); setFile(null); onDone();
    } catch (e: any) { alert(e.message); }
    setBusy(false);
  };
  return (
    <div className="glass mt-6 flex flex-wrap items-end gap-3 rounded-2xl p-5">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste image URL" className="min-w-[220px] flex-1 rounded-xl border border-ivory/15 bg-black/40 px-4 py-2.5 text-sm" />
      <button disabled={busy} onClick={upload} className="rounded-full bg-champagne px-6 py-2.5 font-semibold text-graphite disabled:opacity-50">{busy ? 'Uploading…' : 'Upload'}</button>
    </div>
  );
}

function ModelUploader({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(1);
  const [speed, setSpeed] = useState(0.3);
  const [busy, setBusy] = useState(false);
  const upload = async () => {
    setBusy(true);
    try {
      if (file) {
        const buf = await file.arrayBuffer();
        const b64 = toBase64(buf);
        await api('/api/models', { method: 'POST', body: JSON.stringify({ data_base64: b64, file_name: file.name, name: name || file.name, is_main: true, scale, rotation_speed: speed }) });
      } else if (url) {
        await api('/api/models', { method: 'POST', body: JSON.stringify({ url, name: name || 'Custom Model', is_main: true, scale, rotation_speed: speed }) });
      }
      setName(''); setUrl(''); setFile(null); onDone();
    } catch (e: any) { alert(e.message); }
    setBusy(false);
  };
  return (
    <div className="glass mt-6 grid gap-3 rounded-2xl p-5 sm:grid-cols-2 lg:grid-cols-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Model name" className="rounded-xl border border-ivory/15 bg-black/40 px-4 py-2.5 text-sm" />
      <input type="file" accept=".glb,.gltf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or GLB URL" className="rounded-xl border border-ivory/15 bg-black/40 px-4 py-2.5 text-sm" />
      <div className="flex gap-2">
        <input type="number" step="0.1" value={scale} onChange={(e) => setScale(Number(e.target.value))} placeholder="Scale" className="w-24 rounded-xl border border-ivory/15 bg-black/40 px-3 py-2.5 text-sm" />
        <input type="number" step="0.05" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} placeholder="Speed" className="w-24 rounded-xl border border-ivory/15 bg-black/40 px-3 py-2.5 text-sm" />
        <button disabled={busy} onClick={upload} className="flex-1 rounded-full bg-champagne px-4 py-2.5 font-semibold text-graphite disabled:opacity-50">{busy ? '…' : 'Upload & Set Main'}</button>
      </div>
    </div>
  );
}
