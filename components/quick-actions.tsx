"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Sprout, Bug, Calendar, Plus, Zap } from "lucide-react"
import { toast } from "sonner"

export function QuickActions() {
    const actions = [
        {
            label: "Irrigate Now",
            description: "Start 15min cycle",
            icon: <Droplets className="h-5 w-5" />,
            color: "bg-blue-500",
            onClick: () => toast.success("Manual irrigation cycle started. (Demo Mode)")
        },
        {
            label: "Add Fertilizer",
            description: "Log feeding event",
            icon: <Zap className="h-5 w-5" />,
            color: "bg-yellow-500",
            onClick: () => toast.success("Fertilizer application logged successfully.")
        },
        {
            label: "Pest Check",
            description: "Mark weekly check",
            icon: <Bug className="h-5 w-5" />,
            color: "bg-orange-500",
            onClick: () => toast.success("Pest inspection task marked as complete.")
        },
        {
            label: "Schedule",
            description: "Manage tasks",
            icon: <Calendar className="h-5 w-5" />,
            color: "bg-green-500",
            onClick: () => toast.info("Task scheduler opened. (Demo Mode)")
        }
    ]

    return (
        <Card className="border-none bg-card/60 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden mt-6">
            <CardHeader className="pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    Quick Farm Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action, i) => (
                        <Button
                            key={i}
                            variant="ghost"
                            onClick={action.onClick}
                            className="h-auto p-4 flex flex-col items-start gap-3 rounded-2xl bg-background/40 border border-primary/10 transition-all hover:bg-primary/5 hover:border-primary/30 hover:translate-y-[-2px] group"
                        >
                            <div className={`p-2 rounded-xl ${action.color}/20 text-white shadow-inner group-hover:scale-110 transition-transform`}>
                                <div className={`${action.color} p-2 rounded-lg shadow-lg`}>
                                    {action.icon}
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold tracking-tight">{action.label}</p>
                                <p className="text-[10px] font-medium text-muted-foreground">{action.description}</p>
                            </div>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
