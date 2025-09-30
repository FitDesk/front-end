import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Activity,
  BookOpen
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/core/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

import type { StudentMetrics } from '../types';

interface StudentMetricsCardsProps {
  metrics: StudentMetrics | null;
  isLoading?: boolean;
}

const getCurrentMonthWeeks = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const weeks = [];
  let currentDate = new Date(firstDay);
  let weekNumber = 1;
  
  while (currentDate <= lastDay) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    if (weekEnd > lastDay) {
      weekEnd.setDate(lastDay.getDate());
    }
    
    weeks.push({
      name: `Sem ${weekNumber}`,
      startDate: weekStart,
      endDate: weekEnd
    });
    
    currentDate.setDate(weekEnd.getDate() + 1);
    weekNumber++;
  }
  
  return weeks;
};

const getWeeklyTrendsData = (weeklyTrends?: Array<{name: string; positive: number; negative: number}>) => {
  const currentWeeks = getCurrentMonthWeeks();
  const today = new Date();
  
  return currentWeeks.map(week => {
    const isFutureWeek = week.startDate > today;
    const weekData = weeklyTrends?.find(w => w.name === week.name) || { 
      positive: 0, 
      negative: 0 
    };
    
    if (isFutureWeek) {
      return {
        name: week.name,
        positive: 0,
        negative: 0,
        opacity: 0.3
      };
    }
    
    const isCurrentWeek = today >= week.startDate && today <= week.endDate;
    if (isCurrentWeek) {
      const daysInWeek = 7;
      const daysPassed = Math.floor((today.getTime() - week.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const progressRatio = daysPassed / daysInWeek;
      
      return {
        ...weekData,
        name: 'Esta semana',
        positive: Math.round(weekData.positive * progressRatio),
        negative: Math.round(weekData.negative * progressRatio)
      };
    }
    
    return {
      ...weekData,
      name: week.name
    };
  });
};

export function StudentMetricsCards({ metrics, isLoading }: StudentMetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">No hay datos disponibles</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  // Determinar tendencias basadas en métricas reales
  const attendanceTrend = (metrics.averageAttendanceRate || 0) >= 80 ? 'up' : 'down';
  const classesTrend = (metrics.totalClassesThisMonth || 0) > 0 ? 'up' : 'neutral';

  return (
    <div className="space-y-6">
      {/* Métricas principales - Diseño minimalista */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Estudiantes */}
        <Card className="border-border bg-card/40 rounded-xl border text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                {metrics.newStudentsThisMonth > 0 && (
                  <span className="text-xs text-green-400 font-medium">
                    +{metrics.newStudentsThisMonth} este mes
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {(metrics.totalStudents || 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-400">Total Estudiantes</p>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (metrics.totalStudents || 0) / 100 * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Promedio Asistencia */}
        <Card className="border-border bg-card/40 rounded-xl border text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex items-center space-x-1">
                {attendanceTrend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  attendanceTrend === 'up' ? "text-green-400" : "text-red-400"
                )}>
                  {attendanceTrend === 'up' ? '+' : '-'}
                  {Math.abs((metrics.averageAttendanceRate || 0) - 75).toFixed(1)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {(metrics.averageAttendanceRate || 0).toFixed(1)}%
              </p>
              <p className="text-sm text-slate-400">Promedio Asistencia</p>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.averageAttendanceRate || 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clases Este Mes */}
        <Card className="border-border bg-card/40 rounded-xl border text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative cursor-pointer">
          <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className={cn(
                  "h-4 w-4",
                  classesTrend === 'up' ? "text-green-400" : "text-slate-400"
                )} />
                {metrics.totalClassesThisMonth > 0 && (
                  <span className={cn(
                    "text-xs font-medium",
                    classesTrend === 'up' ? "text-green-400" : "text-slate-400"
                  )}>
                    {metrics.totalClassesThisMonth} clases
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {(metrics.totalClassesThisMonth || 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-400">Clases Este Mes</p>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (metrics.totalClassesThisMonth || 0) / 30 * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Gráfico de Tendencias - AreaChartFillByValue */}
      <Card className="border-border bg-card/40 rounded-xl border transition-all duration-300 hover:shadow-lg group relative cursor-pointer">
        <div className="to-primary/5 absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="pb-4 relative">
          <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
            <div className="flex items-center">
              <TrendingUp className="mr-3 h-5 w-5 text-gray-500 dark:text-slate-400" />
              Tendencia de Estudiantes
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-slate-400">Activos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-slate-400">Inactivos</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getWeeklyTrendsData(metrics?.weeklyTrends)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  domain={[0, 'dataMax + 10']}
                  tickCount={6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F8FAFC'
                  }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === 'positive' ? 'Estudiantes Activos' : 'Estudiantes Inactivos'
                  ]}
                />
                <ReferenceLine y={0} stroke="#64748B" strokeWidth={1} />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#positiveGradient)"
                  connectNulls={true}
                  baseValue={0}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#negativeGradient)"
                  connectNulls={true}
                  baseValue={0}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Estadísticas actuales */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {(metrics.activeStudents || 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Estudiantes Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {(metrics.inactiveStudents || 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Estudiantes Inactivos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
