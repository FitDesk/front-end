import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Member, MemberFilters, MemberStatus, MembershipStatus } from '../types';
import { memberService } from '../services/member.service';

interface MemberState {
  members: Member[];
  currentMember: Member | null;
  isLoading: boolean;
  error: string | null;
  filters: MemberFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  
  setMembers: (members: Member[]) => void;
  setCurrentMember: (member: Member | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<MemberFilters>) => void;
  setPagination: (pagination: Partial<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>) => void;
  
  
  updateMemberStatus: (memberId: string, status: MemberStatus) => void;
  updateMembershipStatus: (memberId: string, status: MembershipStatus) => void;
  deleteMember: (memberId: string) => Promise<boolean>;
  
  reset: () => void;
}

const initialState = {
  members: [],
  currentMember: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

export const useMemberStore = create<MemberState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setMembers: (members) => set({ members }),
      
      setCurrentMember: (member) => set({ currentMember: member }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      setFilters: (filters) => 
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 }, 
        })),
      
      setPagination: (pagination) => 
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),
      
      updateMemberStatus: (memberId, status) =>
        set((state) => ({
          members: state.members.map((member) =>
            member.id === memberId ? { ...member, status } : member
          ),
          currentMember:
            state.currentMember?.id === memberId
              ? { ...state.currentMember, status }
              : state.currentMember,
        })),
      
      updateMembershipStatus: (memberId, status) => {
        set(state => ({
          members: state.members.map(member =>
            member.id === memberId
              ? { 
                  ...member, 
                  membership: { 
                    ...member.membership, 
                    status 
                  } 
                }
              : member
          ),
          currentMember:
            state.currentMember?.id === memberId
              ? {
                  ...state.currentMember,
                  membership: { ...state.currentMember.membership, status },
                }
              : state.currentMember,
        }));
      },
      
      deleteMember: async (memberId: string) => {
        try {
          
          await memberService.deleteMember(memberId);
          
          set(state => ({
            members: state.members.filter(member => member.id !== memberId),
            currentMember: state.currentMember?.id === memberId ? null : state.currentMember,
          }));
          return true;
        } catch (error) {
          console.error('Error al eliminar miembro:', error);
          return false;
        }
      },
      
      reset: () => set(initialState),
    }),
    {
      name: 'member-storage',
    }
  )
);
