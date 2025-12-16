-- Create why_choose_us_section table
-- Note: Badge text and card titles are hardcoded in the frontend
-- Only admin-controlled fields are stored in the database
CREATE TABLE public.why_choose_us_section (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT, -- Admin controlled: Main title
  description TEXT, -- Admin controlled: Main description paragraph
  fast_executions_description TEXT, -- Admin controlled: Fast Executions card description
  guide_support_description TEXT, -- Admin controlled: Guide & Support card description
  financial_secure_description TEXT, -- Admin controlled: Financial Secure card description
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.why_choose_us_section ENABLE ROW LEVEL SECURITY;

-- Public read access for why choose us section (displayed on homepage)
CREATE POLICY "Anyone can view why choose us section" 
ON public.why_choose_us_section FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for why choose us section" 
ON public.why_choose_us_section FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at on why_choose_us_section
CREATE TRIGGER update_why_choose_us_section_updated_at
BEFORE UPDATE ON public.why_choose_us_section
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.why_choose_us_section (
  title,
  description,
  fast_executions_description,
  guide_support_description,
  financial_secure_description
) VALUES (
  'Few Reasons Why People Choosing Us!',
  'The Ghana National Resource System (GNRS) stands out as the premier platform for accessing essential national resources. We provide comprehensive, reliable, and accessible services that connect every Ghanaian with opportunities for education, employment, and national information. Our commitment to excellence and user satisfaction makes us the trusted choice for millions of citizens across Ghana.',
  'Our platform delivers quick and efficient access to resources. Whether you''re searching for educational opportunities, job listings, or national information, we ensure rapid response times and streamlined processes that save you valuable time.',
  'Our dedicated support team is always ready to assist you. From navigating the platform to finding specific resources, we provide comprehensive guidance and support to ensure you have the best experience accessing national resources.',
  'All our services are completely free and secure. We ensure the highest standards of data protection and privacy, giving you peace of mind while accessing valuable national resources without any financial concerns.'
);

