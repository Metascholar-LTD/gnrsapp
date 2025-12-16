import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Rocket, GraduationCap, Briefcase, FolderOpen, HelpCircle, Wrench } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type FAQCategory = 'all' | 'getting-started' | 'education' | 'jobs' | 'directories' | 'hands-skills';

interface FAQ {
  id: number;
  category: FAQCategory;
  question: string;
  answer: string;
}

const FAQs = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('all');

  const allFAQs: FAQ[] = [
    // Getting Started FAQs
    {
      id: 1,
      category: 'getting-started',
      question: "How do I create an account?",
      answer: "Creating an account is simple! Click on the 'Join' button in the top navigation, fill in your details including your name, email address, and create a secure password. You'll receive a verification email to activate your account. Once verified, you can start exploring all our features."
    },
    {
      id: 2,
      category: 'getting-started',
      question: "Is the platform free to use?",
      answer: "Yes! The Ghana National Resource System is completely free to use. All core features including accessing educational resources, job searches, directory listings, and news are available at no cost. We believe in making valuable resources accessible to everyone."
    },
    {
      id: 3,
      category: 'getting-started',
      question: "What features are available?",
      answer: "Our platform offers comprehensive resources including: Educational tools (past questions, CGPA calculator), Job portal with resume builder, Business and institution directories, Latest news and updates, Scholarship information, and much more. Explore each section to discover all available features."
    },
    {
      id: 4,
      category: 'getting-started',
      question: "How do I navigate the platform?",
      answer: "Use the main navigation menu at the top to access different sections. Each section has its own dedicated page with organized content. You can also use the search functionality to quickly find what you're looking for. The platform is designed to be intuitive and user-friendly."
    },
    {
      id: 5,
      category: 'getting-started',
      question: "Can I save content for later?",
      answer: "Yes! Once you're logged in, you can bookmark articles, save job listings, and create personalized lists. Look for the bookmark or save icon on content items. Your saved items will be accessible from your profile dashboard."
    },
    {
      id: 6,
      category: 'getting-started',
      question: "How do I update my profile?",
      answer: "After logging in, click on your profile icon in the top right corner. Select 'Profile Settings' to update your personal information, preferences, and notification settings. You can also upload a profile picture and manage your account security settings."
    },
    // Education FAQs
    {
      id: 7,
      category: 'education',
      question: "How do I access past examination questions?",
      answer: "Navigate to the Education section and select 'Past Questions'. You can filter by subject, examination body (WAEC, NECO, etc.), and year. All past questions are available in PDF format and can be downloaded or viewed online. Some questions include detailed solutions and marking schemes."
    },
    {
      id: 8,
      category: 'education',
      question: "How does the CGPA calculator work?",
      answer: "Our CGPA calculator helps you convert your grades to GPA and calculate your cumulative grade point average. Simply select your institution's grading system, enter your course credits and grades, and the calculator will automatically compute your GPA. It supports various grading systems used in Ghanaian institutions."
    },
    {
      id: 9,
      category: 'education',
      question: "Can I download study materials?",
      answer: "Yes! Most study materials including past questions, study guides, and educational resources are available for download. Simply click on the download icon next to any resource. Some premium resources may require account registration, but most materials are freely accessible."
    },
    {
      id: 10,
      category: 'education',
      question: "Are the past questions up to date?",
      answer: "We regularly update our database with the latest examination papers. Our collection includes questions from recent years as well as historical papers for comprehensive study. You can filter by year to find the most recent papers or browse older questions for practice."
    },
    {
      id: 11,
      category: 'education',
      question: "How can I join study groups?",
      answer: "Visit the Community section where you can find active study groups organized by subject or institution. You can join existing groups or create your own. Study groups allow you to share notes, discuss topics, and prepare for examinations together with other students."
    },
    {
      id: 12,
      category: 'education',
      question: "Is there a mobile app for accessing resources?",
      answer: "Currently, our platform is fully optimized for mobile browsers, providing an app-like experience. We're working on dedicated mobile apps for iOS and Android that will be available soon. Subscribe to our newsletter to be notified when the apps launch."
    },
    // Jobs FAQs
    {
      id: 13,
      category: 'jobs',
      question: "How do I search for jobs?",
      answer: "Use the search bar at the top of the Jobs page to search by keywords, location, or job type. You can also use filters to narrow down results by industry, salary range, experience level, and employment type (full-time, part-time, contract). Save your search criteria to receive notifications when new matching jobs are posted."
    },
    {
      id: 14,
      category: 'jobs',
      question: "How do I create a professional resume?",
      answer: "Visit our Resume Builder tool which offers professional templates and step-by-step guidance. You can choose from various templates, add your work experience, education, skills, and achievements. The builder automatically formats your resume and allows you to download it in PDF format. You can also create multiple versions tailored for different job applications."
    },
    {
      id: 15,
      category: 'jobs',
      question: "Can I apply for jobs directly through the platform?",
      answer: "Yes! Most job listings allow you to apply directly through our platform. Simply click 'Apply Now' on any job posting. You'll be able to upload your resume, write a cover letter, and submit your application. Some employers may redirect you to their own application system, but we'll guide you through the process."
    },
    {
      id: 16,
      category: 'jobs',
      question: "How do I get notified about new job postings?",
      answer: "Create a free account and set up job alerts based on your preferences. You can specify job titles, locations, industries, and salary ranges. We'll send you email notifications when new jobs matching your criteria are posted. You can also follow specific companies to be notified when they post new positions."
    },
    {
      id: 17,
      category: 'jobs',
      question: "Is there a fee to use the job portal?",
      answer: "No! Our job portal is completely free for job seekers. You can search for jobs, create resumes, apply for positions, and access all features at no cost. Employers may have different pricing plans for posting jobs, but as a job seeker, everything is free."
    },
    {
      id: 18,
      category: 'jobs',
      question: "How do I improve my chances of getting hired?",
      answer: "Complete your profile with detailed information, upload a professional resume, and keep your skills updated. Apply to jobs that match your qualifications, customize your cover letter for each application, and follow up appropriately. Our platform also offers career tips and resources to help you stand out to employers."
    },
    // Directories FAQs
    {
      id: 19,
      category: 'directories',
      question: "How do I search for businesses or institutions?",
      answer: "Use the search bar at the top of any directory page to search by name, location, or category. You can also browse by category using the filter options. Each directory (Universities, Hospitals, Restaurants, Banks, etc.) has its own dedicated search page with advanced filtering options."
    },
    {
      id: 20,
      category: 'directories',
      question: "Can I write reviews for businesses?",
      answer: "Yes! After creating an account, you can write reviews for any business or institution listed in our directories. Simply navigate to the business page and click 'Write Review'. Your reviews help others make informed decisions and contribute to the community."
    },
    {
      id: 21,
      category: 'directories',
      question: "How do I add my business to the directory?",
      answer: "Business owners can list their establishments by clicking 'List Your Business' on the relevant directory page. You'll need to provide business information, location, contact details, and verification documents. Our team reviews submissions to ensure accuracy before publishing."
    },
    {
      id: 22,
      category: 'directories',
      question: "Are the listings verified?",
      answer: "We verify business information including contact details, location, and operating hours. However, we recommend contacting businesses directly to confirm current information, especially for operating hours and services offered. Verified businesses display a verification badge."
    },
    {
      id: 23,
      category: 'directories',
      question: "Can I save favorite listings?",
      answer: "Yes! Once logged in, you can save any listing to your favorites by clicking the bookmark icon. Your saved listings are accessible from your profile dashboard, making it easy to revisit businesses and institutions you're interested in."
    },
    {
      id: 24,
      category: 'directories',
      question: "How accurate is the location information?",
      answer: "We use verified addresses and GPS coordinates to provide accurate location information. Each listing includes a map view, directions, and contact information. If you notice any inaccuracies, please report them through the 'Report Issue' button on the listing page."
    },
    // Hands & Skills FAQs
    {
      id: 25,
      category: 'hands-skills',
      question: "How do I find skilled workers for my project?",
      answer: "Browse our Hands & Skills directory by category or use the search function to find skilled professionals. You can filter by location, skill type, ratings, and availability. Each profile includes work samples, reviews, and contact information to help you make an informed decision."
    },
    {
      id: 26,
      category: 'hands-skills',
      question: "How do I register as a skilled worker?",
      answer: "Click on 'Join as Skilled Worker' and create your profile. You'll need to provide your skills, experience, location, and upload work samples or portfolio images. After verification, your profile will be visible to potential clients. Keep your profile updated to attract more opportunities."
    },
    {
      id: 27,
      category: 'hands-skills',
      question: "Are skilled workers verified?",
      answer: "We verify skilled workers through document checks and portfolio reviews. Verified workers display a verification badge on their profiles. However, we recommend checking reviews and ratings from previous clients, and conducting your own due diligence before hiring."
    },
    {
      id: 28,
      category: 'hands-skills',
      question: "Can I leave reviews for skilled workers?",
      answer: "Yes! After completing a project with a skilled worker, you can leave a review and rating on their profile. Reviews help other clients make informed decisions and help skilled workers build their reputation. Only verified clients who have worked with a skilled worker can leave reviews."
    },
    {
      id: 29,
      category: 'hands-skills',
      question: "What categories of skilled workers are available?",
      answer: "Our platform includes various categories including electricians, plumbers, carpenters, masons, painters, mechanics, tailors, hairdressers, and many more. Browse by category to find the specific skills you need, or use the search function to find specialized professionals."
    },
    {
      id: 30,
      category: 'hands-skills',
      question: "How do I contact a skilled worker?",
      answer: "Once you find a skilled worker you're interested in, click on their profile to view contact information including phone number and location. You can also send a message through our platform if the worker has enabled messaging. Always discuss project details, pricing, and timelines before starting work."
    }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? allFAQs 
    : allFAQs.filter(faq => faq.category === selectedCategory);

  const categories = [
    { id: 'all' as FAQCategory, label: 'All FAQs', icon: HelpCircle, count: allFAQs.length },
    { id: 'getting-started' as FAQCategory, label: 'Getting Started', icon: Rocket, count: allFAQs.filter(f => f.category === 'getting-started').length },
    { id: 'education' as FAQCategory, label: 'Education', icon: GraduationCap, count: allFAQs.filter(f => f.category === 'education').length },
    { id: 'jobs' as FAQCategory, label: 'Jobs', icon: Briefcase, count: allFAQs.filter(f => f.category === 'jobs').length },
    { id: 'directories' as FAQCategory, label: 'Directories', icon: FolderOpen, count: allFAQs.filter(f => f.category === 'directories').length },
    { id: 'hands-skills' as FAQCategory, label: 'Hands & Skills', icon: Wrench, count: allFAQs.filter(f => f.category === 'hands-skills').length }
  ];

  const fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

  return (
    <>
      <style>{`
        .faqs-content-wrapper {
          padding-top: 0.5rem;
        }

        .faqs-main-content {
          padding: 1rem;
        }

        /* Mobile: 0px - 767px */
        @media (max-width: 767px) {
          .faqs-content-wrapper {
            padding-top: 60px;
          }

          .faqs-main-content {
            padding: 1rem;
          }
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) and (max-width: 1199px) {
          .faqs-content-wrapper {
            padding-top: 70px;
          }

          .faqs-main-content {
            padding: 1.5rem;
          }
        }

        /* Desktop: 1200px - 1599px */
        @media (min-width: 1200px) and (max-width: 1599px) {
          .faqs-content-wrapper {
            padding-top: 120px;
          }

          .faqs-main-content {
            padding: 2rem;
          }
        }

        /* Large Desktop: 1600px+ */
        @media (min-width: 1600px) {
          .faqs-content-wrapper {
            padding-top: 120px;
          }

          .faqs-main-content {
            padding: 2rem clamp(2rem, 5vw, 4rem);
          }
        }
      `}</style>
      <div className="min-h-screen bg-white" style={{ '--tw-ring-color': 'transparent', '--tw-ring-offset-color': 'transparent' } as React.CSSProperties}>
        <Navigation />
        <div className="faqs-content-wrapper">
          <main className="container mx-auto faqs-main-content">
            {/* Filter Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  border: `1px solid ${selectedCategory === category.id ? '#0066cc' : '#e5e5e5'}`,
                  borderRadius: '0.5rem',
                  background: selectedCategory === category.id ? '#0066cc' : '#ffffff',
                  color: selectedCategory === category.id ? '#ffffff' : '#000000',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: fontFamily
                }}
              >
                <Icon size={16} style={{ color: selectedCategory === category.id ? '#ffffff' : '#000000' }} />
                <span>{category.label}</span>
                <span style={{
                  background: selectedCategory === category.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>{category.count}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 desktop:grid-cols-12 gap-12 items-start">
          {/* Left Column - Animation and Title */}
          <div className="desktop:col-span-5 flex flex-col items-center">
            <DotLottieReact
              src="https://lottie.host/7dbf111d-447f-43a6-908c-2762e179e2f8/d6YF6mcL8n.lottie"
              loop
              autoplay
              style={{ height: '320px', width: '320px' }}
            />
            <div className="mt-2 text-center">
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 700, 
                color: '#0066cc', 
                marginTop: '0.5rem', 
                textAlign: 'center', 
                letterSpacing: '0.01em',
                fontFamily: fontFamily
              }}>Frequently Asked Questions - Get Help</h1>
            </div>
          </div>

          {/* Right Column - FAQs */}
          <div className="desktop:col-span-7">
            <div className="space-y-4">
              {filteredFAQs.length === 0 ? (
                <div className="p-6 text-[15px] text-muted-foreground" style={{ fontFamily: fontFamily }}>No FAQs found. Try selecting a different category.</div>
              ) : (
                filteredFAQs.map((f) => (
                  <Card key={f.id} className="border border-[#e6e8ef] rounded-xl focus-within:ring-0 focus-within:border-[#e6e8ef]">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={f.id.toString()} className="border-none">
                        <AccordionTrigger 
                          className="px-5 py-4 text-left bg-white hover:bg-white focus:bg-white focus:outline-none focus:ring-0" 
                          style={{ 
                            fontSize: '1.13rem', 
                            fontWeight: 600, 
                            color: '#0066cc', 
                            fontFamily: fontFamily 
                          }}
                        >
                          {f.question}
                        </AccordionTrigger>
                        <AccordionContent 
                          className="px-5 pb-4 text-[15px] desktop:text-[16px] text-[#4b5563] leading-relaxed bg-[#f8fafc]" 
                          style={{ fontFamily: fontFamily }}
                        >
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FAQs;
