'use client';

import React, { useState } from 'react';
import { FoodCategory, DonorType, FoodListing } from '@/types/foodloop';
import {
  Sparkles,
  Flame,
  ShieldCheck,
  Plus,
  AlertTriangle,
  Clock,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

interface DonorPortalProps {
  onAddListing: (listing: FoodListing) => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({ onAddListing }) => {
  const [title, setTitle] = useState('');
  const [donorName, setDonorName] = useState('Urban Bites Kitchen');
  const [donorType, setDonorType] = useState<DonorType>('Restaurant');
  const [category, setCategory] = useState<FoodCategory>('Meals');
  const [portions, setPortions] = useState(20);
  const [isFree, setIsFree] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(8.0);
  const [pickupMinutes, setPickupMinutes] = useState(45);
  const [storageTemp, setStorageTemp] = useState<'Hot (>60°C)' | 'Chilled (<5°C)' | 'Room Temp (15-25°C)'>('Hot (>60°C)');
  const [location, setLocation] = useState('220 Market Square');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(['Gluten']);
  const [safetyDeclared, setSafetyDeclared] = useState(true);

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const allergenOptions = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy', 'Fish', 'Sesame'];

  const handleToggleAllergen = (item: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleRunAiScanner = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/pricing-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrice: isFree ? 0 : originalPrice,
          minutesRemaining: pickupMinutes,
          category,
          storageTemp,
          portions,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error('AI Scan error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a food title');
      return;
    }

    const calculatedPrice = isFree
      ? 0
      : aiAnalysis?.recommendedPrice || Number((originalPrice * 0.45).toFixed(2));
    const calculatedDiscount = isFree ? 100 : aiAnalysis?.discountPercent || 55;

    const newListing: FoodListing = {
      id: `FL-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      donorName,
      donorType,
      category,
      portions: Number(portions),
      originalPrice: isFree ? 0 : Number(originalPrice),
      currentPrice: calculatedPrice,
      discountPercent: calculatedDiscount,
      isFree,
      prepTime: 'Just Prepared',
      expiryTime: `In ${pickupMinutes} mins`,
      pickupDeadlineMinutes: Number(pickupMinutes),
      location,
      distanceKm: 1.2,
      allergens: selectedAllergens,
      storageTemp,
      safetyDeclaration: safetyDeclared,
      imageUrl:
        category === 'Bakery'
          ? 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
          : category === 'Produce'
          ? 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      status: 'available',
    };

    onAddListing(newListing);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setTitle('');
  };

  return (
    <section className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Food Safety & Dynamic Pricing Scanner</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            List Surplus Food for Donation or Discounted Rescue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Whether you are a university canteen, hostel, bakery, or hotel buffet, list your surplus portions here. Free donations remain 100% free; discounted sales link directly to PayPal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Listing uploaded successfully and broadcast to AI Rescue Agent & AG Grid!
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Food Item / Surplus Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. 25 Freshly Baked Bagels & Pastries, 40 Portions Vegetable Biryani"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Donor Name</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Donor Type</label>
              <select
                value={donorType}
                onChange={(e) => setDonorType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="University Canteen">University Canteen / Hostel</option>
                <option value="Hotel & Buffet">Hotel & Buffet</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Catering">Catering / Event</option>
                <option value="Household">Household</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Meals">Cooked Meals</option>
                <option value="Bakery">Bakery & Pastry</option>
                <option value="Produce">Produce / Fruits & Veg</option>
                <option value="Dairy">Dairy & Dairy Products</option>
                <option value="Packaged">Packaged / Dry Goods</option>
              </select>
            </div>
          </div>

          {/* Pricing Model Choice */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
            <label className="text-xs font-bold text-slate-200">Redistribution Type:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="pricingModel"
                  checked={isFree}
                  onChange={() => setIsFree(true)}
                  className="text-emerald-500 focus:ring-emerald-500"
                />
                <span className="font-semibold text-emerald-400">100% Free Donation</span> (To Shelters / NGOs)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="pricingModel"
                  checked={!isFree}
                  onChange={() => setIsFree(false)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="font-semibold text-blue-400">Discounted Surplus Sale</span> (via PayPal Sandbox)
              </label>
            </div>

            {!isFree && (
              <div className="pt-2 flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[11px] text-slate-400">Original Menu Price per Portion ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white mt-1"
                  />
                </div>
                <div className="text-xs text-slate-400 pt-4">
                  AI will compute optimal dynamic markdown for maximum rescue.
                </div>
              </div>
            )}
          </div>

          {/* Portions, Pickup Window & Temp Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Total Portions</label>
              <input
                type="number"
                min="1"
                value={portions}
                onChange={(e) => setPortions(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Pickup Cutoff (Minutes)</label>
              <input
                type="number"
                min="10"
                max="360"
                value={pickupMinutes}
                onChange={(e) => setPickupMinutes(parseInt(e.target.value, 10) || 45)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Storage Temperature</label>
              <select
                value={storageTemp}
                onChange={(e) => setStorageTemp(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Hot (>60°C)">Hot Held (&gt;60°C)</option>
                <option value="Chilled (<5°C)">Chilled (&lt;5°C)</option>
                <option value="Room Temp (15-25°C)">Room Temp (15-25°C)</option>
              </select>
            </div>
          </div>

          {/* Allergens Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Contains Allergens (Select all that apply):</label>
            <div className="flex flex-wrap gap-2">
              {allergenOptions.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleToggleAllergen(item)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    selectedAllergens.includes(item)
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Food Safety Declaration */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-3">
            <input
              type="checkbox"
              id="safety"
              checked={safetyDeclared}
              onChange={(e) => setSafetyDeclared(e.target.checked)}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="safety" className="text-xs text-slate-300 cursor-pointer">
              <strong className="text-white">Donor Food Safety & Hygiene Declaration:</strong> I confirm this food was prepared under clean, hygienic standards, handled with food-grade utensils, and stored at designated temperature limits.
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleRunAiScanner}
              disabled={isAnalyzing}
              className="flex-1 py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{isAnalyzing ? 'Scanning with AI...' : 'Run AI Dynamic Pricing Scan'}</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Surplus Listing</span>
            </button>
          </div>
        </form>

        {/* Right: AI Intelligence Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Live AI Safety & Pricing Preview</span>
            </div>

            {aiAnalysis ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Recommended Price:</span>
                    <span className="text-2xl font-black text-emerald-400">
                      ${aiAnalysis.recommendedPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Suggested Markdown:</span>
                    <span className="font-bold text-blue-400">{aiAnalysis.discountPercent}% OFF</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Estimated Rescue Rate:</span>
                    <span className="font-bold text-amber-300">{aiAnalysis.estimatedRescueProbability}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 space-y-1.5">
                  <span className="font-bold text-white">Food Safety Guideline:</span>
                  {aiAnalysis.safetyRecommendations?.map((rec: string, i: number) => (
                    <p key={i} className="text-[11px] text-slate-400">• {rec}</p>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  "{aiAnalysis.explanation}"
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-800/40 border border-dashed border-slate-700 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">
                  Click <strong>"Run AI Dynamic Pricing Scan"</strong> to calculate shelf-life decay discounts and food safety transit windows.
                </p>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 space-y-1">
            <span className="font-bold flex items-center gap-1 text-blue-400">
              <DollarSign className="w-3.5 h-3.5" /> PayPal Merchant Settlement
            </span>
            <p>
              Discounted surplus sales settle instantly to your configured merchant sandbox account upon customer QR pickup verification.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
