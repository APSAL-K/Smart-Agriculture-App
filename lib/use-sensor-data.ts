"use client"

import { useEffect, useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { setSensorReadings, setAlerts, setIsDemo } from "@/lib/store/sensor-slice"
import type { HealthReading, Alert, PatientProfile } from "@/lib/types"
import { generateDemoHealthData, generateLiveHealthReading } from "./modules/data-collection"
import { generateAlerts } from "./modules/alert-system"
import { toast } from "sonner"

export function useSensorData(userId: string | undefined, patientProfile?: PatientProfile) {
  const dispatch = useDispatch()
  const [readings, setReadings] = useState<HealthReading[]>([])
  const [alerts, _setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, _setIsDemo] = useState(false)

  // Track seen IDs to prevent duplicate toasts
  const [seenAlertIds, setSeenAlertIds] = useState<Set<string>>(new Set())

  const processAlerts = useCallback((newReadings: HealthReading[]) => {
    const generatedAlerts = generateAlerts(newReadings)

    // Check for new critical alerts to push
    generatedAlerts.forEach(alert => {
      if (alert.severity === 'critical' && !seenAlertIds.has(alert.id)) {
        toast.error(`HEALTH ALERT: ${alert.message}`, {
          duration: 10000,
          position: "top-right"
        })
        setSeenAlertIds(prev => new Set(prev).add(alert.id))
      }
    })

    return generatedAlerts
  }, [seenAlertIds])

  useEffect(() => {
    if (!userId) {
      const demoData = generateDemoHealthData()
      const demoAlerts = processAlerts(demoData)
      setReadings(demoData)
      _setAlerts(demoAlerts)
      _setIsDemo(true)
      dispatch(setSensorReadings(demoData))
      dispatch(setAlerts(demoAlerts))
      dispatch(setIsDemo(true))
      setLoading(false)
      return
    }

    // Load Firebase dynamically only on client
    const loadFirebaseAndSubscribe = async () => {
      try {
        const { ref, onValue, query, orderByChild, limitToLast } = await import("firebase/database")
        const { getFirebaseDatabaseInstance } = await import("@/lib/firebase")
        const database = await getFirebaseDatabaseInstance()

        if (!database) {
          // Demo mode if Firebase not available
          const demoData = generateDemoHealthData()
          const demoAlerts = processAlerts(demoData)
          setReadings(demoData)
          _setAlerts(demoAlerts)
          _setIsDemo(true)
          dispatch(setSensorReadings(demoData))
          dispatch(setAlerts(demoAlerts))
          dispatch(setIsDemo(true))
          setLoading(false)
          return
        }

        const readingsRef = query(
          ref(database, `healthData/${userId}`),
          orderByChild("timestamp"),
          limitToLast(24)
        )

        const unsubscribe = onValue(readingsRef, (snapshot) => {
          const data: HealthReading[] = []
          snapshot.forEach((child) => {
            data.push({ id: child.key!, ...child.val() })
          })
          data.sort((a, b) => a.timestamp - b.timestamp)
          const newAlerts = processAlerts(data)

          setReadings(data)
          _setAlerts(newAlerts)
          dispatch(setSensorReadings(data))
          dispatch(setAlerts(newAlerts))
          setLoading(false)
        })

        return unsubscribe
      } catch (error) {
        console.error("[v0] Error loading Firebase sensor data:", error)
        const demoData = generateDemoHealthData()
        const demoAlerts = processAlerts(demoData)
        setReadings(demoData)
        _setAlerts(demoAlerts)
        _setIsDemo(true)
        dispatch(setSensorReadings(demoData))
        dispatch(setAlerts(demoAlerts))
        dispatch(setIsDemo(true))
        setLoading(false)
      }
    }

    let unsubscribe: (() => void) | undefined
    loadFirebaseAndSubscribe().then((unsub) => {
      unsubscribe = unsub
    })

    return () => unsubscribe?.()
  }, [userId, processAlerts, dispatch])

  const addReading = useCallback(
    async (reading: Omit<HealthReading, "id" | "timestamp">) => {
      if (!userId) return
      try {
        const { ref, push } = await import("firebase/database")
        const { getFirebaseDatabaseInstance } = await import("@/lib/firebase")
        const database = await getFirebaseDatabaseInstance()
        
        if (!database) return
        const readingsRef = ref(database, `healthData/${userId}`)
        await push(readingsRef, {
          ...reading,
          timestamp: Date.now(),
        })
      } catch (error) {
        console.error("[v0] Error adding reading:", error)
      }
    },
    [userId]
  )

  // Simulate real-time updates in demo mode
  useEffect(() => {
    if (!isDemo) return
    const interval = setInterval(() => {
      setReadings((prev) => {
        const newReading = generateLiveHealthReading()
        const updated = [...prev.slice(1), newReading]
        const newAlerts = generateAlerts(updated)
        _setAlerts(newAlerts)

        // Push into store
        setSensorReadings(updated)
        setAlerts(newAlerts)

        return updated
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [isDemo])

  return { readings, alerts, loading, addReading, isDemo, latestWeather: null }
}
