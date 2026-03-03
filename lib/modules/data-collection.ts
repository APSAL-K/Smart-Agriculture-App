import type { HealthReading } from "../types"

// Liver disease health metric thresholds (normal ranges)
export const BILIRUBIN_HIGH_THRESHOLD = 1.2 // mg/dL
export const ALT_HIGH_THRESHOLD = 40 // Units/L
export const AST_HIGH_THRESHOLD = 40 // Units/L
export const ALBUMIN_LOW_THRESHOLD = 3.5 // g/dL
export const INR_HIGH_THRESHOLD = 1.1 // Ratio
export const PLATELETS_LOW_THRESHOLD = 150 // 10^9/L

export function generateDemoHealthData(): HealthReading[] {
    const now = Date.now()
    const data: HealthReading[] = []
    for (let i = 23; i >= 0; i--) {
        data.push({
            id: `demo-${i}`,
            metrics: {
                bilirubin: 0.5 + Math.random() * 1.5,
                alt: 20 + Math.random() * 50,
                ast: 20 + Math.random() * 50,
                albumin: 3.5 + Math.random() * 1.5,
                inr: 0.8 + Math.random() * 0.5,
                platelets: 150 + Math.random() * 250,
                triglycerides: 100 + Math.random() * 300,
                glucose: 80 + Math.random() * 80,
                creatinine: 0.7 + Math.random() * 0.5,
                alkalinePhosphatase: 44 + Math.random() * 50,
            },
            timestamp: now - i * 3600000,
            labName: "Lab Test " + (i + 1),
        })
    }
    return data
}

export function generateLiveHealthReading(): HealthReading {
    return {
        id: `live-${Date.now()}`,
        metrics: {
            bilirubin: 0.5 + Math.random() * 1.5,
            alt: 20 + Math.random() * 50,
            ast: 20 + Math.random() * 50,
            albumin: 3.5 + Math.random() * 1.5,
            inr: 0.8 + Math.random() * 0.5,
            platelets: 150 + Math.random() * 250,
            triglycerides: 100 + Math.random() * 300,
            glucose: 80 + Math.random() * 80,
            creatinine: 0.7 + Math.random() * 0.5,
            alkalinePhosphatase: 44 + Math.random() * 50,
        },
        timestamp: Date.now(),
        labName: "Latest Test",
    }
}
