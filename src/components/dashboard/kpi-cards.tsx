
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

import { useTranslation } from "react-i18next";

// ... (keep interface)

export function KpiCards({ onCardClick, activeView, ...metrics }: KpiCardsProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const kpiConfig = [
    {
      title: t('kpi.totalJobs'),
      key: "total_jobs" as const,
      icon: Layers,
      description: t('kpi.totalJobsDesc'),
      tooltip: t('kpi.totalJobsDesc'), // Or add specific tooltip key, but desc works
      format: (value: number) => value.toString(),
      clickable: false,
    },
    {
      title: t('kpi.liveJobs'),
      key: "live_jobs" as const,
      icon: Activity,
      description: t('kpi.liveJobsDesc'),
      tooltip: t('kpi.liveJobsDesc'),
      format: (value: number) => value.toString(),
      clickable: true,
    },
    {
      title: t('kpi.avgWaitTime'),
      key: "avg_wait_time" as const,
      icon: Clock,
      description: t('kpi.avgWaitTimeDesc'),
      tooltip: t('kpi.avgWaitTimeDesc'),
      format: (value: number) => value > 0 ? `${Math.round(value / 60)}m ${Math.round(value % 60)}s` : 'N/A',
      clickable: false,
    },
    {
      title: t('kpi.successRate'),
      key: "success_rate" as const,
      icon: CheckCircle,
      description: t('kpi.successRateDesc'),
      tooltip: t('kpi.successRateDesc'),
      format: (value: number) => `${value.toFixed(1)}%`,
      clickable: true,
    },
    {
      title: t('kpi.qubitsUsed'),
      key: "qubits_used" as const,
      icon: Cpu,
      description: t('kpi.qubitsUsedDesc'),
      tooltip: t('kpi.qubitsUsedDesc'),
      format: (value: number) => value.toString(),
      clickable: false,
    },
  ];

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
          <TooltipProvider key={kpi.key}>
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
