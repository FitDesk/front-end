import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Clases</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar clases..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="upcoming">Mis Clases</TabsTrigger>
          <TabsTrigger value="available">Buscar Clases</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {/* Contenido de clases programadas */}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {/* Contenido de búsqueda de clases */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
