"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/use-translation"
import { useSensorData } from "@/lib/use-sensor-data"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Lightbulb,
    Sparkles,
    RefreshCcw,
    Send,
    User,
    Bot,
    Trash2,
    ChevronDown,
} from "lucide-react"
import { generateAiChatResponse } from "@/lib/ai-service"
import { getRecommendations as getBaseRecommendations } from "@/lib/recommendations"
import { cn } from "@/lib/utils"
import { ChatMessage } from "@/lib/types"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function RecommendationEnginePage() {
    const { user } = useAuth()
    const { t } = useTranslation()
    const { readings, loading } = useSensorData(user?.uid)
    const apiKeys = useSelector((state: RootState) => state.settings.apiKeys)

    const [provider, setProvider] = useState<'Gemini' | 'OpenRouter' | 'Cohere'>('Cohere')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const latestReading = readings.length > 0 ? readings[readings.length - 1] : null
    const baseRecommendations = getBaseRecommendations(latestReading)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isTyping])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim() || !latestReading || isTyping) return

        const userMsg: ChatMessage = {
            id: Math.random().toString(36).substring(7),
            role: 'user',
            content: inputValue,
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        try {
            const response = await generateAiChatResponse(
                inputValue,
                messages,
                latestReading,
                apiKeys,
                user?.farmInfo,
                provider
            )

            if (response) {
                const botMsg: ChatMessage = {
                    id: Math.random().toString(36).substring(7),
                    role: 'assistant',
                    content: response,
                    timestamp: Date.now()
                }
                setMessages(prev => [...prev, botMsg])
            }
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, {
                id: 'error',
                role: 'assistant',
                content: "⚠️ **System Error**: Failed to reach the AI provider. Please check your API keys or network connection.",
                timestamp: Date.now()
            }])
        } finally {
            setIsTyping(false)
        }
    }

    const clearChat = () => {
        setMessages([])
    }

    if (loading) return <div className="p-8 text-center text-muted-foreground italic">Analyzing sensor data...</div>

    const hasKey = (provider === 'Gemini' && apiKeys.gemini) ||
        (provider === 'OpenRouter' && apiKeys.openRouter) ||
        (provider === 'Cohere' && apiKeys.cohere)

    return (
        <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                        {t('recommendationEngine')}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                        AI-driven agricultural advisor with real-time sensor context.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className="text-muted-foreground hover:text-destructive h-9"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear History
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-7 flex-1">
                {/* Chat Section */}
                <Card className="lg:col-span-4 border-primary/20 bg-background flex flex-col h-[500px] sm:h-[600px] lg:h-[750px] shadow-xl overflow-hidden relative rounded-xl md:rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-3 md:p-4 bg-muted/40 z-10">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-primary/20 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-inner shrink-0">
                                <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <CardTitle className="text-sm md:text-base font-bold truncate">Advisor</CardTitle>
                                <div className="flex items-center gap-1">
                                    <span className="h-1 w-1 md:h-1.5 md:w-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <CardDescription className="text-[9px] md:text-xs truncate">AI Intelligence</CardDescription>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Select value={provider} onValueChange={(v: any) => setProvider(v)}>
                                <SelectTrigger className="w-[100px] md:w-[130px] h-8 md:h-9 text-[10px] md:text-xs bg-background/50 border-primary/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Gemini">Gemini 1.5</SelectItem>
                                    <SelectItem value="OpenRouter">OpenRouter</SelectItem>
                                    <SelectItem value="Cohere">Cohere AI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-auto relative">
                        <ScrollArea className="flex-1">
                            <div className="px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="relative mb-6">
                                            <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl animate-pulse" />
                                            <Sparkles className="h-16 w-16 text-primary/30" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">Agricultural Intelligence Hub</h3>
                                        <p className="text-sm text-muted-foreground max-w-[280px] mt-2 leading-relaxed">
                                            Ask about Irrigation Management, Soil Health, or Weather Impacts.
                                        </p>
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-400",
                                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-md border",
                                            msg.role === 'user' ? "bg-primary text-primary-foreground border-primary" : "bg-card text-primary border-border"
                                        )}>
                                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>
                                        <div className={cn(
                                            "p-3 md:p-4 rounded-2xl text-sm shadow-sm max-w-[90%] md:max-w-[80%]",
                                            msg.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted/50 text-foreground rounded-tl-none border border-border/50 backdrop-blur-sm"
                                        )}>
                                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-inherit prose-headings:text-inherit prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                            <div className={cn(
                                                "text-[9px] mt-2 opacity-40 font-medium flex items-center gap-1",
                                                msg.role === 'user' ? "justify-end" : "justify-start"
                                            )}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {msg.role === 'assistant' && <span className="text-[10px]">•</span>}
                                                {msg.role === 'assistant' && <span>AI Powered</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-2 items-start animate-pulse">
                                        <div className="h-7 w-7 md:h-8 md:w-8 rounded-xl bg-muted flex items-center justify-center border">
                                            <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary/50" />
                                        </div>
                                        <div className="bg-muted/30 p-3 md:p-4 rounded-2xl border border-dashed flex gap-1.5 items-center h-10 md:h-12">
                                            <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-duration:0.6s]" />
                                            <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.15s]" />
                                            <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.3s]" />
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} className="h-2 md:h-4" />
                            </div>
                        </ScrollArea>

                        <div className="p-3 md:p-4 border-t bg-background/80 backdrop-blur-md sticky bottom-0 z-10">
                            {!hasKey ? (
                                <div className="text-center p-2 md:p-3 rounded-xl border border-warning/10 bg-warning/5 mb-3 md:mb-4 flex items-center justify-between shadow-inner">
                                    <p className="text-[9px] md:text-xs text-muted-foreground flex items-center gap-2">
                                        <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 bg-amber-500 rounded-full" />
                                        Key missing for {provider}
                                    </p>
                                    <Button variant="link" className="p-0 h-auto text-[9px] md:text-xs text-amber-600 font-bold hover:no-underline" onClick={() => window.location.href = '/dashboard/settings'}>
                                        Settings
                                    </Button>
                                </div>
                            ) : null}
                            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2 group">
                                <div className="absolute left-3 text-muted-foreground/30 group-focus-within:text-primary/50 transition-colors">
                                    <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                </div>
                                <Input
                                    placeholder="Your question..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={isTyping || !hasKey}
                                    className="bg-muted/20 pl-9 md:pl-10 pr-11 md:pr-12 h-10 md:h-12 border-primary/10 focus-visible:ring-primary/20 rounded-xl md:rounded-2xl shadow-inner text-sm transition-all"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute right-1 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl shadow-lg transition-transform active:scale-95"
                                    disabled={isTyping || !inputValue.trim() || !hasKey}
                                >
                                    <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                </Button>
                            </form>
                            <div className="flex justify-between items-center px-1 mt-2 md:mt-3 overflow-hidden">
                                <p className="text-[8px] md:text-[9px] text-muted-foreground opacity-60 truncate max-w-[70%]">
                                    Context: <b>{user?.farmInfo?.cropType || 'Crop'}</b> • <b>{latestReading?.soilMoisture?.toFixed(0)}%</b>
                                </p>
                                <Badge variant="outline" className="text-[7px] md:text-[8px] h-3.5 md:h-4 py-0 font-normal border-primary/10 tracking-widest uppercase bg-primary/5">
                                    Live
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Section */}
                <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
                    <Card className="border-primary/20 bg-primary/5 hover:bg-primary/[0.07] transition-colors relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 md:p-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Lightbulb className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                        </div>
                        <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base md:text-lg">Immediate Insights</CardTitle>
                            </div>
                            <CardDescription className="text-xs">
                                Threshold-based diagnostics.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 md:p-6 md:pt-0">
                            <div className="space-y-2 md:space-y-3">
                                {baseRecommendations.length > 0 ? (
                                    baseRecommendations.map((rec, i) => (
                                        <div key={i} className="flex items-start gap-2 md:gap-3 rounded-xl border bg-background p-2 md:p-3 shadow-sm hover:translate-x-1 transition-transform">
                                            <div className={cn(
                                                "mt-1.5 h-1.5 w-1.5 md:h-2 md:w-2 rounded-full shrink-0 animate-pulse",
                                                rec.priority === 'high' ? "bg-red-500" :
                                                    rec.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
                                            )} />
                                            <div className="min-w-0">
                                                <p className="text-[11px] md:text-sm font-semibold text-foreground leading-tight truncate">{rec.title}</p>
                                                <p className="text-[9px] md:text-xs text-muted-foreground mt-1 line-clamp-2 md:line-clamp-none">{rec.description}</p>
                                                <Badge variant="secondary" className="mt-1.5 text-[7px] md:text-[10px] px-1 md:px-1.5 h-3.5 md:h-5 uppercase tracking-tighter">
                                                    {rec.action}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-6 md:py-8 flex flex-col items-center justify-center text-center">
                                        <div className="h-8 w-8 md:h-10 md:w-10 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                                        </div>
                                        <p className="text-[10px] md:text-xs text-muted-foreground italic font-medium">All systems normal.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 shadow-sm overflow-hidden">
                        <CardHeader className="p-3 md:p-4 pb-1 md:pb-2 border-b bg-muted/20">
                            <CardTitle className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <RefreshCcw className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                Farm Context
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
                            <div className="grid grid-cols-2 gap-2 md:gap-4">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase">Crop</p>
                                    <p className="text-[11px] md:text-sm font-bold capitalize text-primary truncate">{user?.farmInfo?.cropType || 'Not set'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase">Soil</p>
                                    <p className="text-[11px] md:text-sm font-bold capitalize text-primary truncate">{user?.farmInfo?.soilType || 'Not set'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase">System</p>
                                    <p className="text-[11px] md:text-sm font-bold capitalize text-primary truncate">{user?.farmInfo?.irrigationMethod || 'Standard'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase">Moisture</p>
                                    <p className="text-[11px] md:text-sm font-bold text-blue-600 truncate">{latestReading?.soilMoisture?.toFixed(1)}%</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t mt-1 md:mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-[9px] md:text-xs h-7 md:h-9 hover:bg-primary/5 hover:text-primary border-primary/20 rounded-lg"
                                    onClick={() => window.location.href = '/dashboard/data-collection'}
                                >
                                    Modify Parameters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
