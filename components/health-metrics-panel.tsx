'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Droplet, Heart, Brain, Apple } from 'lucide-react'

interface HealthMetric {
  label: string
  value: string
  status: 'normal' | 'warning' | 'critical'
  icon: React.ReactNode
  range: string
}

const healthMetrics: HealthMetric[] = [
  {
    label: 'Albumin Level',
    value: '3.8',
    status: 'normal',
    icon: <Droplet className="h-4 w-4" />,
    range: '(3.5-5.0 g/dL)',
  },
  {
    label: 'Platelet Count',
    value: '220',
    status: 'normal',
    icon: <Heart className="h-4 w-4" />,
    range: '(150-400 K/μL)',
  },
  {
    label: 'INR (PT)',
    value: '1.0',
    status: 'normal',
    icon: <Brain className="h-4 w-4" />,
    range: '(0.8-1.1)',
  },
  {
    label: 'Glucose Level',
    value: '95',
    status: 'normal',
    icon: <Apple className="h-4 w-4" />,
    range: '(70-100 mg/dL)',
  },
]

export function HealthMetricsPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base md:text-lg">Recent Health Metrics</CardTitle>
            <CardDescription>Latest lab work results</CardDescription>
          </div>
          <Activity className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthMetrics.map((metric, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">{metric.icon}</div>
                <div>
                  <p className="text-sm font-semibold">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.range}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{metric.value}</p>
                <Badge
                  className={
                    metric.status === 'normal'
                      ? 'bg-green-100 text-green-800'
                      : metric.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }
                >
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
