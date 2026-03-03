'use client'

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getDatabase, type Database } from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

let _app: FirebaseApp | null | undefined
let _auth: Auth | null | undefined
let _database: Database | null | undefined

function initializeFirebaseApp(): FirebaseApp | null {
  if (_app !== undefined) return _app
  
  try {
    if (!firebaseConfig.apiKey) {
      _app = null
      return null
    }
    
    const apps = getApps()
    _app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0]
    return _app
  } catch (error) {
    console.error("[v0] Firebase init error:", error)
    _app = null
    return null
  }
}

function getFirebaseAuth(): Auth | null {
  if (_auth !== undefined) return _auth
  
  try {
    const app = initializeFirebaseApp()
    _auth = app ? getAuth(app) : null
    return _auth
  } catch (error) {
    console.error("[v0] Firebase Auth error:", error)
    _auth = null
    return null
  }
}

function getFirebaseDatabase(): Database | null {
  if (_database !== undefined) return _database
  
  try {
    const app = initializeFirebaseApp()
    _database = app ? getDatabase(app) : null
    return _database
  } catch (error) {
    console.error("[v0] Firebase Database error:", error)
    _database = null
    return null
  }
}

// Lazy getters to prevent initialization until accessed
export const app: FirebaseApp | null = null
export const auth: Auth | null = null
export const database: Database | null = null

// Export lazy initialization functions
export { initializeFirebaseApp, getFirebaseAuth, getFirebaseDatabase }
