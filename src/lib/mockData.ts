import { FoodListing, SponsorshipCampaign, ShelterNode, DispatchSlot, RewardProfile, AgentLog } from '@/types/foodloop';

export const INITIAL_FOOD_LISTINGS: FoodListing[] = [
  {
    id: 'FL-2026-001',
    title: 'Surplus Artisan Croissants & Sourdough Loaves',
    donorName: 'Golden Crust Boulangerie',
    donorType: 'Restaurant',
    category: 'Bakery',
    portions: 18,
    originalPrice: 7.50,
    currentPrice: 2.25,
    discountPercent: 70,
    isFree: false,
    prepTime: 'Today, 06:30 AM',
    expiryTime: 'Today, 21:00 (Closes in 50m)',
    pickupDeadlineMinutes: 50,
    location: '42 Market St, Financial District',
    distanceKm: 0.8,
    lat: 42.3550,
    lng: -71.0650,
    allergens: ['Gluten', 'Butter', 'Eggs'],
    storageTemp: 'Room Temp (15-25°C)',
    safetyDeclaration: true,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    status: 'available',
  },
];

export const INITIAL_SPONSORSHIPS: SponsorshipCampaign[] = [
  {
    id: 'SPON-01',
    title: 'Emergency Warm Meals for St. Jude Night Shelter',
    shelterName: 'St. Jude Community Mission',
    shelterCapacity: 85,
    targetPortions: 60,
    fundedPortions: 42,
    pricePerMeal: 2.50,
    partnerKitchen: 'Heritage Community Diner',
    urgentNeed: true,
    dietaryNotes: 'High protein, easy to chew, lactose-free options preferred',
    status: 'active',
  },
];

export const SHELTER_NODES: ShelterNode[] = [
  {
    id: 'SH-01',
    name: 'Hope Mission Shelter',
    type: 'Homeless Shelter',
    capacity: 65,
    currentDemand: 50,
    acceptedCategories: ['Meals', 'Bakery', 'Packaged'],
    distanceKm: 1.2,
    contactPerson: 'Sarah Jenkins',
    address: '14 Elm St, South Ward',
  },
];

export const INITIAL_DISPATCH_SLOTS: DispatchSlot[] = [
  {
    id: 'DSP-101',
    batchId: 'FL-2026-001',
    foodTitle: 'Surplus Artisan Croissants & Loaves',
    donorName: 'Golden Crust Boulangerie',
    shelterName: 'Hope Mission Shelter',
    portions: 18,
    timeSlot: '20:15 - 20:50',
    status: 'In Transit',
    volunteerName: 'Alex Rivera (Bike Courier)',
    vehicleType: 'Cargo Bike',
    urgency: 'Critical (<30m)',
  },
];

export const INITIAL_REWARD_PROFILE: RewardProfile = {
  donorName: 'Golden Crust Boulangerie',
  mealsRescued: 74,
  co2SavedKg: 185.0,
  points: 1480,
  tier: 'Gold Champion',
  badges: [
    {
      id: 'bdg-1',
      name: 'Zero-Waste Pioneer',
      icon: '🌱',
      unlockedAt: 'Oct 14, 2026',
      description: 'First 50kg of food surplus rescued within 45 mins.',
    },
  ],
  unlockedVouchers: [
    {
      id: 'vch-1',
      partner: 'City Agri Supply & Packaging',
      discount: '25% Off Eco-Containers',
      code: 'FOODLOOP-ECO-25',
      expiresIn: 'Valid for 30 days',
    },
  ],
};

export const INITIAL_AGENT_LOGS: AgentLog[] = [
  {
    id: 'log-101',
    timestamp: '20:00:12',
    stage: 'Detection',
    summary: 'Surplus batch reported: Golden Crust Boulangerie (18 portions, Room Temp).',
    details: 'Triggered by kitchen manager. Window cutoff is 50 minutes.',
    confidence: 0.98,
  },
];
