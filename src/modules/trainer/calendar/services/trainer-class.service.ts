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

  /**
   * Obtiene todas las clases asignadas al trainer actual con filtros
   */
  static async getMyClasses(_filters?: TrainerClassFilters): Promise<TrainerClass[]> {
    // Por ahora retornamos un array vacío ya que este endpoint necesita implementarse en el backend
    // El calendario usa getClassesByDateRange que sí funciona
    return [];
  }

  /**
   * Obtiene las clases en un rango de fechas (para calendario)
   */
  static async getClassesByDateRange(startDate: Date, endDate: Date, filters?: CalendarFilters): Promise<TrainerClass[]> {
    // Usar el endpoint correcto que ya existe en el backend
    const response = await fitdeskApi.get<any[]>(
      `${this.STATS_ENDPOINT}/my-classes/stats`
    );
    
    // Debug: Ver los datos exactos del backend
    console.log('📊 Datos del backend:', response.data);
    
    // Mapear la respuesta del backend al formato del frontend
    const mappedClasses: TrainerClass[] = response.data.map((classData: any) => {
      console.log(`📝 Clase: ${classData.className}, Estudiantes: ${classData.currentStudents}, Estado: ${classData.status}`);
      console.log(`📅 Fecha recibida del backend: ${classData.classDate}`);
      // Parsear la fecha que viene en formato dd-MM-yyyy
      const [day, month, year] = classData.classDate.split('-');
      const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      console.log(`📆 Fecha parseada: ${classDate.toISOString()} (día: ${day}, mes: ${month}, año: ${year})`);
      
      const [startHour, startMinute] = classData.startTime.split(':');
      const [endHour, endMinute] = classData.endTime.split(':');
      
      const startDateTime = new Date(classDate);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
      
      const endDateTime = new Date(classDate);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute));
      
      // Calcular duración en minutos
      const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
      
      // Mapear el status del backend al formato del frontend
      let status = 'scheduled';
      
      // Mapear los estados directamente
      const statusMap: Record<string, string> = {
        'PROGRAMADA': 'scheduled',
        'Activa': 'in_progress', // 'Activa' significa en progreso según el detalle
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
        classDate: classDate, // Fecha real de la clase
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
    
    // Aplicar filtros del frontend y filtrar por rango de fechas
    console.log(`🔍 Rango de fechas del calendario: ${startDate.toISOString()} - ${endDate.toISOString()}`);
    let filteredClasses = mappedClasses.filter(c => {
      // Usar classDate directamente para el filtro
      const classDate = new Date(c.classDate);
      
      // Normalizar las fechas a medianoche UTC para comparar solo día/mes/año
      const classDateOnly = Date.UTC(classDate.getFullYear(), classDate.getMonth(), classDate.getDate());
      const startDateOnly = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      
      const isInRange = classDateOnly >= startDateOnly && classDateOnly <= endDateOnly;
      console.log(`🔎 Clase "${c.name}": fecha=${new Date(classDateOnly).toISOString()} en rango [${new Date(startDateOnly).toISOString()} - ${new Date(endDateOnly).toISOString()}]? ${isInRange}`);
      return isInRange;
    });
    
    if (filters?.status) {
      filteredClasses = filteredClasses.filter(c => c.status === filters.status);
    }
    
    if (filters?.location) {
      filteredClasses = filteredClasses.filter(c => c.location === filters.location);
    }
    
    console.log(`✅ Total de clases filtradas: ${filteredClasses.length}`);
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
    
    // Obtener todos los estudiantes sin filtrar duplicados
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
    
    // No filtrar estudiantes duplicados para mostrar a todos los inscritos
    const uniqueStudents = [...students];
    
    // Mapear el status del backend al formato del frontend
    const statusMap: Record<string, string> = {
      'PROGRAMADA': 'scheduled',
      'Activa': 'in_progress', // 'Activa' significa en progreso
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
      if (classDetails.status !== 'PROGRAMADA') {
        throw new Error(`No se puede iniciar la clase. Estado actual: ${classDetails.status}`);
      }
      
      // Intentar iniciar la clase
      const response = await fitdeskApi.patch<any>(`${this.ENDPOINT}/${startData.classId}/start`);
      
      console.log('🚀 Respuesta de startClass:', response.data);
      console.log('📊 Estado devuelto por backend:', response.data.status);
      
      // Mapear el status del backend al formato del frontend
      const statusMap: Record<string, string> = {
        'PROGRAMADA': 'scheduled',
        'Activa': 'in_progress',
        'EN_PROCESO': 'in_progress',
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
    // Extraer el classId del sessionId (formato: session-{classId})
    const classId = endData.sessionId.replace('session-', '');
    const response = await fitdeskApi.patch<any>(`${this.ENDPOINT}/${classId}/complete`);
    return {
      id: response.data.id,
      classId: classId,
      date: new Date(),
      startTime: new Date(),
      endTime: endData.endTime,
      status: response.data.status,
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
    await fitdeskApi.patch(`${this.ENDPOINT}/${classId}/cancel`, { reason });
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

  
  static async getAvailableLocations(): Promise<string[]> {
    // Por ahora retornamos un array vacío ya que este endpoint necesita implementarse
    // o usar el endpoint de locations del módulo de ubicaciones
    return [];
  }
}
