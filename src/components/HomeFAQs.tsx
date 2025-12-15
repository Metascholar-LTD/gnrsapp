import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ArrowRight } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export const HomeFAQs = () => {
  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I access datasets on the platform?",
      answer: "Navigate to the Datasets section from the main menu. You can browse datasets by category (Government, Finance, Health, Education) or use the search function to find specific datasets. All datasets are available for download in various formats including CSV, JSON, and Excel."
    },
    {
      id: 2,
      question: "Are the datasets free to download?",
      answer: "Yes! All datasets on our platform are completely free to download. We believe in making data accessible to everyone for research, analysis, and educational purposes. Simply browse to any dataset and click the download button."
    },
    {
      id: 3,
      question: "How often are datasets updated?",
      answer: "We regularly update our datasets to ensure accuracy and relevance. Most datasets are updated monthly or quarterly, depending on the data source. Each dataset page shows the last update date so you can verify the freshness of the data."
    },
    {
      id: 4,
      question: "Can I request specific datasets?",
      answer: "Yes! We welcome dataset requests from our users. If you need a specific dataset that's not currently available, you can submit a request through our contact form. We'll do our best to source and add requested datasets to our collection."
    },
    {
      id: 5,
      question: "What formats are available for download?",
      answer: "Most datasets are available in multiple formats including CSV (for spreadsheet applications), JSON (for developers), and Excel files. Some datasets also include GeoJSON for location-based data. You can choose your preferred format when downloading."
    },
    {
      id: 6,
      question: "How do I find directories for businesses and institutions?",
      answer: "Use the Directories section from the main navigation. You can browse by category (Hotels, Universities, Restaurants, Hospitals, Banks) or use the search function. Each directory includes detailed information, contact details, locations, and user reviews."
    }
  ];

  const fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

  return (
    <section 
      className="py-5 wow fadeIn" 
      data-wow-delay="0.1s"
      style={{
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}
    >
      <style>{`
        #hfaqs-section-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
          font-family: ${fontFamily};
        }

        #hfaqs-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(15px, 5vw, 80px);
        }
      `}</style>

      <div id="hfaqs-section-wrapper">
        <div id="hfaqs-container">
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
                <Link
                  to="/info/faqs"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#0066cc',
                    color: '#FFFFFF',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderRadius: '0.5rem',
                    transition: 'all 0.3s ease',
                    fontFamily: fontFamily
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0052a3';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0066cc';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View All FAQs
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right Column - FAQs */}
            <div className="desktop:col-span-7">
              <div className="space-y-4">
                {faqs.map((f) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

