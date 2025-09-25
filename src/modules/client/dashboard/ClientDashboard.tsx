
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Dumbbell, Calendar, Clock, Bell, User, CreditCard, BarChart2 } from 'lucide-react';
import React from 'react';
import { ChartContainer, ChartTooltip } from '@/shared/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

// Dashboard stats data
const stats = [
  {
    id: 1,
    title: 'Clases Restantes',
    value: '8/12',
    description: 'Este mes',
    icon: Dumbbell,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    id: 2,
    title: 'Próxima Clase',
    value: 'Hoy',
    description: '06:00 PM - Spinning',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 3,
    title: 'Días Consecutivos',
    value: '12',
    description: 'Récord: 24 días',
    icon: Calendar,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 4,
    title: 'Notificaciones',
    value: '3',
    description: 'Sin leer',
    icon: Bell,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
];

// Chart data
const chartData = [
  { name: 'Lun', value: 65 },
  { name: 'Mar', value: 59 },
  { name: 'Mié', value: 80 },
  { name: 'Jue', value: 81 },
  { name: 'Vie', value: 56 },
  { name: 'Sáb', value: 55 },
  { name: 'Dom', value: 40 },
];

// Chart config
const chartConfig = {
  value: {
    label: 'Actividad',
    theme: {
      light: 'hsl(var(--primary))',
      dark: 'hsl(var(--primary))',
    },
  },
};

const ClientDashboard: React.FC = () => {
  // Handlers
  const handleBookClass = () => {
    console.log('Reservar clase...');
  };

  const handleViewInvoices = () => {
    console.log('Ver facturas...');
  };

  const handleViewStats = () => {
    console.log('Ver estadísticas...');
  };
  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="px-2 sm:px-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Hola, Juan Pérez
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Aquí está tu resumen de actividad y próximas clases.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6 xl:col-span-2">
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Mi Progreso</h3>
                  <p className="text-sm text-muted-foreground">Actividad de la semana</p>
                </div>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          width={30}
                        />
                        <ChartTooltip 
                          content={({ active, payload }) => 
                            active && payload && payload.length ? (
                              <div 
                                className="rounded-lg border bg-background p-3 shadow-sm"
                                style={{
                                  backgroundColor: 'hsl(var(--background))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '0.5rem',
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                                }}
                              >
                                <p className="font-medium">{payload[0].payload.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {payload[0].value} minutos
                                </p>
                              </div>
                            ) : null
                          }
                        />
                        <Bar 
                          dataKey="value" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                          barSize={24}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </Card>
              
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Próximas Clases</h2>
                  <button 
                    onClick={handleBookClass}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Ver todas
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Clase de Spinning</p>
                        <p className="text-sm text-muted-foreground">
                          Hoy, 06:00 PM • Entrenador: Ana M.
                        </p>
                      </div>
                      <button 
                        className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
                        onClick={() => console.log('Cancelar clase')}
                      >
                        Cancelar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Acciones Rápidas</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleBookClass}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Reservar Clase
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewInvoices}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Ver Facturas
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewStats}
                  >
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Ver Estadísticas
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Actividad Reciente</h3>
                  <Button variant="ghost" size="sm">Ver todo</Button>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Clase de Spinning</h4>
                        <span className="text-sm text-muted-foreground">Hoy</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Completada con éxito
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Entrenamiento Funcional</h4>
                        <span className="text-sm text-muted-foreground">Mañana</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Próxima clase a las 18:00
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Mi Membresía</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-medium">Plan Premium</h4>
                    <p className="text-sm text-muted-foreground">
                      8 clases restantes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vence el 30/12/2023
                    </p>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Renovar Membresía
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientDashboard;