"use client"

import { useEffect, useState, useCallback } from "react"
import { ref, onValue, push, query, orderByChild, limitToLast } from "firebase/database"
import { database } from "@/lib/firebase"
import { setSensorReadings, setAlerts, setIsDemo } from "@/lib/store"
import type { HealthReading, Alert, PatientProfile } from "@/lib/types"
import { generateDemoHealthData, generateLiveHealthReading } from "./modules/data-collection"
import { generateAlerts } from "./modules/alert-system"
import { toast } from "sonner"

export function useSensorData(userId: string | undefined, patientProfile?: PatientProfile) {
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
    if (!userId || !database) {
      const demoData = generateDemoHealthData()
      const demoAlerts = processAlerts(demoData)
      setReadings(demoData)
      _setAlerts(demoAlerts)
      _setIsDemo(true)

      setSensorReadings(demoData)
      setAlerts(demoAlerts)
      setIsDemo(true)

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

      setSensorReadings(data)
      setAlerts(newAlerts)

      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId, processAlerts])

  const addReading = useCallback(
    async (reading: Omit<HealthReading, "id" | "timestamp">) => {
      if (!userId || !database) return
      const readingsRef = ref(database, `healthData/${userId}`)
      await push(readingsRef, {
        ...reading,
        timestamp: Date.now(),
      })
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
