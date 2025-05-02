import React from 'react';
import fallacyData from '../data.json';

// Function to format strings with placeholders
const formatString = (str: string, values: Record<string, string | number>) => {
  return str.replace(/{(\w+)}/g, (_, key) => String(values[key] || ''));
};

// StatusBar component - shows score and remaining fallacies
const StatusBar = ({ 
  remainingFallacies, 
  score, 
  totalAttempts, 
  dictionary 
}: { 
  remainingFallacies: any[]; 
  score: number;
  totalAttempts: number;
  dictionary: any;
}) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-slate-700">
      {dictionary.identifyFallacy}
    </h2>
    <div className="flex items-center gap-4">
      <div className="text-sm text-slate-500">
        {remainingFallacies.length === 0 
          ? dictionary.allSeen
          : formatString(dictionary.remaining, { count: remainingFallacies.length, total: fallacyData.length })}
      </div>
      <div className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
        {formatString(dictionary.score, { score, total: totalAttempts })}
      </div>
    </div>
  </div>
);

export default StatusBar;