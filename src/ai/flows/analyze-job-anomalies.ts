'use server';
import 'server-only';
/**
 * @fileOverview Analyzes job data to detect anomalies in queueing and execution behavior.
 *
 * - analyzeJobAnomalies - A function that analyzes job data and flags anomalies.
 * - AnalyzeJobAnomaliesInput - The input type for the analyzeJobAnomalies function.
 * - AnalyzeJobAnomaliesOutput - The return type for the analyzeJobAnomalies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeJobAnomaliesInputSchema = z.object({
  jobData: z.string().describe('JSON string containing an array of job objects, each with properties like status, backend, submitted time, elapsed time, etc.'),
  isDemo: z.boolean().optional().describe('If true, returns simulated anomaly data without calling the LLM.'),
});
export type AnalyzeJobAnomaliesInput = z.infer<typeof AnalyzeJobAnomaliesInputSchema>;

const AnalyzeJobAnomaliesOutputSchema = z.object({
  anomalies: z.array(
    z.object({
      jobId: z.string().describe('The ID of the job with anomalous behavior.'),
      anomalyDescription: z.string().describe('A detailed, easy-to-understand explanation of the anomaly, suitable for both students and researchers. It should explain what the anomaly is, why it is a concern, and what it might indicate.'),
      severity: z.enum(['low', 'medium', 'high']).describe('The severity of the anomaly.'),
    })
  ).describe('An array of anomalies detected in the job data.'),
  summary: z.string().describe('A summary of the analysis, including the total number of anomalies found and a brief overview of the system\'s health.'),
  detailedReport: z.string().describe('A comprehensive technical report suitable for researchers. It should include methodology, data overview, detailed anomaly analysis, and recommendations.'),
});
export type AnalyzeJobAnomaliesOutput = z.infer<typeof AnalyzeJobAnomaliesOutputSchema>;

export async function analyzeJobAnomalies(input: AnalyzeJobAnomaliesInput): Promise<AnalyzeJobAnomaliesOutput> {
  return analyzeJobAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJobAnomaliesPrompt',
  input: { schema: AnalyzeJobAnomaliesInputSchema },
  output: { schema: AnalyzeJobAnomaliesOutputSchema },
  prompt: `You are an expert AI system administrator for a quantum computing platform. Your task is to analyze job data to detect and explain anomalies in a way that is clear for both students and expert researchers.

Analyze the provided job data for anomalies like:
- Unusually long queue times.
- Unexpected or frequent failures.
- Significant deviations from typical execution times.
- Inconsistencies in job status history (e.g., negative queue times).

Prioritize identifying anomalies that indicate system performance issues or potential hardware failures.

For each anomaly, provide a detailed but easy-to-understand 'anomalyDescription'. Explain what the anomaly is, why it's a concern, and what it could indicate about the system or the job itself.

The job data is provided as a JSON string: {{{jobData}}}

Present your findings as a JSON object with:
1. 'anomalies': array of specific findings.
2. 'summary': high-level overview.
3. 'detailedReport': A comprehensive, formal research report. It should be structured with sections like "Analysis Methodology", "System Health Overview", "Detailed Anomaly Breakdown", and "Recommendations". Use dense, professional language suitable for a technical report.

Example of a good anomaly description:
"This job spent an unusually long time in the queue (5 hours) compared to other jobs on the 'ibm_brisbane' backend. This could indicate high demand for this specific quantum computer, or it might signal a potential issue with the job scheduler that is preventing jobs from starting promptly."
`,
});

const analyzeJobAnomaliesFlow = ai.defineFlow(
  {
    name: 'analyzeJobAnomaliesFlow',
    inputSchema: AnalyzeJobAnomaliesInputSchema,
    outputSchema: AnalyzeJobAnomaliesOutputSchema,
  },
  async (input) => {
    // 🛑 Mock Mode or Fallback
    if (input.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return generateMockAnomalies();
    }

    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error analyzing job anomalies:', error);

      // Fallback if API key is missing
      if (error.message?.includes("API key") || error.status === 'FAILED_PRECONDITION') {
        console.warn("⚠️ Gemini API Key missing. Falling back to mock data.");
        return generateMockAnomalies();
      }

      throw error;
    }
  }
);

// Helper for mock data
function generateMockAnomalies(): AnalyzeJobAnomaliesOutput {
  return {
    anomalies: [
      {
        jobId: "c" + Math.random().toString(36).substr(2, 6),
        anomalyDescription: "Unusual queue duration: This job waited 45 minutes in the queue for 'ibm_brisbane', which is 3x higher than the current average.",
        severity: "medium"
      },
      {
        jobId: "c" + Math.random().toString(36).substr(2, 6),
        anomalyDescription: "Repeated Error: This is the 3rd job from user 'Bob' to fail with 'Qubit calibration failed' in the last hour.",
        severity: "high"
      }
    ],
    summary: "Simulated Analysis: The system observed elevated queue times on 'ibm_brisbane' and a pattern of calibration errors for recent submissions. Overall system health is stable but requires monitoring.",
    detailedReport: `**Quantum System Anomaly Analysis Report**
    
**1. Executive Summary**
This report details the findings of an automated anomaly detection scan performed on the recent job queue. The analysis methodology utilized statistical outlier detection on queue durations and error frequency analysis across available backend providers.

**2. System Health Overview**
The overall system stability is rated as MODERATE. While the majority of jobs (92%) completed within expected timeframes, specific localized issues were identified on the 'ibm_brisbane' QPU. Calibration stability appears nominal across other systems.

**3. Detailed Anomaly Breakdown**
- **Variance in Queue Wait Times**: A standard deviation of >15 minutes was observed for the 'ibm_brisbane' backend, significantly exceeding the baseline of 4 minutes. This suggests potential scheduler inefficiencies or a hung process on the job dispatcher.
- **Error Pattern Recognition**: A cluster of 'Qubit calibration failed' errors was detected associated with User 'Bob'. This correlates with a specific pulse control experiment, potentially indicating malformed pulse schedules rather than hardware failure.

**4. Recommendations**
- Investigate the job dispatcher logs for 'ibm_brisbane' between 14:00 and 15:00 UTC.
- Review recent pulse schedule submissions from User ID 'Bob' for compliance with device constraints.
- Continue monitoring 'ibm_brisbane' queue depth for persistence of lag.`
  };
}
