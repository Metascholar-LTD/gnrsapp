import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Award,
  Clock,
  Star,
  CheckCircle2,
  Upload,
  Calendar,
  DollarSign,
  Globe,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Loader2,
  X,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

// Types
interface MentorApplication {
  step: number;
  personalInfo: {
    bio: string;
    headline: string;
    photo?: string;
  };
  expertise: string[];
  experience: {
    title: string;
    company: string;
    years: string;
  }[];
  availability: {
    timezone: string;
    hoursPerWeek: string;
    preferredDays: string[];
  };
  credentials: {
    education: string;
    certifications: string[];
  };
}

const expertiseOptions = [
  'Software Engineering',
  'Data Science',
  'Product Management',
  'UX Design',
  'Entrepreneurship',
  'Career Development',
  'Research & Academia',
  'Finance & Accounting',
  'Marketing',
  'Leadership',
  'Cloud Computing',
  'Machine Learning'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const BecomeMentor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState<MentorApplication>({
    step: 1,
    personalInfo: { bio: '', headline: '' },
    expertise: [],
    experience: [{ title: '', company: '', years: '' }],
    availability: { timezone: 'GMT', hoursPerWeek: '2-5', preferredDays: [] },
    credentials: { education: '', certifications: [] }
  });
  const [newCertification, setNewCertification] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpertise = (exp: string) => {
    setApplication(prev => ({
      ...prev,
      expertise: prev.expertise.includes(exp)
        ? prev.expertise.filter(e => e !== exp)
        : [...prev.expertise, exp]
    }));
  };

  const toggleDay = (day: string) => {
    setApplication(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        preferredDays: prev.availability.preferredDays.includes(day)
          ? prev.availability.preferredDays.filter(d => d !== day)
          : [...prev.availability.preferredDays, day]
      }
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setApplication(prev => ({
        ...prev,
        credentials: {
          ...prev.credentials,
          certifications: [...prev.credentials.certifications, newCertification.trim()]
        }
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setApplication(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        certifications: prev.credentials.certifications.filter(c => c !== cert)
      }
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowForm(false);
      alert('Application submitted successfully! We will review your application and get back to you.');
    }, 1500);
  };

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Expertise' },
    { number: 3, title: 'Experience' },
    { number: 4, title: 'Availability' }
  ];

  const benefits = [
    { icon: <Users size={24} />, title: 'Impact Lives', description: 'Guide aspiring professionals and help them achieve their goals' },
    { icon: <Award size={24} />, title: 'Build Reputation', description: 'Establish yourself as an industry expert and thought leader' },
    { icon: <DollarSign size={24} />, title: 'Earn Income', description: 'Set your own rates and earn from mentoring sessions' },
    { icon: <Globe size={24} />, title: 'Expand Network', description: 'Connect with talented individuals from around the world' }
  ];

  if (isMentor) {
    // Mentor Dashboard view would go here
    return (
      <div className="container-fluid p-0">
        <h1 className="h3 mb-4"><strong>Mentor</strong> Dashboard</h1>
        <p>Your mentor dashboard content here...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {!showForm ? (
        <>
          {/* Hero Section */}
          <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #696cff 0%, #5a5de0 100%)', color: '#FFFFFF' }}>
            <div className="card-body py-5">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h1 style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
                    Share Your Expertise, Shape Futures
                  </h1>
                  <p style={{ fontSize: '1.0625rem', opacity: 0.9, marginBottom: '24px', maxWidth: '600px' }}>
                    Join our community of mentors and help aspiring professionals navigate their career journeys.
                    Make a lasting impact while building your personal brand.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      backgroundColor: '#FFFFFF',
                      color: '#696cff',
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Apply to Become a Mentor
                    <ChevronRight size={18} />
                  </button>
                </div>
                <div className="col-lg-4 d-none d-lg-block text-center">
                  <Users size={120} strokeWidth={1} style={{ opacity: 0.3 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <h5 style={{ fontWeight: 600, color: '#1C1917', marginBottom: '16px' }}>Why Become a Mentor?</h5>
          <div className="row g-3 mb-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="col-md-6 col-lg-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card h-100">
                  <div className="card-body text-center">
                    <div style={{
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(105, 108, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#696cff',
                      margin: '0 auto 16px'
                    }}>
                      {benefit.icon}
                    </div>
                    <h6 style={{ fontWeight: 600, color: '#1C1917', marginBottom: '8px' }}>{benefit.title}</h6>
                    <p style={{ fontSize: '0.875rem', color: '#78716C', margin: 0 }}>{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Requirements */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title m-0">Requirements to Become a Mentor</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[
                  { icon: <Briefcase size={20} />, text: 'At least 3 years of professional experience' },
                  { icon: <GraduationCap size={20} />, text: 'Relevant educational background or certifications' },
                  { icon: <Clock size={20} />, text: 'Minimum 2 hours per week availability' },
                  { icon: <Star size={20} />, text: 'Passion for helping others succeed' }
                ].map((req, i) => (
                  <div key={i} className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(113, 221, 55, 0.1)',
                        borderRadius: '8px',
                        color: '#71dd37'
                      }}>
                        {req.icon}
                      </div>
                      <span style={{ fontSize: '0.9375rem', color: '#1C1917' }}>{req.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <h2 style={{ fontWeight: 700, color: '#696cff', marginBottom: '4px' }}>500+</h2>
                  <p style={{ color: '#78716C', margin: 0 }}>Active Mentors</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <h2 style={{ fontWeight: 700, color: '#71dd37', marginBottom: '4px' }}>10,000+</h2>
                  <p style={{ color: '#78716C', margin: 0 }}>Sessions Completed</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <h2 style={{ fontWeight: 700, color: '#ffab00', marginBottom: '4px' }}>4.8</h2>
                  <p style={{ color: '#78716C', margin: 0 }}>Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Application Form */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h1 className="h3 mb-1"><strong>Mentor</strong> Application</h1>
              <p style={{ color: '#78716C', margin: 0 }}>Complete your application to become a mentor</p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: '#78716C' }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="card mb-4">
            <div className="card-body py-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '40px',
                  right: '40px',
                  height: '2px',
                  backgroundColor: '#E7E5E4',
                  zIndex: 0
                }}>
                  <div style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    height: '100%',
                    backgroundColor: '#696cff',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                {steps.map(step => (
                  <div key={step.number} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: currentStep >= step.number ? '#696cff' : '#FFFFFF',
                      border: `2px solid ${currentStep >= step.number ? '#696cff' : '#E7E5E4'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentStep >= step.number ? '#FFFFFF' : '#A8A29E',
                      fontWeight: 600,
                      margin: '0 auto 8px',
                      transition: 'all 0.3s ease'
                    }}>
                      {currentStep > step.number ? <CheckCircle2 size={20} /> : step.number}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: currentStep >= step.number ? '#696cff' : '#A8A29E',
                      fontWeight: currentStep === step.number ? 600 : 400
                    }}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Steps */}
          <div className="card">
            <div className="card-body">
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h5 style={{ fontWeight: 600, marginBottom: '20px' }}>Personal Information</h5>
                  <div className="mb-4">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1C1917', marginBottom: '8px' }}>
                      Profile Photo
                    </label>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      border: '2px dashed #E7E5E4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#A8A29E',
                      transition: 'border-color 0.2s'
                    }}>
                      <ImageIcon size={32} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1C1917', marginBottom: '8px' }}>
                      Professional Headline *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Software Engineer at Google"
                      value={application.personalInfo.headline}
                      onChange={(e) => setApplication({ ...application, personalInfo: { ...application.personalInfo, headline: e.target.value } })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E7E5E4',
                        borderRadius: '8px',
                        fontSize: '0.9375rem'
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1C1917', marginBottom: '8px' }}>
                      Bio *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell mentees about yourself, your experience, and what you can help them with..."
                      value={application.personalInfo.bio}
                      onChange={(e) => setApplication({ ...application, personalInfo: { ...application.personalInfo, bio: e.target.value } })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E7E5E4',
                        borderRadius: '8px',
                        fontSize: '0.9375rem',
                        resize: 'vertical'
                      }}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#A8A29E', marginTop: '4px' }}>
                      {application.personalInfo.bio.length}/500 characters
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h5 style={{ fontWeight: 600, marginBottom: '8px' }}>Areas of Expertise</h5>
                  <p style={{ color: '#78716C', marginBottom: '20px' }}>Select the areas where you can provide mentorship (minimum 2)</p>
                  <div className="d-flex flex-wrap gap-2">
                    {expertiseOptions.map(exp => (
                      <button
                        key={exp}
                        onClick={() => toggleExpertise(exp)}
                        style={{
                          padding: '10px 16px',
                          border: `2px solid ${application.expertise.includes(exp) ? '#696cff' : '#E7E5E4'}`,
                          borderRadius: '8px',
                          backgroundColor: application.expertise.includes(exp) ? 'rgba(105, 108, 255, 0.1)' : 'transparent',
                          color: application.expertise.includes(exp) ? '#696cff' : '#78716C',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {application.expertise.includes(exp) && <CheckCircle2 size={14} style={{ marginRight: '6px' }} />}
                        {exp}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h5 style={{ fontWeight: 600, marginBottom: '20px' }}>Professional Experience</h5>
                  {application.experience.map((exp, index) => (
                    <div key={index} style={{ padding: '16px', backgroundColor: '#FAFAF9', borderRadius: '8px', marginBottom: '16px' }}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={{ display: 'block', fontSize: '0.8125rem', color: '#78716C', marginBottom: '4px' }}>Job Title</label>
                          <input
                            type="text"
                            placeholder="e.g., Senior Engineer"
                            value={exp.title}
                            onChange={(e) => {
                              const newExp = [...application.experience];
                              newExp[index].title = e.target.value;
                              setApplication({ ...application, experience: newExp });
                            }}
                            style={{ width: '100%', padding: '10px', border: '1px solid #E7E5E4', borderRadius: '6px', fontSize: '0.875rem' }}
                          />
                        </div>
                        <div className="col-md-4">
                          <label style={{ display: 'block', fontSize: '0.8125rem', color: '#78716C', marginBottom: '4px' }}>Company</label>
                          <input
                            type="text"
                            placeholder="e.g., Google"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...application.experience];
                              newExp[index].company = e.target.value;
                              setApplication({ ...application, experience: newExp });
                            }}
                            style={{ width: '100%', padding: '10px', border: '1px solid #E7E5E4', borderRadius: '6px', fontSize: '0.875rem' }}
                          />
                        </div>
                        <div className="col-md-2">
                          <label style={{ display: 'block', fontSize: '0.8125rem', color: '#78716C', marginBottom: '4px' }}>Years</label>
                          <input
                            type="text"
                            placeholder="e.g., 5"
                            value={exp.years}
                            onChange={(e) => {
                              const newExp = [...application.experience];
                              newExp[index].years = e.target.value;
                              setApplication({ ...application, experience: newExp });
                            }}
                            style={{ width: '100%', padding: '10px', border: '1px solid #E7E5E4', borderRadius: '6px', fontSize: '0.875rem' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setApplication({ ...application, experience: [...application.experience, { title: '', company: '', years: '' }] })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: 'transparent',
                      color: '#696cff',
                      border: '1px dashed #696cff',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                    Add Another Position
                  </button>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h5 style={{ fontWeight: 600, marginBottom: '20px' }}>Availability & Preferences</h5>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1C1917', marginBottom: '8px' }}>
                        Time Zone
                      </label>
                      <select
                        value={application.availability.timezone}
                        onChange={(e) => setApplication({ ...application, availability: { ...application.availability, timezone: e.target.value } })}
                        style={{ width: '100%', padding: '12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '0.875rem' }}
                      >
                        <option value="GMT">GMT (Ghana)</option>
                        <option value="EST">EST (Eastern US)</option>
                        <option value="PST">PST (Pacific US)</option>
                        <option value="CET">CET (Central Europe)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1C1917', marginBottom: '8px' }}>
                        Hours per Week
                      </label>
                      <select
                        value={application.availability.hoursPerWeek}
                        onChange={(e) => setApplication({ ...application, availability: { ...application.availability, hoursPerWeek: e.target.value } })}
                        style={{ width: '100%', padding: '12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '0.875rem' }}
                      >
                        <option value="2-5">2-5 hours</option>
                        <option value="5-10">5-10 hours</option>
                        <option value="10+">10+ hours</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1C1917', marginBottom: '12px' }}>
                        Preferred Days
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {daysOfWeek.map(day => (
                          <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            style={{
                              padding: '8px 16px',
                              border: `2px solid ${application.availability.preferredDays.includes(day) ? '#696cff' : '#E7E5E4'}`,
                              borderRadius: '6px',
                              backgroundColor: application.availability.preferredDays.includes(day) ? 'rgba(105, 108, 255, 0.1)' : 'transparent',
                              color: application.availability.preferredDays.includes(day) ? '#696cff' : '#78716C',
                              fontSize: '0.8125rem',
                              cursor: 'pointer'
                            }}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Form Actions */}
            <div className="card-footer d-flex justify-content-between">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'transparent',
                  color: currentStep === 1 ? '#A8A29E' : '#78716C',
                  border: '1px solid #E7E5E4',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#696cff',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    backgroundColor: '#71dd37',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: loading ? 'wait' : 'pointer'
                  }}
                >
                  {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={16} />}
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default BecomeMentor;
