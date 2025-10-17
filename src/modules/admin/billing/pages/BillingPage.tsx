import { BillingFilters } from '../components/BillingFilters';
import { PaymentsTable } from '../components/PaymentsTable';
import { MemberPaymentDetailsModal } from '../components/MemberPaymentDetailsModal';
import { Button } from '@/shared/components/ui/button';
import { useBillingPageQuery } from '../hooks/useBillingPageQuery';


export default function BillingPage() {
  const {

    payments,
    loading,
    pagination,
    selectedPayments,


    selectedMember,
    isMemberModalOpen,
    memberLoading,


    togglePaymentSelection,
    selectAllPayments,


    handlePageChange,
    handleForceRenewal,
    handleRefundClick,
    handleExport,
    handleViewInvoice,
    handleViewMemberDetails,
    closeMemberModal,
  } = useBillingPageQuery();



  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Facturación</h1>
          <p className="text-muted-foreground">
            Ver y gestionar pagos, renovaciones y reembolsos de miembros
          </p>
        </div>

      </div>

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

      <MemberPaymentDetailsModal
        member={selectedMember}
        isOpen={isMemberModalOpen}
        onClose={closeMemberModal}
        loading={memberLoading}
      />


    </div>
  );
}
