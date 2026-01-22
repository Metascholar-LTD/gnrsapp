import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, MessageSquare, Calendar, DollarSign, Users, Star, Briefcase, Shield, CheckCircle2, Save, Loader2 } from 'lucide-react';
import PageWrapper, { colors } from './shared/PageWrapper';

const NotificationSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [notifications, setNotifications] = useState({
    emailMessages: true, emailInquiries: true, emailBookings: true, emailPayments: true, emailMarketing: false, emailReviews: true,
    pushMessages: true, pushInquiries: true, pushBookings: true, pushPayments: true, pushReminders: true, pushUpdates: false,
    smsBookings: true, smsPayments: true, smsUrgent: true
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="relative w-12 h-6 rounded-full transition-colors" style={{ backgroundColor: enabled ? colors.primary : '#e7e7e8' }}>
      <motion.div animate={{ x: enabled ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow" />
    </button>
  );

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.primary }} />
            <p style={{ color: colors.textSecondary }}>Loading notification settings...</p>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary, fontFamily: 'Crimson Text, serif' }}>Notification Settings</h1>
        <p style={{ color: colors.textSecondary }} className="mt-1">Manage how you receive notifications</p>
      </motion.div>

      {saveSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: colors.successLight }}>
          <CheckCircle2 size={20} style={{ color: colors.success }} />
          <span style={{ color: colors.success }}>Notification preferences saved!</span>
        </motion.div>
      )}

      {/* Email Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.primaryLight }}><Mail size={20} style={{ color: colors.primary }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Email Notifications</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Receive updates via email</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'emailMessages', label: 'New Messages', desc: 'When someone sends you a message', icon: MessageSquare },
            { key: 'emailInquiries', label: 'Service Inquiries', desc: 'New inquiries about your services', icon: Briefcase },
            { key: 'emailBookings', label: 'Booking Updates', desc: 'Confirmations and changes to bookings', icon: Calendar },
            { key: 'emailPayments', label: 'Payment Notifications', desc: 'Payment confirmations and receipts', icon: DollarSign },
            { key: 'emailReviews', label: 'New Reviews', desc: 'When customers leave reviews', icon: Star },
            { key: 'emailMarketing', label: 'Marketing & Promotions', desc: 'Tips, offers and updates', icon: Bell }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f5f5f9' }}>
              <div className="flex items-center gap-3">
                <item.icon size={20} style={{ color: '#8592a3' }} />
                <div>
                  <p className="font-medium" style={{ color: '#566a7f' }}>{item.label}</p>
                  <p className="text-sm" style={{ color: '#8592a3' }}>{item.desc}</p>
                </div>
              </div>
              <ToggleSwitch enabled={notifications[item.key as keyof typeof notifications]} onToggle={() => handleToggle(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Push Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.infoLight }}><Bell size={20} style={{ color: colors.info }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Push Notifications</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Real-time notifications on your device</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'pushMessages', label: 'Messages', desc: 'Instant message notifications' },
            { key: 'pushInquiries', label: 'Inquiries', desc: 'New service inquiries' },
            { key: 'pushBookings', label: 'Bookings', desc: 'Booking updates and reminders' },
            { key: 'pushPayments', label: 'Payments', desc: 'Payment confirmations' },
            { key: 'pushReminders', label: 'Reminders', desc: 'Appointment and task reminders' },
            { key: 'pushUpdates', label: 'App Updates', desc: 'New features and improvements' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: '#e7e7e8' }}>
              <div>
                <p className="font-medium" style={{ color: '#566a7f' }}>{item.label}</p>
                <p className="text-sm" style={{ color: '#8592a3' }}>{item.desc}</p>
              </div>
              <ToggleSwitch enabled={notifications[item.key as keyof typeof notifications]} onToggle={() => handleToggle(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* SMS Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.successLight }}><Smartphone size={20} style={{ color: colors.success }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>SMS Notifications</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Text message alerts</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: 'smsBookings', label: 'Booking Confirmations', desc: 'SMS when bookings are confirmed' },
            { key: 'smsPayments', label: 'Payment Alerts', desc: 'SMS for payment confirmations' },
            { key: 'smsUrgent', label: 'Urgent Updates', desc: 'Important account security alerts' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: '#e7e7e8' }}>
              <div>
                <p className="font-medium" style={{ color: '#566a7f' }}>{item.label}</p>
                <p className="text-sm" style={{ color: '#8592a3' }}>{item.desc}</p>
              </div>
              <ToggleSwitch enabled={notifications[item.key as keyof typeof notifications]} onToggle={() => handleToggle(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quiet Hours */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.warningLight }}><Shield size={20} style={{ color: colors.warning }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Quiet Hours</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Pause notifications during specific times</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Start Time</label>
            <input type="time" defaultValue="22:00" className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2" style={{ borderColor: '#e7e7e8' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>End Time</label>
            <input type="time" defaultValue="07:00" className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2" style={{ borderColor: '#e7e7e8' }} />
          </div>
        </div>
        <p className="text-sm mt-3" style={{ color: '#8592a3' }}>During quiet hours, only urgent notifications will be delivered.</p>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-end">
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: colors.primary, color: 'white' }}>
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Notification Settings
        </button>
      </motion.div>
    </PageWrapper>
  );
};

export default NotificationSettings;