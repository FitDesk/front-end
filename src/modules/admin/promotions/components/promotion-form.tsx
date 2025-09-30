import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, Save, PlusCircle, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from '@/shared/components/ui/toast';
import { DayPicker } from 'react-day-picker';


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
import { cn } from '@/core/lib/utils';
import 'react-day-picker/dist/style.css';

interface PromotionFormProps {
  initialData?: CreatePromotionDTO | UpdatePromotionDTO;
  onSubmit: (data: CreatePromotionDTO | UpdatePromotionDTO) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

export function PromotionForm({ initialData, onSubmit, isSubmitting, onClose }: PromotionFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

  
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Formato no soportado',
        description: 'Por favor, sube una imagen en formato JPG, PNG o WebP',
        type: 'destructive',
      });
      return;
    }

  
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'La imagen no debe superar los 5MB',
        type: 'destructive',
      });
      return;
    }

   
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
     
      if (img.width < 400 || img.height < 200) {
        toast({
          title: 'Imagen muy pequeña',
          description: 'La imagen debe tener al menos 400x200 píxeles',
          type: 'destructive',
        });
        return;
      }

      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
       
        setValue('imageUrl', '');
      };
      reader.readAsDataURL(file);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast({
        title: 'Error al procesar la imagen',
        description: 'No se pudo cargar la imagen. Intenta con otro archivo.',
        type: 'destructive',
      });
    };
    
    img.src = objectUrl;
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const defaultValues = initialData || {
    title: '',
    description: '',
    price: 0,
    discount: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    imageUrl: '',
    isActive: true,
    target: 'all' as const,
    code: '',
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch, setError } = useForm<CreatePromotionDTO | UpdatePromotionDTO>({
    defaultValues,
  });

  const target = watch('target');
 
  
  
  React.useEffect(() => {
    if (initialData?.imageUrl) {
      
      if (initialData.imageUrl.startsWith('data:image') || initialData.imageUrl.startsWith('http')) {
        setPreviewImage(initialData.imageUrl);
      } else if (initialData.imageUrl) {
       
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        setPreviewImage(`${baseUrl}${initialData.imageUrl}`);
      }
    }
  }, [initialData]);

  const handleFormSubmit = (formData: CreatePromotionDTO | UpdatePromotionDTO) => {
  
    if (previewImage) {
    
      if (previewImage.startsWith('data:image')) {
        formData.imageUrl = previewImage;
      } 
      
      else if (!initialData || initialData.imageUrl !== previewImage) {
        formData.imageUrl = previewImage;
      }
    } 
    
    else if (!formData.imageUrl) {
      setError('imageUrl', { 
        type: 'manual', 
        message: 'Por favor, selecciona una imagen para la promoción' 
      });
      
      document.getElementById('image-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center' 
      });
      return;
    }

    
    if ('id' in formData && initialData && 'id' in initialData) {
      (formData as UpdatePromotionDTO).id = initialData.id;
    }
    
    
    const start = formData.startDate ? new Date(formData.startDate) : null;
    const end = formData.endDate ? new Date(formData.endDate) : null;
    
    if (start && end && start > end) {
      setError('endDate', {
        type: 'manual',
        message: 'La fecha de fin debe ser posterior a la de inicio',
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Image Section */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Imagen de la promoción</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image Preview */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-md border border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                {previewImage ? (
                  <>
                    <img 
                      src={previewImage} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Subir imagen</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            <div className="flex-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                {previewImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Formatos: JPG, PNG, WEBP. Máx. 5MB
              </p>
              {errors.imageUrl && !previewImage && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

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
            <Label htmlFor="price">Precio ($)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              {...register('price', {
                required: 'El precio es requerido',
                min: { value: 0, message: 'El precio no puede ser negativo' },
                valueAsNumber: true,
              })}
              className="w-full"
              placeholder="0.00"
            />
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Porcentaje de descuento (%)</Label>
            <Input
              id="discount"
              type="number"
              min={0}
              max={100}
              {...register('discount', {
                required: 'El descuento es requerido',
                min: { value: 0, message: 'El descuento no puede ser negativo' },
                max: { value: 100, message: 'El descuento no puede ser mayor a 100%' },
                valueAsNumber: true,
              })}
              className="w-full"
              placeholder="0"
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
          onClick={onClose}
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
