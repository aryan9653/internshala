/**
 * @file This file simulates a backend service that would scrape a court website.
 * In a real-world application, this is where you would put your web scraping
 * or API client logic (e.g., using Playwright, Selenium, or an official API).
 */

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

/**
 * Simulates fetching case data from a court's website.
 * @param params The case details to search for.
 * @returns A promise that resolves with the case data.
 * @throws An error if the case is not found or if there's a simulated server error.
 */
export async function fetchCaseFromCourtApi(params: FetchParams): Promise<CaseData> {
  const { caseNumber } = params;

  // Simulate different outcomes based on case number
  if (caseNumber === '999') {
    throw new Error('Invalid case number or year. Please check the details and try again.');
  }

  if (caseNumber === '000') {
    throw new Error('The court website is currently unavailable. Please try again later.');
  }

  if (caseNumber === '123') {
    const mockData: CaseData = {
      caseType: params.caseType,
      caseNumber: params.caseNumber,
      filingYear: params.filingYear,
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
    return mockData;
  }

  throw new Error('Case not found. Please try a different case number (e.g., 123).');
}
