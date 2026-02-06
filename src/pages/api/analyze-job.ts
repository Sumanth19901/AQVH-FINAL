import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { analyzeJob } = await import("@/ai/flows/analyze-job-anomalies");

  const result = await analyzeJob(req.body);
  res.status(200).json(result);
}