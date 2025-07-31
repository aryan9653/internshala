
/**
 * @file This file simulates a backend service that would scrape a court website.
 * In a real-world application, this is where you would put your web scraping
 * or API client logic (e.g., using Playwright, Selenium, or an official API).
 */

import { format, addDays, getYear, setYear, parse } from 'date-fns';

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

const PETITIONERS = [
  'M/S ACME Industries Ltd.',
  'Shri Raj Kumar',
  'Smt. Anita Devi',
  'Future Enterprises Pvt. Ltd.',
  'Phoenix Legal Services',
];

const RESPONDENTS = [
  'Union of India & ORS.',
  'State of NCT of Delhi',
  'Mahanagar Telephone Nigam Ltd.',
  'The Oriental Insurance Co. Ltd.',
  'Registrar of Companies',
];

/**
 * Simulates fetching case data from a court's website.
 * @param params The case details to search for.
 * @returns A promise that resolves with the case data.
 * @throws An error if the case is not found or if there's a simulated server error.
 */
export async function fetchCaseFromCourtApi(params: FetchParams): Promise<CaseData> {
  const { caseNumber, filingYear } = params;

  // ===================================================================================
  // HOW TO INTEGRATE A REAL DATA SOURCE
  // ===================================================================================
  // To connect this application to a real court data source (either via an API you
  // have access to, or a web scraper you build), you would replace the simulation
  // logic below with your actual data fetching code.
  //
  // 1. Make an API Call:
  //    const response = await fetch(`https://your-court-api.com/cases?cn=${caseNumber}&cy=${filingYear}`);
  //    if (!response.ok) {
  //      throw new Error('Failed to fetch from API.');
  //    }
  //    const realData = await response.json();
  //    return realData;
  //
  // 2. Or, Call Your Scraper:
  //    If you build a scraper (e.g., as a separate serverless function), you would
  //    call it from here.
  //    const realData = await myScraperFunction({ caseNumber, filingYear });
  //    return realData;
  //
  // The rest of the function below is for generating realistic MOCK DATA for the demo.
  // You can safely remove it when you integrate your real data source.
  // ===================================================================================

  // --- Start of Simulation Logic ---

  if (!/^\d+$/.test(caseNumber) || !/^\d{4}$/.test(filingYear)) {
    throw new Error('Invalid input. Case number and year must be numeric.');
  }
  
  // Use case number to create deterministic "randomness" for mock data
  const numericCaseNumber = parseInt(caseNumber, 10);

  // Simulate specific outcomes for demonstration
  if (caseNumber === '999') {
    throw new Error('Invalid case number or year. Please check the details and try again.');
  }

  if (caseNumber === '000') {
    throw new Error('The court website is currently unavailable. Please try again later.');
  }

  const baseDateStr = `15-Jan-${filingYear}`;
  let filingDateObj;
  try {
     filingDateObj = parse(baseDateStr, 'dd-MMM-yyyy', new Date());
     if (isNaN(filingDateObj.getTime())) {
        filingDateObj = new Date(); // fallback to current date
     }
  } catch (e) {
    filingDateObj = new Date(); // fallback
  }

  const petitionerIndex = numericCaseNumber % PETITIONERS.length;
  const respondentIndex = (numericCaseNumber + 1) % RESPONDENTS.length;

  const successfulCase: CaseData = {
    caseType: params.caseType,
    caseNumber: params.caseNumber,
    filingYear: params.filingYear,
    parties: {
      petitioner: PETITIONERS[petitionerIndex],
      respondent: RESPONDENTS[respondentIndex],
    },
    filingDate: format(filingDateObj, 'dd-MMM-yyyy'),
    nextHearingDate: format(addDays(new Date(), numericCaseNumber % 60), 'dd-MMM-yyyy'),
    orders: [
      {
        date: format(addDays(filingDateObj, (numericCaseNumber % 30) + 60), 'dd-MMM-yyyy'),
        description: 'Hearing - Arguments heard, judgment reserved.',
        pdfUrl: '/placeholder.pdf',
      },
      {
        date: format(addDays(filingDateObj, (numericCaseNumber % 20) + 30), 'dd-MMM-yyyy'),
        description: 'Interim Order - Application for discovery.',
        pdfUrl: '/placeholder.pdf',
      },
      {
        date: format(filingDateObj, 'dd-MMM-yyyy'),
        description: 'Notice Issued - Reply to be filed.',
        pdfUrl: '/placeholder.pdf',
      },
    ],
  };

  return successfulCase;
  // --- End of Simulation Logic ---
}
