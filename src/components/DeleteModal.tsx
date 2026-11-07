import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-body">
      <div 
        className="bg-[#13161e] border border-[#f25c6e]/30 rounded-2xl w-full max-w-sm shadow-[0_12px_48px_rgba(242,92,110,0.2)] overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#f25c6e]/15 border border-[#f25c6e]/30 flex items-center justify-center text-[#f25c6e]">
            <Trash2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-head text-lg font-bold text-white">
              Confirm Delete
            </h3>
            <p className="text-xs text-[#8b92ab] mt-1.5 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">&quot;{productName}&quot;</strong>?
            </p>
            <p className="text-[11px] font-mono text-[#f25c6e] mt-1">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-[#8b92ab] hover:text-white bg-[#1a1e28] border border-[#2a2f3f] hover:bg-[#222736] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-xl bg-[#f25c6e] hover:bg-[#f25c6e]/90 text-white text-xs font-bold shadow-[0_0_15px_rgba(242,92,110,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
