import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Save,
  AlertCircle,
  CheckCircle2,
  Trash2,
  LogOut,
  Smartphone,
  Globe,
  Calendar,
  Loader2,
  Bell,
  MessageSquare,
  DollarSign,
  Star,
  Briefcase,
  Users,
  Search,
  Building2,
  GraduationCap,
  UserCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

// Pinterest-style unified settings page
const UnifiedSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('edit-profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Profile data
  const [profileData, setProfileData] = useState({
    firstName: 'Kofi',
    lastName: 'Mensah',
    email: 'kofi.mensah@email.com',
    phone: '+233 24 123 4567',
    dateOfBirth: '1990-05-15',
    location: 'Accra, Ghana',
    about: '',
    pronouns: '',
    website: '',
    username: 'kofimensah'
  });

  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [useGoogleLogin, setUseGoogleLogin] = useState(true);

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    showLocation: true,
    showBirthday: false,
    showWorkHistory: true,
    activityStatus: true,
    searchEngineIndexing: true,
    dataSharing: false,
    analyticsTracking: true
  });

  // Notification settings with expandable sections
  const [notifications, setNotifications] = useState({
    // Pins you published
    commentsPublished: { push: true, inApp: true },
    reactionsPublished: { push: true, inApp: true },
    savesPublished: { push: true, inApp: false },
    viewsPublished: { push: true, inApp: true },
    collagesPublished: { push: true, inApp: false },
    // Pins you saved
    commentsSaved: { push: true, inApp: true },
    mentionsSaved: { push: true, inApp: true },
    remindersSaved: { push: true, inApp: true },
    commentsWithPhotosSaved: { push: true, inApp: true }
  });
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  // Visibility settings
  const [visibility, setVisibility] = useState({
    profileType: 'public',
    showInSearch: true,
    showInDirectory: true,
    showInRecommendations: true,
    allowMessages: 'everyone',
    showServices: true,
    showReviews: true,
    showPortfolio: true,
    showCertifications: true,
    showEducation: true,
    showExperience: true
  });

  // Ads personalization (like Pinterest's Privacy and data)
  const [adsSettings, setAdsSettings] = useState({
    useInfoFromSites: true,
    usePartnerInfo: true,
    adsAboutPlatform: true,
    activityForAdsReporting: true,
    sharingWithPartners: true,
    adsOffPlatform: true,
    useDataForGenAI: true
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    // Reset to default values
    setProfileData({
      firstName: 'Kofi',
      lastName: 'Mensah',
      email: 'kofi.mensah@email.com',
      phone: '+233 24 123 4567',
      dateOfBirth: '1990-05-15',
      location: 'Accra, Ghana',
      about: '',
      pronouns: '',
      website: '',
      username: 'kofimensah'
    });
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

  // Menu items - Pinterest style
  const menuItems = [
    { id: 'edit-profile', label: 'Edit profile' },
    { id: 'account-management', label: 'Account management' },
    { id: 'profile-visibility', label: 'Profile visibility' },
    { id: 'social-permissions', label: 'Social permissions' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy-data', label: 'Privacy and data' },
    { id: 'security', label: 'Security' }
  ];

  // Toggle Switch Component - Pinterest style
  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative w-12 h-7 rounded-full transition-colors duration-200"
      style={{ backgroundColor: enabled ? '#0076d3' : '#cdcdcd' }}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
      />
    </button>
  );

  // Expandable notification item - Pinterest style
  const NotificationItem = ({
    title,
    description,
    itemKey,
    pushEnabled,
    inAppEnabled,
    onPushToggle,
    onInAppToggle
  }: {
    title: string;
    description?: string;
    itemKey: string;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    onPushToggle: () => void;
    onInAppToggle: () => void;
  }) => {
    const isExpanded = expandedNotifications.has(itemKey);
    const statusText = `${pushEnabled ? 'Push on' : 'Push off'}${inAppEnabled ? ', in-app on' : ''}`;

    return (
      <div style={{ borderBottom: '1px solid #efefef' }}>
        <button
          onClick={() => toggleNotificationExpand(itemKey)}
          className="w-full flex items-center justify-between py-4 px-1 text-left"
        >
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>{title}</p>
            {!isExpanded && (
              <p style={{ fontSize: '14px', color: '#767676', marginTop: '2px' }}>{statusText}</p>
            )}
          </div>
          {isExpanded ? <ChevronUp size={20} color="#767676" /> : <ChevronDown size={20} color="#767676" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {description && (
                <p style={{ fontSize: '14px', color: '#767676', marginBottom: '16px', paddingLeft: '4px' }}>
                  {description}
                </p>
              )}
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '12px', paddingLeft: '4px' }}>
                How do you want to be notified?
              </p>
              <div className="space-y-3 pb-4 pl-1">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', color: '#111' }}>Push</span>
                  <ToggleSwitch enabled={pushEnabled} onToggle={onPushToggle} />
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', color: '#111' }}>In-app</span>
                  <ToggleSwitch enabled={inAppEnabled} onToggle={onInAppToggle} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#111' }} />
          <p style={{ color: '#767676' }}>Loading settings...</p>
        </motion.div>
      </div>
    );
  }

  // Render section content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'edit-profile':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Edit profile</h1>
            <p style={{ fontSize: '14px', color: '#767676', marginBottom: '32px' }}>
              Keep your personal details private. Information you add here is visible to anyone who can view your profile.
            </p>

            {/* Photo */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '12px', fontWeight: 400, color: '#111', display: 'block', marginBottom: '8px' }}>Photo</label>
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold"
                  style={{ backgroundColor: '#ffe0b2', color: '#e65100' }}
                >
                  {profileData.firstName.charAt(0)}
                </div>
                <button
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  style={{ backgroundColor: '#efefef', color: '#111' }}
                >
                  Change
                </button>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
              {/* First name */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 400, color: '#767676', display: 'block', marginBottom: '4px' }}>
                  First name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#cdcdcd', fontSize: '16px' }}
                  onFocus={(e) => e.target.style.borderColor = '#111'}
                  onBlur={(e) => e.target.style.borderColor = '#cdcdcd'}
                />
              </div>

              {/* Last name */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 400, color: '#767676', display: 'block', marginBottom: '4px' }}>
                  Last name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#cdcdcd', fontSize: '16px' }}
                  onFocus={(e) => e.target.style.borderColor = '#111'}
                  onBlur={(e) => e.target.style.borderColor = '#cdcdcd'}
                />
              </div>

              {/* About */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 400, color: '#767676', display: 'block', marginBottom: '4px' }}>
                  About
                </label>
                <textarea
                  value={profileData.about}
                  onChange={(e) => handleProfileChange('about', e.target.value)}
                  placeholder="Tell your story"
                  className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-colors resize-none"
                  style={{ borderColor: '#cdcdcd', fontSize: '16px', minHeight: '100px' }}
                  onFocus={(e) => e.target.style.borderColor = '#111'}
                  onBlur={(e) => e.target.style.borderColor = '#cdcdcd'}
                />
              </div>

              {/* Pronouns */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 400, color: '#767676', display: 'block', marginBottom: '4px' }}>
                  Pronouns
                </label>
                <select
                  value={profileData.pronouns}
                  onChange={(e) => handleProfileChange('pronouns', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-colors appearance-none bg-white"
                  style={{ borderColor: '#cdcdcd', fontSize: '16px', color: profileData.pronouns ? '#111' : '#767676' }}
                >
                  <option value="">Add your pronouns</option>
                  <option value="he/him">he/him</option>
                  <option value="she/her">she/her</option>
                  <option value="they/them">they/them</option>
                </select>
                <p style={{ fontSize: '12px', color: '#767676', marginTop: '8px' }}>
                  Choose up to 2 sets of pronouns to appear on your profile so others know how to refer to you. You can edit or remove these any time.
                </p>
              </div>

              {/* Website */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 400, color: '#767676', display: 'block', marginBottom: '4px' }}>
                  Website
                </label>
                <input
                  type="text"
                  value={profileData.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                  placeholder="https://"
                  className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#cdcdcd', fontSize: '16px' }}
                  onFocus={(e) => e.target.style.borderColor = '#111'}
                  onBlur={(e) => e.target.style.borderColor = '#cdcdcd'}
                />
                <p style={{ fontSize: '12px', color: '#767676', marginTop: '8px' }}>
                  Add a link to drive traffic to your site
                </p>
              </div>

              {/* Username */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 400, color: '#767676', display: 'block', marginBottom: '4px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#cdcdcd', fontSize: '16px' }}
                  onFocus={(e) => e.target.style.borderColor = '#111'}
                  onBlur={(e) => e.target.style.borderColor = '#cdcdcd'}
                />
                <p style={{ fontSize: '12px', color: '#767676', marginTop: '8px' }}>
                  www.gnrs.com/{profileData.username}
                </p>
              </div>
            </div>
          </div>
        );

      case 'account-management':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Account management</h1>
            <p style={{ fontSize: '14px', color: '#767676', marginBottom: '32px' }}>
              Make changes to your personal information or account type.
            </p>

            {/* Personal information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Your account</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #efefef' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Email</p>
                    <p style={{ fontSize: '14px', color: '#767676' }}>{profileData.email}</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Change</button>
                </div>

                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #efefef' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Password</p>
                    <p style={{ fontSize: '14px', color: '#767676' }}>********</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Change</button>
                </div>

                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #efefef' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Date of Birth</p>
                    <p style={{ fontSize: '14px', color: '#767676' }}>{profileData.dateOfBirth}</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Change</button>
                </div>

                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #efefef' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Country/Region</p>
                    <p style={{ fontSize: '14px', color: '#767676' }}>Ghana</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Change</button>
                </div>

                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #efefef' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Language</p>
                    <p style={{ fontSize: '14px', color: '#767676' }}>English</p>
                  </div>
                  <button style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Change</button>
                </div>
              </div>
            </div>

            {/* Delete account */}
            <div style={{ marginTop: '48px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>Delete your data and account</h3>
              <p style={{ fontSize: '14px', color: '#767676', marginBottom: '16px' }}>
                Delete your data and account permanently.
              </p>
              <button
                className="px-4 py-2 rounded-full font-semibold transition-colors"
                style={{ backgroundColor: '#efefef', color: '#cc0000', fontSize: '14px' }}
              >
                Delete account
              </button>
            </div>
          </div>
        );

      case 'profile-visibility':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Profile visibility</h1>
            <p style={{ fontSize: '14px', color: '#767676', marginBottom: '32px' }}>
              Control how your profile appears to others.
            </p>

            {/* Profile visibility options */}
            <div className="space-y-6">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Who can see your profile</h3>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Public', desc: 'Anyone can view your profile' },
                    { value: 'connections', label: 'Connections only', desc: 'Only people you connect with' },
                    { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-colors"
                      style={{
                        backgroundColor: visibility.profileType === option.value ? '#e6f3ff' : '#fff',
                        border: `2px solid ${visibility.profileType === option.value ? '#0076d3' : '#cdcdcd'}`
                      }}
                    >
                      <input
                        type="radio"
                        name="profileType"
                        value={option.value}
                        checked={visibility.profileType === option.value}
                        onChange={(e) => setVisibility(prev => ({ ...prev, profileType: e.target.value }))}
                        className="mt-1"
                      />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{option.label}</p>
                        <p style={{ fontSize: '14px', color: '#767676' }}>{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discovery settings */}
              <div style={{ borderTop: '1px solid #efefef', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Discovery</h3>
                <div className="space-y-4">
                  {[
                    { key: 'showInSearch', label: 'Appear in search results', desc: 'Let people find you through search' },
                    { key: 'showInDirectory', label: 'Show in directory', desc: 'List yourself in the provider directory' },
                    { key: 'showInRecommendations', label: 'Include in recommendations', desc: 'Be recommended to potential connections' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>{item.label}</p>
                        <p style={{ fontSize: '14px', color: '#767676' }}>{item.desc}</p>
                      </div>
                      <ToggleSwitch
                        enabled={visibility[item.key as keyof typeof visibility] as boolean}
                        onToggle={() => setVisibility(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile sections */}
              <div style={{ borderTop: '1px solid #efefef', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Profile sections to display</h3>
                <div className="space-y-4">
                  {[
                    { key: 'showServices', label: 'Services' },
                    { key: 'showReviews', label: 'Reviews & Ratings' },
                    { key: 'showPortfolio', label: 'Portfolio/Work Samples' },
                    { key: 'showCertifications', label: 'Certifications' },
                    { key: 'showEducation', label: 'Education' },
                    { key: 'showExperience', label: 'Work Experience' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <span style={{ fontSize: '14px', color: '#111' }}>{item.label}</span>
                      <ToggleSwitch
                        enabled={visibility[item.key as keyof typeof visibility] as boolean}
                        onToggle={() => setVisibility(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'social-permissions':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Social permissions</h1>
            <p style={{ fontSize: '14px', color: '#767676', marginBottom: '32px' }}>
              Control how others can interact with you.
            </p>

            <div className="space-y-6">
              {/* Messaging */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Who can message you</h3>
                <div className="space-y-3">
                  {[
                    { value: 'everyone', label: 'Everyone', desc: 'Anyone can send you messages' },
                    { value: 'connections', label: 'Connections only', desc: 'Only your connections' },
                    { value: 'none', label: 'No one', desc: 'Disable messaging completely' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-colors"
                      style={{
                        backgroundColor: visibility.allowMessages === option.value ? '#e6f3ff' : '#fff',
                        border: `2px solid ${visibility.allowMessages === option.value ? '#0076d3' : '#cdcdcd'}`
                      }}
                    >
                      <input
                        type="radio"
                        name="allowMessages"
                        value={option.value}
                        checked={visibility.allowMessages === option.value}
                        onChange={(e) => setVisibility(prev => ({ ...prev, allowMessages: e.target.value }))}
                        className="mt-1"
                      />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{option.label}</p>
                        <p style={{ fontSize: '14px', color: '#767676' }}>{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Activity status */}
              <div style={{ borderTop: '1px solid #efefef', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Activity</h3>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Show activity status</p>
                    <p style={{ fontSize: '14px', color: '#767676' }}>Let others see when you're online</p>
                  </div>
                  <ToggleSwitch
                    enabled={privacySettings.activityStatus}
                    onToggle={() => setPrivacySettings(prev => ({ ...prev, activityStatus: !prev.activityStatus }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Notifications</h1>
            <p style={{ fontSize: '14px', color: '#767676', marginBottom: '32px' }}>
              We'll always let you know about important changes, but you pick what else you want to hear about.{' '}
              <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
            </p>

            {/* Posts you published */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Posts you published</h3>

              <NotificationItem
                title="Comments"
                description="Get notified when someone comments on a post you created"
                itemKey="commentsPublished"
                pushEnabled={notifications.commentsPublished.push}
                inAppEnabled={notifications.commentsPublished.inApp}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  commentsPublished: { ...prev.commentsPublished, push: !prev.commentsPublished.push }
                }))}
                onInAppToggle={() => setNotifications(prev => ({
                  ...prev,
                  commentsPublished: { ...prev.commentsPublished, inApp: !prev.commentsPublished.inApp }
                }))}
              />

              <NotificationItem
                title="Reactions"
                itemKey="reactionsPublished"
                pushEnabled={notifications.reactionsPublished.push}
                inAppEnabled={notifications.reactionsPublished.inApp}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  reactionsPublished: { ...prev.reactionsPublished, push: !prev.reactionsPublished.push }
                }))}
                onInAppToggle={() => setNotifications(prev => ({
                  ...prev,
                  reactionsPublished: { ...prev.reactionsPublished, inApp: !prev.reactionsPublished.inApp }
                }))}
              />

              <NotificationItem
                title="Saves"
                itemKey="savesPublished"
                pushEnabled={notifications.savesPublished.push}
                inAppEnabled={notifications.savesPublished.inApp}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  savesPublished: { ...prev.savesPublished, push: !prev.savesPublished.push }
                }))}
                onInAppToggle={() => setNotifications(prev => ({
                  ...prev,
                  savesPublished: { ...prev.savesPublished, inApp: !prev.savesPublished.inApp }
                }))}
              />

              <NotificationItem
                title="Views and impressions"
                itemKey="viewsPublished"
                pushEnabled={notifications.viewsPublished.push}
                inAppEnabled={notifications.viewsPublished.inApp}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  viewsPublished: { ...prev.viewsPublished, push: !prev.viewsPublished.push }
                }))}
                onInAppToggle={() => setNotifications(prev => ({
                  ...prev,
                  viewsPublished: { ...prev.viewsPublished, inApp: !prev.viewsPublished.inApp }
                }))}
              />
            </div>

            {/* Posts you saved */}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Posts you saved</h3>

              <NotificationItem
                title="Comments"
                itemKey="commentsSaved"
                pushEnabled={notifications.commentsSaved.push}
                inAppEnabled={notifications.commentsSaved.inApp}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  commentsSaved: { ...prev.commentsSaved, push: !prev.commentsSaved.push }
                }))}
                onInAppToggle={() => setNotifications(prev => ({
                  ...prev,
                  commentsSaved: { ...prev.commentsSaved, inApp: !prev.commentsSaved.inApp }
                }))}
              />

              <NotificationItem
                title="Mentions"
                itemKey="mentionsSaved"
                pushEnabled={notifications.mentionsSaved.push}
                inAppEnabled={notifications.mentionsSaved.inApp}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  mentionsSaved: { ...prev.mentionsSaved, push: !prev.mentionsSaved.push }
                }))}
                onInAppToggle={() => setNotifications(prev => ({
                  ...prev,
                  mentionsSaved: { ...prev.mentionsSaved, inApp: !prev.mentionsSaved.inApp }
                }))}
              />

              <NotificationItem
                title="Reminders"
                itemKey="remindersSaved"
                pushEnabled={notifications.remindersSaved.push}
                inAppEnabled={notifications.remindersSaved.inApp}
                onPushToggle={() => setNotifications(prev => ({
                  ...prev,
                  remindersSaved: { ...prev.remindersSaved, push: !prev.remindersSaved.push }
                }))}
                onInAppToggle={() => setNotifications(prev => ({
                  ...prev,
                  remindersSaved: { ...prev.remindersSaved, inApp: !prev.remindersSaved.inApp }
                }))}
              />
            </div>
          </div>
        );

      case 'privacy-data':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Privacy and data</h1>
            <p style={{ fontSize: '14px', color: '#767676', marginBottom: '32px' }}>
              Manage the data the platform uses to improve the ads and recommendations we show you.{' '}
              <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
            </p>

            {/* Ads personalization */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Ads personalization</h3>

              <div className="space-y-4">
                {[
                  { key: 'useInfoFromSites', label: 'Use info from sites you visit', desc: 'Allow us to use data from sites you visit to improve ads on the platform.' },
                  { key: 'usePartnerInfo', label: 'Use of partner info', desc: 'Allow us to use information from our partners to improve ads you see.' },
                  { key: 'adsAboutPlatform', label: 'Ads about the platform', desc: 'Allow us to use your activity to improve the ads about the platform you\'re shown on other sites or apps.' },
                  { key: 'activityForAdsReporting', label: 'Activity for ads reporting', desc: 'Allow us to share your activity for ads performance reporting.' },
                  { key: 'sharingWithPartners', label: 'Sharing info with partners', desc: 'Allow us to share your information and activity with partners to improve the third-party ads you\'re shown.' },
                  { key: 'adsOffPlatform', label: 'Ads off the platform', desc: 'Allow us to use or share your information with partners to improve the ads you\'re shown on other apps and sites.' }
                ].map((item) => (
                  <div key={item.key} className="flex items-start gap-3 py-2">
                    <input
                      type="checkbox"
                      checked={adsSettings[item.key as keyof typeof adsSettings]}
                      onChange={() => setAdsSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className="mt-1 w-5 h-5 rounded"
                      style={{ accentColor: '#0076d3' }}
                    />
                    <div className="flex-1">
                      <p style={{ fontSize: '14px', color: '#111' }}>
                        <span style={{ fontWeight: 600 }}>{item.label}:</span> {item.desc}{' '}
                        <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GenAI */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>GenAI</h3>
              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  checked={adsSettings.useDataForGenAI}
                  onChange={() => setAdsSettings(prev => ({ ...prev, useDataForGenAI: !prev.useDataForGenAI }))}
                  className="mt-1 w-5 h-5 rounded"
                  style={{ accentColor: '#0076d3' }}
                />
                <div className="flex-1">
                  <p style={{ fontSize: '14px', color: '#111' }}>
                    <span style={{ fontWeight: 600 }}>Use your data to train AI:</span> Allow your data to be used to help train AI features.{' '}
                    <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Data actions */}
            <div style={{ borderTop: '1px solid #efefef', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>Delete your data and account</h3>
              <p style={{ fontSize: '14px', color: '#767676', marginBottom: '16px' }}>Delete your data and account</p>
              <button
                className="px-4 py-2 rounded-full font-semibold transition-colors"
                style={{ backgroundColor: '#efefef', color: '#cc0000', fontSize: '14px' }}
              >
                Delete data
              </button>

              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>Request your data</h3>
                <p style={{ fontSize: '14px', color: '#767676', marginBottom: '16px' }}>Get a copy of your data</p>
                <button
                  className="px-4 py-2 rounded-full font-semibold transition-colors"
                  style={{ backgroundColor: '#efefef', color: '#111', fontSize: '14px' }}
                >
                  Request data
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Security</h1>
            <p style={{ fontSize: '14px', color: '#767676', marginBottom: '32px' }}>
              Include additional security like turning on two-factor authentication and checking your list of connected devices to keep your account safe.{' '}
              <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
            </p>

            {/* Two-factor authentication */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>Two-factor authentication</h3>
              <p style={{ fontSize: '14px', color: '#767676', marginBottom: '16px' }}>
                This makes your account extra secure. Along with your password, you'll need to enter the secret code that we text to your phone each time you log in.{' '}
                <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#0076d3' }}
                />
                <span style={{ fontSize: '14px', color: '#111' }}>Require code at login</span>
              </label>
            </div>

            {/* Login options */}
            <div style={{ marginBottom: '32px', borderTop: '1px solid #efefef', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>Login options</h3>
              <p style={{ fontSize: '14px', color: '#767676', marginBottom: '16px' }}>
                Use your social account to log in to the platform.{' '}
                <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGoogleLogin}
                  onChange={() => setUseGoogleLogin(!useGoogleLogin)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#0076d3' }}
                />
                <span style={{ fontSize: '14px', color: '#111' }}>Use your Google account to log in</span>
              </label>
            </div>

            {/* Apps logins */}
            <div style={{ marginBottom: '32px', borderTop: '1px solid #efefef', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>Apps logins</h3>
              <p style={{ fontSize: '14px', color: '#767676', marginBottom: '16px' }}>
                Keep track of everywhere you've logged in with your profile and remove access from apps you're no longer using.{' '}
                <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
              </p>
              <p style={{ fontSize: '14px', color: '#767676' }}>You have not approved any apps</p>
            </div>

            {/* Connected devices */}
            <div style={{ borderTop: '1px solid #efefef', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>Connected devices</h3>
              <p style={{ fontSize: '14px', color: '#767676', marginBottom: '16px' }}>
                This is a list of devices that have logged into your account. Revoke access to any device you don't recognize.{' '}
                <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>Learn more</a>
              </p>
              <button
                className="px-4 py-2 rounded-full font-semibold transition-colors"
                style={{ backgroundColor: '#efefef', color: '#111', fontSize: '14px' }}
              >
                Show sessions
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Success message */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg"
            style={{ backgroundColor: '#111', color: '#fff' }}
          >
            <CheckCircle2 size={18} />
            <span>Changes saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex max-w-6xl mx-auto" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Left Sidebar - Pinterest style */}
        <nav
          className={`${isMobile ? 'hidden' : 'block'} flex-shrink-0 py-8 pr-8`}
          style={{ width: '220px', borderRight: '1px solid #efefef' }}
        >
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium`}
                  style={{
                    color: activeSection === item.id ? '#111' : '#767676',
                    backgroundColor: activeSection === item.id ? '#fff' : 'transparent',
                    borderLeft: activeSection === item.id ? '2px solid #111' : '2px solid transparent'
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
                    backgroundColor: activeSection === item.id ? '#111' : '#efefef',
                    color: activeSection === item.id ? '#fff' : '#767676'
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom action bar - Pinterest style */}
      <div
        className="fixed bottom-0 left-0 right-0 py-4 px-6 flex justify-center gap-3"
        style={{ backgroundColor: '#fff', borderTop: '1px solid #efefef' }}
      >
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-full text-sm font-semibold transition-colors"
          style={{ backgroundColor: '#efefef', color: '#111' }}
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
          style={{ backgroundColor: '#efefef', color: '#767676' }}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  );
};

export default UnifiedSettings;
