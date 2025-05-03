'use client';

import { useState, useEffect } from 'react';
import fallacyData from '../data.json';
import { EvaluationResponse } from '../api/types';

// Import component files
import Header from '../components/Header';
import FallacyQuestion from '../components/FallacyQuestion';
import UserInput from '../components/UserInput';
import FallacyControls from '../components/FallacyControls';
import StatusBar from '../components/StatusBar';
import FallacyResult from '../components/FallacyResult';
import Footer from '../components/Footer';

// Main component
export default function FallacyTrainer({ dictionary, lang }: { dictionary: any; lang: string }) {
  const [currentFallacy, setCurrentFallacy] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [remainingFallacies, setRemainingFallacies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);

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
    setEvaluation(null);
  };

  // Evaluate the user's answer using the API
  const evaluateAnswer = async (input: string, fallacy: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: input,
          correctAnswer: fallacy.fallacy_type,
          fallacyDescription: fallacy.explanation,
          fallacyType: fallacy.fallacy_type,
          fallacyExample: fallacy.fallacious,
          language: lang,
        }),
      });

      if (!response.ok) {
        throw new Error('Evaluation failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      // Fallback to simple exact match if API fails
      return {
        isCorrect: input.trim().toLowerCase() === fallacy.fallacy_type.toLowerCase(),
        explanation: '',
        score: input.trim().toLowerCase() === fallacy.fallacy_type.toLowerCase() ? 100 : 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Next button click
  const handleNext = async () => {
    if (userInput.trim()) {
      setTotalAttempts(totalAttempts + 1);
      
      const result = await evaluateAnswer(userInput, currentFallacy);
      setIsCorrect(result.isCorrect);
      setEvaluation(result);
      
      if (result.isCorrect) {
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
      if (e.key === 'Enter' && userInput.trim() && !showAnswer && !isLoading) {
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
  }, [userInput, showAnswer, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Header dictionary={dictionary} />
        
        {currentFallacy && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-8">
            <div className="mb-8">
              <StatusBar 
                remainingFallacies={remainingFallacies}
                score={score}
                totalAttempts={totalAttempts}
                dictionary={dictionary}
              />

              <FallacyQuestion fallacy={currentFallacy} />

              <div className="space-y-6">
                <UserInput 
                  userInput={userInput}
                  setUserInput={setUserInput}
                  showAnswer={showAnswer}
                  dictionary={dictionary}
                />

                <FallacyControls 
                  showAnswer={showAnswer}
                  handleNext={handleNext}
                  loadNextFallacy={loadNextFallacy}
                  handleSkip={handleSkip}
                  userInput={userInput}
                  dictionary={dictionary}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {showAnswer && (
              <FallacyResult 
                isCorrect={isCorrect}
                currentFallacy={currentFallacy}
                userInput={userInput}
                dictionary={dictionary}
                evaluation={evaluation}
              />
            )}
          </div>
        )}
        
        <Footer dictionary={dictionary} />
      </div>
    </div>
  );
}