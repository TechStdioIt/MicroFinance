'use client';
import { toast } from '../utils/toast';

import React, { useState, useEffect, useMemo } from 'react';
import { fetchApi } from '../config/api';
import { useMicrofinance } from '../context/MicrofinanceContext';
import { DataTable, Column } from '../components/ui/DataTable';
import { Member } from '../types/microfinance';
import { Users, UserPlus, FileCheck, Eye, MapPin, Phone, Fingerprint } from 'lucide-react';
import Link from 'next/link';

export default function MembersPage() {
  const { branches, selectedBranchId } = useMicrofinance();
  const [members, setMembers] = useState<Member[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * pageSize;
        const response = await fetchApi(`/Members?skip=${skip}&take=${pageSize}&search=${searchQuery}`);
        if (response && response.items) {
          setMembers(response.items);
          setTotalCount(response.totalCount);
        } else {
          setMembers([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error('Failed to load members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [currentPage, searchQuery]);

  const columns: Column<Member>[] = [
    {
      header: 'Member Profile & Name',
      accessorKey: 'firstName',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.photoUrl || 'https://via.placeholder.com/150'}
            alt={item.firstName}
            className="w-10 h-10 rounded-full border-2 border-emerald-500/40 object-cover shadow-xs shrink-0"
          />
          <div>
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 hover:text-emerald-600 transition">
              {item.firstName} {item.lastName}
            </p>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {item.memberNo}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'National ID (NID)',
      accessorKey: 'nidNumber',
      cell: (item) => (
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {item.nidNumber}
        </span>
      ),
    },
    {
      header: 'Branch & Location',
      accessorKey: 'branchId',
      cell: (item) => {
        const br = branches.find((b) => b.id === item.branchId);
        return (
          <div className="text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {br ? br.name.split('(')[0] : item.branchId}
            </p>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">{item.address}</p>
          </div>
        );
      },
    },
    {
      header: 'Mobile Contact',
      accessorKey: 'phone',
      cell: (item) => (
        <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
          <Phone className="w-3.5 h-3.5 text-emerald-500" />
          {item.phone}
        </span>
      ),
    },
    {
      header: 'Biometric KYC',
      accessorKey: 'fingerprintEnrolled',
      cell: (item) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          item.fingerprintEnrolled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
        }`}>
          <Fingerprint className="w-3.5 h-3.5" />
          {item.fingerprintEnrolled ? 'Enrolled & Verified' : 'Pending Enrollment'}
        </span>
      ),
    },
    {
      header: 'Nominee Reference',
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.nominee.name}</p>
          <span className="text-[10px] text-slate-400 font-medium">({item.nominee.relationship} - {item.nominee.sharePercentage}%)</span>
        </div>
      ),
    },
    {
      header: '360Â° Passbook Action',
      sortable: false,
      cell: (item) => (
        <Link
          href={`/members/${item.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Passbook</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            Customer KYC & Biometric Vault
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-500" />
            Member Directory & Passbooks
          </h1>
        </div>

        <Link
          href="/members/new"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/25 hover:opacity-95 transition flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Enroll New Member (KYC Wizard)</span>
        </Link>
      </div>

      {/* Member Data Table */}
      <DataTable
        data={members}
        columns={columns}
        serverSide={true}
        totalCount={totalCount}
        serverPage={currentPage}
        onPageChange={(p) => setCurrentPage(p)}
        onSearchChange={(s) => {
          setSearchQuery(s);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search members by Name, NID Number, Phone or Member No..."
        exportTitle="Export Member KYC Directory (CSV)"
        onExport={() => toast.info('Simulating member directory CSV export...')}
      />
    </div>
  );
}

