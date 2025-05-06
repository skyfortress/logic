'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { EvaluationResponse, Fallacy } from '../api/types';
import type { Dictionary } from '../components/types';
import ReCAPTCHA from 'react-google-recaptcha';

import Header from '../components/Header';
import FallacyQuestion from '../components/FallacyQuestion';
import UserInput from '../components/UserInput';
import FallacyControls from '../components/FallacyControls';
import StatusBar from '../components/StatusBar';
import FallacyResult from '../components/FallacyResult';
import Footer from '../components/Footer';
import { FallacyResponse } from '../api/fallacy/route';

const RECAPTCHA_SITE_KEY = '6LdfdC8rAAAAAEimne05J5bQe-Zv8_gzO97mDmwr';

export default function FallacyTrainer({ dictionary, lang }: { dictionary: Dictionary; lang: string }) {
  const [currentFallacy, setCurrentFallacy] = useState<Fallacy | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoadingFallacy, setIsLoadingFallacy] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [seenFallacyIds, setSeenFallacyIds] = useState<string[]>([]);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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
        } catch (_) {
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

  const fetchNextFallacy = useCallback(async (forceReset = false) => {
    try {
      setIsLoadingFallacy(true);
      
      // Reset seen fallacies if forced or when all fallacies have been seen
      if (forceReset) {
        setSeenFallacyIds([]);
      }
      
      const excludeParam = seenFallacyIds.length > 0 && !forceReset ? `exclude=${seenFallacyIds.join(',')}` : '';
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
      } else if (!forceReset) {
        // If we get null and haven't reset yet, try again with a reset
        fetchNextFallacy(true);
      } else {
        // If we've already tried resetting and still get null, there might be an issue
        console.error('No fallacies available after reset');
      }
    } catch (error) {
      console.error('Error fetching fallacy:', error);
    } finally {
      setIsLoadingFallacy(false);
    }
  }, [seenFallacyIds, lang]);

  const loadNextFallacy = useCallback(() => {
    fetchNextFallacy(false);
    setUserInput('');
    setShowAnswer(false);
    setIsCorrect(null);
    setEvaluation(null);
    setRecaptchaError(null);
    setRecaptchaToken(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [fetchNextFallacy]);

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    setRecaptchaError(null);
  };

  const evaluateAnswer = useCallback(async (input: string, fallacy: Fallacy): Promise<EvaluationResponse> => {
    try {
      setIsEvaluating(true);
      
      // Get token only if we don't have one already
      let token = recaptchaToken;
      if (!token && recaptchaRef.current) {
        try {
          token = await recaptchaRef.current.executeAsync();
          setRecaptchaToken(token);
        } catch (error) {
          console.error('ReCAPTCHA execution error:', error);
        }
      }

      // Only show an error if we still don't have a token after trying to get one
      if (!token) {
        throw new Error('reCAPTCHA verification required');
      }

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
          fallacyExample: fallacy.text,
          language: lang,
          recaptchaToken: token,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Evaluation failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      
      if ((error as Error).message === 'reCAPTCHA verification required') {
        setRecaptchaError('Please complete the reCAPTCHA verification');
        return {
          isCorrect: false,
          explanation: lang === 'en' ? 
            'Please complete the reCAPTCHA verification first.' : 
            'Будь ласка, спочатку пройдіть перевірку reCAPTCHA.',
          score: 0
        };
      }
      
      if ((error as Error).message === 'Invalid reCAPTCHA. Please try again.') {
        setRecaptchaError('Invalid reCAPTCHA. Please try again.');
        return {
          isCorrect: false,
          explanation: lang === 'en' ? 
            'Invalid reCAPTCHA verification. Please try again.' : 
            'Недійсна перевірка reCAPTCHA. Будь ласка, спробуйте ще раз.',
          score: 0
        };
      }
      
      return {
        isCorrect: input.trim().toLowerCase() === fallacy.fallacy_type.toLowerCase(),
        explanation: '',
        score: input.trim().toLowerCase() === fallacy.fallacy_type.toLowerCase() ? 100 : 0
      };
    } finally {
      setIsEvaluating(false);
    }
  }, [lang, recaptchaToken]);

  const handleNext = useCallback(async () => {
    if (currentFallacy) {
      try {
        const result = await evaluateAnswer(userInput, currentFallacy);
        setIsCorrect(result.isCorrect);
        setEvaluation(result);
        
        if (!recaptchaError) {
          setScore(prevScore => prevScore + result.score);
          if (result.isCorrect) {
            setStreak(prevStreak => prevStreak + 1);
          } else {
            setStreak(0);
          }
        }
        
        setShowAnswer(true);
      } catch (error) {
        console.error('Error handling next:', error);
      }
    }
  }, [userInput, currentFallacy, evaluateAnswer, recaptchaError]);

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
      
      if (e.key === 'Enter' && !showAnswer && !isLoadingFallacy && !isEvaluating) {
        handleNext();
      } else if (e.key === ' ') {
        loadNextFallacy();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userInput, showAnswer, isLoadingFallacy, isEvaluating, handleNext, loadNextFallacy]);

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

                <div className="flex flex-col items-center my-4">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    size="invisible"
                    onChange={handleRecaptchaChange}
                    hl={lang === 'ua' ? 'uk' : lang}
                  />
                  {recaptchaError && (
                    <div className="text-red-500 text-sm mt-2">{recaptchaError}</div>
                  )}
                </div>

                <FallacyControls 
                  showAnswer={showAnswer}
                  handleNext={handleNext}
                  loadNextFallacy={loadNextFallacy}
                  handleSkip={handleSkip}
                  userInput={userInput}
                  dictionary={dictionary}
                  isLoadingFallacy={isLoadingFallacy}
                  isEvaluating={isEvaluating}
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