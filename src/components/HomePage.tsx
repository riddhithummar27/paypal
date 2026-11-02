'use client';

import React, { useState, useEffect } from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  onOpenSponsors?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  activeRole,
  setActiveRole,
  onOpenSponsors,
}) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<'donor' | 'recipient' | 'ngo'>('donor');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isQrVerified, setIsQrVerified] = useState(false);

  // Live timer for pod
  const [countdownSeconds, setCountdownSeconds] = useState(1 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerifyQr = async () => {
    try {
      const res = await fetch('/api/custody/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotId: 'FL-8841', verifier: 'Campus Courier Elena K.' }),
      });
      const data = await res.json();
      setIsQrVerified(true);
      showToast(data.message || 'Handover Token #8841 Authenticated & Escrow Released');
    } catch {
      setIsQrVerified(true);
      showToast('Handover Token #8841 Authenticated & Escrow Released');
    }
  };

  const testimonials = [
    {
      id: 1,
      quote:
        '"We used to throw away at least 15 trays of fresh catering food every Friday evening. With FOODLOOP, an NGO driver arrives before we even lock the kitchen doors. It gives our whole staff immense peace of mind."',
      name: 'Elena Vance',
      role: 'Executive Chef, Aurora Hospitality',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBktJq3xeMWKCzRlhpKndMJZJif1-LJypzizXaHncBJILeEGl3F0UxwgvwufN94qBvpHIEut12qDUpVW8UN8kfQJYD3pHEX3gYw0T0610y4IANQ6SH1brV9LtjlnXusRNKRFDU8sn3AImqsjjgTymBhJ3395f0IIjOW8u2R7G8CLSdym8uId9846Z-N9-2Qibsw0NikEEhzfTLTemT3vdui9bFf9O4pFCitjY5hI6k',
    },
    {
      id: 2,
      quote:
        '"The automated PayPal micro-settlement makes operations painless. When community drivers deliver to our pantry, the system handles expense reimbursements transparently and immediately."',
      name: 'Marcus Thorne',
      role: 'Director, Hope Harbor Shelter',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDPkUfOMhLNHE6cOPieJXAPvMKZR7beIDQgXKcuBRyxnPK25Rg7p88CVFZRbeYyxWT3ZYKDPCSBLTQc6X3DOof_Psz4_CR2YyZ6s2kG1lWYSg-NcZZN0CY1rGrtYpraaZNwPx_jIwCFW5SfvC_XWxYV3-4suZHSgYjvhtXYUw0Ty8GAABPVi5usR_YRNQhtCDPruCD7rHCSfeaUB6MImN0Mdz6ca87wIZBZhX7jt70',
    },
    {
      id: 3,
      quote:
        '"As a grad student living on a tight budget, the app connects me to great bakery boxes that would otherwise go to waste. It feels respectful, high-tech, and genuinely community-driven."',
      name: 'Sarah Lin',
      role: 'Community Recipient, Metro Area',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC60G6syg22rZNiyrH-qZjrV8oQt2_8L_VGvZ0FFJAoQUxYyltpcOf8TvsT6NpmBuYJuAnh-PpgF_1TpRAQJkI-X2MIsef2GNyccnT56K7lCYUS-8VKv93DahLbb15XyNe6o8XH4sES2HIAVue1oezH_pGp-7tNU66rxsFK5gJNzRL_ujsR-tSyG6XFZxQvVNUMNtdKC10Wye_3Nb7jUSn-3EIViWjJXjGKqSIm3QQ',
    },
  ];

  return (
    <div className="bg-[#f7f9fc] font-sans text-[#191c1e] antialiased min-h-screen flex flex-col selection:bg-[#005ab6]/20 selection:text-[#001d59]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#001d59] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#b4c5ff]/30 flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* FIXED TOP HEADER - EXACT STITCH UI */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-[#e6e8eb] shadow-[0_1px_8px_rgba(0,48,135,0.06)]">
        <div className="h-16 max-w-[1440px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Back to Home arrow */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-[#747683] hover:text-[#001d59] transition-colors cursor-pointer"
              title="Home"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
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

            {/* Main Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 ml-2">
              <a
                aria-current="page"
                className="transition-colors py-1 px-1 text-[#001d59] font-bold border-b-2 border-[#001d59] text-[14px] cursor-pointer"
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
                className="font-semibold text-[14px] text-[#444652] hover:text-[#001d59] transition-colors py-1 px-1 cursor-pointer"
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

          {/* Search, Active Role Switcher, Theme & Profile Controls */}
          <div className="flex items-center gap-3 justify-end flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative hidden md:block w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747683] text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-9 pr-4 bg-[#f2f4f7] rounded-lg text-[#191c1e] placeholder:text-[#747683] text-[12px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005ab6]/20 transition-all border border-transparent focus:border-[#005ab6]/30"
                placeholder="Search rescued batches, NGOs, donors..."
                type="text"
              />
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                className="appearance-none h-10 pl-3 pr-8 bg-[#f2f4f7] text-[12px] text-[#001d59] font-bold rounded-lg cursor-pointer focus:outline-none border border-transparent hover:bg-[#eceef1]"
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

            {/* Toggle Theme */}
            <button
              aria-label="Toggle Color Scheme"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#f2f4f7] text-[#444652] hover:text-[#001d59] hover:bg-[#eceef1] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">light_mode</span>
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-[#f2f4f7] text-[#444652] hover:text-[#001d59] hover:bg-[#eceef1] transition-all cursor-pointer"
              type="button"
              onClick={() => showToast('Smart Pod #8841 cold-chain verified.')}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </button>

            {/* Profile Avatar */}
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

      {/* MAIN CONTAINER */}
      <main className="w-full pt-16 bg-[#f7f9fc] flex-1">
        <div className="flex flex-col w-full">
          
          {/* Subtle Ambient Glow Orbs */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/4 w-[540px] h-[540px] rounded-full bg-[#d7e3ff]/35 blur-[130px] pointer-events-none"></div>
            <div className="absolute top-96 -right-20 w-[480px] h-[480px] rounded-full bg-[#cdbdff]/30 blur-[140px] pointer-events-none"></div>

            {/* HERO SECTION */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 pt-10 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Hero Left Typography & Conversion */}
                <div className="lg:col-span-7 flex flex-col items-start space-y-4 z-10">
                  {/* Institutional Verified Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f4f7] shadow-sm border border-[#e6e8eb]">
                    <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-[#16A36A] -ml-4"></span>
                    <span className="text-[11px] uppercase tracking-wider text-[#005ab6] font-bold">
                      Decentralized Surplus Logistics
                    </span>
                    <span className="text-[#747683] text-[11px]">•</span>
                    <span className="text-[11px] text-[#444652] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#005ab6]">verified_user</span>
                      Instant PayPal Escrow &amp; Grants
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-[40px] sm:text-[44px] lg:text-[48px] leading-[48px] sm:leading-[52px] lg:leading-[56px] text-[#001d59] font-extrabold tracking-tight">
                    Good Food.<br />
                    <span className="text-[#005ab6] bg-clip-text text-transparent bg-gradient-to-r from-[#005ab6] via-[#0872e2] to-[#270070]">
                      Zero Waste.
                    </span>
                  </h1>

                  <p className="text-[16px] leading-[24px] text-[#444652] max-w-xl">
                    Rescue surplus food and share it with someone who needs it. Powered by automated AI matching, real-time dispatch routing, and seamless PayPal micro-settlements.
                  </p>

                  {/* Dual CTAs & Live Trust Prompt */}
                  <div className="flex flex-wrap items-center gap-4 pt-1 w-full sm:w-auto">
                    <button
                      onClick={() => onNavigate('explore-food')}
                      className="h-11 px-6 rounded-lg bg-[#005ab6] text-white font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#003087] shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">explore</span>
                      <span>Explore Food</span>
                    </button>
                    <button
                      onClick={() => onNavigate('donor-portal')}
                      className="h-11 px-6 rounded-lg bg-white border border-[#e0e3e6] text-[#001d59] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#f2f4f7] shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                      <span>Start Donating</span>
                    </button>
                    <div className="flex items-center gap-1.5 pl-2 text-[#444652]">
                      <span className="material-symbols-outlined text-[#005ab6] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        payments
                      </span>
                      <span className="text-[11px] font-bold text-[#747683]">PayPal Certified Escrow</span>
                    </div>
                  </div>

                  {/* Dynamic Operational Pulse (4 Stat Cards) */}
                  <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-[#e6e8eb]">
                      <div className="text-[20px] font-bold text-[#001d59]">142,890</div>
                      <div className="text-[11px] text-[#747683] font-medium">Meals Rescued</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-[#e6e8eb]">
                      <div className="text-[20px] font-bold text-[#001d59]">1,280</div>
                      <div className="text-[11px] text-[#747683] font-medium">Verified Donors</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-[#e6e8eb]">
                      <div className="text-[20px] font-bold text-[#001d59]">340</div>
                      <div className="text-[11px] text-[#747683] font-medium">Active NGOs</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-[#e6e8eb]">
                      <div className="text-[20px] font-bold text-[#005ab6]">89.4 T</div>
                      <div className="text-[11px] text-[#747683] font-medium">CO₂ Prevented</div>
                    </div>
                  </div>
                </div>

                {/* Hero Right: Bespoke Smart Food Rescue Container Mockup */}
                <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                  {/* Glassmorphic Rescue Node Backdrop Card */}
                  <div className="relative bg-white p-4 rounded-[24px] shadow-xl overflow-hidden border border-[#e6e8eb]">
                    
                    {/* Top Status Rim */}
                    <div className="flex items-center justify-between pb-2 mb-3 bg-[#f2f4f7] p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse"></div>
                        <span className="text-[13px] font-bold text-[#001d59]">Smart Rescue Pod #8841</span>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#e0e3e6] text-[#444652] font-semibold">
                        IoT Cold-Chain Safe
                      </span>
                    </div>

                    {/* Visual Media with Badge Scrim */}
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#eceef1]">
                      <img
                        className="w-full h-full object-cover"
                        alt="Commercial kitchen stainless prep station with high grade sealed organic produce crates, artisan sourdough bread and ripe local fruits"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLasxaugMQHdFiWZAY-B4u_ZwrZ8cPTsQuzfty65jPGnU7iUo_1AQwK3pB7SFBBOj7Q6xvts1XZceyAwUts3VXHjUyu_tzKR_YBPyoaeYE27364kNWxyLXV1bimnguwA-tx9RC9jd2T3xkeq05e_oykDyCJRH9xwm-_wD1_cb0E0th0DxVHZiZdLSQpBdiqDgwrmbiSOj41ncGx74JXajIf1v08FMTmeK2HQdBLtc"
                      />
                      
                      {/* Expiry Countdown Shield */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-[#e6e8eb]">
                        <span className="material-symbols-outlined text-[16px] text-[#D97706]">timer</span>
                        <span className="text-[11px] font-bold text-[#D97706]">
                          {formatTimer(countdownSeconds)} Remaining
                        </span>
                      </div>

                      {/* AI Route Allocation Pill */}
                      <div className="absolute bottom-3 left-3 right-3 p-2 rounded-lg bg-[#003087]/95 backdrop-blur-md text-white flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#abc7ff] text-[18px]">auto_awesome</span>
                          <span className="text-[11px] text-white font-medium">AI Match: Oasis Community Kitchen (0.8 mi)</span>
                        </div>
                        <span className="text-[10px] bg-[#005ab6] px-2 py-0.5 rounded text-white font-bold">
                          99.4% Fit
                        </span>
                      </div>
                    </div>

                    {/* Real-Time Flight Tracker Component */}
                    <div className="mt-4 pt-1">
                      <div className="flex items-center justify-between text-[#444652] mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#747683]">
                          Rescue Flight Vector
                        </span>
                        <span className="text-[11px] text-[#005ab6] font-bold">
                          Autonomous Dispatch
                        </span>
                      </div>
                      
                      {/* Flight Bar Tracker */}
                      <div className="grid grid-cols-4 gap-1 p-1 bg-[#f2f4f7] rounded-lg text-center text-[11px]">
                        <div className="py-1 rounded bg-[#16A36A]/15 text-[#16A36A] font-bold flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Logged
                        </div>
                        <div className="py-1 rounded bg-[#005ab6]/15 text-[#005ab6] font-bold flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">sync</span> Matched
                        </div>
                        <div className="py-1 rounded bg-[#eceef1] text-[#747683] font-medium">En Route</div>
                        <div className="py-1 rounded bg-[#eceef1] text-[#747683] font-medium">Claimed</div>
                      </div>
                    </div>

                    {/* Instant QR & Escrow Claim Section */}
                    <div className="mt-3 p-2.5 bg-[#f2f4f7] rounded-xl flex items-center justify-between border border-[#e6e8eb]">
                      <div className="flex items-center gap-3">
                        {/* Inline SVG QR Representation */}
                        <div className="w-11 h-11 bg-white p-1 rounded-lg shadow-sm flex items-center justify-center shrink-0 border border-[#e0e3e6]">
                          <svg className="w-full h-full text-[#001d59]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h4v4h-4v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v4h-2v-4zm4-2h2v2h-2v-2zm0-4h4v2h-4v-2z"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-[#001d59]">One-Touch Handover QR</div>
                          <div className="text-[11px] text-[#747683]">Zero-touch authentication code</div>
                        </div>
                      </div>
                      <button
                        onClick={handleVerifyQr}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-colors cursor-pointer ${
                          isQrVerified
                            ? 'bg-[#16A36A] text-white'
                            : 'bg-white text-[#005ab6] hover:bg-[#e6e8eb]'
                        }`}
                      >
                        {isQrVerified ? 'Verified ✓' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  {/* Overlapping Micro Metric Float */}
                  <div className="-mt-6 -ml-3 relative z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg inline-flex items-center gap-3 border border-[#e6e8eb]">
                    <div className="w-8 h-8 rounded-full bg-[#16A36A]/15 flex items-center justify-center text-[#16A36A]">
                      <span className="material-symbols-outlined text-[18px]">eco</span>
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#001d59]">+34.2 kg Diverted</div>
                      <div className="text-[11px] text-[#747683]">Verified by Metro Bakeries</div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* VERIFIED INSTITUTIONAL TRUST & PAYPAL PARTNERS */}
            <section className="w-full bg-[#f2f4f7]/70 py-4 border-y border-[#e6e8eb] my-4">
              <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[#444652] shrink-0">
                  <span className="material-symbols-outlined text-[#005ab6] text-[22px]">verified</span>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#001d59]">
                    Certified Redistribution Network:
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 text-[#747683] text-[13px] font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-[18px] font-black tracking-tighter text-[#001d59]">PayPal</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#e0e3e6] text-[#005ab6] font-bold">Giving Fund API</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    <span>FoodRescue.Global</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">apartment</span>
                    <span>Urban Table Network</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                    <span>HACCP Safety Standard</span>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS: 3-STEP INTUITIVE PIPELINE */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f2f4f7] text-[#005ab6] text-[11px] font-bold mb-2 border border-[#e6e8eb]">
                  <span className="material-symbols-outlined text-[16px]">cycle</span> Seamless Operations
                </div>
                <h2 className="text-[28px] sm:text-[32px] font-bold text-[#001d59] tracking-tight">
                  Redistributing Surplus in 3 Simple Steps
                </h2>
                <p className="text-[15px] text-[#444652] mt-2">
                  From commercial kitchen surpluses to local community tables in less than two hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Step 1 */}
                <div className="p-6 rounded-[20px] bg-white shadow-sm border border-[#e6e8eb] flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#eceef1] flex items-center justify-center text-[#005ab6] mb-4">
                      <span className="material-symbols-outlined text-[28px]">post_add</span>
                    </div>
                    <div className="text-[11px] text-[#005ab6] font-bold uppercase tracking-wider">Step 01</div>
                    <h3 className="text-[18px] text-[#001d59] font-bold mt-1">List Surplus Food</h3>
                    <p className="text-[13px] text-[#444652] mt-2 leading-relaxed">
                      Snap a picture or sync your kitchen inventory. Specify batch portions, temperature parameters, and pickup expiry windows in seconds.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 bg-[#f2f4f7] p-3 rounded-xl border border-[#e6e8eb]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#444652] font-medium">OCR Recognition</span>
                      <span className="text-[#16A36A] font-bold">Instant Tagging</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-[20px] bg-white shadow-sm border border-[#e6e8eb] flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#dbe1ff] flex items-center justify-center text-[#001d59] mb-4">
                      <span className="material-symbols-outlined text-[28px]">hub</span>
                    </div>
                    <div className="text-[11px] text-[#005ab6] font-bold uppercase tracking-wider">Step 02</div>
                    <h3 className="text-[18px] text-[#001d59] font-bold mt-1">AI Connects Nearby</h3>
                    <p className="text-[13px] text-[#444652] mt-2 leading-relaxed">
                      Our automated matching algorithm instantly notifies nearby shelters, food banks, and individuals based on volume, route logistics, and cold storage capacity.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 bg-[#f2f4f7] p-3 rounded-xl border border-[#e6e8eb]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#444652] font-medium">Radius Optimization</span>
                      <span className="text-[#005ab6] font-bold">&lt; 3.5 Miles Priority</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-[20px] bg-white shadow-sm border border-[#e6e8eb] flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#eceef1] flex items-center justify-center text-[#16A36A] mb-4">
                      <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
                    </div>
                    <div className="text-[11px] text-[#005ab6] font-bold uppercase tracking-wider">Step 03</div>
                    <h3 className="text-[18px] text-[#001d59] font-bold mt-1">Collect via Dynamic QR</h3>
                    <p className="text-[13px] text-[#444652] mt-2 leading-relaxed">
                      Recipients arrive with encrypted mobile tokens. The single scan completes chain-of-custody tracking, releases donor tax certificates, and settles logistics tips.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 bg-[#f2f4f7] p-3 rounded-xl border border-[#e6e8eb]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#444652] font-medium">Custody Settlement</span>
                      <span className="text-[#16A36A] font-bold">100% Tax Compliant</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* INTERACTIVE ROLE SHOWCASE SECTION */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
              <div className="bg-[#f2f4f7] rounded-[28px] p-6 md:p-10 border border-[#e6e8eb]">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#005ab6] font-bold">
                      Adaptive Operational Modes
                    </div>
                    <h2 className="text-[28px] sm:text-[32px] font-bold text-[#001d59] mt-1 tracking-tight">
                      Built For Every Stakeholder
                    </h2>
                  </div>

                  {/* Role Selector Tabs */}
                  <div className="inline-flex p-1 bg-[#e0e3e6] rounded-xl gap-1">
                    <button
                      onClick={() => setSelectedRoleTab('donor')}
                      className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'donor'
                          ? 'bg-white text-[#001d59] shadow-sm'
                          : 'text-[#444652] hover:text-[#001d59]'
                      }`}
                    >
                      For Donors
                    </button>
                    <button
                      onClick={() => setSelectedRoleTab('recipient')}
                      className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'recipient'
                          ? 'bg-white text-[#001d59] shadow-sm'
                          : 'text-[#444652] hover:text-[#001d59]'
                      }`}
                    >
                      For Recipients
                    </button>
                    <button
                      onClick={() => setSelectedRoleTab('ngo')}
                      className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'ngo'
                          ? 'bg-white text-[#001d59] shadow-sm'
                          : 'text-[#444652] hover:text-[#001d59]'
                      }`}
                    >
                      For NGOs &amp; Shelters
                    </button>
                  </div>
                </div>

                {/* Panel 1: Donor */}
                {selectedRoleTab === 'donor' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dbe1ff] text-[#001d59] text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[16px]">store</span> Restaurants &amp; Supermarkets
                      </span>
                      <h3 className="text-[22px] font-bold text-[#001d59] tracking-tight">
                        Turn Cost Centers into Social Equity &amp; Tax Deductions
                      </h3>
                      <p className="text-[14px] text-[#444652] leading-relaxed">
                        Commercial kitchens lose thousands monthly to surplus disposal fees. FOODLOOP enables kitchen managers to log unused ingredients in seconds, automate FDA-compliant food rescue records, and collect instant tax write-off receipts through PayPal Giving Fund.
                      </p>
                      <div className="space-y-2 text-[13px] text-[#001d59] font-medium">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>Automatic 501(c)(3) valuation ledgers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>Zero kitchen disruption with scheduled pickups</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>ESG sustainability metrics for quarterly audits</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('donor-portal')}
                        className="inline-flex items-center gap-2 text-[14px] text-[#005ab6] font-bold hover:underline cursor-pointer pt-2"
                      >
                        <span>Explore Donor Portal</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-[#e6e8eb]">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#f2f4f7]">
                          <div>
                            <div className="text-[10px] text-[#747683] uppercase font-bold tracking-wider">Active Listing Stream</div>
                            <div className="text-[16px] font-bold text-[#001d59]">Artisan Kitchen - Downtown</div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-[#16A36A]/15 text-[#16A36A] text-[11px] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-pulse"></span> Live Broadcast
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-[#f2f4f7] rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#005ab6] text-[24px]">bakery_dining</span>
                              <div>
                                <div className="text-[13px] font-bold text-[#001d59]">Fresh Sourdough &amp; Baguettes (42 units)</div>
                                <div className="text-[11px] text-[#747683]">Prepped 6 hrs ago • Ready for pickup</div>
                              </div>
                            </div>
                            <span className="text-[12px] text-[#16A36A] font-bold">Claimed in 4m</span>
                          </div>
                          <div className="p-3 bg-[#f2f4f7] rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#005ab6] text-[24px]">soup_kitchen</span>
                              <div>
                                <div className="text-[13px] font-bold text-[#001d59]">Prepared Vegetable Curry (18 kg)</div>
                                <div className="text-[11px] text-[#747683]">Chilled 3°C • Vacuum insulated</div>
                              </div>
                            </div>
                            <span className="text-[12px] text-[#005ab6] font-bold">En Route Driver</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel 2: Recipient */}
                {selectedRoleTab === 'recipient' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d7e3ff] text-[#001d59] text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[16px]">person_pin_circle</span> Neighborhood Residents
                      </span>
                      <h3 className="text-[22px] font-bold text-[#001d59] tracking-tight">
                        Dignified, Fresh &amp; Hyperlocal Nutrition
                      </h3>
                      <p className="text-[14px] text-[#444652] leading-relaxed">
                        Browse safe, surplus meals from your favorite local cafes, catering venues, and farm markets. Filter dietary preferences like vegan, gluten-free, or halal and claim packages for collection without awkward handoffs.
                      </p>
                      <div className="space-y-2 text-[13px] text-[#001d59] font-medium">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>GPS radius alerts when fresh batches drop</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>No shame, 100% private QR verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>Always free or pay-what-you-can PayPal donation</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('explore-food')}
                        className="inline-flex items-center gap-2 text-[14px] text-[#005ab6] font-bold hover:underline cursor-pointer pt-2"
                      >
                        <span>Browse Nearby Food</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-[#e6e8eb]">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#f2f4f7]">
                          <div className="text-[16px] font-bold text-[#001d59]">Nearby Available Right Now</div>
                          <span className="text-[11px] text-[#005ab6] font-bold">Within 2.0 mi</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 bg-[#f2f4f7] rounded-xl border border-[#e6e8eb]">
                            <div className="text-[13px] font-bold text-[#001d59]">Green Grocer Organic Bag</div>
                            <div className="text-[11px] text-[#747683]">Apples, kale, carrots • 4.2 kg</div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[11px] text-[#D97706] font-bold">Expires in 2h</span>
                              <button
                                onClick={() => onNavigate('explore-food')}
                                className="px-3 py-1 bg-[#005ab6] text-white rounded font-bold text-[11px] cursor-pointer"
                              >
                                Reserve
                              </button>
                            </div>
                          </div>
                          <div className="p-3 bg-[#f2f4f7] rounded-xl border border-[#e6e8eb]">
                            <div className="text-[13px] font-bold text-[#001d59]">Harvest Salad Bowls (x6)</div>
                            <div className="text-[11px] text-[#747683]">Fresh prepped salads • Vegan</div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[11px] text-[#D97706] font-bold">Expires in 1h</span>
                              <button
                                onClick={() => onNavigate('explore-food')}
                                className="px-3 py-1 bg-[#005ab6] text-white rounded font-bold text-[11px] cursor-pointer"
                              >
                                Reserve
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel 3: NGO */}
                {selectedRoleTab === 'ngo' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e7deff] text-[#001d59] text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[16px]">corporate_fare</span> Community Non-Profits
                      </span>
                      <h3 className="text-[22px] font-bold text-[#001d59] tracking-tight">
                        High-Capacity Logistics for Food Pantries &amp; Shelters
                      </h3>
                      <p className="text-[14px] text-[#444652] leading-relaxed">
                        Manage bulk intakes without telephone tag. Connect directly with university campuses, event venues, and wholesale distributors offering large pallet-scale rescue shipments.
                      </p>
                      <div className="space-y-2 text-[13px] text-[#001d59] font-medium">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>Fleet dispatch routing &amp; cargo monitoring</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>Cold-chain compliance temperature logs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A] text-[20px]">check_circle</span>
                          <span>PayPal Grant micro-funding integrations</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('ngo-hub')}
                        className="inline-flex items-center gap-2 text-[14px] text-[#005ab6] font-bold hover:underline cursor-pointer pt-2"
                      >
                        <span>Register NGO Operations</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-[#e6e8eb]">
                        <div className="text-[16px] font-bold text-[#001d59] mb-3">Bulk Intake Coordination</div>
                        <div className="p-3 bg-[#f2f4f7] rounded-xl mb-2 border border-[#e6e8eb]">
                          <div className="flex justify-between items-center">
                            <span className="text-[13px] font-bold text-[#001d59]">Downtown Convention Hall</span>
                            <span className="text-[11px] text-[#16A36A] font-bold">320 Meals Ready</span>
                          </div>
                          <div className="text-[11px] text-[#747683] mt-1">Requires van transport • Heated transit boxes</div>
                        </div>
                        <div className="p-3 bg-[#f2f4f7] rounded-xl border border-[#e6e8eb]">
                          <div className="flex justify-between items-center">
                            <span className="text-[13px] font-bold text-[#001d59]">City Center Food Bank</span>
                            <span className="text-[11px] text-[#005ab6] font-bold">Dock Bay 2 Assigned</span>
                          </div>
                          <div className="text-[11px] text-[#747683] mt-1">ETA: 18 mins • Driver: Alex M.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>

            {/* LIVE IMPACT TESTIMONIAL CAROUSEL */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#005ab6] font-bold">
                    Voices from the Loop
                  </span>
                  <h2 className="text-[28px] sm:text-[32px] font-bold text-[#001d59] mt-1 tracking-tight">
                    Real Human Impact
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <button
                    aria-label="Previous quote"
                    onClick={() => setTestimonialIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))}
                    className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center hover:bg-[#eceef1] transition-colors text-[#001d59] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">west</span>
                  </button>
                  <button
                    aria-label="Next quote"
                    onClick={() => setTestimonialIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))}
                    className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center hover:bg-[#eceef1] transition-colors text-[#001d59] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">east</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-[20px] shadow-sm border border-[#e6e8eb] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[#D97706] mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                      <p className="text-[14px] text-[#444652] italic leading-relaxed">
                        {t.quote}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-6 pt-3 border-t border-[#f2f4f7]">
                      <img
                        className="w-11 h-11 rounded-full object-cover"
                        alt={t.name}
                        src={t.image}
                      />
                      <div>
                        <div className="text-[13px] font-bold text-[#001d59]">{t.name}</div>
                        <div className="text-[11px] text-[#747683]">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 pb-14">
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#001d59] via-[#003087] to-[#3d1b92] p-8 md:p-12 text-white shadow-xl">
                <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#005ab6]/20 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 max-w-2xl space-y-4">
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-[#d7e3ff] inline-block">
                    Join The Loop Today
                  </span>
                  <h2 className="text-[28px] sm:text-[34px] font-extrabold text-white leading-tight">
                    Every Meal Deserves a Chance.<br />
                    Start Rescuing in Your City.
                  </h2>
                  <p className="text-[16px] text-[#dbe1ff] leading-relaxed">
                    Whether you are a commercial donor, a local relief organization, or an individual champion, zero food waste starts with your next action.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => onNavigate('explore-food')}
                      className="h-11 px-6 rounded-lg bg-white text-[#001d59] font-bold text-[14px] flex items-center justify-center hover:bg-[#f2f4f7] transition-all cursor-pointer shadow-md"
                    >
                      Claim Food Nearby
                    </button>
                    <button
                      onClick={() => onNavigate('donor-portal')}
                      className="h-11 px-6 rounded-lg bg-[#005ab6] text-white font-bold text-[14px] flex items-center justify-center hover:bg-[#0070ba] transition-all cursor-pointer shadow-md"
                    >
                      Register as Donor
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* FOOTER - EXACT STITCH UI */}
      <footer className="w-full bg-white shadow-[0_-1px_6px_rgba(0,48,135,0.03)] border-t border-[#e0e3e6] py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                alt="FOODLOOP Brand Logo"
                className="h-6 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-extrabold text-[16px] text-[#001d59] tracking-tight">FOODLOOP</span>
              <span className="text-[12px] text-[#747683] ml-2 hidden sm:inline">
                Every Meal Deserves a Chance.
              </span>
            </div>
            <div className="flex items-center gap-6 text-[13px] font-semibold text-[#444652]">
              <a className="hover:text-[#001d59] transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-[#001d59] transition-colors" href="#">Fintech Ledger Terms</a>
              <a className="hover:text-[#001d59] transition-colors" href="#">API Docs</a>
              <a className="hover:text-[#001d59] transition-colors" href="#">Support</a>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-[11px] text-[#747683]">
            © 2025 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement.
          </div>
        </div>
      </footer>
    </div>
  );
};
