import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'آراما — ساخت‌وساز و توسعه لوکس سه‌بعدی',
  description: 'آراما، نشانه‌های لوکس سراسر اروپا را می‌سازد. معماری، ساخت‌وساز، مهندسی، دکوراسیون داخلی و توسعه.',
  keywords: 'ساخت‌وساز لوکس, معماری, توسعه, آمستردام, آسمان‌خراش, سه‌بعدی',
  openGraph: {
    title: 'آراما — ساخت‌وساز و توسعه لوکس سه‌بعدی',
    description: 'ما اعیاد می‌سازیم، نه فقط ساختمان',
    type: 'website',
    images: ['/images/hero-3d.png']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300..800&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
