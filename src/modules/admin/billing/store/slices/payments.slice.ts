import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { BillingState } from '../billing.store';
import type { Payment, BillingFilter, BillingPagination } from '../../types/billing.types';
import { samplePayments } from '../../data/sample-data';

export interface PaymentsSlice {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  pagination: BillingPagination;
  filters: BillingFilter;
  selectedPayments: string[];
  
  // Actions
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

  fetchPayments: async (params = {}) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
    
    try {
      const { filters, pagination } = get();
      const { page = pagination?.page || 1 } = params;
      const pageSize = pagination?.pageSize || 10;
      
      // Aplicar filtros a los datos de ejemplo
      let filteredPayments = [...samplePayments] as Payment[];
      
      // Filtrar por término de búsqueda
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredPayments = filteredPayments.filter(payment => 
          payment.memberName.toLowerCase().includes(searchTerm) ||
          payment.memberId.toLowerCase().includes(searchTerm) ||
          payment.transactionId.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filtrar por estado
      if (filters.status) {
        filteredPayments = filteredPayments.filter(payment => 
          payment.status === filters.status
        );
      }
      
      // Filtrar por método de pago
      if (filters.paymentMethod) {
        filteredPayments = filteredPayments.filter(payment => 
          payment.paymentMethod === filters.paymentMethod
        );
      }
      
      // Filtrar por rango de fechas
      if (filters.dateFrom) {
        filteredPayments = filteredPayments.filter(payment => 
          new Date(payment.date) >= new Date(filters.dateFrom!)
        );
      }
      
      if (filters.dateTo) {
        filteredPayments = filteredPayments.filter(payment => 
          new Date(payment.date) <= new Date(filters.dateTo!)
        );
      }
      
      // Aplicar paginación
      const totalItems = filteredPayments.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

      set((state) => {
        state.payments = paginatedPayments;
        state.pagination = {
          page,
          pageSize,
          totalItems,
          totalPages,
        };
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error instanceof Error ? error.message : 'Error al cargar los pagos';
        state.loading = false;
      });
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

  forceRenewal: async (paymentId) => {
    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      await get().fetchPayments();
    } catch (error) {
      throw error;
    }
  },

  processRefund: async (paymentId, amount) => {
    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      await get().fetchPayments();
    } catch (error) {
      throw error;
    }
  },

  exportPayments: async () => {
    try {
      const { filters } = get();
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const csvContent = get().payments.map(payment => 
        `${payment.memberName},${payment.amount},${payment.status},${payment.date}`
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      throw error;
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
