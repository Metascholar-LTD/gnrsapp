-- Create FAQs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('getting-started', 'education', 'jobs', 'directories', 'hands-skills')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on category for faster filtering
CREATE INDEX idx_faqs_category ON public.faqs(category);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Public read access for FAQs (displayed on public FAQs page)
CREATE POLICY "Anyone can view FAQs" 
ON public.faqs FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for FAQs" 
ON public.faqs FOR ALL 
USING (true) WITH CHECK (true);

-- Create trigger for updated_at on FAQs
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default FAQs
INSERT INTO public.faqs (category, question, answer) VALUES
-- Getting Started FAQs
('getting-started', 'How do I create an account?', 'Creating an account is simple! Click on the ''Join'' button in the top navigation, fill in your details including your name, email address, and create a secure password. You''ll receive a verification email to activate your account. Once verified, you can start exploring all our features.'),
('getting-started', 'Is the platform free to use?', 'Yes! The Ghana National Resource System is completely free to use. All core features including accessing educational resources, job searches, directory listings, and news are available at no cost. We believe in making valuable resources accessible to everyone.'),
('getting-started', 'What features are available?', 'Our platform offers comprehensive resources including: Educational tools (past questions, CGPA calculator), Job portal with resume builder, Business and institution directories, Latest news and updates, Scholarship information, and much more. Explore each section to discover all available features.'),
('getting-started', 'How do I navigate the platform?', 'Use the main navigation menu at the top to access different sections. Each section has its own dedicated page with organized content. You can also use the search functionality to quickly find what you''re looking for. The platform is designed to be intuitive and user-friendly.'),
('getting-started', 'Can I save content for later?', 'Yes! Once you''re logged in, you can bookmark articles, save job listings, and create personalized lists. Look for the bookmark or save icon on content items. Your saved items will be accessible from your profile dashboard.'),
('getting-started', 'How do I update my profile?', 'After logging in, click on your profile icon in the top right corner. Select ''Profile Settings'' to update your personal information, preferences, and notification settings. You can also upload a profile picture and manage your account security settings.'),

-- Education FAQs
('education', 'How do I access past examination questions?', 'Navigate to the Education section and select ''Past Questions''. You can filter by subject, examination body (WAEC, NECO, etc.), and year. All past questions are available in PDF format and can be downloaded or viewed online. Some questions include detailed solutions and marking schemes.'),
('education', 'How does the CGPA calculator work?', 'Our CGPA calculator helps you convert your grades to GPA and calculate your cumulative grade point average. Simply select your institution''s grading system, enter your course credits and grades, and the calculator will automatically compute your GPA. It supports various grading systems used in Ghanaian institutions.'),
('education', 'Can I download study materials?', 'Yes! Most study materials including past questions, study guides, and educational resources are available for download. Simply click on the download icon next to any resource. Some premium resources may require account registration, but most materials are freely accessible.'),
('education', 'Are the past questions up to date?', 'We regularly update our database with the latest examination papers. Our collection includes questions from recent years as well as historical papers for comprehensive study. You can filter by year to find the most recent papers or browse older questions for practice.'),
('education', 'How can I join study groups?', 'Visit the Community section where you can find active study groups organized by subject or institution. You can join existing groups or create your own. Study groups allow you to share notes, discuss topics, and prepare for examinations together with other students.'),
('education', 'Is there a mobile app for accessing resources?', 'Currently, our platform is fully optimized for mobile browsers, providing an app-like experience. We''re working on dedicated mobile apps for iOS and Android that will be available soon. Subscribe to our newsletter to be notified when the apps launch.'),

-- Jobs FAQs
('jobs', 'How do I search for jobs?', 'Use the search bar at the top of the Jobs page to search by keywords, location, or job type. You can also use filters to narrow down results by industry, salary range, experience level, and employment type (full-time, part-time, contract). Save your search criteria to receive notifications when new matching jobs are posted.'),
('jobs', 'How do I create a professional resume?', 'Visit our Resume Builder tool which offers professional templates and step-by-step guidance. You can choose from various templates, add your work experience, education, skills, and achievements. The builder automatically formats your resume and allows you to download it in PDF format. You can also create multiple versions tailored for different job applications.'),
('jobs', 'Can I apply for jobs directly through the platform?', 'Yes! Most job listings allow you to apply directly through our platform. Simply click ''Apply Now'' on any job posting. You''ll be able to upload your resume, write a cover letter, and submit your application. Some employers may redirect you to their own application system, but we''ll guide you through the process.'),
('jobs', 'How do I get notified about new job postings?', 'Create a free account and set up job alerts based on your preferences. You can specify job titles, locations, industries, and salary ranges. We''ll send you email notifications when new jobs matching your criteria are posted. You can also follow specific companies to be notified when they post new positions.'),
('jobs', 'Is there a fee to use the job portal?', 'No! Our job portal is completely free for job seekers. You can search for jobs, create resumes, apply for positions, and access all features at no cost. Employers may have different pricing plans for posting jobs, but as a job seeker, everything is free.'),
('jobs', 'How do I improve my chances of getting hired?', 'Complete your profile with detailed information, upload a professional resume, and keep your skills updated. Apply to jobs that match your qualifications, customize your cover letter for each application, and follow up appropriately. Our platform also offers career tips and resources to help you stand out to employers.'),

-- Directories FAQs
('directories', 'How do I search for businesses or institutions?', 'Use the search bar at the top of any directory page to search by name, location, or category. You can also browse by category using the filter options. Each directory (Universities, Hospitals, Restaurants, Banks, etc.) has its own dedicated search page with advanced filtering options.'),
('directories', 'Can I write reviews for businesses?', 'Yes! After creating an account, you can write reviews for any business or institution listed in our directories. Simply navigate to the business page and click ''Write Review''. Your reviews help others make informed decisions and contribute to the community.'),
('directories', 'How do I add my business to the directory?', 'Business owners can list their establishments by clicking ''List Your Business'' on the relevant directory page. You''ll need to provide business information, location, contact details, and verification documents. Our team reviews submissions to ensure accuracy before publishing.'),
('directories', 'Are the listings verified?', 'We verify business information including contact details, location, and operating hours. However, we recommend contacting businesses directly to confirm current information, especially for operating hours and services offered. Verified businesses display a verification badge.'),
('directories', 'Can I save favorite listings?', 'Yes! Once logged in, you can save any listing to your favorites by clicking the bookmark icon. Your saved listings are accessible from your profile dashboard, making it easy to revisit businesses and institutions you''re interested in.'),
('directories', 'How accurate is the location information?', 'We use verified addresses and GPS coordinates to provide accurate location information. Each listing includes a map view, directions, and contact information. If you notice any inaccuracies, please report them through the ''Report Issue'' button on the listing page.'),

-- Hands & Skills FAQs
('hands-skills', 'How do I find skilled workers for my project?', 'Browse our Hands & Skills directory by category or use the search function to find skilled professionals. You can filter by location, skill type, ratings, and availability. Each profile includes work samples, reviews, and contact information to help you make an informed decision.'),
('hands-skills', 'How do I register as a skilled worker?', 'Click on ''Join as Skilled Worker'' and create your profile. You''ll need to provide your skills, experience, location, and upload work samples or portfolio images. After verification, your profile will be visible to potential clients. Keep your profile updated to attract more opportunities.'),
('hands-skills', 'Are skilled workers verified?', 'We verify skilled workers through document checks and portfolio reviews. Verified workers display a verification badge on their profiles. However, we recommend checking reviews and ratings from previous clients, and conducting your own due diligence before hiring.'),
('hands-skills', 'Can I leave reviews for skilled workers?', 'Yes! After completing a project with a skilled worker, you can leave a review and rating on their profile. Reviews help other clients make informed decisions and help skilled workers build their reputation. Only verified clients who have worked with a skilled worker can leave reviews.'),
('hands-skills', 'What categories of skilled workers are available?', 'Our platform includes various categories including electricians, plumbers, carpenters, masons, painters, mechanics, tailors, hairdressers, and many more. Browse by category to find the specific skills you need, or use the search function to find specialized professionals.'),
('hands-skills', 'How do I contact a skilled worker?', 'Once you find a skilled worker you''re interested in, click on their profile to view contact information including phone number and location. You can also send a message through our platform if the worker has enabled messaging. Always discuss project details, pricing, and timelines before starting work.');

