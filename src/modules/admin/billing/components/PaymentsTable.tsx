import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Payment } from '../types/billing.types';
import { useState } from 'react';
import { RefreshCw, Download, RotateCw, ArrowUpDown, FileText, CreditCard } from 'lucide-react';

type SortField = 'date' | 'amount' | 'memberName';
type SortOrder = 'asc' | 'desc';

interface PaymentsTableProps {
  payments: Payment[];
  loading: boolean;
  selectedPayments: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectPayment: (id: string) => void;
  onForceRenewal: (paymentId: string) => void;
  onRefund: (paymentId: string) => void;
  onViewInvoice: (paymentId: string) => void;
  onViewMemberDetails: (memberId: string) => void;
  onExport: () => void;
}

export function PaymentsTable({
  payments,
  loading,
  selectedPayments,
  onSelectAll,
  onSelectPayment,
  onForceRenewal,
  onRefund,
  onViewInvoice,
  onViewMemberDetails,
  onExport,
}: PaymentsTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'outline';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const sortedPayments = [...payments].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortField === 'memberName') {
      comparison = a.memberName.localeCompare(b.memberName);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedPayments.length > 0 && selectedPayments.length === payments.length}
            onCheckedChange={(checked) => onSelectAll(checked === true)}
            aria-label="Select all"
          />
          <span className="text-sm text-muted-foreground">
            {selectedPayments.length} de {payments.length} fila(s) seleccionada(s)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onExport} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  id="select-all-header"
                  checked={selectedPayments.length > 0 && selectedPayments.length === payments.length}
                  onCheckedChange={(checked) => onSelectAll(checked === true)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('memberName')}
              >
                <div className="flex items-center">
                  Miembro
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Método de Pago</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Monto
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Fecha
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Próxima Facturación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Cargando pagos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No se encontraron pagos
                </TableCell>
              </TableRow>
            ) : (
              sortedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={() => onSelectPayment(payment.id)}
                      aria-label={`Select payment ${payment.transactionId}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <button
                        onClick={() => onViewMemberDetails(payment.memberId)}
                        className="text-left hover:text-blue-600 hover:underline transition-colors"
                      >
                        <span className="font-semibold">{payment.memberName}</span>
                      </button>
                      <span className="text-xs text-muted-foreground">{payment.memberId}</span>
                    </div>
                  </TableCell>
                  <TableCell>{payment.subscriptionPlan}</TableCell>
                  <TableCell className="capitalize">
                    {payment.paymentMethod.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    ${payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.date), 'PPp', { locale: es })}
                  </TableCell>
                  <TableCell>
                    {payment.nextBillingDate ? (
                      format(new Date(payment.nextBillingDate), 'PP', { locale: es })
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewInvoice(payment.id)}
                        className="hover:bg-blue-50 hover:text-blue-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Factura
                      </Button>
                      {payment.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRefund(payment.id)}
                          className="hover:bg-red-50 hover:text-red-700"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Reembolsar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onForceRenewal(payment.id)}
                        disabled={payment.status === 'refunded'}
                        className="hover:bg-green-50 hover:text-green-700"
                        title="Forzar Renovación"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
