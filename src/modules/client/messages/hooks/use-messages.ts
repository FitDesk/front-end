import { useQuery } from '@tanstack/react-query';
import { clientMessageService } from '../services/message.service';

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['client-messages', conversationId],
    queryFn: () => clientMessageService.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10000, 
    refetchInterval: 5000, 
  });
}
