import { useEffect, useState } from 'react';
import { useBillingStore } from '../store/billing.store';
import { BillingFilters } from '../components/BillingFilters';
import { PaymentsTable } from '../components/PaymentsTable';
import { BillingDashboard } from '../components/BillingDashboard';
import { OverdueMemberships } from '../components/OverdueMemberships';
import { MemberPaymentDetailsModal } from '../components/MemberPaymentDetailsModal';
import { Button } from '@/shared/components/ui/button';
import { Plus, Download, RotateCw } from 'lucide-react';
import { useToast } from '@/shared/components/ui/toast';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { sampleBillingMetrics, sampleOverdueMembers } from '../data/sample-data';

export default function BillingPage() {
  const { toast } = useToast();
  const {
    // Payments slice
    payments,
    loading,
    error,
    pagination,
    selectedPayments,
    fetchPayments,
    togglePaymentSelection,
    selectAllPayments,
    forceRenewal,
    processRefund,
    exportPayments,
    // Member slice
    selectedMember,
    isMemberModalOpen,
    memberLoading,
    openMemberModal,
    closeMemberModal,
  } = useBillingStore();

  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('resumen');

  
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);


  useEffect(() => {
    if (error) {
      toast({
        type: 'destructive',
        title: 'Error',
        description: error,
      });
    }
  }, [error, toast]);

  const handlePageChange = (page: number) => {
    fetchPayments({ page });
  };

  const handleForceRenewal = async (paymentId: string) => {
    try {
      await forceRenewal(paymentId);
      toast({
        type: 'success',
        title: 'Éxito',
        description: 'La renovación se ha forzado exitosamente.',
      });
    } catch (err) {
      const error = err as Error;
      toast({
        type: 'destructive',
        title: 'Error',
        description: error.message || 'Error al forzar la renovación. Por favor, inténtalo de nuevo.',
      });
    }
  };

  const handleRefundClick = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (payment) {
      setSelectedPaymentId(paymentId);
      setRefundAmount(payment.amount.toString());
      setRefundDialogOpen(true);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedPaymentId) return;
    
    setIsProcessing(true);
    try {
      const amount = parseFloat(refundAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Por favor, ingresa un monto de reembolso válido');
      }
      
      await processRefund(selectedPaymentId, amount);
      
      toast({
        type: 'success',
        title: 'Éxito',
        description: 'El reembolso se ha procesado exitosamente.',
      });
      setRefundDialogOpen(false);
    } catch (err) {
      const error = err as Error;
      toast({
        type: 'destructive',
        title: 'Error',
        description: error.message || 'Error al procesar el reembolso. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportPayments();
      toast({
        title: 'Exportación iniciada',
        description: 'Tu exportación comenzará en breve.',
      });
    } catch (error) {
      toast({
        type: 'destructive',
        title: 'Error en la exportación',
        description: 'Error al iniciar la exportación. Por favor, inténtalo de nuevo.',
      });
    }
  };

  const handleViewInvoice = (_paymentId: string) => {
    toast({
      title: 'Abriendo Factura',
      description: 'Se está abriendo la factura en una nueva ventana.',
    });
    // Aquí se abriría la factura en una nueva ventana o modal
  };

  const handleCollectPayment = (_memberId: string) => {
    toast({
      title: 'Mensaje Enviado',
      description: 'Se ha enviado un mensaje de cobro al miembro.',
    });
    // Aquí se enviaría el mensaje de cobro al backend
  };

  const handleViewMemberDetails = (memberId: string) => {
    openMemberModal(memberId);
  };

  const handleSendReminders = () => {
    toast({
      title: 'Recordatorios Enviados',
      description: `Se han enviado ${sampleOverdueMembers.length} recordatorios de pago.`,
    });
    // Aquí se enviarían los recordatorios al backend
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Facturación</h1>
          <p className="text-muted-foreground">
            Ver y gestionar pagos, renovaciones y reembolsos de miembros
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pago
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resumen" className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-blue-500 to-blue-600"></div>
            Resumen
          </TabsTrigger>
          <TabsTrigger value="pagos" className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-green-500 to-green-600"></div>
            Pagos
          </TabsTrigger>
          <TabsTrigger value="vencidos" className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-red-500 to-red-600"></div>
            Vencidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <BillingDashboard metrics={sampleBillingMetrics} loading={loading} />
        </TabsContent>

        <TabsContent value="pagos" className="space-y-4">
          <BillingFilters />
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <PaymentsTable
              payments={payments}
              loading={loading}
              selectedPayments={selectedPayments}
              onSelectAll={(checked) => selectAllPayments(checked)}
              onSelectPayment={togglePaymentSelection}
              onForceRenewal={handleForceRenewal}
              onRefund={handleRefundClick}
              onViewInvoice={handleViewInvoice}
              onViewMemberDetails={handleViewMemberDetails}
              onExport={handleExport}
            />
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}
                </span>{' '}
                de <span className="font-medium">{pagination.totalItems}</span> pagos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || loading}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vencidos" className="space-y-6">
          <OverdueMemberships
            members={sampleOverdueMembers}
            loading={loading}
            onCollectPayment={handleCollectPayment}
            onViewDetails={handleViewMemberDetails}
            onSendReminders={handleSendReminders}
          />
        </TabsContent>
      </Tabs>

      {/* Member Details Modal */}
      <MemberPaymentDetailsModal
        member={selectedMember}
        isOpen={isMemberModalOpen}
        onClose={closeMemberModal}
        loading={memberLoading}
      />

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procesar Reembolso</DialogTitle>
            <DialogDescription>
              Ingresa el monto a reembolsar para este pago.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="refund-amount" className="text-right">
                Monto
              </Label>
              <div className="relative col-span-3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="refund-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="pl-7"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRefundDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleProcessRefund}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Procesar Reembolso'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
