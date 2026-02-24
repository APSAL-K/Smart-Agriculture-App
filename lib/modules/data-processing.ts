import { SensorReading } from "../types"

export interface AgriculturalMetrics {
    averageMoisture: number
    averageTemp: number
    moistureTrend: "increasing" | "decreasing" | "stable"
}

export function processAgriculturalData(readings: SensorReading[]): AgriculturalMetrics {
    if (readings.length === 0) {
        return { averageMoisture: 0, averageTemp: 0, moistureTrend: "stable" }
    }

    const sumMoisture = readings.reduce((acc, r) => acc + r.soilMoisture, 0)
    const sumTemp = readings.reduce((acc, r) => acc + r.temperature, 0)

    const avgMoisture = sumMoisture / readings.length
    const avgTemp = sumTemp / readings.length

    let trend: "increasing" | "decreasing" | "stable" = "stable"
    if (readings.length >= 2) {
        const first = readings[0].soilMoisture
        const last = readings[readings.length - 1].soilMoisture
        if (last > first + 5) trend = "increasing"
        else if (last < first - 5) trend = "decreasing"
    }

    return {
        averageMoisture: avgMoisture,
        averageTemp: avgTemp,
        moistureTrend: trend
    }
}
