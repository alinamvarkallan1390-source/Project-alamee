'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'fa' | 'en';

type Dict = Record<string, string>;

const fa: Dict = {
  // nav / common
  'nav.about': 'درباره ما',
  'nav.projects': 'پروژه‌ها',
  'nav.services': 'خدمات',
  'nav.process': 'فرایند',
  'nav.contact': 'تماس',
  'nav.lang': 'EN',
  'nav.langTip': 'تبدیل زبان',
  // hero
  'hero.tagline': 'ساختمان‌های فردا',
  'hero.title': 'ما اعیاد می‌سازیم، نه فقط ساختمان',
  'hero.subtitle': 'معماری، مهندسی و توسعه لوکس — در سه‌بعدی طراحی، در واقعیت ساخته می‌شود.',
  'hero.explore': 'بازدید از پروژه‌ها',
  'hero.start': 'شروع پروژه',
  'hero.scroll': 'برای کشف اسکرول کنید',
  'hero.drag': 'برای چرخاندن آسمان‌خراش کشیده، برای تور سینمایی ۳۶۰° اسکرول کنید',
  // about
  'about.subtitle': 'دو دهه تعالی معماری',
  'about.title': 'درباره آلامee',
  'about.content': 'آلامee یک موسسه لوکس ساخت‌وساز و توسعه است که با معماری، مهندسی و دکوراسیون داخلی درون‌ساخت، marquee‌های سراسر اروپا — از آسمان‌خراش‌های شیشه‌ای تا ویلاهای خصوصی — را خلق می‌کند.',
  'about.f1.t': '۲۰۰۷ — تأسیس',
  'about.f1.d': 'در آمستردام با یک ساختمان و استانداردی بی‌تسلیم تولد شد.',
  'about.f2.t': '۱۲۸ نشانه',
  'about.f2.d': 'در هلند، بلژیک، آلمان، فرانسه و اتریش احداث شده‌اند.',
  'about.f3.t': 'طراحی و ساخت',
  'about.f3.d': 'یک تیم پاسخگو از اولین نقاشی تا تحویل کلید نهایی.',
  // projects
  'projects.subtitle': 'نشانه‌های سراسر اروپا',
  'projects.title': 'کارهای برگزیده',
  'projects.cat': 'دسته‌بندی',
  'projects.status': 'وضعیت',
  'projects.none': 'هیچ پروژه‌ای با این فیلتر وجود ندارد.',
  'projects.view': 'مشاهده جزئیات',
  'projects.all': 'همه',
  // services
  'services.subtitle': 'تعالی کامل از آغاز تا پایان',
  'services.title': 'چه چیزی انجام می‌دهیم',
  // process
  'process.subtitle': 'از هدایت تا افق شهر',
  'process.title': 'فرایند ما',
  'process.1.t': 'مسیر و امکان‌سنجی',
  'process.1.d': 'بررسی مکان،เค้าмонт و بازرسی سه‌بعدی سینمایی پیش از هر सरकारी مجوز.',
  'process.2.t': 'طراحی و مهندسی',
  'process.2.d': 'معماری، سازه و لوله‌کشی به‌صورت یک مدل یکپارچه مهندسی می‌شوند.',
  'process.3.t': 'ساخت',
  'process.3.d': 'تیم‌های درون‌سازمانی، پیشرفت هفتگی با پهباد و یک محور پاسخگویی.',
  'process.4.t': 'دکوراسیون و تحویل',
  'process.4.d': 'دکوراسیون سفارشی، تحویل بدون ایراد و ضمانت ۱۰ ساله صنعت‌گری.',
  // stats
  'stats.projects': 'پروژه‌های تمام‌شده',
  'stats.years': 'سال سابقه',
  'stats.area': 'متر مربع ساخته‌شده',
  'stats.team': 'عضو تیم',
  // contact
  'contact.subtitle': 'شروع پروژه شما',
  'contact.title': 'تماس',
  'contact.name': 'نام کامل',
  'contact.email': 'ایمیل',
  'contact.phone': 'تلفن',
  'contact.subject': 'موضوع',
  'contact.message': 'درباره پروژه خود بنویسید…',
  'contact.send': 'ارسال پیام',
  'contact.sentOk': 'با خرسندی. تیم ما حداکثر ظرف ۲۴ ساعت پاسخ می‌دهد.',
  'contact.sentErr': 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
  'contact.phoneLabel': 'تلفن:',
  'contact.emailLabel': 'ایمیل:',
  'contact.addressLabel': 'آدرس:',
  'contact.map': 'نقشه دفتر آلامee',
  // footer
  'footer.explore': 'بازرس',
  'footer.contact': 'تماس',
  'footer.follow': 'دنبال کنید',
  'footer.rights': 'همه حقوق محفوظ است.',
  'footer.tagline': 'ساختمان‌های فردا',
  // modal
  'modal.completion': 'تاریخ اتمام',
  'modal.area': 'مساحت',
  'modal.floors': 'طبقات',
  'modal.units': 'واحدها',
  'modal.discuss': 'مشاوره در پروژه مشابه',
  'modal.close': 'بستن',
  // admin (shared bits)
  'admin.title': 'پنل مدیریت',
  'admin.login': 'ورود',
  'admin.email': 'ایمیل',
  'admin.password': 'رمز عبور',
  'admin.signin': 'ورود',
  'admin.signing': 'در حال ورود…',
  'admin.back': 'برگشت به وبسایت',
  'admin.invalid': 'ایمیل یا رمز عبور اشتباه است.'
};

const en: Dict = {
  'nav.about': 'About',
  'nav.projects': 'Projects',
  'nav.services': 'Services',
  'nav.process': 'Process',
  'nav.contact': 'Contact',
  'nav.lang': 'FA',
  'nav.langTip': 'Switch language',
  'hero.tagline': "Building Tomorrow's Landmarks",
  'hero.title': 'We Build Icons. Not Just Buildings.',
  'hero.subtitle': 'Ultra-premium architecture, engineering and development — crafted in 3D, delivered in reality.',
  'hero.explore': 'Explore Projects',
  'hero.start': 'Start a Project',
  'hero.scroll': 'Scroll to explore',
  'hero.drag': 'Drag to orbit the tower · Scroll for a 360° cinematic tour',
  'about.subtitle': 'Two decades of architectural excellence',
  'about.title': 'About ALAMEE',
  'about.content': 'ALAMEE is a luxury construction and development house crafting landmarks across Europe — from glass towers to private villas — with in-house architecture, engineering and interiors.',
  'about.f1.t': '2007 — Founded',
  'about.f1.d': 'Born in Amsterdam with a single tower and an uncompromising standard.',
  'about.f2.t': '128 Landmarks',
  'about.f2.d': 'Delivered across the Netherlands, Belgium, Germany, France and Austria.',
  'about.f3.t': 'Design-Build',
  'about.f3.d': 'One accountable team from first sketch to final key handover.',
  'projects.subtitle': 'Landmarks across Europe',
  'projects.title': 'Selected Works',
  'projects.cat': 'Category',
  'projects.status': 'Status',
  'projects.none': 'No projects match this filter.',
  'projects.view': 'View details',
  'projects.all': 'All',
  'services.subtitle': 'End-to-end excellence',
  'services.title': 'What We Do',
  'process.subtitle': 'From vision to skyline',
  'process.title': 'Our Process',
  'process.1.t': 'Vision & Feasibility',
  'process.1.d': 'Site study, massing and a cinematic 3D walkthrough before a single brick is laid.',
  'process.2.t': 'Design & Engineering',
  'process.2.d': 'Architecture, structure and MEP engineered as one integrated model.',
  'process.3.t': 'Construction',
  'process.3.d': 'In-house teams, weekly drone progress and a single point of accountability.',
  'process.4.t': 'Interiors & Handover',
  'process.4.d': 'Bespoke interiors, snag-free delivery and a 10-year craftsmanship warranty.',
  'stats.projects': 'Completed Projects',
  'stats.years': 'Years of Experience',
  'stats.area': 'Sqm Built',
  'stats.team': 'Team Members',
  'contact.subtitle': 'Start your project',
  'contact.title': 'Contact',
  'contact.name': 'Full name',
  'contact.email': 'Email',
  'contact.phone': 'Phone',
  'contact.subject': 'Subject',
  'contact.message': 'Tell us about your project…',
  'contact.send': 'Send Message',
  'contact.sentOk': 'Thank you. Our team will reply within 24 hours.',
  'contact.sentErr': 'Something went wrong. Please try again.',
  'contact.phoneLabel': 'Phone:',
  'contact.emailLabel': 'Email:',
  'contact.addressLabel': 'Address:',
  'contact.map': 'ALAMEE office map',
  'footer.explore': 'Explore',
  'footer.contact': 'Contact',
  'footer.follow': 'Follow',
  'footer.rights': 'All rights reserved.',
  'footer.tagline': "Building Tomorrow's Landmarks",
  'modal.completion': 'Completion',
  'modal.area': 'Area',
  'modal.floors': 'Floors',
  'modal.units': 'Units',
  'modal.discuss': 'Discuss a Similar Project',
  'modal.close': 'Close',
  'admin.title': 'Admin Panel',
  'admin.login': 'Login',
  'admin.email': 'Email',
  'admin.password': 'Password',
  'admin.signin': 'Sign In',
  'admin.signing': 'Signing in…',
  'admin.back': 'Back to website',
  'admin.invalid': 'Invalid email or password.'
};

const dictionaries: Record<Lang, Dict> = { fa, en };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const Ctx = createContext<I18nCtx>({ lang: 'fa', setLang: () => {}, t: (k) => k, dir: 'rtl' });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fa');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('alamee_lang')) as Lang | null;
    if (saved === 'fa' || saved === 'en') setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('alamee_lang', lang);
    document.documentElement.lang = lang === 'fa' ? 'fa' : 'en';
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key;

  return (
    <Ctx.Provider value={{ lang, setLang: setLangState, t, dir: lang === 'fa' ? 'rtl' : 'ltr' }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  return useContext(Ctx);
}

/** Translate known DB content (Persian default) to English when needed. */
const enContentMap: Record<string, string> = {
  // company / hero
  'آلامee': 'ALAMEE',
  'ما اعیاد می‌سازیم، نه فقط ساختمان': 'We Build Icons. Not Just Buildings.',
  'ما اعیاد می‌سازیم': 'We Build Icons',
  'نه فقط ساختمان': 'Not Just Buildings',
  'ساختمان‌های فردا': "Building Tomorrow's Landmarks",
  'دو دهه تعالی معماری': 'Two decades of architectural excellence',
  // sections titles
  'درباره آلامee': 'About ALAMEE',
  'کارهای برگزیده': 'Selected Works',
  'خدمات ما': 'What We Do',
  'فرایند کار': 'Our Process',
  'به عدد': 'By The Numbers',
  'تماس': 'Contact',
  // section subtitles
  'نشانه‌های سراسر اروپا': 'Landmarks across Europe',
  'تعالی کامل از آغاز تا پایان': 'End-to-end excellence',
  'از هدایت تا افق شهر': 'From vision to skyline',
  'اندازی ثابت‌شده': 'Proven scale',
  'شروع پروژه شما': 'Start your project',
  // project titles
  'آسمان‌خراش مریدین': 'The Meridian Tower',
  'ویلا لومییر': 'Villa Lumière',
  'مسکونی اورليا': 'The Aurelia Residences',
  'هاون هاب تجاری': 'Haven Commercial Hub',
  'پالازو ورد': 'Palazzo Verde',
  'هتل کراون': 'The Crown Hotel',
  // statuses / categories
  'تکمیل‌شده': 'Completed',
  'در جریان': 'Ongoing',
  'پیش‌بینی': 'Planned',
  'تجاری': 'Commercial',
  'مسکونی': 'Residential',
  'پذیرایی': 'Hospitality',
  // services
  'معماری': 'Architecture',
  'ساخت‌وساز': 'Construction',
  'مهندسی': 'Engineering',
  'دکوراسیون داخلی': 'Interior Design',
  'توسعه املاک': 'Real Estate Development'
};

/** Use for content coming from DB: returns English translation when lang=en. */
export function useContent() {
  const { lang } = useI18n();
  return (value: string | undefined | null) => {
    const v = value || '';
    if (lang === 'fa' || !v) return v;
    return enContentMap[v] || v;
  };
}
