import { memo } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  Shield, 
  Mail, 
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useConfigurationStore } from '../store/configuration-store';
import { 
  useSecurityCheck, 
  useActiveSessions, 
  useRecentEmails 
} from '../hooks/use-configuration';
import { ChangePasswordModal } from './modals/change-password-modal';
import { SessionsModal } from './modals/sessions-modal';
import { RecentEmailsModal } from './modals/recent-emails-modal';
import { Skeleton } from '@/shared/components/ui/skeleton';

const PasswordSecuritySection = memo(() => {
  const {
    openChangePasswordModal,
    openSessionsModal,
    openRecentEmailsModal,
    showChangePasswordModal,
    showSessionsModal,
    showRecentEmailsModal,
    closeChangePasswordModal,
    closeSessionsModal,
    closeRecentEmailsModal,
  } = useConfigurationStore();

  const { data: securityCheck, isLoading: securityLoading } = useSecurityCheck();
  const { data: sessions, isLoading: sessionsLoading } = useActiveSessions();
  const { data: recentEmails, isLoading: emailsLoading } = useRecentEmails();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-green-500/10">
              <Lock className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Contraseña y Seguridad
            </h3>
          </div>
          
          <p className="text-muted-foreground">
            Revisa los problemas de seguridad mediante comprobaciones en las apps, los dispositivos y los correos electrónicos enviados.
          </p>
        </div>
      </motion.div>

      {/* Security Check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-blue-500/10">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Controles de Seguridad
            </h4>
          </div>
          
          {securityLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : securityCheck ? (
            <div className="space-y-4">
              {/* Security Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${
                  securityCheck.hasWeakPassword 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-green-500/10 border-green-500/20'
                }`}>
                  <div className="flex items-center gap-2">
                    {securityCheck.hasWeakPassword ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      securityCheck.hasWeakPassword ? 'text-red-400' : 'text-green-400'
                    }`}>
                      Contraseña {securityCheck.hasWeakPassword ? 'Débil' : 'Segura'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  securityCheck.hasUnusualActivity 
                    ? 'bg-orange-500/10 border-orange-500/20' 
                    : 'bg-green-500/10 border-green-500/20'
                }`}>
                  <div className="flex items-center gap-2">
                    {securityCheck.hasUnusualActivity ? (
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      securityCheck.hasUnusualActivity ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      Actividad {securityCheck.hasUnusualActivity ? 'Inusual' : 'Normal'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  securityCheck.hasUnverifiedDevices 
                    ? 'bg-yellow-500/10 border-yellow-500/20' 
                    : 'bg-green-500/10 border-green-500/20'
                }`}>
                  <div className="flex items-center gap-2">
                    {securityCheck.hasUnverifiedDevices ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      securityCheck.hasUnverifiedDevices ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      Dispositivos {securityCheck.hasUnverifiedDevices ? 'Sin Verificar' : 'Verificados'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Password Change */}
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Último cambio de contraseña</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(securityCheck.lastPasswordChange)}
                  </p>
                </div>
              </div>

              {/* Recommended Actions */}
              {securityCheck.recommendedActions.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-400 mb-2">Acciones recomendadas:</p>
                  <ul className="text-xs text-blue-300 space-y-1">
                    {securityCheck.recommendedActions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No se pudo cargar la información de seguridad</p>
          )}
        </div>
      </motion.div>

      {/* Security Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg p-3 bg-purple-500/10">
                <Lock className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="text-foreground text-lg font-semibold">
                Cambiar Contraseña
              </h4>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Actualiza tu contraseña para mantener tu cuenta segura
            </p>
            
            <Button 
              onClick={openChangePasswordModal}
              className="w-full"
              variant="outline"
            >
              <Lock className="h-4 w-4 mr-2" />
              Cambiar Contraseña
            </Button>
          </div>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
          className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg p-3 bg-indigo-500/10">
                <Monitor className="h-6 w-6 text-indigo-500" />
              </div>
              <h4 className="text-foreground text-lg font-semibold">
                Donde Iniciaste Sesión
              </h4>
            </div>
            
            {sessionsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {sessions.length} sesión{sessions.length !== 1 ? 'es' : ''} activa{sessions.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  {sessions.slice(0, 2).map((session) => (
                    <div key={session.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">{session.device}</p>
                        <p className="text-xs text-muted-foreground">{session.location}</p>
                      </div>
                      {session.isCurrentSession && (
                        <Badge variant="outline" className="text-xs">Actual</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay sesiones activas</p>
            )}
            
            <Button 
              onClick={openSessionsModal}
              className="w-full mt-4"
              variant="outline"
            >
              <Monitor className="h-4 w-4 mr-2" />
              Ver Todas las Sesiones
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Recent Emails */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-amber-500/10">
              <Mail className="h-6 w-6 text-amber-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Correos Electrónicos Recientes
            </h4>
          </div>
          
          {emailsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : recentEmails && recentEmails.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Últimos correos relacionados con tu cuenta
              </p>
              <div className="space-y-2">
                {recentEmails.slice(0, 3).map((email) => (
                  <div key={email.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{email.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        De: {email.sender} • {formatDate(email.date)}
                      </p>
                    </div>
                    <Badge variant={email.read ? "secondary" : "default"} className="text-xs">
                      {email.read ? 'Leído' : 'Nuevo'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay correos recientes</p>
          )}
          
          <Button 
            onClick={openRecentEmailsModal}
            className="w-full mt-4"
            variant="outline"
          >
            <Mail className="h-4 w-4 mr-2" />
            Ver Todos los Correos
          </Button>
        </div>
      </motion.div>

      {/* Modals */}
      <ChangePasswordModal 
        open={showChangePasswordModal}
        onClose={closeChangePasswordModal}
      />
      
      <SessionsModal 
        open={showSessionsModal}
        onClose={closeSessionsModal}
      />
      
      <RecentEmailsModal 
        open={showRecentEmailsModal}
        onClose={closeRecentEmailsModal}
      />
    </div>
  );
});

PasswordSecuritySection.displayName = 'PasswordSecuritySection';

export { PasswordSecuritySection };
