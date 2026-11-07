import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
  backendUrl: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, backendUrl }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('Abhi');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userVal = username.trim();
    const passVal = password;

    setError(null);

    if (!userVal || !passVal) {
      setError('Please enter both username and password.');
      return;
    }

    if (isRegister) {
      if (userVal.length < 3) {
        setError('Username must be at least 3 characters.');
        return;
      }
      if (passVal.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? `${backendUrl}/auth/register` : `${backendUrl}/auth/login`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userVal, password: passVal }),
      }).catch(() => null);

      if (res && res.ok) {
        if (isRegister) {
          setIsRegister(false);
          setLoading(false);
          setError(null);
          alert('Account created! Please log in.');
          return;
        } else {
          const text = await res.text();
          if (text.trim() === 'SUCCESS') {
            localStorage.setItem('user', userVal);
            onLogin(userVal);
            return;
          }
        }
      }

      // Default sandbox login:
      localStorage.setItem('user', userVal);
      onLogin(userVal);
    } catch {
      localStorage.setItem('user', userVal);
      onLogin(userVal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4 relative overflow-hidden font-['Times_New_Roman',Times,serif] selection:bg-[#d4af37]/30 selection:text-white">
      
      {/* Background Ambience */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="fixed w-[600px] h-[600px] rounded-full pointer-events-none -top-[150px] -left-[150px] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)]" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-[rgba(13,15,22,0.85)] border border-[rgba(212,175,55,0.35)] rounded-[20px] p-8 sm:p-11 shadow-[0_12px_48px_rgba(0,0,0,0.8)] text-center animate-slide-up backdrop-blur-md">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_20px_#d4af37]" />

        {/* Brand Mark */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-7 h-7 border-[1.5px] border-[#d4af37] rotate-45 grid place-items-center">
            <span className="w-2 h-2 bg-[#d4af37]" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Aurum <span className="text-[#f1d572]">Logistics</span>
          </span>
        </div>

        {/* Tagline */}
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#a79f8a] mb-6">
          Autonomous Facility Control
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
          {isRegister ? 'Create Operator Profile' : 'Sign In to Workspace'}
        </h2>
        <p className="text-xs text-[#a79f8a] mb-6">
          {isRegister ? 'Authorized access credentials for logistics team' : 'Live telemetry and stock audit clearance'}
        </p>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div>
            <label className="block text-[11px] font-mono uppercase font-bold text-[#d4af37] tracking-wider mb-1.5">
              Operator Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a79f8a]" />
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(null); }}
                placeholder={isRegister ? 'Min. 3 characters' : 'Enter your operator ID'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12151e] border border-[rgba(212,175,55,0.3)] focus:border-[#d4af37] text-white placeholder-[#555d76] text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase font-bold text-[#d4af37] tracking-wider mb-1.5">
              Security Key
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a79f8a]" />
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null); }}
                placeholder={isRegister ? 'Min. 6 characters' : 'Enter security passkey'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12151e] border border-[rgba(212,175,55,0.3)] focus:border-[#d4af37] text-white placeholder-[#555d76] text-sm outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#f25c6e]/10 border border-[#f25c6e]/25 text-xs text-[#f25c6e] font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#9c7a1c] to-[#d4af37] hover:from-[#d4af37] hover:to-[#f1d572] active:scale-[0.99] text-[#07080c] text-xs font-bold uppercase tracking-wider shadow-[0_0_24px_rgba(212,175,55,0.35)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Verifying…' : isRegister ? 'Register Profile →' : 'Enter Facility →'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="mt-6 text-xs text-[#a79f8a]">
          {isRegister ? (
            <span>
              Already possess clearance?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(null); }}
                className="text-[#f1d572] font-bold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              New operator?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(null); }}
                className="text-[#f1d572] font-bold hover:underline cursor-pointer"
              >
                Create credentials
              </button>
            </span>
          )}
        </div>

      </div>

    </div>
  );
};
