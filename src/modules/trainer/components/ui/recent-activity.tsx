import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Clock, UserPlus, Dumbbell, Calendar, MessageSquare } from "lucide-react"

type Activity = {
  id: number
  title: string
  time: string
  type?: 'user' | 'workout' | 'class' | 'message'
}

type RecentActivityProps = {
  title?: string
  activities?: Activity[]
}

export function RecentActivity({ 
  title = "Actividad Reciente",
  activities = [
    {
      id: 1,
      title: 'Nuevo alumno registrado',
      time: 'Hace 2 horas',
      type: 'user'
    },
    {
      id: 2,
      title: 'Clase de pesas completada',
      time: 'Hace 5 horas',
      type: 'class'
    },
    {
      id: 3,
      title: 'Rutina actualizada',
      time: 'Ayer',
      type: 'workout'
    },
    {
      id: 4,
      title: 'Nuevo mensaje de Carlos',
      time: 'Ayer',
      type: 'message'
    },
  ]
}: RecentActivityProps) {
  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'user':
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case 'workout':
        return <Dumbbell className="h-4 w-4 text-purple-500" />
      case 'class':
        return <Calendar className="h-4 w-4 text-green-500" />
      case 'message':
        return <MessageSquare className="h-4 w-4 text-amber-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mr-3 mt-0.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button className="text-sm font-medium text-primary hover:underline">
            Ver toda la actividad
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
