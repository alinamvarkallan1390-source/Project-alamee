'use client';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';

export default function ProcessPage() {
  const { t } = useI18n();
  const tc = useContent();
  const { sec } = useSiteData();

  const steps = [
    { t: t('process.1.t'), d: t('process.1.d') },
    { t: t('process.2.t'), d: t('process.2.d') },
    { t: t('process.3.t'), d: t('process.3.d') },
    { t: t('process.4.t'), d: t('process.4.d') }
  ];

  return (
    <PageShell active="process">
      <section className="mx-auto max-w-5xl px-6 pt-40 pb-20">
        <div className="reveal text-center">
          <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('process').subtitle || t('process.subtitle'))}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl">{tc(sec('process').title || t('process.title'))}</h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/3d-process.png" alt="" className="reveal mx-auto mt-10 h-52 w-full max-w-2xl rounded-3xl border border-ivory/10 object-cover" loading="lazy" />
        <div className="relative mt-14 space-y-8 before:absolute before:start-[19px] before:top-2 before:end-2 before:w-px before:bg-champagne/30 md:before:start-1/2 md:before:end-auto">
          {steps.map((s, i) => (
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
    </PageShell>
  );
}
