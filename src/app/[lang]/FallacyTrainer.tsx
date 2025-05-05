'use client';

import { useState, useEffect, useCallback } from 'react';
import { EvaluationResponse, Fallacy } from '../api/types';
import type { Dictionary } from '../components/types';

import Header from '../components/Header';
import FallacyQuestion from '../components/FallacyQuestion';
import UserInput from '../components/UserInput';
import FallacyControls from '../components/FallacyControls';
import StatusBar from '../components/StatusBar';
import FallacyResult from '../components/FallacyResult';
import Footer from '../components/Footer';
import { FallacyResponse } from '../api/fallacy/route';

export default function FallacyTrainer({ dictionary, lang }: { dictionary: Dictionary; lang: string }) {
  const [currentFallacy, setCurrentFallacy] = useState<Fallacy | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [seenFallacyIds, setSeenFallacyIds] = useState<string[]>([]);

  // Load stored data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedScore = localStorage.getItem('fallacyTrainerScore');
      const storedStreak = localStorage.getItem('fallacyTrainerStreak');
      const storedSeenFallacyIds = localStorage.getItem('fallacyTrainerSeenIds');
      
      if (storedScore) {
        setScore(parseInt(storedScore, 10));
      }
      
      if (storedStreak) {
        setStreak(parseInt(storedStreak, 10));
      }

      if (storedSeenFallacyIds) {
        try {
          const parsedIds = JSON.parse(storedSeenFallacyIds);
          if (Array.isArray(parsedIds)) {
            setSeenFallacyIds(parsedIds);
          }
        } catch (e) {
          localStorage.removeItem('fallacyTrainerSeenIds');
        }
      }
    }
  }, []);

  // Save data to localStorage when values change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fallacyTrainerScore', score.toString());
      localStorage.setItem('fallacyTrainerStreak', streak.toString());
      localStorage.setItem('fallacyTrainerSeenIds', JSON.stringify(seenFallacyIds));
    }
  }, [score, streak, seenFallacyIds]);

  const fetchNextFallacy = useCallback(async () => {
    try {
      setIsLoading(true);
      const excludeParam = seenFallacyIds.length > 0 ? `exclude=${seenFallacyIds.join(',')}` : '';
      const langParam = `lang=${lang}`;
      const queryString = [excludeParam, langParam].filter(Boolean).join('&');
      const response = await fetch(`/api/fallacy${queryString ? `?${queryString}` : ''}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch fallacy');
      }
      
      const data: FallacyResponse = await response.json();
      
      if (data.fallacy) {
        setCurrentFallacy(data.fallacy);
        setSeenFallacyIds(prev => [...prev, data.fallacy?.id.toString() || '']);
      } else if (seenFallacyIds.length > 0) {
        // Reset seen fallacies instead of immediately recursing
        setSeenFallacyIds([]);
        // Use setTimeout to prevent immediate recursion
        fetchNextFallacy();
      } else {
        // If we have no fallacy and no seen fallacies, we might be out of fallacies
        console.error('No fallacies available');
      }
    } catch (error) {
      console.error('Error fetching fallacy:', error);
    } finally {
      setIsLoading(false);
    }
  }, [seenFallacyIds, lang]);

  const loadNextFallacy = useCallback(() => {
    fetchNextFallacy();
    setUserInput('');
    setShowAnswer(false);
    setIsCorrect(null);
    setEvaluation(null);
  }, [fetchNextFallacy]);

  const evaluateAnswer = useCallback(async (input: string, fallacy: Fallacy): Promise<EvaluationResponse> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: input,
          fallacyType: fallacy.fallacy_type,
          fallacyExample: fallacy.text,
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
      return {
        isCorrect: input.trim().toLowerCase() === fallacy.fallacy_type.toLowerCase(),
        explanation: '',
        score: input.trim().toLowerCase() === fallacy.fallacy_type.toLowerCase() ? 100 : 0
      };
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  const handleNext = useCallback(async () => {
    if (userInput.trim() && currentFallacy) {
      const result = await evaluateAnswer(userInput, currentFallacy);
      setIsCorrect(result.isCorrect);
      setEvaluation(result);
      
      setScore(prevScore => prevScore + result.score);
      if (result.isCorrect) {
        setStreak(prevStreak => prevStreak + 1);
      } else {
        setStreak(0);
      }
      
      setShowAnswer(true);
    }
  }, [userInput, currentFallacy, evaluateAnswer]);

  const handleSkip = useCallback(() => {
    loadNextFallacy();
  }, [loadNextFallacy]);

  useEffect(() => {
    loadNextFallacy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip shortcuts if an input or textarea is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key === 'Enter' && userInput.trim() && !showAnswer && !isLoading) {
        handleNext();
      } else if (e.key === ' ') {
        loadNextFallacy();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userInput, showAnswer, isLoading, handleNext, loadNextFallacy]);

  return (<>
        <Header dictionary={dictionary} lang={lang} />
        
        {currentFallacy && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-8">
            <div className="mb-8">
              <StatusBar 
                score={score}
                dictionary={dictionary}
                streak={streak}
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
      </>
  );
}