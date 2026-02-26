export interface WeatherData {
  temp: number
  humidity: number
  condition: string
  windSpeed: number
}

export interface SensorReading {
  id: string
  soilMoisture: number
  temperature: number
  humidity: number
  timestamp: number
  deviceId: string
  weather?: WeatherData
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

export interface FarmInfo {
  cropType: string
  soilType: string
  farmSize: string
  irrigationMethod: string
  region?: string
  season?: string
  plantingDate?: number
  expectedHarvest?: number
  waterSource?: string
  fertilizerHistory?: string
  targetYield?: string
  automationLevel?: "manual" | "semi" | "full"
  isOnboardingComplete?: boolean
  lastUpdated: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type PostType = "question" | "success_story" | "farming_tip"

export interface CommunityComment {
  id: string
  authorId: string
  authorName: string
  content: string
  timestamp: number
}

export interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  type: PostType
  title: string
  content: string
  timestamp: number
  likes: string[] // Array of user IDs who liked
  comments?: CommunityComment[]
  farmInfo?: FarmInfo // Context of the farm that shared the post
}

export interface MarketPrice {
  id: string
  cropName: string
  marketName: string
  currentPrice: number
  unit: string
  change: number
  trend: "up" | "down" | "stable"
  lastUpdated: number
}

export interface PriceTrend {
  date: string
  price: number
}

export interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: string
  precipitation: number
}

export interface ExtremeWeatherAlert {
  id: string
  type: "storm" | "heatwave" | "drought" | "flood"
  severity: "info" | "warning" | "critical"
  message: string
  timestamp: number
  expectedStart: number
}

export interface UserProfile {
  displayName: string
  email: string
  createdAt: string
  role: "farmer" | "admin"
  farmInfo?: FarmInfo
}
