'use client';

import React, { useState } from 'react';

interface NgoHubPageProps {
  onNavigate: (page: string) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  onOpenSponsors?: () => void;
  onClaimBatch?: (batchId: string) => void;
}

interface BatchItem {
  id: string;
  qrCode: string;
  venue: string;
  category: string;
  description: string;
  weight: string;
  portions: string;
  thermalStatus: string;
  thermalIcon: string;
  thermalType: 'hot' | 'chilled' | 'ambient';
  perishTime: string;
  isUrgent?: boolean;
  logisticsStatus: string;
  logisticsType: 'assigned' | 'transit' | 'unclaimed' | 'verified';
  actionType: 'manifest' | 'claim' | 'cert';
  claimed?: boolean;
}

export const NgoHubPage: React.FC<NgoHubPageProps> = ({
  onNavigate,
  activeRole,
  setActiveRole,
  onOpenSponsors,
  onClaimBatch,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterPill, setActiveFilterPill] = useState<string>('all');
  const [manualKey, setManualKey] = useState('');
  const [isSyncingTelemetry, setIsSyncingTelemetry] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<BatchItem | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Table batch rows
  const [batches, setBatches] = useState<BatchItem[]>([
    {
      id: '#FL-9021',
      qrCode: 'QR-09',
      venue: 'Marriott Ballroom Copley',
      category: 'Prepared Entrees',
      description: 'Sous-vide beef & roasted greens',
      weight: '180 kg',
      portions: '450 Portions',
      thermalStatus: '64.8°C HACCP A',
      thermalIcon: 'local_fire_department',
      thermalType: 'hot',
      perishTime: '01h 44m Left',
      isUrgent: true,
      logisticsStatus: 'Fleet Assigned (Bike #02)',
      logisticsType: 'assigned',
      actionType: 'manifest',
    },
    {
      id: '#FL-8842',
      qrCode: 'QR-08',
      venue: 'Whole Foods Market River St',
      category: 'Organic Produce',
      description: 'Crisper greens, citrus, root veg',
      weight: '320 kg',
      portions: '8 Carts',
      thermalStatus: '3.8°C HACCP A',
      thermalIcon: 'ac_unit',
      thermalType: 'chilled',
      perishTime: '06h 15m Left',
      logisticsStatus: 'In Transit (Truck #01)',
      logisticsType: 'transit',
      actionType: 'manifest',
    },
    {
      id: '#FL-8819',
      qrCode: 'URGENT',
      venue: 'Seaport Convention Center',
      category: 'Bakery & Pastry Trays',
      description: 'Croissants, brioche & artisanal loaves',
      weight: '140 kg',
      portions: '600 Portions',
      thermalStatus: 'Ambient (19°C)',
      thermalIcon: 'eco',
      thermalType: 'ambient',
      perishTime: '00h 52m Critical',
      isUrgent: true,
      logisticsStatus: 'Unclaimed Open Pool',
      logisticsType: 'unclaimed',
      actionType: 'claim',
    },
    {
      id: '#FL-8790',
      qrCode: 'QR-06',
      venue: 'Harvard Dining Services',
      category: 'Chilled Protein Stews',
      description: 'Blast-chilled poultry & lentils',
      weight: '220 kg',
      portions: '550 Portions',
      thermalStatus: '2.4°C Validated',
      thermalIcon: 'ac_unit',
      thermalType: 'chilled',
      perishTime: '04h 30m Left',
      logisticsStatus: 'Handshake Verified',
      logisticsType: 'verified',
      actionType: 'cert',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleSyncTelemetry = () => {
    setIsSyncingTelemetry(true);
    setTimeout(() => {
      setIsSyncingTelemetry(false);
      showToast('Telemetry Synced: 14 Active Nodes Nominal • Mesh Latency: 18ms');
    }, 900);
  };

  const handleClaimBatchAction = async (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              claimed: true,
              logisticsStatus: 'Claimed by Hub (In Transit)',
              logisticsType: 'transit',
            }
          : b
      )
    );

    try {
      await fetch('/api/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId,
          foodTitle: 'Seaport Convention Center Bakery',
          donorName: 'Seaport Convention Center',
          shelterName: 'Greater Boston Food Alliance Hub',
          portions: 600,
          urgency: 'Critical (<60m)',
        }),
      });
    } catch {
      // Local fallback
    }

    if (onClaimBatch) {
      onClaimBatch(batchId);
    }

    showToast(`Batch ${batchId} claimed! Courier dispatched to Seaport loading dock.`);
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualKey.trim()) return;

    try {
      const res = await fetch('/api/custody/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotId: manualKey,
          verifier: 'Tyler Chen (Dock Lead • Gate Master)',
        }),
      });
      const data = await res.json();
      showToast(data.message || `Handover key "${manualKey}" verified. Escrow release confirmed.`);
    } catch {
      showToast(`Handover key "${manualKey}" verified. Escrow release confirmed.`);
    }
    setManualKey('');
  };

  const handleNfcScan = async () => {
    try {
      const res = await fetch('/api/custody/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotId: 'BOS-DOCK-NFC-01',
          verifier: 'RFID NFC Dock Scanner Bay A',
        }),
      });
      const data = await res.json();
      showToast(data.message || 'NFC Badge Detected: Handover Authenticated & Points Credited.');
    } catch {
      showToast('NFC Badge Detected: Handover Authenticated & Points Credited.');
    }
  };

  const handleExportCsv = () => {
    const headers = 'BatchID,Venue,Category,Quantity,ThermalStatus,PerishWindow,LogisticsStatus\n';
    const rows = batches
      .map(
        (b) =>
          `"${b.id}","${b.venue}","${b.category}","${b.weight} (${b.portions})","${b.thermalStatus}","${b.perishTime}","${b.logisticsStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FOODLOOP-Bulk-Rescue-Ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Bulk Rescue Ledger exported to CSV.');
  };

  const filteredBatches = batches.filter((b) => {
    if (activeFilterPill === 'chilled' && b.thermalType !== 'chilled') return false;
    if (activeFilterPill === 'critical' && !b.isUrgent) return false;
    if (activeFilterPill === 'unclaimed' && b.logisticsType !== 'unclaimed' && !b.claimed) return false;
    if (activeFilterPill === 'verified' && b.logisticsType !== 'verified') return false;
    if (
      searchQuery &&
      !b.venue.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-[#f7f9fc] font-sans text-[#191c1e] antialiased min-h-screen flex flex-col selection:bg-[#005ab6]/20 selection:text-[#001d59]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#001d59] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#b4c5ff]/30 flex items-center gap-3 animate-bounce max-w-md">
          <span className="material-symbols-outlined text-[#005ab6] text-[22px]">check_circle</span>
          <span className="font-semibold text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Manifest Modal */}
      {selectedManifest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#001d59]">{selectedManifest.id} Manifest</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#dbe1ff] text-[#001d59] font-bold">
                  {selectedManifest.qrCode}
                </span>
              </div>
              <button
                onClick={() => setSelectedManifest(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#f2f4f7] rounded-lg">
                <span className="text-[#747683] block">Donor Location</span>
                <span className="font-bold text-[#001d59] text-sm">{selectedManifest.venue}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[#f2f4f7] rounded-lg">
                  <span className="text-[#747683] block">Weight / Portions</span>
                  <span className="font-bold text-[#001d59]">{selectedManifest.weight} / {selectedManifest.portions}</span>
                </div>
                <div className="p-2.5 bg-[#f2f4f7] rounded-lg">
                  <span className="text-[#747683] block">Thermal Status</span>
                  <span className="font-bold text-[#005ab6]">{selectedManifest.thermalStatus}</span>
                </div>
              </div>
              <div className="p-3 bg-[#f2f4f7] rounded-lg">
                <span className="text-[#747683] block">Safety &amp; Compliance</span>
                <span className="font-semibold text-emerald-700">ISO HACCP Grade A • Cold-Chain Sensor Verified</span>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedManifest(null)}
                className="px-4 py-2 rounded-lg bg-[#001d59] text-white font-bold text-xs"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Route Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005ab6]">map</span>
                <span className="text-lg font-bold text-[#001d59]">{selectedRoute} GPS Telemetry</span>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="bg-[#f2f4f7] p-4 rounded-xl space-y-3 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-[#747683]">Current Coordinates:</span>
                <span className="font-mono font-bold text-[#001d59]">42.3601° N, 71.0589° W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#747683]">Vehicle Telemetry:</span>
                <span className="font-bold text-emerald-600">IoT Probe Live • Speed: 24 km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#747683]">Destination ETA:</span>
                <span className="font-bold text-[#005ab6]">12 Minutes to Central Dock</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRoute(null)}
                className="px-4 py-2 rounded-lg bg-[#001d59] text-white font-bold text-xs"
              >
                Close Map Track
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,48,135,0.06)] border-b border-slate-100">
        <div className="h-16 max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            {/* Back to Home arrow */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 text-[#001d59] hover:text-[#005ab6] font-medium mr-1 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Home"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="hidden sm:inline text-xs font-semibold">Home</span>
            </button>

            <a
              className="flex items-center gap-2 cursor-pointer"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
            >
              <img
                alt="FOODLOOP Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="text-xl font-bold text-[#001d59] tracking-tight">FOODLOOP</span>
            </a>

            {/* Navigation Links with explicit gap-6 */}
            <nav className="hidden lg:flex items-center gap-6 ml-2">
              <a
                className="text-xs font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate('home')}
              >
                Home
              </a>
              <a
                className="text-xs font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate('explore-food')}
              >
                Explore Food
              </a>
              <a
                className="text-xs font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate('ai-rescue-agent')}
              >
                AI Rescue Agent
              </a>
              <a
                className="text-xs font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                aria-current="page"
                className="text-xs py-1 text-[#001d59] font-bold border-b-2 border-[#001d59] cursor-pointer"
                onClick={() => onNavigate('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="text-xs font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate('impact')}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                className="appearance-none h-10 pl-3 pr-8 bg-[#f2f4f7] text-xs text-[#001d59] font-bold rounded-lg cursor-pointer focus:outline-none border border-slate-200"
                value={activeRole}
                onChange={(e) => setActiveRole?.(e.target.value)}
              >
                <option value="ngo">Role: NGO Hub</option>
                <option value="donor">Role: Donor</option>
                <option value="recipient">Role: Recipient</option>
                <option value="admin">Role: Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#747683] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
            <button
              aria-label="Toggle Color Scheme"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#f2f4f7] text-[#444652] hover:text-[#001d59] hover:bg-[#eceef1] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">light_mode</span>
            </button>
            <button
              aria-label="Notifications"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-[#f2f4f7] text-[#444652] hover:text-[#001d59] hover:bg-[#eceef1] transition-all cursor-pointer"
              type="button"
              onClick={() => showToast('Hub Alert: 4 inbound batches arriving in < 35 mins')}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </button>
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
      <main className="w-full pt-16 bg-[#f7f9fc]">
        <div className="flex flex-col w-full">
          
          {/* Hub Ambient Header & Context Ribbon */}
          <section className="w-full bg-white px-6 py-4 shadow-xs border-b border-slate-200">
            <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Hub Identification */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#dbe1ff] flex items-center justify-center text-[#001d59] shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[32px]">warehouse</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-[#001d59] tracking-tight">
                      Greater Boston Food Alliance
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e6e8eb] text-[#001d59] text-[10px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[14px] text-[#005ab6]">verified</span>
                      Tier 1 • 501(c)(3)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d7e3ff] text-[#001b3f] text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#005ab6] animate-pulse"></span>
                      Node Active: BOS-EAST-09
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#444652]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#747683]">local_shipping</span>
                      6 Fleet Transit Units Live
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#747683]">inventory_2</span>
                      Today's Intake Inflow: <strong className="text-[#001d59] font-semibold">3,420 Meals</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#747683]">
                      <span className="material-symbols-outlined text-[16px]">sensors</span>
                      Mesh Latency: 24ms (Boston East Gateway)
                    </span>
                  </div>
                </div>
              </div>

              {/* Command Actions */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={handleSyncTelemetry}
                  className="h-11 px-4 rounded-lg bg-[#f2f4f7] text-[#001d59] text-xs font-bold hover:bg-[#eceef1] transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isSyncingTelemetry ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  Sync Telemetry
                </button>
                <button
                  onClick={() => showToast('Dispatch Callout: Broadcast sent to 14 volunteer couriers in Boston.')}
                  className="h-11 px-4 rounded-lg bg-[#f2f4f7] text-[#001d59] text-xs font-bold hover:bg-[#eceef1] transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                  Dispatch Callout
                </button>
                <button
                  onClick={() => onNavigate('ai-rescue-agent')}
                  className="h-11 px-5 rounded-lg bg-[#003087] text-white text-xs font-bold hover:bg-[#001d59] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add_box</span>
                  Request Bulk Allocation
                </button>
              </div>
            </div>
          </section>

          {/* Main Console Body */}
          <div className="max-w-[1440px] mx-auto w-full px-6 py-6 flex flex-col gap-8">
            
            {/* 4 Primary Operational Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              
              {/* Metric 1: Inbound Batches */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-[#d7e3ff]/30 rounded-bl-full pointer-events-none"></div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-[#747683] font-bold">Active Inbound Batches</span>
                    <span className="material-symbols-outlined text-[#005ab6] text-[22px]">forklift</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-[#001d59]">8</span>
                    <span className="text-sm text-[#191c1e] font-semibold">Batches En Route</span>
                  </div>
                  <p className="text-xs text-[#ba1a1a] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
                    4 arriving in &lt; 35 mins
                  </p>
                </div>
                <div className="mt-4 pt-2 bg-[#f2f4f7]/70 rounded-lg p-2.5 flex items-center justify-between text-xs">
                  <span className="text-[#444652]">Scheduled Tonnage</span>
                  <span className="font-bold text-[#001d59]">1,830 kg</span>
                </div>
              </div>

              {/* Metric 2: Intake Capacity Matrix */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-[#747683] font-bold">Intake Capacity</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                      84% Saturation
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-extrabold text-[#001d59]">84%</span>
                    <span className="text-xs text-[#747683]">Bay Volume Filled</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-[#444652]">
                        <span>Cold / Freezer 2 (Full)</span>
                        <span className="font-bold text-[#ba1a1a]">91%</span>
                      </div>
                      <div className="h-2 w-full bg-[#eceef1] rounded-full overflow-hidden">
                        <div className="h-full bg-[#ba1a1a] rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-[#444652]">
                        <span>Ambient / Dry Storage</span>
                        <span className="font-bold text-[#005ab6]">68%</span>
                      </div>
                      <div className="h-2 w-full bg-[#eceef1] rounded-full overflow-hidden">
                        <div className="h-full bg-[#0872e2] rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 3: Active Couriers */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-[#747683] font-bold">Active Telemetry Couriers</span>
                    <span className="material-symbols-outlined text-[#005ab6] text-[22px]">directions_bike</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-[#001d59]">14</span>
                    <span className="text-sm text-[#191c1e] font-semibold">Drivers &amp; Couriers</span>
                  </div>
                  <p className="text-xs text-[#444652]">
                    10 Heavy Logistics Vans • 4 E-Cargo Bikes
                  </p>
                </div>
                <div className="mt-4 pt-2 bg-[#f2f4f7]/70 rounded-lg p-2.5 flex items-center justify-between text-xs">
                  <span className="text-[#444652]">Next Dispatch Turnaround</span>
                  <span className="font-bold text-[#001d59]">12 mins (Van #08)</span>
                </div>
              </div>

              {/* Metric 4: Handover Efficiency */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-[#747683] font-bold">Handover Efficiency</span>
                    <span className="material-symbols-outlined text-[#005ab6] text-[22px]">verified_user</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-[#001d59]">98.2%</span>
                    <span className="inline-flex items-center text-[#005ab6] text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span> +1.4% WoW
                    </span>
                  </div>
                  <p className="text-xs text-[#444652]">
                    NFC verified chain-of-custody transfer
                  </p>
                </div>
                <div className="mt-4 pt-2 bg-[#f2f4f7]/70 rounded-lg p-2.5 flex items-center justify-between text-xs">
                  <span className="text-[#444652]">Avg Handshake Dock Time</span>
                  <span className="font-bold text-[#001d59]">4.8 min / vehicle</span>
                </div>
              </div>

            </div>

            {/* Fleet Dispatch & Telemetry Matrix Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#005ab6] animate-pulse"></span>
                    <h2 className="text-lg font-bold text-[#001d59]">Live Fleet Telemetry &amp; Cargo Temperature Stream</h2>
                  </div>
                  <p className="text-xs text-[#444652]">Continuous IoT probe readings &amp; GPS coordinate stream for incoming redistribution units</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#747683] shadow-xs border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#005ab6]"></span> 3 Inbound
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#747683] shadow-xs border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#747683]"></span> 3 Dispatched
                  </span>
                </div>
              </div>

              {/* Telemetry Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Truck #01 Card */}
                <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-[#dbe1ff] flex items-center justify-center text-[#001d59]">
                          <span className="material-symbols-outlined">local_shipping</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#001d59]">Truck #01 (Chilled Hauler)</h3>
                          <p className="text-xs text-[#747683]">Driver: Marcus V. • ID: FL-BOS-TK1</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d7e3ff] text-[#001b3f] text-xs font-bold">
                        ETA 14:18 (12m)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-[#f2f4f7] p-2 rounded-lg">
                        <span className="text-[10px] text-[#747683] block font-semibold">Core Temp Sensor</span>
                        <span className="text-xs text-[#005ab6] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">thermostat</span> 4.2°C HACCP Chilled
                        </span>
                      </div>
                      <div className="bg-[#f2f4f7] p-2 rounded-lg">
                        <span className="text-[10px] text-[#747683] block font-semibold">Payload Mass</span>
                        <span className="text-xs text-[#001d59] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">scale</span> 640 kg (80% Cap)
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#f2f4f7]/60 p-2.5 rounded-lg mb-3 text-xs">
                      <div className="flex items-center justify-between text-[#747683] text-[10px] mb-1">
                        <span>Route Progress</span>
                        <span className="text-[#001d59] font-bold">78% Complete</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#eceef1] rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-[#005ab6] rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <div className="flex items-center gap-1 text-[#191c1e] truncate">
                        <span className="font-semibold text-[#001d59]">South Station Hub</span>
                        <span className="material-symbols-outlined text-[16px] text-[#747683]">arrow_forward</span>
                        <span className="font-semibold text-[#005ab6]">Central Dock A</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[#747683] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#005ab6]">wifi_tethering</span> GPS Live Lock
                    </span>
                    <button
                      onClick={() => setSelectedRoute('Truck #01 (Marcus V.)')}
                      className="text-[#005ab6] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                      type="button"
                    >
                      Live Route <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Cargo Bike #02 Card */}
                <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-[#e7deff] flex items-center justify-center text-[#270070]">
                          <span className="material-symbols-outlined">electric_bike</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#001d59]">Cargo Bike #02 (Rapid Express)</h3>
                          <p className="text-xs text-[#747683]">Driver: Elena S. • ID: FL-BOS-BK2</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d7e3ff] text-[#001b3f] text-xs font-bold">
                        ETA 14:32 (26m)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-[#f2f4f7] p-2 rounded-lg">
                        <span className="text-[10px] text-[#747683] block font-semibold">Thermal Container</span>
                        <span className="text-xs text-[#ba1a1a] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">local_fire_department</span> 66.5°C Hot Holding
                        </span>
                      </div>
                      <div className="bg-[#f2f4f7] p-2 rounded-lg">
                        <span className="text-[10px] text-[#747683] block font-semibold">Payload Mass</span>
                        <span className="text-xs text-[#001d59] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">scale</span> 45 kg (Entrees)
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#f2f4f7]/60 p-2.5 rounded-lg mb-3 text-xs">
                      <div className="flex items-center justify-between text-[#747683] text-[10px] mb-1">
                        <span>Route Progress</span>
                        <span className="text-[#001d59] font-bold">45% Complete</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#eceef1] rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-[#005ab6] rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <div className="flex items-center gap-1 text-[#191c1e] truncate">
                        <span className="font-semibold text-[#001d59]">Back Bay Hotels</span>
                        <span className="material-symbols-outlined text-[16px] text-[#747683]">arrow_forward</span>
                        <span className="font-semibold text-[#005ab6]">Bay St Mobile Pantry</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[#747683] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#005ab6]">battery_charging_full</span> E-Power: 82%
                    </span>
                    <button
                      onClick={() => setSelectedRoute('Cargo Bike #02 (Elena S.)')}
                      className="text-[#005ab6] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                      type="button"
                    >
                      Live Route <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Transit Van #04 Card */}
                <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-[#eceef1] flex items-center justify-center text-[#001d59]">
                          <span className="material-symbols-outlined">airport_shuttle</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#001d59]">Transit Van #04 (Sub-Zero)</h3>
                          <p className="text-xs text-[#747683]">Driver: Devon K. • ID: FL-BOS-VN4</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold">
                        ETA 14:45 (39m • Slow)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-[#f2f4f7] p-2 rounded-lg">
                        <span className="text-[10px] text-[#747683] block font-semibold">Freezer Pod Temp</span>
                        <span className="text-xs text-[#005ab6] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">ac_unit</span> -18.4°C Deep Freeze
                        </span>
                      </div>
                      <div className="bg-[#f2f4f7] p-2 rounded-lg">
                        <span className="text-[10px] text-[#747683] block font-semibold">Payload Mass</span>
                        <span className="text-xs text-[#001d59] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">scale</span> 290 kg (Stews)
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#f2f4f7]/60 p-2.5 rounded-lg mb-3 text-xs">
                      <div className="flex items-center justify-between text-[#747683] text-[10px] mb-1">
                        <span className="text-[#ba1a1a] flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[14px]">traffic</span> I-93 Congestion (+11m)
                        </span>
                        <span className="text-[#001d59] font-bold">22% Complete</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#eceef1] rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-[#0872e2] rounded-full" style={{ width: '22%' }}></div>
                      </div>
                      <div className="flex items-center gap-1 text-[#191c1e] truncate">
                        <span className="font-semibold text-[#001d59]">North End Markets</span>
                        <span className="material-symbols-outlined text-[16px] text-[#747683]">arrow_forward</span>
                        <span className="font-semibold text-[#005ab6]">Central Dock B</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[#747683] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#005ab6]">thermostat_auto</span> Compressor Active
                    </span>
                    <button
                      onClick={() => setSelectedRoute('Transit Van #04 (Devon K.)')}
                      className="text-[#005ab6] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                      type="button"
                    >
                      Live Route <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Bulk Batch Ledger & Inventory Intake Table */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col">
              
              {/* Table Action Bar */}
              <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-[#001d59]">Bulk Rescue Ledger &amp; Inventory Intake</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#001d59] text-xs font-bold">
                      {filteredBatches.length} Total Batches
                    </span>
                  </div>
                  <p className="text-xs text-[#444652]">Enterprise allocation queue, cold-chain verification records, and immediate dispatch claims</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747683] text-[18px]">
                      search
                    </span>
                    <input
                      className="w-full h-10 pl-9 pr-3 bg-[#f2f4f7] rounded-lg text-[#001d59] text-xs focus:outline-none focus:bg-white focus:shadow-xs border border-slate-200"
                      placeholder="Filter batch, donor, SKU..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setActiveFilterPill('all')}
                    className="h-10 px-3.5 bg-[#f2f4f7] rounded-lg text-xs text-[#444652] hover:text-[#001d59] flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 font-semibold"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span> Filters
                  </button>
                  <button
                    onClick={handleExportCsv}
                    className="h-10 px-3.5 bg-[#f2f4f7] rounded-lg text-xs text-[#444652] hover:text-[#001d59] flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 font-semibold"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">file_download</span> Export CSV
                  </button>
                </div>
              </div>

              {/* Filter Pills Sub-bar */}
              <div className="px-6 pb-3 flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveFilterPill('all')}
                  className={`h-7 px-3 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    activeFilterPill === 'all'
                      ? 'bg-[#003087] text-white'
                      : 'bg-[#f2f4f7] text-[#444652] hover:bg-[#eceef1]'
                  }`}
                  type="button"
                >
                  All Pending (12)
                </button>
                <button
                  onClick={() => setActiveFilterPill('chilled')}
                  className={`h-7 px-3 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    activeFilterPill === 'chilled'
                      ? 'bg-[#003087] text-white'
                      : 'bg-[#f2f4f7] text-[#444652] hover:bg-[#eceef1]'
                  }`}
                  type="button"
                >
                  Chilled / Frozen (7)
                </button>
                <button
                  onClick={() => setActiveFilterPill('critical')}
                  className={`h-7 px-3 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    activeFilterPill === 'critical'
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                  type="button"
                >
                  Critical &lt; 2h Expiry (3)
                </button>
                <button
                  onClick={() => setActiveFilterPill('unclaimed')}
                  className={`h-7 px-3 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    activeFilterPill === 'unclaimed'
                      ? 'bg-[#003087] text-white'
                      : 'bg-[#f2f4f7] text-[#444652] hover:bg-[#eceef1]'
                  }`}
                  type="button"
                >
                  Unassigned Couriers (2)
                </button>
                <button
                  onClick={() => setActiveFilterPill('verified')}
                  className={`h-7 px-3 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    activeFilterPill === 'verified'
                      ? 'bg-[#003087] text-white'
                      : 'bg-[#f2f4f7] text-[#444652] hover:bg-[#eceef1]'
                  }`}
                  type="button"
                >
                  HACCP Grade A Verified (10)
                </button>
              </div>

              {/* High-Density Data Grid */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f2f4f7] uppercase tracking-wider text-[#747683] font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4 w-10">
                        <input className="w-4 h-4 rounded text-[#005ab6] cursor-pointer" type="checkbox" />
                      </th>
                      <th className="py-3 px-4">Batch ID &amp; Venue</th>
                      <th className="py-3 px-4">Food Category</th>
                      <th className="py-3 px-4">Quantity / Units</th>
                      <th className="py-3 px-4">Thermal Status</th>
                      <th className="py-3 px-4">Perish Window</th>
                      <th className="py-3 px-4">Logistics Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBatches.map((batch) => (
                      <tr
                        key={batch.id}
                        className={`transition-colors ${
                          batch.isUrgent && !batch.claimed
                            ? 'bg-[#ffdad6]/20 hover:bg-[#ffdad6]/30'
                            : 'hover:bg-[#f2f4f7]/70'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input className="w-4 h-4 rounded text-[#005ab6] cursor-pointer" type="checkbox" />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#001d59]">{batch.id}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                batch.qrCode === 'URGENT'
                                  ? 'bg-[#ffdad6] text-[#93000a]'
                                  : 'bg-[#eceef1] text-[#747683]'
                              }`}
                            >
                              {batch.qrCode}
                            </span>
                          </div>
                          <div className="text-[#191c1e] font-medium truncate max-w-[220px]">{batch.venue}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#001d59]">{batch.category}</span>
                          <span className="block text-[#747683] text-[11px]">{batch.description}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#001d59]">
                          {batch.weight} <span className="font-normal text-[#747683]">/ {batch.portions}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              batch.thermalType === 'hot'
                                ? 'bg-[#ffdad6] text-[#93000a]'
                                : batch.thermalType === 'chilled'
                                ? 'bg-[#d7e3ff] text-[#001b3f]'
                                : 'bg-[#e6e8eb] text-[#444652]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">{batch.thermalIcon}</span>
                            {batch.thermalStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${
                              batch.isUrgent ? 'text-[#ba1a1a]' : 'text-[#444652]'
                            }`}
                          >
                            {batch.isUrgent && (
                              <span className="material-symbols-outlined text-[16px] animate-pulse">timer</span>
                            )}
                            {batch.perishTime}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              batch.claimed || batch.logisticsType === 'transit'
                                ? 'bg-[#d7e3ff] text-[#001b3f]'
                                : batch.logisticsType === 'unclaimed'
                                ? 'bg-[#ffdad6] text-[#93000a]'
                                : batch.logisticsType === 'assigned'
                                ? 'bg-[#e7deff] text-[#270070]'
                                : 'bg-[#e6e8eb] text-[#001d59]'
                            }`}
                          >
                            {batch.logisticsType === 'verified' && (
                              <span className="material-symbols-outlined text-[14px] text-[#005ab6]">check_circle</span>
                            )}
                            {batch.logisticsStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {batch.actionType === 'claim' && !batch.claimed ? (
                            <button
                              onClick={() => handleClaimBatchAction(batch.id)}
                              className="h-8 px-3 rounded-lg bg-[#0872e2] hover:bg-[#005ab6] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                              type="button"
                            >
                              1-Click Claim
                            </button>
                          ) : batch.claimed ? (
                            <span className="text-emerald-700 font-bold text-xs">Claimed ✓</span>
                          ) : (
                            <button
                              onClick={() => setSelectedManifest(batch)}
                              className="h-8 px-3 rounded-lg bg-[#f2f4f7] hover:bg-[#eceef1] text-xs text-[#001d59] font-semibold transition-all cursor-pointer border border-slate-200"
                              type="button"
                            >
                              {batch.actionType === 'cert' ? 'Proof Cert' : 'Manifest'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination & Ledger Summary Footer */}
              <div className="p-4 bg-[#f2f4f7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-200">
                <span className="text-[#444652]">
                  Showing {filteredBatches.length} of 12 inbound transactions •{' '}
                  <strong className="text-[#001d59] font-semibold">Total Mass: 860 kg</strong>
                </span>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded bg-white text-[#747683] hover:text-[#001d59] flex items-center justify-center transition-colors cursor-pointer border border-slate-200" type="button">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded bg-[#003087] text-white font-bold flex items-center justify-center" type="button">
                    1
                  </button>
                  <button className="w-8 h-8 rounded bg-white text-[#747683] hover:text-[#001d59] flex items-center justify-center transition-colors cursor-pointer border border-slate-200" type="button">
                    2
                  </button>
                  <button className="w-8 h-8 rounded bg-white text-[#747683] hover:text-[#001d59] flex items-center justify-center transition-colors cursor-pointer border border-slate-200" type="button">
                    3
                  </button>
                  <button className="w-8 h-8 rounded bg-white text-[#747683] hover:text-[#001d59] flex items-center justify-center transition-colors cursor-pointer border border-slate-200" type="button">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Split Section: Dock Gantt Schedule (2/3) + Intake Verification Terminal (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Dock Staging & Intake Schedule Timeline (8 cols = 2/3) */}
              <div className="lg:col-span-8 bg-white rounded-xl p-6 shadow-xs border border-slate-200/80 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005ab6]">view_timeline</span>
                      <h2 className="text-lg font-bold text-[#001d59]">Hourly Dock Staging &amp; Intake Schedule</h2>
                    </div>
                    <p className="text-xs text-[#444652]">Real-time bay slot reservations, cold ramps, and unloading clearance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#f2f4f7] text-[#001d59] text-xs font-semibold border border-slate-200">
                      Today: 13:00 - 18:00 EST
                    </span>
                    <button className="p-1.5 rounded-lg bg-[#f2f4f7] hover:bg-[#eceef1] text-[#001d59] cursor-pointer" type="button">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>

                {/* Visual Timeline / Gantt Strip */}
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[560px] flex flex-col gap-3">
                    {/* Timeline Hours Header */}
                    <div className="grid grid-cols-6 gap-2 pl-36 text-[#747683] text-xs py-1 font-semibold">
                      <span>13:00</span>
                      <span>14:00 (Now)</span>
                      <span>15:00</span>
                      <span>16:00</span>
                      <span>17:00</span>
                      <span>18:00</span>
                    </div>

                    {/* Bay 1: Dock A Cold Storage Ramp */}
                    <div className="flex items-center gap-3">
                      <div className="w-32 shrink-0">
                        <span className="text-xs font-bold text-[#001d59] block truncate">Dock A (Cold Ramp)</span>
                        <span className="text-[11px] text-[#005ab6]">Rapid Chill active</span>
                      </div>
                      <div className="flex-1 h-12 bg-[#f2f4f7] rounded-lg relative overflow-hidden flex items-center p-1 border border-slate-100">
                        <div className="absolute left-[18%] w-[28%] h-10 rounded-md bg-[#005ab6] text-white px-2.5 py-1 flex flex-col justify-center shadow-xs">
                          <span className="text-xs font-bold truncate">Truck #01 (Marcus V.)</span>
                          <span className="text-[10px] text-white/80 truncate">640 kg Chilled • ETA 14:18</span>
                        </div>
                      </div>
                    </div>

                    {/* Bay 2: Dock B Dry & Ambient Bay */}
                    <div className="flex items-center gap-3">
                      <div className="w-32 shrink-0">
                        <span className="text-xs font-bold text-[#001d59] block truncate">Dock B (Ambient)</span>
                        <span className="text-[11px] text-[#747683]">Pallet Jack Ready</span>
                      </div>
                      <div className="flex-1 h-12 bg-[#f2f4f7] rounded-lg relative overflow-hidden flex items-center p-1 border border-slate-100">
                        <div className="absolute left-[26%] w-[32%] h-10 rounded-md bg-[#001d59] text-white px-2.5 py-1 flex flex-col justify-center shadow-xs">
                          <span className="text-xs font-bold truncate">Van #04 (Devon K.)</span>
                          <span className="text-[10px] text-white/80 truncate">290 kg Sub-Zero • ETA 14:45</span>
                        </div>
                        <div className="absolute left-[62%] w-[24%] h-10 rounded-md bg-[#eceef1] text-[#444652] px-2.5 py-1 flex flex-col justify-center border border-dashed border-slate-300">
                          <span className="text-xs font-semibold truncate">Scheduled Alloc #92</span>
                          <span className="text-[10px] text-[#747683] truncate">Whole Foods Delivery</span>
                        </div>
                      </div>
                    </div>

                    {/* Bay 3: Mobile Receiving Bay C */}
                    <div className="flex items-center gap-3">
                      <div className="w-32 shrink-0">
                        <span className="text-xs font-bold text-[#001d59] block truncate">Bay C (Mobile/Bike)</span>
                        <span className="text-[11px] text-[#005ab6]">Fast Handshake</span>
                      </div>
                      <div className="flex-1 h-12 bg-[#f2f4f7] rounded-lg relative overflow-hidden flex items-center p-1 border border-slate-100">
                        <div className="absolute left-[22%] w-[18%] h-10 rounded-md bg-[#270070] text-white px-2.5 py-1 flex flex-col justify-center shadow-xs">
                          <span className="text-xs font-bold truncate">Bike #02 (Elena)</span>
                          <span className="text-[10px] text-white/80 truncate">45 kg Hot • 14:32</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bay Status Strip Summary */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 bg-[#f2f4f7] rounded-lg flex items-center justify-between text-xs border border-slate-100">
                    <span className="text-[#444652]">Dock Turnaround</span>
                    <span className="text-[#001d59] font-bold">11.4 min avg</span>
                  </div>
                  <div className="p-2.5 bg-[#f2f4f7] rounded-lg flex items-center justify-between text-xs border border-slate-100">
                    <span className="text-[#444652]">Next Free Slot</span>
                    <span className="text-[#005ab6] font-bold">Dock A @ 15:05</span>
                  </div>
                  <div className="p-2.5 bg-[#f2f4f7] rounded-lg flex items-center justify-between text-xs border border-slate-100">
                    <span className="text-[#444652]">Staging Capacity</span>
                    <span className="text-[#001d59] font-bold">3 Bays / 1 Inactive</span>
                  </div>
                </div>
              </div>

              {/* Intake Verification Terminal Card (4 cols = 1/3) */}
              <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-xs border border-slate-200/80 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005ab6]">contactless</span>
                      <h2 className="text-lg font-bold text-[#001d59]">Verification Dock</h2>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#005ab6] animate-pulse" title="Terminal Online"></span>
                  </div>
                  <p className="text-xs text-[#444652]">NFC Handshake &amp; Physical Temperature Probe validation scanner</p>
                </div>

                {/* Scanner Simulation Box */}
                <div
                  onClick={handleNfcScan}
                  className="relative bg-[#f2f4f7] rounded-xl p-6 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer hover:bg-[#eceef1] transition-all border border-slate-200 group"
                  title="Click to simulate NFC Scan"
                >
                  <div className="w-20 h-20 rounded-full bg-[#d7e3ff]/50 group-hover:scale-105 transition-transform flex items-center justify-center text-[#005ab6] mb-3 shadow-inner">
                    <span className="material-symbols-outlined text-[36px] animate-pulse">qr_code_scanner</span>
                  </div>
                  <span className="text-sm text-[#001d59] font-bold mb-1">Hold Handover QR / NFC Badge Here</span>
                  <p className="text-xs text-[#747683] max-w-[200px]">Supports Apple Wallet, RFID Driver Cards, and Foodloop Ledger QR</p>
                  <div className="mt-4 pt-3 w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#005ab6]">
                    <span className="material-symbols-outlined text-[16px]">sensors</span> Reader Active (BOS-DOCK-NFC-01)
                  </div>
                </div>

                {/* Manual Batch Verification Key */}
                <form onSubmit={handleManualVerify}>
                  <label className="text-xs text-[#001d59] font-bold block mb-1">Manual Verification Key</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 h-10 px-3 bg-[#f2f4f7] rounded-lg text-[#001d59] text-xs focus:outline-none focus:bg-white focus:shadow-xs border border-slate-200"
                      placeholder="e.g. FL-9021-SEC"
                      type="text"
                      value={manualKey}
                      onChange={(e) => setManualKey(e.target.value)}
                    />
                    <button
                      className="h-10 px-4 rounded-lg bg-[#001d59] text-white text-xs hover:bg-[#003087] transition-all font-bold cursor-pointer"
                      type="submit"
                    >
                      Verify
                    </button>
                  </div>
                </form>

                {/* On-Duty Shift Supervisors */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#747683] font-bold block mb-2">
                    On-Duty Shift Supervisors
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#f2f4f7]/70 border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <img
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Tyler Chen, logistics dock lead"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3SdNo50G5t9fjWD1Q1zIob7skrced_h9v5qmCaznbAEY-NbmZJLzwzEEOsqMzBvZ-thQoidbFqTPMi1cEgdDQBfLhz8GG4XLKr5ZkQSM_ljg-KmEERINo60wHy5NAqla4T5kNX8M8e1zPeqwLO2LBprXxM7a9ow_sUE-vJRPTZq6Xaya0MS-GxVNMud91qZeZFlBhO1gqomfGy430DgcUR524yaQOqv5PYUAker8"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#001d59] block leading-tight">Tyler Chen</span>
                          <span className="text-[11px] text-[#747683]">Dock Lead • Gate Master</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#eceef1] text-[#005ab6] text-xs font-bold">
                        Bay A
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#f2f4f7]/70 border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <img
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Sarah Miller, thermal compliance"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWub7b2BbPVpC-gFDUxQ1aM50h07n_zT1L6PH2x-ouFS_Ljfa0NZFqCDGEICAStkiuNS84bI5h2IlxkK7pGiHtCEJPCzZHDj0oygetsx_otahWtBXB7wkkfvLD5nIz9hzL-rj39Qd86Ca9HD7yCtHganl1vF0wvbFlVOZBnjGEO6Xbi2QHAIXAdQEs1Edj3KK0GONeb1o5ApY52_MXI2-qbL02hoSdHLFY0O6zoxE"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#001d59] block leading-tight">Sarah Miller</span>
                          <span className="text-[11px] text-[#747683]">HACCP Inspector • Shift Lead</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#eceef1] text-[#005ab6] text-xs font-bold">
                        Q/A Lab
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Volunteer Shift Sign-In authenticated. 3 hours logged to Boston Food Alliance.')}
                  className="w-full h-10 rounded-lg bg-[#f2f4f7] hover:bg-[#eceef1] text-[#001d59] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span> Volunteer Shift Sign-In
                </button>
              </div>

            </div>

            {/* Circular Logistics Impact Milestone Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-[#001d59] text-white p-6 lg:p-8 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                <div className="lg:col-span-8 flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-[#005ab6] text-white text-[10px] font-bold tracking-wide uppercase">
                      REGIONAL LEDGER MILESTONE
                    </span>
                    <span className="text-xs text-[#b4c5ff]">Q1 Certified Public Record</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    318,400 lbs Rescued Across Greater Boston This Quarter
                  </h2>
                  <p className="text-sm text-[#dbe1ff] max-w-2xl leading-relaxed">
                    In collaboration with 42 verified donors, Greater Boston Food Alliance has redirected high-perishable surplus to 38 localized food pantries with an average dock turnaround under 12 minutes.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 mt-2">
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                      <span className="text-xs text-[#b4c5ff] block">Meals Provided</span>
                      <span className="text-2xl font-black text-white">265,330</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                      <span className="text-xs text-[#b4c5ff] block">CO2e Diverted</span>
                      <span className="text-2xl font-black text-white">412.8 MT</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 col-span-2 sm:col-span-1 border border-white/10">
                      <span className="text-xs text-[#b4c5ff] block">Cold Chain Integrity</span>
                      <span className="text-2xl font-black text-[#d7e3ff]">99.7%</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-slate-800 border border-white/10">
                    <img
                      className="w-full h-56 object-cover"
                      alt="Food pantry volunteers unloading cold-storage crates"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWHNrVf3QW1V8s8cUrc8-5wgN0SJhMeYiRaggRXSDi3thwBxsashvLsG5LM5dnpWTb-SEmhJB-Y6TbD4iCNKms0JL1-CFbWSUUaLM4_EzkgRQXNSJ9_a-OCBDAXNsyjoC3rZDIm8uO0pmqEPUeQnK3Ykb-bf8hhqaLdFwE2SiQjku06BxCw23VzMqcQBuGVyvUJtA6GHqMXy4bC6lVcRUGIiB7xWqxDkR2UCEd96c"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#001d59]/95 via-[#001d59]/60 to-transparent p-3 text-white">
                      <p className="text-xs font-bold">Central Boston Regional Receiving Facility</p>
                      <p className="text-[10px] text-white/80">Dock verification automated by Foodloop Telemetry Node</p>
                    </div>
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
