import { i18n } from '@/i18n/settings';
import Script from 'next/script';
import { ReduxProvider } from './ReduxProvider';
import { Inter } from 'next/font/google'
 
const roboto = Inter({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
})


export const metadata = {
  title: 'Logic',
  description: 'Logic trainer application'
};

interface RootLayoutProps {
  children: React.ReactNode;
}


export default function RootLayout({ children }: RootLayoutProps) {
  return (
        <ReduxProvider>
          <div className={`min-h-screen bg-gradient-to-b from-sky-50 to-white ${roboto.className}`}>
              <div className="container mx-auto px-4 py-12 max-w-4xl">
              {children}
              </div>
            </div>
        </ReduxProvider>
  );
}