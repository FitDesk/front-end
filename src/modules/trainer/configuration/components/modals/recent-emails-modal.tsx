import { memo } from 'react';
import { motion } from 'motion/react';
import { Mail, Shield, AlertTriangle, Bell } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useRecentEmails } from '../../hooks/use-configuration';

interface RecentEmailsModalProps {
  open: boolean;
  onClose: () => void;
}

const RecentEmailsModal = memo(({ open, onClose }: RecentEmailsModalProps) => {
  const { data: emails, isLoading } = useRecentEmails();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmailIcon = (type: string) => {
    switch (type) {
      case 'PASSWORD_RESET':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'ACCOUNT_CHANGE':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'SECURITY_ALERT':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'NOTIFICATION':
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEmailTypeLabel = (type: string) => {
    switch (type) {
      case 'PASSWORD_RESET':
        return 'Restablecimiento de Contraseña';
      case 'ACCOUNT_CHANGE':
        return 'Cambio de Cuenta';
      case 'SECURITY_ALERT':
        return 'Alerta de Seguridad';
      case 'NOTIFICATION':
        return 'Notificación';
      default:
        return 'Email';
    }
  };

  const getEmailTypeBadge = (type: string) => {
    switch (type) {
      case 'PASSWORD_RESET':
        return <Badge variant="destructive" className="text-xs bg-red-500/20 text-red-400 border-red-500/20">Seguridad</Badge>;
      case 'ACCOUNT_CHANGE':
        return <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/20">Cambio</Badge>;
      case 'SECURITY_ALERT':
        return <Badge variant="destructive" className="text-xs bg-red-500/20 text-red-400 border-red-500/20">Alerta</Badge>;
      case 'NOTIFICATION':
        return <Badge variant="default" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/20">Info</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">General</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg p-2 bg-amber-500/10">
                  <Mail className="h-6 w-6 text-amber-500" />
                </div>
                Correos Electrónicos Recientes
              </DialogTitle>
            </DialogHeader>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400">Historial de correos</p>
                  <p className="text-xs text-blue-300 mt-1">
                    Revisa los correos relacionados con tu cuenta y seguridad enviados recientemente
                  </p>
                </div>
              </div>
            </div>

            {/* Emails List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : emails && emails.length > 0 ? (
                <div className="space-y-4">
                  {emails.map((email) => (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-lg p-4 transition-colors ${
                        email.read ? 'hover:bg-muted/20' : 'bg-blue-500/5 border-blue-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Email Icon */}
                        <div className="rounded-lg p-2 bg-muted/20">
                          {getEmailIcon(email.type)}
                        </div>
                        
                        {/* Email Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-medium ${email.read ? 'text-foreground' : 'text-foreground font-semibold'}`}>
                              {email.subject}
                            </h4>
                            <div className="flex items-center gap-2">
                              {getEmailTypeBadge(email.type)}
                              {!email.read && (
                                <Badge variant="default" className="text-xs bg-green-500/20 text-green-400 border-green-500/20">
                                  Nuevo
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">De:</span> {email.sender}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Tipo:</span> {getEmailTypeLabel(email.type)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(email.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay correos recientes</p>
                </div>
              )}
            </div>

            {/* Security Notice */}
            {emails && emails.some(email => email.type === 'SECURITY_ALERT' || email.type === 'PASSWORD_RESET') && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Correos de seguridad detectados</p>
                    <p className="text-xs text-red-300 mt-1">
                      Si no solicitaste estos cambios, revisa tu cuenta inmediatamente y contacta al soporte
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end">
              <Button onClick={onClose} variant="outline">
                Cerrar
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
});

RecentEmailsModal.displayName = 'RecentEmailsModal';

export { RecentEmailsModal };
