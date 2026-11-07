import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-body">
      {toasts.map(toast => {
        let borderClass = 'border-l-4 border-l-[#5c6ef8]';
        let icon = <Info className="w-4 h-4 text-[#5c6ef8] flex-shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-l-4 border-l-[#22d3a3]';
          icon = <CheckCircle2 className="w-4 h-4 text-[#22d3a3] flex-shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-l-4 border-l-[#f25c6e]';
          icon = <AlertCircle className="w-4 h-4 text-[#f25c6e] flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#1a1e28] border border-[#2a2f3f] ${borderClass} rounded-xl p-3.5 shadow-2xl flex items-center justify-between gap-3 animate-slide-up text-xs text-white`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#8b92ab] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
