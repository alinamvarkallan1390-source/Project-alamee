'use client';
import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { useI18n, useContent } from '@/lib/i18n';
import { useSiteData } from '@/lib/useSiteData';
import { submitContact } from '@/lib/api';

export default function ContactPage() {
  const { t, lang } = useI18n();
  const tc = useContent();
  const { settings, sec } = useSiteData();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSent('');
    try {
      await submitContact(form);
      setSent(t('contact.sentOk'));
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch { setSent(lang === 'fa' ? 'پیام ارسال نشد. لطفاً دوباره تلاش کنید یا از طریق ایمیل تماس بگیرید.' : 'Your message could not be sent. Please try again or contact us by email.'); } finally { setSending(false); }
  };

  return (
    <PageShell active="contact">
      <section className="mx-auto max-w-6xl px-6 pt-40 pb-20">
        <div className="reveal text-center">
          <p className="text-xs tracking-[0.4em] text-champagne uppercase">{tc(sec('contact').subtitle || t('contact.subtitle'))}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl">{tc(sec('contact').title || t('contact.title'))}</h1>
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-center leading-8 text-ivory/65">{lang === 'fa' ? 'ایده، سوال یا پروژه‌ای در ذهن دارید؟ کمی درباره آن برای ما بنویسید تا گفتگو را از همان‌جا شروع کنیم.' : 'Have an idea, question or project in mind? Tell us a little about it and let’s start a conversation.'}</p>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="reveal glass rounded-3xl p-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('contact.name')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('contact.email')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t('contact.phone')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t('contact.subject')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
            </div>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t('contact.message')} className="w-full rounded-xl border border-ivory/15 bg-black/40 px-4 py-3" />
            <button disabled={sending} className="w-full rounded-full bg-champagne py-3 font-semibold text-graphite transition hover:bg-champagneLight disabled:opacity-50">{sending ? (lang === 'fa' ? 'در حال ارسال…' : 'Sending…') : t('contact.send')}</button>
            {sent && <p role="status" className="text-center text-sm text-champagne">{sent}</p>}
          </form>
          <div className="reveal space-y-6">
            <div className="glass rounded-3xl p-8 space-y-3">
              <p><span className="text-champagne">{t('contact.phoneLabel')} </span>{settings.contact_phone || '+31 20 240 0000'}</p>
              <p><span className="text-champagne">{t('contact.emailLabel')} </span>{settings.contact_email || 'info@alamee.com'}</p>
              <p><span className="text-champagne">{t('contact.addressLabel')} </span>{settings.contact_address || 'Herengracht 420, Amsterdam'}</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-ivory/10">
              <iframe title={t('contact.map')} src={`https://www.google.com/maps?q=${encodeURIComponent(settings.contact_address || 'Herengracht 420, Amsterdam')}&output=embed`} className="h-72 w-full grayscale invert-[0.9] contrast-[0.9]" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
