import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import useRoleStore from '../store/useRoleStore';

interface StatusToggleProps {
  user: {
    id: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  };
}

export function StatusToggle({ user }: StatusToggleProps) {
  const [isActive, setIsActive] = useState(user.status === 'ACTIVE');
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateUserRole } = useRoleStore();

  useEffect(() => {
    setIsActive(user.status === 'ACTIVE');
  }, [user.status]);

  const toggleStatus = async () => {
    try {
      setIsUpdating(true);
      const newStatus = isActive ? 'INACTIVE' : 'ACTIVE';
      await updateUserRole({ 
        userId: user.id, 
        status: newStatus 
      });
      setIsActive(!isActive);
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUpdating) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  return (
    <div 
      className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${
        isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      onClick={toggleStatus}
      aria-label={isActive ? 'Desactivar usuario' : 'Activar usuario'}
    >
      <div 
        className={`h-4 w-4 rounded-full bg-white dark:bg-gray-200 transform transition-transform ${
          isActive ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );
}