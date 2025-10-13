import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassesService } from "../services/classes.service";

export const useClasesPorFecha = () => {
    return useQuery({
        queryKey: ["classes"],
        queryFn: ClassesService.getClasesPorFecha,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
};

export const useClasesDestacadas = () => {
    return useQuery({
        queryKey: ["classes", "featured"],
        queryFn: ClassesService.getClasesDestacadas,
        staleTime: 10 * 60 * 1000, 
    });
};

export const useBuscarClases = () => {
    return useQuery({
        queryKey: ["classes", "search"],
        queryFn: ClassesService.buscarClases,
        staleTime: 2 * 60 * 1000, 
    });
};

export const useReservarClase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ClassesService.reservarClase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
};
