import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { StateCreator } from 'zustand';

interface BillingUIState {
  activeTab: string;
  selectedPayments: string[];
  

  setActiveTab: (tab: string) => void;
  togglePaymentSelection: (paymentId: string) => void;
  selectAllPayments: (paymentIds: string[]) => void;
  clearSelectedPayments: () => void;
}

const billingUIStore: StateCreator<
  BillingUIState,
  [["zustand/persist", unknown], ["zustand/devtools", never], ["zustand/immer", never]]
> = (set) => ({

  activeTab: 'resumen',
  selectedPayments: [],

  setActiveTab: (tab: string) => {
    set((state) => {
      state.activeTab = tab;
    });
  },

  togglePaymentSelection: (paymentId: string) => {
    set((state) => {
      const index = state.selectedPayments.indexOf(paymentId);
      if (index > -1) {
        state.selectedPayments.splice(index, 1);
      } else {
        state.selectedPayments.push(paymentId);
      }
    });
  },

  selectAllPayments: (paymentIds: string[]) => {
    set((state) => {
      state.selectedPayments = [...paymentIds];
    });
  },

  clearSelectedPayments: () => {
    set((state) => {
      state.selectedPayments = [];
    });
  },
});


export const useBillingUIStore = create<BillingUIState>()(
  persist(
    devtools(immer(billingUIStore), { name: 'billing-ui-store' }),
    {
      name: 'fitdesk-billing-ui',
      partialize: (state) => ({
        activeTab: state.activeTab,

      })
    }
  )
);
