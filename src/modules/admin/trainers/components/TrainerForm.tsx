import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';
import { Loader2, Upload, X } from 'lucide-react';
import type { Trainer, TrainerFormData } from '../types';
import { TrainerSchema, GENDER_OPTIONS, STATUS_OPTIONS, CONTRACT_TYPE_OPTIONS, DAYS_OF_WEEK } from '../types';
import { useTrainers } from '../hooks/use-trainers';

interface TrainerFormProps {
  trainer?: Trainer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TrainerForm({ trainer, onSuccess, onCancel }: TrainerFormProps) {
  const { createTrainer, updateTrainer } = useTrainers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Usando sonner para notificaciones
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // TODO: Implementar manejo de certificaciones
  const [certifications, setCertifications] = useState<File[]>([]);
  const [certificationPreviews, setCertificationPreviews] = useState<string[]>([]);

  // Define default values with proper types
  const defaultValues: TrainerFormData = {
    firstName: '',
    lastName: '',
    documentNumber: '',
    birthDate: '',
    gender: 'MALE',
    phone: '',
    email: '',
    address: '',
    specialties: '',
    yearsOfExperience: 0,
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    contractType: 'FULL_TIME',
    salary: 0,
    availability: DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day.toLowerCase()]: false,
    }), {} as Record<string, boolean>),
  };

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(TrainerSchema) as any, // Type assertion needed due to zodResolver type mismatch
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = form;

  // Cargar datos del entrenador si está en modo edición
  useEffect(() => {
    if (trainer) {
      const formattedTrainer = {
        ...trainer,
        birthDate: trainer.birthDate ? trainer.birthDate.split('T')[0] : '',
        joinDate: trainer.joinDate ? trainer.joinDate.split('T')[0] : new Date().toISOString().split('T')[0],
      };
      reset(formattedTrainer);
      if (trainer.profileImage) {
        setPreviewImage(trainer.profileImage);
      }
    }
  }, [trainer, reset, setPreviewImage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, sube un archivo de imagen válido');
      return;
    }

    // Set the file to form data
    setValue('profileImage', file as unknown as string);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // TODO: Implementar lógica de subida de archivos
    // Por ahora, usamos una URL temporal para la vista previa
    setValue('profileImage', URL.createObjectURL(file));
    setIsUploading(false);
  };

  const handleCertificationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    if (newFiles.length === 0) {
      toast.error('Por favor, sube archivos de imagen o PDF');
      return;
    }

    // Crear vistas previas para las imágenes
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setCertificationPreviews(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setCertificationPreviews(prev => [...prev, '/pdf-icon.png']);
      }
    });

    setCertifications(prev => [...prev, ...newFiles]);
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i: number) => i !== index));
    setCertificationPreviews(prev => prev.filter((_, i: number) => i !== index));
  };

  const onSubmit = async (data: TrainerFormData) => {
    try {
      setIsSubmitting(true);
      const formDataObj = new FormData();
      
      // Append all form data to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'birthDate' && value instanceof Date) {
            formDataObj.append(key, value.toISOString().split('T')[0]);
          } else if (Array.isArray(value)) {
            // Handle array fields like specialties
            value.forEach((item, index) => {
              formDataObj.append(`${key}[${index}]`, item);
            });
          } else if (value instanceof File) {
            formDataObj.append(key, value);
          } else if (typeof value === 'object' && value !== null) {
            // Handle nested objects if any
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue !== undefined && nestedValue !== null) {
                formDataObj.append(`${key}.${nestedKey}`, nestedValue.toString());
              }
            });
          } else if (value !== undefined && value !== null) {
            formDataObj.append(key, value.toString());
          }
        }
      });

      // Handle profile photo
      if (previewImage) {
        formDataObj.append('profilePhoto', previewImage);
      }

      // Handle certifications
      certifications.forEach((file, index) => {
        formDataObj.append(`certifications[${index}]`, file);
      });

      if (trainer?.id) {
        await updateTrainer({
          id: trainer.id,
          data: formDataObj,
        });
      } else {
        await createTrainer(formDataObj);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar el entrenador:', error);
      toast.error('No se pudo guardar el entrenador');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      void handleSubmit(onSubmit)(e);
    }} className="space-y-6">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Guardando entrenador...</span>
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">Información Personal</h2>
          <p className="text-sm text-muted-foreground">
            Información básica del entrenador
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Nombres</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="Ingrese los nombres"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              {...form.register('lastName')}
              placeholder="Ingrese los apellidos"
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="documentNumber">DNI / Documento</Label>
            <Input
              id="documentNumber"
              {...form.register('documentNumber')}
              placeholder="Ingrese el número de documento"
            />
            {form.formState.errors.documentNumber && (
              <p className="text-sm text-red-500">
                {form.formState.errors.documentNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
            <Input
              id="birthDate"
              type="date"
              {...form.register('birthDate')}
            />
            {form.formState.errors.birthDate && (
              <p className="text-sm text-red-500">
                {form.formState.errors.birthDate.message}
              </p>
            )}
          </div>

          <div>
            <Label>Sexo</Label>
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.gender && (
              <p className="text-sm text-red-500">
                {form.formState.errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="Ingrese el teléfono"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="Ingrese el correo electrónico"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              {...form.register('address')}
              placeholder="Ingrese la dirección"
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Foto de Perfil (Opcional)</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    <Upload className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <Label
                  htmlFor="profileImage"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    'Subir Foto'
                  )}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Profesional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="specialties">Especialidades</Label>
            <Input
              id="specialties"
              {...form.register('specialties')}
              placeholder="Ej: Entrenamiento funcional, Hipertrofia, etc."
            />
            {form.formState.errors.specialties && (
              <p className="text-sm text-red-500">
                {form.formState.errors.specialties.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="yearsOfExperience">Años de Experiencia</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
              {...form.register('yearsOfExperience', { valueAsNumber: true })}
              placeholder="Años de experiencia"
            />
            {form.formState.errors.yearsOfExperience && (
              <p className="text-sm text-red-500">
                {form.formState.errors.yearsOfExperience.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Certificaciones</Label>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {certificationPreviews.map((preview: string, index: number) => (
                  <div key={index} className="relative">
                    <div className="h-20 w-20 rounded border border-gray-200 overflow-hidden">
                      {preview.startsWith('data:image') ? (
                        <img
                          src={preview}
                          alt={`Certificación ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <span className="text-xs text-gray-500">PDF</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                id="certifications"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleCertificationUpload}
              />
              <Label
                htmlFor="certifications"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4" />
                Subir Certificados
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Disponibilidad / Horarios</h3>
        <div className="space-y-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center space-x-4">
              <Controller
                name={`availability.${day.toLowerCase()}`}
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`available-${day}`}
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor={`available-${day}`} className="w-24">
                      {day}
                    </Label>
                  </div>
                )}
              />
              {form.watch(`availability.${day.toLowerCase()}`) && (
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    {...form.register(`startTime`)}
                    placeholder="Hora de inicio"
                  />
                  <Input
                    type="time"
                    {...form.register(`endTime`)}
                    placeholder="Hora de fin"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Administrativa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="joinDate">Fecha de Ingreso</Label>
            <Input
              id="joinDate"
              type="date"
              {...form.register('joinDate')}
            />
            {form.formState.errors.joinDate && (
              <p className="text-sm text-red-500">
                {form.formState.errors.joinDate.message}
              </p>
            )}
          </div>

          <div>
            <Label>Estado</Label>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Tipo de Contrato</Label>
            <Controller
              name="contractType"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="salary">Salario/Pago por Clase</Label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="salary"
                type="number"
                min="0"
                step="0.01"
                className="pl-7"
                {...form.register('salary', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
            {form.formState.errors.salary && (
              <p className="text-sm text-red-500">
                {form.formState.errors.salary.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="bankInfo">Información Bancaria (Opcional)</Label>
            <Input
              id="bankInfo"
              {...form.register('bankInfo')}
              placeholder="Ingrese la información bancaria"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Ingrese notas adicionales"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : trainer ? (
            'Actualizar Entrenador'
          ) : (
            'Crear Entrenador'
          )}
        </Button>
      </div>
    </form>
  );
}
