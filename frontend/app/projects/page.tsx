'use client';
import { useMemo, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';

export default function ProjectsPage() {
  const { t, lang } = useI18n();
  const tc = useContent();
  const { projects, sec } = useSiteData();
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const categories = useMemo(() => ['', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], [projects]);
  const statuses = useMemo(() => ['', ...Array.from(new Set(projects.map((p) => p.status).filter(Boolean)))], [projects]);
  const filtered = projects.filter((p) => (cat === '' || p.category === cat) && (status === '' || p.status === status));

  return (
    <PageShell active="projects">
      <section className="mx-auto max-w-7xl px-6 pt-40 pb-20">
        <div className="reveal text-center">
          <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('projects').subtitle || t('projects.subtitle'))}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl">{tc(sec('projects').title || t('projects.title'))}</h1>
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-center leading-8 text-ivory/65">{lang === 'fa' ? 'مجموعه‌ای از ایده‌های معماری، از فضاهای مسکونی آرام تا بناهای شهری شاخص. پروژه‌های نمونه زیر برای نمایش رویکرد طراحی هستند.' : 'A collection of architectural ideas, from quiet residences to distinctive urban spaces. The following sample projects illustrate our approach.'}</p>
        <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-full border border-ivory/20 bg-coal px-5 py-2 text-sm" aria-label={t('projects.cat')}>
            {categories.map((c) => <option key={c} value={c}>{c ? tc(c) : t('projects.all')}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-ivory/20 bg-coal px-5 py-2 text-sm" aria-label={t('projects.status')}>
            {statuses.map((s) => <option key={s} value={s}>{s ? tc(s) : t('projects.all')}</option>)}
          </select>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.id} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(p); } }} className="reveal group cursor-pointer overflow-hidden rounded-3xl border border-ivory/10 bg-coal/80 backdrop-blur" onClick={() => setSelected(p)}>
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover_image || '/images/3d-facade.png'} alt={p.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                <span className="absolute start-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-champagne">{tc(p.status)}</span>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl">{tc(p.title)}</h3>
                <p className="mt-1 text-sm text-ivory/60">{p.location} · {tc(p.category)}</p>
                <p className="mt-3 line-clamp-2 text-sm text-ivory/70">{tc(p.description)}</p>
                <p className="mt-4 text-sm text-champagne">{t('projects.view')} →</p>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && <p className="mt-10 text-center text-ivory/50">{t('projects.none')}</p>}
      </section>

      {selected && (
        <div role="dialog" aria-modal="true" aria-label={tc(selected.title)} onKeyDown={(e) => { if (e.key === 'Escape') setSelected(null); }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)}>
          <div className="glass max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.cover_image || '/images/3d-facade.png'} alt={selected.title} className="h-72 w-full object-cover" />
            <div className="p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-serif text-3xl">{tc(selected.title)}</h3>
                <button onClick={() => setSelected(null)} className="text-2xl text-ivory/60 hover:text-champagne" aria-label={t('modal.close')}>✕</button>
              </div>
              <p className="mt-2 text-sm text-champagne">{selected.location} · {tc(selected.category)} · {tc(selected.status)}</p>
              <p className="mt-4 text-ivory/75">{tc(selected.description)}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div className="rounded-xl bg-white/5 p-4"><p className="text-ivory/50">{t('modal.completion')}</p><p className="mt-1">{selected.completion_date || '—'}</p></div>
                <div className="rounded-xl bg-white/5 p-4"><p className="text-ivory/50">{t('modal.area')}</p><p className="mt-1">{selected.area_sqm ? `${Number(selected.area_sqm).toLocaleString()} m²` : '—'}</p></div>
                <div className="rounded-xl bg-white/5 p-4"><p className="text-ivory/50">{t('modal.floors')}</p><p className="mt-1">{selected.floors || '—'}</p></div>
                <div className="rounded-xl bg-white/5 p-4"><p className="text-ivory/50">{t('modal.units')}</p><p className="mt-1">{selected.units || '—'}</p></div>
              </div>
              <a href="/contact" className="mt-8 inline-block rounded-full bg-champagne px-8 py-3 font-semibold text-graphite">{t('modal.discuss')}</a>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
