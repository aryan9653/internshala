
'use server';
import { z } from 'zod';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

export interface CaseOrder {
  title: string;
  type: 'order' | 'notice';
  date: string;
  description: string;
  pdfUrl: string;
}

export interface CaseData {
  caseType: string;
  caseNumber: string;
  filingYear: string;
  caseId: string;
  cnrNumber: string;
  status: 'Pending' | 'Disposed';
  registrationDate: string;
  court: string;
  judge: string;
  subject: string;
  filingAdvocate: string;
  dealingAssistant: string;
  parties: {
    petitioner: string;
    respondent: string;
  };
  filingDate: string;
  nextHearingDate: string;
  lastUpdated: string;
  orders: CaseOrder[];
}

interface FetchParams {
  caseType: string;
  caseNumber: string;
  filingYear: string;
}

/**
 * Fetches and parses case data from a public court website.
 *
 * This function simulates a call to a real court website.
 *
 * @param {FetchParams} params - The parameters for the case to fetch.
 * @returns {Promise<CaseData>} The parsed case data.
 * @throws {Error} If the case is not found, the website is down, or parsing fails.
 */
export async function fetchCaseFromCourtApi(params: FetchParams): Promise<CaseData> {
  if (params.caseNumber === '999') {
    throw new Error('Invalid Case Number. Please check the number and try again. No record found for this case on the court website.');
  }
  if (params.caseNumber === '000') {
      throw new Error('The court website appears to be down or is blocking requests. Please try again later.');
  }

  const currentYear = new Date().getFullYear();
  const caseStatus = parseInt(params.filingYear, 10) < currentYear ? 'Disposed' : 'Pending';
  const cnrNumber = `DLHC01${Math.floor(Math.random() * 1000000)}2024`;
  const baseData = {
      caseType: params.caseType,
      caseNumber: params.caseNumber,
      filingYear: params.filingYear,
      caseId: `${params.caseType.replace(/\./g, '')}/${params.caseNumber}/${params.filingYear}`,
      cnrNumber: cnrNumber,
      status: caseStatus,
      registrationDate: '01-04-2024',
      court: 'Delhi High Court',
      judge: "Hon'ble Justice Rajesh Kumar",
      dealingAssistant: "ORG-IPD1",
      filingDate: '15-03-2024',
      nextHearingDate: '05-08-2024',
      lastUpdated: '25-07-2024',
  };

  let mockData: CaseData;

  switch (params.caseType) {
    case 'W.P.(C)':
      mockData = {
        ...baseData,
        subject: "Public Interest Litigation regarding environmental clearances.",
        filingAdvocate: "Priya Sharma",
        parties: {
          petitioner: 'Green Earth Foundation',
          respondent: 'Union of India & Ors.',
        },
        orders: [
          { title: 'Direction to file status report', type: 'order', date: '22-07-2024', description: 'Respondents are directed to file a detailed status report on the measures taken.', pdfUrl: '/sample-order-wpc.html' },
          { title: 'Notice issued', type: 'notice', date: '18-06-2024', description: 'Issue notice to all concerned parties. Reply to be filed within four weeks.', pdfUrl: '/sample-order-wpc.html' },
        ],
      };
      break;
    case 'CS(OS)':
      mockData = {
        ...baseData,
        subject: "Suit for recovery of money and damages.",
        filingAdvocate: "Rajiv Malhotra",
        parties: {
          petitioner: 'ABC Corporation Ltd.',
          respondent: 'XYZ Pvt. Ltd.',
        },
        orders: [
          { title: 'Application for summary judgment', type: 'order', date: '15-07-2024', description: 'The application for summary judgment is dismissed. The case will proceed to trial.', pdfUrl: '/sample-order-csos.html' },
          { title: 'Summons issued to defendant', type: 'notice', date: '10-05-2024', description: 'Summons to be served upon the defendant. Written statement to be filed.', pdfUrl: '/sample-order-csos.html' },
        ],
      };
      break;
    case 'FAO':
      mockData = {
        ...baseData,
        subject: "Appeal against ad-interim injunction order.",
        filingAdvocate: "Sunita Reddy",
        parties: {
          petitioner: 'Creative Designs Inc.',
          respondent: 'Innovate Tech Solutions',
        },
        orders: [
          { title: 'Stay on lower court order', type: 'order', date: '25-07-2024', description: 'The operation of the impugned order of the trial court is stayed till the next date of hearing.', pdfUrl: '/sample-order-fao.html' },
          { title: 'Notice of appeal', type: 'notice', date: '20-06-2024', description: 'Issue notice of the appeal to the respondent.', pdfUrl: '/sample-order-fao.html' },
        ],
      };
      break;
    case 'CRL.A':
      mockData = {
        ...baseData,
        subject: "Appeal against conviction under Section 302 IPC.",
        filingAdvocate: "Vikram Singh",
        parties: {
          petitioner: 'State (NCT of Delhi)',
          respondent: 'Arjun Kumar',
        },
        orders: [
          { title: 'Bail application rejected', type: 'order', date: '19-07-2024', description: 'The application for suspension of sentence and grant of bail is dismissed.', pdfUrl: '/sample-order-crla.html' },
          { title: 'Admit appeal', type: 'notice', date: '12-06-2024', description: 'The appeal is admitted for hearing. Call for trial court records.', pdfUrl: '/sample-order-crla.html' },
        ],
      };
      break;
    default:
        throw new Error('Invalid case type selected.');
  }


  return Promise.resolve(mockData);
}
