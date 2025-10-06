import { memo } from 'react';
import { motion } from 'motion/react';
import { 
  Accessibility, 
  Monitor, 
  Zap,
  Volume2
} from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { 
  useAccessibilitySettings, 
  useUpdateAccessibilitySettings 
} from '../hooks/use-configuration';

const AccessibilitySection = memo(() => {
  const { data: settings, isLoading } = useAccessibilitySettings();
  const updateSettingsMutation = useUpdateAccessibilitySettings();

  const handleSettingChange = async (key: string, value: unknown) => {
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
        <p className="text-destructive">Error al cargar la configuración de accesibilidad</p>
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
            <div className="rounded-lg p-3 bg-purple-500/10">
              <Accessibility className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Configuración de Accesibilidad
            </h3>
          </div>
          
          <p className="text-muted-foreground">
            Personaliza la interfaz para mejorar tu experiencia de uso
          </p>
        </div>
      </motion.div>

      {/* Display Settings */}
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
              <Monitor className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Configuración de Pantalla
            </h4>
          </div>
          
          <div className="space-y-6">
            {/* Theme */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tema de la interfaz</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => handleSettingChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIGHT">Claro</SelectItem>
                  <SelectItem value="DARK">Oscuro</SelectItem>
                  <SelectItem value="AUTO">Automático (según sistema)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tamaño de fuente</Label>
              <Select 
                value={settings.fontSize} 
                onValueChange={(value) => handleSettingChange('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMALL">Pequeña</SelectItem>
                  <SelectItem value="MEDIUM">Mediana</SelectItem>
                  <SelectItem value="LARGE">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Alto contraste</Label>
                <p className="text-xs text-muted-foreground">
                  Mejora la visibilidad con colores más contrastantes
                </p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Motion & Animation Settings */}
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
              <Zap className="h-6 w-6 text-green-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Animaciones y Movimiento
            </h4>
          </div>
          
          <div className="space-y-6">
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Reducir movimiento</Label>
                <p className="text-xs text-muted-foreground">
                  Minimiza las animaciones y transiciones para reducir mareos
                </p>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Screen Reader Settings */}
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
            <div className="rounded-lg p-3 bg-orange-500/10">
              <Volume2 className="h-6 w-6 text-orange-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Lector de Pantalla
            </h4>
          </div>
          
          <div className="space-y-6">
            {/* Screen Reader Support */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Soporte para lector de pantalla</Label>
                <p className="text-xs text-muted-foreground">
                  Optimiza la interfaz para lectores de pantalla
                </p>
              </div>
              <Switch
                checked={settings.screenReader}
                onCheckedChange={(checked) => handleSettingChange('screenReader', checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <Button 
          onClick={() => {/* Settings are saved automatically */}}
          disabled={updateSettingsMutation.isPending}
          className="min-w-[120px]"
        >
          {updateSettingsMutation.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Guardando...
            </>
          ) : (
            'Configuración guardada automáticamente'
          )}
        </Button>
      </motion.div>
    </div>
  );
});

AccessibilitySection.displayName = 'AccessibilitySection';

export { AccessibilitySection };
