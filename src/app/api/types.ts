import { z } from 'zod';

export interface EvaluationRequest {
  userInput: string;
  correctAnswer: string;
  fallacyDescription: string;
  fallacyType: string;
  fallacyExample: string;
  language: string;
}

export const EvaluationResponseSchema = z.object({
  isCorrect: z.boolean(),
  explanation: z.string(),
  score: z.number().int().min(0).max(100)
});

export type EvaluationResponse = z.infer<typeof EvaluationResponseSchema>;

export interface Fallacy {
  text: string;
  fallacy_type: string;
  explanation: string;
  corrected: string;
  id: number;
}