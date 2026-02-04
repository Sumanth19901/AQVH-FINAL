"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { jsPDF } from "jspdf";
import { AlertTriangle, CheckCircle, BrainCircuit, Printer } from "lucide-react"
import type { Job, Anomaly } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { analyzeJobAnomalies } from "@/ai/flows/analyze-job-anomalies"
import { useDashboard } from "@/contexts/dashboard-context"

interface AnomalyDialogProps {
  jobs: Job[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ANALYSIS_JOB_LIMIT = 100;

export function AnomalyDialog({ jobs, isOpen, onOpenChange }: AnomalyDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{ anomalies: Anomaly[], summary: string, detailedReport?: string } | null>(null)
  const { toast } = useToast()
  const { isDemo } = useDashboard()

  const handleAnalysis = async () => {
    setIsLoading(true)
    setAnalysisResult(null)
    try {
      // Limit the number of jobs sent to the AI to avoid exceeding token limits
      const recentJobs = jobs.slice(0, ANALYSIS_JOB_LIMIT);
      const jobData = JSON.stringify(recentJobs.map(({ id, status, backend, submitted, elapsed_time, status_history }) => ({ id, status, backend, submitted, elapsed_time, status_history })));

      const result = await analyzeJobAnomalies({ jobData, isDemo })
      setAnalysisResult(result)
    } catch (error) {
      console.error("Analysis failed:", error)
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze job data. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setAnalysisResult(null)
    }
    onOpenChange(open)
  }

  const getSeverityIcon = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const handlePrint = () => {
    if (!analysisResult) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(22);
    doc.text("Job Anomaly Analysis Report", 20, 20);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.line(20, 32, 190, 32); // Horizontal line

    let yPos = 45;

    // Use detailed report if available, otherwise summary
    const reportText = analysisResult.detailedReport || analysisResult.summary;

    doc.setFontSize(12);
    const splitReport = doc.splitTextToSize(reportText, 170);

    // Check pages for long report
    splitReport.forEach((line: string) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 7;
    });

    // Add specific anomaly list at the end if space permits or new page
    if (analysisResult.anomalies.length > 0) {
      yPos += 10;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Detected Anomalies List:", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;

      analysisResult.anomalies.forEach((anomaly: any) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(11);
        doc.setTextColor(anomaly.severity === 'high' ? 200 : 0, 0, 0); // Red for high
        doc.text(`[${anomaly.severity.toUpperCase()}] Job: ${anomaly.jobId}`, 20, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;

        const desc = doc.splitTextToSize(anomaly.anomalyDescription, 160);
        doc.text(desc, 25, yPos);
        yPos += (desc.length * 6) + 5;
      });
    }

    doc.save("quantum-anomaly-report.pdf");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Job Anomaly Detection</DialogTitle>
          <DialogDescription>
            Use AI to analyze the current set of jobs for unusual patterns or potential issues.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {!isLoading && analysisResult && (
            <div className="space-y-4">
              <Alert variant="default" className="bg-primary/10 border-primary/20">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertTitle>Analysis Summary</AlertTitle>
                <AlertDescription className="whitespace-pre-line">{analysisResult.summary}</AlertDescription>
              </Alert>
              {analysisResult.anomalies.length > 0 ? (
                analysisResult.anomalies.map((anomaly, index) => (
                  <Alert key={index} variant={anomaly.severity === 'high' ? 'destructive' : 'default'}>
                    {getSeverityIcon(anomaly.severity)}
                    <AlertTitle>Anomaly Detected (Severity: {anomaly.severity})</AlertTitle>
                    <AlertDescription>
                      <span className="font-semibold font-mono text-xs pr-2">{anomaly.jobId}</span>
                      {anomaly.anomalyDescription}
                    </AlertDescription>
                  </Alert>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <p className="mt-4">No anomalies detected in the current dataset.</p>
                </div>
              )}
            </div>
          )}

          {!isLoading && !analysisResult && (
            <div className="text-center text-muted-foreground py-8">
              <BrainCircuit className="mx-auto h-12 w-12" />
              <p className="mt-4">Ready to analyze the {Math.min(jobs.length, ANALYSIS_JOB_LIMIT)} most recent jobs.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          {analysisResult && (
            <Button variant="secondary" onClick={handlePrint} className="mr-auto">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          )}
          <Button variant="outline" onClick={() => handleClose(false)}>Close</Button>
          <Button onClick={handleAnalysis} disabled={isLoading}>
            {isLoading ? "Analyzing..." : analysisResult ? "Re-run Analysis" : "Run Analysis"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
