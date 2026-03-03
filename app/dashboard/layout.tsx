import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardNav } from "@/components/dashboard-nav"
import { Heart, Info } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isOnboardingComplete = user?.patientProfile?.isOnboardingComplete

  useEffect(() => {
    if (!loading && !isOnboardingComplete) {
      if (pathname !== "/dashboard/data-collection" && pathname !== "/dashboard/profile") {
        router.push("/dashboard/data-collection")
      }
    }
  }, [loading, isOnboardingComplete, pathname, router])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Heart className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your health data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <DashboardNav />
      {!isOnboardingComplete && pathname === "/dashboard/data-collection" && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex items-center justify-center gap-3">
          <Info className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium text-primary">
            Onboarding Required: Please complete your health profile to unlock the dashboard.
          </p>
        </div>
      )}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
