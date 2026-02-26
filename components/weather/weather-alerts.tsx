"use client"

import { AlertTriangle, Info, ShieldAlert, X, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { ExtremeWeatherAlert } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getExtremeWeatherAdvice } from "@/lib/weather-service"

interface WeatherAlertsProps {
    alerts: ExtremeWeatherAlert[]
}

export function WeatherAlerts({ alerts }: WeatherAlertsProps) {
    if (alerts.length === 0) return null

    return (
        <div className="space-y-4">
            {alerts.map((alert) => {
                const isCritical = alert.severity === "critical"
                const isWarning = alert.severity === "warning"

                return (
                    <div key={alert.id} className="relative group">
                        <div className={cn(
                            "absolute -inset-1 rounded-[2rem] blur-lg transition-opacity opacity-20 group-hover:opacity-30",
                            isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-blue-500"
                        )} />
                        <Alert className={cn(
                            "relative border-none bg-card/60 backdrop-blur-2xl rounded-[1.5rem] shadow-2xl p-6",
                            isCritical ? "ring-1 ring-red-500/50" : isWarning ? "ring-1 ring-amber-500/50" : "ring-1 ring-blue-500/50"
                        )}>
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className={cn(
                                    "p-4 rounded-2xl shrink-0 shadow-lg",
                                    isCritical ? "bg-red-500 text-white" : isWarning ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                                )}>
                                    {isCritical ? <ShieldAlert className="h-7 w-7" /> : isWarning ? <AlertTriangle className="h-7 w-7" /> : <Info className="h-7 w-7" />}
                                </div>

                                <div className="flex-1 min-w-0 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <AlertTitle className="text-xl font-black tracking-tighter uppercase leading-none">
                                                {alert.type} {alert.severity === 'critical' ? 'EMERGENCY' : 'ALERT'}
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription className="text-sm font-black text-foreground/70 leading-relaxed max-w-2xl">
                                            {alert.message}
                                        </AlertDescription>
                                    </div>

                                    <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/10 space-y-3 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary leading-none">Precision Agriculture Strategy</p>
                                        </div>
                                        <p className="text-sm font-black text-foreground leading-relaxed italic opacity-90">
                                            "{getExtremeWeatherAdvice(alert)}"
                                        </p>
                                    </div>
                                </div>

                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:bg-foreground/10 absolute top-4 right-4">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </Alert>
                    </div>
                )
            })}
        </div>
    )
}
