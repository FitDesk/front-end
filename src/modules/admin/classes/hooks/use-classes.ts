import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassService } from '../services/class.service';
import type { Class, CreateClassDTO, UpdateClassDTO } from '../types/class';

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
    initialData: []
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
  
  return useMutation<Class, Error, CreateClassDTO>({
    mutationFn: ClassService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Class, Error, UpdateClassDTO>({
    mutationFn: ClassService.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
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
    }
  });
};
