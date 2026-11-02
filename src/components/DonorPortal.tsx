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

  const handleQtyMinus = () => {
    if (currentQty > 1) setCurrentQty((q) => q - 1);
  };

  const handleQtyPlus = () => {
    setCurrentQty((q) => q + 1);
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
    showToast(
      'Handshake Verified!',
      '32 portions logged to ledger. +95 Points credited to your PayPal rewards.'
    );
  };

  const handleRefreshLedger = () => {
    showToast('Ledger Synced', 'All node transactions re-verified against the blockchain ledger.', 'sync');
  };

  const handlePayout = async () => {
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 148.2,
          currency: 'USD',
          description: 'FOODLOOP Merchant Surplus Balance Payout',
          referenceId: 'PAYOUT-' + Date.now().toString().slice(-4),
        }),
      });
      const data = await res.json();
      showToast(
        'PayPal Transfer Initiated',
        'Instant payout of $148.20 processed to merchant@business.com (' + (data.id ? 'Order #' + data.id.slice(0, 10) : 'Sandbox Verified') + ').',
        'account_balance_wallet'
      );
    } catch (e) {
      showToast(
        'PayPal Transfer Initiated',
        'Instant payout of $148.20 submitted to merchant@business.com.',
        'account_balance_wallet'
      );
    }
  };

  const handleConvertTax = () => {
    showToast('Tax Slip Generated', 'IRS Form 8283 schedule ready for download.', 'receipt_long');
  };

  const downloadReceipt = () => {
    showToast('Audit Slip #FL-0988', 'Certified cold-chain digital timestamp downloaded.', 'download');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = foodTitle.trim();
    if (!val) return;

    const newLotId = 'LP-' + Math.floor(1000 + Math.random() * 9000);
    const newListingItem = {
      id: newLotId,
      title: val,
      category,
      portions: currentQty,
      expiry: expiryWindow,
      temp: tempReq,
      time: 'Just now',
    };

    setCustomListings((prev) => [newListingItem, ...prev]);

    if (onAddListing) {
      const fullListing: FoodListing = {
        id: newLotId,
        donorName: 'Urban Bites Kitchen',
        donorType: 'Restaurant',
        title: val,
        category: 'Bakery',
        portions: currentQty,
        originalPrice: 8.0,
        currentPrice: allocationMode === 'free' ? 0 : 4.5,
        discountPercent: allocationMode === 'free' ? 100 : 70,
        isFree: allocationMode === 'free',
        prepTime: 'Just Now',
        expiryTime: expiryWindow,
        pickupDeadlineMinutes: 45,
        location: '220 Market Square',
        distanceKm: 0.8,
        storageTemp: 'Room Temp (15-25°C)',
        allergens: ['Gluten', 'Nut-Free'],
        safetyDeclaration: true,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXgJxF8XlPe2SWtCGy5xpXxnq5zGyinFS-J5ZzHIUbffQGVU9i6OS8kxQGjnxe5nF6au6OoFlFdbGMlU9Q4ZNsZM95_3_NIuUE1ZOSDH3TZO_P55M0e9kXN4eN3m5z424z9TDa9ofFUcxoTbAb0-I369UP5K9YX1fYshCLK9Y7c6JDIQK1cbvCxqgE5h9Sv3LsOBcW03QkHcz5rf3IGjq4PoiAfk7Bha8KHqWKdPM',
        status: 'available',
      };
      onAddListing(fullListing);
    }

    setFoodTitle('');
    showToast('Surplus Published!', '"' + val + '" is live. Regional network notified.');
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
<aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[1px_0_8px_rgba(0,48,135,0.04)] z-50 flex flex-col pt-space-md pb-space-lg"><div className="px-space-lg mb-space-lg flex items-center gap-space-sm cursor-pointer" onClick={() => onNavigate?.("home")}><img alt="FOODLOOP Brand Logo" className="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"/><span className="font-headline-sm text-headline-sm text-primary tracking-tight">FOODLOOP</span></div><nav className="flex-1 px-space-md space-y-space-xs" data-active-classes="bg-primary-container text-on-primary font-bold"><a aria-current="page" className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all bg-primary-container text-on-primary font-bold cursor-pointer" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-lg text-label-lg">Overview</span></a><a className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate?.("ngo-hub"); }}><span className="material-symbols-outlined text-[20px]">local_shipping</span><span className="font-label-lg text-label-lg">Rescue Ops</span></a><a className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer" onClick={(e) => { e.preventDefault(); handleRefreshLedger(); }}><span className="material-symbols-outlined text-[20px]">receipt_long</span><span className="font-label-lg text-label-lg">Surplus Ledger</span></a><a className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate?.("ai-rescue-agent"); }}><span className="material-symbols-outlined text-[20px]">auto_awesome</span><span className="font-label-lg text-label-lg">AI Match Engine</span></a><a className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer" onClick={(e) => { e.preventDefault(); handlePayout(); }}><span className="material-symbols-outlined text-[20px]">account_balance_wallet</span><span className="font-label-lg text-label-lg">Settlement &amp; Tax</span></a><a className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer" onClick={(e) => { e.preventDefault(); downloadReceipt(); }}><span className="material-symbols-outlined text-[20px]">verified_user</span><span className="font-label-lg text-label-lg">Safety &amp; Audit</span></a></nav><div className="px-space-md"><div className="p-space-md bg-surface-container-low rounded-xl"><div className="font-label-sm text-label-sm text-secondary uppercase">Active Network</div><div className="font-label-md text-label-md text-primary font-bold mt-space-xs">99.8% Logistics SLA</div></div></div></aside>
<div className="pl-64">
<header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,48,135,0.04)] z-40 flex items-center justify-between px-space-lg"><div className="relative w-full max-w-sm"><span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span><input className="w-full h-10 pl-9 pr-space-md bg-surface-container-low rounded-lg text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all" placeholder="Search transactions, dispatch, lots..." type="text"/></div><div className="flex items-center gap-space-sm"><div className="relative"><select aria-label="Active Role Switcher" value={activeRole || "donor"} onChange={(e) => setActiveRole?.(e.target.value)} className="appearance-none h-10 pl-space-sm pr-space-lg bg-surface-container-low font-label-md text-label-md text-primary font-bold rounded-lg cursor-pointer focus:outline-none"><option value="donor">Donor</option><option value="recipient">Recipient</option><option value="ngo">NGO Hub</option><option value="admin">Admin Console</option></select><span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span></div><button onClick={() => onNavigate?.("home")} className="h-10 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-bold flex items-center gap-1 transition-all cursor-pointer"><span className="material-symbols-outlined text-[16px]">home</span><span>Home</span></button><button onClick={onOpenSponsors} className="h-10 px-2.5 rounded-lg bg-[#ffc439] hover:bg-[#f2ba36] text-[#001435] font-black text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"><span className="material-symbols-outlined text-[16px]">stars</span><span>Sponsors</span></button><button aria-label="Toggle Light Dark Mode" className="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" type="button"><span className="material-symbols-outlined text-[20px]">light_mode</span></button><button aria-label="System Alerts" className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" type="button"><span className="material-symbols-outlined text-[20px]">notifications</span><span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div className="flex items-center gap-space-xs pl-space-sm"><img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"/><span className="material-symbols-outlined text-outline text-[18px] cursor-pointer hover:text-primary transition-colors">arrow_drop_down</span></div></div></header>
<main className="relative pt-16 w-full bg-background px-space-lg py-space-lg"><div className="flex flex-col w-full">
<div className="flex flex-col gap-space-lg w-full max-w-[1440px] mx-auto pb-space-xl">
{/*  Top Meta Context Bar  */}
<div className="flex flex-wrap items-center justify-between gap-space-md">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm uppercase tracking-wider font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Node US-NE #4029 Active
          </span>
<span className="font-body-sm text-body-sm text-outline">Updated 42s ago</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">Surplus Operations &amp; Ledger</h1>
</div>
<div className="flex items-center gap-space-sm">
<div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg">
<span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
<span className="font-label-md text-label-md text-primary font-bold">Platinum Verified Donor</span>
<span className="font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded text-outline font-semibold">Tier 4</span>
</div>
<button onClick={handleRefreshLedger} className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg shadow-sm transition-all cursor-pointer" id="refreshLedgerBtn">
<span className="material-symbols-outlined text-[18px] text-secondary">sync</span>
<span>Sync State</span>
</button>
</div>
</div>
{/*  Metrics Row (4 High-Contrast Fintech Metric Cards)  */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
{/*  Card 1  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
<div className="flex items-start justify-between">
<div className="p-2.5 bg-primary/5 rounded-lg text-primary">
<span className="material-symbols-outlined text-[22px]">restaurant</span>
</div>
<span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-bold">
<span className="material-symbols-outlined text-[12px]">trending_up</span> +18% MoM
          </span>
</div>
<div className="mt-4">
<div className="font-headline-xl text-headline-xl text-primary font-black tracking-tight">1,420</div>
<div className="font-label-md text-label-md text-outline mt-0.5">Meals Rescued This Month</div>
</div>
<div className="mt-3 pt-3 flex items-center justify-between text-body-sm font-body-sm text-outline border-t-0">
<span>Carbon offset</span>
<span className="font-label-md text-label-md text-on-surface font-bold">3.12 MT CO₂e</span>
</div>
</div>
{/*  Card 2  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
<div className="flex items-start justify-between">
<div className="p-2.5 bg-secondary-container/10 rounded-lg text-secondary-container">
<span className="material-symbols-outlined text-[22px]">inventory_2</span>
</div>
<span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-bold">
            Live Dispatches
          </span>
</div>
<div className="mt-4">
<div className="font-headline-xl text-headline-xl text-primary font-black tracking-tight">28</div>
<div className="font-label-md text-label-md text-outline mt-0.5">Active Surplus Listings</div>
</div>
<div className="mt-3 pt-3 flex items-center justify-between text-body-sm font-body-sm text-outline">
<span>Avg. claim velocity</span>
<span className="font-label-md text-label-md text-secondary font-bold">14.2 minutes</span>
</div>
</div>
{/*  Card 3  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
<div className="flex items-start justify-between">
<div className="p-2.5 bg-tertiary-container/10 rounded-lg text-tertiary">
<span className="material-symbols-outlined text-[22px]">task_alt</span>
</div>
<span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-primary-container bg-primary-fixed-dim/40 px-2 py-0.5 rounded-full font-bold">
            Zero Disputes
          </span>
</div>
<div className="mt-4">
<div className="font-headline-xl text-headline-xl text-primary font-black tracking-tight">99.4%</div>
<div className="font-label-md text-label-md text-outline mt-0.5">Successful Collection Rate</div>
</div>
<div className="mt-3 pt-3 flex items-center justify-between text-body-sm font-body-sm text-outline">
<span>Cold-chain compliance</span>
<span className="font-label-md text-label-md text-on-surface font-bold">100% Audited</span>
</div>
</div>
{/*  Card 4  */}
<div className="bg-gradient-to-br from-primary-container to-primary p-space-md rounded-xl shadow-sm flex flex-col justify-between text-on-primary">
<div className="flex items-start justify-between">
<div className="p-2.5 bg-on-primary/10 rounded-lg text-on-primary backdrop-blur-sm">
<span className="material-symbols-outlined text-[22px]">loyalty</span>
</div>
<span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-on-primary bg-on-primary/20 px-2 py-0.5 rounded-full font-bold">
            PayPal Direct
          </span>
</div>
<div className="mt-4">
<div className="font-headline-xl text-headline-xl text-on-primary font-black tracking-tight">3,450</div>
<div className="font-label-md text-label-md text-on-primary-container mt-0.5">FOODLOOP Points Earned</div>
</div>
<div className="mt-3 pt-3 flex items-center justify-between text-body-sm font-body-sm text-on-primary/80">
<span>Equivalent Value</span>
<span className="font-label-md text-label-md text-on-primary font-extrabold">$34.50 Cash Credit</span>
</div>
</div>
</div>
{/*  Settlement & Reward Redemption Banner  */}
<div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
<div className="absolute -right-8 -top-12 w-64 h-64 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div className="flex items-start gap-space-md">
<div className="h-12 w-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary shadow-md shrink-0">
<span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
</div>
<div className="flex flex-col max-w-2xl">
<div className="flex items-center gap-space-xs flex-wrap">
<span className="font-headline-sm text-headline-sm text-primary font-bold">Surplus Ledger Balance:</span>
<span className="font-headline-sm text-headline-sm text-secondary font-black">$148.20 USD</span>
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">Instant Ready</span>
</div>
<p className="font-body-md text-body-md text-outline mt-1">
              Transfer surplus revenue instantly to your linked PayPal merchant balance or convert 100% into formal 501(c)(3) verified tax-deductible donor credit slips with automated ledger receipts.
            </p>
</div>
</div>
<div className="flex items-center gap-space-sm shrink-0 flex-wrap">
<button onClick={handlePayout} className="flex items-center gap-2 h-11 px-5 rounded-lg bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg font-bold shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer" id="payoutPaypalBtn">
<span className="material-symbols-outlined text-[18px]">bolt</span>
<span>Payout via PayPal ($148.20)</span>
</button>
<button onClick={handleConvertTax} className="flex items-center gap-2 h-11 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg font-bold transition-all cursor-pointer" id="convertTaxBtn">
<span className="material-symbols-outlined text-[18px]">receipt</span>
<span>Tax Credit Slip</span>
</button>
</div>
</div>
</div>
{/*  Flight Bar Tracker: Global Active Rescue Corridor  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]">timeline</span>
<span className="font-label-lg text-label-lg text-primary font-bold">Live Rescue Pipeline Tracker (Lot #LP-8842)</span>
</div>
<span className="font-label-sm text-label-sm bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded-full">En Route: ETA 18 mins</span>
</div>
{/*  Flight Nodes  */}
<div className="grid grid-cols-4 gap-2 pt-2">
<div className="flex flex-col">
<div className="h-2 rounded-full bg-secondary"></div>
<div className="flex items-center gap-1 mt-2 text-primary font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
<span>1. Logged (11:04 AM)</span>
</div>
<span className="font-body-sm text-body-sm text-outline">Pretzel Bakery Surplus</span>
</div>
<div className="flex flex-col">
<div className="h-2 rounded-full bg-secondary"></div>
<div className="flex items-center gap-1 mt-2 text-primary font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
<span>2. AI Matched (11:09 AM)</span>
</div>
<span className="font-body-sm text-body-sm text-outline">Hope Harbor Kitchen</span>
</div>
<div className="flex flex-col">
<div className="h-2 rounded-full bg-secondary-container animate-pulse"></div>
<div className="flex items-center gap-1 mt-2 text-secondary-container font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[14px]">local_shipping</span>
<span>3. En Route (Active)</span>
</div>
<span className="font-body-sm text-body-sm text-outline">Courier #FL-914 Transit</span>
</div>
<div className="flex flex-col">
<div className="h-2 rounded-full bg-surface-container-high"></div>
<div className="flex items-center gap-1 mt-2 text-outline font-label-sm text-label-sm font-semibold">
<span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
<span>4. Verified Claim</span>
</div>
<span className="font-body-sm text-body-sm text-outline">Pending QR Handshake</span>
</div>
</div>
</div>
{/*  Main Operational Split View (Left Form / Right Live Grid)  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
{/*  LEFT COLUMN: Quick Surplus Food Listing Form (5 Cols)  */}
<div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
<div>
<span className="font-headline-sm text-headline-sm text-primary font-bold">Quick Surplus Dispatch</span>
<p className="font-body-sm text-body-sm text-outline">Instant ingestion into regional food redistribution nodes.</p>
</div>
<span className="material-symbols-outlined text-secondary text-[24px]">add_circle</span>
</div>
<form className="flex flex-col gap-space-md" id="listingForm" onSubmit={handleFormSubmit}>
{/*  Allocation Type Segmented Switcher  */}
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-primary font-bold">Surplus Allocation Model</label>
<div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-lg">
<button type="button" onClick={() => setAllocationMode("free")} className={`mode-toggle py-2 text-center rounded-md font-label-sm text-label-sm font-bold transition-all cursor-pointer ${allocationMode === "free" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-outline hover:text-primary"}`}>Free Donation</button>
<button type="button" onClick={() => setAllocationMode("discount")} className={`mode-toggle py-2 text-center rounded-md font-label-sm text-label-sm font-bold transition-all cursor-pointer ${allocationMode === "discount" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-outline hover:text-primary"}`}>Discount (70% Off)</button>
<button type="button" onClick={() => setAllocationMode("sponsored")} className={`mode-toggle py-2 text-center rounded-md font-label-sm text-label-sm font-bold transition-all cursor-pointer ${allocationMode === "sponsored" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-outline hover:text-primary"}`}>PayPal Sponsor</button>
</div>
</div>
{/*  Food Name Input  */}
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-primary font-bold" htmlFor="foodTitle">Food Description / Lot Batch</label>
<div className="relative">
<input className="w-full h-11 px-3.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/30 transition-all" id="foodTitle" placeholder="e.g., Artisanal Sourdough &amp; Baguettes" required type="text"/>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">lunch_dining</span>
</div>
</div>
{/*  Category & Quantity Row  */}
<div className="grid grid-cols-2 gap-space-sm">
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-primary font-bold" htmlFor="categorySelect">Category</label>
<div className="relative">
<select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 px-3 bg-surface-container-low rounded-lg font-label-md text-label-md text-primary font-semibold appearance-none cursor-pointer focus:outline-none" id="categorySelect">
<option value="Bakery &amp; Pastries">Bakery &amp; Pastries</option>
<option value="Prepared Meals">Prepared Meals</option>
<option value="Fresh Produce">Fresh Produce</option>
<option value="Dairy &amp; Chilled">Dairy &amp; Chilled</option>
<option value="Pantry Staples">Pantry Staples</option>
</select>
<span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">arrow_drop_down</span>
</div>
</div>
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-primary font-bold">Quantity (Units / Portions)</label>
<div className="flex items-center h-11 bg-surface-container-low rounded-lg px-2 justify-between">
<button type="button" onClick={handleQtyMinus} className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-lowest text-primary hover:bg-surface-container text-body-md font-bold transition-colors cursor-pointer" id="qtyMinus">-</button>
<span className="font-label-md text-label-md text-primary font-black" id="qtyVal">{currentQty}</span>
<button type="button" onClick={handleQtyPlus} className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-lowest text-primary hover:bg-surface-container text-body-md font-bold transition-colors cursor-pointer" id="qtyPlus">+</button>
</div>
</div>
</div>
{/*  Expiry Pickup Window & Storage  */}
<div className="grid grid-cols-2 gap-space-sm">
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-primary font-bold" htmlFor="expiryWindow">Pickup Deadline</label>
<div className="relative">
<select value={expiryWindow} onChange={(e) => setExpiryWindow(e.target.value)} className="w-full h-11 px-3 bg-surface-container-low rounded-lg font-label-md text-label-md text-primary font-semibold appearance-none cursor-pointer focus:outline-none" id="expiryWindow">
<option value="Tonight, 8:30 PM">Tonight, 8:30 PM (Urgent)</option>
<option value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM</option>
<option value="In 2 Hours">In 2 Hours (Critical)</option>
</select>
<span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">schedule</span>
</div>
</div>
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-primary font-bold" htmlFor="tempReq">Storage Profile</label>
<div className="relative">
<select value={tempReq} onChange={(e) => setTempReq(e.target.value)} className="w-full h-11 px-3 bg-surface-container-low rounded-lg font-label-md text-label-md text-primary font-semibold appearance-none cursor-pointer focus:outline-none" id="tempReq">
<option value="Ambient / Room Temp">Ambient Temp</option>
<option value="Refrigerated (34-38°F)">Refrigerated Cold</option>
<option value="Frozen Safe (-0°F)">Frozen Storage</option>
<option value="Heated (&gt;140°F)">Hot Packaged</option>
</select>
<span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">thermostat</span>
</div>
</div>
</div>
{/*  Allergen & Safe Handling Badges  */}
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-primary font-bold">Allergen Declarations</label>
<div className="flex flex-wrap gap-1.5">
<label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-outline has-[:checked]:bg-secondary/10 has-[:checked]:text-secondary font-bold transition-all">
<input defaultChecked className="hidden" type="checkbox"/> Gluten
              </label>
<label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-outline has-[:checked]:bg-secondary/10 has-[:checked]:text-secondary font-bold transition-all">
<input className="hidden" type="checkbox"/> Dairy Free
              </label>
<label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-outline has-[:checked]:bg-secondary/10 has-[:checked]:text-secondary font-bold transition-all">
<input defaultChecked className="hidden" type="checkbox"/> Nut Free
              </label>
<label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-outline has-[:checked]:bg-secondary/10 has-[:checked]:text-secondary font-bold transition-all">
<input className="hidden" type="checkbox"/> Halal Certified
              </label>
<label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-outline has-[:checked]:bg-secondary/10 has-[:checked]:text-secondary font-bold transition-all">
<input defaultChecked className="hidden" type="checkbox"/> Vegetarian
              </label>
</div>
</div>
{/*  Price preview if sponsored or discounted  */}
<div className={allocationMode === "free" ? "hidden" : "flex items-center justify-between p-3 bg-surface-container rounded-lg"} id="priceRow">
<span className="font-label-md text-label-md text-primary font-bold">PayPal Recipient Fee</span>
<div className="flex items-center gap-1">
<span className="font-headline-sm text-headline-sm text-secondary font-black">$4.50</span>
<span className="font-body-sm text-body-sm text-outline">/ meal package</span>
</div>
</div>
{/*  Submit CTA Button  */}
<button className="mt-2 h-12 w-full rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all" type="submit">
<span className="material-symbols-outlined text-[20px]">send</span>
<span>Publish to FOODLOOP Network</span>
</button>
</form>
{/*  Donor Trust SLA Note  */}
<div className="p-3 bg-surface-container-low rounded-lg flex items-center gap-3">
<span className="material-symbols-outlined text-secondary text-[22px] shrink-0">shield</span>
<div className="text-body-sm font-body-sm text-outline">
            Protected by the Federal Bill Emerson Good Samaritan Food Donation Act. AI route matching guarantees cold-chain audit trails.
          </div>
</div>
</div>
{/*  RIGHT COLUMN: Active Listings & Real-Time Reservations (7 Cols)  */}
<div className="lg:col-span-7 flex flex-col gap-space-md">
{/*  Section Header with Filters  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
<span className="font-headline-sm text-headline-sm text-primary font-bold">Active Listings &amp; Reservations</span>
<span className="bg-secondary/10 text-secondary text-label-sm font-label-sm px-2 py-0.5 rounded-full font-bold" id="activeCountBadge">{4 + customListings.length} Live</span>
</div>
<div className="flex items-center gap-1.5 overflow-x-auto">
<button type="button" onClick={() => setFilterStatus("all")} className={`filter-pill px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold transition-all cursor-pointer ${filterStatus === "all" ? "bg-primary text-on-primary" : "bg-surface-container-low hover:bg-surface-container text-outline"}`}>All ({4 + customListings.length})</button>
<button type="button" onClick={() => setFilterStatus("pending")} className={`filter-pill px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold transition-all cursor-pointer ${filterStatus === "pending" ? "bg-primary text-on-primary" : "bg-surface-container-low hover:bg-surface-container text-outline"}`}>Pending ({2 + customListings.length})</button>
<button type="button" onClick={() => setFilterStatus("en_route")} className={`filter-pill px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold transition-all cursor-pointer ${filterStatus === "en_route" ? "bg-primary text-on-primary" : "bg-surface-container-low hover:bg-surface-container text-outline"}`}>En Route (1)</button>
<button type="button" onClick={() => setFilterStatus("completed")} className={`filter-pill px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-bold transition-all cursor-pointer ${filterStatus === "completed" ? "bg-primary text-on-primary" : "bg-surface-container-low hover:bg-surface-container text-outline"}`}>Completed (1)</button>
</div>
</div>
{/*  Live Listing Items Stream  */}
<div className="flex flex-col gap-space-sm" id="listingsContainer">
{customListings.map((item) => (
  <div key={item.id} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border border-secondary/20 animate-in fade-in slide-in-from-top-4 duration-300">
    <div className="flex items-start gap-space-md">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary/10 flex items-center justify-center text-secondary">
        <span className="material-symbols-outlined text-[28px]">fastfood</span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-headline-sm text-headline-sm text-primary font-bold">{item.title}</span>
          <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Broadcasting
          </span>
        </div>
        <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-outline mt-1 flex-wrap">
          <span className="font-semibold text-on-surface">{item.portions} Portions</span>
          <span>•</span>
          <span>{item.category}</span>
          <span>•</span>
          <span className="text-secondary font-bold">Just Now</span>
        </div>
      </div>
    </div>
    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
      <button onClick={() => openVerificationModal(item.id, item.title, "Nearby Food Bank Hub")} className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-bold transition-colors cursor-pointer">
        <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
        <span>View QR</span>
      </button>
    </div>
  </div>
))}
{/*  Item 1: Urgent En Route  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
<div className="flex items-start gap-space-md">
<div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Close up photography of fresh gourmet artisan breads, warm baguettes and sourdough loaves stacked in rustic bakery crates with soft morning bakery sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXgJxF8XlPe2SWtCGy5xpXxnq5zGyinFS-J5ZzHIUbffQGVU9i6OS8kxQGjnxe5nF6au6OoFlFdbGMlU9Q4ZNsZM95_3_NIuUE1ZOSDH3TZO_P55M0e9kXN4eN3m5z424z9TDa9ofFUcxoTbAb0-I369UP5K9YX1fYshCLK9Y7c6JDIQK1cbvCxqgE5h9Sv3LsOBcW03QkHcz5rf3IGjq4PoiAfk7Bha8KHqWKdPM"/>
<span className="absolute bottom-0 inset-x-0 bg-primary/80 text-[10px] text-on-primary text-center font-bold py-0.5">Bakery</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2 flex-wrap">
<span className="font-headline-sm text-headline-sm text-primary font-bold">Rustic Artisan Sourdough &amp; Brioche</span>
<span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> En Route
                  </span>
</div>
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-outline mt-1 flex-wrap">
<span className="font-semibold text-on-surface">32 Portions</span>
<span>•</span>
<span>Matched: St. Jude Community Pantry</span>
<span>•</span>
<span className="text-error font-bold flex items-center gap-0.5">
<span className="material-symbols-outlined text-[14px]">timer</span> Expires in 45m
                  </span>
</div>
<div className="flex items-center gap-2 mt-2">
<span className="text-[11px] px-2 py-0.5 bg-surface-container rounded font-semibold text-outline">Nut-Free</span>
<span className="text-[11px] px-2 py-0.5 bg-surface-container rounded font-semibold text-outline">Vegetarian</span>
<span className="text-[11px] px-2 py-0.5 bg-primary-fixed text-primary rounded font-bold">PayPal Sponsored</span>
</div>
</div>
</div>
<div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
<div className="text-right">
<div className="font-label-sm text-label-sm text-outline">Courier Assigned</div>
<div className="font-label-md text-label-md text-primary font-bold">Alex Rivera (Van #12)</div>
</div>
<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-bold hover:bg-secondary-container transition-colors shadow-sm" onClick={() => openVerificationModal("LP-8842", "Rustic Artisan Sourdough", "St. Jude Community Pantry")}>
<span className="material-symbols-outlined text-[16px]">qr_code_2</span>
<span>Verify QR</span>
</button>
</div>
</div>
{/*  Item 2: Pending Pickup  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
<div className="flex items-start gap-space-md">
<div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Pre-packaged healthy meal prep containers featuring grilled chicken, quinoa and steamed broccoli arranged neatly in commercial cafeteria kitchen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVi6qeBKFvFS0TrysT_kNA-OQh9YPiEei3_y0omi6TO5YCNWYo4movamY8ovJjb3MvN7dhZ7hfgCjRXmT4F5FhSctiBfA-U8DmEdQVB_gmD0GVEEuB5K9QE9fgMGpBWrYPhSSvBBeWAGf43b6faVqm5IwJrWniDIKvPrhXU5ioW16y2ojrt4rO7f0WJtaFgUjColz9IaPD-_3OZD-vLWE-ECWwxEjVxm3rdpZhip0"/>
<span className="absolute bottom-0 inset-x-0 bg-primary/80 text-[10px] text-on-primary text-center font-bold py-0.5">Prepared</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2 flex-wrap">
<span className="font-headline-sm text-headline-sm text-primary font-bold">Warm Grain Bowls &amp; Roasted Salmon</span>
<span className="inline-flex items-center gap-1 bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                    Pending Dispatch
                  </span>
</div>
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-outline mt-1 flex-wrap">
<span className="font-semibold text-on-surface">18 Servings</span>
<span>•</span>
<span>Free Surplus Donation</span>
<span>•</span>
<span className="text-primary font-bold">Ready for Pickup</span>
</div>
<div className="flex items-center gap-2 mt-2">
<span className="text-[11px] px-2 py-0.5 bg-surface-container rounded font-semibold text-outline">Gluten-Free</span>
<span className="text-[11px] px-2 py-0.5 bg-surface-container rounded font-semibold text-outline">Chilled (38°F)</span>
</div>
</div>
</div>
<div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
<div className="text-right">
<div className="font-label-sm text-label-sm text-outline">Claimant Agency</div>
<div className="font-label-md text-label-md text-primary font-bold">Hope Outreach Shelter</div>
</div>
<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-bold transition-colors" onClick={() => openVerificationModal("LP-8843", "Warm Grain Bowls", "Hope Outreach Shelter")}>
<span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
<span>Claim Token</span>
</button>
</div>
</div>
{/*  Item 3: Discounted Box - Pending Claim  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
<div className="flex items-start gap-space-md">
<div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Crates of colorful farm fresh produce including crisp apples, organic carrots, leafy greens and heirloom tomatoes in ambient market setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC1tWQ4p204qm3ZIboUUwTWAHVF0C2oD-gJ9YDioBkjec-xrSYDu6qWK6IKXw6ztn1fhbJe9gt_mBbiWwzNN0qVizXbKuSJKQdTH0pvS4WcTM8Zsk2aR7gQWbVYknREXs_xpO_FKm1SfziR7rGbDsEyjTyvJrnAu-Mkg2lTXrgII5Cv5kgOQFNdTOu6v2OQAmZ5ujPAWcVUAy1mQ-zLbbCu6DllA1WmwiKr9LSD8w"/>
<span className="absolute bottom-0 inset-x-0 bg-primary/80 text-[10px] text-on-primary text-center font-bold py-0.5">Produce</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2 flex-wrap">
<span className="font-headline-sm text-headline-sm text-primary font-bold">Mixed Seasonal Organic Orchard Crates</span>
<span className="inline-flex items-center gap-1 bg-surface-container-high text-outline font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                    Awaiting Claim
                  </span>
</div>
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-outline mt-1 flex-wrap">
<span className="font-semibold text-on-surface">5 Full Crates</span>
<span>•</span>
<span className="text-secondary font-bold">75% Off Regular ($12.00)</span>
<span>•</span>
<span>Expires Tomorrow 9:00 AM</span>
</div>
<div className="flex items-center gap-2 mt-2">
<span className="text-[11px] px-2 py-0.5 bg-surface-container rounded font-semibold text-outline">Organic</span>
<span className="text-[11px] px-2 py-0.5 bg-surface-container rounded font-semibold text-outline">Raw</span>
</div>
</div>
</div>
<div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
<div className="text-right">
<div className="font-label-sm text-label-sm text-outline">AI Redistribution</div>
<div className="font-label-md text-label-md text-secondary font-bold">3 Shelters Alerted</div>
</div>
<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold transition-colors" onClick={() => showToast("Priority Broadcast Dispatched", "Push notification alerted 14 registered non-profit hubs in your zip code.", "campaign")}>
<span className="material-symbols-outlined text-[16px]">campaign</span>
<span>Boost Ping</span>
</button>
</div>
</div>
{/*  Item 4: Verified & Settled  */}
<div className="bg-surface-container-lowest/80 p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md opacity-90">
<div className="flex items-start gap-space-md">
<div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Clean glass bottles of organic chilled dairy milk and yogurts stacked in refrigerated cold display case with clean commercial lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF6Q4TJr4KPt91aQ1-0Nt-Plba6QalmvlNUgnc0URXoFLtdWs-K2aOm8z-ibocsYlPCcqtPOyWpfXuLjF8mqjk3yIRuleQ-ewUn1qstW7xEz4ug5Pn4sS8ly8ISfw3Kbg9v5dz6XcoDIR1FHYN-FEtI3iHPQhQhaztEzktqbuswISLubmwCQoH2xqrG1qaTIwbYvcZNHxoMl6CipjQIxHVZJbvxsOxkI1uh9FkpQk"/>
<span className="absolute bottom-0 inset-x-0 bg-primary/80 text-[10px] text-on-primary text-center font-bold py-0.5">Dairy</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2 flex-wrap">
<span className="font-headline-sm text-headline-sm text-primary font-bold">Grade A Pasteurized Dairy Cartons</span>
<span className="inline-flex items-center gap-1 bg-surface-container-high text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Collected &amp; Verified
                  </span>
</div>
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-outline mt-1 flex-wrap">
<span className="font-semibold text-on-surface">40 Quarts</span>
<span>•</span>
<span>Verified 28 mins ago</span>
<span>•</span>
<span className="font-bold text-primary">+120 Reward Points Added</span>
</div>
<div className="flex items-center gap-2 mt-2">
<span className="text-[11px] px-2 py-0.5 bg-surface-container rounded font-semibold text-outline">Cold Chain SLA Met</span>
<span className="text-[11px] px-2 py-0.5 bg-surface-container rounded font-semibold text-outline">Receipt #FL-0988</span>
</div>
</div>
</div>
<div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
<div className="text-right">
<div className="font-label-sm text-label-sm text-outline">Settlement Status</div>
<div className="font-label-md text-label-md text-secondary font-bold">Ledger Finalized</div>
</div>
<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-outline hover:text-primary font-label-md text-label-md font-semibold transition-colors" onClick={downloadReceipt}>
<span className="material-symbols-outlined text-[16px]">description</span>
<span>Audit Slip</span>
</button>
</div>
</div>
</div>
{/*  Analytical Inset / AI Redistribution Intelligence  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary shrink-0">
<span className="material-symbols-outlined text-[24px]">auto_awesome</span>
</div>
<div>
<div className="font-label-lg text-label-lg text-primary font-bold">AI Redistribution Demand Map</div>
<p className="font-body-sm text-body-sm text-outline">High hunger relief demand detected in District 4 (+34% weekend surge). Baked goods and proteins prioritised.</p>
</div>
</div>
<button className="shrink-0 px-4 py-2 bg-surface-container-low hover:bg-surface-container text-secondary font-label-md text-label-md font-bold rounded-lg transition-colors flex items-center gap-1">
<span>View Heatmap</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
{/*  QR Verification & Handshake Modal (Hidden by default)  */}
<div className={`fixed inset-0 z-50 bg-primary/50 backdrop-blur-md flex items-center justify-center p-space-md transition-opacity ${isQrModalOpen ? "" : "hidden"}`} id="qrModal">
<div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-xl relative animate-in fade-in zoom-in duration-200">
<button className="absolute top-4 right-4 text-outline hover:text-primary p-1 rounded-lg cursor-pointer" onClick={closeVerificationModal}>
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
<div className="flex flex-col items-center text-center">
<div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-3">
<span className="material-symbols-outlined text-[26px]">qr_code_2</span>
</div>
<span className="font-headline-sm text-headline-sm text-primary font-bold">Rescue Handshake Verification</span>
<p className="font-body-sm text-body-sm text-outline mt-1">Scan this cryptographic QR token when recipient logistics arrives.</p>
{/*  Simulated Crisp QR Code Box  */}
<div className="mt-5 p-4 bg-surface-container-low rounded-xl flex flex-col items-center shadow-inner">
<div className="w-48 h-48 bg-surface-container-lowest p-3 rounded-lg flex flex-col justify-between shadow-sm border border-surface-container">
{/*  Simulated QR SVG pattern  */}
<svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 100 100">
<rect fill="currentColor" height="30" rx="3" width="30" x="0" y="0"></rect>
<rect fill="#FFFFFF" height="20" rx="1" width="20" x="5" y="5"></rect>
<rect fill="currentColor" height="10" rx="1" width="10" x="10" y="10"></rect>
<rect fill="currentColor" height="30" rx="3" width="30" x="70" y="0"></rect>
<rect fill="#FFFFFF" height="20" rx="1" width="20" x="75" y="5"></rect>
<rect fill="currentColor" height="10" rx="1" width="10" x="80" y="10"></rect>
<rect fill="currentColor" height="30" rx="3" width="30" x="0" y="70"></rect>
<rect fill="#FFFFFF" height="20" rx="1" width="20" x="5" y="75"></rect>
<rect fill="currentColor" height="10" rx="1" width="10" x="10" y="80"></rect>
{/*  QR data pixels  */}
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
<div className="mt-3 font-mono text-[12px] font-bold text-primary tracking-widest uppercase" id="modalLotId">LOT #{qrModalData.lotId}-AUTHENTICATED</div>
<div className="font-body-sm text-body-sm text-outline mt-0.5" id="modalAgency">Assigned: {qrModalData.agency}</div>
</div>
{/*  Action Confirmation  */}
<div className="mt-5 w-full flex flex-col gap-2">
<button className="h-11 w-full bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2" onClick={simulateSuccessfulClaim}>
<span className="material-symbols-outlined text-[18px]">verified</span>
<span>Confirm Courier Handover</span>
</button>
<button className="h-9 w-full bg-transparent hover:bg-surface-container text-outline font-label-md text-label-md rounded-lg transition-colors cursor-pointer" onClick={closeVerificationModal}>
            Cancel &amp; Keep Active
          </button>
</div>
</div>
</div>
</div>
{/*  Toast Notification Container  */}
<div className="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none" id="toastNotification">
<div className="bg-primary text-on-primary px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3">
<span className="material-symbols-outlined text-secondary text-[22px]" id="toastIcon">check_circle</span>
<div>
<div className="font-label-md text-label-md font-bold" id="toastTitle">Success</div>
<div className="font-body-sm text-body-sm text-on-primary-container" id="toastMsg">Surplus lot broadcast to 3 nearby NGOs.</div>
</div>
</div>
</div>
{/*  Micro-Interactions Script  */}

</div></main>
</div>
    </div>
  );
};
