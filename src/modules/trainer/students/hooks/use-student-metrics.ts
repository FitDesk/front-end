import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentService } from '../services/student.service';
import { useStudentsStore } from '../store/students-store';

export function useStudentMetrics() {
  const queryClient = useQueryClient();
  const { 
    metrics, 
    attendanceHistory, 
    setMetrics, 
    setAttendanceHistory,
    addAttendanceRecord 
  } = useStudentsStore();
  
  
  const { 
    isLoading: isLoadingMetrics, 
    error: metricsError,
    refetch: refreshMetrics
  } = useQuery({
    queryKey: ['student-metrics'],
    queryFn: async () => {
      const result = await studentService.getMetrics();
      setMetrics(result);
      return result;
    },
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  
  const { 
    isLoading: isLoadingAttendance,
    error: attendanceError,
    refetch: refreshAttendance
  } = useQuery({
    queryKey: ['attendance-history'],
    queryFn: async () => {
      const result = await studentService.getAttendanceHistory();
      setAttendanceHistory(result.data);
      return result;
    },
    staleTime: 1 * 60 * 1000, 
    gcTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

 
  const useAttendanceStats = (period: 'week' | 'month' | 'quarter' | 'year' = 'month', studentId?: string) => {
    return useQuery({
      queryKey: ['attendance-stats', period, studentId],
      queryFn: () => studentService.getAttendanceStats(period, studentId),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  
  const markAttendanceMutation = useMutation({
    mutationFn: async ({ 
      studentId, 
      classId, 
      status, 
      notes 
    }: { 
      studentId: string; 
      classId: string; 
      status: 'present' | 'absent' | 'late' | 'excused';
      notes?: string;
    }) => {
      return await studentService.markAttendance(studentId, classId, status, notes);
    },
    onSuccess: (newRecord) => {
    
      addAttendanceRecord(newRecord);
      
     
      queryClient.invalidateQueries({ queryKey: ['student-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      
      toast.success('Asistencia registrada exitosamente');
    },
    onError: () => {
      toast.error('Error al registrar asistencia');
    },
  });

 
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      studentId, 
      message 
    }: { 
      studentId: string; 
      message: {
        subject: string;
        content: string;
        type: 'email' | 'sms' | 'notification';
      };
    }) => {
      return await studentService.sendMessage(studentId, message);
    },
    onSuccess: () => {
      toast.success('Mensaje enviado exitosamente');
    },
    onError: () => {
      toast.error('Error al enviar mensaje');
    },
  });

  return {
    
    metrics,
    attendanceHistory,
    
   
    isLoadingMetrics,
    isLoadingAttendance,
    isLoading: isLoadingMetrics || isLoadingAttendance,
    metricsError,
    attendanceError,
    
    
    refreshMetrics,
    refreshAttendance,
    markAttendance: markAttendanceMutation.mutateAsync,
    sendMessage: sendMessageMutation.mutateAsync,
    isMarkingAttendance: markAttendanceMutation.isPending,
    isSendingMessage: sendMessageMutation.isPending,
    useAttendanceStats,
  };
}
