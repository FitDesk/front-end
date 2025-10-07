import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../services/message.service";

export function useToggleFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (conversationId: string) => messageService.toggleFavorite(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (error: unknown) => {
            console.error("Error toggling favorite:", error);
        }
    });
}
