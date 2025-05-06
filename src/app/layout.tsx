import { i18n } from '@/i18n/settings';
import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Logic',
  description: 'Logic trainer application'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={i18n.defaultLocale}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HN93HGTBLX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HN93HGTBLX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}