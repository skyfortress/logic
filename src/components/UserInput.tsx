import React from 'react';

// UserInput component - handles user input
const UserInput = ({ 
  userInput, 
  setUserInput, 
  showAnswer, 
  dictionary 
}: { 
  userInput: string; 
  setUserInput: (input: string) => void; 
  showAnswer: boolean; 
  dictionary: any 
}) => (
  <div>
    <label htmlFor="fallacy-input" className="block text-xs sm:text-md font-medium text-slate-700 mb-1 sm:mb-2">
      {dictionary.fallacyQuestion}
    </label>
    <textarea
      id="fallacy-input"
      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none shadow-sm"
      rows={3}
      placeholder={dictionary.inputPlaceholder}
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      disabled={showAnswer}
      autoFocus
    />
  </div>
);

export default UserInput;