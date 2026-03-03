'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

const liverEnzymeData = [
  { week: 'Week 1', ALT: 42, AST: 38, ALP: 72, bilirubin: 0.8 },
  { week: 'Week 2', ALT: 45, AST: 41, ALP: 75, bilirubin: 0.85 },
  { week: 'Week 3', ALT: 48, AST: 43, ALP: 78, bilirubin: 0.9 },
  { week: 'Week 4', ALT: 46, AST: 40, ALP: 76, bilirubin: 0.87 },
  { week: 'Week 5', ALT: 44, AST: 39, ALP: 74, bilirubin: 0.83 },
  { week: 'Week 6', ALT: 41, AST: 37, ALP: 71, bilirubin: 0.79 },
]

export function LiverEnzymesChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base md:text-lg">Liver Enzyme Levels</CardTitle>
            <CardDescription>ALT, AST, ALP, and Bilirubin trends</CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={liverEnzymeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ALT"
              stroke="hsl(335 45% 15%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(335 45% 15%)', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="AST"
              stroke="hsl(160 60% 40%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(160 60% 40%)', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="ALP"
              stroke="hsl(38 92% 50%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(38 92% 50%)', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="bilirubin"
              stroke="hsl(280 60% 45%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(280 60% 45%)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
