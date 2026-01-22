import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Globe, Users, Lock, Search, UserCheck, Building2, GraduationCap, Briefcase, Star, CheckCircle2, Save, Loader2, AlertCircle } from 'lucide-react';

const ProfileVisibility: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (key: string) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="relative w-12 h-6 rounded-full transition-colors" style={{ backgroundColor: enabled ? '#696cff' : '#e7e7e8' }}>
      <motion.div animate={{ x: enabled ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow" />
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#696cff' }} />
          <p style={{ color: '#8592a3' }}>Loading visibility settings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" style={{ color: '#566a7f', fontFamily: 'Crimson Text, serif' }}>Profile Visibility</h1>
        <p style={{ color: '#8592a3' }} className="mt-1">Control how your profile appears to others</p>
      </motion.div>

      {saveSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#e8faef' }}>
          <CheckCircle2 size={20} style={{ color: '#71dd37' }} />
          <span style={{ color: '#71dd37' }}>Visibility settings saved successfully!</span>
        </motion.div>
      )}

      {/* Profile Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold" style={{ color: '#566a7f' }}>Profile Preview</h3>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: visibility.profileType === 'public' ? '#e8faef' : visibility.profileType === 'connections' ? '#e7f6ff' : '#f5f5f9', color: visibility.profileType === 'public' ? '#71dd37' : visibility.profileType === 'connections' ? '#03c3ec' : '#8592a3' }}>
            {visibility.profileType === 'public' ? <Globe size={14} /> : visibility.profileType === 'connections' ? <Users size={14} /> : <Lock size={14} />}
            {visibility.profileType.charAt(0).toUpperCase() + visibility.profileType.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-lg border" style={{ borderColor: '#e7e7e8' }}>
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Profile" className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold" style={{ color: '#566a7f' }}>Kofi Mensah</h4>
              {visibility.showServices && <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#696cff15', color: '#696cff' }}>Service Provider</span>}
            </div>
            <p className="text-sm" style={{ color: '#8592a3' }}>Professional Electrician · Accra, Ghana</p>
            {visibility.showReviews && <div className="flex items-center gap-1 mt-1"><Star size={14} fill="#ffab00" style={{ color: '#ffab00' }} /><span className="text-sm" style={{ color: '#566a7f' }}>4.8 (45 reviews)</span></div>}
          </div>
        </div>
        <p className="text-sm mt-4" style={{ color: '#8592a3' }}><AlertCircle size={14} className="inline mr-1" />This is how your profile appears to {visibility.profileType === 'public' ? 'everyone' : visibility.profileType === 'connections' ? 'your connections' : 'no one'}.</p>
      </motion.div>

      {/* Profile Type */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <h3 className="font-semibold mb-6" style={{ color: '#566a7f' }}>Who Can See Your Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'public', label: 'Public', desc: 'Visible to everyone on the platform', icon: Globe, color: '#71dd37' },
            { value: 'connections', label: 'Connections', desc: 'Only people you connect with', icon: Users, color: '#03c3ec' },
            { value: 'private', label: 'Private', desc: 'Hidden from all users', icon: Lock, color: '#8592a3' }
          ].map((option) => (
            <button key={option.value} onClick={() => setVisibility(prev => ({ ...prev, profileType: option.value }))} className={`p-4 rounded-xl border-2 text-left transition-all`} style={{ borderColor: visibility.profileType === option.value ? option.color : '#e7e7e8' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${option.color}15` }}>
                <option.icon size={20} style={{ color: option.color }} />
              </div>
              <p className="font-medium" style={{ color: '#566a7f' }}>{option.label}</p>
              <p className="text-sm" style={{ color: '#8592a3' }}>{option.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Discovery Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#696cff15' }}><Search size={20} style={{ color: '#696cff' }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Discovery Settings</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Control where your profile appears</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'showInSearch', label: 'Appear in Search Results', desc: 'Let people find you through search' },
            { key: 'showInDirectory', label: 'Show in Provider Directory', desc: 'List your services in the directory' },
            { key: 'showInRecommendations', label: 'Include in Recommendations', desc: 'Be recommended to potential clients' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f5f5f9' }}>
              <div>
                <p className="font-medium" style={{ color: '#566a7f' }}>{item.label}</p>
                <p className="text-sm" style={{ color: '#8592a3' }}>{item.desc}</p>
              </div>
              <ToggleSwitch enabled={visibility[item.key as keyof typeof visibility] as boolean} onToggle={() => handleToggle(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Messaging Permissions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#566a7f' }}>Who Can Message You</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'everyone', label: 'Everyone', desc: 'Anyone can send you messages' },
            { value: 'connections', label: 'Connections Only', desc: 'Only your connections' },
            { value: 'none', label: 'No One', desc: 'Disable messaging completely' }
          ].map((option) => (
            <button key={option.value} onClick={() => setVisibility(prev => ({ ...prev, allowMessages: option.value }))} className={`p-4 rounded-xl border-2 text-left transition-all`} style={{ borderColor: visibility.allowMessages === option.value ? '#696cff' : '#e7e7e8' }}>
              <p className="font-medium" style={{ color: '#566a7f' }}>{option.label}</p>
              <p className="text-sm" style={{ color: '#8592a3' }}>{option.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Section Visibility */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#03c3ec15' }}><Eye size={20} style={{ color: '#03c3ec' }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Profile Sections</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Choose which sections to display</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'showServices', label: 'Services', icon: Briefcase },
            { key: 'showReviews', label: 'Reviews & Ratings', icon: Star },
            { key: 'showPortfolio', label: 'Portfolio/Work Samples', icon: Building2 },
            { key: 'showCertifications', label: 'Certifications', icon: UserCheck },
            { key: 'showEducation', label: 'Education', icon: GraduationCap },
            { key: 'showExperience', label: 'Work Experience', icon: Briefcase }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: '#e7e7e8' }}>
              <div className="flex items-center gap-3">
                <item.icon size={20} style={{ color: '#8592a3' }} />
                <span className="font-medium" style={{ color: '#566a7f' }}>{item.label}</span>
              </div>
              <ToggleSwitch enabled={visibility[item.key as keyof typeof visibility] as boolean} onToggle={() => handleToggle(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex justify-end">
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: '#696cff', color: 'white' }}>
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Visibility Settings
        </button>
      </motion.div>
    </div>
  );
};

export default ProfileVisibility;