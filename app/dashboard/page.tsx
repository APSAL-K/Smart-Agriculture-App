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

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.patientProfile?.age || "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Years</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              BMI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.patientProfile?.bmi?.toFixed(1) || "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">kg/m²</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Blood Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.patientProfile?.bloodType || "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Type</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-bold text-primary">{lastUpdate}</div>
            <p className="text-xs text-muted-foreground mt-1">Profile date</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Risk Assessment */}
        <Card
          className={
            riskLevel === "high"
              ? "border-red-200 bg-red-50/30"
              : riskLevel === "moderate"
                ? "border-amber-200 bg-amber-50/30"
                : "border-green-200 bg-green-50/30"
          }
        >
          <CardHeader>
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
              <CardTitle>Liver Disease Risk</CardTitle>
            </div>
            <CardDescription>
              Current AI-powered prediction status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
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
            </div>
            <p className="text-sm text-muted-foreground">
              {riskLevel === "high"
                ? "Based on your profile, you have risk factors. Please consult a healthcare specialist."
                : riskLevel === "moderate"
                  ? "You have some risk factors. Regular monitoring is recommended."
                  : riskLevel === "low"
                    ? "Your risk level appears low. Continue maintaining a healthy lifestyle."
                    : "Complete your health profile to get a risk assessment."}
            </p>
            <Link href="/dashboard/data-collection">
              <Button variant="outline" className="w-full">
                Check Disease Risk
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Health Profile Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <CardTitle>Health Profile</CardTitle>
            </div>
            <CardDescription>Your complete health information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Basic Information</span>
                <span className="font-semibold">
                  {user?.patientProfile?.age ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Medical History</span>
                <span className="font-semibold">
                  {user?.patientProfile?.medicalHistory?.length > 0 ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lifestyle Data</span>
                <span className="font-semibold">
                  {user?.patientProfile?.smokingStatus ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Family History</span>
                <span className="font-semibold">
                  {user?.patientProfile?.familyHistoryLiver
                    ? "✓"
                    : "✗"}
                </span>
              </div>
            </div>
            <Link href="/dashboard/data-collection">
              <Button className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Update Health Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/data-collection">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Health Data Collection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update comprehensive health information and run disease analysis
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-base">AI Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure API keys for advanced disease prediction
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/appointments">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base">Appointments</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Schedule and manage your doctor appointments
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
