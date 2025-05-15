import { getDictionary } from '@/i18n/dictionary';
import type { Locale } from '@/i18n/settings';
import generalDataEn from './fallacies-en.json';
import generalDataUa from './fallacies-ua.json'
import { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/app/components/Button';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Locale }> 
}): Promise<Metadata> {
  const dictionary = await getDictionary((await params).lang);
  
  return {
    title: dictionary.metadata.fallaciesListTitle,
    description: dictionary.metadata.fallaciesListDescription,
    keywords: dictionary.metadata.fallaciesListKeywords,
  };
}

export default async function FallaciesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const fallacyData = lang === 'en' ? generalDataEn : generalDataUa;

  return (
    <>
        <header className="mb-10">
            <h1 className="text-3xl font-bold mb-2">{dictionary.fallaciesList?.title}</h1>
            <p className="text-slate-600">{dictionary.fallaciesList?.description}</p>
        </header>

        <div className="mb-8">
            <Link href={`/${lang}`}>
                <Button variant="secondary">
                    ← {dictionary.backToTrainer}
                </Button>
            </Link>
        </div>
        
        <div className="space-y-6">
            {fallacyData.map((fallacy, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-3">{fallacy.name}</h2>
                
                <div className="mb-4">
                <p className="text-slate-700">{fallacy.description}</p>
                </div>
                
                <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-600 mb-1">{dictionary.fallaciesList?.example}</h3>
                <p className="text-slate-700 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">{fallacy.example}</p>
                </div>
                
                <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-600 mb-1">{dictionary.fallaciesList?.explanation}</h3>
                <p className="text-slate-700">{fallacy.explanation}</p>
                </div>

                <div>
                <h3 className="text-sm font-medium text-slate-600 mb-1">{dictionary.correctedArgument}</h3>
                <p className="text-slate-700 text-sm">{fallacy.correctedExample}</p>
                </div>
            </div>
            ))}
        </div>
    </>
  );
}