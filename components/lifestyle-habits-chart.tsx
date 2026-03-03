'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'

const lifestyleData = [
  { name: 'Healthy Days', value: 18, fill: 'hsl(160 60% 40%)' },
  { name: 'Moderate Days', value: 8, fill: 'hsl(38 92% 50%)' },
  { name: 'High Risk Days', value: 4, fill: 'hsl(0 84% 60%)' },
]

export function LifestyleHabitsChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base md:text-lg">Lifestyle Compliance</CardTitle>
            <CardDescription>Last 30 days activity tracking</CardDescription>
          </div>
          <Activity className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={lifestyleData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {lifestyleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} days`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
