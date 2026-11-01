'use client';

import React from 'react';
import {
  ShoppingBag,
  HeartHandshake,
  PlusCircle,
  TableProperties,
  Clock,
  Bot,
  Award,
  FileCode,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRewards: () => void;
  onOpenApiDocs: () => void;
  onOpenSponsors: () => void;
  stats: {
    mealsRescued: number;
    co2Kg: number;
    moneySaved: number;
    mealsSponsored: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRewards,
  onOpenApiDocs,
  onOpenSponsors,
  stats,
}) => {
  const tabs = [
    { id: 'marketplace', label: 'Surplus Deals', icon: ShoppingBag, tag: 'PayPal' },
    { id: 'sponsorship', label: 'Sponsor Meals', icon: HeartHandshake, tag: 'Pay-It-Forward' },
    { id: 'donor', label: 'List Food', icon: PlusCircle, tag: 'AI Scan' },
    { id: 'ngo', label: 'NGO Logistics', icon: TableProperties, tag: 'AG Grid' },
    { id: 'scheduler', label: 'Fleet Timeline', icon: Clock, tag: 'Bryntum' },
    { id: 'agent', label: 'Rescue AI Copilot', icon: Bot, tag: 'Autonomous' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#071326]/95 backdrop-blur-md border-b border-[#1b3866] shadow-xl text-white">
      {/* Top PayPal Official Status Bar */}
      <div className="bg-[#001c48] px-4 py-1.5 border-b border-[#003087]/50 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0070ba]/20 text-[#009cde] font-semibold border border-[#0070ba]/40 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009cde] animate-pulse"></span>
              PayPal Developer Sandbox
            </span>
            <span className="text-slate-400 hidden sm:inline text-[11px]">
              Autonomous Food Intelligence & Community Redistribution
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <div>
              <span className="text-[#009cde] font-bold">{stats.mealsRescued.toLocaleString()}</span> meals rescued
            </div>
            <div className="hidden md:block text-slate-600">•</div>
            <div className="hidden md:block">
              <span className="text-emerald-400 font-bold">{stats.co2Kg.toLocaleString()} kg</span> CO₂ saved
            </div>
            <div className="hidden md:block text-slate-600">•</div>
            <div>
              <span className="text-[#ffc439] font-bold">{stats.mealsSponsored.toLocaleString()}</span> meals sponsored
            </div>
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 bg-[#ffc439]/15 text-[#ffc439] rounded-full border border-[#ffc439]/30 font-semibold text-[10px]">
              <ShieldCheck className="w-3 h-3 text-[#ffc439]" />
              Verified PayPal Rails
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand: Official PayPal Double-P style mark */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('marketplace')}
        >
          {/* Authentic PayPal Monogram Badge */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#003087] via-[#0070ba] to-[#001c48] flex items-center justify-center shadow-lg shadow-[#0070ba]/30 border border-[#009cde]/30 group-hover:scale-105 transition-all">
            <span className="font-black italic text-xl tracking-tighter text-white select-none">
              P<span className="text-[#009cde] -ml-1">P</span>
            </span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffc439] rounded-full ring-2 ring-[#071326]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">FOODLOOP</span>
              <span className="px-1.5 py-0.5 text-[10px] font-black uppercase rounded bg-[#ffc439] text-[#001435]">
                AI 2.0
              </span>
            </div>
            <p className="text-[11px] text-[#009cde] font-semibold tracking-wide">
              POWERED BY PAYPAL DEVELOPER
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0b1a33] p-1 rounded-xl border border-[#1b3866]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0070ba] text-white shadow-md shadow-[#0070ba]/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#13284f]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#009cde]'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffc439]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools / Modals */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSponsors}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#ffc439] text-[#001435] hover:bg-[#f2b828] shadow-md transition-all cursor-pointer"
            title="Official Sponsor Tools & Prize Alignments"
          >
            <Award className="w-3.5 h-3.5 text-[#001435]" />
            <span>Sponsors (5 Active)</span>
          </button>

          <button
            onClick={onOpenRewards}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ffc439]/10 text-[#ffc439] border border-[#ffc439]/30 hover:bg-[#ffc439]/20 transition-all cursor-pointer"
            title="View Sustainability Badges and Rewards"
          >
            <Award className="w-3.5 h-3.5 text-[#ffc439]" />
            <span>Rewards</span>
          </button>

          <button
            onClick={onOpenApiDocs}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0070ba]/15 text-[#009cde] border border-[#0070ba]/30 hover:bg-[#0070ba]/25 transition-all cursor-pointer"
            title="APIMatic & OpenAPI Specs"
          >
            <FileCode className="w-3.5 h-3.5 text-[#009cde]" />
            <span>API Specs</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-3 py-2 bg-[#09162c] border-t border-[#1b3866] no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
                isActive
                  ? 'bg-[#0070ba] text-white'
                  : 'text-slate-300 bg-[#0e2142]'
              }`}
            >
              <Icon className="w-3 h-3 text-[#009cde]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
