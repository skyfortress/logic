import { EvaluationResponse, Fallacy } from '../pages/api/types';

export interface SessionActivity {
  date: string; // ISO string
  duration: number; // in seconds
  points: number;
}

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
  sessionActivity: SessionActivity[];
  currentSession?: {
    startTime: string | null; // ISO string
    points: number;
  };
}

export interface RootState {
  fallacyTrainer: FallacyTrainerState;
}