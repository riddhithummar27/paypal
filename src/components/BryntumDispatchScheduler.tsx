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
  AlertTriangle,
  MapPin,
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
    if (type === 'Van') return <Truck className="w-4 h-4 text-blue-400" />;
    return <UserCheck className="w-4 h-4 text-purple-400" />;
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
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Bryntum Timeline Architecture
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Rapid Food Rescue Dispatch & Volunteer Schedule
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual resource schedule coordinating tight 30-45 minute safe transit windows between hot kitchens and regional shelters.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Fleet Type:</span>
          <select
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Today's Evening Rescue Runs (19:00 - 22:30)</span>
          </div>
          <span className="text-xs text-slate-500">Live Synchronized</span>
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
                    ? 'bg-slate-900/50 border-slate-800 opacity-60'
                    : isCritical
                    ? 'bg-slate-800/80 border-rose-500/30 shadow-md shadow-rose-500/5'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                {/* Left: Time and Vehicle */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                    {getVehicleIcon(slot.vehicleType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{slot.timeSlot}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{slot.volunteerName}</div>
                  </div>
                </div>

                {/* Center: Mission info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{slot.foodTitle}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {slot.portions} meals
                    </span>
                    {isCritical && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Cutoff &lt;30m
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>From: <strong className="text-slate-300">{slot.donorName}</strong></span>
                    <span>→</span>
                    <span>To: <strong className="text-slate-300">{slot.shelterName}</strong></span>
                  </div>
                </div>

                {/* Right: Status & Advance action */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      slot.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : slot.status === 'In Transit'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {slot.status}
                  </span>

                  {next && (
                    <button
                      onClick={() => onStatusUpdate(slot.id, next)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white transition-all"
                    >
                      <span>Mark {next}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isDelivered && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
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
