import { memo } from 'react';
import { motion } from 'motion/react';
import { Monitor, MapPin, Smartphone, LogOut, AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useActiveSessions, useTerminateSession } from '../../hooks/use-configuration';

interface SessionsModalProps {
  open: boolean;
  onClose: () => void;
}

const SessionsModal = memo(({ open, onClose }: SessionsModalProps) => {
  const { data: sessions, isLoading } = useActiveSessions();
  const terminateSessionMutation = useTerminateSession();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('android') || device.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSessionMutation.mutateAsync(sessionId);
    } catch (error) {
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
                <div className="rounded-lg p-2 bg-indigo-500/10">
                  <Monitor className="h-6 w-6 text-indigo-500" />
                </div>
                Sesiones Activas
              </DialogTitle>
            </DialogHeader>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Monitor className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400">Gestiona tus sesiones</p>
                  <p className="text-xs text-blue-300 mt-1">
                    Revisa dónde has iniciado sesión y cierra las sesiones que no reconozcas
                  </p>
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sessions && sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Device Icon */}
                        <div className="rounded-lg p-3 bg-muted/20">
                          {getDeviceIcon(session.device)}
                        </div>
                        
                        {/* Session Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{session.device}</h4>
                            {session.isCurrentSession && (
                              <Badge variant="default" className="text-xs bg-green-500/20 text-green-400 border-green-500/20">
                                Sesión Actual
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Monitor className="h-4 w-4" />
                              <span>{session.browser}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              IP: {session.ipAddress}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Iniciada: {formatDate(session.loginDate)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {!session.isCurrentSession && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTerminateSession(session.id)}
                              disabled={terminateSessionMutation.isPending}
                              className="text-red-400 border-red-500/20 hover:bg-red-500/10"
                            >
                              {terminateSessionMutation.isPending ? (
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                              ) : (
                                <>
                                  <LogOut className="h-3 w-3 mr-1" />
                                  Cerrar
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay sesiones activas</p>
                </div>
              )}
            </div>

            {/* Security Warning */}
            {sessions && sessions.length > 1 && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-400">Múltiples sesiones detectadas</p>
                    <p className="text-xs text-orange-300 mt-1">
                      Si no reconoces alguna sesión, ciérrala inmediatamente y considera cambiar tu contraseña
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

SessionsModal.displayName = 'SessionsModal';

export { SessionsModal };
