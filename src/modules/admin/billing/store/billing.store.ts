import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createPaymentsSlice, type PaymentsSlice } from './slices/payments.slice';
import { createMemberSlice, type MemberSlice } from './slices/member.slice';

export type BillingState = PaymentsSlice & MemberSlice;

export const useBillingStore = create<BillingState>()(
  devtools(
    immer((...args) => ({
      ...createPaymentsSlice(...args),
      ...createMemberSlice(...args),
    })),
    {
      name: 'billing-store',
    }
  )
);