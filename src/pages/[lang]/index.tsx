import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Locale } from '@/i18n/settings';
import { getDictionary } from '@/i18n/dictionary';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const FallacyTrainer = dynamic(() => import('@/components/FallacyTrainer'), { ssr: false });

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
      
        <Header dictionary={dictionary} lang={lang} />
        <FallacyTrainer lang={lang} dictionary={dictionary} />
        <Footer dictionary={dictionary} />
    </>
  );
}