import React, { createContext, useContext, useState } from 'react';
import Toast from './Toast';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'info' | 'warning' | 'danger', position?: 'top' | 'middle' | 'bottom', duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning' | 'danger'>('info');
  const [toastPosition, setToastPosition] = useState<'top' | 'middle' | 'bottom'>('bottom');

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'danger', position: 'top' | 'middle' | 'bottom' = 'bottom', duration?: number) => {
    setToastMessage(message);
    setToastType(type);
    setToastPosition(position);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
      setToastMessage(null);
    }, duration ?? 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && <Toast message={toastMessage} visible={toastVisible} type={toastType} position={toastPosition} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
