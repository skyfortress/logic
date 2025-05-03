import { EvaluationResponse } from '../api/types';

export interface Dictionary {
  title: string;
  subtitle: string;
  instruction: string;
  shortcuts: string;
  enter: string;
  enterAction: string;
  space: string;
  spaceAction: string;
  identifyFallacy: string;
  allSeen: string;
  remaining: string;
  score: string;
  fallacyQuestion: string;
  inputPlaceholder: string;
  checkAnswer: string;
  nextFallacy: string;
  skip: string;
  correct: string;
  incorrect: string;
  itsA: string;
  correctedArgument: string;
  yourAnswer: string;
  copyright: string;
  evaluating: string;
  fallaciesList?: {
    title: string;
    description: string;
    example: string;
    explanation: string;
  };
}