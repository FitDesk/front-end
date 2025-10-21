import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { ClientClass, ClassFilters, PaginatedResponse } from '../types';


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

export class ClientClassesService {

  
  private static mapReservationToClientClass(reservation: ClassReservationResponse): ClientClass {
    
    const capacityMatch = reservation.capacity.match(/(\d+)\/(\d+)/);
    const currentParticipants = capacityMatch ? parseInt(capacityMatch[1]) : 0;
    const maxParticipants = capacityMatch ? parseInt(capacityMatch[2]) : 0;
    
    
    let status: 'upcoming' | 'pending' | 'completed' | 'cancelled';
    if (reservation.completed) {
      status = 'completed';
    } else if (reservation.alreadyReserved) {
      status = 'pending';
    } else {
      status = 'upcoming';
    }

    return {
      id: reservation.classId,
      reservationId: reservation.reservationId,
      title: reservation.className,
      description: '',
      trainer: {
        id: '',
        name: reservation.trainerName,
        avatar: ''
      },
      location: reservation.locationName,
      date: new Date().toISOString().split('T')[0],
      time: reservation.schedule.split(' - ')[0],
      duration: 60,
      maxParticipants,
      currentParticipants,
      status,
      canConfirm: status === 'upcoming',
      canCancel: status === 'upcoming' || status === 'pending',
      price: 0
    };
  }

  static async getAll(filters?: ClassFilters): Promise<PaginatedResponse<ClientClass>> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status && filters.status !== 'all') {
        params.append('completed', filters.status === 'completed' ? 'true' : 'false');
      }
      
      const response = await fitdeskApi.get(`/reservations/my?${params.toString()}`);
      const reservations: ClassReservationResponse[] = Array.isArray(response.data) ? response.data : [];
      
      
      const clientClasses = reservations.map(this.mapReservationToClientClass);
      
      return {
        data: clientClasses,
        pagination: {
          page: 1,
          limit: clientClasses.length,
          total: clientClasses.length,
          totalPages: 1
        }
      };
    } catch (error: any) {
      console.error('Error fetching client classes:', error);
      if (error.response?.status === 204) {
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 0,
            total: 0,
            totalPages: 0
          }
        };
      }
      throw error;
    }
  }


  static async getById(id: string): Promise<ClientClass> {
    try {
      const response = await fitdeskApi.get(`/reservations/my`);
      const reservations: ClassReservationResponse[] = Array.isArray(response.data) ? response.data : [];
      const reservation = reservations.find(r => r.classId === id);
      
      if (!reservation) {
        throw new Error('Reserva no encontrada');
      }
      
      return this.mapReservationToClientClass(reservation);
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  }


  static async bookClass(classId: string): Promise<{ success: boolean; message: string }> {
    try {
      await fitdeskApi.post('/reservations', {
        classId: classId
      });
      return { success: true, message: 'Clase reservada exitosamente' };
    } catch (error) {
      console.error('Error booking class:', error);
      throw error;
    }
  }


  static async cancelReservation(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
      await fitdeskApi.delete(`/reservations/${reservationId}`);
      return { success: true, message: 'Reserva cancelada exitosamente' };
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  }


  static async confirmAttendance(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
      await fitdeskApi.put(`/reservations/${reservationId}/confirm`);
      return { success: true, message: 'Asistencia confirmada exitosamente' };
    } catch (error) {
      console.error('Error confirming attendance:', error);
      throw error;
    }
  }


  static async cancelClass(classId: string): Promise<{ success: boolean; message: string }> {
    try {

      const response = await fitdeskApi.get('/reservations/my');
      const reservations: ClassReservationResponse[] = Array.isArray(response.data) ? response.data : [];
      const reservation = reservations.find(r => r.classId === classId);
      
      if (!reservation) {
        throw new Error('Reserva no encontrada');
      }
      
      return await this.cancelReservation(reservation.reservationId);
    } catch (error) {
      console.error('Error canceling class:', error);
      throw error;
    }
  }


  static async completeReservation(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
      await fitdeskApi.put(`/reservations/${reservationId}/complete`);
      return { success: true, message: 'Clase completada exitosamente' };
    } catch (error) {
      console.error('Error completing reservation:', error);
      throw error;
    }
  }
}
