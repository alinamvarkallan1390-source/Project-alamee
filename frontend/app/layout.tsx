import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ALAMEE — Luxury Construction & Development',
  description: 'ALAMEE builds ultra-premium landmarks across Europe. Architecture, construction, engineering, interiors and development.',
  keywords: 'luxury construction, architecture, development, Amsterdam, skyscraper',
  openGraph: {
    title: 'ALAMEE — Luxury Construction & Development',
    description: 'We Build Icons. Not Just Buildings.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
