import React, { useState } from 'react';
import { GraduationCap, BarChart3, RefreshCw, ArrowLeft } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

import { useStudents } from '../hooks/use-students';
import { useStudentMetrics } from '../hooks/use-student-metrics';
import { useStudentsStore } from '../store/students-store';

import { StudentFilters } from '../components/StudentFilters';
import { StudentsTable } from '../components/StudentsTable';
import { StudentMetricsCards } from '../components/StudentMetricsCards';
import { StudentAttendanceHistoryView } from '../components/StudentAttendanceHistoryView';

import type { Student, Class, StudentStatus } from '../types';
import { studentService } from '../services/student.service';

export default function StudentsPage() {

  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);
  const [showHistoryView, setShowHistoryView] = useState(false);
  

  const { 
    filters, 
    selectedTab,
    setFilters, 
    setSelectedTab 
  } = useStudentsStore();


  const {
    students,
    pagination,
    isLoading: isLoadingStudents,
    refreshStudents,
    updateFilters,
    updatePagination,
    updateStatus
  } = useStudents();

  const {
    metrics,
    isLoadingMetrics,
    refreshMetrics
  } = useStudentMetrics();

  const loadClasses = async () => {
    setIsLoadingClasses(true);
    try {
      const response = await studentService.getClasses();
      console.log('Datos recibidos en página:', response.data.map(c => ({ name: c.name, trainer: c.trainer.name })));
      setClasses(response.data);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setIsLoadingClasses(false);
    }
  };


  React.useEffect(() => {
    loadClasses();
  }, []);


  const handleClassSelect = (classItem: Class) => {
    setSelectedClass(classItem);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
  };


  const getDayName = (dayOfWeek: number) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[dayOfWeek];
  };


  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    updateFilters({});
  };

  const handlePageChange = (page: number) => {
    updatePagination({ page });
  };

  const handleStudentDelete = (_student: Student) => {
 
  };

  const handleStudentStatusUpdate = async (studentId: string, status: StudentStatus) => {
    try {
      await updateStatus({ id: studentId, status });
    } catch (error) {
    }
  };

  const handleStudentMessage = (_student: Student) => {
  };

  const handleStudentHistory = (student: Student) => {
    setSelectedStudentForHistory(student);
    setShowHistoryView(true);
  };

  const handleBackFromHistory = () => {
    setShowHistoryView(false);
    setSelectedStudentForHistory(null);
  };

  const handleRefresh = () => {
    if (selectedClass) {
      refreshStudents();
    } else if (selectedTab === 'students') {
      loadClasses();
    } else if (selectedTab === 'metrics') {
      refreshMetrics();
    }
  };

  
  if (showHistoryView && selectedStudentForHistory) {
    return (
      <StudentAttendanceHistoryView
        student={selectedStudentForHistory}
        onBack={handleBackFromHistory}
      />
    );
  }

 
  if (selectedClass) {
    return (
      <div className="p-6 space-y-6">
        {/* Header con botón de regreso */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToClasses}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Clases
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedClass.name}</h1>
              <p className="text-muted-foreground">
                {selectedClass.currentEnrollment} de {selectedClass.maxCapacity} estudiantes inscritos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={selectedClass.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {selectedClass.status === 'ACTIVE' ? 'Activa' : 
               selectedClass.status === 'FULL' ? 'Llena' : 'Inactiva'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoadingStudents}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Información de la clase */}
        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Información de la Clase
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Horarios</h4>
                <div className="mt-1 space-y-1">
                  {selectedClass.schedule.map((schedule, index) => (
                    <div key={index} className="text-sm">
                      {getDayName(schedule.dayOfWeek)} {schedule.startTime} - {schedule.endTime}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Ubicación</h4>
                <div className="mt-1 text-sm">
                  {selectedClass.location}
                  {selectedClass.room && ` - ${selectedClass.room}`}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Trainer</h4>
                <div className="mt-1 text-sm">{selectedClass.trainer.name}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estudiantes de la clase */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80">
            <StudentFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          <div className="flex-1">
            <StudentsTable
              students={students}
              pagination={{...pagination, data: students}}
              isLoading={isLoadingStudents}
              onStudentDelete={handleStudentDelete}
              onStudentStatusUpdate={handleStudentStatusUpdate}
              onStudentMessage={handleStudentMessage}
              onStudentHistory={handleStudentHistory}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestión de Clases</h1>
            <p className="text-muted-foreground">
              Administra clases y estudiantes de tu gimnasio
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoadingClasses || isLoadingMetrics}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingClasses ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid w-full grid-cols-2 bg-transparent border border-border rounded-lg">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Clases
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métricas
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Clases */}
        <TabsContent value="students" className="space-y-6">
          {/* Grid de clases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingClasses ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              classes.map((classItem) => (
                <Card 
                  key={classItem.id} 
                  className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer"
                  onClick={() => handleClassSelect(classItem)}
                >
                  <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <Badge variant={classItem.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {classItem.status === 'ACTIVE' ? 'Activa' : 
                         classItem.status === 'FULL' ? 'Llena' : 'Inactiva'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{classItem.description}</p>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estudiantes:</span>
                        <span className="font-medium">
                          {classItem.currentEnrollment}/{classItem.maxCapacity}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Trainer:</span>
                        <span className="font-medium">{classItem.trainer.name}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Horarios:</span>
                        <div className="mt-1 space-y-1">
                          {classItem.schedule.slice(0, 2).map((schedule, index) => (
                            <div key={index} className="text-xs">
                              {getDayName(schedule.dayOfWeek)} {schedule.startTime} - {schedule.endTime}
                            </div>
                          ))}
                          {classItem.schedule.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{classItem.schedule.length - 2} más
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Asistencia promedio:</span>
                        <span className="font-medium text-green-600">
                          {classItem.stats.averageAttendance.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Pestaña de Métricas */}
        <TabsContent value="metrics" className="space-y-6">
          <StudentMetricsCards 
            metrics={metrics || null} 
            isLoading={isLoadingMetrics} 
          />
        </TabsContent>

      </Tabs>

    </div>
  );
}
