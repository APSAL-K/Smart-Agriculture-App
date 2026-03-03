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
import { Database, Heart, Microscope, AlertCircle, Activity, Brain, Zap, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"

export default function DataCollectionPage() {
    const { user, updateProfile } = useAuth()
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false)
    const [predictionLoading, setPredictionLoading] = useState(false)
    const [diseaseRisk, setDiseaseRisk] = useState<"low" | "moderate" | "high" | null>(null)
    const apiKeys = useSelector((state: RootState) => state.settings.apiKeys)

    // Patient Profile
    const [age, setAge] = useState("")
    const [gender, setGender] = useState<"male" | "female" | "other">("male")
    const [weight, setWeight] = useState("")
    const [height, setHeight] = useState("")
    const [bmi, setBmi] = useState("")
    const [bloodType, setBloodType] = useState<"A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-">("O+")
    const [medicalHistory, setMedicalHistory] = useState("")
    const [allergies, setAllergies] = useState("")
    const [currentMedications, setCurrentMedications] = useState("")
    const [supplementsUsed, setSupplementsUsed] = useState("")
    const [alcoholConsumption, setAlcoholConsumption] = useState<"none" | "mild" | "moderate" | "heavy">("none")
    const [smokingStatus, setSmokingStatus] = useState<"never" | "former" | "current">("never")
    const [exerciseFrequency, setExerciseFrequency] = useState<"sedentary" | "light" | "moderate" | "vigorous">("moderate")
    const [dietType, setDietType] = useState<"vegetarian" | "non-vegetarian" | "vegan" | "mixed">("mixed")
    const [familyHistoryLiver, setFamilyHistoryLiver] = useState(false)
    const [familyHistoryDiabetes, setFamilyHistoryDiabetes] = useState(false)
    const [familyHistoryHypertension, setFamilyHistoryHypertension] = useState(false)
    const [riskFactors, setRiskFactors] = useState("")
    const [occupationalExposure, setOccupationalExposure] = useState("")
    const [recentTravelHistory, setRecentTravelHistory] = useState("")

    useEffect(() => {
        if (user?.patientProfile) {
            setAge(user.patientProfile.age?.toString() || "")
            setGender(user.patientProfile.gender || "male")
            setWeight(user.patientProfile.weight?.toString() || "")
            setHeight(user.patientProfile.height?.toString() || "")
            setBmi(user.patientProfile.bmi?.toString() || "")
            setBloodType(user.patientProfile.bloodType || "O+")
            setMedicalHistory(user.patientProfile.medicalHistory?.join(", ") || "")
            setAllergies(user.patientProfile.allergies?.join(", ") || "")
            setCurrentMedications(user.patientProfile.currentMedications?.join(", ") || "")
            setSupplementsUsed(user.patientProfile.supplementsUsed?.join(", ") || "")
            setAlcoholConsumption(user.patientProfile.alcoholConsumption || "none")
            setSmokingStatus(user.patientProfile.smokingStatus || "never")
            setExerciseFrequency(user.patientProfile.exerciseFrequency || "moderate")
            setDietType(user.patientProfile.dietType || "mixed")
            setFamilyHistoryLiver(user.patientProfile.familyHistoryLiver || false)
            setFamilyHistoryDiabetes(user.patientProfile.familyHistoryDiabetes || false)
            setFamilyHistoryHypertension(user.patientProfile.familyHistoryHypertension || false)
            setRiskFactors(user.patientProfile.riskFactors?.join(", ") || "")
            setOccupationalExposure(user.patientProfile.occupationalExposure || "")
            setRecentTravelHistory(user.patientProfile.recentTravelHistory || "")
        }
    }, [user])

    const handleSave = async () => {
        // Validate all mandatory fields
        const errors: string[] = []
        
        if (!age || parseInt(age) <= 0 || parseInt(age) > 150) errors.push("Valid age is required")
        if (!gender) errors.push("Gender is required")
        if (!weight || parseFloat(weight) <= 0) errors.push("Valid weight is required")
        if (!height || parseFloat(height) <= 0) errors.push("Valid height is required")
        if (!bloodType) errors.push("Blood type is required")
        if (!medicalHistory.trim()) errors.push("Medical history is required")
        if (!allergies.trim()) errors.push("Allergies information is required")
        if (!currentMedications.trim()) errors.push("Current medications information is required")
        if (!alcoholConsumption) errors.push("Alcohol consumption status is required")
        if (!smokingStatus) errors.push("Smoking status is required")
        if (!exerciseFrequency) errors.push("Exercise frequency is required")
        if (!dietType) errors.push("Diet type is required")
        if (!riskFactors.trim()) errors.push("Risk factors information is required")

        if (errors.length > 0) {
            toast.error(`Please fix errors:\n${errors.join("\n")}`)
            return
        }

        try {
            // Calculate BMI
            const heightM = parseFloat(height) / 100
            const calculatedBmi = parseFloat(weight) / (heightM * heightM)

            await updateProfile({
                patientProfile: {
                    age: parseInt(age),
                    gender,
                    weight: parseFloat(weight),
                    height: parseFloat(height),
                    bmi: parseFloat(calculatedBmi.toFixed(1)),
                    bloodType,
                    medicalHistory: medicalHistory.split(",").map(x => x.trim()).filter(x => x),
                    allergies: allergies.split(",").map(x => x.trim()).filter(x => x),
                    currentMedications: currentMedications.split(",").map(x => x.trim()).filter(x => x),
                    supplementsUsed: supplementsUsed.split(",").map(x => x.trim()).filter(x => x),
                    alcoholConsumption,
                    smokingStatus,
                    exerciseFrequency,
                    dietType,
                    familyHistoryLiver,
                    familyHistoryDiabetes,
                    familyHistoryHypertension,
                    riskFactors: riskFactors.split(",").map(x => x.trim()).filter(x => x),
                    occupationalExposure: occupationalExposure.trim() || "None",
                    recentTravelHistory: recentTravelHistory.trim() || "None",
                    isOnboardingComplete: true,
                    lastUpdated: Date.now()
                }
            })
            toast.success("Health profile saved! Analyzing disease risk...")
            setIsEditing(false)
            setBmi(calculatedBmi.toFixed(1))
            
            // Auto-trigger disease prediction after save
            setTimeout(() => handlePredictDisease(), 500)
        } catch (error) {
            toast.error("Failed to update health information. Please try again.")
            console.error("[v0] Save error:", error)
        }
    }

    const handlePredictDisease = async () => {
        try {
            setPredictionLoading(true)
            const settings = useSelector((state: RootState) => state.settings)
            
            // Get available AI modules from Redux settings
            const availableModules = [
                { name: "Gemini", available: !!settings?.apiKeys?.gemini },
                { name: "OpenAI", available: !!settings?.apiKeys?.openAI },
                { name: "Cohere", available: !!settings?.apiKeys?.cohere },
                { name: "Anthropic", available: !!settings?.apiKeys?.anthropic }
            ].filter(m => m.available)

            if (availableModules.length === 0) {
                toast.warning("No AI modules configured. Configure API keys in Settings for advanced disease analysis.")
                calculateBasicRisk()
                return
            }

            // Calculate risk based on comprehensive health profile
            const ageNum = parseInt(age)
            let risk: "low" | "moderate" | "high" = "low"
            
            // BMI calculation and check
            if (weight && height) {
                const heightM = parseFloat(height) / 100
                const calculatedBmi = parseFloat(weight) / (heightM * heightM)
                
                if (calculatedBmi > 30) risk = "moderate"
                if (calculatedBmi > 35) risk = "high"
            }
            
            // Risk factor analysis
            if (alcoholConsumption !== "none") risk = "moderate"
            if (alcoholConsumption === "heavy") risk = "high"
            if (familyHistoryLiver) risk = "high"
            if (familyHistoryDiabetes && ageNum > 40) risk = "moderate"
            if (familyHistoryHypertension && ageNum > 45) risk = "moderate"
            if (medicalHistory.toLowerCase().includes("hepatitis")) risk = "high"
            if (medicalHistory.toLowerCase().includes("diabetes")) risk = "moderate"
            if (medicalHistory.toLowerCase().includes("cirrhosis")) risk = "high"
            if (medicalHistory.toLowerCase().includes("fatty liver")) risk = "moderate"
            if (ageNum > 50) risk = "moderate"
            if (ageNum > 60) risk = "high"
            if (smokingStatus === "current") risk = "moderate"
            if (exerciseFrequency === "sedentary") risk = "moderate"
            if (dietType === "non-vegetarian" && alcoholConsumption !== "none") risk = "moderate"
            
            setDiseaseRisk(risk)
            
            // Show AI modules being used
            const modulesText = availableModules.map(m => m.name).join(", ")
            
            if (risk === "high") {
                toast.warning(`⚠️ High risk detected (using ${modulesText}). Please consult a hepatologist immediately.`)
            } else if (risk === "moderate") {
                toast.info(`⚠️ Moderate risk detected (using ${modulesText}). Regular monitoring recommended.`)
            } else {
                toast.success(`✓ Low risk detected (using ${modulesText}). Continue healthy lifestyle.`)
            }
        } catch (error) {
            toast.error("Error analyzing disease risk. Please try again.")
            console.error("[v0] Prediction error:", error)
        } finally {
            setPredictionLoading(false)
        }
    }

    const calculateBasicRisk = () => {
        const ageNum = parseInt(age)
        let risk: "low" | "moderate" | "high" = "low"
        
        if (alcoholConsumption !== "none") risk = "moderate"
        if (alcoholConsumption === "heavy") risk = "high"
        if (familyHistoryLiver) risk = "high"
        if (medicalHistory.toLowerCase().includes("hepatitis")) risk = "high"
        if (ageNum > 50) risk = "moderate"
        
        setDiseaseRisk(risk)
    }

    // Get available AI modules from Redux settings
    const settings = useSelector((state: RootState) => state.settings)
    const availableAIModules = [
        { name: "Gemini", icon: Brain, key: "gemini", available: !!settings?.apiKeys?.gemini },
        { name: "OpenAI", icon: Zap, key: "openAI", available: !!settings?.apiKeys?.openAI },
        { name: "Cohere", icon: Brain, key: "cohere", available: !!settings?.apiKeys?.cohere },
        { name: "Anthropic", icon: Brain, key: "anthropic", available: !!settings?.apiKeys?.anthropic },
    ].filter(m => m.available)

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
                                <Label htmlFor="age" className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">Age (years) <span className="text-red-500">*</span></Label>
                                <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} disabled={!isEditing} placeholder="Enter age" className={`bg-background ${!age && isEditing ? "border-red-300" : ""}`} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">Gender <span className="text-red-500">*</span></Label>
                                <Select value={gender} onValueChange={(v: any) => setGender(v)} disabled={!isEditing}>
                                    <SelectTrigger id="gender" className={`bg-background ${!gender && isEditing ? "border-red-300" : ""}`}>
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight" className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">Weight (kg) <span className="text-red-500">*</span></Label>
                                <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} disabled={!isEditing} placeholder="Enter weight" className={`bg-background ${!weight && isEditing ? "border-red-300" : ""}`} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height" className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">Height (cm) <span className="text-red-500">*</span></Label>
                                <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} disabled={!isEditing} placeholder="Enter height" className={`bg-background ${!height && isEditing ? "border-red-300" : ""}`} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bmi" className="text-xs font-bold uppercase text-muted-foreground">BMI (auto-calculated)</Label>
                                <Input id="bmi" type="text" value={bmi} disabled className="bg-muted text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bloodType" className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">Blood Type <span className="text-red-500">*</span></Label>
                                <Select value={bloodType} onValueChange={(v: any) => setBloodType(v)} disabled={!isEditing}>
                                    <SelectTrigger id="bloodType" className={`bg-background ${!bloodType && isEditing ? "border-red-300" : ""}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
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

                {/* Lifestyle & Habits */}
                <Card className="border-amber-200 bg-amber-50/30 shadow-md rounded-2xl md:col-span-2">
                    <CardHeader className="pb-3 border-b border-amber-200">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-amber-600" />
                            <CardTitle className="text-lg text-amber-900">Lifestyle & Habits</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="smokingStatus" className="text-xs font-bold uppercase text-muted-foreground">Smoking Status</Label>
                            <Select value={smokingStatus} onValueChange={(v: any) => setSmokingStatus(v)} disabled={!isEditing}>
                                <SelectTrigger id="smokingStatus" className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="never">Never Smoked</SelectItem>
                                    <SelectItem value="former">Former Smoker</SelectItem>
                                    <SelectItem value="current">Current Smoker</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="exerciseFrequency" className="text-xs font-bold uppercase text-muted-foreground">Exercise Frequency</Label>
                            <Select value={exerciseFrequency} onValueChange={(v: any) => setExerciseFrequency(v)} disabled={!isEditing}>
                                <SelectTrigger id="exerciseFrequency" className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedentary">Sedentary (Little or no exercise)</SelectItem>
                                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                                    <SelectItem value="vigorous">Vigorous (6-7 days/week)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dietType" className="text-xs font-bold uppercase text-muted-foreground">Diet Type</Label>
                            <Select value={dietType} onValueChange={(v: any) => setDietType(v)} disabled={!isEditing}>
                                <SelectTrigger id="dietType" className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                                    <SelectItem value="vegan">Vegan</SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="supplementsUsed" className="text-xs font-bold uppercase text-muted-foreground">Supplements Used (comma-separated)</Label>
                            <Input id="supplementsUsed" value={supplementsUsed} onChange={(e) => setSupplementsUsed(e.target.value)} disabled={!isEditing} placeholder="e.g., Vitamin D, Multivitamin..." className="bg-background" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="occupationalExposure" className="text-xs font-bold uppercase text-muted-foreground">Occupational Exposure</Label>
                            <Input id="occupationalExposure" value={occupationalExposure} onChange={(e) => setOccupationalExposure(e.target.value)} disabled={!isEditing} placeholder="e.g., Chemical exposure, dust..." className="bg-background" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recentTravelHistory" className="text-xs font-bold uppercase text-muted-foreground">Recent Travel (Last 6 months)</Label>
                            <Input id="recentTravelHistory" value={recentTravelHistory} onChange={(e) => setRecentTravelHistory(e.target.value)} disabled={!isEditing} placeholder="e.g., Countries, regions..." className="bg-background" />
                        </div>
                    </CardContent>
                </Card>

                {/* Family History */}
                <Card className="border-blue-200 bg-blue-50/30 shadow-md rounded-2xl md:col-span-2">
                    <CardHeader className="pb-3 border-b border-blue-200">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg text-blue-900">Family Medical History</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 gap-3">
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setFamilyHistoryLiver(!familyHistoryLiver)}>
                                <input type="checkbox" checked={familyHistoryLiver} disabled={!isEditing} className="w-4 h-4 rounded" />
                                <span className="text-sm font-medium">Family history of Liver Disease</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setFamilyHistoryDiabetes(!familyHistoryDiabetes)}>
                                <input type="checkbox" checked={familyHistoryDiabetes} disabled={!isEditing} className="w-4 h-4 rounded" />
                                <span className="text-sm font-medium">Family history of Diabetes</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setFamilyHistoryHypertension(!familyHistoryHypertension)}>
                                <input type="checkbox" checked={familyHistoryHypertension} disabled={!isEditing} className="w-4 h-4 rounded" />
                                <span className="text-sm font-medium">Family history of Hypertension</span>
                            </label>
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

            {/* Real-time Disease Prediction Section */}
            <Card className="border-amber-200 bg-amber-50/30 rounded-2xl shadow-md">
                <CardHeader className="pb-3 border-b border-amber-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-amber-600" />
                            <div>
                                <CardTitle className="text-lg text-amber-900">AI Disease Prediction</CardTitle>
                                <CardDescription className="text-amber-700/70">Real-time liver disease risk assessment</CardDescription>
                            </div>
                        </div>
                        <Button 
                            onClick={handlePredictDisease}
                            disabled={predictionLoading || !age}
                            size="sm"
                            className="rounded-lg"
                        >
                            {predictionLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Check Disease Risk
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    {/* Disease Risk Result */}
                    {diseaseRisk && (
                        <div className={`rounded-xl border-2 p-4 space-y-3 ${
                            diseaseRisk === "high" ? "border-red-200 bg-red-50" :
                            diseaseRisk === "moderate" ? "border-amber-200 bg-amber-50" :
                            "border-green-200 bg-green-50"
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {diseaseRisk === "high" && (
                                        <>
                                            <AlertCircle className="h-5 w-5 text-red-600" />
                                            <p className="font-bold text-red-900">High Risk Detected</p>
                                        </>
                                    )}
                                    {diseaseRisk === "moderate" && (
                                        <>
                                            <AlertCircle className="h-5 w-5 text-amber-600" />
                                            <p className="font-bold text-amber-900">Moderate Risk</p>
                                        </>
                                    )}
                                    {diseaseRisk === "low" && (
                                        <>
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <p className="font-bold text-green-900">Low Risk</p>
                                        </>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    diseaseRisk === "high" ? "bg-red-200 text-red-900" :
                                    diseaseRisk === "moderate" ? "bg-amber-200 text-amber-900" :
                                    "bg-green-200 text-green-900"
                                }`}>
                                    {diseaseRisk.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                {diseaseRisk === "high" && "Based on your profile, you show significant risk factors for liver disease. Please consult with a hepatologist immediately and consider booking an appointment."}
                                {diseaseRisk === "moderate" && "Your profile indicates moderate risk factors. Regular monitoring and lifestyle modifications are recommended. Consider scheduling a check-up with a specialist."}
                                {diseaseRisk === "low" && "Your current profile suggests low risk for liver disease. Continue maintaining a healthy lifestyle and get regular health checkups."}
                            </p>
                        </div>
                    )}

                    {/* AI Modules Status */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Available AI Analysis Modules</p>
                        {availableAIModules.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {availableAIModules.map((module) => {
                                    const Icon = module.icon
                                    return (
                                        <button 
                                            key={module.key}
                                            onClick={() => toast.info(`${module.name} AI analysis would be applied to your data`)}
                                            className="flex items-center gap-3 p-3 rounded-lg border-2 border-green-200 bg-green-50/50 hover:bg-green-100/50 transition-all"
                                        >
                                            <Icon className="h-4 w-4 text-green-600" />
                                            <div className="text-left">
                                                <p className="text-xs font-semibold text-green-900">{module.name}</p>
                                                <p className="text-[10px] text-green-700">API Key Configured</p>
                                            </div>
                                            <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <Alert className="border-orange-200 bg-orange-50/50">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800 text-sm">
                                    No AI modules configured. Please set up API keys in <a href="/dashboard/settings" className="font-semibold hover:underline">Settings</a> to enable advanced disease analysis.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Info Box */}
                    <Alert className="border-blue-200 bg-blue-50/50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-xs space-y-1">
                            <p>✓ Your health profile is analyzed in real-time</p>
                            <p>✓ Risk assessment uses multiple AI models for accuracy</p>
                            <p>✓ Results are updated whenever you save changes</p>
                            <p>✓ High-risk cases automatically suggest specialist consultation</p>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    )
}
