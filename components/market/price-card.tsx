"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, MapPin, Clock } from "lucide-react"
import type { MarketPrice } from "@/lib/types"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface PriceCardProps {
    price: MarketPrice
    isSelected?: boolean
    onClick?: () => void
}

export function PriceCard({ price, isSelected, onClick }: PriceCardProps) {
    const trendColor = {
        up: "text-green-500 bg-green-500/10",
        down: "text-red-500 bg-red-500/10",
        stable: "text-muted-foreground bg-muted/20"
    }[price.trend]

    const TrendIcon = {
        up: TrendingUp,
        down: TrendingDown,
        stable: Minus
    }[price.trend]

    return (
        <Card
            className={cn(
                "cursor-pointer overflow-hidden border-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                isSelected ? "bg-primary/10 ring-2 ring-primary" : "bg-card/40 backdrop-blur-xl hover:bg-card/60 shadow-lg shadow-black/5"
            )}
            onClick={onClick}
        >
            <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                        <h3 className="text-xl font-black tracking-tighter text-foreground uppercase truncate leading-none">
                            {price.cropName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{price.marketName}</span>
                        </div>
                    </div>
                    <Badge className={cn("rounded-full border-none px-2.5 py-1 shrink-0 h-fit transition-colors", trendColor)}>
                        <TrendIcon className="mr-1 h-3 w-3" />
                        <span className="text-[10px] font-black">{Math.abs(price.change)}%</span>
                    </Badge>
                </div>

                <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-3xl font-black text-foreground tracking-tighter leading-none">
                        ₹{price.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-black text-muted-foreground/50 uppercase tracking-widest">
                        / {price.unit}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground/40" />
                        <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                            {formatDistanceToNow(price.lastUpdated)} ago
                        </span>
                    </div>
                    <div className={cn(
                        "h-2 w-2 rounded-full ring-4 ring-background",
                        price.trend === 'up' ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" :
                            price.trend === 'down' ? "bg-red-500 shadow-[0_0_12px_rgba(239,44,44,0.5)]" :
                                "bg-muted shadow-none"
                    )} />
                </div>
            </CardContent>
        </Card>
    )
}
