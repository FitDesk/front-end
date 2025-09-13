import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { memberService } from '../services/member.service';
import type { 
  Member,
  MemberFilters, 
  MemberStatus,
  PaginationOptions, 
  CreateMemberDTO
} from '../types';

export function useMembers() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MemberFilters>({});
  const [pagination, setPagination] = useState<PaginationOptions>({ 
    page: 1, 
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc' 
  });
  
  const { 
    data: membersData, 
    isLoading, 
    isError,
    error,
    refetch: refreshMembers
  } = useQuery({
    queryKey: ['members', filters, pagination],
    queryFn: async () => {
      try {
        return await memberService.getMembers(filters, {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: pagination.sortBy,
          sortOrder: pagination.sortOrder as 'asc' | 'desc'
        });
      } catch (error: any) {
        
        if (error.message === 'No response received from server. Please check your connection.') {
          throw new Error('CONNECTION_ERROR');
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
    retry: 0, 
    refetchOnWindowFocus: false,
  });
  
  const members = Array.isArray(membersData?.data) ? membersData.data : [];
  const paginationData = membersData ? {
    page: membersData.page || 1,
    limit: membersData.limit || pagination.limit,
    total: membersData.total || 0,
    totalPages: membersData.totalPages || 1,
    sortBy: pagination.sortBy,
    sortOrder: pagination.sortOrder
  } : { ...pagination, total: 0, totalPages: 1 };
  
  
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Member> }) => {
      return await memberService.updateMember(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro actualizado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al actualizar miembro:', error);
      toast.error(error.message || 'Error al actualizar el miembro');
    },
  });
  
  const isUpdating = updateMemberMutation.isPending;

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      await memberService.deleteMember(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro eliminado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al eliminar miembro:', error);
      toast.error('Error al eliminar el miembro');
    },
  });
  
  
  const createMemberMutation = useMutation({
    mutationFn: async (formData: CreateMemberDTO) => {
      try {
        
        const requiredFields: Array<keyof CreateMemberDTO> = [
          'firstName', 'lastName', 'email', 'phone', 'birthDate',
          'emergencyContact', 'membership'
        ];
        
        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
          const errorMessage = `Faltan campos obligatorios: ${missingFields.join(', ')}`;
          throw new Error(errorMessage);
        }

       
        const memberData: CreateMemberDTO = {
          ...formData,
          
          address: formData.address || {},
          emergencyContact: formData.emergencyContact || {},
          membership: {
            ...formData.membership,
            status: 'ACTIVE' as const
          }
        };
        
        const response = await memberService.createMember(memberData);
        return response;
      } catch (error: any) {
        
        const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Error al crear el miembro');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro creado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al crear miembro:', error);
     
      const errorMessage = error?.message || 'Error al crear el miembro';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Error al crear el miembro');
    },
  });

  const isCreating = createMemberMutation.isPending;

  
  const updateFilters = (newFilters: Partial<MemberFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const updatePagination = (updates: Partial<PaginationOptions>) => {
    setPagination(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    members,
    pagination: paginationData,
    filters,
    setFilters,
    updateFilters,
    setPagination,
    updatePagination,
    isLoading,
    isError,
    error,
    refreshMembers,
    createMember: createMemberMutation.mutateAsync,
    updateMember: updateMemberMutation.mutateAsync,
    deleteMember: deleteMemberMutation.mutateAsync,
    errorCreating: createMemberMutation.error,
    errorUpdating: updateMemberMutation.error,
    errorDeleting: deleteMemberMutation.error,
    isCreating,
    isUpdating,
  };
}


export function useMember(memberId?: string) {
  const queryClient = useQueryClient();
  
 
  const { 
    data: member, 
    isLoading, 
    error,
    refetch 
  } = useQuery<Member | null>({
    queryKey: ['member', memberId],
    queryFn: async () => {
      if (!memberId) return null;
      return memberService.getMemberById(memberId);
    },
    enabled: !!memberId,
  });
  
  
  const updateMemberMutation = useMutation<Member, Error, { id: string; data: Partial<Member> }>({
    mutationFn: ({ id, data }) => memberService.updateMember(id, data),
    onSuccess: (updatedMember) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.setQueryData(['member', updatedMember.id], updatedMember);
      toast.success('Miembro actualizado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al actualizar miembro:', error);
      toast.error('Error al actualizar el miembro');
    },
  });
  
  
  const deleteMemberMutation = useMutation<boolean, Error, string>({
    mutationFn: (id: string) => memberService.deleteMember(id).then(() => true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      if (memberId) {
        queryClient.removeQueries({ queryKey: ['member', memberId] });
      }
      toast.success('Miembro eliminado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al eliminar miembro:', error);
      toast.error('Error al eliminar el miembro');
    },
  });
  
  
  const updateMemberStatus = useMutation<Member, Error, { id: string; status: MemberStatus }>({
    mutationFn: ({ id, status }) => memberService.updateMemberStatus(id, status),
    onSuccess: (updatedMember) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.setQueryData(['member', updatedMember.id], updatedMember);
      toast.success('Estado del miembro actualizado exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al actualizar estado del miembro:', error);
      toast.error('Error al actualizar el estado del miembro');
    },
  });
  
 
  const renewMembership = useMutation<Member, Error, { id: string; endDate: string }>({
    mutationFn: ({ id, endDate }) => memberService.renewMembership(id, endDate),
    onSuccess: (updatedMember) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.setQueryData(['member', updatedMember.id], updatedMember);
      toast.success('Membresía renovada exitosamente');
    },
    onError: (error: Error) => {
      console.error('Error al renovar membresía:', error);
      toast.error('Error al renovar la membresía');
    },
  });
  
  return {
    member,
    isLoading,
    error,
    refetch,
    updateMember: updateMemberMutation.mutateAsync,
    deleteMember: deleteMemberMutation.mutateAsync,
    updateStatus: updateMemberStatus.mutateAsync,
    renewMembership: renewMembership.mutateAsync,
    isUpdating: updateMemberMutation.isPending,
    isDeleting: deleteMemberMutation.isPending,
    isUpdatingStatus: updateMemberStatus.isPending,
    isRenewing: renewMembership.isPending,
  };
}
