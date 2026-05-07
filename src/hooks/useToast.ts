import { useToast as useToastContext } from '@/components/Toast';
import { ToastType } from '@/components/Toast';

export function useToast() {
  const { showToast } = useToastContext();
  return {
    success: (message: string) => showToast(message, 'success' as ToastType),
    error: (message: string) => showToast(message, 'error' as ToastType),
    warning: (message: string) => showToast(message, 'warning' as ToastType),
    info: (message: string) => showToast(message, 'info' as ToastType),
    show: showToast,
  };
}