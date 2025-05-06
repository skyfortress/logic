import { i18n } from '@/i18n/settings';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}