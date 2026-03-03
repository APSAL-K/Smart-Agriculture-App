"use client"

import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/use-translation"
import { useSensorData } from "@/lib/use-sensor-data"
import { SensorCards } from "@/components/sensor-cards"
import { SensorChart } from "@/components/sensor-chart"
import { AlertsPanel } from "@/components/alerts-panel"
import { RecommendationsPanel } from "@/components/recommendations-panel"
import { Badge } from "@/components/ui/badge"
import { Heart, LayoutDashboard, Sparkles } from "lucide-react"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { readings, alerts, loading, isDemo } = useSensorData(user?.uid, user?.patientProfile)

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Heart className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading health data...
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
              {isDemo ? "Health Simulation" : "Live Health Monitoring"}
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Liver Health Dashboard
          </h1>
          <p className="text-sm font-medium text-muted-foreground/80 max-w-md">
            {user
              ? `Monitor your liver health metrics. Welcome back, ${user.displayName || "Patient"}.`
              : "Experience AI-powered liver disease prediction through our diagnostic simulation."}
          </p>
        </div>
      </section>

      {/* Health Metrics Layer */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Health Indicators</h2>
        </div>
        <SensorCards latestReading={latestReading} />
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
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

      {/* Health Recommendations */}
      <section className="pb-12">
        <RecommendationsPanel
          latestReading={latestReading}
          patientProfile={user?.patientProfile}
        />
      </section>
    </div>
  )
}
