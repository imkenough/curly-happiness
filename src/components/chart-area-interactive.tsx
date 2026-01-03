"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
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

export const description = "An interactive area chart showing motor frequency over time.";

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
  const isMobile = useIsMobile();

  const getTicks = (data: any[]) => {
    if (!data || data.length === 0) {
      return [];
    }
    const timeValues = data.map(d => d.time);
    const minTime = Math.min(...timeValues);
    const maxTime = Math.max(...timeValues);

    const ticks = [];
    let currentTick = new Date(minTime);
    currentTick.setMinutes(Math.ceil(currentTick.getMinutes() / 5) * 5, 0, 0);

    while (currentTick.getTime() <= maxTime) {
      ticks.push(currentTick.getTime());
      currentTick.setMinutes(currentTick.getMinutes() + 5);
    }
    return ticks;
  };

  const customTicks = getTicks(data);

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
              domain={['dataMin', 'dataMax']}
              ticks={customTicks}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                });
              }}
            />
            <YAxis dataKey="frequency" domain={[0, 60]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="frequency"
              type="natural"
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
