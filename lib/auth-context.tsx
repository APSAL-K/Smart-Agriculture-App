"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth"
import { ref, set } from "firebase/database"
import { auth, database } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured. Please add your Firebase environment variables.")
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!auth || !database)
        throw new Error("Firebase not configured. Please add your Firebase environment variables.")
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName })
      await set(ref(database, `users/${credential.user.uid}`), {
        displayName,
        email,
        createdAt: new Date().toISOString(),
        role: "farmer",
      })
    },
    []
  )

  const handleSignOut = useCallback(async () => {
    if (!auth) throw new Error("Firebase not configured.")
    await firebaseSignOut(auth)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut: handleSignOut }}
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
