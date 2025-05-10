import React from 'react';
import { Fallacy } from '../api/types';

interface FallacyQuestionProps {
  fallacy: Fallacy;
  isMastered?: boolean;
}

const FallacyQuestion = ({ fallacy, isMastered = false }: FallacyQuestionProps) => (
  <div className={`bg-blue-50 p-5 rounded-xl border-l-4 ${isMastered ? 'border-emerald-500' : 'border-blue-400'} mb-6 relative`}>
    {isMastered && (
      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
        <span className="mr-1">✓</span>
        <span>Mastered</span>
      </div>
    )}
    <p className="text-slate-700 italic text-lg">
      &ldquo;{fallacy.text}&rdquo;
    </p>
  </div>
);

export default FallacyQuestion;