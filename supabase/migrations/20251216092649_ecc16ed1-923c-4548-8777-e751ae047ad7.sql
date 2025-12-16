-- Create carousel settings table
CREATE TABLE public.carousel_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  display_type TEXT NOT NULL DEFAULT 'carousel' CHECK (display_type IN ('carousel', 'video')),
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create carousel slides table
CREATE TABLE public.carousel_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  badge_text TEXT DEFAULT 'Welcome to GNRS',
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT DEFAULT 'Explore More',
  button_link TEXT DEFAULT '#about',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  layout_type TEXT DEFAULT 'left' CHECK (layout_type IN ('left', 'center', 'split')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carousel_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;

-- Public read access for carousel (displayed on homepage)
CREATE POLICY "Anyone can view carousel settings" 
ON public.carousel_settings FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view active carousel slides" 
ON public.carousel_slides FOR SELECT 
USING (is_active = true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for carousel settings" 
ON public.carousel_settings FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for carousel slides" 
ON public.carousel_slides FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at on carousel_settings
CREATE TRIGGER update_carousel_settings_updated_at
BEFORE UPDATE ON public.carousel_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on carousel_slides
CREATE TRIGGER update_carousel_slides_updated_at
BEFORE UPDATE ON public.carousel_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.carousel_settings (display_type) VALUES ('carousel');

-- Insert default slides based on existing carousel
INSERT INTO public.carousel_slides (image_url, badge_text, title, subtitle, button_text, button_link, display_order, layout_type)
VALUES 
  ('/img/carousel-1.jpg', 'Welcome to GNRS', 'Empowering Ghana Through National Resources', NULL, 'Explore More', '#about', 1, 'left'),
  ('https://res.cloudinary.com/dsypclqxk/image/upload/v1763066960/portrait-photorealistic-rastafari-woman-with-african-dreads_nwoicg.jpg', 'Welcome to GNRS', 'Your Gateway to Education, Jobs & Opportunities', NULL, 'Get Started', '#services', 2, 'left'),
  ('https://res.cloudinary.com/dsypclqxk/image/upload/v1758549899/map-ghana-polygonal-mesh-line-map-flag-map_srmd4c.jpg', 'Nationwide Coverage', 'Connecting Every Region, Empowering Every Citizen', 'From Accra to Tamale, from Cape Coast to Bolgatanga — Your opportunities await across all 16 regions', 'Discover Opportunities', '#services', 3, 'center'),
  ('https://res.cloudinary.com/dsypclqxk/image/upload/v1763066817/OQT8S80_atfkkw.jpg', 'Building the Future', 'Transforming Dreams Into Reality', 'Access world-class education, unlock career opportunities, and shape the future of Ghana', 'Start Your Journey', '#about', 4, 'split');