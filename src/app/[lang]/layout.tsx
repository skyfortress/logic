import { ReactNode } from 'react';
import { Locale, i18n } from '@/i18n/settings';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/i18n/dictionary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Locale } >
}, parent: ResolvingMetadata): Promise<Metadata> {
  const lang = (await params).lang;
  const dictionary = await getDictionary(lang);
  
  const previousMetadata = await parent;
  const previousOpenGraph = previousMetadata.openGraph || {};
  
  return {
    title: {
      template: '%s | Logic Trainer',
      default: dictionary.metadata.defaultTitle,
    },
    description: dictionary.metadata.rootDescription,
    openGraph: {
      ...previousOpenGraph,
      locale: lang,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  
  return (

      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            {children}
          </div>
        </div>
      </div>

  );
}