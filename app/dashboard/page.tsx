"use client"

import { useAuth } from "@/lib/auth-context"
import { useSensorData } from "@/lib/use-sensor-data"
import { SensorCards } from "@/components/sensor-cards"
import { SensorChart } from "@/components/sensor-chart"
import { AlertsPanel } from "@/components/alerts-panel"
import { RecommendationsPanel } from "@/components/recommendations-panel"
import { Badge } from "@/components/ui/badge"
import { Leaf } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { readings, alerts, loading, isDemo } = useSensorData(user?.uid)

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

  const latestReading =
    readings.length > 0 ? readings[readings.length - 1] : null

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            Farm Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user
              ? `Welcome back, ${user.displayName || "Farmer"}`
              : "Viewing demo data"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isDemo && (
            <Badge variant="secondary" className="text-xs">
              Demo Mode
            </Badge>
          )}
          {latestReading && (
            <Badge
              variant="outline"
              className="text-xs text-muted-foreground"
            >
              Last updated:{" "}
              {new Date(latestReading.timestamp).toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Sensor overview cards */}
      <SensorCards latestReading={latestReading} />

      {/* Charts + alerts grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SensorChart readings={readings} />
        </div>
        <div>
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 pb-6">
        <RecommendationsPanel latestReading={latestReading} />
      </div>
    </div>
  )
}
