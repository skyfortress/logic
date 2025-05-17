import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Locale } from '@/i18n/settings';
import { getDictionary } from '@/i18n/dictionary';
import Link from 'next/link';
import Button from '@/components/Button';
import MasteryLevel from '@/components/MasteryLevel';
import { SessionActivity } from '@/components/SessionActivity';


export default function Dashboard({ lang, dictionary }: { 
  lang: Locale;
  dictionary: any;
}) {
  const { masteryDashboard } = dictionary;
  
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg text-sky-800 mb-4">
            {masteryDashboard.overallProgress}
        </h2>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
            <span>{masteryDashboard.totalFallacies}</span>
            <span className="font-mono">0</span>
            </div>
            <div className="flex justify-between items-center">
            <span>{masteryDashboard.masteredFallacies}</span>
            <span className="font-mono">0</span>
            </div>
            <div className="flex justify-between items-center">
            <span>{masteryDashboard.inProgress}</span>
            <span className="font-mono">0</span>
            </div>
            <div className="flex justify-between items-center">
            <span>{masteryDashboard.notStarted}</span>
            <span className="font-mono">0</span>
            </div>
        </div>
        </div>
        
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
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg text-sky-800 mb-4">
            {masteryDashboard.strongestFallacies}
        </h2>
        <div className="text-gray-500 text-center py-8">
            {masteryDashboard.noActivity}
        </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg text-sky-800 mb-4">
            {masteryDashboard.weakestFallacies}
        </h2>
        <div className="text-gray-500 text-center py-8">
            {masteryDashboard.noActivity}
        </div>
        </div>
    </div>
    </>
  );
}