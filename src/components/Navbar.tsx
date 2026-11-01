'use client';

import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  HeartHandshake,
  PlusCircle,
  TableProperties,
  Clock,
  Bot,
  Award,
  FileCode,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRewards: () => void;
  onOpenApiDocs: () => void;
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
  stats,
}) => {
  const tabs = [
    { id: 'marketplace', label: 'Surplus Deals', icon: ShoppingBag, badge: 'PayPal' },
    { id: 'sponsorship', label: 'Sponsor Meals', icon: HeartHandshake, badge: 'Agentic' },
    { id: 'donor', label: 'List Food', icon: PlusCircle, badge: 'AI Scan' },
    { id: 'ngo', label: 'NGO Logistics', icon: TableProperties, badge: 'AG Grid' },
    { id: 'scheduler', label: 'Dispatch Timeline', icon: Clock, badge: 'Bryntum' },
    { id: 'agent', label: 'Rescue Agent', icon: Bot, badge: 'Live AI' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-emerald-500/20 shadow-lg text-white">
      {/* Top Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 px-4 py-1.5 border-b border-emerald-500/10 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Rescue Network
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Connecting kitchens, shelters, and consumers via AI & PayPal Rails
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-emerald-400 font-semibold">{stats.mealsRescued.toLocaleString()}</span> meals rescued
            </div>
            <div className="hidden md:block text-slate-600">•</div>
            <div className="hidden md:block">
              <span className="text-emerald-400 font-semibold">{stats.co2Kg.toLocaleString()} kg</span> CO₂ saved
            </div>
            <div className="hidden md:block text-slate-600">•</div>
            <div>
              <span className="text-blue-400 font-semibold">{stats.mealsSponsored.toLocaleString()}</span> meals sponsored
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              PayPal Sandbox Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">FOODLOOP</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                2.0 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Surplus Intelligence & Redistribution</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1 rounded uppercase font-bold ${
                    isActive
                      ? 'bg-black/20 text-emerald-200'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools / Modals */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRewards}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            title="View Sustainability Badges and Rewards"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Rewards</span>
          </button>

          <button
            onClick={onOpenApiDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 hover:bg-blue-500/20 transition-all"
            title="APIMatic & OpenAPI Specs"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">API Specs</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-3 py-2 bg-slate-800/90 border-t border-slate-700/60 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 bg-slate-700/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
