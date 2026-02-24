"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { setLanguage, updateApiKeys, Language } from "@/lib/store/settings-slice"
import { useTranslation } from "@/lib/use-translation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Key, Globe, Save } from "lucide-react"

export default function SettingsPage() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const settings = useSelector((state: RootState) => state.settings)

    const [gemini, setGemini] = useState(settings.apiKeys.gemini)
    const [openRouter, setOpenRouter] = useState(settings.apiKeys.openRouter)
    const [cohere, setCohere] = useState(settings.apiKeys.cohere)

    // Sync local state if Redux state changes (hydration)
    useEffect(() => {
        setGemini(settings.apiKeys.gemini)
        setOpenRouter(settings.apiKeys.openRouter)
        setCohere(settings.apiKeys.cohere)
    }, [settings.apiKeys])

    const handleSaveKeys = () => {
        dispatch(updateApiKeys({ gemini, openRouter, cohere }))
        toast.success("API keys saved successfully")
    }

    const handleLanguageChange = (value: Language) => {
        dispatch(setLanguage(value))
        toast.success("Language updated")
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                {t('settings')}
            </h1>

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

                {/* API Keys */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            <CardTitle>{t('apiKeys')}</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your API keys for AI services used in crop recommendations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="gemini">Gemini API Key</Label>
                            <Input
                                id="gemini"
                                type="password"
                                value={gemini}
                                onChange={(e) => setGemini(e.target.value)}
                                placeholder="Enter Gemini API key"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="openrouter">Open Router API Key</Label>
                            <Input
                                id="openrouter"
                                type="password"
                                value={openRouter}
                                onChange={(e) => setOpenRouter(e.target.value)}
                                placeholder="Enter Open Router API key"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cohere">Cohere API Key</Label>
                            <Input
                                id="cohere"
                                type="password"
                                value={cohere}
                                onChange={(e) => setCohere(e.target.value)}
                                placeholder="Enter Cohere API key"
                            />
                        </div>
                        <Button onClick={handleSaveKeys} className="mt-2">
                            <Save className="mr-2 h-4 w-4" />
                            {t('save')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
