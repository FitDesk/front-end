import { memo, useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/shared/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { DeleteAccountDTOSchema } from '@/core/zod';
import { useDeleteAccount } from '../../hooks/use-configuration';
import type { DeleteAccountDTO } from '../../types';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const deletionReasons = [
  { value: 'no_longer_needed', label: 'Ya no necesito el servicio' },
  { value: 'switching_jobs', label: 'Cambio de trabajo' },
  { value: 'privacy_concerns', label: 'Preocupaciones de privacidad' },
  { value: 'dissatisfaction', label: 'Insatisfacción con el servicio' },
  { value: 'technical_issues', label: 'Problemas técnicos' },
  { value: 'other', label: 'Otro motivo' },
];

const DeleteAccountModal = memo(({ open, onClose }: DeleteAccountModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  
  const deleteAccountMutation = useDeleteAccount();

  // ✅ React Hook Form con validación Zod automática
  const form = useForm<DeleteAccountDTO>({
    resolver: zodResolver(DeleteAccountDTOSchema),
    defaultValues: {
      password: '',
      reason: '',
      feedback: '',
    },
  });

  const handleSubmit = async (data: DeleteAccountDTO) => {
    if (!confirmationChecked) return; // Verificar confirmación adicional

    try {
      await deleteAccountMutation.mutateAsync({
        password: data.password,
        reason: data.reason,
        feedback: data.feedback?.trim() || undefined,
      });
      
      form.reset(); // ✅ Limpia el formulario automáticamente
      setConfirmationChecked(false);
      onClose();
    } catch (error) {
      // Error manejado por TanStack Query
    }
  };

  const handleClose = () => {
    if (!deleteAccountMutation.isPending) {
      form.reset(); // ✅ Limpia el formulario con react-hook-form
      setConfirmationChecked(false);
      onClose();
    }
  };

  const isFormValid = form.formState.isValid && confirmationChecked;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg p-2 bg-red-500/10">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                Eliminar Cuenta
              </DialogTitle>
            </DialogHeader>

            {/* Warning */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400">
                    Esta acción es permanente e irreversible
                  </p>
                  <p className="text-xs text-red-300 mt-1">
                    Todos tus datos, configuraciones y contenido serán eliminados permanentemente
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Form con react-hook-form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                
                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirma tu contraseña *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña actual"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reason Selection */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo de eliminación *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deletionReasons.map((reasonOption) => (
                            <SelectItem key={reasonOption.value} value={reasonOption.value}>
                              {reasonOption.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Feedback */}
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentarios adicionales (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Comparte cualquier comentario que pueda ayudarnos a mejorar..."
                          rows={3}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirmation Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <Checkbox
                    id="confirmation"
                    checked={confirmationChecked}
                    onCheckedChange={(checked) => setConfirmationChecked(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="confirmation" className="text-sm font-medium text-foreground cursor-pointer">
                      Entiendo que esta acción es irreversible
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confirmo que deseo eliminar permanentemente mi cuenta y todos los datos asociados
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={deleteAccountMutation.isPending}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid || deleteAccountMutation.isPending}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {deleteAccountMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Cuenta
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
});

DeleteAccountModal.displayName = 'DeleteAccountModal';

export { DeleteAccountModal };
