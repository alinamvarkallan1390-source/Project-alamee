'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getSettings, getProjects, getServices, getSections, submitContact } from '@/lib/api';
import { useI18n, useContent } from '@/lib/i18n';

const Skyscraper3D = dynamic(
  () => import('@/components/Skyscraper3D'),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hero-3d.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    ),
  }
);

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const num = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.max(0, Math.min(1, (t - start) / 1600));
        setN(num * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);
  const num = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  const suffix = value.replace(/[0-9.]/g, '');
  const decimals = (value.match(/\./g) || []).length ? 1 : 0;
  return <span ref={ref}>{n.toFixed(decimals)}{suffix}</span>;
}

export default function Home() {
  const { t, lang, setLang } = useI18n();
  const tc = useContent();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState('');
  const [selected, setSelected] = useState<any>(null);
  useReveal();

  useEffect(() => {
    getSettings().then(setSettings);
    getProjects().then(setProjects);
    getServices().then(setServices);
    getSections().then(setSections);
  }, []);

  const enabled = (key: string) => {
    if (!sections.length) return true;
    const s = sections.find((x) => x.key === key);
    return s ? s.enabled !== false : true;
  };
  const sec = (key: string) => sections.find((x) => x.key === key) || {};

  const categories = useMemo(() => ['', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], [projects]);
  const statuses = useMemo(() => ['', ...Array.from(new Set(projects.map((p) => p.status).filter(Boolean)))], [projects]);
  const filtered = projects.filter((p) => (cat === '' || p.category === cat) && (status === '' || p.status === status));

  const company = settings.company_name || 'ALAMEE';
  const rotationSpeed = parseFloat(settings.rotation_speed || '0.35');
  const lighting = parseFloat(settings.lighting_intensity || '1.2');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact(form);
      setSent(t('contact.sentOk'));
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch { setSent(t('contact.sentErr')); }
  };

  const nav = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.contact'), href: '#contact' }
  ];

  return (
    <div className="relative min-h-screen bg-graphite text-ivory" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <Skyscraper3D rotationSpeed={rotationSpeed} lighting={lighting} />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      {/* NAV */}
      <header className="fixed top-0 start-0 end-0 z-50">
        <div className="glass mx-3 mt-3 rounded-2xl px-5 py-3 flex items-center justify-between md:mx-8 md:mt-5 md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-champagne font-serif text-lg font-bold text-graphite">A</span>
            <span className="tracking-[0.35em] font-semibold">{tc(company)}</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-ivory/80">
            {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-champagne transition">{n.label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
              title={t('nav.langTip')}
              className="rounded-full border border-champagne/40 px-4 py-1.5 text-xs tracking-widest font-semibold text-champagne hover:bg-champagne hover:text-graphite transition"
            >
              {t('nav.lang')}
            </button>
            <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">☰</button>
          </div>
        </div>
        {menuOpen && (
          <div className="glass mx-3 mt-2 rounded-2xl p-5 flex flex-col gap-4 md:hidden">
            {nav.map((n) => <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="text-ivory/90">{n.label}</a>)}
            <button onClick={() => { setLang(lang === 'fa' ? 'en' : 'fa'); }} className="text-champagne text-start">{t('nav.langTip')}</button>
          </div>
        )}
      </header>

      <main id="top" className="relative z-10">
        {/* HERO */}
        {enabled('hero') && (
          <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <p className="reveal text-xs tracking-[0.5em] text-champagne uppercase">{tc(settings.tagline || t('hero.tagline'))}</p>
            <h1 className="reveal mt-6 max-w-5xl font-serif text-4xl leading-tight md:text-6xl">
              {tc(settings.hero_title || t('hero.title'))}
            </h1>
            <p className="reveal mt-6 max-w-2xl text-ivory/70 md:text-lg">{tc(settings.hero_subtitle || t('hero.subtitle'))}</p>
            <div className="reveal mt-10 flex flex-wrap justify-center gap-4">
              <a href="#projects" className="rounded-full bg-champagne px-8 py-3 font-semibold text-graphite hover:bg-champagneLight transition">{t('hero.explore')}</a>
              <a href="#contact" className="rounded-full border border-ivory/30 px-8 py-3 hover:border-champagne hover:text-champagne transition">{t('hero.start')}</a>
            </div>
            <div className="mt-16 flex flex-col items-center gap-2 text-ivory/50">
              <span className="text-[10px] tracking-[0.4em] uppercase">{t('hero.scroll')}</span>
              <span className="flex h-10 w-6 justify-center rounded-full border border-ivory/30 pt-2"><span className="scroll-dot h-2 w-1 rounded-full bg-champagne" /></span>
            </div>
            <p className="mt-6 text-xs text-ivory/40">{t('hero.drag')}</p>
          </section>
        )}

        {/* ABOUT */}
        {enabled('about') && (
          <section id="about" className="mx-auto max-w-6xl px-6 py-28">
            <div className="reveal glass rounded-3xl p-8 md:p-14">
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('about').subtitle || t('about.subtitle'))}</p>
              <h2 className="mt-4 font-serif text-3xl md:text-5xl">{tc(sec('about').title || t('about.title'))}</h2>
              <div className="gold-line my-8" />
              <p className="max-w-3xl text-ivory/75 leading-relaxed">{tc(sec('about').content || t('about.content'))}</p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {[
                  { t: t('about.f1.t'), d: t('about.f1.d') },
                  { t: t('about.f2.t'), d: t('about.f2.d') },
                  { t: t('about.f3.t'), d: t('about.f3.d') }
                ].map((c) => (
                  <div key={c.t} className="rounded-2xl border border-ivory/10 bg-white/5 p-6">
                    <h3 className="font-serif text-xl text-champagne">{c.t}</h3>
                    <p className="mt-2 text-sm text-ivory/70">{c.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {enabled('projects') && (
          <section id="projects" className="mx-auto max-w-7xl px-6 py-28">
            <div className="reveal text-center">
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('projects').subtitle || t('projects.subtitle'))}</p>
              <h2 className="mt-4 font-serif text-3xl md:text-5xl">{tc(sec('projects').title || t('projects.title'))}</h2>
            </div>
            <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-full border border-ivory/20 bg-coal px-5 py-2 text-sm" aria-label={t('projects.cat')}>
                {categories.map((c) => <option key={c} value={c}>{c || t('projects.all')}</option>)}
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-ivory/20 bg-coal px-5 py-2 text-sm" aria-label={t('projects.status')}>
                {statuses.map((s) => <option key={s} value={s}>{s || t('projects.all')}</option>)}
              </select>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <article key={p.id} className="reveal group cursor-pointer overflow-hidden rounded-3xl border border-ivory/10 bg-coal/80 backdrop-blur" onClick={() => setSelected(p)}>
                  <div className="relative h-56 overflow-hidden">
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
        )}

        {/* SERVICES */}
        {enabled('services') && (
          <section id="services" className="mx-auto max-w-6xl px-6 py-28">
            <div className="reveal text-center">
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('services').subtitle || t('services.subtitle'))}</p>
              <h2 className="mt-4 font-serif text-3xl md:text-5xl">{tc(sec('services').title || t('services.title'))}</h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <div key={s.id} className="reveal glass rounded-3xl p-8 hover:border-champagne/50 transition">
                  <span className="font-serif text-4xl gold-text">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-4 font-serif text-2xl">{tc(s.title)}</h3>
                  <p className="mt-3 text-sm text-ivory/70 leading-relaxed">{tc(s.description)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROCESS */}
        {enabled('process') && (
          <section id="process" className="mx-auto max-w-5xl px-6 py-28">
            <div className="reveal text-center">
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('process').subtitle || t('process.subtitle'))}</p>
              <h2 className="mt-4 font-serif text-3xl md:text-5xl">{tc(sec('process').title || t('process.title'))}</h2>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/3d-process.png" alt="" className="reveal mx-auto mt-10 h-44 w-full max-w-2xl rounded-3xl border border-ivory/10 object-cover" loading="lazy" />
            <div className="relative mt-14 space-y-8 before:absolute before:start-[19px] before:top-2 before:end-2 before:w-px before:bg-champagne/30 md:before:start-1/2 md:before:end-auto">
              {[
                { t: t('process.1.t'), d: t('process.1.d') },
                { t: t('process.2.t'), d: t('process.2.d') },
                { t: t('process.3.t'), d: t('process.3.d') },
                { t: t('process.4.t'), d: t('process.4.d') }
              ].map((s, i) => (
                <div key={s.t} className={`reveal relative flex md:w-1/2 ${i % 2 ? 'md:start-0 md:ps-10 md:text-start' : 'md:end-0 md:pe-10 md:text-end'} ps-14 md:ps-0`}>
                  <span className={`absolute start-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-champagne font-bold text-graphite ${i % 2 ? 'md:-start-5' : 'md:-end-5'}`}>{i + 1}</span>
                  <div className="glass rounded-2xl p-6 w-full">
                    <h3 className="font-serif text-xl text-champagne">{s.t}</h3>
                    <p className="mt-2 text-sm text-ivory/70">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STATS */}
        {enabled('stats') && (
          <section className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal glass grid grid-cols-2 gap-8 rounded-3xl p-10 text-center md:grid-cols-4">
              {[
                { v: settings.stats_projects || '128', l: t('stats.projects') },
                { v: settings.stats_years || '18', l: t('stats.years') },
                { v: settings.stats_area || '2.4M', l: t('stats.area') },
                { v: settings.stats_team || '340', l: t('stats.team') }
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-serif text-4xl md:text-5xl gold-text"><Counter value={s.v} /></p>
                  <p className="mt-2 text-xs tracking-widest text-ivory/60 uppercase">{s.l}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        {enabled('contact') && (
          <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
            <div className="reveal text-center">
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('contact').subtitle || t('contact.subtitle'))}</p>
              <h2 className="mt-4 font-serif text-3xl md:text-5xl">{tc(sec('contact').title || t('contact.title'))}</h2>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('contact.name')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('contact.email')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t('contact.phone')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t('contact.subject')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                </div>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t('contact.message')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                <button className="w-full rounded-full bg-champagne py-3 font-semibold text-graphite hover:bg-champagneLight transition">{t('contact.send')}</button>
                {sent && <p className="text-center text-sm text-champagne">{sent}</p>}
              </form>
              <div className="space-y-6">
                <div className="glass rounded-3xl p-8 space-y-3">
                  <p><span className="text-champagne">{t('contact.phoneLabel')} </span>{settings.contact_phone || '+31 20 240 0000'}</p>
                  <p><span className="text-champagne">{t('contact.emailLabel')} </span>{settings.contact_email || 'info@alamee.com'}</p>
                  <p><span className="text-champagne">{t('contact.addressLabel')} </span>{settings.contact_address || 'Herengracht 420, Amsterdam'}</p>
                </div>
                <div className="overflow-hidden rounded-3xl border border-ivory/10">
                  <iframe title={t('contact.map')} src="https://www.google.com/maps?q=Herengracht+420+Amsterdam&output=embed" className="h-72 w-full grayscale invert-[0.9] contrast-[0.9]" loading="lazy" />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-ivory/10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-4">
          <div>
            <p className="tracking-[0.35em] font-semibold">{tc(company)}</p>
            <p className="mt-3 text-sm text-ivory/60">{tc(settings.tagline || t('footer.tagline'))}</p>
          </div>
          <div>
            <p className="text-champagne text-sm tracking-widest uppercase">{t('footer.explore')}</p>
            <ul className="mt-4 space-y-2 text-sm text-ivory/70">
              {nav.map((n) => <li key={n.href}><a href={n.href} className="hover:text-champagne">{n.label}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="text-champagne text-sm tracking-widest uppercase">{t('footer.contact')}</p>
            <ul className="mt-4 space-y-2 text-sm text-ivory/70">
              <li>{settings.contact_phone || '+31 20 240 0000'}</li>
              <li>{settings.contact_email || 'info@alamee.com'}</li>
              <li>{settings.contact_address || 'Herengracht 420, Amsterdam'}</li>
            </ul>
          </div>
          <div>
            <p className="text-champagne text-sm tracking-widest uppercase">{t('footer.follow')}</p>
            <div className="mt-4 flex gap-3 text-sm">
              {['LinkedIn', 'Instagram', 'X'].map((s) => <a key={s} href="#top" className="rounded-full border border-ivory/20 px-4 py-1.5 hover:border-champagne hover:text-champagne">{s}</a>)}
            </div>
          </div>
        </div>
        <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/40">© {new Date().getFullYear()} {tc(company)}. {t('footer.rights')}</div>
      </footer>

      {/* PROJECT MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
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
              <a href="#contact" onClick={() => setSelected(null)} className="mt-8 inline-block rounded-full bg-champagne px-8 py-3 font-semibold text-graphite">{t('modal.discuss')}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
