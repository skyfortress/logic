import { NextRequest, NextResponse } from 'next/server';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { EvaluationRequest, EvaluationResponse, EvaluationResponseSchema } from '../types';
import { StructuredOutputParser } from '@langchain/core/output_parsers';

export async function POST(request: NextRequest) {
  try {
    const body: EvaluationRequest = await request.json();
    const { userInput, fallacyType, fallacyExample, language } = body;

    const model = new ChatDeepSeek({
      modelName: 'deepseek-chat',
      temperature: 0.8,
    });

    const parser = StructuredOutputParser.fromZodSchema(EvaluationResponseSchema);

    const evaluationPrompt = ChatPromptTemplate.fromMessages([
      ['system', `You are a friendly and encouraging logic tutor with a sense of humor. 
You evaluate if players correctly identify logical fallacies in statements, but you're not too strict - this is a game meant to be fun and educational.
You MUST respond in the language specified by the user (${language}).`],
      ['human', `Given the following:

Fallacy information:
- Example: {fallacyExample}

Player's answer: {userInput}

Language to respond in: {language}

Evaluate the player's answer with these guidelines:
0. Evaluate whether player's answer is correct in general and is it applicable to the fallacy example.
1. Be generous - if they got the general idea, count it as correct even if imprecise
2. Award partial credit for attempts that show understanding but miss some details
3. Be encouraging even when they're wrong

Provide:
1. A binary decision: Is the player's answer generally correct? (true if they understood the core issue)
2. A brief, friendly explanation with a touch of humor (2-3 sentences) IN THE {language} LANGUAGE
3. A score from 0-100, being generous (60+ for attempts that show basic understanding)

{format_instructions}`]
    ]);

    const chain = evaluationPrompt.pipe(model).pipe(parser);

    try {
      const evaluation = await chain.invoke({
        fallacyType,
        fallacyExample,
        userInput,
        language,
        format_instructions: parser.getFormatInstructions(),
      });
      
      return NextResponse.json(evaluation, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const fallbackEvaluation: EvaluationResponse = {
        isCorrect: false,
        explanation: language === 'en' ? 
          "Oops! Our logic circuits got tangled. Give it another shot - even Aristotle had off days!" : 
          "Ой! Наші логічні схеми заплутались. Спробуйте ще раз - навіть Аристотель мав погані дні!",
        score: 30
      };
      return NextResponse.json(fallbackEvaluation, { status: 200 });
    }
  } catch (error) {
    console.error('Error in evaluation API:', error);
    return NextResponse.json(
      { error: 'Our fallacy detector is taking a philosophical break. Try again!' },
      { status: 500 }
    );
  }
}