import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'

type RevenueChartProps = {
  title?: string
  subtitle?: string
  data?: Array<{ name: string; value: number }>
}

export function RevenueChart({ 
  title = "Progreso de Alumnos", 
  subtitle = "Rendimiento general de la semana",
  data = [
    { name: 'Lun', value: 4000 },
    { name: 'Mar', value: 3000 },
    { name: 'Mié', value: 2000 },
    { name: 'Jue', value: 2780 },
    { name: 'Vie', value: 1890 },
    { name: 'Sáb', value: 2390 },
    { name: 'Dom', value: 3490 },
  ]
}: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="h-[300px] p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
