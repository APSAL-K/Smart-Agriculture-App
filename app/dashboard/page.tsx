"use client"

import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/use-translation"
import { useSensorData } from "@/lib/use-sensor-data"
import { SensorCards } from "@/components/sensor-cards"
import { SensorChart } from "@/components/sensor-chart"
import { AlertsPanel } from "@/components/alerts-panel"
import { RecommendationsPanel } from "@/components/recommendations-panel"
import { Badge } from "@/components/ui/badge"
import { Leaf, LayoutDashboard, Sparkles } from "lucide-react"
import { CropProgress } from "@/components/crop-progress"
import { WeatherWidget } from "@/components/weather-widget"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { readings, alerts, loading, isDemo, latestWeather } = useSensorData(user?.uid, user?.farmInfo)

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading sensor data...
          </p>
        </div>
      </div>
    )
  }

  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
      {/* Premium Header Section */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-background/50 backdrop-blur-sm border-primary/20">
              {isDemo ? "Experimental Simulation" : "Live Operational Insight"}
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("dashboard")}
          </h1>
          <p className="text-sm font-medium text-muted-foreground/80 max-w-md">
            {user
              ? `Healthy growth detected for your ${user.farmInfo?.cropType || 'crops'}. Welcome back, ${user.displayName || "Farmer"}.`
              : "Experience the future of intelligent farming through our live simulation environment."}
          </p>
        </div>

        <div className="lg:w-[450px]">
          <WeatherWidget weather={latestWeather} />
        </div>
      </section>

      {/* Sensor Intelligence Layer */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pulse Monitoring</h2>
        </div>
        <SensorCards latestReading={latestReading} />
      </section>

      {/* Operational Flow */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="flex flex-col justify-end">
          {user?.farmInfo?.plantingDate && user?.farmInfo?.expectedHarvest && (
            <CropProgress
              plantingDate={user.farmInfo.plantingDate}
              expectedHarvest={user.farmInfo.expectedHarvest}
              cropType={user.farmInfo.cropType}
            />
          )}
        </div>
      </div>

      {/* Deep Insights & Analytics */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SensorChart readings={readings} />
        </div>
        <div className="h-full">
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

      {/* Contextual Recommendations */}
      <section className="pb-12">
        <RecommendationsPanel
          latestReading={latestReading}
          farmInfo={user?.farmInfo}
        />
      </section>
    </div>
  )
}
