'use client';

import React, { useState, useEffect } from 'react';
import { RewardProfile } from '@/types/foodloop';
import { Award, X, Sparkles, Tag, Copy, Check, CheckCircle2 } from 'lucide-react';

interface RewardsModalProps {
  profile: RewardProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({ profile, isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number>(profile.points || 380);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [redeemingCode, setRedeemingCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/rewards')
        .then((res) => res.json())
        .then((data) => {
          if (data.balance) {
            setPointsBalance(data.balance.total_points);
          }
          if (data.coupons) {
            setCoupons(data.coupons);
          }
        })
        .catch((err) => console.warn('Could not fetch rewards:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleRedeem = async (couponCode: string) => {
    setRedeemingCode(couponCode);
    setMessage(null);

    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode }),
      });
      const data = await res.json();
      setRedeemingCode(null);

      if (data.success) {
        setMessage({ text: `🎉 Coupon redeemed! Your voucher code: ${couponCode}` });
        setPointsBalance((prev) => Math.max(0, prev - (data.coupon?.points_required || 50)));
      } else {
        setMessage({ text: data.error || 'Failed to redeem coupon.', isError: true });
      }
    } catch (err: any) {
      setRedeemingCode(null);
      setMessage({ text: err.message || 'Network error.', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative text-white space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Award className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{profile.donorName}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {profile.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified Food Rescue Impact &amp; Partner Sustainability Rewards
            </p>
          </div>
        </div>

        {/* Points & Stats Card */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Available Points</span>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{pointsBalance} pts</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Meals Rescued</span>
            <div className="text-2xl font-black text-white mt-0.5">{profile.mealsRescued}</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">CO₂ Avoided</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{profile.co2SavedKg} kg</div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-bold border ${
              message.isError
                ? 'bg-red-500/20 text-red-200 border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Available Rewards & Partner Coupons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Redeem Partner Coupons</span>
            </h4>
            <span className="text-[11px] text-slate-400">15 pts earned per rescued meal</span>
          </div>

          <div className="space-y-2.5">
            {(coupons.length > 0
              ? coupons
              : [
                  {
                    code: 'RESCUE10',
                    title: '10% Off Organic Grocery Box',
                    points_required: 50,
                    partner_name: 'Whole Foods Co-op',
                  },
                  {
                    code: 'BAKERY50',
                    title: '$5 Off Artisan Bakery Order',
                    points_required: 100,
                    partner_name: 'Le Matin Boulangerie',
                  },
                  {
                    code: 'CAFEFREE',
                    title: 'Free Fair-Trade Coffee or Tea',
                    points_required: 30,
                    partner_name: 'Equator Roasters',
                  },
                ]
            ).map((coupon) => (
              <div
                key={coupon.code}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{coupon.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {coupon.partner_name} • <strong className="text-amber-400">{coupon.points_required} pts</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                    title="Copy coupon code"
                  >
                    {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRedeem(coupon.code)}
                    disabled={redeemingCode === coupon.code || pointsBalance < coupon.points_required}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pointsBalance >= coupon.points_required
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 hover:opacity-90 shadow'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {redeemingCode === coupon.code ? 'Redeeming...' : 'Redeem'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/10">
          <span>Protected by FOODLOOP Verified Collection Protocol</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
