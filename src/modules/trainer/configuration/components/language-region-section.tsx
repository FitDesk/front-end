import { memo } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  MapPin, 
  Clock, 
  Calendar,
  DollarSign,
  Languages
} from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
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
  useLanguageRegionSettings, 
  useUpdateLanguageRegionSettings 
} from '../hooks/use-configuration';

const LanguageRegionSection = memo(() => {
  const { data: settings, isLoading } = useLanguageRegionSettings();
  const updateSettingsMutation = useUpdateLanguageRegionSettings();

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
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="bg-card/40 border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
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
        <p className="text-destructive">Error al cargar la configuración de idioma y región</p>
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
            <div className="rounded-lg p-3 bg-indigo-500/10">
              <Globe className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Idioma y Región
            </h3>
          </div>
          
          <p className="text-muted-foreground">
            Configura tu idioma preferido y opciones regionales para personalizar tu experiencia
          </p>
        </div>
      </motion.div>

      {/* Language & Region Settings */}
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
              <Languages className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Configuración Regional
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Idioma de la interfaz
              </Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ES">Español</SelectItem>
                  <SelectItem value="EN">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Región
              </Label>
              <Select 
                value={settings.region} 
                onValueChange={(value) => handleSettingChange('region', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PE">Perú</SelectItem>
                  <SelectItem value="US">Estados Unidos</SelectItem>
                  <SelectItem value="MX">México</SelectItem>
                  <SelectItem value="AR">Argentina</SelectItem>
                  <SelectItem value="CL">Chile</SelectItem>
                  <SelectItem value="CO">Colombia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Zona horaria
              </Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => handleSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                  <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                  <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                  <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                  <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                  <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Moneda
              </Label>
              <Select 
                value={settings.currency} 
                onValueChange={(value) => handleSettingChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEN">Sol Peruano (S/)</SelectItem>
                  <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Date & Time Format Settings */}
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
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Formato de Fecha y Hora
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Format */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Formato de fecha
              </Label>
              <Select 
                value={settings.dateFormat} 
                onValueChange={(value) => handleSettingChange('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (27/01/2025)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (01/27/2025)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-01-27)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Format */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Formato de hora
              </Label>
              <Select 
                value={settings.timeFormat} 
                onValueChange={(value) => handleSettingChange('timeFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12H">12 horas (2:30 PM)</SelectItem>
                  <SelectItem value="24H">24 horas (14:30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Vista previa:</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Fecha:</span> {
                  settings.dateFormat === 'DD/MM/YYYY' ? '27/01/2025' :
                  settings.dateFormat === 'MM/DD/YYYY' ? '01/27/2025' : '2025-01-27'
                }
              </p>
              <p>
                <span className="font-medium">Hora:</span> {
                  settings.timeFormat === '12H' ? '2:30 PM' : '14:30'
                }
              </p>
              <p>
                <span className="font-medium">Moneda:</span> {
                  settings.currency === 'PEN' ? 'S/ 150.00' : '$ 150.00'
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
              <Globe className="h-4 w-4 mr-2" />
              Configuración guardada automáticamente
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
});

LanguageRegionSection.displayName = 'LanguageRegionSection';

export { LanguageRegionSection };
