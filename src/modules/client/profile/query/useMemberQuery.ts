import type { MemberResponse } from "@/core/interfaces/member.interface";
import { MemberService } from "@/core/services/member.service";
import { toast } from "@/shared/components/ui/toast-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetMemberQuery = (id: string) => useQuery({
    queryKey: ['member', id],
    queryFn: () => MemberService.getMemberById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
})

export const useUpdateProfileImageMutation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file }: { file: File }) => MemberService.updateProfileImage(userId, file),

        // --- Actualización Optimista ---
        onMutate: async ({ file }) => {
            // 1. Cancelar queries en curso para evitar sobreescribir la actualización optimista
            await queryClient.cancelQueries({ queryKey: ['member', userId] });

            // 2. Guardar el estado anterior
            const previousMemberData = queryClient.getQueryData<MemberResponse>(['member', userId]);

            // 3. Actualizar la UI al instante con la nueva imagen (usando una URL local)
            const tempImageUrl = URL.createObjectURL(file);
            queryClient.setQueryData<MemberResponse>(['member', userId], (oldData) => {
                if (!oldData) return undefined;
                return {
                    ...oldData,
                    profileImageUrl: tempImageUrl,
                };
            });

            // 4. Retornar el estado anterior en el contexto para poder hacer rollback en caso de error
            return { previousMemberData, tempImageUrl };
        },

        // Si la mutación falla, revertir al estado anterior
        onError: (err, variables, context) => {
            if (context?.previousMemberData) {
                queryClient.setQueryData(['member', userId], context.previousMemberData);
            }
            toast.error(`Error al subir la imagen: ${err.message}`);
        },

        // Al finalizar (éxito o error), limpiar y refetchear los datos del servidor
        onSettled: (data, error, variables, context) => {
            if (context?.tempImageUrl) {
                URL.revokeObjectURL(context.tempImageUrl); // Limpiar memoria
            }
            queryClient.invalidateQueries({ queryKey: ['member', userId] });
        },

        onSuccess: () => {
            toast.success("¡Foto de perfil actualizada con éxito!");
        }
    });
};