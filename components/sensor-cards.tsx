"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, Thermometer, Wind, Gauge } from "lucide-react"
import type { SensorReading } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SensorCardsProps {
  latestReading: SensorReading | null
}

export function SensorCards({ latestReading }: SensorCardsProps) {
  if (!latestReading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-16 rounded bg-muted sm:h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const { soilMoisture, temperature, humidity } = latestReading

  const moistureStatus =
    soilMoisture < 15
      ? { label: "Critical", color: "text-destructive" }
      : soilMoisture < 30
        ? { label: "Low", color: "text-accent-foreground" }
        : soilMoisture > 80
          ? { label: "Saturated", color: "text-chart-4" }
          : { label: "Optimal", color: "text-primary" }

  const temperatureStatus =
    temperature > 38
      ? { label: "Extreme", color: "text-destructive" }
      : temperature > 32
        ? { label: "High", color: "text-accent-foreground" }
        : temperature < 5
          ? { label: "Cold", color: "text-chart-4" }
          : { label: "Normal", color: "text-primary" }

  const humidityStatus =
    humidity < 25
      ? { label: "Dry", color: "text-accent-foreground" }
      : humidity > 85
        ? { label: "High", color: "text-chart-4" }
        : { label: "Normal", color: "text-primary" }

  const health =
    soilMoisture >= 30 && soilMoisture <= 80 && temperature <= 35 && humidity >= 30
      ? { value: 85, label: "Good", color: "text-primary" }
      : soilMoisture < 15 || temperature > 38
        ? { value: 30, label: "Poor", color: "text-destructive" }
        : { value: 60, label: "Fair", color: "text-accent-foreground" }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <SensorCard
        title="Soil Moisture"
        value={`${soilMoisture.toFixed(1)}%`}
        icon={<Droplets className="h-4 w-4 sm:h-5 sm:w-5" />}
        status={moistureStatus}
        progress={soilMoisture}
        description="Volumetric water content"
      />
      <SensorCard
        title="Temperature"
        value={`${temperature.toFixed(1)}\u00B0C`}
        icon={<Thermometer className="h-4 w-4 sm:h-5 sm:w-5" />}
        status={temperatureStatus}
        progress={(temperature / 50) * 100}
        description="Ambient air temperature"
      />
      <SensorCard
        title="Humidity"
        value={`${humidity.toFixed(1)}%`}
        icon={<Wind className="h-4 w-4 sm:h-5 sm:w-5" />}
        status={humidityStatus}
        progress={humidity}
        description="Relative air humidity"
      />
      <SensorCard
        title="Crop Health"
        value={`${health.value}%`}
        icon={<Gauge className="h-4 w-4 sm:h-5 sm:w-5" />}
        status={health}
        progress={health.value}
        description="Overall health index"
      />
    </div>
  )
}

function SensorCard({
  title,
  value,
  icon,
  status,
  progress,
  description,
}: {
  title: string
  value: string
  icon: React.ReactNode
  status: { label: string; color: string }
  progress: number
  description: string
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 sm:p-6 sm:pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-lg font-bold tracking-tight text-foreground sm:text-2xl">
            {value}
          </span>
          <span className={cn("text-[10px] font-semibold sm:text-xs", status.color)}>
            {status.label}
          </span>
        </div>
        <Progress
          value={Math.min(Math.max(progress, 0), 100)}
          className="mt-2 h-1 sm:mt-3 sm:h-1.5"
        />
        <p className="mt-1.5 hidden text-xs text-muted-foreground sm:block">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
