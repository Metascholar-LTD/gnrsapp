import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, MessageCircle, Phone, Mail, FileText, ChevronDown, ChevronRight, Book, Video, Users, Zap, Shield, CreditCard, Settings, ExternalLink, Send, Loader2 } from 'lucide-react';

const HelpSupport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Zap, color: '#696cff' },
    { id: 'account', label: 'Account & Profile', icon: Users, color: '#03c3ec' },
    { id: 'services', label: 'Services & Bookings', icon: Book, color: '#71dd37' },
    { id: 'payments', label: 'Payments & Billing', icon: CreditCard, color: '#ffab00' },
    { id: 'security', label: 'Security & Privacy', icon: Shield, color: '#ff3e1d' },
    { id: 'technical', label: 'Technical Issues', icon: Settings, color: '#8592a3' }
  ];

  const faqs = [
    { id: '1', category: 'getting-started', question: 'How do I create a service listing?', answer: 'To create a service listing, go to Services > Manage Services in your dashboard, click "Add New Service", fill in the details including title, description, pricing, and images, then click "Publish" to make it live.' },
    { id: '2', category: 'getting-started', question: 'How do I verify my profile?', answer: 'Profile verification requires submitting a valid government ID and proof of address. Go to Settings > Account Settings > Verification section and follow the prompts to upload your documents. Verification typically takes 1-2 business days.' },
    { id: '3', category: 'account', question: 'How do I change my email address?', answer: 'You can change your email address in Settings > Account Settings > Profile tab. Click on the email field, enter your new email, and click Save. You will need to verify the new email address.' },
    { id: '4', category: 'account', question: 'How do I reset my password?', answer: 'To reset your password, go to Settings > Account Settings > Security tab, enter your current password, then enter and confirm your new password. Click Update Password to save.' },
    { id: '5', category: 'services', question: 'How do I respond to customer inquiries?', answer: 'Customer inquiries appear in your Messages section and in Services > Customer Inquiries. Click on any inquiry to view details and respond. Quick responses help build trust with potential customers.' },
    { id: '6', category: 'services', question: 'Can I offer discounts on my services?', answer: 'Yes! You can create promotional discounts in Services > Manage Services. Select a service, click Edit, and scroll to the Pricing section where you can add percentage or fixed-amount discounts.' },
    { id: '7', category: 'payments', question: 'When will I receive my payment?', answer: 'Payments are processed within 3-5 business days after job completion and customer confirmation. Funds are transferred to your registered mobile money or bank account based on your payout settings.' },
    { id: '8', category: 'payments', question: 'How do I update my payment method?', answer: 'Go to Subscription > Payment History and click on "Payment Methods". You can add new cards, mobile money accounts, or bank details for receiving payouts.' },
    { id: '9', category: 'security', question: 'How do I enable two-factor authentication?', answer: 'Two-factor authentication can be enabled in Settings > Account Settings > Security tab. Click "Enable" next to Two-Factor Authentication and follow the setup process using your mobile number or authenticator app.' },
    { id: '10', category: 'technical', question: 'The app is running slowly, what can I do?', answer: 'Try clearing your browser cache, refreshing the page, or logging out and back in. If issues persist, try using a different browser or check your internet connection. Contact support if problems continue.' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = async () => {
    if (!ticketSubject || !ticketMessage) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setTicketSubject('');
    setTicketMessage('');
    alert('Support ticket submitted successfully! We will respond within 24 hours.');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#696cff' }} />
          <p style={{ color: '#8592a3' }}>Loading help center...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: '#566a7f', fontFamily: 'Crimson Text, serif' }}>Help & Support</h1>
        <p style={{ color: '#8592a3' }} className="mt-1">Find answers or get in touch with our team</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-2xl mx-auto">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#8592a3' }} />
        <input type="text" placeholder="Search for help articles, FAQs, or topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 text-lg" style={{ borderColor: '#e7e7e8' }} />
      </motion.div>

      {/* Quick Contact Options */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with our team', action: 'Start Chat', color: '#696cff' },
          { icon: Phone, label: 'Call Us', desc: '+233 30 123 4567', action: 'Call Now', color: '#71dd37' },
          { icon: Mail, label: 'Email Support', desc: 'support@gnrs.gh', action: 'Send Email', color: '#03c3ec' }
        ].map((option, index) => (
          <button key={option.label} className="bg-white rounded-xl p-5 text-left hover:shadow-md transition-shadow" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${option.color}15` }}>
                <option.icon size={24} style={{ color: option.color }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: '#566a7f' }}>{option.label}</p>
                <p className="text-sm" style={{ color: '#8592a3' }}>{option.desc}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium" style={{ color: option.color }}>{option.action}<ChevronRight size={14} /></span>
              </div>
            </div>
          </button>
        ))}
      </motion.div>

      {/* Categories */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <h2 className="font-semibold mb-4" style={{ color: '#566a7f' }}>Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)} className={`p-4 rounded-xl border-2 text-center transition-all ${selectedCategory === cat.id ? 'border-2' : 'hover:bg-gray-50'}`} style={{ borderColor: selectedCategory === cat.id ? cat.color : '#e7e7e8' }}>
              <cat.icon size={24} className="mx-auto mb-2" style={{ color: selectedCategory === cat.id ? cat.color : '#8592a3' }} />
              <p className="text-sm font-medium" style={{ color: selectedCategory === cat.id ? cat.color : '#566a7f' }}>{cat.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: '#566a7f' }}>Frequently Asked Questions</h2>
          {selectedCategory && (
            <button onClick={() => setSelectedCategory(null)} className="text-sm" style={{ color: '#696cff' }}>Show All</button>
          )}
        </div>
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle size={48} className="mx-auto mb-4" style={{ color: '#e7e7e8' }} />
              <p style={{ color: '#8592a3' }}>No FAQs found matching your search.</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div key={faq.id} className="border rounded-lg overflow-hidden" style={{ borderColor: '#e7e7e8' }}>
                <button onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-medium pr-4" style={{ color: '#566a7f' }}>{faq.question}</span>
                  <motion.div animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}>
                    <ChevronDown size={20} style={{ color: '#8592a3' }} />
                  </motion.div>
                </button>
                {expandedFAQ === faq.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: '#697a8d' }}>{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Submit Ticket */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#696cff15' }}><FileText size={20} style={{ color: '#696cff' }} /></div>
          <div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Submit a Support Ticket</h3>
            <p className="text-sm" style={{ color: '#8592a3' }}>Can't find what you're looking for? Send us a message.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Subject</label>
            <input type="text" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder="Brief description of your issue" className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2" style={{ borderColor: '#e7e7e8' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#566a7f' }}>Message</label>
            <textarea value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} placeholder="Describe your issue in detail..." rows={5} className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none" style={{ borderColor: '#e7e7e8' }} />
          </div>
          <div className="flex justify-end">
            <button onClick={handleSubmitTicket} disabled={isSubmitting || !ticketSubject || !ticketMessage} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: ticketSubject && ticketMessage ? '#696cff' : '#e7e7e8', color: ticketSubject && ticketMessage ? 'white' : '#8592a3' }}>
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Submit Ticket
            </button>
          </div>
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#03c3ec15' }}><Video size={20} style={{ color: '#03c3ec' }} /></div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Video Tutorials</h3>
          </div>
          <p className="text-sm mb-4" style={{ color: '#8592a3' }}>Watch step-by-step guides on using the platform.</p>
          <button className="flex items-center gap-2 text-sm font-medium" style={{ color: '#03c3ec' }}>Browse Videos<ExternalLink size={14} /></button>
        </div>
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#71dd3715' }}><Book size={20} style={{ color: '#71dd37' }} /></div>
            <h3 className="font-semibold" style={{ color: '#566a7f' }}>Documentation</h3>
          </div>
          <p className="text-sm mb-4" style={{ color: '#8592a3' }}>Comprehensive guides and API documentation.</p>
          <button className="flex items-center gap-2 text-sm font-medium" style={{ color: '#71dd37' }}>View Docs<ExternalLink size={14} /></button>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpSupport;