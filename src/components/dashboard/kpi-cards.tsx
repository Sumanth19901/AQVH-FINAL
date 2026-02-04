
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Clock, CheckCircle, Users, Layers, Cpu } from "lucide-react";
import type { Metrics } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KpiCardsProps extends Metrics {
  onCardClick: (kpiKey: string) => void;
  activeView: string;
}

const kpiConfig = [
  {
    title: "Total Jobs",
    key: "total_jobs" as const,
    icon: Layers,
    description: "Total jobs processed in the period",
    tooltip: "The cumulative count of all quantum jobs submitted, including completed, failed, and cancelled jobs.",
    format: (value: number) => value.toString(),
    clickable: false,
  },
  {
    title: "Live Jobs",
    key: "live_jobs" as const,
    icon: Activity,
    description: "Jobs currently running or queued",
    tooltip: "Real-time count of jobs currently in the queue or being executed on quantum backend systems.",
    format: (value: number) => value.toString(),
    clickable: true,
  },
  {
    title: "Avg Wait Time",
    key: "avg_wait_time" as const,
    icon: Clock,
    description: "Average time jobs spend in queue",
    tooltip: "The average duration a job remains in the queue before execution starts, calculated over the last 24 hours.",
    format: (value: number) => value > 0 ? `${Math.round(value / 60)}m ${Math.round(value % 60)}s` : 'N/A',
    clickable: false,
  },
  {
    title: "Success Rate",
    key: "success_rate" as const,
    icon: CheckCircle,
    description: "Percentage of jobs completed successfully",
    tooltip: "The percentage of jobs that have completed successfully without errors out of the total jobs submitted.",
    format: (value: number) => `${value.toFixed(1)}%`,
    clickable: true,
  },
  {
    title: "Qubits Used",
    key: "qubits_used" as const,
    icon: Cpu,
    description: "Active Qubit Capacity",
    tooltip: "Total number of qubits available across all currently active (running/queued) jobs.",
    format: (value: number) => value.toString(),
    clickable: false,
  },
];

export function KpiCards({ onCardClick, activeView, ...metrics }: KpiCardsProps) {
  const router = useRouter();

  const handleCardClick = (kpiKey: string) => {
    if (kpiKey === 'open_sessions') {
      router.push('/dashboard/sessions');
    } else {
      onCardClick(kpiKey);
    }
  };

  const kpiItems = kpiConfig.filter(kpi => metrics[kpi.key] !== undefined && metrics[kpi.key] !== null);


  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6`}>
      {kpiItems.map((kpi) => {
        const Icon = kpi.icon;
        const value = metrics[kpi.key];
        const isActive = activeView === kpi.key;

        const cardInnerContent = (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.format(value)}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </>
        );

        return (
          <TooltipProvider key={kpi.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  className={cn(
                    "transition-colors",
                    kpi.clickable && "cursor-pointer hover:bg-muted",
                    isActive && "bg-primary/10 border-primary"
                  )}
                  onClick={kpi.clickable ? () => handleCardClick(kpi.key) : undefined}
                >
                  {cardInnerContent}
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">{kpi.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
