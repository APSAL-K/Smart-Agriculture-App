import type { SensorReading } from "../types"

export const MOISTURE_LOW_THRESHOLD = 30
export const MOISTURE_CRITICAL_THRESHOLD = 15
export const TEMP_HIGH_THRESHOLD = 40

export function generateDemoData(): SensorReading[] {
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
            weather: {
                temp: 20 + Math.random() * 10,
                humidity: 50 + Math.random() * 30,
                condition: Math.random() > 0.5 ? "Sunny" : "Partly Cloudy",
                windSpeed: 5 + Math.random() * 15,
            }
        })
    }
    return data
}

export function generateLiveReading(): SensorReading {
    return {
        id: `live-${Date.now()}`,
        soilMoisture: 25 + Math.random() * 50,
        temperature: 18 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        timestamp: Date.now(),
        deviceId: "sensor-01",
        weather: {
            temp: 20 + Math.random() * 10,
            humidity: 50 + Math.random() * 30,
            condition: Math.random() > 0.5 ? "Sunny" : "Partly Cloudy",
            windSpeed: 5 + Math.random() * 15,
        }
    }
}
