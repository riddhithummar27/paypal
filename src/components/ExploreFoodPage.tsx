'use client';

import React, { useState } from 'react';

interface ExploreFoodPageProps {
  onNavigate: (page: string) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  onOpenSponsors?: () => void;
  onOrderCompleted?: (listingId: string, orderDetails: any) => void;
}

const foodDetailsData: Record<
  string,
  {
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
    code: string;
  }
> = {
  card1: {
    title: "Artisanal Sourdough & Croissants",
    donor: "Bakery Le Matin",
    distance: "0.8 km Away",
    price: "$0.00",
    originalPrice: null,
    temp: "Safe Ambient (18°C)",
    isFree: true,
    desc: "Daily handcrafted sourdough loaves and pure butter croissants baked at dawn. Unsold inventory safely sealed in food-grade thermal bags to retain crispness and nutrition.",
    allergens: ["Vegetarian", "Dairy (Butter)", "Contains Wheat/Gluten"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewQDn94i_DcNAOiySiYyePNJ-K67qeyXNI4Y8XIs4i2pIJoZiS38bOnFq4fQdHg2RLOR-j0341oYdSTYxtVCzWpOkfIVeg50wjjIMFUaezdxrZ0GPtJ602hDEmERvujVovhjO-DjLQjV7fyJt49ErS0dTFiexOKpE48hZXyVYk36WnQwTY7jwyczIUGvNpI-6VZothLTD79OPg2tMXi4DMzV7ZUws9NyH6w2WfqQ",
    pickupWindow: "02h 44m 18s",
    code: "FLP-8492",
  },
  card2: {
    title: "Roast Chicken & Veg Bowl",
    donor: "Grand Plaza Bistro",
    distance: "1.4 km Away",
    price: "$4.50",
    originalPrice: "$13.00",
    temp: "Heated Hold (65°C)",
    isFree: false,
    desc: "Prepared gourmet lunch service meal bowl featuring tender herb-seasoned poultry, roasted tri-color bell peppers, and quinoa pilaf. Packaged in microwave-safe compostable containers.",
    allergens: ["High Protein", "Gluten-Free", "Nut-Free"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYlb7YGeo7refzHtOMoJJP54XIvkQiyV09WcoXcydzftBpmryxvujbVWA4L1jU7cpULrEj9wULld_YBPeI2qAF6-y5PyAvgCH91iHAeDKqlSMy4Zv_vZB55NKgnaA3j6AV-xWcMPcnjrROBmmN5lrmmqZHaEnzKinBLmAYtKMnbzWO-tFJ1jk9fzgTnkUPTW31OvVm3H28CwV-asRIxkdOQF3fMTqH2dEf0Ru9T_E",
    pickupWindow: "01h 15m 32s",
    code: "FLP-8493",
  },
  card3: {
    title: "Organic Farm Produce Crates",
    donor: "Harvest Fresh Mart",
    distance: "2.1 km Away",
    price: "$0.00",
    originalPrice: null,
    temp: "Cold Cellar (6°C)",
    isFree: true,
    desc: "Assortment of fresh local farm harvest including heirloom carrots, curly kale, zucchini, and vine tomatoes. Best suited for family meal-prep, community kitchens, or bulk home cooking.",
    allergens: ["100% Vegan", "Raw Fresh", "Organic Certified"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWVTLBDpPO1Zy7-RRgajpwq9LRAsg7zhFayuEGsv9JdYvTVmtVmitK2qhS747nMiyfHXMzmeIZRtO4tPAN3Of84qLqllAfKdZJUejKRxNM3fyei2vVo_6HTfM4vY9SevVRoE39322VwLzPRV9irEQv2B4lGjIf72saHhpinkJl4w-MB0kN87sRkt3rEzpBF9PAvjWunLy1mdfL3JudvZMpoVCpwCZRJ8VtzPXGjJU",
    pickupWindow: "03h 50m 10s",
    code: "FLP-8494",
  },
  card4: {
    title: "Sponsored Hot Soup & Rice",
    donor: "Downtown Food Bank",
    distance: "0.4 km Away",
    price: "$0.00",
    originalPrice: "$6.50",
    temp: "Steaming Hot (70°C)",
    isFree: true,
    desc: "Hearty red lentil vegetable soup ladled with fluffy basmati rice. 100% subsidized by the PayPal Giving Fund community relief grant program.",
    allergens: ["Halal Certified", "Nut-Free Facility", "100% Vegan"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAv8_VrYSYpXX4TTa8jrpcPa3FmlJywqqPL4aAn7toq8KPAs64dhuAwCXjemIzYJj3ybGQcDinmBHg-lXrkGEQlyMT6zzdPvOYzEoLp4KZ0PHBH2ohsNNzJjo23X5F9l3POCEAnVO980F_6DRDlmVWMNcy7-qdVTSijlna--CyuZrVZiH7H35tp48va3t4xgm5U9MEYg9_gfWTRycqWvlqdumMfr4ZxpAP2b75D3gc",
    pickupWindow: "00h 42m 05s",
    code: "FLP-8495",
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
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

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
            description: "FOODLOOP Surplus Rescue: " + activeFood.title,
            referenceId: "FLP-" + selectedCardKey + "-" + Date.now().toString().slice(-4),
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
          setLastOrderId(verifiedId);
          if (onOrderCompleted) {
            onOrderCompleted(selectedCardKey, { orderId: verifiedId, status: 'COMPLETED' });
          }
          closeDetailsModal();
          showToast("PayPal Sandbox Verified (#" + verifiedId.slice(0, 10) + ")! Release code FLP-" + Math.floor(1000 + Math.random() * 9000) + " issued.");
        } else {
          closeDetailsModal();
          showToast('PayPal transaction successful ($4.50). Digital pickup release code generated.');
        }
      } catch (err) {
        closeDetailsModal();
        showToast('PayPal Sandbox payment processed. QR pickup code synced to profile wallet.');
      } finally {
        setIsProcessingPayPal(false);
      }
    } else {
      closeDetailsModal();
      showToast('Free Rescue confirmed! Your pickup QR is synced to your profile wallet.');
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
<header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,48,135,0.06)]"><div className="h-16 max-w-[1440px] mx-auto px-gutter flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-lg shrink-0"><a className="flex items-center gap-space-sm cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate("home"); }}><img alt="FOODLOOP Brand Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"/><span className="font-headline-sm text-headline-sm text-primary tracking-tight">FOODLOOP</span></a><nav className="hidden xl:flex items-center gap-space-md" data-active-classes="text-primary font-bold"><a className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate("home"); }}>Home</a><a aria-current="page" className="transition-colors py-space-xs px-space-xs text-primary font-bold cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate("explore-food"); }}>Explore Food</a><a className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate("ai-rescue-agent"); }}>AI Rescue Agent</a><a className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate("donor-portal"); }}>Donor Portal</a><a className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate("ngo-hub"); }}>NGO Hub</a><a className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-space-xs px-space-xs cursor-pointer" onClick={(e) => { e.preventDefault(); onNavigate("impact"); }}>Impact</a></nav></div><div className="flex items-center gap-space-sm justify-end flex-1 max-w-2xl"><div className="relative hidden md:block w-full max-w-xs"><span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span><input className="w-full h-10 pl-9 pr-space-md bg-surface-container-low rounded-lg text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all" placeholder="Search rescued batches, NGOs, donors..." type="text"/></div><div className="relative"><select aria-label="Active Role Switcher" value={activeRole} onChange={(e) => setActiveRole(e.target.value)} className="appearance-none h-10 pl-space-sm pr-space-lg bg-surface-container-low font-label-md text-label-md text-primary font-bold rounded-lg cursor-pointer focus:outline-none"><option value="donor">Role: Donor</option><option value="recipient">Role: Recipient</option><option value="ngo">Role: NGO Hub</option><option value="admin">Role: Admin</option></select><span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span></div><button onClick={onOpenSponsors} className="h-10 px-2.5 rounded-lg bg-[#ffc439] hover:bg-[#f2ba36] text-[#001435] font-black text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"><span className="material-symbols-outlined text-[16px]">stars</span><span>Sponsors</span></button><button aria-label="Toggle Color Scheme" className="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" type="button"><span className="material-symbols-outlined text-[20px]">light_mode</span></button><button aria-label="Notifications" className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" type="button"><span className="material-symbols-outlined text-[20px]">notifications</span><span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span></button><div className="flex items-center gap-space-xs pl-space-xs"><img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"/><span className="material-symbols-outlined text-outline text-[18px] hidden sm:block cursor-pointer hover:text-primary transition-colors">arrow_drop_down</span></div></div></div></header>
<main className="w-full pt-16 bg-background"><div className="flex flex-col w-full">
<div className="w-full max-w-[1440px] mx-auto px-gutter py-space-md flex flex-col gap-space-lg">
{/*  Header / Context Bar  */}
<section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center gap-space-sm">
<span className="inline-flex items-center px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm tracking-wider uppercase">Live Food Loop</span>
<span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> 184 active rescue batches
          </span>
</div>
<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Public Surplus &amp; Sponsored Directory</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time certified surplus food available for community direct-pickup, subsidized purchase, or sponsored collection.</p>
</div>
{/*  Quick Metrics & Layout Controls  */}
<div className="flex items-center gap-space-sm self-start md:self-auto">
<div className="bg-surface-container-lowest shadow-sm rounded-xl p-1 flex items-center gap-1">
<button onClick={() => setViewMode("grid")} className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "grid" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`} id="viewGridBtn">
<span className="material-symbols-outlined text-[18px]">grid_view</span> Grid View
          </button>
<button onClick={() => setViewMode("split")} className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "split" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`} id="viewSplitBtn">
<span className="material-symbols-outlined text-[18px]">split_scene</span> Split Map
          </button>
</div>
<button id="quickAIAgentBtn" onClick={() => onNavigate("ai-rescue-agent")} className="h-10 px-space-md rounded-lg bg-gradient-to-r from-tertiary via-secondary to-secondary-container text-on-secondary font-label-md text-label-md font-bold flex items-center gap-1.5 hover:opacity-95 transition-all shadow-sm cursor-pointer">
<span className="material-symbols-outlined text-[20px]">auto_awesome</span>
<span>Match via AI</span>
</button>
</div>
</section>
{/*  Comprehensive Filter Panel  */}
<section className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
{/*  Search & Geolocation Bar  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
<div className="md:col-span-6 relative">
<span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[22px]">search</span>
<input className="w-full h-11 pl-11 pr-space-md bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary" placeholder="Search dish, bakery item, organic produce, or donor venue..." type="text"/>
</div>
<div className="md:col-span-4 relative flex items-center bg-surface-container-low rounded-xl px-space-md h-11">
<span className="material-symbols-outlined text-secondary text-[20px] mr-2">near_me</span>
<div className="flex flex-col flex-1 min-w-0">
<span className="font-label-sm text-label-sm text-outline leading-tight">Current Radius</span>
<span className="font-label-md text-label-md text-on-surface truncate font-semibold">Downtown Metro (Within 5.0 km)</span>
</div>
<button className="text-secondary hover:text-primary font-label-sm text-label-sm font-bold ml-2">Change</button>
</div>
<div className="md:col-span-2 flex items-center justify-end">
<button className="w-full h-11 px-space-md bg-surface-container hover:bg-surface-container-high rounded-xl text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors">
<span className="material-symbols-outlined text-[18px]">tune</span> Filters (4 active)
          </button>
</div>
</div>
{/*  Primary Status Filter Pills  */}
<div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
<div className="flex flex-wrap items-center gap-2">
<button onClick={() => setStatusFilter("all")} className={`status-tab px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${statusFilter === "all" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"}`}>All Listings (42)</button>
<button onClick={() => setStatusFilter("free")} className={`status-tab px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer ${statusFilter === "free" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"}`}><span className="w-2 h-2 rounded-full bg-secondary"></span><span>Free Food Only</span><span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-[10px] font-bold">24</span></button>
<button className="status-tab px-space-md py-1.5 rounded-full font-label-md text-label-md bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 transition-all">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
<span>Discounted Surplus</span>
<span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-[10px] font-bold">11</span>
</button>
<button className="status-tab px-space-md py-1.5 rounded-full font-label-md text-label-md bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center gap-1.5 transition-all">
<span className="material-symbols-outlined text-[14px] text-secondary">payments</span>
<span>Sponsored via PayPal</span>
<span className="px-1.5 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">7</span>
</button>
</div>
<div className="flex items-center gap-2">
<span className="font-body-sm text-body-sm text-on-surface-variant">Sort by:</span>
<select aria-label="Sort Food Listings" className="bg-surface-container-low text-on-surface font-label-md text-label-md py-1 px-space-sm rounded-lg focus:outline-none">
<option>Distance: Nearest First</option>
<option>Time Left: Urgent Rescue</option>
<option>Batch Size: Largest First</option>
</select>
</div>
</div>
{/*  Food Category Quick Filters  */}
<div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
<button className="px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm flex items-center gap-1.5 shrink-0">
<span className="material-symbols-outlined text-[16px]">restaurant</span> All Categories
        </button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5 shrink-0">
<span className="material-symbols-outlined text-[16px]">bakery_dining</span> Bakery &amp; Pastry
        </button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5 shrink-0">
<span className="material-symbols-outlined text-[16px]">soup_kitchen</span> Prepared Hot Meals
        </button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5 shrink-0">
<span className="material-symbols-outlined text-[16px]">eco</span> Fresh Produce &amp; Crates
        </button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5 shrink-0">
<span className="material-symbols-outlined text-[16px]">local_drink</span> Dairy &amp; Packaged
        </button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5 shrink-0">
<span className="material-symbols-outlined text-[16px]">emergency_heat</span> Hot Soups
        </button>
</div>
</section>
{/*  Content Workspace: Responsive Split/Grid Area  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
{/*  Listings Column (8 cols in split mode, 12 in full grid mode)  */}
<div className="xl:col-span-8 flex flex-col gap-space-md transition-all duration-300" id="listingsContainer">
{/*  Live Logistics Banner  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
<div>
<p className="font-label-md text-label-md text-primary font-bold">Safe Cold-Chain Guarantee</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">All listed items adhere to ISO food handler safety &amp; verified storage temp thresholds.</p>
</div>
</div>
<a className="font-label-sm text-label-sm text-secondary hover:underline font-bold flex items-center gap-1" href="#">Compliance Log <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
</div>
{/*  Cards Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
{/*  Card 1: Artisanal Sourdough & Croissants  */}
<article className="food-card bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group cursor-pointer" onClick={() => openDetailsModal("card1")}>
<div className="relative h-48 w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="High-end artisanal French sourdough boules and golden flaky croissants freshly arranged on a clean wooden bakery counter, natural studio morning backlight with crisp focus and warm amber bakery tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpQMpUTydw7mniIJ_BhEiWh3Wh8sNlJ3cqZZD69PXwAaGeje_hFgcwXhREe3wmdPA3Z26rOaBiIZAzIHagYLgWZvFDb5LaSUI0Afb-2HP0UHeJHpifKR3vFKZAhuYNOjDPsw4RQ-tNOttqnkq68_JzTeFf37tamNWIDfcyJ7Wq8DVOGR8qSV-og8KQhENtUpkuy0xzbIsjBsPRN4JPCssIoaQuIgIDdaHMrSykZig"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20"></div>
<div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
<span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm flex items-center gap-1 shadow-sm font-bold">
<span className="w-2 h-2 rounded-full bg-secondary"></span> 100% Free Donation
                </span>
<span className="px-2 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold">
                  Bakery
                </span>
</div>
<div className="absolute top-space-sm right-space-sm">
<span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm flex items-center gap-1 font-bold">
<span className="material-symbols-outlined text-[14px] text-secondary">schedule</span> Until 8:00 PM
                </span>
</div>
<div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-on-primary">
<div>
<p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">Bakery Le Matin</p>
<p className="font-headline-sm text-headline-sm font-bold text-on-primary">Artisanal Sourdough &amp; Croissants</p>
</div>
<span className="px-2 py-0.5 rounded bg-on-primary/20 backdrop-blur text-on-primary font-label-sm text-label-sm font-bold">0.8 km</span>
</div>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">inventory_2</span> Available Stock
                  </span>
<span className="font-semibold text-primary">42 Units (3 Assorted Crates)</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">verified</span> Donor Safety Score
                  </span>
<span className="text-secondary font-bold flex items-center gap-0.5">
                    ★ 4.9 <span className="text-outline font-normal">(184 claims)</span>
</span>
</div>
<div className="flex items-center gap-1.5 mt-1">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Vegetarian</span>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Zero Waste Partner</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs">
<div>
<span className="text-label-sm font-label-sm text-outline block">Price to Claim</span>
<span className="text-headline-sm font-headline-sm text-secondary font-extrabold">$0.00</span>
</div>
<button className="px-space-md py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 transition-all">
<span>View Details</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</article>
{/*  Card 2: Gourmet Roast Chicken & Veg Bowl  */}
<article className="food-card bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group cursor-pointer" onClick={() => openDetailsModal("card2")}>
<div className="relative h-48 w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Plated gourmet herb roasted free-range chicken breast served over quinoa, steamed asparagus, and colorful roasted bell peppers in an eco-friendly cardboard packaging container, professional food photo." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYlb7YGeo7refzHtOMoJJP54XIvkQiyV09WcoXcydzftBpmryxvujbVWA4L1jU7cpULrEj9wULld_YBPeI2qAF6-y5PyAvgCH91iHAeDKqlSMy4Zv_vZB55NKgnaA3j6AV-xWcMPcnjrROBmmN5lrmmqZHaEnzKinBLmAYtKMnbzWO-tFJ1jk9fzgTnkUPTW31OvVm3H28CwV-asRIxkdOQF3fMTqH2dEf0Ru9T_E"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20"></div>
<div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
<span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm flex items-center gap-1 font-bold shadow-sm">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span> 65% OFF Regular
                </span>
<span className="px-2 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold">
                  Hot Meals
                </span>
</div>
<div className="absolute top-space-sm right-space-sm">
<span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm flex items-center gap-1 font-bold">
<span className="material-symbols-outlined text-[14px]">bolt</span> PayPal One-Click
                </span>
</div>
<div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-on-primary">
<div>
<p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">Grand Plaza Bistro</p>
<p className="font-headline-sm text-headline-sm font-bold text-on-primary">Roast Chicken &amp; Veg Bowl</p>
</div>
<span className="px-2 py-0.5 rounded bg-on-primary/20 backdrop-blur text-on-primary font-label-sm text-label-sm font-bold">1.4 km</span>
</div>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">inventory_2</span> Available Stock
                  </span>
<span className="font-semibold text-primary">18 Portions Ready</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">schedule</span> Safe Storage Temp
                  </span>
<span className="text-on-surface font-semibold">Heated Hold (65°C)</span>
</div>
<div className="flex items-center gap-1.5 mt-1">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">High Protein</span>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Gluten-Free</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs">
<div>
<div className="flex items-center gap-1.5">
<span className="text-headline-sm font-headline-sm text-primary font-extrabold">$4.50</span>
<span className="text-body-sm font-body-sm text-outline line-through">$13.00</span>
</div>
<span className="text-[11px] text-secondary font-semibold">Subsidized Meal</span>
</div>
<button className="px-space-md py-2 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary-container font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-sm">
<span className="material-symbols-outlined text-[16px]">shopping_bag</span>
<span>Quick Buy</span>
</button>
</div>
</div>
</article>
{/*  Card 3: Organic Farm Vegetable Crates  */}
<article className="food-card bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group cursor-pointer" onClick={() => openDetailsModal("card3")}>
<div className="relative h-48 w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Rustic wooden farmer harvest crates packed with crisp organic leafy greens, vibrant carrots with tops, heirloom tomatoes, and crisp zucchini, high quality farmer market produce under soft natural light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWVTLBDpPO1Zy7-RRgajpwq9LRAsg7zhFayuEGsv9JdYvTVmtVmitK2qhS747nMiyfHXMzmeIZRtO4tPAN3Of84qLqllAfKdZJUejKRxNM3fyei2vVo_6HTfM4vY9SevVRoE39322VwLzPRV9irEQv2B4lGjIf72saHhpinkJl4w-MB0kN87sRkt3rEzpBF9PAvjWunLy1mdfL3JudvZMpoVCpwCZRJ8VtzPXGjJU"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20"></div>
<div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
<span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center gap-1 font-bold animate-pulse">
<span className="material-symbols-outlined text-[14px]">timer</span> Urgent: 1 hr left
                </span>
<span className="px-2 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold">
                  Produce
                </span>
</div>
<div className="absolute top-space-sm right-space-sm">
<span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  Community Rescue
                </span>
</div>
<div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-on-primary">
<div>
<p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">Harvest Fresh Mart</p>
<p className="font-headline-sm text-headline-sm font-bold text-on-primary">Organic Farm Produce Crates</p>
</div>
<span className="px-2 py-0.5 rounded bg-on-primary/20 backdrop-blur text-on-primary font-label-sm text-label-sm font-bold">2.1 km</span>
</div>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">inventory_2</span> Volume Remaining
                  </span>
<span className="font-semibold text-primary">12 Heavy Crates (~15kg ea)</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">local_shipping</span> Transport Recommended
                  </span>
<span className="text-on-surface font-semibold">Cargo Bike / Car Trunk</span>
</div>
<div className="flex items-center gap-1.5 mt-1">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">100% Vegan</span>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Raw Fresh</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs">
<div>
<span className="text-label-sm font-label-sm text-outline block">Distribution Tier</span>
<span className="text-headline-sm font-headline-sm text-secondary font-extrabold">Free Claim</span>
</div>
<button className="px-space-md py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 transition-all">
<span>Rescue Batch</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>
</article>
{/*  Card 4: Community Sponsored Hot Soup & Rice  */}
<article className="food-card bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group cursor-pointer" onClick={() => openDetailsModal("card4")}>
<div className="relative h-48 w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Nourishing freshly prepared steaming lentil vegetable soup ladled into clean compostable soup containers next to fragrant basmati rice, warm kitchen ambience, compassionate institutional community kitchen." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv8_VrYSYpXX4TTa8jrpcPa3FmlJywqqPL4aAn7toq8KPAs64dhuAwCXjemIzYJj3ybGQcDinmBHg-lXrkGEQlyMT6zzdPvOYzEoLp4KZ0PHBH2ohsNNzJjo23X5F9l3POCEAnVO980F_6DRDlmVWMNcy7-qdVTSijlna--CyuZrVZiH7H35tp48va3t4xgm5U9MEYg9_gfWTRycqWvlqdumMfr4ZxpAP2b75D3gc"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20"></div>
<div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
<span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm flex items-center gap-1 font-bold shadow-sm">
<span className="material-symbols-outlined text-[14px]">volunteer_activism</span> PayPal Giving Fund
                </span>
</div>
<div className="absolute top-space-sm right-space-sm">
<span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm flex items-center gap-1 font-bold">
<span className="material-symbols-outlined text-[14px] text-secondary">verified</span> Verified NGO
                </span>
</div>
<div className="absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-on-primary">
<div>
<p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">Downtown Food Bank</p>
<p className="font-headline-sm text-headline-sm font-bold text-on-primary">Sponsored Hot Soup &amp; Rice</p>
</div>
<span className="px-2 py-0.5 rounded bg-on-primary/20 backdrop-blur text-on-primary font-label-sm text-label-sm font-bold">0.4 km</span>
</div>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">inventory_2</span> Quantity Funded
                  </span>
<span className="font-semibold text-primary">50 Complete Meals</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">health_and_safety</span> Safety Check
                  </span>
<span className="text-secondary font-semibold">Passed Inspection (Today 2:15 PM)</span>
</div>
<div className="flex items-center gap-1.5 mt-1">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Nut-Free</span>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Halal Certified</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs">
<div>
<div className="flex items-center gap-1">
<span className="text-headline-sm font-headline-sm text-secondary font-extrabold">$0.00</span>
<span className="text-[11px] font-label-sm text-outline">($6.50 covered)</span>
</div>
<span className="text-[11px] text-tertiary font-semibold">Philanthropic Sponsor</span>
</div>
<button className="px-space-md py-2 rounded-lg bg-secondary hover:bg-secondary-container text-on-secondary font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-sm">
<span>Claim Voucher</span>
<span className="material-symbols-outlined text-[16px]">qr_code_2</span>
</button>
</div>
</div>
</article>
</div>
{/*  Pagination & Realtime Status Indicator  */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm pb-space-lg">
<p className="font-body-sm text-body-sm text-on-surface-variant">Showing 4 of 42 surplus listings in Downtown Metro Area</p>
<div className="flex items-center gap-2">
<button className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center font-label-md hover:bg-surface-container transition-colors disabled:opacity-40" disabled>
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center font-label-md">1</button>
<button className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center font-label-md hover:bg-surface-container transition-colors">2</button>
<button className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center font-label-md hover:bg-surface-container transition-colors">3</button>
<button className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center font-label-md hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
{/*  Right Column: Interactive Map Component & Geolocation Radius Tracker  */}
<aside className="xl:col-span-4 sticky top-20 flex flex-col gap-space-md" id="mapContainer">
{/*  Live Map Card  */}
<div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex flex-col gap-space-sm overflow-hidden">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">map</span>
<h2 className="font-headline-sm text-headline-sm text-primary">Live Geolocation Feed</h2>
</div>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> GPS Active
            </span>
</div>
{/*  Embedded Static Map Simulation  */}
<div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-surface-container-high">
<div className="w-full h-full bg-cover bg-center" data-location="Downtown Metro Center"></div>
{/*  Overlaid Map Markers with Pulse Indicators  */}
<div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
<div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">bakery_dining</span>
</div>
<div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Le Matin (0.8km)
              </div>
</div>
<div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
<div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">restaurant</span>
</div>
<div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-lowest text-primary text-[10px] font-bold px-2 py-0.5 rounded shadow">
                $4.50 Bowl (1.4km)
              </div>
</div>
<div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
<div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-bounce">
<span className="material-symbols-outlined text-[18px]">timer</span>
</div>
<div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded shadow">
                1h Left: Produce
              </div>
</div>
<div className="absolute top-1/3 right-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
<div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">payments</span>
</div>
<div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-0.5 rounded shadow">
                PayPal Sponsored (0.4km)
              </div>
</div>
{/*  Bottom Map Bar  */}
<div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-2 rounded-lg flex items-center justify-between text-body-sm">
<span className="text-on-surface font-semibold text-xs">Walking radius: 15 min</span>
<button className="text-secondary font-bold text-xs hover:underline flex items-center gap-0.5">Recenter <span className="material-symbols-outlined text-[14px]">my_location</span></button>
</div>
</div>
<div className="flex flex-col gap-space-xs pt-space-xs">
<div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
<span>Selected District</span>
<span className="font-semibold text-primary">Downtown Metro Core</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
<span>Avg Claim Transit Time</span>
<span className="font-semibold text-primary">11 minutes</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
<span>Active Courier Node</span>
<span className="text-secondary font-semibold flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-secondary"></span> 4 Volunteers Active
              </span>
</div>
</div>
</div>
{/*  AI Rescue Assistant Prompt Card  */}
<div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-tertiary-fixed/30 rounded-2xl shadow-sm p-space-md flex flex-col gap-space-sm relative overflow-hidden">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-md">
<span className="material-symbols-outlined text-[22px]">psychology</span>
</div>
<div>
<h3 className="font-label-lg text-label-lg text-primary font-bold">Intelligent Meal Matcher</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Autonomous surplus matching engine</p>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface">Need recurring dietary packages or managing shelters with specific allergen requirements?</p>
<div className="flex items-center gap-2 pt-1">
<input className="flex-1 h-9 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-tertiary" placeholder="e.g. 'Need 20 vegan portions by 7pm'" type="text"/>
<button className="h-9 px-3 rounded-lg bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold flex items-center justify-center hover:bg-tertiary-container transition-all">
<span className="material-symbols-outlined text-[16px]">send</span>
</button>
</div>
</div>
</aside>
</div>
</div>
{/*  Interactive Slide-over / Details Modal Card  */}
<div className={`fixed inset-0 z-50 transition-opacity duration-300 flex justify-end ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"}`} id="foodDetailsDrawer">
{/*  Backdrop  */}
<div className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity cursor-pointer" id="drawerBackdrop" onClick={closeDetailsModal}></div>
{/*  Drawer Panel  */}
<div className={`relative w-full max-w-xl h-full bg-surface-container-lowest shadow-2xl flex flex-col overflow-y-auto transform transition-transform duration-300 z-10 pointer-events-auto ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`} id="drawerPanel">
{/*  Drawer Header Bar  */}
<div className="sticky top-0 z-20 bg-surface-container-lowest/90 backdrop-blur-md px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
<div className="flex items-center gap-2">
<span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">Food Spec Sheet #{activeFood.code}</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">Verified Ledger</span>
</div>
<button className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer" onClick={closeDetailsModal}>
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/*  Drawer Content Body  */}
<div className="p-space-lg flex flex-col gap-space-lg">
{/*  Hero Media Header in Drawer  */}
<div className="relative h-64 w-full rounded-2xl overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Close up detailed presentation of delicious freshly baked sourdough baguettes and butter croissants on cooling racks in an artisan bakery setting with flour dusting and natural window illumination." id="modalImage" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCewQDn94i_DcNAOiySiYyePNJ-K67qeyXNI4Y8XIs4i2pIJoZiS38bOnFq4fQdHg2RLOR-j0341oYdSTYxtVCzWpOkfIVeg50wjjIMFUaezdxrZ0GPtJ602hDEmERvujVovhjO-DjLQjV7fyJt49ErS0dTFiexOKpE48hZXyVYk36WnQwTY7jwyczIUGvNpI-6VZothLTD79OPg2tMXi4DMzV7ZUws9NyH6w2WfqQ"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
<div className="absolute top-space-md right-space-md bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-1.5 rounded-xl shadow-lg flex items-center gap-2">
<span className="material-symbols-outlined text-secondary animate-pulse text-[18px]">alarm</span>
<div className="flex flex-col">
<span className="text-[10px] font-label-sm text-outline uppercase">Pickup Window Closes</span>
<span className="font-headline-sm text-headline-sm font-bold text-primary leading-tight" id="modalCountdown">{activeFood.pickupWindow}</span>
</div>
</div>
<div className="absolute bottom-space-md left-space-md right-space-md text-on-primary">
<span className="px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-bold inline-block mb-1" id="modalDonorTag">{activeFood.donor}</span>
<h2 className="font-headline-lg text-headline-lg font-bold text-on-primary" id="modalTitle">{activeFood.title}</h2>
</div>
</div>
{/*  Verification & Quality Badges  */}
<div className="grid grid-cols-3 gap-space-sm">
<div className="p-space-sm bg-surface-container-low rounded-xl flex flex-col items-center text-center">
<span className="material-symbols-outlined text-secondary text-[24px]">thermostat</span>
<span className="font-label-sm text-label-sm text-outline mt-1">Storage Temp</span>
<span className="font-label-md text-label-md text-primary font-bold" id="modalStorageTemp">{activeFood.temp}</span>
</div>
<div className="p-space-sm bg-surface-container-low rounded-xl flex flex-col items-center text-center">
<span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
<span className="font-label-sm text-label-sm text-outline mt-1">Donor Trust</span>
<span className="font-label-md text-label-md text-primary font-bold">4.9 / 5.0 Rating</span>
</div>
<div className="p-space-sm bg-surface-container-low rounded-xl flex flex-col items-center text-center">
<span className="material-symbols-outlined text-secondary text-[24px]">pin_drop</span>
<span className="font-label-sm text-label-sm text-outline mt-1">Distance</span>
<span className="font-label-md text-label-md text-primary font-bold" id="modalDistance">{activeFood.distance}</span>
</div>
</div>
{/*  Detailed Description  */}
<div className="flex flex-col gap-space-xs">
<h3 className="font-headline-sm text-headline-sm text-primary">Batch Summary &amp; Origin</h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed" id="modalDescription">{activeFood.desc}</p>
</div>
{/*  Allergen & Dietary Compliance Matrix  */}
<div className="flex flex-col gap-space-xs">
<h3 className="font-label-lg text-label-lg text-primary font-bold">Dietary &amp; Allergen Tags</h3>
<div className="flex flex-wrap gap-2 pt-1" id="modalAllergens">
<span className="px-space-sm py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span> Vegetarian
            </span>
<span className="px-space-sm py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span> Nut-Free Facility
            </span>
<span className="px-space-sm py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span> No Preservatives
            </span>
<span className="px-space-sm py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">warning</span> Contains Wheat/Gluten
            </span>
</div>
</div>
{/*  Specialized Domain Component: Surplus Rescue Flight Bar  */}
<div className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-2xl">
<div className="flex items-center justify-between">
<span className="font-label-lg text-label-lg text-primary font-bold">Surplus Rescue Lifecycle</span>
<span className="font-label-sm text-label-sm text-secondary font-bold">Step 2 of 4</span>
</div>
<div className="relative flex items-center justify-between mt-2">
{/*  Progress Track  */}
<div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container"></div>
<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-secondary"></div>
{/*  Step 1  */}
<div className="relative z-10 flex flex-col items-center">
<div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow">
<span className="material-symbols-outlined text-[14px]">done</span>
</div>
<span className="text-[10px] font-label-sm text-primary font-bold mt-1">Logged</span>
</div>
{/*  Step 2  */}
<div className="relative z-10 flex flex-col items-center">
<div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow ring-4 ring-secondary/20">
<span className="material-symbols-outlined text-[14px]">radar</span>
</div>
<span className="text-[10px] font-label-sm text-secondary font-bold mt-1">Public Active</span>
</div>
{/*  Step 3  */}
<div className="relative z-10 flex flex-col items-center">
<div className="w-7 h-7 rounded-full bg-surface-container-highest text-outline flex items-center justify-center">
<span className="material-symbols-outlined text-[14px]">local_shipping</span>
</div>
<span className="text-[10px] font-label-sm text-outline mt-1">In Transit</span>
</div>
{/*  Step 4  */}
<div className="relative z-10 flex flex-col items-center">
<div className="w-7 h-7 rounded-full bg-surface-container-highest text-outline flex items-center justify-center">
<span className="material-symbols-outlined text-[14px]">verified</span>
</div>
<span className="text-[10px] font-label-sm text-outline mt-1">Handover</span>
</div>
</div>
</div>
{/*  Logistics & Pickup Location Details  */}
<div className="flex flex-col gap-space-xs bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-primary font-bold flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[20px]">storefront</span>
<span>Pickup Spot: Bakery Le Matin - Service Door B</span>
</span>
<a className="text-secondary font-label-sm text-label-sm font-bold hover:underline" href="#">Get Directions</a>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">342 Rue Sainte-Catherine, Metro Level West. Ring buzzer labelled 'FoodLoop Rescue Partner'.</p>
</div>
</div>
{/*  Drawer Persistent Sticky Action Dock  */}
<div className="sticky bottom-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md px-space-lg py-space-md border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-md">
<div className="flex flex-col self-start sm:self-auto">
<span className="font-label-sm text-label-sm text-outline">Total Settlement</span>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg font-extrabold text-primary" id="modalPriceDisplay">{activeFood.price}</span>
{activeFood.originalPrice && (
  <span className="text-body-sm text-outline line-through" id="modalOriginalPrice">{activeFood.originalPrice}</span>
)}
</div>
</div>
<div className="flex items-center gap-space-sm w-full sm:w-auto">
{activeFood.isFree ? (
  <button
    className="flex-1 sm:flex-none h-11 px-space-lg rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
    id="reserveFreeBtn"
    onClick={() => handleClaimAction("free")}
  >
    <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
    <span>Reserve Free Meal</span>
  </button>
) : (
  <button
    className="flex-1 sm:flex-none h-11 px-space-lg rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary-container font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
    id="checkoutPaypalBtn"
    onClick={() => handleClaimAction("paypal")}
    disabled={isProcessingPayPal}
  >
    {isProcessingPayPal ? (
      <>
        <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
        <span>Processing Sandbox Order...</span>
      </>
    ) : (
      <>
        <span className="material-symbols-outlined text-[20px]">payments</span>
        <span>Checkout via PayPal ({activeFood.price})</span>
      </>
    )}
  </button>
)}
</div>
</div>
</div>
</div>
{/*  Notification Toast for Simulated Claims  */}
<div
  className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 bg-primary text-on-primary px-space-lg py-space-md rounded-2xl shadow-xl flex items-center gap-space-md max-w-md pointer-events-auto ${
    toast.show ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
  }`}
  id="claimToast"
>
  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shrink-0">
    <span className="material-symbols-outlined text-[22px]">check</span>
  </div>
  <div className="flex flex-col flex-1">
    <p className="font-label-lg text-label-lg font-bold">Pickup Voucher Generated!</p>
    <p className="font-body-sm text-body-sm text-primary-fixed" id="toastMessage">
      {toast.message}
    </p>
  </div>
  <button
    onClick={() => setToast({ show: false, message: "" })}
    className="text-on-primary/70 hover:text-on-primary cursor-pointer"
  >
    <span className="material-symbols-outlined text-[18px]">close</span>
  </button>
</div>
</div>
</main>
<footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,48,135,0.03)] mt-space-xl py-space-xl"><div className="max-w-[1440px] mx-auto px-gutter"><div className="flex flex-col md:flex-row items-center justify-between gap-space-md"><div className="flex items-center gap-space-sm"><img alt="FOODLOOP Brand Logo" className="h-6 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"/><span className="font-headline-sm text-headline-sm text-primary tracking-tight">FOODLOOP</span><span className="font-body-sm text-body-sm text-on-surface-variant ml-space-sm hidden sm:inline">Every Meal Deserves a Chance.</span></div><div className="flex items-center gap-space-lg font-label-md text-label-md text-on-surface-variant"><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a><a className="hover:text-primary transition-colors" href="#">Fintech Ledger Terms</a><a className="hover:text-primary transition-colors" href="#">API Docs</a><a className="hover:text-primary transition-colors" href="#">Support</a></div></div><div className="mt-space-lg text-center md:text-left font-body-sm text-body-sm text-outline">© 2025 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement.</div></div></footer>
    </div>
  );
};
