import { useEffect } from 'react';
import { useBillingStore } from '../store/billing.store';

export function useBilling() {
  const {
    payments,
    loading,
    error,
    pagination,
    selectedPayments,
    filters,
    fetchPayments,
    setFilters,
    togglePaymentSelection,
    selectAllPayments,
    forceRenewal,
    processRefund,
    exportPayments,
    reset,
  } = useBillingStore();


  useEffect(() => {
    fetchPayments();
    
   
    return () => {
      reset();
    };
  }, [fetchPayments, reset]);

 
  const handlePageChange = (page: number) => {
    fetchPayments({ page });
  };


  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, searchTerm });
  };


  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setFilters({ ...filters, sortBy: field, sortOrder: order });
  };


  const handleSelectPayment = (paymentId: string) => {
    togglePaymentSelection(paymentId);
  };


  const handleSelectAllPayments = (checked: boolean) => {
    selectAllPayments(checked);
  };


  const handleForceRenewal = async (paymentId: string) => {
    try {
      await forceRenewal(paymentId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to force renewal' };
    }
  };

 
  const handleProcessRefund = async (paymentId: string, amount?: number) => {
    try {
      await processRefund(paymentId, amount);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to process refund' };
    }
  };

  const handleExport = async () => {
    try {
      await exportPayments();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to export payments' };
    }
  };

  return {
 
    payments,
    loading,
    error,
    pagination,
    selectedPayments,
    filters,
    
   
    handlePageChange,
    handleSearch,
    handleSort,
    handleSelectPayment,
    handleSelectAllPayments,
    handleForceRenewal,
    handleProcessRefund,
    handleExport,
    setFilters,
  };
}
