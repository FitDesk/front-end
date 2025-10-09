import { useQuery } from '@tanstack/react-query';
import { clientMessageService } from '../services/message.service';

interface UseConversationsParams {
  searchTerm?: string;
  filter?: 'all' | 'unread' | 'favorites';
  activeTab?: 'chat' | 'favorites';
}

export function useConversations(params: UseConversationsParams = {}) {
  return useQuery({
    queryKey: ['client-conversations', params],
    queryFn: () => clientMessageService.getConversations(params),
    staleTime: 30000, 
    refetchInterval: 60000, 
  });
}
