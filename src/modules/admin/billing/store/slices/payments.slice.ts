import type { StateCreator } from 'zustand';
import type { BillingState } from '../billing.store';
import type { Payment, BillingFilter, BillingPagination } from '../../types/billing.types';
import type { BillingMetrics, OverdueMember } from '../../types/billing.types';
import { fitdeskApi } from '@/core/api/fitdeskApi';

export interface PaymentsSlice {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  pagination: BillingPagination;
  filters: BillingFilter;
  selectedPayments: string[];
  billingMetrics: BillingMetrics | null;
  overdueMembers: OverdueMember[];
  

  fetchPayments: (params?: BillingFilter & { page?: number }) => Promise<void>;
  setFilters: (filters: BillingFilter) => void;
  togglePaymentSelection: (id: string) => void;
  selectAllPayments: (select: boolean) => void;
  forceRenewal: (paymentId: string) => Promise<void>;
  processRefund: (paymentId: string, amount?: number) => Promise<void>;
  exportPayments: () => Promise<void>;
  reset: () => void;
}

export const createPaymentsSlice: StateCreator<
  BillingState,
  [["zustand/immer", never]],
  [],
  PaymentsSlice
> = (set, get) => ({
  payments: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  },
  filters: {},
  selectedPayments: [],
  billingMetrics: null,
  overdueMembers: [],

  fetchPayments: async (params = {}) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
    
    try {
      const { page = 1, ...filters } = params;
      
     
      const response = await fitdeskApi.get<{
        data: Payment[];
        pagination?: {
          page: number;
          pageSize: number;
          total: number;
        };
        // Añadir compatibilidad con diferentes formatos de respuesta
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      }>('/payments', {
        params: {
          page,
          pageSize: 10, 
          ...filters,
        },
      });
      
      const responseData = response.data;
      
      // Manejar diferentes formatos de respuesta
      const payments = responseData.data || [];
      const paginationData = responseData.pagination || {
        page: responseData.page || 1,
        pageSize: responseData.limit || 10,
        total: responseData.total || 0,
      };
      
      set((state) => {
        state.payments = payments;
        state.pagination = {
          page: paginationData.page,
          pageSize: paginationData.pageSize,
          totalItems: paginationData.total,
          totalPages: responseData.totalPages || Math.ceil((paginationData.total || 0) / (paginationData.pageSize || 10)),
        };
        state.loading = false;
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los pagos';
      set((state) => {
        state.error = errorMessage;
        state.loading = false;
      });
      throw new Error(errorMessage);
    }
  },

  setFilters: (filters) => {
    set((state) => {
      state.filters = { ...state.filters, ...filters };
      state.pagination = { ...state.pagination, page: 1 };
    });
    get().fetchPayments({ ...filters, page: 1 });
  },

  togglePaymentSelection: (id) => {
    set((state) => {
      const index = state.selectedPayments.indexOf(id);
      if (index > -1) {
        state.selectedPayments.splice(index, 1);
      } else {
        state.selectedPayments.push(id);
      }
    });
  },

  selectAllPayments: (select) => {
    set((state) => {
      state.selectedPayments = select ? state.payments.map((p) => p.id) : [];
    });
  },

  forceRenewal: async (paymentId: string) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
    
    try {
   
      const response = await fitdeskApi.post(`/payments/${paymentId}/renew`);
      
   
      set((state) => {
        state.payments = state.payments.map(payment => 
          payment.id === paymentId 
            ? response.data.updatedPayment
            : payment
        );
      });
      
      
      await get().fetchPayments();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al forzar la renovación';
      set((state) => {
        state.error = errorMessage;
      });
      throw new Error(errorMessage);
    } finally {
      set((state) => {
        state.loading = false;
      });
    }
  },

  processRefund: async (paymentId: string, amount?: number) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      
      const response = await fitdeskApi.post<{ updatedPayment: Payment }>(`/payments/${paymentId}/refund`, { amount });
      
  
      set((state) => {
        state.payments = state.payments.map(payment => 
          payment.id === paymentId 
            ? response.data.updatedPayment
            : payment
        );
      });
      
   
      await get().fetchPayments();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el reembolso';
      set((state) => {
        state.error = errorMessage;
      });
      throw new Error(errorMessage);
    } finally {
      set((state) => {
        state.loading = false;
      });
    }
  },

  exportPayments: async () => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
    
    try {
  
      const response = await fitdeskApi.get('/payments/export', {
        responseType: 'blob', 
      });
      

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
   
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `payments-${new Date().toISOString().split('T')[0]}.csv`;
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al exportar los pagos';
      set((state) => {
        state.error = errorMessage;
      });
      throw new Error(errorMessage);
    } finally {
      set((state) => {
        state.loading = false;
      });
    }
  },

  reset: () => {
    set((state) => {
      state.payments = [];
      state.loading = false;
      state.error = null;
      state.pagination = {
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
      };
      state.filters = {};
      state.selectedPayments = [];
    });
  },
});
