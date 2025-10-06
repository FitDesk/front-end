import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ConfigurationSection } from '../types';


interface ConfigurationState {
  activeSection: ConfigurationSection;
  showChangePasswordModal: boolean;
  showDeactivateAccountModal: boolean;
  showDeleteAccountModal: boolean;
  showSessionsModal: boolean;
  showRecentEmailsModal: boolean;
  
 
  setActiveSection: (section: ConfigurationSection) => void;
  openChangePasswordModal: () => void;
  closeChangePasswordModal: () => void;
  openDeactivateAccountModal: () => void;
  closeDeactivateAccountModal: () => void;
  openDeleteAccountModal: () => void;
  closeDeleteAccountModal: () => void;
  openSessionsModal: () => void;
  closeSessionsModal: () => void;
  openRecentEmailsModal: () => void;
  closeRecentEmailsModal: () => void;
  resetModals: () => void;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const configurationStore = (set: any) => ({
  activeSection: 'personal-data' as ConfigurationSection,
  showChangePasswordModal: false,
  showDeactivateAccountModal: false,
  showDeleteAccountModal: false,
  showSessionsModal: false,
  showRecentEmailsModal: false,

  setActiveSection: (section: ConfigurationSection) => set((state: ConfigurationState) => {
    state.activeSection = section;
  }),
  

  openChangePasswordModal: () => set((state: ConfigurationState) => {
    state.showChangePasswordModal = true;
  }),
  
  closeChangePasswordModal: () => set((state: ConfigurationState) => {
    state.showChangePasswordModal = false;
  }),
  
  openDeactivateAccountModal: () => set((state: ConfigurationState) => {
    state.showDeactivateAccountModal = true;
  }),
  
  closeDeactivateAccountModal: () => set((state: ConfigurationState) => {
    state.showDeactivateAccountModal = false;
  }),
  
  openDeleteAccountModal: () => set((state: ConfigurationState) => {
    state.showDeleteAccountModal = true;
  }),
  
  closeDeleteAccountModal: () => set((state: ConfigurationState) => {
    state.showDeleteAccountModal = false;
  }),
  
  openSessionsModal: () => set((state: ConfigurationState) => {
    state.showSessionsModal = true;
  }),
  
  closeSessionsModal: () => set((state: ConfigurationState) => {
    state.showSessionsModal = false;
  }),
  
  openRecentEmailsModal: () => set((state: ConfigurationState) => {
    state.showRecentEmailsModal = true;
  }),
  
  closeRecentEmailsModal: () => set((state: ConfigurationState) => {
    state.showRecentEmailsModal = false;
  }),
  
  resetModals: () => set((state: ConfigurationState) => {
    state.showChangePasswordModal = false;
    state.showDeactivateAccountModal = false;
    state.showDeleteAccountModal = false;
    state.showSessionsModal = false;
    state.showRecentEmailsModal = false;
  }),
});


export const useConfigurationStore = create<ConfigurationState>()(
  persist(
    devtools(immer(configurationStore), { name: 'configuration-store' }),
    {
      name: 'fitdesk-trainer-configuration',
      partialize: (state) => ({
        activeSection: state.activeSection,
      }),
    }
  )
);
