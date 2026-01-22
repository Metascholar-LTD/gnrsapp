import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Users, MapPin, Phone, Mail, Calendar, Briefcase, Lock, Globe, AlertCircle, CheckCircle2, Save, Loader2 } from 'lucide-react';

const PrivacySettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (key: string) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#696cff' }} />
          <p style={{ color: '#8592a3' }}>Loading privacy settings...</p>
        </motion.div>
      </div>
    );
  }

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="relative w-12 h-6 rounded-full transition-colors" style={{ backgroundColor: enabled ? '#696cff' : '#e7e7e8' }}>
      <motion.div animate={{ x: enabled ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow" />
    </button>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" style={{ color: '#566a7f', fontFamily: 'Crimson Text, serif' }}>Privacy Settings</h1>
        <p style={{ color: '#8592a3' }} className="mt-1">Control who can see your information</p>
      </motion.div>

      {saveSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#e8faef' }}>
          <CheckCircle2 size={20} style={{ color: '#71dd37' }} />
          <span style={{ color: '#71dd37' }}>Privacy settings updated successfully!</span>
        </motion.div>
      )}

      {/* Profile Visibility */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#696cff15' }}><Globe size={20} style={{ color: '#696cff' }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Profile Visibility</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Choose who can view your profile</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'public', label: 'Public', desc: 'Anyone can view your profile', icon: Globe },
            { value: 'connections', label: 'Connections Only', desc: 'Only people you connect with', icon: Users },
            { value: 'private', label: 'Private', desc: 'Only you can see your profile', icon: Lock }
          ].map((option) => (
            <button key={option.value} onClick={() => setPrivacySettings(prev => ({ ...prev, profileVisibility: option.value }))} className={`p-4 rounded-xl border-2 text-left transition-all ${privacySettings.profileVisibility === option.value ? 'border-2' : 'hover:bg-gray-50'}`} style={{ borderColor: privacySettings.profileVisibility === option.value ? '#696cff' : '#e7e7e8' }}>
              <option.icon size={24} className="mb-2" style={{ color: privacySettings.profileVisibility === option.value ? '#696cff' : '#8592a3' }} />
              <p className="font-medium" style={{ color: '#566a7f' }}>{option.label}</p>
              <p className="text-sm" style={{ color: '#8592a3' }}>{option.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Information Visibility */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#03c3ec15' }}><Eye size={20} style={{ color: '#03c3ec' }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Information Visibility</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Control what information others can see</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'showEmail', label: 'Email Address', desc: 'Show your email on your profile', icon: Mail },
            { key: 'showPhone', label: 'Phone Number', desc: 'Display your contact number', icon: Phone },
            { key: 'showLocation', label: 'Location', desc: 'Show your city/region', icon: MapPin },
            { key: 'showBirthday', label: 'Birthday', desc: 'Display your date of birth', icon: Calendar },
            { key: 'showWorkHistory', label: 'Work History', desc: 'Show your employment history', icon: Briefcase }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f5f5f9' }}>
              <div className="flex items-center gap-3">
                <item.icon size={20} style={{ color: '#8592a3' }} />
                <div>
                  <p className="font-medium" style={{ color: '#566a7f' }}>{item.label}</p>
                  <p className="text-sm" style={{ color: '#8592a3' }}>{item.desc}</p>
                </div>
              </div>
              <ToggleSwitch enabled={privacySettings[item.key as keyof typeof privacySettings] as boolean} onToggle={() => handleToggle(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity & Data */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#71dd3715' }}><Shield size={20} style={{ color: '#71dd37' }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Activity & Data</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Manage your data and activity settings</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'activityStatus', label: 'Online Status', desc: 'Show when you are online' },
            { key: 'searchEngineIndexing', label: 'Search Engine Visibility', desc: 'Allow search engines to index your profile' },
            { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymous data for improvement' },
            { key: 'analyticsTracking', label: 'Usage Analytics', desc: 'Help us improve by tracking usage patterns' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: '#e7e7e8' }}>
              <div>
                <p className="font-medium" style={{ color: '#566a7f' }}>{item.label}</p>
                <p className="text-sm" style={{ color: '#8592a3' }}>{item.desc}</p>
              </div>
              <ToggleSwitch enabled={privacySettings[item.key as keyof typeof privacySettings] as boolean} onToggle={() => handleToggle(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Export */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#566a7f' }}>Your Data</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 py-3 px-4 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: '#e7e7e8' }}>
            <p className="font-medium" style={{ color: '#566a7f' }}>Download Your Data</p>
            <p className="text-sm" style={{ color: '#8592a3' }}>Get a copy of all your data</p>
          </button>
          <button className="flex-1 py-3 px-4 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: '#ff3e1d', color: '#ff3e1d' }}>
            <p className="font-medium">Request Data Deletion</p>
            <p className="text-sm" style={{ color: '#8592a3' }}>Permanently delete all your data</p>
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-end">
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: '#696cff', color: 'white' }}>
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Privacy Settings
        </button>
      </motion.div>
    </div>
  );
};

export default PrivacySettings;