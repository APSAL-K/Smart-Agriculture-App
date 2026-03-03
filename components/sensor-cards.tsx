"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplet, Activity, AlertTriangle, Gauge } from "lucide-react"
import type { HealthReading } from "@/lib/types"
import { useTranslation } from "@/lib/use-translation"
import { cn } from "@/lib/utils"

interface HealthMetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  status: { label: string; color: string }
  progress: number
  description: string
  unit?: string
  normalRange?: string
  trend?: { value: string; positive: boolean }
}

interface HealthCardsProps {
  latestReading: HealthReading | null
}

export function SensorCards({ latestReading }: HealthCardsProps) {
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

  const { metrics } = latestReading
  const { bilirubin, alt, ast, albumin } = metrics

  const bilirubinStatus =
    bilirubin > 1.5
      ? { label: "High", color: "text-destructive" }
      : bilirubin > 1.2
        ? { label: "Elevated", color: "text-orange-500" }
        : { label: "Normal", color: "text-green-500" }

  const altStatus =
    alt > 80
      ? { label: "Critical", color: "text-destructive" }
      : alt > 40
        ? { label: "High", color: "text-orange-500" }
        : { label: "Normal", color: "text-green-500" }

  const astStatus =
    ast > 80
      ? { label: "Critical", color: "text-destructive" }
      : ast > 40
        ? { label: "High", color: "text-orange-500" }
        : { label: "Normal", color: "text-green-500" }

  const albuminStatus =
    albumin < 3.0
      ? { label: "Critical", color: "text-destructive" }
      : albumin < 3.5
        ? { label: "Low", color: "text-orange-500" }
        : { label: "Normal", color: "text-green-500" }

  const overallHealth =
    bilirubinStatus.label === "Normal" &&
    altStatus.label === "Normal" &&
    astStatus.label === "Normal" &&
    albuminStatus.label === "Normal"
      ? { value: 85, label: "Good", color: "text-green-500" }
      : bilirubinStatus.label === "Critical" || altStatus.label === "Critical"
        ? { value: 30, label: "Alert", color: "text-destructive" }
        : { value: 60, label: "Fair", color: "text-orange-500" }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      <HealthMetricCard
        title="Bilirubin"
        value={`${bilirubin.toFixed(2)}`}
        unit="mg/dL"
        icon={<Droplet className="h-5 w-5" />}
        status={bilirubinStatus}
        progress={Math.min((bilirubin / 2) * 100, 100)}
        description="Bile Pigment Level"
        normalRange="< 1.2"
      />
      <HealthMetricCard
        title="ALT (SGPT)"
        value={`${alt.toFixed(0)}`}
        unit="Units/L"
        icon={<Activity className="h-5 w-5" />}
        status={altStatus}
        progress={Math.min((alt / 100) * 100, 100)}
        description="Liver Enzyme Activity"
        normalRange="< 40"
      />
      <HealthMetricCard
        title="AST (SGOT)"
        value={`${ast.toFixed(0)}`}
        unit="Units/L"
        icon={<AlertTriangle className="h-5 w-5" />}
        status={astStatus}
        progress={Math.min((ast / 100) * 100, 100)}
        description="Liver Damage Marker"
        normalRange="< 40"
      />
      <HealthMetricCard
        title="Health Score"
        value={`${overallHealth.value}`}
        unit="%"
        icon={<Gauge className="h-5 w-5" />}
        status={overallHealth}
        progress={overallHealth.value}
        description="Overall Assessment"
      />
    </div>
  )
}

function HealthMetricCard({
  title,
  value,
  unit,
  icon,
  status,
  progress,
  description,
  normalRange,
  trend
}: HealthMetricCardProps) {
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
            {unit && (
              <span className="text-[9px] font-bold text-muted-foreground/70 mt-0.5">
                {unit}
              </span>
            )}
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
            <span>{normalRange || "Range"}</span>
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
