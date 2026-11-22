export const seedSettings: Record<string, string> = {
  company_name: 'آلامee',
  tagline: 'ساختمان‌های فردا',
  hero_title: 'ما اعیاد می‌سازیم، نه فقط ساختمان',
  hero_subtitle: 'معماری، مهندسی و توسعه لوکس — در سه‌بعدی طراحی، در واقعیت ساخته می‌شود.',
  primary_color: '#C9A96A',
  background_color: '#0A0A0B',
  font_family: 'Vazirmatn',
  rotation_speed: '0.35',
  camera_speed: '1',
  lighting_intensity: '1.2',
  contact_email: 'info@alamee.com',
  contact_phone: '+31 20 240 0000',
  contact_address: 'Herengracht 420, Amsterdam, Netherlands',
  stats_projects: '128',
  stats_years: '18',
  stats_area: '2.4M',
  stats_team: '340'
};

export const seedProjects = [
  { id: 'p1', title: 'آسمان‌خراش مریدین', slug: 'meridian-tower', description: 'یک پیکره شیشه‌ای 42 طبقه در افق زوئیداس با باغ‌های آسمانی و تاج طلای شامپین.', location: 'Amsterdam, Netherlands', category: 'تجاری', status: 'تکمیل‌شده', completion_date: '2024-06-15', area_sqm: 68000, floors: 42, units: 0, cover_image: '/images/3d-facade.png', is_published: true, sort_order: 1 },
  { id: 'p2', title: 'ویلا لومییر', slug: 'villa-lumiere', description: 'ویلای ساحلی خصوصی با استخر بی‌پایان، spa خصوصی و دیوارهای شیشه‌ای پانورمی.', location: 'Rotterdam, Netherlands', category: 'مسکونی', status: 'تکمیل‌شده', completion_date: '2023-11-02', area_sqm: 2400, floors: 3, units: 1, cover_image: '/images/3d-facade.png', is_published: true, sort_order: 2 },
  { id: 'p3', title: 'مسکونی اورليا', slug: 'aurelia-residences', description: 'آسمان‌خراش مسکونی لوکس با مجموعه پنت‌هاوس و باشگاه ساکنان.', location: 'Antwerp, Belgium', category: 'مسکونی', status: 'در جریان', completion_date: '2026-09-30', area_sqm: 45000, floors: 28, units: 180, cover_image: '/images/3d-facade.png', is_published: true, sort_order: 3 },
  { id: 'p4', title: 'هاون هاب تجاری', slug: 'haven-hub', description: 'هاب تجاری چندکارباره با آتریوم، طبقات کار مشترک و طبقهٔ فروشگاه.', location: 'Düsseldorf, Germany', category: 'تجاری', status: 'در جریان', completion_date: '2027-03-15', area_sqm: 52000, floors: 18, units: 0, cover_image: '/images/3d-facade.png', is_published: true, sort_order: 4 },
  { id: 'p5', title: 'پالازو ورد', slug: 'palazzo-verde', description: 'آسمان‌خراش اداری پایدار با نماهای زیستی و عملیات صفر-פחتی.', location: 'Paris, France', category: 'تجاری', status: 'پیش‌بینی', completion_date: '2028-01-20', area_sqm: 39000, floors: 22, units: 0, cover_image: '/images/3d-facade.png', is_published: true, sort_order: 5 },
  { id: 'p6', title: 'هتل کراون', slug: 'crown-hotel', description: 'هتل پنج ستاره و مسکونی‌های برند بالاتر از مرکز تاریخی.', location: 'Vienna, Austria', category: 'پذیرایی', status: 'پیش‌بینی', completion_date: '2028-06-10', area_sqm: 31000, floors: 26, units: 220, cover_image: '/images/3d-facade.png', is_published: true, sort_order: 6 }
];

export const seedServices = [
  { id: 's1', title: 'معماری', description: 'طراحی معماری برنده جایزه، از مفهوم تا اسناد جزئی ساخت.', icon: 'building', sort_order: 1, is_published: true },
  { id: 's2', title: 'ساخت‌وساز', description: 'اجرائی دقیق با تیم‌های درون‌سازمانی و کنترل کیفیت بی‌تسلیم.', icon: 'crane', sort_order: 2, is_published: true },
  { id: 's3', title: 'مهندسی', description: 'مهندسی سازه، لوله‌کشی و نما برای سخت‌ترین آسمان‌خراش‌ها.', icon: 'drafting', sort_order: 3, is_published: true },
  { id: 's4', title: 'دکوراسیون داخلی', description: 'دکوراسیون سفارشی — مارس، برنز، بلوط — بر اساس هر نشانه.', icon: 'sofa', sort_order: 4, is_published: true },
  { id: 's5', title: 'توسعه املاک', description: 'توسعه کامل: زمین، مجوزها، مالیات، ساخت و تحویل.', icon: 'key', sort_order: 5, is_published: true }
];

export const seedSections = [
  { id: 'sec1', key: 'hero', title: 'ما اعیاد می‌سازیم', subtitle: 'نه فقط ساختمان', content: 'هرو سه‌بعدی سینمایی', enabled: true, sort_order: 1 },
  { id: 'sec2', key: 'about', title: 'درباره آلامee', subtitle: 'دو دهه تعالی معماری', content: 'آلامee یک موسسه لوکس ساخت‌وساز و توسعه است که نشانه‌های سراسر اروپا را خلق می‌کند.', enabled: true, sort_order: 2 },
  { id: 'sec3', key: 'projects', title: 'کارهای برگزیده', subtitle: 'نشانه‌های سراسر اروپا', content: 'گالری پروژه‌های لوکس', enabled: true, sort_order: 3 },
  { id: 'sec4', key: 'services', title: 'خدمات ما', subtitle: 'تعالی کامل از آغاز تا پایان', content: 'معماری، ساخت‌وساز، مهندسی، دکوراسیون داخلی، توسعه', enabled: true, sort_order: 4 },
  { id: 'sec5', key: 'process', title: 'فرایند کار', subtitle: 'از هدایت تا افق شهر', content: 'تایم‌لاین تعاملی ساخت', enabled: true, sort_order: 5 },
  { id: 'sec6', key: 'stats', title: 'به عدد', subtitle: 'اندازی ثابت‌شده', content: 'پروژه‌های تمام‌شده، سال‌ها، مساحت، تیم', enabled: true, sort_order: 6 },
  { id: 'sec7', key: 'contact', title: 'تماس', subtitle: 'شروع پروژه شما', content: 'فرم تعاملی تماس', enabled: true, sort_order: 7 }
];
