"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description =
  "An interactive area chart showing motor frequency over time.";

const chartConfig = {
  frequency: {
    label: "Frequency (Hz)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: any[];
}

export function ChartAreaInteractive({
  data,
}: ChartAreaInteractiveProps) {
  const getTicks = () => {
    const now = new Date();
    const windowMinutes = 60;
    const intervalMinutes = 5;

    const startTime = new Date(now.getTime() - (windowMinutes / 2) * 60 * 1000);
    const endTime = new Date(now.getTime() + (windowMinutes / 2) * 60 * 1000);

    const ticks = [];
    let currentTick = new Date(startTime);
    currentTick.setMinutes(
      Math.floor(currentTick.getMinutes() / intervalMinutes) * intervalMinutes,
      0,
      0
    );

    while (currentTick.getTime() <= endTime.getTime()) {
      ticks.push(currentTick.getTime());
      currentTick.setMinutes(currentTick.getMinutes() + intervalMinutes);
    }

    return { ticks, domain: [startTime.getTime(), endTime.getTime()] };
  };

  const { ticks: customTicks, domain: customDomain } = getTicks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Motor Frequency Over Time</CardTitle>
        <CardDescription>
          Showing motor frequency over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillFrequency" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-frequency)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-frequency)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              domain={customDomain}
              ticks={customTicks}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                if (typeof value !== "number" || !isFinite(value)) {
                  return "";
                }
                return new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }).format(new Date(value));
              }}
            />
            <YAxis dataKey="frequency" domain={[0, 60]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value: number, name: string, item: any) => {
                    if (typeof value !== "number" || !isFinite(value)) {
                      return "";
                    }
                    const time = item.payload.time;
                    const formattedTime = new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      second: "2-digit",
                      hour12: true,
                    }).format(new Date(time));
                    return `${formattedTime}: ${value.toFixed(2)} Hz`;
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="frequency"
              type="linear"
              fill="url(#fillFrequency)"
              stroke="var(--color-frequency)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
