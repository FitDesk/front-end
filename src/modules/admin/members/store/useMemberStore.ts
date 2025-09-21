import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '../services/member.service';
import type { MemberFilters, MemberStatus } from '../types';
import { toast } from 'sonner';

interface MemberState {
  currentMemberId: string | null;
  filters: MemberFilters;
  pagination: {
    page: number;
    limit: number;
  };
  
  setCurrentMemberId: (id: string | null) => void;
  setFilters: (filters: Partial<MemberFilters>) => void;
  setPagination: (pagination: Partial<{
    page: number;
    limit: number;
  }>) => void;
  reset: () => void;
}

const initialState = {
  currentMemberId: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
  },
};

// Hook para mutaciones con React Query
export const useMemberMutations = () => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ memberId, status }: { memberId: string; status: MemberStatus }) => 
      memberService.updateMemberStatus(memberId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error) => {
      console.error('Error actualizando estado:', error);
      toast.error('Error al actualizar el estado');
    }
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: string) => 
      memberService.deleteMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro eliminado correctamente');
    },
    onError: (error) => {
      console.error('Error eliminando miembro:', error);
      toast.error('Error al eliminar el miembro');
    }
  });

  return {
    updateMemberStatus: updateStatusMutation.mutateAsync,
    deleteMember: deleteMemberMutation.mutateAsync,
    isLoading: updateStatusMutation.isPending || deleteMemberMutation.isPending
  };
};

export const useMemberStore = create<MemberState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setCurrentMemberId: (id) => set({ currentMemberId: id }),
      
      setFilters: (filters) => 
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 }, 
        })),
      
      setPagination: (pagination) => 
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),
      
      reset: () => set(initialState),
    }),
    {
      name: 'member-storage',
    }
  )
);
