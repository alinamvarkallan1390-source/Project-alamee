'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';

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

export function PageShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const { t, lang, setLang } = useI18n();
  const { settings, enabled } = useSiteData();
  const tc = useContent();
  const [bw, setBw] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('alamee_bw');
    if (saved) setBw(saved === '1');
  }, []);

  const toggleBw = async () => {
    const next = !bw;
    setBw(next);
    localStorage.setItem('alamee_bw', next ? '1' : '0');
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { theme_mode: next ? 'bw' : 'color' } }),
      });
    } catch { /* offline: local toggle only */ }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('bw-mode', bw);
  }, [bw]);

  const company = tc(settings.company_name || 'آراما');
  const nav = [
    { key: 'home', label: t('nav.home'), href: '/' },
    { key: 'about', label: t('nav.about'), href: '/about' },
    { key: 'projects', label: t('nav.projects'), href: '/projects' },
    { key: 'services', label: t('nav.services'), href: '/services' },
    { key: 'process', label: t('nav.process'), href: '/process' },
    { key: 'contact', label: t('nav.contact'), href: '/contact' }
  ];

  return (
    <div className={`relative min-h-screen bg-graphite text-ivory ${bw ? 'bw-theme' : ''}`} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <Skyscraper3D rotationSpeed={parseFloat(settings.rotation_speed || '0.35')} lighting={parseFloat(settings.lighting_intensity || '1.2')} />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/55 via-transparent to-black/75" />

      <header className="fixed top-0 start-0 end-0 z-50">
        <div className="glass mx-3 mt-3 rounded-2xl px-5 py-3 flex items-center justify-between md:mx-8 md:mt-5 md:px-8">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-champagne font-serif text-lg font-bold text-graphite">A</span>
            <span className="tracking-[0.35em] font-semibold">{company}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-ivory/80">
            {nav.map((n) => (
              <a key={n.key} href={n.href} className={`hover:text-champagne transition ${active === n.key ? 'text-champagne font-semibold' : ''}`}>{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBw}
              title="سیاه و سفید / رنگی"
              className="rounded-full border border-ivory/25 px-3 py-1.5 text-xs hover:border-champagne hover:text-champagne transition"
            >
              {bw ? 'رنگی' : '⚫/⚪'}
            </button>
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
            {nav.map((n) => <a key={n.key} href={n.href} onClick={() => setMenuOpen(false)} className="text-ivory/90">{n.label}</a>)}
            <button onClick={() => { setLang(lang === 'fa' ? 'en' : 'fa'); }} className="text-champagne text-start">{t('nav.langTip')}</button>
          </div>
        )}
      </header>

      <main id="top" className="relative z-10">{children}</main>

      <footer className="relative z-10 border-t border-ivory/10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-4">
          <div>
            <p className="tracking-[0.35em] font-semibold">{company}</p>
            <p className="mt-3 text-sm text-ivory/60">{tc(settings.tagline || t('footer.tagline'))}</p>
          </div>
          <div>
            <p className="text-champagne text-sm tracking-widest uppercase">{t('footer.explore')}</p>
            <ul className="mt-4 space-y-2 text-sm text-ivory/70">
              {nav.map((n) => <li key={n.key}><a href={n.href} className="hover:text-champagne">{n.label}</a></li>)}
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
        <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/40">© {new Date().getFullYear()} {company}. {t('footer.rights')}</div>
      </footer>
    </div>
  );
}

// keep menuOpen state local-ish via a small hook is overkill; use simple approach
