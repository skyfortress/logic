import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Locale } from '@/i18n/settings';
import { getDictionary } from '@/i18n/dictionary';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

interface FallacyEntry {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const lang = params?.lang as Locale;
  const dictionary = await getDictionary(lang);
  
  // Read fallacies data for the current language
  const fallaciesPath = path.join(process.cwd(), 'src/data', `fallacies-${lang}.json`);
  const fallaciesData = JSON.parse(fs.readFileSync(fallaciesPath, 'utf8'));
  
  return {
    props: {
      lang,
      dictionary,
      fallacies: fallaciesData
    }
  };
};

export default function FallaciesPage({ 
  lang, 
  dictionary,
  fallacies
}: { 
  lang: Locale;
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  fallacies: FallacyEntry[];
}) {
  // Organize fallacies by category
  const categories = fallacies.reduce((acc, fallacy) => {
    if (!acc[fallacy.category]) {
      acc[fallacy.category] = [];
    }
    acc[fallacy.category].push(fallacy);
    return acc;
  }, {} as Record<string, FallacyEntry[]>);
  
  console.log(dictionary)


  return (
    <>
      <Head>
        <title>{dictionary.fallaciesList.title}</title>
        <meta name="description" content={dictionary.fallaciesList.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-sky-900">
          {dictionary.fallaciesList.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(categories).map(([category, categoryFallacies]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-sky-800">
                {category}
              </h2>
              
              <ul className="space-y-3">
                {categoryFallacies.map((fallacy) => (
                  <li key={fallacy.id}>
                    <Link href={`/${lang}/fallacies/${fallacy.id}`} className="text-sky-600 hover:text-sky-800 hover:underline">
                      {fallacy.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href={`/${lang}`} className="inline-flex items-center px-4 py-2 border border-sky-600 text-sky-600 rounded-md hover:bg-sky-50">
            ← {dictionary.backToTrainer}
          </Link>
        </div>
      </div>
    </>
  );
}