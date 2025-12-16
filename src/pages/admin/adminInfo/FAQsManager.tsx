import { useState, useEffect } from "react";
import { Save, Edit2, X, Plus, Trash2, Search } from "lucide-react";
import { ConfirmationModal } from "@/components/admin";

type FAQCategory = 'getting-started' | 'education' | 'jobs' | 'directories' | 'hands-skills';

interface FAQ {
  id: number;
  category: FAQCategory;
  question: string;
  answer: string;
}

const FAQsManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<FAQCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<FAQ>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null);

  const categoryLabels: Record<FAQCategory, string> = {
    'getting-started': 'Getting Started',
    'education': 'Education',
    'jobs': 'Jobs',
    'directories': 'Directories',
    'hands-skills': 'Hands & Skills',
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Save active tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('faqs-active-tab', activeTab);
    }
  }, [activeTab]);

  // Load active tab from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('faqs-active-tab');
      if (saved && (saved === 'all' || Object.keys(categoryLabels).includes(saved))) {
        setActiveTab(saved as FAQCategory | 'all');
      }
    }
  }, []);

  const fetchFAQs = async () => {
    try {
      // For now, initialize with default values since we haven't connected to Supabase yet
      const defaultFAQs: FAQ[] = [
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
        },
      ];
      setFaqs(defaultFAQs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };


  const startEditing = (faq: FAQ) => {
    setEditing(faq.id);
    setFormData(faq);
  };

  const cancelEditing = () => {
    setEditing(null);
    setFormData({});
  };

  const saveFAQ = () => {
    if (!formData.question || !formData.answer || !formData.category) {
      return;
    }

    if (editing) {
      // Update existing FAQ
      setFaqs(prev => prev.map(faq => 
        faq.id === editing ? { ...faq, ...formData } as FAQ : faq
      ));
    } else {
      // Add new FAQ
      const newId = Math.max(...faqs.map(f => f.id), 0) + 1;
      setFaqs(prev => [...prev, { ...formData, id: newId } as FAQ]);
    }

    setEditing(null);
    setFormData({});
  };

  const deleteFAQ = (id: number) => {
    setFaqToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (faqToDelete !== null) {
      setFaqs(prev => prev.filter(faq => faq.id !== faqToDelete));
      setFaqToDelete(null);
    }
  };

  const addNewFAQ = (category: FAQCategory) => {
    const newId = Math.max(...faqs.map(f => f.id), 0) + 1;
    setEditing(newId);
    setFormData({
      id: newId,
      category,
      question: '',
      answer: '',
    });
    // Scroll to the new form
    setTimeout(() => {
      const formElement = document.querySelector('.faq-item:last-child');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || faq.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="faq-loading">Loading...</div>;
  }

  return (
    <div className="faq-wrapper">
      <style>{`
        .faq-wrapper { width: 100%; }
        .faq-loading { padding: 2rem; text-align: center; color: #6b7280; }
        .faq-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .faq-header-left { display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 250px; }
        .faq-header-left .faq-btn { white-space: nowrap; }
        .faq-header-right { display: flex; gap: 0.75rem; }
        .faq-search { position: relative; flex: 1; max-width: 400px; }
        .faq-search input { width: 100%; padding: 0.625rem 0.625rem 0.625rem 2.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; }
        .faq-search input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .faq-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #6b7280; }
        .faq-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .faq-tabs::-webkit-scrollbar { height: 4px; }
        .faq-tabs::-webkit-scrollbar-track { background: #f3f4f6; }
        .faq-tabs::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
        .faq-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border: none; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: #6b7280; transition: all 0.2s; white-space: nowrap; }
        .faq-tab:hover { color: #374151; background: #f9fafb; }
        .faq-tab.active { color: #2563eb; border-bottom-color: #2563eb; background: transparent; }
        .faq-tab-count { background: #e5e7eb; color: #374151; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .faq-tab.active .faq-tab-count { background: #2563eb; color: #ffffff; }
        .faq-items-container { display: flex; flex-direction: column; gap: 0.75rem; }
        .faq-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; }
        .faq-btn-primary { background: #2563eb; color: #ffffff; }
        .faq-btn-primary:hover { background: #1d4ed8; }
        .faq-btn-secondary { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
        .faq-btn-secondary:hover { background: #e5e7eb; }
        .faq-item-meta { margin-bottom: 0.5rem; }
        .faq-item-category { display: inline-block; padding: 0.25rem 0.625rem; background: #f3f4f6; color: #6b7280; border-radius: 4px; font-size: 0.75rem; font-weight: 500; }
        .faq-item { border: 1px solid #e5e7eb; border-radius: 6px; background: #ffffff; overflow: hidden; }
        .faq-item-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1rem; gap: 1rem; }
        .faq-item-content { flex: 1; }
        .faq-item-question { font-size: 0.9375rem; font-weight: 600; color: #111827; margin: 0 0 0.5rem 0; line-height: 1.5; }
        .faq-item-answer { font-size: 0.875rem; color: #6b7280; line-height: 1.6; margin: 0; }
        .faq-item-actions { display: flex; gap: 0.5rem; }
        .faq-icon-btn { display: flex; align-items: center; justify-content: center; padding: 0.5rem; background: transparent; border: none; border-radius: 4px; cursor: pointer; color: #6b7280; transition: all 0.2s; }
        .faq-icon-btn:hover { background: #f3f4f6; color: #111827; }
        .faq-icon-btn-danger:hover { background: #fee2e2; color: #dc2626; }
        .faq-form { padding: 1.25rem; background: #f9fafb; border-top: 1px solid #e5e7eb; }
        .faq-form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .faq-form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .faq-form-group label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .faq-form-group input, .faq-form-group textarea, .faq-form-group select { padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; transition: border-color 0.2s; background: #ffffff; }
        .faq-form-group input:focus, .faq-form-group textarea:focus, .faq-form-group select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .faq-form-group textarea { resize: vertical; min-height: 120px; }
        .faq-form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }
        .faq-add-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; margin: 0.75rem; background: #f3f4f6; border: 1px dashed #d1d5db; border-radius: 6px; cursor: pointer; font-size: 0.875rem; color: #374151; transition: all 0.2s; }
        .faq-add-btn:hover { background: #e5e7eb; border-color: #9ca3af; }
        .faq-empty { padding: 2rem; text-align: center; color: #9ca3af; font-size: 0.875rem; }
        @media (max-width: 768px) {
          .faq-header { flex-direction: column; align-items: stretch; }
          .faq-search { max-width: 100%; }
          .faq-header-right { width: 100%; }
          .faq-tabs { gap: 0.25rem; }
          .faq-tab { padding: 0.625rem 1rem; font-size: 0.8125rem; }
        }
      `}</style>

      <div className="faq-header">
        <div className="faq-header-left">
          <div className="faq-search">
            <Search size={16} className="faq-search-icon" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="faq-btn faq-btn-primary" 
            onClick={() => addNewFAQ(activeTab === 'all' ? 'getting-started' : activeTab)}
            disabled={!!editing}
          >
            <Plus size={16} /> Add New FAQ
          </button>
        </div>
        <div className="faq-header-right">
          <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
            {activeTab === 'all' ? (
              <>Total: {filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? 's' : ''}</>
            ) : (
              <>{categoryLabels[activeTab]}: {filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? 's' : ''}</>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="faq-tabs">
        <button
          className={`faq-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>All FAQs</span>
          <span className="faq-tab-count">{faqs.length}</span>
        </button>
        {Object.entries(categoryLabels).map(([categoryKey, categoryLabel]) => {
          const category = categoryKey as FAQCategory;
          const count = faqs.filter(f => f.category === category).length;
          return (
            <button
              key={category}
              className={`faq-tab ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              <span>{categoryLabel}</span>
              <span className="faq-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="faq-items-container">
        {filteredFAQs.length === 0 ? (
          <div className="faq-empty">
            {searchQuery ? 'No FAQs found matching your search.' : `No FAQs in ${activeTab === 'all' ? 'this section' : categoryLabels[activeTab]}.`}
          </div>
        ) : (
          <>
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="faq-item">
                {editing === faq.id ? (
                  <div className="faq-form">
                    <div className="faq-form-grid">
                      <div className="faq-form-group">
                        <label>Category</label>
                        <select
                          value={formData.category || faq.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as FAQCategory })}
                        >
                          {Object.entries(categoryLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="faq-form-group">
                        <label>Question</label>
                        <input
                          type="text"
                          value={formData.question || ''}
                          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                          placeholder="Enter the question"
                        />
                      </div>
                      <div className="faq-form-group">
                        <label>Answer</label>
                        <textarea
                          value={formData.answer || ''}
                          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                          placeholder="Enter the answer"
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="faq-form-actions">
                      <button className="faq-btn faq-btn-secondary" onClick={cancelEditing}>
                        <X size={14} /> Cancel
                      </button>
                      <button className="faq-btn faq-btn-primary" onClick={saveFAQ}>
                        <Save size={14} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="faq-item-header">
                      <div className="faq-item-content">
                        <div className="faq-item-meta">
                          <span className="faq-item-category">{categoryLabels[faq.category]}</span>
                        </div>
                        <h4 className="faq-item-question">{faq.question}</h4>
                        <p className="faq-item-answer">{faq.answer}</p>
                      </div>
                      <div className="faq-item-actions">
                        <button className="faq-icon-btn" onClick={() => startEditing(faq)} title="Edit FAQ">
                          <Edit2 size={16} />
                        </button>
                        <button className="faq-icon-btn faq-icon-btn-danger" onClick={() => deleteFAQ(faq.id)} title="Delete FAQ">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {editing && !filteredFAQs.find(f => f.id === editing) && (
              <div className="faq-item">
                <div className="faq-form">
                  <div className="faq-form-grid">
                    <div className="faq-form-group">
                      <label>Category</label>
                      <select
                        value={formData.category || activeTab !== 'all' ? activeTab : 'getting-started'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as FAQCategory })}
                      >
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="faq-form-group">
                      <label>Question</label>
                      <input
                        type="text"
                        value={formData.question || ''}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Enter the question"
                      />
                    </div>
                    <div className="faq-form-group">
                      <label>Answer</label>
                      <textarea
                        value={formData.answer || ''}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Enter the answer"
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="faq-form-actions">
                    <button className="faq-btn faq-btn-secondary" onClick={cancelEditing}>
                      <X size={14} /> Cancel
                    </button>
                    <button className="faq-btn faq-btn-primary" onClick={saveFAQ}>
                      <Save size={14} /> Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!editing && (
              <button className="faq-add-btn" onClick={() => addNewFAQ(activeTab === 'all' ? 'getting-started' : activeTab)}>
                <Plus size={16} /> Add New FAQ
              </button>
            )}

          </>
        )}
      </div>

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default FAQsManager;

