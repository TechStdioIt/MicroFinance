'use client';

import React, { useState, useMemo } from 'react';
import { Select2Input, SelectOption, SearchableSelect } from '../ui/SearchableSelect';
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
    logout,
    settings,
    members,
    savingsAccounts,
  } = useMicrofinance();

  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; type: string; href: string }[]>([]);
  

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
          name: `Savings A/C: ${acc.accountNo} (Bal: à§³${acc.balance})`,
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
              <SearchableSelect
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
              </SearchableSelect>
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

            {/* Active User / Logout Button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span><b>{currentUser.roleId.replace('ROLE-', '')}</b></span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto pb-16">
            {children}
          </div>
        </main>
      </div>

          </div>
  );
}

