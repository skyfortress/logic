import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Locale } from '@/i18n/settings';
import { getDictionary } from '@/i18n/dictionary';
import FallacyTrainer from '@/components/FallacyTrainer';

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

export default function Home({ lang, dictionary }: { 
  lang: Locale; 
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) {
  return (
    <>
      <Head>
        <title>{dictionary.metadata.rootTitle}</title>
        <meta name="description" content={dictionary.metadata.rootDescription} />
      </Head>
      
      <div className="container mx-auto px-4">
        <FallacyTrainer lang={lang} dictionary={dictionary} />
      </div>
    </>
  );
}