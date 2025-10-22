import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassService } from '../services/class.service';
import type { Class, ClassRequest } from '../types/class';

export const useClasses = () => {
  return useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      try {
        const data = await ClassService.getAll();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
      }
    },
    initialData: [],
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  });
};


export const useClassesForCalendar = () => {
  return useQuery<Class[]>({
    queryKey: ['classes-calendar'],
    queryFn: async () => {
      try {
        const data = await ClassService.getClassesForCalendar();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching classes for calendar:', error);
        return [];
      }
    },
    initialData: [],
    staleTime: 2 * 60 * 1000, // 2 minutos para el calendario
    refetchOnWindowFocus: true,
  });
};

export const useClass = (id: string) => {
  return useQuery<Class>({
    queryKey: ['class', id],
    queryFn: () => ClassService.getById(id),
    enabled: !!id
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Class, Error, ClassRequest>({
    mutationFn: ClassService.create,
    onSuccess: () => {
      // Invalidar ambas queries para que se actualicen inmediatamente
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes-calendar'] });
    }
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Class, Error, { id: string; data: Partial<ClassRequest> }>({
    mutationFn: ({ id, data }) => ClassService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['class', id] });
    }
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: ClassService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes-calendar'] });
    }
  });
};
