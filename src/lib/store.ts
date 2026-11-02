import { FoodListing, DispatchSlot } from '@/types/foodloop';
import { INITIAL_FOOD_LISTINGS, INITIAL_DISPATCH_SLOTS } from './mockData';

// Global in-memory stores for API operations
declare global {
  var _foodloopListings: FoodListing[] | undefined;
  var _foodloopDispatches: DispatchSlot[] | undefined;
  var _foodloopCustodyLedger: Array<{
    handoverId: string;
    lotId: string;
    verifiedAt: string;
    verifier: string;
    status: string;
    pointsAwarded: number;
  }> | undefined;
}

export function getListingsStore(): FoodListing[] {
  if (!global._foodloopListings) {
    global._foodloopListings = [...INITIAL_FOOD_LISTINGS];
  }
  return global._foodloopListings;
}

export function addListingToStore(listing: FoodListing): FoodListing {
  const store = getListingsStore();
  store.unshift(listing);
  return listing;
}

export function updateListingInStore(id: string, updates: Partial<FoodListing>): FoodListing | null {
  const store = getListingsStore();
  const index = store.findIndex((l) => l.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...updates };
  return store[index];
}

export function getDispatchesStore(): DispatchSlot[] {
  if (!global._foodloopDispatches) {
    global._foodloopDispatches = [...INITIAL_DISPATCH_SLOTS];
  }
  return global._foodloopDispatches;
}

export function addDispatchSlot(slot: DispatchSlot): DispatchSlot {
  const store = getDispatchesStore();
  store.unshift(slot);
  return slot;
}

export function updateDispatchSlot(id: string, status: DispatchSlot['status']): DispatchSlot | null {
  const store = getDispatchesStore();
  const slot = store.find((s) => s.id === id);
  if (!slot) return null;
  slot.status = status;
  return slot;
}

export function recordCustodyHandshake(lotId: string, verifier = 'Authorized NGO Courier') {
  if (!global._foodloopCustodyLedger) {
    global._foodloopCustodyLedger = [];
  }
  const entry = {
    handoverId: `CUSTODY-${Date.now().toString(36).toUpperCase()}`,
    lotId,
    verifiedAt: new Date().toISOString(),
    verifier,
    status: 'AUTHENTICATED_AND_ESCROW_RELEASED',
    pointsAwarded: 95,
  };
  global._foodloopCustodyLedger.unshift(entry);
  return entry;
}
