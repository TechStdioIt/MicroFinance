'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../config/api';
import Swal from 'sweetalert2';
import { Mail, Save, RefreshCw } from 'lucide-react';

export default function EmailConfigPage() {
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: '',
    port: 587,
    senderEmail: '',
    senderName: '',
    username: '',
    password: '',
    enableSsl: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmailConfig();
  }, []);

  const fetchEmailConfig = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/EmailConfiguration');
      if (data) {
        setEmailConfig(data);
      }
    } catch (err) {
      console.error('Failed to load email config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi('/EmailConfiguration', {
        method: 'POST',
        body: JSON.stringify(emailConfig)
      });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Email Configuration saved successfully.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to save email configuration.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = () => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Test email feature not implemented in backend yet!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-500" />
            Email SMTP Configuration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure SMTP settings for system-wide email notifications</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleTestEmail}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm border border-slate-200 dark:border-slate-700"
          >
            Send Test Email
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-500/30"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs">1</span>
          SMTP Server Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SMTP Server Address</label>
            <input
              type="text"
              value={emailConfig.smtpServer || ''}
              onChange={(e) => setEmailConfig({...emailConfig, smtpServer: e.target.value})}
              placeholder="smtp.example.com"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SMTP Port</label>
            <input
              type="number"
              value={emailConfig.port || 0}
              onChange={(e) => setEmailConfig({...emailConfig, port: parseInt(e.target.value) || 0})}
              placeholder="587"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sender Name</label>
            <input
              type="text"
              value={emailConfig.senderName || ''}
              onChange={(e) => setEmailConfig({...emailConfig, senderName: e.target.value})}
              placeholder="e.g. MicroFinance Admin"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sender Email Address</label>
            <input
              type="email"
              value={emailConfig.senderEmail || ''}
              onChange={(e) => setEmailConfig({...emailConfig, senderEmail: e.target.value})}
              placeholder="no-reply@example.com"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-10 mb-6 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs">2</span>
          Authentication Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SMTP Username</label>
            <input
              type="text"
              value={emailConfig.username || ''}
              onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SMTP Password</label>
            <input
              type="password"
              value={emailConfig.password || ''}
              onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <input
            type="checkbox"
            id="enableSsl"
            checked={emailConfig.enableSsl}
            onChange={(e) => setEmailConfig({...emailConfig, enableSsl: e.target.checked})}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <div>
            <label htmlFor="enableSsl" className="text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              Enable SSL/TLS Encryption
            </label>
            <p className="text-xs text-slate-500">Required for most modern email providers (e.g. Gmail, SendGrid)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

