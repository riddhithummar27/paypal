'use client';

import React, { useState } from 'react';
import { SponsorshipCampaign } from '@/types/foodloop';
import {
  Heart,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
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
      {/* Header Banner in PayPal Navy & Classic Blue */}
      <div className="bg-gradient-to-r from-[#001c48] via-[#002c6c] to-[#071326] p-6 rounded-2xl border border-[#0070ba]/40 shadow-2xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ffc439]/20 text-[#ffc439] border border-[#ffc439]/30">
            <Heart className="w-3.5 h-3.5 fill-[#ffc439]" />
            <span>Agentic "Pay-It-Forward" Commerce</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Sponsor Fresh Community Meals via PayPal
          </h2>
          <p className="text-xs text-slate-300">
            Supporter sponsors warm meals directly through PayPal Sandbox $\rightarrow$ Partner commercial kitchen prepares the batch $\rightarrow$ Local shelters & NGOs collect. 100% verified ledger transparency.
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
              className="rounded-2xl bg-[#0c1c38] border border-[#19355e] hover:border-[#0070ba] p-5 flex flex-col justify-between space-y-5 transition-all shadow-xl hover:shadow-[#0070ba]/15"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {camp.urgentNeed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      <Flame className="w-3 h-3 text-rose-400" /> Urgent Tonight
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#071326] text-slate-400">
                      Ongoing Need
                    </span>
                  )}
                  <span className="text-xs font-black text-[#ffc439]">
                    ${camp.pricePerMeal.toFixed(2)} / meal
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white line-clamp-2">{camp.title}</h3>

                <div className="p-3 rounded-xl bg-[#071326] border border-[#1b3866] text-xs space-y-1.5 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#009cde]" />
                    <span>Recipient Shelter: <strong className="text-white">{camp.shelterName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kitchen: <strong className="text-white">{camp.partnerKitchen}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-[#1b3866]">
                    "{camp.dietaryNotes}"
                  </p>
                </div>

                {/* Progress Bar in PayPal Vibrant Blue */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Funded: <strong className="text-white">{camp.fundedPortions}</strong> / {camp.targetPortions} meals</span>
                    <span className="text-[#009cde] font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#071326] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#003087] via-[#0070ba] to-[#009cde] rounded-full transition-all duration-500"
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
                className="w-full py-2.5 rounded-xl text-xs font-bold paypal-btn-gold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="font-black italic text-sm">P</span>
                <span>Sponsor with PayPal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sponsor Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b1a33] border border-[#0070ba]/40 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-white space-y-5">
            <button
              onClick={() => setSelectedCampaign(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#009cde] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#ffc439]" />
                PayPal Community Meal Rails
              </span>
              <h3 className="text-lg font-bold text-white">{selectedCampaign.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Shelter: {selectedCampaign.shelterName} • Kitchen: {selectedCampaign.partnerKitchen}
              </p>
            </div>

            {/* Meal Preset Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Choose Meals to Sponsor:</label>
              <div className="grid grid-cols-4 gap-2">
                {mealPresets.map((count) => {
                  const cost = count * selectedCampaign.pricePerMeal;
                  const isSelected = selectedPortions === count && !customPortions;

                  return (
                    <button
                      key={count}
                      onClick={() => handleSelectPreset(count)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0070ba]/25 border-[#009cde] text-white font-black ring-2 ring-[#0070ba]'
                          : 'bg-[#071326] border-[#1b3866] text-slate-300 hover:bg-[#0e2142]'
                      }`}
                    >
                      <div className="text-base font-extrabold">{count}</div>
                      <div className="text-[10px] text-slate-400">meals</div>
                      <div className="text-xs font-bold text-[#ffc439] mt-1">${cost.toFixed(2)}</div>
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
                  className="flex-1 bg-[#071326] border border-[#1b3866] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0070ba]"
                />
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 rounded-xl bg-[#071326] border border-[#1b3866] flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Meal Impact:</span>
                <div className="text-sm font-bold text-white">
                  {currentPortionCount} meals prepared by {selectedCampaign.partnerKitchen}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Amount Due</span>
                <div className="text-2xl font-black text-[#ffc439]">${currentTotalAmount.toFixed(2)} USD</div>
              </div>
            </div>

            {/* PayPal Button Trigger */}
            <div className="space-y-2">
              <button
                disabled={isProcessing}
                onClick={handleExecuteSponsorship}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm paypal-btn-gold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-[#001435] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-black italic text-lg tracking-tighter">P</span>
                    <span className="font-extrabold text-[#001435]">
                      Confirm & Pay via PayPal Sandbox (${currentTotalAmount.toFixed(2)})
                    </span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center font-mono">
                PayPal Orders v2 Capture Rail. Instant kitchen dispatch upon authorization.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {celebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-[#0b1a33] border border-[#0070ba] w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-white space-y-5 text-center">
            <button
              onClick={() => setCelebrationModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#0070ba]/20 text-[#009cde] mx-auto flex items-center justify-center ring-4 ring-[#0070ba]/30">
              <Sparkles className="w-8 h-8 text-[#ffc439]" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Sponsorship Settled via PayPal
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                You Sponsored {celebrationModal.portions} Meals!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Authorized via PayPal Sandbox. Partner kitchen{' '}
                <strong className="text-white">{celebrationModal.campaign.partnerKitchen}</strong> is preparing the batch for{' '}
                <strong className="text-white">{celebrationModal.campaign.shelterName}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#071326] text-left text-xs space-y-2 border border-[#1b3866]">
              <div className="flex justify-between">
                <span className="text-slate-400">PayPal Order ID:</span>
                <span className="font-mono text-[#ffc439] font-bold">{celebrationModal.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Contribution:</span>
                <span className="font-bold text-[#009cde]">${celebrationModal.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CO₂ Offset Logged:</span>
                <span className="text-emerald-400 font-semibold">{(celebrationModal.portions * 2.5).toFixed(1)} kg CO₂</span>
              </div>
            </div>

            <button
              onClick={() => setCelebrationModal(null)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#0070ba] hover:bg-[#005ea6] text-white transition-all cursor-pointer"
            >
              Close & View Live Impact
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
