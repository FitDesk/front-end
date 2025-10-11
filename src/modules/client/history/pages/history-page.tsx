import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useProgress } from '../hooks/use-progress';
import { StatsCards } from '../components/StatsCards';
import { GoalsSection } from '../components/GoalsSection';
import { AttendanceChart } from '../components/AttendanceChart';
import { ClassHistoryTable } from '../components/ClassHistoryTable';

export default function HistoryPage() {
  const { data: progressData, isLoading, refetch, isFetching } = useProgress();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi progreso</h1>
          <p className="text-muted-foreground mt-1">Sigue tu progreso en FitDesk.</p>
        </div>
        
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </motion.div>

      {isLoading ? (
        <>
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border rounded-xl p-6">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>

          {/* Goals Section Skeleton */}
          <div className="bg-card border rounded-xl p-6">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>

          {/* Attendance Chart Skeleton */}
          <div className="bg-card border rounded-xl p-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <Skeleton className="h-80" />
          </div>

          {/* Class History Skeleton */}
          <div className="bg-card border rounded-xl p-6">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </div>
        </>
      ) : !progressData ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">No se pudieron cargar los datos</p>
            <Button onClick={() => refetch()} className="mt-4">
              Reintentar
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <StatsCards stats={progressData.stats} />

          {/* Mis Objetivos */}
          <GoalsSection
            goals={progressData.goals}
            weeklyProgress={progressData.weeklyProgress}
            generalProgress={progressData.generalProgress}
          />

          {/* Resumen de asistencia */}
          <AttendanceChart data={progressData.attendanceByMonth} />

          {/* Historial de clases */}
          <ClassHistoryTable classes={progressData.classHistory} />
        </>
      )}
    </div>
  );
}
