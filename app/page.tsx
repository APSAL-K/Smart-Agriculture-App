"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AuthForm } from "@/components/auth-form"
import { Leaf, BarChart3, Droplets, Thermometer } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left panel - Branding */}
      <div className="relative flex flex-col justify-between bg-primary p-8 lg:w-1/2 lg:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-primary-foreground">
            AgroSense
          </span>
        </div>

        <div className="my-12 lg:my-0">
          <h1 className="text-balance font-serif text-3xl font-bold leading-tight text-primary-foreground lg:text-5xl">
            Smart farming starts with smarter data
          </h1>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
            Monitor your soil, predict irrigation needs, and protect your crops with real-time sensor data and intelligent recommendations.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<Droplets className="h-5 w-5" />}
              title="Soil Moisture"
              description="Real-time monitoring"
            />
            <FeatureCard
              icon={<Thermometer className="h-5 w-5" />}
              title="Temperature"
              description="24/7 tracking"
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Analytics"
              description="Smart insights"
            />
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          Trusted by over 2,000 farms worldwide
        </p>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex flex-1 items-center justify-center bg-background p-8 lg:p-12">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  )
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
    <div className="rounded-lg bg-primary-foreground/10 p-4">
      <div className="mb-2 text-primary-foreground">{icon}</div>
      <h3 className="text-sm font-semibold text-primary-foreground">{title}</h3>
      <p className="text-xs text-primary-foreground/70">{description}</p>
    </div>
  )
}
