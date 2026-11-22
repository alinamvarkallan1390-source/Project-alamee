# آلامee — وبسایت سه‌بعدی لوکس سازندگان و املاک

[![تغییر زبان](https://img.shields.io/badge/Language-Persian-blue)](#) [![stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Three.js%20%7C%20Supabase-DARKGREEN)](#)

> **آدرس سایت زنده: https://alamee-construction-m19ucq0cx.vercel.app**
>
> **صفحه مدیریت (ادمین): https://alamee-construction-m19ucq0cx.vercel.app/admin**

آلامee یک وبسایت سه‌بعدی تشریفاتی برای یک شرکت لوکس ساخت‌وساز، املاک و  ساختمانی است که با استانداردهای آواردز و اپل طراحی شده است. تجربه اصلی یک ساختمان آسمان‌خراش سه‌بعدی مهی‌کننده است که در میان اسکرول، دوربین به‌شکل سینمایی ۳۶۰° حول ساختمان می‌چرخد، با شیشه‌های واقع‌گرایانه، نورپردازی معماری، بالکن، پنجره‌ها و سایه‌روشن‌های محیطی.

---

## ✨ امکانات کلیدی

### 🏗️ تجربه سه‌بعدی سینمایی
- **آسمان‌خراش سه‌بعدی واقع‌گرایانه** با تکنیک‌های WebGL (Three.js / React Three Fiber)
- **حرکت دوربین ۳۶۰° همگام با اسکرول** و انتقال‌های سینمایی بین بخش‌ها
- **شیشه‌های با انعکاس واقع‌گرایانه**، نورپردازی معماری، بالکن و پنجره‌های detail
- **سایه‌روشن محیطی**، عمق، افکت‌های اتمسفریک و انتقال‌های سینمایی
- **تعاملی بودن**: می‌توانید با کشیدن دوربین، ساختمان را بچرخانید
- **کیفیت تطبیقی**: گرافیک بر اساس قدرت دستگاه تنظیم می‌شود و روی موبایل حجم، وضوح و سایه‌روشن کاهش می‌یابد

### 📑 بخش‌های وبسایت
1. **هرو سه‌بعدی سینمایی** — لوگو، ناوبری لوکس، هدر انیمیشنی، نشان‌دهنده اسکرول
2. **درباره ما** — معرفی شرکت، محیط سه‌بعدی، تاریخچه و دستاوردها
3. **پروژه‌ها** — گالری پروژه‌های لوکس، جزئیات، لوکیشن، تاریخ اتمام، مشخصات، فیلتر بر اساس دسته‌بندی و وضعیت
4. **خدمات** — معماری، ساخت‌وساز، مهندسی، دکوراسیون داخلی، توسعه املاک
5. **فرایند کار** — تایم‌لاین تعاملی با مراحل سه‌بعدی ساخت
6. **آمار** — شمارنده‌های انیمیشنی (پروژه‌های تمام‌شده، سال‌ها سابقه، مساحت، تیم)
7. **تماس** — فرم تعاملی، تلفن، ایمیل، آدرس، شبکه‌های اجتماعی و نقشه گوگل
8. **فूटر** — طراحی لوکس با ناوبری و اطلاعات شرکت

### 🛡️ پنل مدیریت پیشرفته (`/admin`)
پنل مدیریت کامل و امنیت‌بلند که هر جنبه‌ای از وبسایت را بدون کدنویسی مدیریت می‌کند:

- **مدیریت محتوای کامل**: ویرایش هر هدر و پاراگراف، اضافه/ویرایش/حذف و ردیف‌بندی بخش‌ها، فعال/غیرفعال‌سازی، تغییر دکمه‌ها و ناوبری
- **مدیریت SEO**: مدیریت عنوان و توضیحات سئو
- **مدیریت تصویر**: آپلود، جایگزینی، حذف، گالری، caption و alt-text، آپلود چند تصویر، پیش‌نمایش تغییرات
- **مدیریت سه‌بعدی**: آپلود و جایگزینی مدل‌های GLB/GLTF، تغییر scale و position، سرعت چرخش، نورپردازی و محیط
- **مدیریت پروژه**: CRUD بی‌حد، آپلود تصویر، اضافه‌کردن مدل سه‌بعدی، وضعیت و دسته‌بندی، publish/unpublish
- **مدیریت ظاهر**: رنگ، فونت، پس‌زمینه، اسپیسی‌نگ، انیمیشن، لوگو و favicon
- **داشبورد**: آمار ویزیت، پیام‌های فرم تماس، آمار پروژه‌ها، فعالیت‌های اخیر، فضای ذخیره‌سازی
- **سیستم publish**: پیش‌نمایش زنده، ذخیره draft، publish، rollback به نسخه‌های قبلی، تایید قبل از عملیات حذفی

> **همه تغییرات مدیریتی واقعاً از طریق پایگاه داده persistent روی وبسایت عمومی اعمال می‌شوند** — هیچ کنترل تزئینی یا غیرعملکردی وجود ندارد.

---

## 🧱 ساختار فنی

| بخش | تکنولوژی |
|---|---|
| فرانت‌اند | Next.js 14 · React 18 · TypeScript · Tailwind CSS |
| سه‌بعدی | Three.js · React Three Fiber · drei |
| انیمیشن | GSAP |
| پایگاه داده | Supabase (PostgreSQL) — با RLS و policies |
| ذخیره‌سازی | Supabase Storage (buckets: `media`، `models`) |
| بک‌اند API | Next.js API Routes (production-ready) |
| بک‌اند مرجع | ASP.NET Core (.NET) — متن‌کد کامل در `backend/`، مستند برای اجرای مستقل |
| Auth | SHA256 + token امن، رویه‌های protected، RBAC |
| هلد | Vercel |

### 📁 ساختار Repo
```
├── frontend/                 # وبسایت Next.js + پنل ادمین + API routes
│   ├── app/                  # pages، پنل admin، API routes
│   ├── components/           # Skyscraper3D (سه‌بعدی اصلی)
│   └── lib/                  # supabase client، api client، auth، seed
├── backend/Alamee.Api/       # ASP.NET Core (.NET) — استاکر مرجع
│   ├── Controllers/          # Auth، Projects، Content، Upload، Versions، SignalR hub
│   ├── Models/               # Entity Framework Core entities
│   ├── Data/                 # AppDbContext
│   ├── Services/             # TokenService، AuditService
│   └── Migrations/           # Migrations (با `dotnet ef` تولید شود)
└── docs/                     # اسناد
```

---

## 🚀 راه‌اندازی

### پیش‌نیازها
- Node.js 18+ و npm
- یک پروژه Supabase با PostgreSQL

### قدم‌ها
```bash
# ۱. نصب dependencies
cd frontend
npm install

# ۲. تنظیم environment variables (مدل .env.example را کپی کنید)
cp .env.example .env.local

# ۳. اجرای dev
npm run dev
# → http://localhost:3000
```

### متغیرهای محیطی (`.env.local`)
| متغیر | توضیح |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | آدرس پروژه Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key Supabase (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key (server-side) |
| `ADMIN_JWT_SECRET` | کلید امضای token ادمین |

### ورود به پنل مدیریت
- **آدرس**: `/admin`
- **ایمیل**: `admin@alamee.com`
- **رمز عبور**: `Admin@2026!`

> در نسخه production، مدیر از طریق پایگاه داده Supabase seed شده است.

---

## 🛠️ اجرای بک‌اند ASP.NET Core (سفارشی)

سرویس .NET به‌صورت استاکر مرجع کامل در `backend/Alamee.Api` وجود دارد و با یک PostgreSQL (مانند Supabase Pooler) قابل اجراست:

```bash
cd backend/Alamee.Api
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

- **Swagger / OpenAPI**: `/swagger`
- **SignalR hub**: `/hubs/presence`
- **Docker**: `docker compose up` در مسیر `backend/`

> در این محیط، `dotnet` نصب نبود، بنابراین بک‌اند .NET به‌صورت کامل نوشته و مستند شده، اما build آن در این sandbox انجام نشد. APIهای زنده از طریق Next.js API routes که از همان پایگاه داده Supabase استفاده می‌کنند، تأمین می‌شوند.

---

## 📱 پاسخگویی

طراحی کاملاً responsive برای دسکتاپ، لپ‌تاپ، تبلت، موبایل، آیفون و اندروید کوچک. تجربه سه‌بعدی به‌صورت جداگانه روی موبایل optimized شده (کاهش جزئیات، dpr cap، غیرفعال‌سازی سایه‌روشن)، با پشتیبانی لمسی و اسکرول روان، و بدون overflow افقی.

---

## 🎨 هدیه طراحی
- پس‌زمینه‌های گرافیت و مشکی
- رنگ‌های شampagne طلایی
- تایپوگرافی سفید الegan
- glassmorphism به‌صورت انتخابی
- نورپردازی سینمایی و micro-interactions

---

## 📄 محتوای نمونه
محتوای نمونه واقع‌گرایانه و assets معماری حرفه‌ای placeholder تا زمانی که صاحب وبسایت المواد خود را آپلود کند، استفاده شده است.

---

© **ALAMEE** — ساخت‌معماری لوکس در سه‌بعدی.
