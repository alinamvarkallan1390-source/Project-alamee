'use client';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';
import { useRef, useState, useEffect } from 'react';

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
  const { t } = useI18n();
  const tc = useContent();
  const { settings, sec } = useSiteData();

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const cards = [
    { href: '/about', label: t('nav.about') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/services', label: t('nav.services') },
    { href: '/process', label: t('nav.process') },
    { href: '/contact', label: t('nav.contact') }
  ];

  return (
    <PageShell active="home">
      {/* HERO */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="reveal text-xs tracking-[0.5em] text-champagne uppercase">{tc(settings.tagline || t('hero.tagline'))}</p>
        <h1 className="reveal mt-6 max-w-5xl font-serif text-4xl leading-tight md:text-6xl">
          {tc(settings.hero_title || t('hero.title'))}
        </h1>
        <p className="reveal mt-6 max-w-2xl text-ivory/70 md:text-lg">{tc(settings.hero_subtitle || t('hero.subtitle'))}</p>
        <div className="reveal mt-10 flex flex-wrap justify-center gap-4">
          <a href="/projects" className="rounded-full bg-champagne px-8 py-3 font-semibold text-graphite hover:bg-champagneLight transition">{t('hero.explore')}</a>
          <a href="/contact" className="rounded-full border border-ivory/30 px-8 py-3 hover:border-champagne hover:text-champagne transition">{t('hero.start')}</a>
        </div>
        <div className="mt-16 flex flex-col items-center gap-2 text-ivory/50">
          <span className="text-[10px] tracking-[0.4em] uppercase">{t('hero.scroll')}</span>
          <span className="flex h-10 w-6 justify-center rounded-full border border-ivory/30 pt-2"><span className="scroll-dot h-2 w-1 rounded-full bg-champagne" /></span>
        </div>
        <p className="mt-6 text-xs text-ivory/40">{t('hero.drag')}</p>
      </section>

      {/* SECTION LINKS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="reveal grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c, i) => (
            <a key={c.href} href={c.href} className="reveal glass group flex flex-col items-center gap-3 rounded-3xl p-8 text-center hover:border-champagne/60 transition">
              <span className="font-serif text-4xl gold-text">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-serif text-lg">{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* STATS */}
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
    </PageShell>
  );
}
