import { NextRequest, NextResponse } from 'next/server';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { EvaluationRequest, EvaluationResponse, EvaluationResponseSchema } from '../types';
import { StructuredOutputParser } from '@langchain/core/output_parsers';

export async function POST(request: NextRequest) {
  try {
    const body: EvaluationRequest = await request.json();
    const { userInput, correctAnswer, fallacyDescription, fallacyType, fallacyExample, language } = body;

    const model = new ChatDeepSeek({
      modelName: 'deepseek-chat',
      temperature: 0.7,
    });

    const parser = StructuredOutputParser.fromZodSchema(EvaluationResponseSchema);

    const evaluationPrompt = ChatPromptTemplate.fromMessages([
      ['system', `You are an expert in logical reasoning and logical fallacies. 
Evaluate if the user's response correctly identifies what's wrong with a statement containing a logical fallacy.`],
      ['human', `Given the following:

Fallacy information:
- Type: {fallacyType}
- Description: {fallacyDescription}
- Example: {fallacyExample}

User's answer: {userInput}
Correct answer: {correctAnswer}

First, determine if the user's answer is correct. An answer is correct if:
1. The user correctly explained what's wrong with the logical reasoning in the statement
2. The user demonstrated understanding of the flawed logic even if they didn't use technical terminology

Consider identifying the specific fallacy type as a bonus that can improve the score but isn't required for correctness.

Then provide:
1. A binary decision: Is the user's answer correct? (true/false)
2. A brief explanation for your decision (2-3 sentences maximum)
3. A score from 0-100 based on the quality of the explanation (with extra points if they correctly identified the fallacy type)

{format_instructions}`]
    ]);

    const chain = evaluationPrompt.pipe(model).pipe(parser);

    try {
      const evaluation = await chain.invoke({
        fallacyType,
        fallacyDescription,
        fallacyExample,
        userInput,
        correctAnswer,
        format_instructions: parser.getFormatInstructions(),
      });
      
      return NextResponse.json(evaluation, { status: 200 });
    } catch (error) {
      const fallbackEvaluation: EvaluationResponse = {
        isCorrect: false,
        explanation: "Unable to evaluate response. Please try again with a more detailed explanation of what's wrong with the statement.",
        score: 0
      };
      return NextResponse.json(fallbackEvaluation, { status: 200 });
    }
  } catch (error) {
    console.error('Error in evaluation API:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate response' },
      { status: 500 }
    );
  }
}