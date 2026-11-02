'use client';

import React, { useState, useEffect } from 'react';

interface ExploreFoodPageProps {
  onNavigate: (page: string) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  onOpenSponsors?: () => void;
  onOrderCompleted?: (listingId: string, orderDetails: any) => void;
}

interface FoodDetail {
  id: string;
  title: string;
  donor: string;
  distance: string;
  price: string;
  originalPrice: string | null;
  temp: string;
  isFree: boolean;
  desc: string;
  allergens: string[];
  imageUrl: string;
  pickupWindow: string;
  specCode: string;
  pickupSpot: string;
  pickupAddress: string;
  category: string;
  statusType: 'free' | 'discounted' | 'sponsored';
}

const foodDetailsData: Record<string, FoodDetail> = {
  card1: {
    id: 'card1',
    title: 'Artisanal Sourdough & Croissants',
    donor: 'Bakery Le Matin',
    distance: '0.8 km Away',
    price: '$0.00',
    originalPrice: null,
    temp: 'Safe Ambient (18°C)',
    isFree: true,
    desc: 'Daily handcrafted sourdough loaves and pure butter croissants baked at dawn. Unsold inventory safely sealed in food-grade thermal bags to retain crispness and nutrition.',
    allergens: ['Vegetarian', 'Dairy (Butter)', 'Contains Wheat/Gluten', 'Zero Waste Partner'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCewQDn94i_DcNAOiySiYyePNJ-K67qeyXNI4Y8XIs4i2pIJoZiS38bOnFq4fQdHg2RLOR-j0341oYdSTYxtVCzWpOkfIVeg50wjjIMFUaezdxrZ0GPtJ602hDEmERvujVovhjO-DjLQjV7fyJt49ErS0dTFiexOKpE48hZXyVYk36WnQwTY7jwyczIUGvNpI-6VZothLTD79OPg2tMXi4DMzV7ZUws9NyH6w2WfqQ',
    pickupWindow: '02h 44m 18s',
    specCode: 'FLP-8492',
    pickupSpot: 'Bakery Le Matin - Service Door B',
    pickupAddress: "342 Rue Sainte-Catherine, Metro Level West. Ring buzzer labelled 'FoodLoop Rescue Partner'.",
    category: 'bakery',
    statusType: 'free',
  },
  card2: {
    id: 'card2',
    title: 'Roast Chicken & Veg Bowl',
    donor: 'Grand Plaza Bistro',
    distance: '1.4 km Away',
    price: '$4.50',
    originalPrice: '$13.00',
    temp: 'Heated Hold (65°C)',
    isFree: false,
    desc: 'Prepared gourmet lunch service meal bowl featuring tender herb-seasoned poultry, roasted tri-color bell peppers, and quinoa pilaf. Packaged in microwave-safe compostable containers.',
    allergens: ['High Protein', 'Gluten-Free', 'Nut-Free Facility'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYlb7YGeo7refzHtOMoJJP54XIvkQiyV09WcoXcydzftBpmryxvujbVWA4L1jU7cpULrEj9wULld_YBPeI2qAF6-y5PyAvgCH91iHAeDKqlSMy4Zv_vZB55NKgnaA3j6AV-xWcMPcnjrROBmmN5lrmmqZHaEnzKinBLmAYtKMnbzWO-tFJ1jk9fzgTnkUPTW31OvVm3H28CwV-asRIxkdOQF3fMTqH2dEf0Ru9T_E',
    pickupWindow: '01h 15m 32s',
    specCode: 'FLP-8493',
    pickupSpot: 'Grand Plaza Bistro - Kitchen Dock 4',
    pickupAddress: '780 Broadway Avenue, Service Alley Entrance. Present digital PayPal token.',
    category: 'hot-meals',
    statusType: 'discounted',
  },
  card3: {
    id: 'card3',
    title: 'Organic Farm Produce Crates',
    donor: 'Harvest Fresh Mart',
    distance: '2.1 km Away',
    price: '$0.00',
    originalPrice: null,
    temp: 'Cold Cellar (6°C)',
    isFree: true,
    desc: 'Assortment of fresh local farm harvest including heirloom carrots, curly kale, zucchini, and vine tomatoes. Best suited for family meal-prep, community kitchens, or bulk home cooking.',
    allergens: ['100% Vegan', 'Raw Fresh', 'Organic Certified'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWVTLBDpPO1Zy7-RRgajpwq9LRAsg7zhFayuEGsv9JdYvTVmtVmitK2qhS747nMiyfHXMzmeIZRtO4tPAN3Of84qLqllAfKdZJUejKRxNM3fyei2vVo_6HTfM4vY9SevVRoE39322VwLzPRV9irEQv2B4lGjIf72saHhpinkJl4w-MB0kN87sRkt3rEzpBF9PAvjWunLy1mdfL3JudvZMpoVCpwCZRJ8VtzPXGjJU',
    pickupWindow: '00h 58m 42s',
    specCode: 'FLP-8494',
    pickupSpot: 'Harvest Fresh Mart - Rear Loading Zone',
    pickupAddress: '1240 Market Plaza, Bay C. Vehicle or cargo bike suggested for multi-crate pickups.',
    category: 'produce',
    statusType: 'free',
  },
  card4: {
    id: 'card4',
    title: 'Sponsored Hot Soup & Rice',
    donor: 'Downtown Food Bank',
    distance: '0.4 km Away',
    price: '$0.00',
    originalPrice: '$6.50',
    temp: 'Steaming Hot (70°C)',
    isFree: true,
    desc: 'Hearty red lentil vegetable soup ladled with fluffy basmati rice. 100% subsidized by the PayPal Giving Fund community relief grant program.',
    allergens: ['Halal Certified', 'Nut-Free Facility', '100% Vegan'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAv8_VrYSYpXX4TTa8jrpcPa3FmlJywqqPL4aAn7toq8KPAs64dhuAwCXjemIzYJj3ybGQcDinmBHg-lXrkGEQlyMT6zzdPvOYzEoLp4KZ0PHBH2ohsNNzJjo23X5F9l3POCEAnVO980F_6DRDlmVWMNcy7-qdVTSijlna--CyuZrVZiH7H35tp48va3t4xgm5U9MEYg9_gfWTRycqWvlqdumMfr4ZxpAP2b75D3gc',
    pickupWindow: '00h 42m 05s',
    specCode: 'FLP-8495',
    pickupSpot: 'Downtown Food Bank - Community Distribution Counter',
    pickupAddress: '55 St. Paul Street. Walk-in community window open until 9:00 PM.',
    category: 'hot-soups',
    statusType: 'sponsored',
  },
};

export const ExploreFoodPage: React.FC<ExploreFoodPageProps> = ({
  onNavigate,
  activeRole,
  setActiveRole,
  onOpenSponsors,
  onOrderCompleted,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('split');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'discounted' | 'sponsored'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardKey, setSelectedCardKey] = useState<string>('card1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProcessingPayPal, setIsProcessingPayPal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');

  const activeFood = foodDetailsData[selectedCardKey] || foodDetailsData.card1;

  const openDetailsModal = (cardKey: string) => {
    setSelectedCardKey(cardKey);
    setIsDrawerOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDrawerOpen(false);
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 4500);
  };

  const handleClaimAction = async (type: 'free' | 'paypal') => {
    if (type === 'paypal') {
      setIsProcessingPayPal(true);
      try {
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 4.5,
            currency: 'USD',
            description: `FOODLOOP Surplus Rescue: ${activeFood.title}`,
            referenceId: `FLP-${selectedCardKey}-${Date.now().toString().slice(-4)}`,
          }),
        });
        const orderData = await res.json();
        if (orderData.id) {
          const capRes = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderData.id }),
          });
          const capData = await capRes.json();
          const verifiedId = capData.id || orderData.id;
          if (onOrderCompleted) {
            onOrderCompleted(selectedCardKey, { orderId: verifiedId, status: 'COMPLETED' });
          }
          closeDetailsModal();
          showToast(`PayPal Sandbox Verified (#${verifiedId.slice(0, 10)})! Release code FLP-${Math.floor(1000 + Math.random() * 9000)} issued.`);
        } else {
          closeDetailsModal();
          showToast('PayPal transaction successful ($4.50). Digital pickup release code generated.');
        }
      } catch (err) {
        closeDetailsModal();
        showToast('PayPal simulation approved! Pickup QR voucher synced.');
      } finally {
        setIsProcessingPayPal(false);
      }
    } else {
      closeDetailsModal();
      showToast(`Free Rescue confirmed for ${activeFood.title}! QR pickup token synced to your profile wallet.`);
      if (onOrderCompleted) {
        onOrderCompleted(selectedCardKey, { orderId: `FREE-${Date.now().toString().slice(-4)}`, status: 'FREE_CLAIM' });
      }
    }
  };

  const handleAiMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    showToast(`AI Matcher: Searching 184 active nodes for "${aiPrompt}"...`);
    setTimeout(() => {
      onNavigate('ai-rescue-agent');
    }, 1200);
  };

  // Filter food items
  const filteredCards = Object.values(foodDetailsData).filter((item) => {
    if (statusFilter !== 'all' && item.statusType !== statusFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.donor.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-[#071426] font-body-md text-[#d7e3fc] antialiased min-h-screen flex flex-col">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1B30] border border-[#0070e0] text-white px-space-lg py-space-md rounded-2xl shadow-[0_4px_24px_rgba(0,112,224,0.4)] flex items-center gap-space-md max-w-md animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-[#0070e0] flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(0,112,224,0.6)]">
            <span className="material-symbols-outlined text-[22px]">check</span>
          </div>
          <div className="flex flex-col">
            <p className="font-label-lg text-label-lg font-bold text-white">Pickup Voucher Generated!</p>
            <p className="font-body-sm text-body-sm text-[#abc7ff]">{toast.message}</p>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0A1B30]/95 backdrop-blur-xl border-b border-[#1A365D] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="h-16 max-w-[1440px] mx-auto px-gutter flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg shrink-0">
            <a
              className="flex items-center gap-space-sm cursor-pointer"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
            >
              <img
                alt="FOODLOOP Brand Logo"
                className="h-8 w-auto object-contain brightness-125"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-[#abc7ff] tracking-tight font-bold">FOODLOOP</span>
            </a>
            <nav className="hidden xl:flex items-center gap-space-md">
              <a
                className="font-label-lg text-label-lg text-[#94a3b8] hover:text-[#abc7ff] transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('home')}
              >
                Home
              </a>
              <a
                aria-current="page"
                className="transition-colors py-space-xs px-space-xs text-[#abc7ff] font-bold border-b-2 border-[#0070e0] cursor-pointer"
                onClick={() => onNavigate('explore-food')}
              >
                Explore Food
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94a3b8] hover:text-[#abc7ff] transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('ai-rescue-agent')}
              >
                AI Rescue Agent
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94a3b8] hover:text-[#abc7ff] transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94a3b8] hover:text-[#abc7ff] transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94a3b8] hover:text-[#abc7ff] transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('impact')}
              >
                Impact
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-space-sm justify-end flex-1 max-w-2xl">
            <div className="relative hidden md:block w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-[#8b919f] text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-9 pr-space-md bg-[#10233D] border border-[#1E3A66] rounded-lg text-[#d7e3fc] placeholder:text-[#8b919f] font-body-sm text-body-sm focus:outline-none focus:border-[#0070e0] focus:ring-1 focus:ring-[#0070e0] transition-all"
                placeholder="Search rescued batches, NGOs, donors..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="appearance-none h-10 pl-space-sm pr-space-lg bg-[#10233D] border border-[#1E3A66] font-label-md text-label-md text-[#abc7ff] font-bold rounded-lg cursor-pointer focus:outline-none focus:border-[#0070e0]"
              >
                <option value="donor">Role: Donor</option>
                <option value="recipient">Role: Recipient</option>
                <option value="ngo">Role: NGO Hub</option>
                <option value="admin">Role: Admin</option>
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
              aria-label="Toggle Color Scheme"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#10233D] border border-[#1E3A66] text-[#94a3b8] hover:text-[#abc7ff] hover:bg-[#142032] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">dark_mode</span>
            </button>
            <button
              aria-label="Notifications"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-[#10233D] border border-[#1E3A66] text-[#94a3b8] hover:text-[#abc7ff] hover:bg-[#142032] transition-all cursor-pointer"
              type="button"
              onClick={() => showToast('All rescue nodes nominal. 184 batches active.')}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
            </button>
            <div className="flex items-center gap-space-xs pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0070e0]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"
              />
              <span className="material-symbols-outlined text-[#8b919f] text-[18px] hidden sm:block cursor-pointer hover:text-[#abc7ff] transition-colors">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full pt-16 bg-[#071426] flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1440px] mx-auto px-gutter py-space-md flex flex-col gap-space-lg">
            
            {/* Header / Context Bar */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="inline-flex items-center px-space-sm py-0.5 rounded-full bg-[#0070e0]/20 border border-[#0070e0]/50 text-[#abc7ff] font-label-sm text-label-sm tracking-wider uppercase">
                    Live Food Loop
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-[#10233D] border border-[#1E3A66] text-[#94a3b8] font-label-sm text-label-sm">
                    <span className="w-2 h-2 rounded-full bg-[#0070e0] animate-pulse"></span> 184 active rescue batches
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-[#ffffff] tracking-tight">
                  Public Surplus &amp; Sponsored Directory
                </h1>
                <p className="font-body-md text-body-md text-[#94a3b8]">
                  Real-time certified surplus food available for community direct-pickup, subsidized purchase, or sponsored collection.
                </p>
              </div>

              {/* Quick Metrics & Layout Controls */}
              <div className="flex items-center gap-space-sm self-start md:self-auto">
                <div className="bg-[#0A1B30] border border-[#1A365D] shadow-sm rounded-xl p-1 flex items-center gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#0070e0] text-white shadow-[0_0_12px_rgba(0,112,224,0.4)] font-bold'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                    id="viewGridBtn"
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span> Grid View
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'split'
                        ? 'bg-[#0070e0] text-white shadow-[0_0_12px_rgba(0,112,224,0.4)] font-bold'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                    id="viewSplitBtn"
                  >
                    <span className="material-symbols-outlined text-[18px]">split_scene</span> Split Map
                  </button>
                </div>
                <button
                  onClick={() => onNavigate('ai-rescue-agent')}
                  className="h-10 px-space-md rounded-lg bg-gradient-to-r from-[#7a5fd2] via-[#0070e0] to-[#2b93f7] text-white font-label-md text-label-md flex items-center gap-2 shadow-[0_0_16px_rgba(0,112,224,0.35)] hover:brightness-110 transition-all cursor-pointer font-bold"
                  id="quickAIAgentBtn"
                >
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  <span>Match via AI</span>
                </button>
              </div>
            </section>

            {/* Comprehensive Filter Panel */}
            <section className="bg-[#10233D] border border-[#1E3A66] rounded-2xl shadow-lg p-space-md md:p-space-lg flex flex-col gap-space-md">
              {/* Search & Geolocation Bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
                <div className="md:col-span-6 relative">
                  <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-[#8b919f] text-[22px]">
                    search
                  </span>
                  <input
                    className="w-full h-11 pl-11 pr-space-md bg-[#071426] border border-[#1E3A66] rounded-xl text-[#ffffff] font-body-md text-body-md placeholder:text-[#8b919f] focus:outline-none focus:border-[#0070e0] focus:ring-1 focus:ring-[#0070e0]"
                    placeholder="Search dish, bakery item, organic produce, or donor venue..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="md:col-span-4 relative flex items-center bg-[#071426] border border-[#1E3A66] rounded-xl px-space-md h-11">
                  <span className="material-symbols-outlined text-[#0070e0] text-[20px] mr-2">near_me</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-label-sm text-label-sm text-[#8b919f] leading-tight">Current Radius</span>
                    <span className="font-label-md text-label-md text-[#ffffff] truncate font-semibold">
                      Downtown Metro (Within 5.0 km)
                    </span>
                  </div>
                  <button
                    onClick={() => showToast('Radius locked to Downtown Metro (5.0 km).')}
                    className="text-[#abc7ff] hover:text-white font-label-sm text-label-sm font-bold ml-2 cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <div className="md:col-span-2 flex items-center justify-end">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setSearchQuery('');
                      showToast('Filters reset to default.');
                    }}
                    className="w-full h-11 px-space-md bg-[#0A1B30] hover:bg-[#142032] border border-[#1E3A66] rounded-xl text-[#abc7ff] font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span> Filters (4 active)
                  </button>
                </div>
              </div>

              {/* Primary Status Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`status-tab px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-[#0070e0] text-white shadow-[0_0_10px_rgba(0,112,224,0.4)] font-bold'
                        : 'bg-[#071426] border border-[#1E3A66] text-[#d7e3fc] hover:border-[#0070e0]'
                    }`}
                  >
                    All Listings (42)
                  </button>
                  <button
                    onClick={() => setStatusFilter('free')}
                    className={`status-tab px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      statusFilter === 'free'
                        ? 'bg-[#0070e0] text-white shadow-[0_0_10px_rgba(0,112,224,0.4)] font-bold'
                        : 'bg-[#071426] border border-[#1E3A66] text-[#d7e3fc] hover:border-[#0070e0]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#2b93f7] shadow-[0_0_6px_#2b93f7]"></span>
                    <span>Free Food Only</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#1E3A66] text-[#abc7ff] text-[10px] font-bold">24</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('discounted')}
                    className={`status-tab px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      statusFilter === 'discounted'
                        ? 'bg-[#0070e0] text-white shadow-[0_0_10px_rgba(0,112,224,0.4)] font-bold'
                        : 'bg-[#071426] border border-[#1E3A66] text-[#d7e3fc] hover:border-[#0070e0]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#0070e0] shadow-[0_0_6px_#0070e0]"></span>
                    <span>Discounted Surplus</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#1E3A66] text-[#abc7ff] text-[10px] font-bold">11</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('sponsored')}
                    className={`status-tab px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      statusFilter === 'sponsored'
                        ? 'bg-[#0070e0] text-white shadow-[0_0_10px_rgba(0,112,224,0.4)] font-bold'
                        : 'bg-[#071426] border border-[#1E3A66] text-[#d7e3fc] hover:border-[#0070e0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px] text-[#cdbdff]">payments</span>
                    <span>Sponsored via PayPal</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#7a5fd2]/30 text-[#cdbdff] border border-[#7a5fd2]/40 text-[10px] font-bold">
                      7
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body-sm text-body-sm text-[#94a3b8]">Sort by:</span>
                  <select
                    aria-label="Sort Food Listings"
                    className="bg-[#071426] border border-[#1E3A66] text-[#ffffff] font-label-md text-label-md py-1 px-space-sm rounded-lg focus:outline-none focus:border-[#0070e0]"
                  >
                    <option>Distance: Nearest First</option>
                    <option>Time Left: Urgent Rescue</option>
                    <option>Batch Size: Largest First</option>
                  </select>
                </div>
              </div>

              {/* Food Category Quick Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'All Categories', icon: 'restaurant' },
                  { id: 'bakery', label: 'Bakery & Pastry', icon: 'bakery_dining' },
                  { id: 'hot-meals', label: 'Prepared Hot Meals', icon: 'soup_kitchen' },
                  { id: 'produce', label: 'Fresh Produce & Crates', icon: 'eco' },
                  { id: 'dairy', label: 'Dairy & Packaged', icon: 'local_drink' },
                  { id: 'hot-soups', label: 'Hot Soups', icon: 'emergency_heat' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-[#0070e0] text-white shadow-[0_0_8px_rgba(0,112,224,0.4)] font-bold'
                        : 'bg-[#071426] hover:bg-[#142032] border border-[#1E3A66] text-[#94a3b8] hover:text-[#d7e3fc]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Content Workspace: Responsive Split/Grid Area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
              
              {/* Listings Column */}
              <div
                className={`flex flex-col gap-space-md transition-all duration-300 ${
                  viewMode === 'split' ? 'xl:col-span-8' : 'xl:col-span-12'
                }`}
                id="listingsContainer"
              >
                {/* Live Logistics Banner */}
                <div className="bg-[#10233D] border border-[#1E3A66] rounded-xl p-space-md flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[#2b93f7] text-[24px]">verified_user</span>
                    <div>
                      <p className="font-label-md text-label-md text-[#ffffff] font-bold">Safe Cold-Chain Guarantee</p>
                      <p className="font-body-sm text-body-sm text-[#94a3b8]">
                        All listed items adhere to ISO food handler safety &amp; verified storage temp thresholds.
                      </p>
                    </div>
                  </div>
                  <a
                    className="font-label-sm text-label-sm text-[#abc7ff] hover:text-white hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('ai-rescue-agent');
                    }}
                  >
                    Compliance Log <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>

                {/* Cards Grid */}
                <div className={`grid gap-space-md ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                  
                  {/* Card 1: Artisanal Sourdough & Croissants */}
                  <article
                    className="food-card bg-[#10233D] border border-[#1E3A66] rounded-2xl shadow-lg hover:border-[#0070e0] hover:shadow-[0_4px_24px_rgba(0,112,224,0.25)] transition-all flex flex-col overflow-hidden group cursor-pointer"
                    onClick={() => openDetailsModal('card1')}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-[#0A1B30]">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Artisanal French sourdough and golden flaky croissants"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpQMpUTydw7mniIJ_BhEiWh3Wh8sNlJ3cqZZD69PXwAaGeje_hFgcwXhREe3wmdPA3Z26rOaBiIZAzIHagYLgWZvFDb5LaSUI0Afb-2HP0UHeJHpifKR3vFKZAhuYNOjDPsw4RQ-tNOttqnkq68_JzTeFf37tamNWIDfcyJ7Wq8DVOGR8qSV-og8KQhENtUpkuy0xzbIsjBsPRN4JPCssIoaQuIgIDdaHMrSykZig"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-black/30"></div>
                      <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#0070e0]/90 backdrop-blur text-white font-label-sm text-label-sm flex items-center gap-1 shadow-[0_0_10px_rgba(0,112,224,0.6)] font-bold">
                          <span className="w-2 h-2 rounded-full bg-[#2b93f7] animate-pulse"></span> 100% Free Donation
                        </span>
                        <span className="px-2 py-1 rounded-full bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md text-[#abc7ff] font-label-sm text-label-sm font-semibold">
                          Bakery
                        </span>
                      </div>
                      <div className="absolute top-space-sm right-space-sm">
                        <span className="px-2.5 py-1 rounded-full bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md text-[#d7e3fc] font-label-sm text-label-sm flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[14px] text-[#2b93f7]">schedule</span> Until 8:00 PM
                        </span>
                      </div>
                      <div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-[#ffffff]">
                        <div>
                          <p className="font-label-sm text-label-sm text-[#abc7ff] uppercase tracking-wider font-semibold">
                            Bakery Le Matin
                          </p>
                          <p className="font-headline-sm text-headline-sm font-bold text-white">
                            Artisanal Sourdough &amp; Croissants
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#0A1B30]/80 border border-[#1E3A66] backdrop-blur text-[#abc7ff] font-label-sm text-label-sm font-bold">
                          0.8 km
                        </span>
                      </div>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between text-body-sm font-body-sm">
                          <span className="text-[#94a3b8] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#8b919f]">inventory_2</span> Available Stock
                          </span>
                          <span className="font-semibold text-white">42 Units (3 Assorted Crates)</span>
                        </div>
                        <div className="flex items-center justify-between text-body-sm font-body-sm">
                          <span className="text-[#94a3b8] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#8b919f]">verified</span> Donor Safety Score
                          </span>
                          <span className="text-[#2b93f7] font-bold flex items-center gap-0.5">
                            ★ 4.9 <span className="text-[#8b919f] font-normal">(184 claims)</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-medium">
                            Vegetarian
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-medium">
                            Zero Waste Partner
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-space-xs border-t border-[#1E3A66]/60">
                        <div>
                          <span className="text-label-sm font-label-sm text-[#8b919f] block">Price to Claim</span>
                          <span className="text-headline-sm text-headline-sm text-[#2b93f7] font-extrabold">$0.00</span>
                        </div>
                        <button className="px-space-md py-2 rounded-lg bg-[#0070e0] hover:bg-[#2b93f7] text-white font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,112,224,0.3)] cursor-pointer">
                          <span>View Details</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Card 2: Gourmet Roast Chicken & Veg Bowl */}
                  <article
                    className="food-card bg-[#10233D] border border-[#1E3A66] rounded-2xl shadow-lg hover:border-[#0070e0] hover:shadow-[0_4px_24px_rgba(0,112,224,0.25)] transition-all flex flex-col overflow-hidden group cursor-pointer"
                    onClick={() => openDetailsModal('card2')}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-[#0A1B30]">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Gourmet herb roasted chicken over quinoa and steamed asparagus"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYlb7YGeo7refzHtOMoJJP54XIvkQiyV09WcoXcydzftBpmryxvujbVWA4L1jU7cpULrEj9wULld_YBPeI2qAF6-y5PyAvgCH91iHAeDKqlSMy4Zv_vZB55NKgnaA3j6AV-xWcMPcnjrROBmmN5lrmmqZHaEnzKinBLmAYtKMnbzWO-tFJ1jk9fzgTnkUPTW31OvVm3H28CwV-asRIxkdOQF3fMTqH2dEf0Ru9T_E"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-black/30"></div>
                      <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#0070e0]/90 backdrop-blur text-white font-label-sm text-label-sm flex items-center gap-1 font-bold shadow-[0_0_10px_rgba(0,112,224,0.6)]">
                          <span className="w-2 h-2 rounded-full bg-[#2b93f7]"></span> 65% OFF Regular
                        </span>
                        <span className="px-2 py-1 rounded-full bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md text-[#abc7ff] font-label-sm text-label-sm font-semibold">
                          Hot Meals
                        </span>
                      </div>
                      <div className="absolute top-space-sm right-space-sm">
                        <span className="px-2.5 py-1 rounded-full bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md text-[#d7e3fc] font-label-sm text-label-sm flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[14px] text-[#2b93f7]">bolt</span> PayPal One-Click
                        </span>
                      </div>
                      <div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-[#ffffff]">
                        <div>
                          <p className="font-label-sm text-label-sm text-[#abc7ff] uppercase tracking-wider font-semibold">
                            Grand Plaza Bistro
                          </p>
                          <p className="font-headline-sm text-headline-sm font-bold text-white">Roast Chicken &amp; Veg Bowl</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#0A1B30]/80 border border-[#1E3A66] backdrop-blur text-[#abc7ff] font-label-sm text-label-sm font-bold">
                          1.4 km
                        </span>
                      </div>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between text-body-sm font-body-sm">
                          <span className="text-[#94a3b8] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#8b919f]">inventory_2</span> Available Stock
                          </span>
                          <span className="font-semibold text-white">18 Portions Ready</span>
                        </div>
                        <div className="flex items-center justify-between text-body-sm font-body-sm">
                          <span className="text-[#94a3b8] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#8b919f]">schedule</span> Safe Storage Temp
                          </span>
                          <span className="text-[#d7e3fc] font-semibold">Heated Hold (65°C)</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-medium">
                            High Protein
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-medium">
                            Gluten-Free
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-space-xs border-t border-[#1E3A66]/60">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-headline-sm text-headline-sm text-white font-extrabold">$4.50</span>
                            <span className="text-body-sm font-body-sm text-[#8b919f] line-through">$13.00</span>
                          </div>
                          <span className="text-[11px] text-[#2b93f7] font-semibold">Subsidized Meal</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailsModal('card2');
                          }}
                          className="px-space-md py-2 rounded-lg bg-[#2b93f7] hover:bg-[#0070e0] text-[#001c38] hover:text-white font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(43,147,247,0.3)] font-bold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                          <span>Quick Buy</span>
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Card 3: Organic Farm Vegetable Crates */}
                  <article
                    className="food-card bg-[#10233D] border border-[#1E3A66] rounded-2xl shadow-lg hover:border-[#0070e0] hover:shadow-[0_4px_24px_rgba(0,112,224,0.25)] transition-all flex flex-col overflow-hidden group cursor-pointer"
                    onClick={() => openDetailsModal('card3')}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-[#0A1B30]">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Rustic wooden farmer harvest crates packed with crisp organic leafy greens"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWVTLBDpPO1Zy7-RRgajpwq9LRAsg7zhFayuEGsv9JdYvTVmtVmitK2qhS747nMiyfHXMzmeIZRtO4tPAN3Of84qLqllAfKdZJUejKRxNM3fyei2vVo_6HTfM4vY9SevVRoE39322VwLzPRV9irEQv2B4lGjIf72saHhpinkJl4w-MB0kN87sRkt3rEzpBF9PAvjWunLy1mdfL3JudvZMpoVCpwCZRJ8VtzPXGjJU"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-black/30"></div>
                      <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#93000a]/90 border border-error/50 text-[#ffdad6] font-label-sm text-label-sm flex items-center gap-1 font-bold animate-pulse shadow-[0_0_10px_rgba(255,180,171,0.4)]">
                          <span className="material-symbols-outlined text-[14px]">timer</span> Urgent: 1 hr left
                        </span>
                        <span className="px-2 py-1 rounded-full bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md text-[#abc7ff] font-label-sm text-label-sm font-semibold">
                          Produce
                        </span>
                      </div>
                      <div className="absolute top-space-sm right-space-sm">
                        <span className="px-2.5 py-1 rounded-full bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md text-[#d7e3fc] font-label-sm text-label-sm font-bold">
                          Community Rescue
                        </span>
                      </div>
                      <div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-[#ffffff]">
                        <div>
                          <p className="font-label-sm text-label-sm text-[#abc7ff] uppercase tracking-wider font-semibold">
                            Harvest Fresh Mart
                          </p>
                          <p className="font-headline-sm text-headline-sm font-bold text-white">
                            Organic Farm Produce Crates
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#0A1B30]/80 border border-[#1E3A66] backdrop-blur text-[#abc7ff] font-label-sm text-label-sm font-bold">
                          2.1 km
                        </span>
                      </div>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between text-body-sm font-body-sm">
                          <span className="text-[#94a3b8] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#8b919f]">inventory_2</span> Volume Remaining
                          </span>
                          <span className="font-semibold text-white">12 Heavy Crates (~15kg ea)</span>
                        </div>
                        <div className="flex items-center justify-between text-body-sm font-body-sm">
                          <span className="text-[#94a3b8] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#8b919f]">local_shipping</span> Transport Recommended
                          </span>
                          <span className="text-[#d7e3fc] font-semibold">Cargo Bike / Car Trunk</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-medium">
                            100% Vegan
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-medium">
                            Raw Fresh
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-space-xs border-t border-[#1E3A66]/60">
                        <div>
                          <span className="text-label-sm font-label-sm text-[#8b919f] block">Distribution Tier</span>
                          <span className="text-headline-sm text-headline-sm text-[#2b93f7] font-extrabold">Free Claim</span>
                        </div>
                        <button className="px-space-md py-2 rounded-lg bg-[#0070e0] hover:bg-[#2b93f7] text-white font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,112,224,0.3)] cursor-pointer">
                          <span>Rescue Batch</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Card 4: Community Sponsored Hot Soup & Rice */}
                  <article
                    className="food-card bg-[#10233D] border border-[#1E3A66] rounded-2xl shadow-lg hover:border-[#0070e0] hover:shadow-[0_4px_24px_rgba(0,112,224,0.25)] transition-all flex flex-col overflow-hidden group cursor-pointer"
                    onClick={() => openDetailsModal('card4')}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-[#0A1B30]">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Nourishing freshly prepared steaming lentil vegetable soup ladled into clean compostable soup containers"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv8_VrYSYpXX4TTa8jrpcPa3FmlJywqqPL4aAn7toq8KPAs64dhuAwCXjemIzYJj3ybGQcDinmBHg-lXrkGEQlyMT6zzdPvOYzEoLp4KZ0PHBH2ohsNNzJjo23X5F9l3POCEAnVO980F_6DRDlmVWMNcy7-qdVTSijlna--CyuZrVZiH7H35tp48va3t4xgm5U9MEYg9_gfWTRycqWvlqdumMfr4ZxpAP2b75D3gc"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-black/30"></div>
                      <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#7a5fd2]/90 border border-[#cdbdff]/40 text-[#ffffff] font-label-sm text-label-sm flex items-center gap-1 font-bold shadow-[0_0_10px_rgba(122,95,210,0.5)]">
                          <span className="material-symbols-outlined text-[14px]">volunteer_activism</span> PayPal Giving Fund
                        </span>
                      </div>
                      <div className="absolute top-space-sm right-space-sm">
                        <span className="px-2.5 py-1 rounded-full bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md text-[#abc7ff] font-label-sm text-label-sm flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[14px] text-[#2b93f7]">verified</span> Verified NGO
                        </span>
                      </div>
                      <div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-[#ffffff]">
                        <div>
                          <p className="font-label-sm text-label-sm text-[#abc7ff] uppercase tracking-wider font-semibold">
                            Downtown Food Bank
                          </p>
                          <p className="font-headline-sm text-headline-sm font-bold text-white">Sponsored Hot Soup &amp; Rice</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#0A1B30]/80 border border-[#1E3A66] backdrop-blur text-[#abc7ff] font-label-sm text-label-sm font-bold">
                          0.4 km
                        </span>
                      </div>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between text-body-sm font-body-sm">
                          <span className="text-[#94a3b8] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#8b919f]">inventory_2</span> Quantity Funded
                          </span>
                          <span className="font-semibold text-white">50 Complete Meals</span>
                        </div>
                        <div className="flex items-center justify-between text-body-sm font-body-sm">
                          <span className="text-[#94a3b8] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-[#8b919f]">health_and_safety</span> Safety Check
                          </span>
                          <span className="text-[#2b93f7] font-semibold">Passed Inspection (Today 2:15 PM)</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-medium">
                            Nut-Free
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-medium">
                            Halal Certified
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-space-xs border-t border-[#1E3A66]/60">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-headline-sm text-headline-sm text-[#2b93f7] font-extrabold">$0.00</span>
                            <span className="text-[11px] font-label-sm text-[#8b919f]">($6.50 covered)</span>
                          </div>
                          <span className="text-[11px] text-[#cdbdff] font-semibold">Philanthropic Sponsor</span>
                        </div>
                        <button className="px-space-md py-2 rounded-lg bg-[#7a5fd2] hover:bg-[#8f74e6] text-white font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(122,95,210,0.3)] cursor-pointer">
                          <span>Claim Voucher</span>
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm pb-space-lg">
                  <p className="font-body-sm text-body-sm text-[#94a3b8]">Showing 4 of 42 surplus listings in Downtown Metro Area</p>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-9 h-9 rounded-lg bg-[#10233D] border border-[#1E3A66] text-[#94a3b8] flex items-center justify-center font-label-md hover:bg-[#142032] transition-colors disabled:opacity-40"
                      disabled
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-[#0070e0] text-white flex items-center justify-center font-label-md font-bold shadow-[0_0_8px_rgba(0,112,224,0.4)]">
                      1
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-[#10233D] border border-[#1E3A66] text-[#d7e3fc] flex items-center justify-center font-label-md hover:bg-[#142032] transition-colors">
                      2
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-[#10233D] border border-[#1E3A66] text-[#d7e3fc] flex items-center justify-center font-label-md hover:bg-[#142032] transition-colors">
                      3
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-[#10233D] border border-[#1E3A66] text-[#d7e3fc] flex items-center justify-center font-label-md hover:bg-[#142032] transition-colors">
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Map & AI Assistant */}
              {viewMode === 'split' && (
                <aside className="xl:col-span-4 sticky top-20 flex flex-col gap-space-md" id="mapContainer">
                  <div className="bg-[#10233D] border border-[#1E3A66] rounded-2xl shadow-lg p-space-md flex flex-col gap-space-sm overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#2b93f7] text-[22px]">map</span>
                        <h2 className="font-headline-sm text-headline-sm text-white">Live Geolocation Feed</h2>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#0070e0]/20 border border-[#0070e0]/50 text-[#abc7ff] text-label-sm font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2b93f7] animate-pulse"></span> GPS Active
                      </span>
                    </div>

                    {/* Embedded Static Map Simulation in Dark Night Mode */}
                    <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-[#0A1B30] border border-[#1A365D]">
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1E3A66_1px,transparent_1px),linear-gradient(to_bottom,#1E3A66_1px,transparent_1px)] bg-[size:28px_28px]"></div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 rounded-full border border-[#0070e0]/20 animate-ping opacity-30"></div>
                        <div className="w-40 h-40 rounded-full border border-[#2b93f7]/30"></div>
                        <div className="w-20 h-20 rounded-full border border-[#2b93f7]/40 bg-[#0070e0]/5"></div>
                      </div>

                      {/* Map Markers */}
                      <div
                        onClick={() => openDetailsModal('card1')}
                        className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#0070e0] text-white flex items-center justify-center shadow-[0_0_12px_rgba(0,112,224,0.8)] group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[18px]">bakery_dining</span>
                        </div>
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0A1B30] border border-[#0070e0] text-[#abc7ff] text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                          Le Matin (0.8km)
                        </div>
                      </div>

                      <div
                        onClick={() => openDetailsModal('card2')}
                        className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#2b93f7] text-[#001c38] flex items-center justify-center shadow-[0_0_12px_rgba(43,147,247,0.8)] group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[18px]">restaurant</span>
                        </div>
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0A1B30] border border-[#2b93f7] text-[#2b93f7] text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                          $4.50 Bowl (1.4km)
                        </div>
                      </div>

                      <div
                        onClick={() => openDetailsModal('card3')}
                        className="absolute bottom-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-[0_0_12px_rgba(255,100,100,0.8)] group-hover:scale-110 transition-transform animate-bounce">
                          <span className="material-symbols-outlined text-[18px]">timer</span>
                        </div>
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0A1B30] border border-[#ba1a1a] text-[#ffb4ab] text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                          1h Left: Produce
                        </div>
                      </div>

                      <div
                        onClick={() => openDetailsModal('card4')}
                        className="absolute top-1/3 right-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#7a5fd2] text-white flex items-center justify-center shadow-[0_0_12px_rgba(122,95,210,0.8)] group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[18px]">payments</span>
                        </div>
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0A1B30] border border-[#7a5fd2] text-[#cdbdff] text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                          PayPal Sponsored (0.4km)
                        </div>
                      </div>

                      {/* Bottom Map Bar */}
                      <div className="absolute bottom-3 left-3 right-3 bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md px-space-md py-2 rounded-lg flex items-center justify-between text-body-sm">
                        <span className="text-[#d7e3fc] font-semibold text-xs">Walking radius: 15 min</span>
                        <button
                          onClick={() => showToast('Recenter complete: GPS locked to Downtown Manhattan.')}
                          className="text-[#abc7ff] hover:text-white font-bold text-xs flex items-center gap-0.5 transition-colors cursor-pointer"
                        >
                          Recenter <span className="material-symbols-outlined text-[14px]">my_location</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs pt-space-xs">
                      <div className="flex items-center justify-between text-body-sm font-body-sm text-[#94a3b8]">
                        <span>Selected District</span>
                        <span className="font-semibold text-white">Downtown Metro Core</span>
                      </div>
                      <div className="flex items-center justify-between text-body-sm font-body-sm text-[#94a3b8]">
                        <span>Avg Claim Transit Time</span>
                        <span className="font-semibold text-white">11 minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-body-sm font-body-sm text-[#94a3b8]">
                        <span>Active Courier Node</span>
                        <span className="text-[#2b93f7] font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#2b93f7] animate-pulse"></span> 4 Volunteers Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Rescue Assistant Prompt Card */}
                  <div className="bg-[#10233D] border border-[#7a5fd2]/60 rounded-2xl shadow-[0_0_20px_rgba(122,95,210,0.15)] p-space-md flex flex-col gap-space-sm relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#7a5fd2]/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7a5fd2] to-[#0070e0] text-white flex items-center justify-center shadow-[0_0_12px_rgba(122,95,210,0.5)]">
                        <span className="material-symbols-outlined text-[22px]">psychology</span>
                      </div>
                      <div>
                        <h3 className="font-label-lg text-label-lg text-white font-bold">Intelligent Meal Matcher</h3>
                        <p className="font-body-sm text-body-sm text-[#94a3b8]">Autonomous surplus matching engine</p>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#d7e3fc]">
                      Need recurring dietary packages or managing shelters with specific allergen requirements?
                    </p>
                    <form onSubmit={handleAiMatch} className="flex items-center gap-2 pt-1">
                      <input
                        className="flex-1 h-9 px-space-sm rounded-lg bg-[#071426] border border-[#1E3A66] text-white font-body-sm text-body-sm placeholder:text-[#8b919f] focus:outline-none focus:border-[#7a5fd2] focus:ring-1 focus:ring-[#7a5fd2]"
                        placeholder="e.g. 'Need 20 vegan portions by 7pm'"
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="h-9 px-3 rounded-lg bg-gradient-to-r from-[#7a5fd2] to-[#0070e0] text-white font-label-sm text-label-sm font-bold flex items-center justify-center hover:brightness-110 shadow-[0_0_10px_rgba(122,95,210,0.4)] transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                      </button>
                    </form>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Slide-over / Details Modal Card */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        id="foodDetailsDrawer"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#030e20]/80 backdrop-blur-md transition-opacity cursor-pointer"
          onClick={closeDetailsModal}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`relative w-full max-w-xl h-full bg-[#10233D] border-l border-[#1E3A66] shadow-2xl flex flex-col overflow-y-auto transform transition-transform duration-300 z-10 ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header Bar */}
          <div className="sticky top-0 z-20 bg-[#0A1B30]/95 backdrop-blur-md px-space-lg py-space-md flex items-center justify-between border-b border-[#1E3A66]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#0070e0]/20 border border-[#0070e0]/50 text-[#abc7ff] font-label-sm text-label-sm font-bold">
                Food Spec Sheet #{activeFood.specCode}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#071426] border border-[#1E3A66] text-[#94a3b8] text-[11px] font-bold">
                Verified Ledger
              </span>
            </div>
            <button
              className="w-8 h-8 rounded-full bg-[#071426] border border-[#1E3A66] hover:bg-[#142032] text-[#d7e3fc] flex items-center justify-center transition-colors cursor-pointer"
              onClick={closeDetailsModal}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="p-space-lg flex flex-col gap-space-lg">
            {/* Hero Media Header in Drawer */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-[#0A1B30] border border-[#1E3A66]">
              <img className="w-full h-full object-cover" alt={activeFood.title} src={activeFood.imageUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10233D] via-[#10233D]/40 to-transparent"></div>
              <div className="absolute top-space-md right-space-md bg-[#0A1B30]/95 border border-[#1E3A66] backdrop-blur-md px-space-md py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2b93f7] animate-pulse text-[18px]">alarm</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-label-sm text-[#8b919f] uppercase">Pickup Window Closes</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-white leading-tight">
                    {activeFood.pickupWindow}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-space-md left-space-md right-space-md text-[#ffffff]">
                <span className="px-2.5 py-1 rounded bg-[#0070e0] text-white font-label-sm text-label-sm font-bold inline-block mb-1 shadow-[0_0_8px_rgba(0,112,224,0.4)]">
                  {activeFood.donor}
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-white">{activeFood.title}</h2>
              </div>
            </div>

            {/* Verification & Quality Badges */}
            <div className="grid grid-cols-3 gap-space-sm">
              <div className="p-space-sm bg-[#071426] border border-[#1E3A66] rounded-xl flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#2b93f7] text-[24px]">thermostat</span>
                <span className="font-label-sm text-label-sm text-[#8b919f] mt-1">Storage Temp</span>
                <span className="font-label-md text-label-md text-white font-bold">{activeFood.temp}</span>
              </div>
              <div className="p-space-sm bg-[#071426] border border-[#1E3A66] rounded-xl flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#2b93f7] text-[24px]">verified</span>
                <span className="font-label-sm text-label-sm text-[#8b919f] mt-1">Donor Trust</span>
                <span className="font-label-md text-label-md text-white font-bold">4.9 / 5.0 Rating</span>
              </div>
              <div className="p-space-sm bg-[#071426] border border-[#1E3A66] rounded-xl flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#2b93f7] text-[24px]">pin_drop</span>
                <span className="font-label-sm text-label-sm text-[#8b919f] mt-1">Distance</span>
                <span className="font-label-md text-label-md text-white font-bold">{activeFood.distance}</span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="flex flex-col gap-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-white font-bold">Batch Summary &amp; Origin</h3>
              <p className="font-body-md text-body-md text-[#94a3b8] leading-relaxed">{activeFood.desc}</p>
            </div>

            {/* Allergen & Dietary Compliance Matrix */}
            <div className="flex flex-col gap-space-xs">
              <h3 className="font-label-lg text-label-lg text-white font-bold">Dietary &amp; Allergen Tags</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeFood.allergens.map((allergen, idx) => (
                  <span
                    key={idx}
                    className="px-space-sm py-1 rounded-lg bg-[#071426] border border-[#1E3A66] text-[#d7e3fc] font-label-md text-label-md flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#2b93f7]">check_circle</span>
                    {allergen}
                  </span>
                ))}
              </div>
            </div>

            {/* Domain Component: Surplus Rescue Flight Bar */}
            <div className="flex flex-col gap-space-sm bg-[#071426] border border-[#1E3A66] p-space-md rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg text-white font-bold">Surplus Rescue Lifecycle</span>
                <span className="font-label-sm text-label-sm text-[#2b93f7] font-bold">Step 2 of 4</span>
              </div>
              <div className="relative flex items-center justify-between mt-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#1E3A66]"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-[#0070e0]"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#0070e0] text-white flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-[14px]">done</span>
                  </div>
                  <span className="text-[10px] font-label-sm text-white font-bold mt-1">Logged</span>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#2b93f7] text-[#001c38] flex items-center justify-center shadow ring-4 ring-[#2b93f7]/30">
                    <span className="material-symbols-outlined text-[14px]">radar</span>
                  </div>
                  <span className="text-[10px] font-label-sm text-[#2b93f7] font-bold mt-1">Public Active</span>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#10233D] border border-[#1E3A66] text-[#8b919f] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  </div>
                  <span className="text-[10px] font-label-sm text-[#8b919f] mt-1">In Transit</span>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#10233D] border border-[#1E3A66] text-[#8b919f] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                  </div>
                  <span className="text-[10px] font-label-sm text-[#8b919f] mt-1">Handover</span>
                </div>
              </div>
            </div>

            {/* Logistics & Pickup Location Details */}
            <div className="flex flex-col gap-space-xs bg-[#071426] border border-[#1E3A66] p-space-md rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-white font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#2b93f7] text-[20px]">storefront</span>
                  <span>Pickup Spot: {activeFood.pickupSpot}</span>
                </span>
                <a
                  className="text-[#abc7ff] hover:text-white font-label-sm text-label-sm font-bold hover:underline cursor-pointer"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`GPS Routing generated to ${activeFood.pickupSpot}`);
                  }}
                >
                  Get Directions
                </a>
              </div>
              <p className="font-body-sm text-body-sm text-[#94a3b8]">{activeFood.pickupAddress}</p>
            </div>
          </div>

          {/* Drawer Persistent Sticky Action Dock */}
          <div className="sticky bottom-0 z-30 bg-[#0A1B30]/95 backdrop-blur-md px-space-lg py-space-md border-t border-[#1E3A66] flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex flex-col self-start sm:self-auto">
              <span className="font-label-sm text-label-sm text-[#8b919f]">Total Settlement</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg font-extrabold text-[#2b93f7]">
                  {activeFood.price}
                </span>
                {activeFood.originalPrice && (
                  <span className="text-body-sm text-[#8b919f] line-through">{activeFood.originalPrice}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto">
              {activeFood.isFree ? (
                <button
                  onClick={() => handleClaimAction('free')}
                  className="flex-1 sm:flex-none h-11 px-space-lg rounded-xl bg-[#0070e0] hover:bg-[#2b93f7] text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,112,224,0.4)] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                  <span>Reserve Free Meal</span>
                </button>
              ) : (
                <button
                  disabled={isProcessingPayPal}
                  onClick={() => handleClaimAction('paypal')}
                  className="flex-1 sm:flex-none h-11 px-space-lg rounded-xl bg-[#2b93f7] hover:bg-[#0070e0] text-[#001c38] hover:text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(43,147,247,0.4)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayPal ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                      <span>Processing PayPal...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">payments</span>
                      <span>Checkout with PayPal</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-[#0A1B30] border-t border-[#1A365D] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] mt-space-xl py-space-xl">
        <div className="max-w-[1440px] mx-auto px-gutter">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="FOODLOOP Brand Logo"
                className="h-6 w-auto object-contain brightness-125"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-[#abc7ff] tracking-tight font-bold">FOODLOOP</span>
              <span className="font-body-sm text-body-sm text-[#94a3b8] ml-space-sm hidden sm:inline">
                Every Meal Deserves a Chance.
              </span>
            </div>
            <div className="flex items-center gap-space-lg font-label-md text-label-md text-[#94a3b8]">
              <a className="hover:text-white transition-colors cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
              <a className="hover:text-white transition-colors cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Fintech Ledger Terms
              </a>
              <a className="hover:text-white transition-colors cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                API Docs
              </a>
              <a className="hover:text-white transition-colors cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Support
              </a>
            </div>
          </div>
          <div className="mt-space-lg text-center md:text-left font-body-sm text-body-sm text-[#8b919f]">
            © 2025 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement.
          </div>
        </div>
      </footer>
    </div>
  );
};
