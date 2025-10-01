import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentService } from '../services/student.service';
import { useStudentsStore } from '../store/students-store';
import type { 
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentStatus
} from '../types';

export function useStudents() {
  const queryClient = useQueryClient();
  const { 
    filters, 
    pagination, 
    setFilters, 
    setPagination, 
    setStudents, 
    updateStudentStatus 
  } = useStudentsStore();

  const { 
    data: studentsData, 
    isLoading, 
    isError,
    refetch: refreshStudents
  } = useQuery({
    queryKey: ['students', filters, pagination],
    queryFn: async () => {
      try {
        const result = await studentService.getStudents(filters, pagination);
        setStudents(result.data || []);
        setPagination({
          page: result.page || 1,
          limit: result.limit || 12,
          total: result.total || 0,
          totalPages: result.totalPages || 1
        });
        return result;
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
        setPagination({
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
    retry: 1, 
    refetchOnWindowFocus: false,
  });
  
  const students = studentsData?.data || [];
  

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
      updateStudentStatus(id, status);
      return await studentService.updateStudentStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Estado actualizado exitosamente');
    },
    onError: (_, { id, status }) => {
      updateStudentStatus(id, status);
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

  const updateFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const updatePagination = (updates: any) => {
    setPagination(updates);
  };

  return {
    students,
    pagination,
    filters,
    
    isLoading,
    isError,
    
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
    
    updateFilters,
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
