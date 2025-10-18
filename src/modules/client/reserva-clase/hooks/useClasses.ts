import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassesService } from "../services/classes.service";

export const useClasesPorFecha = () => {
    return useQuery({
        queryKey: ["classes"],
        queryFn: ClassesService.getClasesPorFecha,
        staleTime: 5 * 60 * 1000,
    });
};


export const useBuscarClases = () => {
    return useQuery({
        queryKey: ["classes", "search"],
        queryFn: ClassesService.buscarClases,
        staleTime: 2 * 60 * 1000, 
    });
};

export const useClasesPaginated = (page: number = 0, size: number = 10, search?: string) => {
    return useQuery({
        queryKey: ["classes", "paginated", page, size, search],
        queryFn: () => ClassesService.getClasesPaginated(page, size, search),
        staleTime: 2 * 60 * 1000,
    });
};

export const useReservarClase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (classId: string) => ClassesService.reservarClase(classId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
};

export const useCancelarReserva = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reservationId: string) => ClassesService.cancelarReserva(reservationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
};

export const useMisReservas = (completed?: boolean) => {
    return useQuery({
        queryKey: ["reservations", "my", completed],
        queryFn: () => ClassesService.getMisReservas(completed),
        staleTime: 2 * 60 * 1000,
    });
};

export const useConfirmarAsistencia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reservationId: string) => ClassesService.confirmarAsistencia(reservationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
};

export const useCompletarReserva = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reservationId: string) => ClassesService.completarReserva(reservationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
};
