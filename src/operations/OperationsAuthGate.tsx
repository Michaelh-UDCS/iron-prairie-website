// src/operations/OperationsAuthGate.tsx
// Security PIN Authentication Gate for Dedicated Desktop Operations Workspace

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, KeyRound, ArrowRight, Building } from 'lucide-react';
import brandLogo from '../Logo.jpg';

interface OperationsAuthGateProps {
  children: React.ReactNode;
}

export const OperationsAuthGate: React.FC<OperationsAuthGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ipf_ops_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Default shop PIN: 1979 or 2026
  const VALID_PINS = ['1979', '2026', '979248'];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_PINS.includes(pinInput.trim())) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('ipf_ops_authenticated', 'true');
      } catch (e) {
        console.error(e);
      }
    } else {
      setErrorMessage('Invalid Shop PIN. Please enter the authorized operations PIN.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('ipf_ops_authenticated');
    } catch (e) {
      console.error(e);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 font-mono">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              IRON PRAIRIE FABRICATION GROUP LLC
            </div>
            <h1 className="text-xl font-black text-slate-100 mt-1 font-sans">
              Shop Floor &amp; Operations Workspace
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Authorized access only &bull; Texas Shop Operations
            </p>
          </div>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">
              Enter Operations Security PIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;"
              className="w-full text-center tracking-[1em] text-2xl font-black bg-slate-950 border border-slate-700 rounded-xl py-3 text-amber-400 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              autoFocus
            />
          </div>

          {errorMessage && (
            <div className="text-rose-400 text-xs font-bold bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
          >
            <span>Unlock Operations Platform</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800">
          Russell Huerta &bull; Alicia Huerta &bull; Michael Huerta
        </div>

      </div>
    </div>
  );
};
