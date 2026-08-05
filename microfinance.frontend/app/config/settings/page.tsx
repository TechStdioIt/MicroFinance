'use client';

import React, { useState } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { OrganizationSettings } from '../../types/microfinance';
import { Settings, CheckCircle2, RotateCcw, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

export default function GlobalSettingsPage() {
  const { settings, updateSettings, resetToSeed, hasPermission } = useMicrofinance();
  const [current, setCurrent] = useState<OrganizationSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('CONFIGURE_SYSTEM')) {
      alert('Unauthorized: Only administrators can alter global organization metadata and SMS templates.');
      return;
    }
    updateSettings(current);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Global Metadata & Telemetry
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <Settings className="w-8 h-8 text-emerald-500" />
            NGO Metadata & SMS Setup
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToSeed}
            className="px-5 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs transition flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Factory Seed Data</span>
          </button>

          <button
            onClick={handleSave}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-xl shadow-emerald-500/25 hover:opacity-95 transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Global Configuration</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm flex items-center gap-3 shadow-lg">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span>Global NGO organization credentials and automated SMS dispatch templates saved!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* NGO Organizational Metadata */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 space-y-5">
          <h3 className="text-lg font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Organizational Identity & Currency Vault
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Organization Official Name</label>
            <input
              type="text"
              value={current.orgName}
              onChange={(e) => setCurrent({ ...current, orgName: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold text-sm text-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">MRA Registration License</label>
            <input
              type="text"
              value={current.mraRegistrationNo}
              onChange={(e) => setCurrent({ ...current, mraRegistrationNo: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-mono text-xs font-bold text-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={current.currencySymbol}
                onChange={(e) => setCurrent({ ...current, currencySymbol: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-mono text-center font-black text-lg text-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Fiscal Year Start</label>
              <input
                type="text"
                value={current.fiscalYearStart}
                onChange={(e) => setCurrent({ ...current, fiscalYearStart: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">System Tagline</label>
            <textarea
              rows={2}
              value={current.tagLine}
              onChange={(e) => setCurrent({ ...current, tagLine: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-medium"
            />
          </div>
        </div>

        {/* SMS Gateway & Templates */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-7 border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <span>Automated SMS Gateway Setup</span>
            </h3>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Gateway Active:</span>
              <input
                type="checkbox"
                checked={current.smsGatewayEnabled}
                onChange={(e) => setCurrent({ ...current, smsGatewayEnabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Dynamic tags available for templates: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400">&#123;MemberName&#125;, &#123;Amount&#125;, &#123;AccountNo&#125;, &#123;NewBalance&#125;</span>
          </p>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {current.smsTemplates.map((tmpl, idx) => (
              <div key={tmpl.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-emerald-500">{tmpl.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{tmpl.code}</span>
                </div>
                <textarea
                  rows={2}
                  value={tmpl.templateText}
                  onChange={(e) => {
                    const copy = [...current.smsTemplates];
                    copy[idx] = { ...copy[idx], templateText: e.target.value };
                    setCurrent({ ...current, smsTemplates: copy });
                  }}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-mono font-medium text-slate-700 dark:text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
