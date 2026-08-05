'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import {
  Building,
  Search,
  Bell,
  Shield,
  Moon,
  Sun,
  UserCheck,
  Zap,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    currentUser,
    users,
    switchUser,
    settings,
    members,
    savingsAccounts,
  } = useMicrofinance();

  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; type: string; href: string }[]>([]);
  const [showPersonaModal, setShowPersonaModal] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const matches: { id: string; name: string; type: string; href: string }[] = [];

    // Search members by name, NID, phone, or memberNo
    members.forEach((m) => {
      if (
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.nidNumber.includes(q) ||
        m.phone.includes(q) ||
        m.memberNo.toLowerCase().includes(q)
      ) {
        matches.push({
          id: m.id,
          name: `${m.firstName} ${m.lastName} (${m.memberNo} | NID: ${m.nidNumber})`,
          type: 'Member',
          href: `/members/${m.id}`,
        });
      }
    });

    // Search accounts
    savingsAccounts.forEach((acc) => {
      if (acc.accountNo.toLowerCase().includes(q)) {
        matches.push({
          id: acc.id,
          name: `Savings A/C: ${acc.accountNo} (Bal: ৳${acc.balance})`,
          type: 'Account',
          href: `/members/${acc.memberId}`,
        });
      }
    });

    setSearchResults(matches.slice(0, 6));
  };

  if (pathname === '/') {
    return <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-slate-950 text-slate-100`}>{children}</div>;
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100/70 text-slate-800'}`}>
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-20 shadow-xs">
          {/* Branch Filter & Quick Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Operating Branch:</span>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden cursor-pointer pr-2"
              >
                <option value="ALL">All Branches (Global Network)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Status: <span className="font-bold text-emerald-600 dark:text-emerald-400">Live (Zero-Dev Mode Active)</span>
            </div>
          </div>

          {/* Global Search Bar & Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Search */}
            <div className="relative w-72 lg:w-96">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Instant Lookup by Member Name, NID or A/C..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              {/* Dropdown Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-11 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Quick Matches ({searchResults.length})
                  </div>
                  {searchResults.map((res) => (
                    <Link
                      key={res.id}
                      href={res.href}
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 transition border-b last:border-0 border-slate-100 dark:border-slate-800/50"
                    >
                      <div className="overflow-hidden">
                        <p className="font-semibold truncate">{res.name}</p>
                        <span className="text-[10px] text-emerald-600 font-medium">{res.type}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              title="Toggle Executive Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Active User / Switch Role Button */}
            <button
              onClick={() => setShowPersonaModal(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition text-xs font-semibold"
            >
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Persona: <b>{currentUser.roleId.replace('ROLE-', '')}</b></span>
            </button>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto pb-16">
            {children}
          </div>
        </main>
      </div>

      {/* Role Switcher Persona Modal */}
      {showPersonaModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-emerald-500" />
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Switch Active User Persona</h3>
              </div>
              <button
                onClick={() => setShowPersonaModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-2"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 my-4">
              Test Role-Based Access Control (RBAC) instantly by switching between active NGO staff members. Each role enforces different permission constraints across operations and dynamic settings.
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowPersonaModal(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatarUrl} alt="" className="w-11 h-11 rounded-full border-2 border-emerald-500/40 object-cover" />
                      <div>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          {u.fullName}
                          {isSelected && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">Active</span>}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{u.roleId} • {u.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
