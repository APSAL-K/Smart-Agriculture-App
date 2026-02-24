"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Leaf, LogOut, User, Settings, UserCircle, Database, Lightbulb } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "@/lib/use-translation"

export function DashboardNav() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
      toast.success("Signed out successfully")
    } catch {
      toast.error("Failed to sign out")
    }
  }

  const initials = user?.displayName
    ? user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "DF"

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-foreground">
            {t('appName')}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 mx-6">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${!user?.farmInfo?.isOnboardingComplete ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {t('dashboard')}
          </Link>
          <Link
            href="/dashboard/data-collection"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('dataCollection')}
          </Link>
          <Link
            href="/dashboard/recommendations"
            className={`text-sm font-medium transition-colors hover:text-primary ${!user?.farmInfo?.isOnboardingComplete ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {t('recommendations')}
          </Link>
          <Link
            href="/dashboard/profile"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('profile')}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!user && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              Demo
            </span>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {user.displayName || "Farmer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/data-collection" className="flex items-center w-full cursor-pointer">
                    <Database className="mr-2 h-4 w-4" />
                    {t('dataCollection')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/recommendations" className="flex items-center w-full cursor-pointer">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {t('recommendations')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center w-full cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    {t('profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/">
              <Button size="sm" variant="outline">
                {t('signIn')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
