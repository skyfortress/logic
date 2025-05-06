import { getDictionary } from '@/i18n/dictionary';
import type { Locale } from '@/i18n/settings';
import FallacyTrainer from './FallacyTrainer';

// This is a server component that loads translations
export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  // Load dictionary on the server
  const dictionary = await getDictionary(lang);
  
  // Pass the dictionary to the client component
  return <FallacyTrainer dictionary={dictionary} lang={lang} />;
}