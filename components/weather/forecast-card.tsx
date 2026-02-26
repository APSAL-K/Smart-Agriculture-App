"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets } from "lucide-react"
import type { WeatherForecast } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ForecastCardProps {
    forecast: WeatherForecast
}

export function ForecastCard({ forecast }: ForecastCardProps) {
    const getIcon = (condition: string) => {
        const c = condition.toLowerCase()
        if (c.includes('rain')) return <CloudRain className="h-6 w-6 text-blue-400" />
        if (c.includes('cloud')) return <Cloud className="h-6 w-6 text-gray-400" />
        if (c.includes('storm')) return <CloudLightning className="h-6 w-6 text-yellow-400" />
        return <Sun className="h-6 w-6 text-orange-400" />
    }

    return (
        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-lg transition-transform hover:scale-105 group overflow-hidden h-full">
            <CardContent className="p-6 flex flex-col items-center justify-between gap-5 text-center h-full">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{forecast.date}</p>

                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative group/icon transition-transform hover:scale-110 duration-300">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-3.5 rounded-2xl bg-muted/40 border border-border/50 backdrop-blur-md shadow-inner">
                            {getIcon(forecast.condition)}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl font-black text-foreground tracking-tighter leading-none">{forecast.high}°</span>
                            <span className="text-sm font-black text-muted-foreground/30 leading-none">{forecast.low}°</span>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.15em]">{forecast.condition}</p>
                    </div>
                </div>

                <div className="w-full pt-4 border-t border-border/20 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-primary/80">
                        <Droplets className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-black leading-none">{forecast.precipitation}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
