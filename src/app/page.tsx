import { redirect } from 'next/navigation';
import { i18n } from '@/i18n/settings';

export default function RootPage() {
  // Default redirect to the default locale
  redirect(`/${i18n.defaultLocale}`);
}
