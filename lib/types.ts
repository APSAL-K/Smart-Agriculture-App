export interface SensorReading {
  id: string
  soilMoisture: number
  temperature: number
  humidity: number
  timestamp: number
  deviceId: string
}

export interface Alert {
  id: string
  type: "low_moisture" | "high_temperature" | "low_humidity" | "high_humidity"
  message: string
  severity: "warning" | "critical" | "info"
  timestamp: number
  acknowledged: boolean
  sensorReading: SensorReading
}

export interface IrrigationRecommendation {
  title: string
  description: string
  priority: "high" | "medium" | "low"
  action: string
}

export interface UserProfile {
  displayName: string
  email: string
  createdAt: string
  role: "farmer" | "admin"
}
