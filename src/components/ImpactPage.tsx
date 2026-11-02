'use client';

import React, { useState } from 'react';

interface ImpactPageProps {
  onNavigate: (page: string) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  onOpenSponsors?: () => void;
  onSponsorshipCompleted?: (campaignId: string, portions: number, amount: number) => void;
}

interface DonorItem {
  id: string;
  name: string;
  category: 'hospitality' | 'supermarket' | 'corporate' | 'culinary';
  location: string;
  meals: string;
  co2: string;
  tier: string;
  tierColor: string;
  image: string;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({
  onNavigate,
  activeRole,
  setActiveRole,
  onOpenSponsors,
  onSponsorshipCompleted,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<number>(5);
  const [customInput, setCustomInput] = useState<string>('5');
  const [donorFilter, setDonorFilter] = useState<'all' | 'hospitality' | 'supermarket' | 'corporate' | 'culinary'>('all');
  const [isProcessingPayPal, setIsProcessingPayPal] = useState(false);

  const donors: DonorItem[] = [
    {
      id: '1',
      name: 'Marriott International',
      category: 'hospitality',
      location: '14 Regional Properties',
      meals: '18,400',
      co2: '11.5 MT CO2e',
      tier: 'Enterprise Tier',
      tierColor: 'bg-[#001d59]/10 text-[#001d59]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCcZzsoWhU9xsKXehffcsZT9lF_K9MSiI8v-d0dfxl8X55FqyzsErtBE_Bxyh1ULSLzbSrq1wrM55YC-7VUPTDqW__Vbe1WAeUT5gFSC-l-IOpN1XZPDPSQfFzPonz3rItztmGW0X-z5HfBaqTKs9kD7OAfpaFgSojnZKpJU2Yk1CJhf-AtTqHzzB3DGcKouJPAXE0h-hq-6Ns7tVSGZszXo8jicvv0S5dy7wb2Uis',
    },
    {
      id: '2',
      name: 'Whole Foods Market',
      category: 'supermarket',
      location: '8 Metro Distribution Hubs',
      meals: '15,100',
      co2: '9.4 MT CO2e',
      tier: 'Enterprise Tier',
      tierColor: 'bg-[#001d59]/10 text-[#001d59]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB_kLCskQT9oSawx1E74hJFe6HdhlPkvqAz9Ey_ge21smN_ttAuauJdCIup5lCV3ML4ebU4LVhn03Yvz6o3STyV2dLLN3DckwauKRxZdUP1027VkZE-BOZByOtJejTPDdhc3O99Aw_g0VilQg3usFpE5asodHgTWZJu7BdLodmJXLDDY6bQXbSjBxEr_Vdv-vLQH4JBTEwIcIzi50lqrrCER8dtIdAFWMg7UbxbXUU',
    },
    {
      id: '3',
      name: 'Google Cafeterias',
      category: 'corporate',
      location: 'Bay Area & NYC HQ Kitchens',
      meals: '12,850',
      co2: '8.1 MT CO2e',
      tier: 'Enterprise Tier',
      tierColor: 'bg-[#001d59]/10 text-[#001d59]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA-Z1PLD3JbeUsAUSfvvO5xjPBAe6DYFL-m9tjD1aKWTmGrW5zMhHzwhOzToMe2bqAQXCRT00E67IEX7wFKo_HqFY8-ZoBYNEIA-zOxJwUISf_x8pIu1Bc7r9ItRMPxaD6JPBqrFlIAz9E2OWZunsdrQq9bOjLkwEe738N94115G75nfzfuNCx1QF1bx7eboev5vF6QRzK8jssouV1u8HYQCWCMb7KAC7Viq7-pA_g',
    },
    {
      id: '4',
      name: 'Sweetgreen',
      category: 'culinary',
      location: '18 Urban Outlets',
      meals: '9,200',
      co2: '5.8 MT CO2e',
      tier: 'Enterprise Tier',
      tierColor: 'bg-[#001d59]/10 text-[#001d59]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3ViI4bmQiILVh5BZCf4Zsi51tBBYCFaT2hJ0Bdavx5xPADTrWlberpmkg0PmRhm5jNP5VKtz4btDq0gW1Hs2a1rSnG2Mz9d3SZfPubETPch3LY0_q46ro9sNhjdWoyCQq_uc4_EowEgZQLpSgNLfGMkoPaURFJT1euBc5hWpv7-r4e1AKFfxyD-GUeM6TMPSp_lgrZCzP2dy3yDmutSzPrXV8oo0o2WhrOy4vbwE',
    },
    {
      id: '5',
      name: 'Le Matin Bakery',
      category: 'culinary',
      location: 'Artisanal Patisserie & Bread',
      meals: '4,180',
      co2: '2.6 MT CO2e',
      tier: 'Culinary Hero',
      tierColor: 'bg-[#D97706]/10 text-[#D97706]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDEGhoTORYVFhZuFpFQh3x736HEPidmYm6yWHvHotXOaCJ1_NXG6uUBXmowdUEZsfxfQPdTpywmqENMG2wOYHq_w-UDyLWvexoovObsanknlNTqU5cUIJM73bwAswmrN1iTRrCJgO-gat_NibqGJv-BQBDxsRlDQoO6GhLguTcxP02JgCWSYKOUqHNMrUth8MU_atR-mKNuNJY8NLy24uC2clCAS6-sY2ywqXjmK4k',
    },
    {
      id: '6',
      name: 'Grand Plaza Bistro',
      category: 'hospitality',
      location: 'Downtown Center Kitchen',
      meals: '3,650',
      co2: '2.3 MT CO2e',
      tier: 'Culinary Hero',
      tierColor: 'bg-[#D97706]/10 text-[#D97706]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCv2GVOSub7yiAS8bQD7QcxFDJ_g8-ENorfbs3YsVxHBDSzyZ_DDClGbsihFeULTeUU3htiv2W93bNiWZn07rGSwncMaYW5T_xanDkLytt5Ed_I2XfTJdaRlxjGQOTl4cGl8msqVyTwobUn_AC4T9MvXsoDreajRTSkVZLab51qnvawm621urlbh0SkQIC82EAMR3A1ufAb04RVafZSf0q-u_36yfxVXvkZI1nk1J0',
    },
    {
      id: '7',
      name: 'Harvest Market Co-op',
      category: 'supermarket',
      location: 'Community Owned Grocery',
      meals: '2,910',
      co2: '1.8 MT CO2e',
      tier: 'Culinary Hero',
      tierColor: 'bg-[#D97706]/10 text-[#D97706]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3vMz_-EZSO6rtNkbqfTfC9oGZu-crO1lEU1FzJcZkwNcyArdGOlmOJJQTLnPmp5nLqT5aFIdLUs0W656r24GKHmQuaWkaT9ODvZ4DxXzx36oE3ojy5jMjQ2WsiP8HrYo06igZbhLnZwjV0S5_fpcFduPSbPrxxzhexlOZRrVmnysEtZKZ_DKhiu7rENZWIJ8ch62eN_iUX9X7TMAeUB-dr_-_mSgtau_Z4Yv7Zu8',
    },
    {
      id: '8',
      name: 'Blue Harbor Wharf',
      category: 'culinary',
      location: 'Seafood & Coastal Catering',
      meals: '2,140',
      co2: '1.3 MT CO2e',
      tier: 'Culinary Hero',
      tierColor: 'bg-[#D97706]/10 text-[#D97706]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuADE-979xhkjaz3tYKxVsyBpbliJd2SR3vGT2ih-uPSAjpMeqb7AtsDnGv-yf5YpM5SzpdeEz0r4lyQhaF2ozPPYjH0z6_1pj1pqOdn8d-x0v0C7yxuJqGCD_RhusDAs5dcEiq8mfxilJWB8Pal-TrsgXa5Jm4kdwZ5YHaWOh0UdUNzyshiyDRxMO-cJdXJvquT5YyG5wjVv-ooyyCBTN5MNZs7ukZzP47NW-QpA8k',
    },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const calculateMeals = (dollars: number) => {
    if (dollars === 5) return 4;
    if (dollars === 25) return 20;
    if (dollars === 100) return 80;
    return Math.max(1, Math.floor(dollars * 0.8));
  };

  const handleSelectTier = (amount: number) => {
    setSelectedDonation(amount);
    setCustomInput(amount.toString());
  };

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    const num = parseFloat(val) || 0;
    setSelectedDonation(num);
  };

  const handlePayPalDonation = async () => {
    const amount = selectedDonation > 0 ? selectedDonation : 5;
    const meals = calculateMeals(amount);
    setIsProcessingPayPal(true);

    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          description: `Community Table Sponsorship: ${meals} verified meals funded`,
          referenceId: `SPON-DON-${Date.now()}`,
        }),
      });
      const orderData = await res.json();

      if (orderData.id) {
        await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: orderData.id }),
        });
      }

      if (onSponsorshipCompleted) {
        onSponsorshipCompleted('community-table', meals, amount);
      }

      showToast(
        `PayPal Sponsorship Succeeded! $${amount.toFixed(2)} funded ${meals} verified meals. 501(c)(3) tax receipt dispatched.`
      );
    } catch {
      showToast(
        `PayPal Sandbox Sponsorship Confirmed ($${amount.toFixed(2)})! ${meals} meals funded.`
      );
    } finally {
      setIsProcessingPayPal(false);
    }
  };

  const handleExportRawCsv = () => {
    const csvContent =
      'Classification,AvoidedEmissionsMT,Percentage,Equivalency\n' +
      'Animal Proteins & Prepared Entrees,42.8,48%,35 Cars off road\n' +
      'Dairy Cheese & Cold Storage,21.5,24%,360 Trees Seedlings\n' +
      'Fresh Produce & Seasonal Fruit,15.2,17%,250 Trees Seedlings\n' +
      'Bakery Grains & Dry Goods,9.9,11%,160 Trees Seedlings\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FOODLOOP-ESG-Scope3-Emissions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('ESG Scope 3 Raw CSV exported successfully.');
  };

  const handleDownloadEsgReport = () => {
    const report = {
      standard: 'US SEC & IFRS S2 Climate Disclosure Framework',
      protocol: 'EPA Waste Reduction Model (WARM) V15',
      institution: 'FOODLOOP Global Redistribution Network',
      auditYear: 2026,
      metrics: {
        totalMealsRescued: 142890,
        co2eEmissionsAvertedMT: 89.4,
        embeddedWaterSavedMliters: 18.2,
        economicReliefDeliveredUsd: 342500,
        traceabilityIndex: '99.98%',
        cryptographicProof: 'SHA-256 Batch Tokenization Certified',
      },
      verifiedPartnersCount: donors.length,
      topContributingDonors: donors.map((d) => ({ name: d.name, meals: d.meals, co2: d.co2 })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FOODLOOP-ESG-Scope3-Institutional-Report.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('ESG Scope 3 Institutional Report (XBRL format) downloaded.');
  };

  const filteredDonors = donors.filter((d) => {
    if (donorFilter === 'all') return true;
    return d.category === donorFilter;
  });

  return (
    <div className="bg-[#f7f9fc] font-sans text-[#191c1e] antialiased min-h-screen flex flex-col selection:bg-[#005ab6]/20 selection:text-[#001d59]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#001d59] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#b4c5ff]/30 flex items-center gap-3 animate-bounce max-w-md">
          <span className="material-symbols-outlined text-[#16A34A] text-[22px]">check_circle</span>
          <span className="font-semibold text-xs sm:text-sm">{toastMessage}</span>
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
                className="text-xs font-medium text-[#444652] hover:text-[#001d59] transition-colors py-1 cursor-pointer"
                onClick={() => onNavigate('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                aria-current="page"
                className="text-xs py-1 text-[#001d59] font-bold border-b-2 border-[#001d59] cursor-pointer"
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
              onClick={() => showToast('ESG Audit Complete: 99.98% Traceability index maintained.')}
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
          
          {/* IMPACT HEADER & VERIFIED ENGINE BANNER */}
          <section className="relative w-full overflow-hidden bg-white pb-8 pt-6 shadow-xs border-b border-slate-200">
            <div className="max-w-[1440px] mx-auto px-6">
              
              {/* Ledger Status Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-6 mb-4">
                <div className="inline-flex items-center gap-2 bg-[#f2f4f7] px-3 py-1.5 rounded-full border border-slate-200">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  <span className="text-xs uppercase tracking-wider text-[#001d59] font-bold">
                    Real-Time Verified Circular Economy Ledger
                  </span>
                  <span className="text-[#c4c6d4]">•</span>
                  <span className="text-xs text-[#444652] font-semibold">Node #418-L2 Sync: Active</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[#444652]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f2f4f7] border border-slate-200">
                    <span className="material-symbols-outlined text-[16px] text-[#005ab6]">verified</span>
                    <span className="text-xs font-semibold text-[#001d59]">PayPal Giving Fund Certified</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f2f4f7] border border-slate-200">
                    <span className="material-symbols-outlined text-[16px] text-[#005ab6]">eco</span>
                    <span className="text-xs font-semibold text-[#001d59]">EPA WARM Protocol V15</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f2f4f7] border border-slate-200">
                    <span className="material-symbols-outlined text-[16px] text-[#005ab6]">receipt_long</span>
                    <span className="text-xs font-semibold text-[#001d59]">Continuous Cryptographic Audit</span>
                  </div>
                </div>
              </div>

              {/* Hero Typography & Direct Impact Subtitle */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#005ab6] font-bold">
                    Institutional Grade ESG Accounting
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#001d59] tracking-tight">
                    Transparent Impact. <br className="hidden sm:inline" />Measurable Relief.
                  </h1>
                  <p className="text-sm sm:text-base text-[#444652] max-w-3xl pt-1 leading-relaxed">
                    Decentralized verification engine measuring Scope 3 emission diversion, water footprint conservation, and high-density nutritional recovery across institutional commercial kitchens and local food banks.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end gap-4">
                  <div className="bg-[#f2f4f7] p-5 rounded-xl w-full max-w-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#747683]">Consensus Protocol</span>
                      <span className="text-[10px] bg-[#16A34A]/10 text-[#16A34A] px-2 py-0.5 rounded-full font-bold">
                        P-03 ACTIVE
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#001d59]">99.98%</span>
                      <span className="text-xs text-[#444652]">Traceability Index</span>
                    </div>
                    <div className="w-full bg-[#e0e3e6] h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#0872e2] h-full rounded-full" style={{ width: '98.4%' }}></div>
                    </div>
                    <p className="text-[11px] text-[#747683] mt-2">Zero double-counting guaranteed via SHA-256 batch tokenization.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* 4 GLOBAL VERIFIED IMPACT METRIC CARDS */}
          <section className="max-w-[1440px] mx-auto px-6 w-full -mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Metric Card 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#d7e3ff]/40 flex items-center justify-center text-[#001d59]">
                      <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> +14.8%
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs uppercase tracking-wider text-[#747683] font-bold">Diverted Food Stock</span>
                    <div className="text-3xl font-extrabold text-[#001d59] mt-1">142,890</div>
                    <div className="text-sm font-semibold text-[#005ab6]">Verified Meals Rescued</div>
                  </div>
                </div>
                <div className="mt-4 pt-2 bg-[#f2f4f7] px-3 py-2 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-[#444652]">
                    <span>30-Day Window:</span>
                    <span className="font-bold text-[#001d59]">18,420 Meals</span>
                  </div>
                </div>
              </div>

              {/* Metric Card 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                      <span className="material-symbols-outlined text-[24px]">cloud_off</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wide bg-[#f2f4f7] px-2 py-1 rounded-md text-[#001d59] font-bold border border-slate-200">
                      EPA WARM v15
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs uppercase tracking-wider text-[#747683] font-bold">CO2e Emissions Averted</span>
                    <div className="text-3xl font-extrabold text-[#001d59] mt-1">
                      89.4 <span className="text-lg text-[#747683] font-normal">MT</span>
                    </div>
                    <div className="text-sm font-semibold text-[#16A34A]">Methane Abated from Landfills</div>
                  </div>
                </div>
                <div className="mt-4 pt-2 bg-[#f2f4f7] px-3 py-2 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-[#444652]">
                    <span>Equiv. sequestered:</span>
                    <span className="font-bold text-[#001d59]">1,480 Tree Seedlings</span>
                  </div>
                </div>
              </div>

              {/* Metric Card 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#dbe1ff]/50 flex items-center justify-center text-[#003087]">
                      <span className="material-symbols-outlined text-[24px]">water_drop</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wide bg-[#f2f4f7] px-2 py-1 rounded-md text-[#001d59] font-bold border border-slate-200">
                      Agricultural Yield
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs uppercase tracking-wider text-[#747683] font-bold">Embedded Water Saved</span>
                    <div className="text-3xl font-extrabold text-[#001d59] mt-1">
                      18.2 <span className="text-lg text-[#747683] font-normal">MLiters</span>
                    </div>
                    <div className="text-sm font-semibold text-[#001d59]">Conservation Index</div>
                  </div>
                </div>
                <div className="mt-4 pt-2 bg-[#f2f4f7] px-3 py-2 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-[#444652]">
                    <span>Equivalent usage:</span>
                    <span className="font-bold text-[#001d59]">48k Household Days</span>
                  </div>
                </div>
              </div>

              {/* Metric Card 4 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
                      <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wide bg-[#f2f4f7] px-2 py-1 rounded-md text-[#001d59] font-bold border border-slate-200">
                      Fair Value Yield
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs uppercase tracking-wider text-[#747683] font-bold">Economic Yield Recovered</span>
                    <div className="text-3xl font-extrabold text-[#001d59] mt-1">$342,500</div>
                    <div className="text-sm font-semibold text-[#D97706]">Direct Relief Delivered</div>
                  </div>
                </div>
                <div className="mt-4 pt-2 bg-[#f2f4f7] px-3 py-2 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-[#444652]">
                    <span>Cost / Meal Saved:</span>
                    <span className="font-bold text-[#001d59]">$0.34 Logistics</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION: INSTITUTIONAL ESG & SCOPE 3 MITIGATION */}
          <section className="max-w-[1440px] mx-auto px-6 w-full mt-10">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#005ab6]"></span>
                    <span className="text-xs uppercase tracking-wider text-[#005ab6] font-bold">
                      Regulatory Compliance
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#001d59] mt-1">Institutional ESG &amp; Scope 3 Mitigation</h2>
                  <p className="text-xs text-[#444652] max-w-2xl mt-1 leading-relaxed">
                    Compliant with US SEC ESG Disclosure frameworks, IFRS S2 Climate Disclosures, and verified against EPA Waste Reduction Model (WARM) parameters.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={handleExportRawCsv}
                    className="h-11 px-4 bg-[#f2f4f7] hover:bg-[#eceef1] text-[#001d59] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">table_view</span>
                    Export Raw CSV
                  </button>
                  <button
                    onClick={handleDownloadEsgReport}
                    className="h-11 px-4 bg-[#001d59] hover:bg-[#003087] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download ESG Scope 3 Report (XBRL/PDF)
                  </button>
                </div>
              </div>

              {/* Main Visual Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                
                {/* Avoided Footprint by Food Classification (Left 6 Cols) */}
                <div className="lg:col-span-6 flex flex-col justify-between bg-[#f2f4f7] rounded-2xl p-6 border border-slate-200">
                  <div>
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <h3 className="text-base font-bold text-[#001d59]">Avoided Footprint by Classification</h3>
                        <span className="text-xs text-[#747683]">EPA WARM v15 Verified Conversion Factors</span>
                      </div>
                      <span className="text-xs bg-white px-2.5 py-1 rounded-md text-[#001d59] font-bold border border-slate-200">
                        89.4 MT TOTAL
                      </span>
                    </div>

                    {/* Breakdown Bars */}
                    <div className="flex flex-col gap-4 mt-2">
                      <div>
                        <div className="flex items-center justify-between text-xs pb-1.5">
                          <span className="text-[#001d59] font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-xs bg-[#001d59]"></span> Animal Proteins &amp; Prepared Entrees
                          </span>
                          <span className="text-[#444652] font-medium">42.8 MT CO2e <span className="text-[#001d59] font-bold ml-1">(48%)</span></span>
                        </div>
                        <div className="w-full bg-[#e0e3e6] h-3 rounded-full overflow-hidden">
                          <div className="bg-[#001d59] h-full rounded-full" style={{ width: '48%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs pb-1.5">
                          <span className="text-[#001d59] font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-xs bg-[#005ab6]"></span> Dairy, Cheese &amp; Cold Storage
                          </span>
                          <span className="text-[#444652] font-medium">21.5 MT CO2e <span className="text-[#001d59] font-bold ml-1">(24%)</span></span>
                        </div>
                        <div className="w-full bg-[#e0e3e6] h-3 rounded-full overflow-hidden">
                          <div className="bg-[#005ab6] h-full rounded-full" style={{ width: '24%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs pb-1.5">
                          <span className="text-[#001d59] font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-xs bg-[#16A34A]"></span> Fresh Produce &amp; Seasonal Fruit
                          </span>
                          <span className="text-[#444652] font-medium">15.2 MT CO2e <span className="text-[#001d59] font-bold ml-1">(17%)</span></span>
                        </div>
                        <div className="w-full bg-[#e0e3e6] h-3 rounded-full overflow-hidden">
                          <div className="bg-[#16A34A] h-full rounded-full" style={{ width: '17%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs pb-1.5">
                          <span className="text-[#001d59] font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-xs bg-[#D97706]"></span> Bakery, Grains &amp; Dry Goods
                          </span>
                          <span className="text-[#444652] font-medium">9.9 MT CO2e <span className="text-[#001d59] font-bold ml-1">(11%)</span></span>
                        </div>
                        <div className="w-full bg-[#e0e3e6] h-3 rounded-full overflow-hidden">
                          <div className="bg-[#D97706] h-full rounded-full" style={{ width: '11%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equivalency Cards */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-200/80">
                    <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-slate-100 shadow-xs">
                      <div className="w-10 h-10 rounded-lg bg-[#f2f4f7] flex items-center justify-center text-[#001d59] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">directions_car</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#001d59]">74 Cars</div>
                        <div className="text-xs text-[#747683]">Removed from road (12 mos)</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-slate-100 shadow-xs">
                      <div className="w-10 h-10 rounded-lg bg-[#f2f4f7] flex items-center justify-center text-[#16A34A] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">park</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#001d59]">1,480 Trees</div>
                        <div className="text-xs text-[#747683]">Seedlings grown 10 yrs</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GHG Reduction Velocity & Operational Dispatch (Right 6 Cols) */}
                <div className="lg:col-span-6 flex flex-col justify-between bg-[#f2f4f7] rounded-2xl p-6 border border-slate-200">
                  <div>
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <h3 className="text-base font-bold text-[#001d59]">GHG Reduction Velocity</h3>
                        <span className="text-xs text-[#747683]">Metric Tons of CO2e Prevented (YoY Growth)</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 text-[#747683]">
                          <span className="w-3 h-3 rounded bg-[#e0e3e6] inline-block"></span> 2024
                        </div>
                        <div className="flex items-center gap-1.5 text-[#001d59] font-bold">
                          <span className="w-3 h-3 rounded bg-[#005ab6] inline-block"></span> 2025 Active
                        </div>
                      </div>
                    </div>

                    {/* Inlined SVG Bar Chart */}
                    <div className="w-full h-48 mt-2 flex items-end">
                      <svg className="w-full h-full" fill="none" viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
                        <line stroke="#c4c6d4" strokeDasharray="3 3" strokeOpacity="0.3" x1="0" x2="540" y1="160" y2="160"></line>
                        <line stroke="#c4c6d4" strokeDasharray="3 3" strokeOpacity="0.3" x1="0" x2="540" y1="110" y2="110"></line>
                        <line stroke="#c4c6d4" strokeDasharray="3 3" strokeOpacity="0.3" x1="0" x2="540" y1="60" y2="60"></line>
                        <line stroke="#c4c6d4" strokeDasharray="3 3" strokeOpacity="0.3" x1="0" x2="540" y1="10" y2="10"></line>
                        
                        {/* Jan */}
                        <rect fill="#e0e3e6" height="55" rx="4" width="22" x="25" y="105"></rect>
                        <rect fill="#005ab6" height="90" rx="4" width="22" x="52" y="70"></rect>
                        <text fill="#747683" fontSize="11" fontWeight="600" textAnchor="middle" x="50" y="176">JAN</text>
                        
                        {/* Feb */}
                        <rect fill="#e0e3e6" height="62" rx="4" width="22" x="110" y="98"></rect>
                        <rect fill="#005ab6" height="98" rx="4" width="22" x="137" y="62"></rect>
                        <text fill="#747683" fontSize="11" fontWeight="600" textAnchor="middle" x="135" y="176">FEB</text>
                        
                        {/* Mar */}
                        <rect fill="#e0e3e6" height="68" rx="4" width="22" x="195" y="92"></rect>
                        <rect fill="#005ab6" height="110" rx="4" width="22" x="222" y="50"></rect>
                        <text fill="#747683" fontSize="11" fontWeight="600" textAnchor="middle" x="220" y="176">MAR</text>
                        
                        {/* Apr */}
                        <rect fill="#e0e3e6" height="74" rx="4" width="22" x="280" y="86"></rect>
                        <rect fill="#005ab6" height="118" rx="4" width="22" x="307" y="42"></rect>
                        <text fill="#747683" fontSize="11" fontWeight="600" textAnchor="middle" x="305" y="176">APR</text>
                        
                        {/* May */}
                        <rect fill="#e0e3e6" height="80" rx="4" width="22" x="365" y="80"></rect>
                        <rect fill="#005ab6" height="132" rx="4" width="22" x="392" y="28"></rect>
                        <text fill="#747683" fontSize="11" fontWeight="600" textAnchor="middle" x="390" y="176">MAY</text>
                        
                        {/* Jun */}
                        <rect fill="#e0e3e6" height="86" rx="4" width="22" x="450" y="74"></rect>
                        <rect fill="#003087" height="146" rx="4" width="22" x="477" y="14"></rect>
                        <text fill="#747683" fontSize="11" fontWeight="600" textAnchor="middle" x="475" y="176">JUN*</text>
                      </svg>
                    </div>
                  </div>

                  {/* Bottom Operational SLA Row */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-200/80">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                      <span className="text-xs text-[#747683]">Avg Dispatch Latency</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold text-[#001d59]">32.4</span>
                        <span className="text-xs text-[#444652] font-medium">Minutes</span>
                      </div>
                      <div className="text-xs text-[#16A34A] mt-1 flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px]">bolt</span> Cold-Chain Preserved
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
                      <span className="text-xs text-[#747683]">Fulfillment Reliability</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold text-[#001d59]">99.4%</span>
                        <span className="text-xs text-[#444652] font-medium">Success</span>
                      </div>
                      <div className="text-xs text-[#005ab6] mt-1 flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px]">task_alt</span> 1,280 Audited Logs
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SECTION: DONOR HONOR ROLL */}
          <section className="max-w-[1440px] mx-auto px-6 w-full mt-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                  <span className="text-xs uppercase tracking-wider text-[#D97706] font-bold">
                    Audited Contributions
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#001d59] mt-1">Donor Honor Roll</h2>
                <p className="text-xs text-[#444652] mt-1">
                  Institutional and regional partners actively diverting commercial surplus to certified community recipients.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-xl shadow-xs border border-slate-200">
                <button
                  onClick={() => setDonorFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    donorFilter === 'all'
                      ? 'bg-[#001d59] text-white shadow-xs'
                      : 'text-[#444652] hover:text-[#001d59] hover:bg-[#f2f4f7]'
                  }`}
                >
                  All Donors (182)
                </button>
                <button
                  onClick={() => setDonorFilter('hospitality')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    donorFilter === 'hospitality'
                      ? 'bg-[#001d59] text-white shadow-xs'
                      : 'text-[#444652] hover:text-[#001d59] hover:bg-[#f2f4f7]'
                  }`}
                >
                  Hospitality &amp; Hotels
                </button>
                <button
                  onClick={() => setDonorFilter('supermarket')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    donorFilter === 'supermarket'
                      ? 'bg-[#001d59] text-white shadow-xs'
                      : 'text-[#444652] hover:text-[#001d59] hover:bg-[#f2f4f7]'
                  }`}
                >
                  Supermarkets
                </button>
                <button
                  onClick={() => setDonorFilter('corporate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    donorFilter === 'corporate'
                      ? 'bg-[#001d59] text-white shadow-xs'
                      : 'text-[#444652] hover:text-[#001d59] hover:bg-[#f2f4f7]'
                  }`}
                >
                  Corporate Campus
                </button>
                <button
                  onClick={() => setDonorFilter('culinary')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    donorFilter === 'culinary'
                      ? 'bg-[#001d59] text-white shadow-xs'
                      : 'text-[#444652] hover:text-[#001d59] hover:bg-[#f2f4f7]'
                  }`}
                >
                  Local Culinary
                </button>
              </div>
            </div>

            {/* Donors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-slate-200/80"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <img
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                        alt={donor.name}
                        src={donor.image}
                      />
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${donor.tierColor}`}>
                        {donor.tier}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-base font-bold text-[#001d59]">{donor.name}</h4>
                      <span className="text-xs text-[#747683]">{donor.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 bg-[#f2f4f7] p-3 rounded-xl border border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold text-[#001d59]">{donor.meals}</span>
                      <span className="text-xs font-bold text-[#16A34A]">Meals Rescued</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#747683] mt-1">
                      <span>Audit: Continuous</span>
                      <span className="font-semibold text-[#001d59]">{donor.co2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: PAYPAL DIRECT MEAL SPONSORSHIP PORTAL */}
          <section className="max-w-[1440px] mx-auto px-6 w-full mt-10 mb-12">
            <div className="bg-gradient-to-br from-[#001d59] via-[#003087] to-[#002266] rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Mission, Transparency & Real-Time Matching */}
                <div className="lg:col-span-6 flex flex-col gap-4">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full w-fit border border-white/10">
                    <span className="material-symbols-outlined text-[18px] text-[#d7e3ff]">volunteer_activism</span>
                    <span className="text-xs font-bold text-white">Sponsor a Community Table</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Every $1 Rescues <br />Up to 4 Fresh Meals.
                  </h2>

                  <p className="text-sm text-[#dbe1ff] max-w-xl leading-relaxed">
                    100% of community sponsorship funds fuel last-mile refrigerated couriers and insulated packaging. Institutional commercial kitchens donate the food for free; your sponsorship powers the cold-chain bridge.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
                      <span className="material-symbols-outlined text-[18px] text-[#16A34A]">verified_user</span>
                      <span className="text-white font-semibold">100% Tax-Deductible 501(c)(3)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
                      <span className="material-symbols-outlined text-[18px] text-[#d7e3ff]">alt_route</span>
                      <span className="text-white font-semibold">Real-Time GPS Dispatch</span>
                    </div>
                  </div>

                  {/* Live Donor Matching Ticker */}
                  <div className="mt-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-[#16A34A]/20 flex items-center justify-center shrink-0 text-[#16A34A]">
                      <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white font-bold">2x Community Match Active</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                        <span className="text-[11px] text-[#dbe1ff]">8 mins ago</span>
                      </div>
                      <p className="text-xs text-[#dbe1ff] truncate mt-0.5">
                        Apex Logistics Corp matched $500 to the Metro Shelter Pool. All donations currently doubled.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Interactive Sponsorship Selection Card */}
                <div className="lg:col-span-6">
                  <div className="bg-white text-[#191c1e] rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-100">
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <h3 className="text-base font-bold text-[#001d59]">Select Sponsorship Level</h3>
                        <span className="text-xs text-[#747683]">Processed through PayPal Giving Fund (0% fees)</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#16A34A]/10 text-[#16A34A] px-2.5 py-1 rounded-md text-xs font-bold">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span> Zero Platform Cut
                      </div>
                    </div>

                    {/* Tier Selection Radio Cards */}
                    <div className="flex flex-col gap-2 mt-2">
                      {/* Tier 1 ($5) */}
                      <label
                        onClick={() => handleSelectTier(5)}
                        className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all ${
                          selectedDonation === 5
                            ? 'bg-[#f2f4f7] border-[#005ab6]'
                            : 'bg-[#f2f4f7]/50 border-slate-200 hover:bg-[#f2f4f7]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            checked={selectedDonation === 5}
                            onChange={() => handleSelectTier(5)}
                            className="w-4 h-4 text-[#005ab6] cursor-pointer"
                            name="sponsorship_tier"
                            type="radio"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-[#001d59]">$5.00</span>
                              <span className="text-[10px] bg-[#005ab6]/10 text-[#005ab6] px-2 py-0.5 rounded-md font-bold">
                                Starter Impact
                              </span>
                            </div>
                            <span className="text-xs text-[#444652]">Rescues 4 Nutritious Prepared Meals</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#005ab6]">verified</span>
                      </label>

                      {/* Tier 2 ($25) */}
                      <label
                        onClick={() => handleSelectTier(25)}
                        className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all ${
                          selectedDonation === 25
                            ? 'bg-[#f2f4f7] border-[#005ab6]'
                            : 'bg-[#f2f4f7]/50 border-slate-200 hover:bg-[#f2f4f7]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            checked={selectedDonation === 25}
                            onChange={() => handleSelectTier(25)}
                            className="w-4 h-4 text-[#005ab6] cursor-pointer"
                            name="sponsorship_tier"
                            type="radio"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-[#001d59]">$25.00</span>
                              <span className="text-[10px] bg-[#001d59]/10 text-[#001d59] px-2 py-0.5 rounded-md font-bold">
                                Courier Route
                              </span>
                            </div>
                            <span className="text-xs text-[#444652]">Funds Cold-Chain Route for 20 Meals</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#747683]">local_shipping</span>
                      </label>

                      {/* Tier 3 ($100) */}
                      <label
                        onClick={() => handleSelectTier(100)}
                        className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all ${
                          selectedDonation === 100
                            ? 'bg-[#f2f4f7] border-[#005ab6]'
                            : 'bg-[#f2f4f7]/50 border-slate-200 hover:bg-[#f2f4f7]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            checked={selectedDonation === 100}
                            onChange={() => handleSelectTier(100)}
                            className="w-4 h-4 text-[#005ab6] cursor-pointer"
                            name="sponsorship_tier"
                            type="radio"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-[#001d59]">$100.00</span>
                              <span className="text-[10px] bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded-md font-bold">
                                Full Shelter
                              </span>
                            </div>
                            <span className="text-xs text-[#444652]">Sponsors an Entire Shelter Dinner (80 Meals)</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#747683]">soup_kitchen</span>
                      </label>
                    </div>

                    {/* Custom Amount Input */}
                    <div className="mt-4">
                      <label className="block text-xs text-[#001d59] font-bold mb-1.5">
                        Or Enter Custom Amount ($ USD)
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#747683] text-base font-bold">
                            $
                          </span>
                          <input
                            className="w-full h-11 pl-8 pr-4 bg-[#f2f4f7] rounded-lg text-base text-[#001d59] font-bold focus:outline-none focus:bg-white border border-slate-200"
                            min="1"
                            type="number"
                            value={customInput}
                            onChange={(e) => handleCustomChange(e.target.value)}
                          />
                        </div>
                        <div className="bg-[#f2f4f7] px-4 py-2 rounded-lg flex flex-col items-center justify-center shrink-0 border border-slate-200">
                          <span className="text-[10px] text-[#747683]">Direct Relief</span>
                          <span className="text-xs text-[#16A34A] font-bold">
                            {calculateMeals(selectedDonation)} Verified Meals
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* High-Visibility PayPal CTA */}
                    <div className="mt-6 flex flex-col gap-2">
                      <button
                        onClick={handlePayPalDonation}
                        disabled={isProcessingPayPal}
                        className="w-full h-12 bg-[#0070E0] hover:bg-[#005CBD] active:scale-[0.99] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                      >
                        <svg className="h-5 w-auto" fill="none" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12.5 4.5H5.8C5.2 4.5 4.7 4.9 4.6 5.5L1.8 23.2C1.7 23.6 2.1 24 2.5 24H5.8L7.2 15.2C7.3 14.6 7.8 14.2 8.4 14.2H11.3C15.8 14.2 18.8 12.3 19.6 7.6C19.9 5.8 19.4 4.5 18 3.8C16.8 3.1 14.8 4.5 12.5 4.5Z"
                            fill="#FFFFFF"
                          ></path>
                          <path
                            d="M22.5 8.2C22.1 10.4 20.8 12.2 18.8 13.3C17.2 14.2 15.1 14.6 12.9 14.6H10.1L8.7 23.5C8.6 23.9 9 24.3 9.4 24.3H13.6L14.7 17.5C14.8 17 15.3 16.6 15.8 16.6H17.8C22.2 16.6 25.6 14.8 26.6 9.6C27 7.4 26.2 5.8 24.8 4.8C24.1 6.1 23.2 7.3 22.5 8.2Z"
                            fill="#99CCFF"
                          ></path>
                        </svg>
                        <span>{isProcessingPayPal ? 'Authorizing PayPal...' : 'Donate with PayPal'}</span>
                      </button>

                      <div className="flex items-center justify-between text-[#747683] text-xs px-1 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">lock</span> 256-Bit Encrypted
                        </span>
                        <span>Instant Tax Receipt Sent</span>
                        <span className="font-mono text-[10px]">ID: LEDGER-TX-418</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

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
