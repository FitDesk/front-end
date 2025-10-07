import { useQuery } from "@tanstack/react-query";
import { messageService } from "../services/message.service";

interface ConversationFilters {
    searchTerm?: string;
    filter?: 'all' | 'unread' | 'favorites';
    activeTab?: 'chat' | 'favorites';
}

export function useConversations(filters: ConversationFilters = {}) {
    return useQuery({
        queryKey: ["conversations", filters],
        queryFn: () => messageService.getConversations(filters),
        staleTime: 1000 * 60 * 5, 
        refetchInterval: 1000 * 30, 
        retry: 1, 
        retryDelay: 1000, 
    });
}
