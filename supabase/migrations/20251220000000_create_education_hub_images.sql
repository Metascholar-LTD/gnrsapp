-- Create education_hub_images table
-- This table stores only the images for the phone mockup in the Education Hub section
-- All text, steppers, and phone structure remain unchanged
CREATE TABLE public.education_hub_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id TEXT NOT NULL UNIQUE, -- '01', '02', '03', '04'
  image_url TEXT, -- Admin controlled: Image URL for phone mockup
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.education_hub_images ENABLE ROW LEVEL SECURITY;

-- Public read access for education hub images (displayed on homepage)
CREATE POLICY "Anyone can view education hub images" 
ON public.education_hub_images FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for education hub images" 
ON public.education_hub_images FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at on education_hub_images
CREATE TRIGGER update_education_hub_images_updated_at
BEFORE UPDATE ON public.education_hub_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for education hub images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'education-hub-images',
  'education-hub-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for education-hub-images
-- Allow public read access (images need to be viewable on homepage)
CREATE POLICY "Public read access for education hub images"
ON storage.objects FOR SELECT
USING (bucket_id = 'education-hub-images');

-- Allow authenticated users to upload (will be restricted later with proper auth)
CREATE POLICY "Allow upload for education hub images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'education-hub-images');

-- Allow authenticated users to update (will be restricted later with proper auth)
CREATE POLICY "Allow update for education hub images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'education-hub-images')
WITH CHECK (bucket_id = 'education-hub-images');

-- Allow authenticated users to delete (will be restricted later with proper auth)
CREATE POLICY "Allow delete for education hub images"
ON storage.objects FOR DELETE
USING (bucket_id = 'education-hub-images');

-- Insert default images
INSERT INTO public.education_hub_images (step_id, image_url) VALUES
  ('01', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=600&fit=crop&q=80&auto=format'),
  ('02', 'https://res.cloudinary.com/dsypclqxk/image/upload/v1756304758/finance_fgi2jq.jpg'),
  ('03', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=600&fit=crop&q=80&auto=format'),
  ('04', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=600&fit=crop&q=80&auto=format')
ON CONFLICT (step_id) DO NOTHING;

