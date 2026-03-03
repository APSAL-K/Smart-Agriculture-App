"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, FileText, Calendar, Heart, Plus } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export function QuickActions() {
    const actions = [
        {
            label: "Book Doctor",
            description: "Schedule appointment",
            icon: <Calendar className="h-5 w-5" />,
            color: "text-primary",
            href: "/dashboard/appointments",
            onClick: null
        },
        {
            label: "Upload Labs",
            description: "Add test results",
            icon: <Droplet className="h-5 w-5" />,
            color: "text-blue-500",
            href: "/dashboard/data-collection",
            onClick: null
        },
        {
            label: "View Reports",
            description: "Health analysis",
            icon: <FileText className="h-5 w-5" />,
            color: "text-green-500",
            href: "/dashboard/recommendations",
            onClick: null
        },
        {
            label: "Health Profile",
            description: "Update info",
            icon: <Heart className="h-5 w-5" />,
            color: "text-red-500",
            href: "/dashboard/data-collection",
            onClick: null
        }
    ]

    return (
        <Card className="border border-border/40 bg-card/80 backdrop-blur shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {actions.map((action, i) => (
                        <Link href={action.href} key={i}>
                            <Button
                                variant="ghost"
                                onClick={action.onClick}
                                className="w-full h-auto p-4 flex flex-col items-start gap-2 rounded-xl bg-muted/30 border border-border/50 transition-all hover:bg-muted hover:border-primary/30 hover:shadow-md active:scale-95"
                            >
                                <div className={`${action.color}`}>
                                    {action.icon}
                                </div>
                                <div className="text-left w-full">
                                    <p className="text-sm font-semibold">{action.label}</p>
                                    <p className="text-xs text-muted-foreground">{action.description}</p>
                                </div>
                            </Button>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
