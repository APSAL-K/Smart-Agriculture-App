import { ApiKeys } from './store/settings-slice'
import { FarmInfo, MarketPrice, WeatherForecast, ExtremeWeatherAlert } from './types'

// Simple session-level cache
let aiDataCache: {
    market: MarketPrice[] | null;
    weather: { forecast: WeatherForecast[], alerts: ExtremeWeatherAlert[] } | null;
    timestamp: number;
} | null = null;

let fetchingPromise: Promise<void> | null = null;

const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes session cache

async function fetchAiConsolidatedData(
    apiKeys: ApiKeys,
    farmInfo?: FarmInfo
): Promise<void> {
    if (!apiKeys.gemini) return;

    // If already fetching, wait for that fetch to complete
    if (fetchingPromise) {
        return fetchingPromise;
    }

    // Check if cache is still valid
    if (aiDataCache && (Date.now() - aiDataCache.timestamp < CACHE_DURATION)) {
        return;
    }

    fetchingPromise = (async () => {
        const prompt = `
        Role: Expert Agricultural Analyst and Meteorologist.
        Task: Generate scientific and realistic market and weather data for the region of ${farmInfo?.region || "South India"}.
        
        REQUIRED DATA:
        1. MARKET: Current prices for Paddy, Tomato, Onion, Wheat, Sugarcane, Cotton.
        2. WEATHER: 7-day forecast and any extreme alerts (storm, heatwave, drought).
        
        FORMAT: Return ONLY a valid JSON object with this exact structure:
        {
            "market": [
                { "id": "string", "cropName": "string", "marketName": "string", "currentPrice": number, "unit": "Quintal", "change": number, "trend": "up"|"down"|"stable", "lastUpdated": number }
            ],
            "weather": {
                "forecast": [
                    { "date": "string", "high": number, "low": number, "condition": "string", "precipitation": number }
                ],
                "alerts": [
                    { "id": "string", "type": "string", "severity": "info"|"warning"|"critical", "message": "string", "timestamp": number, "expectedStart": number }
                ]
            }
        }
        `;

        try {
            console.log("Gemini API: Triggering ONE consolidated fetch for Market & Weather...");
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKeys.gemini}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            })

            const result = await response.json()
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || ""
            const jsonMatch = text.match(/\{[\s\S]*\}/)

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                aiDataCache = {
                    market: parsed.market || null,
                    weather: parsed.weather || null,
                    timestamp: Date.now()
                };
            }
        } catch (error) {
            console.error("AI Consolidated Data Error:", error);
        } finally {
            fetchingPromise = null;
        }
    })();

    return fetchingPromise;
}

export async function fetchAiMarketData(
    apiKeys: ApiKeys,
    farmInfo?: FarmInfo
): Promise<MarketPrice[] | null> {
    if (!apiKeys.gemini) return null;

    if (!aiDataCache || (Date.now() - aiDataCache.timestamp > CACHE_DURATION)) {
        await fetchAiConsolidatedData(apiKeys, farmInfo);
    }

    return aiDataCache?.market || null;
}

export async function fetchAiWeatherData(
    apiKeys: ApiKeys,
    farmInfo?: FarmInfo
): Promise<{ forecast: WeatherForecast[], alerts: ExtremeWeatherAlert[] } | null> {
    if (!apiKeys.gemini) return null;

    if (!aiDataCache || (Date.now() - aiDataCache.timestamp > CACHE_DURATION)) {
        await fetchAiConsolidatedData(apiKeys, farmInfo);
    }

    return aiDataCache?.weather || null;
}
