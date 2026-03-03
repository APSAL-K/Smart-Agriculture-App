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
  Sparkles,
} from "lucide-react"
import type { HealthReading, PatientProfile } from "@/lib/types"
import { useTranslation } from "@/lib/use-translation"
import { generateLiverDiseaseAssessment } from "@/lib/ai-service"

interface RecommendationsPanelProps {
  latestReading: HealthReading | null
  patientProfile?: PatientProfile
}

export function RecommendationsPanel({
  latestReading,
  patientProfile
}: RecommendationsPanelProps) {
  const { t } = useTranslation()
  const apiKeys = useSelector((state: RootState) => state.settings.apiKeys)
  const [aiAdvice, setAiAdvice] = useState<string | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const handleGetAiAdvice = async () => {
    if (!latestReading || loadingAi) return

    if (!apiKeys.cohere) {
      setAiAdvice("Cohere API key missing. Please configure it in Settings to unlock AI health insights.")
      setHasFetched(true)
      return
    }

    setLoadingAi(true)
    setHasFetched(true)
    const advice = await generateLiverDiseaseAssessment(latestReading, apiKeys, patientProfile, 'Cohere')
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
                Health Insights
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                AI-powered analysis of your liver health indicators
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
            {loadingAi ? "Analyzing Health Data…" : hasFetched ? "Refresh Analysis" : "Get AI Analysis"}
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
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Analyzing Your Health Data...</p>
          </div>
        )}

        {/* AI advice result */}
        {!loadingAi && aiAdvice && (
          <div className="mb-8 relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-6 animate-in zoom-in-95 duration-300">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-4 w-4 animate-pulse" />
              AI Health Assessment
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
              Click <span className="font-semibold text-primary">Get AI Analysis</span> to get personalized health insights based on your lab data.
            </p>
          </div>
        )}

        {!latestReading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No health data available. Upload your lab results to get recommendations.
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
