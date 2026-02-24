"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/use-translation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { Leaf, Loader2 } from "lucide-react"

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        toast.success("Welcome back!")
      } else {
        if (!displayName.trim()) {
          toast.error("Please enter a farm name")
          setIsLoading(false)
          return
        }
        await signUp(email, password, displayName)
        toast.success("Account created successfully!")
      }
      router.push("/dashboard")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    router.push("/dashboard")
    toast.success("Logged in with demo data")
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 lg:hidden">
          <Leaf className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl">
          {isLogin ? t('welcome') : t('signUp')}
        </CardTitle>
        <CardDescription className="text-sm">
          {isLogin
            ? "Sign in to access your farm dashboard"
            : "Start monitoring your farm today"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">{t('farmName')}</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Green Valley Farm"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={!isLogin}
                disabled={isLoading}
                autoComplete="organization"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? t('signIn') : t('signUp')}
          </Button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleDemoLogin}
          >
            {t('demoMode')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {isLogin ? t('signUp') : t('signIn')}
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
