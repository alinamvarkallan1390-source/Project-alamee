'use client';
import dynamic from 'next/dynamic';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';

const Skyscraper3D = dynamic(() => import('@/components/Skyscraper3D'), { ssr: false, loading: () => <div className="absolute inset-0 bg-[#171a19]" /> });

export default function Home() {
  const { t, lang } = useI18n();
  const tc = useContent();
  const { settings, projects, services } = useSiteData();
  const fa = lang === 'fa';
  return (
    <PageShell active="home">
      <section className="relative mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-0 px-6 pb-16 pt-28 md:grid-cols-2 md:px-12 md:pt-32">
        <div className="relative order-2 z-10 pb-8 pt-4 md:order-1 md:py-20">
          <p className="text-xs tracking-[.3em] text-champagne uppercase">ALAMEE · Architecture & Construction</p>
          <h1 className="mt-6 max-w-xl font-serif text-4xl leading-[1.35] md:text-6xl">{settings.hero_title && settings.hero_title !== 'ما اعیاد می‌سازیم، نه فقط ساختمان' ? tc(settings.hero_title) : (fa ? 'فضاهایی برای زندگی، بناهایی برای ماندن' : 'Spaces for life. Built to last.')}</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-ivory/75 md:text-lg">{tc(settings.hero_subtitle || (fa ? 'از اولین ایده تا آخرین جزئیات، آینده را با دقت و خیال می‌سازیم.' : 'From the first idea to the final detail, we build the future with imagination and care.'))}</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="/projects" className="rounded-full bg-champagne px-8 py-3 font-semibold text-graphite transition hover:bg-champagneLight">{t('hero.explore')} ↗</a><a href="/contact" className="rounded-full border border-ivory/40 px-8 py-3 transition hover:border-champagne hover:text-champagne">{t('hero.start')}</a></div>
          <p className="mt-10 text-xs tracking-widest text-ivory/60">{fa ? 'برای کشف بیشتر اسکرول کنید ↓' : 'SCROLL TO EXPLORE ↓'}</p>
        </div>
        <div className="relative order-1 h-[48svh] min-h-[320px] overflow-hidden rounded-3xl border border-white/15 shadow-2xl md:order-2 md:h-[75svh] md:min-h-[540px]">
          <Skyscraper3D lighting={parseFloat(settings.lighting_intensity || '1.2')} />
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] tracking-widest text-ivory/80">{fa ? 'مدل مفهومی • برای چرخاندن بکشید ↔' : 'CONCEPT MODEL • DRAG TO ROTATE ↔'}</span>
        </div>
      </section>

      <div className="relative bg-[#101011]">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:px-12 md:py-36">
          <div>
            <p className="text-xs tracking-[.3em] text-champagne uppercase">01 / {fa ? 'نگاه ما' : 'OUR APPROACH'}</p>
            <h2 className="mt-6 font-serif text-3xl leading-snug md:text-5xl">{fa ? 'معماری، هنر ساختن تجربه است.' : 'Architecture is the art of creating experiences.'}</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-ivory/65">{fa ? 'هر پروژه با یک ایده آغاز می‌شود؛ ایده‌ای که با شناخت مکان، نور، متریال و نیاز آدم‌ها شکل می‌گیرد. ما طراحی و اجرا را به هم پیوند می‌دهیم تا فضاهایی خلق شوند که امروز چشمگیر و فردا همچنان ارزشمند باشند.' : 'Every project begins with an idea shaped by place, light, materials and people. We bring design and construction together to create spaces that feel remarkable today and meaningful tomorrow.'}</p>
            <a href="/about" className="mt-8 inline-block border-b border-champagne pb-2 text-sm text-champagne">{fa ? 'بیشتر درباره ما' : 'More about us'} ↗</a>
          </div>
          <div className="relative"><img src="/images/editorial-architecture.jpg" alt={fa ? 'تصویر مفهومی معماری معاصر' : 'Concept image of contemporary architecture'} className="aspect-[4/3] w-full rounded-sm object-cover" /><p className="mt-3 text-xs text-ivory/40">{fa ? 'تصویر مفهومی معماری' : 'ARCHITECTURAL CONCEPT IMAGE'}</p></div>
        </section>

        <section className="border-t border-white/10 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs tracking-[.3em] text-champagne">02 / {fa ? 'مجموعه پروژه‌ها' : 'THE COLLECTION'}</p><h2 className="mt-5 font-serif text-3xl md:text-5xl">{fa ? 'ایده‌هایی که شکل می‌گیرند' : 'Ideas taking shape'}</h2></div><a href="/projects" className="border-b border-champagne pb-2 text-sm text-champagne">{fa ? 'مشاهده همه پروژه‌ها' : 'Explore all projects'} ↗</a></div>
            <div className="mt-12 grid gap-7 md:grid-cols-3">{projects.slice(0, 3).map((p, i) => <a href="/projects" key={p.id} className="group"><div className="overflow-hidden bg-coal"><img src={p.cover_image || '/images/editorial-architecture.jpg'} alt={tc(p.title)} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /></div><div className="mt-5 flex justify-between gap-4"><div><p className="text-xs text-champagne">0{i + 1} / {tc(p.category)}</p><h3 className="mt-2 font-serif text-2xl">{tc(p.title)}</h3><p className="mt-2 text-sm text-ivory/50">{p.location}</p></div><span className="text-champagne">↗</span></div></a>)}</div>
            <p className="mt-8 text-xs text-ivory/40">{fa ? 'تصاویر و پروژه‌های نمونه تا زمان جایگزینی با محتوای واقعی نمایش داده می‌شوند.' : 'Sample projects and imagery are shown until replaced with actual content.'}</p>
          </div>
        </section>

        <section className="border-t border-white/10 px-6 py-24 md:px-12"><div className="mx-auto max-w-7xl"><p className="text-xs tracking-[.3em] text-champagne">03 / {fa ? 'تخصص ما' : 'OUR EXPERTISE'}</p><div className="mt-6 grid gap-10 md:grid-cols-2"><h2 className="font-serif text-3xl leading-snug md:text-5xl">{fa ? 'از تصور تا ساخت، کنار شما.' : 'From vision to reality, together.'}</h2><p className="max-w-xl leading-8 text-ivory/65">{fa ? 'نگاهی یکپارچه به تمام مراحل پروژه؛ از طراحی مفهومی و مهندسی تا ساخت و طراحی داخلی، با توجه به کیفیت هر جزئیات.' : 'An integrated approach to every stage, from concept and engineering to construction and interiors, with attention to every detail.'}</p></div><div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">{services.slice(0, 6).map((s, i) => <div key={s.id} className="bg-[#151515] p-8"><span className="text-xs text-champagne">0{i + 1}</span><h3 className="mt-6 font-serif text-2xl">{tc(s.title)}</h3><p className="mt-4 text-sm leading-7 text-ivory/60">{tc(s.description)}</p></div>)}</div><a href="/services" className="mt-8 inline-block border-b border-champagne pb-2 text-sm text-champagne">{fa ? 'تمام خدمات' : 'All services'} ↗</a></div></section>
        <section className="border-t border-white/10 px-6 py-24 text-center md:py-32"><p className="text-xs tracking-[.3em] text-champagne">LET’S CREATE SOMETHING LASTING</p><h2 className="mx-auto mt-6 max-w-3xl font-serif text-3xl leading-snug md:text-5xl">{fa ? 'ایده‌ای در ذهن دارید؟ بیایید درباره آن صحبت کنیم.' : 'Have an idea in mind? Let’s talk about it.'}</h2><a href="/contact" className="mt-9 inline-block rounded-full bg-champagne px-9 py-4 font-semibold text-graphite">{fa ? 'شروع گفتگو' : 'Start a conversation'} ↗</a></section>
      </div>
    </PageShell>
  );
}
