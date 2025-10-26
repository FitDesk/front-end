import { fitdeskApi } from "@/core/api/fitdeskApi";


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
    status?: string; // 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
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
    estado: 'disponible' | 'lleno' | 'cancelado' | 'en_progreso';
    descripcion?: string;
    precio?: number;
}



export class ClassesService {

    
    private static isClassInProgress(classDate: string, schedule: string): boolean {
        try {
            // Parse the class date and time
            const [startTime, endTime] = schedule.split(' - ');
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            const classDateTime = new Date(classDate);
            const startDateTime = new Date(classDateTime);
            startDateTime.setHours(startHour, startMinute, 0, 0);
            
            const endDateTime = new Date(classDateTime);
            endDateTime.setHours(endHour, endMinute, 0, 0);
            
            const now = new Date();
            
            return now >= startDateTime && now <= endDateTime;
        } catch (error) {
            console.error('Error checking if class is in progress:', error);
            return false;
        }
    }

    private static mapClassResponseToClaseReserva(classResponse: ClassResponse, reservationsCount: number = 0): ClaseReserva {
        const inscritos = reservationsCount;
        const capacidad = classResponse.maxCapacity;
        
        // First check if the class is marked as active/inactive
        if (!classResponse.active) {
            return {
                id: classResponse.id,
                nombre: classResponse.className,
                instructor: classResponse.trainerName,
                horario: classResponse.schedule,
                fecha: classResponse.classDate,
                capacidad: capacidad,
                inscritos: inscritos,
                ubicacion: classResponse.locationName,
                estado: 'cancelado',
                descripcion: classResponse.description
            };
        }
        
        // Check if the class is in progress (from backend status or time-based)
        const isInProgress = classResponse.status === 'IN_PROGRESS' || 
                           classResponse.status === 'ACTIVE' ||
                           this.isClassInProgress(classResponse.classDate, classResponse.schedule);
        
        // Determine the status
        let estado: 'disponible' | 'lleno' | 'cancelado' | 'en_progreso' = 'disponible';
        
        if (isInProgress) {
            estado = 'en_progreso';
        } else if (inscritos >= capacidad) {
            estado = 'lleno';
        }
        
        return {
            id: classResponse.id,
            nombre: classResponse.className,
            instructor: classResponse.trainerName,
            horario: classResponse.schedule,
            fecha: classResponse.classDate,
            capacidad: capacidad,
            inscritos: inscritos,
            ubicacion: classResponse.locationName,
            estado,
            descripcion: classResponse.description
        };
    }

    static async getClasesPorFecha(): Promise<ClaseReserva[]> {
        try {
            const response = await fitdeskApi.get<BackendPaginatedClassResponse>(
                `/classes/classes/paginated?page=0&size=1000`
            );
            
            return response.data.content
                .filter(clase => clase.active)
                .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
        } catch (error: any) {
            console.error("Error obteniendo clases por fecha:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener las clases");
        }
    }

    static async getClasesPaginated(page: number = 0, size: number = 10, search?: string): Promise<PaginatedClassResponse> {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());
            if (search && search.trim()) {
                params.append('search', search);
            }
            
            const response = await fitdeskApi.get<BackendPaginatedClassResponse>(
                `/classes/classes/paginated?${params.toString()}`
            );
            
            const mappedContent = response.data.content
                .filter(clase => clase.active)
                .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
            
            return {
                content: mappedContent,
                number: response.data.number,
                size: response.data.size,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                first: response.data.first,
                last: response.data.last
            };
        } catch (error: any) {
            console.error("Error obteniendo clases paginadas:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al obtener las clases");
        }
    }


    static async reservarClase(classId: string): Promise<ClassReservationResponse> {
        try {
            const request: ClassReservationRequest = { classId };

            const response = await fitdeskApi.post<ClassReservationResponse>(`/classes/reservations`, request);
            return response.data;
        } catch (error: any) {
            console.error("Error reservando clase:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al reservar la clase");
        }
    }

    static async cancelarReserva(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.delete(`/classes/reservations/${reservationId}`);
        } catch (error: any) {
            console.error("Error cancelando reserva:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al cancelar la reserva");
        }
    }

    static async confirmarAsistencia(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.put(`/classes/reservations/${reservationId}/confirm`);
        } catch (error: any) {
            console.error("Error confirmando asistencia:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al confirmar asistencia");
        }
    }

    static async completarReserva(reservationId: string): Promise<void> {
        try {
            await fitdeskApi.put(`/classes/reservations/${reservationId}/complete`);
        } catch (error: any) {
            console.error("Error completando reserva:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al completar la reserva");
        }
    }

    static async getMisReservas(completed?: boolean): Promise<ClassReservationResponse[]> {
        try {
            const params = completed !== undefined ? `?completed=${completed}` : '';
            const response = await fitdeskApi.get<ClassReservationResponse[]>(`/classes/reservations/my${params}`);
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
            const response = await fitdeskApi.get<BackendPaginatedClassResponse>(
                `/classes/classes/paginated?page=0&size=1000`
            );
            
            return response.data.content
                .filter(clase => clase.active)
                .map(classResponse => this.mapClassResponseToClaseReserva(classResponse));
        } catch (error: any) {
            console.error("Error buscando clases:", error);
            throw new Error(error.response?.data?.errorMessage || error.message || "Error al buscar clases");
        }
    }
}
