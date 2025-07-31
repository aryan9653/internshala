
'use server';

import { z } from 'zod';
import { fetchCaseFromCourtApi, type CaseData } from '@/services/court-api';

export type { CaseData, CaseOrder } from '@/services/court-api';

export interface ActionState {
  data: CaseData | null;
  error: string | null;
}

const schema = z.object({
  caseType: z.string(),
  caseNumber: z.string().min(1, 'Case number is required'),
  filingYear: z.string().min(4, 'Filing year is required').max(4),
});

export async function fetchCaseData(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Artificial delay to simulate network latency, can be removed
  await new Promise((res) => setTimeout(res, 500));

  const validatedFields = schema.safeParse({
    caseType: formData.get('caseType'),
    caseNumber: formData.get('caseNumber'),
    filingYear: formData.get('filingYear'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid form data. Please ensure all fields are correctly filled.',
    };
  }
  
  try {
    const data = await fetchCaseFromCourtApi(validatedFields.data);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'An unknown error occurred.' };
  }
}
