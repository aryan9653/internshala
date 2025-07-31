/**
 * @file This file simulates a backend service that would scrape a court website.
 * In a real-world application, this is where you would put your web scraping
 * or API client logic (e.g., using Playwright, Selenium, or an official API).
 */

import { format, addDays, subYears } from 'date-fns';

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

// Helper function to create a seeded random number generator
function seededRandom(seed: number) {
    let state = seed % 2147483647;
    if (state <= 0) state += 2147483646;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}


const petitioners = ['M/S ACME Industries Ltd.', 'Shri Ram Kumar', 'Smt. Sita Devi', 'Global Tech Innovations', 'Sunrise Pharmaceuticals'];
const respondents = ['Union of India & ORS.', 'State of NCT of Delhi', 'Mahanagar Telephone Nigam Ltd.', 'Delhi Development Authority', 'National Highways Authority of India'];
const orderDescriptions = [
    'Judgement - Final order passed.',
    'Hearing - Arguments heard.',
    'Interim Order - Application for stay.',
    'Notice Issued - Reply to be filed.',
    'Pleadings - Completion of pleadings.',
    'Adjournment - Case adjourned.'
];


/**
 * Simulates fetching case data from a court's website.
 * @param params The case details to search for.
 * @returns A promise that resolves with the case data.
 * @throws An error if the case is not found or if there's a simulated server error.
 */
export async function fetchCaseFromCourtApi(params: FetchParams): Promise<CaseData> {
  const { caseNumber, filingYear } = params;

  // Simulate specific error outcomes for demonstration
  if (caseNumber === '999') {
    throw new Error('Invalid case number or year. Please check the details and try again.');
  }

  if (caseNumber === '000') {
    throw new Error('The court website is currently unavailable. Please try again later.');
  }
  
  if (!/^\d{1,5}$/.test(caseNumber) || !/^\d{4}$/.test(filingYear)) {
    throw new Error('Case not found. Please ensure the case number and year are valid.');
  }

  // Create a consistent seed from the case details for reproducible "random" data
  const seed = parseInt(caseNumber, 10) + parseInt(filingYear, 10);
  const random = seededRandom(seed);

  const filingDate = new Date(parseInt(filingYear, 10), Math.floor(random() * 12), Math.floor(random() * 28) + 1);

  const mockData: CaseData = {
    caseType: params.caseType,
    caseNumber: params.caseNumber,
    filingYear: params.filingYear,
    parties: {
      petitioner: petitioners[Math.floor(random() * petitioners.length)],
      respondent: respondents[Math.floor(random() * respondents.length)],
    },
    filingDate: format(filingDate, 'dd-MMM-yyyy'),
    nextHearingDate: format(addDays(new Date(), Math.floor(random() * 90) + 30), 'dd-MMM-yyyy'),
    orders: Array.from({ length: Math.floor(random() * 4) + 2 }, (_, i) => {
        const orderDate = subYears(addDays(new Date(), -i * (Math.floor(random() * 60) + 30)), i > 3 ? 1 : 0);
        return {
            date: format(orderDate, 'dd-MMM-yyyy'),
            description: orderDescriptions[Math.floor(random() * orderDescriptions.length)],
            pdfUrl: '/placeholder.pdf', // Using a placeholder as we can't generate real PDFs
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };

  return mockData;
}