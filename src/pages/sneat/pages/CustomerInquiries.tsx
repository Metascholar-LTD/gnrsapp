import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  ArrowLeft,
  Archive,
  Trash2,
  Tag,
  RefreshCw,
  MessageCircle,
  CheckCheck,
  Circle,
  Loader2
} from 'lucide-react';

interface Inquiry {
  id: string;
  customerName: string;
  customerAvatar: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation: string;
  service: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
  isRead: boolean;
}

interface Reply {
  id: string;
  sender: 'customer' | 'provider';
  message: string;
  timestamp: string;
  attachments?: string[];
}

const CustomerInquiries: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setInquiries(mockInquiries);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const mockInquiries: Inquiry[] = [
    {
      id: '1',
      customerName: 'Kwame Asante',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      customerEmail: 'kwame.asante@gmail.com',
      customerPhone: '+233 24 123 4567',
      customerLocation: 'Accra, Ghana',
      service: 'Plumbing Services',
      subject: 'Emergency pipe repair needed',
      message: 'I have a burst pipe in my kitchen that needs urgent attention. Water is leaking everywhere and I need someone to come as soon as possible. Please let me know your availability today.',
      status: 'new',
      priority: 'urgent',
      createdAt: '2024-01-20T10:30:00',
      updatedAt: '2024-01-20T10:30:00',
      replies: [],
      isRead: false
    },
    {
      id: '2',
      customerName: 'Ama Serwaa',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      customerEmail: 'ama.serwaa@outlook.com',
      customerPhone: '+233 20 987 6543',
      customerLocation: 'Kumasi, Ghana',
      service: 'Electrical Installation',
      subject: 'Quote for home rewiring',
      message: 'I am renovating my 4-bedroom house and need a complete electrical rewiring. Can you provide a quote and timeline for this work?',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-01-19T14:15:00',
      updatedAt: '2024-01-20T09:00:00',
      replies: [
        {
          id: 'r1',
          sender: 'provider',
          message: 'Thank you for reaching out! I would be happy to provide a quote. Could you share some photos of your current electrical setup and the floor plan if available?',
          timestamp: '2024-01-19T16:00:00'
        },
        {
          id: 'r2',
          sender: 'customer',
          message: 'Sure! I have attached the floor plan. The house was built in 1985 so the wiring is quite old.',
          timestamp: '2024-01-19T18:30:00',
          attachments: ['floor_plan.pdf']
        },
        {
          id: 'r3',
          sender: 'provider',
          message: 'I have reviewed the floor plan. For a complete rewiring of a 4-bedroom house of this age, I estimate GHS 8,500 - 10,000 including materials. The work would take approximately 5-7 days. Would you like to schedule a site visit for a more accurate quote?',
          timestamp: '2024-01-20T09:00:00'
        }
      ],
      isRead: true
    },
    {
      id: '3',
      customerName: 'Kofi Mensah',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      customerEmail: 'kofi.mensah@yahoo.com',
      customerPhone: '+233 27 555 1234',
      customerLocation: 'Takoradi, Ghana',
      service: 'Carpentry Work',
      subject: 'Custom wardrobe design',
      message: 'I need a built-in wardrobe for my master bedroom. Looking for modern design with sliding doors. Room dimensions are 4m x 3.5m.',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-15T09:00:00',
      updatedAt: '2024-01-18T16:00:00',
      replies: [
        {
          id: 'r4',
          sender: 'provider',
          message: 'I can create a beautiful modern wardrobe for you! Based on your dimensions, I suggest a full-wall unit with 3 sliding mirror doors. Price would be GHS 4,500.',
          timestamp: '2024-01-15T11:00:00'
        },
        {
          id: 'r5',
          sender: 'customer',
          message: 'That sounds great! When can you start?',
          timestamp: '2024-01-15T14:00:00'
        },
        {
          id: 'r6',
          sender: 'provider',
          message: 'I can start next Monday. I will need a 50% deposit to order the materials. Installation will take 3 days.',
          timestamp: '2024-01-15T15:30:00'
        },
        {
          id: 'r7',
          sender: 'customer',
          message: 'Perfect! I will make the deposit today. Looking forward to working with you.',
          timestamp: '2024-01-16T10:00:00'
        }
      ],
      isRead: true
    },
    {
      id: '4',
      customerName: 'Akosua Boateng',
      customerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop',
      customerEmail: 'akosua.boateng@gmail.com',
      customerPhone: '+233 24 777 8899',
      customerLocation: 'Cape Coast, Ghana',
      service: 'AC Installation',
      subject: 'Split AC unit installation',
      message: 'I purchased a new 2HP split AC unit and need it installed in my living room. The outdoor unit will go on the balcony.',
      status: 'new',
      priority: 'high',
      createdAt: '2024-01-20T08:00:00',
      updatedAt: '2024-01-20T08:00:00',
      replies: [],
      isRead: false
    },
    {
      id: '5',
      customerName: 'Yaw Adjei',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      customerEmail: 'yaw.adjei@company.com',
      customerPhone: '+233 20 111 2233',
      customerLocation: 'Tema, Ghana',
      service: 'Painting Services',
      subject: 'Office space repainting',
      message: 'We are looking to repaint our office space. Total area is about 200 square meters. Need a professional finish with low-VOC paint.',
      status: 'closed',
      priority: 'medium',
      createdAt: '2024-01-10T11:00:00',
      updatedAt: '2024-01-14T17:00:00',
      replies: [
        {
          id: 'r8',
          sender: 'provider',
          message: 'Thank you for your inquiry. For 200sqm office space with premium low-VOC paint, the estimate is GHS 6,000-7,500 depending on the number of coats needed.',
          timestamp: '2024-01-10T13:00:00'
        },
        {
          id: 'r9',
          sender: 'customer',
          message: 'We have decided to go with another vendor. Thank you for your quote.',
          timestamp: '2024-01-14T17:00:00'
        }
      ],
      isRead: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return { bg: '#e7f6ff', text: '#03c3ec', border: '#03c3ec' };
      case 'in_progress': return { bg: '#fff4e5', text: '#ffab00', border: '#ffab00' };
      case 'resolved': return { bg: '#e8faef', text: '#71dd37', border: '#71dd37' };
      case 'closed': return { bg: '#f1f1f4', text: '#8592a3', border: '#8592a3' };
      default: return { bg: '#f1f1f4', text: '#8592a3', border: '#8592a3' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return { bg: '#ffe5e5', text: '#ff3e1d' };
      case 'high': return { bg: '#fff0e5', text: '#ff6b35' };
      case 'medium': return { bg: '#fff4e5', text: '#ffab00' };
      case 'low': return { bg: '#e8faef', text: '#71dd37' };
      default: return { bg: '#f1f1f4', text: '#8592a3' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Circle size={14} />;
      case 'in_progress': return <Clock size={14} />;
      case 'resolved': return <CheckCircle2 size={14} />;
      case 'closed': return <XCircle size={14} />;
      default: return <Circle size={14} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch =
      inquiry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || inquiry.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    inProgress: inquiries.filter(i => i.status === 'in_progress').length,
    resolved: inquiries.filter(i => i.status === 'resolved').length,
    unread: inquiries.filter(i => !i.isRead).length
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedInquiry) return;

    const newReply: Reply = {
      id: `r${Date.now()}`,
      sender: 'provider',
      message: replyMessage,
      timestamp: new Date().toISOString()
    };

    setInquiries(prev => prev.map(inq =>
      inq.id === selectedInquiry.id
        ? {
            ...inq,
            replies: [...inq.replies, newReply],
            status: inq.status === 'new' ? 'in_progress' : inq.status,
            updatedAt: new Date().toISOString()
          }
        : inq
    ));

    setSelectedInquiry(prev => prev ? {
      ...prev,
      replies: [...prev.replies, newReply],
      status: prev.status === 'new' ? 'in_progress' : prev.status
    } : null);

    setReplyMessage('');
  };

  const handleMarkAsResolved = () => {
    if (!selectedInquiry) return;

    setInquiries(prev => prev.map(inq =>
      inq.id === selectedInquiry.id
        ? { ...inq, status: 'resolved', updatedAt: new Date().toISOString() }
        : inq
    ));

    setSelectedInquiry(prev => prev ? { ...prev, status: 'resolved' } : null);
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
          <p style={{ color: '#8592a3' }}>Loading inquiries...</p>
        </motion.div>
      </div>
    );
  }

  // Mobile: Show conversation view when inquiry is selected
  if (isMobile && selectedInquiry) {
    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed inset-0 bg-white z-50 flex flex-col"
      >
        {/* Mobile Header */}
        <div
          className="flex items-center gap-3 p-4 border-b"
          style={{ borderColor: '#e7e7e8' }}
        >
          <button
            onClick={() => setSelectedInquiry(null)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} style={{ color: '#566a7f' }} />
          </button>
          <img
            src={selectedInquiry.customerAvatar}
            alt={selectedInquiry.customerName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate" style={{ color: '#566a7f' }}>
              {selectedInquiry.customerName}
            </h3>
            <p className="text-xs truncate" style={{ color: '#8592a3' }}>
              {selectedInquiry.service}
            </p>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <MoreVertical size={20} style={{ color: '#566a7f' }} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#f5f5f9' }}>
          {/* Initial Message */}
          <div className="flex justify-start">
            <div
              className="max-w-[80%] p-3 rounded-2xl rounded-tl-sm"
              style={{ backgroundColor: 'white' }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: '#696cff' }}>
                {selectedInquiry.subject}
              </p>
              <p className="text-sm" style={{ color: '#566a7f' }}>
                {selectedInquiry.message}
              </p>
              <p className="text-xs mt-2" style={{ color: '#8592a3' }}>
                {formatTime(selectedInquiry.createdAt)}
              </p>
            </div>
          </div>

          {/* Replies */}
          {selectedInquiry.replies.map((reply) => (
            <div
              key={reply.id}
              className={`flex ${reply.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  reply.sender === 'provider'
                    ? 'rounded-tr-sm'
                    : 'rounded-tl-sm'
                }`}
                style={{
                  backgroundColor: reply.sender === 'provider' ? '#696cff' : 'white',
                  color: reply.sender === 'provider' ? 'white' : '#566a7f'
                }}
              >
                <p className="text-sm">{reply.message}</p>
                {reply.attachments && reply.attachments.length > 0 && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                    <Paperclip size={14} />
                    <span className="text-xs">{reply.attachments.join(', ')}</span>
                  </div>
                )}
                <p
                  className="text-xs mt-2"
                  style={{
                    color: reply.sender === 'provider' ? 'rgba(255,255,255,0.7)' : '#8592a3'
                  }}
                >
                  {formatTime(reply.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        <div className="p-4 border-t" style={{ borderColor: '#e7e7e8' }}>
          <div className="flex items-end gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Paperclip size={20} style={{ color: '#8592a3' }} />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={1}
                className="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: '#e7e7e8',
                  fontSize: '14px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#696cff'}
                onBlur={(e) => e.target.style.borderColor = '#e7e7e8'}
              />
            </div>
            <button
              onClick={handleSendReply}
              disabled={!replyMessage.trim()}
              className="p-3 rounded-xl transition-all"
              style={{
                backgroundColor: replyMessage.trim() ? '#696cff' : '#e7e7e8',
                color: replyMessage.trim() ? 'white' : '#8592a3'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </motion.div>
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
            Customer Inquiries
          </h1>
          <p style={{ color: '#8592a3' }} className="mt-1">
            Manage and respond to customer messages
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#696cff', color: 'white' }}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Inquiries', value: stats.total, icon: MessageSquare, color: '#696cff' },
          { label: 'New', value: stats.new, icon: Circle, color: '#03c3ec' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: '#ffab00' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: '#71dd37' }
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-white"
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#566a7f' }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: '#8592a3' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#8592a3' }}
          />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: '#e7e7e8',
              fontSize: '14px'
            }}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#e7e7e8', fontSize: '14px', color: '#566a7f' }}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#e7e7e8', fontSize: '14px', color: '#566a7f' }}
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Inquiries List */}
        <div
          className={`${selectedInquiry && !isMobile ? 'lg:col-span-1' : 'lg:col-span-3'} bg-white rounded-xl overflow-hidden`}
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div className="p-4 border-b" style={{ borderColor: '#e7e7e8' }}>
            <h2 className="font-semibold" style={{ color: '#566a7f' }}>
              Inquiries ({filteredInquiries.length})
            </h2>
          </div>

          <div className="divide-y" style={{ borderColor: '#e7e7e8' }}>
            {filteredInquiries.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle size={48} className="mx-auto mb-4" style={{ color: '#e7e7e8' }} />
                <p style={{ color: '#8592a3' }}>No inquiries found</p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <motion.div
                  key={inquiry.id}
                  whileHover={{ backgroundColor: '#f5f5f9' }}
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    if (!inquiry.isRead) {
                      setInquiries(prev => prev.map(i =>
                        i.id === inquiry.id ? { ...i, isRead: true } : i
                      ));
                    }
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedInquiry?.id === inquiry.id ? 'bg-blue-50' : ''
                  } ${!inquiry.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={inquiry.customerAvatar}
                        alt={inquiry.customerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {!inquiry.isRead && (
                        <div
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                          style={{ backgroundColor: '#696cff' }}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className={`font-semibold truncate ${!inquiry.isRead ? 'font-bold' : ''}`}
                          style={{ color: '#566a7f' }}
                        >
                          {inquiry.customerName}
                        </h3>
                        <span className="text-xs whitespace-nowrap" style={{ color: '#8592a3' }}>
                          {formatDate(inquiry.updatedAt)}
                        </span>
                      </div>

                      <p
                        className="text-sm truncate mb-2"
                        style={{ color: '#566a7f' }}
                      >
                        {inquiry.subject}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                          style={{
                            backgroundColor: getStatusColor(inquiry.status).bg,
                            color: getStatusColor(inquiry.status).text
                          }}
                        >
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status.replace('_', ' ')}
                        </span>

                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
                          style={{
                            backgroundColor: getPriorityColor(inquiry.priority).bg,
                            color: getPriorityColor(inquiry.priority).text
                          }}
                        >
                          {inquiry.priority}
                        </span>

                        {inquiry.replies.length > 0 && (
                          <span
                            className="inline-flex items-center gap-1 text-xs"
                            style={{ color: '#8592a3' }}
                          >
                            <MessageCircle size={12} />
                            {inquiry.replies.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Conversation Panel - Desktop */}
        {selectedInquiry && !isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-xl overflow-hidden flex flex-col"
            style={{
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              maxHeight: 'calc(100vh - 300px)',
              minHeight: '500px'
            }}
          >
            {/* Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: '#e7e7e8' }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={selectedInquiry.customerAvatar}
                  alt={selectedInquiry.customerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold" style={{ color: '#566a7f' }}>
                    {selectedInquiry.customerName}
                  </h3>
                  <p className="text-xs" style={{ color: '#8592a3' }}>
                    {selectedInquiry.service}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: getStatusColor(selectedInquiry.status).bg,
                    color: getStatusColor(selectedInquiry.status).text
                  }}
                >
                  {getStatusIcon(selectedInquiry.status)}
                  {selectedInquiry.status.replace('_', ' ')}
                </span>

                {selectedInquiry.status !== 'resolved' && selectedInquiry.status !== 'closed' && (
                  <button
                    onClick={handleMarkAsResolved}
                    className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: '#71dd37', color: 'white' }}
                  >
                    Mark Resolved
                  </button>
                )}

                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Archive size={18} style={{ color: '#8592a3' }} />
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <div
              className="px-4 py-3 border-b flex flex-wrap gap-4 text-xs"
              style={{ borderColor: '#e7e7e8', backgroundColor: '#f5f5f9' }}
            >
              <span className="inline-flex items-center gap-1" style={{ color: '#566a7f' }}>
                <Mail size={14} style={{ color: '#8592a3' }} />
                {selectedInquiry.customerEmail}
              </span>
              <span className="inline-flex items-center gap-1" style={{ color: '#566a7f' }}>
                <Phone size={14} style={{ color: '#8592a3' }} />
                {selectedInquiry.customerPhone}
              </span>
              <span className="inline-flex items-center gap-1" style={{ color: '#566a7f' }}>
                <MapPin size={14} style={{ color: '#8592a3' }} />
                {selectedInquiry.customerLocation}
              </span>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ backgroundColor: '#f5f5f9' }}
            >
              {/* Initial Message */}
              <div className="flex gap-3">
                <img
                  src={selectedInquiry.customerAvatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div
                  className="max-w-[70%] p-3 rounded-2xl rounded-tl-sm"
                  style={{ backgroundColor: 'white' }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: '#696cff' }}>
                    {selectedInquiry.subject}
                  </p>
                  <p className="text-sm" style={{ color: '#566a7f' }}>
                    {selectedInquiry.message}
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#8592a3' }}>
                    {formatTime(selectedInquiry.createdAt)} · {new Date(selectedInquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              {/* Replies */}
              {selectedInquiry.replies.map((reply) => (
                <div
                  key={reply.id}
                  className={`flex gap-3 ${reply.sender === 'provider' ? 'justify-end' : ''}`}
                >
                  {reply.sender === 'customer' && (
                    <img
                      src={selectedInquiry.customerAvatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      reply.sender === 'provider'
                        ? 'rounded-tr-sm'
                        : 'rounded-tl-sm'
                    }`}
                    style={{
                      backgroundColor: reply.sender === 'provider' ? '#696cff' : 'white',
                      color: reply.sender === 'provider' ? 'white' : '#566a7f'
                    }}
                  >
                    <p className="text-sm">{reply.message}</p>
                    {reply.attachments && reply.attachments.length > 0 && (
                      <div
                        className="flex items-center gap-2 mt-2 pt-2 border-t"
                        style={{ borderColor: reply.sender === 'provider' ? 'rgba(255,255,255,0.2)' : '#e7e7e8' }}
                      >
                        <Paperclip size={14} />
                        <span className="text-xs">{reply.attachments.join(', ')}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <span
                        className="text-xs"
                        style={{
                          color: reply.sender === 'provider' ? 'rgba(255,255,255,0.7)' : '#8592a3'
                        }}
                      >
                        {formatTime(reply.timestamp)}
                      </span>
                      {reply.sender === 'provider' && (
                        <CheckCheck size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
                      )}
                    </div>
                  </div>
                  {reply.sender === 'provider' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#696cff' }}
                    >
                      <User size={16} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reply Input */}
            {selectedInquiry.status !== 'closed' && (
              <div className="p-4 border-t" style={{ borderColor: '#e7e7e8' }}>
                <div className="flex items-end gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Paperclip size={20} style={{ color: '#8592a3' }} />
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: '#e7e7e8',
                        fontSize: '14px'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: replyMessage.trim() ? '#696cff' : '#e7e7e8',
                      color: replyMessage.trim() ? 'white' : '#8592a3'
                    }}
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: '#8592a3' }}>
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CustomerInquiries;