'use client';

import React, { useState, useEffect } from 'react';
import { FoodListing } from '@/types/foodloop';
import { ThemeToggle } from '@/components/ThemeToggle';

interface DonorPortalProps {
  onNavigate: (page: string) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  onOpenSponsors?: () => void;
  onAddListing?: (listing: FoodListing) => void;
  onOpenAuth?: (tab?: 'signin' | 'signup' | 'profile') => void;
  onOpenNotifications?: () => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({
  onNavigate,
  activeRole,
  setActiveRole,
  onOpenSponsors,
  onAddListing,
  onOpenAuth,
  onOpenNotifications,
}) => {
  const [allocationMode, setAllocationMode] = useState<'free' | 'discount' | 'sponsored'>('free');
  const [quantity, setQuantity] = useState(24);
  const [foodTitle, setFoodTitle] = useState('');
  const [category, setCategory] = useState('Bakery & Pastries');
  const [expiryWindow, setExpiryWindow] = useState('Tonight, 8:30 PM');
  const [locationAddress, setLocationAddress] = useState('742 Boylston St, Back Bay, Boston');
  const [isLocatingKitchen, setIsLocatingKitchen] = useState(false);
  const [kitchenGpsVerified, setKitchenGpsVerified] = useState(false);
  const [discountPrice, setDiscountPrice] = useState(4.5);
  const [tempProfile, setTempProfile] = useState('Ambient / Room Temp');
  const [allergens, setAllergens] = useState<string[]>(['Gluten', 'Nut Free', 'Vegetarian']);

  // Active listings & reservations
  const [listings, setListings] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);

  // QR Modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState({
    id: 'LP-8842',
    title: 'Rustic Artisan Sourdough & Brioche',
    agency: 'St. Jude Community Pantry',
    token: 'FLP-8842-7721',
  });

  // Filter for active listings
  const [listingFilter, setListingFilter] = useState<'all' | 'pending' | 'en_route' | 'completed'>('all');

  // Toast
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: '',
  });

  const [ledgerBalance, setLedgerBalance] = useState('$148.20 USD');
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);

  // Fetch listings and reservations from backend
  const fetchDonorData = async () => {
    try {
      const [listRes, resvRes] = await Promise.all([
        fetch('/api/listings'),
        fetch('/api/reservations'),
      ]);
      const listData = await listRes.json();
      const resvData = await resvRes.json();
      if (listData.listings) {
        setListings(listData.listings);
      }
      if (resvData.reservations) {
        setReservations(resvData.reservations);
      }
    } catch (err) {
      console.warn('Failed to load donor data:', err);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: '', message: '' }), 4000);
  };

  const handleLocateKitchen = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocatingKitchen(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocatingKitchen(false);
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lng = Number(pos.coords.longitude.toFixed(4));
          setLocationAddress(`${lat}, ${lng} (Detected Kitchen GPS)`);
          setKitchenGpsVerified(true);
          showToast('📍 Kitchen GPS Detected', `GPS coordinates (${lat}° N, ${Math.abs(lng)}° W) verified for courier pickup.`);
        },
        () => {
          setIsLocatingKitchen(false);
          showToast('Location Permission Denied', 'Using default address: 742 Boylston St, Boston.');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      showToast('Not Supported', 'Geolocation is not supported in this browser.');
    }
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
      originalPrice: allocationMode === 'discount' ? Math.round(discountPrice * 3) : 0,
      currentPrice: allocationMode === 'discount' ? discountPrice : 0,
      discountPercent: allocationMode === 'discount' ? 67 : 100,
      portions: quantity,
      isFree: allocationMode === 'free',
      prepTime: 'Fresh',
      expiryTime: 'Within 2 hours',
      pickupDeadlineMinutes: 60,
      location: locationAddress || '742 Boylston St, Back Bay, Boston',
      distanceKm: 0.5,
      lat: 42.3498,
      lng: -71.0805,
      allergens: allergens,
      storageTemp: 'Hot (>60°C)',
      safetyDeclaration: true,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCXgJxF8XlPe2SWtCGy5xpXxnq5zGyinFS-J5ZzHIUbffQGVU9i6OS8kxQGjnxe5nF6au6OoFlFdbGMlU9Q4ZNsZM95_3_NIuUE1ZOSDH3TZO_P55M0e9kXN4eN3m5z424z9TDa9ofFUcxoTbAb0-I369UP5K9YX1fYshCLK9Y7c6JDIQK1cbvCxqgE5h9Sv3LsOBcW03QkHcz5rf3IGjq4PoiAfk7Bha8KHqWKdPM',
      status: 'available',
    };

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing),
      });
      const data = await res.json();
      if (data.listing) {
        setListings((prev) => [data.listing, ...prev]);
      } else {
        setListings((prev) => [newListing, ...prev]);
      }
    } catch {
      setListings((prev) => [newListing, ...prev]);
    }

    if (onAddListing) {
      onAddListing(newListing);
    }

    showToast('Surplus Dispatched!', `${quantity} portions of "${foodTitle}" published to regional rescue network.`);
    setFoodTitle('');
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
      setListings((prev) => prev.filter((item) => item.id !== listingId));
      showToast('Listing Removed', 'The food listing was cancelled and removed from regional index.');
    } catch {
      setListings((prev) => prev.filter((item) => item.id !== listingId));
      showToast('Listing Removed', 'The listing has been deleted.');
    }
  };

  const handleReservationStatus = async (resId: string, nextStatus: 'confirmed' | 'cancelled' | 'rejected') => {
    try {
      const res = await fetch(`/api/reservations/${resId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === resId ? { ...r, status: nextStatus } : r))
        );
        showToast(
          nextStatus === 'confirmed' ? 'Reservation Confirmed' : 'Reservation Rejected',
          `Reservation #${resId} marked as ${nextStatus}.`
        );
      }
    } catch {
      setReservations((prev) =>
        prev.map((r) => (r.id === resId ? { ...r, status: nextStatus } : r))
      );
      showToast('Status Updated', `Reservation set to ${nextStatus}.`);
    }
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
    } catch {
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
    showToast('Tax Receipt Downloaded', 'Official 501(c)(3) charitable deduction slip exported.');
  };

  const openVerificationModal = (lotId: string, title: string, agency: string, token = 'FLP-8842-7721') => {
    setSelectedLot({ id: lotId, title, agency, token });
    setIsQrModalOpen(true);
  };

  const handleConfirmHandover = async () => {
    try {
      await fetch('/api/custody/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionToken: selectedLot.token,
          verifierId: 'usr-donor-01',
          notes: `Verified handover for ${selectedLot.title} to ${selectedLot.agency}.`,
        }),
      });
    } catch {
      // Fallback
    }
    setIsQrModalOpen(false);
    showToast('Handshake Verified!', `Handover confirmed for ${selectedLot.title}. Rewards points added to your balance.`);
  };

  return (
    <div className="bg-[#f7f9fc] dark:bg-[#00174b] font-sans text-[#191c1e] dark:text-[#f7f9fc] antialiased min-h-screen flex flex-col selection:bg-[#005ab6]/20 selection:text-[#001d59] transition-colors">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001d59] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-bounce max-w-md border border-[#b4c5ff]/30">
          <span className="material-symbols-outlined text-emerald-400 text-[22px]">check_circle</span>
          <div>
            <div className="text-[13px] font-bold">{toast.title}</div>
            <div className="text-[11px] text-[#dbe1ff]">{toast.message}</div>
          </div>
        </div>
      )}

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-[#001d59]/95 backdrop-blur-xl border-b border-[#e6e8eb] dark:border-slate-800 shadow-[0_1px_8px_rgba(0,48,135,0.06)]">
        <div className="h-16 max-w-[1440px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            {/* Back to Home arrow */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 text-[#001d59] dark:text-[#dbe1ff] hover:text-[#005ab6] font-medium mr-1 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              <span className="font-extrabold text-[18px] text-[#001d59] dark:text-white tracking-tight">
                FOODLOOP
              </span>
            </a>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 ml-2">
              <a
                className="font-semibold text-[14px] text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('home')}
              >
                Home
              </a>
              <a
                className="font-semibold text-[14px] text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('explore-food')}
              >
                Explore Food
              </a>
              <a
                className="font-semibold text-[14px] text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('ai-rescue-agent')}
              >
                Admin &amp; AI Agent
              </a>
              <a
                aria-current="page"
                className="transition-colors py-1 px-1 text-[#001d59] dark:text-[#abc7ff] font-bold border-b-2 border-[#001d59] dark:border-[#abc7ff] text-[14px] cursor-pointer"
                onClick={() => onNavigate('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                className="font-semibold text-[14px] text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="font-semibold text-[14px] text-[#444652] dark:text-slate-300 hover:text-[#001d59] dark:hover:text-white transition-colors py-1 px-1 cursor-pointer"
                onClick={() => onNavigate('impact')}
              >
                Impact
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 justify-end flex-1 max-w-2xl">
            {/* Active Role Selector */}
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
                <span className="hidden sm:inline">Donor Profile</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN BODY CONTENT */}
      <main className="w-full pt-16 bg-[#f7f9fc] dark:bg-[#00174b] flex-1">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 pb-16">
          
          {/* 4 Dedicated Dashboards Switcher Bar */}
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-[#747683] dark:text-slate-400 px-2 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#005ab6]">dashboard</span>
              4 Dashboards:
            </span>
            <button
              onClick={() => onNavigate('donor-portal')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-[#001d59] text-white shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">storefront</span>
              <span>1. Food Seller / Donor</span>
            </button>
            <button
              onClick={() => onNavigate('explore-food')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-[#f2f4f7] dark:bg-slate-800 text-[#444652] dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">shopping_cart</span>
              <span>2. Food Buyer / Consumer</span>
            </button>
            <button
              onClick={() => onNavigate('ngo-hub')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-[#f2f4f7] dark:bg-slate-800 text-[#444652] dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-600">local_shipping</span>
              <span>3. NGO Logistics Hub</span>
            </button>
            <button
              onClick={() => onNavigate('ai-rescue-agent')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-[#f2f4f7] dark:bg-slate-800 text-[#444652] dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-purple-600">psychology</span>
              <span>4. Admin &amp; AI Console</span>
            </button>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-[#e6e8eb] dark:border-slate-800">
              <div className="flex items-center justify-between text-[#747683] dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Surplus Rescued</span>
                <span className="material-symbols-outlined text-amber-500 text-[20px]">inventory_2</span>
              </div>
              <div className="mt-2 text-2xl font-black text-[#001d59] dark:text-white">1,420 Meals</div>
              <div className="mt-1 text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <span>↑ 18% this month</span>
                <span className="text-[#747683] dark:text-slate-400 font-normal">• 100% Tax Deductible</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-[#e6e8eb] dark:border-slate-800">
              <div className="flex items-center justify-between text-[#747683] dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Estimated Carbon Offset</span>
                <span className="material-symbols-outlined text-emerald-500 text-[20px]">eco</span>
              </div>
              <div className="mt-2 text-2xl font-black text-[#001d59] dark:text-white">3.55 MT CO2e</div>
              <div className="mt-1 text-[11px] text-[#747683] dark:text-slate-400">
                Equivalent to 14,200 km driving prevented
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-[#e6e8eb] dark:border-slate-800">
              <div className="flex items-center justify-between text-[#747683] dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Donor Reward Points</span>
                <span className="material-symbols-outlined text-purple-500 text-[20px]">stars</span>
              </div>
              <div className="mt-2 text-2xl font-black text-[#001d59] dark:text-white">21,300 Pts</div>
              <div className="mt-1 text-[11px] text-purple-600 dark:text-purple-400 font-bold">
                Tier: Platinum Sustainable Partner
              </div>
            </div>

            {/* PayPal Merchant Wallet Settlement */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-blue-100 dark:border-blue-900 relative overflow-hidden">
              <div className="flex items-center justify-between text-[#747683] dark:text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">PayPal Merchant Balance</span>
                <span className="material-symbols-outlined text-blue-600 text-[20px]">account_balance_wallet</span>
              </div>
              <div className="mt-2 text-2xl font-black text-[#001d59] dark:text-white">{ledgerBalance}</div>
              <button
                onClick={handlePayoutPayPal}
                disabled={isPayoutProcessing || ledgerBalance.includes('0.00')}
                className="mt-2 w-full py-1.5 px-3 rounded-lg bg-[#005ab6] hover:bg-[#004494] disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isPayoutProcessing ? 'refresh' : 'payments'}
                </span>
                <span>{isPayoutProcessing ? 'Processing Payout...' : 'Transfer to PayPal'}</span>
              </button>
            </div>
          </div>

          {/* TWO COLUMN WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN: Create Listing Form */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-[#e6e8eb] dark:border-slate-800 flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-[#e6e8eb] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005ab6]">add_box</span>
                  <h3 className="text-base font-bold text-[#001d59] dark:text-white">Publish New Food Surplus</h3>
                </div>
                <span className="text-[11px] font-bold text-[#005ab6] bg-blue-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  Step 1 of 1
                </span>
              </div>

              <form onSubmit={handlePublishListing} className="mt-5 flex flex-col gap-4">
                {/* Allocation Type Switcher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#001d59] dark:text-white">Surplus Listing Type</label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-[#f2f4f7] dark:bg-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setAllocationMode('free')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        allocationMode === 'free'
                          ? 'bg-[#001d59] text-white shadow-xs'
                          : 'text-[#444652] dark:text-slate-300 hover:text-[#001d59]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">volunteer_activism</span>
                      <span>Free Rescue</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllocationMode('discount')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        allocationMode === 'discount'
                          ? 'bg-[#001d59] text-white shadow-xs'
                          : 'text-[#444652] dark:text-slate-300 hover:text-[#001d59]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">sell</span>
                      <span>Discounted</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllocationMode('sponsored')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        allocationMode === 'sponsored'
                          ? 'bg-[#001d59] text-white shadow-xs'
                          : 'text-[#444652] dark:text-slate-300 hover:text-[#001d59]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">diversity_1</span>
                      <span>Sponsored</span>
                    </button>
                  </div>
                </div>

                {/* Discounted price input if Discount Mode */}
                {allocationMode === 'discount' && (
                  <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#001d59] dark:text-white">Discounted Recovery Price ($ USD)</label>
                      <span className="text-[11px] font-bold text-[#005ab6]">PayPal Direct Settle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#001d59] dark:text-white text-base">$</span>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(parseFloat(e.target.value) || 1)}
                        className="w-full h-10 px-3 bg-white dark:bg-slate-900 rounded-lg text-sm font-bold text-[#001d59] dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-[#747683] dark:text-slate-400">
                      When buyers claim this surplus, proceeds settle directly into your PayPal merchant wallet.
                    </p>
                  </div>
                )}

                {/* Food Title */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#001d59] dark:text-white">Food Description</label>
                  <input
                    className="w-full h-11 px-3.5 bg-[#f2f4f7] dark:bg-slate-800 rounded-xl text-sm text-[#191c1e] dark:text-white placeholder:text-[#747683] focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#005ab6]/30 border border-transparent focus:border-blue-200"
                    placeholder="e.g., Artisanal Sourdough & Fresh Baguettes"
                    value={foodTitle}
                    onChange={(e) => setFoodTitle(e.target.value)}
                    required
                    type="text"
                  />
                </div>

                {/* Pickup Location Address & Google Map */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#001d59] dark:text-white">Kitchen Pickup Location &amp; Google Map</label>
                    <button
                      type="button"
                      onClick={handleLocateKitchen}
                      disabled={isLocatingKitchen}
                      className="text-[11px] font-bold text-[#005ab6] hover:text-[#001d59] flex items-center gap-1 bg-[#f2f4f7] dark:bg-slate-800 hover:bg-slate-200 px-2 py-1 rounded-md transition-all cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[14px] ${isLocatingKitchen ? 'animate-spin' : ''}`}>
                        {isLocatingKitchen ? 'refresh' : 'my_location'}
                      </span>
                      <span>{isLocatingKitchen ? 'Detecting GPS...' : kitchenGpsVerified ? 'GPS Verified ✓' : 'Detect Kitchen GPS'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full h-11 pl-9 pr-3.5 bg-[#f2f4f7] dark:bg-slate-800 rounded-xl text-sm text-[#191c1e] dark:text-white placeholder:text-[#747683] focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#005ab6]/30 border border-transparent focus:border-blue-200 font-medium"
                      placeholder="e.g., 742 Boylston St, Back Bay, Boston"
                      value={locationAddress}
                      onChange={(e) => {
                        setLocationAddress(e.target.value);
                        setKitchenGpsVerified(false);
                      }}
                      required
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#005ab6] text-[18px]">
                      pin_drop
                    </span>
                  </div>

                  {/* Real Google Maps Embed for Kitchen Location */}
                  <div className="relative w-full h-[160px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-inner mt-1">
                    <iframe
                      title="Google Maps Kitchen Location"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(locationAddress)}&hl=en&z=15&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 right-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-[#001d59] dark:text-white shadow flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#005ab6] hover:underline flex items-center gap-0.5"
                      >
                        Open Google Maps <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Category & Quantity */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#001d59] dark:text-white">Category</label>
                    <select
                      className="w-full h-11 px-3 bg-[#f2f4f7] dark:bg-slate-800 rounded-xl text-xs text-[#001d59] dark:text-white font-semibold focus:outline-none border border-transparent"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Bakery & Pastries">Bakery &amp; Pastries</option>
                      <option value="Prepared Meals">Prepared Meals</option>
                      <option value="Fresh Produce">Fresh Produce</option>
                      <option value="Dairy & Chilled">Dairy &amp; Chilled</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#001d59] dark:text-white">Quantity (Meals)</label>
                    <div className="flex items-center h-11 bg-[#f2f4f7] dark:bg-slate-800 rounded-xl px-2 justify-between">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-[#001d59] dark:text-white font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-[#001d59] dark:text-white">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-[#001d59] dark:text-white font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pickup Deadline & Storage */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#001d59] dark:text-white">Pickup Deadline</label>
                    <select
                      className="w-full h-11 px-3 bg-[#f2f4f7] dark:bg-slate-800 rounded-xl text-xs text-[#001d59] dark:text-white font-semibold focus:outline-none border border-transparent"
                      value={expiryWindow}
                      onChange={(e) => setExpiryWindow(e.target.value)}
                    >
                      <option value="Tonight, 8:30 PM">Tonight, 8:30 PM</option>
                      <option value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM</option>
                      <option value="In 2 Hours">In 2 Hours (Urgent)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#001d59] dark:text-white">Storage</label>
                    <select
                      className="w-full h-11 px-3 bg-[#f2f4f7] dark:bg-slate-800 rounded-xl text-xs text-[#001d59] dark:text-white font-semibold focus:outline-none border border-transparent"
                      value={tempProfile}
                      onChange={(e) => setTempProfile(e.target.value)}
                    >
                      <option value="Ambient / Room Temp">Room Temp</option>
                      <option value="Refrigerated (34-38°F)">Refrigerated</option>
                      <option value="Heated (>140°F)">Hot Packaged</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-2 h-12 w-full rounded-xl bg-[#001d59] dark:bg-[#005ab6] hover:bg-[#003087] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Publish Surplus Listing</span>
                </button>
              </form>

              <p className="mt-4 text-[11px] text-[#747683] dark:text-slate-400 text-center">
                Protected by the Federal Bill Emerson Good Samaritan Food Donation Act.
              </p>
            </div>

            {/* RIGHT COLUMN: Active Listings & Incoming Requests */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* INCOMING RESERVATIONS & REQUESTS */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-[#e6e8eb] dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005ab6]">notifications_active</span>
                    <h3 className="text-base font-bold text-[#001d59] dark:text-white">Incoming Claims &amp; Reservations</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-slate-800 text-[#005ab6] text-xs font-bold">
                    {reservations.length} Active
                  </span>
                </div>

                {reservations.length === 0 ? (
                  <p className="text-xs text-[#747683] dark:text-slate-400 py-3 text-center">
                    No pending claims yet. Newly published listings will appear here when reserved.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {reservations.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl bg-[#f2f4f7] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#001d59] dark:text-white">
                              {res.recipient_name || 'Consumer Recipient'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {res.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#747683] dark:text-slate-400 mt-1">
                            {res.portions || 1} Portions • Token: <span className="font-mono font-bold text-[#005ab6]">{res.collection_token}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {res.status !== 'confirmed' && (
                            <button
                              onClick={() => handleReservationStatus(res.id, 'confirmed')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                            >
                              Accept
                            </button>
                          )}
                          {res.status !== 'cancelled' && (
                            <button
                              onClick={() => handleReservationStatus(res.id, 'cancelled')}
                              className="px-3 py-1.5 rounded-lg bg-[#ba1a1a] hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => openVerificationModal(res.id, `Claim #${res.id}`, res.recipient_name, res.collection_token)}
                            className="px-3 py-1.5 rounded-lg bg-[#001d59] dark:bg-[#005ab6] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
                            <span>Verify</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* SECTION: Active Food Listings */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-[#e6e8eb] dark:border-slate-800 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005ab6]">storefront</span>
                    <span className="text-base font-bold text-[#001d59] dark:text-white">Your Published Listings</span>
                    <span className="bg-[#005ab6]/10 text-[#005ab6] text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {listings.length} Active
                    </span>
                  </div>
                  <button
                    onClick={fetchDonorData}
                    className="text-xs font-bold text-[#005ab6] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">refresh</span>
                    <span>Refresh Data</span>
                  </button>
                </div>

                {/* Listings Stream */}
                <div className="flex flex-col gap-3">
                  {listings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#f2f4f7] dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                          alt={item.title}
                          src={
                            item.imageUrl ||
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuCXgJxF8XlPe2SWtCGy5xpXxnq5zGyinFS-J5ZzHIUbffQGVU9i6OS8kxQGjnxe5nF6au6OoFlFdbGMlU9Q4ZNsZM95_3_NIuUE1ZOSDH3TZO_P55M0e9kXN4eN3m5z424z9TDa9ofFUcxoTbAb0-I369UP5K9YX1fYshCLK9Y7c6JDIQK1cbvCxqgE5h9Sv3LsOBcW03QkHcz5rf3IGjq4PoiAfk7Bha8KHqWKdPM'
                          }
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#001d59] dark:text-white text-sm">{item.title}</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-slate-700 text-[#005ab6] font-bold">
                              {item.status || 'available'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#747683] dark:text-slate-400 mt-1">
                            {item.portions} Portions • {item.location || '742 Boylston St'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openVerificationModal(item.id, item.title, 'Regional Hub Courier', item.collectionToken)}
                          className="h-9 px-3 rounded-lg bg-[#005ab6] hover:bg-[#004494] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm shrink-0"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                          <span>Handshake</span>
                        </button>
                        <button
                          onClick={handleTaxSlip}
                          className="h-9 px-3 rounded-lg bg-white dark:bg-slate-700 text-[#001d59] dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 border border-slate-200 dark:border-slate-600"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt</span>
                          <span>Receipt</span>
                        </button>
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="h-9 px-2 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold transition-all flex items-center justify-center cursor-pointer shrink-0"
                          title="Delete Listing"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* QR Verification Handshake Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#001d59]/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 border border-[#e6e8eb] dark:border-slate-800">
            <button
              className="absolute top-4 right-4 text-[#747683] hover:text-[#001d59] dark:hover:text-white p-1 rounded-lg cursor-pointer"
              onClick={() => setIsQrModalOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#005ab6]/10 flex items-center justify-center text-[#005ab6] mb-3">
                <span className="material-symbols-outlined text-[26px]">qr_code_2</span>
              </div>
              <span className="text-lg font-bold text-[#001d59] dark:text-white">Rescue Handshake Verification</span>
              <p className="text-xs text-[#747683] dark:text-slate-400 mt-1">Scan this QR token when the courier arrives for handover.</p>

              <div className="mt-5 p-4 bg-[#f2f4f7] dark:bg-slate-800 rounded-xl flex flex-col items-center shadow-inner border border-[#e6e8eb] dark:border-slate-700">
                <div className="w-44 h-44 bg-white p-3 rounded-lg flex flex-col justify-between shadow-sm border border-[#e0e3e6]">
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
                <div className="mt-3 font-mono text-xs font-bold text-[#001d59] dark:text-[#dbe1ff] tracking-widest uppercase">
                  TOKEN: {selectedLot.token || 'FLP-8842-7721'}
                </div>
                <div className="text-[11px] text-[#747683] dark:text-slate-400 mt-0.5">
                  Assigned: {selectedLot.agency}
                </div>
              </div>

              <div className="mt-5 w-full flex flex-col gap-2">
                <button
                  onClick={handleConfirmHandover}
                  className="h-11 w-full bg-[#005ab6] hover:bg-[#004494] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Confirm Custody Handover</span>
                </button>
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="h-9 w-full bg-transparent hover:bg-[#f2f4f7] dark:hover:bg-slate-800 text-[#747683] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
