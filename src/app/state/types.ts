import { EvaluationResponse, Fallacy } from '../api/types';

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
  fallacyMasteries: {[type: string]: number};
  showMasteryDialog: boolean;
}

export interface RootState {
  fallacyTrainer: FallacyTrainerState;
}