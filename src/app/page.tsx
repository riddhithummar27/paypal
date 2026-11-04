'use client';

import React, { useState } from 'react';
import { HomePage } from '@/components/HomePage';
import { ExploreFoodPage } from '@/components/ExploreFoodPage';
import { Navbar } from '@/components/Navbar';
import { SurplusMarketplace } from '@/components/SurplusMarketplace';
import { MealSponsorship } from '@/components/MealSponsorship';
import { DonorPortal } from '@/components/DonorPortal';
import { NgoLogisticsGrid } from '@/components/NgoLogisticsGrid';
import { BryntumDispatchScheduler } from '@/components/BryntumDispatchScheduler';
import { AutonomousAgentConsole } from '@/components/AutonomousAgentConsole';
import { NgoHubPage } from '@/components/NgoHubPage';
import { ImpactPage } from '@/components/ImpactPage';
import { RewardsModal } from '@/components/RewardsModal';
import { ApiDocsModal } from '@/components/ApiDocsModal';
import { SponsorShowcaseModal } from '@/components/SponsorShowcaseModal';

import {
  INITIAL_FOOD_LISTINGS,
  INITIAL_SPONSORSHIPS,
  INITIAL_DISPATCH_SLOTS,
  INITIAL_REWARD_PROFILE,
  INITIAL_AGENT_LOGS,
} from '@/lib/mockData';
import { FoodListing, SponsorshipCampaign, DispatchSlot, RewardProfile } from '@/types/foodloop';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeRole, setActiveRole] = useState<string>('donor');
  const [listings, setListings] = useState<FoodListing[]>(INITIAL_FOOD_LISTINGS);
  const [campaigns, setCampaigns] = useState<SponsorshipCampaign[]>(INITIAL_SPONSORSHIPS);
  const [dispatchSlots, setDispatchSlots] = useState<DispatchSlot[]>(INITIAL_DISPATCH_SLOTS);
  const [rewardProfile, setRewardProfile] = useState<RewardProfile>(INITIAL_REWARD_PROFILE);

  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isSponsorsOpen, setIsSponsorsOpen] = useState(false);

  const [stats, setStats] = useState({
    mealsRescued: 142890,
    co2Kg: 89400,
    moneySaved: 48250,
    mealsSponsored: 1280,
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
    setActiveTab('ngo');
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

  // Role and route synchronization across all 4 dashboards
  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    if (role === 'donor') setActiveTab('donor');
    else if (role === 'recipient') setActiveTab('marketplace');
    else if (role === 'ngo') setActiveTab('ngo');
    else if (role === 'admin') setActiveTab('agent');
  };

  // Route switcher translation
  const handlePageNavigation = (page: string) => {
    if (page === 'home') {
      setActiveTab('home');
    } else if (page === 'explore-food' || page === 'marketplace') {
      setActiveTab('marketplace');
      setActiveRole('recipient');
    } else if (page === 'ai-rescue-agent' || page === 'agent' || page === 'admin') {
      setActiveTab('agent');
      setActiveRole('admin');
    } else if (page === 'donor-portal' || page === 'donor') {
      setActiveTab('donor');
      setActiveRole('donor');
    } else if (page === 'ngo-hub' || page === 'ngo') {
      setActiveTab('ngo');
      setActiveRole('ngo');
    } else if (page === 'impact' || page === 'sponsorship') {
      setActiveTab('sponsorship');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* If activeTab is home or marketplace, show the dedicated bespoke page designs */}
      {activeTab === 'home' ? (
        <HomePage
          onNavigate={handlePageNavigation}
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          onOpenSponsors={() => setIsSponsorsOpen(true)}
        />
      ) : activeTab === 'marketplace' ? (
        <ExploreFoodPage
          onNavigate={handlePageNavigation}
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          onOpenSponsors={() => setIsSponsorsOpen(true)}
          onOrderCompleted={handleOrderCompleted}
        />
      ) : activeTab === 'donor' ? (
        <DonorPortal
          onNavigate={handlePageNavigation}
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          onOpenSponsors={() => setIsSponsorsOpen(true)}
          onAddListing={handleAddListing}
        />
      ) : activeTab === 'agent' ? (
        <AutonomousAgentConsole
          onNavigate={handlePageNavigation}
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          onOpenSponsors={() => setIsSponsorsOpen(true)}
          initialLogs={INITIAL_AGENT_LOGS}
          onTriggerRescueChallenge={handleTriggerRescueChallenge}
          onAgentAction={handleAgentAction}
        />
      ) : activeTab === 'ngo' ? (
        <NgoHubPage
          onNavigate={handlePageNavigation}
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          onOpenSponsors={() => setIsSponsorsOpen(true)}
          onClaimBatch={handleClaimBatch}
        />
      ) : activeTab === 'sponsorship' ? (
        <ImpactPage
          onNavigate={handlePageNavigation}
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          onOpenSponsors={() => setIsSponsorsOpen(true)}
          onSponsorshipCompleted={handleSponsorshipCompleted}
        />
      ) : (
        <>
          {/* Subpage Header with Back to Home button */}
          <div className="bg-surface-container-lowest border-b border-surface-container-high px-gutter py-2.5 flex items-center justify-between text-xs sticky top-0 z-40">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 font-bold text-primary hover:text-secondary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface-variant">Active Module:</span>
              <span className="px-2 py-0.5 rounded bg-secondary-fixed text-primary font-bold uppercase text-[10px]">
                {activeTab}
              </span>
            </div>

            <button
              onClick={() => setIsSponsorsOpen(true)}
              className="px-2.5 py-1 rounded bg-[#ffc439] text-[#001435] font-black text-[11px] cursor-pointer"
            >
              Sponsors (5)
            </button>
          </div>

          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenRewards={() => setIsRewardsOpen(true)}
            onOpenApiDocs={() => setIsApiDocsOpen(true)}
            onOpenSponsors={() => setIsSponsorsOpen(true)}
            stats={stats}
          />

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


            {activeTab === 'ngo' && (
              <div className="space-y-8">
                <NgoLogisticsGrid
                  listings={listings}
                  onClaimBatch={handleClaimBatch}
                />
                <BryntumDispatchScheduler
                  slots={dispatchSlots}
                  onStatusUpdate={handleDispatchStatusUpdate}
                />
              </div>
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
        </>
      )}

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

      <SponsorShowcaseModal
        isOpen={isSponsorsOpen}
        onClose={() => setIsSponsorsOpen(false)}
      />
    </div>
  );
}
