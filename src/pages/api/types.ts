import { z } from 'zod';

export interface EvaluationRequest {
  userInput: string;
  correctAnswer: string;
  fallacyDescription: string;
  fallacyType: string;
  fallacyExample: string;
  language: string;
  recaptchaToken: string;
}

export const EvaluationResponseSchema = z.object({
  isCorrect: z.boolean(),
  explanation: z.string(),
  corrected: z.string().describe('Corrected statement'),
  score: z.number().int().min(0).max(100)
});

export type EvaluationResponse = z.infer<typeof EvaluationResponseSchema>;

export interface Fallacy {
  id: number,
  text: string;
  fallacy_type: string;
  corrected: string;
}