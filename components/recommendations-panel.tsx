"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, ArrowRight, Droplets, Thermometer, Wind } from "lucide-react"
import { getRecommendations } from "@/lib/recommendations"
import type { SensorReading, IrrigationRecommendation } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RecommendationsPanelProps {
  latestReading: SensorReading | null
}

export function RecommendationsPanel({ latestReading }: RecommendationsPanelProps) {
  const recommendations = getRecommendations(latestReading)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <Lightbulb className="h-4 w-4" />
          Irrigation Recommendations
        </CardTitle>
        <CardDescription>
          Smart advice based on your current sensor readings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No sensor data available for recommendations.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
    high: { color: "bg-destructive/10 text-destructive border-destructive/20", label: "High Priority" },
    medium: { color: "bg-accent/20 text-accent-foreground border-accent/30", label: "Medium Priority" },
    low: { color: "bg-primary/10 text-primary border-primary/20", label: "Low Priority" },
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
        "flex flex-col gap-3 rounded-lg border p-4 transition-shadow hover:shadow-md",
        config.color.split(" ").find((c) => c.startsWith("border-"))
          ? ""
          : "border-border"
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
      <div className="rounded-md bg-background p-3">
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
