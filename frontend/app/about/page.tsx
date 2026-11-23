'use client';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';

export default function AboutPage() {
  const { t } = useI18n();
  const tc = useContent();
  const { settings, sec } = useSiteData();

  return (
    <PageShell active="about">
      <section className="mx-auto max-w-6xl px-6 pt-40 pb-20">
        <div className="reveal text-center">
          <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('about').subtitle || t('about.subtitle'))}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl">{tc(sec('about').title || t('about.title'))}</h1>
          <div className="gold-line mx-auto my-8 w-24" />
        </div>
        <div className="reveal glass mt-10 rounded-3xl p-8 md:p-14">
          <p className="max-w-3xl text-lg text-ivory/75 leading-relaxed">{tc(sec('about').content || t('about.content'))}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { t: t('about.f1.t'), d: t('about.f1.d') },
            { t: t('about.f2.t'), d: t('about.f2.d') },
            { t: t('about.f3.t'), d: t('about.f3.d') }
          ].map((c) => (
            <div key={c.t} className="reveal glass rounded-2xl p-6 text-center">
              <h3 className="font-serif text-xl text-champagne">{c.t}</h3>
              <p className="mt-2 text-sm text-ivory/70">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
