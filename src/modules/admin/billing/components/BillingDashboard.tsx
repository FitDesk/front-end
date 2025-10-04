import { Card, CardContent } from '@/shared/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { BillingMetrics } from '../types/billing.types';

interface BillingDashboardProps {
  metrics: BillingMetrics | null;
  loading?: boolean;
}

export function BillingDashboard({ metrics, loading = false }: BillingDashboardProps) {

  if (!metrics || !metrics.monthlyIncome || !metrics.pendingPayments || !metrics.membersUpToDate || !metrics.overduePayments) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const dashboardCards = [
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(metrics.monthlyIncome?.amount || 0),
      change: metrics.monthlyIncome?.change || 0,
      trend: metrics.monthlyIncome?.trend || 'up',
      icon: DollarSign,
      iconColor: 'bg-green-500',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Pagos Pendientes',
      value: formatCurrency(metrics.pendingPayments?.amount || 0),
      change: metrics.pendingPayments?.change || 0,
      trend: metrics.pendingPayments?.trend || 'up',
      icon: Clock,
      iconColor: 'bg-yellow-500',
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'Miembros al Día',
      value: formatNumber(metrics.membersUpToDate?.count || 0),
      change: metrics.membersUpToDate?.change || 0,
      trend: metrics.membersUpToDate?.trend || 'up',
      icon: CheckCircle,
      iconColor: 'bg-green-500',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Pagos Vencidos',
      value: formatNumber(metrics.overduePayments?.count || 0),
      change: metrics.overduePayments?.change || 0,
      trend: metrics.overduePayments?.trend || 'up',
      icon: AlertCircle,
      iconColor: 'bg-red-500',
      iconBg: 'bg-red-100',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {dashboardCards.map((card, index) => {
        const TrendIcon = getTrendIcon(card.trend);
        const trendColor = getTrendColor(card.trend);
        const IconComponent = card.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg p-3 ${card.iconBg.replace('bg-', 'bg-').replace('-100', '-500/10')}`}>
                  <IconComponent className={`h-6 w-6 ${card.iconColor.replace('bg-', 'text-')}`} />
                </div>
                
                <div className="flex items-center gap-1 text-sm font-medium">
                  <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                  <span className={trendColor}>
                    {card.change > 0 ? '+' : ''}{card.change}%
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-foreground mb-1 text-3xl font-bold">
                  {card.value}
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  {card.title}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
