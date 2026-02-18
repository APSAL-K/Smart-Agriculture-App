"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { SensorReading } from "@/lib/types"

interface SensorChartProps {
  readings: SensorReading[]
}

type MetricKey = "soilMoisture" | "temperature" | "humidity"

const metrics: {
  key: MetricKey
  label: string
  shortLabel: string
  color: string
  unit: string
}[] = [
  {
    key: "soilMoisture",
    label: "Soil Moisture",
    shortLabel: "Moisture",
    color: "var(--color-chart-1)",
    unit: "%",
  },
  {
    key: "temperature",
    label: "Temperature",
    shortLabel: "Temp",
    color: "var(--color-chart-5)",
    unit: "\u00B0C",
  },
  {
    key: "humidity",
    label: "Humidity",
    shortLabel: "Humidity",
    color: "var(--color-chart-4)",
    unit: "%",
  },
]

export function SensorChart({ readings }: SensorChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("soilMoisture")

  const chartData = readings.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    soilMoisture: Number(r.soilMoisture.toFixed(1)),
    temperature: Number(r.temperature.toFixed(1)),
    humidity: Number(r.humidity.toFixed(1)),
  }))

  const active = metrics.find((m) => m.key === activeMetric)!

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-serif text-base sm:text-lg">
              Sensor Trends
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Last 24 hours of readings
            </CardDescription>
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {metrics.map((metric) => (
              <Button
                key={metric.key}
                variant={activeMetric === metric.key ? "default" : "ghost"}
                size="sm"
                className="px-2 text-xs sm:px-3"
                onClick={() => setActiveMetric(metric.key)}
              >
                <span className="sm:hidden">{metric.shortLabel}</span>
                <span className="hidden sm:inline">{metric.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="h-[220px] w-full sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={active.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={active.color}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="time"
                tick={{
                  fontSize: 10,
                  fill: "var(--color-muted-foreground)",
                }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "var(--color-muted-foreground)",
                }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--color-foreground)",
                }}
                formatter={(value: number) => [
                  `${value}${active.unit}`,
                  active.label,
                ]}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={active.color}
                strokeWidth={2}
                fill="url(#colorFill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
