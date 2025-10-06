import { memo } from 'react';
import { motion } from 'motion/react';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Users,
  Mail,
  Phone,
  Award,
  MessageSquare
} from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { 
  usePrivacySettings, 
  useUpdatePrivacySettings 
} from '../hooks/use-configuration';

const ProfilePrivacySection = memo(() => {
  const { data: settings, isLoading } = usePrivacySettings();
  const updateSettingsMutation = useUpdatePrivacySettings();

  const handleSettingChange = async (key: string, value: any) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      [key]: value,
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
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
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
        <p className="text-destructive">Error al cargar la configuración de privacidad</p>
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
            <div className="rounded-lg p-3 bg-pink-500/10">
              <Eye className="h-6 w-6 text-pink-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Privacidad del Perfil
            </h3>
          </div>
          
          <p className="text-muted-foreground">
            Si pones público todos podrán ver tu perfil, pero si pones privado solo tú podrás ver tu perfil
          </p>
        </div>
      </motion.div>

      {/* Profile Visibility */}
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
              Visibilidad del Perfil
            </h4>
          </div>
          
          <div className="space-y-6">
            {/* Profile Visibility Toggle */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Visibilidad general del perfil</Label>
              <Select 
                value={settings.profileVisibility} 
                onValueChange={(value) => handleSettingChange('profileVisibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Público - Todos pueden ver mi perfil</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PRIVATE">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      <span>Privado - Solo yo puedo ver mi perfil</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {/* Current Status */}
              <div className="flex items-center gap-2">
                <Badge 
                  variant={settings.profileVisibility === 'PUBLIC' ? 'default' : 'secondary'}
                  className={
                    settings.profileVisibility === 'PUBLIC' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/20' 
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/20'
                  }
                >
                  {settings.profileVisibility === 'PUBLIC' ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Perfil Público
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Perfil Privado
                    </>
                  )}
                </Badge>
              </div>
            </div>

            {/* Visibility Info */}
            <div className={`p-4 rounded-lg border ${
              settings.profileVisibility === 'PUBLIC' 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-gray-500/10 border-gray-500/20'
            }`}>
              <div className="flex items-start gap-3">
                {settings.profileVisibility === 'PUBLIC' ? (
                  <Users className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <Shield className="h-5 w-5 text-gray-500 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-medium ${
                    settings.profileVisibility === 'PUBLIC' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {settings.profileVisibility === 'PUBLIC' 
                      ? 'Tu perfil es visible para todos' 
                      : 'Tu perfil es privado'
                    }
                  </p>
                  <p className={`text-xs mt-1 ${
                    settings.profileVisibility === 'PUBLIC' ? 'text-green-300' : 'text-gray-300'
                  }`}>
                    {settings.profileVisibility === 'PUBLIC' 
                      ? 'Los estudiantes y otros entrenadores pueden ver tu información, especialidades y experiencia'
                      : 'Solo tú puedes ver tu información completa. Los estudiantes solo verán tu nombre en las clases'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Privacy Settings */}
      {settings.profileVisibility === 'PUBLIC' && (
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
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <h4 className="text-foreground text-lg font-semibold">
                Información Visible
              </h4>
            </div>
            
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Controla qué información específica es visible en tu perfil público
              </p>

              {/* Show Email */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Mostrar email
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Los estudiantes podrán ver tu dirección de correo electrónico
                  </p>
                </div>
                <Switch
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>

              {/* Show Phone */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Mostrar teléfono
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Los estudiantes podrán ver tu número de teléfono
                  </p>
                </div>
                <Switch
                  checked={settings.showPhone}
                  onCheckedChange={(checked) => handleSettingChange('showPhone', checked)}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>

              {/* Show Experience */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Mostrar experiencia
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Los estudiantes podrán ver tus años de experiencia y certificaciones
                  </p>
                </div>
                <Switch
                  checked={settings.showExperience}
                  onCheckedChange={(checked) => handleSettingChange('showExperience', checked)}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>

              {/* Allow Student Contact */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Permitir contacto directo
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Los estudiantes podrán enviarte mensajes directos
                  </p>
                </div>
                <Switch
                  checked={settings.allowStudentContact}
                  onCheckedChange={(checked) => handleSettingChange('allowStudentContact', checked)}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Privacy Summary */}
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
              <Shield className="h-6 w-6 text-purple-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Resumen de Privacidad
            </h4>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Estado del perfil:</p>
                <Badge 
                  variant={settings.profileVisibility === 'PUBLIC' ? 'default' : 'secondary'}
                  className={
                    settings.profileVisibility === 'PUBLIC' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/20' 
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/20'
                  }
                >
                  {settings.profileVisibility === 'PUBLIC' ? 'Público' : 'Privado'}
                </Badge>
              </div>
              
              {settings.profileVisibility === 'PUBLIC' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Información visible:</p>
                  <div className="flex flex-wrap gap-1">
                    {settings.showEmail && (
                      <Badge variant="outline" className="text-xs">Email</Badge>
                    )}
                    {settings.showPhone && (
                      <Badge variant="outline" className="text-xs">Teléfono</Badge>
                    )}
                    {settings.showExperience && (
                      <Badge variant="outline" className="text-xs">Experiencia</Badge>
                    )}
                    {settings.allowStudentContact && (
                      <Badge variant="outline" className="text-xs">Contacto directo</Badge>
                    )}
                  </div>
                </div>
              )}
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
              <Eye className="h-4 w-4 mr-2" />
              Configuración guardada automáticamente
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
});

ProfilePrivacySection.displayName = 'ProfilePrivacySection';

export { ProfilePrivacySection };
