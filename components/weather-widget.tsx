"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Wind, Thermometer, CloudLightning } from "lucide-react"
import { useTranslation } from "@/lib/use-translation"
import type { WeatherData } from "@/lib/types"

interface WeatherWidgetProps {
    weather?: WeatherData
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
    const { t } = useTranslation()

    if (!weather) return null

    const getWeatherIcon = (condition: string) => {
        const c = condition.toLowerCase()
        if (c.includes('rain')) return <CloudRain className="h-10 w-10 text-blue-400" />
        if (c.includes('cloud')) return <Cloud className="h-10 w-10 text-gray-400" />
        if (c.includes('storm') || c.includes('lightning')) return <CloudLightning className="h-10 w-10 text-yellow-400" />
        return <Sun className="h-10 w-10 text-orange-400" />
    }

    // Farmer-specific tips based on weather
    const getFarmerTip = (w: WeatherData) => {
        if (w.temp > 35) return "Extreme heat: Check irrigation levels immediately."
        if (w.condition.toLowerCase().includes('rain')) return "Rain detected: Delay scheduled irrigation cycles."
        if (w.windSpeed > 20) return "High winds: Monitor tall crops for damage."
        return "Optimal conditions for outdoor farm activities."
    }

    return (
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/20 via-primary/5 to-background shadow-2xl transition-all hover:shadow-primary/10 group rounded-3xl w-full">
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px] transition-all group-hover:bg-primary/30" />

            <CardContent className="relative z-10 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:gap-5">
                    {/* Top row: icon + temp + wind */}
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
                            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-inner">
                                {getWeatherIcon(weather.condition)}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground leading-none">
                                    {Math.round(weather.temp)}°
                                </span>
                                <span className="text-base sm:text-xl font-medium text-muted-foreground uppercase tracking-widest truncate max-w-[120px] sm:max-w-none">
                                    {weather.condition}
                                </span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <span className="flex items-center gap-1.5 bg-background/40 px-2 py-1 rounded-lg whitespace-nowrap">
                                    <Wind className="h-4 w-4 text-primary shrink-0" />
                                    {weather.windSpeed} km/h
                                </span>
                                <span className="flex items-center gap-1.5 bg-background/40 px-2 py-1 rounded-lg whitespace-nowrap">
                                    <Thermometer className="h-4 w-4 text-primary shrink-0" />
                                    Feels {Math.round(weather.temp - 2)}°
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Farmer's Forecast — full width, always below weather info */}
                    <div className="w-full">
                        <div className="rounded-2xl bg-white/5 p-3 sm:p-4 backdrop-blur-md border border-white/10 shadow-sm transition-all hover:bg-white/10">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-2">
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Farmer's Forecast
                            </h4>
                            <p className="text-sm font-medium leading-relaxed text-foreground/90 break-words">
                                {getFarmerTip(weather)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
