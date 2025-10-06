import { useState } from 'react';
import { ArrowLeft, Filter, MoreHorizontal, Edit, X, Check, User, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useStudentMetrics } from '../hooks/use-student-metrics';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { studentService } from '../services/student.service';

import type { Student } from '../types';

interface StudentAttendanceHistoryViewProps {
  student: Student;
  onBack: () => void;
}
export function StudentAttendanceHistoryView({
  student,
  onBack
}: StudentAttendanceHistoryViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  const { data: attendanceData } = useQuery({
    queryKey: ['student-attendance', student.id],
    queryFn: () => studentService.getAttendanceHistory()
  });

  const { markAttendance } = useStudentMetrics();

  const attendanceRecords = attendanceData?.data || [];

  const handleUpdateAttendance = async (recordId: string, newStatus: 'present' | 'absent' | 'late' | 'excused') => {
    try {
      await markAttendance({
        studentId: student.id,
        classId: recordId, 
        status: newStatus,
        notes: `Asistencia actualizada desde historial`
      });
      setEditingRecordId(null);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleEditRecord = (recordId: string) => {
    setEditingRecordId(recordId);
  };

  const handleCancelEdit = () => {
    setEditingRecordId(null);
  };

  const handleSaveChanges = () => {
    setEditingRecordId(null);
  };


  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const filteredHistory = statusFilter === 'all' 
    ? attendanceRecords 
    : attendanceRecords.filter(record => record.status === statusFilter);

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    excused: attendanceRecords.filter(r => r.status === 'excused').length
  };

  const attendanceRate = stats.total > 0 ? ((stats.present + stats.late + stats.excused) / stats.total * 100).toFixed(1) : '0.0';

  return (
    <div className="p-6 space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Estudiantes
          </Button>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(student.firstName, student.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Historial de Asistencia</h1>
              <p className="text-muted-foreground">
                {student.firstName} {student.lastName}
              </p>
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="sm">
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Clases</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <User className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">0 de {stats.total} clases</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Presente</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Check className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground">{stats.present} de {stats.total} clases</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Ausente</CardTitle>
            <div className="p-2 bg-red-500/20 rounded-lg">
              <X className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">{stats.absent} de {stats.total} clases</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Tarde</CardTitle>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground">{stats.late} de {stats.total} clases</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Asistencia</CardTitle>
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <User className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-cyan-600">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Promedio general</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrar por estado:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="present">Presente</SelectItem>
            <SelectItem value="absent">Ausente</SelectItem>
            <SelectItem value="late">Tarde</SelectItem>
            <SelectItem value="excused">Justificado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de historial */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Clase</TableHead>
              <TableHead className="text-center">A</TableHead>
              <TableHead className="text-center">T</TableHead>
              <TableHead className="text-center">F</TableHead>
              <TableHead className="text-center">J</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="w-[50px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No se encontraron registros de asistencia
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(record.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{record.className}</div>
                  </TableCell>
                  {/* Columna A (Asistió) */}
                  <TableCell className="text-center">
                    <div
                      className={`w-6 h-6 rounded-full mx-auto transition-all duration-200 ${
                        record.status === 'present' 
                          ? 'bg-green-600' 
                          : 'bg-transparent border-2 border-gray-300'
                      } ${
                        editingRecordId === record.id 
                          ? 'cursor-pointer hover:border-green-400 hover:bg-green-50' 
                          : ''
                      }`}
                      onClick={() => editingRecordId === record.id && handleUpdateAttendance(record.id, 'present')}
                    >
                    </div>
                  </TableCell>
                  {/* Columna T (Tardanza) */}
                  <TableCell className="text-center">
                    <div
                      className={`w-6 h-6 rounded-full mx-auto transition-all duration-200 ${
                        record.status === 'late' 
                          ? 'bg-orange-600' 
                          : 'bg-transparent border-2 border-gray-300'
                      } ${
                        editingRecordId === record.id 
                          ? 'cursor-pointer hover:border-orange-400 hover:bg-orange-50' 
                          : ''
                      }`}
                      onClick={() => editingRecordId === record.id && handleUpdateAttendance(record.id, 'late')}
                    >
                    </div>
                  </TableCell>
                  {/* Columna F (Faltó) */}
                  <TableCell className="text-center">
                    <div
                      className={`w-6 h-6 rounded-full mx-auto transition-all duration-200 ${
                        record.status === 'absent' 
                          ? 'bg-red-600' 
                          : 'bg-transparent border-2 border-gray-300'
                      } ${
                        editingRecordId === record.id 
                          ? 'cursor-pointer hover:border-red-400 hover:bg-red-50' 
                          : ''
                      }`}
                      onClick={() => editingRecordId === record.id && handleUpdateAttendance(record.id, 'absent')}
                    >
                    </div>
                  </TableCell>
                  {/* Columna J (Justificado) */}
                  <TableCell className="text-center">
                    <div
                      className={`w-6 h-6 rounded-full mx-auto transition-all duration-200 ${
                        record.status === 'excused' 
                          ? 'bg-blue-600' 
                          : 'bg-transparent border-2 border-gray-300'
                      } ${
                        editingRecordId === record.id 
                          ? 'cursor-pointer hover:border-blue-400 hover:bg-blue-50' 
                          : ''
                      }`}
                      onClick={() => editingRecordId === record.id && handleUpdateAttendance(record.id, 'excused')}
                    >
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{record.trainer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {record.notes || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {editingRecordId === record.id ? (
                          <DropdownMenuItem 
                            onClick={handleCancelEdit}
                            className="text-gray-600"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleEditRecord(record.id)}
                            className="text-blue-600"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Botón Guardar cuando está en modo de edición */}
      {editingRecordId && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            className="text-gray-600"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSaveChanges}
          >
            <Check className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
  );
}
