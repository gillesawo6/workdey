import type { Metadata } from 'next';
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hanken',
});

export const metadata: Metadata = {
  title: 'WorkDey — Talent, found. Careers, built.',
  description:
    'AI-powered career development, job discovery and recruitment platform. Connecting job seekers and verified employers in Cameroon and beyond.',
  openGraph: {
    title: 'WorkDey — Talent, found. Careers, built.',
    description:
      'AI-powered career development, job discovery and recruitment platform. Connecting job seekers and verified employers in Cameroon and beyond.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorkDey — Talent, found. Careers, built.',
    description:
      'AI-powered career development, job discovery and recruitment platform. Connecting job seekers and verified employers in Cameroon and beyond.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${hanken.variable}`}>
      <body className="min-h-screen bg-[#F4F6F9] text-[#0B1C2F] font-sans antialiased selection:bg-[#0B7F7A]/20 selection:text-[#0B7F7A]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
