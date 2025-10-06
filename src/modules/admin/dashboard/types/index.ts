import type { LucideIcon } from 'lucide-react';

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface QuickActionsProps {
  onAddUser: () => void;
  onExport: () => void;
}

export interface UsersTableProps {
  onAddUser: () => void;
}
