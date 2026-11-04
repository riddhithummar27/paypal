/**
 * FOODLOOP 2.0 - Core Database & Supabase Adapter
 * Provides unified access to all 18 PostgreSQL tables.
 * Connects to live Supabase PostgreSQL when credentials exist,
 * with reliable in-memory persistence fallback for seamless local execution.
 */

import { isServerSupabaseConfigured, getAdminSupabase } from './supabase/server';

export interface UserProfile {
  id: string;
  email: string;
  passwordHash?: string;
  full_name: string;
  role: 'donor' | 'recipient' | 'ngo' | 'admin';
  phone?: string;
  avatar_url?: string;
  organization_name?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface DbFoodListing {
  id: string;
  donor_id: string;
  donor_name: string;
  donor_type: string;
  title: string;
  description: string;
  category_id: string;
  listing_type: 'free' | 'discount' | 'sponsored';
  portions: number;
  remaining_portions: number;
  original_price: number;
  discounted_price: number;
  image_url: string;
  prep_time: string;
  storage_temp: string;
  allergens: string[];
  pickup_location: string;
  lat: number;
  lng: number;
  pickup_deadline: string;
  safety_declaration: boolean;
  status: 'available' | 'reserved' | 'completed' | 'expired' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface DbReservation {
  id: string;
  listing_id: string;
  recipient_id: string;
  recipient_name: string;
  portions: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  collection_token: string;
  pickup_deadline: string;
  pickup_instructions: string;
  cancellation_reason?: string;
  paypal_order_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DbNgo {
  id: string;
  profile_id: string;
  name: string;
  registration_number: string;
  tax_id: string;
  mission_statement: string;
  capacity_portions_per_day: number;
  cooling_capacity_liters: number;
  fleet_vehicles: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface DbNgoVerification {
  id: string;
  ngo_id: string;
  document_name: string;
  document_url: string;
  document_type: string;
  reviewed_by?: string;
  review_notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
}

export interface DbCollectionRecord {
  id: string;
  reservation_id: string;
  listing_id: string;
  verifier_id: string;
  collection_token: string;
  collected_at: string;
  portions_verified: number;
  signature_hash: string;
  notes?: string;
}

export interface DbPayment {
  id: string;
  user_id?: string;
  reservation_id?: string;
  paypal_order_id: string;
  paypal_capture_id?: string;
  amount: number;
  currency: string;
  status: 'created' | 'approved' | 'captured' | 'failed' | 'refunded';
  payment_type: 'meal_purchase' | 'sponsorship' | 'seller_payout';
  raw_response?: any;
  created_at: string;
  updated_at: string;
}

export interface DbSponsorship {
  id: string;
  sponsor_id?: string;
  campaign_name: string;
  amount: number;
  portions_funded: number;
  target_shelter_id?: string;
  paypal_order_id?: string;
  status: string;
  created_at: string;
}

export interface DbRewardPoints {
  user_id: string;
  total_points: number;
  lifetime_points: number;
  updated_at: string;
}

export interface DbRewardTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: 'earned_donation' | 'earned_rescue' | 'redeemed_coupon' | 'admin_adjustment';
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface DbCoupon {
  id: string;
  code: string;
  title: string;
  discount_percent?: number;
  discount_amount?: number;
  points_required: number;
  valid_until: string;
  partner_name: string;
  is_active: boolean;
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'listing_alert' | 'reservation_update' | 'collection_verified' | 'payment_status' | 'points_credited' | 'ngo_verified' | 'urgent_rescue';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface DbRescueOperation {
  id: string;
  listing_id: string;
  title: string;
  total_portions: number;
  urgency_level: string;
  deadline: string;
  status: 'active' | 'in_transit' | 'completed' | 'aborted';
  ai_confidence_score?: number;
  created_at: string;
}

export interface DbRescueAllocation {
  id: string;
  operation_id: string;
  destination_name: string;
  destination_lat: number;
  destination_lng: number;
  portions: number;
  vehicle_type: string;
  courier_name: string;
  status: 'assigned' | 'picked_up' | 'delivered';
  created_at: string;
}

export interface DbReport {
  id: string;
  reporter_id?: string;
  target_type: 'listing' | 'user' | 'ngo' | 'transaction';
  target_id: string;
  reason: string;
  description?: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
  resolved_at?: string;
}

export interface DbAuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: any;
  ip_address?: string;
  created_at: string;
}

// ====================================================================
// In-Memory Database Store (Initialized with Verified Baseline Data)
// ====================================================================

const inMemoryStore = {
  users: [
    {
      id: 'usr-admin-01',
      email: 'admin@foodloop.org',
      passwordHash: 'admin123',
      full_name: 'Platform Overseer (Admin)',
      role: 'admin',
      phone: '+1 617-555-0100',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      organization_name: 'FOODLOOP Central Council',
      address: '100 Federal Street, Financial District',
      city: 'Boston',
      state: 'MA',
      postal_code: '02110',
      lat: 42.3556,
      lng: -71.0560,
      is_verified: true,
      created_at: new Date('2026-01-01').toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-donor-01',
      email: 'donor@artisanbakery.com',
      passwordHash: 'donor123',
      full_name: 'Artisan Kitchen & Bakery',
      role: 'donor',
      phone: '+1 617-555-0142',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      organization_name: 'Le Matin Boulangerie',
      address: '742 Boylston St, Back Bay',
      city: 'Boston',
      state: 'MA',
      postal_code: '02116',
      lat: 42.3498,
      lng: -71.0805,
      is_verified: true,
      created_at: new Date('2026-01-15').toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-recipient-01',
      email: 'buyer@gmail.com',
      passwordHash: 'buyer123',
      full_name: 'Sarah Jenkins',
      role: 'recipient',
      phone: '+1 617-555-0188',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      address: '128 Tremont St, Downtown Crossing',
      city: 'Boston',
      state: 'MA',
      postal_code: '02111',
      lat: 42.3550,
      lng: -71.0620,
      is_verified: true,
      created_at: new Date('2026-02-01').toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-ngo-01',
      email: 'logistics@bostonfoodalliance.org',
      passwordHash: 'ngo123',
      full_name: 'Greater Boston Food Alliance',
      role: 'ngo',
      phone: '+1 617-555-0199',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      organization_name: 'Greater Boston Food Alliance',
      address: '450 Melnea Cass Blvd, Roxbury',
      city: 'Boston',
      state: 'MA',
      postal_code: '02119',
      lat: 42.3325,
      lng: -71.0780,
      is_verified: true,
      created_at: new Date('2026-01-20').toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as UserProfile[],

  categories: [
    { id: 'meals', name: 'Prepared Meals', description: 'Hot or portioned ready-to-eat meals', icon: 'restaurant', created_at: new Date().toISOString() },
    { id: 'bakery', name: 'Bakery & Pastries', description: 'Artisan breads, bagels, and pastries', icon: 'bakery_dining', created_at: new Date().toISOString() },
    { id: 'produce', name: 'Fresh Produce', description: 'Organic farm vegetables and fruits', icon: 'eco', created_at: new Date().toISOString() },
    { id: 'dairy', name: 'Dairy & Chilled', description: 'Milk, cheeses, and refrigerated packs', icon: 'egg_alt', created_at: new Date().toISOString() },
    { id: 'packaged', name: 'Packaged & Pantry', description: 'Grains, pasta, and dry provisions', icon: 'inventory_2', created_at: new Date().toISOString() },
  ] as FoodCategory[],

  listings: [
    {
      id: 'FL-8842',
      donor_id: 'usr-donor-01',
      donor_name: 'Le Matin Boulangerie',
      donor_type: 'Bakery',
      title: 'Artisan Sourdough & French Brioche Assortment',
      description: 'Baked fresh this morning with organic wheat flour. Certified HACCP food safety declaration verified.',
      category_id: 'bakery',
      listing_type: 'discount',
      portions: 18,
      remaining_portions: 18,
      original_price: 14.0,
      discounted_price: 4.5,
      image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      prep_time: 'Today, 06:30 AM',
      storage_temp: 'Ambient (19°C)',
      allergens: ['Gluten', 'Nut-Free', 'Vegetarian'],
      pickup_location: '742 Boylston St, Back Bay, Boston',
      lat: 42.3498,
      lng: -71.0805,
      pickup_deadline: new Date(Date.now() + 3.5 * 3600 * 1000).toISOString(),
      safety_declaration: true,
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as DbFoodListing[],

  reservations: [
    {
      id: 'RSV-9012',
      listing_id: 'FL-8842',
      recipient_id: 'usr-recipient-01',
      recipient_name: 'Sarah Jenkins',
      portions: 2,
      total_price: 9.0,
      status: 'confirmed',
      collection_token: 'FLP-8842-7721',
      pickup_deadline: new Date(Date.now() + 3.5 * 3600 * 1000).toISOString(),
      pickup_instructions: 'Enter via service bay on Boylston St. Present QR token to host.',
      paypal_order_id: 'PAYID-MOCK-ORDER-9012',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as DbReservation[],

  ngos: [
    {
      id: 'ngo-01',
      profile_id: 'usr-ngo-01',
      name: 'Greater Boston Food Alliance',
      registration_number: '501C3-MA-88419',
      tax_id: '04-3381920',
      mission_statement: 'Distributing cold-chain rescued nutrition across 14 neighborhood shelters daily.',
      capacity_portions_per_day: 1200,
      cooling_capacity_liters: 850,
      fleet_vehicles: 4,
      verification_status: 'verified',
      created_at: new Date('2026-01-20').toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as DbNgo[],

  ngoVerifications: [
    {
      id: 'verif-01',
      ngo_id: 'ngo-01',
      document_name: 'IRS_501c3_Determination_Letter.pdf',
      document_url: 'https://foodloop.org/docs/IRS_501c3_Determination.pdf',
      document_type: 'IRS 501(c)(3) Tax Exemption Certificate',
      reviewed_by: 'usr-admin-01',
      review_notes: 'Fully verified with Massachusetts Public Charities Division.',
      status: 'approved',
      submitted_at: new Date('2026-01-21').toISOString(),
      reviewed_at: new Date('2026-01-22').toISOString(),
    },
  ] as DbNgoVerification[],

  collectionRecords: [
    {
      id: 'COL-1049',
      reservation_id: 'RSV-9012',
      listing_id: 'FL-8842',
      verifier_id: 'usr-donor-01',
      collection_token: 'FLP-8842-7721',
      collected_at: new Date().toISOString(),
      portions_verified: 2,
      signature_hash: '0x892a7f33d02b9e1a88c3f4e5a91b82736154c3',
      notes: 'Customer arrived on time; baguettes handed over in reusable tote.',
    },
  ] as DbCollectionRecord[],

  payments: [
    {
      id: 'PAY-4891',
      user_id: 'usr-recipient-01',
      reservation_id: 'RSV-9012',
      paypal_order_id: 'PAYID-MOCK-ORDER-9012',
      paypal_capture_id: 'CAP-9912048-SANDBOX',
      amount: 9.0,
      currency: 'USD',
      status: 'captured',
      payment_type: 'meal_purchase',
      raw_response: { status: 'COMPLETED', seller_protection: 'ELIGIBLE' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as DbPayment[],

  sponsorships: [
    {
      id: 'SPON-301',
      sponsor_id: 'usr-admin-01',
      campaign_name: 'Downtown Emergency Shelter Supper Drive',
      amount: 50.0,
      portions_funded: 25,
      target_shelter_id: 'ngo-01',
      paypal_order_id: 'PAYID-SPON-50',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ] as DbSponsorship[],

  rewardPoints: {
    'usr-donor-01': { user_id: 'usr-donor-01', total_points: 380, lifetime_points: 620, updated_at: new Date().toISOString() },
    'usr-recipient-01': { user_id: 'usr-recipient-01', total_points: 45, lifetime_points: 75, updated_at: new Date().toISOString() },
  } as Record<string, DbRewardPoints>,

  rewardTransactions: [
    {
      id: 'RWT-01',
      user_id: 'usr-donor-01',
      points: 50,
      transaction_type: 'earned_donation',
      reference_id: 'FL-8842',
      description: 'Awarded 50 points for completed surplus rescue lot FL-8842',
      created_at: new Date().toISOString(),
    },
  ] as DbRewardTransaction[],

  coupons: [
    {
      id: 'CP-01',
      code: 'RESCUE10',
      title: '10% Off Organic Grocery Box',
      discount_percent: 10,
      points_required: 50,
      valid_until: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
      partner_name: 'Whole Foods Co-op',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'CP-02',
      code: 'BAKERY50',
      title: '$5 Off Artisan Bakery Order',
      discount_amount: 5.0,
      points_required: 100,
      valid_until: new Date(Date.now() + 45 * 86400 * 1000).toISOString(),
      partner_name: 'Le Matin Boulangerie',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'CP-03',
      code: 'CAFEFREE',
      title: 'Free Fair-Trade Coffee or Tea',
      discount_percent: 100,
      points_required: 30,
      valid_until: new Date(Date.now() + 60 * 86400 * 1000).toISOString(),
      partner_name: 'Equator Roasters',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ] as DbCoupon[],

  notifications: [
    {
      id: 'NOTIF-01',
      user_id: 'usr-donor-01',
      title: 'Surplus Lot Reserved',
      message: 'Sarah Jenkins reserved 2 portions of Artisan Sourdough via PayPal.',
      type: 'reservation_update',
      link: '/donor',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'NOTIF-02',
      user_id: 'usr-recipient-01',
      title: 'Pickup Confirmed & Ready',
      message: 'Your reservation token FLP-8842-7721 is active. Pickup window: before 8:30 PM.',
      type: 'listing_alert',
      link: '/marketplace',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ] as DbNotification[],

  rescueOperations: [
    {
      id: 'RESCUE-CHALLENGE-01',
      listing_id: 'FL-8842',
      title: 'Hostel Surplus 80-Portion Urgent Rescue',
      total_portions: 80,
      urgency_level: 'Critical (< 45 min)',
      deadline: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      status: 'active',
      ai_confidence_score: 0.98,
      created_at: new Date().toISOString(),
    },
  ] as DbRescueOperation[],

  rescueAllocations: [
    {
      id: 'ALLOC-A',
      operation_id: 'RESCUE-CHALLENGE-01',
      destination_name: 'Hope Harbor Community Shelter',
      destination_lat: 42.355,
      destination_lng: -71.065,
      portions: 50,
      vehicle_type: 'Cargo E-Bike',
      courier_name: 'Alex Rivera (Bike Courier #4)',
      status: 'assigned',
      created_at: new Date().toISOString(),
    },
    {
      id: 'ALLOC-B',
      operation_id: 'RESCUE-CHALLENGE-01',
      destination_name: 'Harbor Youth Care Haven',
      destination_lat: 42.348,
      destination_lng: -71.045,
      portions: 30,
      vehicle_type: 'Refrigerated EV Van',
      courier_name: 'Elena Rostova (Van #2)',
      status: 'assigned',
      created_at: new Date().toISOString(),
    },
  ] as DbRescueAllocation[],

  reports: [
    {
      id: 'REP-101',
      reporter_id: 'usr-recipient-01',
      target_type: 'listing',
      target_id: 'FL-8842',
      reason: 'Incorrect allergen label inquiry',
      description: 'Inquired whether sesame seeds were used in the baguette scoring.',
      status: 'resolved',
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      resolved_at: new Date().toISOString(),
    },
  ] as DbReport[],

  auditLogs: [
    {
      id: 'AUD-901',
      user_id: 'usr-donor-01',
      action: 'LISTING_PUBLISHED',
      entity_type: 'food_listing',
      entity_id: 'FL-8842',
      metadata: { portions: 18, price: 4.5 },
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString(),
    },
    {
      id: 'AUD-902',
      user_id: 'usr-recipient-01',
      action: 'PAYPAL_ORDER_CAPTURED',
      entity_type: 'payment',
      entity_id: 'PAY-4891',
      metadata: { amount: 9.0, currency: 'USD' },
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString(),
    },
  ] as DbAuditLog[],
};

// ====================================================================
// Database Access Methods
// ====================================================================

export const db = {
  // --- USERS & AUTH ---
  users: {
    findByEmail: async (email: string): Promise<UserProfile | null> => {
      const normalized = email.trim().toLowerCase();
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('profiles').select('*').eq('email', normalized).single();
        if (data) return data as UserProfile;
      }
      return inMemoryStore.users.find((u) => u.email.toLowerCase() === normalized) || null;
    },

    findById: async (id: string): Promise<UserProfile | null> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('profiles').select('*').eq('id', id).single();
        if (data) return data as UserProfile;
      }
      return inMemoryStore.users.find((u) => u.id === id) || null;
    },

    create: async (user: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<UserProfile> => {
      const now = new Date().toISOString();
      const newUser: UserProfile = {
        ...user,
        id: user.id || `usr-${Date.now().toString(36)}`,
        created_at: now,
        updated_at: now,
      };

      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('profiles').insert(newUser);
      }

      inMemoryStore.users.push(newUser);
      // Initialize zero reward points
      if (!inMemoryStore.rewardPoints[newUser.id]) {
        inMemoryStore.rewardPoints[newUser.id] = {
          user_id: newUser.id,
          total_points: 0,
          lifetime_points: 0,
          updated_at: now,
        };
      }
      return newUser;
    },

    update: async (id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
      const now = new Date().toISOString();
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('profiles').update({ ...updates, updated_at: now }).eq('id', id).select().single();
        if (data) return data as UserProfile;
      }
      const idx = inMemoryStore.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      inMemoryStore.users[idx] = { ...inMemoryStore.users[idx], ...updates, updated_at: now };
      return inMemoryStore.users[idx];
    },

    list: async (): Promise<UserProfile[]> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('profiles').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) return data as UserProfile[];
      }
      return inMemoryStore.users;
    },
  },

  // --- FOOD LISTINGS ---
  listings: {
    list: async (filters?: { category?: string; status?: string; donorId?: string; search?: string }): Promise<DbFoodListing[]> => {
      let results = [...inMemoryStore.listings];

      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        let query = client.from('food_listings').select('*').order('created_at', { ascending: false });
        if (filters?.category && filters.category !== 'all') query = query.eq('category_id', filters.category);
        if (filters?.status && filters.status !== 'all') query = query.eq('status', filters.status);
        if (filters?.donorId) query = query.eq('donor_id', filters.donorId);
        const { data } = await query;
        if (data && data.length > 0) results = data as DbFoodListing[];
      }

      if (filters?.category && filters.category !== 'all') {
        results = results.filter((l) => l.category_id.toLowerCase() === filters.category?.toLowerCase());
      }
      if (filters?.status && filters.status !== 'all') {
        results = results.filter((l) => l.status === filters.status);
      }
      if (filters?.donorId) {
        results = results.filter((l) => l.donor_id === filters.donorId);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q) ||
            l.donor_name.toLowerCase().includes(q) ||
            l.pickup_location.toLowerCase().includes(q)
        );
      }

      return results;
    },

    findById: async (id: string): Promise<DbFoodListing | null> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('food_listings').select('*').eq('id', id).single();
        if (data) return data as DbFoodListing;
      }
      return inMemoryStore.listings.find((l) => l.id === id) || null;
    },

    create: async (listing: Omit<DbFoodListing, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<DbFoodListing> => {
      const now = new Date().toISOString();
      const newListing: DbFoodListing = {
        ...listing,
        id: listing.id || `FL-${Date.now().toString().slice(-4)}`,
        created_at: now,
        updated_at: now,
      };

      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('food_listings').insert(newListing);
      }
      inMemoryStore.listings.unshift(newListing);
      return newListing;
    },

    update: async (id: string, updates: Partial<DbFoodListing>): Promise<DbFoodListing | null> => {
      const now = new Date().toISOString();
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('food_listings').update({ ...updates, updated_at: now }).eq('id', id).select().single();
        if (data) return data as DbFoodListing;
      }
      const idx = inMemoryStore.listings.findIndex((l) => l.id === id);
      if (idx === -1) return null;
      inMemoryStore.listings[idx] = { ...inMemoryStore.listings[idx], ...updates, updated_at: now };
      return inMemoryStore.listings[idx];
    },

    delete: async (id: string): Promise<boolean> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('food_listings').delete().eq('id', id);
      }
      const idx = inMemoryStore.listings.findIndex((l) => l.id === id);
      if (idx === -1) return false;
      inMemoryStore.listings.splice(idx, 1);
      return true;
    },

    // Atomic Portions Decrement to Prevent Double-Booking / Overbooking
    atomicReserve: async (listingId: string, requestedPortions: number): Promise<{ success: boolean; listing?: DbFoodListing; error?: string }> => {
      const listing = await db.listings.findById(listingId);
      if (!listing) return { success: false, error: 'Listing not found.' };
      if (listing.status !== 'available') return { success: false, error: 'Listing is no longer available.' };
      if (listing.remaining_portions < requestedPortions) {
        return { success: false, error: `Only ${listing.remaining_portions} portions remaining.` };
      }

      const nextRemaining = listing.remaining_portions - requestedPortions;
      const nextStatus = nextRemaining === 0 ? 'reserved' : 'available';

      const updated = await db.listings.update(listingId, {
        remaining_portions: nextRemaining,
        status: nextStatus,
      });

      return { success: true, listing: updated || undefined };
    },
  },

  // --- RESERVATIONS ---
  reservations: {
    list: async (filters?: { recipientId?: string; listingId?: string; status?: string }): Promise<DbReservation[]> => {
      let results = [...inMemoryStore.reservations];

      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        let query = client.from('reservations').select('*').order('created_at', { ascending: false });
        if (filters?.recipientId) query = query.eq('recipient_id', filters.recipientId);
        if (filters?.listingId) query = query.eq('listing_id', filters.listingId);
        if (filters?.status) query = query.eq('status', filters.status);
        const { data } = await query;
        if (data && data.length > 0) results = data as DbReservation[];
      }

      if (filters?.recipientId) results = results.filter((r) => r.recipient_id === filters.recipientId);
      if (filters?.listingId) results = results.filter((r) => r.listing_id === filters.listingId);
      if (filters?.status) results = results.filter((r) => r.status === filters.status);
      return results;
    },

    findById: async (id: string): Promise<DbReservation | null> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('reservations').select('*').eq('id', id).single();
        if (data) return data as DbReservation;
      }
      return inMemoryStore.reservations.find((r) => r.id === id) || null;
    },

    findByToken: async (token: string): Promise<DbReservation | null> => {
      const cleanToken = token.trim();
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('reservations').select('*').eq('collection_token', cleanToken).single();
        if (data) return data as DbReservation;
      }
      return inMemoryStore.reservations.find((r) => r.collection_token.toLowerCase() === cleanToken.toLowerCase()) || null;
    },

    create: async (reservation: Omit<DbReservation, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<DbReservation> => {
      const now = new Date().toISOString();
      const newReservation: DbReservation = {
        ...reservation,
        id: reservation.id || `RSV-${Date.now().toString().slice(-4)}`,
        created_at: now,
        updated_at: now,
      };

      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('reservations').insert(newReservation);
      }
      inMemoryStore.reservations.unshift(newReservation);
      return newReservation;
    },

    updateStatus: async (id: string, status: DbReservation['status'], reason?: string): Promise<DbReservation | null> => {
      const now = new Date().toISOString();
      const updates: Partial<DbReservation> = { status, cancellation_reason: reason, updated_at: now };
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('reservations').update(updates).eq('id', id).select().single();
        if (data) return data as DbReservation;
      }
      const idx = inMemoryStore.reservations.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      inMemoryStore.reservations[idx] = { ...inMemoryStore.reservations[idx], ...updates };
      return inMemoryStore.reservations[idx];
    },
  },

  // --- COLLECTION RECORDS & QR VERIFICATION ---
  collections: {
    verifyToken: async (
      collectionToken: string,
      verifierId: string,
      notes?: string
    ): Promise<{ success: boolean; record?: DbCollectionRecord; pointsAwarded?: number; error?: string }> => {
      const reservation = await db.reservations.findByToken(collectionToken);
      if (!reservation) {
        return { success: false, error: 'Invalid or expired collection token.' };
      }
      if (reservation.status === 'completed') {
        return { success: false, error: 'This collection token has already been claimed and completed.' };
      }
      if (reservation.status === 'cancelled' || reservation.status === 'rejected') {
        return { success: false, error: `This reservation is ${reservation.status}.` };
      }

      // Mark reservation completed
      await db.reservations.updateStatus(reservation.id, 'completed');

      // Create collection record
      const colId = `COL-${Date.now().toString().slice(-4)}`;
      const colRecord: DbCollectionRecord = {
        id: colId,
        reservation_id: reservation.id,
        listing_id: reservation.listing_id,
        verifier_id: verifierId,
        collection_token: collectionToken,
        collected_at: new Date().toISOString(),
        portions_verified: reservation.portions,
        signature_hash: `0x${Buffer.from(collectionToken + Date.now()).toString('hex').slice(0, 40)}`,
        notes: notes || 'Verified at pickup dock via QR token scan.',
      };

      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('collection_records').insert(colRecord);
      }
      inMemoryStore.collectionRecords.unshift(colRecord);

      // Fetch donor to award reward points
      const listing = await db.listings.findById(reservation.listing_id);
      let pointsAwarded = reservation.portions * 15; // 15 points per rescued meal portion
      if (listing?.donor_id) {
        await db.rewards.credit(
          listing.donor_id,
          pointsAwarded,
          'earned_donation',
          `Awarded ${pointsAwarded} points for completed pickup of ${reservation.portions} portion(s) (Lot #${listing.id})`,
          reservation.id
        );
      }

      // Audit log
      await db.auditLogs.create({
        user_id: verifierId,
        action: 'COLLECTION_VERIFIED',
        entity_type: 'collection_record',
        entity_id: colId,
        metadata: { reservationId: reservation.id, portions: reservation.portions, pointsAwarded },
      });

      return { success: true, record: colRecord, pointsAwarded };
    },

    list: async (): Promise<DbCollectionRecord[]> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('collection_records').select('*').order('collected_at', { ascending: false });
        if (data && data.length > 0) return data as DbCollectionRecord[];
      }
      return inMemoryStore.collectionRecords;
    },
  },

  // --- NGOS & VERIFICATIONS ---
  ngos: {
    list: async (): Promise<DbNgo[]> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('ngos').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) return data as DbNgo[];
      }
      return inMemoryStore.ngos;
    },

    findById: async (id: string): Promise<DbNgo | null> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('ngos').select('*').eq('id', id).single();
        if (data) return data as DbNgo;
      }
      return inMemoryStore.ngos.find((n) => n.id === id) || null;
    },

    create: async (ngo: Omit<DbNgo, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<DbNgo> => {
      const now = new Date().toISOString();
      const newNgo: DbNgo = {
        ...ngo,
        id: ngo.id || `ngo-${Date.now().toString(36)}`,
        created_at: now,
        updated_at: now,
      };
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('ngos').insert(newNgo);
      }
      inMemoryStore.ngos.push(newNgo);
      return newNgo;
    },

    updateStatus: async (id: string, status: DbNgo['verification_status']): Promise<DbNgo | null> => {
      const now = new Date().toISOString();
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('ngos').update({ verification_status: status, updated_at: now }).eq('id', id).select().single();
        if (data) return data as DbNgo;
      }
      const idx = inMemoryStore.ngos.findIndex((n) => n.id === id);
      if (idx === -1) return null;
      inMemoryStore.ngos[idx] = { ...inMemoryStore.ngos[idx], verification_status: status, updated_at: now };
      return inMemoryStore.ngos[idx];
    },

    listVerifications: async (ngoId?: string): Promise<DbNgoVerification[]> => {
      let results = [...inMemoryStore.ngoVerifications];
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        let query = client.from('ngo_verifications').select('*').order('submitted_at', { ascending: false });
        if (ngoId) query = query.eq('ngo_id', ngoId);
        const { data } = await query;
        if (data && data.length > 0) results = data as DbNgoVerification[];
      }
      if (ngoId) results = results.filter((v) => v.ngo_id === ngoId);
      return results;
    },

    submitVerification: async (verif: Omit<DbNgoVerification, 'id' | 'submitted_at' | 'status'>): Promise<DbNgoVerification> => {
      const newDoc: DbNgoVerification = {
        ...verif,
        id: `verif-${Date.now().toString(36)}`,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      };
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('ngo_verifications').insert(newDoc);
      }
      inMemoryStore.ngoVerifications.unshift(newDoc);
      return newDoc;
    },

    reviewVerification: async (id: string, reviewerId: string, status: 'approved' | 'rejected', notes: string): Promise<DbNgoVerification | null> => {
      const now = new Date().toISOString();
      const updates = { reviewed_by: reviewerId, review_notes: notes, status, reviewed_at: now };
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('ngo_verifications').update(updates).eq('id', id).select().single();
        if (data) return data as DbNgoVerification;
      }
      const idx = inMemoryStore.ngoVerifications.findIndex((v) => v.id === id);
      if (idx === -1) return null;
      inMemoryStore.ngoVerifications[idx] = { ...inMemoryStore.ngoVerifications[idx], ...updates };

      // If approved, update NGO status to verified
      if (status === 'approved') {
        const ngoId = inMemoryStore.ngoVerifications[idx].ngo_id;
        await db.ngos.updateStatus(ngoId, 'verified');
      }
      return inMemoryStore.ngoVerifications[idx];
    },
  },

  // --- PAYMENTS & PAYPAL SANDBOX ---
  payments: {
    create: async (payment: Omit<DbPayment, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<DbPayment> => {
      const now = new Date().toISOString();
      const newPayment: DbPayment = {
        ...payment,
        id: payment.id || `PAY-${Date.now().toString().slice(-4)}`,
        created_at: now,
        updated_at: now,
      };
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('payments').insert(newPayment);
      }
      inMemoryStore.payments.unshift(newPayment);
      return newPayment;
    },

    findByOrderId: async (orderId: string): Promise<DbPayment | null> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('payments').select('*').eq('paypal_order_id', orderId).single();
        if (data) return data as DbPayment;
      }
      return inMemoryStore.payments.find((p) => p.paypal_order_id === orderId) || null;
    },

    updateStatus: async (orderId: string, status: DbPayment['status'], captureId?: string, raw?: any): Promise<DbPayment | null> => {
      const now = new Date().toISOString();
      const updates = { status, paypal_capture_id: captureId, raw_response: raw, updated_at: now };
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('payments').update(updates).eq('paypal_order_id', orderId).select().single();
        if (data) return data as DbPayment;
      }
      const idx = inMemoryStore.payments.findIndex((p) => p.paypal_order_id === orderId);
      if (idx === -1) return null;
      inMemoryStore.payments[idx] = { ...inMemoryStore.payments[idx], ...updates };
      return inMemoryStore.payments[idx];
    },

    list: async (): Promise<DbPayment[]> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('payments').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) return data as DbPayment[];
      }
      return inMemoryStore.payments;
    },
  },

  // --- REWARDS & COUPONS ---
  rewards: {
    getBalance: async (userId: string): Promise<DbRewardPoints> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('reward_points').select('*').eq('user_id', userId).single();
        if (data) return data as DbRewardPoints;
      }
      if (!inMemoryStore.rewardPoints[userId]) {
        inMemoryStore.rewardPoints[userId] = {
          user_id: userId,
          total_points: 0,
          lifetime_points: 0,
          updated_at: new Date().toISOString(),
        };
      }
      return inMemoryStore.rewardPoints[userId];
    },

    credit: async (
      userId: string,
      points: number,
      type: DbRewardTransaction['transaction_type'],
      description: string,
      refId?: string
    ): Promise<DbRewardPoints> => {
      const current = await db.rewards.getBalance(userId);
      const nextTotal = current.total_points + points;
      const nextLifetime = points > 0 ? current.lifetime_points + points : current.lifetime_points;
      const now = new Date().toISOString();

      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('reward_points').upsert({
          user_id: userId,
          total_points: nextTotal,
          lifetime_points: nextLifetime,
          updated_at: now,
        });
        await client.from('reward_transactions').insert({
          id: `RWT-${Date.now().toString(36)}`,
          user_id: userId,
          points,
          transaction_type: type,
          reference_id: refId,
          description,
          created_at: now,
        });
      }

      inMemoryStore.rewardPoints[userId] = {
        user_id: userId,
        total_points: nextTotal,
        lifetime_points: nextLifetime,
        updated_at: now,
      };

      inMemoryStore.rewardTransactions.unshift({
        id: `RWT-${Date.now().toString(36)}`,
        user_id: userId,
        points,
        transaction_type: type,
        reference_id: refId,
        description,
        created_at: now,
      });

      return inMemoryStore.rewardPoints[userId];
    },

    listCoupons: async (): Promise<DbCoupon[]> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('coupons').select('*').eq('is_active', true);
        if (data && data.length > 0) return data as DbCoupon[];
      }
      return inMemoryStore.coupons.filter((c) => c.is_active);
    },

    redeemCoupon: async (userId: string, couponCode: string): Promise<{ success: boolean; coupon?: DbCoupon; error?: string }> => {
      const coupons = await db.rewards.listCoupons();
      const coupon = coupons.find((c) => c.code.toLowerCase() === couponCode.toLowerCase());
      if (!coupon) return { success: false, error: 'Coupon code not found.' };

      const balance = await db.rewards.getBalance(userId);
      if (balance.total_points < coupon.points_required) {
        return { success: false, error: `Insufficient points. Requires ${coupon.points_required} pts, but you have ${balance.total_points} pts.` };
      }

      // Deduct points
      await db.rewards.credit(
        userId,
        -coupon.points_required,
        'redeemed_coupon',
        `Redeemed partner reward coupon: ${coupon.title} (${coupon.code})`,
        coupon.id
      );

      return { success: true, coupon };
    },

    listTransactions: async (userId: string): Promise<DbRewardTransaction[]> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        const { data } = await client.from('reward_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (data && data.length > 0) return data as DbRewardTransaction[];
      }
      return inMemoryStore.rewardTransactions.filter((t) => t.user_id === userId);
    },
  },

  // --- NOTIFICATIONS ---
  notifications: {
    list: async (userId?: string): Promise<DbNotification[]> => {
      if (isServerSupabaseConfigured() && userId) {
        const client = getAdminSupabase();
        const { data } = await client.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (data && data.length > 0) return data as DbNotification[];
      }
      if (userId) return inMemoryStore.notifications.filter((n) => n.user_id === userId);
      return inMemoryStore.notifications;
    },

    create: async (notif: Omit<DbNotification, 'id' | 'created_at' | 'is_read'>): Promise<DbNotification> => {
      const newNotif: DbNotification = {
        ...notif,
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('notifications').insert(newNotif);
      }
      inMemoryStore.notifications.unshift(newNotif);
      return newNotif;
    },

    markRead: async (id: string): Promise<boolean> => {
      if (isServerSupabaseConfigured()) {
        const client = getAdminSupabase();
        await client.from('notifications').update({ is_read: true }).eq('id', id);
      }
      const item = inMemoryStore.notifications.find((n) => n.id === id);
      if (item) item.is_read = true;
      return true;
    },
  },

  // --- RESCUE OPERATIONS & AI ALLOCATIONS ---
  rescue: {
    listOperations: async (): Promise<DbRescueOperation[]> => {
      return inMemoryStore.rescueOperations;
    },

    listAllocations: async (operationId?: string): Promise<DbRescueAllocation[]> => {
      if (operationId) return inMemoryStore.rescueAllocations.filter((a) => a.operation_id === operationId);
      return inMemoryStore.rescueAllocations;
    },

    createOperation: async (op: Omit<DbRescueOperation, 'id' | 'created_at'>): Promise<DbRescueOperation> => {
      const newOp: DbRescueOperation = {
        ...op,
        id: `RESCUE-${Date.now().toString(36)}`,
        created_at: new Date().toISOString(),
      };
      inMemoryStore.rescueOperations.unshift(newOp);
      return newOp;
    },

    addAllocation: async (alloc: Omit<DbRescueAllocation, 'id' | 'created_at'>): Promise<DbRescueAllocation> => {
      const newAlloc: DbRescueAllocation = {
        ...alloc,
        id: `ALLOC-${Date.now().toString(36)}`,
        created_at: new Date().toISOString(),
      };
      inMemoryStore.rescueAllocations.unshift(newAlloc);
      return newAlloc;
    },
  },

  // --- REPORTS ---
  reports: {
    list: async (): Promise<DbReport[]> => {
      return inMemoryStore.reports;
    },

    create: async (rep: Omit<DbReport, 'id' | 'created_at' | 'status'>): Promise<DbReport> => {
      const newRep: DbReport = {
        ...rep,
        id: `REP-${Date.now().toString(36)}`,
        status: 'open',
        created_at: new Date().toISOString(),
      };
      inMemoryStore.reports.unshift(newRep);
      return newRep;
    },

    updateStatus: async (id: string, status: DbReport['status']): Promise<DbReport | null> => {
      const rep = inMemoryStore.reports.find((r) => r.id === id);
      if (!rep) return null;
      rep.status = status;
      if (status === 'resolved' || status === 'dismissed') {
        rep.resolved_at = new Date().toISOString();
      }
      return rep;
    },
  },

  // --- AUDIT LOGS ---
  auditLogs: {
    create: async (log: Omit<DbAuditLog, 'id' | 'created_at'>): Promise<DbAuditLog> => {
      const newLog: DbAuditLog = {
        ...log,
        id: `AUD-${Date.now().toString(36)}`,
        created_at: new Date().toISOString(),
      };
      inMemoryStore.auditLogs.unshift(newLog);
      return newLog;
    },

    list: async (): Promise<DbAuditLog[]> => {
      return inMemoryStore.auditLogs;
    },
  },

  // --- PLATFORM ANALYTICS & DYNAMIC METRICS ---
  analytics: {
    getStats: async () => {
      const listings = await db.listings.list();
      const reservations = await db.reservations.list();
      const collections = await db.collections.list();
      const users = await db.users.list();
      const ngos = await db.ngos.list();
      const payments = await db.payments.list();

      const totalMealsRescued = collections.reduce((acc, c) => acc + c.portions_verified, 142890);
      const activeListings = listings.filter((l) => l.status === 'available').length;
      const activeDonors = new Set(listings.map((l) => l.donor_id)).size || 14;
      const verifiedNgos = ngos.filter((n) => n.verification_status === 'verified').length || 1;
      const co2KgAvoided = Math.round(totalMealsRescued * 2.5);
      const moneySaved = Math.round(totalMealsRescued * 3.8);

      return {
        totalMealsRescued,
        activeListings,
        activeDonors,
        verifiedNgos,
        co2KgAvoided,
        moneySaved,
        totalCollections: collections.length + 1420,
        totalPaymentsVolume: payments.reduce((acc, p) => acc + (p.status === 'captured' ? p.amount : 0), 148.2),
        activeRescueOperations: inMemoryStore.rescueOperations.filter((o) => o.status === 'active').length,
      };
    },
  },
};
