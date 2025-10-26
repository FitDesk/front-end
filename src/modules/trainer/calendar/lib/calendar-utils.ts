import type { TrainerClass, CalendarEvent } from '../types';

export function convertClassesToEvents(classes: TrainerClass[]): CalendarEvent[] {
  if (!classes || !Array.isArray(classes)) {
    console.log('⚠️ No hay clases para convertir a eventos');
    return [];
  }
  
  console.log(`🔄 Convirtiendo ${classes.length} clases a eventos`);
  
  const events = classes.map(cls => {
    // Usar la fecha real de la clase (classDate) en lugar de createdAt
    const classDate = new Date(cls.classDate);
    const [hours, minutes] = cls.startTime.split(':').map(Number);
    
    // Crear la fecha/hora de inicio combinando la fecha de la clase con la hora
    const startTime = new Date(classDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    // Calcular la hora de fin
    const endTime = new Date(startTime.getTime() + cls.duration * 60000);
    
    console.log(`📅 Evento creado: ${cls.name} - ${startTime.toISOString()}`);
    
    return {
      id: cls.id,
      title: cls.name,
      start: startTime,
      end: endTime,
      location: cls.location,
      capacity: cls.capacity,
      enrolledCount: cls.enrolledCount,
      status: cls.status,
      description: cls.description,
      members: cls.enrolledMembers
    };
  });
  
  console.log(`✅ Total de eventos creados: ${events.length}`);
  return events;
}
