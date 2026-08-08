'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMicrofinance } from './context/MicrofinanceContext';
import {
  Lock,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Key,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, settings, branches } = useMicrofinance();

  // Form states
  const [email, setEmail] = useState<string>('admin@techstdio.com');
  const [password, setPassword] = useState<string>('Admin@123');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);
    
    const success = await login(email, password);
    
    if (success) {
      setLoginSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    } else {
      setErrorMsg('Invalid email or password. Please try again.');
    }
    
    setIsLoggingIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Architectural Ambient Glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full mx-auto space-y-8 relative z-10 my-6">
        {/* Brand & Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/30 shadow-lg">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Enterprise Banking Gateway</span>
          </div>
          
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <span>{settings.orgName || 'TechStdio MicroFinance OS'}</span>
            <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
          </h1>
        </div>

        {/* Authentic Security Login Form */}
        <div className="rounded-3xl bg-slate-900/95 border-2 border-slate-800 p-8 shadow-2xl flex flex-col justify-center relative">
          {loginSuccess ? (
            <div className="py-16 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Authentication Verified!</h3>
                <p className="text-sm text-emerald-400 font-semibold mt-1">
                  Connecting to secure network...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-1.5 border-b border-slate-800 pb-4">
                <h3 className="text-2xl font-black text-white flex items-center gap-2.5">
                  <Lock className="w-6 h-6 text-emerald-500" />
                  <span>Portal Authentication</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Enter your assigned staff credentials to continue.
                </p>
              </div>
              
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {/* Email input */}
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@techstdio.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-bold text-white placeholder-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition font-mono"
                />
              </div>

              {/* Password input */}
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Security Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-bold text-emerald-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition font-mono"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Secure Portal Sign-In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Footer Notice */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 text-center text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-400">
              Protected by 256-Bit SSL & Identity Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
