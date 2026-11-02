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
    <div className="bg-[#071426] font-body-md text-[#d7e3fc] antialiased selection:bg-[#0070E0] selection:text-white min-h-screen flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0A1B30] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#0070E0] flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">verified</span>
          <span className="font-label-md text-label-md font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0A1B30]/90 backdrop-blur-xl border-b border-[#1A365D] shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
        <div className="h-16 max-w-[1440px] mx-auto px-gutter flex items-center justify-between gap-space-md">
          {/* Logo & Navigation */}
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
                className="h-8 w-auto object-contain brightness-110 drop-shadow-[0_0_8px_rgba(0,112,224,0.35)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-white font-extrabold tracking-tight">
                FOODLOOP
              </span>
            </a>
            <nav className="hidden xl:flex items-center gap-space-md">
              <a
                aria-current="page"
                className="transition-colors py-space-xs px-space-xs text-white font-bold relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0070E0] cursor-pointer"
                onClick={() => onNavigate('home')}
              >
                Home
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94A3B8] hover:text-white transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('explore-food')}
              >
                Explore Food
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94A3B8] hover:text-white transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('ai-rescue-agent')}
              >
                AI Rescue Agent
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94A3B8] hover:text-white transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('donor-portal')}
              >
                Donor Portal
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94A3B8] hover:text-white transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('ngo-hub')}
              >
                NGO Hub
              </a>
              <a
                className="font-label-lg text-label-lg text-[#94A3B8] hover:text-white transition-colors py-space-xs px-space-xs cursor-pointer"
                onClick={() => onNavigate('impact')}
              >
                Impact
              </a>
            </nav>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-space-sm justify-end flex-1 max-w-2xl">
            <div className="relative hidden md:block w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-[#64748B] text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-9 pr-space-md bg-[#0F223D] border border-[#1E3A66] rounded-lg text-white placeholder:text-[#64748B] font-body-sm text-body-sm focus:outline-none focus:border-[#0070E0] focus:ring-1 focus:ring-[#0070E0] transition-all"
                placeholder="Search rescued batches, NGOs, donors..."
                type="text"
              />
            </div>
            
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="appearance-none h-10 pl-space-sm pr-space-lg bg-[#0F223D] border border-[#1E3A66] font-label-md text-label-md text-white font-bold rounded-lg cursor-pointer focus:outline-none focus:border-[#0070E0]"
              >
                <option className="bg-[#0A1B30] text-white" value="donor">Role: Donor</option>
                <option className="bg-[#0A1B30] text-white" value="recipient">Role: Recipient</option>
                <option className="bg-[#0A1B30] text-white" value="ngo">Role: NGO Hub</option>
                <option className="bg-[#0A1B30] text-white" value="admin">Role: Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-[#64748B] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Hackathon Sponsors Modal Trigger */}
            <button
              aria-label="Open Hackathon Sponsors"
              onClick={onOpenSponsors}
              className="h-10 px-3 flex items-center justify-center rounded-lg bg-[#ffc439] hover:bg-[#f2ba36] text-[#001435] font-black text-xs transition-all shadow-md cursor-pointer"
              type="button"
            >
              Sponsors (5)
            </button>

            <button
              aria-label="Toggle Color Scheme"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#0F223D] border border-[#1E3A66] text-[#94A3B8] hover:text-white hover:border-[#0070E0] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-amber-400">dark_mode</span>
            </button>

            <button
              aria-label="Notifications"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-[#0F223D] border border-[#1E3A66] text-[#94A3B8] hover:text-white hover:border-[#0070E0] transition-all cursor-pointer"
              type="button"
              onClick={() => showToast('No new urgent dispatch alerts.')}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]"></span>
            </button>

            <div className="flex items-center gap-space-xs pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0070E0]/60 shadow-[0_0_10px_rgba(0,112,224,0.3)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"
              />
              <span className="material-symbols-outlined text-[#64748B] text-[18px] hidden sm:block cursor-pointer hover:text-white transition-colors">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN BODY CONTENT */}
      <main className="w-full pt-16 bg-[#071426] flex-1">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow Orbs */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/4 w-[540px] h-[540px] rounded-full bg-[#0070E0]/15 blur-[150px] pointer-events-none"></div>
            <div className="absolute top-96 -right-20 w-[480px] h-[480px] rounded-full bg-[#8065D8]/15 blur-[160px] pointer-events-none"></div>

            {/* HERO SECTION */}
            <section className="max-w-[1440px] mx-auto px-gutter pt-space-xl pb-space-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                {/* Hero Left Typography & Conversion */}
                <div className="lg:col-span-7 flex flex-col items-start space-y-space-md z-10">
                  {/* Institutional Verified Tag */}
                  <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-[#0F223D]/80 border border-[#1E3A66] shadow-[0_0_15px_rgba(22,163,106,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-[#16A36A] -ml-2.5 shadow-[0_0_8px_#16A36A]"></span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#38bdf8] font-bold">
                      Decentralized Surplus Logistics
                    </span>
                    <span className="text-[#64748B] font-label-sm">•</span>
                    <span className="font-label-sm text-label-sm text-[#94A3B8] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#0070E0]">verified_user</span>
                      Instant PayPal Escrow &amp; Grants
                    </span>
                  </div>

                  <h1 className="font-headline-xl text-headline-xl text-white font-extrabold tracking-tight">
                    Good Food.<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#38bdf8] via-[#0070E0] to-[#A78BFA] drop-shadow-[0_4px_12px_rgba(0,112,224,0.3)]">
                      Zero Waste.
                    </span>
                  </h1>

                  <p className="font-body-lg text-body-lg text-[#94A3B8] max-w-xl leading-relaxed">
                    Rescue surplus food and share it with someone who needs it. Powered by automated AI matching, real-time dispatch routing, and seamless PayPal micro-settlements.
                  </p>

                  {/* Dual CTAs & Live Trust Prompt */}
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
                    <button
                      onClick={() => onNavigate('explore-food')}
                      className="h-11 px-6 rounded-lg bg-[#0070E0] text-white font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-[#005bb8] shadow-[0_4px_16px_rgba(0,112,224,0.4)] transition-all duration-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">explore</span>
                      <span>Explore Food</span>
                    </button>
                    <button
                      onClick={() => onNavigate('donor-portal')}
                      className="h-11 px-6 rounded-lg bg-[#0F223D] text-white border border-[#1E3A66] hover:border-[#0070E0] font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-[#132A4A] shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#38bdf8]">volunteer_activism</span>
                      <span>Start Donating</span>
                    </button>
                    <div className="flex items-center gap-space-xs pl-2 text-[#94A3B8]">
                      <span className="material-symbols-outlined text-[#0070E0] text-[22px]">payments</span>
                      <span className="font-label-sm text-label-sm text-[#94A3B8]">PayPal Certified Escrow</span>
                    </div>
                  </div>

                  {/* Dynamic Operational Pulse */}
                  <div className="pt-space-md grid grid-cols-2 sm:grid-cols-4 gap-space-md w-full">
                    <div className="p-space-sm bg-[#10233D] border border-[#1E3A66] rounded-xl shadow-lg hover:border-[#0070E0]/60 transition-colors">
                      <div className="font-headline-sm text-headline-sm text-white font-bold">142,890</div>
                      <div className="font-label-sm text-label-sm text-[#64748B]">Meals Rescued</div>
                    </div>
                    <div className="p-space-sm bg-[#10233D] border border-[#1E3A66] rounded-xl shadow-lg hover:border-[#0070E0]/60 transition-colors">
                      <div className="font-headline-sm text-headline-sm text-white font-bold">1,280</div>
                      <div className="font-label-sm text-label-sm text-[#64748B]">Verified Donors</div>
                    </div>
                    <div className="p-space-sm bg-[#10233D] border border-[#1E3A66] rounded-xl shadow-lg hover:border-[#0070E0]/60 transition-colors">
                      <div className="font-headline-sm text-headline-sm text-white font-bold">340</div>
                      <div className="font-label-sm text-label-sm text-[#64748B]">Active NGOs</div>
                    </div>
                    <div className="p-space-sm bg-[#10233D] border border-[#1E3A66] rounded-xl shadow-lg hover:border-[#0070E0]/60 transition-colors">
                      <div className="font-headline-sm text-headline-sm text-[#38bdf8] font-bold">89.4 T</div>
                      <div className="font-label-sm text-label-sm text-[#64748B]">CO₂ Prevented</div>
                    </div>
                  </div>
                </div>

                {/* Hero Right: Bespoke Smart Food Rescue Container Mockup */}
                <div className="lg:col-span-5 relative mt-space-md lg:mt-0">
                  <div className="relative bg-[#10233D] border border-[#1E3A66] p-space-md rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Top Status Rim */}
                    <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-[#0A1B30] border border-[#1A365D] p-space-sm rounded-xl">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-3 h-3 rounded-full bg-[#16A36A] animate-pulse shadow-[0_0_8px_#16A36A]"></div>
                        <span className="font-label-md text-label-md text-white font-bold">Smart Rescue Pod #8841</span>
                      </div>
                      <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-[#132A4A] border border-[#1E3A66] text-[#94A3B8] font-medium">
                        IoT Cold-Chain Safe
                      </span>
                    </div>

                    {/* Visual Media with Badge Scrim */}
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#071426] border border-[#1E3A66]/60">
                      <img
                        className="w-full h-full object-cover brightness-90 contrast-105"
                        alt="Commercial kitchen prep station with sealed produce crates and sourdough"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLasxaugMQHdFiWZAY-B4u_ZwrZ8cPTsQuzfty65jPGnU7iUo_1AQwK3pB7SFBBOj7Q6xvts1XZceyAwUts3VXHjUyu_tzKR_YBPyoaeYE27364kNWxyLXV1bimnguwA-tx9RC9jd2T3xkeq05e_oykDyCJRH9xwm-_wD1_cb0E0th0DxVHZiZdLSQpBdiqDgwrmbiSOj41ncGx74JXajIf1v08FMTmeK2HQdBLtc"
                      />
                      {/* Expiry Countdown Shield */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A1B30]/90 border border-[#F5A623]/40 backdrop-blur-md shadow-lg">
                        <span className="material-symbols-outlined text-[16px] text-[#F5A623]">timer</span>
                        <span className="font-label-sm text-label-sm font-bold text-[#F5A623]">
                          {formatTimer(countdownSeconds)} Remaining
                        </span>
                      </div>
                      {/* AI Route Allocation Pill */}
                      <div className="absolute bottom-3 left-3 right-3 p-space-xs rounded-lg bg-[#0A1B30]/90 border border-[#1E3A66] backdrop-blur-md text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">auto_awesome</span>
                          <span className="font-label-sm text-label-sm text-white">
                            AI Match: Oasis Community Kitchen (0.8 mi)
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm bg-[#0070E0] px-2 py-0.5 rounded text-white font-bold shadow-[0_0_8px_rgba(0,112,224,0.5)]">
                          99.4% Fit
                        </span>
                      </div>
                    </div>

                    {/* Real-Time Flight Tracker Component */}
                    <div className="mt-space-md pt-space-xs">
                      <div className="flex items-center justify-between text-[#94A3B8] mb-space-xs">
                        <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-[#64748B]">
                          Rescue Flight Vector
                        </span>
                        <span className="font-label-sm text-label-sm text-[#38bdf8] font-bold">
                          Autonomous Dispatch
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 p-1 bg-[#0A1B30] border border-[#1A365D] rounded-lg text-center font-label-sm text-label-sm">
                        <div className="py-1 rounded bg-[#16A36A]/20 text-[#4ade80] border border-[#16A36A]/40 font-bold flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Logged
                        </div>
                        <div className="py-1 rounded bg-[#0070E0]/25 text-[#38bdf8] border border-[#0070E0]/40 font-bold flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">sync</span> Matched
                        </div>
                        <div className="py-1 rounded bg-[#10233D] text-[#64748B]">En Route</div>
                        <div className="py-1 rounded bg-[#10233D] text-[#64748B]">Claimed</div>
                      </div>
                    </div>

                    {/* Instant QR & Escrow Claim Section */}
                    <div className="mt-space-sm p-space-sm bg-[#0A1B30] border border-[#1A365D] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-12 h-12 bg-[#0F223D] border border-[#1E3A66] p-1.5 rounded-lg shadow-sm flex items-center justify-center shrink-0">
                          <svg className="w-full h-full text-[#38bdf8]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h4v4h-4v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v4h-2v-4zm4-2h2v2h-2v-2zm0-4h4v2h-4v-2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-label-sm text-label-sm text-white font-bold">
                            {isQrVerified ? 'QR Handover Authenticated' : 'One-Touch Handover QR'}
                          </div>
                          <div className="font-body-sm text-body-sm text-[#64748B]">
                            {isQrVerified ? 'Custody proof minted #0x8841...c2' : 'Zero-touch authentication code'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsQrVerified(true);
                          showToast('Digital handover token verified via PayPal Sandbox!');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0070E0] text-white font-label-sm text-label-sm font-bold shadow-[0_2px_10px_rgba(0,112,224,0.3)] hover:bg-[#005bb8] transition-colors cursor-pointer"
                      >
                        {isQrVerified ? 'Verified ✓' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  {/* Overlapping Micro Metric Float */}
                  <div className="-mt-6 -ml-4 relative z-20 bg-[#0F223D]/95 border border-[#1E3A66] backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl inline-flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 flex items-center justify-center text-[#4ade80] shadow-[0_0_10px_rgba(22,163,106,0.3)]">
                      <span className="material-symbols-outlined text-[18px]">eco</span>
                    </div>
                    <div>
                      <div className="font-label-sm text-label-sm font-bold text-white">+34.2 kg Diverted</div>
                      <div className="font-body-sm text-body-sm text-[#64748B]">Verified by Metro Bakeries</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* VERIFIED INSTITUTIONAL TRUST & PAYPAL PARTNERS */}
            <section className="w-full bg-[#0A1B30]/80 border-y border-[#1A365D] py-space-md">
              <div className="max-w-[1440px] mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm text-[#94A3B8] shrink-0">
                  <span className="material-symbols-outlined text-[#0070E0] text-[22px]">verified</span>
                  <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-white">
                    Certified Redistribution Network:
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-space-lg text-[#94A3B8] font-label-md text-label-md">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm font-black tracking-tighter text-white">PayPal</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#0070E0]/20 border border-[#0070E0]/40 text-[#38bdf8] font-bold">
                      Giving Fund API
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">local_shipping</span>
                    <span>FoodRescue.Global</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">apartment</span>
                    <span>Urban Table Network</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">shield</span>
                    <span>HACCP Safety Standard</span>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS: 3-STEP INTUITIVE PIPELINE */}
            <section className="max-w-[1440px] mx-auto px-gutter py-space-xl">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0F223D] border border-[#1E3A66] text-[#38bdf8] font-label-sm text-label-sm font-bold mb-space-xs shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">cycle</span> Seamless Operations
                </div>
                <h2 className="font-headline-lg text-headline-lg text-white font-bold">
                  Redistributing Surplus in 3 Simple Steps
                </h2>
                <p className="font-body-lg text-body-lg text-[#94A3B8] mt-2">
                  From commercial kitchen surpluses to local community tables in less than two hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {/* Step 1 */}
                <div className="p-space-lg rounded-[20px] bg-[#10233D] border border-[#1E3A66] shadow-lg flex flex-col justify-between hover:border-[#0070E0] hover:shadow-[0_8px_30px_rgba(0,112,224,0.15)] transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0F223D] border border-[#1E3A66] flex items-center justify-center text-[#38bdf8] mb-space-md shadow-inner">
                      <span className="material-symbols-outlined text-[28px]">post_add</span>
                    </div>
                    <div className="font-label-sm text-label-sm text-[#38bdf8] font-bold uppercase tracking-wider">Step 01</div>
                    <h3 className="font-headline-sm text-headline-sm text-white font-bold mt-1">List Surplus Food</h3>
                    <p className="font-body-md text-body-md text-[#94A3B8] mt-2 leading-relaxed">
                      Snap a picture or sync your kitchen inventory. Specify batch portions, temperature parameters, and pickup expiry windows in seconds.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-sm bg-[#0A1B30] border border-[#1A365D] p-space-sm rounded-xl">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="text-[#94A3B8]">OCR Recognition</span>
                      <span className="text-[#4ade80] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]"></span> Instant Tagging
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-space-lg rounded-[20px] bg-[#10233D] border border-[#1E3A66] shadow-lg flex flex-col justify-between hover:border-[#0070E0] hover:shadow-[0_8px_30px_rgba(0,112,224,0.15)] transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0070E0]/20 border border-[#0070E0]/40 flex items-center justify-center text-[#38bdf8] mb-space-md shadow-[0_0_15px_rgba(0,112,224,0.25)]">
                      <span className="material-symbols-outlined text-[28px]">hub</span>
                    </div>
                    <div className="font-label-sm text-label-sm text-[#38bdf8] font-bold uppercase tracking-wider">Step 02</div>
                    <h3 className="font-headline-sm text-headline-sm text-white font-bold mt-1">AI Connects Nearby</h3>
                    <p className="font-body-md text-body-md text-[#94A3B8] mt-2 leading-relaxed">
                      Our automated matching algorithm instantly notifies nearby shelters, food banks, and individuals based on volume, route logistics, and cold storage capacity.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-sm bg-[#0A1B30] border border-[#1A365D] p-space-sm rounded-xl">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="text-[#94A3B8]">Radius Optimization</span>
                      <span className="text-[#38bdf8] font-bold">&lt; 3.5 Miles Priority</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-space-lg rounded-[20px] bg-[#10233D] border border-[#1E3A66] shadow-lg flex flex-col justify-between hover:border-[#0070E0] hover:shadow-[0_8px_30px_rgba(0,112,224,0.15)] transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#16A36A]/20 border border-[#16A36A]/40 flex items-center justify-center text-[#4ade80] mb-space-md shadow-[0_0_15px_rgba(22,163,106,0.25)]">
                      <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
                    </div>
                    <div className="font-label-sm text-label-sm text-[#38bdf8] font-bold uppercase tracking-wider">Step 03</div>
                    <h3 className="font-headline-sm text-headline-sm text-white font-bold mt-1">Collect via Dynamic QR</h3>
                    <p className="font-body-md text-body-md text-[#94A3B8] mt-2 leading-relaxed">
                      Recipients arrive with encrypted mobile tokens. The single scan completes chain-of-custody tracking, releases donor tax certificates, and settles logistics tips.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-sm bg-[#0A1B30] border border-[#1A365D] p-space-sm rounded-xl">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="text-[#94A3B8]">Custody Settlement</span>
                      <span className="text-[#4ade80] font-bold">100% Tax Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* INTERACTIVE ROLE SHOWCASE SECTION */}
            <section className="max-w-[1440px] mx-auto px-gutter py-space-xl">
              <div className="bg-[#10233D] border border-[#1E3A66] rounded-[28px] p-space-lg md:p-space-xl shadow-xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
                  <div>
                    <div className="font-label-sm text-label-sm uppercase tracking-wider text-[#38bdf8] font-bold">
                      Adaptive Operational Modes
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-white font-bold mt-1">
                      Built For Every Stakeholder
                    </h2>
                  </div>

                  {/* Role Selector Tabs */}
                  <div className="inline-flex p-1 bg-[#0A1B30] border border-[#1A365D] rounded-xl gap-1">
                    <button
                      onClick={() => setSelectedRoleTab('donor')}
                      className={`px-4 py-2 rounded-lg font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'donor'
                          ? 'bg-[#0070E0] text-white shadow-md'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      For Donors
                    </button>
                    <button
                      onClick={() => setSelectedRoleTab('recipient')}
                      className={`px-4 py-2 rounded-lg font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'recipient'
                          ? 'bg-[#0070E0] text-white shadow-md'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      For Recipients
                    </button>
                    <button
                      onClick={() => setSelectedRoleTab('ngo')}
                      className={`px-4 py-2 rounded-lg font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'ngo'
                          ? 'bg-[#0070E0] text-white shadow-md'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      For NGOs &amp; Shelters
                    </button>
                  </div>
                </div>

                {/* Role Panels */}
                {/* Panel 1: Donor */}
                {selectedRoleTab === 'donor' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-5 space-y-space-md">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0070E0]/20 border border-[#0070E0]/40 text-[#38bdf8] font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[16px]">store</span> Restaurants &amp; Supermarkets
                      </span>
                      <h3 className="font-headline-md text-headline-md text-white font-bold">
                        Turn Cost Centers into Social Equity &amp; Tax Deductions
                      </h3>
                      <p className="font-body-md text-body-md text-[#94A3B8] leading-relaxed">
                        Commercial kitchens lose thousands monthly to surplus disposal fees. FOODLOOP enables kitchen managers to log unused ingredients in seconds, automate FDA-compliant food rescue records, and collect instant tax write-off receipts through PayPal Giving Fund.
                      </p>
                      <div className="space-y-space-xs font-body-md text-body-md text-[#d7e3fc]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>Automatic 501(c)(3) valuation ledgers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>Zero kitchen disruption with scheduled pickups</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>ESG sustainability metrics for quarterly audits</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('donor-portal')}
                        className="inline-flex items-center gap-2 font-label-lg text-label-lg text-[#38bdf8] font-bold hover:text-white transition-colors cursor-pointer"
                      >
                        <span>Explore Donor Portal</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-[#132A4A] border border-[#1E3A66] p-space-lg rounded-[20px] shadow-lg">
                        <div className="flex items-center justify-between mb-space-md pb-space-xs">
                          <div>
                            <div className="font-label-sm text-label-sm text-[#64748B] uppercase">Active Listing Stream</div>
                            <div className="font-headline-sm text-headline-sm text-white font-bold">
                              Artisan Kitchen - Downtown
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-[#4ade80] font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(22,163,106,0.2)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-pulse"></span> Live Broadcast
                          </span>
                        </div>
                        <div className="space-y-space-sm">
                          <div className="p-space-sm bg-[#0A1B30] border border-[#1A365D] rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-space-sm">
                              <span className="material-symbols-outlined text-[#38bdf8] text-[24px]">bakery_dining</span>
                              <div>
                                <div className="font-label-md text-label-md font-bold text-white">
                                  Fresh Sourdough &amp; Baguettes (42 units)
                                </div>
                                <div className="font-body-sm text-body-sm text-[#64748B]">
                                  Prepped 6 hrs ago • Ready for pickup
                                </div>
                              </div>
                            </div>
                            <span className="font-label-md text-label-md text-[#4ade80] font-bold">Claimed in 4m</span>
                          </div>
                          <div className="p-space-sm bg-[#0A1B30] border border-[#1A365D] rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-space-sm">
                              <span className="material-symbols-outlined text-[#38bdf8] text-[24px]">soup_kitchen</span>
                              <div>
                                <div className="font-label-md text-label-md font-bold text-white">
                                  Prepared Vegetable Curry (18 kg)
                                </div>
                                <div className="font-body-sm text-body-sm text-[#64748B]">Chilled 3°C • Vacuum insulated</div>
                              </div>
                            </div>
                            <span className="font-label-md text-label-md text-[#38bdf8] font-bold">En Route Driver</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel 2: Recipient */}
                {selectedRoleTab === 'recipient' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-5 space-y-space-md">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0070E0]/20 border border-[#0070E0]/40 text-[#38bdf8] font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[16px]">person_pin_circle</span> Neighborhood Residents
                      </span>
                      <h3 className="font-headline-md text-headline-md text-white font-bold">
                        Dignified, Fresh &amp; Hyperlocal Nutrition
                      </h3>
                      <p className="font-body-md text-body-md text-[#94A3B8] leading-relaxed">
                        Browse safe, surplus meals from your favorite local cafes, catering venues, and farm markets. Filter dietary preferences like vegan, gluten-free, or halal and claim packages for collection without awkward handoffs.
                      </p>
                      <div className="space-y-space-xs font-body-md text-body-md text-[#d7e3fc]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>GPS radius alerts when fresh batches drop</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>No shame, 100% private QR verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>Always free or pay-what-you-can PayPal donation</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('explore-food')}
                        className="inline-flex items-center gap-2 font-label-lg text-label-lg text-[#38bdf8] font-bold hover:text-white transition-colors cursor-pointer"
                      >
                        <span>Browse Nearby Food</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-[#132A4A] border border-[#1E3A66] p-space-lg rounded-[20px] shadow-lg">
                        <div className="flex items-center justify-between mb-space-md">
                          <div className="font-headline-sm text-headline-sm text-white font-bold">
                            Nearby Available Right Now
                          </div>
                          <span className="font-label-sm text-label-sm text-[#38bdf8] font-bold">Within 2.0 mi</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                          <div className="p-space-sm bg-[#0A1B30] border border-[#1A365D] rounded-xl">
                            <div className="font-label-md text-label-md font-bold text-white">Green Grocer Organic Bag</div>
                            <div className="font-body-sm text-body-sm text-[#64748B]">Apples, kale, carrots • 4.2 kg</div>
                            <div className="mt-space-sm flex items-center justify-between">
                              <span className="font-label-sm text-label-sm text-[#F5A623] font-bold">Expires in 2h</span>
                              <button
                                onClick={() => {
                                  showToast('Green Grocer Organic Bag reserved! Check Explore Food.');
                                  onNavigate('explore-food');
                                }}
                                className="px-3 py-1 bg-[#0070E0] text-white rounded font-label-sm text-label-sm font-semibold hover:bg-[#005bb8] transition-colors cursor-pointer"
                              >
                                Reserve
                              </button>
                            </div>
                          </div>
                          <div className="p-space-sm bg-[#0A1B30] border border-[#1A365D] rounded-xl">
                            <div className="font-label-md text-label-md font-bold text-white">Harvest Salad Bowls (x6)</div>
                            <div className="font-body-sm text-body-sm text-[#64748B]">Fresh prepped salads • Vegan</div>
                            <div className="mt-space-sm flex items-center justify-between">
                              <span className="font-label-sm text-label-sm text-[#F5A623] font-bold">Expires in 1h</span>
                              <button
                                onClick={() => {
                                  showToast('Harvest Salad Bowls reserved! Check Explore Food.');
                                  onNavigate('explore-food');
                                }}
                                className="px-3 py-1 bg-[#0070E0] text-white rounded font-label-sm text-label-sm font-semibold hover:bg-[#005bb8] transition-colors cursor-pointer"
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
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-5 space-y-space-md">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8065D8]/20 border border-[#8065D8]/40 text-[#cdbdff] font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[16px]">corporate_fare</span> Community Non-Profits
                      </span>
                      <h3 className="font-headline-md text-headline-md text-white font-bold">
                        High-Capacity Logistics for Food Pantries &amp; Shelters
                      </h3>
                      <p className="font-body-md text-body-md text-[#94A3B8] leading-relaxed">
                        Manage bulk intakes without telephone tag. Connect directly with university campuses, event venues, and wholesale distributors offering large pallet-scale rescue shipments.
                      </p>
                      <div className="space-y-space-xs font-body-md text-body-md text-[#d7e3fc]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>Fleet dispatch routing &amp; cargo monitoring</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>Cold-chain compliance temperature logs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4ade80]">check_circle</span>
                          <span>PayPal Grant micro-funding integrations</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('ngo-hub')}
                        className="inline-flex items-center gap-2 font-label-lg text-label-lg text-[#38bdf8] font-bold hover:text-white transition-colors cursor-pointer"
                      >
                        <span>Register NGO Operations</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-[#132A4A] border border-[#1E3A66] p-space-lg rounded-[20px] shadow-lg">
                        <div className="font-headline-sm text-headline-sm text-white font-bold mb-space-sm">
                          Bulk Intake Coordination
                        </div>
                        <div className="p-space-sm bg-[#0A1B30] border border-[#1A365D] rounded-xl mb-space-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-label-md text-label-md font-bold text-white">Downtown Convention Hall</span>
                            <span className="font-label-sm text-label-sm text-[#4ade80] font-bold">320 Meals Ready</span>
                          </div>
                          <div className="font-body-sm text-body-sm text-[#64748B] mt-1">
                            Requires van transport • Heated transit boxes
                          </div>
                        </div>
                        <div className="p-space-sm bg-[#0A1B30] border border-[#1A365D] rounded-xl">
                          <div className="flex justify-between items-center">
                            <span className="font-label-md text-label-md font-bold text-white">City Center Food Bank</span>
                            <span className="font-label-sm text-label-sm text-[#38bdf8] font-bold">Dock Bay 2 Assigned</span>
                          </div>
                          <div className="font-body-sm text-body-sm text-[#64748B] mt-1">ETA: 18 mins • Driver: Alex M.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* LIVE IMPACT TESTIMONIAL CAROUSEL */}
            <section className="max-w-[1440px] mx-auto px-gutter py-space-xl">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-space-lg">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#38bdf8] font-bold">
                    Voices from the Loop
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-white font-bold mt-1">Real Human Impact</h2>
                </div>
                <div className="flex items-center gap-space-xs mt-space-sm md:mt-0">
                  <button
                    aria-label="Previous quote"
                    onClick={() => setTestimonialIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))}
                    className="w-10 h-10 rounded-full bg-[#10233D] border border-[#1E3A66] flex items-center justify-center hover:border-[#0070E0] hover:text-white transition-colors text-[#94A3B8] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">west</span>
                  </button>
                  <button
                    aria-label="Next quote"
                    onClick={() => setTestimonialIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))}
                    className="w-10 h-10 rounded-full bg-[#10233D] border border-[#1E3A66] flex items-center justify-center hover:border-[#0070E0] hover:text-white transition-colors text-[#94A3B8] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">east</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {testimonials.map((t, idx) => {
                  const isActive = idx === testimonialIndex;
                  return (
                    <div
                      key={t.id}
                      className={`bg-[#10233D] border rounded-[20px] p-space-lg shadow-lg flex flex-col justify-between transition-all duration-300 ${
                        isActive ? 'border-[#0070E0] shadow-[0_8px_30px_rgba(0,112,224,0.2)]' : 'border-[#1E3A66] hover:border-[#0070E0]/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1 text-[#F5A623] mb-space-sm drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="material-symbols-outlined text-[18px]">
                              star
                            </span>
                          ))}
                        </div>
                        <p className="font-body-md text-body-md text-[#94A3B8] italic leading-relaxed">{t.quote}</p>
                      </div>
                      <div className="flex items-center gap-space-sm mt-space-lg pt-space-sm border-t border-[#1E3A66]/60">
                        <img className="w-11 h-11 rounded-full object-cover ring-2 ring-[#0070E0]/40" alt={t.name} src={t.image} />
                        <div>
                          <div className="font-label-md text-label-md font-bold text-white">{t.name}</div>
                          <div className="font-body-sm text-body-sm text-[#64748B]">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="max-w-[1440px] mx-auto px-gutter pb-space-xl">
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0A1B30] via-[#0F223D] to-[#1E3A66] border border-[#1E3A66] p-space-xl text-white shadow-2xl">
                <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#0070E0]/25 blur-3xl pointer-events-none"></div>
                <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-[#8065D8]/20 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 max-w-2xl space-y-space-md">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#0070E0]/20 border border-[#0070E0]/40 backdrop-blur-md font-label-sm text-label-sm font-bold uppercase tracking-wider text-[#38bdf8] inline-block shadow-[0_0_15px_rgba(0,112,224,0.3)]">
                    Join The Loop Today
                  </span>
                  <h2 className="font-headline-lg text-headline-lg font-extrabold text-white">
                    Every Meal Deserves a Chance.<br />Start Rescuing in Your City.
                  </h2>
                  <p className="font-body-lg text-body-lg text-[#94A3B8]">
                    Whether you are a commercial donor, a local relief organization, or an individual champion, zero food waste starts with your next action.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                    <button
                      onClick={() => onNavigate('explore-food')}
                      className="h-11 px-6 rounded-lg bg-[#0070E0] text-white font-label-lg text-label-lg font-bold flex items-center justify-center hover:bg-[#005bb8] shadow-[0_4px_16px_rgba(0,112,224,0.4)] transition-all cursor-pointer"
                    >
                      Claim Food Nearby
                    </button>
                    <button
                      onClick={() => onNavigate('donor-portal')}
                      className="h-11 px-6 rounded-lg bg-[#0A1B30] text-white border border-[#1E3A66] font-label-lg text-label-lg font-bold flex items-center justify-center hover:border-[#0070E0] hover:bg-[#132A4A] transition-all cursor-pointer"
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

      {/* FOOTER */}
      <footer className="w-full bg-[#0A1B30] border-t border-[#1A365D] mt-space-xl py-space-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <div className="max-w-[1440px] mx-auto px-gutter">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="FOODLOOP Brand Logo"
                className="h-6 w-auto object-contain brightness-110 drop-shadow-[0_0_6px_rgba(0,112,224,0.3)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-white font-extrabold tracking-tight">FOODLOOP</span>
              <span className="font-body-sm text-body-sm text-[#94A3B8] ml-space-sm hidden sm:inline">
                Every Meal Deserves a Chance.
              </span>
            </div>
            <div className="flex items-center gap-space-lg font-label-md text-label-md text-[#94A3B8]">
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
          <div className="mt-space-lg text-center md:text-left font-body-sm text-body-sm text-[#64748B]">
            © 2025 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement.
          </div>
        </div>
      </footer>
    </div>
  );
};
