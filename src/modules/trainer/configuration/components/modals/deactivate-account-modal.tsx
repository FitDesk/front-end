import { memo } from 'react';
import { motion } from 'motion/react';
import { UserX, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
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
import { DeactivateAccountDTOSchema } from '@/core/zod';
import { useDeactivateAccount } from '../../hooks/use-configuration';
import type { DeactivateAccountDTO } from '../../types';

interface DeactivateAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const deactivationReasons = [
  { value: 'temporary_break', label: 'Descanso temporal' },
  { value: 'personal_issues', label: 'Problemas personales' },
  { value: 'health_issues', label: 'Problemas de salud' },
  { value: 'schedule_conflicts', label: 'Conflictos de horario' },
  { value: 'dissatisfaction', label: 'Insatisfacción con el servicio' },
  { value: 'other', label: 'Otro motivo' },
];

const DeactivateAccountModal = memo(({ open, onClose }: DeactivateAccountModalProps) => {
  const deactivateAccountMutation = useDeactivateAccount();

  // ✅ React Hook Form con validación Zod automática
  const form = useForm<DeactivateAccountDTO>({
    resolver: zodResolver(DeactivateAccountDTOSchema),
    defaultValues: {
      reason: '',
      feedback: '',
    },
  });

  const handleSubmit = async (data: DeactivateAccountDTO) => {
    try {
      await deactivateAccountMutation.mutateAsync({
        reason: data.reason,
        feedback: data.feedback?.trim() || undefined,
      });
      
      form.reset(); // ✅ Limpia el formulario automáticamente
      onClose();
    } catch (error) {
      // Error manejado por TanStack Query
    }
  };

  const handleClose = () => {
    if (!deactivateAccountMutation.isPending) {
      form.reset(); // ✅ Limpia el formulario con react-hook-form
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
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
                <div className="rounded-lg p-2 bg-orange-500/10">
                  <UserX className="h-6 w-6 text-orange-500" />
                </div>
                Desactivar Cuenta
              </DialogTitle>
            </DialogHeader>

            {/* Warning */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-400">
                    Tu cuenta será desactivada temporalmente
                  </p>
                  <p className="text-xs text-orange-300 mt-1">
                    Podrás reactivarla contactando al administrador del sistema
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Form con react-hook-form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                
                {/* Reason Selection */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo de desactivación *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deactivationReasons.map((reasonOption) => (
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

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={deactivateAccountMutation.isPending}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || deactivateAccountMutation.isPending}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {deactivateAccountMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Desactivando...
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Desactivar Cuenta
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

DeactivateAccountModal.displayName = 'DeactivateAccountModal';

export { DeactivateAccountModal };
