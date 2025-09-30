import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentService } from '../services/student.service';
import type { 
  StudentFilters,
  PaginationOptions,
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentStatus
} from '../types';

export function useStudents() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<StudentFilters>({});
  const [pagination, setPagination] = useState<PaginationOptions>({ 
    page: 1, 
    limit: 12,
    sortBy: 'firstName',
    sortOrder: 'asc' 
  });
  
  const { 
    data: studentsData, 
    isLoading, 
    isError,
    error,
    refetch: refreshStudents
  } = useQuery({
    queryKey: ['students', filters, pagination],
    queryFn: async () => {
      try {
        return await studentService.getStudents(filters, pagination);
      } catch (error: any) {
        if (error.message === 'No response received from server. Please check your connection.') {
          throw new Error('CONNECTION_ERROR');
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
    retry: 1, 
    refetchOnWindowFocus: false,
  });
  
  const students = Array.isArray(studentsData?.data) ? studentsData.data : [];
  const paginationData = studentsData ? {
    page: studentsData.page || 1,
    limit: studentsData.limit || pagination.limit,
    total: studentsData.total || 0,
    totalPages: studentsData.totalPages || 1,
    sortBy: pagination.sortBy,
    sortOrder: pagination.sortOrder
  } : { ...pagination, total: 0, totalPages: 1 };
  
  const createStudentMutation = useMutation({
    mutationFn: async (studentData: CreateStudentDTO) => {
      return await studentService.createStudent(studentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante agregado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al agregar estudiante');
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStudentDTO }) => {
      return await studentService.updateStudent(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar estudiante');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StudentStatus }) => {
      return await studentService.updateStudentStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estado actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      await studentService.deleteStudent(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estudiante eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar estudiante');
    },
  });

  
  const updateFilters = (newFilters: Partial<StudentFilters>) => {
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
    students,
    pagination: paginationData,
    filters,
    
    isLoading,
    isError,
    error,
    
    refreshStudents,
    createStudent: createStudentMutation.mutateAsync,
    updateStudent: updateStudentMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteStudent: deleteStudentMutation.mutateAsync,
    
    isCreating: createStudentMutation.isPending,
    isUpdating: updateStudentMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteStudentMutation.isPending,
    
    createError: createStudentMutation.error,
    updateError: updateStudentMutation.error,
    deleteError: deleteStudentMutation.error,
    
    setFilters,
    updateFilters,
    setPagination,
    updatePagination,
  };
}

export function useStudent(studentId?: string) {
  const queryClient = useQueryClient();
  
  const { 
    data: student, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) return null;
      return await studentService.getStudentById(studentId);
    },
    enabled: !!studentId,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDTO }) => 
      studentService.updateStudent(id, data),
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.setQueryData(['student', updatedStudent.id], updatedStudent);
      toast.success('Estudiante actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar estudiante');
    },
  });
  
  return {
    student,
    isLoading,
    error,
    refetch,
    updateStudent: updateStudentMutation.mutateAsync,
    isUpdating: updateStudentMutation.isPending,
  };
}
