
/**
 * @file This file simulates a backend service that would scrape a court website.
 * In a real-world application, this is where you would put your web scraping
 * or API client logic (e.g., using Playwright, Selenium, or an official API).
 */

import { format, addDays } from 'date-fns';

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

interface FetchParams {
  caseType: string;
  caseNumber: string;
  filingYear: string;
}

const successfulCase: CaseData = {
  caseType: 'W.P.(C)',
  caseNumber: '123',
  filingYear: '2023',
  parties: {
    petitioner: 'M/S ACME Industries Ltd.',
    respondent: 'Union of India & ORS.',
  },
  filingDate: '15-Jan-2023',
  nextHearingDate: format(addDays(new Date(), 45), 'dd-MMM-yyyy'),
  orders: [
    {
      date: format(addDays(new Date(), -30), 'dd-MMM-yyyy'),
      description: 'Hearing - Arguments heard.',
      pdfUrl: '/placeholder.pdf',
    },
    {
      date: format(addDays(new Date(), -90), 'dd-MMM-yyyy'),
      description: 'Interim Order - Application for stay.',
      pdfUrl: '/placeholder.pdf',
    },
    {
      date: '15-Jan-2023',
      description: 'Notice Issued - Reply to be filed.',
      pdfUrl: '/placeholder.pdf',
    },
  ],
};

/**
 * Simulates fetching case data from a court's website.
 * @param params The case details to search for.
 * @returns A promise that resolves with the case data.
 * @throws An error if the case is not found or if there's a simulated server error.
 */
export async function fetchCaseFromCourtApi(params: FetchParams): Promise<CaseData> {
  const { caseNumber } = params;

  // Simulate specific outcomes for demonstration
  if (caseNumber === '123') {
    return {
        ...successfulCase,
        caseType: params.caseType,
        filingYear: params.filingYear
    };
  }

  if (caseNumber === '999') {
    throw new Error('Invalid case number or year. Please check the details and try again.');
  }

  if (caseNumber === '000') {
    throw new Error('The court website is currently unavailable. Please try again later.');
  }

  throw new Error('Case not found. Please ensure the case number and year are valid.');
}
