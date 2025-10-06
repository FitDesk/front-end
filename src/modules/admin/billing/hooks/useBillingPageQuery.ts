import { useState } from 'react';
import { 
  usePayments, 
  useBillingMetrics, 
  useOverdueMembers, 
  useForceRenewal,
  useProcessRefund,
  useExportPayments,
  useSendPaymentReminder,
  useSendBulkReminders,
  useGetInvoice,
  useMemberDetails
} from './useBillingQueries';
import type { BillingFilter, MemberDetails } from '../types/billing.types';

export function useBillingPageQuery() {

  const [selectedMember, setSelectedMember] = useState<MemberDetails | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [activeTab, setActiveTab] = useState('resumen');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [filters, setFilters] = useState<BillingFilter & { page?: number }>({ page: 1 });


  const paymentsQuery = usePayments(filters);
  const metricsQuery = useBillingMetrics();
  const overdueQuery = useOverdueMembers();
  const memberDetailsQuery = useMemberDetails(selectedMember?.id || null);
  const forceRenewalMutation = useForceRenewal();
  const processRefundMutation = useProcessRefund();
  const exportPaymentsMutation = useExportPayments();
  const sendReminderMutation = useSendPaymentReminder();
  const sendBulkRemindersMutation = useSendBulkReminders();
  const getInvoiceMutation = useGetInvoice();

  const loading = paymentsQuery.isLoading || metricsQuery.isLoading || overdueQuery.isLoading;
  const error = paymentsQuery.error || metricsQuery.error || overdueQuery.error;
  const payments = paymentsQuery.data?.payments || [];
  const pagination = paymentsQuery.data?.pagination || {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  };
  const billingMetrics = metricsQuery.data || null;
  const overdueMembers = overdueQuery.data || [];
  const memberLoading = memberDetailsQuery.isLoading;

  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleForceRenewal = async (paymentId: string) => {
    await forceRenewalMutation.mutateAsync(paymentId);
  };

  const handleRefreshData = () => {
    paymentsQuery.refetch();
    metricsQuery.refetch();
    overdueQuery.refetch();
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
    
    await processRefundMutation.mutateAsync({
      paymentId: selectedPaymentId,
      amount: parseFloat(refundAmount)
    });
    
    setRefundDialogOpen(false);
    setRefundAmount('');
    setSelectedPaymentId(null);
  };

  const handleExport = async () => {
    await exportPaymentsMutation.mutateAsync();
  };

  const handleViewInvoice = async (paymentId: string) => {
    await getInvoiceMutation.mutateAsync(paymentId);
  };

  const handleCollectPayment = async (memberId: string) => {
    await sendReminderMutation.mutateAsync(memberId);
  };

  const handleViewMemberDetails = (memberId: string) => {
    openMemberModal(memberId);
  };

  const handleSendReminders = async () => {
    const memberIds = overdueMembers.map(member => member.id);
    if (memberIds.length === 0) return;
    
    await sendBulkRemindersMutation.mutateAsync(memberIds);
  };

  const openMemberModal = (memberId: string) => {
    const member = overdueMembers.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member as any); 
      setIsMemberModalOpen(true);
    }
  };

  const closeMemberModal = () => {
    setIsMemberModalOpen(false);
    setSelectedMember(null);
  };

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments(prev => {
      const index = prev.indexOf(paymentId);
      if (index > -1) {
        return prev.filter(id => id !== paymentId);
      } else {
        return [...prev, paymentId];
      }
    });
  };

  const selectAllPayments = (select: boolean) => {
    setSelectedPayments(select ? payments.map(p => p.id) : []);
  };

  const isProcessing = 
    forceRenewalMutation.isPending || 
    processRefundMutation.isPending || 
    exportPaymentsMutation.isPending ||
    sendReminderMutation.isPending ||
    sendBulkRemindersMutation.isPending ||
    getInvoiceMutation.isPending;

  return {
    payments,
    loading,
    error: error?.message || null,
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
    openMemberModal,
    closeMemberModal,
    handleRefreshData,
  };
}
