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
  CreditCard,
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
      // Step 1: Create PayPal Order via Orders v2 API
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0a1830] p-6 rounded-2xl border border-[#1b3866] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#0070ba]/20 text-[#009cde] border border-[#0070ba]/40">
              AI Dynamic Markdown
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Surplus Meals & Grocery Rescues
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Surplus inventory dynamically discounted up to 75% as pickup deadlines approach. Checkout securely with PayPal Sandbox.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#0070ba] text-white shadow-md shadow-[#0070ba]/40 font-extrabold'
                  : 'bg-[#0f2242] text-slate-300 hover:bg-[#152e59] border border-[#1b3866]'
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
              className={`group relative rounded-2xl overflow-hidden bg-[#0c1c38] border transition-all duration-300 flex flex-col justify-between ${
                isReserved
                  ? 'border-[#1b3866] opacity-60'
                  : 'border-[#19355e] hover:border-[#0070ba] hover:shadow-2xl hover:shadow-[#0070ba]/15'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-[#09152a]">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1c38] via-[#0c1c38]/30 to-transparent" />

                {/* Discount Badge */}
                {listing.discountPercent > 0 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0070ba] text-white font-black text-xs shadow-lg flex items-center gap-1 border border-white/20">
                    <Tag className="w-3 h-3 text-[#ffc439]" />
                    {listing.discountPercent}% OFF
                  </div>
                )}

                {/* Urgency Badge */}
                <div
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-1.5 ${
                    isUrgent
                      ? 'bg-rose-600/90 text-white animate-pulse'
                      : 'bg-[#071326]/85 text-[#ffc439] border border-[#ffc439]/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{listing.pickupDeadlineMinutes}m left</span>
                </div>

                {/* Storage Condition */}
                <div className="absolute bottom-3 left-3 text-[11px] font-bold text-slate-200 px-2.5 py-0.5 rounded-lg bg-[#001c48]/80 backdrop-blur-sm border border-[#1b3866] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#ffc439]" />
                  {listing.storageTemp}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-bold text-[#009cde]">{listing.donorName}</span>
                    <span className="text-[11px]">{listing.donorType}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-[#009cde] transition-colors line-clamp-2">
                    {listing.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0070ba]" />
                    <span>{listing.location} ({listing.distanceKm} km away)</span>
                  </div>

                  {/* Allergen Tags */}
                  {listing.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {listing.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#071326] text-slate-400 border border-[#1b3866]"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-[#1b3866] flex items-center justify-between">
                  <div>
                    {listing.isFree ? (
                      <div>
                        <span className="text-lg font-black text-emerald-400">FREE</span>
                        <span className="text-xs text-slate-400 ml-1.5 font-medium">Redistribution</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">
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
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#071326] text-slate-400 border border-[#1b3866]">
                      Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="paypal-btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span className="font-black italic text-sm tracking-tighter">P</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b1a33] border border-[#0070ba]/40 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-white space-y-5">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#009cde] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#ffc439]" />
                PayPal Checkout • Sandbox Security
              </div>
              <h3 className="text-lg font-bold text-white">{selectedListing.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Merchant: {selectedListing.donorName} • {selectedListing.location}
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-xl bg-[#071326] border border-[#1b3866] space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Original Menu Price</span>
                <span className="line-through">${selectedListing.originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#009cde] font-bold">
                <span>Dynamic Markdown ({selectedListing.discountPercent}%)</span>
                <span>-${(selectedListing.originalPrice - selectedListing.currentPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Fee</span>
                <span className="text-emerald-400 font-semibold">$0.00 (Waived)</span>
              </div>
              <div className="pt-2 border-t border-[#1b3866] flex justify-between items-center text-sm font-extrabold text-white">
                <span>Total Due</span>
                <span className="text-[#ffc439] text-xl font-black">${selectedListing.currentPrice.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Food Safety & Pickup Advisory */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#ffc439] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Collection Cutoff:</span> Must be picked up within{' '}
                <span className="underline font-black">{selectedListing.pickupDeadlineMinutes} mins</span>. Bring an insulated carrier for hot or chilled meals.
              </div>
            </div>

            {/* Official PayPal Buttons */}
            <div className="space-y-2.5">
              <button
                disabled={isProcessing}
                onClick={() => handleSimulatePayPalCheckout(selectedListing)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm paypal-btn-gold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-[#001435] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-black italic text-lg tracking-tighter">P</span>
                    <span className="font-extrabold text-[#001435]">
                      Pay with PayPal Sandbox (${selectedListing.currentPrice.toFixed(2)})
                    </span>
                  </>
                )}
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleSimulatePayPalCheckout(selectedListing)}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#001c48] hover:bg-[#002868] text-white border border-[#0070ba]/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#009cde]" />
                <span>Debit or Credit Card (Powered by PayPal)</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center font-mono">
                Official PayPal Orders v2 Sandbox Rail. Simulated sandbox approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Successful Pickup Voucher Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-[#0b1a33] border border-[#0070ba] w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-white space-y-5 text-center">
            <button
              onClick={() => setCompletedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#0070ba]/20 text-[#009cde] mx-auto flex items-center justify-center ring-4 ring-[#0070ba]/30">
              <CheckCircle2 className="w-8 h-8 text-[#009cde]" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Authorized via PayPal Sandbox
              </span>
              <h3 className="text-xl font-black text-white mt-2">Digital Pickup Voucher</h3>
              <p className="text-xs text-slate-300 mt-1">
                Show this voucher to {completedOrder.listing.donorName} upon arrival.
              </p>
            </div>

            {/* QR Simulation Box */}
            <div className="p-5 rounded-2xl bg-white text-slate-900 space-y-3 mx-auto max-w-xs shadow-inner">
              <div className="w-40 h-40 mx-auto bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-2">
                <QrCode className="w-28 h-28 text-[#001c48]" />
                <span className="text-[10px] font-mono text-slate-500">{completedOrder.pickupCode}</span>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold uppercase text-slate-500">Pickup Passcode</div>
                <div className="text-2xl font-mono font-black tracking-widest text-[#0070ba]">
                  {completedOrder.pickupCode.replace('FL-QR-', '')}
                </div>
              </div>
            </div>

            <div className="text-left text-xs bg-[#071326] p-3.5 rounded-xl border border-[#1b3866] space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">PayPal Order ID:</span>
                <span className="font-mono text-[#ffc439] font-bold">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup Location:</span>
                <span className="font-semibold text-white">{completedOrder.listing.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Collection Deadline:</span>
                <span className="text-amber-400 font-bold">{completedOrder.listing.expiryTime}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedOrder(null)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#0070ba] hover:bg-[#005ea6] text-white transition-all cursor-pointer"
            >
              Done & Return to Market
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
