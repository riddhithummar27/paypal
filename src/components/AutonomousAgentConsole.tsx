'use client';

import React, { useState, useEffect } from 'react';
import { AgentLog } from '@/types/foodloop';

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
}

export const AutonomousAgentConsole: React.FC<AutonomousAgentConsoleProps> = ({
  onNavigate,
  activeRole = 'admin',
  setActiveRole,
  onOpenSponsors,
  initialLogs,
  onTriggerRescueChallenge,
  onAgentAction,
}) => {
  // Countdown timer state (43m 42s)
  const [secondsLeft, setSecondsLeft] = useState(43 * 60 + 42);
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [isRouteLocked, setIsRouteLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // High-volume batch queue matched state
  const [matchedQueues, setMatchedQueues] = useState<Record<string, boolean>>({});

  // Activity Log State (Single active live log)
  const [activityLogs, setActivityLogs] = useState<ActivityItem[]>([
    {
      id: '1',
      title: 'Automated split allocation computed',
      meta: 'Just now • Algorithm convergence in 0.18s',
      icon: 'notifications_active',
    },
  ]);

  // Interval timer for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="bg-[#f7f9fc] font-body-md text-[#191c1e] antialiased min-h-screen flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#001d59] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#005ab6]/30 animate-bounce">
          <span className="material-symbols-outlined text-[#d7e3ff] text-[20px]">check_circle</span>
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,48,135,0.06)] border-b border-slate-100">
        <div className="h-16 max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            {/* Back to Home Button */}
            <button
              onClick={() => onNavigate?.('home')}
              className="flex items-center gap-1 text-[#001d59] hover:text-[#005ab6] font-medium mr-1 p-1 rounded-lg hover:bg-slate-100 transition-colors"
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
              <span className="text-xl font-bold text-[#001d59] tracking-tight">FOODLOOP</span>
            </a>

            {/* Top Navigation Links with explicit gap-6 */}
            <nav className="hidden lg:flex items-center gap-6 ml-2">
              <a
                className="text-sm font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('home')}
              >
                Home
              </a>
              <a
                className="text-sm font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('explore-food')}
              >
                Explore Food
              </a>
              <a
                aria-current="page"
                className="text-sm py-1 text-[#001d59] font-bold border-b-2 border-[#001d59] cursor-pointer"
                onClick={() => onNavigate?.('ai-rescue-agent')}
              >
                AI Rescue Agent
              </a>
              <a
                className="text-sm font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                className="text-sm font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="text-sm font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate?.('impact')}
              >
                Impact
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3 justify-end flex-1 max-w-2xl">
            <div className="relative hidden md:block w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747683] text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-9 pr-3 bg-[#f2f4f7] rounded-lg text-[#191c1e] placeholder:text-[#747683] text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005ab6]/20 transition-all border border-transparent focus:border-[#005ab6]/30"
                placeholder="Search rescued batches, NGOs, donors..."
                type="text"
              />
            </div>
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                className="appearance-none h-10 pl-3 pr-8 bg-[#f2f4f7] text-xs text-[#001d59] font-bold rounded-lg cursor-pointer focus:outline-none border border-slate-200"
                value={activeRole}
                onChange={(e) => setActiveRole?.(e.target.value)}
              >
                <option value="donor">Role: Donor</option>
                <option value="recipient">Role: Recipient</option>
                <option value="ngo">Role: NGO Hub</option>
                <option value="admin">Role: Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#747683] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
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

            <div className="flex items-center gap-1 pl-1">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#dbe1ff]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"
              />
              <span className="material-symbols-outlined text-[#747683] text-[18px] hidden sm:block cursor-pointer hover:text-[#001d59] transition-colors">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-[#f7f9fc] flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1440px] mx-auto px-6 py-4 flex flex-col gap-6">

            {/* Command Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
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
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#001d59] tracking-tight">AI Autonomous Rescue Agent</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#d7e3ff] text-[#001d59] text-xs font-bold uppercase tracking-wider">
                      v2.4 Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005ab6] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#005ab6]"></span>
                    </span>
                    <span className="text-xs text-[#444652] font-semibold">
                      REAL-TIME MATCHING DOCK ONLINE • 14 NODES ACTIVE
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-[#f2f4f7] px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-100">
                  <span className="material-symbols-outlined text-[#005ab6] text-[20px]">bolt</span>
                  <div>
                    <div className="text-[10px] text-[#747683] font-bold uppercase">AUTO DISPATCH</div>
                    <div className="text-xs text-[#001d59] font-bold">Autonomous Rule #41</div>
                  </div>
                </div>
                <button
                  className={`h-11 px-4 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                    isOverrideActive
                      ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30'
                      : 'bg-[#eceef1] hover:bg-[#e6e8eb] text-[#001d59]'
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
                    <span className="text-xs text-white/70">ISO HACCP Certified</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 w-full bg-white/15 rounded-full h-1.5 mt-4 overflow-hidden">
                <div className="bg-[#d7e3ff] h-full rounded-full transition-all duration-1000" style={{ width: '72%' }}></div>
              </div>
            </div>

            {/* Grid: 5-Stage Pipeline + Radar Vector Map (Col 8) & Gauges + Live Log (Col 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* 5-Stage Autonomous Redistribution Sequence Pipeline */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] uppercase text-[#747683] tracking-wider font-bold">
                        Automated Decision Pipeline
                      </span>
                      <h3 className="text-lg font-bold text-[#001d59]">5-Stage Autonomous Redistribution Sequence</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-[#d7e3ff] text-[#001d59] font-bold">
                      {isDispatched ? 'Pipeline Stage 5 of 5 Complete' : 'Pipeline Stage 4 of 5 Running'}
                    </span>
                  </div>

                  {/* Horizontal Stage Stepper */}
                  <div className="relative flex items-center justify-between px-2 pt-2 pb-4 overflow-x-auto">
                    <div className="absolute left-6 right-6 top-7 h-1 bg-[#eceef1] -z-0"></div>
                    <div
                      className="absolute left-6 top-7 h-1 bg-[#005ab6] -z-0 transition-all duration-500"
                      style={{ width: isDispatched ? '100%' : '75%' }}
                    ></div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-[#005ab6] text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <span className="text-xs text-[#001d59] font-bold text-center mt-1">1. Ingest</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-[#005ab6] text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">radar</span>
                      </div>
                      <span className="text-xs text-[#001d59] font-bold text-center mt-1">2. Geospatial</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-[#005ab6] text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">groups</span>
                      </div>
                      <span className="text-xs text-[#001d59] font-bold text-center mt-1">3. NGO Capacity</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        isDispatched
                          ? 'bg-[#005ab6] text-white'
                          : 'bg-[#003087] text-white animate-pulse'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">call_split</span>
                      </div>
                      <span className="text-xs text-[#005ab6] font-bold text-center mt-1">4. Allocation</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isDispatched
                          ? 'bg-[#005ab6] text-white shadow-sm'
                          : 'bg-[#eceef1] text-[#747683]'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                      </div>
                      <span className={`text-xs text-center mt-1 font-bold ${isDispatched ? 'text-[#005ab6]' : 'text-[#747683]'}`}>
                        5. Dispatch
                      </span>
                    </div>
                  </div>

                  {/* Stage Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="bg-[#f2f4f7] rounded-xl p-4 flex flex-col justify-between border border-slate-100">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#747683] uppercase font-bold">Stage 1 Analysis</span>
                          <span className="px-2 py-0.5 rounded-full bg-white text-[#005ab6] text-xs font-bold shadow-xs">
                            Passed
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#001d59] mt-1">Ingestion &amp; Sensor Metric</h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#444652]">Core Temp (Probe C-2)</span>
                            <span className="font-bold text-[#001d59]">142.8°F (Safe Hot Holding)</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#444652]">Dietary Classification</span>
                            <span className="font-bold text-[#001d59]">Halal, Nut-Free Certified</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#444652]">Donor Reliability Score</span>
                            <span className="font-bold text-[#001d59]">99.2% (Tier 1 Gold Donor)</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-1 bg-white p-2 rounded-lg flex items-center gap-2 border border-slate-100">
                        <span className="material-symbols-outlined text-[#005ab6] text-[18px]">check_circle</span>
                        <span className="text-xs text-[#191c1e] font-medium">Automatic chain-of-custody smart voucher minted.</span>
                      </div>
                    </div>

                    <div className="bg-[#f2f4f7] rounded-xl p-4 flex flex-col justify-between border border-slate-100">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#747683] uppercase font-bold">Stage 2 &amp; 3 Scanning</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#d7e3ff] text-[#001d59] text-xs font-bold">
                            Radius: 3.5 km
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#001d59] mt-1">Geospatial NGO Match</h4>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#444652]">Qualified Receivers</span>
                            <span className="font-bold text-[#001d59]">4 Facilities Screened</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#444652]">Acceptance Probability</span>
                            <span className="font-bold text-[#005ab6]">97.8% Confidence</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#444652]">Volunteer Courier Availability</span>
                            <span className="font-bold text-[#001d59]">3 Drivers in Transit Orbit</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-1 bg-white p-2 rounded-lg flex items-center gap-2 border border-slate-100">
                        <span className="material-symbols-outlined text-[#005ab6] text-[18px]">my_location</span>
                        <span className="text-xs text-[#191c1e] font-medium">Traffic index factored: Low friction on East Corridor.</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Optimal Redistribution Split */}
                  <div className="bg-[#e6e8eb]/70 rounded-xl p-4 mt-1 border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#747683] uppercase font-bold">AI Optimal Redistribution Split</span>
                        <h4 className="text-base font-bold text-[#001d59]">Multi-Destination Partitioning</h4>
                      </div>
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-[#001d59] shadow-xs">
                        Zero Waste Objective
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {/* Destination 1 */}
                      <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#001d59] text-base">Shelter Hope Downtown</span>
                          <span className="px-3 py-1 rounded-full bg-[#d7e3ff] text-[#001d59] font-bold text-xs">
                            80 Meals (100% Allocation)
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#444652] mt-1.5">1.2 km away • Cold-chain direct carrier assigned</p>
                        <div className="mt-3.5 flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-[#747683]">Assigned Carrier</span>
                          <span className="font-bold text-[#001d59]">Van Unit #09 (Carlos M.)</span>
                        </div>
                        <div className="w-full bg-[#f2f4f7] h-2.5 rounded-full mt-2.5 overflow-hidden">
                          <div className="bg-[#005ab6] h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2 text-xs text-[#444652]">
                        <span className="material-symbols-outlined text-[#005ab6] text-[20px]">account_balance_wallet</span>
                        <span>Automated volunteer fuel &amp; time settlement staged via FOODLOOP Instant Ledger.</span>
                      </div>
                      <button
                        className={`px-4 py-2 font-semibold text-xs rounded-lg transition-all cursor-pointer ${
                          isRouteLocked
                            ? 'bg-[#005ab6] text-white shadow-sm'
                            : 'bg-[#001d59] text-white hover:bg-[#003087]'
                        }`}
                        onClick={handleLockRoute}
                      >
                        {isRouteLocked ? 'Route Locked & Authorized ✓' : 'Lock Allocation & Authorize Route'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logistical Vector Map */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] uppercase text-[#747683] tracking-wider font-bold">
                        Logistical Vector Map
                      </span>
                      <h3 className="text-lg font-bold text-[#001d59]">Transit Orbit &amp; GPS Dispatch Routing</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-[#444652] font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#005ab6]"></span> Donor
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-[#444652] font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#001d59]"></span> Recipients
                      </span>
                    </div>
                  </div>

                  {/* Clean Vector Map Graphic */}
                  <div className="relative w-full h-80 rounded-xl overflow-hidden bg-[#f2f4f7] border border-slate-200">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern height="40" id="grid-light" patternUnits="userSpaceOnUse" width="40">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect fill="url(#grid-light)" height="100%" width="100%" />

                      {/* City Street Arteries */}
                      <path d="M -20,80 Q 200,70 420,120 T 900,100" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                      <path d="M 120,-10 L 140,350" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
                      <path d="M 320,-10 L 360,350" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
                      <path d="M -10,220 C 250,210 500,260 880,240" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                      <path d="M 620,-10 L 640,350" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />

                      {/* Radar Concentric Rings around Origin */}
                      <circle cx="160" cy="80" fill="none" opacity="0.3" r="45" stroke="#005ab6" strokeDasharray="3 3" strokeWidth="1.5" />
                      <circle cx="160" cy="80" fill="none" opacity="0.2" r="95" stroke="#005ab6" strokeDasharray="4 4" strokeWidth="1.5" />
                      <circle cx="160" cy="80" fill="none" opacity="0.1" r="160" stroke="#005ab6" strokeDasharray="5 5" strokeWidth="1.5" />

                      {/* Dispatch Routes */}
                      <path d="M 160,80 C 260,110 440,150 560,170" fill="none" opacity="0.85" stroke="#005ab6" strokeDasharray="8 5" strokeWidth="3.5" />
                      <path d="M 160,80 C 280,140 450,230 680,250" fill="none" opacity="0.85" stroke="#001d59" strokeDasharray="8 5" strokeWidth="3.5" />

                      {/* Moving Vehicle Courier Nodes */}
                      <circle cx="340" cy="120" fill="#005ab6" r="6" />
                      <circle cx="340" cy="120" fill="none" stroke="#005ab6" strokeWidth="2" r="11" opacity="0.5" className="animate-ping" />
                      <circle cx="440" cy="205" fill="#001d59" r="6" />
                      <circle cx="440" cy="205" fill="none" stroke="#001d59" strokeWidth="2" r="11" opacity="0.5" className="animate-ping" />
                    </svg>

                    {/* Node 1: Origin */}
                    <div className="absolute top-6 left-8 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md flex items-center gap-2 border border-slate-200 z-10">
                      <div className="w-8 h-8 rounded-lg bg-[#d7e3ff] flex items-center justify-center text-[#001d59]">
                        <span className="material-symbols-outlined text-[18px]">restaurant</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#001d59]">Marriott Regency (Origin)</div>
                        <div className="text-[11px] text-[#747683]">80 Trays Packed &amp; Ready</div>
                      </div>
                    </div>

                    {/* Node 2: Destination 1 */}
                    <div className="absolute bottom-8 right-12 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md flex items-center gap-2 border border-slate-200 z-10">
                      <div className="w-8 h-8 rounded-lg bg-[#d7e3ff] flex items-center justify-center text-[#001d59]">
                        <span className="material-symbols-outlined text-[18px]">warehouse</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#001d59]">Shelter Hope (Dest. 1)</div>
                        <div className="text-[11px] text-[#747683]">ETA 14 min • Van #09</div>
                      </div>
                    </div>

                    {/* Node 3: Destination 2 */}
                    <div className="absolute top-1/2 right-1/4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md flex items-center gap-2 border border-slate-200 z-10">
                      <div className="w-8 h-8 rounded-lg bg-[#eceef1] flex items-center justify-center text-[#001d59]">
                        <span className="material-symbols-outlined text-[18px]">church</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#001d59]">St. Jude Mission (Dest. 2)</div>
                        <div className="text-[11px] text-[#747683]">ETA 21 min • E-Bike Elena</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Gauges & Live Stream (Col 4) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Demand Gauges Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-[#747683] font-bold">Community Capacity</span>
                      <h3 className="text-lg font-bold text-[#001d59]">Demand Gauges</h3>
                    </div>
                    <span className="material-symbols-outlined text-[#747683] text-[20px]">analytics</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-[#001d59]">Shelter Hope Downtown</span>
                        <span className="font-bold text-[#005ab6]">94% Capacity</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#eceef1] rounded-full overflow-hidden">
                        <div className="bg-[#005ab6] h-full rounded-full transition-all duration-700" style={{ width: '94%' }}></div>
                      </div>
                      <span className="text-[11px] text-[#747683] mt-1 block">Urgent need for warm calorie-dense meals.</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-[#001d59]">St. Jude Community Mission</span>
                        <span className="font-bold text-[#005ab6]">78% Capacity</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#eceef1] rounded-full overflow-hidden">
                        <div className="bg-[#005ab6] h-full rounded-full transition-all duration-700" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-[11px] text-[#747683] mt-1 block">Refrigerated staging docks verified open.</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-[#001d59]">Eastside Family Pantry</span>
                        <span className="font-bold text-[#747683]">42% Capacity</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#eceef1] rounded-full overflow-hidden">
                        <div className="bg-[#747683] h-full rounded-full transition-all duration-700" style={{ width: '42%' }}></div>
                      </div>
                      <span className="text-[11px] text-[#747683] mt-1 block">Surplus buffer threshold normal.</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#f2f4f7] rounded-xl border border-slate-100">
                    <span className="text-[10px] text-[#747683] uppercase font-bold">Aggregate Hunger Alleviation Rate</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-[#001d59]">1,420</span>
                      <span className="text-xs text-[#444652]">meals saved today</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[#005ab6] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[18px]">trending_up</span>
                      <span>+18.4% vs. previous 7-day average</span>
                    </div>
                  </div>
                </div>

                {/* Real-Time Live Activity Log */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] uppercase text-[#747683] font-bold">Real-Time Event Stream</span>
                      <h3 className="text-lg font-bold text-[#001d59]">Live Activity Log</h3>
                    </div>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005ab6] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#005ab6]"></span>
                    </span>
                  </div>

                  <div className="space-y-4 overflow-y-auto max-h-[380px] pr-1" id="activity-log">
                    {activityLogs.map((item) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          item.isNew
                            ? 'bg-[#005ab6] text-white'
                            : item.icon === 'notifications_active'
                            ? 'bg-[#d7e3ff] text-[#001d59]'
                            : 'bg-[#eceef1] text-[#001d59]'
                        }`}>
                          <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                        </div>
                        <div>
                          <p className={`text-xs ${item.isNew ? 'font-bold text-[#005ab6]' : 'font-semibold text-[#191c1e]'}`}>
                            {item.title}
                          </p>
                          <span className="text-[11px] text-[#747683]">{item.meta}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      className="w-full py-2.5 rounded-lg bg-[#f2f4f7] hover:bg-[#eceef1] text-[#001d59] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                      onClick={handleExportLedger}
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export Compliance Audit Ledger (.JSON)
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* High Volume Verification: Nearby Active Batches Awaiting Orchestration */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase text-[#747683] font-bold">High Volume Verification</span>
                  <h3 className="text-lg font-bold text-[#001d59]">Nearby Active Batches Awaiting Orchestration</h3>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#747683]">Live queue: 3 pending</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Batch 1 */}
                <div className="bg-[#f2f4f7] rounded-xl p-4 flex flex-col justify-between hover:bg-[#e6e8eb] transition-colors border border-slate-100">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-white text-[#001d59] font-bold shadow-xs">
                        Bakery &amp; Breads
                      </span>
                      <span className="text-xs text-[#005ab6] font-bold">1h 15m remaining</span>
                    </div>
                    <h4 className="text-base font-bold text-[#001d59] mt-2">Whole Foods Market Tribeca</h4>
                    <p className="text-xs text-[#444652] mt-1">110 Artisanal Loaves &amp; Pastries (Dry shelf-stable ambient)</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-[#001d59]">EST. 110 Portions</span>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-all ${
                        matchedQueues['Whole Foods Market Tribeca']
                          ? 'bg-[#001d59] text-white'
                          : 'bg-white text-[#005ab6] hover:bg-slate-100'
                      }`}
                      onClick={() => handleQueueMatch('Whole Foods Market Tribeca', '110 Portions')}
                    >
                      {matchedQueues['Whole Foods Market Tribeca'] ? 'Queued ✓' : 'Queue Match'}
                    </button>
                  </div>
                </div>

                {/* Batch 2 */}
                <div className="bg-[#f2f4f7] rounded-xl p-4 flex flex-col justify-between hover:bg-[#e6e8eb] transition-colors border border-slate-100">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-white text-[#001d59] font-bold shadow-xs">
                        Organic Produce
                      </span>
                      <span className="text-xs text-[#005ab6] font-bold">2h 40m remaining</span>
                    </div>
                    <h4 className="text-base font-bold text-[#001d59] mt-2">Sweetgreen Midtown East</h4>
                    <p className="text-xs text-[#444652] mt-1">65 lbs Fresh Greens, Roasted Root Vegetables &amp; Bowls</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-[#001d59]">EST. 85 Portions</span>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-all ${
                        matchedQueues['Sweetgreen Midtown East']
                          ? 'bg-[#001d59] text-white'
                          : 'bg-white text-[#005ab6] hover:bg-slate-100'
                      }`}
                      onClick={() => handleQueueMatch('Sweetgreen Midtown East', '85 Portions')}
                    >
                      {matchedQueues['Sweetgreen Midtown East'] ? 'Queued ✓' : 'Queue Match'}
                    </button>
                  </div>
                </div>

                {/* Batch 3 */}
                <div className="bg-[#f2f4f7] rounded-xl p-4 flex flex-col justify-between hover:bg-[#e6e8eb] transition-colors border border-slate-100">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-white text-[#001d59] font-bold shadow-xs">
                        Chilled Catering
                      </span>
                      <span className="text-xs text-[#005ab6] font-bold">3h 10m remaining</span>
                    </div>
                    <h4 className="text-base font-bold text-[#001d59] mt-2">Google NYC 9th Ave Cafeteria</h4>
                    <p className="text-xs text-[#444652] mt-1">140 Gourmet Bento Wraps &amp; Mediterranean Bowls</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-[#001d59]">EST. 140 Portions</span>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-all ${
                        matchedQueues['Google NYC 9th Ave Cafeteria']
                          ? 'bg-[#001d59] text-white'
                          : 'bg-white text-[#005ab6] hover:bg-slate-100'
                      }`}
                      onClick={() => handleQueueMatch('Google NYC 9th Ave Cafeteria', '140 Portions')}
                    >
                      {matchedQueues['Google NYC 9th Ave Cafeteria'] ? 'Queued ✓' : 'Queue Match'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white shadow-[0_-1px_6px_rgba(0,48,135,0.03)] border-t border-slate-200 mt-10 py-8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                alt="FOODLOOP Brand Logo"
                className="h-6 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="text-lg font-bold text-[#001d59] tracking-tight">FOODLOOP</span>
              <span className="text-xs text-[#444652] ml-2 hidden sm:inline">Every Meal Deserves a Chance.</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#444652]">
              <a className="hover:text-[#001d59] transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-[#001d59] transition-colors" href="#">Fintech Ledger Terms</a>
              <a className="hover:text-[#001d59] transition-colors" href="#">API Docs</a>
              <a className="hover:text-[#001d59] transition-colors" href="#">Support</a>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-xs text-[#747683]">
            © 2025 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement.
          </div>
        </div>
      </footer>
    </div>
  );
};
