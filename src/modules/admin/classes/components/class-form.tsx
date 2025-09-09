import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/shared/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';

import { 
  DURATION_OPTIONS, 
  ClassSchema,
  type Class, 
  type CreateClassDTO, 
  type DayOfWeek
} from '../types/class';
import { useTrainers } from '../../trainers/hooks/use-trainers';
import { useLocations } from '../hooks/use-locations';

export type ClassFormValues = Omit<CreateClassDTO, 'id' | 'createdAt' | 'updatedAt' | 'dayOfWeek' | 'startTime'> & {
  date: Date;
  time: string;
  name: string;
  trainerId: string;
  location: string;
  duration: number;
  isActive: boolean;
  description?: string;
};

type ClassFormProps = {
  initialData?: Class | null;
  onSubmit: (data: CreateClassDTO) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

export function ClassForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: ClassFormProps) {
  const { trainers = [], isLoading: isLoadingTrainers, error: trainersError } = useTrainers();
  const { locations = [], isLoading: isLoadingLocations } = useLocations();
  
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(ClassSchema as any),
    defaultValues: initialData ? {
      ...initialData,
      date: new Date(initialData.startTime ? parseISO(initialData.startTime) : addDays(new Date(), 1)),
      time: initialData.startTime ? format(parseISO(initialData.startTime), 'HH:mm') : '09:00',
    } : {
      name: '',
      description: '',
      trainerId: '',
      location: '',
      date: new Date(),
      time: '09:00',
      duration: 60,
      isActive: true,
    },
  });

  const handleFormSubmit = (formData: ClassFormValues) => {
    const [hours, minutes] = formData.time.split(':').map(Number);
    const startTime = new Date(formData.date);
    startTime.setHours(hours, minutes, 0, 0);

    const selectedLocation = locations.find(loc => loc.id === formData.location);
    
    if (!selectedLocation) {
      console.error('No se encontró la ubicación seleccionada');
      return;
    }

    
    const classData: CreateClassDTO = {
      ...formData,
      startTime: startTime.toISOString(),
      dayOfWeek: getDayOfWeek(startTime.getDay()),
      capacity: selectedLocation.capacity,
    };


    delete (classData as any).date;
    delete (classData as any).time;

    onSubmit(classData);
  };

  const getDayOfWeek = (day: number): DayOfWeek => {
    const days: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day];
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 21; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
  };

  const selectedLocation = locations.find(loc => loc.id === form.watch('location'));
  const capacity = selectedLocation?.capacity || 0;

 
  const renderFormButtons = () => (
    <div className="flex justify-end space-x-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Clase' : 'Crear Clase'}
      </Button>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Clase</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Yoga Matutino" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trainerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entrenador</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un entrenador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingTrainers ? (
                      <div className="p-2 text-sm text-muted-foreground">Cargando entrenadores...</div>
                    ) : trainersError ? (
                      <div className="p-2 text-sm text-destructive">Error cargando entrenadores</div>
                    ) : Array.isArray(trainers) && trainers.length > 0 ? (
                      trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id || ''}>
                          {`${trainer.firstName || ''} ${trainer.lastName || ''}`.trim()}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">No hay entrenadores disponibles</div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select
                      disabled={isLoadingLocations || locations.length === 0}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            placeholder={
                              locations.length === 0 
                                ? 'No hay ubicaciones disponibles' 
                                : 'Selecciona una ubicación'
                            } 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No hay ubicaciones disponibles
                          </div>
                        ) : (
                          locations.map((location) => (
                            <SelectItem 
                              key={location.id} 
                              value={location.id || ''}
                              disabled={!location.isActive}
                            >
                              {location.name}
                              {!location.isActive && ' (Inactiva)'}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Gestionar ubicaciones"
                    onClick={() => {
                      window.location.href = '/admin/locations';
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Capacidad Máxima</FormLabel>
            <Input 
              type="number"
              readOnly
              value={capacity}
              className="bg-muted/50"
            />
            <FormDescription>
              La capacidad se establece según la ubicación seleccionada
            </FormDescription>
          </FormItem>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de la Clase</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={"w-full pl-3 text-left font-normal"}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background" align="start">
                    <div className="space-y-4 p-4">
                      <div className="flex items-center justify-between px-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 text-foreground/80 hover:text-foreground hover:bg-accent/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            const date = new Date(field.value || new Date());
                            date.setMonth(date.getMonth() - 1);
                            field.onChange(date);
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-foreground">
                          {field.value ? format(field.value, 'MMMM yyyy', { locale: es }) : ''}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 text-foreground/80 hover:text-foreground hover:bg-accent/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            const date = new Date(field.value || new Date());
                            date.setMonth(date.getMonth() + 1);
                            field.onChange(date);
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        locale={es}
                        className="rounded-md border-0"
                        classNames={{
                          months: "w-full",
                          month: "w-full space-y-4",
                          caption: "hidden",
                          caption_label: "sr-only",
                          nav: "hidden",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex justify-between",
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-sm",
                          row: "flex w-full mt-2 justify-between",
                          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center text-foreground",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground font-medium",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible"
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Inicio</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (minutos)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la duración" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DURATION_OPTIONS.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Clase Activa
                  </FormLabel>
                  <FormDescription>
                    Las clases inactivas no serán visibles para los usuarios
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descripción de la clase, requisitos, nivel, etc." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {renderFormButtons()}
      </form>
    </Form>
  );
}
