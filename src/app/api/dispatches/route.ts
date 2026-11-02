import { NextRequest, NextResponse } from 'next/server';
import { getDispatchesStore, addDispatchSlot, updateDispatchSlot } from '@/lib/store';
import { DispatchSlot } from '@/types/foodloop';

export async function GET() {
  try {
    const slots = getDispatchesStore();
    return NextResponse.json({
      success: true,
      count: slots.length,
      slots,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve dispatches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { batchId, foodTitle, donorName, shelterName, portions, timeSlot, urgency, vehicleType } = body;

    const newSlot: DispatchSlot = {
      id: `DSP-${Date.now().toString().slice(-4)}`,
      batchId: batchId || `FL-${Date.now().toString().slice(-4)}`,
      foodTitle: foodTitle || 'Surplus Food Lot',
      donorName: donorName || 'Verified Donor Partner',
      shelterName: shelterName || 'Hope Mission Shelter',
      portions: Number(portions) || 40,
      timeSlot: timeSlot || 'Within 45 mins',
      status: 'Volunteer Assigned',
      volunteerName: body.volunteerName || 'Automated Courier Fleet',
      vehicleType: vehicleType || (portions > 35 ? 'Van' : 'Cargo Bike'),
      urgency: urgency || 'Standard',
    };

    const saved = addDispatchSlot(newSlot);

    return NextResponse.json({
      success: true,
      message: 'Dispatch slot scheduled into Bryntum Logistics Engine',
      slot: saved,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create dispatch slot' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Dispatch Slot ID and status are required' }, { status: 400 });
    }

    const updated = updateDispatchSlot(id, status);

    if (!updated) {
      return NextResponse.json({ error: 'Dispatch slot not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Dispatch slot ${id} status advanced to ${status}`,
      slot: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update dispatch status' }, { status: 500 });
  }
}
