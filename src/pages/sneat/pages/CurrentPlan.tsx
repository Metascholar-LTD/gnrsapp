import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  X,
  Zap,
  Shield,
  Star,
  Users,
  MessageSquare,
  BarChart3,
  Clock,
  Calendar,
  ArrowRight,
  CreditCard,
  AlertCircle,
  Sparkles,
  Infinity,
  FileText,
  Headphones,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CurrentPlan: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Mock current plan data
  const currentPlan = {
    name: 'Professional',
    price: 49.99,
    billingCycle: 'monthly',
    startDate: '2024-01-01',
    nextBillingDate: '2024-02-01',
    status: 'active',
    daysRemaining: 12
  };

  const usageStats = {
    profileViews: { used: 8500, limit: 15000 },
    messages: { used: 180, limit: 500 },
    listings: { used: 8, limit: 15 },
    storage: { used: 2.4, limit: 5 } // in GB
  };

  const planFeatures = [
    { name: 'Profile Views', included: true, value: '15,000/month' },
    { name: 'Service Listings', included: true, value: 'Up to 15' },
    { name: 'Customer Messages', included: true, value: '500/month' },
    { name: 'Priority in Search', included: true, value: 'Enhanced' },
    { name: 'Analytics Dashboard', included: true, value: 'Full Access' },
    { name: 'Response Time Badge', included: true, value: 'Included' },
    { name: 'Verified Badge', included: true, value: 'Included' },
    { name: 'Storage Space', included: true, value: '5 GB' },
    { name: 'Priority Support', included: true, value: '24/7' },
    { name: 'Custom Branding', included: false, value: 'Business Plan' },
    { name: 'API Access', included: false, value: 'Business Plan' },
    { name: 'Team Members', included: false, value: 'Business Plan' }
  ];

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return '#ff3e1d';
    if (percentage >= 70) return '#ffab00';
    return '#71dd37';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#696cff' }} />
          <p style={{ color: '#8592a3' }}>Loading plan details...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#566a7f', fontFamily: 'Crimson Text, serif' }}
          >
            Current Plan
          </h1>
          <p style={{ color: '#8592a3' }} className="mt-1">
            Manage your subscription and view usage
          </p>
        </div>
        <Link
          to="/userprofile/subscription/upgrade"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: '#696cff', color: 'white' }}
        >
          <Sparkles size={18} />
          Upgrade Plan
        </Link>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl overflow-hidden"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <div
          className="p-6"
          style={{
            background: 'linear-gradient(135deg, #696cff 0%, #8b8eff 100%)'
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Crown size={32} style={{ color: 'white' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">
                    {currentPlan.name}
                  </h2>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    {currentPlan.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Your current subscription plan
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                GHS {currentPlan.price}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                per {currentPlan.billingCycle === 'monthly' ? 'month' : 'year'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{ backgroundColor: '#696cff15' }}
              >
                <Calendar size={20} style={{ color: '#696cff' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#8592a3' }}>Started On</p>
                <p className="font-medium" style={{ color: '#566a7f' }}>
                  {formatDate(currentPlan.startDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{ backgroundColor: '#ffab0015' }}
              >
                <Clock size={20} style={{ color: '#ffab00' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#8592a3' }}>Next Billing</p>
                <p className="font-medium" style={{ color: '#566a7f' }}>
                  {formatDate(currentPlan.nextBillingDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{ backgroundColor: '#71dd3715' }}
              >
                <CreditCard size={20} style={{ color: '#71dd37' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#8592a3' }}>Days Remaining</p>
                <p className="font-medium" style={{ color: '#566a7f' }}>
                  {currentPlan.daysRemaining} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg" style={{ color: '#566a7f' }}>
            Usage This Month
          </h3>
          <span className="text-sm" style={{ color: '#8592a3' }}>
            Resets on {formatDate(currentPlan.nextBillingDate)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: 'Profile Views',
              icon: Users,
              used: usageStats.profileViews.used,
              limit: usageStats.profileViews.limit,
              unit: ''
            },
            {
              label: 'Messages Sent',
              icon: MessageSquare,
              used: usageStats.messages.used,
              limit: usageStats.messages.limit,
              unit: ''
            },
            {
              label: 'Active Listings',
              icon: FileText,
              used: usageStats.listings.used,
              limit: usageStats.listings.limit,
              unit: ''
            },
            {
              label: 'Storage Used',
              icon: BarChart3,
              used: usageStats.storage.used,
              limit: usageStats.storage.limit,
              unit: 'GB'
            }
          ].map((stat) => {
            const percentage = getUsagePercentage(stat.used, stat.limit);
            const color = getUsageColor(percentage);

            return (
              <div key={stat.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <stat.icon size={16} style={{ color: '#8592a3' }} />
                    <span className="font-medium" style={{ color: '#566a7f' }}>
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color }}>
                    {stat.used.toLocaleString()}{stat.unit} / {stat.limit.toLocaleString()}{stat.unit}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: '#e7e7e8' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: '#8592a3' }}>
                  {percentage}% used
                </p>
              </div>
            );
          })}
        </div>

        {Object.values(usageStats).some(stat => getUsagePercentage(stat.used, stat.limit) >= 80) && (
          <div
            className="mt-6 p-4 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: '#fff4e5' }}
          >
            <AlertCircle size={20} style={{ color: '#ffab00' }} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium" style={{ color: '#566a7f' }}>
                You're approaching your usage limits
              </p>
              <p className="text-sm" style={{ color: '#8592a3' }}>
                Consider upgrading to the Business plan for unlimited access.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Plan Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <h3 className="font-semibold text-lg mb-6" style={{ color: '#566a7f' }}>
          Plan Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planFeatures.map((feature) => (
            <div
              key={feature.name}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: '#f5f5f9' }}
            >
              <div className="flex items-center gap-3">
                {feature.included ? (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#71dd37' }}
                  >
                    <Check size={14} style={{ color: 'white' }} />
                  </div>
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#e7e7e8' }}
                  >
                    <X size={14} style={{ color: '#8592a3' }} />
                  </div>
                )}
                <span
                  style={{ color: feature.included ? '#566a7f' : '#8592a3' }}
                >
                  {feature.name}
                </span>
              </div>
              <span
                className="text-sm"
                style={{ color: feature.included ? '#696cff' : '#8592a3' }}
              >
                {feature.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link
          to="/userprofile/subscription/upgrade"
          className="bg-white rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#696cff15' }}
          >
            <Sparkles size={24} style={{ color: '#696cff' }} />
          </div>
          <div className="flex-1">
            <p className="font-medium" style={{ color: '#566a7f' }}>
              Upgrade Plan
            </p>
            <p className="text-sm" style={{ color: '#8592a3' }}>
              Get more features
            </p>
          </div>
          <ArrowRight size={20} style={{ color: '#8592a3' }} />
        </Link>

        <Link
          to="/userprofile/subscription/history"
          className="bg-white rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#03c3ec15' }}
          >
            <FileText size={24} style={{ color: '#03c3ec' }} />
          </div>
          <div className="flex-1">
            <p className="font-medium" style={{ color: '#566a7f' }}>
              Billing History
            </p>
            <p className="text-sm" style={{ color: '#8592a3' }}>
              View past invoices
            </p>
          </div>
          <ArrowRight size={20} style={{ color: '#8592a3' }} />
        </Link>

        <Link
          to="/userprofile/support"
          className="bg-white rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: '#71dd3715' }}
          >
            <Headphones size={24} style={{ color: '#71dd37' }} />
          </div>
          <div className="flex-1">
            <p className="font-medium" style={{ color: '#566a7f' }}>
              Get Support
            </p>
            <p className="text-sm" style={{ color: '#8592a3' }}>
              Priority assistance
            </p>
          </div>
          <ArrowRight size={20} style={{ color: '#8592a3' }} />
        </Link>
      </motion.div>

      {/* Cancel Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>
              Cancel Subscription
            </h3>
            <p className="text-sm mt-1" style={{ color: '#8592a3' }}>
              You can cancel your subscription at any time. Your plan will remain active until the end of your billing period.
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border whitespace-nowrap"
            style={{ borderColor: '#ff3e1d', color: '#ff3e1d' }}
          >
            Cancel Subscription
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CurrentPlan;