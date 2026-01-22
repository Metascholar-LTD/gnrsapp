import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Loader2
} from 'lucide-react';
import PageWrapper, { colors } from './shared/PageWrapper';

const AccountSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'sessions'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: 'Kofi',
    lastName: 'Mensah',
    email: 'kofi.mensah@email.com',
    phone: '+233 24 123 4567',
    dateOfBirth: '1990-05-15',
    location: 'Accra, Ghana',
    language: 'en',
    timezone: 'Africa/Accra'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const activeSessions = [
    { id: '1', device: 'Chrome on Windows', location: 'Accra, Ghana', ip: '192.168.1.***', lastActive: 'Active now', isCurrent: true },
    { id: '2', device: 'Safari on iPhone', location: 'Accra, Ghana', ip: '192.168.1.***', lastActive: '2 hours ago', isCurrent: false },
    { id: '3', device: 'Firefox on MacOS', location: 'Kumasi, Ghana', ip: '10.0.0.***', lastActive: '3 days ago', isCurrent: false }
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
            <p style={{ color: colors.textSecondary }}>Loading settings...</p>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" style={{ color: '#566a7f', fontFamily: 'Crimson Text, serif' }}>Account Settings</h1>
        <p style={{ color: '#8592a3' }} className="mt-1">Manage your account information and security</p>
      </motion.div>

      {saveSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#e8faef' }}>
          <CheckCircle2 size={20} style={{ color: '#71dd37' }} />
          <span style={{ color: '#71dd37' }}>Changes saved successfully!</span>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 border-b" style={{ borderColor: '#e7e7e8' }}>
        {[{ id: 'profile', label: 'Profile', icon: User }, { id: 'security', label: 'Security', icon: Shield }, { id: 'sessions', label: 'Sessions', icon: Smartphone }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === tab.id ? '' : 'hover:bg-gray-50'}`} style={{ color: activeTab === tab.id ? '#696cff' : '#8592a3' }}>
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#696cff' }} />}
          </button>
        ))}
      </motion.div>

      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#566a7f' }}>Profile Photo</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                <button className="absolute bottom-0 right-0 p-2 rounded-full" style={{ backgroundColor: '#696cff' }}><Camera size={16} style={{ color: 'white' }} /></button>
              </div>
              <div>
                <p className="text-sm mb-2" style={{ color: '#8592a3' }}>Upload a new photo. JPG, PNG or GIF, max 5MB</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: '#696cff', color: 'white' }}>Upload Photo</button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" style={{ borderColor: '#ff3e1d', color: '#ff3e1d' }}>Remove</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <h3 className="font-semibold mb-6" style={{ color: '#566a7f' }}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>First Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type="text" value={profileData.firstName} onChange={(e) => handleProfileChange('firstName', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Last Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type="text" value={profileData.lastName} onChange={(e) => handleProfileChange('lastName', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type="email" value={profileData.email} onChange={(e) => handleProfileChange('email', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type="tel" value={profileData.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Date of Birth</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type="date" value={profileData.dateOfBirth} onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type="text" value={profileData.location} onChange={(e) => handleProfileChange('location', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Language</label>
                <div className="relative">
                  <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <select value={profileData.language} onChange={(e) => handleProfileChange('language', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none" style={{ borderColor: '#e7e7e8', fontSize: '14px', color: '#566a7f' }}>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="tw">Twi</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Timezone</label>
                <div className="relative">
                  <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <select value={profileData.timezone} onChange={(e) => handleProfileChange('timezone', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none" style={{ borderColor: '#e7e7e8', fontSize: '14px', color: '#566a7f' }}>
                    <option value="Africa/Accra">(GMT+0) Accra</option>
                    <option value="Africa/Lagos">(GMT+1) Lagos</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors" style={{ backgroundColor: '#696cff', color: 'white' }}>
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <h3 className="font-semibold mb-6" style={{ color: '#566a7f' }}>Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Current Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type={showCurrentPassword ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => handlePasswordChange('currentPassword', e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showCurrentPassword ? <EyeOff size={18} style={{ color: '#8592a3' }} /> : <Eye size={18} style={{ color: '#8592a3' }} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>New Password</label>
                <div className="relative">
                  <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type={showNewPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => handlePasswordChange('newPassword', e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showNewPassword ? <EyeOff size={18} style={{ color: '#8592a3' }} /> : <Eye size={18} style={{ color: '#8592a3' }} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Confirm New Password</label>
                <div className="relative">
                  <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
                  <input type={showConfirmPassword ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all" style={{ borderColor: '#e7e7e8', fontSize: '14px' }} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showConfirmPassword ? <EyeOff size={18} style={{ color: '#8592a3' }} /> : <Eye size={18} style={{ color: '#8592a3' }} />}
                  </button>
                </div>
              </div>
              <button onClick={handleChangePassword} disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors mt-4" style={{ backgroundColor: passwordData.currentPassword && passwordData.newPassword ? '#696cff' : '#e7e7e8', color: passwordData.currentPassword && passwordData.newPassword ? 'white' : '#8592a3' }}>
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                Update Password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: twoFactorEnabled ? '#71dd3715' : '#ffab0015' }}><Shield size={24} style={{ color: twoFactorEnabled ? '#71dd37' : '#ffab00' }} /></div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#566a7f' }}>Two-Factor Authentication</h3>
                  <p className="text-sm mt-1" style={{ color: '#8592a3' }}>Add an extra layer of security to your account.</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium`} style={{ backgroundColor: twoFactorEnabled ? '#e8faef' : '#fff4e5', color: twoFactorEnabled ? '#71dd37' : '#ffab00' }}>{twoFactorEnabled ? 'Enabled' : 'Not Enabled'}</span>
                </div>
              </div>
              <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: twoFactorEnabled ? '#ff3e1d15' : '#696cff', color: twoFactorEnabled ? '#ff3e1d' : 'white' }}>{twoFactorEnabled ? 'Disable' : 'Enable'}</button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)', borderColor: '#ff3e1d30' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#ff3e1d' }}>Danger Zone</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium" style={{ color: '#566a7f' }}>Delete Account</p>
                <p className="text-sm" style={{ color: '#8592a3' }}>Permanently delete your account and all data.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border whitespace-nowrap" style={{ borderColor: '#ff3e1d', color: '#ff3e1d' }}><Trash2 size={16} />Delete Account</button>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'sessions' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold" style={{ color: '#566a7f' }}>Active Sessions</h3>
              <button className="text-sm font-medium transition-colors" style={{ color: '#ff3e1d' }}>Sign out all other sessions</button>
            </div>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: session.isCurrent ? '#696cff' : '#e7e7e8' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f5f5f9' }}><Smartphone size={20} style={{ color: '#566a7f' }} /></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium" style={{ color: '#566a7f' }}>{session.device}</p>
                        {session.isCurrent && <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#696cff', color: 'white' }}>Current</span>}
                      </div>
                      <p className="text-sm" style={{ color: '#8592a3' }}>{session.location} · {session.ip}</p>
                      <p className="text-xs" style={{ color: '#8592a3' }}>{session.lastActive}</p>
                    </div>
                  </div>
                  {!session.isCurrent && <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><LogOut size={18} style={{ color: '#ff3e1d' }} /></button>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#566a7f' }}>Recent Login Activity</h3>
            <div className="space-y-3">
              {[
                { date: 'Jan 20, 2024 10:30 AM', device: 'Chrome on Windows', location: 'Accra, Ghana', success: true },
                { date: 'Jan 19, 2024 3:15 PM', device: 'Safari on iPhone', location: 'Accra, Ghana', success: true },
                { date: 'Jan 17, 2024 11:20 PM', device: 'Unknown Device', location: 'Lagos, Nigeria', success: false }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: '#e7e7e8' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#566a7f' }}>{activity.device}</p>
                    <p className="text-sm" style={{ color: '#8592a3' }}>{activity.location} · {activity.date}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: activity.success ? '#e8faef' : '#ffe5e5', color: activity.success ? '#71dd37' : '#ff3e1d' }}>
                    {activity.success ? <><CheckCircle2 size={12} />Success</> : <><AlertCircle size={12} />Blocked</>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default AccountSettings;