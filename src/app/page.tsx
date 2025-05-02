'use client';

import { useState, useEffect } from 'react';
import fallacyData from './data.json';

export default function Home() {
  const [currentFallacy, setCurrentFallacy] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [remainingFallacies, setRemainingFallacies] = useState<any[]>([]);

  // Get a random fallacy without repetition until all are seen
  const getNextFallacy = () => {
    // If we've used all fallacies, reset the pool
    if (remainingFallacies.length === 0) {
      setRemainingFallacies([...fallacyData]);
      return getNextFallacy();
    }
    
    const randomIndex = Math.floor(Math.random() * remainingFallacies.length);
    const selected = remainingFallacies[randomIndex];
    
    // Remove the selected fallacy from the pool
    setRemainingFallacies(prev => 
      prev.filter((_, index) => index !== randomIndex)
    );
    
    return selected;
  };

  // Initialize or load next fallacy
  const loadNextFallacy = () => {
    setCurrentFallacy(getNextFallacy());
    setUserInput('');
    setShowAnswer(false);
    setIsCorrect(null);
  };

  // Check if the user's answer is correct (case-insensitive comparison)
  const checkAnswer = (input: string, fallacyType: string) => {
    return input.trim().toLowerCase() === fallacyType.toLowerCase();
  };

  // Handle Next button click
  const handleNext = () => {
    if (userInput.trim()) {
      setTotalAttempts(totalAttempts + 1);
      
      const correct = checkAnswer(userInput, currentFallacy.fallacy_type);
      setIsCorrect(correct);
      
      if (correct) {
        setScore(score + 1);
      }
      
      setShowAnswer(true);
    }
  };

  // Handle Skip button click
  const handleSkip = () => {
    loadNextFallacy();
  };

  // Initialize on component mount
  useEffect(() => {
    // Start with all fallacies in the pool
    setRemainingFallacies([...fallacyData]);
  }, []);

  // Load first fallacy once remaining fallacies are set
  useEffect(() => {
    if (remainingFallacies.length > 0 && !currentFallacy) {
      loadNextFallacy();
    }
  }, [remainingFallacies, currentFallacy]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter to submit when not showing answer
      if (e.key === 'Enter' && userInput.trim() && !showAnswer) {
        handleNext();
      }
      // Space to proceed to next fallacy when showing answer
      else if (e.key === ' ' && showAnswer) {
        loadNextFallacy();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userInput, showAnswer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-800 dark:text-indigo-300 mb-3">
            Logical Fallacy Trainer
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Improve your critical thinking skills by identifying logical fallacies in arguments.
            Read the statement and identify the fallacy type in the input field.
          </p>
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            <p>Keyboard shortcuts: <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">Enter</kbd> to check, <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">Space</kbd> for next</p>
          </div>
        </header>
        
        {currentFallacy && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                  Identify the Fallacy
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {remainingFallacies.length === 0 
                      ? 'All fallacies seen!' 
                      : `${remainingFallacies.length}/${fallacyData.length} remaining`}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    Score: {score}/{totalAttempts}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-slate-700 p-5 rounded-xl border-l-4 border-indigo-500 mb-6">
                <p className="text-slate-800 dark:text-slate-200 italic text-lg">
                  "{currentFallacy.text}"
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="fallacy-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    What type of fallacy is this?
                  </label>
                  <textarea
                    id="fallacy-input"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    rows={3}
                    placeholder="Enter your answer here..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={showAnswer}
                    autoFocus
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  {!showAnswer ? (
                    <button
                      className="px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors flex items-center justify-center"
                      onClick={handleNext}
                      disabled={!userInput.trim()}
                    >
                      <span>Check Answer</span>
                    </button>
                  ) : (
                    <button
                      className="px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors flex items-center justify-center"
                      onClick={loadNextFallacy}
                    >
                      <span>Next Fallacy</span>
                    </button>
                  )}
                  {!showAnswer && (
                    <button
                      className="px-5 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                      onClick={handleSkip}
                    >
                      Skip
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showAnswer && (
              <div className={`rounded-xl p-6 border space-y-4 ${
                isCorrect 
                  ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800" 
                  : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isCorrect 
                      ? "bg-green-100 dark:bg-green-800" 
                      : "bg-red-100 dark:bg-red-800"
                  }`}>
                    <span className={`font-bold ${
                      isCorrect 
                        ? "text-green-600 dark:text-green-300" 
                        : "text-red-600 dark:text-red-300"
                    }`}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${
                    isCorrect 
                      ? "text-green-700 dark:text-green-300" 
                      : "text-red-700 dark:text-red-300"
                  }`}>
                    {isCorrect ? "Correct!" : "Not quite right"} - It's a {currentFallacy.fallacy_type}
                  </h3>
                </div>
                
                <div className="pl-11 space-y-4">
                  <p className="text-slate-700 dark:text-slate-300">
                    {currentFallacy.explanation}
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Corrected Argument:
                    </h4>
                    <p className="text-slate-800 dark:text-slate-200">
                      {currentFallacy.corrected}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Your Answer:
                    </h4>
                    <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                      {userInput}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2025 Logical Fallacy Trainer - Improve your critical thinking</p>
        </footer>
      </div>
    </div>
  );
}
