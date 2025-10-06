import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';

interface RefundDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  refundAmount: string;
  onRefundAmountChange: (value: string) => void;
  isProcessing: boolean;
}

export function RefundDialog({
  isOpen,
  onClose,
  onSubmit,
  refundAmount,
  onRefundAmountChange,
  isProcessing
}: RefundDialogProps) {
  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Procesar Reembolso</DialogTitle>
          <DialogDescription>
            Ingrese el monto a reembolsar. Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="refund-amount" className="text-right">
              Monto
            </Label>
            <Input
              id="refund-amount"
              type="number"
              step="0.01"
              min="0"
              value={refundAmount}
              onChange={(e) => onRefundAmountChange(e.target.value)}
              className="col-span-3"
              disabled={isProcessing}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isProcessing || !refundAmount}
          >
            {isProcessing ? (
              'Procesando...'
            ) : (
              'Procesar Reembolso'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
