import { motion } from 'motion/react';
import type { ClassHistory } from '../types';

interface ClassHistoryTableProps {
  classes: ClassHistory[];
}

export function ClassHistoryTable({ classes }: ClassHistoryTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold text-foreground mb-6">Historial de clases</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Clase</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((clase) => (
                <tr 
                  key={clase.id} 
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-foreground">{clase.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{clase.date}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-orange-500">
                      {clase.status === 'completed' && 'Completada'}
                      {clase.status === 'cancelled' && 'Cancelada'}
                      {clase.status === 'pending' && 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
