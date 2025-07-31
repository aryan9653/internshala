
'use server';
import FirecrawlApp from 'firecrawl';
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
  status: 'Pending' | 'Disposed';
  court: string;
  judge: string;
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

const courtCaseSchema = z.object({
    caseType: z.string(),
    caseNumber: z.string(),
    filingYear: z.string(),
    caseId: z.string(),
    status: z.enum(['Pending', 'Disposed']),
    court: z.string(),
    judge: z.string(),
    parties: z.object({
        petitioner: z.string(),
        respondent: z.string(),
    }),
    filingDate: z.string(),
    nextHearingDate: z.string(),
    lastUpdated: z.string(),
    orders: z.array(z.object({
        title: z.string(),
        type: z.enum(['order', 'notice']),
        date: z.string(),
        description: z.string(),
        pdfUrl: z.string(),
    })),
});


export async function fetchCaseFromCourtApi(params: FetchParams): Promise<CaseData> {
  const { caseNumber } = params;

  if (caseNumber === '000') {
    throw new Error('The court website appears to be down. Please try again later.');
  }

  if (caseNumber === '999') {
      throw new Error('Invalid Case Number. Please check the number and try again.');
  }
  
  // This is a simulation. In a real application, you would use a web
  // scraping service or an API to fetch this data.
  const mockData: CaseData = {
      caseType: params.caseType,
      caseNumber: params.caseNumber,
      filingYear: params.filingYear,
      caseId: `CRIMINAL/${params.caseNumber}/${params.filingYear}`,
      status: 'Pending',
      court: 'Delhi High Court',
      judge: "Hon'ble Justice Rajesh Kumar",
      parties: {
          petitioner: 'Ram Kumar Sharma',
          respondent: 'State of Delhi & Ors.',
      },
      filingDate: '15-03-2024',
      nextHearingDate: '05-08-2024',
      lastUpdated: '25-07-2024',
      orders: [
          { 
            title: 'Order on Application for Interim Relief',
            type: 'order',
            date: '20-07-2024', 
            description: 'The court has considered the application for interim relief filed by the petitioner. After hearing both parties, the court grants interim relief as prayed for, subject to the petitioner furnishing an undertaking as per the terms specified in the order.', 
            pdfUrl: '#' 
          },
          { 
            title: 'Notice issued to Respondents',
            type: 'notice',
            date: '15-06-2024', 
            description: 'Notice issued to all respondents to file their response within 4 weeks. The matter is listed for hearing on the next date.', 
            pdfUrl: '#'
          },
          { 
            title: 'Case Filed and Initial Orders',
            type: 'order',
            date: '15-03-2024', 
            description: 'Petition filed and admitted. Issue notice to respondents. Registry to serve notice through all permissible modes including email and registered post.', 
            pdfUrl: '#' 
          },
      ],
  };

  return Promise.resolve(mockData);
}
