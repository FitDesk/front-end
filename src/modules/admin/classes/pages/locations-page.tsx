import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Loader2, MapPin, Users, Filter, Edit, Trash2, Check, XCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Dialog, DialogContent } from '@/shared/components/animated/dialog';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useLocations } from '../hooks/use-locations';
import { LocationForm } from '../components/location-form';
import type { Location } from '../types/location';


function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const useToast = () => ({
  toast: (data: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    console[data.variant === 'destructive' ? 'error' : 'log'](`${data.title}: ${data.description}`);
  }
});

const StatusFilter = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

type StatusFilterType = keyof typeof StatusFilter;

export default function LocationsPage() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const filters = useMemo(() => ({
    searchTerm: debouncedSearchQuery || undefined,
    status: statusFilter !== 'ALL' ? statusFilter.toLowerCase() as 'active' | 'inactive' : undefined,
    page: currentPage,
    limit: 12, 
  }), [debouncedSearchQuery, statusFilter, currentPage]);
  
  const {
    locations,
    pagination,
    isLoading,
    error,
    createLocation,
    updateLocation,
    deleteLocation,
    toggleLocationStatus,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling
  } = useLocations(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value.toUpperCase() as StatusFilterType);
    setCurrentPage(1); 
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedLocation?.id) {
       
        const updateData = {
          id: selectedLocation.id,
          ...data
        };
        await updateLocation(updateData);
        toast({
          title: 'Ubicación actualizada',
          description: 'La ubicación ha sido actualizada correctamente',
        });
      } else {
     
        await createLocation(data);
        toast({
          title: 'Ubicación creada',
          description: 'La ubicación ha sido creada correctamente',
        });
      }
      setIsFormOpen(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la ubicación',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      console.error('No se proporcionó un ID para eliminar');
      return;
    }
    
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta ubicación? Esta acción no se puede deshacer.');
    
    if (!confirmDelete) return;
    
    try {
      console.log('Intentando eliminar ubicación con ID:', id);
      const success = await deleteLocation(id);
      
      if (success) {
        console.log('Ubicación eliminada exitosamente');
        toast({
          title: 'Ubicación eliminada',
          description: 'La ubicación ha sido eliminada correctamente',
        });
      } else {
        throw new Error('La eliminación de la ubicación no fue exitosa');
      }
    } catch (error) {
      console.error('Error al eliminar la ubicación:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar la ubicación',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (location: Location) => {
    if (!location.id) return;
    
    try {
      const updatedLocation = await toggleLocationStatus({ 
        id: location.id, 
        isActive: !location.isActive 
      });
      
      if (updatedLocation) {
        toast({
          title: 'Estado actualizado',
          description: `La ubicación ha sido ${!location.isActive ? 'activada' : 'desactivada'}`,
        });
      } else {
        throw new Error('Failed to update location status');
      }
    } catch (error) {
      console.error('Error toggling location status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la ubicación',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando ubicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader className="text-destructive">
          <CardTitle>Error al cargar las ubicaciones</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ubicaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las ubicaciones disponibles para tus clases
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedLocation(null);
            setIsFormOpen(true);
          }}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ubicación
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar ubicaciones..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Tabs 
                defaultValue="all" 
                className="w-full"
                onValueChange={handleStatusFilterChange}
              >
                <TabsList>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="active">Activas</TabsTrigger>
                  <TabsTrigger value="inactive">Inactivas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No se encontraron ubicaciones</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'ALL' 
                  ? "Intenta con otros términos de búsqueda o filtros" 
                  : "Comienza creando una nueva ubicación"}
              </p>
              {!searchQuery && statusFilter === 'ALL' && (
                <Button
                  onClick={() => {
                    setSelectedLocation(null);
                    setIsFormOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Ubicación
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((location: Location) => (
                <Card 
                  key={location.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{location.name}</h3>
                          <Badge 
                            variant={location.isActive ? 'default' : 'secondary'} 
                            className="mt-1"
                          >
                          {location.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Botón de activar/desactivar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(location);
                          }}
                          disabled={isToggling}
                          title={location.isActive ? 'Desactivar' : 'Activar'}
                          className="h-9 w-9 hover:bg-accent/50 rounded-md flex items-center justify-center focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
                        >
                          {location.isActive ? (
                            <XCircle className="h-4 w-4 text-destructive" />
                          ) : (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </Button>

                        {/* Botón de editar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLocation(location);
                            setIsFormOpen(true);
                          }}
                          title="Editar"
                          className="h-9 w-9 hover:bg-accent/50 rounded-md flex items-center justify-center focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* Botón de eliminar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(location.id);
                          }}
                          disabled={isDeleting}
                          title="Eliminar"
                          className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-md flex items-center justify-center focus:ring-2 focus:ring-destructive focus:ring-offset-2 z-10"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {location.description || 'Sin descripción'}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Capacidad: {location.capacity} personas</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          )}
        </CardContent>
        
        {/* Información de paginación */}
        {pagination && pagination.total > 0 && (
          <div className="p-4 border-t">
            <div className="text-sm text-muted-foreground text-center">
              <p>
                Mostrando {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}-{Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} ubicaciones
              </p>
            </div>
          </div>
        )}
      </Card>

    {isFormOpen && (
      <Dialog 
        open={isFormOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLocation(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {selectedLocation ? 'Editar Ubicación' : 'Nueva Ubicación'}
            </h2>
            <LocationForm
              initialData={selectedLocation}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedLocation(null);
              }}
              isSubmitting={isCreating || isUpdating}
            />
          </div>
        </DialogContent>
      </Dialog>
    )}
  </div>
);
}
