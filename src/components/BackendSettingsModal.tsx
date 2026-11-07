import React, { useState } from 'react';
import { Server, CheckCircle2, XCircle, RefreshCw, X, Radio } from 'lucide-react';

interface BackendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendUrl: string;
  onUpdateBackendUrl: (url: string) => void;
  isConnected: boolean;
  onTestConnection: (url: string) => Promise<boolean>;
}

export const BackendSettingsModal: React.FC<BackendSettingsModalProps> = ({
  isOpen,
  onClose,
  backendUrl,
  onUpdateBackendUrl,
  isConnected,
  onTestConnection,
}) => {
  const [url, setUrl] = useState(backendUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const success = await onTestConnection(url);
    setTesting(false);
    setTestResult(success ? 'success' : 'failed');
    if (success) {
      onUpdateBackendUrl(url);
    }
  };

  const handleSave = () => {
    onUpdateBackendUrl(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#13161e] border border-[#2a2f3f] rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2f3f] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5c6ef8]/15 border border-[#5c6ef8]/30 flex items-center justify-center text-[#7b8aff]">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-head text-base font-bold text-white">
                Spring Boot Server Endpoint
              </h3>
              <p className="text-[11px] text-[#8b92ab]">
                Connect this UI to your local or deployed Java backend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1a1e28] border border-[#2a2f3f] flex items-center justify-center text-[#8b92ab] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase font-bold text-[#8b92ab] mb-1">
              Backend Base URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                onChange={e => { setUrl(e.target.value); setTestResult(null); }}
                placeholder="http://localhost:8080"
                className="flex-1 px-3 py-2 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] focus:border-[#5c6ef8] text-white text-xs font-mono outline-none"
              />
              <button
                onClick={handleTest}
                disabled={testing}
                className="px-3 py-2 rounded-xl bg-[#1a1e28] hover:bg-[#222736] border border-[#2a2f3f] text-[#8b92ab] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-[#5c6ef8]' : ''}`} />
                <span>Test</span>
              </button>
            </div>
          </div>

          {/* Test Status Feedback */}
          {testResult === 'success' && (
            <div className="p-3 rounded-xl bg-[#22d3a3]/10 border border-[#22d3a3]/30 text-xs text-[#22d3a3] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Connected successfully to Spring Boot backend at {url}!</span>
            </div>
          )}

          {testResult === 'failed' && (
            <div className="p-3 rounded-xl bg-[#f25c6e]/10 border border-[#f25c6e]/30 text-xs text-[#f25c6e] flex items-start gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to reach backend at {url}</p>
                <p className="text-[11px] text-[#8b92ab] mt-0.5">
                  Is your Spring Boot app running (<code className="text-white">./mvnw spring-boot:run</code>)? Make sure CORS is enabled via <code className="text-white">@CrossOrigin(origins = &quot;*&quot;)</code>.
                </p>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-[#1a1e28] border border-[#2a2f3f] text-xs text-[#8b92ab] space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#5c6ef8]" />
              Dual-Engine Capability
            </div>
            <p className="text-[11px] leading-relaxed">
              When your Java backend is offline, this app seamlessly falls back to an integrated high-fidelity local engine so you can still add, edit, filter, alert, and audit stock changes without interruption.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b92ab] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#5c6ef8] hover:bg-[#7b8aff] text-white text-xs font-bold shadow-[0_0_15px_rgba(92,110,248,0.3)]"
            >
              Apply Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
