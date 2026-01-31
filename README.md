# Quantum Sentinel

Quantum Sentinel is a real-time monitoring dashboard for quantum computing jobs and
backend systems, built with Next.js, ShadCN UI, and Genkit. It provides a comprehensive view
of job statuses, backend health, and performance metrics, along with AI-powered anomaly
detection.

## Features

- **Real-time Job Tracking:** Monitor the status of all quantum jobs (Queued, Running,
  Completed, Error, Cancelled).
- **Backend Health Dashboard:** View the status, queue depth, and error rates of all available
  quantum backends.
- **Performance KPIs:** Key metrics at a glance, including live job counts, average wait times,
  and success rates.
- **Historical Analysis:** Visualize job status trends over time with an interactive chart.
- **AI-Powered Anomaly Detection:** Use Genkit to analyze job data and flag unusual behavior
  or potential system issues.
- **Responsive Design:** A clean and intuitive interface that works seamlessly across desktop
  and mobile devices.
- **Light & Dark Mode:** Switch between themes for your viewing comfort.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **AI Integration:** [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **UI:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Running Locally

To run the Quantum Sentinel application on your local machine, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (or another package manager like yarn or pnpm)
- [Python](https://www.python.org/downloads/) (v3.8 or later) and [pip](https://pip.pypa.io/en/stable/installation/)

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone <repository-url>
cd quantum-sentinel
```

### 2. Install Dependencies

The project consists of a Next.js front-end and a Python back-end.

**Front-End (Node.js):**

Install the necessary project dependencies using npm:

```bash
npm install
```

**Back-End (Python):**

Install the required Python packages using pip:

```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

For the AI features to work, you will need a Google AI API key.

1.  Create a copy of the `.env` file and name it `.env.local`:

    ```bash
    cp .env .env.local
    ```

2.  Open the `.env.local` file and add your Gemini API key:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

The Python backend also requires IBM Quantum credentials, but these are currently hardcoded in `backend.py` for demo purposes.

### 4. Run the Application

You will need to run the front-end and back-end servers in two separate terminals.

**Terminal 1: Start the Back-End Server**

Run the following command to start the Python FastAPI server:

```bash
uvicorn backend:app --reload
```

The backend will be available at `http://localhost:8000`.

**Terminal 2: Start the Front-End Server**

Run the following command to start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`. Once the app is open, go to **Settings** in the header and **disable "Demo Mode"** to connect to your live backend.

### 5. Run the Genkit Inspector (Optional)

To inspect and debug your Genkit flows, you can run the Genkit Inspector in a separate terminal:

```bash
npm run genkit:dev
```

This will start the inspector, which is typically available at `http://localhost:4000`.

## Project Structure

The project follows a standard Next.js App Router structure, with clear separation of concerns to
enhance maintainability and scalability.

```
quantum-sentinel/
├── public/ # Static assets (images, icons, etc.)
├── src/
│ ├── app/ # Next.js App Router (pages & layouts)
│ ├── components/ # Reusable React components
│ │ ├── dashboard/ # Dashboard-specific components
│ │ ├── ui/ # ShadCN UI components
│ │ └── providers/ # React Context Providers
│ ├── ai/ # Genkit AI logic
│ │ ├── flows/ # AI pipelines (anomaly detection, etc.)
│ │ └── genkit.ts # Genkit initialization
│ ├── data/ # Mock/demo data
│ ├── hooks/ # Custom React hooks
│ └── lib/ # Utility functions & types
├── backend.py # Python FastAPI backend server
├── .env # Environment variable template
├── next.config.ts # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json # TypeScript configuration
└── package.json
```