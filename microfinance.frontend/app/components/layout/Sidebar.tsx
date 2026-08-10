'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import {
  LayoutDashboard,
  Users,
  Wallet,
  PiggyBank,
  Coins,
  CreditCard,
  Landmark,
  Sliders,
  Building2,
  ShieldCheck,
  Settings,
  FileSpreadsheet,
  History,
  MessageSquare,
  LogOut,
  Sparkles,
  Mail,
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { settings, currentUser } = useMicrofinance();

  const navGroups: NavGroup[] = [
    {
      title: 'OPERATIONAL MODULES',
      items: [
        { name: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Member & KYC Register', href: '/members', icon: Users },
        { name: 'Teller & Cash Window', href: '/teller', icon: Wallet, badge: 'Live Biometrics' },
        { name: 'Savings Accounts', href: '/savings', icon: PiggyBank },
        { name: 'DPS Scheme Management', href: '/dps', icon: Coins },
        { name: 'Loan Underwriting & EMI', href: '/loans', icon: CreditCard },
        { name: 'Fixed Deposits (MTDR)', href: '/mtdr', icon: Landmark },
      ],
    },
    {
      title: 'ZERO-DEV DYNAMIC CONFIG',
      items: [
        { name: 'Financial Products Studio', href: '/config/products', icon: Sliders, badge: 'Dynamic' },
        { name: 'Branch Network Admin', href: '/config/branches', icon: Building2 },
        { name: 'System Users Directory', href: '/config/users', icon: Users },
          { name: 'Roles & Permissions (RBAC)', href: '/config/rbac', icon: ShieldCheck },
        { name: 'NGO Metadata & SMS Setup', href: '/config/settings', icon: Settings },
        { name: 'Email SMTP Config', href: '/config/email', icon: Mail },
      ],
    },
    {
      title: 'ANALYTICS & REGULATORY AUDITOR',
      items: [
        { name: 'Financial & MRA Reports', href: '/reports', icon: FileSpreadsheet },
        { name: 'Immutable Security Logs', href: '/audit-logs', icon: History },
        { name: 'Outgoing SMS Telemetry', href: '/sms-logs', icon: MessageSquare },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-slate-800 shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl tracking-tighter">
          TS
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight leading-tight text-white flex items-center gap-1.5">
            {settings.orgName.split(' ')[0] || 'TechStdio'}
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          </h1>
          <p className="text-[11px] text-emerald-400 font-medium tracking-wide">NGO Microfinance OS</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-2 mb-3">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && item.href !== '/');
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Persona Switcher Quick Card */}
      <div className="p-4 m-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
            <p className="text-[11px] text-emerald-400 font-medium truncate">{currentUser.username}</p>
          </div>
        </div>
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-extrabold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Exit Portal</span>
        </Link>
      </div>
    </aside>
  );
}


