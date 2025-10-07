import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../services/message.service";
import { toast } from "sonner";

interface SendMessageParams {
    conversationId: string;
    text: string;
    toUserId: string;
}

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: SendMessageParams) => messageService.sendMessage(params),
        onSuccess: (_, variables) => {
       
            queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (error) => {
            console.error("Error sending message:", error);
            toast.error("Error al enviar el mensaje. Inténtalo de nuevo.");
        },
    });
}
