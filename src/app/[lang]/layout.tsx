import { ReactNode } from 'react';
import { Locale, i18n } from '@/i18n/settings';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate static params for all supported languages
export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}