"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, AlertCircle, CheckCircle2, Bell } from "lucide-react"
import type { Alert } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif text-base sm:text-lg">
              <Bell className="h-4 w-4" />
              Alerts
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Active sensor alerts
            </CardDescription>
          </div>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {alerts.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <ScrollArea className="h-[200px] pr-3 sm:h-[260px] sm:pr-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center sm:py-10">
              <CheckCircle2 className="mb-3 h-8 w-8 text-primary/50 sm:h-10 sm:w-10" />
              <p className="text-sm font-medium text-foreground">All clear</p>
              <p className="text-xs text-muted-foreground">
                No active alerts at this time
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function AlertItem({ alert }: { alert: Alert }) {
  const isCritical = alert.severity === "critical"

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-3 transition-colors",
        isCritical
          ? "border-destructive/30 bg-destructive/5"
          : "border-border bg-card"
      )}
    >
      <div className="mt-0.5 shrink-0">
        {isCritical ? (
          <AlertCircle className="h-4 w-4 text-destructive" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-accent" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium leading-snug text-foreground sm:text-sm">
          {alert.message}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge
            variant={isCritical ? "destructive" : "secondary"}
            className="text-[10px]"
          >
            {alert.severity}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  )
}
