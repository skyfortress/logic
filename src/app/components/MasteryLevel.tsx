'use client';

import { useAppSelector } from '../state/hooks';

interface MasteryLevelProps {
  title: string;
  totalPointsLabel: string;
}

export default function MasteryLevel({ title, totalPointsLabel }: MasteryLevelProps) {
  const { score } = useAppSelector(state => state.fallacyTrainer);
  
  return (
    <div className="bg-white rounded-lg shadow p-6 overflow-hidden relative">
      <h2 className="font-semibold text-lg text-sky-800 mb-4">
        {title}
      </h2>
      <div className="flex flex-col items-center justify-center h-32 relative z-10">
        <div className="text-6xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 text-transparent bg-clip-text">{score}</div>
        <div className="mt-2 text-sm text-gray-600">{totalPointsLabel}</div>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
          <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full" style={{ width: `${Math.min(100, score / 20)}%` }}></div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-sky-100 opacity-40"></div>
      {score > 100 && (
        <div className="absolute top-3 right-3">
          <div className="p-1 bg-yellow-400 rounded-full animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}