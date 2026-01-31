'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { spawn } from 'child_process';

/* ---------- Schemas ---------- */
const DashboardAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about the Quantum Observer dashboard or quantum jobs."),
  history: z
    .array(
      z.object({
        user: z.string(),
        assistant: z.string(),
      })
    )
    .optional()
    .describe('Conversation history for context-aware responses.'),
});
export type DashboardAssistantInput = z.infer<typeof DashboardAssistantInputSchema>;

const DashboardAssistantOutputSchema = z.object({
  text: z.string().describe('Concise assistant response (2–3 sentences).'),
  action: z
    .enum([
      'FILTER_LIVE_JOBS',
      'FILTER_SUCCESS_RATE',
      'SHOW_BACKEND_HEALTH',
      'SHOW_DAILY_SUMMARY',
      'SHOW_JOB_DETAILS',
      'SHOW_ALL_JOBS',
      'SHOW_SESSIONS',
      'GENERATE_JOB_CODE',
      'NONE',
    ])
    .default('NONE'),
  code: z.string().optional().describe('Generated quantum job code (Python/Qiskit or OpenQASM).'),
  jobResult: z.string().optional().describe('Result of executing the quantum job.'),
});
export type DashboardAssistantOutput = z.infer<typeof DashboardAssistantOutputSchema>;

/* ---------- Prompt ---------- */
const dashboardAssistantPrompt = ai.definePrompt({
  name: 'dashboardAssistantPrompt',
  input: { schema: DashboardAssistantInputSchema },
  output: { schema: DashboardAssistantOutputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `
You are the **Quantum Observer AI Assistant**, an expert guide for the Quantum Observer dashboard.

### Rules:
1. Answer all dashboard-related queries concisely (2–3 sentences).
2. If the user asks to generate a quantum job or code, **always return a ready-to-run Qiskit Python snippet** or OpenQASM in the "code" field.
   - Set action = "GENERATE_JOB_CODE"
   - Include a brief explanation in "text".
3. Never ask the user to provide more details. Assume simple common circuits if details are missing (e.g., Bell state, GHZ state).
4. For other queries, follow existing action mapping.

### Dashboard Features & Actions:
- KPI Cards → FILTER_LIVE_JOBS / FILTER_SUCCESS_RATE
- Live Jobs → SHOW_JOB_DETAILS
- All Jobs → SHOW_ALL_JOBS
- Backend Health → SHOW_BACKEND_HEALTH
- Daily Summary → SHOW_DAILY_SUMMARY
- Active Sessions → SHOW_SESSIONS
- Job Status / Anomaly → NONE

{{#if history}}
Conversation history:
{{#each history}}
- User: {{{user}}}
- Assistant: {{{assistant}}}
{{/each}}
{{/if}}

User question: {{{query}}}
`,
});

/* ---------- Flow ---------- */
const dashboardAssistantFlow = ai.defineFlow(
  {
    name: 'dashboardAssistantFlow',
    inputSchema: DashboardAssistantInputSchema,
    outputSchema: DashboardAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await dashboardAssistantPrompt(input);

    // ✅ If generated code, run it on Qiskit Aer simulator
    if (output?.action === 'GENERATE_JOB_CODE' && output.code) {
      try {
        const jobResult = await new Promise<string>((resolve, reject) => {
          const process = spawn('python', ['-c', output.code]);

          let result = '';
          let error = '';

          process.stdout.on('data', (data) => (result += data.toString()));
          process.stderr.on('data', (data) => (error += data.toString()));

          process.on('close', (code) => {
            if (code === 0) resolve(result.trim());
            else reject(new Error(error || 'Quantum job execution failed.'));
          });
        });

        return { ...output, jobResult };
      } catch (err) {
        console.error('Job execution error:', err);
        return { ...output, jobResult: '❌ Error running quantum job.' };
      }
    }

    return output!;
  }
);

/* ---------- Public API ---------- */
export async function askDashboardAssistant(
  input: DashboardAssistantInput
): Promise<DashboardAssistantOutput> {
  try {
    return await dashboardAssistantFlow(input);
  } catch (err) {
    console.error('AI assistant error:', err);
    return {
      text: "Sorry, I couldn't process that request at the moment.",
      action: 'NONE',
    };
  }
}
