import { useBillingStore } from '../store/billing.store';


export function useBilling() {
  const {
    payments,
    pagination,
    selectedPayments,
    billingMetrics,
    overdueMembers,
  } = useBillingStore();

  return {
    payments,
    pagination,
    selectedPayments,
    billingMetrics,
    overdueMembers,
  };
}
