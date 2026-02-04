import { useState, useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { DailyJobSummary, Job } from "@/lib/types"
import { format, isSameDay, parseISO, startOfDay, formatISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

interface DailySummaryChartProps {
  data: DailyJobSummary;
  jobs?: Job[];
}

export function DailySummaryChart({ data: initialData, jobs }: DailySummaryChartProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const displayData = useMemo(() => {
    if (isSameDay(date, new Date(initialData.date))) {
      return initialData;
    }

    if (!jobs) return { date: formatISO(date), totalCompleted: 0, completedByBackend: [] };

    // Calculate summary for selected date
    const selectedDateStart = startOfDay(date);

    const relevantJobs = jobs.filter(job => {
      if (job.status !== 'COMPLETED') return false;
      const completedEntry = job.status_history.find(s => s.status === 'COMPLETED');
      // If no completed entry (shouldn't happen for completed jobs), use submitted as fallback for dev
      const timestamp = completedEntry ? completedEntry.timestamp : job.submitted;
      if (!timestamp) return false;

      return isSameDay(parseISO(timestamp), date);
    });

    const completedByBackend = relevantJobs.reduce((acc, job) => {
      acc[job.backend] = (acc[job.backend] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(completedByBackend).map(([name, value], index) => ({
      name,
      value,
      fill: `hsl(var(--chart-${(index % 5) + 1}))`,
    }));

    return {
      date: formatISO(selectedDateStart),
      totalCompleted: relevantJobs.length,
      completedByBackend: chartData,
    };
  }, [date, initialData, jobs]);

  const chartData = displayData.completedByBackend;
  const chartConfig = Object.fromEntries(
    chartData.map(item => [item.name, { label: item.name, color: item.fill }])
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Daily Summary</CardTitle>
          <CardDescription>
            {displayData.totalCompleted} jobs completed on {format(new Date(displayData.date), "PPP")}
          </CardDescription>
        </div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">Open calendar</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  setDate(newDate);
                  setIsCalendarOpen(false);
                }
              }}
              disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="pt-4">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-full"
          >
            <BarChart data={chartData} margin={{ left: -20, right: 20, bottom: 40 }}>
              <XAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Bar dataKey="value" radius={5}>
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
            No data available for this date.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
