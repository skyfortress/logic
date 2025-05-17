import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Locale } from '@/i18n/settings';
import { getDictionary } from '@/i18n/dictionary';
import Link from 'next/link';
import Button from '@/components/Button';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const lang = params?.lang as Locale;
  const dictionary = await getDictionary(lang);

  return {
    props: {
      lang,
      dictionary
    }
  };
};

export default function MasteryDashboard({ lang, dictionary }: { 
  lang: Locale;
  dictionary: any;
}) {
  const { masteryDashboard } = dictionary;
  
  return (
    <>
      <Head>
        <title>{dictionary.metadata.masteryDashboardTitle}</title>
        <meta name="description" content={dictionary.metadata.masteryDashboardDescription} />
      </Head>

      <div className="flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-sky-900">
            {masteryDashboard.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {masteryDashboard.subtitle}
          </p>
        </header>
        
        <Dashboard dictionary={dictionary} lang={lang}/>
        
        <div className="text-center mt-6">
          <Link href={`/${lang}`}>
            <Button variant="secondary" size="md">
              ← {masteryDashboard.backToTraining}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}