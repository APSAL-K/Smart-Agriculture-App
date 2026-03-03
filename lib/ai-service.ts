import { ApiKeys } from './store/settings-slice'
import { HealthReading, PatientProfile, ChatMessage } from './types'

export async function generateLiverDiseaseAssessment(
    reading: HealthReading,
    apiKeys: ApiKeys,
    patientProfile?: PatientProfile,
    provider: 'Gemini' | 'OpenRouter' | 'Cohere' = 'Cohere'
): Promise<string | null> {
    const prompt = `
    Context: AI-Powered Liver Disease Prediction & Assessment System.
    Role: Medical AI Advisor specializing in Hepatology.
    
    PATIENT PROFILE:
    - Age: ${patientProfile?.age || "Unknown"}
    - Gender: ${patientProfile?.gender || "Unknown"}
    - Alcohol Consumption: ${patientProfile?.alcoholConsumption || "Unknown"}
    - Family History of Liver Disease: ${patientProfile?.familyHistoryLiver ? "Yes" : "No"}
    - Medical History: ${patientProfile?.medicalHistory?.join(", ") || "None reported"}
    - Risk Factors: ${patientProfile?.riskFactors?.join(", ") || "None reported"}

    LATEST LAB TEST RESULTS:
    - Bilirubin: ${reading.metrics.bilirubin.toFixed(2)} mg/dL (Normal: <1.2)
    - ALT (SGPT): ${reading.metrics.alt.toFixed(0)} Units/L (Normal: <40)
    - AST (SGOT): ${reading.metrics.ast.toFixed(0)} Units/L (Normal: <40)
    - Albumin: ${reading.metrics.albumin.toFixed(2)} g/dL (Normal: 3.5-5.0)
    - INR: ${reading.metrics.inr.toFixed(2)} (Normal: 0.8-1.1)
    - Platelets: ${reading.metrics.platelets.toFixed(0)} 10^9/L (Normal: 150-400)
    - Triglycerides: ${reading.metrics.triglycerides.toFixed(0)} mg/dL (Normal: <150)
    - Glucose: ${reading.metrics.glucose.toFixed(0)} mg/dL (Normal: 70-100 fasting)

    Objective: Provide a comprehensive liver disease risk assessment based on lab values and clinical profile.
    
    Rules:
    1. Analyze FIB-4 and APRI scores for liver fibrosis risk.
    2. Maximum 3-4 professional sentences with clinical recommendations.
    3. If multiple values are abnormal, flag as "REQUIRES DOCTOR CONSULTATION".
    4. Suggest lifestyle modifications and dietary changes when appropriate.
    5. Recommend follow-up tests if needed.
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
        console.error(`AI Assessment Error (${provider}):`, error)
        return "AI Service temporarily unavailable. Please check your network or API keys."
    }
}
export async function generateMedicalChatResponse(
    query: string,
    history: ChatMessage[],
    reading: HealthReading,
    apiKeys: ApiKeys,
    patientProfile?: PatientProfile,
    provider: 'Gemini' | 'OpenRouter' | 'Cohere' = 'Gemini'
): Promise<string | null> {
    const contextPrompt = `
    As a Medical AI Assistant specializing in Liver Health, answer the user's question based on the following context:
    
    PATIENT PROFILE:
    - Age: ${patientProfile?.age || "Unknown"}
    - Gender: ${patientProfile?.gender || "Unknown"}
    - Medical History: ${patientProfile?.medicalHistory?.join(", ") || "None reported"}
    - Current Medications: ${patientProfile?.currentMedications?.join(", ") || "None reported"}
    - Allergies: ${patientProfile?.allergies?.join(", ") || "None reported"}

    RECENT LAB VALUES:
    - Bilirubin: ${reading.metrics.bilirubin.toFixed(2)} mg/dL
    - ALT: ${reading.metrics.alt.toFixed(0)} Units/L
    - AST: ${reading.metrics.ast.toFixed(0)} Units/L
    - Albumin: ${reading.metrics.albumin.toFixed(2)} g/dL
    - INR: ${reading.metrics.inr.toFixed(2)}
    - Platelets: ${reading.metrics.platelets.toFixed(0)} 10^9/L

    Rules:
    1. Be professional, empathetic, and evidence-based.
    2. Reference lab values if relevant to the query.
    3. Use Markdown formatting for clarity (headers, bullet points).
    4. ALWAYS suggest consulting with a doctor for medical decisions.
    5. Disclaimer: This is supplementary guidance, not a diagnosis.
    6. User Query: "${query}"
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
        console.error(`Medical Chat Error (${provider}):`, error)
        return null
    }
}
