import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pagos y Facturación</h1>
      </div>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="subscription">Suscripción</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-4">
          {/* Contenido de suscripción */}
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {/* Contenido de facturas */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
