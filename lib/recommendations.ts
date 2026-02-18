import type { SensorReading, IrrigationRecommendation } from "@/lib/types"

export function getRecommendations(
  latestReading: SensorReading | null
): IrrigationRecommendation[] {
  if (!latestReading) return []

  const recommendations: IrrigationRecommendation[] = []
  const { soilMoisture, temperature, humidity } = latestReading

  // Soil moisture recommendations
  if (soilMoisture < 15) {
    recommendations.push({
      title: "Emergency Irrigation Needed",
      description:
        "Soil moisture is critically low. Crops are at high risk of wilting and permanent damage.",
      priority: "high",
      action:
        "Start irrigation immediately. Apply 25-30mm of water over the next 2 hours. Check drip lines for blockages.",
    })
  } else if (soilMoisture < 30) {
    recommendations.push({
      title: "Schedule Irrigation Soon",
      description:
        "Soil moisture is below optimal levels. Crop growth may be affected if not addressed.",
      priority: "medium",
      action:
        "Plan irrigation within the next 6-12 hours. Apply 15-20mm of water. Consider mulching to retain moisture.",
    })
  } else if (soilMoisture > 80) {
    recommendations.push({
      title: "Reduce Watering",
      description:
        "Soil is oversaturated. Excess water can lead to root rot and nutrient leaching.",
      priority: "medium",
      action:
        "Pause irrigation for 24-48 hours. Check drainage systems. Monitor for signs of waterlogging.",
    })
  } else {
    recommendations.push({
      title: "Moisture Levels Optimal",
      description:
        "Current soil moisture is within the ideal range for most crops.",
      priority: "low",
      action:
        "Maintain current irrigation schedule. Next check recommended in 6 hours.",
    })
  }

  // Temperature-based recommendations
  if (temperature > 38) {
    recommendations.push({
      title: "Heat Stress Protection",
      description:
        "Extreme temperatures detected. Crops may experience heat stress, reducing yield.",
      priority: "high",
      action:
        "Increase watering frequency by 50%. Apply shade cloth if available. Water during early morning or late evening.",
    })
  } else if (temperature > 32) {
    recommendations.push({
      title: "Increase Watering in Heat",
      description:
        "High temperatures increase evapotranspiration rates.",
      priority: "medium",
      action:
        "Increase irrigation by 20-30%. Ensure evening watering to reduce daytime evaporation losses.",
    })
  } else if (temperature < 5) {
    recommendations.push({
      title: "Frost Risk Advisory",
      description:
        "Temperatures are near freezing. Risk of frost damage to sensitive crops.",
      priority: "high",
      action:
        "Cover sensitive crops with frost blankets. Avoid watering during freezing periods. Monitor overnight temperatures.",
    })
  }

  // Humidity-based recommendations
  if (humidity < 25) {
    recommendations.push({
      title: "Low Humidity Alert",
      description:
        "Dry air conditions accelerate water loss from leaves and soil.",
      priority: "medium",
      action:
        "Consider misting systems. Increase mulch layer to 3-4 inches. Schedule additional light irrigation cycles.",
    })
  } else if (humidity > 85) {
    recommendations.push({
      title: "High Humidity - Disease Risk",
      description:
        "High humidity promotes fungal growth and plant diseases.",
      priority: "medium",
      action:
        "Improve air circulation around crops. Reduce overhead watering. Scout for early signs of fungal infection.",
    })
  }

  return recommendations
}
