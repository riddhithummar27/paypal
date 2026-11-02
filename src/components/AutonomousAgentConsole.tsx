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
  // Countdown timer state
  const [secondsLeft, setSecondsLeft] = useState(43 * 60 + 42);
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [isRouteLocked, setIsRouteLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // High-volume queue matched state
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

  // Interval timer
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
      addLog('Manual Override Active (Autonomous Rule #41 Paused)', 'Just now • Operator locked autonomous trigger', 'lock');
      showToast('Manual override engaged. Autonomous dispatches paused.');
    } else {
      addLog('Manual Override Released (Autonomous Redistribution Resumed)', 'Just now • Node engine returned to auto mode', 'lock_open');
      showToast('Manual override disengaged. Autonomous engine running.');
    }
  };

  const handleForceDispatch = () => {
    if (isDispatched) return;
    setIsDispatched(true);
    addLog('Manual Force Dispatch executed by Operator', 'Just now • Dispatch tokens confirmed #FL-8842', 'rocket_launch');
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
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-2xl border border-secondary-fixed/30 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,48,135,0.06)]">
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
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">FOODLOOP</span>
            </a>
            <nav className="hidden xl:flex items-center gap-space-md" data-active-classes="text-primary font-bold">
              <a
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate?.('home')}
              >
                Home
              </a>
              <a
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate?.('explore-food')}
              >
                Explore Food
              </a>
              <a
                aria-current="page"
                className="transition-colors py-space-xs px-space-xs text-primary font-bold cursor-pointer"
                onClick={() => onNavigate?.('ai-rescue-agent')}
              >
                AI Rescue Agent
              </a>
              <a
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate?.('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate?.('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate?.('impact')}
              >
                Impact
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-space-sm justify-end flex-1 max-w-2xl">
            <div className="relative hidden md:block w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-9 pr-space-md bg-surface-container-low rounded-lg text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all"
                placeholder="Search rescued batches, NGOs, donors..."
                type="text"
              />
            </div>
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                value={activeRole}
                onChange={(e) => setActiveRole?.(e.target.value)}
                className="appearance-none h-10 pl-space-sm pr-space-lg bg-surface-container-low font-label-md text-label-md text-primary font-bold rounded-lg cursor-pointer focus:outline-none"
              >
                <option value="donor">Role: Donor</option>
                <option value="recipient">Role: Recipient</option>
                <option value="ngo">Role: NGO Hub</option>
                <option value="admin">Role: Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
            <button
              aria-label="Toggle Color Scheme"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">light_mode</span>
            </button>
            <button
              aria-label="Open Sponsors"
              onClick={onOpenSponsors}
              className="h-10 px-3 flex items-center justify-center rounded-lg bg-[#ffc439] hover:bg-[#f2ba36] text-[#001435] font-black text-xs transition-all shadow-sm cursor-pointer"
              type="button"
            >
              Sponsors (5)
            </button>
            <button
              aria-label="Notifications"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
            </button>
            <div className="flex items-center gap-space-xs pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"
              />
              <span className="material-symbols-outlined text-outline text-[18px] hidden sm:block cursor-pointer hover:text-primary transition-colors">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full pt-16 bg-background flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1440px] mx-auto px-gutter py-space-md flex flex-col gap-space-lg">
            
            {/* Top Engine Status Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
              <div className="flex items-center gap-space-md">
                <div className="relative w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-md overflow-hidden">
                  <svg
                    className="w-7 h-7 text-secondary-fixed"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.5"
                    viewBox="0 0 48 48"
                  >
                    <circle className="opacity-25" cx="24" cy="24" r="18" />
                    <path d="M15 24c0-4 4-8 9-8s9 8 9 8-4 8-9 8-9-4-9-8z" />
                    <circle cx="24" cy="7" fill="currentColor" r="2.5" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-md text-headline-md text-primary tracking-tight">
                      AI Autonomous Rescue Agent
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-primary font-label-sm text-label-sm uppercase tracking-wider">
                      v2.4 Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                      REAL-TIME MATCHING DOCK ONLINE • 14 NODES ACTIVE
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="bg-surface-container-low px-space-md py-2 rounded-lg flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                  <div>
                    <div className="font-label-sm text-label-sm text-outline">AUTO DISPATCH</div>
                    <div className="font-label-md text-label-md text-primary">Autonomous Rule #41</div>
                  </div>
                </div>
                <button
                  onClick={handleManualOverrideToggle}
                  className={`h-11 px-space-md rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-space-xs shadow-sm cursor-pointer ${
                    isOverrideActive
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container hover:bg-surface-container-high text-primary'
                  }`}
                  id="manual-override-btn"
                >
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  {isOverrideActive ? 'Override Active (Hold Auto)' : 'Manual Override'}
                </button>
                <button
                  onClick={handleForceDispatch}
                  className={`h-11 px-space-lg rounded-lg font-label-lg text-label-lg shadow-md transition-all flex items-center gap-space-xs cursor-pointer ${
                    isDispatched
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary hover:bg-primary-container text-on-primary'
                  }`}
                  id="instant-dispatch-btn"
                >
                  {isDispatched ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                      Dispatch Confirmed
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                      Execute Force Dispatch
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Emergency Operation Banner */}
            <div className="relative overflow-hidden bg-primary text-on-primary rounded-xl p-space-lg shadow-lg">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-secondary-container opacity-20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-tertiary opacity-30 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 backdrop-blur-md flex items-center justify-center shrink-0 text-secondary-fixed">
                    <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm uppercase tracking-wide">
                        High Priority Active
                      </span>
                      <span className="font-label-md text-label-md text-secondary-fixed">Operation #FL-8842</span>
                      <span className="text-on-primary/60 font-body-sm text-body-sm">
                        • Batch Verified by Marriott Regency Chef Lead
                      </span>
                    </div>
                    <h2 className="font-headline-md text-headline-md text-on-primary mt-1">
                      80 Ready-to-Eat Gourmet Hot Meals Available
                    </h2>
                    <p className="font-body-md text-body-md text-on-primary/80 mt-1 max-w-3xl">
                      Strict cold-chain &amp; thermal window compliance required. Mandatory custody release prior to 8:30 PM EDT.
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-xl p-space-md flex items-center justify-between lg:justify-end gap-space-lg shrink-0">
                  <div className="text-left">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed block">
                      Countdown Window
                    </span>
                    <div className="font-headline-lg text-headline-lg font-bold text-on-primary tracking-tight" id="countdown-timer">
                      {formatTimer(secondsLeft)}
                    </div>
                    <span className="font-body-sm text-body-sm text-on-primary/70">Minutes until perish margin</span>
                  </div>
                  <div className="h-10 w-px bg-on-primary/20"></div>
                  <div className="text-left">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed block">
                      Safety Score
                    </span>
                    <div className="font-headline-lg text-headline-lg font-bold text-on-primary tracking-tight">98.4%</div>
                    <span className="font-body-sm text-body-sm text-on-primary/70">ISO HACCP Certified</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 w-full bg-surface-container-lowest/15 rounded-full h-1.5 mt-space-md overflow-hidden">
                <div
                  className="bg-secondary-fixed h-full rounded-full transition-all duration-1000"
                  style={{ width: '72%' }}
                ></div>
              </div>
            </div>

            {/* Split Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                
                {/* 5-Stage Autonomous Redistribution Sequence */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">
                        Automated Decision Pipeline
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        5-Stage Autonomous Redistribution Sequence
                      </h3>
                    </div>
                    <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-secondary-fixed text-primary font-bold">
                      Pipeline Stage 4 of 5 Running
                    </span>
                  </div>

                  <div className="relative flex items-center justify-between px-2 pt-space-xs pb-space-sm overflow-x-auto">
                    <div className="absolute left-6 right-6 top-7 h-1 bg-surface-container -z-0"></div>
                    <div
                      className="absolute left-6 top-7 h-1 bg-secondary -z-0 transition-all duration-500"
                      style={{ width: '75%' }}
                    ></div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-bold text-center mt-1">1. Ingest</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">radar</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-bold text-center mt-1">2. Geospatial</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">groups</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-bold text-center mt-1">3. NGO Capacity</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md animate-pulse">
                        <span className="material-symbols-outlined text-[18px]">call_split</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-bold text-center mt-1">4. Allocation</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className="w-10 h-10 rounded-full bg-surface-container text-outline flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-outline text-center mt-1">5. Dispatch</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                    <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Stage 1 Analysis</span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-bold">
                            Passed
                          </span>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm text-primary mt-1">Ingestion &amp; Sensor Metric</h4>
                        <div className="mt-space-sm space-y-2">
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-on-surface-variant">Core Temp (Probe C-2)</span>
                            <span className="font-bold text-primary">142.8°F (Safe Hot Holding)</span>
                          </div>
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-on-surface-variant">Dietary Classification</span>
                            <span className="font-bold text-primary">Halal, Nut-Free Certified</span>
                          </div>
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-on-surface-variant">Donor Reliability Score</span>
                            <span className="font-bold text-primary">99.2% (Tier 1 Gold Donor)</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-space-md pt-space-xs bg-surface-container-lowest p-space-xs rounded-lg flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">
                          Automatic chain-of-custody smart voucher minted.
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Stage 2 &amp; 3 Scanning</span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-primary font-label-sm text-label-sm font-bold">
                            Radius: 3.5 km
                          </span>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm text-primary mt-1">Geospatial NGO Match</h4>
                        <div className="mt-space-sm space-y-2">
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-on-surface-variant">Qualified Receivers</span>
                            <span className="font-bold text-primary">4 Facilities Screened</span>
                          </div>
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-on-surface-variant">Acceptance Probability</span>
                            <span className="font-bold text-secondary">97.8% Confidence</span>
                          </div>
                          <div className="flex items-center justify-between text-body-sm font-body-sm">
                            <span className="text-on-surface-variant">Volunteer Courier Availability</span>
                            <span className="font-bold text-primary">3 Drivers in Transit Orbit</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-space-md pt-space-xs bg-surface-container-lowest p-space-xs rounded-lg flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[18px]">my_location</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">
                          Traffic index factored: Low friction on East Corridor.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Destination Partitioning Split */}
                  <div className="bg-surface-container-high rounded-xl p-space-md mt-space-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                      <div>
                        <span className="font-label-sm text-label-sm text-outline uppercase">AI Optimal Redistribution Split</span>
                        <h4 className="font-headline-sm text-headline-sm text-primary">Multi-Destination Partitioning</h4>
                      </div>
                      <span className="px-3 py-1 bg-surface-container-lowest rounded-full font-label-sm text-label-sm font-bold text-primary">
                        Zero Waste Objective
                      </span>
                    </div>

                    <div className="mt-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-label-lg text-label-lg font-bold text-primary">Shelter Hope Downtown</span>
                          <span className="px-2 py-0.5 rounded bg-secondary-fixed text-primary font-bold font-label-sm text-label-sm">
                            50 Meals
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">1.2 km away • Current occupancy 94%</p>
                        <div className="mt-space-sm flex items-center justify-between font-body-sm text-body-sm">
                          <span className="text-outline">Assigned Carrier</span>
                          <span className="font-semibold text-primary">Van Unit #09 (Carlos M.)</span>
                        </div>
                        <div className="w-full bg-surface-container-low h-2 rounded-full mt-2 overflow-hidden">
                          <div className="bg-secondary h-full rounded-full" style={{ width: '62.5%' }}></div>
                        </div>
                      </div>

                      <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-label-lg text-label-lg font-bold text-primary">St. Jude Community Mission</span>
                          <span className="px-2 py-0.5 rounded bg-secondary-fixed text-primary font-bold font-label-sm text-label-sm">
                            30 Meals
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">2.4 km away • Dinner service starts in 50m</p>
                        <div className="mt-space-sm flex items-center justify-between font-body-sm text-body-sm">
                          <span className="text-outline">Assigned Carrier</span>
                          <span className="font-semibold text-primary">Cargo E-Bike (Elena K.)</span>
                        </div>
                        <div className="w-full bg-surface-container-low h-2 rounded-full mt-2 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '37.5%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pt-space-xs">
                      <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-secondary text-[20px]">account_balance_wallet</span>
                        <span>Automated volunteer fuel &amp; time settlement staged via FOODLOOP Instant Ledger.</span>
                      </div>
                      <button
                        onClick={handleLockRoute}
                        className={`px-space-md py-2 font-label-md text-label-md rounded-lg transition-all cursor-pointer ${
                          isRouteLocked
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-primary text-on-primary hover:bg-primary-container'
                        }`}
                      >
                        {isRouteLocked ? 'Route Authorized ✓' : 'Lock Allocation & Authorize Route'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logistical Vector Map */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
                  <div className="flex items-center justify-between mb-space-md">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">
                        Logistical Vector Map
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Transit Orbit &amp; GPS Dispatch Routing
                      </h3>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Donor
                      </span>
                      <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Recipients
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-900 border border-surface-container">
                    {/* SVG Vector Transit Grid Map */}
                    <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3959b0" strokeWidth="0.75" opacity="0.3" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      {/* Transit Arteries */}
                      <path
                        d="M 120 70 Q 280 140 540 230"
                        fill="none"
                        stroke="#0872e2"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        className="animate-pulse"
                      />
                      <path
                        d="M 120 70 Q 320 60 420 150"
                        fill="none"
                        stroke="#b4c5ff"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                      />
                    </svg>

                    {/* Origin Marker */}
                    <div className="absolute top-6 left-8 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md flex items-center gap-space-xs z-10 border border-secondary/20">
                      <span className="material-symbols-outlined text-secondary text-[20px]">restaurant</span>
                      <div>
                        <div className="font-label-sm text-label-sm font-bold text-primary">Marriott Regency (Origin)</div>
                        <div className="font-body-sm text-body-sm text-outline">80 Trays Packed &amp; Ready</div>
                      </div>
                    </div>

                    {/* Dest 1 Marker */}
                    <div className="absolute bottom-8 right-12 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md flex items-center gap-space-xs z-10 border border-primary/20">
                      <span className="material-symbols-outlined text-primary text-[20px]">warehouse</span>
                      <div>
                        <div className="font-label-sm text-label-sm font-bold text-primary">Shelter Hope (Dest. 1)</div>
                        <div className="font-body-sm text-body-sm text-outline">ETA 14 min • Van #09</div>
                      </div>
                    </div>

                    {/* Dest 2 Marker */}
                    <div className="absolute top-1/2 right-1/4 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md flex items-center gap-space-xs z-10 border border-primary/20">
                      <span className="material-symbols-outlined text-primary text-[20px]">church</span>
                      <div>
                        <div className="font-label-sm text-label-sm font-bold text-primary">St. Jude Mission (Dest. 2)</div>
                        <div className="font-body-sm text-body-sm text-outline">ETA 21 min • E-Bike Elena</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                
                {/* Community Capacity Demand Gauges */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase text-outline">Community Capacity</span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">Demand Gauges</h3>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[20px]">analytics</span>
                  </div>

                  <div className="space-y-space-md">
                    <div>
                      <div className="flex justify-between items-center text-body-sm font-body-sm mb-1">
                        <span className="font-semibold text-primary">Shelter Hope Downtown</span>
                        <span className="font-bold text-secondary">94% Capacity</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-700" style={{ width: '94%' }}></div>
                      </div>
                      <span className="font-body-sm text-body-sm text-outline mt-1 block">
                        Urgent need for warm calorie-dense meals.
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-body-sm font-body-sm mb-1">
                        <span className="font-semibold text-primary">St. Jude Community Mission</span>
                        <span className="font-bold text-secondary">78% Capacity</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-700" style={{ width: '78%' }}></div>
                      </div>
                      <span className="font-body-sm text-body-sm text-outline mt-1 block">
                        Refrigerated staging docks verified open.
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-body-sm font-body-sm mb-1">
                        <span className="font-semibold text-primary">Eastside Family Pantry</span>
                        <span className="font-bold text-outline">42% Capacity</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="bg-outline h-full rounded-full transition-all duration-700" style={{ width: '42%' }}></div>
                      </div>
                      <span className="font-body-sm text-body-sm text-outline mt-1 block">
                        Surplus buffer threshold normal.
                      </span>
                    </div>
                  </div>

                  <div className="p-space-md bg-surface-container-low rounded-xl">
                    <span className="font-label-sm text-label-sm text-outline uppercase">
                      Aggregate Hunger Alleviation Rate
                    </span>
                    <div className="flex items-baseline gap-space-xs mt-1">
                      <span className="font-headline-lg text-headline-lg font-bold text-primary">1,420</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">meals saved today</span>
                    </div>
                    <div className="flex items-center gap-space-xs mt-2 text-secondary font-label-md text-label-md font-semibold">
                      <span className="material-symbols-outlined text-[18px]">trending_up</span>
                      <span>+18.4% vs. previous 7-day average</span>
                    </div>
                  </div>
                </div>

                {/* Real-Time Event Stream / Live Activity Log */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-space-md">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase text-outline">Real-Time Event Stream</span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">Live Activity Log</h3>
                    </div>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                    </span>
                  </div>

                  <div className="space-y-space-md overflow-y-auto max-h-[380px] pr-1" id="activity-log">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex gap-space-sm items-start">
                        <div className="w-8 h-8 rounded-full bg-secondary-fixed text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">{log.icon}</span>
                        </div>
                        <div>
                          <p className="font-body-sm text-body-sm text-on-surface font-semibold">{log.title}</p>
                          <span className="font-body-sm text-body-sm text-outline">{log.meta}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-space-md pt-space-sm">
                    <button
                      onClick={handleExportLedger}
                      className="w-full py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export Compliance Audit Ledger (.JSON)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* High Volume Verification Queue */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-md">
                <div>
                  <span className="font-label-sm text-label-sm uppercase text-outline">High Volume Verification</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary">
                    Nearby Active Batches Awaiting Orchestration
                  </h3>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-body-sm text-body-sm text-outline">Live queue: 3 pending</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Batch 1 */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-bold">
                        Bakery &amp; Breads
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary font-bold">1h 15m remaining</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-primary">Whole Foods Market Tribeca</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      110 Artisanal Loaves &amp; Pastries (Dry shelf-stable ambient)
                    </p>
                  </div>
                  <div className="mt-space-md flex items-center justify-between pt-space-xs">
                    <span className="font-label-md text-label-md font-bold text-primary">EST. 110 Portions</span>
                    <button
                      onClick={() => handleQueueMatch('Whole Foods Market Tribeca', '110 Portions')}
                      className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold shadow-sm transition-all cursor-pointer ${
                        matchedQueues['Whole Foods Market Tribeca']
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-lowest text-secondary hover:bg-surface-container'
                      }`}
                    >
                      {matchedQueues['Whole Foods Market Tribeca'] ? 'Matched ✓' : 'Queue Match'}
                    </button>
                  </div>
                </div>

                {/* Batch 2 */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-bold">
                        Organic Produce
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary font-bold">2h 40m remaining</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-primary">Sweetgreen Midtown East</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      65 lbs Fresh Greens, Roasted Root Vegetables &amp; Bowls
                    </p>
                  </div>
                  <div className="mt-space-md flex items-center justify-between pt-space-xs">
                    <span className="font-label-md text-label-md font-bold text-primary">EST. 85 Portions</span>
                    <button
                      onClick={() => handleQueueMatch('Sweetgreen Midtown East', '85 Portions')}
                      className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold shadow-sm transition-all cursor-pointer ${
                        matchedQueues['Sweetgreen Midtown East']
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-lowest text-secondary hover:bg-surface-container'
                      }`}
                    >
                      {matchedQueues['Sweetgreen Midtown East'] ? 'Matched ✓' : 'Queue Match'}
                    </button>
                  </div>
                </div>

                {/* Batch 3 */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-bold">
                        Chilled Catering
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary font-bold">3h 10m remaining</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-primary">Google NYC 9th Ave Cafeteria</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      140 Gourmet Bento Wraps &amp; Mediterranean Bowls
                    </p>
                  </div>
                  <div className="mt-space-md flex items-center justify-between pt-space-xs">
                    <span className="font-label-md text-label-md font-bold text-primary">EST. 140 Portions</span>
                    <button
                      onClick={() => handleQueueMatch('Google NYC 9th Ave Cafeteria', '140 Portions')}
                      className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold shadow-sm transition-all cursor-pointer ${
                        matchedQueues['Google NYC 9th Ave Cafeteria']
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-lowest text-secondary hover:bg-surface-container'
                      }`}
                    >
                      {matchedQueues['Google NYC 9th Ave Cafeteria'] ? 'Matched ✓' : 'Queue Match'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,48,135,0.03)] mt-space-xl py-space-xl">
        <div className="max-w-[1440px] mx-auto px-gutter">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="FOODLOOP Brand Logo"
                className="h-6 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">FOODLOOP</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant ml-space-sm hidden sm:inline">
                Every Meal Deserves a Chance.
              </span>
            </div>
            <div className="flex items-center gap-space-lg font-label-md text-label-md text-on-surface-variant">
              <a className="hover:text-primary transition-colors cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
              <a className="hover:text-primary transition-colors cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Fintech Ledger Terms
              </a>
              <a className="hover:text-primary transition-colors cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                API Docs
              </a>
              <a className="hover:text-primary transition-colors cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Support
              </a>
            </div>
          </div>
          <div className="mt-space-lg text-center md:text-left font-body-sm text-body-sm text-outline">
            © 2025 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement.
          </div>
        </div>
      </footer>
    </div>
  );
};
