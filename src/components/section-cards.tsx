"use client";
import {
  IconMinus,
  IconPlus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

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
    let currentFreq = parseFloat(frequency);
    if (isNaN(currentFreq)) currentFreq = 0;

    let newFreq = currentFreq + 0.01;
    if (newFreq > 60) newFreq = 60;
    setFrequency(newFreq.toFixed(2));
  };

  const handleDecrement = () => {
    let currentFreq = parseFloat(frequency);
    if (isNaN(currentFreq)) currentFreq = 0;

    let newFreq = currentFreq - 0.01;
    if (newFreq < 0) newFreq = 0;
    setFrequency(newFreq.toFixed(2));
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
          <CardDescription>Motor State</CardDescription>
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
          <CardDescription>Motor Control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button onClick={handleStart} disabled={motorState === "Running"}>
                Start
              </Button>
              <Button
                onClick={handleStop}
                disabled={motorState !== "Running"}
                variant="secondary"
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
                    // Allow empty string or string ending with a dot for partial input (e.g., "12." or "12.3")
                    if (value === "" || value.match(/^\d+(\.\d{0,2})?$/)) {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                            if (numValue >= 0 && numValue <= 60) {
                                setFrequency(value);
                            } else if (numValue < 0) {
                                setFrequency("0.00"); // Clamp to 0
                            } else if (numValue > 60) {
                                setFrequency("60.00"); // Clamp to 60
                            }
                        } else {
                            // If it's an empty string or just a dot, it's fine for partial input
                            setFrequency(value);
                        }
                    }
                  }}
                  className="text-center flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleIncrement}
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
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
