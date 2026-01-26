// ============================================================================
// EMPLOYER UNIFIED SETTINGS PAGE - Pinterest Style
// ============================================================================
// Combines Edit Profile, Account Settings, Privacy, Notifications, Security
// Preserves all existing Supabase connections from EmployerProfileSettings
// ============================================================================

import React, { useState, useEffect, memo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Building2,
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
  Image as ImageIcon
} from 'lucide-react';

// Toggle Switch Component - Defined OUTSIDE to prevent recreation
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
      backgroundColor: enabled ? '#696cff' : '#cdcdcd',
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
    <div style={{ borderBottom: '1px solid #efefef' }}>
      <button
        onClick={onExpandToggle}
        className="w-full flex items-center justify-between py-4 px-1 text-left"
        type="button"
      >
        <div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#566a7f' }}>{title}</p>
          {!isExpanded && (
            <p style={{ fontSize: '14px', color: '#8592a3', marginTop: '2px' }}>{statusText}</p>
          )}
        </div>
        {isExpanded ? <ChevronUp size={20} color="#8592a3" /> : <ChevronDown size={20} color="#8592a3" />}
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
          <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '16px', paddingLeft: '4px' }}>
            {description}
          </p>
        )}
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#566a7f', marginBottom: '12px', paddingLeft: '4px' }}>
          How do you want to be notified?
        </p>
        <div className="space-y-3 pb-4 pl-1">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', color: '#566a7f' }}>Email</span>
            <ToggleSwitch enabled={emailEnabled} onToggle={onEmailToggle} />
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', color: '#566a7f' }}>Push</span>
            <ToggleSwitch enabled={pushEnabled} onToggle={onPushToggle} />
          </div>
        </div>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

const EmployerUnifiedSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('edit-profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [profile, setProfile] = useState<any>(null);

  // Profile data - connected to Supabase
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    bio: '',
    profile_image: '',
  });

  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [useGoogleLogin, setUseGoogleLogin] = useState(false);

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    showCompanyDetails: true,
    searchEngineIndexing: true,
    dataSharing: false
  });

  // Notification settings with expandable sections
  const [notifications, setNotifications] = useState({
    newApplications: { email: true, push: true },
    applicationUpdates: { email: true, push: true },
    messages: { email: true, push: true },
    jobExpiry: { email: true, push: false },
    billing: { email: true, push: false },
    marketing: { email: false, push: false }
  });
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load profile from Supabase
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to view your profile');
        setIsLoading(false);
        return;
      }

      // Load employer profile
      const { data: profileData, error: profileError } = await supabase
        .from('employers' as any)
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || session.user.user_metadata?.full_name || '',
          email: profileData.email || session.user.email || '',
          phone: profileData.phone || '',
          company_name: profileData.company_name || '',
          bio: profileData.bio || '',
          profile_image: profileData.profile_image || '',
        });
      } else {
        // Create basic profile if doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('employers' as any)
          .insert({
            user_id: session.user.id,
            full_name: session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0] ||
              null,
            email: session.user.email || null,
            company_name: session.user.user_metadata?.full_name || 'My Company',
          })
          .select()
          .single();

        if (createError) throw createError;

        if (newProfile) {
          setProfile(newProfile);
          setFormData(prev => ({
            ...prev,
            full_name: newProfile.full_name || '',
            email: newProfile.email || session.user.email || '',
            company_name: newProfile.company_name || '',
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
      const fileName = `employers/${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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

      // Delete old image if exists
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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to update your profile');
        return;
      }

      const { error } = await supabase
        .from('employers' as any)
        .update({
          full_name: formData.full_name || null,
          email: formData.email || null,
          phone: formData.phone || null,
          company_name: formData.company_name || null,
          bio: formData.bio || null,
          profile_image: formData.profile_image || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      if (formData.full_name) {
        await supabase.auth.updateUser({
          data: { full_name: formData.full_name }
        });
      }

      toast.success('Settings saved successfully');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await loadProfile();

      window.dispatchEvent(new CustomEvent('employerProfileUpdated'));
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
        email: profile.email || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
        bio: profile.bio || '',
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

  // Menu items
  const menuItems = [
    { id: 'edit-profile', label: 'Edit profile', icon: User },
    { id: 'account-management', label: 'Account management', icon: Lock },
    { id: 'profile-visibility', label: 'Profile visibility', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy-data', label: 'Privacy and data', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#696cff' }} />
          <p style={{ color: '#8592a3' }}>Loading settings...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'edit-profile':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#566a7f', marginBottom: '8px' }}>Edit profile</h1>
            <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '32px' }}>
              Manage your employer profile and personal information
            </p>

            {/* Photo */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#566a7f', display: 'block', marginBottom: '8px' }}>Profile Photo</label>
              <div className="flex items-center gap-4">
                {formData.profile_image ? (
                  <img
                    src={formData.profile_image}
                    alt="Profile"
                    className="w-20 h-20 rounded-xl object-cover"
                    style={{ border: '2px solid #e5e7eb' }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#f5f5f9', border: '2px solid #e5e7eb' }}
                  >
                    <User size={32} style={{ color: '#8592a3' }} />
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
                    style={{ backgroundColor: '#696cff', color: '#fff' }}
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
              <p style={{ fontSize: '12px', color: '#8592a3', marginTop: '8px' }}>JPG, PNG or GIF. Max size 5MB</p>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8592a3', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#d9dee3', fontSize: '16px', color: '#566a7f' }}
                  onFocus={(e) => e.target.style.borderColor = '#696cff'}
                  onBlur={(e) => e.target.style.borderColor = '#d9dee3'}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8592a3', display: 'block', marginBottom: '4px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#d9dee3', fontSize: '16px', color: '#566a7f' }}
                  onFocus={(e) => e.target.style.borderColor = '#696cff'}
                  onBlur={(e) => e.target.style.borderColor = '#d9dee3'}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8592a3', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#d9dee3', fontSize: '16px', color: '#566a7f' }}
                  onFocus={(e) => e.target.style.borderColor = '#696cff'}
                  onBlur={(e) => e.target.style.borderColor = '#d9dee3'}
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8592a3', display: 'block', marginBottom: '4px' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#d9dee3', fontSize: '16px', color: '#566a7f' }}
                  onFocus={(e) => e.target.style.borderColor = '#696cff'}
                  onBlur={(e) => e.target.style.borderColor = '#d9dee3'}
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8592a3', display: 'block', marginBottom: '4px' }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself and your company"
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                  style={{ borderColor: '#d9dee3', fontSize: '16px', color: '#566a7f', minHeight: '100px' }}
                  onFocus={(e) => e.target.style.borderColor = '#696cff'}
                  onBlur={(e) => e.target.style.borderColor = '#d9dee3'}
                />
              </div>
            </div>
          </div>
        );

      case 'account-management':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#566a7f', marginBottom: '8px' }}>Account management</h1>
            <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '32px' }}>
              Make changes to your account settings
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '16px' }}>Your account</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #efefef' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#566a7f' }}>Email</p>
                    <p style={{ fontSize: '14px', color: '#8592a3' }}>{formData.email}</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#696cff' }}>Change</button>
                </div>

                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #efefef' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#566a7f' }}>Password</p>
                    <p style={{ fontSize: '14px', color: '#8592a3' }}>********</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#696cff' }}>Change</button>
                </div>

                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #efefef' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#566a7f' }}>Company</p>
                    <p style={{ fontSize: '14px', color: '#8592a3' }}>{formData.company_name || 'Not set'}</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#696cff' }}>Manage</button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '48px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '8px' }}>Delete account</h3>
              <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '16px' }}>
                Permanently delete your employer account and all data
              </p>
              <button
                className="px-4 py-2 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#efefef', color: '#ff3e1d', fontSize: '14px' }}
              >
                Delete account
              </button>
            </div>
          </div>
        );

      case 'profile-visibility':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#566a7f', marginBottom: '8px' }}>Profile visibility</h1>
            <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '32px' }}>
              Control how your company profile appears to job seekers
            </p>

            <div className="space-y-6">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#566a7f', marginBottom: '16px' }}>Who can see your profile</h3>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Public', desc: 'Anyone can view your company profile' },
                    { value: 'registered', label: 'Registered users only', desc: 'Only logged-in users can view' },
                    { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors"
                      style={{
                        backgroundColor: privacySettings.profileVisibility === option.value ? '#e7e7ff' : '#fff',
                        border: `2px solid ${privacySettings.profileVisibility === option.value ? '#696cff' : '#d9dee3'}`
                      }}
                    >
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option.value}
                        checked={privacySettings.profileVisibility === option.value}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                        className="mt-1"
                        style={{ accentColor: '#696cff' }}
                      />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#566a7f' }}>{option.label}</p>
                        <p style={{ fontSize: '14px', color: '#8592a3' }}>{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #efefef', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#566a7f', marginBottom: '16px' }}>Contact information</h3>
                <div className="space-y-4">
                  {[
                    { key: 'showEmail', label: 'Show email on profile', desc: 'Display your company email' },
                    { key: 'showPhone', label: 'Show phone number', desc: 'Display your contact number' },
                    { key: 'showCompanyDetails', label: 'Show company details', desc: 'Display full company information' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#566a7f' }}>{item.label}</p>
                        <p style={{ fontSize: '14px', color: '#8592a3' }}>{item.desc}</p>
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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#566a7f', marginBottom: '8px' }}>Notifications</h1>
            <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '32px' }}>
              Choose how you want to be notified about activity
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '16px' }}>Applications</h3>

              <NotificationItem
                title="New applications"
                description="Get notified when someone applies to your job"
                isExpanded={expandedNotifications.has('newApplications')}
                onExpandToggle={() => toggleNotificationExpand('newApplications')}
                emailEnabled={notifications.newApplications.email}
                pushEnabled={notifications.newApplications.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  newApplications: { ...prev.newApplications, email: !prev.newApplications.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  newApplications: { ...prev.newApplications, push: !prev.newApplications.push }
                }))}
              />

              <NotificationItem
                title="Application updates"
                description="Status changes on applications you're reviewing"
                isExpanded={expandedNotifications.has('applicationUpdates')}
                onExpandToggle={() => toggleNotificationExpand('applicationUpdates')}
                emailEnabled={notifications.applicationUpdates.email}
                pushEnabled={notifications.applicationUpdates.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  applicationUpdates: { ...prev.applicationUpdates, email: !prev.applicationUpdates.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  applicationUpdates: { ...prev.applicationUpdates, push: !prev.applicationUpdates.push }
                }))}
              />

              <NotificationItem
                title="Messages"
                description="When candidates send you messages"
                isExpanded={expandedNotifications.has('messages')}
                onExpandToggle={() => toggleNotificationExpand('messages')}
                emailEnabled={notifications.messages.email}
                pushEnabled={notifications.messages.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  messages: { ...prev.messages, email: !prev.messages.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  messages: { ...prev.messages, push: !prev.messages.push }
                }))}
              />
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '16px' }}>Account</h3>

              <NotificationItem
                title="Job expiry reminders"
                description="Get notified before your jobs expire"
                isExpanded={expandedNotifications.has('jobExpiry')}
                onExpandToggle={() => toggleNotificationExpand('jobExpiry')}
                emailEnabled={notifications.jobExpiry.email}
                pushEnabled={notifications.jobExpiry.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  jobExpiry: { ...prev.jobExpiry, email: !prev.jobExpiry.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  jobExpiry: { ...prev.jobExpiry, push: !prev.jobExpiry.push }
                }))}
              />

              <NotificationItem
                title="Billing"
                description="Subscription and payment notifications"
                isExpanded={expandedNotifications.has('billing')}
                onExpandToggle={() => toggleNotificationExpand('billing')}
                emailEnabled={notifications.billing.email}
                pushEnabled={notifications.billing.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  billing: { ...prev.billing, email: !prev.billing.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  billing: { ...prev.billing, push: !prev.billing.push }
                }))}
              />

              <NotificationItem
                title="Marketing"
                description="Tips, offers and platform updates"
                isExpanded={expandedNotifications.has('marketing')}
                onExpandToggle={() => toggleNotificationExpand('marketing')}
                emailEnabled={notifications.marketing.email}
                pushEnabled={notifications.marketing.push}
                onEmailToggle={() => setNotifications(prev => ({
                  ...prev,
                  marketing: { ...prev.marketing, email: !prev.marketing.email }
                }))}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  marketing: { ...prev.marketing, push: !prev.marketing.push }
                }))}
              />
            </div>
          </div>
        );

      case 'privacy-data':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#566a7f', marginBottom: '8px' }}>Privacy and data</h1>
            <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '32px' }}>
              Manage your data and privacy preferences
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '16px' }}>Data settings</h3>

              <div className="space-y-4">
                {[
                  { key: 'searchEngineIndexing', label: 'Search engine indexing', desc: 'Allow search engines to index your company profile' },
                  { key: 'dataSharing', label: 'Data sharing', desc: 'Share anonymized data to improve our services' }
                ].map((item) => (
                  <div key={item.key} className="flex items-start gap-3 py-2">
                    <input
                      type="checkbox"
                      checked={privacySettings[item.key as keyof typeof privacySettings] as boolean}
                      onChange={() => setPrivacySettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className="mt-1 w-5 h-5 rounded"
                      style={{ accentColor: '#696cff' }}
                    />
                    <div className="flex-1">
                      <p style={{ fontSize: '14px', color: '#566a7f' }}>
                        <span style={{ fontWeight: 600 }}>{item.label}:</span> {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #efefef', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '8px' }}>Download your data</h3>
              <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '16px' }}>Get a copy of all your data</p>
              <button
                className="px-4 py-2 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#efefef', color: '#566a7f', fontSize: '14px' }}
              >
                Request data
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#566a7f', marginBottom: '8px' }}>Security</h1>
            <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '32px' }}>
              Keep your account secure with these settings
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '8px' }}>Two-factor authentication</h3>
              <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '16px' }}>
                Add an extra layer of security to your account
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#696cff' }}
                />
                <span style={{ fontSize: '14px', color: '#566a7f' }}>Enable two-factor authentication</span>
              </label>
            </div>

            <div style={{ marginBottom: '32px', borderTop: '1px solid #efefef', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '8px' }}>Login options</h3>
              <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '16px' }}>
                Manage how you sign in to your account
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGoogleLogin}
                  onChange={() => setUseGoogleLogin(!useGoogleLogin)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#696cff' }}
                />
                <span style={{ fontSize: '14px', color: '#566a7f' }}>Use Google account to log in</span>
              </label>
            </div>

            <div style={{ borderTop: '1px solid #efefef', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#566a7f', marginBottom: '8px' }}>Active sessions</h3>
              <p style={{ fontSize: '14px', color: '#8592a3', marginBottom: '16px' }}>
                Manage devices where you're logged in
              </p>
              <button
                className="px-4 py-2 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#efefef', color: '#566a7f', fontSize: '14px' }}
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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Success message */}
      {saveSuccess && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg"
          style={{ backgroundColor: '#28c76f', color: '#fff' }}
        >
          <CheckCircle2 size={18} />
          <span>Changes saved successfully!</span>
        </div>
      )}

      <div className="flex max-w-6xl mx-auto" style={{ minHeight: 'calc(100vh - 180px)' }}>
        {/* Left Sidebar */}
        <nav
          className={`${isMobile ? 'hidden' : 'block'} flex-shrink-0 py-8 pr-8`}
          style={{ width: '220px', borderRight: '1px solid #efefef' }}
        >
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  style={{
                    color: activeSection === item.id ? '#566a7f' : '#8592a3',
                    backgroundColor: activeSection === item.id ? '#f5f5f9' : 'transparent',
                    borderLeft: activeSection === item.id ? '3px solid #696cff' : '3px solid transparent'
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
          <div className="w-full px-4 pt-4 pb-2 overflow-x-auto" style={{ borderBottom: '1px solid #efefef' }}>
            <div className="flex gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: activeSection === item.id ? '#696cff' : '#efefef',
                    color: activeSection === item.id ? '#fff' : '#8592a3'
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
        style={{ backgroundColor: '#fff', borderTop: '1px solid #efefef' }}
      >
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          style={{ backgroundColor: '#efefef', color: '#566a7f' }}
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          style={{ backgroundColor: '#696cff', color: '#fff' }}
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

export default EmployerUnifiedSettings;
