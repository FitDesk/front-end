import { useQuery } from "@tanstack/react-query";
import { messageService } from "../services/message.service";

export function useMessages(conversationId: string) {
    return useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => messageService.getMessages(conversationId),
        enabled: !!conversationId,
        staleTime: 1000 * 60 * 2, 
        refetchInterval: 1000 * 10, 
    });
}
