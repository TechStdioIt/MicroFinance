'use client';

import React, { useState, useEffect } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { OrganizationSettings, SmsTemplate } from '../../types/microfinance';
import { fetchApi } from '../api';
import {
  Settings,
  Building,
  Save,
  MessageSquare,
  Server,
  ToggleLeft,
  ToggleRight,
  Database,
  Fingerprint,
  Mail
} from 'lucide-react';

export default function NgoSettingsPage() {
  const { settings, updateSettings, currentUser, hasPermission } = useMicrofinance();

  const [formData, setFormData] = useState<OrganizationSettings>(settings);
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SECURITY' | 'SMS_TEMPLATES' | 'ADVANCED'>('GENERAL');
  const isAdmin = hasPermission('CONFIGURE_SYSTEM') || currentUser.roleId === 'ROLE-ADMIN' || currentUser.roleId === 'Admin';

  const handleChange = (field: keyof OrganizationSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTemplateChange = (templateId: string, field: keyof SmsTemplate, value: any) => {
    setFormData((prev) => ({
      ...prev,
      smsTemplates: prev.smsTemplates.map(t => 
        t.id === templateId ? { ...t, [field]: value } : t
      )
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only administrators can modify global settings.');
      return;
    }
    
    updateSettings(formData);
    alert('Organization Settings have been successfully updated.');
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 rounded-full bg-red-100 text-red-500">
          <Settings className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Access Restricted</h2>
        <p className="text-sm text-slate-500 max-w-md">You do not have the required permissions (CONFIGURE_SYSTEM) to view or modify global NGO settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">System Administration</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <Settings className="w-8 h-8 text-emerald-500" />
            Organization & NGO Metadata
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('GENERAL')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              activeTab === 'GENERAL' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            General Preferences
          </button>
          <button
            onClick={() => setActiveTab('SMS_TEMPLATES')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
              activeTab === 'SMS_TEMPLATES' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            SMS Templates
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'GENERAL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Building className="w-5 h-5 text-emerald-500" /> NGO Identity
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={formData.orgName}
                  onChange={(e) => handleChange('orgName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData.tagLine}
                  onChange={(e) => handleChange('tagLine', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Logo URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fiscal Year Start</label>
                  <input
                    type="date"
                    value={formData.fiscalYearStart}
                    onChange={(e) => handleChange('fiscalYearStart', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fiscal Year End</label>
                  <input
                    type="date"
                    value={formData.fiscalYearEnd}
                    onChange={(e) => handleChange('fiscalYearEnd', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Server className="w-5 h-5 text-emerald-500" /> API & Infrastructure
                </h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    required
                    value={formData.currencySymbol}
                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold w-32 text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">SMS Gateway API Key</label>
                  <input
                    type="password"
                    value={formData.smsGatewayApiKey}
                    onChange={(e) => handleChange('smsGatewayApiKey', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono tracking-widest"
                  />
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Database className="w-5 h-5 text-emerald-500" /> Security & Policies
                </h3>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div>
                    <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-slate-400"/> Enable SMS Gateway</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Globally dispatch transaction SMS alerts</p>
                  </div>
                  <button type="button" onClick={() => handleChange('smsGatewayEnabled', !formData.smsGatewayEnabled)}>
                    {formData.smsGatewayEnabled ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div>
                    <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><Fingerprint className="w-4 h-4 text-slate-400"/> Strict Biometric Enforcement</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Mandate fingerprints for all withdrawals</p>
                  </div>
                  <button type="button" onClick={() => handleChange('strictFingerprintEnforcement', !formData.strictFingerprintEnforcement)}>
                    {formData.strictFingerprintEnforcement ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div>
                    <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><Database className="w-4 h-4 text-slate-400"/> Automated Cloud Backup</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Sync database snapshots daily at midnight</p>
                  </div>
                  <button type="button" onClick={() => handleChange('automatedDailyBackup', !formData.automatedDailyBackup)}>
                    {formData.automatedDailyBackup ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SMS_TEMPLATES' && (
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Live SMS Dispatch Templates</h3>
                <p className="text-xs text-slate-500 mt-1">Available variables: {'{MemberName}'}, {'{Amount}'}, {'{AccountNo}'}, {'{NewBalance}'}, {'{DueDate}'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.smsTemplates.map(template => (
                <div key={template.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-slate-800 dark:text-slate-200">{template.name}</h4>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{template.code}</span>
                    </div>
                    <button type="button" onClick={() => handleTemplateChange(template.id, 'active', !template.active)}>
                      {template.active ? <ToggleRight className="w-7 h-7 text-emerald-500" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={template.templateText}
                    onChange={(e) => handleTemplateChange(template.id, 'templateText', e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono resize-none focus:border-emerald-500"
                    disabled={!template.active}
                  />
                  <div className="text-[10px] text-right text-slate-400 font-semibold">Length: {template.templateText.length} chars ({(Math.ceil(template.templateText.length / 160))} SMS)</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Organization Settings
          </button>
        </div>
      </form>
    </div>
  );
}



