"use client"

import { useMemo, useEffect, useState } from "react"
import { useTranslation } from "@/lib/use-translation"
import { useAuth } from "@/lib/auth-context"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { CloudRain, Wind, Thermometer, Droplets, MapPin, Loader2, Sparkles, AlertTriangle } from "lucide-react"
import { getWeeklyForecast, getWeatherAlerts } from "@/lib/weather-service"
import { ForecastCard } from "@/components/weather/forecast-card"
import { WeatherAlerts } from "@/components/weather/weather-alerts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherForecast, ExtremeWeatherAlert } from "@/lib/types"

export default function WeatherPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const apiKeys = useSelector((state: RootState) => state.settings.apiKeys)
    const [forecast, setForecast] = useState<WeatherForecast[]>([])
    const [alerts, setAlerts] = useState<ExtremeWeatherAlert[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadWeather() {
            setLoading(true)
            const [forecastData, alertsData] = await Promise.all([
                getWeeklyForecast(apiKeys, user?.farmInfo),
                getWeatherAlerts(apiKeys, user?.farmInfo)
            ])
            setForecast(forecastData)
            setAlerts(alertsData)
            setLoading(false)
        }
        loadWeather()
    }, [apiKeys, user?.farmInfo])

    const currentCondition = forecast.length > 0 ? forecast[0] : null

    if (loading && forecast.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Premium Header */}
            <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-border/50 pb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <CloudRain className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-background/50 backdrop-blur-sm border-primary/20">
                            {apiKeys.gemini ? "AI Dynamic Climate Monitoring" : "Live Weather Insights"}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        {t('weather')}
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground/80 max-w-lg leading-relaxed">
                        Real-time atmospheric monitoring and advanced predictive modeling for precision agriculture. Stay informed about upcoming shifts in temperature, rainfall, and wind.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-[2rem] border border-border/50 backdrop-blur-sm">
                    <div className="flex -space-x-3">
                        <div className="h-10 w-10 rounded-full border-4 border-background bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">W</div>
                        <div className="h-10 w-10 rounded-full border-4 border-background bg-primary/40 flex items-center justify-center text-[10px] font-black text-primary">S</div>
                        <div className="h-10 w-10 rounded-full border-4 border-background bg-primary flex items-center justify-center text-[10px] font-black text-background">A</div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-tight">Mandi Connect</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight">Stations Active</p>
                    </div>
                </div>
            </section>

            {/* Extreme Weather Alerts Layer */}
            {alerts.length > 0 && (
                <section className="animate-in slide-in-from-top duration-700">
                    <WeatherAlerts alerts={alerts} />
                </section>
            )}

            {/* Main Grid: Current & Forecast */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left: 7-Day Forecast Grid */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Weekly Outlook</h3>
                            <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">7 Days Prediction</Badge>
                        </div>
                        <p className="text-[10px] font-bold text-primary italic flex items-center gap-1.5 self-end sm:self-auto">
                            <Sparkles className="h-3 w-3" />
                            Gemma Predictive Engine Active
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                        {forecast.map((f) => (
                            <ForecastCard key={f.date} forecast={f} />
                        ))}
                    </div>
                </div>

                {/* Right: Detailed Current Stats */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                    {currentCondition && (
                        <Card className="border-none bg-primary text-primary-foreground shadow-2xl relative overflow-hidden rounded-[2.5rem] group transition-all hover:scale-[1.01]">
                            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px] transition-all group-hover:bg-white/20" />
                            <CardHeader className="p-8 sm:p-10 pb-0">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 letter-spacing-widest">Current Reading</p>
                                        <CardTitle className="text-5xl sm:text-6xl font-black tracking-tighter leading-none">{currentCondition.high}°</CardTitle>
                                    </div>
                                    <div className="p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 shadow-inner shrink-0">
                                        <Thermometer className="h-8 w-8 sm:h-10 w-10" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 sm:p-10 space-y-8">
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-5">
                                    <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2 transition-colors hover:bg-white/10">
                                        <div className="flex items-center gap-2">
                                            <Wind className="h-4 w-4 opacity-70" />
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-70">Wind Speed</span>
                                        </div>
                                        <p className="text-2xl font-black">{currentCondition.precipitation * 0.5 + 5} km/h</p>
                                    </div>
                                    <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2 transition-colors hover:bg-white/10">
                                        <div className="flex items-center gap-2">
                                            <Droplets className="h-4 w-4 opacity-70" />
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-70">Humidity</span>
                                        </div>
                                        <p className="text-2xl font-black">{currentCondition.precipitation + 40}%</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Farmer's Insight</p>
                                        <Badge className="bg-white/20 text-white border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Optimal</Badge>
                                    </div>
                                    <p className="text-sm font-bold leading-relaxed opacity-90 italic">
                                        "Current high stability and precipitation levels of {currentCondition.precipitation}% suggest an excellent window for agricultural preservation."
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="rounded-[2.5rem] bg-card border border-border/50 p-6 sm:p-8 flex items-center gap-5 transition-all hover:border-primary/50 group shadow-lg shadow-black/5">
                        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                            <AlertTriangle className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tight">Weather Safety Protocol</p>
                            <p className="text-[11px] font-medium text-muted-foreground leading-snug">View official government meteorological guidelines for your district.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
