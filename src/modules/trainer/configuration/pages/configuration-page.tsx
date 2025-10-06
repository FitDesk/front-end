import { memo } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Lock, 
  Accessibility, 
  Bell, 
  Globe, 
  Eye 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useConfigurationStore } from '../store/configuration-store';
import { PersonalDataSection } from '../components/personal-data-section';
import { AccountControlSection } from '../components/account-control-section';
import { PasswordSecuritySection } from '../components/password-security-section';
import { AccessibilitySection } from '../components/accessibility-section';
import { NotificationsSection } from '../components/notifications-section';
import { LanguageRegionSection } from '../components/language-region-section';
import { ProfilePrivacySection } from '../components/profile-privacy-section';
import type { ConfigurationSection } from '../types';

interface ConfigurationTab {
  id: ConfigurationSection;
  title: string;
  description: string;
  icon: typeof User;
  color: string;
}

const configurationTabs: ConfigurationTab[] = [
  {
    id: 'personal-data',
    title: 'Datos Personales',
    description: 'Información básica del perfil',
    icon: User,
    color: 'blue',
  },
  {
    id: 'account-control',
    title: 'Control de Cuenta',
    description: 'Desactivación o eliminación',
    icon: Shield,
    color: 'red',
  },
  {
    id: 'password-security',
    title: 'Contraseña y Seguridad',
    description: 'Controles de seguridad',
    icon: Lock,
    color: 'green',
  },
  {
    id: 'accessibility',
    title: 'Accesibilidad',
    description: 'Configuración de pantalla',
    icon: Accessibility,
    color: 'purple',
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    description: 'Recordatorios y novedades',
    icon: Bell,
    color: 'orange',
  },
  {
    id: 'language-region',
    title: 'Idioma y Región',
    description: 'Configuración regional',
    icon: Globe,
    color: 'indigo',
  },
  {
    id: 'profile-privacy',
    title: 'Privacidad del Perfil',
    description: 'Visibilidad pública o privada',
    icon: Eye,
    color: 'pink',
  },
];

const ConfigurationPage = memo(() => {
  const { activeSection, setActiveSection } = useConfigurationStore();

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all";
    
    switch (color) {
      case 'blue':
        return `${baseClasses} ${isActive 
          ? 'bg-blue-600/30 text-blue-300 border-blue-500/20' 
          : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/25 border-blue-500/20'
        }`;
      case 'red':
        return `${baseClasses} ${isActive 
          ? 'bg-red-600/30 text-red-300 border-red-500/20' 
          : 'bg-red-600/20 text-red-400 hover:bg-red-600/25 border-red-500/20'
        }`;
      case 'green':
        return `${baseClasses} ${isActive 
          ? 'bg-green-600/30 text-green-300 border-green-500/20' 
          : 'bg-green-600/20 text-green-400 hover:bg-green-600/25 border-green-500/20'
        }`;
      case 'purple':
        return `${baseClasses} ${isActive 
          ? 'bg-purple-600/30 text-purple-300 border-purple-500/20' 
          : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/25 border-purple-500/20'
        }`;
      case 'orange':
        return `${baseClasses} ${isActive 
          ? 'bg-orange-600/30 text-orange-300 border-orange-500/20' 
          : 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/25 border-orange-500/20'
        }`;
      case 'indigo':
        return `${baseClasses} ${isActive 
          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/20' 
          : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/25 border-indigo-500/20'
        }`;
      case 'pink':
        return `${baseClasses} ${isActive 
          ? 'bg-pink-600/30 text-pink-300 border-pink-500/20' 
          : 'bg-pink-600/20 text-pink-400 hover:bg-pink-600/25 border-pink-500/20'
        }`;
      default:
        return `${baseClasses} ${isActive 
          ? 'bg-gray-600/30 text-gray-300 border-gray-500/20' 
          : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/25 border-gray-500/20'
        }`;
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configuración del Sistema
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu perfil, seguridad, notificaciones y preferencias del sistema
          </p>
        </div>
      </motion.div>

      <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as ConfigurationSection)}>
        {/* Tabs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-7 gap-4 bg-transparent p-0">
            {configurationTabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={getTabColorClasses(tab.color, isActive)}
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex flex-col items-center gap-1 min-h-[60px] sm:min-h-[80px] cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium text-center leading-tight hidden sm:block">
                      {tab.title}
                    </span>
                  </motion.div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </motion.div>

        {/* Tab Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TabsContent value="personal-data" className="mt-6">
            <PersonalDataSection />
          </TabsContent>

          <TabsContent value="account-control" className="mt-6">
            <AccountControlSection />
          </TabsContent>

          <TabsContent value="password-security" className="mt-6">
            <PasswordSecuritySection />
          </TabsContent>

          <TabsContent value="accessibility" className="mt-6">
            <AccessibilitySection />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsSection />
          </TabsContent>

          <TabsContent value="language-region" className="mt-6">
            <LanguageRegionSection />
          </TabsContent>

          <TabsContent value="profile-privacy" className="mt-6">
            <ProfilePrivacySection />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
});

ConfigurationPage.displayName = 'ConfigurationPage';

export default ConfigurationPage;
