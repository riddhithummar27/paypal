'use client';

import React from 'react';
import { RewardProfile } from '@/types/foodloop';
import {
  Award,
  X,
  Sparkles,
  ShieldCheck,
  Tag,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';

interface RewardsModalProps {
  profile: RewardProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative text-white space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
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
              Verified Food Rescue Impact & Partner Sustainability Rewards
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-[11px] text-slate-400">Meals Rescued</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {profile.mealsRescued}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-[11px] text-slate-400">CO₂ Offset</span>
            <div className="text-xl font-black text-teal-400 mt-0.5">
              {profile.co2SavedKg} kg
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-[11px] text-slate-400">Reward Points</span>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {profile.points} pts
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Unlocked Sustainability Badges
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Verified on Ledger</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col items-center text-center space-y-1.5"
              >
                <div className="text-3xl">{badge.icon}</div>
                <div className="text-xs font-bold text-white">{badge.name}</div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {badge.description}
                </p>
                <span className="text-[9px] text-slate-500 font-mono pt-1">
                  {badge.unlockedAt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Coupons */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Partner-Funded Eco Vouchers
          </span>

          <div className="space-y-2.5">
            {profile.unlockedVouchers.map((vch) => (
              <div
                key={vch.id}
                className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-white">{vch.discount}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {vch.partner} • {vch.expiresIn}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(vch.code)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1.5 transition-all"
                >
                  {copiedCode === vch.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vch.code}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
