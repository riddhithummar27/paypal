'use client';

import React, { useState } from 'react';
import { DispatchSlot } from '@/types/foodloop';
import {
  Clock,
  Truck,
  Bike,
  UserCheck,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from 'lucide-react';

interface BryntumDispatchSchedulerProps {
  slots: DispatchSlot[];
  onStatusUpdate: (slotId: string, nextStatus: DispatchSlot['status']) => void;
}

export const BryntumDispatchScheduler: React.FC<BryntumDispatchSchedulerProps> = ({
  slots,
  onStatusUpdate,
}) => {
  const [filterVehicle, setFilterVehicle] = useState('ALL');

  const filteredSlots = slots.filter((slot) => {
    if (filterVehicle === 'ALL') return true;
    return slot.vehicleType === filterVehicle;
  });

  const getVehicleIcon = (type: DispatchSlot['vehicleType']) => {
    if (type === 'Cargo Bike') return <Bike className="w-4 h-4 text-emerald-400" />;
    if (type === 'Van') return <Truck className="w-4 h-4 text-[#009cde]" />;
    return <UserCheck className="w-4 h-4 text-[#ffc439]" />;
  };

  const getNextStatus = (current: DispatchSlot['status']): DispatchSlot['status'] | null => {
    if (current === 'Scheduled') return 'Volunteer Assigned';
    if (current === 'Volunteer Assigned') return 'In Transit';
    if (current === 'In Transit') return 'Delivered';
    return null;
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a1830] border border-[#1b3866] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0070ba]/20 text-[#009cde] border border-[#0070ba]/40">
              Bryntum Timeline Architecture
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Rapid Food Rescue Dispatch & Volunteer Schedule
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Visual resource schedule coordinating tight 30-45 minute safe transit windows between hot kitchens and regional shelters.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold">Fleet Type:</span>
          <select
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            className="bg-[#071326] border border-[#1b3866] rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="ALL">All Couriers</option>
            <option value="Cargo Bike">Cargo Bike</option>
            <option value="Van">EV Van</option>
            <option value="Foot Courier">Foot Courier</option>
            <option value="Car">Volunteer Car</option>
          </select>
        </div>
      </div>

      {/* Visual Timeline Grid */}
      <div className="bg-[#0c1c38] border border-[#19355e] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1b3866] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Calendar className="w-4 h-4 text-[#ffc439]" />
            <span>Today's Evening Rescue Runs (19:00 - 22:30)</span>
          </div>
          <span className="text-xs text-[#009cde] font-semibold">Live Synchronized</span>
        </div>

        <div className="space-y-3">
          {filteredSlots.map((slot) => {
            const next = getNextStatus(slot.status);
            const isDelivered = slot.status === 'Delivered';
            const isCritical = slot.urgency.includes('Critical');

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isDelivered
                    ? 'bg-[#071326]/60 border-[#1b3866] opacity-60'
                    : isCritical
                    ? 'bg-[#0e2142] border-rose-500/40 shadow-lg shadow-rose-500/5'
                    : 'bg-[#0e2142] border-[#1b3866]'
                }`}
              >
                {/* Left: Time and Vehicle */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="p-2.5 rounded-lg bg-[#071326] border border-[#1b3866]">
                    {getVehicleIcon(slot.vehicleType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Clock className="w-3.5 h-3.5 text-[#ffc439]" />
                      <span>{slot.timeSlot}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{slot.volunteerName}</div>
                  </div>
                </div>

                {/* Center: Mission info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{slot.foodTitle}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                      {slot.portions} meals
                    </span>
                    {isCritical && (
                      <span className="px-2 py-0.2 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Cutoff &lt;30m
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>From: <strong className="text-slate-200">{slot.donorName}</strong></span>
                    <span>→</span>
                    <span>To: <strong className="text-slate-200">{slot.shelterName}</strong></span>
                  </div>
                </div>

                {/* Right: Status & Advance action */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      slot.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : slot.status === 'In Transit'
                        ? 'bg-[#ffc439]/20 text-[#ffc439] border border-[#ffc439]/30 animate-pulse'
                        : 'bg-[#0070ba]/20 text-[#009cde] border border-[#0070ba]/30'
                    }`}
                  >
                    {slot.status}
                  </span>

                  {next && (
                    <button
                      onClick={() => onStatusUpdate(slot.id, next)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#071326] hover:bg-[#0070ba] text-white border border-[#1b3866] transition-all cursor-pointer"
                    >
                      <span>Mark {next}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isDelivered && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Rescued
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
