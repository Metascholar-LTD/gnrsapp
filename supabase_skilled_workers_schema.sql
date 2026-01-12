-- ============================================================================
-- SKILLED WORKERS DATABASE SCHEMA
-- Complete schema with auto-populated categories and work types
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. WORK TYPES TABLE (Auto-populated)
-- ============================================================================
CREATE TABLE IF NOT EXISTS work_types (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-populate work types
INSERT INTO work_types (id, label, display_order) VALUES
  ('all', 'Any type of work', 0),
  ('skilled-trades', 'Skilled Trades', 1),
  ('personal-services', 'Personal Services', 2),
  ('construction', 'Construction & Building', 3),
  ('automotive', 'Automotive Services', 4),
  ('beauty', 'Beauty & Personal Care', 5),
  ('food', 'Food & Catering', 6),
  ('maintenance', 'Maintenance & Repair', 7)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. WORKER CATEGORIES TABLE (Auto-populated)
-- ============================================================================
CREATE TABLE IF NOT EXISTS worker_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type_of_work TEXT NOT NULL REFERENCES work_types(id) ON DELETE RESTRICT,
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_worker_categories_type ON worker_categories(type_of_work);
CREATE INDEX IF NOT EXISTS idx_worker_categories_name ON worker_categories(name);

-- Auto-populate all categories from browse page
INSERT INTO worker_categories (name, type_of_work, display_order) VALUES
  -- 0-9
  ('3D Printing Specialist', 'skilled-trades', 1),
  ('3D Modeling Expert', 'skilled-trades', 2),
  
  -- A
  ('AC Repair Technician', 'maintenance', 3),
  ('Appliance Repair Specialist', 'maintenance', 4),
  ('Auto Body Repair Expert', 'automotive', 5),
  ('Auto Electrician', 'automotive', 6),
  ('Auto Mechanic', 'automotive', 7),
  ('Auto Parts Specialist', 'automotive', 8),
  ('Architectural Drafter', 'construction', 9),
  ('Asphalt Paving Contractor', 'construction', 10),
  
  -- B
  ('Barber', 'beauty', 11),
  ('Bricklayer', 'construction', 12),
  ('Building Inspector', 'construction', 13),
  ('Building Maintenance Worker', 'maintenance', 14),
  
  -- C
  ('Cake Baker & Designer', 'food', 15),
  ('Carpenter', 'skilled-trades', 16),
  ('Caterer', 'food', 17),
  ('Chef', 'food', 18),
  ('Civil Engineer', 'construction', 19),
  ('Cleaner', 'personal-services', 20),
  ('Commercial Painter', 'construction', 21),
  ('Concrete Finisher', 'construction', 22),
  ('Construction Manager', 'construction', 23),
  ('Crane Operator', 'construction', 24),
  
  -- D
  ('Diesel Mechanic', 'automotive', 25),
  ('Drywall Installer', 'construction', 26),
  
  -- E
  ('Electrician', 'skilled-trades', 27),
  ('Elevator Technician', 'maintenance', 28),
  ('Event Caterer', 'food', 29),
  
  -- F
  ('Fence Installer', 'construction', 30),
  ('Flooring Installer', 'construction', 31),
  ('Furniture Maker', 'skilled-trades', 32),
  
  -- G
  ('General Contractor', 'construction', 33),
  ('Glazier', 'construction', 34),
  
  -- H
  ('Hairdresser', 'beauty', 35),
  ('Hair Stylist', 'beauty', 36),
  ('Heating Technician', 'maintenance', 37),
  ('HVAC Technician', 'maintenance', 38),
  
  -- I
  ('Interior Designer', 'construction', 39),
  ('Ironworker', 'construction', 40),
  
  -- J
  ('Janitor', 'personal-services', 41),
  ('Jeweler', 'personal-services', 42),
  
  -- L
  ('Landscaper', 'construction', 43),
  ('Locksmith', 'maintenance', 44),
  
  -- M
  ('Mason', 'skilled-trades', 45),
  ('Makeup Artist', 'beauty', 46),
  ('Mechanic', 'automotive', 47),
  ('Metal Fabricator', 'skilled-trades', 48),
  ('Mobile Mechanic', 'automotive', 49),
  
  -- N
  ('Nail Technician', 'beauty', 50),
  
  -- P
  ('Painter', 'skilled-trades', 51),
  ('Plumber', 'skilled-trades', 52),
  ('Plumbing Contractor', 'construction', 53),
  ('Power Tool Repair', 'maintenance', 54),
  
  -- R
  ('Refrigeration Technician', 'maintenance', 55),
  ('Roofer', 'construction', 56),
  
  -- S
  ('Seamstress', 'personal-services', 57),
  ('Security System Installer', 'maintenance', 58),
  ('Sheet Metal Worker', 'skilled-trades', 59),
  ('Shoe Repair Specialist', 'personal-services', 60),
  ('Solar Panel Installer', 'construction', 61),
  ('Steel Worker', 'construction', 62),
  ('Surveyor', 'construction', 63),
  
  -- T
  ('Tailor', 'personal-services', 64),
  ('Tile Installer', 'construction', 65),
  ('Tire Specialist', 'automotive', 66),
  ('Truck Mechanic', 'automotive', 67),
  
  -- U
  ('Upholsterer', 'personal-services', 68),
  
  -- W
  ('Welder', 'skilled-trades', 69),
  ('Window Installer', 'construction', 70),
  ('Woodworker', 'skilled-trades', 71)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 3. SKILLED WORKERS TABLE (Main Table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS skilled_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information (Required)
  name TEXT NOT NULL,
  type_of_work TEXT REFERENCES work_types(id) ON DELETE RESTRICT,
  category TEXT NOT NULL REFERENCES worker_categories(name) ON DELETE RESTRICT,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Profile & Media
  profile_picture TEXT,
  about TEXT,
  
  -- Additional Information
  years_experience INTEGER,
  response_time TEXT,
  
  -- Status & Verification
  verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  joined_date DATE,
  
  -- Performance Metrics (Calculated - updated via triggers)
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  
  -- Badges (stored as JSON array)
  badges JSONB DEFAULT '[]'::jsonb,
  
  -- Approval/Rejection Tracking
  rejection_reason TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  approved_by TEXT, -- Admin name or identifier
  rejected_by TEXT, -- Admin name or identifier
  
  -- User Tracking
  created_by TEXT, -- User identifier (can be email, name, or ID)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_skilled_workers_category ON skilled_workers(category);
CREATE INDEX IF NOT EXISTS idx_skilled_workers_status ON skilled_workers(status);
CREATE INDEX IF NOT EXISTS idx_skilled_workers_verified ON skilled_workers(verified);
CREATE INDEX IF NOT EXISTS idx_skilled_workers_location ON skilled_workers(location);
CREATE INDEX IF NOT EXISTS idx_skilled_workers_type_of_work ON skilled_workers(type_of_work);
CREATE INDEX IF NOT EXISTS idx_skilled_workers_rating ON skilled_workers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_skilled_workers_created_at ON skilled_workers(created_at DESC);

-- ============================================================================
-- 4. WORKER SERVICES TABLE (One-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS worker_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES skilled_workers(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_price TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_worker_services_worker_id ON worker_services(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_services_display_order ON worker_services(worker_id, display_order);

-- ============================================================================
-- 5. WORKER PORTFOLIO TABLE (One-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS worker_portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES skilled_workers(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_worker_portfolio_worker_id ON worker_portfolio(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_portfolio_display_order ON worker_portfolio(worker_id, display_order);
CREATE INDEX IF NOT EXISTS idx_worker_portfolio_media_type ON worker_portfolio(media_type);

-- ============================================================================
-- 6. WORKER REVIEWS TABLE (Share Your Experience)
-- ============================================================================
CREATE TABLE IF NOT EXISTS worker_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES skilled_workers(id) ON DELETE CASCADE,
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  
  -- Reviewer Information
  reviewer_name TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  reviewer_email TEXT,
  reviewer_avatar TEXT,
  
  -- Moderation (Future)
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  
  -- Engagement (Future)
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_worker_reviews_worker_id ON worker_reviews(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_reviews_rating ON worker_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_worker_reviews_status ON worker_reviews(status);
CREATE INDEX IF NOT EXISTS idx_worker_reviews_created_at ON worker_reviews(created_at DESC);

-- ============================================================================
-- 7. WORKER APPROVALS TABLE (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS worker_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES skilled_workers(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('approve', 'reject')),
  reason TEXT,
  admin_id TEXT, -- Admin name or identifier
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_worker_approvals_worker_id ON worker_approvals(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_approvals_action ON worker_approvals(action);
CREATE INDEX IF NOT EXISTS idx_worker_approvals_created_at ON worker_approvals(created_at DESC);

-- ============================================================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_skilled_workers_updated_at
  BEFORE UPDATE ON skilled_workers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_categories_updated_at
  BEFORE UPDATE ON worker_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_services_updated_at
  BEFORE UPDATE ON worker_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_portfolio_updated_at
  BEFORE UPDATE ON worker_portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_reviews_updated_at
  BEFORE UPDATE ON worker_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to recalculate worker rating and review count
CREATE OR REPLACE FUNCTION recalculate_worker_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE skilled_workers
  SET
    rating = (
      SELECT COALESCE(AVG(rating)::DECIMAL(3, 2), 0.00)
      FROM worker_reviews
      WHERE worker_id = COALESCE(NEW.worker_id, OLD.worker_id)
        AND status = 'approved'
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM worker_reviews
      WHERE worker_id = COALESCE(NEW.worker_id, OLD.worker_id)
        AND status = 'approved'
    )
  WHERE id = COALESCE(NEW.worker_id, OLD.worker_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update worker stats when reviews change
CREATE TRIGGER update_worker_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON worker_reviews
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_worker_stats();

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- NOTE: RLS is disabled for now. You can enable it later when authentication is set up.
-- For now, all tables are publicly accessible. Security should be handled at the application level.

-- Disable RLS on all tables (can be enabled later when auth is set up)
ALTER TABLE work_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE worker_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE skilled_workers DISABLE ROW LEVEL SECURITY;
ALTER TABLE worker_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE worker_portfolio DISABLE ROW LEVEL SECURITY;
ALTER TABLE worker_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE worker_approvals DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- OPTIONAL: Enable RLS later with these policies (uncomment when auth is ready)
-- ============================================================================
/*
-- Enable RLS on all tables
ALTER TABLE work_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skilled_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_approvals ENABLE ROW LEVEL SECURITY;

-- Work Types: Public read
CREATE POLICY "Work types are viewable by everyone"
  ON work_types FOR SELECT
  USING (true);

-- Worker Categories: Public read
CREATE POLICY "Categories are viewable by everyone"
  ON worker_categories FOR SELECT
  USING (true);

-- Skilled Workers: Public read active workers
CREATE POLICY "Active workers are viewable by everyone"
  ON skilled_workers FOR SELECT
  USING (status = 'active');

-- Worker Services: Public read
CREATE POLICY "Services are viewable by everyone"
  ON worker_services FOR SELECT
  USING (true);

-- Worker Portfolio: Public read
CREATE POLICY "Portfolio is viewable by everyone"
  ON worker_portfolio FOR SELECT
  USING (true);

-- Worker Reviews: Public read approved reviews
CREATE POLICY "Approved reviews are viewable by everyone"
  ON worker_reviews FOR SELECT
  USING (status = 'approved');
*/

-- ============================================================================
-- 10. HELPER VIEWS (Optional but useful)
-- ============================================================================

-- View for worker statistics
CREATE OR REPLACE VIEW worker_stats AS
SELECT
  w.id,
  w.name,
  w.category,
  w.location,
  w.rating,
  w.reviews_count,
  w.completed_jobs,
  w.verified,
  w.status,
  COUNT(DISTINCT s.id) as services_count,
  COUNT(DISTINCT p.id) as portfolio_count,
  w.created_at,
  w.updated_at
FROM skilled_workers w
LEFT JOIN worker_services s ON w.id = s.worker_id
LEFT JOIN worker_portfolio p ON w.id = p.worker_id
GROUP BY w.id;

-- View for category statistics
CREATE OR REPLACE VIEW category_stats AS
SELECT
  c.id,
  c.name,
  c.type_of_work,
  COUNT(DISTINCT w.id) as worker_count,
  COALESCE(AVG(w.rating), 0) as avg_rating,
  COUNT(DISTINCT r.id) as total_reviews
FROM worker_categories c
LEFT JOIN skilled_workers w ON c.name = w.category AND w.status = 'active'
LEFT JOIN worker_reviews r ON w.id = r.worker_id AND r.status = 'approved'
GROUP BY c.id, c.name, c.type_of_work;

-- ============================================================================
-- 11. COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE skilled_workers IS 'Main table for skilled workers and artisans';
COMMENT ON TABLE worker_services IS 'Services offered by workers with pricing';
COMMENT ON TABLE worker_portfolio IS 'Portfolio images and videos for workers';
COMMENT ON TABLE worker_reviews IS 'Customer reviews and ratings (Share Your Experience)';
COMMENT ON TABLE worker_approvals IS 'Audit trail for worker approval/rejection actions';
COMMENT ON TABLE worker_categories IS 'Predefined categories for workers';
COMMENT ON TABLE work_types IS 'Types of work (e.g., Skilled Trades, Personal Services)';

COMMENT ON COLUMN skilled_workers.rating IS 'Average rating calculated from approved reviews';
COMMENT ON COLUMN skilled_workers.reviews_count IS 'Total count of approved reviews';
COMMENT ON COLUMN skilled_workers.badges IS 'JSON array of badge names (e.g., ["Licensed", "Insured", "Verified"])';
COMMENT ON COLUMN worker_reviews.is_anonymous IS 'If true, reviewer_name should be "Anonymous"';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
