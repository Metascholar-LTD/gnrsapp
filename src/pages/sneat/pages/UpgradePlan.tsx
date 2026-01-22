import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  X,
  Zap,
  Star,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Sparkles,
  Infinity,
  FileText,
  Headphones,
  Building2,
  ArrowRight,
  ChevronDown,
  Loader2
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: {
    name: string;
    included: boolean;
    value?: string;
  }[];
  icon: React.ElementType;
  color: string;
}

const UpgradePlan: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showFAQ, setShowFAQ] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Zap,
      color: '#8592a3',
      features: [
        { name: 'Profile Views', included: true, value: '1,000/month' },
        { name: 'Service Listings', included: true, value: 'Up to 3' },
        { name: 'Customer Messages', included: true, value: '50/month' },
        { name: 'Basic Analytics', included: true },
        { name: 'Standard Support', included: true },
        { name: 'Priority Search', included: false },
        { name: 'Verified Badge', included: false },
        { name: 'Advanced Analytics', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Custom Branding', included: false }
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Best for growing businesses',
      monthlyPrice: 49.99,
      yearlyPrice: 479.99,
      popular: true,
      icon: Crown,
      color: '#696cff',
      features: [
        { name: 'Profile Views', included: true, value: '15,000/month' },
        { name: 'Service Listings', included: true, value: 'Up to 15' },
        { name: 'Customer Messages', included: true, value: '500/month' },
        { name: 'Advanced Analytics', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Priority Search', included: true },
        { name: 'Verified Badge', included: true },
        { name: 'Response Time Badge', included: true },
        { name: 'Custom Branding', included: false },
        { name: 'API Access', included: false }
      ]
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For established enterprises',
      monthlyPrice: 99.99,
      yearlyPrice: 959.99,
      icon: Building2,
      color: '#71dd37',
      features: [
        { name: 'Profile Views', included: true, value: 'Unlimited' },
        { name: 'Service Listings', included: true, value: 'Unlimited' },
        { name: 'Customer Messages', included: true, value: 'Unlimited' },
        { name: 'Advanced Analytics', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Priority Search', included: true },
        { name: 'Verified Badge', included: true },
        { name: 'Custom Branding', included: true },
        { name: 'API Access', included: true },
        { name: 'Team Members', included: true, value: 'Up to 5' }
      ]
    }
  ];

  const faqs = [
    {
      id: '1',
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you will be charged the prorated amount for the remaining days in your billing cycle. If you downgrade, the changes will take effect at the start of your next billing cycle.'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money), and bank transfers for annual subscriptions.'
    },
    {
      id: '3',
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can explore all features and decide if the plan is right for you.'
    },
    {
      id: '4',
      question: 'What happens to my data if I cancel?',
      answer: 'Your data remains safe for 30 days after cancellation. During this period, you can reactivate your subscription and restore everything. After 30 days, your data will be permanently deleted.'
    },
    {
      id: '5',
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! You save 20% when you choose annual billing. The discount is automatically applied when you select the yearly option.'
    }
  ];

  const getPrice = (plan: Plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return 0;
    const yearlyIfMonthly = plan.monthlyPrice * 12;
    return Math.round(yearlyIfMonthly - plan.yearlyPrice);
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
          <p style={{ color: '#8592a3' }}>Loading plans...</p>
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
        className="text-center"
      >
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: '#566a7f', fontFamily: 'Crimson Text, serif' }}
        >
          Choose Your Plan
        </h1>
        <p style={{ color: '#8592a3' }} className="max-w-xl mx-auto">
          Select the perfect plan for your business needs. All plans include core features to help you grow.
        </p>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4"
      >
        <span
          className={`text-sm font-medium cursor-pointer ${billingCycle === 'monthly' ? '' : 'opacity-50'}`}
          style={{ color: '#566a7f' }}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="relative w-14 h-7 rounded-full transition-colors"
          style={{ backgroundColor: billingCycle === 'yearly' ? '#696cff' : '#e7e7e8' }}
        >
          <motion.div
            animate={{ x: billingCycle === 'yearly' ? 28 : 4 }}
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
          />
        </button>
        <span
          className={`text-sm font-medium cursor-pointer flex items-center gap-2 ${billingCycle === 'yearly' ? '' : 'opacity-50'}`}
          style={{ color: '#566a7f' }}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#71dd3720', color: '#71dd37' }}
          >
            Save 20%
          </span>
        </span>
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`relative bg-white rounded-xl overflow-hidden ${
              plan.popular ? 'ring-2' : ''
            }`}
            style={{
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              ringColor: plan.popular ? '#696cff' : undefined
            }}
          >
            {plan.popular && (
              <div
                className="absolute top-0 left-0 right-0 py-1.5 text-center text-sm font-medium text-white"
                style={{ backgroundColor: '#696cff' }}
              >
                Most Popular
              </div>
            )}

            <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: `${plan.color}15` }}
                >
                  <plan.icon size={24} style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#566a7f' }}>
                    {plan.name}
                  </h3>
                  <p className="text-sm" style={{ color: '#8592a3' }}>
                    {plan.description}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold" style={{ color: '#566a7f' }}>
                    {getPrice(plan) === 0 ? 'Free' : `GHS ${getPrice(plan)}`}
                  </span>
                  {getPrice(plan) > 0 && (
                    <span className="text-sm" style={{ color: '#8592a3' }}>
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                  <p className="text-sm mt-1" style={{ color: '#71dd37' }}>
                    Save GHS {getSavings(plan)}/year
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-3 rounded-lg font-medium transition-colors mb-6 ${
                  plan.id === 'professional'
                    ? 'text-white'
                    : 'border'
                }`}
                style={{
                  backgroundColor: plan.id === 'professional' ? '#696cff' : 'transparent',
                  borderColor: plan.id === 'professional' ? undefined : '#e7e7e8',
                  color: plan.id === 'professional' ? 'white' : '#566a7f'
                }}
              >
                {plan.monthlyPrice === 0 ? 'Current Plan' : 'Get Started'}
              </button>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-3">
                    {feature.included ? (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#71dd3720' }}
                      >
                        <Check size={12} style={{ color: '#71dd37' }} />
                      </div>
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#e7e7e8' }}
                      >
                        <X size={12} style={{ color: '#8592a3' }} />
                      </div>
                    )}
                    <span
                      className="text-sm"
                      style={{ color: feature.included ? '#566a7f' : '#8592a3' }}
                    >
                      {feature.name}
                      {feature.value && (
                        <span style={{ color: '#696cff' }}> — {feature.value}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: '#566a7f' }}>
          Compare All Features
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e7e7e8' }}>
                <th className="text-left py-4 pr-4" style={{ color: '#566a7f' }}>
                  Feature
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className="text-center py-4 px-4"
                    style={{ color: '#566a7f' }}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Profile Views', values: ['1,000/mo', '15,000/mo', 'Unlimited'] },
                { name: 'Service Listings', values: ['3', '15', 'Unlimited'] },
                { name: 'Messages', values: ['50/mo', '500/mo', 'Unlimited'] },
                { name: 'Storage', values: ['500 MB', '5 GB', '50 GB'] },
                { name: 'Analytics', values: ['Basic', 'Advanced', 'Advanced'] },
                { name: 'Support', values: ['Email', 'Priority', 'Dedicated'] },
                { name: 'Verified Badge', values: [false, true, true] },
                { name: 'Custom Branding', values: [false, false, true] },
                { name: 'API Access', values: [false, false, true] },
                { name: 'Team Members', values: ['1', '1', '5'] }
              ].map((row, index) => (
                <tr
                  key={row.name}
                  className="border-b"
                  style={{ borderColor: '#e7e7e8' }}
                >
                  <td className="py-4 pr-4" style={{ color: '#566a7f' }}>
                    {row.name}
                  </td>
                  {row.values.map((value, i) => (
                    <td key={i} className="text-center py-4 px-4">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check size={18} className="mx-auto" style={{ color: '#71dd37' }} />
                        ) : (
                          <X size={18} className="mx-auto" style={{ color: '#e7e7e8' }} />
                        )
                      ) : (
                        <span style={{ color: '#697a8d' }}>{value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: '#566a7f' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border rounded-lg overflow-hidden"
              style={{ borderColor: '#e7e7e8' }}
            >
              <button
                onClick={() => setShowFAQ(showFAQ === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium" style={{ color: '#566a7f' }}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: showFAQ === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} style={{ color: '#8592a3' }} />
                </motion.div>
              </button>
              {showFAQ === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm leading-relaxed" style={{ color: '#697a8d' }}>
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Need Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 text-center"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <Headphones size={32} className="mx-auto mb-3" style={{ color: '#696cff' }} />
        <h3 className="font-semibold mb-2" style={{ color: '#566a7f' }}>
          Need Help Choosing?
        </h3>
        <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: '#8592a3' }}>
          Our team is here to help you find the perfect plan for your business needs.
        </p>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: '#696cff', color: 'white' }}
        >
          Contact Sales
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default UpgradePlan;