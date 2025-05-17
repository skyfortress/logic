import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Locale } from '@/i18n/settings';
import { getDictionary } from '@/i18n/dictionary';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Button from '@/components/Button';

interface FallacyEntry {
  name: string;
  description: string;
  explanation: string;
  example: string;
  correctedExample: string;
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
  return (
    <>
      <Head>
        <title>{dictionary.fallaciesList.title}</title>
        <meta name="description" content={dictionary.fallaciesList.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
         <header className="mb-10">
            <h1 className="text-3xl font-bold mb-2">{dictionary.fallaciesList.title}</h1>
            <p className="text-slate-600">{dictionary.fallaciesList.description}</p>
            <div className="mt-12 text-center">
            <Link href={`/${lang}`}>
              <Button variant="secondary" size="md">
                ← {dictionary.masteryDashboard.backToTraining}
              </Button>
            </Link>
        </div>
        </header>
        <div className="space-y-6">
            {fallacies.map((fallacy, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-3">{fallacy.name}</h2>
                
                <div className="mb-4">
                <p className="text-slate-700">{fallacy.description}</p>
                </div>
                
                <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-600 mb-1">{dictionary.fallaciesList.example}</h3>
                <p className="text-slate-700 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">{fallacy.example}</p>
                </div>
                
                <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-600 mb-1">{dictionary.fallaciesList.explanation}</h3>
                <p className="text-slate-700">{fallacy.explanation}</p>
                </div>

                <div>
                <h3 className="text-sm font-medium text-slate-600 mb-1">{dictionary.correctedArgument}</h3>
                <p className="text-slate-700 text-sm">{fallacy.correctedExample}</p>
                </div>
            </div>
            ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href={`/${lang}`}>
              <Button variant="secondary" size="md">
                ← {dictionary.masteryDashboard.backToTraining}
              </Button>
          </Link>
        </div>
      </div>
    </>
  );
}