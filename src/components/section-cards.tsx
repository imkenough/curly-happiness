"use client";
import {
  IconMinus,
  IconPlus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";

type MotorState = "Running" | "Stopped" | "Error";

export function SectionCards() {
  const [motorState, setMotorState] = useState<MotorState>("Stopped");
  const [frequency, setFrequency] = useState("30.55");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [uptimeMinutes, setUptimeMinutes] = useState(0);

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

  const handleStart = () => {
    setMotorState("Running");
    setStartTime(new Date());
  };

  const handleStop = () => {
    setMotorState("Stopped");
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

  const getStatusVariant = (state: MotorState) => {
    switch (state) {
      case "Running":
        return "success";
      case "Stopped":
        return "default";
      case "Error":
        return "error";
      default:
        return "default";
    }
  };
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Motor State</CardTitle>
          <Status variant={getStatusVariant(motorState)}>
            {motorState === "Running" && <StatusIndicator />}
            <StatusLabel>{motorState}</StatusLabel>
          </Status>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {motorState === "Running" ? `${frequency} Hz` : "0.00 Hz"}
          </div>
          <p className="text-xs text-muted-foreground">
            {motorState === "Running" && startTime
              ? `Running since ${startTime.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "numeric",
                })} (${uptimeMinutes} minutes)`
              : "Motor is stopped"}
          </p>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Motor Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleStart}
                disabled={motorState === "Running"}
              >
                Start
              </Button>
              <Button
                size="sm"
                onClick={handleStop}
                disabled={motorState !== "Running"}
                variant="destructive"
              >
                Stop
              </Button>
            </div>
            <div>
              <Label
                htmlFor="frequency"
                className="text-xs text-muted-foreground"
              >
                Frequency (Hz)
              </Label>
              <div className="flex items-center gap-1 w-full">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleDecrement}
                  onMouseDown={handleDecrementMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleDecrementMouseDown}
                  onTouchEnd={handleMouseUp}
                  disabled={parseFloat(frequency) <= 0}
                >
                  <IconMinus />
                </Button>
                <Input
                  id="frequency"
                  type="number"
                  placeholder="XX.XX"
                  min="0"
                  max="60"
                  step="0.01"
                  value={frequency}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value.match(/^\d+(\.\d{0,2})?$/)) {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue)) {
                        if (numValue >= 0 && numValue <= 60) {
                          setFrequency(value);
                        } else if (numValue < 0) {
                          setFrequency("0.00");
                        } else if (numValue > 60) {
                          setFrequency("60.00");
                        }
                      } else {
                        setFrequency(value);
                      }
                    }
                  }}
                  className="text-center flex-grow h-8"
                />
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleIncrement}
                  onMouseDown={handleIncrementMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleIncrementMouseDown}
                  onTouchEnd={handleMouseUp}
                  disabled={parseFloat(frequency) >= 60}
                >
                  <IconPlus />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Active Accounts
          </CardTitle>
          <CardDescription>45,678</CardDescription>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Growth Rate
          </CardTitle>
          <CardDescription>4.5%</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
