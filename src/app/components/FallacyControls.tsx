import React, { useState, useEffect } from 'react';
import { Dictionary } from './types';

const FallacyControls = ({ 
  showAnswer, 
  handleNext, 
  loadNextFallacy, 
  handleSkip, 
  userInput, 
  dictionary,
  isLoading
}: { 
  showAnswer: boolean; 
  handleNext: () => void; 
  loadNextFallacy: () => void;
  handleSkip: () => void;
  userInput: string;
  dictionary: Dictionary;
  isLoading?: boolean;
}) => {
  const [dotIndex, setDotIndex] = useState(0);
  const thinkingDots = ['', '.', '..', '...'];

  useEffect(() => {
    if (!isLoading) {
      return;
    }
    const interval = setInterval(() => {
      setDotIndex((prevIndex) => (prevIndex + 1) % thinkingDots.length);
    }, 500);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      {!showAnswer ? (
        <button
          className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center shadow-sm relative overflow-hidden"
          onClick={handleNext}
          disabled={!userInput.trim() || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-3 relative z-10">
              <span className="relative flex items-center justify-center">
                <span className="inline-block text-2xl animate-spin-slow animate-pulse">🧠</span>
              </span>
              <span className="inline-flex items-center font-semibold">
                {dictionary.evaluating}
                <span className="inline-block w-8 overflow-hidden">
                  {thinkingDots[dotIndex]}
                </span>
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
        >
          <span>{dictionary.nextFallacy}</span>
        </button>
      )}
      {!showAnswer && (
        <button
          className="px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-200 shadow-sm"
          onClick={handleSkip}
          disabled={isLoading}
        >
          {dictionary.skip}
        </button>
      )}
    </div>
  );
};

export default FallacyControls;