import { fitdeskApi } from "@/core/api/fitdeskApi";

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

export interface ClaseDestacada {
    id: string;
    nombre: string;
    instructor: string;
    duracion: string;
    participantes: number;
    rating: number;
    imagen: string;
    descripcion: string;
    categoria: string;
}

export class ClassesService {
    static async getClasesPorFecha(): Promise<ClaseReserva[]> {
        try {
            const response = await fitdeskApi.get<ClaseReserva[]>(`/classes`);
            return response.data;
        } catch (error: any) {
            console.error("Error obteniendo clases por fecha:", error);
            throw new Error(error.message || "Error al obtener las clases");
        }
    }

    static async getClasesDestacadas(): Promise<ClaseDestacada[]> {
        try {
            const response = await fitdeskApi.get<ClaseDestacada[]>("/classes");
            return response.data;
        } catch (error: any) {
            console.error("Error obteniendo clases destacadas:", error);
            throw new Error(error.message || "Error al obtener las clases destacadas");
        }
    }

    static async reservarClase(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fitdeskApi.post<{ success: boolean; message: string }>(`/classes`);
            return response.data;
        } catch (error: any) {
            console.error("Error reservando clase:", error);
            throw new Error(error.message || "Error al reservar la clase");
        }
    }

    static async buscarClases(): Promise<ClaseReserva[]> {
        try {
            const response = await fitdeskApi.get<ClaseReserva[]>(`/classes`);
            return response.data;
        } catch (error: any) {
            console.error("Error buscando clases:", error);
            throw new Error(error.message || "Error al buscar clases");
        }
    }
}
