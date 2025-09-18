import * as React from 'react';

type ToastType = 'default' | 'destructive' | 'success' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  showToast: (options: Omit<Toast, 'id'>) => void;
  toast: (options: Omit<Toast, 'id'>) => void; // Alias para mantener compatibilidad
  hideToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback(({ title, description, type = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts(currentToasts => [...currentToasts, { id, title, description, type }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const hideToast = React.useCallback((id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const value = React.useMemo(() => ({
    showToast,
    toast: showToast, // Alias para mantener compatibilidad
    hideToast,
    toasts,
  }), [showToast, hideToast, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              backgroundColor: toast.type === 'destructive' ? '#ef4444' : '#ffffff',
              color: toast.type === 'destructive' ? '#ffffff' : '#1f2937',
              padding: '1rem',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              minWidth: '300px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontWeight: 500, margin: 0 }}>{toast.title}</p>
              {toast.description && (
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => hideToast(toast.id)}
              style={{
                marginLeft: '1rem',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                opacity: 0.7,
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '0.7')}
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Componentes de compatibilidad para mantener la retrocompatibilidad
export const Toast: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  console.warn('El componente Toast está obsoleto. Usa useToast() en su lugar.');
  return <div {...props} />;
};

export const ToastAction: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  console.warn('El componente ToastAction está obsoleto. Usa useToast() en su lugar.');
  return <button {...props} />;
};

export const ToastTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  console.warn('El componente ToastTitle está obsoleto. Usa useToast() en su lugar.');
  return <div {...props} />;
};

export const ToastDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  console.warn('El componente ToastDescription está obsoleto. Usa useToast() en su lugar.');
  return <div {...props} />;
};
