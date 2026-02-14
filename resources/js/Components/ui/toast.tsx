'use client';

import * as React from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const variantStyles = {
  success: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400',
  error: 'bg-rose-500/10 border-rose-500/50 text-rose-400',
  warning: 'bg-amber-500/10 border-amber-500/50 text-amber-400',
  info: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
};

const variantIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: AlertCircle,
};

export function Toast({ toast, onClose }: ToastProps) {
  const Icon = variantIcons[toast.variant];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg',
        variantStyles[toast.variant]
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 rounded p-1 hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
