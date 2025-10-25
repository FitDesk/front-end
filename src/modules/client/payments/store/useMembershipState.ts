import type {  UserMemberships } from "@/core/interfaces/plan.interface";
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";


interface MembershipState {
    membership: UserMemberships | null
    setMembership: (membership: UserMemberships) => void
    clearMembership: () => void
}


const membershipAPI: StateCreator<MembershipState, [], [["zustand/immer", never], ["zustand/devtools", never]]> = (set) => ({
    membership: null,
    setMembership: (membership) => set({ membership }),
    clearMembership: () => set({ membership: null }),
})

export const useMembershipStore = create<MembershipState>()(
    immer(
        devtools(
            membershipAPI
        )
    )
)