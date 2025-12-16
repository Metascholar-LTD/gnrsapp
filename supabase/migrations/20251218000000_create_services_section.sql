-- Create service_tabs table
-- Note: Only fields controlled by admin are editable
-- Tab titles, icons, and button text/links are hardcoded in the frontend
CREATE TABLE public.service_tabs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL, -- Icon class (e.g., 'fa-graduation-cap') - used to match with hardcoded tabs
  title TEXT NOT NULL, -- Tab title (e.g., 'Education Resources') - used to match with hardcoded tabs
  image_url TEXT, -- Admin controlled: Image URL
  content_title TEXT, -- Admin controlled: h3 heading
  description TEXT, -- Admin controlled: Main description paragraph
  list_item_1 TEXT, -- Admin controlled: First list item
  list_item_2 TEXT, -- Admin controlled: Second list item
  list_item_3 TEXT, -- Admin controlled: Third list item
  order_index INTEGER NOT NULL DEFAULT 1, -- Order of the tab
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_tabs ENABLE ROW LEVEL SECURITY;

-- Public read access for service tabs (displayed on homepage)
CREATE POLICY "Anyone can view service tabs" 
ON public.service_tabs FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for service tabs" 
ON public.service_tabs FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at on service_tabs
CREATE TRIGGER update_service_tabs_updated_at
BEFORE UPDATE ON public.service_tabs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'service-images',
  'service-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for service-images
-- Allow public read access (images need to be viewable on homepage)
CREATE POLICY "Public can view service images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

-- Allow all operations for admin (will be restricted later with proper auth)
CREATE POLICY "Allow all for service images"
ON storage.objects FOR ALL
USING (bucket_id = 'service-images')
WITH CHECK (bucket_id = 'service-images');

-- Insert default service tabs matching the hardcoded tabs in Services.tsx
INSERT INTO public.service_tabs (
  icon,
  title,
  image_url,
  content_title,
  description,
  list_item_1,
  list_item_2,
  list_item_3,
  order_index
) VALUES
(
  'fa-graduation-cap',
  'Education Resources',
  'https://res.cloudinary.com/dsypclqxk/image/upload/v1763129777/portrait-student-wearing-medical-mask_gokjyh.jpg',
  'Comprehensive Education Resources',
  'Access a wide range of educational opportunities including scholarships, courses, training programs, and educational institutions across Ghana. Find the right educational path for your career goals and personal development.',
  'Scholarship Opportunities',
  'Course Listings',
  'Educational Institutions',
  1
),
(
  'fa-briefcase',
  'Job Opportunities',
  'https://res.cloudinary.com/dsypclqxk/image/upload/v1763130425/man-handshaking-his-employer-after-being-accepted-his-new-office-job_lo26fe.jpg',
  'Job Opportunities & Career Development',
  'Browse thousands of job listings from top employers across Ghana. Find opportunities that match your skills and career aspirations. Access career resources, resume building tools, and professional development opportunities.',
  'Job Listings',
  'Career Resources',
  'Professional Development',
  2
),
(
  'fa-newspaper',
  'News & Updates',
  'https://res.cloudinary.com/dsypclqxk/image/upload/v1763130727/handsome-african-american-male-journalist_usk3kl.jpg',
  'Latest News & National Updates',
  'Stay informed with the latest news, announcements, and updates from across Ghana. Get real-time information about government policies, national events, and important developments affecting citizens.',
  'National News',
  'Government Announcements',
  'Event Updates',
  3
),
(
  'fa-database',
  'National Resources',
  'https://res.cloudinary.com/dsypclqxk/image/upload/v1763130880/african-woman-hold-small-ghana-flag-hands_wtybxo.jpg',
  'National Resources & Information',
  'Access comprehensive national resources including government services, public information, statistics, and data. Find everything you need to know about Ghana''s resources, services, and opportunities in one centralized location.',
  'Government Services',
  'Public Information',
  'National Statistics',
  4
),
(
  'fa-tools',
  'Hands & Skills',
  'https://res.cloudinary.com/dsypclqxk/image/upload/v1763129777/portrait-student-wearing-medical-mask_gokjyh.jpg',
  'Hands & Skills Directory',
  'Connect with skilled professionals and artisans across Ghana. Find verified skilled workers for your projects, from electricians and plumbers to carpenters and technicians. Browse profiles, view work samples, and hire trusted professionals for your needs.',
  'Verified Skilled Workers',
  'Browse by Category',
  'Work Samples & Reviews',
  5
),
(
  'fa-folder',
  'Directories',
  'https://res.cloudinary.com/dsypclqxk/image/upload/v1763130880/african-woman-hold-small-ghana-flag-hands_wtybxo.jpg',
  'Comprehensive Directories',
  'Access comprehensive directories of essential institutions and services across Ghana. Find hotels, universities, schools, restaurants, hospitals, banks, and more. Get detailed information, locations, contact details, and reviews to help you make informed decisions.',
  'Hotels & Accommodation',
  'Educational Institutions',
  'Healthcare & Financial Services',
  6
);
