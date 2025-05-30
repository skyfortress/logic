import { NextApiRequest, NextApiResponse } from 'next';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { EvaluationRequest, EvaluationResponse, EvaluationResponseSchema } from './types';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  isLimited: boolean;
  retryAfter?: number;
}

const rateLimiter = new Map<string, RateLimitEntry>();
const RATE_LIMIT = 50;
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(clientId: string): RateLimitResult {
  const now = Date.now();
  const rateLimit = rateLimiter.get(clientId);
  
  if (rateLimit && now < rateLimit.resetTime) {
    if (rateLimit.count >= RATE_LIMIT) {
      return { 
        isLimited: true, 
        retryAfter: Math.ceil((rateLimit.resetTime - now) / 1000) 
      };
    }
    
    rateLimiter.set(clientId, { 
      count: rateLimit.count + 1, 
      resetTime: rateLimit.resetTime 
    });
  } else {
    rateLimiter.set(clientId, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW 
    });
  }
  
  return { isLimited: false };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const clientId = typeof ip === 'string' ? ip : ip[0];
    
    const rateLimitResult = checkRateLimit(clientId);
    if (rateLimitResult.isLimited) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      });
    }

    const body: EvaluationRequest = req.body;
    const { userInput, fallacyType, fallacyExample, language } = body;

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash-preview-04-17',
      temperature: 0.3,
    });

    const parser = StructuredOutputParser.fromZodSchema(EvaluationResponseSchema);

    const prompt = `You are a friendly and encouraging logic tutor with a sense of humor. 
You evaluate if players correctly identify logical fallacies in statements, but you're not too strict - this is a game meant to be fun and educational.
You MUST respond in the language specified by the user (${language}).
Evaluate the player's answer with these guidelines:
0. Evaluate whether player's answer is correct in general and is it applicable to the fallacy excercise.
1. Be generous - if they got the general idea, count it as correct even if imprecise
2. Award partial credit for attempts that show understanding but miss some details
3. Be encouraging even when they're wrong

Provide:
1. A binary decision: Is the player's answer generally correct? (true if they understood the core issue)
2. A brief, friendly explanation with a touch of humor (2-3 sentences) IN THE ${language} LANGUAGE
3. A score from 0-100, being generous (60+ for attempts that show basic understanding), but give 0 for empty responses
4. Same statement, but corrected to not have logical fallacy
5. Empty user response means they don't know the answer and want to see the result

Fallacy information for context:
Exercise: "${fallacyExample}" 
${fallacyType === 'None' && "This statement has no logic fallacy, so user must correctly guess that statemnt is valid and has no logic fallacy"} 
Fallacy type: ${fallacyType}
`

    const evaluationPrompt = ChatPromptTemplate.fromMessages([
      ['system', prompt],
      ['human', `User response: "${userInput || ''}"
{format_instructions}`]
    ]);

    const chain = evaluationPrompt.pipe(model).pipe(parser);

    try {
      const startTime = performance.now();
      
      const evaluation = await chain.invoke({
        format_instructions: parser.getFormatInstructions(),
      });
      
      const endTime = performance.now();
      const evaluationTime = endTime - startTime;
      console.log(`Evaluation completed in ${evaluationTime.toFixed(2)}ms for fallacy type: ${fallacyType}`);
      
      return res.status(200).json(evaluation);
    } catch (error) {
      console.log(error);
      const fallbackEvaluation: EvaluationResponse = {
        isCorrect: false,
        corrected: '',
        explanation: language === 'en' ? 
          "Oops! Our logic circuits got tangled. Give it another shot - even Aristotle had off days!" : 
          "Ой! Наші логічні схеми заплутались. Спробуйте ще раз - навіть Аристотель мав погані дні!",
        score: 30
      };
      return res.status(200).json(fallbackEvaluation);
    }
  } catch (error) {
    console.error('Error in evaluation API:', error);
    return res.status(500).json({
      error: 'Our fallacy detector is taking a philosophical break. Try again!'
    });
  }
}