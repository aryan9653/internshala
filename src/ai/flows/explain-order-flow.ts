
'use server';
/**
 * @fileOverview An AI flow to explain a legal order in simple terms.
 *
 * - explainOrder - A function that explains a legal order.
 * - ExplainOrderInput - The input type for the explainOrder function.
 * - ExplainOrderOutput - The return type for the explainOrder function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExplainOrderInputSchema = z.object({
  orderText: z.string().describe('The full text or description of the legal order.'),
});
export type ExplainOrderInput = z.infer<typeof ExplainOrderInputSchema>;

const ExplainOrderOutputSchema = z.object({
  summary: z.string().describe('A one-sentence summary of the order\'s main outcome.'),
  keyPoints: z.array(z.string()).describe('A bulleted list of the most important points, translated into plain English.'),
});
export type ExplainOrderOutput = z.infer<typeof ExplainOrderOutputSchema>;


const explainOrderPrompt = ai.definePrompt({
    name: 'explainOrderPrompt',
    input: { schema: ExplainOrderInputSchema },
    output: { schema: ExplainOrderOutputSchema },
    prompt: `
        You are an expert legal assistant who specializes in translating complex legal jargon into plain, easy-to-understand English for the general public.

        Analyze the following text from a court order. Your goal is to explain its meaning clearly and concisely.

        Provide the following:
        1. A single-sentence summary of the main outcome or decision in the order.
        2. A bulleted list of 2-3 key points that explain what the order means in practice for the people involved.

        Do not use legal jargon in your explanation. Focus on clarity and simplicity.

        Order Text:
        "{{{orderText}}}"
    `,
});

const explainOrderFlow = ai.defineFlow(
    {
        name: 'explainOrderFlow',
        inputSchema: ExplainOrderInputSchema,
        outputSchema: ExplainOrderOutputSchema,
    },
    async (input) => {
        const { output } = await explainOrderPrompt(input);
        return output!;
    }
);

export async function explainOrder(input: ExplainOrderInput): Promise<ExplainOrderOutput> {
    return await explainOrderFlow(input);
}
