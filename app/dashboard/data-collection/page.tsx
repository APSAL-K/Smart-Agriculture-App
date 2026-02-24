"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/use-translation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Database, Sprout, Milestone, Droplets, MapPin } from "lucide-react"

export default function DataCollectionPage() {
    const { user, updateProfile } = useAuth()
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false)

    const [cropType, setCropType] = useState("")
    const [soilType, setSoilType] = useState("")
    const [farmSize, setFarmSize] = useState("")
    const [irrigationMethod, setIrrigationMethod] = useState("")

    // New fields
    const [region, setRegion] = useState("")
    const [season, setSeason] = useState("")
    const [plantingDate, setPlantingDate] = useState("")
    const [expectedHarvest, setExpectedHarvest] = useState("")
    const [waterSource, setWaterSource] = useState("")
    const [fertilizerHistory, setFertilizerHistory] = useState("")
    const [targetYield, setTargetYield] = useState("")
    const [automationLevel, setAutomationLevel] = useState<"manual" | "semi" | "full">("manual")

    useEffect(() => {
        if (user?.farmInfo) {
            setCropType(user.farmInfo.cropType)
            setSoilType(user.farmInfo.soilType)
            setFarmSize(user.farmInfo.farmSize)
            setIrrigationMethod(user.farmInfo.irrigationMethod)

            // New fields hydrate
            setRegion(user.farmInfo.region || "")
            setSeason(user.farmInfo.season || "")
            setPlantingDate(user.farmInfo.plantingDate ? new Date(user.farmInfo.plantingDate).toISOString().split('T')[0] : "")
            setExpectedHarvest(user.farmInfo.expectedHarvest ? new Date(user.farmInfo.expectedHarvest).toISOString().split('T')[0] : "")
            setWaterSource(user.farmInfo.waterSource || "")
            setFertilizerHistory(user.farmInfo.fertilizerHistory || "")
            setTargetYield(user.farmInfo.targetYield || "")
            setAutomationLevel(user.farmInfo.automationLevel || "manual")
        }
    }, [user])

    const handleSave = async () => {
        try {
            await updateProfile({
                farmInfo: {
                    cropType,
                    soilType,
                    farmSize,
                    irrigationMethod,
                    region,
                    season,
                    plantingDate: plantingDate ? new Date(plantingDate).getTime() : undefined,
                    expectedHarvest: expectedHarvest ? new Date(expectedHarvest).getTime() : undefined,
                    waterSource,
                    fertilizerHistory,
                    targetYield,
                    automationLevel,
                    isOnboardingComplete: true, // Mark as complete
                    lastUpdated: Date.now()
                }
            })
            toast.success("Farm profile updated and onboarding complete!")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to update farm information")
            console.error(error)
        }
    }

    return (
        <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between bg-card p-6 rounded-2xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-primary">
                        {t('dataCollection')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {user?.farmInfo?.isOnboardingComplete
                            ? "Manage your detailed farm parameters below."
                            : t('onboardingDesc')}
                    </p>
                </div>
                <div className="flex gap-2">
                    {isEditing && (
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>
                            {t('cancel')}
                        </Button>
                    )}
                    <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="rounded-xl shadow-lg">
                        {isEditing ? t('save') : t('edit')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Info */}
                <Card className="border-primary/20 bg-primary/5 shadow-md rounded-2xl">
                    <CardHeader className="pb-3 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                            <Sprout className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">{t('farmInformation')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="cropType" className="text-xs font-bold uppercase text-muted-foreground">{t('cropType')}</Label>
                            <Select value={cropType} onValueChange={setCropType} disabled={!isEditing}>
                                <SelectTrigger id="cropType" className="bg-background">
                                    <SelectValue placeholder="Select crop type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wheat">Wheat</SelectItem>
                                    <SelectItem value="rice">Rice</SelectItem>
                                    <SelectItem value="corn">Corn</SelectItem>
                                    <SelectItem value="cotton">Cotton</SelectItem>
                                    <SelectItem value="vegetables">Vegetables</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="soilType" className="text-xs font-bold uppercase text-muted-foreground">{t('soilType')}</Label>
                            <Select value={soilType} onValueChange={setSoilType} disabled={!isEditing}>
                                <SelectTrigger id="soilType" className="bg-background">
                                    <SelectValue placeholder="Select soil type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="clay">Clay</SelectItem>
                                    <SelectItem value="sandy">Sandy</SelectItem>
                                    <SelectItem value="loamy">Loamy</SelectItem>
                                    <SelectItem value="silt">Silt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="region" className="text-xs font-bold uppercase text-muted-foreground">{t('region')}</Label>
                            <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} disabled={!isEditing} placeholder="Enter district or state" className="bg-background" />
                        </div>
                    </CardContent>
                </Card>

                {/* Seasonal Context */}
                <Card className="border-primary/20 bg-primary/5 shadow-md rounded-2xl">
                    <CardHeader className="pb-3 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                            <Milestone className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Seasonal Context</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="season" className="text-xs font-bold uppercase text-muted-foreground">{t('season')}</Label>
                            <Select value={season} onValueChange={setSeason} disabled={!isEditing}>
                                <SelectTrigger id="season" className="bg-background">
                                    <SelectValue placeholder="Select season" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="spring">Spring / Kharif</SelectItem>
                                    <SelectItem value="summer">Summer / Zaid</SelectItem>
                                    <SelectItem value="monsoon">Monsoon</SelectItem>
                                    <SelectItem value="winter">Winter / Rabi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="plantingDate" className="text-xs font-bold uppercase text-muted-foreground">{t('plantingDate')}</Label>
                                <Input id="plantingDate" type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} disabled={!isEditing} className="bg-background" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expectedHarvest" className="text-xs font-bold uppercase text-muted-foreground">{t('expectedHarvest')}</Label>
                                <Input id="expectedHarvest" type="date" value={expectedHarvest} onChange={(e) => setExpectedHarvest(e.target.value)} disabled={!isEditing} className="bg-background" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetYield" className="text-xs font-bold uppercase text-muted-foreground">{t('targetYield')}</Label>
                            <Input id="targetYield" value={targetYield} onChange={(e) => setTargetYield(e.target.value)} disabled={!isEditing} placeholder="e.g. 5 tons/acre" className="bg-background" />
                        </div>
                    </CardContent>
                </Card>

                {/* Operational Details */}
                <Card className="border-primary/20 bg-primary/5 shadow-md rounded-2xl md:col-span-2">
                    <CardHeader className="pb-3 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                            <Droplets className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Operational & Infrastructure</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="farmSize" className="text-xs font-bold uppercase text-muted-foreground">{t('farmSize')} (Acres)</Label>
                                <Input id="farmSize" type="number" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} disabled={!isEditing} className="bg-background" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="waterSource" className="text-xs font-bold uppercase text-muted-foreground">{t('waterSource')}</Label>
                                <Select value={waterSource} onValueChange={setWaterSource} disabled={!isEditing}>
                                    <SelectTrigger id="waterSource" className="bg-background">
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="well">Bore Well / Tube Well</SelectItem>
                                        <SelectItem value="canal">Canal Irrigation</SelectItem>
                                        <SelectItem value="rain">Rainfed</SelectItem>
                                        <SelectItem value="pond">Farm Pond / Tank</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="irrigationMethod" className="text-xs font-bold uppercase text-muted-foreground">{t('irrigationMethod')}</Label>
                                <Select value={irrigationMethod} onValueChange={setIrrigationMethod} disabled={!isEditing}>
                                    <SelectTrigger id="irrigationMethod" className="bg-background">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="drip">Drip Irrigation</SelectItem>
                                        <SelectItem value="sprinkler">Sprinkler</SelectItem>
                                        <SelectItem value="flood">Flood Irrigation</SelectItem>
                                        <SelectItem value="manual">Manual Watering</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="automationLevel" className="text-xs font-bold uppercase text-muted-foreground">{t('automationLevel')}</Label>
                                <Select value={automationLevel} onValueChange={(v: any) => setAutomationLevel(v)} disabled={!isEditing}>
                                    <SelectTrigger id="automationLevel" className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manual">Manual Monitoring</SelectItem>
                                        <SelectItem value="semi">Semi-Automated</SelectItem>
                                        <SelectItem value="full">Full Automation (AI Controlled)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fertilizerHistory" className="text-xs font-bold uppercase text-muted-foreground">{t('fertilizerHistory')}</Label>
                            <textarea
                                id="fertilizerHistory"
                                value={fertilizerHistory}
                                onChange={(e) => setFertilizerHistory(e.target.value)}
                                disabled={!isEditing}
                                className="w-full h-[105px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="List recent fertilizers used..."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        <CardTitle>Data Integration Status</CardTitle>
                    </div>
                    <CardDescription>
                        Monitoring the synchronization of your farm data with our AI engine.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-green-500/10 p-2 text-green-500">
                                <div className="h-2 w-2 rounded-full bg-current" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Cloud Database Connected</p>
                                <p className="text-xs text-muted-foreground">All parameters are currently synced.</p>
                            </div>
                        </div>
                        {user?.farmInfo?.lastUpdated && (
                            <p className="text-xs text-muted-foreground italic">
                                Last Sync: {new Date(user.farmInfo.lastUpdated).toLocaleString()}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
