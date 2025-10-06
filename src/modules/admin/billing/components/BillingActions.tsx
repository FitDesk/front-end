import { Button } from '@/shared/components/ui/button';
import { Plus, Download, RotateCw } from 'lucide-react';

interface BillingActionsProps {
  onExport: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function BillingActions({ onExport, onRefresh, loading = false }: BillingActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Actualizar
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Exportar
      </Button>
      
      <Button
        size="sm"
        className="flex items-center gap-2"
        disabled={loading}
      >
        <Plus className="h-4 w-4" />
        Nuevo Pago
      </Button>
    </div>
  );
}
