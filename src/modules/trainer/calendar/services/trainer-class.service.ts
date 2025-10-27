import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { 
  TrainerClass, 
  ClassSession, 
  CalendarFilters,
  StartClassDTO,
  EndClassDTO,
  UpdateAttendanceDTO,
  ClassMember
} from '../types';

interface TrainerClassFilters extends CalendarFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class TrainerClassService {
  private static readonly ENDPOINT = '/classes';
  private static readonly STATS_ENDPOINT = '/classes/stadistic';
  private static readonly CLASSES_ENDPOINT = '/classes/classes';


  static async getMyClasses(_filters?: TrainerClassFilters): Promise<TrainerClass[]> {
    return [];
  }

 
  static async getClassesByDateRange(startDate: Date, endDate: Date, filters?: CalendarFilters): Promise<TrainerClass[]> {
    const response = await fitdeskApi.get<any[]>(
      `${this.STATS_ENDPOINT}/my-classes/stats`
    );
    
    // Debug: Ver los datos exactos del backend
    console.log('📊 Datos del backend:', response.data);
    
    // Mapear la respuesta del backend al formato del frontend
    const mappedClasses: TrainerClass[] = response.data.map((classData: any) => {
      console.log(`📝 Clase: ${classData.className}, Estudiantes: ${classData.currentStudents}, Estado: ${classData.status}`);
      console.log(`📅 Fecha recibida del backend: ${classData.classDate}`);
      const [day, month, year] = classData.classDate.split('-');
      const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);
      console.log(`📆 Fecha parseada: ${classDate.toLocaleDateString()} (día: ${day}, mes: ${month}, año: ${year})`);
      
      const [startHour, startMinute] = classData.startTime.split(':');
      const [endHour, endMinute] = classData.endTime.split(':');
      
      const startDateTime = new Date(classDate);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
      
      const endDateTime = new Date(classDate);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute));
      
 
      const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
      
      
      let status = 'scheduled';
      
  
      const statusMap: Record<string, string> = {
        'PROGRAMADA': 'scheduled',
        'Activa': 'scheduled', 
        'EN_PROCESO': 'in_progress',
        'COMPLETADA': 'completed',
        'CANCELADA': 'cancelled'
      };
      
      status = statusMap[classData.status] || 'scheduled';
      
      console.log(`🏷️ Estado backend: "${classData.status}" → Estado frontend: "${status}"`);
      
      return {
        id: classData.id,
        name: classData.className,
        description: classData.description || '',
        dayOfWeek: this.getDayOfWeekFromDate(classDate),
        classDate: classDate,
        startTime: classData.startTime,
        duration: duration,
        capacity: classData.maxCapacity,
        location: classData.locationName,
        status: status as any,
        enrolledCount: classData.currentStudents,
        enrolledMembers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    
    console.log(`🔍 Rango de fechas del calendario: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
    console.log(`📋 Total de clases recibidas del backend: ${mappedClasses.length}`);
    
    let filteredClasses = mappedClasses.filter(c => {

      const classDate = new Date(c.classDate);
      

      const classDateOnly = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate());
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      

      const classDateStr = `${classDateOnly.getFullYear()}-${String(classDateOnly.getMonth() + 1).padStart(2, '0')}-${String(classDateOnly.getDate()).padStart(2, '0')}`;
      const startDateStr = `${startDateOnly.getFullYear()}-${String(startDateOnly.getMonth() + 1).padStart(2, '0')}-${String(startDateOnly.getDate()).padStart(2, '0')}`;
      const endDateStr = `${endDateOnly.getFullYear()}-${String(endDateOnly.getMonth() + 1).padStart(2, '0')}-${String(endDateOnly.getDate()).padStart(2, '0')}`;
      
      const isInRange = classDateStr >= startDateStr && classDateStr <= endDateStr;
      if (isInRange) {
        console.log(`✅ Clase incluida: "${c.name}" - ${classDateStr} (rango: ${startDateStr} - ${endDateStr})`);
      } else {
        console.log(`❌ Clase excluida: "${c.name}" - ${classDateStr} (rango: ${startDateStr} - ${endDateStr})`);
      }
      return isInRange;
    });
    
    if (filters?.status) {
      filteredClasses = filteredClasses.filter(c => c.status === filters.status);
    }
    
    if (filters?.location) {
      filteredClasses = filteredClasses.filter(c => c.location === filters.location);
    }
    
    console.log(`✅ Total de clases filtradas: ${filteredClasses.length}`);
    console.log('📋 Clases que pasaron el filtro:', filteredClasses.map(c => ({
      name: c.name,
      fecha: c.classDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: c.status
    })));
    return filteredClasses;
  }
  
  private static getDayOfWeekFromDate(date: Date): any {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  }

  
  static async getClassById(classId: string): Promise<TrainerClass> {
    const response = await fitdeskApi.get<any>(`${this.STATS_ENDPOINT}/${classId}/detail`);
    
    console.log('📋 Detalle de clase:', response.data);
    console.log('👥 Estudiantes:', response.data.students);
    
    // Parsear la fecha
    const [day, month, year] = response.data.classDate.split('-');
    const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const [startHour, startMinute] = response.data.startTime.split(':');
    const [endHour, endMinute] = response.data.endTime.split(':');
    
    const startDateTime = new Date(classDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
    
    const endDateTime = new Date(classDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute));
    
    const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    
    const students = response.data.students || [];
    console.log(`🔍 Total de estudiantes en la respuesta: ${students.length}`);
    
    // Mostrar información de depuración para cada estudiante
    students.forEach((student: any, index: number) => {
      console.log(`  Estudiante ${index + 1}:`, {
        id: student.id,
        name: student.name,
        email: student.email
      });
    });
    

    // Mapear estudiantes del backend al formato del frontend
    const uniqueStudents = students.map((student: any) => ({
      id: String(student.memberId || student.id || ''), // Convertir UUID a string
      name: student.name,
      email: student.email,
      phone: student.phone,
      avatar: student.profileImageUrl,
      enrolledAt: new Date(),
      attendanceStatus: student.attendanceStatus
    }));
    

    const statusMap: Record<string, string> = {
      'PROGRAMADA': 'scheduled',
      'Activa': 'scheduled',
      'EN_PROCESO': 'in_progress',
      'COMPLETADA': 'completed',
      'CANCELADA': 'cancelled'
    };
    
    const status = statusMap[response.data.status] || 'scheduled';
    
    console.log(`🏷️ Estado backend en getClassById: "${response.data.status}" → Estado frontend: "${status}"`);
    
    return {
      id: response.data.id,
      name: response.data.className,
      description: response.data.description || '',
      dayOfWeek: this.getDayOfWeekFromDate(classDate),
      classDate: classDate, // Fecha real de la clase
      startTime: response.data.startTime,
      duration: duration,
      capacity: response.data.maxCapacity,
      location: response.data.locationName,
      status: status as any,
      enrolledCount: uniqueStudents.length, // Usar el conteo de únicos
      enrolledMembers: uniqueStudents,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

 
  static async getClassMembers(classId: string): Promise<ClassMember[]> {
    const response = await fitdeskApi.get<ClassMember[]>(`${this.ENDPOINT}/${classId}/members`);
    return response.data;
  }

 
  static async getClassSessions(classId: string): Promise<ClassSession[]> {
    const response = await fitdeskApi.get<ClassSession[]>(`${this.ENDPOINT}/${classId}/sessions`);
    return response.data;
  }

  /**
   * Obtiene los detalles de una clase específica
   */
  static async getClassDetails(classId: string): Promise<{ status: string }> {
    try {
      // Usamos el endpoint de estadísticas para obtener los detalles de la clase
      const response = await fitdeskApi.get<any>(`${this.STATS_ENDPOINT}/${classId}/detail`);
      return {
        status: response.data.status
      };
    } catch (error) {
      console.error('Error al obtener detalles de la clase:', error);
      throw new Error('No se pudieron obtener los detalles de la clase');
    }
  }

  
  static async startClass(startData: StartClassDTO): Promise<ClassSession> {
    try {
      console.log(`🚀 Intentando iniciar clase ${startData.classId}`);
      // Primero obtenemos el estado actual de la clase
      const classDetails = await this.getClassDetails(startData.classId);
      console.log(`📊 Estado actual de la clase: ${classDetails.status}`);
      
      // Si la clase ya está en progreso, retornamos los datos actuales
      if (classDetails.status === 'EN_PROCESO' || classDetails.status === 'Activa') {
        console.log(`ℹ️ La clase ya está en progreso. Estado actual: ${classDetails.status}`);
        return {
          id: startData.classId,
          classId: startData.classId,
          date: startData.sessionDate,
          startTime: new Date(),
          status: 'in_progress' as any,
          attendees: [],
          notes: startData.notes
        };
      }
      
      // Verificar que la clase esté en un estado que permita iniciarla
      // 'Activa' y 'PROGRAMADA' son estados equivalentes que permiten iniciar la clase
      if (classDetails.status !== 'PROGRAMADA' && classDetails.status !== 'Activa') {
        throw new Error(`No se puede iniciar la clase. Estado actual: ${classDetails.status}`);
      }
      
      // Intentar iniciar la clase
      const response = await fitdeskApi.patch<any>(`${this.CLASSES_ENDPOINT}/${startData.classId}/start`);
      
      console.log('🚀 Respuesta de startClass:', response.data);
      console.log('📊 Estado devuelto por backend:', response.data.status);
      
      // Mapear el status del backend al formato del frontend
      const statusMap: Record<string, string> = {
        'PROGRAMADA': 'scheduled',
        'Activa': 'scheduled', // 'Activa' significa programada/activa
        'EN_PROCESO': 'in_progress', // Solo EN_PROCESO significa en progreso
        'COMPLETADA': 'completed',
        'CANCELADA': 'cancelled'
      };
      
      const status = statusMap[response.data.status] || 'scheduled';
      
      return {
        id: response.data.id,
        classId: startData.classId,
        date: startData.sessionDate,
        startTime: new Date(),
        status: status as any,
        attendees: [],
        notes: startData.notes
      };
    } catch (error) {
      console.error('Error en startClass:', error);
      throw error; // Re-lanzar el error para que el componente lo maneje
    }
  }

  
  static async endClass(endData: EndClassDTO): Promise<ClassSession> {
    // El sessionId es el classId directamente
    const classId = endData.sessionId;
    
    // Mapear el estado de asistencia al formato del backend
    const attendanceStatusMap: Record<string, string> = {
      'present': 'PRESENTE',
      'absent': 'AUSENTE',
      'late': 'TARDE'
    };
    
    // Preparar los datos de asistencia como un objeto con memberId como key
    // El backend espera: { "memberId1": "PRESENTE", "memberId2": "AUSENTE", ... }
    const attendanceData: Record<string, string> = {};
    endData.attendees.forEach(attendee => {
      attendanceData[attendee.memberId] = attendanceStatusMap[attendee.status] || 'AUSENTE';
    });
    
    console.log('📝 Completando clase con datos de asistencia:', JSON.stringify(attendanceData));
    console.log('📝 Total de estudiantes en asistencia:', endData.attendees.length);
    endData.attendees.forEach(attendee => {
      console.log(`  - ${attendee.memberId}: ${attendee.status} -> ${attendanceStatusMap[attendee.status]}`);
    });
    
    // Completar la clase enviando los datos de asistencia
    const response = await fitdeskApi.patch<any>(
      `${this.CLASSES_ENDPOINT}/${classId}/complete`,
      attendanceData
    );
    
    console.log('✅ Clase completada:', response.data);
    
    return {
      id: response.data.id,
      classId: classId,
      date: new Date(),
      startTime: new Date(),
      endTime: endData.endTime,
      status: 'completed' as any, // Forzar estado completado
      attendees: endData.attendees,
      notes: endData.notes
    };
  }

 
  static async updateAttendance(attendanceData: UpdateAttendanceDTO): Promise<ClassSession> {
    const response = await fitdeskApi.patch<ClassSession>(`${this.ENDPOINT}/update-attendance`, attendanceData);
    return response.data;
  }

  
  static async getCurrentSession(): Promise<ClassSession | null> {
    try {
      const response = await fitdeskApi.get<ClassSession>(`${this.ENDPOINT}/current-session`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null; 
        }
      }
      throw error;
    }
  }


  static async cancelClass(classId: string, reason?: string): Promise<void> {
    await fitdeskApi.patch(`${this.CLASSES_ENDPOINT}/${classId}/cancel`, { reason });
  }

 
  static async getTrainerStats(): Promise<{
    totalClasses: number;
    completedClasses: number;
    totalStudents: number;
    averageAttendance: number;
    upcomingClasses: number;
  }> {
    // Obtener las clases y calcular las estadísticas
    const response = await fitdeskApi.get<any[]>(`${this.STATS_ENDPOINT}/my-classes/stats`);
    const classes = response.data;
    
    const totalClasses = classes.length;
    const completedClasses = classes.filter((c: any) => c.status === 'COMPLETADA').length;
    const totalStudents = classes.reduce((sum: number, c: any) => sum + (c.currentStudents || 0), 0);
    const avgAttendance = classes.length > 0 
      ? classes.reduce((sum: number, c: any) => sum + (c.averageAttendance || 0), 0) / classes.length
      : 0;
    const upcomingClasses = classes.filter((c: any) => c.status === 'PROGRAMADA').length;
    
    return {
      totalClasses,
      completedClasses,
      totalStudents,
      averageAttendance: avgAttendance,
      upcomingClasses
    };
  }

 
  static async getClassesByDate(date: Date): Promise<TrainerClass[]> {
    const dateStr = date.toISOString().split('T')[0];
    const response = await fitdeskApi.get<TrainerClass[]>(`${this.ENDPOINT}/date/${dateStr}`);
    return response.data;
  }

 
  static async markAttendance(
    sessionId: string, 
    memberId: string, 
    status: 'present' | 'absent' | 'late', 
    notes?: string
  ): Promise<void> {
    await fitdeskApi.patch(`${this.ENDPOINT}/sessions/${sessionId}/attendance`, {
      memberId,
      status,
      notes
    });
  }

  static async saveAttendance(classId: string, attendanceData: Record<string, string>): Promise<void> {
    console.log('💾 Guardando solo asistencia para la clase:', classId);
    console.log('📝 Datos de asistencia:', attendanceData);
    await fitdeskApi.post(`${this.CLASSES_ENDPOINT}/${classId}/save-attendance`, attendanceData);
    console.log('✅ Asistencia guardada exitosamente (sin completar la clase)');
  }

  
  static async getAvailableLocations(): Promise<string[]> {
    // Por ahora retornamos un array vacío ya que este endpoint necesita implementarse
    // o usar el endpoint de locations del módulo de ubicaciones
    return [];
  }
}
