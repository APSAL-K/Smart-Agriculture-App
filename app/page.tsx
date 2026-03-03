"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AuthForm } from "@/components/auth-form"
import { useTranslation } from "@/lib/use-translation"
import { Heart, BarChart3, Droplet, AlertCircle } from "lucide-react"

export default function HomePage() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Heart className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      {/* Left branding panel */}
      <div className="relative flex shrink-0 flex-col justify-between bg-primary px-6 py-8 sm:px-10 sm:py-10 lg:w-[52%] lg:px-14 lg:py-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-primary-foreground">
            LiverCare AI
          </span>
        </div>

        {/* Hero content */}
        <div className="my-10 lg:my-0">
          <h1 className="text-balance font-serif text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            Early liver disease detection, powered by AI
          </h1>
          <p className="mt-4 max-w-lg text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Monitor your liver health with comprehensive lab test analysis and get AI-powered insights for early intervention and better healthcare outcomes.
          </p>

          {/* Feature cards */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:mt-10">
            <FeatureCard
              icon={<Droplet className="h-5 w-5" />}
              title="Test Analysis"
              description="Lab result tracking"
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Analytics"
              description="Health trends"
            />
            <FeatureCard
              icon={<AlertCircle className="h-5 w-5" />}
              title="Alerts"
              description="Real-time warnings"
            />
          </div>
        </div>

        <p className="hidden text-sm text-primary-foreground/60 lg:block">
          Trusted by healthcare providers for liver disease prediction
        </p>
      </div>

      {/* Right auth form panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-10 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg bg-primary-foreground/10 p-3 sm:p-4">
      <div className="mb-2 text-primary-foreground">{icon}</div>
      <h3 className="text-xs font-semibold text-primary-foreground sm:text-sm">
        {title}
      </h3>
      <p className="hidden text-xs text-primary-foreground/70 sm:block">
        {description}
      </p>
    </div>
  )
}
