"use client"

import { useMemo } from "react"
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PriceTrend } from "@/lib/types"

interface PriceChartProps {
    data: PriceTrend[]
    cropName: string
}

export function PriceChart({ data, cropName }: PriceChartProps) {
    return (
        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Market Analysis</h4>
                        <CardTitle className="text-2xl font-black tracking-tight">{cropName} Price Trend</CardTitle>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last 7 Days</p>
                        <p className="text-xs font-bold text-foreground">Mandi Rate Variation</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-8">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="hsl(var(--border))"
                                opacity={0.3}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={['dataMin - 100', 'dataMax + 100']}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-xl border border-primary/20 bg-background/95 p-3 shadow-2xl backdrop-blur-md">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                                    {payload[0].payload.date}
                                                </p>
                                                <p className="text-lg font-black text-primary">
                                                    ₹{payload[0].value?.toLocaleString()}
                                                </p>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
