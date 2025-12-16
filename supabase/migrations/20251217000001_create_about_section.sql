-- Create about_section table
CREATE TABLE public.about_section (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT,
  badge_text TEXT,
  title TEXT,
  description TEXT,
  story_content TEXT,
  mission_content TEXT,
  vision_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;

-- Public read access for about section (displayed on homepage)
CREATE POLICY "Anyone can view about section" 
ON public.about_section FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for about section" 
ON public.about_section FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at on about_section
CREATE TRIGGER update_about_section_updated_at
BEFORE UPDATE ON public.about_section
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for about videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'about-videos',
  'about-videos',
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for about-videos
-- Allow public read access (videos need to be viewable on homepage)
CREATE POLICY "Public can view about videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'about-videos');

-- Allow all operations for admin (will be restricted later with proper auth)
CREATE POLICY "Allow all for about videos"
ON storage.objects FOR ALL
USING (bucket_id = 'about-videos')
WITH CHECK (bucket_id = 'about-videos');

-- Insert default content
INSERT INTO public.about_section (
  video_url,
  badge_text,
  title,
  description,
  story_content,
  mission_content,
  vision_content
) VALUES (
  'https://res.cloudinary.com/dsypclqxk/video/upload/v1763129131/5400711_Coll_wavebreak_People_3840x2160_ufldaq.mp4',
  'About Us',
  'Empowering Ghana Through Accessible National Resources',
  'The Ghana National Resource System (GNRS) is a comprehensive platform designed to connect Ghanaians with essential resources including education opportunities, job listings, news updates, and national information. Our mission is to make vital resources easily accessible to all citizens, fostering national development and individual growth.',
  'The Ghana National Resource System was established to bridge the gap between Ghanaians and essential national resources. Recognizing the need for a centralized platform that provides easy access to education, employment opportunities, and national information, GNRS was created to serve as a one-stop portal for all resource needs.

Through continuous innovation and collaboration with educational institutions, employers, and government agencies, we strive to create a more connected and informed Ghana where every citizen has access to the resources they need to succeed.',
  'Our mission is to provide a comprehensive, user-friendly platform that connects all Ghanaians with essential national resources including education opportunities, job listings, news updates, and government services.

We are committed to promoting transparency, accessibility, and efficiency in resource distribution, ensuring that every Ghanaian can access the information and opportunities they need to thrive in today''s society.',
  'Our vision is to become the leading national resource platform in Ghana, recognized for excellence in connecting citizens with opportunities and information that drive personal and national development.

We envision a future where every Ghanaian, regardless of location or background, can easily access education, employment, and information resources through our integrated platform, contributing to a more prosperous and informed nation.'
);

