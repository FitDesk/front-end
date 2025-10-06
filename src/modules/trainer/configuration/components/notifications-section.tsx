import { memo } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { 
  useNotificationSettings, 
  useUpdateNotificationSettings 
} from '../hooks/use-configuration';

const NotificationsSection = memo(() => {
  const { data: settings, isLoading } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  const handleSettingChange = async (category: string, key: string, value: boolean) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [key]: value,
      },
    };

    try {
      await updateSettingsMutation.mutateAsync(updatedSettings);
    } catch (error) {
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-card/40 border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!settings) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 border rounded-xl p-6 text-center"
      >
        <p className="text-destructive">Error al cargar la configuración de notificaciones</p>
      </motion.div>
    );
  }

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
            <div className="rounded-lg p-3 bg-orange-500/10">
              <Bell className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Configuración de Notificaciones
            </h3>
          </div>
          
          <p className="text-muted-foreground">
            Configura qué notificaciones recibes para recordarte las novedades que quizá te perdiste.
          </p>
        </div>
      </motion.div>

      {/* Email Notifications */}
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
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Notificaciones por Email
            </h4>
          </div>
          
          <div className="space-y-6">
            {/* New Classes */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Nuevas clases asignadas
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recibe un email cuando se te asigne una nueva clase
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.newClasses}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', 'newClasses', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            {/* Class Cancellations */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Cancelaciones de clases
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notificación cuando una clase sea cancelada
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.classCancellations}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', 'classCancellations', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            {/* Student Messages */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Mensajes de estudiantes
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recibe emails cuando los estudiantes te envíen mensajes
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.studentMessages}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', 'studentMessages', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            {/* System Updates */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Actualizaciones del sistema
                </Label>
                <p className="text-xs text-muted-foreground">
                  Información sobre nuevas funciones y mantenimientos
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.systemUpdates}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', 'systemUpdates', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            {/* Weekly Reports */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Reportes semanales
                </Label>
                <p className="text-xs text-muted-foreground">
                  Resumen semanal de tu actividad y estadísticas
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.weeklyReports}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', 'weeklyReports', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Push Notifications */}
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
            <div className="rounded-lg p-3 bg-green-500/10">
              <Smartphone className="h-6 w-6 text-green-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Notificaciones Push
            </h4>
          </div>
          
          <div className="space-y-6">
            {/* Class Reminders */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Recordatorios de clases
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recordatorio 15 minutos antes de que inicie tu clase
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications.classReminders}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', 'classReminders', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            {/* Emergency Alerts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alertas de emergencia
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notificaciones urgentes del gimnasio o administración
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications.emergencyAlerts}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', 'emergencyAlerts', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            {/* New Messages */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Nuevos mensajes
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notificación instantánea cuando recibas un mensaje
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications.newMessages}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', 'newMessages', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* SMS Notifications */}
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
            <div className="rounded-lg p-3 bg-purple-500/10">
              <MessageSquare className="h-6 w-6 text-purple-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Notificaciones SMS
            </h4>
          </div>
          
          <div className="space-y-6">
            {/* Urgent Alerts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alertas urgentes
                </Label>
                <p className="text-xs text-muted-foreground">
                  SMS para situaciones críticas o emergencias
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications.urgentAlerts}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', 'urgentAlerts', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            {/* Class Changes */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Cambios de clases
                </Label>
                <p className="text-xs text-muted-foreground">
                  SMS cuando haya cambios de último momento en tus clases
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications.classChanges}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', 'classChanges', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <Button 
          onClick={() => {/* Settings are saved automatically */}}
          disabled={updateSettingsMutation.isPending}
          variant="outline"
          className="min-w-[200px]"
        >
          {updateSettingsMutation.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Configuración guardada automáticamente
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
});

NotificationsSection.displayName = 'NotificationsSection';

export { NotificationsSection };
