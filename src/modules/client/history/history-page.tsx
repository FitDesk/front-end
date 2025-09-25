import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Historial y Progreso</h1>
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="attendance">Asistencia</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          {/* Contenido de historial de asistencia */}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Contenido de seguimiento de progreso */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
