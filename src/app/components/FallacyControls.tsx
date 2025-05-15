import React from 'react';
import { Dictionary } from './types';
import Button from './Button';

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
  const isLoadingData = isLoadingFallacy ?? isLoading;
  const isEvaluatingAnswer = isEvaluating ?? isLoading;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      {!showAnswer ? (
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={isEvaluatingAnswer}
          className="relative overflow-hidden"
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
        </Button>
      ) : (
        <Button
          variant="primary"
          size="lg"
          onClick={loadNextFallacy}
          disabled={isLoadingData}
        >
          <span>{dictionary.nextFallacy}</span>
        </Button>
      )}
      {!showAnswer && (
        <Button
          variant="secondary"
          size="lg"
          onClick={handleSkip}
          disabled={isLoadingData || isEvaluatingAnswer}
        >
          {dictionary.skip}
        </Button>
      )}
    </div>
  );
};

export default FallacyControls;