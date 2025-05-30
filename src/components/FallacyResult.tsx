import React from 'react';
import { EvaluationResponse } from '../pages/api/types';

const FallacyResult = ({ 
  isCorrect, 
  currentFallacy, 
  userInput, 
  dictionary,
  evaluation
}: { 
  isCorrect: boolean | null; 
  currentFallacy: any;
  userInput: string;
  dictionary: any;
  evaluation: EvaluationResponse | null;
}) => (
  <div className={`rounded-xl p-4 sm:p-6 border space-y-3 sm:space-y-4 ${
    isCorrect 
      ? "bg-green-50 border-green-100" 
      : "bg-amber-50 border-amber-100"
  }`}>
    <div className="flex items-center">
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
        isCorrect 
          ? "bg-green-100" 
          : "bg-amber-100"
      }`}>
        <span className={`font-bold ${
          isCorrect 
            ? "text-green-600" 
            : "text-amber-600"
        }`}>
          {isCorrect ? "✓" : "✗"}
        </span>
      </div>
      <h3 className={`text-base sm:text-lg font-semibold ${
        isCorrect 
          ? "text-green-700" 
          : "text-amber-700"
      }`}>
        {isCorrect ? dictionary.correct : dictionary.incorrect}
      </h3>
    </div>
    
    <div className="pl-9 sm:pl-11 space-y-3 sm:space-y-4">
      {evaluation && evaluation.explanation && (
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200">
          <h4 className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">
            {dictionary.aiEvaluation || "AI Evaluation"}
          </h4>
          <p className="text-slate-700 text-sm sm:text-base">
            {evaluation.explanation}
          </p>
          <div className="mt-2 sm:mt-3 flex items-center">
            <div className="h-1.5 sm:h-2 flex-grow bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${evaluation.score >= 80 ? 'bg-green-500' : 
                  evaluation.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${evaluation.score}%` }}
              />
            </div>
            <span className="ml-2 text-xs sm:text-sm font-medium text-slate-600">
              {evaluation.score}/100
            </span>
          </div>
        </div>
      )}
      {currentFallacy.fallacy_type !== 'None' &&  (
      <>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200">
          <h4 className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">
            {dictionary.fallacyType || "Fallacy Type"}
          </h4>
          <p className="text-slate-700 font-semibold text-sm sm:text-base">
            {currentFallacy.fallacy_type}
          </p>
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-medium text-slate-600 mb-1">
            {dictionary.correctedArgument}
          </h4>
          <p className="text-slate-700 text-sm sm:text-base">
            {evaluation?.corrected}
          </p>
        </div>
      </>
    )}
    </div>
  </div>
);

export default FallacyResult;