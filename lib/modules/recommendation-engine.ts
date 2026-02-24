import { SensorReading, IrrigationRecommendation } from "../types"
import { getRecommendations as getBaseRecommendations } from "../recommendations"
import { generateAiRecommendation } from "../ai-service"
import { ApiKeys } from "../store/settings-slice"

export async function getSmartRecommendations(
    latestReading: SensorReading | null,
    apiKeys: ApiKeys
): Promise<{
    base: IrrigationRecommendation[],
    ai: string | null
}> {
    if (!latestReading) return { base: [], ai: null }

    const base = getBaseRecommendations(latestReading)
    const ai = await generateAiRecommendation(latestReading, apiKeys)

    return { base, ai }
}
