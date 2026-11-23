'use client';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';

export default function ServicesPage() {
  const { t, lang } = useI18n();
  const tc = useContent();
  const { services, sec } = useSiteData();

  return (
    <PageShell active="services">
      <section className="mx-auto max-w-6xl px-6 pt-40 pb-20">
        <div className="reveal text-center">
          <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('services').subtitle || t('services.subtitle'))}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl">{tc(sec('services').title || t('services.title'))}</h1>
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-center leading-8 text-ivory/65">{lang === 'fa' ? 'از شناخت و طراحی تا اجرا و تحویل، هر مرحله را با نگاهی دقیق به جزئیات و نیازهای پروژه دنبال می‌کنیم.' : 'From discovery and design to construction and delivery, we approach each stage with attention to detail and your project’s needs.'}</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.id} className="reveal glass rounded-3xl p-8 hover:border-champagne/50 transition">
              <span className="font-serif text-5xl gold-text">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-serif text-2xl">{tc(s.title)}</h3>
              <p className="mt-3 text-sm text-ivory/70 leading-relaxed">{tc(s.description)}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid overflow-hidden border border-white/10 md:grid-cols-2"><img src="/images/interior-editorial.jpg" alt="" className="h-full min-h-64 w-full object-cover" /><div className="bg-coal p-8 md:p-12"><p className="text-xs tracking-[.3em] text-champagne">MADE FOR YOU</p><h2 className="mt-5 font-serif text-3xl">{lang === 'fa' ? 'هر پروژه، یک مسیر منحصربه‌فرد' : 'A unique path for every project'}</h2><p className="mt-5 leading-8 text-ivory/65">{lang === 'fa' ? 'چه در ابتدای یک ایده باشید و چه آماده ساخت، می‌توانیم درباره نیازها، مراحل و چشم‌انداز پروژه شما گفتگو کنیم.' : 'Whether you are exploring an idea or ready to build, let’s talk about your needs, the process and your vision.'}</p><a href="/contact" className="mt-6 inline-block border-b border-champagne pb-2 text-champagne">{lang === 'fa' ? 'شروع گفتگو' : 'Start a conversation'} ↗</a></div></div>
      </section>
    </PageShell>
  );
}
