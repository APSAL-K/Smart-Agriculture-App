import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Timer, Calendar } from "lucide-react"

interface CropProgressProps {
    plantingDate?: number
    expectedHarvest?: number
    cropType?: string
}

export function CropProgress({ plantingDate, expectedHarvest, cropType }: CropProgressProps) {
    if (!plantingDate || !expectedHarvest) return null

    const totalDuration = expectedHarvest - plantingDate
    const elapsed = Date.now() - plantingDate
    const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))

    const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24))
    const daysTotal = Math.floor(totalDuration / (1000 * 60 * 60 * 24))
    const daysRemaining = Math.max(0, daysTotal - daysElapsed)

    return (
        <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-primary" />
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            {cropType || "Crop"} Growth Progress
                        </CardTitle>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">
                        Day {daysElapsed} of {daysTotal}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Progress value={progressPercent} className="h-3 md:h-4 bg-primary/10" />

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-primary/10 transition-all hover:border-primary/30">
                        <Timer className="h-4 w-4 text-primary" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Elapsed</p>
                            <p className="text-sm font-bold leading-none">{daysElapsed} Days</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-primary/10 transition-all hover:border-primary/30">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">Estimate</p>
                            <p className="text-sm font-bold leading-none">{daysRemaining} Days Left</p>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Planting Date: {new Date(plantingDate).toLocaleDateString()}</span>
                    <span>Target Harvest: {new Date(expectedHarvest).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    )
}
