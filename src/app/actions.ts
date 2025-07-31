'use server';

import { z } from 'zod';

export interface CaseOrder {
  date: string;
  description: string;
  pdfUrl: string;
}

export interface CaseData {
  caseType: string;
  caseNumber: string;
  filingYear: string;
  parties: {
    petitioner: string;
    respondent: string;
  };
  filingDate: string;
  nextHearingDate: string;
  orders: CaseOrder[];
}

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
  // Artificial delay to simulate network latency
  await new Promise((res) => setTimeout(res, 1500));

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

  const { caseNumber } = validatedFields.data;

  // Simulate different outcomes based on case number
  if (caseNumber === '999') {
    return {
      data: null,
      error: 'Invalid case number or year. Please check the details and try again.',
    };
  }

  if (caseNumber === '000') {
    return {
      data: null,
      error: 'The court website is currently unavailable. Please try again later.',
    };
  }
  
  if (caseNumber === '123') {
    const mockData: CaseData = {
      caseType: validatedFields.data.caseType,
      caseNumber: validatedFields.data.caseNumber,
      filingYear: validatedFields.data.filingYear,
      parties: {
        petitioner: 'M/S ACME Industries Ltd.',
        respondent: 'Union of India & ORS.',
      },
      filingDate: '15-Mar-2023',
      nextHearingDate: '28-Aug-2024',
      orders: [
        {
          date: '20-May-2024',
          description: 'Judgement - Final order passed.',
          pdfUrl: '/placeholder.pdf',
        },
        {
          date: '10-Apr-2024',
          description: 'Hearing - Arguments heard.',
          pdfUrl: '/placeholder.pdf',
        },
        {
          date: '05-Feb-2024',
          description: 'Interim Order - Application for stay.',
          pdfUrl: '/placeholder.pdf',
        },
      ],
    };

    return { data: mockData, error: null };
  }

  return {
    data: null,
    error: 'Case not found. Please try a different case number (e.g., 123).',
  };
}
