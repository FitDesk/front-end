import { memo } from 'react';
import { motion } from 'motion/react';
import { Users, Dumbbell, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface QuickActionsProps {
  title?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  }>;
}

const defaultActions = [
  {
    icon: Users,
    label: 'Agregar Alumno',
    color: 'blue',
    shortcut: 'Ctrl+N',
    action: 'addStudent',
  },
  {
    icon: BarChart3,
    label: 'Ver Estadísticas',
    color: 'green',
    shortcut: 'Ctrl+A',
    action: 'analytics',
  },
  {
    icon: Dumbbell,
    label: 'Crear Rutina',
    color: 'purple',
    shortcut: 'Ctrl+R',
    action: 'createRoutine',
  },
  {
    icon: Calendar,
    label: 'Programar Clase',
    color: 'orange',
    shortcut: 'Ctrl+C',
    action: 'scheduleClass',
  },
];

export const QuickActions = memo(
  ({ title = "Acciones Rápidas" }: QuickActionsProps) => {
    const handleAction = (action: string) => {
      switch (action) {
        case 'addStudent':
          console.log('Agregando nuevo alumno...');
          break;
        case 'analytics':
          console.log('Viendo estadísticas...');
          break;
        case 'createRoutine':
          console.log('Creando rutina...');
          break;
        case 'scheduleClass':
          console.log('Programando clase...');
          break;
      }
    };

    return (
      <div className="border-border bg-card/40 rounded-xl border p-6">
        <h3 className="mb-4 text-xl font-semibold">{title}</h3>
        <div className="space-y-3">
          {defaultActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className={`h-12 w-full justify-start hover:bg-${action.color}-500/10 hover:border-${action.color}-500/50 transition-all duration-200`}
                  onClick={() => handleAction(action.action)}
                >
                  <Icon className={`mr-3 h-5 w-5 text-${action.color}-500`} />
                  <span className="font-medium">{action.label}</span>
                  <div className="text-muted-foreground ml-auto text-xs">
                    {action.shortcut}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  },
);

QuickActions.displayName = 'QuickActions';
