import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PlusCircle, Dumbbell, Calendar as CalendarIcon } from "lucide-react"

type Action = {
  label: string
  onClick: () => void
  icon?: React.ReactNode
}

type QuickActionsProps = {
  title?: string
  actions?: Action[]
}

export function QuickActions({ 
  title = "Acciones Rápidas",
  actions = [
    { 
      label: 'Agregar Alumno', 
      onClick: () => console.log('Agregar alumno'),
      icon: <PlusCircle className="h-4 w-4 mr-2" />
    },
    { 
      label: 'Crear Rutina', 
      onClick: () => console.log('Crear rutina'),
      icon: <Dumbbell className="h-4 w-4 mr-2" />
    },
    { 
      label: 'Programar Clase', 
      onClick: () => console.log('Programar clase'),
      icon: <CalendarIcon className="h-4 w-4 mr-2" />
    },
  ] 
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start"
            onClick={action.onClick}
          >
            {action.icon || <PlusCircle className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
