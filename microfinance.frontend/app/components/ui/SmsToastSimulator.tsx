'use client';

import React from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { MessageSquare, ShieldCheck, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function SmsToastSimulator() {
  const { latestSms, dismissSmsToast } = useMicrofinance();

  if (!latestSms) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Glowing badge corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-sm">
              SMS
            </div>
            <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase flex items-center gap-1">
              Live Gateway Broadcast
            </span>
          </div>
          <button
            onClick={dismissSmsToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            title="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recipient Details */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
          <span>To: <strong className="text-slate-200">{latestSms.recipientName}</strong></span>
          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-300">{latestSms.phone}</span>
        </div>

        {/* Message body */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-200 leading-relaxed">
          &ldquo;{latestSms.message}&rdquo;
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Delivered in 0.4s
          </span>
          <Link
            href="/sms-logs"
            onClick={dismissSmsToast}
            className="flex items-center gap-1 hover:text-emerald-400 underline font-semibold transition"
          >
            <span>View All Gateway Logs</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
