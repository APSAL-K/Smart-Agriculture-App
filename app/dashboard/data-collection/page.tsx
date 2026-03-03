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
import { Database, Heart, Microscope, AlertCircle, Activity } from "lucide-react"

export default function DataCollectionPage() {
    const { user, updateProfile } = useAuth()
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false)

    // Patient Profile
    const [age, setAge] = useState("")
    const [gender, setGender] = useState<"male" | "female" | "other">("male")
    const [medicalHistory, setMedicalHistory] = useState("")
    const [allergies, setAllergies] = useState("")
    const [currentMedications, setCurrentMedications] = useState("")
    const [alcoholConsumption, setAlcoholConsumption] = useState<"none" | "mild" | "moderate" | "heavy">("none")
    const [familyHistoryLiver, setFamilyHistoryLiver] = useState(false)
    const [riskFactors, setRiskFactors] = useState("")

    useEffect(() => {
        if (user?.patientProfile) {
            setAge(user.patientProfile.age?.toString() || "")
            setGender(user.patientProfile.gender || "male")
            setMedicalHistory(user.patientProfile.medicalHistory?.join(", ") || "")
            setAllergies(user.patientProfile.allergies?.join(", ") || "")
            setCurrentMedications(user.patientProfile.currentMedications?.join(", ") || "")
            setAlcoholConsumption(user.patientProfile.alcoholConsumption || "none")
            setFamilyHistoryLiver(user.patientProfile.familyHistoryLiver || false)
            setRiskFactors(user.patientProfile.riskFactors?.join(", ") || "")
        }
    }, [user])

    const handleSave = async () => {
        try {
            await updateProfile({
                patientProfile: {
                    age: parseInt(age) || 0,
                    gender,
                    medicalHistory: medicalHistory.split(",").map(x => x.trim()).filter(x => x),
                    allergies: allergies.split(",").map(x => x.trim()).filter(x => x),
                    currentMedications: currentMedications.split(",").map(x => x.trim()).filter(x => x),
                    alcoholConsumption,
                    familyHistoryLiver,
                    riskFactors: riskFactors.split(",").map(x => x.trim()).filter(x => x),
                    isOnboardingComplete: true,
                    lastUpdated: Date.now()
                }
            })
            toast.success("Health profile updated successfully!")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to update health information")
            console.error(error)
        }
    }

    return (
        <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between bg-card p-6 rounded-2xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-primary">
                        Health Profile
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {user?.patientProfile?.isOnboardingComplete
                            ? "Manage your medical and health information below."
                            : "Complete your health profile for accurate liver disease assessment."}
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
                {/* Demographics */}
                <Card className="border-primary/20 bg-primary/5 shadow-md rounded-2xl">
                    <CardHeader className="pb-3 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Demographics</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="age" className="text-xs font-bold uppercase text-muted-foreground">Age</Label>
                                <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} disabled={!isEditing} placeholder="Enter age" className="bg-background" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-xs font-bold uppercase text-muted-foreground">Gender</Label>
                                <Select value={gender} onValueChange={(v: any) => setGender(v)} disabled={!isEditing}>
                                    <SelectTrigger id="gender" className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="alcoholConsumption" className="text-xs font-bold uppercase text-muted-foreground">Alcohol Consumption</Label>
                            <Select value={alcoholConsumption} onValueChange={(v: any) => setAlcoholConsumption(v)} disabled={!isEditing}>
                                <SelectTrigger id="alcoholConsumption" className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="mild">Mild (Occasional)</SelectItem>
                                    <SelectItem value="moderate">Moderate (2-3x per week)</SelectItem>
                                    <SelectItem value="heavy">Heavy (Daily or more)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={familyHistoryLiver}
                                    onChange={(e) => setFamilyHistoryLiver(e.target.checked)}
                                    disabled={!isEditing}
                                    className="rounded"
                                />
                                Family History of Liver Disease
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Medical Information */}
                <Card className="border-primary/20 bg-primary/5 shadow-md rounded-2xl">
                    <CardHeader className="pb-3 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Medical History</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="medicalHistory" className="text-xs font-bold uppercase text-muted-foreground">Medical Conditions (comma-separated)</Label>
                            <textarea
                                id="medicalHistory"
                                value={medicalHistory}
                                onChange={(e) => setMedicalHistory(e.target.value)}
                                disabled={!isEditing}
                                className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g., Hepatitis B, Diabetes, Hypertension..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="allergies" className="text-xs font-bold uppercase text-muted-foreground">Allergies (comma-separated)</Label>
                            <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} disabled={!isEditing} placeholder="e.g., Penicillin, Shellfish..." className="bg-background" />
                        </div>
                    </CardContent>
                </Card>

                {/* Current Medications & Risk Factors */}
                <Card className="border-primary/20 bg-primary/5 shadow-md rounded-2xl md:col-span-2">
                    <CardHeader className="pb-3 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                            <Microscope className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Medications & Risk Factors</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentMedications" className="text-xs font-bold uppercase text-muted-foreground">Current Medications (comma-separated)</Label>
                            <textarea
                                id="currentMedications"
                                value={currentMedications}
                                onChange={(e) => setCurrentMedications(e.target.value)}
                                disabled={!isEditing}
                                className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g., Aspirin, Metformin..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="riskFactors" className="text-xs font-bold uppercase text-muted-foreground">Risk Factors (comma-separated)</Label>
                            <textarea
                                id="riskFactors"
                                value={riskFactors}
                                onChange={(e) => setRiskFactors(e.target.value)}
                                disabled={!isEditing}
                                className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g., Obesity, NAFLD, High cholesterol..."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        <CardTitle>Health Data Status</CardTitle>
                    </div>
                    <CardDescription>
                        Monitoring the synchronization of your health data with our diagnostic system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-green-500/10 p-2 text-green-500">
                                <div className="h-2 w-2 rounded-full bg-current" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Health Database Connected</p>
                                <p className="text-xs text-muted-foreground">Your data is securely synced and ready for analysis.</p>
                            </div>
                        </div>
                        {user?.patientProfile?.lastUpdated && (
                            <p className="text-xs text-muted-foreground italic">
                                Last Update: {new Date(user.patientProfile.lastUpdated).toLocaleString()}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
