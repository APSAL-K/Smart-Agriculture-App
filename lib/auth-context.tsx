"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"

import type { PatientProfile } from "./types"

interface User {
  uid: string
  email: string
  displayName?: string
  location?: string
  patientProfile?: PatientProfile
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  signOut: () => Promise<void>
  handleUnauthorized: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "smart_health_user"
const USERS_DB_KEY = "smart_health_users_db"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem(STORAGE_KEY)
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("[v0] Failed to parse saved user:", error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]")
    const foundUser = usersDb.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = {
        uid: foundUser.uid,
        email: foundUser.email,
        displayName: foundUser.displayName,
        location: foundUser.location || "India",
        patientProfile: foundUser.patientProfile
      }
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } else {
      throw new Error("Invalid email or password")
    }
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]")
      if (usersDb.find((u: any) => u.email === email)) {
        throw new Error("User already exists")
      }

      const newUser = {
        uid: Math.random().toString(36).substring(7),
        email,
        password,
        displayName,
        location: "India",
        createdAt: new Date().toISOString(),
        patientProfile: undefined
      }

      usersDb.push(newUser)
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb))

      const userData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        location: newUser.location,
        patientProfile: newUser.patientProfile
      }
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    },
    []
  )

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return

    // Update session
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))

    // Update "DB"
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]")
    const updatedDb = usersDb.map((u: any) =>
      u.uid === user.uid ? { ...u, ...data } : u
    )
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedDb))
  }, [user])

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!user) return

    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]")
    const updatedDb = usersDb.map((u: any) =>
      u.uid === user.uid ? { ...u, password: newPassword } : u
    )
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedDb))
  }, [user])

  const handleSignOut = useCallback(async () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    router.push("/login")
  }, [router])

  const handleUnauthorized = useCallback(async () => {
    console.warn("[v0] Unauthorized access detected (401). Auto-logging out...")
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.setItem("logout_reason", "Session expired")
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        signIn, 
        signUp, 
        updateProfile, 
        updatePassword, 
        signOut: handleSignOut,
        handleUnauthorized 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
