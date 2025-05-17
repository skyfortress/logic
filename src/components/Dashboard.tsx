import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Locale } from '@/i18n/settings';
import { getDictionary } from '@/i18n/dictionary';
import Link from 'next/link';
import Button from '@/components/Button';
import MasteryLevel from '@/components/MasteryLevel';
import { SessionActivity } from '@/components/SessionActivity';
import { OverallProgress } from '@/components/OverallProgress';
import MasteredFallacyCards from '@/components/MasteredFallacyCards';

export default function Dashboard({ lang, dictionary }: { 
  lang: Locale;
  dictionary: any;
}) {
  const { masteryDashboard } = dictionary;
  
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OverallProgress masteryDashboard={masteryDashboard} />

        <MasteryLevel 
        title={masteryDashboard.masteryLevel}
        totalPointsLabel={masteryDashboard.totalPoints}
        />
        
        <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg text-sky-800 mb-4">
            {masteryDashboard.recentActivity}
        </h2>
        <SessionActivity dictionary={dictionary} lang={lang} />
        </div>
    </div>
    
    <div className="grid grid-cols-1 gap-4 mt-4">
        <MasteredFallacyCards dictionary={dictionary} lang={lang} />
    </div>
    </>
  );
}