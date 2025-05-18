import { useEffect, useCallback } from 'react';
import type { Dictionary } from '../components/types';

import Header from '../components/Header';
import FallacyQuestion from '../components/FallacyQuestion';
import UserInput from '../components/UserInput';
import FallacyControls from '../components/FallacyControls';
import StatusBar from '../components/StatusBar';
import FallacyResult from '../components/FallacyResult';
import Footer from '../components/Footer';
import MasteryDialog from '../components/MasteryDialog';
import SessionCompleteView from '../components/SessionCompleteView';

import { useAppDispatch, useAppSelector } from '../state/hooks';
import { 
  setCurrentFallacy,
  setUserInput,
  setShowAnswer,
  updateScore,
  incrementStreak,
  resetStreak,
  setCorrect,
  setLoadingFallacy,
  setEvaluating,
  setEvaluation,
  addSeenFallacy,
  resetSeenFallacies,
  updateFallacyMastery,
  resetAnswerState,
  hideMasteryDialog,
  incrementQuestionsInSession,
  resetSession,
  endCurrentSession,
  showResults,
  MASERY_COUNT,
  QUESTIONS_IN_SESSION
} from '../state/slices/fallacyTrainerSlice';
import { FallacyResponse } from '@/pages/api/fallacy';
import { Fallacy, EvaluationResponse } from '@/pages/api/types';

export default function FallacyTrainer({ dictionary, lang }: { dictionary: Dictionary; lang: string }) {
  const dispatch = useAppDispatch();
  
  const { 
    currentFallacy,
    userInput,
    showAnswer,
    score,
    streak,
    isCorrect,
    isLoadingFallacy,
    isEvaluating,
    evaluation,
    seenFallacyIds,
    fallacyMasteries,
    showMasteryDialog: isShowingMasteryDialog,
    questionsInSession,
    isSessionComplete,
    showSessionResults,
    currentSession
  } = useAppSelector(state => state.fallacyTrainer);

  const sessionScore = currentSession?.points || 0;

  const isFallacyMastered = (fallacyType: string): boolean => {
    return (fallacyMasteries[fallacyType] || 0) >= MASERY_COUNT;
  }

  const fetchNextFallacy = useCallback(async (forceReset = false) => {
    try {
      dispatch(setLoadingFallacy(true));
      
      if (forceReset) {
        dispatch(resetSeenFallacies());
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
        dispatch(setCurrentFallacy(data.fallacy));
        dispatch(addSeenFallacy(data.fallacy.id.toString()));
      } else if (!forceReset) {
        fetchNextFallacy(true);
      } else {
        console.error('No fallacies available after reset');
      }
    } catch (error) {
      console.error('Error fetching fallacy:', error);
    } finally {
      dispatch(setLoadingFallacy(false));
    }
  }, [seenFallacyIds, lang, dispatch]);

  const loadNextFallacy = useCallback(() => {
    fetchNextFallacy(false);
    dispatch(resetAnswerState());
  }, [fetchNextFallacy, dispatch]);

  const evaluateAnswer = useCallback(async (input: string, fallacy: Fallacy): Promise<EvaluationResponse> => {
    try {
      dispatch(setEvaluating(true));

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: input,
          correctAnswer: fallacy.fallacy_type,
          fallacyType: fallacy.fallacy_type,
          fallacyExample: fallacy.text,
          language: lang,
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
      return {
        isCorrect: input.trim().toLowerCase() === fallacy.fallacy_type.toLowerCase(),
        explanation: '',
        score: input.trim().toLowerCase() === fallacy.fallacy_type.toLowerCase() ? 100 : 0
      };
    } finally {
      dispatch(setEvaluating(false));
    }
  }, [lang, dispatch]);

  const handleNext = useCallback(async () => {
    if (currentFallacy) {
      try {
        const result = await evaluateAnswer(userInput, currentFallacy);
        dispatch(setCorrect(result.isCorrect));
        dispatch(setEvaluation(result));
        dispatch(updateScore(result.score));
        
        if (result.isCorrect) {
          dispatch(incrementStreak());
          const fallacyType = currentFallacy.fallacy_type;
          dispatch(updateFallacyMastery(fallacyType));
        } else {
          dispatch(resetStreak());
        }

        dispatch(setShowAnswer(true));
        dispatch(incrementQuestionsInSession());
      } catch (error) {
        console.error('Error handling next:', error);
      }
    }
  }, [userInput, currentFallacy, evaluateAnswer, dispatch]);

  const handleSkip = useCallback(() => {
    if (questionsInSession >= QUESTIONS_IN_SESSION - 1) {
      dispatch(incrementQuestionsInSession());
    } else {
      loadNextFallacy();
      dispatch(incrementQuestionsInSession());
    }
  }, [loadNextFallacy, dispatch, questionsInSession]);

  const handleCloseMasteryDialog = useCallback(() => {
    dispatch(hideMasteryDialog());
  }, [dispatch]);
  
  const handleStartNewSession = useCallback(() => {
    dispatch(resetSession());
    fetchNextFallacy(true);
  }, [dispatch, fetchNextFallacy]);

  const handleShowResults = useCallback(() => {
    dispatch(showResults());
  }, [dispatch]);

  const isLastQuestionInSession = questionsInSession === QUESTIONS_IN_SESSION;

  useEffect(() => {
    loadNextFallacy();
    
    return () => {
      dispatch(endCurrentSession());
    };
  }, []);

  const handleInputChange = useCallback((value: string) => {
    dispatch(setUserInput(value));
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch(endCurrentSession());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  return (<>
        {showSessionResults ? (
          <SessionCompleteView
            score={sessionScore}
            dictionary={dictionary}
            onStartNewSession={handleStartNewSession}
            correctPercentage={questionsInSession > 0 ? 
              Math.round((currentSession?.points || 0) / questionsInSession) : 0}
          />
        ) : currentFallacy && (
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-md border border-slate-100 p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <StatusBar 
                score={sessionScore}
                dictionary={dictionary}
                streak={streak}
                questionsInSession={questionsInSession}
              />

              <div className="mb-3 sm:mb-4">
                <FallacyQuestion 
                  fallacy={currentFallacy}
                  isMastered={currentFallacy ? isFallacyMastered(currentFallacy.fallacy_type) : false} 
                  dictionary={dictionary}
                />
              </div>

              <div className="space-y-4 sm:space-y-6">
                <UserInput 
                  userInput={userInput}
                  setUserInput={handleInputChange}
                  showAnswer={showAnswer}
                  dictionary={dictionary}
                />

                <FallacyControls 
                  showAnswer={showAnswer}
                  handleNext={handleNext}
                  loadNextFallacy={loadNextFallacy}
                  handleSkip={handleSkip}
                  handleShowResults={handleShowResults}
                  userInput={userInput}
                  dictionary={dictionary}
                  isLoadingFallacy={isLoadingFallacy}
                  isEvaluating={isEvaluating}
                  isLastQuestionInSession={isLastQuestionInSession}
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
        {isShowingMasteryDialog && (
          <MasteryDialog
            onClose={handleCloseMasteryDialog}
            fallacyType={currentFallacy?.fallacy_type || ''}
            dictionary={dictionary}
          />)
        }
      </>
  );
}