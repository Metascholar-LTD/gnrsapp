// ============================================================================
// SCHOLAR UNIFIED SETTINGS PAGE - Pinterest Style
// ============================================================================
// Combines Edit Profile, Account Settings, Privacy, Notifications, Security
// Preserves all existing Supabase connections from MyProfile.tsx
// ============================================================================

import React, { useState, useEffect, memo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Building2,
  GraduationCap,
  Tag,
  Save,
  Loader2,
  Upload,
  Lock,
  Bell,
  Shield,
  Eye,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  X,
  Plus
} from 'lucide-react';

// Toggle Switch Component
const ToggleSwitch = memo(({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    className="relative flex-shrink-0"
    style={{
      width: '48px',
      height: '28px',
      borderRadius: '14px',
      backgroundColor: enabled ? '#3b82f6' : '#cdcdcd',
      transition: 'background-color 0.2s ease',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '2px',
        left: enabled ? '22px' : '2px',
        width: '24px',
        height: '24px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s ease'
      }}
    />
  </button>
));

ToggleSwitch.displayName = 'ToggleSwitch';

// Notification Item Component
interface NotificationItemProps {
  title: string;
  description?: string;
  isExpanded: boolean;
  onExpandToggle: () => void;
  pushEnabled: boolean;
  emailEnabled: boolean;
  onPushToggle: () => void;
  onEmailToggle: () => void;
}

const NotificationItem = memo(({
  title,
  description,
  isExpanded,
  onExpandToggle,
  pushEnabled,
  emailEnabled,
  onPushToggle,
  onEmailToggle
}: NotificationItemProps) => {
  const statusText = `${emailEnabled ? 'Email on' : 'Email off'}${pushEnabled ? ', push on' : ''}`;

  return (
    <div style={{ borderBottom: '1px solid #e2e8f0' }}>
      <button
        onClick={onExpandToggle}
        className="w-full flex items-center justify-between py-4 px-1 text-left"
        type="button"
      >
        <div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#334155' }}>{title}</p>
          {!isExpanded && (
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>{statusText}</p>
          )}
        </div>
        {isExpanded ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
      </button>

      <div
        style={{
          maxHeight: isExpanded ? '200px' : '0',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.2s ease, opacity 0.2s ease'
        }}
      >
        {description && (
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', paddingLeft: '4px' }}>
            {description}
          </p>
        )}
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px', paddingLeft: '4px' }}>
          How do you want to be notified?
        </p>
        <div className="space-y-3 pb-4 pl-1">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', color: '#334155' }}>Email</span>
            <ToggleSwitch enabled={emailEnabled} onToggle={onEmailToggle} />
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', color: '#334155' }}>Push</span>
            <ToggleSwitch enabled={pushEnabled} onToggle={onPushToggle} />
          </div>
        </div>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

const ScholarUnifiedSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('edit-profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [profile, setProfile] = useState<any>(null);
  const [universities, setUniversities] = useState<Array<{ id: string; name: string; abbreviation: string | null }>>([]);

  // Profile data - connected to Supabase profiles table
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    institution_id: '',
    department: '',
    title: '',
    research_interests: [] as string[],
    research_interest_input: '',
    orcid_id: '',
    profile_image: '',
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: true,
    showInstitution: true,
    showResearchInterests: true,
    showPublications: true,
    searchEngineIndexing: true
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    paperSubmission: { email: true, push: true },
    reviewResults: { email: true, push: true },
    citations: { email: true, push: false },
    collaborations: { email: true, push: true },
    announcements: { email: false, push: false }
  });
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [useGoogleLogin, setUseGoogleLogin] = useState(false);

  const academicTitles = [
    { value: 'lecturer', label: 'Lecturer' },
    { value: 'senior-lecturer', label: 'Senior Lecturer' },
    { value: 'associate-professor', label: 'Associate Professor' },
    { value: 'professor', label: 'Professor' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'independent', label: 'Independent Scholar' },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadProfile();
    loadUniversities();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to view your profile');
        setIsLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, institutions(name, abbreviation)')
        .eq('user_id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          bio: profileData.bio || '',
          institution_id: profileData.institution_id || '',
          department: profileData.department || '',
          title: profileData.title || '',
          research_interests: profileData.research_interests || [],
          research_interest_input: '',
          orcid_id: profileData.orcid_id || '',
          profile_image: profileData.profile_image || '',
        });
      } else {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: session.user.id,
            role: 'scholar',
            full_name: session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0] ||
              null,
          })
          .select()
          .single();

        if (createError) throw createError;

        if (newProfile) {
          setProfile(newProfile);
          setFormData(prev => ({
            ...prev,
            full_name: newProfile.full_name || '',
          }));
        }
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name, abbreviation')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data) setUniversities(data);
    } catch (error: any) {
      console.error('Error loading institutions:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to upload images');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Delete old image
      if (formData.profile_image) {
        try {
          const urlParts = formData.profile_image.split('/');
          const publicIndex = urlParts.findIndex(part => part === 'public');
          if (publicIndex !== -1 && publicIndex < urlParts.length - 1) {
            const pathAfterPublic = urlParts.slice(publicIndex + 1);
            if (pathAfterPublic.length >= 2) {
              const oldFilePath = pathAfterPublic.slice(1).join('/');
              await supabase.storage
                .from('profile-images')
                .remove([oldFilePath]);
            }
          }
        } catch (error) {
          console.warn('Could not delete old image:', error);
        }
      }

      setFormData(prev => ({ ...prev, profile_image: publicUrl }));
      toast.success('Profile image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const addResearchInterest = () => {
    const interest = formData.research_interest_input.trim();
    if (interest && !formData.research_interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        research_interests: [...prev.research_interests, interest],
        research_interest_input: '',
      }));
    }
  };

  const removeResearchInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      research_interests: prev.research_interests.filter(i => i !== interest),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to update your profile');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
          bio: formData.bio || null,
          institution_id: formData.institution_id || null,
          department: formData.department || null,
          title: formData.title || null,
          research_interests: formData.research_interests.length > 0 ? formData.research_interests : null,
          orcid_id: formData.orcid_id || null,
          profile_image: formData.profile_image || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast.success('Settings saved successfully');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadProfile();

      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        institution_id: profile.institution_id || '',
        department: profile.department || '',
        title: profile.title || '',
        research_interests: profile.research_interests || [],
        research_interest_input: '',
        orcid_id: profile.orcid_id || '',
        profile_image: profile.profile_image || '',
      });
    }
  };

  const toggleNotificationExpand = (key: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const menuItems = [
    { id: 'edit-profile', label: 'Edit profile' },
    { id: 'academic-info', label: 'Academic information' },
    { id: 'account-management', label: 'Account management' },
    { id: 'profile-visibility', label: 'Profile visibility' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy-data', label: 'Privacy and data' },
    { id: 'security', label: 'Security' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#3b82f6' }} />
          <p style={{ color: '#64748b' }}>Loading settings...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'edit-profile':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Edit profile</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
              Manage your academic profile and personal information
            </p>

            {/* Photo */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Profile Photo</label>
              <div className="flex items-center gap-4">
                {formData.profile_image ? (
                  <img
                    src={formData.profile_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-xl object-cover"
                    style={{ border: '2px solid #e2e8f0' }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#f1f5f9', border: '2px solid #e2e8f0' }}
                  >
                    <User size={36} style={{ color: '#94a3b8' }} />
                  </div>
                )}
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                  />
                  <span
                    className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer inline-flex items-center gap-2"
                    style={{ backgroundColor: '#3b82f6', color: '#fff' }}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Change
                      </>
                    )}
                  </span>
                </label>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>JPG, PNG or GIF. Max size 5MB</p>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#e2e8f0', fontSize: '16px', color: '#334155' }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about your research and academic background"
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                  style={{ borderColor: '#e2e8f0', fontSize: '16px', color: '#334155', minHeight: '120px' }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>
          </div>
        );

      case 'academic-info':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Academic information</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
              Your institutional affiliation and research details
            </p>

            <div className="space-y-6">
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  University
                </label>
                <select
                  value={formData.institution_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors bg-white"
                  style={{ borderColor: '#e2e8f0', fontSize: '16px', color: formData.institution_id ? '#334155' : '#94a3b8' }}
                >
                  <option value="">Select your university</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#e2e8f0', fontSize: '16px', color: '#334155' }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  placeholder="e.g., Department of Computer Science"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Academic Title
                </label>
                <select
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors bg-white"
                  style={{ borderColor: '#e2e8f0', fontSize: '16px', color: formData.title ? '#334155' : '#94a3b8' }}
                >
                  <option value="">Select your title</option>
                  {academicTitles.map((title) => (
                    <option key={title.value} value={title.value}>
                      {title.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Research Interests */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Research Interests
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={formData.research_interest_input}
                    onChange={(e) => setFormData(prev => ({ ...prev, research_interest_input: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addResearchInterest();
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                    style={{ borderColor: '#e2e8f0', fontSize: '16px', color: '#334155' }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    placeholder="e.g., Machine Learning"
                  />
                  <button
                    type="button"
                    onClick={addResearchInterest}
                    className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                    style={{ backgroundColor: '#3b82f6', color: '#fff' }}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                {formData.research_interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.research_interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeResearchInterest(interest)}
                          className="hover:opacity-70"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ORCID */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  ORCID ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.orcid_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, orcid_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#e2e8f0', fontSize: '16px', color: '#334155' }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  placeholder="0000-0000-0000-0000"
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                  Link your ORCID profile to verify your academic identity
                </p>
              </div>
            </div>
          </div>
        );

      case 'account-management':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Account management</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
              Manage your account settings
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Your account</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Email</p>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>{profile?.email || 'Not set'}</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#3b82f6' }}>Change</button>
                </div>

                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Password</p>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>********</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#3b82f6' }}>Change</button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '48px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Delete account</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Permanently delete your scholar account and all publications
              </p>
              <button
                className="px-4 py-2 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '14px' }}
              >
                Delete account
              </button>
            </div>
          </div>
        );

      case 'profile-visibility':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Profile visibility</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
              Control how your academic profile appears to others
            </p>

            <div className="space-y-6">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Who can see your profile</h3>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Public', desc: 'Anyone can view your academic profile' },
                    { value: 'scholars', label: 'Scholars only', desc: 'Only verified scholars can view' },
                    { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors"
                      style={{
                        backgroundColor: privacySettings.profileVisibility === option.value ? '#dbeafe' : '#fff',
                        border: `2px solid ${privacySettings.profileVisibility === option.value ? '#3b82f6' : '#e2e8f0'}`
                      }}
                    >
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option.value}
                        checked={privacySettings.profileVisibility === option.value}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                        className="mt-1"
                        style={{ accentColor: '#3b82f6' }}
                      />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{option.label}</p>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Profile sections</h3>
                <div className="space-y-4">
                  {[
                    { key: 'showEmail', label: 'Show email', desc: 'Display your email on profile' },
                    { key: 'showInstitution', label: 'Show institution', desc: 'Display your university affiliation' },
                    { key: 'showResearchInterests', label: 'Show research interests', desc: 'Display your research areas' },
                    { key: 'showPublications', label: 'Show publications', desc: 'List your published papers' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{item.label}</p>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>{item.desc}</p>
                      </div>
                      <ToggleSwitch
                        enabled={privacySettings[item.key as keyof typeof privacySettings] as boolean}
                        onToggle={() => setPrivacySettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Notifications</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
              Choose how you want to be notified about academic activity
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Publications</h3>

              <NotificationItem
                title="Paper submissions"
                description="Updates on your submitted papers"
                isExpanded={expandedNotifications.has('paperSubmission')}
                onExpandToggle={() => toggleNotificationExpand('paperSubmission')}
                emailEnabled={notifications.paperSubmission.email}
                pushEnabled={notifications.paperSubmission.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  paperSubmission: { ...prev.paperSubmission, email: !prev.paperSubmission.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  paperSubmission: { ...prev.paperSubmission, push: !prev.paperSubmission.push }
                }))}
              />

              <NotificationItem
                title="Review results"
                description="When your papers are reviewed"
                isExpanded={expandedNotifications.has('reviewResults')}
                onExpandToggle={() => toggleNotificationExpand('reviewResults')}
                emailEnabled={notifications.reviewResults.email}
                pushEnabled={notifications.reviewResults.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  reviewResults: { ...prev.reviewResults, email: !prev.reviewResults.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  reviewResults: { ...prev.reviewResults, push: !prev.reviewResults.push }
                }))}
              />

              <NotificationItem
                title="Citations"
                description="When your work is cited"
                isExpanded={expandedNotifications.has('citations')}
                onExpandToggle={() => toggleNotificationExpand('citations')}
                emailEnabled={notifications.citations.email}
                pushEnabled={notifications.citations.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  citations: { ...prev.citations, email: !prev.citations.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  citations: { ...prev.citations, push: !prev.citations.push }
                }))}
              />
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Community</h3>

              <NotificationItem
                title="Collaboration requests"
                description="When scholars want to collaborate"
                isExpanded={expandedNotifications.has('collaborations')}
                onExpandToggle={() => toggleNotificationExpand('collaborations')}
                emailEnabled={notifications.collaborations.email}
                pushEnabled={notifications.collaborations.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  collaborations: { ...prev.collaborations, email: !prev.collaborations.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  collaborations: { ...prev.collaborations, push: !prev.collaborations.push }
                }))}
              />

              <NotificationItem
                title="Announcements"
                description="Platform updates and news"
                isExpanded={expandedNotifications.has('announcements')}
                onExpandToggle={() => toggleNotificationExpand('announcements')}
                emailEnabled={notifications.announcements.email}
                pushEnabled={notifications.announcements.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  announcements: { ...prev.announcements, email: !prev.announcements.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  announcements: { ...prev.announcements, push: !prev.announcements.push }
                }))}
              />
            </div>
          </div>
        );

      case 'privacy-data':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Privacy and data</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
              Manage your data and privacy preferences
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Data settings</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 py-2">
                  <input
                    type="checkbox"
                    checked={privacySettings.searchEngineIndexing}
                    onChange={() => setPrivacySettings(prev => ({ ...prev, searchEngineIndexing: !prev.searchEngineIndexing }))}
                    className="mt-1 w-5 h-5 rounded"
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <div className="flex-1">
                    <p style={{ fontSize: '14px', color: '#334155' }}>
                      <span style={{ fontWeight: 600 }}>Search engine indexing:</span> Allow search engines to index your profile and publications
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Export your data</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Download all your publications and profile data</p>
              <button
                className="px-4 py-2 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '14px' }}
              >
                Export data
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Security</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>
              Keep your account secure
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Two-factor authentication</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Add an extra layer of security to your account
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#3b82f6' }}
                />
                <span style={{ fontSize: '14px', color: '#334155' }}>Enable two-factor authentication</span>
              </label>
            </div>

            <div style={{ marginBottom: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Login options</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGoogleLogin}
                  onChange={() => setUseGoogleLogin(!useGoogleLogin)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#3b82f6' }}
                />
                <span style={{ fontSize: '14px', color: '#334155' }}>Use Google account to log in</span>
              </label>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Active sessions</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Manage devices where you're logged in
              </p>
              <button
                className="px-4 py-2 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '14px' }}
              >
                View sessions
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Success message */}
      {saveSuccess && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg"
          style={{ backgroundColor: '#10b981', color: '#fff' }}
        >
          <CheckCircle2 size={18} />
          <span>Changes saved successfully!</span>
        </div>
      )}

      <div className="flex max-w-6xl mx-auto" style={{ minHeight: 'calc(100vh - 180px)' }}>
        {/* Left Sidebar */}
        <nav
          className={`${isMobile ? 'hidden' : 'block'} flex-shrink-0 py-8 pr-8`}
          style={{ width: '220px', borderRight: '1px solid #e2e8f0' }}
        >
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  style={{
                    color: activeSection === item.id ? '#1e293b' : '#64748b',
                    backgroundColor: activeSection === item.id ? '#f1f5f9' : 'transparent',
                    borderLeft: activeSection === item.id ? '3px solid #3b82f6' : '3px solid transparent'
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu */}
        {isMobile && (
          <div className="w-full px-4 pt-4 pb-2 overflow-x-auto" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <div className="flex gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: activeSection === item.id ? '#3b82f6' : '#f1f5f9',
                    color: activeSection === item.id ? '#fff' : '#64748b'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 py-8 px-4 md:px-12" style={{ maxWidth: '600px' }}>
          {renderContent()}
        </main>
      </div>

      {/* Bottom action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 py-4 px-6 flex justify-center gap-3"
        style={{ backgroundColor: '#fff', borderTop: '1px solid #e2e8f0' }}
      >
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          style={{ backgroundColor: '#3b82f6', color: '#fff' }}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScholarUnifiedSettings;
