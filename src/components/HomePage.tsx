'use client';

import React, { useState } from 'react';

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
  const [activeNav, setActiveNav] = useState('home');

  const handleNavClick = (path: string) => {
    setActiveNav(path);
    if (path !== 'home') {
      onNavigate(path);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,48,135,0.06)] border-b border-surface-container-high/60">
        <div className="h-16 max-w-[1440px] mx-auto px-gutter flex items-center justify-between gap-space-md">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-space-lg shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-space-sm cursor-pointer"
            >
              <img
                alt="FOODLOOP Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-extrabold">
                FOODLOOP
              </span>
            </button>

            <nav className="hidden xl:flex items-center gap-space-md">
              <button
                onClick={() => handleNavClick('home')}
                className={`transition-colors py-space-xs px-space-xs font-label-lg text-label-lg ${
                  activeNav === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('explore-food')}
                className={`transition-colors py-space-xs px-space-xs font-label-lg text-label-lg ${
                  activeNav === 'explore-food' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Explore Food
              </button>
              <button
                onClick={() => handleNavClick('ai-rescue-agent')}
                className={`transition-colors py-space-xs px-space-xs font-label-lg text-label-lg ${
                  activeNav === 'ai-rescue-agent' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                AI Rescue Agent
              </button>
              <button
                onClick={() => handleNavClick('donor-portal')}
                className={`transition-colors py-space-xs px-space-xs font-label-lg text-label-lg ${
                  activeNav === 'donor-portal' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Donor Portal
              </button>
              <button
                onClick={() => handleNavClick('ngo-hub')}
                className={`transition-colors py-space-xs px-space-xs font-label-lg text-label-lg ${
                  activeNav === 'ngo-hub' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                NGO Hub
              </button>
              <button
                onClick={() => handleNavClick('impact')}
                className={`transition-colors py-space-xs px-space-xs font-label-lg text-label-lg ${
                  activeNav === 'impact' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Impact
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-space-sm justify-end flex-1 max-w-2xl">
            {/* Search */}
            <div className="relative hidden md:block w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-9 pr-space-md bg-surface-container-low rounded-lg text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all border border-transparent focus:border-secondary/30"
                placeholder="Search rescued batches, NGOs, donors..."
                type="text"
              />
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <select
                aria-label="Active Role Switcher"
                value={activeRole}
                onChange={(e) => {
                  setActiveRole(e.target.value);
                  if (e.target.value === 'donor') onNavigate('donor-portal');
                  else if (e.target.value === 'recipient') onNavigate('explore-food');
                  else if (e.target.value === 'ngo') onNavigate('ngo-hub');
                }}
                className="appearance-none h-10 pl-space-sm pr-space-lg bg-surface-container-low font-label-md text-label-md text-primary font-bold rounded-lg cursor-pointer focus:outline-none border border-surface-container-high"
              >
                <option value="donor">Role: Donor</option>
                <option value="recipient">Role: Recipient</option>
                <option value="ngo">Role: NGO Hub</option>
                <option value="admin">Role: Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Sponsor Stack Link */}
            {onOpenSponsors && (
              <button
                onClick={onOpenSponsors}
                className="hidden sm:flex items-center gap-1.5 h-10 px-3 rounded-lg bg-[#ffc439]/20 text-[#001435] font-label-md text-label-md font-extrabold hover:bg-[#ffc439]/30 transition-all border border-[#ffc439]/40 cursor-pointer"
                title="View Hackathon Sponsor Evidence"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ffc439]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  rewarded_ads
                </span>
                <span>Sponsors (5)</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-space-xs pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AuBrBX3rid6pOx0dgjfFZiQuarZNC4ipbGSYhO-jY_WTb_SQbnWDrEo98Jhg-8JKphDxi4Z8NOeGzNc_hFMaRVYj-1683kiMS_dIPxVad445CjK_RrupYdLNxDmYfo7XfvTth6OG-dzgD_qIcJFkl5DrJRZWvLD0cEWGslh-BQJ5MUEt4P9QVKKCZ7ruSXqm_Nf5SXz66O5vLNy7SdUmCX3Y4GHbhC-tmHmwZ4k"
              />
              <span className="material-symbols-outlined text-outline text-[18px] hidden sm:block cursor-pointer hover:text-primary transition-colors">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-16 bg-background flex-1">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow Orbs */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/4 w-[540px] h-[540px] rounded-full bg-secondary-fixed/30 blur-[130px] pointer-events-none"></div>
            <div className="absolute top-96 -right-20 w-[480px] h-[480px] rounded-full bg-tertiary-fixed-dim/25 blur-[140px] pointer-events-none"></div>

            {/* HERO SECTION */}
            <section className="max-w-[1440px] mx-auto px-gutter pt-space-xl pb-space-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                {/* Hero Left Typography & Conversion */}
                <div className="lg:col-span-7 flex flex-col items-start space-y-space-md z-10">
                  {/* Institutional Verified Tag */}
                  <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-low shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-[#16A36A] -ml-2.5"></span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                      Decentralized Surplus Logistics
                    </span>
                    <span className="text-outline font-label-sm">•</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                      Instant PayPal Escrow &amp; Grants
                    </span>
                  </div>

                  <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
                    Good Food.<br />
                    <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-secondary via-secondary-container to-tertiary">
                      Zero Waste.
                    </span>
                  </h1>

                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                    Rescue surplus food and share it with someone who needs it. Powered by automated AI matching, real-time dispatch routing, and seamless PayPal micro-settlements.
                  </p>

                  {/* Dual CTAs & Live Trust Prompt */}
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
                    <button
                      onClick={() => onNavigate('explore-food')}
                      className="h-11 px-6 rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary-container shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">explore</span>
                      <span>Explore Food</span>
                    </button>

                    <button
                      onClick={() => onNavigate('donor-portal')}
                      className="h-11 px-6 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container shadow-sm transition-all duration-200 cursor-pointer border border-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                      <span>Start Donating</span>
                    </button>

                    <div className="flex items-center gap-space-xs pl-2 text-on-surface-variant">
                      <span
                        className="material-symbols-outlined text-secondary text-[22px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        payments
                      </span>
                      <span className="font-label-sm text-label-sm text-outline font-bold">
                        PayPal Certified Escrow
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Operational Pulse */}
                  <div className="pt-space-md grid grid-cols-2 sm:grid-cols-4 gap-space-md w-full">
                    <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high/40">
                      <div className="font-headline-sm text-headline-sm text-primary font-bold">142,890</div>
                      <div className="font-label-sm text-label-sm text-outline">Meals Rescued</div>
                    </div>
                    <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high/40">
                      <div className="font-headline-sm text-headline-sm text-primary font-bold">1,280</div>
                      <div className="font-label-sm text-label-sm text-outline">Verified Donors</div>
                    </div>
                    <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high/40">
                      <div className="font-headline-sm text-headline-sm text-primary font-bold">340</div>
                      <div className="font-label-sm text-label-sm text-outline">Active NGOs</div>
                    </div>
                    <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high/40">
                      <div className="font-headline-sm text-headline-sm text-secondary font-bold">89.4 T</div>
                      <div className="font-label-sm text-label-sm text-outline">CO₂ Prevented</div>
                    </div>
                  </div>
                </div>

                {/* Hero Right: Bespoke Smart Food Rescue Container Mockup */}
                <div className="lg:col-span-5 relative mt-space-md lg:mt-0">
                  <div className="relative bg-surface-container-lowest p-space-md rounded-[24px] shadow-xl overflow-hidden border border-surface-container-high/60">
                    {/* Top Status Rim */}
                    <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low p-space-sm rounded-xl">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-3 h-3 rounded-full bg-[#16A36A] animate-pulse"></div>
                        <span className="font-label-md text-label-md text-primary font-bold">
                          Smart Rescue Pod #8841
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-medium">
                        IoT Cold-Chain Safe
                      </span>
                    </div>

                    {/* Visual Media with Badge Scrim */}
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-surface-container">
                      <img
                        className="w-full h-full object-cover"
                        alt="Commercial kitchen prep station with organic produce crates"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLasxaugMQHdFiWZAY-B4u_ZwrZ8cPTsQuzfty65jPGnU7iUo_1AQwK3pB7SFBBOj7Q6xvts1XZceyAwUts3VXHjUyu_tzKR_YBPyoaeYE27364kNWxyLXV1bimnguwA-tx9RC9jd2T3xkeq05e_oykDyCJRH9xwm-_wD1_cb0E0th0DxVHZiZdLSQpBdiqDgwrmbiSOj41ncGx74JXajIf1v08FMTmeK2HQdBLtc"
                      />
                      {/* Expiry Countdown Shield */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
                        <span className="material-symbols-outlined text-[16px] text-[#D97706]">timer</span>
                        <span className="font-label-sm text-label-sm font-bold text-[#D97706]">
                          01:42:19 Remaining
                        </span>
                      </div>
                      {/* AI Route Allocation Pill */}
                      <div className="absolute bottom-3 left-3 right-3 p-space-xs rounded-lg bg-primary-container/90 backdrop-blur-md text-on-primary flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary-fixed text-[18px]">
                            auto_awesome
                          </span>
                          <span className="font-label-sm text-label-sm text-on-primary font-medium">
                            AI Match: Oasis Community Kitchen (0.8 mi)
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm bg-secondary px-2 py-0.5 rounded text-white font-bold">
                          99.4% Fit
                        </span>
                      </div>
                    </div>

                    {/* Real-Time Flight Tracker Component */}
                    <div className="mt-space-md pt-space-xs">
                      <div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
                        <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">
                          Rescue Flight Vector
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary font-bold">
                          Autonomous Dispatch
                        </span>
                      </div>
                      {/* Flight Bar Tracker */}
                      <div className="grid grid-cols-4 gap-1 p-1 bg-surface-container-low rounded-lg text-center font-label-sm text-label-sm">
                        <div className="py-1 rounded bg-[#16A36A]/15 text-[#16A36A] font-bold flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Logged
                        </div>
                        <div className="py-1 rounded bg-secondary/15 text-secondary font-bold flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">sync</span> Matched
                        </div>
                        <div className="py-1 rounded bg-surface-container text-outline">En Route</div>
                        <div className="py-1 rounded bg-surface-container text-outline">Claimed</div>
                      </div>
                    </div>

                    {/* Instant QR & Escrow Claim Section */}
                    <div className="mt-space-sm p-space-sm bg-surface-container-low rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-12 h-12 bg-surface-container-lowest p-1 rounded-lg shadow-sm flex items-center justify-center shrink-0">
                          <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h4v4h-4v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v4h-2v-4zm4-2h2v2h-2v-2zm0-4h4v2h-4v-2z"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="font-label-sm text-label-sm text-primary font-bold">
                            One-Touch Handover QR
                          </div>
                          <div className="font-body-sm text-body-sm text-outline">
                            Zero-touch authentication code
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('explore-food')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-bold shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  </div>

                  {/* Overlapping Micro Metric Float */}
                  <div className="-mt-6 -ml-4 relative z-20 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg inline-flex items-center gap-3 border border-surface-container-high">
                    <div className="w-8 h-8 rounded-full bg-[#16A36A]/15 flex items-center justify-center text-[#16A36A]">
                      <span className="material-symbols-outlined text-[18px]">eco</span>
                    </div>
                    <div>
                      <div className="font-label-sm text-label-sm font-bold text-primary">+34.2 kg Diverted</div>
                      <div className="font-body-sm text-body-sm text-outline">Verified by Metro Bakeries</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* VERIFIED INSTITUTIONAL TRUST & PAYPAL PARTNERS */}
            <section className="w-full bg-surface-container-low/70 py-space-md border-y border-surface-container-high/60">
              <div className="max-w-[1440px] mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                  <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-primary">
                    Certified Redistribution Network:
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-space-lg text-outline font-label-md text-label-md">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm font-black tracking-tighter text-primary">
                      PayPal
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-bold">
                      Giving Fund API
                    </span>
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
            <section className="max-w-[1440px] mx-auto px-gutter py-space-xl">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-bold mb-space-xs">
                  <span className="material-symbols-outlined text-[16px]">cycle</span> Seamless Operations
                </div>
                <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
                  Redistributing Surplus in 3 Simple Steps
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                  From commercial kitchen surpluses to local community tables in less than two hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {/* Step 1 */}
                <div className="p-space-lg rounded-[20px] bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-surface-container-high/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-space-md">
                      <span className="material-symbols-outlined text-[28px]">post_add</span>
                    </div>
                    <div className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                      Step 01
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold mt-1">
                      List Surplus Food
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Snap a picture or sync your kitchen inventory. Specify batch portions, temperature parameters, and pickup expiry windows in seconds.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-sm bg-surface-container-low p-space-sm rounded-xl">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="text-on-surface-variant">OCR Recognition</span>
                      <span className="text-[#16A36A] font-bold">Instant Tagging</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-space-lg rounded-[20px] bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-surface-container-high/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-space-md">
                      <span className="material-symbols-outlined text-[28px]">hub</span>
                    </div>
                    <div className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                      Step 02
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold mt-1">
                      AI Connects Nearby
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Our automated matching algorithm instantly notifies nearby shelters, food banks, and individuals based on volume, route logistics, and cold storage capacity.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-sm bg-surface-container-low p-space-sm rounded-xl">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="text-on-surface-variant">Radius Optimization</span>
                      <span className="text-secondary font-bold">&lt; 3.5 Miles Priority</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-space-lg rounded-[20px] bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-surface-container-high/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-[#16A36A] mb-space-md">
                      <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
                    </div>
                    <div className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                      Step 03
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold mt-1">
                      Collect via Dynamic QR
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Recipients arrive with encrypted mobile tokens. The single scan completes chain-of-custody tracking, releases donor tax certificates, and settles logistics tips.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-sm bg-surface-container-low p-space-sm rounded-xl">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="text-on-surface-variant">Custody Settlement</span>
                      <span className="text-[#16A36A] font-bold">100% Tax Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* INTERACTIVE ROLE SHOWCASE SECTION */}
            <section className="max-w-[1440px] mx-auto px-gutter py-space-xl">
              <div className="bg-surface-container-low rounded-[28px] p-space-lg md:p-space-xl border border-surface-container-high/60">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
                  <div>
                    <div className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                      Adaptive Operational Modes
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
                      Built For Every Stakeholder
                    </h2>
                  </div>

                  {/* Role Selector Tabs */}
                  <div className="inline-flex p-1 bg-surface-container rounded-xl gap-1">
                    <button
                      onClick={() => setSelectedRoleTab('donor')}
                      className={`px-4 py-2 rounded-lg font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'donor'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      For Donors
                    </button>
                    <button
                      onClick={() => setSelectedRoleTab('recipient')}
                      className={`px-4 py-2 rounded-lg font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'recipient'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      For Recipients
                    </button>
                    <button
                      onClick={() => setSelectedRoleTab('ngo')}
                      className={`px-4 py-2 rounded-lg font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        selectedRoleTab === 'ngo'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      For NGOs &amp; Shelters
                    </button>
                  </div>
                </div>

                {/* Panel 1: Donor */}
                {selectedRoleTab === 'donor' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-5 space-y-space-md">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[16px]">store</span> Restaurants &amp; Supermarkets
                      </span>
                      <h3 className="font-headline-md text-headline-md text-primary font-bold">
                        Turn Cost Centers into Social Equity &amp; Tax Deductions
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Commercial kitchens lose thousands monthly to surplus disposal fees. FOODLOOP enables kitchen managers to log unused ingredients in seconds, automate FDA-compliant food rescue records, and collect instant tax write-off receipts through PayPal Giving Fund.
                      </p>
                      <div className="space-y-space-xs font-body-md text-body-md text-primary">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>Automatic 501(c)(3) valuation ledgers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>Zero kitchen disruption with scheduled pickups</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>ESG sustainability metrics for quarterly audits</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('donor-portal')}
                        className="inline-flex items-center gap-2 font-label-lg text-label-lg text-secondary font-bold hover:underline cursor-pointer"
                      >
                        <span>Explore Donor Portal</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-surface-container-lowest p-space-lg rounded-[20px] shadow-md border border-surface-container-high/40">
                        <div className="flex items-center justify-between mb-space-md pb-space-xs">
                          <div>
                            <div className="font-label-sm text-label-sm text-outline uppercase font-semibold">
                              Active Listing Stream
                            </div>
                            <div className="font-headline-sm text-headline-sm text-primary font-bold">
                              Artisan Kitchen - Downtown
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-[#16A36A]/15 text-[#16A36A] font-label-sm text-label-sm font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]"></span> Live Broadcast
                          </span>
                        </div>

                        <div className="space-y-space-sm">
                          <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-space-sm">
                              <span className="material-symbols-outlined text-secondary text-[24px]">bakery_dining</span>
                              <div>
                                <div className="font-label-md text-label-md font-bold text-primary">
                                  Fresh Sourdough &amp; Baguettes (42 units)
                                </div>
                                <div className="font-body-sm text-body-sm text-outline">
                                  Prepped 6 hrs ago • Ready for pickup
                                </div>
                              </div>
                            </div>
                            <span className="font-label-md text-label-md text-[#16A36A] font-bold">Claimed in 4m</span>
                          </div>

                          <div className="p-space-sm bg-surface-container-low rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-space-sm">
                              <span className="material-symbols-outlined text-secondary text-[24px]">soup_kitchen</span>
                              <div>
                                <div className="font-label-md text-label-md font-bold text-primary">
                                  Prepared Vegetable Curry (18 kg)
                                </div>
                                <div className="font-body-sm text-body-sm text-outline">
                                  Chilled 3°C • Vacuum insulated
                                </div>
                              </div>
                            </div>
                            <span className="font-label-md text-label-md text-secondary font-bold">En Route Driver</span>
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
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-primary font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[16px]">person_pin_circle</span> Neighborhood Residents
                      </span>
                      <h3 className="font-headline-md text-headline-md text-primary font-bold">
                        Dignified, Fresh &amp; Hyperlocal Nutrition
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Browse safe, surplus meals from your favorite local cafes, catering venues, and farm markets. Filter dietary preferences like vegan, gluten-free, or halal and claim packages for collection without awkward handoffs.
                      </p>
                      <div className="space-y-space-xs font-body-md text-body-md text-primary">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>GPS radius alerts when fresh batches drop</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>No shame, 100% private QR verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>Always free or pay-what-you-can PayPal donation</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('explore-food')}
                        className="inline-flex items-center gap-2 font-label-lg text-label-lg text-secondary font-bold hover:underline cursor-pointer"
                      >
                        <span>Browse Nearby Food</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-surface-container-lowest p-space-lg rounded-[20px] shadow-md border border-surface-container-high/40">
                        <div className="flex items-center justify-between mb-space-md">
                          <div className="font-headline-sm text-headline-sm text-primary font-bold">
                            Nearby Available Right Now
                          </div>
                          <span className="font-label-sm text-label-sm text-secondary font-bold">Within 2.0 mi</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                          <div className="p-space-sm bg-surface-container-low rounded-xl">
                            <div className="font-label-md text-label-md font-bold text-primary">
                              Green Grocer Organic Bag
                            </div>
                            <div className="font-body-sm text-body-sm text-outline">Apples, kale, carrots • 4.2 kg</div>
                            <div className="mt-space-sm flex items-center justify-between">
                              <span className="font-label-sm text-label-sm text-[#D97706] font-bold">Expires in 2h</span>
                              <button
                                onClick={() => onNavigate('explore-food')}
                                className="px-3 py-1 bg-secondary text-white rounded font-label-sm text-label-sm font-bold cursor-pointer"
                              >
                                Reserve
                              </button>
                            </div>
                          </div>

                          <div className="p-space-sm bg-surface-container-low rounded-xl">
                            <div className="font-label-md text-label-md font-bold text-primary">
                              Harvest Salad Bowls (x6)
                            </div>
                            <div className="font-body-sm text-body-sm text-outline">Fresh prepped salads • Vegan</div>
                            <div className="mt-space-sm flex items-center justify-between">
                              <span className="font-label-sm text-label-sm text-[#D97706] font-bold">Expires in 1h</span>
                              <button
                                onClick={() => onNavigate('explore-food')}
                                className="px-3 py-1 bg-secondary text-white rounded font-label-sm text-label-sm font-bold cursor-pointer"
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
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-primary font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[16px]">corporate_fare</span> Community Non-Profits
                      </span>
                      <h3 className="font-headline-md text-headline-md text-primary font-bold">
                        High-Capacity Logistics for Food Pantries &amp; Shelters
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Manage bulk intakes without telephone tag. Connect directly with university campuses, event venues, and wholesale distributors offering large pallet-scale rescue shipments.
                      </p>
                      <div className="space-y-space-xs font-body-md text-body-md text-primary">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>Fleet dispatch routing &amp; cargo monitoring</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>Cold-chain compliance temperature logs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#16A36A]">check_circle</span>
                          <span>PayPal Grant micro-funding integrations</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('ngo-hub')}
                        className="inline-flex items-center gap-2 font-label-lg text-label-lg text-secondary font-bold hover:underline cursor-pointer"
                      >
                        <span>Register NGO Operations</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="bg-surface-container-lowest p-space-lg rounded-[20px] shadow-md border border-surface-container-high/40">
                        <div className="font-headline-sm text-headline-sm text-primary font-bold mb-space-sm">
                          Bulk Intake Coordination
                        </div>
                        <div className="p-space-sm bg-surface-container-low rounded-xl mb-space-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-label-md text-label-md font-bold text-primary">
                              Downtown Convention Hall
                            </span>
                            <span className="font-label-sm text-label-sm text-[#16A36A] font-bold">320 Meals Ready</span>
                          </div>
                          <div className="font-body-sm text-body-sm text-outline mt-1">
                            Requires van transport • Heated transit boxes
                          </div>
                        </div>

                        <div className="p-space-sm bg-surface-container-low rounded-xl">
                          <div className="flex justify-between items-center">
                            <span className="font-label-md text-label-md font-bold text-primary">
                              City Center Food Bank
                            </span>
                            <span className="font-label-sm text-label-sm text-secondary font-bold">
                              Dock Bay 2 Assigned
                            </span>
                          </div>
                          <div className="font-body-sm text-body-sm text-outline mt-1">ETA: 18 mins • Driver: Alex M.</div>
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
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Voices from the Loop
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
                    Real Human Impact
                  </h2>
                </div>
                <div className="flex items-center gap-space-xs mt-space-sm md:mt-0">
                  <button
                    aria-label="Previous quote"
                    className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">west</span>
                  </button>
                  <button
                    aria-label="Next quote"
                    className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">east</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {/* Testimonial 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-[20px] shadow-sm flex flex-col justify-between border border-surface-container-high/40">
                  <div>
                    <div className="flex items-center gap-1 text-[#D97706] mb-space-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant italic">
                      "We used to throw away at least 15 trays of fresh catering food every Friday evening. With FOODLOOP, an NGO driver arrives before we even lock the kitchen doors. It gives our whole staff immense peace of mind."
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm mt-space-lg pt-space-sm">
                    <img
                      className="w-11 h-11 rounded-full object-cover"
                      alt="Elena Vance"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBktJq3xeMWKCzRlhpKndMJZJif1-LJypzizXaHncBJILeEGl3F0UxwgvwufN94qBvpHIEut12qDUpVW8UN8kfQJYD3pHEX3gYw0T0610y4IANQ6SH1brV9LtjlnXusRNKRFDU8sn3AImqsjjgTymBhJ3395f0IIjOW8u2R7G8CLSdym8uId9846Z-N9-2Qibsw0NikEEhzfTLTemT3vdui9bFf9O4pFCitjY5hI6k"
                    />
                    <div>
                      <div className="font-label-md text-label-md font-bold text-primary">Elena Vance</div>
                      <div className="font-body-sm text-body-sm text-outline">Executive Chef, Aurora Hospitality</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-[20px] shadow-sm flex flex-col justify-between border border-surface-container-high/40">
                  <div>
                    <div className="flex items-center gap-1 text-[#D97706] mb-space-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant italic">
                      "The automated PayPal micro-settlement makes operations painless. When community drivers deliver to our pantry, the system handles expense reimbursements transparently and immediately."
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm mt-space-lg pt-space-sm">
                    <img
                      className="w-11 h-11 rounded-full object-cover"
                      alt="Marcus Thorne"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPkUfOMhLNHE6cOPieJXAPvMKZR7beIDQgXKcuBRyxnPK25Rg7p88CVFZRbeYyxWT3ZYKDPCSBLTQc6X3DOof_Psz4_CR2YyZ6s2kG1lWYSg-NcZZN0CY1rGrtYpraaZNwPx_jIwCFW5SfvC_XWxYV3-4suZHSgYjvhtXYUw0Ty8GAABPVi5usR_YRNQhtCDPruCD7rHCSfeaUB6MImN0Mdz6ca87wIZBZhX7jt70"
                    />
                    <div>
                      <div className="font-label-md text-label-md font-bold text-primary">Marcus Thorne</div>
                      <div className="font-body-sm text-body-sm text-outline">Director, Hope Harbor Shelter</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-[20px] shadow-sm flex flex-col justify-between border border-surface-container-high/40">
                  <div>
                    <div className="flex items-center gap-1 text-[#D97706] mb-space-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant italic">
                      "As a grad student living on a tight budget, the app connects me to great bakery boxes that would otherwise go to waste. It feels respectful, high-tech, and genuinely community-driven."
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm mt-space-lg pt-space-sm">
                    <img
                      className="w-11 h-11 rounded-full object-cover"
                      alt="Sarah Lin"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC60G6syg22rZNiyrH-qZjrV8oQt2_8L_VGvZ0FFJAoQUxYyltpcOf8TvsT6NpmBuYJuAnh-PpgF_1TpRAQJkI-X2MIsef2GNyccnT56K7lCYUS-8VKv93DahLbb15XyNe6o8XH4sES2HIAVue1oezH_pGp-7tNU66rxsFK5gJNzRL_ujsR-tSyG6XFZxQvVNUMNtdKC10Wye_3Nb7jUSn-3EIViWjJXjGKqSIm3QQ"
                    />
                    <div>
                      <div className="font-label-md text-label-md font-bold text-primary">Sarah Lin</div>
                      <div className="font-body-sm text-body-sm text-outline">Community Recipient, Metro Area</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="max-w-[1440px] mx-auto px-gutter pb-space-xl">
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary via-primary-container to-tertiary-container p-space-xl text-on-primary shadow-xl">
                <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 max-w-2xl space-y-space-md">
                  <span className="px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary-fixed">
                    Join The Loop Today
                  </span>
                  <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-primary">
                    Every Meal Deserves a Chance.<br />
                    Start Rescuing in Your City.
                  </h2>
                  <p className="font-body-lg text-body-lg text-primary-fixed">
                    Whether you are a commercial donor, a local relief organization, or an individual champion, zero food waste starts with your next action.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                    <button
                      onClick={() => onNavigate('explore-food')}
                      className="h-11 px-6 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold flex items-center justify-center hover:bg-surface-container-low transition-all cursor-pointer"
                    >
                      Claim Food Nearby
                    </button>
                    <button
                      onClick={() => onNavigate('donor-portal')}
                      className="h-11 px-6 rounded-lg bg-secondary text-white font-label-lg text-label-lg font-bold flex items-center justify-center hover:bg-secondary-container transition-all cursor-pointer"
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

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,48,135,0.03)] border-t border-surface-container-high/60 mt-space-xl py-space-xl">
        <div className="max-w-[1440px] mx-auto px-gutter">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="FOODLOOP Brand Logo"
                className="h-6 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                FOODLOOP
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant ml-space-sm hidden sm:inline">
                Every Meal Deserves a Chance.
              </span>
            </div>

            <div className="flex items-center gap-space-lg font-label-md text-label-md text-on-surface-variant">
              <button onClick={() => onNavigate('impact')} className="hover:text-primary transition-colors cursor-pointer">
                Fintech Ledger Terms
              </button>
              <a href="/api/openapi.json" target="_blank" className="hover:text-primary transition-colors">
                API Docs (OpenAPI 3.1)
              </a>
              <button onClick={() => onNavigate('ai-rescue-agent')} className="hover:text-primary transition-colors cursor-pointer">
                AI Dispatch Agent
              </button>
            </div>
          </div>

          <div className="mt-space-lg text-center md:text-left font-body-sm text-body-sm text-outline">
            © 2026 FOODLOOP Global Redistribution Technologies. Institutional Grade Logistics &amp; Settlement via PayPal.
          </div>
        </div>
      </footer>
    </div>
  );
};
