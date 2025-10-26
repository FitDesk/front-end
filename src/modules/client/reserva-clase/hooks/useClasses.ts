import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassesService } from "../services/classes.service";
import type { ClaseReserva } from "../services/classes.service";

interface PaginatedResponse {
    content: ClaseReserva[];
    // Add other pagination properties if needed
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

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
    return useQuery<PaginatedResponse, Error>({
        queryKey: ["classes", "paginated", page, size, search],
        queryFn: () => ClassesService.getClasesPaginated(page, size, search) as Promise<PaginatedResponse>,
        staleTime: 2 * 60 * 1000,
        refetchInterval: (query) => {
            const data = query.state.data;
            if (!data?.content) return false;
            
            // If any class is in progress, refetch more frequently
            const hasClassInProgress = data.content.some((classItem: ClaseReserva) => {
                const horario = classItem.horario || '';
                const [startTimeStr, endTimeStr] = horario.split(' - ');
                if (!startTimeStr || !endTimeStr) return false;
                
                try {
                    const now = new Date();
                    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
                    const [endHour, endMinute] = endTimeStr.split(':').map(Number);
                    
                    const classDate = new Date(classItem.fecha);
                    const startDateTime = new Date(classDate);
                    startDateTime.setHours(startHour, startMinute, 0, 0);
                    
                    const endDateTime = new Date(classDate);
                    endDateTime.setHours(endHour, endMinute, 0, 0);
                    
                    return now >= startDateTime && now <= endDateTime;
                } catch (error) {
                    console.error('Error checking class time:', error);
                    return false;
                }
            });
            
            // Refetch every 10 seconds if any class is in progress
            return hasClassInProgress ? 10000 : false;
        },
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
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
};