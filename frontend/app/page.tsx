'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getSettings, getProjects, getServices, getSections, submitContact } from '@/lib/api';

const Skyscraper3D = dynamic(() => import('@/components/Skyscraper3D'), { ssr: false, loading: () => <div className="fixed inset-0 z-0 bg-graphite" /> });

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
    const suffix = value.replace(/[0-9.]/g, '');
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
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [cat, setCat] = useState('All');
  const [status, setStatus] = useState('All');
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

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], [projects]);
  const statuses = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.status).filter(Boolean)))], [projects]);
  const filtered = projects.filter((p) => (cat === 'All' || p.category === cat) && (status === 'All' || p.status === status));

  const company = settings.company_name || 'ALAMEE';
  const rotationSpeed = parseFloat(settings.rotation_speed || '0.35');
  const lighting = parseFloat(settings.lighting_intensity || '1.2');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact(form);
      setSent('Thank you. Our team will reply within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch { setSent('Something went wrong. Please try again.'); }
  };

  const nav = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="relative min-h-screen bg-graphite text-ivory">
      <Skyscraper3D rotationSpeed={rotationSpeed} lighting={lighting} />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="glass mx-3 mt-3 rounded-2xl px-5 py-3 flex items-center justify-between md:mx-8 md:mt-5 md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-champagne font-serif text-lg font-bold text-graphite">A</span>
            <span className="tracking-[0.35em] font-semibold">{company}</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-ivory/80">
            {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-champagne transition">{n.label}</a>)}
            <a href="/admin" className="rounded-full border border-champagne/50 px-4 py-1.5 text-champagne hover:bg-champagne hover:text-graphite transition">Admin</a>
          </nav>
          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">☰</button>
        </div>
        {menuOpen && (
          <div className="glass mx-3 mt-2 rounded-2xl p-5 flex flex-col gap-4 md:hidden">
            {nav.map((n) => <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="text-ivory/90">{n.label}</a>)}
            <a href="/admin" className="text-champagne">Admin Panel</a>
          </div>
        )}
      </header>

      <main id="top" className="relative z-10">
        {/* HERO */}
        {enabled('hero') && (
          <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <p className="reveal text-xs tracking-[0.5em] text-champagne uppercase">{settings.tagline || "Building Tomorrow's Landmarks"}</p>
            <h1 className="reveal mt-6 max-w-5xl font-serif text-5xl leading-tight md:text-7xl">
              {settings.hero_title || 'We Build Icons. Not Just Buildings.'}
            </h1>
            <p className="reveal mt-6 max-w-2xl text-ivory/70 md:text-lg">{settings.hero_subtitle || 'Ultra-premium architecture, engineering and development.'}</p>
            <div className="reveal mt-10 flex flex-wrap justify-center gap-4">
              <a href="#projects" className="rounded-full bg-champagne px-8 py-3 font-semibold text-graphite hover:bg-champagneLight transition">Explore Projects</a>
              <a href="#contact" className="rounded-full border border-ivory/30 px-8 py-3 hover:border-champagne hover:text-champagne transition">Start a Project</a>
            </div>
            <div className="mt-16 flex flex-col items-center gap-2 text-ivory/50">
              <span className="text-[10px] tracking-[0.4em] uppercase">Scroll to explore</span>
              <span className="flex h-10 w-6 justify-center rounded-full border border-ivory/30 pt-2"><span className="scroll-dot h-2 w-1 rounded-full bg-champagne" /></span>
            </div>
            <p className="mt-6 text-xs text-ivory/40">Drag to orbit the tower · Scroll for a 360° cinematic tour</p>
          </section>
        )}

        {/* ABOUT */}
        {enabled('about') && (
          <section id="about" className="mx-auto max-w-6xl px-6 py-28">
            <div className="reveal glass rounded-3xl p-8 md:p-14">
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{sec('about').subtitle || 'Two decades of architectural excellence'}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{sec('about').title || 'About ALAMEE'}</h2>
              <div className="gold-line my-8" />
              <p className="max-w-3xl text-ivory/75 leading-relaxed">{sec('about').content || 'ALAMEE is a luxury construction and development house crafting landmarks across Europe — from glass towers to private villas — with in-house architecture, engineering and interiors.'}</p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {[
                  { t: '2007 — Founded', d: 'Born in Amsterdam with a single tower and an uncompromising standard.' },
                  { t: '128 Landmarks', d: 'Delivered across the Netherlands, Belgium, Germany, France and Austria.' },
                  { t: 'Design-Build', d: 'One accountable team from first sketch to final key handover.' }
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
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{sec('projects').subtitle || 'Landmarks across Europe'}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{sec('projects').title || 'Selected Works'}</h2>
            </div>
            <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-full border border-ivory/20 bg-coal px-5 py-2 text-sm" aria-label="Category">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-ivory/20 bg-coal px-5 py-2 text-sm" aria-label="Status">
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <article key={p.id} className="reveal group cursor-pointer overflow-hidden rounded-3xl border border-ivory/10 bg-coal/80 backdrop-blur" onClick={() => setSelected(p)}>
                  <div className="relative h-56 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-champagne">{p.status}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl">{p.title}</h3>
                    <p className="mt-1 text-sm text-ivory/60">{p.location} · {p.category}</p>
                    <p className="mt-3 line-clamp-2 text-sm text-ivory/70">{p.description}</p>
                    <p className="mt-4 text-sm text-champagne">View details →</p>
                  </div>
                </article>
              ))}
            </div>
            {!filtered.length && <p className="mt-10 text-center text-ivory/50">No projects match this filter.</p>}
          </section>
        )}

        {/* SERVICES */}
        {enabled('services') && (
          <section id="services" className="mx-auto max-w-6xl px-6 py-28">
            <div className="reveal text-center">
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{sec('services').subtitle || 'End-to-end excellence'}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{sec('services').title || 'What We Do'}</h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <div key={s.id} className="reveal glass rounded-3xl p-8 hover:border-champagne/50 transition">
                  <span className="font-serif text-4xl gold-text">0{i + 1}</span>
                  <h3 className="mt-4 font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-ivory/70 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROCESS */}
        {enabled('process') && (
          <section id="process" className="mx-auto max-w-5xl px-6 py-28">
            <div className="reveal text-center">
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{sec('process').subtitle || 'From vision to skyline'}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{sec('process').title || 'Our Process'}</h2>
            </div>
            <div className="relative mt-14 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-champagne/30 md:before:left-1/2">
              {[
                { t: 'Vision & Feasibility', d: 'Site study, massing and a cinematic 3D walkthrough before a single brick is laid.' },
                { t: 'Design & Engineering', d: 'Architecture, structure and MEP engineered as one integrated model.' },
                { t: 'Construction', d: 'In-house teams, weekly drone progress and a single point of accountability.' },
                { t: 'Interiors & Handover', d: 'Bespoke interiors, snag-free delivery and a 10-year craftsmanship warranty.' }
              ].map((s, i) => (
                <div key={s.t} className={`reveal relative flex md:w-1/2 ${i % 2 ? 'md:ml-auto md:pl-10' : 'md:pr-10 md:text-right'} pl-14 md:pl-0`}>
                  <span className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-champagne font-bold text-graphite ${i % 2 ? 'md:-left-5' : 'md:-right-5'}`}>{i + 1}</span>
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
                { v: settings.stats_projects || '128', l: 'Completed Projects' },
                { v: settings.stats_years || '18', l: 'Years of Experience' },
                { v: settings.stats_area || '2.4M', l: 'Sqm Built' },
                { v: settings.stats_team || '340', l: 'Team Members' }
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
              <p className="text-xs tracking-[0.4em] text-champagne uppercase">{sec('contact').subtitle || 'Start your project'}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{sec('contact').title || 'Contact'}</h2>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                </div>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your project…" className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
                <button className="w-full rounded-full bg-champagne py-3 font-semibold text-graphite hover:bg-champagneLight transition">Send Message</button>
                {sent && <p className="text-center text-sm text-champagne">{sent}</p>}
              </form>
              <div className="space-y-6">
                <div className="glass rounded-3xl p-8 space-y-3">
                  <p><span className="text-champagne">Phone:</span> {settings.contact_phone || '+31 20 240 0000'}</p>
                  <p><span className="text-champagne">Email:</span> {settings.contact_email || 'info@alamee.com'}</p>
                  <p><span className="text-champagne">Address:</span> {settings.contact_address || 'Herengracht 420, Amsterdam'}</p>
                </div>
                <div className="overflow-hidden rounded-3xl border border-ivory/10">
                  <iframe title="ALAMEE office map" src="https://www.google.com/maps?q=Herengracht+420+Amsterdam&output=embed" className="h-72 w-full grayscale invert-[0.9] contrast-[0.9]" loading="lazy" />
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
            <p className="tracking-[0.35em] font-semibold">{company}</p>
            <p className="mt-3 text-sm text-ivory/60">{settings.tagline || "Building Tomorrow's Landmarks"}</p>
          </div>
          <div>
            <p className="text-champagne text-sm tracking-widest uppercase">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-ivory/70">
              {nav.map((n) => <li key={n.href}><a href={n.href} className="hover:text-champagne">{n.label}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="text-champagne text-sm tracking-widest uppercase">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-ivory/70">
              <li>{settings.contact_phone || '+31 20 240 0000'}</li>
              <li>{settings.contact_email || 'info@alamee.com'}</li>
              <li>{settings.contact_address || 'Herengracht 420, Amsterdam'}</li>
            </ul>
          </div>
          <div>
            <p className="text-champagne text-sm tracking-widest uppercase">Follow</p>
            <div className="mt-4 flex gap-3 text-sm">
              {['LinkedIn', 'Instagram', 'X'].map((s) => <a key={s} href="#top" className="rounded-full border border-ivory/20 px-4 py-1.5 hover:border-champagne hover:text-champagne">{s}</a>)}
            </div>
          </div>
        </div>
        <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/40">© {new Date().getFullYear()} {company}. All rights reserved. · <a href="/admin" className="text-champagne">Admin</a></div>
      </footer>

      {/* PROJECT MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)}>
          <div className="glass max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.cover_image} alt={selected.title} className="h-72 w-full object-cover" />
            <div className="p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-serif text-3xl">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="text-2xl text-ivory/60 hover:text-champagne" aria-label="Close">✕</button>
              </div>
              <p className="mt-2 text-sm text-champagne">{selected.location} · {selected.category} · {selected.status}</p>
              <p className="mt-4 text-ivory/75">{selected.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div className="rounded-xl bg-white/5 p-4"><p className="text-ivory/50">Completion</p><p className="mt-1">{selected.completion_date || '—'}</p></div>
                <div className="rounded-xl bg-white/5 p-4"><p className="text-ivory/50">Area</p><p className="mt-1">{selected.area_sqm ? `${Number(selected.area_sqm).toLocaleString()} m²` : '—'}</p></div>
                <div className="rounded-xl bg-white/5 p-4"><p className="text-ivory/50">Floors</p><p className="mt-1">{selected.floors || '—'}</p></div>
                <div className="rounded-xl bg-white/5 p-4"><p className="text-ivory/50">Units</p><p className="mt-1">{selected.units || '—'}</p></div>
              </div>
              <a href="#contact" onClick={() => setSelected(null)} className="mt-8 inline-block rounded-full bg-champagne px-8 py-3 font-semibold text-graphite">Discuss a Similar Project</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
