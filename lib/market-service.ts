import type { MarketPrice, PriceTrend, FarmInfo } from "./types"
import { ApiKeys } from "./store/settings-slice"
import { fetchAiMarketData } from "./ai-data-service"

const CROPS = ["Paddy", "Tomato", "Onion", "Wheat", "Sugarcane", "Cotton"]
const MARKETS = ["Chennai Central", "Madurai Mandi", "Salem Market", "Coimbatore Hub"]

export async function getMarketPrices(apiKeys?: ApiKeys, farmInfo?: FarmInfo): Promise<MarketPrice[]> {
    if (apiKeys?.gemini) {
        const aiData = await fetchAiMarketData(apiKeys, farmInfo)
        if (aiData) return aiData
    }

    // Fallback to mock data
    return CROPS.flatMap((crop, i) =>
        MARKETS.slice(0, 2).map((market, j) => {
            const basePrice = 2000 + i * 500 + j * 100
            const change = (Math.random() * 10 - 5)
            return {
                id: `${crop}-${market}`.toLowerCase().replace(/ /g, "-"),
                cropName: crop,
                marketName: market,
                currentPrice: Math.round(basePrice + (basePrice * change / 100)),
                unit: "Quintal",
                change: Number(change.toFixed(1)),
                trend: change > 0.5 ? "up" : change < -0.5 ? "down" : "stable",
                lastUpdated: Date.now()
            }
        })
    )
}

export function getHistoricalTrends(cropName: string): PriceTrend[] {
    const trends: PriceTrend[] = []
    const now = new Date()
    const basePrice = 2000 + CROPS.indexOf(cropName) * 500

    for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        trends.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: Math.round(basePrice + (Math.random() * 400 - 200))
        })
    }

    return trends
}
