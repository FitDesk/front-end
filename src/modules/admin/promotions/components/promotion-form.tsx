import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, Save, PlusCircle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

// Estilos personalizados para el DayPicker
const dayPickerStyles = {
  root: 'm-0 p-0',
  months: 'm-0 p-0',
  month: 'm-0 p-0',
  table: 'm-0 p-0',
  head_cell: 'text-muted-foreground text-xs font-normal p-1',
  cell: 'p-1',
  day: 'h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground',
  day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
  day_today: 'bg-accent text-accent-foreground',
  day_disabled: 'text-muted-foreground/50',
  day_outside: 'text-muted-foreground/30',
  day_hidden: 'invisible',
  nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
  nav_button_previous: 'absolute left-1',
  nav_button_next: 'absolute right-1',
};

import type { CreatePromotionDTO, UpdatePromotionDTO } from '../types/promotion';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

interface PromotionFormProps {
  initialData?: CreatePromotionDTO | UpdatePromotionDTO;
  onSubmit: (data: CreatePromotionDTO | UpdatePromotionDTO) => void;
  isSubmitting: boolean;
  setIsDialogOpen?: (open: boolean) => void;
}

export function PromotionForm({ initialData, onSubmit, isSubmitting, setIsDialogOpen }: PromotionFormProps) {
  const defaultValues = initialData || {
    title: '',
    description: '',
    discount: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    isActive: true,
    target: 'all' as const,
    code: '',
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreatePromotionDTO | UpdatePromotionDTO>({
    defaultValues,
  });

  const target = watch('target');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Sección de información básica */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la promoción</Label>
            <Input
              id="title"
              {...register('title', { required: 'El título es requerido' })}
              placeholder="Ej: Oferta de verano"
              className="w-full"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Código de descuento</Label>
            <Input
              id="code"
              {...register('code', { required: 'El código es requerido' })}
              placeholder="Ej: VERANO2023"
              className="w-full"
            />
            {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}
          </div>
        </div>

        {/* Descuento y Destinatarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="discount">Porcentaje de descuento</Label>
            <Input
              id="discount"
              type="number"
              min={0}
              max={100}
              {...register('discount', {
                required: 'El descuento es requerido',
                min: { value: 0, message: 'El descuento no puede ser negativo' },
                max: { value: 100, message: 'El descuento no puede ser mayor a 100%' },
              })}
              className="w-full"
            />
            {errors.discount && <p className="text-sm text-red-500 mt-1">{errors.discount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Destinatarios</Label>
            <Select
              value={target}
              onValueChange={(value: string) => setValue('target', value as 'all' | 'members' | 'trainers')}
            >
              <SelectTrigger className="w-full h-11 border-input">
                <SelectValue placeholder="Selecciona los destinatarios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los usuarios</SelectItem>
                <SelectItem value="members">Solo miembros</SelectItem>
                <SelectItem value="trainers">Solo entrenadores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sección de fechas */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Período de Vigencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium text-foreground">Fecha de inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 border-input hover:bg-accent/50 transition-colors",
                    !watch('startDate') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('startDate') ? format(new Date(watch('startDate') as string), 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="bg-card text-card-foreground rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-4 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentDate = watch('startDate') ? new Date(watch('startDate') as string) : new Date();
                          const newDate = subMonths(currentDate, 1);
                          setValue('startDate', format(newDate, 'yyyy-MM-dd'));
                        }}
                        className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent/50"
                        aria-label="Mes anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium">
                        {watch('startDate') 
                          ? format(new Date(watch('startDate') as string), 'MMMM yyyy', { locale: es })
                          : format(new Date(), 'MMMM yyyy', { locale: es })}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentDate = watch('startDate') ? new Date(watch('startDate') as string) : new Date();
                          const newDate = addMonths(currentDate, 1);
                          setValue('startDate', format(newDate, 'yyyy-MM-dd'));
                        }}
                        className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent/50"
                        aria-label="Siguiente mes"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <DayPicker
                      mode="single"
                      selected={watch('startDate') ? new Date(watch('startDate') as string) : undefined}
                      onSelect={(date: Date | undefined) => setValue('startDate', date ? format(date, 'yyyy-MM-dd') : '')}
                      disabled={{ before: new Date() }}
                      className="rounded-md border p-3"
                      classNames={{
                        ...dayPickerStyles,
                        day_disabled: 'text-muted-foreground/30',
                        day_outside: 'text-muted-foreground/30',
                      }}
                      showOutsideDays
                      fixedWeeks
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-foreground">Fecha de fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!watch('startDate')}
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 border-input hover:bg-accent/50 transition-colors",
                    !watch('endDate') && "text-muted-foreground",
                    !watch('startDate') && "opacity-70 cursor-not-allowed"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('endDate') ? format(new Date(watch('endDate') as string), 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="bg-card text-card-foreground rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-4 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentDate = watch('endDate') ? new Date(watch('endDate') as string) : new Date();
                          const newDate = subMonths(currentDate, 1);
                          setValue('endDate', format(newDate, 'yyyy-MM-dd'));
                        }}
                        className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent/50"
                        aria-label="Mes anterior"
                        disabled={!watch('startDate')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium">
                        {watch('endDate') 
                          ? format(new Date(watch('endDate') as string), 'MMMM yyyy', { locale: es })
                          : format(new Date(), 'MMMM yyyy', { locale: es })}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentDate = watch('endDate') ? new Date(watch('endDate') as string) : new Date();
                          const newDate = addMonths(currentDate, 1);
                          setValue('endDate', format(newDate, 'yyyy-MM-dd'));
                        }}
                        className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-accent/50"
                        aria-label="Siguiente mes"
                        disabled={!watch('startDate')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <DayPicker
                      mode="single"
                      selected={watch('endDate') ? new Date(watch('endDate') as string) : undefined}
                      onSelect={(date: Date | undefined) => setValue('endDate', date ? format(date, 'yyyy-MM-dd') : '')}
                      disabled={watch('startDate') ? { before: new Date(watch('startDate') as string) } : { before: new Date() }}
                      className="rounded-md border p-3"
                      classNames={{
                        ...dayPickerStyles,
                        day_disabled: 'text-muted-foreground/30',
                        day_outside: 'text-muted-foreground/30',
                      }}
                      showOutsideDays
                      fixedWeeks
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>}
          </div>
        </div>
      </div>

      {/* Sección de descripción */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Detalles Adicionales</h3>
        <div className="space-y-4">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            {...register('description', { required: 'La descripción es requerida' })}
            placeholder="Describe los detalles de la promoción"
            rows={3}
            className="w-full"
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {/* Estado */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Estado de la Promoción</h3>
            <p className="text-sm text-muted-foreground">
              {watch('isActive') 
                ? 'La promoción está actualmente activa y visible para los usuarios.'
                : 'La promoción está inactiva y no será visible para los usuarios.'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">
              {watch('isActive') ? 'Activa' : 'Inactiva'}
            </span>
            <Switch
              id="isActive"
              checked={watch('isActive') as boolean}
              onCheckedChange={(checked: boolean) => setValue('isActive', checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setIsDialogOpen?.(false)}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="min-w-[180px] bg-primary hover:bg-primary/90 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : initialData ? (
            <span className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Actualizar promoción
            </span>
          ) : (
            <span className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear promoción
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
