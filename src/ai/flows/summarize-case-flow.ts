
'use server';
/**
 * @fileOverview An AI flow to summarize court case data.
 *
 * - summarizeCase - A function that generates a summary for a given court case.
 * - CaseData - The input type for the summarizeCase function (imported).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { type CaseData } from '@/services/court-api';

// Re-defining the schema here to pass to the prompt, as we can't pass the TS type directly.
const CaseDataSchema = z.object({
    caseId: z.string(),
    cnrNumber: z.string(),
    status: z.enum(['Pending', 'Disposed']),
    registrationDate: z.string(),
    filingDate: z.string(),
    court: z.string(),
    judge: z.string(),
    subject: z.string(),
    filingAdvocate: z.string(),
    dealingAssistant: z.string(),
    parties: z.object({
        petitioner: z.string(),
        respondent: z.string(),
    }),
    nextHearingDate: z.string(),
    lastUpdated: z.string(),
    orders: z.array(z.object({
        title: z.string(),
        type: z.enum(['order', 'notice']),
        date: z.string(),
        description: z.string(),
        pdfUrl: z.string().url(),
    })),
});


const summarizeCasePrompt = ai.definePrompt({
  name: 'summarizeCasePrompt',
  input: { schema: CaseDataSchema },
  output: { schema: z.string() },
  prompt: `
    You are a legal analyst AI. Your task is to provide a clear, concise summary of the following court case based on the data provided.

    The summary should be easy for a layperson to understand.
    - Start with a sentence stating the case name (Petitioner vs. Respondent) and its current status.
    - Briefly explain what the case is about based on its subject.
    - Mention the most recent significant event (e.g., the latest order or the next hearing date).
    - Keep the summary to 2-3 sentences.

    Case Data:
    - Case ID: {{{caseId}}}
    - Parties: {{{parties.petitioner}}} vs. {{{parties.respondent}}}
    - Status: {{{status}}}
    - Subject: {{{subject}}}
    - Next Hearing Date: {{{nextHearingDate}}}
    - Orders:
    {{#each orders}}
      - {{this.date}}: {{this.title}} - {{this.description}}
    {{/each}}
  `,
});


const summarizeCaseFlow = ai.defineFlow(
  {
    name: 'summarizeCaseFlow',
    inputSchema: CaseDataSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await summarizeCasePrompt(input);
    return output!;
  }
);


export async function summarizeCase(input: CaseData): Promise<string> {
    return await summarizeCaseFlow(input);
}
