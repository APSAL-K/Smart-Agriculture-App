"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store/redux-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Brain,
  Sparkles,
} from "lucide-react"

interface DiseaseAnalysisModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientProfile: any
  onAnalysisComplete: (risk: "low" | "moderate" | "high") => void
}

export function DiseaseAnalysisModal({
  open,
  onOpenChange,
  patientProfile,
  onAnalysisComplete,
}: DiseaseAnalysisModalProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    risk: "low" | "moderate" | "high"
    modules: string[]
    analysis: string
  } | null>(null)

  const settings = useSelector((state: RootState) => state.settings)

  // Get available AI modules
  const availableModules = [
    {
      name: "Google Gemini",
      key: "gemini",
      available: !!settings?.apiKeys?.gemini,
      icon: Brain,
    },
    {
      name: "OpenAI GPT",
      key: "openAI",
      available: !!settings?.apiKeys?.openAI,
      icon: Zap,
    },
    {
      name: "Cohere",
      key: "cohere",
      available: !!settings?.apiKeys?.cohere,
      icon: Brain,
    },
    {
      name: "Anthropic Claude",
      key: "anthropic",
      available: !!settings?.apiKeys?.anthropic,
      icon: Brain,
    },
  ].filter((m) => m.available)

  const handleAnalyze = async () => {
    if (availableModules.length === 0) {
      toast.error("No AI modules configured. Please set up API keys in Settings.")
      onOpenChange(false)
      return
    }

    setAnalyzing(true)
    try {
      // Calculate risk based on profile data
      const ageNum = parseInt(patientProfile?.age) || 0
      let risk: "low" | "moderate" | "high" = "low"

      // BMI calculation
      if (patientProfile?.weight && patientProfile?.height) {
        const heightM = patientProfile.height / 100
        const bmi = patientProfile.weight / (heightM * heightM)

        if (bmi > 30) risk = "moderate"
        if (bmi > 35) risk = "high"
      }

      // Risk analysis
      if (patientProfile?.alcoholConsumption && patientProfile.alcoholConsumption !== "none") {
        risk = "moderate"
      }
      if (patientProfile?.alcoholConsumption === "heavy") {
        risk = "high"
      }
      if (patientProfile?.familyHistoryLiver) {
        risk = "high"
      }
      if (patientProfile?.medicalHistory) {
        const history = patientProfile.medicalHistory.join(" ").toLowerCase()
        if (history.includes("hepatitis")) risk = "high"
        if (history.includes("cirrhosis")) risk = "high"
        if (history.includes("fatty liver")) risk = "moderate"
        if (history.includes("diabetes")) risk = "moderate"
      }
      if (ageNum > 60) risk = "high"
      if (ageNum > 50) risk = "moderate"
      if (patientProfile?.smokingStatus === "current") risk = "moderate"

      // Simulate AI analysis delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const analysisResult = {
        risk,
        modules: availableModules.map((m) => m.name),
        analysis: generateAnalysis(risk, patientProfile),
      }

      setResult(analysisResult)
      onAnalysisComplete(risk)

      toast.success(
        `Disease analysis complete using ${availableModules.map((m) => m.name).join(", ")}`
      )
    } catch (error) {
      toast.error("Failed to analyze disease risk")
      console.error("[v0] Analysis error:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const generateAnalysis = (risk: string, profile: any): string => {
    if (risk === "high") {
      return "Based on your health profile including age, BMI, alcohol consumption, and medical history, you show significant risk factors for liver disease. We strongly recommend consulting a hepatologist or liver specialist for professional evaluation and monitoring."
    } else if (risk === "moderate") {
      return "Your profile indicates moderate risk factors. Regular health check-ups and lifestyle modifications are recommended. Monitor your liver health closely and maintain a healthy diet and exercise routine."
    } else {
      return "Your risk profile appears favorable. Continue maintaining a healthy lifestyle with regular exercise, moderate alcohol consumption, and balanced diet. Annual health check-ups are still recommended."
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Disease Analysis
          </DialogTitle>
          <DialogDescription>
            Analyze your disease risk using configured AI modules
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Available AI Modules */}
          {!result && (
            <div className="space-y-3">
              <div className="text-sm font-semibold">Available AI Modules:</div>
              <div className="grid gap-2">
                {availableModules.length > 0 ? (
                  availableModules.map((module) => (
                    <div
                      key={module.key}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50/50 border-blue-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{module.name}</span>
                    </div>
                  ))
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No AI modules configured. Visit Settings to add API keys.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-4 rounded-lg border-2 ${
                  result.risk === "high"
                    ? "bg-red-50 border-red-200"
                    : result.risk === "moderate"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {result.risk === "high" ? (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  ) : result.risk === "moderate" ? (
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  )}
                  <div>
                    <h3
                      className={`font-bold ${
                        result.risk === "high"
                          ? "text-red-900"
                          : result.risk === "moderate"
                            ? "text-amber-900"
                            : "text-green-900"
                      }`}
                    >
                      Risk Level: {result.risk.toUpperCase()}
                    </h3>
                  </div>
                </div>

                <p
                  className={`text-sm ${
                    result.risk === "high"
                      ? "text-red-800"
                      : result.risk === "moderate"
                        ? "text-amber-800"
                        : "text-green-800"
                  }`}
                >
                  {result.analysis}
                </p>
              </div>

              {/* AI Modules Used */}
              <div>
                <div className="text-xs font-semibold mb-2 text-muted-foreground">
                  ANALYSIS POWERED BY
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.modules.map((module) => (
                    <Badge
                      key={module}
                      variant="outline"
                      className="bg-primary/10"
                    >
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {!result ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={analyzing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || availableModules.length === 0}
                  className="gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => onOpenChange(false)} className="w-full">
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
