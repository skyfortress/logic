import { redirect } from 'next/navigation';
import { i18n } from '@/i18n/settings';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary(i18n.defaultLocale);
  
  return {
    title: dictionary.metadata.rootTitle,
    description: dictionary.metadata.rootDescription,
    keywords: dictionary.metadata.rootKeywords,
    openGraph: {
      title: dictionary.metadata.ogTitle,
      description: dictionary.metadata.ogDescription,
      type: 'website',
    }
  };
}

export default function RootPage() {
  redirect(`/${i18n.defaultLocale}`);
}
