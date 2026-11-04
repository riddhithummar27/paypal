-- ====================================================================
-- FOODLOOP 2.0 - Complete Supabase PostgreSQL Schema & Migrations
-- Generated: 2026-11-04
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('donor', 'recipient', 'ngo', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    organization_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    lat DOUBLE PRECISION DEFAULT 42.3601,
    lng DOUBLE PRECISION DEFAULT -71.0589,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Food Categories Table
CREATE TABLE IF NOT EXISTS public.food_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Food Listings Table
CREATE TABLE IF NOT EXISTS public.food_listings (
    id TEXT PRIMARY KEY,
    donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    donor_name TEXT NOT NULL,
    donor_type TEXT DEFAULT 'Restaurant',
    title TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES public.food_categories(id),
    listing_type TEXT NOT NULL CHECK (listing_type IN ('free', 'discount', 'sponsored')),
    portions INTEGER NOT NULL CHECK (portions > 0),
    remaining_portions INTEGER NOT NULL CHECK (remaining_portions >= 0),
    original_price NUMERIC(10,2) DEFAULT 0,
    discounted_price NUMERIC(10,2) DEFAULT 0,
    image_url TEXT,
    prep_time TEXT,
    storage_temp TEXT,
    allergens TEXT[] DEFAULT '{}',
    pickup_location TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    pickup_deadline TIMESTAMPTZ NOT NULL,
    safety_declaration BOOLEAN DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'completed', 'expired', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reservations Table
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    listing_id TEXT REFERENCES public.food_listings(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    portions INTEGER NOT NULL CHECK (portions > 0),
    total_price NUMERIC(10,2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')),
    collection_token TEXT UNIQUE NOT NULL,
    pickup_deadline TIMESTAMPTZ NOT NULL,
    pickup_instructions TEXT,
    cancellation_reason TEXT,
    paypal_order_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NGOs Table
CREATE TABLE IF NOT EXISTS public.ngos (
    id TEXT PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    registration_number TEXT,
    tax_id TEXT,
    mission_statement TEXT,
    capacity_portions_per_day INTEGER DEFAULT 500,
    cooling_capacity_liters INTEGER DEFAULT 200,
    fleet_vehicles INTEGER DEFAULT 2,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NGO Verifications Table
CREATE TABLE IF NOT EXISTS public.ngo_verifications (
    id TEXT PRIMARY KEY,
    ngo_id TEXT REFERENCES public.ngos(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_url TEXT NOT NULL,
    document_type TEXT NOT NULL,
    reviewed_by UUID REFERENCES public.profiles(id),
    review_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 7. Collection Records Table (QR Verification)
CREATE TABLE IF NOT EXISTS public.collection_records (
    id TEXT PRIMARY KEY,
    reservation_id TEXT REFERENCES public.reservations(id) ON DELETE CASCADE,
    listing_id TEXT REFERENCES public.food_listings(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES public.profiles(id),
    collection_token TEXT NOT NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    portions_verified INTEGER NOT NULL,
    signature_hash TEXT,
    notes TEXT
);

-- 8. Payments Table (PayPal Sandbox)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reservation_id TEXT REFERENCES public.reservations(id) ON DELETE SET NULL,
    paypal_order_id TEXT UNIQUE NOT NULL,
    paypal_capture_id TEXT,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('created', 'approved', 'captured', 'failed', 'refunded')),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('meal_purchase', 'sponsorship', 'seller_payout')),
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Sponsorships Table
CREATE TABLE IF NOT EXISTS public.sponsorships (
    id TEXT PRIMARY KEY,
    sponsor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    campaign_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    portions_funded INTEGER NOT NULL,
    target_shelter_id TEXT,
    paypal_order_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Reward Points Table
CREATE TABLE IF NOT EXISTS public.reward_points (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Reward Transactions Table
CREATE TABLE IF NOT EXISTS public.reward_transactions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned_donation', 'earned_rescue', 'redeemed_coupon', 'admin_adjustment')),
    reference_id TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    discount_percent INTEGER,
    discount_amount NUMERIC(10,2),
    points_required INTEGER NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    partner_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('listing_alert', 'reservation_update', 'collection_verified', 'payment_status', 'points_credited', 'ngo_verified', 'urgent_rescue')),
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AI Recommendations Table
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id TEXT PRIMARY KEY,
    listing_id TEXT REFERENCES public.food_listings(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('ngo', 'recipient')),
    target_id TEXT NOT NULL,
    recommended_portions INTEGER NOT NULL,
    urgency_score DOUBLE PRECISION NOT NULL,
    travel_distance_km DOUBLE PRECISION NOT NULL,
    eta_minutes INTEGER NOT NULL,
    rationale TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Rescue Operations Table
CREATE TABLE IF NOT EXISTS public.rescue_operations (
    id TEXT PRIMARY KEY,
    listing_id TEXT REFERENCES public.food_listings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    total_portions INTEGER NOT NULL,
    urgency_level TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'in_transit', 'completed', 'aborted')),
    ai_confidence_score DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Rescue Allocations Table
CREATE TABLE IF NOT EXISTS public.rescue_allocations (
    id TEXT PRIMARY KEY,
    operation_id TEXT REFERENCES public.rescue_operations(id) ON DELETE CASCADE,
    destination_name TEXT NOT NULL,
    destination_lat DOUBLE PRECISION NOT NULL,
    destination_lng DOUBLE PRECISION NOT NULL,
    portions INTEGER NOT NULL,
    vehicle_type TEXT NOT NULL,
    courier_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'picked_up', 'delivered')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'user', 'ngo', 'transaction')),
    target_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 18. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_food_listings_donor ON public.food_listings(donor_id);
CREATE INDEX IF NOT EXISTS idx_food_listings_status ON public.food_listings(status);
CREATE INDEX IF NOT EXISTS idx_food_listings_category ON public.food_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_food_listings_deadline ON public.food_listings(pickup_deadline);
CREATE INDEX IF NOT EXISTS idx_food_listings_coords ON public.food_listings(lat, lng);

CREATE INDEX IF NOT EXISTS idx_reservations_user ON public.reservations(recipient_id);
CREATE INDEX IF NOT EXISTS idx_reservations_listing ON public.reservations(listing_id);
CREATE INDEX IF NOT EXISTS idx_reservations_token ON public.reservations(collection_token);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action, created_at);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read verified listings and categories
CREATE POLICY "Public Read Food Categories" ON public.food_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Active Listings" ON public.food_listings FOR SELECT USING (true);
CREATE POLICY "Public Read Active Coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- Profiles policy: Users can read public profiles and edit their own
CREATE POLICY "Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings policy: Donors can insert, update, delete their own listings
CREATE POLICY "Donors Manage Own Listings" ON public.food_listings FOR ALL USING (auth.uid() = donor_id);

-- Reservations policy: Recipients can read and create reservations
CREATE POLICY "Recipients Manage Own Reservations" ON public.reservations FOR ALL USING (auth.uid() = recipient_id);

-- Notifications policy: Users only read their own notifications
CREATE POLICY "Users Read Own Notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ====================================================================
-- SEED INITIAL DATA
-- ====================================================================
INSERT INTO public.food_categories (id, name, description, icon) VALUES
('meals', 'Prepared Meals', 'Hot or cold portioned ready-to-eat meals', 'restaurant'),
('bakery', 'Bakery & Pastries', 'Artisan breads, bagels, brioche, and pastries', 'bakery_dining'),
('produce', 'Fresh Produce', 'Organic vegetables, seasonal fruits, and herbs', 'eco'),
('dairy', 'Dairy & Chilled', 'Milk, yogurt, cheeses, and refrigerated goods', 'egg_alt'),
('packaged', 'Packaged & Pantry', 'Grains, pasta, canned goods, and dry provisions', 'inventory_2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coupons (id, code, title, discount_percent, points_required, valid_until, partner_name) VALUES
('CP-01', 'RESCUE10', '10% Off Organic Grocery Box', 10, 50, NOW() + INTERVAL '30 days', 'Whole Foods Co-op'),
('CP-02', 'BAKERY50', '$5 Off Artisan Bakery Order', NULL, 100, NOW() + INTERVAL '45 days', 'Le Matin Boulangerie'),
('CP-03', 'CAFEFREE', 'Free Fair-Trade Coffee or Tea', 100, 30, NOW() + INTERVAL '60 days', 'Equator Roasters')
ON CONFLICT (id) DO NOTHING;
