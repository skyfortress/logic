import 'server-only';
import type { Locale } from './settings';

// We need to use a dynamic import here because these JSON files are generated
// at build time, and we don't know which ones will exist until then.
const dictionaries = {
  en: () => import('../messages/en/index.json').then((module) => module.default),
  ua: () => import('../messages/ua/index.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();