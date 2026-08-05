'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, SlidersHorizontal, Download } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onExport?: () => void;
  exportTitle?: string;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Filter records by keyword...',
  onExport,
  exportTitle = 'Export CSV / Excel',
  emptyMessage = 'No matching records found in database.',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pageSize = 10;

  const handleSort = (field?: keyof T, sortable?: boolean) => {
    if (!field || sortable === false) return;
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredData = useMemo(() => {
    if (!search || search.trim() === '') return data;
    const q = search.toLowerCase();
    return data.filter((item) => {
      return Object.values(item).some((val) => {
        if (val == null) return false;
        if (typeof val === 'object') {
          return JSON.stringify(val).toLowerCase().includes(q);
        }
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [data, search]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      const res = valA < valB ? -1 : 1;
      return sortOrder === 'asc' ? res : -res;
    });
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-lg">
      {/* Table Action Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
        {/* Quick Text Filter */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Export and Status info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing <b className="text-emerald-600 dark:text-emerald-400">{sortedData.length}</b> result(s)
          </span>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              <span>{exportTitle}</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
              {columns.map((col, idx) => {
                const isSorted = sortField === col.accessorKey;
                return (
                  <th
                    key={idx}
                    onClick={() => handleSort(col.accessorKey, col.sortable !== false)}
                    className={`p-3.5 select-none ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{col.header}</span>
                      {col.sortable !== false && col.accessorKey && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-500 font-black" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-500 font-black" />
                          ) : (
                            <SlidersHorizontal className="w-3 h-3 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm italic font-semibold">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition duration-150">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-3.5 text-slate-800 dark:text-slate-200">
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '—') : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            Page <b>{currentPage}</b> of <b>{totalPages}</b>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
