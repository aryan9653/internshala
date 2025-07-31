
# CourtLook

CourtLook is a Next.js web application designed to demonstrate fetching and displaying case metadata and orders from Indian court websites. It provides a simple UI for users to input case details and view the corresponding information.

This project was built to fulfill the requirements of the "Court-Data Fetcher & Mini-Dashboard" task.

## Features

- **Simple Case Search:** An intuitive form to search for cases by Case Type, Case Number, and Filing Year.
- **Detailed Case Display:** View parsed information like parties' names, filing dates, and next hearing dates.
- **Order Retrieval:** Access and download links for the most recent orders and judgments associated with a case.
- **User-Friendly Feedback:** Clear loading states and error messages for a smooth user experience.
- **Modern, Responsive UI:** A clean, professionally designed interface built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)

## Court Chosen & Backend Simulation

For this demonstration, the backend that scrapes a live court website (e.g., Delhi High Court) is **simulated**. This approach was chosen to:

1.  Ensure a stable and reliable demo, independent of the court website's uptime or layout changes.
2.  Focus on building a robust frontend and demonstrating a clean application architecture with Next.js Server Actions.
3.  Avoid the complexities and potential brittleness of web scraping within the given timeframe.

The simulation is handled by a Server Action located in `src/app/actions.ts`. It returns mock data based on the entered Case Number, allowing the demonstration of success, error, and not-found scenarios.

## CAPTCHA & Scraping Strategy

A real-world implementation of this application would need to robustly handle challenges like CAPTCHA and dynamic web content. A production-grade strategy would involve:

1.  **Headless Browsers:** Using automation tools like **Playwright** or **Selenium** to programmatically navigate the court's website, fill in forms, and click buttons as a user would. This is effective for websites heavily reliant on JavaScript.
2.  **CAPTCHA Solving Services:** For sites protected by CAPTCHA, one could integrate a third-party API (e.g., 2Captcha, Anti-CAPTCHA). The scraper would send the CAPTCHA image or token to the service, which returns the solved text to be submitted with the form.
3.  **Resilience and Maintenance:** Court websites change their layout. The scraper would need to be built with resilient selectors and have a monitoring system in place to detect when it breaks, along with a plan for regular maintenance.

This project's simulated backend (`src/app/actions.ts`) intentionally bypasses these complexities to focus on the application's UI/UX and data flow.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, pnpm, or yarn

### Installation & Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

### Sample Environment Variables

This project does not require any environment variables as the backend is simulated. A real-world version would require variables for:

```
# .env.local
CAPTCHA_SOLVER_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@host:port/database
```
