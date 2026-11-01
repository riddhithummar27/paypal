'use client';

import React, { useState } from 'react';
import { SponsorshipCampaign } from '@/types/foodloop';
import {
  Heart,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  Users,
  Flame,
  ArrowRight,
  X,
  CreditCard,
} from 'lucide-react';

interface MealSponsorshipProps {
  campaigns: SponsorshipCampaign[];
  onSponsorshipCompleted: (campaignId: string, portions: number, amount: number) => void;
}

export const MealSponsorship: React.FC<MealSponsorshipProps> = ({
  campaigns,
  onSponsorshipCompleted,
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<SponsorshipCampaign | null>(null);
  const [selectedPortions, setSelectedPortions] = useState<number>(5);
  const [customPortions, setCustomPortions] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [celebrationModal, setCelebrationModal] = useState<{
    campaign: SponsorshipCampaign;
    portions: number;
    amount: number;
    orderId: string;
  } | null>(null);

  const mealPresets = [2, 5, 10, 20];

  const handleSelectPreset = (portions: number) => {
    setSelectedPortions(portions);
    setCustomPortions('');
  };

  const currentPortionCount = customPortions ? Math.max(1, parseInt(customPortions, 10) || 1) : selectedPortions;
  const currentTotalAmount = selectedCampaign ? currentPortionCount * selectedCampaign.pricePerMeal : 0;

  const handleExecuteSponsorship = async () => {
    if (!selectedCampaign) return;
    setIsProcessing(true);

    try {
      // Step 1: Create Order via PayPal Sandbox API
      const resOrder = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentTotalAmount,
          currency: 'USD',
          description: `FOODLOOP Community Meal Sponsorship: ${currentPortionCount} meals for ${selectedCampaign.shelterName}`,
          referenceId: `SPON-${selectedCampaign.id}-${Date.now()}`,
        }),
      });
      const orderData = await resOrder.json();

      // Step 2: Capture Order via PayPal Sandbox API
      const resCapture = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderData.id }),
      });
      const captureData = await resCapture.json();

      setCelebrationModal({
        campaign: selectedCampaign,
        portions: currentPortionCount,
        amount: currentTotalAmount,
        orderId: orderData.id,
      });

      onSponsorshipCompleted(selectedCampaign.id, currentPortionCount, currentTotalAmount);
      setSelectedCampaign(null);
    } catch (err) {
      console.error('Sponsorship error:', err);
      alert('Sponsorship processing error. Check console.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-md">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Agentic "Pay-It-Forward" Rails</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Sponsor Fresh Community Meals via PayPal
          </h2>
          <p className="text-sm text-slate-300">
            Supporter sponsors warm meals directly through PayPal Sandbox $\rightarrow$ Verified partner kitchen prepares the batch $\rightarrow$ Local shelters & NGOs collect. 100% transparent tracking.
          </p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((camp) => {
          const progressPercent = Math.min(100, Math.round((camp.fundedPortions / camp.targetPortions) * 100));

          return (
            <div
              key={camp.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 flex flex-col justify-between space-y-5 transition-all shadow-lg hover:shadow-blue-500/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {camp.urgentNeed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <Flame className="w-3 h-3 text-rose-400" /> Urgent Tonight
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      Ongoing Need
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-400">
                    ${camp.pricePerMeal.toFixed(2)} / meal
                  </span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2">{camp.title}</h3>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Recipient Shelter: <strong className="text-white">{camp.shelterName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kitchen: <strong className="text-white">{camp.partnerKitchen}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-700/40">
                    "{camp.dietaryNotes}"
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Funded: <strong className="text-white">{camp.fundedPortions}</strong> / {camp.targetPortions} meals</span>
                    <span className="text-blue-400 font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  setSelectedCampaign(camp);
                  setSelectedPortions(5);
                  setCustomPortions('');
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Sponsor Meals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sponsor Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-white space-y-5">
            <button
              onClick={() => setSelectedCampaign(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                Verified Meal Sponsorship Rail
              </span>
              <h3 className="text-lg font-bold text-white">{selectedCampaign.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Shelter: {selectedCampaign.shelterName} • Kitchen: {selectedCampaign.partnerKitchen}
              </p>
            </div>

            {/* Meal Preset Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Choose Number of Meals to Sponsor:</label>
              <div className="grid grid-cols-4 gap-2">
                {mealPresets.map((count) => {
                  const cost = count * selectedCampaign.pricePerMeal;
                  const isSelected = selectedPortions === count && !customPortions;

                  return (
                    <button
                      key={count}
                      onClick={() => handleSelectPreset(count)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-400 text-white font-bold ring-2 ring-blue-500/30'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="text-base font-extrabold">{count}</div>
                      <div className="text-[10px] text-slate-400">meals</div>
                      <div className="text-xs font-bold text-emerald-400 mt-1">${cost.toFixed(2)}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Or enter custom number of meals..."
                  value={customPortions}
                  onChange={(e) => setCustomPortions(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Sponsorship Impact:</span>
                <div className="text-sm font-semibold text-white">
                  {currentPortionCount} warm meals for shelter guests
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Due</span>
                <div className="text-2xl font-black text-emerald-400">${currentTotalAmount.toFixed(2)} USD</div>
              </div>
            </div>

            {/* PayPal Button Trigger */}
            <div className="space-y-2">
              <button
                disabled={isProcessing}
                onClick={handleExecuteSponsorship}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#0070ba] hover:bg-[#005ea6] text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Confirm & Pay via PayPal Sandbox (${currentTotalAmount.toFixed(2)})</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                Instant authorization via PayPal Sandbox API v2. Kitchen order dispatched immediately upon confirmation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {celebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border border-blue-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-white space-y-5 text-center">
            <button
              onClick={() => setCelebrationModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center ring-4 ring-blue-500/20">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sponsorship Confirmed
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                Thank You! You Sponsored {celebrationModal.portions} Meals!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your payment was received via PayPal Sandbox. Partner kitchen{' '}
                <strong className="text-white">{celebrationModal.campaign.partnerKitchen}</strong> has been notified to prepare the meals for{' '}
                <strong className="text-white">{celebrationModal.campaign.shelterName}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800 text-left text-xs space-y-2 border border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">PayPal Order ID:</span>
                <span className="font-mono text-blue-400 font-bold">{celebrationModal.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Sponsored:</span>
                <span className="font-bold text-emerald-400">${celebrationModal.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated CO₂ Offset:</span>
                <span className="text-white">{(celebrationModal.portions * 2.5).toFixed(1)} kg CO₂</span>
              </div>
            </div>

            <button
              onClick={() => setCelebrationModal(null)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-all"
            >
              Close & View Updated Impact
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
