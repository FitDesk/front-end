import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"

type SystemStatusProps = {
  title?: string
  statusMessage?: string
  issues?: number
}

export function SystemStatus({ 
  title = "Estado del Sistema",
  statusMessage = "Tus servicios están funcionando correctamente",
  issues = 0
}: SystemStatusProps) {
  const hasIssues = issues > 0
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {hasIssues ? (
            <div className="flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
              <AlertCircle className="mr-1 h-4 w-4" />
              {issues} {issues === 1 ? 'problema' : 'problemas'}
            </div>
          ) : (
            <div className="flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Operativo
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {hasIssues 
              ? `Se detectaron ${issues} ${issues === 1 ? 'problema' : 'problemas'} que requieren atención.`
              : statusMessage}
          </p>
          
          <div className="pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Servicio de Clases</span>
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                <span>Operativo</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Base de Datos</span>
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                <span>Conectado</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sistema de Notificaciones</span>
              <div className="flex items-center">
                {hasIssues ? (
                  <>
                    <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />
                    <span>Parcial</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                    <span>Activo</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              <span>Actualizado hace unos segundos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
