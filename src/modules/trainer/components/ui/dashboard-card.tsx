import { cn } from "@/core/lib/utils"
import { ArrowUp, ArrowDown } from "lucide-react"

type StatCardProps = {
  stat: {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    icon: any
    color: string
    bgColor: string
  }
  index: number
}

export function DashboardCard({ stat }: StatCardProps) {
  const Icon = stat.icon
  
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
          <h3 className="mt-1 text-2xl font-semibold">{stat.value}</h3>
          <div className={cn(
            "mt-2 flex items-center text-sm font-medium",
            stat.changeType === 'positive' ? 'text-green-600' : 
            stat.changeType === 'negative' ? 'text-red-600' : 'text-amber-600'
          )}>
            {stat.changeType === 'positive' ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : stat.changeType === 'negative' ? (
              <ArrowDown className="mr-1 h-4 w-4" />
            ) : null}
            {stat.change}
          </div>
        </div>
        <div className={cn("rounded-lg p-3", stat.bgColor)}>
          <Icon className={cn("h-6 w-6", stat.color)} />
        </div>
      </div>
      
      {/* Animated background decoration */}
      <div 
        className={cn(
          "absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-10",
          stat.bgColor.replace('bg-', 'bg-').replace('/10', '/20')
        )}
      />
    </div>
  )
}
