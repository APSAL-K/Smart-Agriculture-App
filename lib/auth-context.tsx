"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    async function initAuth() {
      try {
        const { auth } = await import("@/lib/firebase")
        if (!auth) {
          setLoading(false)
          return
        }
        const { onAuthStateChanged } = await import("firebase/auth")
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser)
          setLoading(false)
        })
      } catch {
        setLoading(false)
      }
    }

    initAuth()
    return () => unsubscribe?.()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { auth } = await import("@/lib/firebase")
    if (!auth) throw new Error("Firebase not configured")
    const { signInWithEmailAndPassword } = await import("firebase/auth")
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const { auth, database } = await import("@/lib/firebase")
    if (!auth || !database) throw new Error("Firebase not configured")
    const { createUserWithEmailAndPassword, updateProfile } = await import(
      "firebase/auth"
    )
    const { ref, set } = await import("firebase/database")
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    await updateProfile(credential.user, { displayName })
    await set(ref(database, `users/${credential.user.uid}`), {
      displayName,
      email,
      createdAt: new Date().toISOString(),
      role: "farmer",
    })
  }

  const signOut = async () => {
    const { auth } = await import("@/lib/firebase")
    if (!auth) throw new Error("Firebase not configured")
    const { signOut: firebaseSignOut } = await import("firebase/auth")
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
