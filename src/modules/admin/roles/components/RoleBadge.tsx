
import type { UserRole } from '../types';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleStyles = {
  ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  TRAINER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  MEMBER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const roleLabels = {
  ADMIN: 'Administrador',
  TRAINER: 'Entrenador',
  MEMBER: 'Miembro'
};

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyles[role]} ${className}`}>
      {roleLabels[role]}
    </span>
  );
}