import { Card, CardContent } from '@/shared/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export interface BillingMetrics {
  monthlyIncome: {
    amount: number;
    change: number;
    trend: 'up' | 'down';
  };
  pendingPayments: {
    amount: number;
    change: number;
    trend: 'up' | 'down';
  };
  membersUpToDate: {
    count: number;
    change: number;
    trend: 'up' | 'down';
  };
  overduePayments: {
    count: number;
    change: number;
    trend: 'up' | 'down';
  };
}

interface BillingDashboardProps {
  metrics: BillingMetrics;
  loading?: boolean;
}

export function BillingDashboard({ metrics, loading = false }: BillingDashboardProps) {
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
      value: formatCurrency(metrics.monthlyIncome.amount),
      change: metrics.monthlyIncome.change,
      trend: metrics.monthlyIncome.trend,
      icon: DollarSign,
      iconColor: 'bg-green-500',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Pagos Pendientes',
      value: formatCurrency(metrics.pendingPayments.amount),
      change: metrics.pendingPayments.change,
      trend: metrics.pendingPayments.trend,
      icon: Clock,
      iconColor: 'bg-yellow-500',
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'Miembros al Día',
      value: formatNumber(metrics.membersUpToDate.count),
      change: metrics.membersUpToDate.change,
      trend: metrics.membersUpToDate.trend,
      icon: CheckCircle,
      iconColor: 'bg-green-500',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Pagos Vencidos',
      value: formatNumber(metrics.overduePayments.count),
      change: metrics.overduePayments.change,
      trend: metrics.overduePayments.trend,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardCards.map((card, index) => {
        const TrendIcon = getTrendIcon(card.trend);
        const trendColor = getTrendColor(card.trend);
        const IconComponent = card.icon;

        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                    <span className={`text-xs font-medium ${trendColor}`}>
                      {card.change > 0 ? '+' : ''}{card.change}% vs mes anterior
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.iconBg}`}>
                  <IconComponent className={`h-6 w-6 ${card.iconColor.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
