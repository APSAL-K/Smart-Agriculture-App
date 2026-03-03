'use client'

// Dynamic imports that only run on client
let _firebaseApp: any = null
let _firebaseAuth: any = null
let _firebaseDatabase: any = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

async function dynamicInitializeFirebase() {
  try {
    if (typeof window === "undefined") return null
    if (!firebaseConfig.apiKey) return null

    const { initializeApp, getApps } = await import("firebase/app")
    const apps = getApps()
    return apps.length === 0 ? initializeApp(firebaseConfig) : apps[0]
  } catch (error) {
    console.error("[v0] Firebase app init error:", error)
    return null
  }
}

async function getFirebaseAppInstance() {
  if (_firebaseApp === null && typeof window !== "undefined") {
    _firebaseApp = await dynamicInitializeFirebase()
  }
  return _firebaseApp
}

async function getFirebaseAuthInstance() {
  if (typeof window === "undefined") return null
  if (!_firebaseAuth) {
    const { getAuth } = await import("firebase/auth")
    const app = await getFirebaseAppInstance()
    _firebaseAuth = app ? getAuth(app) : null
  }
  return _firebaseAuth
}

async function getFirebaseDatabaseInstance() {
  if (typeof window === "undefined") return null
  if (!_firebaseDatabase) {
    const { getDatabase } = await import("firebase/database")
    const app = await getFirebaseAppInstance()
    _firebaseDatabase = app ? getDatabase(app) : null
  }
  return _firebaseDatabase
}

// Exports for backward compatibility
export const app = null
export const auth = null
export const database = null

// Export async initializers
export { getFirebaseAppInstance, getFirebaseAuthInstance, getFirebaseDatabaseInstance }

