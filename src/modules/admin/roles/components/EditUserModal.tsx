import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { UserWithRole, UserRole } from '../types';

interface EditUserModalProps {
  user: UserWithRole;
  isOpen: boolean;
  onClose: () => void;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export function EditUserModal({ user, isOpen, onClose, onRoleChange }: EditUserModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setSelectedRole(user.role);
  }, [user.role]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onRoleChange(user.id, selectedRole);
      toast.success('Rol actualizado correctamente');
      onClose();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error al actualizar el rol');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario: {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Rol del usuario</Label>
            <RadioGroup 
              value={selectedRole} 
              onValueChange={(value: UserRole) => setSelectedRole(value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ADMIN" id="role-admin" />
                <Label htmlFor="role-admin">Administrador</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TRAINER" id="role-trainer" />
                <Label htmlFor="role-trainer">Entrenador</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MEMBER" id="role-member" />
                <Label htmlFor="role-member">Miembro</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
