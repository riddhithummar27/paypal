'use client';

import React, { useState } from 'react';
import { FoodListing } from '@/types/foodloop';
import {
  Clock,
  MapPin,
  Flame,
  ShieldCheck,
  Tag,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

interface SurplusMarketplaceProps {
  listings: FoodListing[];
  onOrderCompleted: (listingId: string, orderDetails: any) => void;
}

export const SurplusMarketplace: React.FC<SurplusMarketplaceProps> = ({
  listings,
  onOrderCompleted,
}) => {
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    listing: FoodListing;
    orderId: string;
    pickupCode: string;
    time: string;
  } | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Meals', 'Bakery', 'Produce', 'Dairy'];

  const filteredListings = listings.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const handleSimulatePayPalCheckout = async (listing: FoodListing) => {
    setIsProcessing(true);
    try {
      // Step 1: Create PayPal Order
      const resOrder = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: listing.currentPrice,
          currency: 'USD',
          description: `FOODLOOP Surplus Rescue: ${listing.title}`,
          referenceId: `FL-${listing.id}`,
        }),
      });
      const orderData = await resOrder.json();

      // Step 2: Capture PayPal Order
      const resCapture = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderData.id }),
      });
      const captureData = await resCapture.json();

      const pickupCode = `FL-QR-${Math.floor(100000 + Math.random() * 900000)}`;

      setCompletedOrder({
        listing,
        orderId: orderData.id,
        pickupCode,
        time: new Date().toLocaleTimeString(),
      });

      onOrderCompleted(listing.id, {
        orderId: orderData.id,
        pickupCode,
        paidAmount: listing.currentPrice,
      });

      setSelectedListing(null);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout error occurred. Check browser console.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI-Discounted Surplus Deals
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Dynamic Pricing
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Surplus inventory dynamically marked down up to 75% as pickup deadlines approach. Pay securely via PayPal Sandbox.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Food Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => {
          const isUrgent = listing.pickupDeadlineMinutes <= 45;
          const isReserved = listing.status !== 'available';

          return (
            <div
              key={listing.id}
              className={`group relative rounded-2xl overflow-hidden bg-slate-900 border transition-all duration-300 flex flex-col justify-between ${
                isReserved
                  ? 'border-slate-800 opacity-60'
                  : 'border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Discount Badge */}
                {listing.discountPercent > 0 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-black text-xs shadow-lg flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {listing.discountPercent}% OFF
                  </div>
                )}

                {/* Urgency Badge */}
                <div
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 ${
                    isUrgent
                      ? 'bg-rose-500/90 text-white animate-pulse'
                      : 'bg-slate-900/80 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{listing.pickupDeadlineMinutes}m left</span>
                </div>

                {/* Storage Condition */}
                <div className="absolute bottom-3 left-3 text-[11px] font-medium text-slate-300 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {listing.storageTemp}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-emerald-400">{listing.donorName}</span>
                    <span>{listing.donorType}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {listing.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{listing.location} ({listing.distanceKm} km away)</span>
                  </div>

                  {/* Allergen Tags */}
                  {listing.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {listing.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    {listing.isFree ? (
                      <div>
                        <span className="text-lg font-black text-emerald-400">FREE</span>
                        <span className="text-xs text-slate-400 ml-1.5">Redistribution</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-white">
                          ${listing.currentPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ${listing.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-400">
                      {listing.portions} portion{listing.portions > 1 ? 's' : ''} available
                    </p>
                  </div>

                  {isReserved ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                    >
                      <span>Pay with PayPal</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-white space-y-5">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                PayPal Sandbox Express Checkout
              </div>
              <h3 className="text-lg font-bold text-white">{selectedListing.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                From: {selectedListing.donorName} • {selectedListing.location}
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Original Menu Price</span>
                <span className="line-through">${selectedListing.originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>AI Shelf-Life Decay Discount ({selectedListing.discountPercent}%)</span>
                <span>-${(selectedListing.originalPrice - selectedListing.currentPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Food Waste Prevention Fee</span>
                <span className="text-emerald-400 font-semibold">$0.00 (Waived)</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-sm font-bold text-white">
                <span>Total to Authorize</span>
                <span className="text-emerald-400 text-lg">${selectedListing.currentPrice.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Food Safety & Pickup Advisory */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Food Safety Pickup Rule:</span> Must be collected within{' '}
                <span className="underline font-bold">{selectedListing.pickupDeadlineMinutes} mins</span>. Bring an insulated carrier for hot/chilled foods.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                disabled={isProcessing}
                onClick={() => handleSimulatePayPalCheckout(selectedListing)}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#0070ba] hover:bg-[#005ea6] text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="italic font-black text-lg">P</span>
                    <span>Pay with PayPal Sandbox (${selectedListing.currentPrice.toFixed(2)})</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Simulated over PayPal Sandbox API v2 Orders & Capture rails. No real funds charged.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Successful Pickup Voucher Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-white space-y-5 text-center">
            <button
              onClick={() => setCompletedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center ring-4 ring-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Payment Authorized & Verified
              </span>
              <h3 className="text-xl font-black text-white mt-2">Food Rescue Voucher Ready</h3>
              <p className="text-xs text-slate-400 mt-1">
                Show this digital voucher to {completedOrder.listing.donorName} at pickup.
              </p>
            </div>

            {/* QR Simulation Box */}
            <div className="p-5 rounded-2xl bg-white text-slate-900 space-y-3 mx-auto max-w-xs shadow-inner">
              <div className="w-40 h-40 mx-auto bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-2">
                <QrCode className="w-28 h-28 text-slate-800" />
                <span className="text-[10px] font-mono text-slate-500">{completedOrder.pickupCode}</span>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold uppercase text-slate-500">Pickup Passcode</div>
                <div className="text-xl font-mono font-black tracking-widest text-emerald-600">
                  {completedOrder.pickupCode.replace('FL-QR-', '')}
                </div>
              </div>
            </div>

            <div className="text-left text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">PayPal Order ID:</span>
                <span className="font-mono text-blue-400">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup Location:</span>
                <span className="font-medium text-white">{completedOrder.listing.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Collection Cutoff:</span>
                <span className="text-amber-400 font-semibold">{completedOrder.listing.expiryTime}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedOrder(null)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-all"
            >
              Done & Return to Market
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
