# Quantum Sentinel

Quantum Sentinel is a real-time monitoring dashboard for quantum computing jobs and
backend systems, built with Next.js, ShadCN UI, and Genkit. It provides a comprehensive view
of job statuses, backend health, and performance metrics, along with AI-powered anomaly
detection.

## Features

- **Real-time Job Tracking:** Live monitoring of IBM Quantum jobs (Queued, Running, Completed, Error) with sub-second latency.
- **Unified Dashboard:** Centralized view of all your quantum operations, sessions, and backend health status.
- **AI Assistant:** Integrated Genkit-powered chat assistant to generate Qiskit code, explain errors, and optimize circuits.
- **Anomaly Detection:** automated alerts for unexpected job failures, high queue times, or backend calibration issues.
- **Authentication System:** Secure Login and Signup flows with simulated social providers (GitHub, Google) and password recovery.
- **SaaS Pricing Model:** Interactive pricing page demonstrating tiered plans (Observer, Researcher, Lab) with monthly/annual toggles.
- **Detailed Analytics:** Visualizations for QPU usage, job history, and error rates using Recharts.
- **Dark Mode Support:** Fully responsive interface with seamless light/dark theme switching.

## Tech Stack

- **Frontend Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Backend API:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Engine:** [Google Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Quantum Provider:** [IBM Quantum](https://quantum.ibm.com/) (Qiskit)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) & [Radix Primitives](https://www.radix-ui.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Visualization:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

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

The application will be available at `http://localhost:9002`.

**Note:** By default, the app may use mock data. You can toggle "Live Mode" in the **Settings Dialog** (gear icon in sidebar) to connect to the real Python backend if configured.

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