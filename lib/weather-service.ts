import type { WeatherForecast, ExtremeWeatherAlert, FarmInfo } from "./types"
import { ApiKeys } from "./store/settings-slice"
import { fetchAiWeatherData } from "./ai-data-service"

export async function getWeeklyForecast(apiKeys?: ApiKeys, farmInfo?: FarmInfo): Promise<WeatherForecast[]> {
    if (apiKeys?.gemini) {
        const aiData = await fetchAiWeatherData(apiKeys, farmInfo)
        if (aiData?.forecast) return aiData.forecast
    }
    const forecast: WeatherForecast[] = []
    const now = new Date()
    const conditions = ["Sunny", "Partly Cloudy", "Showers", "Clear", "Overcast"]

    for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() + i)
        forecast.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            high: Math.round(28 + Math.random() * 8),
            low: Math.round(18 + Math.random() * 5),
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            precipitation: Math.floor(Math.random() * 40)
        })
    }
    return forecast
}

export async function getWeatherAlerts(apiKeys?: ApiKeys, farmInfo?: FarmInfo): Promise<ExtremeWeatherAlert[]> {
    if (apiKeys?.gemini) {
        const aiData = await fetchAiWeatherData(apiKeys, farmInfo)
        if (aiData?.alerts) return aiData.alerts
    }
    const now = Date.now()
    const alerts: ExtremeWeatherAlert[] = [
        {
            id: "alert-1",
            type: "heatwave",
            severity: "warning",
            message: "Extreme heatwave expected over the next 48 hours. Ensure adequate irrigation for sensitive crops.",
            timestamp: now,
            expectedStart: now + 3600000 * 6
        },
        {
            id: "alert-2",
            type: "storm",
            severity: "critical",
            message: "Strong thunderstorms approaching from the West. Secure loose farm equipment and monitor drainage.",
            timestamp: now,
            expectedStart: now + 3600000 * 24
        }
    ]
    return alerts
}

export function getExtremeWeatherAdvice(alert: ExtremeWeatherAlert): string {
    switch (alert.type) {
        case "storm":
            return "Ensure all greenhouses are secured. Clear drainage channels to prevent waterlogging. Delay any planned fertilizer applications."
        case "heatwave":
            return "Increase irrigation frequency. Apply mulch if possible to retain soil moisture. Avoid transplanting young seedlings during peak hours."
        case "flood":
            return "Relocate livestock to higher ground. Turn off automated electrical irrigation systems. Monitor soil erosion risk areas."
        case "drought":
            return "Prioritize water-intensive crops. Use drip irrigation during early morning or late evening. Consider minimal tillage to preserve soil structure."
        default:
            return "Monitor local weather stations for updates and follow standard safety protocols."
    }
}
