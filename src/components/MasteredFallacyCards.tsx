import { useAppSelector } from '@/state/hooks';
import { Locale } from '@/i18n/settings';
import { Dictionary } from './types';
import { MASERY_COUNT } from '@/state/slices/fallacyTrainerSlice';

interface MasteredFallacyCardsProps {
  dictionary: Dictionary;
  lang: Locale;
}

export default function MasteredFallacyCards({ dictionary, lang }: MasteredFallacyCardsProps) {
  const { fallacyMasteries } = useAppSelector(state => state.fallacyTrainer);

  if (Object.keys(fallacyMasteries).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="font-bold text-xl text-sky-700 mb-4">
          {dictionary.masteryDashboard.achievements}
        </h2>
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 text-center">
            {dictionary.masteryDashboard.noAchievements}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="font-bold text-xl text-sky-700 mb-4">
        {dictionary.masteryDashboard.achievements}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.keys(fallacyMasteries).map((fallacy, index) => {
          const masteryCount = fallacyMasteries[fallacy];
          const isMastered = masteryCount >= MASERY_COUNT;
          const isLocked = masteryCount === 0;
          
          return (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-lg border ${
                isMastered 
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 shadow-sm' 
                  : isLocked 
                    ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 opacity-75' 
                    : 'bg-gradient-to-br from-sky-50 to-indigo-100 border-sky-200'
              }`}
            >
              <div className="absolute top-0 right-0">
                {isMastered && (
                  <div className="bg-emerald-500 text-xs font-medium text-white px-2 py-1 rounded-bl-md">
                    {dictionary.masteryDashboard.masterBadge}
                  </div>
                )}
              </div>
              
              {isLocked && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-sm mt-2 text-gray-500">{dictionary.masteryDashboard.locked}</p>
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <h3 className={`font-bold text-lg mb-1 ${isMastered ? 'text-emerald-700' : 'text-gray-800'}`}>
                  {fallacy}
                </h3>
                
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        isMastered ? 'bg-emerald-500' : 'bg-sky-600'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (masteryCount / MASERY_COUNT) * 100)}%`,
                        transition: 'width 0.5s ease-in-out'
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-medium text-gray-500">
                      {dictionary.masteryDashboard.progress}: {masteryCount}/{MASERY_COUNT}
                    </span>
                    {!isMastered && !isLocked && (
                      <span className="text-xs font-medium text-sky-600">
                        {dictionary.masteryDashboard.remaining.replace('{count}', String(MASERY_COUNT - masteryCount))}
                      </span>
                    )}
                    {isMastered && (
                      <span className="text-xs font-medium text-emerald-600">
                        {dictionary.masteryDashboard.completed}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex mt-2">
                  {[...Array(MASERY_COUNT)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                      i < masteryCount 
                        ? isMastered ? 'text-emerald-500' : 'text-sky-500' 
                        : 'text-gray-300'
                    }`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}