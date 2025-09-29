import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { roleService } from '../services/role.service';
import type { UserWithRole } from '../types';

interface ResetPasswordModalProps {
  user: UserWithRole;
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({ user, isOpen, onClose }: ResetPasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      
      const response = await roleService.sendPasswordResetCode(user.id);
      toast.success(response.message || 'Código de verificación enviado al correo');
      setIsCodeSent(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error('Error al enviar el código de verificación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      
      const response = await roleService.resetPassword({
        userId: user.id,
        currentPassword,
        newPassword,
        verificationCode
      });
      
      toast.success(response.message || 'Contraseña restablecida correctamente');
      handleClose();
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    
    setCurrentPassword('');
    setNewPassword('');
    setVerificationCode('');
    setIsCodeSent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restablecer contraseña</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Se enviará un código de verificación al correo {user.email}
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          {isCodeSent && (
            <div>
              <Label htmlFor="verificationCode">Código de verificación</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Ingrese el código de 6 dígitos"
                className="mt-1"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            {!isCodeSent ? (
              <Button onClick={handleSendCode} disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar código'}
              </Button>
            ) : (
              <Button 
                onClick={handleResetPassword} 
                disabled={isLoading || !verificationCode || !newPassword}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
