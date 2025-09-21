import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { BillingFilter, BillingPagination, Payment } from '../types/billing.types';

interface GetPaymentsParams extends BillingFilter {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const billingService = {
  async getPayments(params: GetPaymentsParams = {}) {
    const response = await fitdeskApi.get<{ data: Payment[]; pagination: BillingPagination }>('/admin/payments', { params });
    
    const responseData = response.data as any; 
    return {
      data: Array.isArray(responseData?.data) ? responseData.data : [],
      pagination: {
        page: responseData?.pagination?.page || 1,
        pageSize: responseData?.pagination?.pageSize || 10,
        totalItems: responseData?.pagination?.totalItems || 0,
        totalPages: responseData?.pagination?.totalPages || 1,
      }
    };
  },

  async forceRenewal(paymentId: string) {
    const response = await fitdeskApi.post(`/admin/payments/${paymentId}/force-renewal`, {});
    return response.data;
  },

  async processRefund(paymentId: string, amount?: number) {
    const response = await fitdeskApi.post(`/admin/payments/${paymentId}/refund`, { amount });
    return response.data;
  },

  async exportPayments(params: GetPaymentsParams = {}): Promise<Blob> {
    const response = await fitdeskApi.get<Blob>('/admin/payments/export', {
      params,
      responseType: 'blob',
    } as any);
    return response.data;
  },
};
