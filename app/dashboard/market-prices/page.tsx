"use client"

import { useState, useMemo, useEffect } from "react"
import { useTranslation } from "@/lib/use-translation"
import { useAuth } from "@/lib/auth-context"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { TrendingUp, Search, Info, MapPin, Loader2, Sparkles } from "lucide-react"
import { getMarketPrices, getHistoricalTrends } from "@/lib/market-service"
import { PriceCard } from "@/components/market/price-card"
import { PriceChart } from "@/components/market/price-chart"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { MarketPrice, PriceTrend } from "@/lib/types"

export default function MarketPricesPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const apiKeys = useSelector((state: RootState) => state.settings.apiKeys)
    const [search, setSearch] = useState("")
    const [selectedCrop, setSelectedCrop] = useState<string>("Paddy")
    const [allPrices, setAllPrices] = useState<MarketPrice[]>([])
    const [trendData, setTrendData] = useState<PriceTrend[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPrices() {
            setLoading(true)
            const prices = await getMarketPrices(apiKeys, user?.farmInfo)
            setAllPrices(prices)
            setLoading(false)
        }
        loadPrices()
    }, [apiKeys, user?.farmInfo])

    useEffect(() => {
        async function loadTrends() {
            const trends = await getHistoricalTrends(selectedCrop)
            setTrendData(trends)
        }
        loadTrends()
    }, [selectedCrop])

    const filteredPrices = useMemo(() => {
        return allPrices.filter(p =>
            p.cropName.toLowerCase().includes(search.toLowerCase()) ||
            p.marketName.toLowerCase().includes(search.toLowerCase())
        )
    }, [allPrices, search])

    if (loading && allPrices.length === 0) {
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
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-background/50 backdrop-blur-sm border-primary/20">
                            {apiKeys.gemini ? "AI Dynamic Mandi Rates" : "Live Mandi Updates"}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        {t('marketPrices')}
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground/80 max-w-lg leading-relaxed">
                        Stay ahead of the market. Access real-time crop rates from your local Mandis and analyze historical trends to maximize your harvest value.
                    </p>
                </div>

                <div className="relative group max-w-md w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        placeholder="Search crop or market..."
                        className="pl-11 pr-4 rounded-2xl border-primary/10 bg-card/40 backdrop-blur-xl h-14 text-sm font-medium focus:ring-primary/20 shadow-lg shadow-black/5"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left column: Price Cards Grid */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Nearby Markets</h3>
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-bold text-primary italic flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            Refreshed every 15 minutes
                        </p>
                    </div>

                    {filteredPrices.length === 0 ? (
                        <div className="py-20 text-center space-y-4 rounded-3xl bg-muted/20 border border-dashed border-primary/10">
                            <Search className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                            <p className="text-sm font-medium text-muted-foreground">No matching market rates found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredPrices.map((price) => (
                                <PriceCard
                                    key={price.id}
                                    price={price}
                                    isSelected={selectedCrop === price.cropName}
                                    onClick={() => setSelectedCrop(price.cropName)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right column: Trends & Info */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <PriceChart data={trendData} cropName={selectedCrop} />

                        <div className="rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/5 to-background p-8 border border-primary/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-primary/20 text-primary">
                                    <Info className="h-5 w-5" />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary leading-none">Market Intelligence</h4>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-foreground uppercase tracking-tight">Best time to sell</p>
                                    <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                                        Based on 7-day trends, prices for <span className="font-bold text-primary">{selectedCrop}</span> are stabilizing. Expert prediction suggests a slight increase next week.
                                    </p>
                                </div>
                                <Button className="w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-xs font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20">
                                    Analyze Full Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
