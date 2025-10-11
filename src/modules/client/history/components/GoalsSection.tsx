import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import { useUpdateGoals } from '../hooks/use-progress';
import type { Goals, WeeklyProgress, GeneralProgress } from '../types';

interface GoalsSectionProps {
  goals: Goals;
  weeklyProgress: WeeklyProgress;
  generalProgress: GeneralProgress;
}

export function GoalsSection({ goals, weeklyProgress, generalProgress }: GoalsSectionProps) {
  const [classesPerWeek, setClassesPerWeek] = useState(goals.classesPerWeek);
  const [sessionDuration, setSessionDuration] = useState(goals.sessionDuration);
  
  const updateGoalsMutation = useUpdateGoals();

  const handleSaveGoals = () => {
    updateGoalsMutation.mutate({
      classesPerWeek,
      sessionDuration,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold text-foreground mb-6">Mis Objetivos</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Define tus metas */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Define tus metas</h3>
              <p className="text-sm text-muted-foreground">Establece tus objetivos semanales para mantenerte motivado.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="classes-per-week" className="text-sm text-muted-foreground">
                  Clases por semana
                </Label>
                <Input
                  id="classes-per-week"
                  type="number"
                  min="1"
                  max="7"
                  value={classesPerWeek}
                  onChange={(e) => setClassesPerWeek(Number(e.target.value))}
                  className="mt-1.5 bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="session-duration" className="text-sm text-muted-foreground">
                  Duración de la sesión (minutos)
                </Label>
                <Input
                  id="session-duration"
                  type="number"
                  min="15"
                  max="180"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  className="mt-1.5 bg-background/50"
                />
              </div>

              <Button 
                className="w-full"
                onClick={handleSaveGoals}
                disabled={updateGoalsMutation.isPending}
              >
                {updateGoalsMutation.isPending ? 'Guardando...' : 'Guardar objetivos'}
              </Button>
            </div>
          </div>

          {/* Progreso */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">Progreso semanal</h3>
                <span className="text-sm font-semibold text-foreground">
                  {weeklyProgress.current} / {weeklyProgress.target}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Clases esta semana</p>
              <Progress 
                value={weeklyProgress.percentage} 
                className="h-3" 
                indicatorClassName="bg-orange-500" 
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">Progreso general</h3>
                <span className="text-sm font-semibold text-foreground">
                  {generalProgress.currentMinutes} / {generalProgress.targetMinutes} min
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Tiempo total de entrenamiento</p>
              <Progress 
                value={generalProgress.percentage} 
                className="h-3" 
                indicatorClassName="bg-red-500" 
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
