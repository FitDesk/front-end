import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '../services/member.service';
import type { 
  Member, 
  MemberFilters, 
  MemberStatus, 
  MembershipStatus, 
  PaginationOptions,
  ApiResponse
} from '../types';

export const useMembers = (
  filters: MemberFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 10 }
) => {
  return useQuery<ApiResponse<Member[]>>({
    queryKey: ['members', { ...filters, ...pagination }],
    queryFn: () => memberService.getMembers(filters, pagination),
    placeholderData: (previousData) => previousData,
  });
};

export const useMember = (id: string) => {
  return useQuery<Member>({
    queryKey: ['member', id],
    queryFn: () => memberService.getMemberById(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Member, Error, Parameters<typeof memberService.createMember>[0]>({
    mutationFn: (data) => memberService.createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Member, Error, { id: string; data: Parameters<typeof memberService.updateMember>[1] }>({
    mutationFn: ({ id, data }) => memberService.updateMember(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', id] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => memberService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Member, Error, { id: string; status: MemberStatus }>({
    mutationFn: ({ id, status }) => memberService.updateMemberStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', id] });
    },
  });
};

export const useUpdateMembershipStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Member, Error, { id: string; status: MembershipStatus }>({
    mutationFn: ({ id, status }) => memberService.updateMembershipStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', id] });
    },
  });
};

export const useRenewMembership = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Member, Error, { 
    id: string; 
    endDate: string; 
    status?: MembershipStatus 
  }>({
    mutationFn: ({ id, endDate, status = 'ACTIVE' }) => 
      memberService.renewMembership(id, endDate, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', id] });
    },
  });
};

export const useUploadCertifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { 
    memberId: string; 
    files: File[]; 
    onUploadProgress?: (progress: number) => void 
  }>({
    mutationFn: ({ memberId, files, onUploadProgress }) => 
      memberService.uploadCertifications(memberId, files, onUploadProgress),
    onSuccess: (_, { memberId }) => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId] });
    },
  });
};

export const useDeleteCertification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { 
    memberId: string; 
    certificationId: string 
  }>({
    mutationFn: ({ memberId, certificationId }) => 
      memberService.deleteCertification(memberId, certificationId),
    onSuccess: (_, { memberId }) => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId] });
    },
  });
};
