import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { BillingState } from '../billing.store';

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

export interface MemberSlice {
  selectedMember: MemberDetails | null;
  isMemberModalOpen: boolean;
  memberLoading: boolean;
  memberError: string | null;
  
  // Actions
  setSelectedMember: (member: MemberDetails | null) => void;
  openMemberModal: (memberId: string) => void;
  closeMemberModal: () => void;
  setMemberLoading: (loading: boolean) => void;
  setMemberError: (error: string | null) => void;
  fetchMemberDetails: (memberId: string) => Promise<void>;
}

export const createMemberSlice: StateCreator<
  BillingState,
  [["zustand/immer", never]],
  [],
  MemberSlice
> = (set, get) => ({
  selectedMember: null,
  isMemberModalOpen: false,
  memberLoading: false,
  memberError: null,

  setSelectedMember: (member) => {
    set((state) => {
      state.selectedMember = member;
    });
  },

  openMemberModal: (memberId) => {
    set((state) => {
      state.isMemberModalOpen = true;
      state.memberLoading = true;
      state.memberError = null;
    });
    get().fetchMemberDetails(memberId);
  },

  closeMemberModal: () => {
    set((state) => {
      state.isMemberModalOpen = false;
      state.selectedMember = null;
      state.memberLoading = false;
      state.memberError = null;
    });
  },

  setMemberLoading: (loading) => {
    set((state) => {
      state.memberLoading = loading;
    });
  },

  setMemberError: (error) => {
    set((state) => {
      state.memberError = error;
    });
  },

  fetchMemberDetails: async (memberId) => {
    set((state) => {
      state.memberLoading = true;
      state.memberError = null;
    });

    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo - en producción esto vendría del backend
      const mockMemberData: MemberDetails = {
        id: memberId,
        memberId: `MEM_${memberId.slice(-3).padStart(3, '0')}`,
        memberName: 'María González',
        email: 'maria.gonzalez@email.com',
        phone: '+1 234 567 8900',
        planName: 'Plan Básico',
        planPrice: 49.99,
        joinDate: '2023-06-15T00:00:00Z',
        lastPaymentDate: '2024-01-15T10:30:00Z',
        nextBillingDate: '2024-02-15T10:30:00Z',
        totalPayments: 8,
        totalAmount: 399.92,
        status: 'active',
        paymentHistory: [
          {
            id: 'pay_001',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'credit_card',
            transactionId: 'TXN_2024_001',
            date: '2024-01-15T10:30:00Z',
            subscriptionPlan: 'Plan Básico',
          },
          {
            id: 'pay_002',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'credit_card',
            transactionId: 'TXN_2023_012',
            date: '2023-12-15T10:30:00Z',
            subscriptionPlan: 'Plan Básico',
          },
          {
            id: 'pay_003',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'debit_card',
            transactionId: 'TXN_2023_011',
            date: '2023-11-15T10:30:00Z',
            subscriptionPlan: 'Plan Básico',
          },
          {
            id: 'pay_004',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'credit_card',
            transactionId: 'TXN_2023_010',
            date: '2023-10-15T10:30:00Z',
            subscriptionPlan: 'Plan Básico',
          },
          {
            id: 'pay_005',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'bank_transfer',
            transactionId: 'TXN_2023_009',
            date: '2023-09-15T10:30:00Z',
            subscriptionPlan: 'Plan Básico',
          },
          {
            id: 'pay_006',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'credit_card',
            transactionId: 'TXN_2023_008',
            date: '2023-08-15T10:30:00Z',
            subscriptionPlan: 'Plan Básico',
          },
          {
            id: 'pay_007',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'credit_card',
            transactionId: 'TXN_2023_007',
            date: '2023-07-15T10:30:00Z',
            subscriptionPlan: 'Plan Básico',
          },
          {
            id: 'pay_008',
            amount: 49.99,
            status: 'completed',
            paymentMethod: 'credit_card',
            transactionId: 'TXN_2023_006',
            date: '2023-06-15T10:30:00Z',
            subscriptionPlan: 'Plan Básico',
          },
        ],
      };

      set((state) => {
        state.selectedMember = mockMemberData;
        state.memberLoading = false;
      });
    } catch (error) {
      set((state) => {
        state.memberError = error instanceof Error ? error.message : 'Error al cargar los detalles del miembro';
        state.memberLoading = false;
      });
    }
  },
});
