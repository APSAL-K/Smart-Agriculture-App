/**
 * Firebase Seed Script
 * 
 * This script generates sample sensor data and pushes it to your Firebase Realtime Database.
 * 
 * Prerequisites:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Authentication (Email/Password)
 * 3. Create a Realtime Database
 * 4. Set the following environment variables:
 *    - NEXT_PUBLIC_FIREBASE_API_KEY
 *    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *    - NEXT_PUBLIC_FIREBASE_DATABASE_URL
 *    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *    - NEXT_PUBLIC_FIREBASE_APP_ID
 * 
 * Firebase Realtime Database Rules (for development):
 * {
 *   "rules": {
 *     "users": {
 *       "$uid": {
 *         ".read": "$uid === auth.uid",
 *         ".write": "$uid === auth.uid"
 *       }
 *     },
 *     "sensorData": {
 *       "$uid": {
 *         ".read": "$uid === auth.uid",
 *         ".write": "$uid === auth.uid"
 *       }
 *     }
 *   }
 * }
 * 
 * Database Schema:
 * 
 * /users/{uid}
 *   - displayName: string
 *   - email: string
 *   - createdAt: string (ISO timestamp)
 *   - role: "farmer"
 *   - farmName?: string
 *   - location?: string
 * 
 * /sensorData/{uid}/{pushId}
 *   - soilMoisture: number (0-100, percentage)
 *   - temperature: number (°C)
 *   - humidity: number (0-100, percentage)
 *   - timestamp: number (Unix ms)
 *   - deviceId: string
 * 
 * Usage:
 *   node scripts/seed-firebase.js
 * 
 * Note: The app includes a built-in demo mode that works without Firebase.
 * You only need to run this script if you want to populate real Firebase data.
 */

console.log("=== AgroSense Firebase Database Schema ===")
console.log("")
console.log("Database Structure:")
console.log("-------------------")
console.log("")
console.log("/users/{uid}")
console.log("  displayName: string")
console.log("  email: string")
console.log("  createdAt: string (ISO)")
console.log("  role: 'farmer'")
console.log("  farmName?: string")
console.log("  location?: string")
console.log("")
console.log("/sensorData/{uid}/{pushId}")
console.log("  soilMoisture: number (0-100%)")
console.log("  temperature: number (°C)")
console.log("  humidity: number (0-100%)")
console.log("  timestamp: number (Unix ms)")
console.log("  deviceId: string")
console.log("")
console.log("=== Alert Thresholds ===")
console.log("Soil Moisture Critical: < 15%")
console.log("Soil Moisture Warning:  < 30%")
console.log("Temperature High:      > 40°C")
console.log("Humidity Low:          < 30%")
console.log("")
console.log("=== Recommendation Triggers ===")
console.log("Emergency Irrigation: moisture < 15%")
console.log("Schedule Irrigation:  moisture < 30%")
console.log("Reduce Watering:      moisture > 80%")
console.log("Heat Stress:          temperature > 38°C")
console.log("Increase Water:       temperature > 32°C")
console.log("Frost Risk:           temperature < 5°C")
console.log("Low Humidity:         humidity < 25%")
console.log("Disease Risk:         humidity > 85%")
console.log("")
console.log("=== Setup Instructions ===")
console.log("1. Go to https://console.firebase.google.com")
console.log("2. Create a new project")
console.log("3. Enable Email/Password Authentication")
console.log("4. Create a Realtime Database")
console.log("5. Add your Firebase config to environment variables")
console.log("6. The app works in demo mode without Firebase!")
