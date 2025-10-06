
export { default as ConfigurationPage } from './pages/configuration-page';

// Components
export { PersonalDataSection } from './components/personal-data-section';
export { AccountControlSection } from './components/account-control-section';
export { PasswordSecuritySection } from './components/password-security-section';
export { AccessibilitySection } from './components/accessibility-section';
export { NotificationsSection } from './components/notifications-section';
export { LanguageRegionSection } from './components/language-region-section';
export { ProfilePrivacySection } from './components/profile-privacy-section';

// Modals
export { DeactivateAccountModal } from './components/modals/deactivate-account-modal';
export { DeleteAccountModal } from './components/modals/delete-account-modal';
export { ChangePasswordModal } from './components/modals/change-password-modal';
export { SessionsModal } from './components/modals/sessions-modal';
export { RecentEmailsModal } from './components/modals/recent-emails-modal';


export * from './types';

export { useConfigurationStore } from './store/configuration-store';

export * from './hooks/use-configuration';

export { configurationService } from './services/configuration.service';
