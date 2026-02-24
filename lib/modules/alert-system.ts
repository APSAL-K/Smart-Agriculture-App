import type { SensorReading, Alert, FarmInfo } from "../types"
import { MOISTURE_CRITICAL_THRESHOLD, MOISTURE_LOW_THRESHOLD, TEMP_HIGH_THRESHOLD } from "./data-collection"

export function generateAlerts(readings: SensorReading[], farmInfo?: FarmInfo): Alert[] {
    const alerts: Alert[] = []
    const latest = readings[readings.length - 1]

    // Add time-based alerts from farmInfo
    if (farmInfo?.expectedHarvest) {
        const daysToHarvest = Math.ceil((farmInfo.expectedHarvest - Date.now()) / (1000 * 60 * 60 * 24))
        if (daysToHarvest > 0 && daysToHarvest <= 7) {
            alerts.push({
                id: `alert-harvest-${Date.now()}`,
                type: "high_humidity", // Reusing type or extending
                message: `HARVEST APPROACHING: Your ${farmInfo.cropType} is expected to be ready for harvest in ${daysToHarvest} days.`,
                severity: "info",
                timestamp: Date.now(),
                acknowledged: false,
                sensorReading: latest || readings[0],
            })
        }
    }

    if (!latest) return alerts

    // Moisture alerts
    if (latest.soilMoisture < MOISTURE_CRITICAL_THRESHOLD) {
        alerts.push({
            id: `alert-moisture-critical-${latest.timestamp}`,
            type: "low_moisture",
            message: `CRITICAL: Soil moisture is at ${latest.soilMoisture.toFixed(1)}%. Immediate irrigation is necessary to prevent crop loss.`,
            severity: "critical",
            timestamp: latest.timestamp,
            acknowledged: false,
            sensorReading: latest,
        })
    } else if (latest.soilMoisture < MOISTURE_LOW_THRESHOLD) {
        alerts.push({
            id: `alert-moisture-${latest.timestamp}`,
            type: "low_moisture",
            message: `WARNING: Soil moisture levels are low (${latest.soilMoisture.toFixed(1)}%). Consider irrigation cycle soon.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            sensorReading: latest,
        })
    }

    // Temperature alerts
    if (latest.temperature > TEMP_HIGH_THRESHOLD) {
        alerts.push({
            id: `alert-temp-high-${latest.timestamp}`,
            type: "high_temperature",
            message: `DANGER: Extreme heat detected (${latest.temperature.toFixed(1)}°C). Risk of heat stress and rapid evapotranspiration.`,
            severity: "critical",
            timestamp: latest.timestamp,
            acknowledged: false,
            sensorReading: latest,
        })
    } else if (latest.temperature < 5) {
        alerts.push({
            id: `alert-temp-low-${latest.timestamp}`,
            type: "high_temperature",
            message: `FROST ALERT: Temperature dropped to ${latest.temperature.toFixed(1)}°C. Cover sensitive crops immediately.`,
            severity: "critical",
            timestamp: latest.timestamp,
            acknowledged: false,
            sensorReading: latest,
        })
    }

    // Humidity alerts
    if (latest.humidity < 30) {
        alerts.push({
            id: `alert-humidity-low-${latest.timestamp}`,
            type: "low_humidity",
            message: `LOW HUMIDITY: Air is very dry (${latest.humidity.toFixed(1)}%). Increase monitoring for pests like spider mites.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            sensorReading: latest,
        })
    } else if (latest.humidity > 90) {
        alerts.push({
            id: `alert-humidity-high-${latest.timestamp}`,
            type: "high_humidity",
            message: `HIGH HUMIDITY: Levels reached ${latest.humidity.toFixed(1)}%. High risk of fungal diseases and blight.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            sensorReading: latest,
        })
    }

    return alerts
}
