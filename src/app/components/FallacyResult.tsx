import React from 'react';

// FallacyResult component - shows answer feedback
const FallacyResult = ({ 
  isCorrect, 
  currentFallacy, 
  userInput, 
  dictionary 
}: { 
  isCorrect: boolean | null; 
  currentFallacy: any;
  userInput: string;
  dictionary: any;
}) => (
  <div className={`rounded-xl p-6 border space-y-4 ${
    isCorrect 
      ? "bg-green-50 border-green-100" 
      : "bg-amber-50 border-amber-100"
  }`}>
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
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
      <h3 className={`text-lg font-semibold ${
        isCorrect 
          ? "text-green-700" 
          : "text-amber-700"
      }`}>
        {isCorrect ? dictionary.correct : dictionary.incorrect} - {dictionary.itsA} {currentFallacy.fallacy_type}
      </h3>
    </div>
    
    <div className="pl-11 space-y-4">
      <p className="text-slate-700">
        {currentFallacy.explanation}
      </p>
      
      <div>
        <h4 className="text-sm font-medium text-slate-600 mb-1">
          {dictionary.correctedArgument}
        </h4>
        <p className="text-slate-700">
          {currentFallacy.corrected}
        </p>
      </div>
      
      <div className="pt-2">
        <h4 className="text-sm font-medium text-slate-600 mb-1">
          {dictionary.yourAnswer}
        </h4>
        <p className="text-slate-700 bg-white p-3 rounded border border-slate-200">
          {userInput}
        </p>
      </div>
    </div>
  </div>
);

export default FallacyResult;