import { BillingFilters } from '../components/BillingFilters';
import { PaymentsTable } from '../components/PaymentsTable';
import { BillingDashboard } from '../components/BillingDashboard';
import { OverdueMemberships } from '../components/OverdueMemberships';
import { MemberPaymentDetailsModal } from '../components/MemberPaymentDetailsModal';
import { BillingActions } from '../components/BillingActions';
import { RefundDialog } from '../components/RefundDialog';
import { Button } from '@/shared/components/ui/button';
import { BarChart3, CreditCard, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useBillingPageQuery } from '../hooks/useBillingPageQuery';


export default function BillingPage() {
  const {
    
    payments,
    loading,
    pagination,
    selectedPayments,
    billingMetrics,
    overdueMembers,
    
    
    selectedMember,
    isMemberModalOpen,
    memberLoading,
    refundDialogOpen,
    refundAmount,
    isProcessing,
    activeTab,
    
    
    setRefundDialogOpen,
    setRefundAmount,
    setActiveTab,
    
    
    togglePaymentSelection,
    selectAllPayments,
    
    
    handlePageChange,
    handleForceRenewal,
    handleRefundClick,
    handleRefundSubmit,
    handleExport,
    handleViewInvoice,
    handleCollectPayment,
    handleViewMemberDetails,
    handleSendReminders,
    closeMemberModal,
    handleRefreshData,
  } = useBillingPageQuery();

  const handleRefresh = async () => {
    handleRefreshData();
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
        <BillingActions
          onExport={handleExport}
          onRefresh={handleRefresh}
          loading={loading}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl p-1 h-12">
          <TabsTrigger 
            value="resumen" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <BarChart3 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger 
            value="pagos" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <CreditCard className="h-4 w-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger 
            value="vencidos" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <AlertTriangle className="h-4 w-4" />
            Vencidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <BillingDashboard metrics={billingMetrics} loading={loading} />
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
      <RefundDialog
        isOpen={refundDialogOpen}
        onClose={() => setRefundDialogOpen(false)}
        onSubmit={handleRefundSubmit}
        refundAmount={refundAmount}
        onRefundAmountChange={setRefundAmount}
        isProcessing={isProcessing}
      />
    </div>
  );
}
