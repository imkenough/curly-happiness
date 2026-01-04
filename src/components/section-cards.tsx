"use client";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import CountUp from "@/components/CountUp"; // Added import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";

type MotorState = "Running" | "Stopped" | "Error";

interface SectionCardsProps {
  motorState: MotorState;
  frequency: string;
  displayFrequency: string;
  rpm: string;
  outputVoltage: string;
  outputCurrent: string;
  dcBusVoltage: string;
  setFrequency: (value: string) => void;
  startTime: Date | null;
  uptimeMinutes: number;
  onStart: () => void;
  onStop: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onIncrementMouseDown: () => void;
  onDecrementMouseDown: () => void;
  onMouseUp: () => void;
}

export function SectionCards({
  motorState,
  frequency,
  displayFrequency,
  rpm,
  outputVoltage,
  outputCurrent,
  dcBusVoltage,
  setFrequency,
  startTime,
  uptimeMinutes,
  onStart,
  onStop,
  onIncrement,
  onDecrement,
  onIncrementMouseDown,
  onDecrementMouseDown,
  onMouseUp,
}: SectionCardsProps) {
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
            {motorState === "Running" ? `${displayFrequency} Hz` : "0.00 Hz"}
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
                onClick={onStart}
                disabled={motorState === "Running"}
              >
                Start
              </Button>
              <Button
                size="sm"
                onClick={onStop}
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
                  onClick={onDecrement}
                  onMouseDown={onDecrementMouseDown}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={onDecrementMouseDown}
                  onTouchEnd={onMouseUp}
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
                  onClick={onIncrement}
                  onMouseDown={onIncrementMouseDown}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={onIncrementMouseDown}
                  onTouchEnd={onMouseUp}
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
          <CardTitle>Motor RPM</CardTitle>
          <CardDescription>Revolutions Per Minute</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp
              from={0}
              to={parseFloat(rpm) || 0}
              duration={1}
              className="inline"
            />
            {" "}
            <span className="text-sm font-normal text-muted-foreground">
              RPM
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Electrical and Control</CardTitle>
          <CardDescription>
            Monitoring key electrical parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Output Voltage
              </div>
              <div className="text-2xl font-bold">
                <CountUp
                  from={0}
                  to={parseFloat(outputVoltage) || 0}
                  duration={1}
                  className="inline"
                />{" "}
                <span className="text-sm font-normal text-muted-foreground">V</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Output Current
              </div>
              <div className="text-2xl font-bold">
                <CountUp
                  from={0}
                  to={parseFloat(outputCurrent) || 0}
                  duration={1}
                  className="inline"
                />{" "}
                <span className="text-sm font-normal text-muted-foreground">A</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                DC Bus Voltage
              </div>
              <div className="text-2xl font-bold">
                <CountUp
                  from={0}
                  to={parseFloat(dcBusVoltage) || 0}
                  duration={1}
                  className="inline"
                />{" "}
                <span className="text-sm font-normal text-muted-foreground">V</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
