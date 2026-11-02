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

  // Activity Log State
  const [activityLogs, setActivityLogs] = useState<ActivityItem[]>([
    {
      id: '1',
      title: 'Automated split allocation computed',
      meta: 'Just now • Algorithm convergence in 0.18s',
      icon: 'notifications_active',
    },
    {
      id: '2',
      title: 'Thermal core temperature telemetry received (142.8°F)',
      meta: '2m ago • IoT Sensor Pack #827',
      icon: 'sensors',
    },
    {
      id: '3',
      title: 'Volunteer Elena K. accepted dynamic routing prompt',
      meta: '5m ago • Cargo E-Bike Fleet',
      icon: 'person_check',
    },
    {
      id: '4',
      title: 'Smart ledger custody contract generated #0x892a...c3',
      meta: '8m ago • Gasless verification',
      icon: 'receipt_long',
    },
    {
      id: '5',
      title: 'Batch #FL-8839 closed: 45 meals delivered to Covenant House',
      meta: '18m ago • 100% redemption rate',
      icon: 'done_all',
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

  const handleForceDispatch = () => {
    if (isDispatched) return;
    setIsDispatched(true);
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

  const handleQueueMatch = (donorName: string, portions: string) => {
    setMatchedQueues((prev) => ({ ...prev, [donorName]: true }));
    addLog(`Batch matched & queued: ${donorName} (${portions})`, 'Just now • AI route optimizer assigned receiving shelter', 'auto_fix_high');
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
    <div className="bg-[#071426] font-body-md text-[#d7e3fc] antialiased selection:bg-cyan-500/30 selection:text-cyan-200 min-h-screen flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#10233D] text-cyan-300 border border-cyan-500/50 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-cyan-400 text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0A1B30]/95 backdrop-blur-xl border-b border-[#1A365D] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="h-16 max-w-[1440px] mx-auto px-gutter flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg shrink-0">
            <a
              className="flex items-center gap-space-sm cursor-pointer"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('home');
              }}
            >
              <img
                alt="FOODLOOP Brand Logo"
                className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-cyan-400 font-extrabold tracking-tight">FOODLOOP</span>
            </a>
            <nav className="hidden xl:flex items-center gap-space-md" data-active-classes="text-cyan-400 font-bold">
              <a
                className="font-label-lg text-label-lg text-slate-400 hover:text-cyan-300 transition-colors py-space-xs px-space-xs cursor-pointer"
                data-path="home"
                onClick={() => onNavigate?.('home')}
              >
                Home
              </a>
              <a
                className="font-label-lg text-label-lg text-slate-400 hover:text-cyan-300 transition-colors py-space-xs px-space-xs cursor-pointer"
                data-path="explore-food"
                onClick={() => onNavigate?.('explore-food')}
              >
                Explore Food
              </a>
              <a
                aria-current="page"
                className="transition-colors py-space-xs px-space-xs text-cyan-400 font-bold border-b-2 border-cyan-400 cursor-pointer"
                data-path="ai-rescue-agent"
                onClick={() => onNavigate?.('ai-rescue-agent')}
              >
                AI Rescue Agent
              </a>
              <a
                className="font-label-lg text-label-lg text-slate-400 hover:text-cyan-300 transition-colors py-space-xs px-space-xs cursor-pointer"
                data-path="donor-portal"
                onClick={() => onNavigate?.('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                className="font-label-lg text-label-lg text-slate-400 hover:text-cyan-300 transition-colors py-space-xs px-space-xs cursor-pointer"
                data-path="ngo-hub"
                onClick={() => onNavigate?.('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="font-label-lg text-label-lg text-slate-400 hover:text-cyan-300 transition-colors py-space-xs px-space-xs cursor-pointer"
                data-path="impact"
                onClick={() => onNavigate?.('impact')}
              >
                Impact
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-space-sm justify-end flex-1 max-w-2xl">
            <div className="relative hidden md:block w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input
                className="w-full h-10 pl-9 pr-space-md bg-[#10233D] border border-[#1A365D] rounded-lg text-slate-200 placeholder:text-slate-500 font-body-sm text-body-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                placeholder="Search rescued batches, NGOs, donors..."
                type="text"
              />
            </div>
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                className="appearance-none h-10 pl-space-sm pr-space-lg bg-[#10233D] border border-[#1A365D] font-label-md text-label-md text-cyan-300 font-semibold rounded-lg cursor-pointer focus:outline-none focus:border-cyan-400"
                value={activeRole}
                onChange={(e) => setActiveRole?.(e.target.value)}
              >
                <option className="bg-[#0A1B30]" value="donor">Role: Donor</option>
                <option className="bg-[#0A1B30]" value="recipient">Role: Recipient</option>
                <option className="bg-[#0A1B30]" value="ngo">Role: NGO Hub</option>
                <option className="bg-[#0A1B30]" value="admin">Role: Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-cyan-400 text-[18px] pointer-events-none">expand_more</span>
            </div>
            <button
              aria-label="Toggle Color Scheme"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#10233D] border border-[#1A365D] text-cyan-300 hover:text-cyan-200 hover:bg-[#1A365D] transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">dark_mode</span>
            </button>
            <button
              aria-label="Notifications"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-[#10233D] border border-[#1A365D] text-slate-300 hover:text-cyan-300 hover:bg-[#1A365D] transition-all"
              type="button"
              onClick={() => showToast('14 active nodes operating nominally in real-time.')}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]"></span>
            </button>
            <div className="flex items-center gap-space-xs pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"
              />
              <span className="material-symbols-outlined text-slate-400 text-[18px] hidden sm:block cursor-pointer hover:text-cyan-300 transition-colors">arrow_drop_down</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-[#071426] flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1440px] mx-auto px-gutter py-space-md flex flex-col gap-space-lg">
            
            {/* Command Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-[#0A1B30] border border-[#1A365D] p-space-lg rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-space-md">
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-950 to-blue-900 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)] overflow-hidden">
                  <svg className="w-7 h-7 text-cyan-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 48 48">
                    <circle className="opacity-30" cx="24" cy="24" r="18" />
                    <path d="M15 24c0-4 4-8 9-8s9 8 9 8-4 8-9 8-9-4-9-8z" />
                    <circle cx="24" cy="7" fill="currentColor" r="2.5" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent"></div>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-md text-headline-md text-white font-bold tracking-tight">AI Autonomous Rescue Agent</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-label-sm text-label-sm uppercase tracking-wider font-semibold">v2.4 Engine</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold tracking-wider shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      SYS:LIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                    </span>
                    <span className="font-body-sm text-body-sm text-slate-300 font-mono tracking-wide">REAL-TIME MATCHING DOCK ONLINE • 14 NODES ACTIVE</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="bg-[#10233D] border border-[#1A365D] px-space-md py-2 rounded-lg flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-amber-400 text-[20px] drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]">bolt</span>
                  <div>
                    <div className="font-label-sm text-label-sm text-slate-400">AUTO DISPATCH</div>
                    <div className="font-label-md text-label-md text-cyan-300 font-mono font-semibold">Autonomous Rule #41</div>
                  </div>
                </div>
                <button
                  className={`h-11 px-space-md rounded-lg border font-label-lg text-label-lg transition-all flex items-center gap-space-xs shadow-sm cursor-pointer ${
                    isOverrideActive
                      ? 'bg-red-950 border-red-500 text-red-300'
                      : 'bg-[#10233D] hover:bg-[#1A365D] border-[#1A365D] text-slate-200 hover:text-white'
                  }`}
                  id="manual-override-btn"
                  onClick={handleManualOverrideToggle}
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-400">lock_reset</span>
                  {isOverrideActive ? 'Override Active (Hold Auto)' : 'Manual Override'}
                </button>
                <button
                  className={`h-11 px-space-lg rounded-lg text-white font-label-lg text-label-lg font-bold shadow-[0_0_18px_rgba(56,189,248,0.4)] transition-all flex items-center gap-space-xs cursor-pointer ${
                    isDispatched
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-[0_0_18px_rgba(16,185,129,0.5)]'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400'
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

            {/* Urgent Perishable Countdown Card with Electric Blue & Amber Glow */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#07192f] via-[#0b213f] to-[#08182b] border border-[#1E4976] rounded-xl p-space-lg shadow-[0_0_30px_rgba(2,132,199,0.25)]">
              <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute right-1/4 -bottom-16 w-60 h-60 bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shrink-0 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                    <span className="material-symbols-outlined text-[26px] text-amber-400 animate-pulse">crisis_alert</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-400 font-label-sm text-label-sm uppercase tracking-wide font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]">High Priority Active</span>
                      <span className="font-mono font-bold text-label-md text-cyan-300">Operation #FL-8842</span>
                      <span className="text-slate-400 font-body-sm text-body-sm">• Batch Verified by Marriott Regency Chef Lead</span>
                    </div>
                    <h2 className="font-headline-md text-headline-md text-white font-extrabold mt-1 tracking-tight">
                      80 Ready-to-Eat Gourmet Hot Meals Available
                    </h2>
                    <p className="font-body-md text-body-md text-slate-300 mt-1 max-w-3xl">
                      Strict cold-chain &amp; thermal window compliance required. Mandatory custody release prior to 8:30 PM EDT.
                    </p>
                  </div>
                </div>
                <div className="bg-[#051324]/90 border border-cyan-500/30 rounded-xl p-space-md flex items-center justify-between lg:justify-end gap-space-lg shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <div className="text-left">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-bold block flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span> Countdown Window
                    </span>
                    <div className="font-headline-lg text-headline-lg font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" id="countdown-timer">
                      {formatTimer(secondsLeft)}
                    </div>
                    <span className="font-body-sm text-body-sm text-slate-400">Minutes until perish margin</span>
                  </div>
                  <div className="h-12 w-px bg-cyan-500/30"></div>
                  <div className="text-left">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-bold block flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified_user</span> Safety Score
                    </span>
                    <div className="font-headline-lg text-headline-lg font-black text-cyan-300 font-mono tracking-tight drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">98.4%</div>
                    <span className="font-body-sm text-body-sm text-slate-400">ISO HACCP Certified</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 w-full bg-[#030e20] rounded-full h-2 mt-space-md overflow-hidden border border-[#1A365D]">
                <div className="bg-gradient-to-r from-cyan-400 via-amber-400 to-red-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(56,189,248,0.8)]" style={{ width: '72%' }}></div>
              </div>
            </div>

            {/* Grid: 5-Stage Pipeline + Radar Vector Map (Col 8) & Gauges + Live Log (Col 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                
                {/* 5-Stage Autonomous Redistribution Sequence Pipeline */}
                <div className="bg-[#0A1B30] border border-[#1A365D] rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase text-slate-400 tracking-wider font-mono">Automated Decision Pipeline</span>
                      <h3 className="font-headline-sm text-headline-sm text-white font-bold">5-Stage Autonomous Redistribution Sequence</h3>
                    </div>
                    <span className="font-label-sm text-label-sm px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                      {isDispatched ? 'Pipeline Stage 5 of 5 Complete' : 'Pipeline Stage 4 of 5 Running'}
                    </span>
                  </div>
                  <div className="relative flex items-center justify-between px-4 pt-space-xs pb-space-sm overflow-x-auto">
                    <div className="absolute left-8 right-8 top-7 h-1 bg-[#10233D] -z-0"></div>
                    <div
                      className="absolute left-8 top-7 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 -z-0 transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                      style={{ width: isDispatched ? '100%' : '75%' }}
                    ></div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-cyan-300 font-bold text-center mt-1">1. Ingest</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                        <span className="material-symbols-outlined text-[18px]">radar</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-cyan-300 font-bold text-center mt-1">2. Geospatial</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                        <span className="material-symbols-outlined text-[18px]">groups</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-cyan-300 font-bold text-center mt-1">3. NGO Capacity</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center shadow-[0_0_16px_rgba(56,189,248,0.9)] ${
                        isRouteLocked ? 'bg-cyan-950 border-2 border-cyan-400 text-cyan-300' : 'bg-cyan-500 text-slate-950 animate-pulse'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">call_split</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-cyan-200 font-extrabold text-center mt-1 drop-shadow-[0_0_4px_rgba(56,189,248,0.8)]">4. Allocation</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isDispatched
                          ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.9)] animate-pulse'
                          : 'bg-[#10233D] border border-[#1A365D] text-slate-500'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                      </div>
                      <span className={`font-label-sm text-label-sm text-center mt-1 font-bold ${
                        isDispatched ? 'text-emerald-400' : 'text-slate-500'
                      }`}>5. Dispatch</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                    <div className="bg-[#10233D] border border-[#1A365D] rounded-xl p-space-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-label-sm text-label-sm text-slate-400 uppercase font-semibold">Stage 1 Analysis</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-label-sm text-label-sm font-bold">Passed</span>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm text-white mt-1">Ingestion &amp; Sensor Metric</h4>
                        <div className="mt-space-sm space-y-2">
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-slate-400">Core Temp (Probe C-2)</span>
                            <span className="font-bold text-amber-400 font-mono">142.8°F (Safe Hot Holding)</span>
                          </div>
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-slate-400">Dietary Classification</span>
                            <span className="font-bold text-cyan-300">Halal, Nut-Free Certified</span>
                          </div>
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-slate-400">Donor Reliability Score</span>
                            <span className="font-bold text-emerald-400 font-mono">99.2% (Tier 1 Gold Donor)</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-space-md pt-space-xs bg-[#0A1B30] border border-[#1A365D] p-space-xs rounded-lg flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-cyan-400 text-[18px]">check_circle</span>
                        <span className="font-body-sm text-body-sm text-slate-300 font-medium">Automatic chain-of-custody smart voucher minted.</span>
                      </div>
                    </div>
                    <div className="bg-[#10233D] border border-[#1A365D] rounded-xl p-space-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-label-sm text-label-sm text-slate-400 uppercase font-semibold">Stage 2 &amp; 3 Scanning</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-label-sm text-label-sm font-bold font-mono">Radius: 3.5 km</span>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm text-white mt-1">Geospatial NGO Match</h4>
                        <div className="mt-space-sm space-y-2">
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-slate-400">Qualified Receivers</span>
                            <span className="font-bold text-white font-mono">4 Facilities Screened</span>
                          </div>
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-slate-400">Acceptance Probability</span>
                            <span className="font-bold text-cyan-300 font-mono">97.8% Confidence</span>
                          </div>
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-slate-400">Volunteer Courier Availability</span>
                            <span className="font-bold text-emerald-400 font-mono">3 Drivers in Transit Orbit</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-space-md pt-space-xs bg-[#0A1B30] border border-[#1A365D] p-space-xs rounded-lg flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-cyan-400 text-[18px]">my_location</span>
                        <span className="font-body-sm text-body-sm text-slate-300 font-medium">Traffic index factored: Low friction on East Corridor.</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#10233D] border border-[#1A365D] rounded-xl p-space-md mt-space-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                      <div>
                        <span className="font-mono text-label-sm text-label-sm text-slate-400 uppercase">AI Optimal Redistribution Split</span>
                        <h4 className="font-headline-sm text-headline-sm text-white font-bold">Multi-Destination Partitioning</h4>
                      </div>
                      <span className="px-3 py-1 bg-[#0A1B30] border border-cyan-500/30 rounded-full font-label-sm text-label-sm font-bold text-cyan-300">Zero Waste Objective</span>
                    </div>
                    <div className="mt-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="bg-[#0A1B30] border border-[#1A365D] rounded-lg p-space-md shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-label-lg text-label-lg font-bold text-white">Shelter Hope Downtown</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold font-label-sm text-label-sm font-mono">50 Meals</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-slate-400 mt-1">1.2 km away • Current occupancy 94%</p>
                        <div className="mt-space-sm flex items-center justify-between font-body-sm text-body-sm">
                          <span className="text-slate-400">Assigned Carrier</span>
                          <span className="font-semibold text-cyan-300">Van Unit #09 (Carlos M.)</span>
                        </div>
                        <div className="w-full bg-[#10233D] h-2 rounded-full mt-2 overflow-hidden border border-[#1A365D]">
                          <div className="bg-cyan-400 h-full rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" style={{ width: '62.5%' }}></div>
                        </div>
                      </div>
                      <div className="bg-[#0A1B30] border border-[#1A365D] rounded-lg p-space-md shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-label-lg text-label-lg font-bold text-white">St. Jude Community Mission</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold font-label-sm text-label-sm font-mono">30 Meals</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-slate-400 mt-1">2.4 km away • Dinner service starts in 50m</p>
                        <div className="mt-space-sm flex items-center justify-between font-body-sm text-body-sm">
                          <span className="text-slate-400">Assigned Carrier</span>
                          <span className="font-semibold text-cyan-300">Cargo E-Bike (Elena K.)</span>
                        </div>
                        <div className="w-full bg-[#10233D] h-2 rounded-full mt-2 overflow-hidden border border-[#1A365D]">
                          <div className="bg-blue-500 h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ width: '37.5%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pt-space-xs">
                      <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-slate-300">
                        <span className="material-symbols-outlined text-cyan-400 text-[20px]">account_balance_wallet</span>
                        <span>Automated volunteer fuel &amp; time settlement staged via FOODLOOP Instant Ledger.</span>
                      </div>
                      <button
                        className={`px-space-md py-2 font-label-md text-label-md font-bold rounded-lg shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all cursor-pointer ${
                          isRouteLocked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                        }`}
                        onClick={handleLockRoute}
                      >
                        {isRouteLocked ? 'Route Locked & Authorized ✓' : 'Lock Allocation & Authorize Route'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Radar / Transit Orbit Vector Map */}
                <div className="bg-[#0A1B30] border border-[#1A365D] rounded-xl p-space-lg shadow-sm">
                  <div className="flex items-center justify-between mb-space-md">
                    <div>
                      <span className="font-mono text-label-sm text-label-sm uppercase text-slate-400 tracking-wider">Logistical Vector Map</span>
                      <h3 className="font-headline-sm text-headline-sm text-white font-bold">Transit Orbit &amp; GPS Dispatch Routing</h3>
                    </div>
                    <div className="flex items-center gap-space-md">
                      <span className="flex items-center gap-1.5 font-label-sm text-label-sm text-slate-300 font-mono">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]"></span> Origin Donor
                      </span>
                      <span className="flex items-center gap-1.5 font-label-sm text-label-sm text-slate-300 font-mono">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]"></span> Recipients
                      </span>
                    </div>
                  </div>

                  {/* Deep navy map canvas with neon glowing routes and pins */}
                  <div className="relative w-full h-80 rounded-xl overflow-hidden bg-[#040e1b] border border-[#1A365D]">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        {/* Map Grid */}
                        <pattern height="40" id="grid-dark" patternUnits="userSpaceOnUse" width="40">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#122744" strokeWidth="1" />
                        </pattern>
                        {/* Radar Sweep Gradient */}
                        <radialGradient cx="20%" cy="25%" id="radar-glow" r="65%">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.05" />
                          <stop offset="100%" stopColor="#040e1b" stopOpacity="0" />
                        </radialGradient>
                        <filter height="140%" id="glow-neon" width="140%" x="-20%" y="-20%">
                          <feGaussianBlur result="blur" stdDeviation="3" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <rect fill="url(#grid-dark)" height="100%" width="100%" />
                      <rect fill="url(#radar-glow)" height="100%" width="100%" />
                      {/* Vector City Street Arteries */}
                      <path d="M -20,80 Q 200,70 420,120 T 900,100" fill="none" stroke="#132c4e" strokeWidth="3" />
                      <path d="M 120,-10 L 140,350" fill="none" stroke="#132c4e" strokeWidth="2.5" />
                      <path d="M 320,-10 L 360,350" fill="none" stroke="#132c4e" strokeWidth="2.5" />
                      <path d="M -10,220 C 250,210 500,260 880,240" fill="none" stroke="#132c4e" strokeWidth="3" />
                      <path d="M 620,-10 L 640,350" fill="none" stroke="#132c4e" strokeWidth="2.5" />
                      {/* Radar Concentric Rings around Origin */}
                      <circle cx="160" cy="80" fill="none" opacity="0.35" r="45" stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1" />
                      <circle cx="160" cy="80" fill="none" opacity="0.25" r="95" stroke="#38bdf8" strokeDasharray="4 4" strokeWidth="1" />
                      <circle cx="160" cy="80" fill="none" opacity="0.15" r="160" stroke="#38bdf8" strokeDasharray="5 5" strokeWidth="1" />
                      {/* Glowing Active Dispatch Routes */}
                      <path d="M 160,80 C 260,110 440,150 560,170" fill="none" filter="url(#glow-neon)" opacity="0.9" stroke="#38bdf8" strokeDasharray="8 5" strokeWidth="3.5" />
                      <path d="M 160,80 C 280,140 450,230 680,250" fill="none" filter="url(#glow-neon)" opacity="0.9" stroke="#22d3ee" strokeDasharray="8 5" strokeWidth="3.5" />
                      {/* Vehicle Courier Nodes in Transit */}
                      <circle cx="340" cy="120" fill="#38bdf8" filter="url(#glow-neon)" r="5" />
                      <circle cx="440" cy="205" fill="#22d3ee" filter="url(#glow-neon)" r="5" />
                    </svg>

                    {/* Node 1: Origin */}
                    <div className="absolute top-6 left-8 bg-[#0A1B30]/95 border border-amber-500/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-space-xs z-10">
                      <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <span className="material-symbols-outlined text-[18px]">restaurant</span>
                      </div>
                      <div>
                        <div className="font-label-sm text-label-sm font-bold text-amber-300">Marriott Regency (Origin)</div>
                        <div className="font-body-sm text-body-sm text-slate-400 font-mono">80 Trays Packed &amp; Ready</div>
                      </div>
                    </div>

                    {/* Node 2: Destination 1 */}
                    <div className="absolute bottom-8 right-12 bg-[#0A1B30]/95 border border-cyan-500/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.3)] flex items-center gap-space-xs z-10">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                        <span className="material-symbols-outlined text-[18px]">warehouse</span>
                      </div>
                      <div>
                        <div className="font-label-sm text-label-sm font-bold text-cyan-300">Shelter Hope (Dest. 1)</div>
                        <div className="font-body-sm text-body-sm text-slate-400 font-mono">ETA 14 min • Van #09</div>
                      </div>
                    </div>

                    {/* Node 3: Destination 2 */}
                    <div className="absolute top-1/2 right-1/4 bg-[#0A1B30]/95 border border-cyan-500/50 backdrop-blur-md px-3 py-2 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.3)] flex items-center gap-space-xs z-10">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                        <span className="material-symbols-outlined text-[18px]">church</span>
                      </div>
                      <div>
                        <div className="font-label-sm text-label-sm font-bold text-cyan-300">St. Jude Mission (Dest. 2)</div>
                        <div className="font-body-sm text-body-sm text-slate-400 font-mono">ETA 21 min • E-Bike Elena</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Gauges & Live Stream (Col 4) */}
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                
                {/* Demand Gauges & Community Capacity Heatmap */}
                <div className="bg-[#10233D] border border-[#1A365D] rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-label-sm text-label-sm uppercase text-slate-400">Community Capacity</span>
                      <h3 className="font-headline-sm text-headline-sm text-white font-bold">Demand Gauges</h3>
                    </div>
                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">analytics</span>
                  </div>
                  <div className="space-y-space-md">
                    <div>
                      <div className="flex justify-between items-center text-body-sm font-body-sm mb-1">
                        <span className="font-semibold text-slate-200">Shelter Hope Downtown</span>
                        <span className="font-bold text-red-400 font-mono flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span> 94% Critical
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#071426] rounded-full overflow-hidden border border-[#1A365D]">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(239,68,68,0.7)]" style={{ width: '94%' }}></div>
                      </div>
                      <span className="font-body-sm text-body-sm text-slate-400 mt-1 block">Urgent need for warm calorie-dense meals.</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-body-sm font-body-sm mb-1">
                        <span className="font-semibold text-slate-200">St. Jude Community Mission</span>
                        <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span> 78% High
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#071426] rounded-full overflow-hidden border border-[#1A365D]">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(251,191,36,0.7)]" style={{ width: '78%' }}></div>
                      </div>
                      <span className="font-body-sm text-body-sm text-slate-400 mt-1 block">Refrigerated staging docks verified open.</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-body-sm font-body-sm mb-1">
                        <span className="font-semibold text-slate-200">Eastside Family Pantry</span>
                        <span className="font-bold text-emerald-400 font-mono flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 42% Normal
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#071426] rounded-full overflow-hidden border border-[#1A365D]">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(52,211,153,0.7)]" style={{ width: '42%' }}></div>
                      </div>
                      <span className="font-body-sm text-body-sm text-slate-400 mt-1 block">Surplus buffer threshold normal.</span>
                    </div>
                  </div>
                  <div className="p-space-md bg-[#0A1B30] border border-[#1A365D] rounded-xl">
                    <span className="font-mono text-label-sm text-label-sm text-slate-400 uppercase">Aggregate Hunger Alleviation Rate</span>
                    <div className="flex items-baseline gap-space-xs mt-1">
                      <span className="font-headline-lg text-headline-lg font-bold text-white font-mono">1,420</span>
                      <span className="font-body-sm text-body-sm text-slate-400">meals saved today</span>
                    </div>
                    <div className="flex items-center gap-space-xs mt-2 text-emerald-400 font-label-md text-label-md font-semibold">
                      <span className="material-symbols-outlined text-[18px]">trending_up</span>
                      <span>+18.4% vs. previous 7-day average</span>
                    </div>
                  </div>
                </div>

                {/* Live Telemetry Stream */}
                <div className="bg-[#10233D] border border-[#1A365D] rounded-xl p-space-lg shadow-sm flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-space-md">
                    <div>
                      <span className="font-mono text-label-sm text-label-sm uppercase text-slate-400">Real-Time Event Stream</span>
                      <h3 className="font-headline-sm text-headline-sm text-white font-bold">Live Activity Log</h3>
                    </div>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                    </span>
                  </div>
                  <div className="space-y-space-md overflow-y-auto max-h-[380px] pr-1 font-mono" id="activity-log">
                    {activityLogs.map((item) => (
                      <div key={item.id} className="flex gap-space-sm items-start">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                          item.isNew
                            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                            : item.icon === 'notifications_active'
                            ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                            : item.icon === 'sensors'
                            ? 'bg-[#0A1B30] border-[#1A365D] text-amber-400'
                            : item.icon === 'done_all'
                            ? 'bg-[#0A1B30] border-[#1A365D] text-emerald-400'
                            : 'bg-[#0A1B30] border-[#1A365D] text-cyan-400'
                        }`}>
                          <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                        </div>
                        <div>
                          <p className={`font-body-sm text-body-sm font-semibold ${item.isNew ? 'text-emerald-300' : 'text-slate-100'}`}>
                            {item.title}
                          </p>
                          <span className="font-body-sm text-body-sm text-slate-400">{item.meta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-space-md pt-space-sm">
                    <button
                      className="w-full py-2.5 rounded-lg bg-[#0A1B30] hover:bg-[#1A365D] border border-[#1A365D] text-cyan-300 font-label-md text-label-md transition-colors flex items-center justify-center gap-space-xs font-mono cursor-pointer"
                      onClick={handleExportLedger}
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export Compliance Audit Ledger (.JSON)
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Batches Card */}
            <div className="bg-[#0A1B30] border border-[#1A365D] rounded-xl p-space-lg shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-md">
                <div>
                  <span className="font-mono text-label-sm text-label-sm uppercase text-slate-400">High Volume Verification</span>
                  <h3 className="font-headline-sm text-headline-sm text-white font-bold">Nearby Active Batches Awaiting Orchestration</h3>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-body-sm text-body-sm text-cyan-400 font-mono">Live queue: 3 pending</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                
                {/* Batch 1 */}
                <div className="bg-[#10233D] border border-[#1A365D] rounded-xl p-space-md flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-[#0A1B30] border border-[#1A365D] text-cyan-300 font-bold">Bakery &amp; Breads</span>
                      <span className="font-label-sm text-label-sm text-amber-400 font-mono font-bold">1h 15m remaining</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-white font-bold">Whole Foods Market Tribeca</h4>
                    <p className="font-body-sm text-body-sm text-slate-400 mt-1">110 Artisanal Loaves &amp; Pastries (Dry shelf-stable ambient)</p>
                  </div>
                  <div className="mt-space-md flex items-center justify-between pt-space-xs">
                    <span className="font-label-md text-label-md font-bold text-cyan-300 font-mono">EST. 110 Portions</span>
                    <button
                      className={`px-3 py-1.5 rounded-lg border font-label-sm text-label-sm font-bold shadow-sm transition-all cursor-pointer ${
                        matchedQueues['Whole Foods Market Tribeca']
                          ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                          : 'bg-[#0A1B30] border-[#1A365D] text-cyan-300 hover:text-white hover:bg-cyan-950'
                      }`}
                      onClick={() => handleQueueMatch('Whole Foods Market Tribeca', '110 Portions')}
                    >
                      {matchedQueues['Whole Foods Market Tribeca'] ? 'Queued ✓' : 'Queue Match'}
                    </button>
                  </div>
                </div>

                {/* Batch 2 */}
                <div className="bg-[#10233D] border border-[#1A365D] rounded-xl p-space-md flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-[#0A1B30] border border-[#1A365D] text-cyan-300 font-bold">Organic Produce</span>
                      <span className="font-label-sm text-label-sm text-amber-400 font-mono font-bold">2h 40m remaining</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-white font-bold">Sweetgreen Midtown East</h4>
                    <p className="font-body-sm text-body-sm text-slate-400 mt-1">65 lbs Fresh Greens, Roasted Root Vegetables &amp; Bowls</p>
                  </div>
                  <div className="mt-space-md flex items-center justify-between pt-space-xs">
                    <span className="font-label-md text-label-md font-bold text-cyan-300 font-mono">EST. 85 Portions</span>
                    <button
                      className={`px-3 py-1.5 rounded-lg border font-label-sm text-label-sm font-bold shadow-sm transition-all cursor-pointer ${
                        matchedQueues['Sweetgreen Midtown East']
                          ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                          : 'bg-[#0A1B30] border-[#1A365D] text-cyan-300 hover:text-white hover:bg-cyan-950'
                      }`}
                      onClick={() => handleQueueMatch('Sweetgreen Midtown East', '85 Portions')}
                    >
                      {matchedQueues['Sweetgreen Midtown East'] ? 'Queued ✓' : 'Queue Match'}
                    </button>
                  </div>
                </div>

                {/* Batch 3 */}
                <div className="bg-[#10233D] border border-[#1A365D] rounded-xl p-space-md flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-[#0A1B30] border border-[#1A365D] text-cyan-300 font-bold">Chilled Catering</span>
                      <span className="font-label-sm text-label-sm text-amber-400 font-mono font-bold">3h 10m remaining</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-white font-bold">Google NYC 9th Ave Cafeteria</h4>
                    <p className="font-body-sm text-body-sm text-slate-400 mt-1">140 Gourmet Bento Wraps &amp; Mediterranean Bowls</p>
                  </div>
                  <div className="mt-space-md flex items-center justify-between pt-space-xs">
                    <span className="font-label-md text-label-md font-bold text-cyan-300 font-mono">EST. 140 Portions</span>
                    <button
                      className={`px-3 py-1.5 rounded-lg border font-label-sm text-label-sm font-bold shadow-sm transition-all cursor-pointer ${
                        matchedQueues['Google NYC 9th Ave Cafeteria']
                          ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400'
                          : 'bg-[#0A1B30] border-[#1A365D] text-cyan-300 hover:text-white hover:bg-cyan-950'
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
      <footer className="w-full bg-[#0A1B30] border-t border-[#1A365D] mt-space-xl py-space-xl">
        <div className="max-w-[1440px] mx-auto px-gutter">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="FOODLOOP Brand Logo"
                className="h-6 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-cyan-400 font-extrabold tracking-tight">FOODLOOP</span>
              <span className="font-body-sm text-body-sm text-slate-400 ml-space-sm hidden sm:inline">Every Meal Deserves a Chance.</span>
            </div>
            <div className="flex items-center gap-space-lg font-label-md text-label-md text-slate-400">
              <a className="hover:text-cyan-300 transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-cyan-300 transition-colors" href="#">Fintech Ledger Terms</a>
              <a className="hover:text-cyan-300 transition-colors" href="#">API Docs</a>
              <a className="hover:text-cyan-300 transition-colors" href="#">Support</a>
            </div>
          </div>
          <div className="mt-space-lg text-center md:text-left font-body-sm text-body-sm text-slate-500 font-mono">
            © 2025 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement.
          </div>
        </div>
      </footer>
    </div>
  );
};
