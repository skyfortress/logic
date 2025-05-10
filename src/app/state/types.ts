import { EvaluationResponse, Fallacy, FallacyMastery } from '../api/types';

export interface FallacyTrainerState {
  currentFallacy: Fallacy | null;
  userInput: string;
  showAnswer: boolean;
  score: number;
  streak: number;
  isCorrect: boolean | null;
  isLoadingFallacy: boolean;
  isEvaluating: boolean;
  evaluation: EvaluationResponse | null;
  seenFallacyIds: string[];
  fallacyMasteries: FallacyMastery[];
}

export interface RootState {
  fallacyTrainer: FallacyTrainerState;
}