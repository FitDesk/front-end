import { memo } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Trash2, UserX } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useConfigurationStore } from '../store/configuration-store';
import { DeactivateAccountModal } from './modals/deactivate-account-modal';
import { DeleteAccountModal } from './modals/delete-account-modal';

const AccountControlSection = memo(() => {
  const { 
    openDeactivateAccountModal, 
    openDeleteAccountModal,
    showDeactivateAccountModal,
    showDeleteAccountModal,
    closeDeactivateAccountModal,
    closeDeleteAccountModal
  } = useConfigurationStore();

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
            <div className="rounded-lg p-3 bg-red-500/10">
              <Shield className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Propiedad y Control de Cuenta
            </h3>
          </div>
          
          <p className="text-muted-foreground">
            Para iniciar el proceso, selecciona qué cuentas o perfiles quieres desactivar temporalmente o eliminar de forma definitiva.
          </p>
        </div>
      </motion.div>

      {/* Account Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deactivate Account */}
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
              <div className="rounded-lg p-3 bg-orange-500/10">
                <UserX className="h-6 w-6 text-orange-500" />
              </div>
              <h4 className="text-foreground text-lg font-semibold">
                Desactivar Cuenta
              </h4>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Desactiva temporalmente tu cuenta. Podrás reactivarla más tarde contactando al administrador.
              </p>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-400">Efectos de la desactivación:</p>
                    <ul className="text-xs text-orange-300 mt-2 space-y-1">
                      <li>• No podrás acceder al sistema</li>
                      <li>• Tus clases serán suspendidas</li>
                      <li>• Los estudiantes no podrán contactarte</li>
                      <li>• Tu perfil estará oculto</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
                onClick={openDeactivateAccountModal}
              >
                <UserX className="h-4 w-4 mr-2" />
                Desactivar Cuenta
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Delete Account */}
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
              <div className="rounded-lg p-3 bg-red-500/10">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h4 className="text-foreground text-lg font-semibold">
                Eliminar Cuenta
              </h4>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Elimina permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.
              </p>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400"> Acción irreversible:</p>
                    <ul className="text-xs text-red-300 mt-2 space-y-1">
                      <li>• Se eliminará toda tu información</li>
                      <li>• Historial de clases perdido</li>
                      <li>• Certificados y documentos eliminados</li>
                      <li>• No podrás recuperar la cuenta</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30"
                onClick={openDeleteAccountModal}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Cuenta Permanentemente
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current Account Info */}
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
            <div className="rounded-lg p-3 bg-blue-500/10">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="text-foreground text-lg font-semibold">
              Cuenta Actual
            </h4>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">Estado de la cuenta</p>
                <p className="text-xs text-blue-300 mt-1">Tu cuenta está activa y funcionando correctamente</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-400">Activa</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <DeactivateAccountModal 
        open={showDeactivateAccountModal}
        onClose={closeDeactivateAccountModal}
      />
      
      <DeleteAccountModal 
        open={showDeleteAccountModal}
        onClose={closeDeleteAccountModal}
      />
    </div>
  );
});

AccountControlSection.displayName = 'AccountControlSection';

export { AccountControlSection };
