'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'emerald' | 'teal' | 'amber' | 'blue' | 'purple';
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, colorScheme = 'emerald' }: StatCardProps) {
  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-600 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    teal: 'from-teal-500 to-cyan-600 border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
    amber: 'from-amber-500 to-orange-600 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    blue: 'from-blue-500 to-indigo-600 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    purple: 'from-purple-500 to-pink-600 border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Top right decorative background glow */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-slate-200/50 to-transparent dark:from-slate-800/30 pointer-events-none"></div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-2xl border ${colorClasses[colorScheme].split(' ')[1]} ${colorClasses[colorScheme].split(' ')[2]} shrink-0 shadow-xs`}>
          <Icon className={`w-6 h-6 ${colorClasses[colorScheme].split(' ')[3]}`} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
              trend.isPositive
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
            }`}
          >
            {trend.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend.value}
          </span>
          <span className="text-[11px] font-medium text-slate-400">vs prior month target</span>
        </div>
      )}
    </div>
  );
}
