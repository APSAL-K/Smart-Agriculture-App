import { ApiKeys } from './store/settings-slice'
import { SensorReading, FarmInfo, ChatMessage } from './types'

export async function generateAiRecommendation(
    reading: SensorReading,
    apiKeys: ApiKeys,
    farmInfo?: FarmInfo,
    provider: 'Gemini' | 'OpenRouter' | 'Cohere' = 'Cohere'
): Promise<string | null> {
    const prompt = `
    Context: Premium Smart Agriculture System.
    Role: Expert Agronomist & AI Advisor.
    
    FARM PROFILE:
    - Crop: ${farmInfo?.cropType || "General Crops"}
    - Soil: ${farmInfo?.soilType || "Unknown"}
    - System: ${farmInfo?.irrigationMethod || "Standard"}
    - Region: ${farmInfo?.region || "N/A"}
    - Season: ${farmInfo?.season || "N/A"}
    - Size: ${farmInfo?.farmSize || "Standard plot"}
    - Automation: ${farmInfo?.automationLevel || "manual"}

    REAL-TIME SENSOR DATA:
    - Soil Moisture: ${reading.soilMoisture.toFixed(1)}%
    - Air Temperature: ${reading.temperature.toFixed(1)}°C
    - Air Humidity: ${reading.humidity.toFixed(1)}%
    ${reading.weather ? `
    WEATHER FORECAST:
    - Outside Temp: ${reading.weather.temp}°C
    - Condition: ${reading.weather.condition}
    - Wind: ${reading.weather.windSpeed} km/h
    ` : ''}

    Objective: Provide a highly accurate, data-driven irrigation and crop management recommendation.
    
    Rules:
    1. Maximum 2-3 high-impact sentences.
    2. If moisture is below 20%, start with "URGENT IRRIGATION REQUIRED".
    3. Reference the specific crop type if known.
    4. Provide specific guidance (e.g., "Irrigate for 20 minutes" or "Delay watering due to humidity").
    `

    let endpoint = ''
    let headers: Record<string, string> = { 'Content-Type': 'application/json' }
    let body = {}

    try {
        switch (provider) {
            case 'Gemini':
                if (!apiKeys.gemini) return "Please set your Gemini API key in settings."
                endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKeys.gemini}`
                body = { contents: [{ parts: [{ text: prompt }] }] }
                break
            case 'OpenRouter':
                if (!apiKeys.openRouter) return "Please set your OpenRouter API key in settings."
                endpoint = 'https://openrouter.ai/api/v1/chat/completions'
                headers['Authorization'] = `Bearer ${apiKeys.openRouter}`
                body = {
                    model: 'google/gemini-flash-1.5',
                    messages: [{ role: 'user', content: prompt }]
                }
                break
            case 'Cohere':
                if (!apiKeys.cohere) return "Please set your Cohere API key in settings."
                endpoint = 'https://api.cohere.com/v1/chat'
                headers['Authorization'] = `Bearer ${apiKeys.cohere}`
                body = {
                    model: 'command-a-03-2025',
                    message: prompt
                }
                break
            default:
                return null
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })

        const result = await response.json()

        if (provider === 'Gemini') return result.candidates?.[0]?.content?.parts?.[0]?.text || null
        if (provider === 'OpenRouter') return result.choices?.[0]?.message?.content || null
        if (provider === 'Cohere') return result.text || null

        return null
    } catch (error) {
        console.error(`AI Recommendation Error (${provider}):`, error)
        return "AI Service temporarily unavailable. Please check your network or API keys."
    }
}
export async function generateAiChatResponse(
    query: string,
    history: ChatMessage[],
    reading: SensorReading,
    apiKeys: ApiKeys,
    farmInfo?: FarmInfo,
    provider: 'Gemini' | 'OpenRouter' | 'Cohere' = 'Gemini'
): Promise<string | null> {
    const contextPrompt = `
    As an AI Agricultural Advisor, answer the user's manual query based on the following REAL-TIME context:
    
    FARM PROFILE:
    - Crop: ${farmInfo?.cropType || "General Crops"}
    - Soil: ${farmInfo?.soilType || "Unknown"}
    - System: ${farmInfo?.irrigationMethod || "Standard"}
    - Location Info: ${farmInfo?.farmSize ? `${farmInfo.farmSize} acres` : "Standard plot"}

    SENSOR DATA:
    - Soil Moisture: ${reading.soilMoisture.toFixed(1)}%
    - Temp: ${reading.temperature.toFixed(1)}°C
    - Humidity: ${reading.humidity.toFixed(1)}%
    ${reading.weather ? `WEATHER: ${reading.weather.condition}, ${reading.weather.temp}°C` : ''}

    Rules:
    1. Be concise, professional, and empathetic.
    2. Reference the sensor data if relevant to the user's query.
    3. Use Markdown with clear headers for segments (e.g., ### Irrigation Management, ### Crop Sustainability).
    4. User Query: "${query}"
    `

    const messages = [
        ...history.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
        })),
        { role: 'user', content: contextPrompt }
    ]

    let endpoint = ''
    let headers: Record<string, string> = { 'Content-Type': 'application/json' }
    let body = {}

    try {
        switch (provider) {
            case 'Gemini':
                if (!apiKeys.gemini) return null
                endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKeys.gemini}`
                body = {
                    contents: messages.map(m => ({
                        role: m.role === 'user' ? 'user' : 'model',
                        parts: [{ text: m.content }]
                    }))
                }
                break
            case 'OpenRouter':
                if (!apiKeys.openRouter) return null
                endpoint = 'https://openrouter.ai/api/v1/chat/completions'
                headers['Authorization'] = `Bearer ${apiKeys.openRouter}`
                body = {
                    model: 'google/gemini-flash-1.5',
                    messages: messages
                }
                break
            case 'Cohere':
                if (!apiKeys.cohere) return null
                endpoint = 'https://api.cohere.com/v1/chat'
                headers['Authorization'] = `Bearer ${apiKeys.cohere}`
                body = {
                    model: 'command-a-03-2025',
                    message: query,
                    chat_history: messages.slice(0, -1).map(m => ({
                        role: m.role === 'user' ? 'USER' : 'CHATBOT',
                        message: m.content
                    })),
                    preamble: contextPrompt
                }
                break
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })

        const result = await response.json()

        if (provider === 'Gemini') return result.candidates?.[0]?.content?.parts?.[0]?.text || null
        if (provider === 'OpenRouter') return result.choices?.[0]?.message?.content || null
        if (provider === 'Cohere') return result.text || null

        return null
    } catch (error) {
        console.error(`AI Chat Error (${provider}):`, error)
        return null
    }
}
