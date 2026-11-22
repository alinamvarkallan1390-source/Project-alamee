'use client';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';

export default function ServicesPage() {
  const { t } = useI18n();
  const tc = useContent();
  const { services, sec } = useSiteData();

  return (
    <PageShell active="services">
      <section className="mx-auto max-w-6xl px-6 pt-40 pb-20">
        <div className="reveal text-center">
          <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('services').subtitle || t('services.subtitle'))}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl">{tc(sec('services').title || t('services.title'))}</h1>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.id} className="reveal glass rounded-3xl p-8 hover:border-champagne/50 transition">
              <span className="font-serif text-5xl gold-text">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-serif text-2xl">{tc(s.title)}</h3>
              <p className="mt-3 text-sm text-ivory/70 leading-relaxed">{tc(s.description)}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
