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

// Definir el tipo para los detalles del miembro
export interface MemberDetails {
  id: string;
  memberId: string;
  memberName: string;
  email: string;
  phone?: string;
  planName: string;
  planPrice: number;
  joinDate: string;
  lastPaymentDate: string;
  nextBillingDate: string;
  totalPayments: number;
  totalAmount: number;
  status: 'active' | 'overdue' | 'suspended' | 'cancelled';
  paymentHistory: Array<{
    id: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    paymentMethod: string;
    transactionId: string;
    date: string;
    subscriptionPlan: string;
  }>;
}

export default function BillingPage() {
  const { toast } = useToast();
  const {
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
    billingMetrics,
    overdueMembers,
  } = useBillingStore();

  // Estado local para manejar el miembro seleccionado
  const [selectedMember, setSelectedMember] = useState<MemberDetails | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);

  // Funciones para manejar el modal del miembro
  const openMemberModal = (memberId: string) => {
    setMemberLoading(true);
    // Aquí iría la lógica para cargar los detalles del miembro desde la API
    // Por ahora, simulamos una carga
    setTimeout(() => {
      // Esto es un ejemplo, deberías reemplazarlo con una llamada real a la API
      const member: MemberDetails = {
        id: memberId,
        memberId: `MEM_${memberId}`,
        memberName: 'Nombre del Miembro',
        email: 'ejemplo@email.com',
        phone: '+1234567890',
        planName: 'Plan Estándar',
        planPrice: 49.99,
        joinDate: new Date().toISOString(),
        lastPaymentDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalPayments: 12,
        totalAmount: 599.88,
        status: 'active',
        paymentHistory: [
          {
            id: 'pay_001',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'Tarjeta de crédito',
            transactionId: 'txn_123456789',
            date: new Date().toISOString(),
            subscriptionPlan: 'Plan Estándar',
          },
        ],
      };
      setSelectedMember(member);
      setMemberLoading(false);
    }, 500);
  };

  const closeMemberModal = () => {
    setIsMemberModalOpen(false);
    setSelectedMember(null);
  };

  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('resumen');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar pagos
        await fetchPayments();
        
        // Cargar métricas del dashboard y miembros con pagos atrasados
        // Estas acciones deben ser manejadas por el store
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos iniciales. Por favor, intente nuevamente.',
          type: 'destructive',
        });
      }
    };
    
    loadInitialData();
  }, [fetchPayments, toast]);

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

  const handleRefundSubmit = async () => {
    if (!selectedPaymentId || !refundAmount) return;
    
    try {
      setIsProcessing(true);
      await processRefund(selectedPaymentId, parseFloat(refundAmount));
      
      toast({
        title: 'Reembolso exitoso',
        description: 'El reembolso se ha procesado correctamente.',
      });
      
      setRefundDialogOpen(false);
      setRefundAmount('');
      await fetchPayments();
    } catch (error: unknown) {
      console.error('Error al procesar el reembolso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
toast({
        title: 'Error',
        description: `No se pudo procesar el reembolso: ${errorMessage}`,
        type: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportPayments();
      // No mostramos el toast aquí porque ya se maneja en el store
    } catch (error) {
      // El error ya se maneja en el store
      console.error('Error al exportar pagos:', error);
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
      description: `Se han enviado ${overdueMembers.length} recordatorios de pago.`,
      type: 'default',
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
        <TabsList className="grid w-full grid-cols-3 bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl p-1 h-12">
          <TabsTrigger 
            value="resumen" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
            Resumen
          </TabsTrigger>
          <TabsTrigger 
            value="pagos" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            Pagos
          </TabsTrigger>
          <TabsTrigger 
            value="vencidos" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <div className="h-2 w-2 rounded-full bg-red-400"></div>
            Vencidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <BillingDashboard metrics={billingMetrics || {
            monthlyIncome: { amount: 0, change: 0, trend: 'up' },
            pendingPayments: { amount: 0, change: 0, trend: 'up' },
            membersUpToDate: { count: 0, change: 0, trend: 'up' },
            overduePayments: { count: 0, change: 0, trend: 'up' }
          }} loading={loading} />
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
            members={overdueMembers}
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
              onClick={handleRefundSubmit}
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
