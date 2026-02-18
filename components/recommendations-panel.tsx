"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  ArrowRight,
  Droplets,
  Thermometer,
  Wind,
} from "lucide-react"
import { getRecommendations } from "@/lib/recommendations"
import type { SensorReading, IrrigationRecommendation } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RecommendationsPanelProps {
  latestReading: SensorReading | null
}

export function RecommendationsPanel({
  latestReading,
}: RecommendationsPanelProps) {
  const recommendations = getRecommendations(latestReading)

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 font-serif text-base sm:text-lg">
          <Lightbulb className="h-4 w-4" />
          Irrigation Recommendations
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Smart advice based on your current sensor readings
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        {recommendations.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No sensor data available for recommendations.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: IrrigationRecommendation
}) {
  const priorityConfig = {
    high: {
      color: "border-destructive/20",
      bg: "bg-destructive/5",
      label: "High Priority",
    },
    medium: {
      color: "border-accent/30",
      bg: "bg-accent/10",
      label: "Medium Priority",
    },
    low: {
      color: "border-primary/20",
      bg: "bg-primary/5",
      label: "Low Priority",
    },
  }

  const config = priorityConfig[recommendation.priority]

  const icon =
    recommendation.title.toLowerCase().includes("moisture") ||
    recommendation.title.toLowerCase().includes("irrigation") ||
    recommendation.title.toLowerCase().includes("watering") ||
    recommendation.title.toLowerCase().includes("reduce") ? (
      <Droplets className="h-4 w-4" />
    ) : recommendation.title.toLowerCase().includes("temperature") ||
      recommendation.title.toLowerCase().includes("heat") ||
      recommendation.title.toLowerCase().includes("frost") ? (
      <Thermometer className="h-4 w-4" />
    ) : (
      <Wind className="h-4 w-4" />
    )

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-3 transition-shadow hover:shadow-md sm:p-4",
        config.color,
        config.bg
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background">
          {icon}
        </div>
        <Badge variant="outline" className="text-[10px]">
          {config.label}
        </Badge>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          {recommendation.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {recommendation.description}
        </p>
      </div>
      <div className="rounded-md bg-background p-2.5 sm:p-3">
        <div className="flex items-start gap-2">
          <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-foreground">
            {recommendation.action}
          </p>
        </div>
      </div>
    </div>
  )
}
