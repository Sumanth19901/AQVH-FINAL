
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Job, Backend, Metrics, ChartData, DailyJobSummary, ConnectivityData, PeriodicReportData, JobStatus } from "@/lib/types";
import { subMinutes, subHours, subDays, format, formatISO, parseISO, isSameDay, startOfDay, eachDayOfInterval, endOfWeek, startOfWeek, endOfMonth, startOfMonth, eachWeekOfInterval, addMinutes } from "date-fns";

const API_BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

// ✅ Simple in-memory cache for mock data (optional)
let mockCache: { data: any; timestamp: number } | null = null;

function calculateDailySummary(jobs: Job[]): DailyJobSummary {
  const today = new Date();
  const todaysCompletedJobs = jobs.filter(job => {
    if (job.status !== 'COMPLETED') return false;
    try {
      // Look for the completion timestamp in status history
      const finishedTimestamp = job.status_history?.find(s => s.status === 'COMPLETED')?.timestamp;
      if (!finishedTimestamp) return false;
      const finishedDate = parseISO(finishedTimestamp);
      return isSameDay(finishedDate, today);
    } catch {
      return false;
    }
  });

  const completedByBackend = todaysCompletedJobs.reduce((acc, job) => {
    acc[job.backend] = (acc[job.backend] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(completedByBackend).map(([name, value]) => ({
    name,
    value,
    fill: `hsl(var(--chart-${(Object.keys(completedByBackend).indexOf(name) % 5) + 1}))`,
  }));

  return {
    date: formatISO(startOfDay(today)),
    totalCompleted: todaysCompletedJobs.length,
    completedByBackend: chartData,
  };
}

function calculatePeriodicReports(jobs: Job[]): PeriodicReportData {
  const now = new Date();
  
  // Weekly data (last 4 weeks)
  const last4Weeks = eachWeekOfInterval({
    start: subDays(now, 28),
    end: now
  }, { weekStartsOn: 1 });

  const weeklyData = last4Weeks.map(weekStart => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekJobs = jobs.filter(j => {
      const submitted = parseISO(j.submitted);
      return submitted >= weekStart && submitted <= weekEnd;
    });
    return {
      date: format(weekStart, 'MMM d'),
      COMPLETED: weekJobs.filter(j => j.status === 'COMPLETED').length,
      RUNNING: weekJobs.filter(j => j.status === 'RUNNING').length,
      QUEUED: weekJobs.filter(j => j.status === 'QUEUED').length,
      ERROR: weekJobs.filter(j => j.status === 'ERROR').length,
    };
  });

  // Monthly data (last 6 months)
  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthJobs = jobs.filter(j => {
      const submitted = parseISO(j.submitted);
      return submitted >= monthStart && submitted <= monthEnd;
    });
    return {
      date: format(monthStart, 'MMM'),
      COMPLETED: monthJobs.filter(j => j.status === 'COMPLETED').length,
      RUNNING: monthJobs.filter(j => j.status === 'RUNNING').length,
      QUEUED: monthJobs.filter(j => j.status === 'QUEUED').length,
      ERROR: monthJobs.filter(j => j.status === 'ERROR').length,
    };
  });
  
  return { weekly: weeklyData, monthly: monthlyData };
}

function generateMockConnectivity(backendName: string): ConnectivityData {
  // Simple mock connectivity based on backend name hash
  const seed = backendName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const qubitCountMap: Record<string, number> = {
    "ibm_brisbane": 127,
    "ibm_kyoto": 127,
    "ibm_osaka": 127,
    "ibmq_kolkata": 27,
    "ibmq_mumbai": 27,
    "ibmq_auckland": 27,
  };
  const numQubits = qubitCountMap[backendName] || 27;
  
  const nodes = Array.from({ length: numQubits }, (_, id) => ({
    id,
    group: Math.random() > 0.8 ? 'ancillary' : 'core',
  }));

  const links: { source: number; target: number; value: number }[] = [];
  const linkSet = new Set<string>();

  for (let i = 0; i < numQubits * 1.5; i++) {
    const source = Math.floor(Math.random() * numQubits);
    const target = Math.floor(Math.random() * numQubits);
    if (source === target) continue;
    
    const linkKey = source < target ? `${source}-${target}` : `${target}-${source}`;
    if (!linkSet.has(linkKey)) {
      linkSet.add(linkKey);
      links.push({
        source,
        target,
        value: Math.random() * 0.2 + 0.8, // entanglement strength
      });
    }
  }

  return { nodes, links };
}

const calculateAvgWaitTime = (jobs: Job[], now: Date): number => {
    const relevantJobs = jobs.filter(j => j.status_history && j.status_history.some(s => s.status === 'QUEUED'));
    if (relevantJobs.length === 0) return 0;

    let totalWaitTime = 0;
    let countedJobs = 0;

    relevantJobs.forEach(job => {
        const queuedEntry = job.status_history.find(s => s.status === 'QUEUED');
        const runningEntry = job.status_history.find(s => s.status === 'RUNNING');

        if (queuedEntry) {
            const queuedTime = parseISO(queuedEntry.timestamp);
            let waitTime = 0;
            if (runningEntry) {
                const runningTime = parseISO(runningEntry.timestamp);
                waitTime = runningTime.getTime() - queuedTime.getTime();
                countedJobs++;
            } else if (job.status === 'QUEUED') {
                waitTime = now.getTime() - queuedTime.getTime();
                countedJobs++;
            }
            if(waitTime > 0) {
              totalWaitTime += waitTime;
            }
        }
    });
    
    if (countedJobs === 0) return 0;

    const avgInMs = totalWaitTime / countedJobs;
    return Math.max(0, avgInMs / 1000); // convert to seconds
};


// ✅ Generate mock data (cached for 1 minute to improve performance)
async function generateMockData(force = false) {
  const cacheKey = "mockData";
  if (mockCache && !force && (Date.now() - mockCache.timestamp < 60 * 1000)) {
    return { ...mockCache.data, source: "mock (cached)" };
  }

  const now = new Date();
  const mockBackends: Backend[] = [
    { name: "ibm_brisbane", status: "active", qubit_count: 127, queue_depth: Math.floor(Math.random() * 10), error_rate: 0.012 },
    { name: "ibm_kyoto", status: "active", qubit_count: 127, queue_depth: Math.floor(Math.random() * 10), error_rate: 0.015 },
    { name: "ibm_osaka", status: "active", qubit_count: 127, queue_depth: Math.floor(Math.random() * 10), error_rate: 0.011 },
    { name: "ibmq_kolkata", status: Math.random() > 0.8 ? "maintenance" : "active", qubit_count: 27, queue_depth: 0, error_rate: 0.025 },
    { name: "ibmq_mumbai", status: "active", qubit_count: 27, queue_depth: Math.floor(Math.random() * 5), error_rate: 0.021 },
    { name: "ibmq_auckland", status: Math.random() > 0.9 ? "inactive" : "active", qubit_count: 27, queue_depth: 0, error_rate: 0.033 },
  ];

  const jobStatuses: JobStatus[] = ["COMPLETED", "RUNNING", "QUEUED", "ERROR", "CANCELLED"];
  const users = ["Alice", "Bob", "Charlie", "David", "Eve"];

  
  // Generate jobs over a longer period for periodic reports
  const mockJobs: Job[] = Array.from({ length: 200 }, (_, i) => {
    let status = jobStatuses[Math.floor(Math.random() * jobStatuses.length)];
    const backend = mockBackends[Math.floor(Math.random() * mockBackends.length)];
    
    const isRecent = i < 100;
    const submittedTime = isRecent 
      ? subHours(now, Math.random() * 24)
      : subDays(now, Math.floor(Math.random() * 180));
    
    const queueDurationMinutes = Math.floor(Math.random() * 30); 
    const runDurationMinutes = Math.floor(Math.random() * 10) + 1;

    const startTime = addMinutes(submittedTime, queueDurationMinutes);
    let finishedTime = addMinutes(startTime, runDurationMinutes);

    // Ensure recent completed jobs are actually completed today for daily summary
    if (isRecent && status === 'COMPLETED' && Math.random() > 0.5) {
        finishedTime = subMinutes(now, Math.random() * 60 * 12);
        if (finishedTime < startTime) {
           finishedTime = addMinutes(startTime, runDurationMinutes);
        }
    }


    let finalStatus = status;
    const status_history: { status: JobStatus, timestamp: string }[] = [{ status: 'QUEUED', timestamp: formatISO(submittedTime) }];

    if (now > startTime) {
      status_history.push({ status: 'RUNNING', timestamp: formatISO(startTime) });
      finalStatus = 'RUNNING';
    } else {
      finalStatus = 'QUEUED';
    }

    if (["COMPLETED", "ERROR", "CANCELLED"].includes(status) && now > finishedTime) {
      status_history.push({ status, timestamp: formatISO(finishedTime) });
      finalStatus = status;
    } else if (now > startTime && now < finishedTime) {
       finalStatus = 'RUNNING';
    }

    if (finalStatus === 'RUNNING' && now > finishedTime) {
       finalStatus = 'COMPLETED'; // Assume it completed if time has passed
       status_history.push({ status: 'COMPLETED', timestamp: formatISO(finishedTime) });
    }

    const elapsed_time = (finalStatus === 'COMPLETED' || finalStatus === 'ERROR' || finalStatus === 'CANCELLED')
      ? (finishedTime.getTime() - startTime.getTime()) / 1000
      : (finalStatus === 'RUNNING' ? (now.getTime() - startTime.getTime()) / 1000 : 0);

    return {
      id: `c${Math.random().toString(36).substr(2, 9)}q${i}`,
      status: finalStatus,
      backend: backend.name,
      qubit_count: backend.qubit_count,
      submitted: formatISO(submittedTime),
      elapsed_time: Math.max(0, elapsed_time),
      user: users[i % users.length],
      qpu_seconds: finalStatus === 'COMPLETED' ? Math.random() * 10 : 0,
      logs: finalStatus === 'ERROR' ? `Error: Qubit calibration failed.` : `Job executed successfully.`,
      results: finalStatus === 'COMPLETED' ? { "0x0": 512, "0x3": 488 } : {},
      status_history,
      circuit_image_url: `https://picsum.photos/seed/${i}/800/200`,
    };
  });
  
  const allJobs = mockJobs.sort((a,b) => parseISO(b.submitted).getTime() - parseISO(a.submitted).getTime());
  
  const liveJobs = allJobs.filter(j => j.status === 'RUNNING' || j.status === 'QUEUED').length;
  const successfulJobs = allJobs.filter(j => j.status === 'COMPLETED').length;
  const totalCompletedOrError = successfulJobs + allJobs.filter(j => j.status === 'ERROR').length;
  const avgWaitTime = calculateAvgWaitTime(allJobs, now);


  const mockMetrics: Metrics = {
    total_jobs: allJobs.length,
    live_jobs: liveJobs,
    avg_wait_time: avgWaitTime,
    success_rate: totalCompletedOrError > 0 ? (successfulJobs / totalCompletedOrError) * 100 : 100,
    open_sessions: Math.floor(Math.random() * 5) + 1,
    api_speed: Math.floor(Math.random() * (250 - 50 + 1)) + 50, // Random speed between 50ms and 250ms
  };

  const mockChartData: ChartData[] = Array.from({ length: 12 }, (_, i) => {
    const time = subHours(now, 11 - i);
    const timePlusHour = subHours(now, 10 - i);
    const jobsInWindow = allJobs.filter(j => {
      const submittedDate = parseISO(j.submitted);
      return submittedDate >= time && submittedDate < timePlusHour;
    });

    return {
      time: formatISO(time).substring(11, 16),
      COMPLETED: jobsInWindow.filter(j => j.status === 'COMPLETED').length,
      RUNNING: jobsInWindow.filter(j => j.status === 'RUNNING').length,
      QUEUED: jobsInWindow.filter(j => j.status === 'QUEUED').length,
      ERROR: jobsInWindow.filter(j => j.status === 'ERROR').length,
    };
  });

  const dailySummary = calculateDailySummary(allJobs);
  const periodicReportData = calculatePeriodicReports(allJobs);

  const data = { jobs: allJobs, backends: mockBackends, metrics: mockMetrics, chartData: mockChartData, dailySummary, periodicReportData };
  mockCache = { data, timestamp: Date.now() };

  return { ...data, source: "mock" };
}

async function getRealData() {
  const startTime = Date.now();
  const [backendsResponse, jobsResponse, metricsResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/api/backends`),
    fetch(`${API_BASE_URL}/api/jobs?limit=5000`), // Fetch all jobs for reporting
    fetch(`${API_BASE_URL}/api/metrics`)
  ]);
  const endTime = Date.now();

  if (!backendsResponse.ok) {
    throw new Error(`Backend API Error: ${backendsResponse.status} ${backendsResponse.statusText}`);
  }
   if (!jobsResponse.ok) {
    throw new Error(`Jobs API Error: ${jobsResponse.status} ${jobsResponse.statusText}`);
  }
  if (!metricsResponse.ok) {
    throw new Error(`Metrics API Error: ${metricsResponse.status} ${metricsResponse.statusText}`);
  }


  const apiBackends = await backendsResponse.json();
  const apiJobs = await jobsResponse.json();
  const apiMetrics: Metrics = await metricsResponse.json();
  
  const backends: Backend[] = apiBackends.map((b: any) => ({
    name: b.name,
    status: b.status.toLowerCase() as "active" | "inactive" | "maintenance",
    qubit_count: b.qubit_count,
    queue_depth: b.queue_depth,
    error_rate: b.error_rate || 0.0,
  }));

  const jobs: Job[] = apiJobs.map((j: any) => ({
    id: j.id,
    status: j.status.toUpperCase() as JobStatus,
    backend: j.backend,
    qubit_count: j.qubit_count,
    submitted: j.submitted,
    elapsed_time: j.elapsed_time || 0,
    user: j.user,
    qpu_seconds: j.qpu_seconds || 0,
    logs: j.logs || "No logs available.",
    results: j.results || {},
    status_history: j.status_history || [],
    circuit_image_url: j.circuit_image_url || `https://picsum.photos/seed/${j.id}/800/200`, // placeholder
  }));
  
  const metrics: Metrics = {
    ...apiMetrics,
    api_speed: endTime - startTime,
  };
  
  const now = new Date();
  const chartData: ChartData[] = Array.from({ length: 12 }, (_, i) => {
    const time = subHours(now, 11 - i);
    const timePlusHour = subHours(now, 10 - i);
    const jobsInWindow = jobs.filter(j => {
       if (!j.submitted) return false;
      const submittedDate = parseISO(j.submitted);
      return submittedDate >= time && submittedDate < timePlusHour;
    });

    return {
      time: formatISO(time).substring(11, 16),
      COMPLETED: jobsInWindow.filter(j => j.status === 'COMPLETED').length,
      RUNNING: jobsInWindow.filter(j => j.status === 'RUNNING').length,
      QUEUED: jobsInWindow.filter(j => j.status === 'QUEUED').length,
      ERROR: jobsInWindow.filter(j => j.status === 'ERROR').length,
    };
  });

  const dailySummary = calculateDailySummary(jobs);
  const periodicReportData = calculatePeriodicReports(jobs);

  return { jobs, backends, metrics, chartData, dailySummary, periodicReportData, source: "real" };
}

export async function GET(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const isDemo = searchParams.get('demo') === 'true';
  const force = searchParams.get('force') === 'true';


  // Handle connectivity request for mock API
  const connectivityMatch = pathname.match(/\/api\/backends\/(.+)\/connectivity/);
  if (isDemo && connectivityMatch && connectivityMatch[1]) {
    const backendName = connectivityMatch[1];
    console.log(`⚡️ Fetching mock connectivity data for ${backendName}...`);
    const connectivityData = generateMockConnectivity(backendName);
    return NextResponse.json(connectivityData);
  }


  if (!isDemo) {
    try {
      console.log("✅ Fetching real data from Python backend...");
      const realData = await getRealData();
      return NextResponse.json(realData);
    } catch (error: any) {
      console.error("❌ Error fetching real data:", error);
      const mockData = await generateMockData();
      return NextResponse.json({ ...mockData, note: `Could not connect to the real backend: ${error.message}. Displaying mock data instead.` });
    }
  }

  console.warn("⚠ Using mock data (demo mode).");
  const mockData = await generateMockData(force);
  return NextResponse.json(mockData);
}
