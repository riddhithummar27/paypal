'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SurplusMarketplace } from '@/components/SurplusMarketplace';
import { MealSponsorship } from '@/components/MealSponsorship';
import { DonorPortal } from '@/components/DonorPortal';
import { NgoLogisticsGrid } from '@/components/NgoLogisticsGrid';
import { BryntumDispatchScheduler } from '@/components/BryntumDispatchScheduler';
import { AutonomousAgentConsole } from '@/components/AutonomousAgentConsole';
import { RewardsModal } from '@/components/RewardsModal';
import { ApiDocsModal } from '@/components/ApiDocsModal';

import {
  INITIAL_FOOD_LISTINGS,
  INITIAL_SPONSORSHIPS,
  INITIAL_DISPATCH_SLOTS,
  INITIAL_REWARD_PROFILE,
  INITIAL_AGENT_LOGS,
} from '@/lib/mockData';
import { FoodListing, SponsorshipCampaign, DispatchSlot, RewardProfile } from '@/types/foodloop';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [listings, setListings] = useState<FoodListing[]>(INITIAL_FOOD_LISTINGS);
  const [campaigns, setCampaigns] = useState<SponsorshipCampaign[]>(INITIAL_SPONSORSHIPS);
  const [dispatchSlots, setDispatchSlots] = useState<DispatchSlot[]>(INITIAL_DISPATCH_SLOTS);
  const [rewardProfile, setRewardProfile] = useState<RewardProfile>(INITIAL_REWARD_PROFILE);

  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);

  const [stats, setStats] = useState({
    mealsRescued: 2490,
    co2Kg: 6225,
    moneySaved: 14850,
    mealsSponsored: 480,
  });

  // Handle surplus consumer checkout via PayPal
  const handleOrderCompleted = (listingId: string, orderDetails: any) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? { ...item, status: 'reserved', paypalOrderId: orderDetails.orderId }
          : item
      )
    );

    const listing = listings.find((l) => l.id === listingId);
    if (listing) {
      setStats((s) => ({
        ...s,
        mealsRescued: s.mealsRescued + listing.portions,
        moneySaved: s.moneySaved + (listing.originalPrice - listing.currentPrice) * listing.portions,
        co2Kg: Math.round(s.co2Kg + listing.portions * 2.5),
      }));

      setRewardProfile((r) => ({
        ...r,
        mealsRescued: r.mealsRescued + listing.portions,
        points: r.points + listing.portions * 15,
        co2SavedKg: Number((r.co2SavedKg + listing.portions * 2.5).toFixed(1)),
      }));
    }
  };

  // Handle community meal sponsorship via PayPal
  const handleSponsorshipCompleted = (campaignId: string, portions: number, amount: number) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              fundedPortions: c.fundedPortions + portions,
              status: c.fundedPortions + portions >= c.targetPortions ? 'fulfilled' : 'active',
            }
          : c
      )
    );

    setStats((s) => ({
      ...s,
      mealsSponsored: s.mealsSponsored + portions,
      mealsRescued: s.mealsRescued + portions,
      co2Kg: Math.round(s.co2Kg + portions * 2.5),
    }));
  };

  // Handle new surplus listing by a donor
  const handleAddListing = (newListing: FoodListing) => {
    setListings((prev) => [newListing, ...prev]);
    setActiveTab('ngo'); // Switch to AG Grid to show new row immediately
  };

  // Handle batch claim by an NGO in AG Grid
  const handleClaimBatch = (listingId: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, status: 'in_transit' } : item
      )
    );

    const batch = listings.find((l) => l.id === listingId);
    if (batch) {
      const newSlot: DispatchSlot = {
        id: `DSP-${Date.now().toString().slice(-4)}`,
        batchId: batch.id,
        foodTitle: batch.title,
        donorName: batch.donorName,
        shelterName: 'Hope Mission Shelter',
        portions: batch.portions,
        timeSlot: 'Within 45 mins',
        status: 'Volunteer Assigned',
        volunteerName: 'Auto-Dispatched Courier',
        vehicleType: batch.portions > 30 ? 'Van' : 'Cargo Bike',
        urgency: batch.pickupDeadlineMinutes <= 45 ? 'Critical (<30m)' : 'Standard',
      };
      setDispatchSlots((prev) => [newSlot, ...prev]);
    }
  };

  // Handle Bryntum dispatch status advancement
  const handleDispatchStatusUpdate = (slotId: string, nextStatus: DispatchSlot['status']) => {
    setDispatchSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, status: nextStatus } : slot))
    );

    if (nextStatus === 'Delivered') {
      const slot = dispatchSlots.find((s) => s.id === slotId);
      if (slot) {
        setStats((s) => ({
          ...s,
          mealsRescued: s.mealsRescued + slot.portions,
          co2Kg: Math.round(s.co2Kg + slot.portions * 2.5),
        }));
      }
    }
  };

  // Handle 30-minute challenge simulation from Agent Console
  const handleTriggerRescueChallenge = () => {
    const batch1: DispatchSlot = {
      id: `CHALLENGE-DSP-A`,
      batchId: 'FL-2026-002-A',
      foodTitle: 'Hostel Surplus (Batch 1)',
      donorName: 'State Campus Main Mess',
      shelterName: 'Hope Mission Shelter',
      portions: 50,
      timeSlot: '20:15 - 20:45',
      status: 'In Transit',
      volunteerName: 'Alex Rivera (Cargo Bike)',
      vehicleType: 'Cargo Bike',
      urgency: 'Critical (<30m)',
    };

    const batch2: DispatchSlot = {
      id: `CHALLENGE-DSP-B`,
      batchId: 'FL-2026-002-B',
      foodTitle: 'Hostel Surplus (Batch 2)',
      donorName: 'State Campus Main Mess',
      shelterName: 'Harbor Youth Care Haven',
      portions: 30,
      timeSlot: '20:25 - 20:55',
      status: 'Volunteer Assigned',
      volunteerName: 'Elena Rostova (EV Van)',
      vehicleType: 'Van',
      urgency: 'Critical (<30m)',
    };

    setDispatchSlots((prev) => [batch1, batch2, ...prev]);
    setStats((s) => ({
      ...s,
      mealsRescued: s.mealsRescued + 80,
      co2Kg: Math.round(s.co2Kg + 200),
    }));
  };

  const handleAgentAction = (action: any) => {
    if (action.type === 'PAYPAL_ORDER_CREATED') {
      setStats((s) => ({
        ...s,
        mealsSponsored: s.mealsSponsored + action.portions,
        mealsRescued: s.mealsRescued + action.portions,
        co2Kg: Math.round(s.co2Kg + action.portions * 2.5),
      }));
    } else if (action.type === 'RESCUE_CHALLENGE_SIMULATED') {
      handleTriggerRescueChallenge();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        stats={stats}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === 'marketplace' && (
          <SurplusMarketplace
            listings={listings}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {activeTab === 'sponsorship' && (
          <MealSponsorship
            campaigns={campaigns}
            onSponsorshipCompleted={handleSponsorshipCompleted}
          />
        )}

        {activeTab === 'donor' && <DonorPortal onAddListing={handleAddListing} />}

        {activeTab === 'ngo' && (
          <NgoLogisticsGrid
            listings={listings}
            onClaimBatch={handleClaimBatch}
          />
        )}

        {activeTab === 'scheduler' && (
          <BryntumDispatchScheduler
            slots={dispatchSlots}
            onStatusUpdate={handleDispatchStatusUpdate}
          />
        )}

        {activeTab === 'agent' && (
          <AutonomousAgentConsole
            initialLogs={INITIAL_AGENT_LOGS}
            onTriggerRescueChallenge={handleTriggerRescueChallenge}
            onAgentAction={handleAgentAction}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-300">
              FOODLOOP 2.0 • Build What's Next with PayPal and AI
            </div>
            <p>
              Autonomous Surplus Intelligence & Redistribution. Powered by PayPal Agent Toolkit, AG Grid, Bryntum & APIMatic.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="hover:text-white transition-colors"
            >
              OpenAPI 3.1 Specs
            </button>
            <span>•</span>
            <button
              onClick={() => setIsRewardsOpen(true)}
              className="hover:text-white transition-colors"
            >
              Impact Ledger
            </button>
            <span>•</span>
            <span className="text-emerald-400 font-mono">MIT Open Source</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RewardsModal
        profile={rewardProfile}
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />
    </div>
  );
}
