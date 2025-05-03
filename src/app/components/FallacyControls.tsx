import React from 'react';

// FallacyControls component - handles next/skip/check buttons
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
  dictionary: any;
  isLoading?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-between">
    {!showAnswer ? (
      <button
        className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center shadow-sm"
        onClick={handleNext}
        disabled={!userInput.trim() || isLoading}
      >
        <span>
          {isLoading ? dictionary.evaluating || 'Evaluating...' : dictionary.checkAnswer}
        </span>
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

export default FallacyControls;