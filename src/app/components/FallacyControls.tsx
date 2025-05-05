import React from 'react';
import { Dictionary } from './types';

const FallacyControls = ({ 
  showAnswer, 
  handleNext, 
  loadNextFallacy, 
  handleSkip, 
  userInput, 
  dictionary,
  isLoading,
  isLoadingFallacy,
  isEvaluating
}: { 
  showAnswer: boolean; 
  handleNext: () => void; 
  loadNextFallacy: () => void;
  handleSkip: () => void;
  userInput: string;
  dictionary: Dictionary;
  isLoading?: boolean;
  isLoadingFallacy?: boolean;
  isEvaluating?: boolean;
}) => {
  // For backward compatibility, use combined isLoading if specific states aren't provided
  const isLoadingData = isLoadingFallacy ?? isLoading;
  const isEvaluatingAnswer = isEvaluating ?? isLoading;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      {!showAnswer ? (
        <button
          className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center shadow-sm relative overflow-hidden"
          onClick={handleNext}
          disabled={!userInput.trim() || isEvaluatingAnswer}
        >
          {isEvaluatingAnswer ? (
            <span className="flex items-center gap-3 relative z-10">
              <span className="relative flex items-center justify-center">
                <span className="inline-block text-2xl animate-spin-slow animate-pulse">🧠</span>
              </span>
              <span className="inline-flex items-center font-semibold">
                {dictionary.evaluating}
              </span>
            </span>
          ) : (
            <span>{dictionary.checkAnswer}</span>
          )}
        </button>
      ) : (
        <button
          className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center shadow-sm"
          onClick={loadNextFallacy}
          disabled={isLoadingData}
        >
          <span>{dictionary.nextFallacy}</span>
        </button>
      )}
      {!showAnswer && (
        <button
          className="px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-200 shadow-sm"
          onClick={handleSkip}
          disabled={isLoadingData || isEvaluatingAnswer}
        >
          {dictionary.skip}
        </button>
      )}
    </div>
  );
};

export default FallacyControls;