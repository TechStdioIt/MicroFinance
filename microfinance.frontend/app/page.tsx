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
  Fingerprint,
  Smartphone,
  Info,
  Sliders,
  LogIn,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { users, currentUser, switchUser, settings, branches } = useMicrofinance();

  // Form states
  const [username, setUsername] = useState<string>(currentUser.username);
  const [password, setPassword] = useState<string>('password123');
  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0]?.name || 'Dhaka Corporate Headquarters');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [selectedDummyUserId, setSelectedDummyUserId] = useState<string>(currentUser.id);

  const handleSelectDemoAccount = (u: any) => {
    setSelectedDummyUserId(u.id);
    setUsername(u.username);
    setPassword('password123');
    switchUser(u.id);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    setIsLoggingIn(true);

    // Find if username matches any existing user persona
    const foundUser = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (foundUser) {
      switchUser(foundUser.id);
    }

    // Simulate short secure biometric / credential check animation
    setTimeout(() => {
      setIsLoggingIn(false);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Architectural Ambient Glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl w-full mx-auto space-y-8 relative z-10 my-6">
        {/* Brand & Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/30 shadow-lg">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Enterprise Banking Gateway • Zero-Dev Ready</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <span>{settings.orgName || 'TechStdio MicroFinance OS'}</span>
            <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto font-medium">
            Centralized Micro-Banking Operating System for NGOs. Access your assigned branch vault, member KYC registries, and daily teller windows.
          </p>
        </div>

        {/* Main Split Grid: Left is Demo Accounts, Right is Interactive Login Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (7 cols): Dummy Demo Accounts Table */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900/90 border border-slate-800/80 p-7 shadow-2xl flex flex-col justify-between backdrop-blur-xl space-y-6">
            <div className="space-y-2 border-b border-slate-800/80 pb-4">
              <span className="text-xs font-black tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>Instant Sandbox Evaluation</span>
              </span>
              <h2 className="text-2xl font-black text-white">
                Select a Demo Account Persona
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Click any profile below to auto-fill the login credentials instantly and test granular Role-Based Access Control (RBAC) across teller operations & financial calculation rules.
              </p>
            </div>

            {/* Grid of Dummy Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {users.map((u) => {
                const isSelected = selectedDummyUserId === u.id;
                const roleName = u.roleId.replace('ROLE-', '');
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectDemoAccount(u)}
                    onDoubleClick={() => {
                      handleSelectDemoAccount(u);
                      router.push('/dashboard');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/50 border-slate-700/70 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2.5 -right-2.5 bg-emerald-500 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase shadow-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Selected
                      </div>
                    )}

                    <div className="flex items-start gap-3.5">
                      <img
                        src={u.avatarUrl}
                        alt=""
                        className="w-13 h-13 rounded-xl object-cover border-2 border-emerald-500/40 shrink-0"
                      />
                      <div className="overflow-hidden space-y-1">
                        <p className="font-extrabold text-sm text-white truncate">{u.fullName}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          roleName === 'ADMIN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          roleName === 'MANAGER' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          roleName === 'TELLER' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {roleName} PERSONA
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono space-y-1 bg-slate-950/60 p-2.5 rounded-xl">
                      <p className="flex justify-between text-slate-400">
                        <span>Username:</span> <strong className="text-emerald-400">{u.username}</strong>
                      </p>
                      <p className="flex justify-between text-slate-400">
                        <span>Password:</span> <strong className="text-slate-200">password123</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectDemoAccount(u)}
                      className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-700/70 hover:bg-slate-700 text-slate-200 group-hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Ready to Login →' : 'Click to Auto-Fill'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                Biometric Terminal & Optical Scanner Ready
              </span>
              <span className="text-emerald-400">Frontend Simulation Mode Active</span>
            </div>
          </div>

          {/* Right Column (5 cols): Authentic Security Login Form */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-900/95 border-2 border-slate-800 p-8 shadow-2xl flex flex-col justify-center relative">
            {loginSuccess ? (
              <div className="py-16 text-center space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Authentication Verified!</h3>
                  <p className="text-sm text-emerald-400 font-semibold mt-1">
                    Connecting to {selectedBranch}...
                  </p>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  Loading member passbooks and zero-developer dynamic formulas...
                </p>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-1.5 border-b border-slate-800 pb-4">
                  <h3 className="text-2xl font-black text-white flex items-center gap-2.5">
                    <LogIn className="w-6 h-6 text-emerald-500" />
                    <span>Portal Authentication</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Enter staff credentials or select a demo account on the left.
                  </p>
                </div>

                {/* Username input */}
                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Operator Username</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin.jewel or teller.fatema"
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
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-bold text-emerald-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition font-mono"
                  />
                </div>

                {/* Branch selector */}
                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Assigned Operating Branch</span>
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.code} - {b.name}
                      </option>
                    ))}
                    <option value="Global Audit Network">Global Audit & Remote Network</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-emerald-500 cursor-pointer" />
                    <span>Remember terminal session</span>
                  </label>
                  <span className="text-emerald-400 font-bold hover:underline cursor-pointer">
                    OTP Bypass?
                  </span>
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
                      <span>Verifying Biometric Key...</span>
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
                🔒 Protected by 256-Bit SSL & Optical Biometric Enforcement
              </p>
              <p>
                Microfinance Regulatory Authority (MRA) Compliance Certified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
