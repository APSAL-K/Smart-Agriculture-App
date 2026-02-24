"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Lightbulb,
  ArrowRight,
  Droplets,
  Thermometer,
  Wind,
  Sparkles,
} from "lucide-react"
import { getRecommendations } from "@/lib/recommendations"
import type { SensorReading, IrrigationRecommendation, FarmInfo } from "@/lib/types"
import { useTranslation } from "@/lib/use-translation"
import { generateAiRecommendation } from "@/lib/ai-service"
import { cn } from "@/lib/utils"

interface RecommendationsPanelProps {
  latestReading: SensorReading | null
  farmInfo?: FarmInfo
}

export function RecommendationsPanel({
  latestReading,
  farmInfo
}: RecommendationsPanelProps) {
  const { t } = useTranslation()
  const apiKeys = useSelector((state: RootState) => state.settings.apiKeys)
  const [aiAdvice, setAiAdvice] = useState<string | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const recommendations = getRecommendations(latestReading)

  const handleGetAiAdvice = async () => {
    if (!latestReading || loadingAi) return

    if (!apiKeys.cohere) {
      setAiAdvice("Cohere API key missing. Please configure it in Settings to unlock AI insights.")
      setHasFetched(true)
      return
    }

    setLoadingAi(true)
    setHasFetched(true)
    const advice = await generateAiRecommendation(latestReading, apiKeys, farmInfo, 'Cohere')
    setAiAdvice(advice)
    setLoadingAi(false)
  }

  return (
    <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="font-black text-xl tracking-tight text-foreground uppercase">
                {t('recommendations')}
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Intelligent operational guidance powered by Cohere AI
              </CardDescription>
            </div>
          </div>

          {/* Manual trigger button — no auto-call */}
          <Button
            size="sm"
            variant="outline"
            className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold"
            onClick={handleGetAiAdvice}
            disabled={loadingAi || !latestReading}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {loadingAi ? "Consulting AI…" : hasFetched ? "Refresh AI Advice" : "Get AI Advice"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Loading state */}
        {loadingAi && (
          <div className="mb-8 flex items-center gap-4 py-8 rounded-3xl bg-muted/20 justify-center">
            <div className="relative">
              <Sparkles className="h-8 w-8 animate-spin text-primary opacity-20" />
              <Sparkles className="h-6 w-6 absolute inset-1 animate-pulse text-primary" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Consulting Digital Agronomist...</p>
          </div>
        )}

        {/* AI advice result */}
        {!loadingAi && aiAdvice && (
          <div className="mb-8 relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-6 animate-in zoom-in-95 duration-300">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-4 w-4 animate-pulse" />
              AI Intelligent Insight
            </h3>
            <div className="relative z-10 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-foreground prose-headings:text-foreground prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-3 first:prose-headings:mt-0 text-foreground/90">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiAdvice}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Prompt to get AI advice if not yet fetched */}
        {!loadingAi && !hasFetched && (
          <div className="mb-8 flex flex-col items-center justify-center gap-3 py-6 rounded-3xl bg-muted/10 border border-dashed border-primary/20">
            <Sparkles className="h-8 w-8 text-primary/30" />
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Click <span className="font-semibold text-primary">Get AI Advice</span> above to get a personalised AI recommendation based on your live sensor data.
            </p>
          </div>
        )}

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
