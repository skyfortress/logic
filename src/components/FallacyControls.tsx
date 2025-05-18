import React from 'react';
import { Dictionary } from './types';
import Button from './Button';

const FallacyControls = ({ 
  showAnswer, 
  handleNext, 
  loadNextFallacy, 
  handleSkip,
  handleShowResults,
  userInput, 
  dictionary,
  isLoading,
  isLoadingFallacy,
  isEvaluating,
  isLastQuestionInSession
}: { 
  showAnswer: boolean; 
  handleNext: () => void; 
  loadNextFallacy: () => void;
  handleSkip: () => void;
  handleShowResults?: () => void;
  userInput: string;
  dictionary: Dictionary;
  isLoading?: boolean;
  isLoadingFallacy?: boolean;
  isEvaluating?: boolean;
  isLastQuestionInSession?: boolean;
}) => {
  const isLoadingData = isLoadingFallacy ?? isLoading;
  const isEvaluatingAnswer = isEvaluating ?? isLoading;

  const controlButton = <>
    {!showAnswer ? (
    <Button
      variant="primary"
      size="lg"
      onClick={handleNext}
      disabled={isEvaluatingAnswer}
      className="relative overflow-hidden w-full sm:w-auto"
    >
      {isEvaluatingAnswer ? (
        <span className="flex items-center gap-2 sm:gap-3 relative z-10">
          <span className="relative flex items-center justify-center">
            <span className="inline-block text-xl sm:text-2xl animate-spin-slow animate-pulse">🧠</span>
          </span>
          <span className="inline-flex items-center font-semibold text-sm sm:text-base">
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
      className="w-full sm:w-auto"
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
      className="w-full sm:w-auto"
    >
      {dictionary.skip}
    </Button>)}
    </>;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
      {isLastQuestionInSession ? (<Button
          variant="primary"
          size="lg"
          onClick={handleShowResults}
          disabled={isLoadingData}
          className="w-full sm:w-auto"
        >
          <span>{dictionary.showResults}</span>
        </Button>) : 
        controlButton 
        }
    </div>
  );
};

export default FallacyControls;