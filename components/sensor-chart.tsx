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
import { useTranslation } from "@/lib/use-translation"
import type { HealthReading } from "@/lib/types"

interface SensorChartProps {
  readings: HealthReading[]
}

type MetricKey = "bilirubin" | "alt" | "ast" | "albumin"

const metrics: {
  key: MetricKey
  label: string
  shortLabel: string
  color: string
  unit: string
}[] = [
    {
      key: "bilirubin",
      label: "Bilirubin",
      shortLabel: "Bili",
      color: "var(--color-chart-1)",
      unit: " mg/dL",
    },
    {
      key: "alt",
      label: "ALT Enzyme",
      shortLabel: "ALT",
      color: "var(--color-chart-2)",
      unit: " U/L",
    },
    {
      key: "ast",
      label: "AST Enzyme",
      shortLabel: "AST",
      color: "var(--color-chart-3)",
      unit: " U/L",
    },
    {
      key: "albumin",
      label: "Albumin",
      shortLabel: "Alb",
      color: "var(--color-chart-4)",
      unit: " g/dL",
    },
  ]

export function SensorChart({ readings }: SensorChartProps) {
  const { t } = useTranslation()
  const [activeMetric, setActiveMetric] = useState<MetricKey>("bilirubin")

  const chartData = readings.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    bilirubin: Number(r.metrics.bilirubin.toFixed(2)),
    alt: Number(r.metrics.alt.toFixed(0)),
    ast: Number(r.metrics.ast.toFixed(0)),
    albumin: Number(r.metrics.albumin.toFixed(2)),
  }))

  const active = metrics.find((m) => m.key === activeMetric)!

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-serif text-base sm:text-lg">
              Health Metrics Trends
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Last 24 hours of lab readings
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
                <span className="sm:hidden">
                  {metric.shortLabel}
                </span>
                <span className="hidden sm:inline">
                  {metric.label}
                </span>
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
