import { fitdeskApi } from "@/core/api/fitdeskApi";

// Interfaces que coinciden exactamente con el backend msvc-classes
export interface ClassResponse {
    id: string;
    className: string;
    locationName: string;
    trainerName: string;
    classDate: string;
    duration: number;
    maxCapacity: number;
    schedule: string;
    active: boolean;
    description: string;
}

export interface BackendPaginatedClassResponse {
    content: ClassResponse[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface PaginatedClassResponse {
    content: ClaseReserva[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface ClassReservationRequest {
    classId: string;
}

export interface ClassReservationResponse {
    reservationId: string;
    classId: string;
    className: string;
    trainerName: string;
    schedule: string;
    locationName: string;
    capacity: string;
    action: string;
    alreadyReserved: boolean;
    completed: boolean;
}

export interface ClaseReserva {
    id: string;
    nombre: string;
    instructor: string;
    horario: string;
    fecha: string;
    capacidad: number;
    inscritos: number;
    ubicacion: string;
    estado: 'disponible' | 'lleno' | 'cancelado';
    descripcion?: string;
    precio?: number;
}



export class ClassesService {

    
    private static mapClassResponseToClaseReserva(classResponse: ClassResponse, reservationsCount: number = 0): ClaseReserva {
        const inscritos = reservationsCount;
        const capacidad = classResponse.maxCapacity;
        const estado = inscritos >= capacidad ? 'lleno' : 'disponible';
        
        return {
            id: classResponse.id,
            nombre: classResponse.className,
            instructor: classResponse.trainerName,
            horario: classResponse.schedule,
            fecha: classResponse.classDate,
            capacidad: capacidad,
            inscritos: inscritos,
            ubicacion: classResponse.locationName,
            estado: estado as 'disponible' | 'lleno' | 'cancelado',
            descripcion: classResponse.description
        };
    }

    static async getClasesPorFecha(): Promise<ClaseReserva[]> {
        try {
            const response = await fitdeskApi.get<ClassResponse[]>(`/classes`);
            
            return response.data
                .filter(clase => clase.active)
                .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
        } catch (error: any) {
            console.error("Error obteniendo clases por fecha:", error);
            throw new Error(error.message || "Error al obtener las clases");
        }
    }

    static async getClasesPaginated(page: number = 0, size: number = 10, search?: string): Promise<PaginatedClassResponse> {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());
            if (search) {
                params.append('search', search);
            }
            
            const response = await fitdeskApi.get<BackendPaginatedClassResponse>(`/classes/paginated?${params.toString()}`);
            
            const mappedContent = response.data.content
                .filter(clase => clase.active)
                .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
            
            return {
                ...response.data,
                content: mappedContent
            };
        } catch (error: any) {
            console.error("Error obteniendo clases paginadas:", error);
            throw new Error(error.message || "Error al obtener las clases");
        }
    }


    static async reservarClase(classId: string): Promise<ClassReservationResponse> {
        try {
            const request: ClassReservationRequest = { classId };
            const response = await fitdeskApi.post<ClassReservationResponse>(`/reservations`, request);
            return response.data;
        } catch (error: any) {
            console.error("Error reservando clase:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al reservar la clase");
        }
    }

    static async cancelarReserva(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.delete(`/reservations/${reservationId}`);
        } catch (error: any) {
            console.error("Error cancelando reserva:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al cancelar la reserva");
        }
    }

    static async confirmarAsistencia(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.put(`/reservations/${reservationId}/confirm`);
        } catch (error: any) {
            console.error("Error confirmando asistencia:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al confirmar asistencia");
        }
    }

    static async completarReserva(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.put(`/reservations/${reservationId}/complete`);
        } catch (error: any) {
            console.error("Error completando reserva:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al completar la reserva");
        }
    }

    static async getMisReservas(completed?: boolean): Promise<ClassReservationResponse[]> {
        try {
            const params = completed !== undefined ? `?completed=${completed}` : '';
            const response = await fitdeskApi.get<ClassReservationResponse[]>(`/reservations/my${params}`);
            return response.data || [];
        } catch (error: any) {
            console.error("Error obteniendo mis reservas:", error);
            if (error.response?.status === 204) {
                return [];
            }
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener las reservas");
        }
    }

    static async buscarClases(): Promise<ClaseReserva[]> {
        try {
            const response = await fitdeskApi.get<ClassResponse[]>(`/classes`);
            
            return response.data
                .filter(clase => clase.active)
                .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
        } catch (error: any) {
            console.error("Error buscando clases:", error);
            throw new Error(error.message || "Error al buscar clases");
        }
    }
}
