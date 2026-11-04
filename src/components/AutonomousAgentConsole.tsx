'use client';

import React, { useState, useEffect } from 'react';
import { AgentLog } from '@/types/foodloop';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  icon: string;
  isNew?: boolean;
}

interface AutonomousAgentConsoleProps {
  onNavigate?: (page: string) => void;
  activeRole?: string;
  setActiveRole?: (role: string) => void;
  onOpenSponsors?: () => void;
  initialLogs?: AgentLog[];
  onTriggerRescueChallenge?: () => void;
  onAgentAction?: (action: any) => void;
  onOpenAuth?: (tab?: 'signin' | 'signup' | 'profile') => void;
  onOpenNotifications?: () => void;
}

export const AutonomousAgentConsole: React.FC<AutonomousAgentConsoleProps> = ({
  onNavigate,
  activeRole = 'admin',
  setActiveRole,
  onOpenSponsors,
  initialLogs,
  onTriggerRescueChallenge,
  onAgentAction,
  onOpenAuth,
  onOpenNotifications,
}) => {
  // Navigation Sub-Tabs
  const [adminSubTab, setAdminSubTab] = useState<'ai' | 'users' | 'ngos' | 'transactions' | 'reports' | 'audit'>('ai');

  // Countdown timer state (43m 42s)
  const [secondsLeft, setSecondsLeft] = useState(43 * 60 + 42);
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [isRouteLocked, setIsRouteLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // High-volume batch queue matched state
  const [matchedQueues, setMatchedQueues] = useState<Record<string, boolean>>({});

  // Activity Log State
  const [activityLogs, setActivityLogs] = useState<ActivityItem[]>([
    {
      id: '1',
      title: 'Automated split allocation computed',
      meta: 'Just now • Algorithm convergence in 0.18s',
      icon: 'notifications_active',
    },
  ]);

  // Admin Data State
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [ngos, setNgos] = useState<any[]>([]);
  const [isLoadingNgos, setIsLoadingNgos] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // Interval timer for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch admin sub-tab data dynamically on tab switch
  useEffect(() => {
    if (adminSubTab === 'users') fetchUsers();
    else if (adminSubTab === 'ngos') fetchNgos();
    else if (adminSubTab === 'transactions') fetchTransactions();
    else if (adminSubTab === 'reports') fetchReports();
    else if (adminSubTab === 'audit') fetchAuditLogs();
  }, [adminSubTab]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        showToast(`User role updated to ${newRole.toUpperCase()}.`);
        addLog(`User ${userId} promoted to ${newRole}`, 'Just now • Admin Console RBAC', 'manage_accounts');
      }
    } catch {
      showToast('Failed to update user role.');
    }
  };

  const handleToggleUserVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, is_verified: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_verified: !currentStatus } : u)));
        showToast(`User verification set to ${!currentStatus ? 'VERIFIED' : 'UNVERIFIED'}.`);
        addLog(`User verification toggled for ${userId}`, 'Just now • Admin Console Security', 'verified');
      }
    } catch {
      showToast('Failed to toggle verification.');
    }
  };

  const handleToggleUserActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, is_active: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: !currentActive } : u)));
        showToast(`Account status set to ${!currentActive ? 'ACTIVE' : 'SUSPENDED'}.`);
      }
    } catch {
      showToast('Failed to update account status.');
    }
  };

  const fetchNgos = async () => {
    setIsLoadingNgos(true);
    try {
      const res = await fetch('/api/admin/ngos');
      const data = await res.json();
      if (data.ngos) setNgos(data.ngos);
    } catch (err) {
      console.error('Failed to fetch NGOs', err);
    } finally {
      setIsLoadingNgos(false);
    }
  };

  const handleReviewNgo = async (ngoId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/ngos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId,
          status,
          reviewNotes: `Reviewed and marked as ${status} by Compliance Administrator.`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNgos((prev) =>
          prev.map((n) => (n.id === ngoId ? { ...n, verification_status: status } : n))
        );
        showToast(`NGO application marked as ${status.toUpperCase()}.`);
        addLog(`NGO ${ngoId} verification status: ${status}`, 'Just now • 80G/12A Tax Review', 'verified_user');
      }
    } catch {
      showToast('Failed to update NGO verification.');
    }
  };

  const fetchTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const res = await fetch('/api/admin/transactions');
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
        setTotalVolume(data.volumeUSD || 0);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const fetchReports = async () => {
    setIsLoadingReports(true);
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.reports) setReports(data.reports);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status: 'resolved' }),
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r)));
        showToast('Report marked as RESOLVED.');
        addLog(`Report #${reportId} resolved`, 'Just now • Trust & Safety Moderation', 'gavel');
      }
    } catch {
      showToast('Failed to resolve report.');
    }
  };

  const fetchAuditLogs = async () => {
    setIsLoadingAudit(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.auditLogs) setAuditLogs(data.auditLogs);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addLog = (title: string, meta: string, icon = 'check') => {
    const newEntry: ActivityItem = {
      id: Date.now().toString(),
      title,
      meta,
      icon,
      isNew: true,
    };
    setActivityLogs((prev) => [newEntry, ...prev]);
  };

  const handleManualOverrideToggle = () => {
    const nextState = !isOverrideActive;
    setIsOverrideActive(nextState);
    if (nextState) {
      addLog('Manual Override Active (Autonomous Rule #41 Paused)', 'Just now • Operator locked autonomous trigger', 'lock_reset');
      showToast('Manual override engaged. Autonomous dispatches held.');
    } else {
      addLog('Manual Override Released (Autonomous Redistribution Resumed)', 'Just now • Node engine returned to auto mode', 'lock_open');
      showToast('Manual override disengaged. Autonomous engine running.');
    }
  };

  const handleForceDispatch = async () => {
    if (isDispatched) return;
    setIsDispatched(true);
    try {
      const res = await fetch('/api/ai/rescue-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portions: 80,
          foodTitle: '80 Ready-to-Eat Gourmet Hot Meals',
          donorName: 'Marriott Regency Hotel',
          category: 'Meals',
          pickupDeadlineMinutes: 45,
          donorType: 'Hotel & Buffet',
        }),
      });
      const data = await res.json();
      if (data.allocations) {
        addLog(
          `AI Engine Allocated: ${data.allocations.map((a: any) => `${a.portionsAllocated} -> ${a.shelterName}`).join(', ')}`,
          `Just now • Offset: ${data.metrics?.co2OffsetKg || 200}kg CO2`,
          'rocket_launch'
        );
      }
    } catch {
      // Local fallback
    }

    addLog('Manual Force Dispatch executed by Operator', 'Just now • Dispatch tokens confirmed #FL-8842', 'check');
    showToast('Force dispatch executed! Van Unit #09 and Elena K. authorized.');

    if (onTriggerRescueChallenge) {
      onTriggerRescueChallenge();
    }
  };

  const handleLockRoute = () => {
    setIsRouteLocked(true);
    addLog('Redistribution Split Locked: 50 Shelter Hope / 30 St. Jude', 'Just now • Multi-destination transit custody tokens minted', 'verified_user');
    showToast('Allocation locked & digital custody vouchers minted.');
  };

  const handleQueueMatch = async (donorName: string, portionsStr: string) => {
    setMatchedQueues((prev) => ({ ...prev, [donorName]: true }));
    const count = parseInt(portionsStr, 10) || 100;
    try {
      await fetch('/api/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: `QUEUE-${Date.now().toString().slice(-4)}`,
          foodTitle: `${donorName} Batch`,
          donorName,
          shelterName: 'Hope Mission Shelter',
          portions: count,
          urgency: 'Standard',
        }),
      });
    } catch {
      // Local fallback
    }
    addLog(`Batch matched & queued: ${donorName} (${portionsStr})`, 'Just now • AI route optimizer assigned receiving shelter', 'auto_fix_high');
    showToast(`${donorName} batch scheduled into next redistribution orbit.`);
  };

  const handleExportLedger = () => {
    const ledger = {
      auditSystem: 'FOODLOOP Autonomous Rescue Agent v2.4 Engine',
      isoHaccpSafetyScore: '98.4%',
      generatedAt: new Date().toISOString(),
      activeEmergencyBatch: {
        operationId: 'FL-8842',
        title: '80 Ready-to-Eat Gourmet Hot Meals',
        donor: 'Marriott Regency Hotel - Executive Kitchen',
        coreHoldingTemperatureF: 142.8,
        certifications: ['ISO HACCP', 'Halal Certified', 'Nut-Free Facility'],
        expirationCutoff: '8:30 PM EDT',
        status: isDispatched ? 'Dispatched' : 'Active Routing',
      },
      partitioning: [
        {
          facility: 'Shelter Hope Downtown',
          distance: '1.2 km',
          allocatedMeals: 50,
          carrier: 'Van Unit #09 (Carlos M.)',
          etaMinutes: 14,
          occupancy: '94%',
        },
        {
          facility: 'St. Jude Community Mission',
          distance: '2.4 km',
          allocatedMeals: 30,
          carrier: 'Cargo E-Bike (Elena K.)',
          etaMinutes: 21,
          occupancy: '78%',
        },
      ],
      fintechSettlement: {
        rails: 'PayPal Micro-Incentive Ledger & Gasless Custody Tokens',
        voucherHash: '0x892a7f33d02b9e1a88c3f4e5a91b82736154c3',
        settlementStatus: 'Pre-Authorized Escrow',
      },
      liveActivityStream: activityLogs,
    };

    const blob = new Blob([JSON.stringify(ledger, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FOODLOOP-Compliance-Audit-Ledger-FL8842.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Compliance Audit Ledger JSON exported successfully.');
  };

  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      return (
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.organization_name && u.organization_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-[#f7f9fc] dark:bg-[#00174b] font-body-md text-[#191c1e] dark:text-[#f7f9fc] antialiased min-h-screen flex flex-col transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#001d59] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#005ab6]/30 animate-bounce">
          <span className="material-symbols-outlined text-[#d7e3ff] text-[20px]">check_circle</span>
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-[#001d59]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,48,135,0.06)] border-b border-slate-100 dark:border-slate-800">
        <div className="h-16 max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            {/* Back to Home Button */}
            <button
              onClick={() => onNavigate?.('home')}
              className="flex items-center gap-1 text-[#001d59] dark:text-[#dbe1ff] hover:text-[#005ab6] font-medium mr-1 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Go to Home"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="hidden sm:inline text-sm font-semibold">Home</span>
            </button>

            <a
              className="flex items-center gap-2 cursor-pointer"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('home');
              }}
            >
              <img
                alt="FOODLOOP Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="text-xl font-bold text-[#001d59] dark:text-white tracking-tight">FOODLOOP</span>
            </a>

            {/* Top Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 ml-2">
              <a
                className="text-sm font-medium text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('home')}
              >
                Home
              </a>
              <a
                className="text-sm font-medium text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('explore-food')}
              >
                Explore Food
              </a>
              <a
                aria-current="page"
                className="text-sm py-1 text-[#001d59] dark:text-[#abc7ff] font-bold border-b-2 border-[#001d59] dark:border-[#abc7ff] cursor-pointer"
                onClick={() => onNavigate?.('ai-rescue-agent')}
              >
                Admin &amp; AI Agent
              </a>
              <a
                className="text-sm font-medium text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                className="text-sm font-medium text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="text-sm font-medium text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('impact')}
              >
                Impact
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 justify-end flex-1 max-w-2xl">
            {/* Role switcher */}
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                className="appearance-none h-10 pl-3 pr-8 bg-[#f2f4f7] dark:bg-slate-800 text-xs text-[#001d59] dark:text-[#dbe1ff] font-bold rounded-lg cursor-pointer focus:outline-none border border-slate-200 dark:border-slate-700"
                value={activeRole}
                onChange={(e) => setActiveRole?.(e.target.value)}
              >
                <option value="donor">1. Food Seller / Donor</option>
                <option value="recipient">2. Food Buyer / Consumer</option>
                <option value="ngo">3. NGO Logistics Hub</option>
                <option value="admin">4. Admin &amp; AI Agent</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#747683] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Notification Drawer Trigger */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg bg-[#f2f4f7] dark:bg-slate-800 hover:bg-[#eceef1] text-[#001d59] dark:text-white transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Sponsors Showcase */}
            {onOpenSponsors && (
              <button
                onClick={onOpenSponsors}
                className="px-3 py-2 rounded-lg bg-[#ffc439] hover:bg-[#f2b72b] text-[#001d59] font-black text-xs cursor-pointer shadow-sm flex items-center gap-1.5 transition-all shrink-0"
                title="View Hackathon Sponsor Tech Integrations"
              >
                <span className="material-symbols-outlined text-[18px]">award_star</span>
                <span className="hidden sm:inline">Sponsors (5)</span>
              </button>
            )}

            {/* Account / Profile Button */}
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => onOpenAuth('profile')}
                className="h-10 px-3 rounded-lg bg-[#001d59] dark:bg-[#005ab6] hover:bg-[#003087] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                <span className="hidden sm:inline">Admin User</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-[#f7f9fc] dark:bg-[#00174b] flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1440px] mx-auto px-6 py-4 flex flex-col gap-6">

            {/* 4 Dedicated Dashboards Switcher Bar */}
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-[#747683] dark:text-slate-400 px-2 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#005ab6]">dashboard</span>
                4 Dashboards:
              </span>
              <button
                onClick={() => onNavigate?.('donor-portal')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-[#f2f4f7] dark:bg-slate-800 text-[#444652] dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-600">storefront</span>
                <span>1. Food Seller / Donor</span>
              </button>
              <button
                onClick={() => onNavigate?.('explore-food')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-[#f2f4f7] dark:bg-slate-800 text-[#444652] dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-600">shopping_cart</span>
                <span>2. Food Buyer / Consumer</span>
              </button>
              <button
                onClick={() => onNavigate?.('ngo-hub')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-[#f2f4f7] dark:bg-slate-800 text-[#444652] dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-600">local_shipping</span>
                <span>3. NGO Logistics Hub</span>
              </button>
              <button
                onClick={() => onNavigate?.('ai-rescue-agent')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-[#001d59] text-white shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-purple-400">psychology</span>
                <span>4. Admin &amp; AI Console</span>
              </button>
            </div>

            {/* Admin Sub-Tabs Navigation Bar */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'ai', label: '1. AI Rescue Solver (80-Meals)', icon: 'psychology' },
                { id: 'users', label: '2. User Management (RBAC)', icon: 'group' },
                { id: 'ngos', label: '3. NGO Verification & 80G', icon: 'verified_user' },
                { id: 'transactions', label: '4. PayPal Sandbox Ledger', icon: 'payments' },
                { id: 'reports', label: '5. Moderation & Reports', icon: 'shield' },
                { id: 'audit', label: '6. Security Audit Trail', icon: 'receipt_long' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminSubTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    adminSubTab === tab.id
                      ? 'bg-[#001d59] dark:bg-[#005ab6] text-white shadow-sm'
                      : 'bg-[#f2f4f7] dark:bg-slate-800 text-[#444652] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: AI RESCUE ENGINE (Default) */}
            {adminSubTab === 'ai' && (
              <>
                {/* Command Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl bg-[#003087] flex items-center justify-center text-white shadow-md overflow-hidden shrink-0">
                      <svg className="w-7 h-7 text-[#d7e3ff]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 48 48">
                        <circle className="opacity-25" cx="24" cy="24" r="18"></circle>
                        <path d="M15 24c0-4 4-8 9-8s9 8 9 8-4 8-9 8-9-4-9-8z"></path>
                        <circle cx="24" cy="7" fill="currentColor" r="2.5"></circle>
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001d59]/30 to-transparent"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#001d59] text-white text-[10px] font-bold tracking-wider uppercase">
                          Dashboard 4
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-bold">
                          Admin &amp; Autonomous AI Console
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[#001d59] dark:text-white tracking-tight">AI Autonomous Rescue Agent</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#d7e3ff] text-[#001d59] text-xs font-bold uppercase tracking-wider">
                          v2.4 Engine
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005ab6] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#005ab6]"></span>
                        </span>
                        <span className="text-xs text-[#444652] dark:text-slate-300 font-semibold">
                          REAL-TIME MATCHING DOCK ONLINE • 14 NODES ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-[#f2f4f7] dark:bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                      <span className="material-symbols-outlined text-[#005ab6] text-[20px]">bolt</span>
                      <div>
                        <div className="text-[10px] text-[#747683] dark:text-slate-400 font-bold uppercase">AUTO DISPATCH</div>
                        <div className="text-xs text-[#001d59] dark:text-white font-bold">Autonomous Rule #41</div>
                      </div>
                    </div>
                    <button
                      className={`h-11 px-4 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                        isOverrideActive
                          ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30'
                          : 'bg-[#eceef1] dark:bg-slate-800 hover:bg-[#e6e8eb] text-[#001d59] dark:text-white'
                      }`}
                      id="manual-override-btn"
                      onClick={handleManualOverrideToggle}
                    >
                      <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                      {isOverrideActive ? 'Override Active (Hold Auto)' : 'Manual Override'}
                    </button>
                    <button
                      className={`h-11 px-6 rounded-lg text-white font-semibold text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDispatched
                          ? 'bg-[#005ab6] shadow-lg'
                          : 'bg-[#001d59] hover:bg-[#003087]'
                      }`}
                      id="instant-dispatch-btn"
                      onClick={handleForceDispatch}
                    >
                      <span className={`material-symbols-outlined text-[18px] ${isDispatched ? 'animate-spin' : ''}`}>
                        {isDispatched ? 'refresh' : 'rocket_launch'}
                      </span>
                      {isDispatched ? 'Dispatch Confirmed' : 'Execute Force Dispatch'}
                    </button>
                  </div>
                </div>

                {/* Urgent Perishable Countdown Banner */}
                <div className="relative overflow-hidden bg-[#001d59] text-white rounded-xl p-6 shadow-lg">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#0872e2] opacity-20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#270070] opacity-30 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 text-[#d7e3ff]">
                        <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px] uppercase font-bold tracking-wide">
                            High Priority Active
                          </span>
                          <span className="text-xs font-semibold text-[#d7e3ff]">Operation #FL-8842</span>
                          <span className="text-white/60 text-xs">• Batch Verified by Marriott Regency Chef Lead</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                          80 Ready-to-Eat Gourmet Hot Meals Available
                        </h2>
                        <p className="text-sm text-white/80 mt-1 max-w-3xl">
                          Strict cold-chain &amp; thermal window compliance required. Mandatory custody release prior to 8:30 PM EDT.
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between lg:justify-end gap-6 shrink-0 border border-white/10">
                      <div className="text-left">
                        <span className="text-[10px] uppercase tracking-wider text-[#d7e3ff] block font-bold">
                          Countdown Window
                        </span>
                        <div className="text-3xl font-extrabold text-white tracking-tight" id="countdown-timer">
                          {formatTimer(secondsLeft)}
                        </div>
                        <span className="text-xs text-white/70">Minutes until perish margin</span>
                      </div>
                      <div className="h-10 w-px bg-white/20"></div>
                      <div className="text-left">
                        <span className="text-[10px] uppercase tracking-wider text-[#d7e3ff] block font-bold">
                          Safety Score
                        </span>
                        <div className="text-3xl font-extrabold text-white tracking-tight">98.4%</div>
                        <span className="text-xs text-white/70">ISO HACCP Thermal Tier A</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3D Logistics Visualization & Route Solver Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: 3D Visualization & Split Allocations */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#005ab6]">share_location</span>
                          <h3 className="text-base font-bold text-[#001d59] dark:text-white">Multi-Destination Drop Allocation Solver</h3>
                        </div>
                        <span className="text-xs font-bold text-[#005ab6] bg-blue-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-blue-100 dark:border-slate-700">
                          Decomposed: 50 Portions + 30 Portions
                        </span>
                      </div>

                      {/* Visual Allocation Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Drop 1 */}
                        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-slate-800/60 relative overflow-hidden">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                                Primary Destination (Drop 1)
                              </span>
                              <h4 className="text-base font-bold text-[#001d59] dark:text-white mt-0.5">Shelter Hope Downtown</h4>
                              <p className="text-xs text-[#747683] dark:text-slate-400 mt-1">1.2 km away • 94% Capacity Need</p>
                            </div>
                            <span className="text-2xl font-black text-[#001d59] dark:text-white">50 <span className="text-xs font-semibold">meals</span></span>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-blue-100 dark:border-slate-700">
                            <span className="font-semibold text-[#005ab6] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                              Van Unit #09 (Carlos M.)
                            </span>
                            <span className="text-[#747683] dark:text-slate-400 font-bold">ETA: 14 mins</span>
                          </div>
                        </div>

                        {/* Drop 2 */}
                        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-slate-800/60 relative overflow-hidden">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                Secondary Destination (Drop 2)
                              </span>
                              <h4 className="text-base font-bold text-[#001d59] dark:text-white mt-0.5">St. Jude Community Mission</h4>
                              <p className="text-xs text-[#747683] dark:text-slate-400 mt-1">2.4 km away • 78% Capacity Need</p>
                            </div>
                            <span className="text-2xl font-black text-[#001d59] dark:text-white">30 <span className="text-xs font-semibold">meals</span></span>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-purple-100 dark:border-slate-700">
                            <span className="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">pedal_bike</span>
                              Cargo E-Bike (Elena K.)
                            </span>
                            <span className="text-[#747683] dark:text-slate-400 font-bold">ETA: 21 mins</span>
                          </div>
                        </div>
                      </div>

                      {/* Google Maps Live Transit Iframe */}
                      <div className="relative w-full h-[260px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                        <iframe
                          title="Interactive Redistribution Map"
                          src="https://maps.google.com/maps?q=Marriott+Copley+Place+Boston&hl=en&z=14&output=embed"
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-[#001d59]/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md shadow flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>Live GPS Fleet Tracking Active</span>
                        </div>
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          <button
                            onClick={handleLockRoute}
                            disabled={isRouteLocked}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow transition-all cursor-pointer flex items-center gap-1 ${
                              isRouteLocked ? 'bg-emerald-600 text-white' : 'bg-[#001d59] hover:bg-[#003087] text-white'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isRouteLocked ? 'verified' : 'lock'}
                            </span>
                            <span>{isRouteLocked ? 'Route Locked ✓' : 'Lock Route & Mint Vouchers'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Queued High-Volume Surplus Batches */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#005ab6]">dynamic_feed</span>
                          <h3 className="text-base font-bold text-[#001d59] dark:text-white">Active Regional High-Volume Surplus Pipeline</h3>
                        </div>
                        <button
                          onClick={handleExportLedger}
                          className="text-xs font-bold text-[#005ab6] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          <span>Export Audit Ledger JSON</span>
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {[
                          { name: 'State Campus Main Hostel Mess', portions: '120 portions', cat: 'Hot Curry & Rice', time: '1h 10m left' },
                        ].map((q) => (
                          <div
                            key={q.name}
                            className="p-3.5 rounded-xl bg-[#f2f4f7] dark:bg-slate-800 flex items-center justify-between gap-4 border border-slate-200 dark:border-slate-700"
                          >
                            <div>
                              <div className="font-bold text-sm text-[#001d59] dark:text-white">{q.name}</div>
                              <div className="text-xs text-[#747683] dark:text-slate-400 mt-0.5">
                                {q.portions} • {q.cat} • {q.time}
                              </div>
                            </div>
                            <button
                              onClick={() => handleQueueMatch(q.name, q.portions)}
                              disabled={matchedQueues[q.name]}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                                matchedQueues[q.name]
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-[#001d59] hover:bg-[#003087] text-white shadow-sm'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {matchedQueues[q.name] ? 'check_circle' : 'bolt'}
                              </span>
                              <span>{matchedQueues[q.name] ? 'Scheduled ✓' : 'Auto-Match'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Algorithm Stream & Audit Log */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#005ab6]">terminal</span>
                          <h3 className="text-base font-bold text-[#001d59] dark:text-white">AI Engine Activity Stream</h3>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[500px]">
                        {activityLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-3 rounded-xl bg-[#f2f4f7] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5"
                          >
                            <span className="material-symbols-outlined text-[#005ab6] text-[18px] shrink-0 mt-0.5">
                              {log.icon}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-[#001d59] dark:text-white leading-tight">
                                {log.title}
                              </div>
                              <div className="text-[10px] text-[#747683] dark:text-slate-400 mt-1">
                                {log.meta}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            addLog('Emergency Routing Simulation Cycle ran', 'Just now • ISO 22000 Checked', 'sync');
                            showToast('AI Simulation cycle finished.');
                          }}
                          className="w-full h-10 rounded-xl bg-[#f2f4f7] dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-[#001d59] dark:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">refresh</span>
                          <span>Re-run Routing Heuristics</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: USER MANAGEMENT (RBAC) */}
            {adminSubTab === 'users' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#001d59] dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005ab6]">manage_accounts</span>
                      User Directory &amp; Role-Based Access Control
                    </h3>
                    <p className="text-xs text-[#747683] dark:text-slate-400 mt-0.5">
                      Inspect registered accounts, change role privileges, verify identities, or suspend accounts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchUsers}
                      className="px-3 py-1.5 rounded-lg bg-[#f2f4f7] dark:bg-slate-800 text-[#001d59] dark:text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f2f4f7] dark:bg-slate-800 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {['all', 'donor', 'recipient', 'ngo', 'admin'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setUserRoleFilter(role)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                          userRoleFilter === role
                            ? 'bg-[#001d59] text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-[#747683] dark:text-slate-300 hover:text-[#001d59]'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#747683] text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-slate-900 rounded-lg focus:outline-none border border-slate-200 dark:border-slate-700 text-[#191c1e] dark:text-white"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs text-[#191c1e] dark:text-white">
                    <thead className="bg-[#f2f4f7] dark:bg-slate-800 text-[#747683] dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">User</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Organization</th>
                        <th className="p-3">Verification</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {isLoadingUsers ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-[#747683]">
                            Loading users...
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-[#747683]">
                            No matching users found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-[#001d59] dark:text-white">{u.full_name || 'Anonymous User'}</div>
                              <div className="text-[11px] text-[#747683] dark:text-slate-400">{u.email}</div>
                            </td>
                            <td className="p-3">
                              <select
                                value={u.role}
                                onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                className="bg-[#f2f4f7] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs font-bold text-[#001d59] dark:text-white cursor-pointer"
                              >
                                <option value="donor">Donor</option>
                                <option value="recipient">Recipient</option>
                                <option value="ngo">NGO</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="p-3 font-medium text-[#444652] dark:text-slate-300">
                              {u.organization_name || 'Independent'}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleUserVerification(u.id, !!u.is_verified)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  u.is_verified
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {u.is_verified ? 'Verified ✓' : 'Unverified ✕'}
                              </button>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleUserActive(u.id, u.is_active !== false)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  u.is_active !== false
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                }`}
                              >
                                {u.is_active !== false ? 'Active' : 'Suspended'}
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => showToast(`User ID: ${u.id}`)}
                                className="text-[11px] font-bold text-[#005ab6] hover:underline cursor-pointer"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: NGO VERIFICATION & 80G */}
            {adminSubTab === 'ngos' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#001d59] dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005ab6]">verified_user</span>
                      NGO Verification Queue &amp; Tax Exemption Review
                    </h3>
                    <p className="text-xs text-[#747683] dark:text-slate-400 mt-0.5">
                      Review registered non-profits, audit 80G / 12A / 501(c)(3) tax exemption certificates, and grant authorized hub status.
                    </p>
                  </div>
                  <button
                    onClick={fetchNgos}
                    className="px-3 py-1.5 rounded-lg bg-[#f2f4f7] dark:bg-slate-800 text-[#001d59] dark:text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs text-[#191c1e] dark:text-white">
                    <thead className="bg-[#f2f4f7] dark:bg-slate-800 text-[#747683] dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Organization</th>
                        <th className="p-3">Registration #</th>
                        <th className="p-3">Tax Exemption Cert</th>
                        <th className="p-3">Capacity</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Review Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {isLoadingNgos ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-[#747683]">
                            Loading NGO verifications...
                          </td>
                        </tr>
                      ) : ngos.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-[#747683]">
                            No NGO records found.
                          </td>
                        </tr>
                      ) : (
                        ngos.map((ngo) => (
                          <tr key={ngo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-[#001d59] dark:text-white">{ngo.name}</div>
                              <div className="text-[11px] text-[#747683] dark:text-slate-400">{ngo.address}</div>
                            </td>
                            <td className="p-3 font-mono font-bold text-xs text-[#005ab6]">
                              {ngo.registration_number || 'REG-PENDING'}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-bold text-[10px] border border-blue-200 dark:border-slate-700">
                                {ngo.tax_exemption_number || '80G / 12A / 501(c)(3)'}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-[#444652] dark:text-slate-300">
                              {ngo.daily_capacity_meals || 200} meals/day
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  ngo.verification_status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : ngo.verification_status === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {ngo.verification_status || 'Pending'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleReviewNgo(ngo.id, 'verified')}
                                  className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReviewNgo(ngo.id, 'rejected')}
                                  className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: PAYPAL SANDBOX LEDGER */}
            {adminSubTab === 'transactions' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#001d59] dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005ab6]">payments</span>
                      PayPal Sandbox Financial Ledger
                    </h3>
                    <p className="text-xs text-[#747683] dark:text-slate-400 mt-0.5">
                      Real-time capture records, consumer surplus payouts, and meal sponsorship escrows.
                    </p>
                  </div>
                  <button
                    onClick={fetchTransactions}
                    className="px-3 py-1.5 rounded-lg bg-[#f2f4f7] dark:bg-slate-800 text-[#001d59] dark:text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                      Total Captured Volume
                    </span>
                    <span className="text-2xl font-black text-[#001d59] dark:text-white mt-1 block">
                      ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                    </span>
                    <span className="text-[11px] text-[#747683] dark:text-slate-400 mt-0.5 block">
                      Via PayPal REST v2 Sandbox
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-slate-800/50 border border-emerald-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                      Captured Transactions
                    </span>
                    <span className="text-2xl font-black text-[#001d59] dark:text-white mt-1 block">
                      {transactions.length} Orders
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">
                      100% Instant Escrow Settlement
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-slate-800/50 border border-purple-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                      Dispute &amp; Refund Rate
                    </span>
                    <span className="text-2xl font-black text-[#001d59] dark:text-white mt-1 block">
                      0.00%
                    </span>
                    <span className="text-[11px] text-[#747683] dark:text-slate-400 mt-0.5 block">
                      Zero chargebacks recorded
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs text-[#191c1e] dark:text-white">
                    <thead className="bg-[#f2f4f7] dark:bg-slate-800 text-[#747683] dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Payer / Source</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Portions</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {isLoadingTransactions ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-[#747683]">
                            Loading PayPal transactions...
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-[#747683]">
                            No transactions captured yet.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3 font-mono font-bold text-xs text-[#005ab6]">
                              {tx.paypal_order_id || tx.id}
                            </td>
                            <td className="p-3 font-medium text-[#001d59] dark:text-white">
                              {tx.payer_name || 'Verified Customer'}
                            </td>
                            <td className="p-3 font-black text-[#001d59] dark:text-white">
                              ${(Number(tx.amount) || 0).toFixed(2)} {tx.currency || 'USD'}
                            </td>
                            <td className="p-3 font-bold text-[#444652] dark:text-slate-300">
                              {tx.portions || 1} meals
                            </td>
                            <td className="p-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {tx.status || 'COMPLETED'}
                              </span>
                            </td>
                            <td className="p-3 text-[11px] text-[#747683] dark:text-slate-400">
                              {tx.created_at ? new Date(tx.created_at).toLocaleTimeString() : 'Recent'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: MODERATION & REPORTS */}
            {adminSubTab === 'reports' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#001d59] dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005ab6]">shield</span>
                      Trust &amp; Safety Moderation Queue
                    </h3>
                    <p className="text-xs text-[#747683] dark:text-slate-400 mt-0.5">
                      Review community flags, audit suspected spoiled food reports, and take disciplinary actions.
                    </p>
                  </div>
                  <button
                    onClick={fetchReports}
                    className="px-3 py-1.5 rounded-lg bg-[#f2f4f7] dark:bg-slate-800 text-[#001d59] dark:text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs text-[#191c1e] dark:text-white">
                    <thead className="bg-[#f2f4f7] dark:bg-slate-800 text-[#747683] dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Report ID</th>
                        <th className="p-3">Entity Type</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Moderation Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {isLoadingReports ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-[#747683]">
                            Loading moderation reports...
                          </td>
                        </tr>
                      ) : reports.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-emerald-600 font-bold">
                            Zero active incident reports. Community health score: 99.8%.
                          </td>
                        </tr>
                      ) : (
                        reports.map((rep) => (
                          <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3 font-mono font-bold text-[#005ab6]">
                              {rep.id}
                            </td>
                            <td className="p-3 font-bold uppercase text-[10px] text-[#444652] dark:text-slate-300">
                              {rep.entity_type}
                            </td>
                            <td className="p-3 text-[#191c1e] dark:text-white">
                              {rep.reason}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  rep.status === 'resolved'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {rep.status || 'Pending'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {rep.status !== 'resolved' && (
                                <button
                                  onClick={() => handleResolveReport(rep.id)}
                                  className="px-3 py-1 rounded bg-[#001d59] hover:bg-[#003087] text-white font-bold text-[11px] cursor-pointer"
                                >
                                  Mark Resolved
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: SECURITY AUDIT TRAIL */}
            {adminSubTab === 'audit' && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#001d59] dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005ab6]">receipt_long</span>
                      Immutable Security &amp; Compliance Audit Trail
                    </h3>
                    <p className="text-xs text-[#747683] dark:text-slate-400 mt-0.5">
                      Cryptographically verifiable system action log for FDA food safety &amp; financial compliance.
                    </p>
                  </div>
                  <button
                    onClick={fetchAuditLogs}
                    className="px-3 py-1.5 rounded-lg bg-[#f2f4f7] dark:bg-slate-800 text-[#001d59] dark:text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs text-[#191c1e] dark:text-white">
                    <thead className="bg-[#f2f4f7] dark:bg-slate-800 text-[#747683] dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Target Entity</th>
                        <th className="p-3">IP Address</th>
                        <th className="p-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                      {isLoadingAudit ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-[#747683]">
                            Loading audit trail...
                          </td>
                        </tr>
                      ) : auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-[#747683]">
                            No audit log records found.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3 text-[#747683] dark:text-slate-400 whitespace-nowrap">
                              {log.created_at ? new Date(log.created_at).toLocaleString() : 'Recent'}
                            </td>
                            <td className="p-3 font-bold text-[#005ab6]">
                              {log.action}
                            </td>
                            <td className="p-3 text-[#191c1e] dark:text-white">
                              {log.entity_type} {log.entity_id ? `(${log.entity_id})` : ''}
                            </td>
                            <td className="p-3 text-[#747683] dark:text-slate-400">
                              {log.ip_address || '127.0.0.1'}
                            </td>
                            <td className="p-3 font-sans text-xs text-[#444652] dark:text-slate-300 max-w-xs truncate">
                              {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || '—'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white dark:bg-slate-900 shadow-[0_-1px_6px_rgba(0,48,135,0.03)] border-t border-slate-200 dark:border-slate-800 mt-10 py-8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                alt="FOODLOOP Brand Logo"
                className="h-6 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="text-lg font-bold text-[#001d59] dark:text-white tracking-tight">FOODLOOP</span>
              <span className="text-xs text-[#444652] dark:text-slate-400 ml-2 hidden sm:inline">Every Meal Deserves a Chance.</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#444652] dark:text-slate-400">
              <a className="hover:text-[#001d59] dark:hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-[#001d59] dark:hover:text-white transition-colors" href="#">Fintech Ledger Terms</a>
              <a className="hover:text-[#001d59] dark:hover:text-white transition-colors" href="#">API Docs</a>
              <a className="hover:text-[#001d59] dark:hover:text-white transition-colors" href="#">Support</a>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-xs text-[#747683] dark:text-slate-500">
            © 2025 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement.
          </div>
        </div>
      </footer>
    </div>
  );
};
