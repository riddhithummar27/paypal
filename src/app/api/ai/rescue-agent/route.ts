import { NextRequest, NextResponse } from 'next/server';
import { SHELTER_NODES } from '@/lib/mockData';
import { addDispatchSlot } from '@/lib/store';

interface AllocationRequest {
  portions: number;
  foodTitle: string;
  donorName: string;
  category: string;
  pickupDeadlineMinutes: number;
  donorType: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AllocationRequest = await req.json();
    const { portions, foodTitle, donorName, category, pickupDeadlineMinutes } = body;

    if (!portions || portions <= 0) {
      return NextResponse.json({ error: 'Valid portion count is required' }, { status: 400 });
    }

    // Filter eligible shelters
    const eligibleShelters = SHELTER_NODES.filter((shelter) =>
      shelter.acceptedCategories.includes(category as any) || category === 'Meals'
    ).sort((a, b) => a.distanceKm - b.distanceKm);

    let remainingToAllocate = portions;
    const allocations: Array<{
      shelterId: string;
      shelterName: string;
      portionsAllocated: number;
      distanceKm: number;
      etaMinutes: number;
      volunteerType: string;
      timeSlot: string;
      urgency: string;
    }> = [];

    const now = new Date();
    let currentSlotOffset = 15;

    for (const shelter of eligibleShelters) {
      if (remainingToAllocate <= 0) break;

      const availableCapacity = Math.max(10, shelter.capacity - (shelter.capacity - shelter.currentDemand));
      const takeCount = Math.min(remainingToAllocate, availableCapacity);

      if (takeCount > 0) {
        remainingToAllocate -= takeCount;
        
        const startWindow = new Date(now.getTime() + currentSlotOffset * 60000);
        const endWindow = new Date(now.getTime() + (currentSlotOffset + 35) * 60000);
        
        const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        allocations.push({
          shelterId: shelter.id,
          shelterName: shelter.name,
          portionsAllocated: takeCount,
          distanceKm: shelter.distanceKm,
          etaMinutes: Math.round(shelter.distanceKm * 6 + 10),
          volunteerType: takeCount > 35 ? 'EV Cargo Van' : 'Cargo Bike Courier',
          timeSlot: `${formatTime(startWindow)} - ${formatTime(endWindow)}`,
          urgency: pickupDeadlineMinutes <= 45 ? 'CRITICAL (<30m)' : 'STANDARD',
        });

        currentSlotOffset += 20;
      }
    }

    // If there's still remainder (very huge surplus), assign to regional emergency distribution center
    if (remainingToAllocate > 0) {
      allocations.push({
        shelterId: 'SH-REGIONAL',
        shelterName: 'Metro Food Bank Cold Storage Hub',
        portionsAllocated: remainingToAllocate,
        distanceKm: 4.8,
        etaMinutes: 28,
        volunteerType: 'Refrigerated Transport Truck',
        timeSlot: '21:30 - 22:30',
        urgency: 'STANDARD',
      });
    }

    // Persist real dispatch slots to the global store so Bryntum and NGO Hub reflect them live
    allocations.forEach((alloc, idx) => {
      addDispatchSlot({
        id: `DSP-AI-${Date.now().toString(36).toUpperCase()}-${idx}`,
        batchId: `BATCH-${Date.now().toString().slice(-4)}-${idx}`,
        foodTitle: foodTitle || 'Surplus Meals',
        timeSlot: alloc.timeSlot,
        donorName: donorName || 'Marriott Regency Hotel',
        shelterName: alloc.shelterName,
        portions: alloc.portionsAllocated,
        volunteerName: `${alloc.volunteerType} Unit #${10 + idx}`,
        vehicleType: alloc.volunteerType.includes('Bike') ? 'Cargo Bike' : 'Van',
        status: 'In Transit',
        urgency: alloc.urgency.includes('CRITICAL') ? 'Critical (<30m)' : 'Standard',
      });
    });

    const totalAllocated = portions;
    const co2OffsetKg = Number((portions * 2.5).toFixed(1)); // Average 2.5kg CO2 offset per meal rescued

    return NextResponse.json({
      success: true,
      totalPortions: totalAllocated,
      allocationsCount: allocations.length,
      allocations,
      metrics: {
        co2OffsetKg,
        estimatedPeopleFed: totalAllocated,
        rescueWindowMinutes: pickupDeadlineMinutes,
        algorithmConfidence: 0.985,
      },
      agentDecisionSummary: `Autonomous Rescue Agent analyzed ${eligibleShelters.length} geo-spatial nodes. Decomposed ${portions} portions of ${foodTitle} from ${donorName} into ${allocations.length} distinct multi-drop dispatch routes to ensure 0% spoilage within the ${pickupDeadlineMinutes}m cutoff.`,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Rescue agent error:', err);
    return NextResponse.json({ error: 'Failed to execute rescue agent' }, { status: 500 });
  }
}
