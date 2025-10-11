import { motion } from 'motion/react';
import type { AttendanceMonth } from '../types';

interface AttendanceChartProps {
  data: AttendanceMonth[];
}

const barColors = [
  'bg-blue-500 hover:bg-blue-600',
  'bg-red-500 hover:bg-red-600',
  'bg-green-500 hover:bg-green-600',
  'bg-yellow-500 hover:bg-yellow-600',
  'bg-purple-500 hover:bg-purple-600',
  'bg-cyan-500 hover:bg-cyan-600',
  'bg-pink-500 hover:bg-pink-600',
  'bg-indigo-500 hover:bg-indigo-600',
  'bg-teal-500 hover:bg-teal-600',
  'bg-orange-500 hover:bg-orange-600',
  'bg-lime-500 hover:bg-lime-600',
  'bg-rose-500 hover:bg-rose-600',
];

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold text-foreground mb-6">Resumen de asistencia</h2>
        
        <div>
          <p className="text-sm text-muted-foreground mb-6">Asistencia a clases por mes</p>
          
          {/* Chart de barras */}
          <div className="flex items-end justify-between gap-3 bg-background/30 rounded-lg p-6" style={{ height: '320px' }}>
            {data.map((item, index) => (
              <div key={item.month} className="flex-1 flex flex-col items-center justify-end gap-3 h-full">
                <div className="w-full relative group/bar flex items-end justify-center" style={{ height: '100%' }}>
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer shadow-lg ${barColors[index % barColors.length]}`}
                    style={{ height: `${item.value}%` }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg z-10">
                    {item.value}%
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
