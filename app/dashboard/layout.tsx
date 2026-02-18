"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardNav } from "@/components/dashboard-nav"
import { Leaf } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Allow demo access even without a user
  useEffect(() => {
    // Only redirect if explicitly signed out (not loading and not demo)
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading your farm data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav />
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
    </div>
  )
}
