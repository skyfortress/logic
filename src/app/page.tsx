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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-700 mb-3">
            Logical Fallacy Trainer
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Improve your critical thinking skills by identifying logical fallacies in arguments.
            Read the statement and identify the fallacy type in the input field.
          </p>
          <div className="mt-4 text-sm text-slate-500">
            <p>Keyboard shortcuts: <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200">Enter</kbd> to check, <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200">Space</kbd> for next</p>
          </div>
        </header>
        
        {currentFallacy && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-700">
                  Identify the Fallacy
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-500">
                    {remainingFallacies.length === 0 
                      ? 'All fallacies seen!' 
                      : `${remainingFallacies.length}/${fallacyData.length} remaining`}
                  </div>
                  <div className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                    Score: {score}/{totalAttempts}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-400 mb-6">
                <p className="text-slate-700 italic text-lg">
                  "{currentFallacy.text}"
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="fallacy-input" className="block text-sm font-medium text-slate-700 mb-2">
                    What type of fallacy is this?
                  </label>
                  <textarea
                    id="fallacy-input"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none shadow-sm"
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
                      className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center shadow-sm"
                      onClick={handleNext}
                      disabled={!userInput.trim()}
                    >
                      <span>Check Answer</span>
                    </button>
                  ) : (
                    <button
                      className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center justify-center shadow-sm"
                      onClick={loadNextFallacy}
                    >
                      <span>Next Fallacy</span>
                    </button>
                  )}
                  {!showAnswer && (
                    <button
                      className="px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-200 shadow-sm"
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
                    {isCorrect ? "Correct!" : "Not quite right"} - It's a {currentFallacy.fallacy_type}
                  </h3>
                </div>
                
                <div className="pl-11 space-y-4">
                  <p className="text-slate-700">
                    {currentFallacy.explanation}
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 mb-1">
                      Corrected Argument:
                    </h4>
                    <p className="text-slate-700">
                      {currentFallacy.corrected}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-slate-600 mb-1">
                      Your Answer:
                    </h4>
                    <p className="text-slate-700 bg-white p-3 rounded border border-slate-200">
                      {userInput}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>© 2025 Logical Fallacy Trainer - Improve your critical thinking</p>
        </footer>
      </div>
    </div>
  );
}
