'use client';

import React from 'react';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { SmsNotification } from '../context/MicrofinanceContext';
import { MessageSquare, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';

export default function SmsLogsPage() {
  const { smsLog, members, settings } = useMicrofinance();

  const columns: Column<SmsNotification>[] = [
    {
      header: 'Message ID & Time',
      accessorKey: 'id',
      cell: (item) => (
        <div>
          <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">{item.id}</p>
          <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
        </div>
      ),
    },
    {
      header: 'Recipient Device & Phone',
      accessorKey: 'phone',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <p className="font-extrabold text-xs text-slate-800 dark:text-white">{item.recipientName}</p>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{item.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Broadcast Message Payload',
      accessorKey: 'message',
      cell: (item) => (
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono text-slate-800 dark:text-slate-200 max-w-lg leading-relaxed">
          &ldquo;{item.message}&rdquo;
        </div>
      ),
    },
    {
      header: 'Gateway Delivery Status',
      accessorKey: 'status',
      cell: (item) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Delivered
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Automated Communication Telemetry
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-emerald-500" />
            Outgoing SMS Gateway Telemetry
          </h1>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/30 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Gateway Status: {settings.smsGatewayEnabled ? 'ONLINE & DISPATCHING' : 'OFFLINE / MUTED'}</span>
        </div>
      </div>

      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        This registry captures every automated notification SMS triggered during teller cash deposits, withdrawals, loan EMI collections, and new member onboarding events.
      </p>

      <DataTable
        data={smsLog}
        columns={columns}
        searchPlaceholder="Filter SMS telemetry by recipient phone number, name or keyword..."
        exportTitle="Export SMS Dispatch Logs"
        emptyMessage="No SMS messages broadcast in the current session yet. Execute a teller transaction to trigger live automated alerts!"
      />
    </div>
  );
}
