"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { setLanguage, updateApiKeys, Language } from "@/lib/store/settings-slice"
import { useTranslation } from "@/lib/use-translation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Key, Globe, Save, CheckCircle2, AlertCircle } from "lucide-react"

export default function SettingsPage() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const settings = useSelector((state: RootState) => state.settings)

    const [gemini, setGemini] = useState(settings.apiKeys.gemini || "")
    const [openAI, setOpenAI] = useState(settings.apiKeys.openAI || "")
    const [cohere, setCohere] = useState(settings.apiKeys.cohere || "")
    const [anthropic, setAnthropic] = useState(settings.apiKeys.anthropic || "")

    // Sync local state if Redux state changes (hydration)
    useEffect(() => {
        setGemini(settings.apiKeys.gemini || "")
        setOpenAI(settings.apiKeys.openAI || "")
        setCohere(settings.apiKeys.cohere || "")
        setAnthropic(settings.apiKeys.anthropic || "")
    }, [settings.apiKeys])

    const handleSaveKeys = () => {
        if (!gemini && !openAI && !cohere && !anthropic) {
            toast.error("Please configure at least one AI API key")
            return
        }
        dispatch(updateApiKeys({ gemini, openAI, cohere, anthropic }))
        toast.success("API keys saved successfully! AI modules now available for disease analysis.")
    }

    const handleLanguageChange = (value: Language) => {
        dispatch(setLanguage(value))
        toast.success("Language updated")
    }

    // Check available API keys
    const availableAIModules = [
        { name: "Google Gemini", key: "gemini", configured: !!gemini },
        { name: "OpenAI", key: "openAI", configured: !!openAI },
        { name: "Cohere", key: "cohere", configured: !!cohere },
        { name: "Anthropic Claude", key: "anthropic", configured: !!anthropic }
    ]

    const configuredCount = availableAIModules.filter(m => m.configured).length

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                {t('settings')}
            </h1>

            {/* AI Status Alert */}
            <Alert className={configuredCount > 0 ? "border-green-200 bg-green-50/50" : "border-orange-200 bg-orange-50/50"}>
                <AlertCircle className={`h-4 w-4 ${configuredCount > 0 ? "text-green-600" : "text-orange-600"}`} />
                <AlertDescription className={configuredCount > 0 ? "text-green-800" : "text-orange-800"}>
                    {configuredCount > 0 
                        ? `✓ ${configuredCount} AI module(s) configured. Disease prediction is enabled.`
                        : "⚠ No AI modules configured. Disease prediction will use basic risk assessment only."}
                </AlertDescription>
            </Alert>

            <div className="grid gap-6">
                {/* Language Selection */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <CardTitle>{t('language')}</CardTitle>
                        </div>
                        <CardDescription>
                            Choose your preferred language for the application interface.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select value={settings.language} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                                <SelectItem value="ml">Malayalam (മലയാളം)</SelectItem>
                                <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                                <SelectItem value="ar">Arabic (العربية)</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* AI Modules Status */}
                <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-blue-600" />
                            <CardTitle>Available AI Modules</CardTitle>
                        </div>
                        <CardDescription>
                            Modules configured for disease analysis and recommendations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availableAIModules.map(module => (
                                <div
                                    key={module.key}
                                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                        module.configured
                                            ? "border-green-200 bg-green-50"
                                            : "border-gray-200 bg-gray-50"
                                    }`}
                                >
                                    {module.configured ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                    )}
                                    <span className={`text-sm font-medium ${
                                        module.configured ? "text-green-900" : "text-gray-600"
                                    }`}>
                                        {module.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* API Keys */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            <CardTitle>AI API Keys Configuration</CardTitle>
                        </div>
                        <CardDescription>
                            Configure your AI API keys for disease prediction and health recommendations. At least one API key is required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="gemini" className="flex items-center gap-2">
                                Google Gemini API Key
                                {gemini && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                            </Label>
                            <Input
                                id="gemini"
                                type="password"
                                value={gemini}
                                onChange={(e) => setGemini(e.target.value)}
                                placeholder="Enter Gemini API key from console.cloud.google.com"
                            />
                            <p className="text-xs text-muted-foreground">Get free API key from Google AI Studio (makersuite.google.com/app/apikey)</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="openai" className="flex items-center gap-2">
                                OpenAI API Key
                                {openAI && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                            </Label>
                            <Input
                                id="openai"
                                type="password"
                                value={openAI}
                                onChange={(e) => setOpenAI(e.target.value)}
                                placeholder="Enter OpenAI API key"
                            />
                            <p className="text-xs text-muted-foreground">Get API key from platform.openai.com/api-keys</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cohere" className="flex items-center gap-2">
                                Cohere API Key
                                {cohere && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                            </Label>
                            <Input
                                id="cohere"
                                type="password"
                                value={cohere}
                                onChange={(e) => setCohere(e.target.value)}
                                placeholder="Enter Cohere API key"
                            />
                            <p className="text-xs text-muted-foreground">Get API key from dashboard.cohere.ai</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="anthropic" className="flex items-center gap-2">
                                Anthropic Claude API Key
                                {anthropic && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                            </Label>
                            <Input
                                id="anthropic"
                                type="password"
                                value={anthropic}
                                onChange={(e) => setAnthropic(e.target.value)}
                                placeholder="Enter Anthropic API key"
                            />
                            <p className="text-xs text-muted-foreground">Get API key from console.anthropic.com</p>
                        </div>

                        <Button onClick={handleSaveKeys} className="mt-6 w-full md:w-auto">
                            <Save className="mr-2 h-4 w-4" />
                            Save API Keys
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
