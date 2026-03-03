"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Heart,
  AlertCircle,
  ArrowRight,
  Activity,
  Zap,
  BarChart3,
  Calendar,
  TrendingUp,
  Pill,
  Clock,
} from "lucide-react"
import { HealthMetricsChart } from "@/components/health-metrics-chart"
import { RiskFactorsChart } from "@/components/risk-factors-chart"
import { LiverEnzymesChart } from "@/components/liver-enzymes-chart"
import { LifestyleHabitsChart } from "@/components/lifestyle-habits-chart"
import { HealthMetricsPanel } from "@/components/health-metrics-panel"

export default function DashboardHome() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push("/login")
    }
  }, [user, loading, router, mounted])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <Heart className="h-12 w-12 text-primary mx-auto" />
          </div>
          <p className="text-muted-foreground">Loading your health dashboard...</p>
        </div>
      </div>
    )
  }

  const riskLevel = user?.patientProfile?.riskLevel || "unknown"
  const lastUpdate = user?.patientProfile?.lastUpdated
    ? new Date(user.patientProfile.lastUpdated).toLocaleDateString()
    : "Not updated"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {user?.displayName || "Patient"}!
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Track your liver health status and disease risk assessment
          </p>
        </div>
        <Link href="/dashboard/appointments">
          <Button className="w-full md:w-auto" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Quick Stats - Compact Grid */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">Age</p>
            <p className="text-xl font-bold text-primary">{user?.patientProfile?.age || "—"}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">BMI</p>
            <p className="text-xl font-bold text-primary">{user?.patientProfile?.bmi?.toFixed(1) || "—"}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">Blood Type</p>
            <p className="text-xl font-bold text-primary">{user?.patientProfile?.bloodType || "—"}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">Last Updated</p>
            <p className="text-xs font-semibold text-primary">{lastUpdate}</p>
          </div>
        </Card>
      </div>

      {/* Charts - Side by Side */}
      <div className="grid gap-6 md:grid-cols-3">
        <HealthMetricsChart />
        <RiskFactorsChart />
      </div>

      {/* Additional Health Data Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <LiverEnzymesChart />
        <LifestyleHabitsChart />
      </div>

      {/* Health Metrics Panel */}
      <HealthMetricsPanel />

      {/* Risk Assessment Card */}
      <Card
        className={
          riskLevel === "high"
            ? "border-red-200 bg-red-50/30"
            : riskLevel === "moderate"
              ? "border-amber-200 bg-amber-50/30"
              : "border-green-200 bg-green-50/30"
        }
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle
              className={
                riskLevel === "high"
                  ? "h-5 w-5 text-red-600"
                  : riskLevel === "moderate"
                    ? "h-5 w-5 text-amber-600"
                    : "h-5 w-5 text-green-600"
              }
            />
            <CardTitle className="text-base md:text-lg">Liver Disease Risk Assessment</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                riskLevel === "high"
                  ? "bg-red-200 text-red-800"
                  : riskLevel === "moderate"
                    ? "bg-amber-200 text-amber-800"
                    : "bg-green-200 text-green-800"
              }`}
            >
              {riskLevel === "unknown"
                ? "Assessment Pending"
                : riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
            </div>
            <Link href="/dashboard/data-collection">
              <Button variant="outline" size="sm">
                Update Profile
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            {riskLevel === "high"
              ? "Based on your profile, you have risk factors. Please consult a healthcare specialist."
              : riskLevel === "moderate"
                ? "You have some risk factors. Regular monitoring is recommended."
                : riskLevel === "low"
                  ? "Your risk level appears low. Continue maintaining a healthy lifestyle."
                  : "Complete your health profile to get a risk assessment."}
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/dashboard/data-collection">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Health Data</p>
                <p className="text-xs text-muted-foreground">Update health information</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/settings">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">AI Config</p>
                <p className="text-xs text-muted-foreground">Setup API keys</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/appointments">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Appointments</p>
                <p className="text-xs text-muted-foreground">Manage bookings</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
