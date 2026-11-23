'use client';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';

export default function AboutPage() {
  const { t, lang } = useI18n();
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
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
          <img src="/images/interior-editorial.jpg" alt={lang === 'fa' ? 'تصویر مفهومی فضای داخلی' : 'Concept interior'} className="aspect-[4/3] w-full object-cover" />
          <div><p className="text-xs tracking-[.3em] text-champagne">OUR PHILOSOPHY</p><h2 className="mt-5 font-serif text-3xl leading-snug">{lang === 'fa' ? 'از یک ایده تا فضایی برای زندگی' : 'From an idea to a place for life'}</h2><p className="mt-5 leading-8 text-ivory/70">{lang === 'fa' ? 'ما معتقدیم معماری خوب از گفت‌وگو آغاز می‌شود. شناخت خواسته‌ها، بررسی موقعیت و انتخاب مصالح مناسب، پایه‌های طراحی ما هستند. در هر مرحله تلاش می‌کنیم زیبایی، کارایی و کیفیت اجرا در کنار هم قرار بگیرند.' : 'We believe good architecture starts with a conversation. Understanding your needs, the site and the right materials forms the foundation of our approach. Beauty, function and craft belong together at every step.'}</p><a href="/process" className="mt-6 inline-block border-b border-champagne pb-2 text-champagne">{lang === 'fa' ? 'با فرایند ما آشنا شوید' : 'Explore our process'} ↗</a></div>
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
        <div className="mt-16 border-t border-white/10 pt-12 text-center"><h2 className="font-serif text-3xl">{lang === 'fa' ? 'داستان بعدی را با هم بسازیم' : 'Let’s create the next story together'}</h2><a href="/contact" className="mt-6 inline-block rounded-full bg-champagne px-8 py-3 font-semibold text-graphite">{lang === 'fa' ? 'گفتگو درباره پروژه' : 'Discuss your project'} ↗</a></div>
      </section>
    </PageShell>
  );
}
