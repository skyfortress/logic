import React from 'react';
import { Dictionary } from './types';
import { QUESTIONS_IN_SESSION } from '@/state/slices/fallacyTrainerSlice';

const StatusBar = ({ 
  score, 
  dictionary,
  streak = 0,
  questionsInSession = 0
}: { 
  score: number;
  dictionary: Dictionary;
  streak?: number;
  questionsInSession?: number;
}) => {
  const showStreakIndicator = streak >= 5;
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-700">
        {dictionary.identifyFallacy}
      </h2>
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <div className="text-xs sm:text-sm bg-indigo-100 text-indigo-800 px-2 sm:px-3 py-1 rounded-full border border-indigo-200">
          {questionsInSession} / {QUESTIONS_IN_SESSION}
        </div>
        <div className="text-xs sm:text-sm bg-emerald-50 text-emerald-700 px-2 sm:px-3 py-1 rounded-full border border-emerald-100">
          {dictionary.score} {score}
        </div>
        {streak > 0 && (
          <div className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border ${showStreakIndicator ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
            {`⚡ ${streak}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;