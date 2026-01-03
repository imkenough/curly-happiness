"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";

type MotorState = "Running" | "Stopped" | "Error";
type RunSession = { start: Date; end: Date; frequency: string };

export default function Page() {
  const [motorState, setMotorState] = useState<MotorState>("Stopped");
  const [frequency, setFrequency] = useState("30.55");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [uptimeMinutes, setUptimeMinutes] = useState(0);
  const [runSessions, setRunSessions] = useState<RunSession[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  // const [timeRange, setTimeRange] = useState("24h"); // Commented out

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (motorState === "Running") {
      intervalId = setInterval(() => {
        if (startTime) {
          const diff = new Date().getTime() - startTime.getTime();
          setUptimeMinutes(Math.floor(diff / (1000 * 60)));
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [motorState, startTime]);

  useEffect(() => {
    const chartPoints = runSessions.map(session => ({
      time: session.start.getTime(),
      frequency: parseFloat(session.frequency),
    }));
    setChartData(chartPoints);
  }, [runSessions]);

  const handleStart = () => {
    setMotorState("Running");
    setStartTime(new Date());
  };

  const handleStop = () => {
    setMotorState("Stopped");
    if (startTime) {
      setRunSessions(prev => [...prev, { start: startTime, end: new Date(), frequency }]);
    }
    setStartTime(null);
    setUptimeMinutes(0);
  };

  const handleIncrement = () => {
    setFrequency((prev) => {
      let currentFreq = parseFloat(prev);
      if (isNaN(currentFreq)) currentFreq = 0;
      let newFreq = currentFreq + 0.01;
      if (newFreq > 60) newFreq = 60;
      return newFreq.toFixed(2);
    });
  };

  const handleDecrement = () => {
    setFrequency((prev) => {
      let currentFreq = parseFloat(prev);
      if (isNaN(currentFreq)) currentFreq = 0;
      let newFreq = currentFreq - 0.01;
      if (newFreq < 0) newFreq = 0;
      return newFreq.toFixed(2);
    });
  };

  const handleIncrementMouseDown = () => {
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(handleIncrement, 75);
    }, 300);
  };

  const handleDecrementMouseDown = () => {
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(handleDecrement, 75);
    }, 300);
  };

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2 @container/main">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
                motorState={motorState}
                frequency={frequency}
                setFrequency={setFrequency}
                startTime={startTime}
                uptimeMinutes={uptimeMinutes}
                onStart={handleStart}
                onStop={handleStop}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onIncrementMouseDown={handleIncrementMouseDown}
                onDecrementMouseDown={handleDecrementMouseDown}
                onMouseUp={handleMouseUp}
              />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive
                  data={chartData}
                  // timeRange={timeRange} // Commented out
                  // setTimeRange={setTimeRange} // Commented out
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
