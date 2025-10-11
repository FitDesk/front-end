import { motion } from 'motion/react';
import { Calendar, Flame, TrendingUp } from 'lucide-react';
import type { ProgressStats } from '../types';

interface StatsCardsProps {
  stats: ProgressStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      icon: Calendar,
      label: 'Clases completadas',
      value: stats.completedClasses,
      delay: 0.1,
    },
    {
      icon: Flame,
      label: 'Racha actual',
      value: `${stats.currentStreak} días`,
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      label: 'Total de calorías quemadas',
      value: `${stats.totalCaloriesBurned} kcal`,
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay }}
            className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative flex items-start gap-4">
              <div className="rounded-lg p-3 bg-orange-500/10">
                <Icon className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{card.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
