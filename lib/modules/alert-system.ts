import type { HealthReading, Alert } from "../types"
import { BILIRUBIN_HIGH_THRESHOLD, ALT_HIGH_THRESHOLD, AST_HIGH_THRESHOLD, ALBUMIN_LOW_THRESHOLD, INR_HIGH_THRESHOLD, PLATELETS_LOW_THRESHOLD } from "./data-collection"

export function generateAlerts(readings: HealthReading[]): Alert[] {
    const alerts: Alert[] = []
    const latest = readings[readings.length - 1]

    if (!latest) return alerts

    const { metrics } = latest

    // Bilirubin alerts - elevated levels indicate liver dysfunction
    if (metrics.bilirubin > 2.0) {
        alerts.push({
            id: `alert-bilirubin-critical-${latest.timestamp}`,
            type: "high_bilirubin",
            message: `CRITICAL: Bilirubin level is very high (${metrics.bilirubin.toFixed(2)} mg/dL). CONSULT A DOCTOR IMMEDIATELY. Indicates severe liver dysfunction.`,
            severity: "critical",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    } else if (metrics.bilirubin > BILIRUBIN_HIGH_THRESHOLD) {
        alerts.push({
            id: `alert-bilirubin-${latest.timestamp}`,
            type: "high_bilirubin",
            message: `WARNING: Bilirubin is elevated (${metrics.bilirubin.toFixed(2)} mg/dL). Schedule a doctor consultation soon.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    }

    // ALT/AST alerts - enzyme elevation indicates liver damage
    if (metrics.alt > 100 || metrics.ast > 100) {
        alerts.push({
            id: `alert-enzymes-critical-${latest.timestamp}`,
            type: "high_enzymes",
            message: `CRITICAL: Liver enzymes are significantly elevated (ALT: ${metrics.alt.toFixed(0)}, AST: ${metrics.ast.toFixed(0)}). Possible liver injury. SEEK MEDICAL ATTENTION.`,
            severity: "critical",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    } else if (metrics.alt > ALT_HIGH_THRESHOLD || metrics.ast > AST_HIGH_THRESHOLD) {
        alerts.push({
            id: `alert-enzymes-${latest.timestamp}`,
            type: "high_enzymes",
            message: `WARNING: Liver enzymes are elevated (ALT: ${metrics.alt.toFixed(0)}, AST: ${metrics.ast.toFixed(0)}). Consider scheduling a doctor visit.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    }

    // Albumin alerts - low levels indicate impaired liver synthesis
    if (metrics.albumin < 2.5) {
        alerts.push({
            id: `alert-albumin-critical-${latest.timestamp}`,
            type: "abnormal_albumin",
            message: `CRITICAL: Albumin is critically low (${metrics.albumin.toFixed(2)} g/dL). Indicates severe liver dysfunction. URGENT: Consult doctor.`,
            severity: "critical",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    } else if (metrics.albumin < ALBUMIN_LOW_THRESHOLD) {
        alerts.push({
            id: `alert-albumin-${latest.timestamp}`,
            type: "abnormal_albumin",
            message: `WARNING: Albumin levels are low (${metrics.albumin.toFixed(2)} g/dL). May indicate liver function issues.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    }

    // INR alerts - elevated INR indicates coagulation impairment
    if (metrics.inr > 1.5) {
        alerts.push({
            id: `alert-inr-critical-${latest.timestamp}`,
            type: "abnormal_inr",
            message: `CRITICAL: INR is significantly elevated (${metrics.inr.toFixed(2)}). Bleeding risk increased. SEEK IMMEDIATE MEDICAL ATTENTION.`,
            severity: "critical",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    } else if (metrics.inr > INR_HIGH_THRESHOLD) {
        alerts.push({
            id: `alert-inr-${latest.timestamp}`,
            type: "abnormal_inr",
            message: `WARNING: INR is elevated (${metrics.inr.toFixed(2)}). Consult your doctor for evaluation.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    }

    // Platelet alerts - low platelets indicate potential portal hypertension
    if (metrics.platelets < 50) {
        alerts.push({
            id: `alert-platelets-critical-${latest.timestamp}`,
            type: "low_platelets",
            message: `CRITICAL: Platelet count is dangerously low (${metrics.platelets.toFixed(0)} 10^9/L). URGENT medical attention required.`,
            severity: "critical",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    } else if (metrics.platelets < PLATELETS_LOW_THRESHOLD) {
        alerts.push({
            id: `alert-platelets-${latest.timestamp}`,
            type: "low_platelets",
            message: `WARNING: Platelet count is low (${metrics.platelets.toFixed(0)} 10^9/L). May indicate liver disease progression.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    }

    // High glucose alerts
    if (metrics.glucose > 200) {
        alerts.push({
            id: `alert-glucose-critical-${latest.timestamp}`,
            type: "high_glucose",
            message: `WARNING: Glucose is very high (${metrics.glucose.toFixed(0)} mg/dL). Consider checking for diabetes complications.`,
            severity: "warning",
            timestamp: latest.timestamp,
            acknowledged: false,
            healthReading: latest,
        })
    }

    return alerts
}
