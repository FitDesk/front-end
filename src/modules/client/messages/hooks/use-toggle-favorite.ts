import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientMessageService } from '../services/message.service';
import { toast } from 'sonner';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => clientMessageService.toggleFavorite(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-conversations'] });
      toast.success('Favorito actualizado');
    },
    onError: (error) => {
      console.error('Error toggling favorite:', error);
      toast.error('Error al actualizar favorito');
    },
  });
}
