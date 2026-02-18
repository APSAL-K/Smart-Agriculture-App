"use client"

import useSWR, { mutate } from "swr"
import type { SensorReading, Alert } from "@/lib/types"

// ─── SWR keys ───────────────────────────────────────────
const SENSOR_KEY = "agrosense:sensor-readings"
const ALERTS_KEY = "agrosense:alerts"
const DEMO_KEY = "agrosense:is-demo"

// ─── Mutators (cache writes) ────────────────────────────
export function setSensorReadings(readings: SensorReading[]) {
  mutate(SENSOR_KEY, readings, { revalidate: false })
}

export function setAlerts(alerts: Alert[]) {
  mutate(ALERTS_KEY, alerts, { revalidate: false })
}

export function setIsDemo(val: boolean) {
  mutate(DEMO_KEY, val, { revalidate: false })
}

// ─── Hooks (cache reads) ────────────────────────────────
export function useSensorReadings() {
  const { data } = useSWR<SensorReading[]>(SENSOR_KEY, null, {
    fallbackData: [],
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  return data ?? []
}

export function useAlerts() {
  const { data } = useSWR<Alert[]>(ALERTS_KEY, null, {
    fallbackData: [],
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  return data ?? []
}

export function useIsDemo() {
  const { data } = useSWR<boolean>(DEMO_KEY, null, {
    fallbackData: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  return data ?? false
}
