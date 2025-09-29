import { MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserWithRole, UserRole } from '../types';
import { RoleBadge } from './RoleBadge';
import { StatusToggle } from './StatusToggle';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { EditUserModal } from './EditUserModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { roleService } from '../services/role.service';
import { toast } from 'sonner';

interface UserRowProps {
  user: UserWithRole;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export function UserRow({ 
  user, 
  onRoleChange
}: UserRowProps) {
  const formatDate = (dateString?: string, showTime = false) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    
    if (showTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('es-PE', options);
  };
  
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha de ingreso';
    return `Se unió el ${formatDate(dateString)}`;
  };
  

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
     
      if (isMenuOpen && !target.closest('[data-menu="actions"]')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSendReminder = async () => {
    try {
      const response = await roleService.sendRoleChangeReminder(user.id);
      setIsMenuOpen(false);
      toast.success(response.message || 'Recordatorio enviado correctamente');
    } catch (error) {
      console.error('Error al enviar recordatorio:', error);
      toast.error('Error al enviar el recordatorio');
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="w-12">
          <input 
            type="checkbox"
            disabled
            className="h-4 w-4 rounded border-gray-300"
          />
        </TableCell>
        
        <TableCell className="min-w-[180px]">
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatJoinDate(user.joinDate)}
              </div>
            </div>
          </div>
        </TableCell>
        
        <TableCell className="min-w-[200px]">
          <div className="text-sm">{user.email}</div>
        </TableCell>
        
        <TableCell className="min-w-[150px]">
          <RoleBadge role={user.role} />
        </TableCell>
        
        <TableCell className="min-w-[150px] text-sm">
          {formatDate(user.lastLogin, true)}
        </TableCell>
        
        <TableCell className="min-w-[100px]">
          <div className="flex justify-center">
            <StatusToggle user={user} />
          </div>
        </TableCell>
        
        <TableCell className="min-w-[120px]">
          <div className="flex justify-center">
            <div className="relative inline-block text-left" data-menu="actions">
              <button 
                type="button"
                className="inline-flex justify-center w-8 h-8 rounded-full hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </button>
              
              {/* Menú desplegable */}
              {isMenuOpen && (
                <div className="absolute right-0 z-50 mt-1 w-56 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-border focus:outline-none">
                  <div className="py-1">
                    {/* Opción Editar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <span>Editar rol</span>
                    </button>
                    
                    {/* Opción Enviar recordatorio */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendReminder();
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <span>Enviar recordatorio</span>
                    </button>
                    
                    {/* Opción Restablecer contraseña */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsResetPasswordModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-muted"
                    >
                      <span>Restablecer contraseña</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Modales */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onRoleChange={onRoleChange}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        user={user}
      />
    </>
  );
}