"use client"

import { useEffect, useState, useCallback } from "react"
import { ref, onValue, push, query, orderByChild, limitToLast } from "firebase/database"
import { database } from "@/lib/firebase"
import { setSensorReadings, setAlerts, setIsDemo } from "@/lib/store"
import type { SensorReading, Alert } from "@/lib/types"

const MOISTURE_LOW_THRESHOLD = 30
const MOISTURE_CRITICAL_THRESHOLD = 15
const TEMP_HIGH_THRESHOLD = 40

function generateDemoData(): SensorReading[] {
  const now = Date.now()
  const data: SensorReading[] = []
  for (let i = 23; i >= 0; i--) {
    data.push({
      id: `demo-${i}`,
      soilMoisture: 25 + Math.random() * 50,
      temperature: 18 + Math.random() * 15,
      humidity: 40 + Math.random() * 40,
      timestamp: now - i * 3600000,
      deviceId: "sensor-01",
    })
  }
  return data
}

function generateAlerts(readings: SensorReading[]): Alert[] {
  const alerts: Alert[] = []
  const latest = readings[readings.length - 1]
  if (!latest) return alerts

  if (latest.soilMoisture < MOISTURE_CRITICAL_THRESHOLD) {
    alerts.push({
      id: `alert-moisture-critical-${latest.timestamp}`,
      type: "low_moisture",
      message: `Critical: Soil moisture at ${latest.soilMoisture.toFixed(1)}%. Immediate irrigation required.`,
      severity: "critical",
      timestamp: latest.timestamp,
      acknowledged: false,
      sensorReading: latest,
    })
  } else if (latest.soilMoisture < MOISTURE_LOW_THRESHOLD) {
    alerts.push({
      id: `alert-moisture-${latest.timestamp}`,
      type: "low_moisture",
      message: `Warning: Soil moisture at ${latest.soilMoisture.toFixed(1)}%. Consider irrigating soon.`,
      severity: "warning",
      timestamp: latest.timestamp,
      acknowledged: false,
      sensorReading: latest,
    })
  }

  if (latest.temperature > TEMP_HIGH_THRESHOLD) {
    alerts.push({
      id: `alert-temp-${latest.timestamp}`,
      type: "high_temperature",
      message: `High temperature detected: ${latest.temperature.toFixed(1)}°C. Increase watering frequency.`,
      severity: "warning",
      timestamp: latest.timestamp,
      acknowledged: false,
      sensorReading: latest,
    })
  }

  if (latest.humidity < 30) {
    alerts.push({
      id: `alert-humidity-${latest.timestamp}`,
      type: "low_humidity",
      message: `Low humidity: ${latest.humidity.toFixed(1)}%. Monitor crop stress levels.`,
      severity: "warning",
      timestamp: latest.timestamp,
      acknowledged: false,
      sensorReading: latest,
    })
  }

  return alerts
}

export function useSensorData(userId: string | undefined) {
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [alerts, _setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, _setIsDemo] = useState(false)

  useEffect(() => {
    if (!userId || !database) {
      const demoData = generateDemoData()
      setReadings(demoData)
      _setAlerts(generateAlerts(demoData))
      _setIsDemo(true)

      // Push into SWR cache
      setSensorReadings(demoData)
      setAlerts(generateAlerts(demoData))
      setIsDemo(true)

      setLoading(false)
      return
    }

    const readingsRef = query(
      ref(database, `sensorData/${userId}`),
      orderByChild("timestamp"),
      limitToLast(24)
    )

    const unsubscribe = onValue(readingsRef, (snapshot) => {
      const data: SensorReading[] = []
      snapshot.forEach((child) => {
        data.push({ id: child.key!, ...child.val() })
      })
      data.sort((a, b) => a.timestamp - b.timestamp)
      const newAlerts = generateAlerts(data)

      setReadings(data)
      _setAlerts(newAlerts)

      // Push into SWR cache
      setSensorReadings(data)
      setAlerts(newAlerts)

      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  const addReading = useCallback(
    async (reading: Omit<SensorReading, "id" | "timestamp">) => {
      if (!userId || !database) return
      const readingsRef = ref(database, `sensorData/${userId}`)
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
        const newReading: SensorReading = {
          id: `demo-live-${Date.now()}`,
          soilMoisture: 25 + Math.random() * 50,
          temperature: 18 + Math.random() * 15,
          humidity: 40 + Math.random() * 40,
          timestamp: Date.now(),
          deviceId: "sensor-01",
        }
        const updated = [...prev.slice(1), newReading]
        const newAlerts = generateAlerts(updated)
        _setAlerts(newAlerts)

        // Push into SWR cache
        setSensorReadings(updated)
        setAlerts(newAlerts)

        return updated
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [isDemo])

  return { readings, alerts, loading, addReading, isDemo }
}
