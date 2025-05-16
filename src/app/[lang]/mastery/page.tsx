import { Metadata } from 'next';
import { Locale } from '@/i18n/settings';
import { getDictionary } from '@/i18n/dictionary';
import Link from 'next/link';
import Button from '@/app/components/Button';
import MasteryLevel from '@/app/components/MasteryLevel';
import { SessionActivity } from '@/app/components/SessionActivity';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Locale }> 
}): Promise<Metadata> {
  const lang = (await params).lang;
  const dictionary = await getDictionary(lang);
  
  return {
    title: dictionary.metadata.masteryDashboardTitle,
    description: dictionary.metadata.masteryDashboardDescription,
  };
}

export default async function MasteryDashboard({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { masteryDashboard } = dictionary;
  
  return (
    <div className="flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-sky-900">
          {masteryDashboard.title}
        </h1>
        <p className="text-gray-600 mb-6">
          {masteryDashboard.subtitle}
        </p>
      </header>
      
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
      
      <div className="text-center mt-6">
        <Link href={`/${lang}`}>
          <Button variant="secondary" size="md">
            ← {masteryDashboard.backToTraining}
          </Button>
        </Link>
      </div>
    </div>
  );
}