
'use client';

import { useState, useEffect, useMemo } from "react";
import type { Job, JobStatus, ChartView } from "@/lib/types";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { JobsTable } from "@/components/dashboard/jobs-table";
import { BackendCharts } from "@/components/dashboard/backend-charts";
import { DailySummaryChart } from "@/components/dashboard/daily-summary-chart";
import { JobDetailsDrawer } from "@/components/dashboard/job-details-drawer";
import { AnomalyDialog } from "@/components/dashboard/anomaly-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AssistantChat } from "@/components/dashboard/assistant-chat";
import { ApiSpeedGauge } from "@/components/dashboard/api-speed-gauge";
import { StatusChart } from "@/components/dashboard/status-chart";
import { PeriodicReportChart } from "@/components/dashboard/periodic-report-chart";
import { useDashboard } from "@/contexts/dashboard-context";

const JOBS_PER_PAGE = 10;

export default function DashboardPage() {
  const {
    isFetching,
    lastUpdated,
    jobs,
    backends,
    metrics,
    chartData,
    dailySummary,
    periodicReportData,
    isAnomalyDialogOpen,
    setIsAnomalyDialogOpen,
  } = useDashboard();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [backendFilter, setBackendFilter] = useState<string>("all");
  const [activeView, setActiveView] = useState<ChartView>('all');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, backendFilter]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    let filtered = jobs;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    if (backendFilter !== 'all') {
      filtered = filtered.filter(job => job.backend === backendFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [jobs, searchQuery, statusFilter, backendFilter]);


  const totalPages = Math.ceil((filteredJobs.length || 0) / JOBS_PER_PAGE);

  const handleKpiCardClick = (kpiKey: string) => {
    if (kpiKey === 'live_jobs' || kpiKey === 'success_rate') {
      setActiveView(prev => (prev === kpiKey ? 'all' : kpiKey as ChartView));
    } else if (kpiKey === 'total_jobs') {
      setActiveView('all');
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const paginatedJobs = useMemo(() => {
    return filteredJobs.slice(
      (currentPage - 1) * JOBS_PER_PAGE,
      currentPage * JOBS_PER_PAGE
    );
  }, [filteredJobs, currentPage]);

  const isLoading = isFetching && !lastUpdated;

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[126px] rounded-lg" />)}
            </div>
        ) : (
            metrics && <KpiCards
                {...metrics}
                onCardClick={handleKpiCardClick}
                activeView={activeView}
            />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="md:col-span-2">
                {isLoading ? <Skeleton className="h-[600px] rounded-lg" /> : (
                    <JobsTable
                        jobs={paginatedJobs}
                        onJobSelect={handleJobSelect}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={handleNextPage}
                        onPrevPage={handlePrevPage}
                        searchQuery={searchQuery}
                        onSearchQueryChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        backendFilter={backendFilter}
                        onBackendFilterChange={setBackendFilter}
                        allBackends={backends?.map(b => b.name) || []}
                        isFetching={isFetching && !!lastUpdated}
                    />
                )}
            </div>
             <div className="space-y-4 sm:space-y-6 md:col-span-1">
                {isLoading ? <Skeleton className="h-[450px] rounded-lg" /> : (dailySummary && <DailySummaryChart data={dailySummary} />)}
                {isLoading ? <Skeleton className="h-[300px] rounded-lg" /> : (backends && <BackendCharts backends={backends} />)}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="lg:col-span-3">
                {isLoading ? <Skeleton className="h-[430px] rounded-lg" /> : (chartData && <StatusChart data={chartData} view={activeView} />)}
            </div>
             <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                 {isLoading ? <Skeleton className="h-[276px] rounded-lg] mb-6" /> : (metrics && <ApiSpeedGauge speed={metrics.api_speed!} />)}
            </div>
        </div>
        
        <div >
            {isLoading ? <Skeleton className="h-[450px] rounded-lg" /> : (periodicReportData && <PeriodicReportChart data={periodicReportData} />)}
        </div>
      </div>

      <JobDetailsDrawer
        job={selectedJob}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
       <AnomalyDialog
        jobs={jobs || []}
        isOpen={isAnomalyDialogOpen}
        onOpenChange={setIsAnomalyDialogOpen}
      />
      <AssistantChat />
    </>
  );
}
