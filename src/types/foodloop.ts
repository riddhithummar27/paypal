export type FoodCategory = 'Meals' | 'Bakery' | 'Produce' | 'Dairy' | 'Packaged' | 'Beverages';

export type DonorType = 'Restaurant' | 'University Canteen' | 'Hotel & Buffet' | 'Supermarket' | 'Catering' | 'Household';

export type FoodStatus = 'available' | 'reserved' | 'in_transit' | 'rescued' | 'expired';

export interface FoodListing {
  id: string;
  title: string;
  donorName: string;
  donorType: DonorType;
  category: FoodCategory;
  portions: number;
  originalPrice: number;
  currentPrice: number;
  discountPercent: number;
  isFree: boolean;
  prepTime: string;
  expiryTime: string;
  pickupDeadlineMinutes: number;
  location: string;
  distanceKm: number;
  lat?: number;
  lng?: number;
  allergens: string[];
  storageTemp: 'Hot (>60°C)' | 'Chilled (<5°C)' | 'Room Temp (15-25°C)';
  safetyDeclaration: boolean;
  imageUrl: string;
  status: FoodStatus;
  claimedBy?: string;
  paypalOrderId?: string;
}

export interface SponsorshipCampaign {
  id: string;
  title: string;
  shelterName: string;
  shelterCapacity: number;
  targetPortions: number;
  fundedPortions: number;
  pricePerMeal: number;
  partnerKitchen: string;
  urgentNeed: boolean;
  dietaryNotes: string;
  status: 'active' | 'fulfilled';
}

export interface ShelterNode {
  id: string;
  name: string;
  type: 'Homeless Shelter' | 'Community Kitchen' | 'Youth Home' | 'Senior Daycare';
  capacity: number;
  currentDemand: number;
  acceptedCategories: FoodCategory[];
  distanceKm: number;
  contactPerson: string;
  address: string;
}

export interface DispatchSlot {
  id: string;
  batchId: string;
  foodTitle: string;
  donorName: string;
  shelterName: string;
  portions: number;
  timeSlot: string; // e.g. "20:00 - 20:45"
  status: 'Scheduled' | 'Volunteer Assigned' | 'In Transit' | 'Delivered';
  volunteerName: string;
  vehicleType: 'Cargo Bike' | 'Car' | 'Van' | 'Foot Courier';
  urgency: 'Critical (<30m)' | 'Standard' | 'Low';
}

export interface RewardProfile {
  donorName: string;
  mealsRescued: number;
  co2SavedKg: number;
  points: number;
  tier: 'Bronze Guardian' | 'Silver Rescuer' | 'Gold Champion' | 'Community Hero';
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    unlockedAt: string;
    description: string;
  }>;
  unlockedVouchers: Array<{
    id: string;
    partner: string;
    discount: string;
    code: string;
    expiresIn: string;
  }>;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  stage: 'Detection' | 'Pricing' | 'Allocation' | 'PayPal Settlement' | 'Dispatch';
  summary: string;
  details: string;
  confidence: number;
  metadata?: Record<string, any>;
}
