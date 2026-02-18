"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <Bell className="h-4 w-4" />
              Alerts
            </CardTitle>
            <CardDescription>Active sensor alerts</CardDescription>
          </div>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {alerts.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[260px] pr-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="mb-3 h-10 w-10 text-primary/50" />
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
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug text-foreground">
            {alert.message}
          </p>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
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
