// Health Data for Liver Disease Prediction
export interface HealthMetrics {
  bilirubin: number // mg/dL
  alt: number // ALT/SGPT (Units/L)
  ast: number // AST/SGOT (Units/L)
  albumin: number // g/dL
  inr: number // INR ratio
  platelets: number // 10^9/L
  triglycerides: number // mg/dL
  glucose: number // mg/dL
  creatinine?: number // mg/dL
  alkalinePhosphatase?: number // Units/L
}

export interface HealthReading {
  id: string
  metrics: HealthMetrics
  timestamp: number
  labName?: string
  testId?: string
}

export interface Alert {
  id: string
  type: "high_bilirubin" | "high_enzymes" | "low_platelets" | "abnormal_inr" | "high_glucose" | "abnormal_albumin"
  message: string
  severity: "warning" | "critical" | "info"
  timestamp: number
  acknowledged: boolean
  healthReading: HealthReading
}

export interface HealthRecommendation {
  title: string
  description: string
  priority: "high" | "medium" | "low"
  action: string
  consultDoctor?: boolean
}

export interface PatientProfile {
  age: number
  gender: "male" | "female" | "other"
  medicalHistory: string[]
  allergies: string[]
  currentMedications: string[]
  alcoholConsumption: "none" | "mild" | "moderate" | "heavy"
  familyHistoryLiver: boolean
  riskFactors: string[]
  isOnboardingComplete?: boolean
  lastUpdated: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type PostType = "question" | "health_tip" | "recovery_story"

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
  isAnonymous?: boolean
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

export interface HealthcareService {
  id: string
  name: string
  type: "lab_test" | "consultation" | "prescription"
  provider: string
  currentPrice: number
  currency: string
  change: number
  trend: "up" | "down" | "stable"
  lastUpdated: number
}

export interface Doctor {
  id: string
  name: string
  specialization: string // e.g., "Hepatology", "Gastroenterology"
  qualifications: string[]
  experience: number
  hospital?: string
  rating: number
  totalReviews: number
  availableSlots: string[]
  consultationFee: number
  bio?: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  appointmentDate: number
  appointmentTime: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  reasonForVisit: string
  notes?: string
  prescriptionId?: string
}

export interface Consultation {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  consultationDate: number
  diagnosis?: string
  recommendations: string[]
  prescriptions?: string[]
  followUpDate?: number
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
  role: "patient" | "doctor" | "admin"
  patientProfile?: PatientProfile
  specialization?: string // For doctors: "hepatology", "gastroenterology", etc.
}
