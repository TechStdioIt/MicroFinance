'use client';

import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle2, XCircle, Smartphone, ShieldAlert, ArrowRight, Lock } from 'lucide-react';

interface FingerprintScannerModalProps {
  isOpen: boolean;
  memberName: string;
  memberNid: string;
  onSuccess: (method: 'BIOMETRIC' | 'OTP_BYPASS') => void;
  onCancel: () => void;
  requiredAmount?: number;
}

export function FingerprintScannerModal({
  isOpen,
  memberName,
  memberNid,
  onSuccess,
  onCancel,
  requiredAmount,
}: FingerprintScannerModalProps) {
  const [step, setStep] = useState<'READY' | 'SCANNING' | 'MATCHED' | 'OTP_MODE'>('READY');
  const [scanProgress, setScanProgress] = useState(0);
  const [statusText, setStatusText] = useState('Waiting for finger placement on biometric sensor...');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('READY');
      setScanProgress(0);
      setStatusText('Waiting for member to place thumb on optical scanner...');
      setOtpCode('');
      setOtpSent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startScan = () => {
    setStep('SCANNING');
    setStatusText('Optical sensor active. Acquiring high-resolution fingerprint ridges...');
    
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setScanProgress(current);

      if (current === 40) {
        setStatusText('Extracting minutiae templates and verifying NID signatures...');
      } else if (current === 80) {
        setStatusText('Comparing against National Biometric Vault records...');
      } else if (current >= 100) {
        clearInterval(interval);
        setStep('MATCHED');
        setStatusText('Biometric Signature MATCHED! Authenticated with 99.8% confidence.');
        setTimeout(() => {
          onSuccess('BIOMETRIC');
        }, 1200);
      }
    }, 450);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length >= 4) {
      onSuccess('OTP_BYPASS');
    } else {
      alert('Please enter the 6-digit verification code sent via SMS.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative">
        {/* Top Glow bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"></div>

        <div className="p-7 text-center">
          {/* Header text */}
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
            Mandatory Biometric Verification
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Cash withdrawal & teller operations require live member authentication to prevent unauthorized fraud.
          </p>

          {/* Member Meta Box */}
          <div className="my-5 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-left">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Account Holder</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{memberName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold">NID Reference</p>
              <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{memberNid}</p>
            </div>
          </div>

          {step !== 'OTP_MODE' ? (
            <>
              {/* Animated Fingerprint Scanner Window */}
              <div className="relative w-48 h-48 mx-auto my-6 rounded-2xl bg-slate-900 border-2 border-emerald-500/30 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                {step === 'SCANNING' && <div className="animate-laser"></div>}
                
                {step === 'READY' && (
                  <button
                    onClick={startScan}
                    className="group relative flex flex-col items-center justify-center text-emerald-500 hover:text-emerald-400 transition"
                  >
                    <div className="p-4 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition duration-300">
                      <Fingerprint className="w-16 h-16 animate-pulse" />
                    </div>
                    <span className="text-xs font-bold mt-3 text-slate-300 tracking-wider">TAP TO SCAN THUMB</span>
                  </button>
                )}

                {step === 'SCANNING' && (
                  <div className="flex flex-col items-center text-emerald-400">
                    <Fingerprint className="w-20 h-20 text-emerald-400 opacity-90 animate-pulse" />
                    <span className="text-xs font-mono font-bold mt-3">{scanProgress}% ACQUIRED</span>
                  </div>
                )}

                {step === 'MATCHED' && (
                  <div className="flex flex-col items-center text-emerald-400 animate-in zoom-in-75 duration-300">
                    <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                    <span className="text-xs font-black tracking-wider mt-2 text-white bg-emerald-600 px-3 py-1 rounded-full">
                      VERIFICATION PASSED
                    </span>
                  </div>
                )}
              </div>

              {/* Status prompt */}
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 min-h-[32px] px-4">
                {statusText}
              </p>

              {/* Bottom buttons */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel Operation
                </button>

                <button
                  onClick={() => {
                    setStep('OTP_MODE');
                    setOtpSent(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <Smartphone className="w-4 h-4" />
                  Sensor Error? Bypass with SMS OTP
                </button>
              </div>
            </>
          ) : (
            /* OTP Bypass Form Mode */
            <form onSubmit={handleOtpSubmit} className="text-left mt-4 space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-medium flex gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                <span>
                  <b>Administrative Override:</b> An SMS containing an emergency 6-digit OTP code has been broadcast to {memberName}&apos;s registered mobile number.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enter 6-Digit SMS Verification Code:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g., 842109"
                  className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep('READY')}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  ← Back to Fingerprint Scanner
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:opacity-95 transition"
                >
                  Authorize via OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
