"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AuthForm } from "@/components/auth-form"
import { Button } from "@/components/ui/button"
import { Heart, BarChart3, Droplet, AlertCircle, ArrowRight } from "lucide-react"

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
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Heart className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              <Heart className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight">Liver Disease Prediction</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Hero Section */}
        <div className="relative flex shrink-0 flex-col justify-between bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-12 sm:px-10 sm:py-16 lg:w-[56%] lg:px-16 lg:py-20">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative space-y-10">
            <div className="space-y-6">
              <h1 className="font-serif text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
                Early liver disease detection, powered by AI
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
                Monitor your liver health with comprehensive lab test analysis. Get AI-powered insights for early intervention and better health outcomes.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-3 rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 hover:bg-white/15 transition-all">
                <Droplet className="h-5 w-5 text-primary-foreground" />
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">Lab Tests</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">Real-time tracking</p>
                </div>
              </div>
              <div className="space-y-3 rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 hover:bg-white/15 transition-all">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">Analytics</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">Health trends</p>
                </div>
              </div>
              <div className="space-y-3 rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 hover:bg-white/15 transition-all">
                <AlertCircle className="h-5 w-5 text-primary-foreground" />
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">Alerts</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">Early warnings</p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative text-sm text-primary-foreground/70">
            Trusted by healthcare providers for accurate liver disease prediction
          </p>
        </div>

        {/* Right Auth Section */}
        <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-background to-muted/30 px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight font-serif">Get Started</h2>
              <p className="text-sm text-muted-foreground">
                Sign in or create an account to monitor your liver health
              </p>
            </div>
            <AuthForm />
            <div className="space-y-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
