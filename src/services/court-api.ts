
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

// Zod schema for AI-powered data extraction from the court website.
// The descriptions guide the AI to correctly identify and parse the data.
const courtCaseSchema = z.object({
    caseType: z.string().describe("The type of the case, e.g., 'W.P.(C)'."),
    caseNumber: z.string().describe('The unique number assigned to the case for the year.'),
    filingYear: z.string().describe('The year the case was filed.'),
    caseId: z.string().describe("The full case ID, usually a combination of type, number, and year."),
    status: z.enum(['Pending', 'Disposed']).describe('The current status of the case.'),
    court: z.string().describe('The name of the court, e.g., "Delhi High Court".'),
    judge: z.string().describe("The name of the judge or bench presiding over the case."),
    parties: z.object({
        petitioner: z.string().describe("The name of the petitioner."),
        respondent: z.string().describe("The name of the respondent."),
    }).describe('The primary parties involved in the case.'),
    filingDate: z.string().describe('The date the case was officially filed.'),
    nextHearingDate: z.string().describe('The date scheduled for the next hearing.'),
    lastUpdated: z.string().describe('The date the case information was last updated.'),
    orders: z.array(z.object({
        title: z.string().describe('The title or subject of the order.'),
        type: z.enum(['order', 'notice']).describe("The type of document, e.g., 'order' or 'notice'."),
        date: z.string().describe('The date the order was passed.'),
        description: z.string().describe('A brief summary of the order.'),
        pdfUrl: z.string().url().describe('The full URL to download the PDF of the order.'),
    })).describe('A list of recent orders and judgments for the case.'),
});


/**
 * Fetches and parses case data from a public court website using Firecrawl.
 *
 * This function simulates a call to a real court website.
 * In a production scenario, this would involve:
 * 1.  Constructing the correct URL for the court's case status page.
 * 2.  Using a service like Firecrawl to scrape the website's HTML.
 * 3.  Employing an AI-powered extractor to parse the HTML into a structured format.
 * 4.  Handling CAPTCHA and other anti-scraping measures.
 *
 * @param {FetchParams} params - The parameters for the case to fetch.
 * @returns {Promise<CaseData>} The parsed case data.
 * @throws {Error} If the case is not found, the website is down, or parsing fails.
 */
export async function fetchCaseFromCourtApi(params: FetchParams): Promise<CaseData> {
  // In a real application, you would construct the URL based on the court's website structure.
  // For this demo, we'll use a placeholder URL and Firecrawl's AI extractor on a static page,
  // but the principle is the same for a live site.
  // const targetUrl = `https://delhihighcourt.nic.in/case-status?casetype=${params.caseType}&caseno=${params.caseNumber}&caseyear=${params.filingYear}`;
  
  // For demonstration, we use mock data when a specific case number is entered.
  // This allows us to reliably show success, error, and not-found states.
  if (params.caseNumber === '999') {
    throw new Error('Invalid Case Number. Please check the number and try again. No record found for this case on the court website.');
  }
  if (params.caseNumber === '000') {
      throw new Error('The court website appears to be down or is blocking requests. Please try again later.');
  }

  // --- Start of Firecrawl Integration ---
  // In a real implementation, you would uncomment the following lines.
  /*
  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

  try {
    const result = await app.scrape(targetUrl, {
      extractor: {
        mode: 'llm-extraction',
        extractionSchema: courtCaseSchema,
        prompt: "Extract the case details from the provided court case status page. Identify all parties, dates, and order details accurately."
      }
    });

    if (!result.data || !result.data.llm_extraction) {
        throw new Error('Failed to extract case data. The website structure may have changed.');
    }

    // The extracted data should conform to our CaseData interface.
    const caseData: CaseData = result.data.llm_extraction;
    return caseData;

  } catch (error) {
    console.error("Error scraping court API:", error);
    // This could be due to network issues, Firecrawl errors, or the website blocking the request.
    throw new Error('Failed to communicate with the court website. It may be temporarily unavailable.');
  }
  */
  // --- End of Firecrawl Integration ---


  // This is a simulation. In a real application, the Firecrawl logic above
  // would handle fetching and parsing. We return mock data here to ensure
  // the frontend can be demonstrated reliably.
  const currentYear = new Date().getFullYear();
  const caseStatus = parseInt(params.filingYear, 10) < currentYear ? 'Disposed' : 'Pending';

  const mockData: CaseData = {
      caseType: params.caseType,
      caseNumber: params.caseNumber,
      filingYear: params.filingYear,
      caseId: `${params.caseType.replace(/\./g, '')}/${params.caseNumber}/${params.filingYear}`,
      status: caseStatus,
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

/**
 * CAPTCHA and Anti-Scraping Strategy Documentation:
 *
 * 1.  **Headless Browsers & Proxies:**
 *     Firecrawl abstracts away the complexity of managing headless browsers (like Playwright)
 *     and uses a pool of residential proxies. This combination helps mimic a real user's
 *     browser environment and IP address, which is the first line of defense against
 *     basic anti-scraping measures.
 *
 * 2.  **Bypassing Basic CAPTCHAs:**
 *     For many websites, especially those using simpler image-based or checkbox-based
 *     CAPTCHAs (like Google's reCAPTCHA v2), Firecrawl's infrastructure can often
 *     resolve them automatically. It does this by leveraging sophisticated browser
 *     automation and request-mimicking techniques.
 *
 * 3.  **Advanced CAPTCHA (Production Strategy):**
 *     For highly secure sites using advanced or invisible CAPTCHAs (like reCAPTCHA v3 or hCaptcha),
 *     a more robust, multi-step approach is required:
 *     a. **Integration with a CAPTCHA Solving Service:** Use a third-party API service
 *        (e.g., 2Captcha, Anti-CAPTCHA).
 *     b. **Scraping Workflow:**
 *        - The scraper (using a library like Playwright within a serverless function) navigates to the page.
 *        - It identifies the CAPTCHA element and extracts its site key and other relevant data.
 *        - It sends this data to the CAPTCHA solving service.
 *        - The service returns a solved token.
 *        - The scraper submits the form along with this token, successfully bypassing the CAPTCHA.
 *
 * This project uses Firecrawl's simplified interface, which handles much of this automatically.
 * The commented-out code above shows how you would integrate it. For a production-grade
 * application facing aggressive anti-scraping, the advanced strategy would be necessary.
 */
