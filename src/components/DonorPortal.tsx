'use client';

import React, { useState } from 'react';
import { FoodListing } from '@/types/foodloop';

interface DonorPortalProps {
  onNavigate?: (page: string) => void;
  activeRole?: string;
  setActiveRole?: (role: string) => void;
  onOpenSponsors?: () => void;
  onAddListing?: (listing: FoodListing) => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({
  onNavigate,
  activeRole = 'donor',
  setActiveRole,
  onOpenSponsors,
  onAddListing,
}) => {
  const [currentQty, setCurrentQty] = useState(24);
  const [allocationMode, setAllocationMode] = useState<'free' | 'discount' | 'sponsored'>('free');
  const [foodTitle, setFoodTitle] = useState('');
  const [category, setCategory] = useState('Bakery & Pastries');
  const [expiryWindow, setExpiryWindow] = useState('Tonight, 8:30 PM');
  const [tempReq, setTempReq] = useState('Ambient / Room Temp');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'en_route' | 'completed'>('all');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState({
    lotId: 'LP-8842',
    title: 'Rustic Artisan Sourdough',
    agency: 'St. Jude Community Pantry',
  });
  const [customListings, setCustomListings] = useState<any[]>([]);

  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    icon: string;
  }>({
    show: false,
    title: '',
    message: '',
    icon: 'check_circle',
  });

  const showToast = (title: string, message: string, icon = 'check_circle') => {
    setToast({ show: true, title, message, icon });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '', icon: 'check_circle' });
    }, 4000);
  };

  const openVerificationModal = (lotId: string, title: string, agency: string) => {
    setQrModalData({ lotId, title, agency });
    setIsQrModalOpen(true);
  };

  const closeVerificationModal = () => {
    setIsQrModalOpen(false);
  };

  const simulateSuccessfulClaim = () => {
    closeVerificationModal();
    showToast('Handshake Verified!', '32 portions logged to ledger. +95 Points credited to your PayPal rewards.', 'verified');
  };

  const handlePublishSurplus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodTitle.trim()) return;

    const newLotId = `LP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: newLotId,
      title: foodTitle,
      portions: currentQty,
      category,
      time: 'Just Now',
      status: 'broadcasting',
    };

    setCustomListings((prev) => [newEntry, ...prev]);

    if (onAddListing) {
      const listingObj: FoodListing = {
        id: newLotId,
        donorName: 'Main Kitchen / Partner Donor',
        donorType: 'Restaurant',
        title: foodTitle,
        category: 'Meals',
        portions: currentQty,
        originalPrice: allocationMode === 'free' ? 0 : 13,
        currentPrice: allocationMode === 'free' ? 0 : 4.5,
        discountPercent: allocationMode === 'free' ? 100 : 65,
        isFree: allocationMode === 'free',
        prepTime: 'Just Now',
        expiryTime: expiryWindow,
        pickupDeadlineMinutes: 45,
        location: 'Downtown Metro Core',
        distanceKm: 1.2,
        allergens: ['Nut-Free', 'Vegetarian'],
        storageTemp: 'Room Temp (15-25°C)',
        safetyDeclaration: true,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCXgJxF8XlPe2SWtCGy5xpXxnq5zGyinFS-J5ZzHIUbffQGVU9i6OS8kxQGjnxe5nF6au6OoFlFdbGMlU9Q4ZNsZM95_3_NIuUE1ZOSDH3TZO_P55M0e9kXN4eN3m5z424z9TDa9ofFUcxoTbAb0-I369UP5K9YX1fYshCLK9Y7c6JDIQK1cbvCxqgE5h9Sv3LsOBcW03QkHcz5rf3IGjq4PoiAfk7Bha8KHqWKdPM',
        status: 'available',
      };
      onAddListing(listingObj);
    }

    setFoodTitle('');
    showToast('Surplus Published!', `"${newEntry.title}" is live. Regional network notified.`, 'fastfood');
  };

  const handlePayoutPayPal = () => {
    showToast(
      'PayPal Transfer Initiated',
      'Instant payout of $148.20 submitted to merchant@business.com via PayPal Sandbox Rails.',
      'account_balance_wallet'
    );
  };

  const handleConvertTax = () => {
    showToast('Tax Slip Generated', 'IRS Form 8283 schedule ready for download.', 'receipt_long');
  };

  const handleSyncLedger = () => {
    showToast('Ledger Synced', 'All node transactions re-verified against the blockchain ledger.', 'sync');
  };

  const handleDownloadReceipt = () => {
    showToast('Audit Slip #FL-0988', 'Certified cold-chain digital timestamp downloaded.', 'download');
  };

  return (
    <div className="bg-[#071426] font-body-md text-[#d7e3fc] antialiased min-h-screen flex">
      {/* Toast Notification Container */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10233D] border border-[#1E3A66] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-[#2b93f7] text-[22px]">{toast.icon}</span>
          <div>
            <div className="font-label-md text-label-md font-bold text-white">{toast.title}</div>
            <div className="font-body-sm text-body-sm text-[#8b919f]">{toast.message}</div>
          </div>
        </div>
      )}

      {/* FIXED SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#08192E] border-r border-[#1A365D] shadow-xl z-50 flex flex-col pt-space-md pb-space-lg">
        <div className="px-space-lg mb-space-lg flex items-center gap-space-sm">
          <div className="p-1.5 rounded-lg bg-[#0070E0]/10 border border-[#0070E0]/30 cursor-pointer" onClick={() => onNavigate?.('home')}>
            <img
              alt="FOODLOOP Brand Logo"
              className="h-6 w-auto object-contain brightness-125"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
            />
          </div>
          <span
            className="font-headline-sm text-headline-sm text-white font-extrabold tracking-tight cursor-pointer"
            onClick={() => onNavigate?.('home')}
          >
            FOODLOOP
          </span>
        </div>

        <nav className="flex-1 px-space-md space-y-space-xs">
          <button
            onClick={() => onNavigate?.('home')}
            className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-[#8b919f] hover:bg-[#10233D] hover:text-[#d7e3fc] transition-all cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <span className="font-label-lg text-label-lg">Overview</span>
          </button>
          <button
            onClick={() => onNavigate?.('explore-food')}
            className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-[#8b919f] hover:bg-[#10233D] hover:text-[#d7e3fc] transition-all cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            <span className="font-label-lg text-label-lg">Rescue Ops</span>
          </button>
          <button
            onClick={() => onNavigate?.('donor-portal')}
            className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-[#0070E0] text-white font-bold shadow-[0_0_15px_rgba(0,112,224,0.45)] cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span className="font-label-lg text-label-lg">Surplus Ledger</span>
          </button>
          <button
            onClick={() => onNavigate?.('ai-rescue-agent')}
            className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-[#8b919f] hover:bg-[#10233D] hover:text-[#d7e3fc] transition-all cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            <span className="font-label-lg text-label-lg">AI Match Engine</span>
          </button>
          <button
            onClick={handlePayoutPayPal}
            className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-[#8b919f] hover:bg-[#10233D] hover:text-[#d7e3fc] transition-all cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <span className="font-label-lg text-label-lg">Settlement &amp; Tax</span>
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-[#8b919f] hover:bg-[#10233D] hover:text-[#d7e3fc] transition-all cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
            <span className="font-label-lg text-label-lg">Safety &amp; Audit</span>
          </button>
        </nav>

        <div className="px-space-md">
          <div className="p-space-md bg-[#0C1E36] border border-[#1A365D] rounded-xl">
            <div className="font-label-sm text-label-sm text-[#2b93f7] uppercase tracking-wider font-bold">Active Network</div>
            <div className="font-label-md text-label-md text-white font-bold mt-space-xs flex items-center justify-between">
              <span>99.8% Logistics SLA</span>
              <span className="w-2 h-2 rounded-full bg-[#2b93f7] animate-pulse"></span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN WRAPPER WITH LEFT PADDING FOR SIDEBAR */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        
        {/* FIXED HEADER */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-[#08192E]/95 backdrop-blur-xl border-b border-[#1A365D] z-40 flex items-center justify-between px-space-lg">
          <div className="relative w-full max-w-sm">
            <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-[#8b919f] text-[20px]">
              search
            </span>
            <input
              className="w-full h-10 pl-9 pr-space-md bg-[#0C1E36] border border-[#1E3A66] rounded-lg text-white placeholder:text-[#8b919f] font-body-sm text-body-sm focus:outline-none focus:border-[#0070E0] focus:ring-1 focus:ring-[#0070E0] transition-all"
              placeholder="Search transactions, dispatch, lots..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                value={activeRole}
                onChange={(e) => setActiveRole?.(e.target.value)}
                className="appearance-none h-10 pl-space-sm pr-space-lg bg-[#0C1E36] border border-[#1E3A66] font-label-md text-label-md text-[#abc7ff] font-bold rounded-lg cursor-pointer focus:outline-none"
              >
                <option className="bg-[#0C1E36] text-white" value="donor">Donor</option>
                <option className="bg-[#0C1E36] text-white" value="recipient">Recipient</option>
                <option className="bg-[#0C1E36] text-white" value="ngo">NGO Hub</option>
                <option className="bg-[#0C1E36] text-white" value="admin">Admin Console</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-[#8b919f] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            <button
              aria-label="Hackathon Sponsors"
              onClick={onOpenSponsors}
              className="h-10 px-3 flex items-center justify-center rounded-lg bg-[#ffc439] hover:bg-[#f2ba36] text-[#001435] font-black text-xs transition-all shadow-md cursor-pointer"
              type="button"
            >
              Sponsors (5)
            </button>

            <button
              aria-label="Toggle Light Dark Mode"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#0C1E36] border border-[#1E3A66] text-[#abc7ff] hover:text-white hover:border-[#0070E0] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">dark_mode</span>
            </button>

            <button
              aria-label="System Alerts"
              onClick={() => showToast('System Alert', 'Active redistribution corridor running at 99.8% SLA.', 'notifications')}
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-[#0C1E36] border border-[#1E3A66] text-[#abc7ff] hover:text-white hover:border-[#0070E0] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
            </button>

            <div className="flex items-center gap-space-xs pl-space-sm">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0070E0]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"
              />
              <span className="material-symbols-outlined text-[#8b919f] text-[18px] cursor-pointer hover:text-white transition-colors">
                arrow_drop_down
              </span>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="relative pt-16 w-full bg-[#071426] px-space-lg py-space-lg flex-1">
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-space-lg w-full max-w-[1440px] mx-auto pb-space-xl">
              
              {/* Top Meta Context Bar */}
              <div className="flex flex-wrap items-center justify-between gap-space-md">
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0070E0]/15 border border-[#0070E0]/30 text-[#abc7ff] font-label-sm text-label-sm uppercase tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2b93f7] animate-pulse"></span> Node US-NE #4029 Active
                    </span>
                    <span className="font-body-sm text-body-sm text-[#8b919f]">Updated 42s ago</span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-white font-extrabold tracking-tight mt-1">
                    Surplus Operations &amp; Ledger
                  </h1>
                </div>
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10233D] border border-[#1E3A66] rounded-lg">
                    <span className="material-symbols-outlined text-[#2b93f7] text-[18px]">verified</span>
                    <span className="font-label-md text-label-md text-white font-bold">Platinum Verified Donor</span>
                    <span className="font-label-sm text-label-sm bg-[#08192E] border border-[#1A365D] px-2 py-0.5 rounded text-[#abc7ff] font-semibold">
                      Tier 4
                    </span>
                  </div>
                  <button
                    onClick={handleSyncLedger}
                    className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#10233D] hover:bg-[#142B4D] border border-[#1E3A66] text-white font-label-lg text-label-lg shadow-sm transition-all cursor-pointer"
                    id="refreshLedgerBtn"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#2b93f7]">sync</span>
                    <span>Sync State</span>
                  </button>
                </div>
              </div>

              {/* Metrics Row (4 High-Contrast Fintech Metric Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
                {/* Card 1 */}
                <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg flex flex-col justify-between hover:border-[#0070E0]/60 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-[#0070E0]/15 border border-[#0070E0]/30 rounded-lg text-[#abc7ff]">
                      <span className="material-symbols-outlined text-[22px]">restaurant</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-[#2b93f7] bg-[#2b93f7]/10 border border-[#2b93f7]/20 px-2 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(43,147,247,0.2)]">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span> +18% MoM
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="font-headline-xl text-headline-xl text-white font-black tracking-tight">1,420</div>
                    <div className="font-label-md text-label-md text-[#8b919f] mt-0.5">Meals Rescued This Month</div>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between text-body-sm font-body-sm text-[#8b919f] border-t border-[#1E3A66]/50">
                    <span>Carbon offset</span>
                    <span className="font-label-md text-label-md text-[#abc7ff] font-bold">3.12 MT CO₂e</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg flex flex-col justify-between hover:border-[#0070E0]/60 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-[#2b93f7]/15 border border-[#2b93f7]/30 rounded-lg text-[#2b93f7]">
                      <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-[#abc7ff] bg-[#0070E0]/20 border border-[#0070E0]/30 px-2 py-0.5 rounded-full font-bold">
                      Live Dispatches
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="font-headline-xl text-headline-xl text-white font-black tracking-tight">28</div>
                    <div className="font-label-md text-label-md text-[#8b919f] mt-0.5">Active Surplus Listings</div>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between text-body-sm font-body-sm text-[#8b919f] border-t border-[#1E3A66]/50">
                    <span>Avg. claim velocity</span>
                    <span className="font-label-md text-label-md text-[#2b93f7] font-bold">14.2 minutes</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg flex flex-col justify-between hover:border-[#0070E0]/60 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-[#7a5fd2]/15 border border-[#7a5fd2]/30 rounded-lg text-[#cdbdff]">
                      <span className="material-symbols-outlined text-[22px]">task_alt</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-[#cdbdff] bg-[#7a5fd2]/20 border border-[#7a5fd2]/30 px-2 py-0.5 rounded-full font-bold">
                      Zero Disputes
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="font-headline-xl text-headline-xl text-white font-black tracking-tight">99.4%</div>
                    <div className="font-label-md text-label-md text-[#8b919f] mt-0.5">Successful Collection Rate</div>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between text-body-sm font-body-sm text-[#8b919f] border-t border-[#1E3A66]/50">
                    <span>Cold-chain compliance</span>
                    <span className="font-label-md text-label-md text-[#d7e3fc] font-bold">100% Audited</span>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-gradient-to-br from-[#081e3a] via-[#0b2b52] to-[#0052a3] border border-[#1E3A66] p-space-md rounded-xl shadow-lg flex flex-col justify-between text-white">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-white/10 rounded-lg text-white backdrop-blur-sm border border-white/20">
                      <span className="material-symbols-outlined text-[22px]">loyalty</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-white bg-white/20 px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      PayPal Direct
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="font-headline-xl text-headline-xl text-white font-black tracking-tight">3,450</div>
                    <div className="font-label-md text-label-md text-[#abc7ff] mt-0.5">FOODLOOP Points Earned</div>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between text-body-sm font-body-sm text-white/80 border-t border-white/10">
                    <span>Equivalent Value</span>
                    <span className="font-label-md text-label-md text-white font-extrabold">$34.50 Cash Credit</span>
                  </div>
                </div>
              </div>

              {/* Settlement & Reward Redemption Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#0a1c33] via-[#0d2545] to-[#10233D] border border-[#1E3A66] rounded-xl p-space-lg shadow-xl">
                <div className="absolute -right-8 -top-12 w-64 h-64 bg-[#0070E0]/15 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                  <div className="flex items-start gap-space-md">
                    <div className="h-12 w-12 rounded-xl bg-[#0070E0] flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,112,224,0.5)] shrink-0 border border-[#abc7ff]/30">
                      <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
                    </div>
                    <div className="flex flex-col max-w-2xl">
                      <div className="flex items-center gap-space-xs flex-wrap">
                        <span className="font-headline-sm text-headline-sm text-white font-bold">Surplus Ledger Balance:</span>
                        <span className="font-headline-sm text-headline-sm text-[#2b93f7] font-black">$148.20 USD</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#08192E] border border-[#1E3A66] text-[#abc7ff] font-label-sm text-label-sm font-semibold">
                          Instant Ready
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-[#8b919f] mt-1">
                        Transfer surplus revenue instantly to your linked PayPal merchant balance or convert 100% into formal 501(c)(3) verified tax-deductible donor credit slips with automated ledger receipts.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
                    <button
                      onClick={handlePayoutPayPal}
                      className="flex items-center gap-2 h-11 px-5 rounded-lg bg-[#0070E0] hover:bg-[#005bb8] text-white font-label-lg text-label-lg font-bold shadow-[0_0_18px_rgba(0,112,224,0.45)] transition-all hover:-translate-y-0.5 border border-[#abc7ff]/20 cursor-pointer"
                      id="payoutPaypalBtn"
                    >
                      <span className="material-symbols-outlined text-[18px]">bolt</span>
                      <span>Payout via PayPal ($148.20)</span>
                    </button>
                    <button
                      onClick={handleConvertTax}
                      className="flex items-center gap-2 h-11 px-4 rounded-lg bg-[#0C1E36] hover:bg-[#142B4D] border border-[#1E3A66] text-[#d7e3fc] font-label-lg text-label-lg font-bold transition-all cursor-pointer"
                      id="convertTaxBtn"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#abc7ff]">receipt</span>
                      <span>Tax Credit Slip</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Flight Bar Tracker: Global Active Rescue Corridor */}
              <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#2b93f7] text-[20px]">timeline</span>
                    <span className="font-label-lg text-label-lg text-white font-bold">
                      Live Rescue Pipeline Tracker (Lot #LP-8842)
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm bg-[#0070E0]/20 border border-[#0070E0]/30 text-[#abc7ff] font-bold px-2.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(0,112,224,0.3)]">
                    En Route: ETA 18 mins
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <div className="flex flex-col">
                    <div className="h-2 rounded-full bg-[#0070E0] shadow-[0_0_8px_rgba(0,112,224,0.5)]"></div>
                    <div className="flex items-center gap-1 mt-2 text-white font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px] text-[#2b93f7]">check_circle</span>
                      <span>1. Logged (11:04 AM)</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#8b919f]">Pretzel Bakery Surplus</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="h-2 rounded-full bg-[#0070E0] shadow-[0_0_8px_rgba(0,112,224,0.5)]"></div>
                    <div className="flex items-center gap-1 mt-2 text-white font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px] text-[#2b93f7]">check_circle</span>
                      <span>2. AI Matched (11:09 AM)</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#8b919f]">Hope Harbor Kitchen</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="h-2 rounded-full bg-[#2b93f7] animate-pulse shadow-[0_0_10px_rgba(43,147,247,0.7)]"></div>
                    <div className="flex items-center gap-1 mt-2 text-[#2b93f7] font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      <span>3. En Route (Active)</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#8b919f]">Courier #FL-914 Transit</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="h-2 rounded-full bg-[#1A365D]"></div>
                    <div className="flex items-center gap-1 mt-2 text-[#8b919f] font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
                      <span>4. Verified Claim</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#8b919f]">Pending QR Handshake</span>
                  </div>
                </div>
              </div>

              {/* Main Operational Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                
                {/* LEFT COLUMN: Quick Surplus Food Listing Form (5 Cols) */}
                <div className="lg:col-span-5 bg-[#10233D] border border-[#1E3A66] p-space-lg rounded-xl shadow-lg flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-sm border-b border-[#1E3A66]">
                    <div>
                      <span className="font-headline-sm text-headline-sm text-white font-bold">Quick Surplus Dispatch</span>
                      <p className="font-body-sm text-body-sm text-[#8b919f]">
                        Instant ingestion into regional food redistribution nodes.
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#2b93f7] text-[24px]">add_circle</span>
                  </div>

                  <form className="flex flex-col gap-space-md" onSubmit={handlePublishSurplus}>
                    {/* Allocation Model Switcher */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-[#d7e3fc] font-bold">Surplus Allocation Model</label>
                      <div className="grid grid-cols-3 gap-1 bg-[#08192E] border border-[#1A365D] p-1 rounded-lg">
                        <button
                          className={`py-2 text-center rounded-md font-label-sm text-label-sm font-bold transition-all cursor-pointer ${
                            allocationMode === 'free' ? 'bg-[#0070E0] text-white shadow-sm' : 'text-[#8b919f] hover:text-[#d7e3fc]'
                          }`}
                          type="button"
                          onClick={() => setAllocationMode('free')}
                        >
                          Free Donation
                        </button>
                        <button
                          className={`py-2 text-center rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                            allocationMode === 'discount' ? 'bg-[#0070E0] text-white shadow-sm' : 'text-[#8b919f] hover:text-[#d7e3fc]'
                          }`}
                          type="button"
                          onClick={() => setAllocationMode('discount')}
                        >
                          Discount (70% Off)
                        </button>
                        <button
                          className={`py-2 text-center rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                            allocationMode === 'sponsored' ? 'bg-[#0070E0] text-white shadow-sm' : 'text-[#8b919f] hover:text-[#d7e3fc]'
                          }`}
                          type="button"
                          onClick={() => setAllocationMode('sponsored')}
                        >
                          PayPal Sponsor
                        </button>
                      </div>
                    </div>

                    {/* Food Name Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-[#d7e3fc] font-bold" htmlFor="foodTitle">
                        Food Description / Lot Batch
                      </label>
                      <div className="relative">
                        <input
                          className="w-full h-11 px-3.5 bg-[#0C1E36] border border-[#1E3A66] rounded-lg font-body-md text-body-md text-white placeholder:text-[#8b919f] focus:outline-none focus:border-[#0070E0] focus:ring-1 focus:ring-[#0070E0] transition-all"
                          id="foodTitle"
                          placeholder="e.g., Artisanal Sourdough & Baguettes"
                          required
                          type="text"
                          value={foodTitle}
                          onChange={(e) => setFoodTitle(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#8b919f] text-[18px]">
                          lunch_dining
                        </span>
                      </div>
                    </div>

                    {/* Category & Quantity Row */}
                    <div className="grid grid-cols-2 gap-space-sm">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-[#d7e3fc] font-bold" htmlFor="categorySelect">
                          Category
                        </label>
                        <div className="relative">
                          <select
                            className="w-full h-11 px-3 bg-[#0C1E36] border border-[#1E3A66] rounded-lg font-label-md text-label-md text-white font-semibold appearance-none cursor-pointer focus:outline-none focus:border-[#0070E0]"
                            id="categorySelect"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option className="bg-[#0C1E36] text-white" value="Bakery & Pastries">Bakery &amp; Pastries</option>
                            <option className="bg-[#0C1E36] text-white" value="Prepared Meals">Prepared Meals</option>
                            <option className="bg-[#0C1E36] text-white" value="Fresh Produce">Fresh Produce</option>
                            <option className="bg-[#0C1E36] text-white" value="Dairy & Chilled">Dairy &amp; Chilled</option>
                            <option className="bg-[#0C1E36] text-white" value="Pantry Staples">Pantry Staples</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b919f] text-[18px] pointer-events-none">
                            arrow_drop_down
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-[#d7e3fc] font-bold">Quantity (Units / Portions)</label>
                        <div className="flex items-center h-11 bg-[#0C1E36] border border-[#1E3A66] rounded-lg px-2 justify-between">
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded bg-[#10233D] text-[#abc7ff] hover:bg-[#1A365D] hover:text-white text-body-md font-bold transition-colors border border-[#1E3A66] cursor-pointer"
                            type="button"
                            onClick={() => setCurrentQty((prev) => Math.max(1, prev - 1))}
                          >
                            -
                          </button>
                          <span className="font-label-md text-label-md text-white font-black">{currentQty}</span>
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded bg-[#10233D] text-[#abc7ff] hover:bg-[#1A365D] hover:text-white text-body-md font-bold transition-colors border border-[#1E3A66] cursor-pointer"
                            type="button"
                            onClick={() => setCurrentQty((prev) => prev + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expiry Pickup Window & Storage */}
                    <div className="grid grid-cols-2 gap-space-sm">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-[#d7e3fc] font-bold" htmlFor="expiryWindow">
                          Pickup Deadline
                        </label>
                        <div className="relative">
                          <select
                            className="w-full h-11 px-3 bg-[#0C1E36] border border-[#1E3A66] rounded-lg font-label-md text-label-md text-white font-semibold appearance-none cursor-pointer focus:outline-none focus:border-[#0070E0]"
                            id="expiryWindow"
                            value={expiryWindow}
                            onChange={(e) => setExpiryWindow(e.target.value)}
                          >
                            <option className="bg-[#0C1E36] text-white" value="Tonight, 8:30 PM">Tonight, 8:30 PM (Urgent)</option>
                            <option className="bg-[#0C1E36] text-white" value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM</option>
                            <option className="bg-[#0C1E36] text-white" value="In 2 Hours">In 2 Hours (Critical)</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b919f] text-[18px] pointer-events-none">
                            schedule
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-[#d7e3fc] font-bold" htmlFor="tempReq">
                          Storage Profile
                        </label>
                        <div className="relative">
                          <select
                            className="w-full h-11 px-3 bg-[#0C1E36] border border-[#1E3A66] rounded-lg font-label-md text-label-md text-white font-semibold appearance-none cursor-pointer focus:outline-none focus:border-[#0070E0]"
                            id="tempReq"
                            value={tempReq}
                            onChange={(e) => setTempReq(e.target.value)}
                          >
                            <option className="bg-[#0C1E36] text-white" value="Ambient / Room Temp">Ambient Temp</option>
                            <option className="bg-[#0C1E36] text-white" value="Refrigerated (34-38°F)">Refrigerated Cold</option>
                            <option className="bg-[#0C1E36] text-white" value="Frozen Safe (-0°F)">Frozen Storage</option>
                            <option className="bg-[#0C1E36] text-white" value="Heated (>140°F)">Hot Packaged</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b919f] text-[18px] pointer-events-none">
                            thermostat
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Allergen Declarations */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-[#d7e3fc] font-bold">Allergen Declarations</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Gluten', 'Dairy Free', 'Nut Free', 'Halal Certified', 'Vegetarian'].map((tag, idx) => (
                          <label
                            key={idx}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0C1E36] border border-[#1E3A66] hover:border-[#2b93f7] font-label-sm text-label-sm text-[#8b919f] has-[:checked]:bg-[#0070E0]/20 has-[:checked]:border-[#0070E0] has-[:checked]:text-[#abc7ff] font-bold transition-all"
                          >
                            <input defaultChecked={idx === 0 || idx === 2} className="hidden" type="checkbox" />
                            {tag}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Preview */}
                    {(allocationMode === 'discount' || allocationMode === 'sponsored') && (
                      <div className="flex items-center justify-between p-3 bg-[#0C1E36] border border-[#1E3A66] rounded-lg">
                        <span className="font-label-md text-label-md text-white font-bold">
                          {allocationMode === 'sponsored' ? 'PayPal Covered Grant' : 'PayPal Recipient Fee'}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-headline-sm text-headline-sm text-[#2b93f7] font-black">$4.50</span>
                          <span className="font-body-sm text-body-sm text-[#8b919f]">/ meal package</span>
                        </div>
                      </div>
                    )}

                    {/* Submit CTA Button */}
                    <button
                      className="mt-2 h-12 w-full rounded-lg bg-[#0070E0] hover:bg-[#005bb8] text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,112,224,0.4)] hover:shadow-[0_0_25px_rgba(0,112,224,0.6)] transition-all cursor-pointer"
                      type="submit"
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      <span>Publish to FOODLOOP Network</span>
                    </button>
                  </form>

                  {/* Donor Trust SLA Note */}
                  <div className="p-3 bg-[#0C1E36] border border-[#1E3A66] rounded-lg flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#2b93f7] text-[22px] shrink-0">shield</span>
                    <div className="text-body-sm font-body-sm text-[#8b919f]">
                      Protected by the Federal Bill Emerson Good Samaritan Food Donation Act. AI route matching guarantees cold-chain audit trails.
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Active Listings & Real-Time Reservations (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-3 h-3 rounded-full bg-[#2b93f7] animate-pulse"></div>
                      <span className="font-headline-sm text-headline-sm text-white font-bold">
                        Active Listings &amp; Reservations
                      </span>
                      <span className="bg-[#0070E0]/20 border border-[#0070E0]/30 text-[#abc7ff] text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold">
                        {4 + customListings.length} Live
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {(['all', 'pending', 'en_route', 'completed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setFilterStatus(st)}
                          className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm capitalize transition-all cursor-pointer ${
                            filterStatus === st
                              ? 'bg-[#0070E0] text-white font-bold shadow-[0_0_10px_rgba(0,112,224,0.4)]'
                              : 'bg-[#0C1E36] hover:bg-[#142B4D] border border-[#1E3A66] text-[#8b919f] hover:text-[#d7e3fc]'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listings Stream */}
                  <div className="flex flex-col gap-space-sm" id="listingsContainer">
                    {/* Render Custom Published Listings */}
                    {customListings.map((custom) => (
                      <div
                        key={custom.id}
                        className="bg-[#10233D] border border-[#0070E0]/40 p-space-md rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md animate-in fade-in slide-in-from-top-4 duration-300"
                      >
                        <div className="flex items-start gap-space-md">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0070E0]/15 border border-[#0070E0]/30 flex items-center justify-center text-[#2b93f7]">
                            <span className="material-symbols-outlined text-[28px]">fastfood</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline-sm text-headline-sm text-white font-bold">{custom.title}</span>
                              <span className="inline-flex items-center gap-1 bg-[#0070E0]/20 border border-[#0070E0]/30 text-[#2b93f7] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(43,147,247,0.25)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2b93f7] animate-pulse"></span> Broadcasting
                              </span>
                            </div>
                            <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-[#8b919f] mt-1 flex-wrap">
                              <span className="font-semibold text-white">{custom.portions} Portions</span>
                              <span>•</span>
                              <span>Pending AI Pairing</span>
                              <span>•</span>
                              <span className="text-[#2b93f7] font-bold">Just Now</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <button
                            onClick={() => openVerificationModal(custom.id, custom.title, 'Nearby Food Bank Hub')}
                            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0C1E36] hover:bg-[#142B4D] border border-[#1E3A66] text-[#d7e3fc] font-label-md text-label-md font-bold transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-[#2b93f7]">qr_code_2</span>
                            <span>View QR</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Item 1: Urgent En Route */}
                    {(filterStatus === 'all' || filterStatus === 'en_route') && (
                      <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg hover:border-[#0070E0]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                        <div className="flex items-start gap-space-md">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0C1E36] border border-[#1E3A66]">
                            <img
                              className="w-full h-full object-cover"
                              alt="Fresh gourmet artisan breads"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXgJxF8XlPe2SWtCGy5xpXxnq5zGyinFS-J5ZzHIUbffQGVU9i6OS8kxQGjnxe5nF6au6OoFlFdbGMlU9Q4ZNsZM95_3_NIuUE1ZOSDH3TZO_P55M0e9kXN4eN3m5z424z9TDa9ofFUcxoTbAb0-I369UP5K9YX1fYshCLK9Y7c6JDIQK1cbvCxqgE5h9Sv3LsOBcW03QkHcz5rf3IGjq4PoiAfk7Bha8KHqWKdPM"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-[#08192E]/90 text-[10px] text-[#abc7ff] text-center font-bold py-0.5 border-t border-[#1E3A66]">
                              Bakery
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline-sm text-headline-sm text-white font-bold">
                                Rustic Artisan Sourdough &amp; Brioche
                              </span>
                              <span className="inline-flex items-center gap-1 bg-[#0070E0]/20 border border-[#0070E0]/30 text-[#2b93f7] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(43,147,247,0.25)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2b93f7]"></span> En Route
                              </span>
                            </div>
                            <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-[#8b919f] mt-1 flex-wrap">
                              <span className="font-semibold text-white">32 Portions</span>
                              <span>•</span>
                              <span>Matched: St. Jude Community Pantry</span>
                              <span>•</span>
                              <span className="text-[#ffb4ab] font-bold flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[14px]">timer</span> Expires in 45m
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[11px] px-2 py-0.5 bg-[#0C1E36] border border-[#1E3A66] rounded font-semibold text-[#8b919f]">
                                Nut-Free
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-[#0C1E36] border border-[#1E3A66] rounded font-semibold text-[#8b919f]">
                                Vegetarian
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-[#0070E0]/20 border border-[#0070E0]/30 text-[#abc7ff] rounded font-bold">
                                PayPal Sponsored
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <div className="text-right">
                            <div className="font-label-sm text-label-sm text-[#8b919f]">Courier Assigned</div>
                            <div className="font-label-md text-label-md text-[#abc7ff] font-bold">Alex Rivera (Van #12)</div>
                          </div>
                          <button
                            onClick={() => openVerificationModal('LP-8842', 'Rustic Artisan Sourdough', 'St. Jude Community Pantry')}
                            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0070E0] text-white font-label-md text-label-md font-bold hover:bg-[#005bb8] transition-colors shadow-[0_0_12px_rgba(0,112,224,0.4)] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                            <span>Verify QR</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Item 2: Pending Dispatch */}
                    {(filterStatus === 'all' || filterStatus === 'pending') && (
                      <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg hover:border-[#0070E0]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                        <div className="flex items-start gap-space-md">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0C1E36] border border-[#1E3A66]">
                            <img
                              className="w-full h-full object-cover"
                              alt="Meal prep containers with grilled chicken and broccoli"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVi6qeBKFvFS0TrysT_kNA-OQh9YPiEei3_y0omi6TO5YCNWYo4movamY8ovJjb3MvN7dhZ7hfgCjRXmT4F5FhSctiBfA-U8DmEdQVB_gmD0GVEEuB5K9QE9fgMGpBWrYPhSSvBBeWAGf43b6faVqm5IwJrWniDIKvPrhXU5ioW16y2ojrt4rO7f0WJtaFgUjColz9IaPD-_3OZD-vLWE-ECWwxEjVxm3rdpZhip0"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-[#08192E]/90 text-[10px] text-[#abc7ff] text-center font-bold py-0.5 border-t border-[#1E3A66]">
                              Prepared
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline-sm text-headline-sm text-white font-bold">
                                Warm Grain Bowls &amp; Roasted Salmon
                              </span>
                              <span className="inline-flex items-center gap-1 bg-[#1A365D] border border-[#1E3A66] text-[#abc7ff] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                                Pending Dispatch
                              </span>
                            </div>
                            <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-[#8b919f] mt-1 flex-wrap">
                              <span className="font-semibold text-white">18 Servings</span>
                              <span>•</span>
                              <span>Free Surplus Donation</span>
                              <span>•</span>
                              <span className="text-[#2b93f7] font-bold">Ready for Pickup</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[11px] px-2 py-0.5 bg-[#0C1E36] border border-[#1E3A66] rounded font-semibold text-[#8b919f]">
                                Gluten-Free
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-[#0C1E36] border border-[#1E3A66] rounded font-semibold text-[#8b919f]">
                                Chilled (38°F)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <div className="text-right">
                            <div className="font-label-sm text-label-sm text-[#8b919f]">Claimant Agency</div>
                            <div className="font-label-md text-label-md text-[#abc7ff] font-bold">Hope Outreach Shelter</div>
                          </div>
                          <button
                            onClick={() => openVerificationModal('LP-8843', 'Warm Grain Bowls', 'Hope Outreach Shelter')}
                            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0C1E36] hover:bg-[#142B4D] border border-[#1E3A66] text-[#d7e3fc] font-label-md text-label-md font-bold transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-[#2b93f7]">qr_code_scanner</span>
                            <span>Claim Token</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Item 3: Awaiting Claim */}
                    {(filterStatus === 'all' || filterStatus === 'pending') && (
                      <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg hover:border-[#0070E0]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                        <div className="flex items-start gap-space-md">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0C1E36] border border-[#1E3A66]">
                            <img
                              className="w-full h-full object-cover"
                              alt="Farm fresh produce crates"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC1tWQ4p204qm3ZIboUUwTWAHVF0C2oD-gJ9YDioBkjec-xrSYDu6qWK6IKXw6ztn1fhbJe9gt_mBbiWwzNN0qVizXbKuSJKQdTH0pvS4WcTM8Zsk2aR7gQWbVYknREXs_xpO_FKm1SfziR7rGbDsEyjTyvJrnAu-Mkg2lTXrgII5Cv5kgOQFNdTOu6v2OQAmZ5ujPAWcVUAy1mQ-zLbbCu6DllA1WmwiKr9LSD8w"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-[#08192E]/90 text-[10px] text-[#abc7ff] text-center font-bold py-0.5 border-t border-[#1E3A66]">
                              Produce
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline-sm text-headline-sm text-white font-bold">
                                Mixed Seasonal Organic Orchard Crates
                              </span>
                              <span className="inline-flex items-center gap-1 bg-[#1A365D] border border-[#1E3A66] text-[#8b919f] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                                Awaiting Claim
                              </span>
                            </div>
                            <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-[#8b919f] mt-1 flex-wrap">
                              <span className="font-semibold text-white">5 Full Crates</span>
                              <span>•</span>
                              <span className="text-[#2b93f7] font-bold">75% Off Regular ($12.00)</span>
                              <span>•</span>
                              <span>Expires Tomorrow 9:00 AM</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[11px] px-2 py-0.5 bg-[#0C1E36] border border-[#1E3A66] rounded font-semibold text-[#8b919f]">
                                Organic
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-[#0C1E36] border border-[#1E3A66] rounded font-semibold text-[#8b919f]">
                                Raw
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <div className="text-right">
                            <div className="font-label-sm text-label-sm text-[#8b919f]">AI Redistribution</div>
                            <div className="font-label-md text-label-md text-[#2b93f7] font-bold">3 Shelters Alerted</div>
                          </div>
                          <button
                            onClick={() => showToast('Boost Broadcast Sent', 'Priority push dispatched to 14 registered non-profit hubs in your zip code.', 'campaign')}
                            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0C1E36] hover:bg-[#142B4D] border border-[#1E3A66] text-[#d7e3fc] font-label-md text-label-md font-bold transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-[#abc7ff]">campaign</span>
                            <span>Boost Ping</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Item 4: Verified & Settled */}
                    {(filterStatus === 'all' || filterStatus === 'completed') && (
                      <div className="bg-[#10233D]/70 border border-[#1E3A66] p-space-md rounded-xl shadow-lg hover:border-[#0070E0]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md opacity-90">
                        <div className="flex items-start gap-space-md">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0C1E36] border border-[#1E3A66]">
                            <img
                              className="w-full h-full object-cover"
                              alt="Bottles of organic chilled dairy milk"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF6Q4TJr4KPt91aQ1-0Nt-Plba6QalmvlNUgnc0URXoFLtdWs-K2aOm8z-ibocsYlPCcqtPOyWpfXuLjF8mqjk3yIRuleQ-ewUn1qstW7xEz4ug5Pn4sS8ly8ISfw3Kbg9v5dz6XcoDIR1FHYN-FEtI3iHPQhQhaztEzktqbuswISLubmwCQoH2xqrG1qaTIwbYvcZNHxoMl6CipjQIxHVZJbvxsOxkI1uh9FkpQk"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-[#08192E]/90 text-[10px] text-[#abc7ff] text-center font-bold py-0.5 border-t border-[#1E3A66]">
                              Dairy
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline-sm text-headline-sm text-white font-bold">
                                Grade A Pasteurized Dairy Cartons
                              </span>
                              <span className="inline-flex items-center gap-1 bg-[#0070E0]/15 border border-[#0070E0]/30 text-[#2b93f7] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Collected &amp; Verified
                              </span>
                            </div>
                            <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-[#8b919f] mt-1 flex-wrap">
                              <span className="font-semibold text-white">40 Quarts</span>
                              <span>•</span>
                              <span>Verified 28 mins ago</span>
                              <span>•</span>
                              <span className="font-bold text-[#abc7ff]">+120 Reward Points Added</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[11px] px-2 py-0.5 bg-[#0C1E36] border border-[#1E3A66] rounded font-semibold text-[#8b919f]">
                                Cold Chain SLA Met
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-[#0C1E36] border border-[#1E3A66] rounded font-semibold text-[#8b919f]">
                                Receipt #FL-0988
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <div className="text-right">
                            <div className="font-label-sm text-label-sm text-[#8b919f]">Settlement Status</div>
                            <div className="font-label-md text-label-md text-[#2b93f7] font-bold">Ledger Finalized</div>
                          </div>
                          <button
                            onClick={handleDownloadReceipt}
                            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0C1E36] hover:bg-[#142B4D] border border-[#1E3A66] text-[#8b919f] hover:text-white font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">description</span>
                            <span>Audit Slip</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Analytical Inset / AI Redistribution Intelligence */}
                  <div className="bg-[#10233D] border border-[#1E3A66] p-space-md rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-md">
                      <div className="w-12 h-12 rounded-xl bg-[#7a5fd2]/15 border border-[#7a5fd2]/30 flex items-center justify-center text-[#cdbdff] shrink-0">
                        <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                      </div>
                      <div>
                        <div className="font-label-lg text-label-lg text-white font-bold">AI Redistribution Demand Map</div>
                        <p className="font-body-sm text-body-sm text-[#8b919f]">
                          High hunger relief demand detected in District 4 (+34% weekend surge). Baked goods and proteins prioritised.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate?.('ai-rescue-agent')}
                      className="shrink-0 px-4 py-2 bg-[#0C1E36] hover:bg-[#142B4D] border border-[#1E3A66] text-[#2b93f7] font-label-md text-label-md font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Heatmap</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* QR Verification & Handshake Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071426]/85 backdrop-blur-md flex items-center justify-center p-space-md animate-in fade-in duration-200">
          <div className="bg-[#10233D] border border-[#1E3A66] rounded-2xl max-w-md w-full p-space-lg shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-[#8b919f] hover:text-white p-1 rounded-lg cursor-pointer"
              onClick={closeVerificationModal}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#0070E0]/20 border border-[#0070E0]/30 flex items-center justify-center text-[#2b93f7] mb-3 shadow-[0_0_15px_rgba(0,112,224,0.4)]">
                <span className="material-symbols-outlined text-[26px]">qr_code_2</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-white font-bold">
                Rescue Handshake Verification
              </span>
              <p className="font-body-sm text-body-sm text-[#8b919f] mt-1">
                Scan this cryptographic QR token when recipient logistics arrives.
              </p>

              {/* Simulated Crisp QR Code Box */}
              <div className="mt-5 p-4 bg-[#08192E] border border-[#1A365D] rounded-xl flex flex-col items-center shadow-inner">
                <div className="w-48 h-48 bg-white p-3 rounded-lg flex flex-col justify-between shadow-sm">
                  <svg className="w-full h-full text-[#08192E]" fill="currentColor" viewBox="0 0 100 100">
                    <rect fill="currentColor" height="30" rx="3" width="30" x="0" y="0" />
                    <rect fill="#FFFFFF" height="20" rx="1" width="20" x="5" y="5" />
                    <rect fill="currentColor" height="10" rx="1" width="10" x="10" y="10" />
                    <rect fill="currentColor" height="30" rx="3" width="30" x="70" y="0" />
                    <rect fill="#FFFFFF" height="20" rx="1" width="20" x="75" y="5" />
                    <rect fill="currentColor" height="10" rx="1" width="10" x="80" y="10" />
                    <rect fill="currentColor" height="30" rx="3" width="30" x="0" y="70" />
                    <rect fill="#FFFFFF" height="20" rx="1" width="20" x="5" y="75" />
                    <rect fill="currentColor" height="10" rx="1" width="10" x="10" y="80" />
                    <rect height="6" width="6" x="36" y="8" />
                    <rect height="6" width="8" x="46" y="8" />
                    <rect height="6" width="12" x="36" y="20" />
                    <rect height="6" width="8" x="52" y="20" />
                    <rect height="12" width="6" x="8" y="38" />
                    <rect height="8" width="8" x="20" y="44" />
                    <rect height="10" width="10" x="36" y="36" />
                    <rect height="6" width="14" x="52" y="36" />
                    <rect height="14" width="8" x="72" y="40" />
                    <rect height="6" width="8" x="86" y="36" />
                    <rect height="14" width="6" x="36" y="52" />
                    <rect height="6" width="14" x="48" y="56" />
                    <rect height="12" width="6" x="68" y="60" />
                    <rect height="6" width="12" x="82" y="52" />
                    <rect height="6" width="14" x="36" y="72" />
                    <rect height="14" width="8" x="56" y="72" />
                    <rect height="8" width="14" x="72" y="80" />
                    <rect height="6" width="6" x="44" y="86" />
                    <rect height="6" width="6" x="88" y="70" />
                  </svg>
                </div>
                <div className="mt-3 font-mono text-[12px] font-bold text-[#abc7ff] tracking-widest uppercase">
                  LOT #{qrModalData.lotId}-AUTHENTICATED
                </div>
                <div className="font-body-sm text-body-sm text-[#8b919f] mt-0.5">
                  Assigned to: {qrModalData.agency}
                </div>
              </div>

              {/* Action Confirmation */}
              <div className="mt-5 w-full flex flex-col gap-2">
                <button
                  className="h-11 w-full bg-[#0070E0] hover:bg-[#005bb8] text-white font-label-lg text-label-lg font-bold rounded-lg shadow-[0_0_15px_rgba(0,112,224,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  onClick={simulateSuccessfulClaim}
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Confirm Courier Handover</span>
                </button>
                <button
                  className="h-9 w-full bg-transparent hover:bg-[#0C1E36] text-[#8b919f] hover:text-white font-label-md text-label-md rounded-lg transition-colors cursor-pointer"
                  onClick={closeVerificationModal}
                >
                  Cancel &amp; Keep Active
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
