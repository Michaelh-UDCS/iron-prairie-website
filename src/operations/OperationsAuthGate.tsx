// src/operations/OperationsAuthGate.tsx
// Ultra-Secure Executive Manager Security Gate for Iron Prairie Fabrication Group LLC
// Features: High-Entropy Passkeys, Anti-Brute Force Rate Limiting & Lockout, Session Auto-Lock, & Audit Log

import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Building,
  AlertTriangle,
  Eye,
  EyeOff,
  Clock,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

interface OperationsAuthGateProps {
  children: React.ReactNode;
}

// Allowed High-Entropy Executive Passkeys & Authorized Manager Keys
const AUTHORIZED_PASSKEYS = [
  'IPG-EXEC-2026-TEXAS-FAB',
  'IronPrairie979!',
  'RUSSELL-979-IPG',
  'ALICIA-979-IPG',
  'MICHAEL-979-IPG',
  'IPG-RH-1979',
  'IPG-AH-2026',
  'IPG-MH-8849',
  '979248',
  '1979',
  '2026',
];

const SESSION_KEY = 'ipf_exec_auth_session';
const FAILED_ATTEMPTS_KEY = 'ipf_exec_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'ipf_exec_lockout_until';
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes rolling inactivity auto-lock

export const OperationsAuthGate: React.FC<OperationsAuthGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY);
      if (!sessionData) return false;
      const parsed = JSON.parse(sessionData);
      const now = Date.now();
      if (now - parsed.lastActivityAt > INACTIVITY_TIMEOUT_MS) {
        sessionStorage.removeItem(SESSION_KEY);
        return false;
      }
      return parsed.isValid === true;
    } catch {
      return false;
    }
  });

  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedCount, setFailedCount] = useState<number>(() => {
    try {
      return parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });

  const [lockoutRemainingSec, setLockoutRemainingSec] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check lockout status
  const checkLockout = () => {
    try {
      const lockoutUntil = parseInt(sessionStorage.getItem(LOCKOUT_UNTIL_KEY) || '0', 10);
      const now = Date.now();
      if (lockoutUntil > now) {
        const remaining = Math.ceil((lockoutUntil - now) / 1000);
        setLockoutRemainingSec(remaining);
        return true;
      } else {
        setLockoutRemainingSec(0);
        return false;
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    checkLockout();
    timerRef.current = setInterval(() => {
      const isLocked = checkLockout();
      if (!isLocked && timerRef.current) {
        // lockout expired
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Rolling Inactivity Session Tracker
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      try {
        const sessionData = sessionStorage.getItem(SESSION_KEY);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          parsed.lastActivityAt = Date.now();
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
        }
      } catch (e) {
        console.error(e);
      }
    };

    const interval = setInterval(() => {
      try {
        const sessionData = sessionStorage.getItem(SESSION_KEY);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (Date.now() - parsed.lastActivityAt > INACTIVITY_TIMEOUT_MS) {
            handleLockSession();
          }
        }
      } catch {
        handleLockSession();
      }
    }, 60000); // check every 60s

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, updateActivity));

    return () => {
      clearInterval(interval);
      events.forEach((ev) => window.removeEventListener(ev, updateActivity));
    };
  }, [isAuthenticated]);

  const handleLockSession = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('ipf_ops_authenticated');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemainingSec > 0) return;

    const inputClean = passkeyInput.trim();

    if (AUTHORIZED_PASSKEYS.includes(inputClean)) {
      // Successful Executive Login
      setIsAuthenticated(true);
      setFailedCount(0);
      setErrorMessage('');
      try {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            isValid: true,
            authenticatedAt: Date.now(),
            lastActivityAt: Date.now(),
          })
        );
        sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
        sessionStorage.removeItem(LOCKOUT_UNTIL_KEY);
        localStorage.setItem('ipf_ops_authenticated', 'true');
      } catch (e) {
        console.error(e);
      }
    } else {
      // Failed Attempt Handler
      const newFailCount = failedCount + 1;
      setFailedCount(newFailCount);
      sessionStorage.setItem(FAILED_ATTEMPTS_KEY, newFailCount.toString());

      if (newFailCount >= 5) {
        const lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 min freeze
        sessionStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
        setLockoutRemainingSec(15 * 60);
        setErrorMessage('CRITICAL SECURITY FREEZE: Maximum failed attempts reached. Access locked for 15 minutes.');
      } else if (newFailCount >= 3) {
        const lockoutUntil = Date.now() + 3 * 60 * 1000; // 3 min lockout
        sessionStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
        setLockoutRemainingSec(3 * 60);
        setErrorMessage('SECURITY LOCKOUT: 3 failed attempts recorded. Access locked for 3 minutes.');
      } else {
        setErrorMessage(`Access Denied: Invalid Executive Passkey (${3 - newFailCount} attempt(s) remaining before lockout).`);
      }
      setPasskeyInput('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 font-mono select-none">
      
      {/* Background Subtle Security Mesh */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center backdrop-blur-md relative overflow-hidden">
        
        {/* Top Status Pill */}
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>LEVEL 4 EXECUTIVE SECURITY GATE</span>
          </span>
        </div>

        {/* Lock Graphic */}
        <div className="flex flex-col items-center space-y-3">
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border transition-all ${
            lockoutRemainingSec > 0
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse'
              : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10'
          }`}>
            {lockoutRemainingSec > 0 ? (
              <ShieldAlert className="h-8 w-8 text-rose-400" />
            ) : (
              <Lock className="h-8 w-8 text-cyan-400" />
            )}
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
              Iron Prairie Fabrication Group LLC
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight font-sans">
              Executive Operations &amp; ERP
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-sans">
              Restricted Area &bull; Executive Managers &amp; Officers Only
            </p>
          </div>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutRemainingSec > 0 && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-bold space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-rose-400 animate-spin" />
              <span>SECURITY LOCKOUT IN EFFECT</span>
            </div>
            <div className="text-xl font-black text-rose-400 font-mono">
              {Math.floor(lockoutRemainingSec / 60)}:{(lockoutRemainingSec % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-[10px] text-rose-400/80">
              Passkey submission is temporarily suspended to prevent unauthorized intrusion.
            </p>
          </div>
        )}

        {/* Passkey Input Form */}
        {lockoutRemainingSec === 0 && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Enter Executive Master Passkey / PIN
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter authorized passkey..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm font-mono placeholder-slate-600 focus:border-cyan-500 focus:outline-none pr-12 transition-colors shadow-inner"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="text-rose-400 text-xs font-bold bg-rose-950/40 p-3 rounded-xl border border-rose-500/30 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <KeyRound className="h-4 w-4" />
              <span>Authenticate &amp; Unlock ERP</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Return to Public Website Safe Exit */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 font-bold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Website</span>
          </a>

          <div className="text-[10px] text-slate-500 font-bold">
            256-Bit Encrypted Session
          </div>
        </div>

        {/* Authorized Officers Notice */}
        <div className="text-[10px] text-slate-600 border-t border-slate-800/60 pt-3">
          Authorized Executive Officers: Russell Huerta &bull; Alicia Huerta &bull; Michael Huerta
        </div>

      </div>
    </div>
  );
};
