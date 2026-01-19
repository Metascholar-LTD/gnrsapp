// ============================================================================
// SCHOLAR PROFILE COMPLETION
// ============================================================================
// Stepper-based profile completion after email verification
// Collects: University Affiliation, Department, Research Interests
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Building2, 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  X,
  Plus,
  Tag
} from 'lucide-react';

type ProfileData = {
  university: string;
  universityShort: string;
  department: string;
  title: string;
  researchInterests: string[];
  researchInterestInput: string;
  orcidId: string;
};

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [universitiesList, setUniversitiesList] = useState<Array<{ id: string; name: string; abbreviation: string | null }>>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    university: '',
    universityShort: '',
    department: '',
    title: 'lecturer',
    researchInterests: [],
    researchInterestInput: '',
    orcidId: '',
  });

  const totalSteps = 3;

  // Load institutions from database (for ranking)
  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('id, name, abbreviation')
          .order('name', { ascending: true });

        if (error) throw error;
        
        if (data) {
          setUniversitiesList(data);
        }
      } catch (error: any) {
        console.error('Error loading institutions:', error);
        // Fallback to hardcoded list if database fails
      } finally {
        setLoadingUniversities(false);
      }
    };

    loadInstitutions();
  }, []);

  // Use universities from database, fallback to hardcoded list
  const universities = universitiesList.length > 0 
    ? universitiesList.map(u => ({ name: u.name, short: u.abbreviation || '' }))
    : [
        { name: 'University of Ghana', short: 'UG' },
        { name: 'Kwame Nkrumah University of Science and Technology', short: 'KNUST' },
        { name: 'University of Cape Coast', short: 'UCC' },
        { name: 'University of Education, Winneba', short: 'UEW' },
        { name: 'University of Mines and Technology', short: 'UMaT' },
        { name: 'University for Development Studies', short: 'UDS' },
        { name: 'Ghana Institute of Management and Public Administration', short: 'GIMPA' },
        { name: 'Catholic University of Ghana', short: 'CUG' },
        { name: 'Presbyterian University College', short: 'PUC' },
        { name: 'University of Energy and Natural Resources', short: 'UENR' },
        { name: 'Accra Institute of Technology', short: 'AIT' },
      ];

  const academicTitles = [
    { value: 'lecturer', label: 'Lecturer' },
    { value: 'senior-lecturer', label: 'Senior Lecturer' },
    { value: 'associate-professor', label: 'Associate Professor' },
    { value: 'professor', label: 'Professor' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'independent', label: 'Independent Scholar' },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!profileData.university.trim()) {
        newErrors.university = 'University affiliation is required';
      }
      if (!profileData.department.trim()) {
        newErrors.department = 'Department is required';
      }
      if (!profileData.title) {
        newErrors.title = 'Academic title is required';
      }
    }

    if (step === 2) {
      if (profileData.researchInterests.length === 0) {
        newErrors.researchInterests = 'Please add at least one research interest';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        toast.error('Please sign in to complete your profile');
        navigate('/scholarly/auth/sign-up');
        return;
      }

      // Find university ID from selected university name
      const selectedUniversity = universitiesList.find(
        u => u.name === profileData.university
      );

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          university_id: selectedUniversity?.id || null,
          department: profileData.department || null,
          title: profileData.title || null,
          research_interests: profileData.researchInterests.length > 0 ? profileData.researchInterests : null,
          orcid_id: profileData.orcidId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', session.user.id);

      if (updateError) {
        // If profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: session.user.id,
            role: 'scholar',
            full_name: session.user.user_metadata?.full_name || 
                      session.user.user_metadata?.name || 
                      session.user.email?.split('@')[0] || 
                      null,
            university_id: selectedUniversity?.id || null,
            department: profileData.department || null,
            title: profileData.title || null,
            research_interests: profileData.researchInterests.length > 0 ? profileData.researchInterests : null,
            orcid_id: profileData.orcidId || null,
          });

        if (insertError) {
          throw insertError;
        }
      }

      toast.success('Profile completed successfully!');
      navigate('/scholar/dashboard');
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast.error(error.message || 'Failed to complete profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addResearchInterest = () => {
    const interest = profileData.researchInterestInput.trim();
    if (interest && !profileData.researchInterests.includes(interest)) {
      setProfileData(prev => ({
        ...prev,
        researchInterests: [...prev.researchInterests, interest],
        researchInterestInput: '',
      }));
      if (errors.researchInterests) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.researchInterests;
          return newErrors;
        });
      }
    }
  };

  const removeResearchInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.filter(i => i !== interest),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2'>
                <Building2 className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                University & Department
              </h2>
              <p className='text-slate-600 dark:text-slate-400 text-sm'>
                Tell us about your academic affiliation
              </p>
            </div>

            {/* University */}
            <div className='space-y-2'>
              <label htmlFor="university" className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2'>
                <Building2 className='w-4 h-4' />
                University Affiliation <span className='text-red-500'>*</span>
              </label>
              <select
                id="university"
                value={profileData.university}
                onChange={(e) => {
                  const selected = universities.find(u => u.name === e.target.value);
                  setProfileData(prev => ({
                    ...prev,
                    university: e.target.value,
                    universityShort: selected?.short || '',
                  }));
                  if (errors.university) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.university;
                      return newErrors;
                    });
                  }
                }}
                disabled={loadingUniversities}
                className='w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
                required
              >
                <option value="">Select your university</option>
                {universities.map((uni) => (
                  <option key={uni.short} value={uni.name}>
                    {uni.name}
                  </option>
                ))}
                <option value="other">Other (Please specify)</option>
              </select>
              {profileData.university === 'other' && (
                <input
                  type="text"
                  placeholder="Enter your university name"
                  value={profileData.university}
                  onChange={(e) => setProfileData(prev => ({ ...prev, university: e.target.value }))}
                  className='w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 mt-2'
                />
              )}
              {errors.university && (
                <p className='text-red-500 text-sm'>{errors.university}</p>
              )}
            </div>

            {/* Department */}
            <div className='space-y-2'>
              <label htmlFor="department" className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2'>
                <GraduationCap className='w-4 h-4' />
                Department <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                id="department"
                placeholder="e.g., Department of Computer Science"
                value={profileData.department}
                onChange={(e) => {
                  setProfileData(prev => ({ ...prev, department: e.target.value }));
                  if (errors.department) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.department;
                      return newErrors;
                    });
                  }
                }}
                className='w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
                required
              />
              {errors.department && (
                <p className='text-red-500 text-sm'>{errors.department}</p>
              )}
            </div>

            {/* Academic Title */}
            <div className='space-y-2'>
              <label htmlFor="title" className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2'>
                <GraduationCap className='w-4 h-4' />
                Academic Title <span className='text-red-500'>*</span>
              </label>
              <select
                id="title"
                value={profileData.title}
                onChange={(e) => {
                  setProfileData(prev => ({ ...prev, title: e.target.value }));
                  if (errors.title) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.title;
                      return newErrors;
                    });
                  }
                }}
                className='w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
                required
              >
                {academicTitles.map((title) => (
                  <option key={title.value} value={title.value}>
                    {title.label}
                  </option>
                ))}
              </select>
              {errors.title && (
                <p className='text-red-500 text-sm'>{errors.title}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2'>
                <Search className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                Research Interests
              </h2>
              <p className='text-slate-600 dark:text-slate-400 text-sm'>
                Add your research interests and areas of expertise
              </p>
            </div>

            {/* Research Interests */}
            <div className='space-y-2'>
              <label htmlFor="researchInterests" className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2'>
                <Tag className='w-4 h-4' />
                Research Interests <span className='text-red-500'>*</span>
              </label>
              <div className='flex gap-2'>
                <input
                  type="text"
                  id="researchInterests"
                  placeholder="e.g., Machine Learning, Quantum Computing"
                  value={profileData.researchInterestInput}
                  onChange={(e) => setProfileData(prev => ({ ...prev, researchInterestInput: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addResearchInterest();
                    }
                  }}
                  className='flex-1 h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
                />
                <button
                  type='button'
                  onClick={addResearchInterest}
                  className='h-12 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2'
                >
                  <Plus className='w-5 h-5' />
                  Add
                </button>
              </div>
              {errors.researchInterests && (
                <p className='text-red-500 text-sm'>{errors.researchInterests}</p>
              )}

              {/* Research Interests Tags */}
              {profileData.researchInterests.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-3'>
                  {profileData.researchInterests.map((interest, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium'
                    >
                      {interest}
                      <button
                        type='button'
                        onClick={() => removeResearchInterest(interest)}
                        className='hover:text-blue-900 dark:hover:text-blue-100'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ORCID ID (Optional) */}
            <div className='space-y-2'>
              <label htmlFor="orcidId" className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2'>
                <Tag className='w-4 h-4' />
                ORCID ID (Optional)
              </label>
              <input
                type="text"
                id="orcidId"
                placeholder="0000-0000-0000-0000"
                value={profileData.orcidId}
                onChange={(e) => setProfileData(prev => ({ ...prev, orcidId: e.target.value }))}
                className='w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
              />
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Link your ORCID profile to verify your academic identity
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2'>
                <CheckCircle2 className='w-6 h-6 text-green-600 dark:text-green-400' />
                Review & Complete
              </h2>
              <p className='text-slate-600 dark:text-slate-400 text-sm'>
                Review your information before completing your profile
              </p>
            </div>

            <div className='bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-4'>
              {/* University & Department */}
              <div>
                <h3 className='text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2'>University & Department</h3>
                <p className='text-slate-900 dark:text-slate-100 font-medium'>{profileData.university}</p>
                <p className='text-slate-600 dark:text-slate-400 text-sm'>{profileData.department}</p>
                <p className='text-slate-600 dark:text-slate-400 text-sm mt-1'>
                  {academicTitles.find(t => t.value === profileData.title)?.label}
                </p>
              </div>

              {/* Research Interests */}
              <div>
                <h3 className='text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2'>Research Interests</h3>
                <div className='flex flex-wrap gap-2'>
                  {profileData.researchInterests.map((interest, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium'
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* ORCID */}
              {profileData.orcidId && (
                <div>
                  <h3 className='text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2'>ORCID ID</h3>
                  <p className='text-slate-900 dark:text-slate-100 font-medium'>{profileData.orcidId}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className='min-h-screen flex items-center justify-center px-4 py-12 relative'
      style={{
        backgroundImage: 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/38816/image-from-rawpixel-id-2210775-jpeg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Blurred Background Overlay */}
      <div className='absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md'></div>
      
      <div className='relative z-10 w-full max-w-3xl'>
        {/* Form Container */}
        <div className='bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-10'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2'>
              Complete Your Profile
            </h1>
            <p className='text-slate-600 dark:text-slate-400 text-sm'>
              Finish setting up your scholar account
            </p>
          </div>

          {/* Stepper Progress */}
          <div className='flex items-center gap-3 mb-8'>
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className='flex items-center gap-2 flex-1'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      step < currentStep
                        ? 'bg-green-600 text-white'
                        : step === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle2 className='w-5 h-5' />
                    ) : (
                      step
                    )}
                  </div>
                  <span
                    className={`hidden md:block text-sm font-medium transition-colors ${
                      step === currentStep
                        ? 'text-slate-900 dark:text-slate-100'
                        : step < currentStep
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step === 1 && 'University'}
                    {step === 2 && 'Research'}
                    {step === 3 && 'Review'}
                  </span>
                </div>
                {step < totalSteps && (
                  <div
                    className={`flex-1 h-0.5 transition-colors ${
                      step < currentStep
                        ? 'bg-green-600'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          <div className='min-h-[400px] mb-8'>
            {renderStepContent()}
          </div>

          {/* Actions */}
          <div className='flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700'>
            {currentStep > 1 ? (
              <button
                type='button'
                onClick={handleBack}
                disabled={isSubmitting}
                className='group relative inline-block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <motion.span
                  className='relative inline-block pb-1 flex items-center gap-1.5'
                  whileHover={{ x: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ChevronLeft className='w-4 h-4' />
                  Back
                  <span
                    className='absolute bottom-0 left-0 h-[2px] bg-slate-400 dark:bg-slate-500 transition-all duration-300 group-hover:bg-slate-600 dark:group-hover:bg-slate-400'
                    style={{
                      width: 'calc(100% + 14px)',
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    }}
                  />
                </motion.span>
              </button>
            ) : (
              <button
                type='button'
                onClick={() => navigate('/scholar/dashboard')}
                className='group relative inline-block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300 hover:text-slate-900 dark:hover:text-slate-100'
              >
                <motion.span
                  className='relative inline-block pb-1 flex items-center gap-1.5'
                  whileHover={{ x: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <X className='w-4 h-4' />
                  Skip for now
                  <span
                    className='absolute bottom-0 left-0 h-[2px] bg-slate-400 dark:bg-slate-500 transition-all duration-300 group-hover:bg-slate-600 dark:group-hover:bg-slate-400'
                    style={{
                      width: 'calc(100% + 14px)',
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    }}
                  />
                </motion.span>
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type='button'
                onClick={handleNext}
                className='group relative inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-300 hover:text-blue-700 dark:hover:text-blue-300 ml-auto'
              >
                <motion.span
                  className='relative inline-block pb-1 flex items-center gap-1.5'
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Next
                  <ChevronRight className='w-4 h-4' />
                  <span
                    className='absolute bottom-0 left-0 h-[2px] bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:bg-blue-700 dark:group-hover:bg-blue-300'
                    style={{
                      width: 'calc(100% + 14px)',
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    }}
                  />
                </motion.span>
              </button>
            ) : (
              <button
                type='button'
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-auto'
              >
                {isSubmitting ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className='w-5 h-5' />
                    Complete Profile
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
