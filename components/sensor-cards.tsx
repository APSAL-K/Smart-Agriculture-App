"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, Thermometer, Wind, Gauge } from "lucide-react"
import type { SensorReading } from "@/lib/types"
import { useTranslation } from "@/lib/use-translation"
import { cn } from "@/lib/utils"

interface SensorCardProps {
  title: string
  value: string
  icon: React.ReactNode
  status: { label: string; color: string }
  progress: number
  description: string
  trend?: { value: string; positive: boolean }
}

interface SensorCardsProps {
  latestReading: SensorReading | null
}

export function SensorCards({ latestReading }: SensorCardsProps) {
  const { t } = useTranslation()
  if (!latestReading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-muted/20" />
        ))}
      </div>
    )
  }

  const { soilMoisture, temperature, humidity } = latestReading

  const moistureStatus =
    soilMoisture < 15
      ? { label: "Critical", color: "text-destructive" }
      : soilMoisture < 30
        ? { label: "Low", color: "text-orange-500" }
        : soilMoisture > 80
          ? { label: "Saturated", color: "text-blue-500" }
          : { label: "Optimal", color: "text-green-500" }

  const temperatureStatus =
    temperature > 38
      ? { label: "Extreme", color: "text-destructive" }
      : temperature > 32
        ? { label: "High", color: "text-orange-500" }
        : temperature < 5
          ? { label: "Cold", color: "text-blue-400" }
          : { label: "Normal", color: "text-green-500" }

  const humidityStatus =
    humidity < 25
      ? { label: "Dry", color: "text-orange-400" }
      : humidity > 85
        ? { label: "High", color: "text-blue-400" }
        : { label: "Normal", color: "text-green-500" }

  const health =
    soilMoisture >= 30 && soilMoisture <= 80 && temperature <= 35 && humidity >= 30
      ? { value: 85, label: "Good", color: "text-green-500" }
      : soilMoisture < 15 || temperature > 38
        ? { value: 30, label: "Poor", color: "text-destructive" }
        : { value: 60, label: "Fair", color: "text-orange-500" }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      <SensorCard
        title={t('soilMoisture')}
        value={`${soilMoisture.toFixed(1)}%`}
        icon={<Droplets className="h-5 w-5" />}
        status={moistureStatus}
        progress={soilMoisture}
        description="Hydro-Saturation"
        trend={{ value: "+2.4%", positive: true }}
      />
      <SensorCard
        title={t('temperature')}
        value={`${temperature.toFixed(1)}\u00B0C`}
        icon={<Thermometer className="h-5 w-5" />}
        status={temperatureStatus}
        progress={(temperature / 50) * 100}
        description="Thermal Environment"
        trend={{ value: "-0.5°", positive: true }}
      />
      <SensorCard
        title={t('humidity')}
        value={`${humidity.toFixed(1)}%`}
        icon={<Wind className="h-5 w-5" />}
        status={humidityStatus}
        progress={humidity}
        description="Atmospheric Vapor"
        trend={{ value: "+1.2%", positive: false }}
      />
      <SensorCard
        title="Crop Health"
        value={`${health.value}%`}
        icon={<Gauge className="h-5 w-5" />}
        status={health}
        progress={health.value}
        description="Viability Index"
        trend={{ value: "Stable", positive: true }}
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
  trend
}: SensorCardProps) {
  return (
    <Card className="group relative overflow-hidden border-none bg-card/40 backdrop-blur-xl shadow-lg transition-all hover:shadow-2xl hover:translate-y-[-4px] rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {title}
          </CardTitle>
          <span className="text-[10px] font-bold text-muted-foreground/60">{description}</span>
        </div>
        <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          {icon}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-foreground sm:text-3xl">
              {value}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase",
                status.color.replace('text-', 'bg-').replace('500', '500/10'),
                status.color
              )}>
                {status.label}
              </span>
              {trend && (
                <span className={cn("text-[9px] font-bold", trend.positive ? "text-green-500" : "text-orange-500")}>
                  {trend.value}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
            <span>Range</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress
            value={Math.min(Math.max(progress, 0), 100)}
            className="h-1.5 bg-primary/10"
          />
        </div>
      </CardContent>
    </Card>
  )
}
