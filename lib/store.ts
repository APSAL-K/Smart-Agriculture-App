"use client"

import useSWR, { mutate } from "swr"
import type { HealthReading, Alert } from "@/lib/types"

// ─── SWR keys ───────────────────────────────────────────
const SENSOR_KEY = "livercare:health-readings"
const ALERTS_KEY = "livercare:alerts"
const DEMO_KEY = "livercare:is-demo"

// ─── Mutators (cache writes) ────────────────────────────
export function setSensorReadings(readings: HealthReading[]) {
  mutate(SENSOR_KEY, readings, { revalidate: false })
}

export function useSensorReadings() {
  const { data } = useSWR<HealthReading[]>(SENSOR_KEY, null, {
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
