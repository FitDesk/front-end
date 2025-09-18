import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/animated/dialog';
import type { Plan } from './plans-columns';
import type { FormValues } from './plan-form';
import { PlanForm } from './plan-form';

type PlanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
};

export function PlanModal({
  open,
  onOpenChange,
  plan,
  onSubmit,
  isLoading,
}: PlanModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {plan ? 'Editar Plan' : 'Nuevo Plan'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <PlanForm
            plan={plan}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
