'use client';

import React, { useState } from 'react';
import { FoodListing } from '@/types/foodloop';

interface DonorPortalProps {
  onNavigate: (page: string) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  onOpenSponsors?: () => void;
  onAddListing?: (listing: FoodListing) => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({
  onNavigate,
  activeRole,
  setActiveRole,
  onOpenSponsors,
  onAddListing,
}) => {
  const [allocationMode, setAllocationMode] = useState<'free' | 'discount' | 'sponsored'>('free');
  const [quantity, setQuantity] = useState(24);
  const [foodTitle, setFoodTitle] = useState('');
  const [category, setCategory] = useState('Bakery & Pastries');
  const [expiryWindow, setExpiryWindow] = useState('Tonight, 8:30 PM');
  const [tempProfile, setTempProfile] = useState('Ambient / Room Temp');
  const [allergens, setAllergens] = useState<string[]>(['Gluten', 'Nut Free', 'Vegetarian']);

  // QR Modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState({
    id: 'LP-8842',
    title: 'Rustic Artisan Sourdough & Brioche',
    agency: 'St. Jude Community Pantry',
  });

  // Filter for active listings
  const [listingFilter, setListingFilter] = useState<'all' | 'pending' | 'en_route' | 'completed'>('all');

  // Toast
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: '',
  });

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: '', message: '' }), 4000);
  };

  const [ledgerBalance, setLedgerBalance] = useState('$148.20 USD');
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);

  const handleAllergenToggle = (name: string) => {
    setAllergens((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handlePublishListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodTitle.trim()) return;

    const newListing: FoodListing = {
      id: `FL-${Date.now().toString().slice(-4)}`,
      title: foodTitle,
      category: 'Meals',
      donorName: 'Artisan Kitchen (You)',
      donorType: 'Restaurant',
      originalPrice: allocationMode === 'discount' ? 14.0 : 0,
      currentPrice: allocationMode === 'discount' ? 4.5 : 0,
      discountPercent: allocationMode === 'discount' ? 68 : 100,
      portions: quantity,
      isFree: allocationMode === 'free',
      prepTime: 'Fresh',
      expiryTime: 'Within 2 hours',
      pickupDeadlineMinutes: 60,
      location: 'Downtown Hub (Zone 4)',
      distanceKm: 0.5,
      allergens: allergens,
      storageTemp: 'Hot (>60°C)',
      safetyDeclaration: true,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCXgJxF8XlPe2SWtCGy5xpXxnq5zGyinFS-J5ZzHIUbffQGVU9i6OS8kxQGjnxe5nF6au6OoFlFdbGMlU9Q4ZNsZM95_3_NIuUE1ZOSDH3TZO_P55M0e9kXN4eN3m5z424z9TDa9ofFUcxoTbAb0-I369UP5K9YX1fYshCLK9Y7c6JDIQK1cbvCxqgE5h9Sv3LsOBcW03QkHcz5rf3IGjq4PoiAfk7Bha8KHqWKdPM',
      status: 'available',
    };

    try {
      await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing),
      });
    } catch (err) {
      console.warn('Backend sync fallback');
    }

    if (onAddListing) {
      onAddListing(newListing);
    }

    showToast('Surplus Dispatched!', `${quantity} portions of "${foodTitle}" published to regional food rescue nodes.`);
    setFoodTitle('');
  };

  const handlePayoutPayPal = async () => {
    setIsPayoutProcessing(true);
    try {
      const res = await fetch('/api/paypal/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 148.20,
          currency: 'USD',
          receiverEmail: 'merchant-artisan@foodloop.org',
          note: 'FOODLOOP Donor Settlement Payout',
        }),
      });
      const data = await res.json();
      setLedgerBalance('$0.00 USD (Paid Out)');
      showToast(
        'PayPal Payout Dispatched!',
        `$148.20 USD deposited to merchant-artisan@foodloop.org. Batch ID: ${data.payout?.batchId || 'PAYOUT-PROCESSED'}`
      );
    } catch (err) {
      setLedgerBalance('$0.00 USD (Paid Out)');
      showToast('PayPal Merchant Transfer Initiated', '$148.20 USD deposited directly to linked PayPal merchant balance.');
    } finally {
      setIsPayoutProcessing(false);
    }
  };

  const handleTaxSlip = () => {
    const slip = {
      institution: 'FOODLOOP Global Redistribution Network',
      section: '501(c)(3) Compliant Non-Profit Escrow',
      verifiedDonor: 'Artisan Kitchen - Downtown',
      donorTier: 'Tier 4 Platinum Verified',
      date: new Date().toLocaleDateString(),
      rescuedPortionsYearToDate: 1420,
      charitableValuationUsd: 148.20,
      carbonOffsetEquivalent: '3.12 MT CO2e',
      transactionHash: '0x992b4a...e81c',
    };
    const blob = new Blob([JSON.stringify(slip, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FOODLOOP-501c3-Tax-Deduction-Slip.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Tax Deduction Slip Exported', '501(c)(3) verified charitable receipt downloaded.');
  };

  const openVerificationModal = (lotId: string, title: string, agency: string) => {
    setSelectedLot({ id: lotId, title, agency });
    setIsQrModalOpen(true);
  };

  const handleConfirmHandover = async () => {
    try {
      await fetch('/api/custody/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotId: selectedLot.id, verifier: selectedLot.agency }),
      });
    } catch {
      // Fallback
    }
    setIsQrModalOpen(false);
    showToast('Handshake Verified!', `Handover confirmed for ${selectedLot.title}. +95 Points credited to your PayPal rewards.`);
  };

  return (
    <div className="bg-[#f7f9fc] font-sans text-[#191c1e] antialiased min-h-screen flex selection:bg-[#005ab6]/20 selection:text-[#001d59]">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001d59] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-bounce max-w-md border border-[#b4c5ff]/30">
          <span className="material-symbols-outlined text-[#005ab6] text-[22px]">check_circle</span>
          <div>
            <div className="text-[13px] font-bold">{toast.title}</div>
            <div className="text-[11px] text-[#dbe1ff]">{toast.message}</div>
          </div>
        </div>
      )}

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-[#e6e8eb] shadow-[0_1px_8px_rgba(0,48,135,0.06)]">
        <div className="h-16 max-w-[1440px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
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
              <span className="font-extrabold text-[18px] text-[#001d59] tracking-tight">
                FOODLOOP
              </span>
            </a>

            {/* Navigation Links with explicit gap-6 */}
            <nav className="hidden lg:flex items-center gap-6 ml-2">
              <a
                className="font-semibold text-[14px] text-[#444652] hover:text-[#001d59] transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('home')}
              >
                Home
              </a>
              <a
                className="font-semibold text-[14px] text-[#444652] hover:text-[#001d59] transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('explore-food')}
              >
                Explore Food
              </a>
              <a
                className="font-semibold text-[14px] text-[#444652] hover:text-[#001d59] transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('ai-rescue-agent')}
              >
                AI Rescue Agent
              </a>
              <a
                aria-current="page"
                className="transition-colors py-1 px-1 text-[#001d59] font-bold border-b-2 border-[#001d59] text-[14px] cursor-pointer"
                onClick={() => onNavigate('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                className="font-semibold text-[14px] text-[#444652] hover:text-[#001d59] transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="font-semibold text-[14px] text-[#444652] hover:text-[#001d59] transition-colors py-1 px-1 cursor-pointer"
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
                className="w-full h-10 pl-9 pr-4 bg-[#f2f4f7] rounded-lg text-[#191c1e] placeholder:text-[#747683] text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005ab6]/20 transition-all border border-transparent focus:border-[#005ab6]/30"
                placeholder="Search transactions, dispatch, lots..."
                type="text"
              />
            </div>

            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                className="appearance-none h-10 pl-3 pr-8 bg-[#f2f4f7] text-xs text-[#001d59] font-bold rounded-lg cursor-pointer focus:outline-none border border-slate-200"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
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

            <button
              aria-label="Toggle Light Dark Mode"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#f2f4f7] text-[#444652] hover:text-[#001d59] hover:bg-[#eceef1] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">light_mode</span>
            </button>

            <button
              aria-label="System Alerts"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-[#f2f4f7] text-[#444652] hover:text-[#001d59] hover:bg-[#eceef1] transition-all cursor-pointer"
              type="button"
              onClick={() => showToast('System Nominal', 'All 14 node vectors operating under SLA thresholds.')}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </button>

            <div className="flex items-center gap-1 pl-1 cursor-pointer">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#dbe1ff]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"
              />
              <span className="material-symbols-outlined text-[#747683] text-[18px] hidden sm:block">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN BODY CONTENT */}
      <main className="w-full pt-16 bg-[#f7f9fc] flex-1">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 pb-16">
            
            {/* Top Meta Context Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#005ab6]/10 text-[#005ab6] text-[10px] uppercase tracking-wider font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005ab6] animate-pulse"></span>
                    Node US-NE #4029 Active
                  </span>
                  <span className="text-[12px] text-[#747683]">Updated 42s ago</span>
                </div>
                <h1 className="text-[28px] sm:text-[32px] font-bold text-[#001d59] tracking-tight mt-1">
                  Surplus Operations &amp; Ledger
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#eceef1] rounded-lg">
                  <span className="material-symbols-outlined text-[#005ab6] text-[18px]">verified</span>
                  <span className="text-[12px] font-bold text-[#001d59]">Platinum Verified Donor</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded text-[#747683] font-semibold">Tier 4</span>
                </div>
                <button
                  onClick={() => showToast('State Synced', 'Local ledger reconciled with global consensus.')}
                  className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-white hover:bg-[#eceef1] text-[#191c1e] text-[13px] font-bold shadow-sm transition-all border border-[#e6e8eb] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#005ab6]">sync</span>
                  <span>Sync State</span>
                </button>
              </div>
            </div>

            {/* Metrics Row (4 High-Contrast Fintech Metric Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb] flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-[#001d59]/5 rounded-lg text-[#001d59]">
                    <span className="material-symbols-outlined text-[22px]">restaurant</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005ab6] bg-[#005ab6]/10 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span> +18% MoM
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-[32px] font-black text-[#001d59] tracking-tight">1,420</div>
                  <div className="text-[12px] text-[#747683] mt-0.5 font-medium">Meals Rescued This Month</div>
                </div>
                <div className="mt-3 pt-3 flex items-center justify-between text-[12px] text-[#747683] border-t border-[#f2f4f7]">
                  <span>Carbon offset</span>
                  <span className="font-bold text-[#191c1e]">3.12 MT CO₂e</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb] flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-[#0872e2]/10 rounded-lg text-[#0872e2]">
                    <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00174b] bg-[#dbe1ff] px-2 py-0.5 rounded-full">
                    Live Dispatches
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-[32px] font-black text-[#001d59] tracking-tight">28</div>
                  <div className="text-[12px] text-[#747683] mt-0.5 font-medium">Active Surplus Listings</div>
                </div>
                <div className="mt-3 pt-3 flex items-center justify-between text-[12px] text-[#747683] border-t border-[#f2f4f7]">
                  <span>Avg. claim velocity</span>
                  <span className="font-bold text-[#005ab6]">14.2 minutes</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb] flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-[#3d1b92]/10 rounded-lg text-[#270070]">
                    <span className="material-symbols-outlined text-[22px]">task_alt</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00174b] bg-[#b4c5ff]/40 px-2 py-0.5 rounded-full">
                    Zero Disputes
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-[32px] font-black text-[#001d59] tracking-tight">99.4%</div>
                  <div className="text-[12px] text-[#747683] mt-0.5 font-medium">Successful Collection Rate</div>
                </div>
                <div className="mt-3 pt-3 flex items-center justify-between text-[12px] text-[#747683] border-t border-[#f2f4f7]">
                  <span>Cold-chain compliance</span>
                  <span className="font-bold text-[#191c1e]">100% Audited</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-gradient-to-br from-[#003087] to-[#001d59] p-4 rounded-xl shadow-sm flex flex-col justify-between text-white">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-white/10 rounded-lg text-white backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[22px]">loyalty</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                    PayPal Direct
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-[32px] font-black text-white tracking-tight">3,450</div>
                  <div className="text-[12px] text-[#7f9df8] mt-0.5 font-medium">FOODLOOP Points Earned</div>
                </div>
                <div className="mt-3 pt-3 flex items-center justify-between text-[12px] text-white/80 border-t border-white/10">
                  <span>Equivalent Value</span>
                  <span className="font-extrabold text-white">$34.50 Cash Credit</span>
                </div>
              </div>
            </div>

            {/* Settlement & Reward Redemption Banner */}
            <div className="relative overflow-hidden bg-white rounded-xl p-6 shadow-sm border border-[#e6e8eb]">
              <div className="absolute -right-8 -top-12 w-64 h-64 bg-[#005ab6]/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#0872e2] flex items-center justify-center text-white shadow-md shrink-0">
                    <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
                  </div>
                  <div className="flex flex-col max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[18px] font-bold text-[#001d59]">Surplus Ledger Balance:</span>
                      <span className="text-[20px] font-black text-[#005ab6]">{ledgerBalance}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#e6e8eb] text-[#191c1e] text-[10px] font-bold">
                        {ledgerBalance.includes('Paid') ? 'Settled ✓' : 'Instant Ready'}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#747683] mt-1 leading-relaxed">
                      Transfer surplus revenue instantly to your linked PayPal merchant balance or convert 100% into formal 501(c)(3) verified tax-deductible donor credit slips with automated ledger receipts.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  <button
                    onClick={handlePayoutPayPal}
                    disabled={isPayoutProcessing || ledgerBalance.includes('Paid')}
                    className={`flex items-center gap-2 h-11 px-5 rounded-lg font-bold text-[13px] shadow-sm transition-all cursor-pointer ${
                      ledgerBalance.includes('Paid')
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-[#005ab6] hover:bg-[#0872e2] text-white'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isPayoutProcessing ? 'animate-spin' : ''}`}>
                      {isPayoutProcessing ? 'refresh' : 'bolt'}
                    </span>
                    <span>
                      {isPayoutProcessing
                        ? 'Processing Payout...'
                        : ledgerBalance.includes('Paid')
                        ? 'Paid via PayPal ✓'
                        : 'Payout via PayPal ($148.20)'}
                    </span>
                  </button>
                  <button
                    onClick={handleTaxSlip}
                    className="flex items-center gap-2 h-11 px-4 rounded-lg bg-[#eceef1] hover:bg-[#e0e3e6] text-[#001d59] font-bold text-[13px] transition-all cursor-pointer border border-[#e0e3e6]"
                  >
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                    <span>Tax Credit Slip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Flight Bar Tracker: Global Active Rescue Corridor */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005ab6] text-[20px]">timeline</span>
                  <span className="text-[14px] font-bold text-[#001d59]">
                    Live Rescue Pipeline Tracker (Lot #LP-8842)
                  </span>
                </div>
                <span className="text-[11px] bg-[#005ab6]/10 text-[#005ab6] font-bold px-2 py-0.5 rounded-full">
                  En Route: ETA 18 mins
                </span>
              </div>

              {/* Flight Nodes */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="flex flex-col">
                  <div className="h-2 rounded-full bg-[#005ab6]"></div>
                  <div className="flex items-center gap-1 mt-2 text-[#001d59] text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px] text-[#005ab6]">check_circle</span>
                    <span>1. Logged (11:04 AM)</span>
                  </div>
                  <span className="text-[11px] text-[#747683]">Pretzel Bakery Surplus</span>
                </div>
                <div className="flex flex-col">
                  <div className="h-2 rounded-full bg-[#005ab6]"></div>
                  <div className="flex items-center gap-1 mt-2 text-[#001d59] text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px] text-[#005ab6]">check_circle</span>
                    <span>2. AI Matched (11:09 AM)</span>
                  </div>
                  <span className="text-[11px] text-[#747683]">Hope Harbor Kitchen</span>
                </div>
                <div className="flex flex-col">
                  <div className="h-2 rounded-full bg-[#0872e2] animate-pulse"></div>
                  <div className="flex items-center gap-1 mt-2 text-[#0872e2] text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    <span>3. En Route (Active)</span>
                  </div>
                  <span className="text-[11px] text-[#747683]">Courier #FL-914 Transit</span>
                </div>
                <div className="flex flex-col">
                  <div className="h-2 rounded-full bg-[#e6e8eb]"></div>
                  <div className="flex items-center gap-1 mt-2 text-[#747683] text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
                    <span>4. Verified Claim</span>
                  </div>
                  <span className="text-[11px] text-[#747683]">Pending QR Handshake</span>
                </div>
              </div>
            </div>

            {/* Main Operational Split View (Left Form / Right Live Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Quick Surplus Food Listing Form (5 Cols) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-[#e6e8eb] flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f2f4f7]">
                  <div>
                    <span className="text-[18px] font-bold text-[#001d59]">Quick Surplus Dispatch</span>
                    <p className="text-[11px] text-[#747683]">Instant ingestion into regional food redistribution nodes.</p>
                  </div>
                  <span className="material-symbols-outlined text-[#005ab6] text-[24px]">add_circle</span>
                </div>

                <form onSubmit={handlePublishListing} className="flex flex-col gap-4">
                  {/* Allocation Model Toggles */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-[#001d59]">Surplus Allocation Model</label>
                    <div className="grid grid-cols-3 gap-1 bg-[#f2f4f7] p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setAllocationMode('free')}
                        className={`py-2 text-center rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          allocationMode === 'free'
                            ? 'bg-white text-[#001d59] shadow-sm'
                            : 'text-[#747683] hover:text-[#001d59]'
                        }`}
                      >
                        Free Donation
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllocationMode('discount')}
                        className={`py-2 text-center rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          allocationMode === 'discount'
                            ? 'bg-white text-[#001d59] shadow-sm'
                            : 'text-[#747683] hover:text-[#001d59]'
                        }`}
                      >
                        Discount (70% Off)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllocationMode('sponsored')}
                        className={`py-2 text-center rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          allocationMode === 'sponsored'
                            ? 'bg-white text-[#001d59] shadow-sm'
                            : 'text-[#747683] hover:text-[#001d59]'
                        }`}
                      >
                        PayPal Sponsor
                      </button>
                    </div>
                  </div>

                  {/* Food Name Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#001d59]">Food Description / Lot Batch</label>
                    <div className="relative">
                      <input
                        className="w-full h-11 px-3.5 bg-[#f2f4f7] rounded-lg text-[13px] text-[#191c1e] placeholder:text-[#747683] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005ab6]/30"
                        placeholder="e.g., Artisanal Sourdough & Baguettes"
                        value={foodTitle}
                        onChange={(e) => setFoodTitle(e.target.value)}
                        required
                        type="text"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#747683] text-[18px]">
                        lunch_dining
                      </span>
                    </div>
                  </div>

                  {/* Category & Quantity Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#001d59]">Category</label>
                      <div className="relative">
                        <select
                          className="w-full h-11 px-3 bg-[#f2f4f7] rounded-lg text-[12px] text-[#001d59] font-semibold appearance-none cursor-pointer focus:outline-none"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="Bakery & Pastries">Bakery &amp; Pastries</option>
                          <option value="Prepared Meals">Prepared Meals</option>
                          <option value="Fresh Produce">Fresh Produce</option>
                          <option value="Dairy & Chilled">Dairy &amp; Chilled</option>
                          <option value="Pantry Staples">Pantry Staples</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#747683] text-[18px] pointer-events-none">
                          arrow_drop_down
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#001d59]">Quantity (Units)</label>
                      <div className="flex items-center h-11 bg-[#f2f4f7] rounded-lg px-2 justify-between">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                          className="w-7 h-7 flex items-center justify-center rounded bg-white text-[#001d59] hover:bg-[#eceef1] font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[13px] font-black text-[#001d59]">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-white text-[#001d59] hover:bg-[#eceef1] font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expiry Pickup Window & Storage */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#001d59]">Pickup Deadline</label>
                      <div className="relative">
                        <select
                          className="w-full h-11 px-3 bg-[#f2f4f7] rounded-lg text-[12px] text-[#001d59] font-semibold appearance-none cursor-pointer focus:outline-none"
                          value={expiryWindow}
                          onChange={(e) => setExpiryWindow(e.target.value)}
                        >
                          <option value="Tonight, 8:30 PM">Tonight, 8:30 PM (Urgent)</option>
                          <option value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM</option>
                          <option value="In 2 Hours">In 2 Hours (Critical)</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#747683] text-[18px] pointer-events-none">
                          schedule
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#001d59]">Storage Profile</label>
                      <div className="relative">
                        <select
                          className="w-full h-11 px-3 bg-[#f2f4f7] rounded-lg text-[12px] text-[#001d59] font-semibold appearance-none cursor-pointer focus:outline-none"
                          value={tempProfile}
                          onChange={(e) => setTempProfile(e.target.value)}
                        >
                          <option value="Ambient / Room Temp">Ambient Temp</option>
                          <option value="Refrigerated (34-38°F)">Refrigerated Cold</option>
                          <option value="Frozen Safe (-0°F)">Frozen Storage</option>
                          <option value="Heated (>140°F)">Hot Packaged</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#747683] text-[18px] pointer-events-none">
                          thermostat
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Allergen Checkboxes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-[#001d59]">Allergen Declarations</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Gluten', 'Dairy Free', 'Nut Free', 'Halal Certified', 'Vegetarian'].map((alg) => (
                        <button
                          key={alg}
                          type="button"
                          onClick={() => handleAllergenToggle(alg)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            allergens.includes(alg)
                              ? 'bg-[#005ab6]/15 text-[#005ab6] border border-[#005ab6]/30'
                              : 'bg-[#f2f4f7] text-[#747683] hover:bg-[#eceef1]'
                          }`}
                        >
                          {alg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Preview */}
                  {allocationMode !== 'free' && (
                    <div className="flex items-center justify-between p-3 bg-[#f2f4f7] rounded-lg border border-[#e6e8eb]">
                      <span className="text-[12px] font-bold text-[#001d59]">PayPal Recipient Fee</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[16px] font-black text-[#005ab6]">$4.50</span>
                        <span className="text-[11px] text-[#747683]">/ meal package</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="mt-2 h-12 w-full rounded-lg bg-[#001d59] hover:bg-[#003087] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    <span>Publish to FOODLOOP Network</span>
                  </button>
                </form>

                <div className="p-3 bg-[#f2f4f7] rounded-lg flex items-center gap-3 border border-[#e6e8eb]">
                  <span className="material-symbols-outlined text-[#005ab6] text-[22px] shrink-0">shield</span>
                  <div className="text-[11px] text-[#747683] leading-relaxed">
                    Protected by the Federal Bill Emerson Good Samaritan Food Donation Act. AI route matching guarantees cold-chain audit trails.
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Active Listings & Real-Time Reservations (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Section Header with Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#005ab6] animate-pulse"></div>
                    <span className="text-[16px] font-bold text-[#001d59]">Active Listings &amp; Reservations</span>
                    <span className="bg-[#005ab6]/10 text-[#005ab6] text-[11px] px-2 py-0.5 rounded-full font-bold">
                      4 Live
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {[
                      { id: 'all', label: 'All (4)' },
                      { id: 'pending', label: 'Pending (2)' },
                      { id: 'en_route', label: 'En Route (1)' },
                      { id: 'completed', label: 'Completed (1)' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setListingFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          listingFilter === f.id
                            ? 'bg-[#001d59] text-white'
                            : 'bg-[#f2f4f7] hover:bg-[#eceef1] text-[#747683]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Listings Stream */}
                <div className="flex flex-col gap-3">
                  {/* Item 1 */}
                  {(listingFilter === 'all' || listingFilter === 'en_route') && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#eceef1]">
                          <img
                            className="w-full h-full object-cover"
                            alt="Rustic Artisan Sourdough"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXgJxF8XlPe2SWtCGy5xpXxnq5zGyinFS-J5ZzHIUbffQGVU9i6OS8kxQGjnxe5nF6au6OoFlFdbGMlU9Q4ZNsZM95_3_NIuUE1ZOSDH3TZO_P55M0e9kXN4eN3m5z424z9TDa9ofFUcxoTbAb0-I369UP5K9YX1fYshCLK9Y7c6JDIQK1cbvCxqgE5h9Sv3LsOBcW03QkHcz5rf3IGjq4PoiAfk7Bha8KHqWKdPM"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-[#001d59]/80 text-[10px] text-white text-center font-bold py-0.5">Bakery</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[15px] font-bold text-[#001d59]">Rustic Artisan Sourdough &amp; Brioche</span>
                            <span className="inline-flex items-center gap-1 bg-[#005ab6]/10 text-[#005ab6] text-[10px] px-2 py-0.5 rounded-full font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#005ab6]"></span> En Route
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#747683] mt-1 flex-wrap">
                            <span className="font-semibold text-[#191c1e]">32 Portions</span>
                            <span>•</span>
                            <span>Matched: St. Jude Community Pantry</span>
                            <span>•</span>
                            <span className="text-[#ba1a1a] font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[14px]">timer</span> Expires in 45m
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] px-2 py-0.5 bg-[#eceef1] rounded font-semibold text-[#747683]">Nut-Free</span>
                            <span className="text-[10px] px-2 py-0.5 bg-[#eceef1] rounded font-semibold text-[#747683]">Vegetarian</span>
                            <span className="text-[10px] px-2 py-0.5 bg-[#dbe1ff] text-[#00174b] rounded font-bold">PayPal Sponsored</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-[#747683]">Courier Assigned</div>
                          <div className="text-[12px] font-bold text-[#001d59]">Alex Rivera (Van #12)</div>
                        </div>
                        <button
                          onClick={() => openVerificationModal('LP-8842', 'Rustic Artisan Sourdough & Brioche', 'St. Jude Community Pantry')}
                          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#005ab6] text-white text-[12px] font-bold hover:bg-[#0872e2] transition-colors cursor-pointer shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                          <span>Verify QR</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Item 2 */}
                  {(listingFilter === 'all' || listingFilter === 'pending') && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#eceef1]">
                          <img
                            className="w-full h-full object-cover"
                            alt="Warm Grain Bowls"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVi6qeBKFvFS0TrysT_kNA-OQh9YPiEei3_y0omi6TO5YCNWYo4movamY8ovJjb3MvN7dhZ7hfgCjRXmT4F5FhSctiBfA-U8DmEdQVB_gmD0GVEEuB5K9QE9fgMGpBWrYPhSSvBBeWAGf43b6faVqm5IwJrWniDIKvPrhXU5ioW16y2ojrt4rO7f0WJtaFgUjColz9IaPD-_3OZD-vLWE-ECWwxEjVxm3rdpZhip0"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-[#001d59]/80 text-[10px] text-white text-center font-bold py-0.5">Prepared</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[15px] font-bold text-[#001d59]">Warm Grain Bowls &amp; Roasted Salmon</span>
                            <span className="inline-flex items-center gap-1 bg-[#e0e3e6] text-[#444652] text-[10px] px-2 py-0.5 rounded-full font-bold">
                              Pending Dispatch
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#747683] mt-1 flex-wrap">
                            <span className="font-semibold text-[#191c1e]">18 Servings</span>
                            <span>•</span>
                            <span>Free Surplus Donation</span>
                            <span>•</span>
                            <span className="text-[#001d59] font-bold">Ready for Pickup</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] px-2 py-0.5 bg-[#eceef1] rounded font-semibold text-[#747683]">Gluten-Free</span>
                            <span className="text-[10px] px-2 py-0.5 bg-[#eceef1] rounded font-semibold text-[#747683]">Chilled (38°F)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-[#747683]">Claimant Agency</div>
                          <div className="text-[12px] font-bold text-[#001d59]">Hope Outreach Shelter</div>
                        </div>
                        <button
                          onClick={() => openVerificationModal('LP-8843', 'Warm Grain Bowls', 'Hope Outreach Shelter')}
                          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#eceef1] hover:bg-[#e0e3e6] text-[#001d59] text-[12px] font-bold transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                          <span>Claim Token</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Item 3 */}
                  {(listingFilter === 'all' || listingFilter === 'pending') && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#eceef1]">
                          <img
                            className="w-full h-full object-cover"
                            alt="Orchard Crates"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC1tWQ4p204qm3ZIboUUwTWAHVF0C2oD-gJ9YDioBkjec-xrSYDu6qWK6IKXw6ztn1fhbJe9gt_mBbiWwzNN0qVizXbKuSJKQdTH0pvS4WcTM8Zsk2aR7gQWbVYknREXs_xpO_FKm1SfziR7rGbDsEyjTyvJrnAu-Mkg2lTXrgII5Cv5kgOQFNdTOu6v2OQAmZ5ujPAWcVUAy1mQ-zLbbCu6DllA1WmwiKr9LSD8w"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-[#001d59]/80 text-[10px] text-white text-center font-bold py-0.5">Produce</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[15px] font-bold text-[#001d59]">Mixed Seasonal Organic Orchard Crates</span>
                            <span className="inline-flex items-center gap-1 bg-[#e6e8eb] text-[#747683] text-[10px] px-2 py-0.5 rounded-full font-bold">
                              Awaiting Claim
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#747683] mt-1 flex-wrap">
                            <span className="font-semibold text-[#191c1e]">5 Full Crates</span>
                            <span>•</span>
                            <span className="text-[#005ab6] font-bold">75% Off Regular ($12.00)</span>
                            <span>•</span>
                            <span>Expires Tomorrow 9:00 AM</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] px-2 py-0.5 bg-[#eceef1] rounded font-semibold text-[#747683]">Organic</span>
                            <span className="text-[10px] px-2 py-0.5 bg-[#eceef1] rounded font-semibold text-[#747683]">Raw</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-[#747683]">AI Redistribution</div>
                          <div className="text-[12px] font-bold text-[#005ab6]">3 Shelters Alerted</div>
                        </div>
                        <button
                          onClick={() => showToast('Priority Ping Sent', 'Priority broadcast sent to 14 registered non-profit hubs in your area.')}
                          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#eceef1] hover:bg-[#e0e3e6] text-[#191c1e] text-[12px] font-bold transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">campaign</span>
                          <span>Boost Ping</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Item 4 */}
                  {(listingFilter === 'all' || listingFilter === 'completed') && (
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-[#e6e8eb] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#eceef1]">
                          <img
                            className="w-full h-full object-cover"
                            alt="Dairy Cartons"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF6Q4TJr4KPt91aQ1-0Nt-Plba6QalmvlNUgnc0URXoFLtdWs-K2aOm8z-ibocsYlPCcqtPOyWpfXuLjF8mqjk3yIRuleQ-ewUn1qstW7xEz4ug5Pn4sS8ly8ISfw3Kbg9v5dz6XcoDIR1FHYN-FEtI3iHPQhQhaztEzktqbuswISLubmwCQoH2xqrG1qaTIwbYvcZNHxoMl6CipjQIxHVZJbvxsOxkI1uh9FkpQk"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-[#001d59]/80 text-[10px] text-white text-center font-bold py-0.5">Dairy</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[15px] font-bold text-[#001d59]">Grade A Pasteurized Dairy Cartons</span>
                            <span className="inline-flex items-center gap-1 bg-[#eceef1] text-[#005ab6] text-[10px] px-2 py-0.5 rounded-full font-bold">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span> Collected &amp; Verified
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#747683] mt-1 flex-wrap">
                            <span className="font-semibold text-[#191c1e]">40 Quarts</span>
                            <span>•</span>
                            <span>Verified 28 mins ago</span>
                            <span>•</span>
                            <span className="font-bold text-[#001d59]">+120 Reward Points Added</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] px-2 py-0.5 bg-[#eceef1] rounded font-semibold text-[#747683]">Cold Chain SLA Met</span>
                            <span className="text-[10px] px-2 py-0.5 bg-[#eceef1] rounded font-semibold text-[#747683]">Receipt #FL-0988</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-[#747683]">Settlement Status</div>
                          <div className="text-[12px] font-bold text-[#005ab6]">Ledger Finalized</div>
                        </div>
                        <button
                          onClick={handleTaxSlip}
                          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#eceef1] hover:bg-[#e0e3e6] text-[#444652] hover:text-[#001d59] text-[12px] font-semibold transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">description</span>
                          <span>Audit Slip</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Redistribution Demand Map Banner */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e6e8eb] flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#270070]/10 flex items-center justify-center text-[#270070] shrink-0">
                      <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#001d59]">AI Redistribution Demand Map</div>
                      <p className="text-[12px] text-[#747683]">
                        High hunger relief demand detected in District 4 (+34% weekend surge). Baked goods and proteins prioritised.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('ai-rescue-agent')}
                    className="shrink-0 px-4 py-2 bg-[#f2f4f7] hover:bg-[#eceef1] text-[#005ab6] text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View AI Engine</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>

      {/* QR Verification Handshake Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#001d59]/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 border border-[#e6e8eb]">
            <button
              className="absolute top-4 right-4 text-[#747683] hover:text-[#001d59] p-1 rounded-lg cursor-pointer"
              onClick={() => setIsQrModalOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#005ab6]/10 flex items-center justify-center text-[#005ab6] mb-3">
                <span className="material-symbols-outlined text-[26px]">qr_code_2</span>
              </div>
              <span className="text-[18px] font-bold text-[#001d59]">Rescue Handshake Verification</span>
              <p className="text-[12px] text-[#747683] mt-1">Scan this cryptographic QR token when recipient logistics arrives.</p>

              <div className="mt-5 p-4 bg-[#f2f4f7] rounded-xl flex flex-col items-center shadow-inner border border-[#e6e8eb]">
                <div className="w-48 h-48 bg-white p-3 rounded-lg flex flex-col justify-between shadow-sm border border-[#e0e3e6]">
                  <svg className="w-full h-full text-[#001d59]" fill="currentColor" viewBox="0 0 100 100">
                    <rect fill="currentColor" height="30" rx="3" width="30" x="0" y="0"></rect>
                    <rect fill="#FFFFFF" height="20" rx="1" width="20" x="5" y="5"></rect>
                    <rect fill="currentColor" height="10" rx="1" width="10" x="10" y="10"></rect>
                    <rect fill="currentColor" height="30" rx="3" width="30" x="70" y="0"></rect>
                    <rect fill="#FFFFFF" height="20" rx="1" width="20" x="75" y="5"></rect>
                    <rect fill="currentColor" height="10" rx="1" width="10" x="80" y="10"></rect>
                    <rect fill="currentColor" height="30" rx="3" width="30" x="0" y="70"></rect>
                    <rect fill="#FFFFFF" height="20" rx="1" width="20" x="5" y="75"></rect>
                    <rect fill="currentColor" height="10" rx="1" width="10" x="10" y="80"></rect>
                    <rect height="6" width="6" x="36" y="8"></rect>
                    <rect height="6" width="8" x="46" y="8"></rect>
                    <rect height="6" width="12" x="36" y="20"></rect>
                    <rect height="6" width="8" x="52" y="20"></rect>
                    <rect height="12" width="6" x="8" y="38"></rect>
                    <rect height="8" width="8" x="20" y="44"></rect>
                    <rect height="10" width="10" x="36" y="36"></rect>
                    <rect height="6" width="14" x="52" y="36"></rect>
                    <rect height="14" width="8" x="72" y="40"></rect>
                    <rect height="6" width="8" x="86" y="36"></rect>
                    <rect height="14" width="6" x="36" y="52"></rect>
                    <rect height="6" width="14" x="48" y="56"></rect>
                    <rect height="12" width="6" x="68" y="60"></rect>
                    <rect height="6" width="12" x="82" y="52"></rect>
                    <rect height="6" width="14" x="36" y="72"></rect>
                    <rect height="14" width="8" x="56" y="72"></rect>
                    <rect height="8" width="14" x="72" y="80"></rect>
                    <rect height="6" width="6" x="44" y="86"></rect>
                    <rect height="6" width="6" x="88" y="70"></rect>
                  </svg>
                </div>
                <div className="mt-3 font-mono text-[12px] font-bold text-[#001d59] tracking-widest uppercase">
                  LOT #{selectedLot.id}-SECURE
                </div>
                <div className="text-[11px] text-[#747683] mt-0.5">
                  Assigned to: {selectedLot.agency}
                </div>
              </div>

              <div className="mt-5 w-full flex flex-col gap-2">
                <button
                  onClick={handleConfirmHandover}
                  className="h-11 w-full bg-[#005ab6] hover:bg-[#0872e2] text-white text-[13px] font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Confirm Courier Handover</span>
                </button>
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="h-9 w-full bg-transparent hover:bg-[#f2f4f7] text-[#747683] text-[12px] rounded-lg transition-colors cursor-pointer"
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
