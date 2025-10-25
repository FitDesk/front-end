import { MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserRole } from '../types';

import { StatusToggle } from './StatusToggle';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import type { Member } from '@/core/interfaces/member.interface';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
;

interface UserRowProps {
  user: Member;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export function UserRow({ user }: UserRowProps) {
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



  const [isMenuOpen, setIsMenuOpen] = useState(false);


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



  return (

    <TableRow>


      <TableCell className="min-w-[180px] px-10">
        <Avatar>
          <AvatarImage src={user.profileImageUrl || user.initials} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="min-w-[180px]">
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium">{user.lastName}</div>
            <div className="text-xs text-muted-foreground">
              {/* {formatJoinDate(user.joinDate)} */}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="min-w-[200px]">
        <div className="text-sm">{user.email}</div>
      </TableCell>



      <TableCell className="min-w-[150px] text-sm">
        ultimo login
        {/* {formatDate(user.lastLogin, true)} */}
      </TableCell>

      <TableCell className="min-w-[100px]">
        <div className="flex justify-center">
          <StatusToggle status={user.userId} />
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
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <span>Editar rol</span>
                  </Button>

                </div>
              </div>
            )}
          </div>
        </div>
      </TableCell>
    </TableRow>



  );
}