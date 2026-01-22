import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Clock,
  MessageSquare,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  ChevronDown,
  X
} from 'lucide-react';

// Types
interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  images: string[];
  status: 'active' | 'inactive' | 'pending';
  views: number;
  inquiries: number;
  createdAt: string;
  location: string;
  rating?: number;
  reviewCount?: number;
}

// Mock data
const mockServices: Service[] = [
  {
    id: '1',
    title: 'Professional Plumbing Services',
    category: 'Plumbing',
    description: 'Expert plumbing repairs and installations. Available 24/7 for emergency services.',
    price: 150,
    currency: 'GHS',
    priceType: 'hourly',
    images: [],
    status: 'active',
    views: 245,
    inquiries: 12,
    createdAt: '2024-01-05',
    location: 'Accra, Ghana',
    rating: 4.8,
    reviewCount: 23
  },
  {
    id: '2',
    title: 'Electrical Wiring & Installation',
    category: 'Electrical',
    description: 'Professional electrical services for homes and businesses. Licensed and insured.',
    price: 200,
    currency: 'GHS',
    priceType: 'fixed',
    images: [],
    status: 'active',
    views: 189,
    inquiries: 8,
    createdAt: '2024-01-08',
    location: 'Accra, Ghana',
    rating: 4.5,
    reviewCount: 15
  },
  {
    id: '3',
    title: 'AC Repair & Maintenance',
    category: 'HVAC',
    description: 'Air conditioning repair, installation, and regular maintenance services.',
    price: 100,
    currency: 'GHS',
    priceType: 'fixed',
    images: [],
    status: 'pending',
    views: 67,
    inquiries: 3,
    createdAt: '2024-01-12',
    location: 'Tema, Ghana'
  },
  {
    id: '4',
    title: 'Interior Painting Services',
    category: 'Painting',
    description: 'Quality interior and exterior painting. Free color consultation included.',
    price: 0,
    currency: 'GHS',
    priceType: 'negotiable',
    images: [],
    status: 'inactive',
    views: 156,
    inquiries: 5,
    createdAt: '2023-12-20',
    location: 'Accra, Ghana',
    rating: 4.2,
    reviewCount: 8
  }
];

const categories = ['All', 'Plumbing', 'Electrical', 'HVAC', 'Painting', 'Carpentry', 'Other'];

const ManageServices: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filteredServices = services
    .filter(s => selectedCategory === 'All' || s.category === selectedCategory)
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    .filter(s =>
      searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(s =>
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    ));
  };

  const deleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
    setContextMenu(null);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
      'active': { color: '#71dd37', bg: 'rgba(113, 221, 55, 0.1)', icon: <CheckCircle2 size={14} /> },
      'inactive': { color: '#8592a3', bg: 'rgba(133, 146, 163, 0.1)', icon: <XCircle size={14} /> },
      'pending': { color: '#ffab00', bg: 'rgba(255, 171, 0, 0.1)', icon: <AlertCircle size={14} /> }
    };
    return configs[status] || configs['pending'];
  };

  const stats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.status === 'active').length,
    totalViews: services.reduce((sum, s) => sum + s.views, 0),
    totalInquiries: services.reduce((sum, s) => sum + s.inquiries, 0)
  };

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif" }}>Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">
            <strong>Manage</strong> Services
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Create and manage your service listings
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#696cff',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontFamily: "'Source Sans Pro', sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginTop: isMobile ? '12px' : 0
          }}
        >
          <Plus size={16} />
          Add New Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(105, 108, 255, 0.1)', borderRadius: '10px' }}>
                  <Package size={24} color="#696cff" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C' }}>Total Services</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.totalServices}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(113, 221, 55, 0.1)', borderRadius: '10px' }}>
                  <CheckCircle2 size={24} color="#71dd37" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C' }}>Active</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.activeServices}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(3, 195, 236, 0.1)', borderRadius: '10px' }}>
                  <Eye size={24} color="#03c3ec" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C' }}>Total Views</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.totalViews}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 171, 0, 0.1)', borderRadius: '10px' }}>
                  <MessageSquare size={24} color="#ffab00" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C' }}>Inquiries</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.totalInquiries}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-lg-4">
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #E7E5E4',
                    borderRadius: '8px',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
            <div className="col-lg-5">
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }} className="hide-scrollbar">
                {categories.slice(0, isMobile ? 4 : 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '20px',
                      backgroundColor: selectedCategory === cat ? '#696cff' : '#F5F5F5',
                      color: selectedCategory === cat ? '#FFFFFF' : '#78716C',
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-lg-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E7E5E4',
                  borderRadius: '8px',
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontSize: '0.875rem',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <Package size={48} color="#A8A29E" style={{ marginBottom: '16px' }} />
            <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", color: '#1C1917', marginBottom: '8px' }}>
              No services found
            </h5>
            <p style={{ fontFamily: "'Source Sans Pro', sans-serif", color: '#78716C', marginBottom: '24px' }}>
              Add your first service to get started
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#696cff',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontFamily: "'Source Sans Pro', sans-serif",
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus size={18} />
              Add Service
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredServices.map((service, index) => {
            const statusConfig = getStatusConfig(service.status);

            return (
              <motion.div
                key={service.id}
                className="col-lg-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="card h-100"
                  style={{
                    transition: 'all 0.2s ease',
                    opacity: service.status === 'inactive' ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.color,
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {statusConfig.icon}
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#F5F5F5',
                          color: '#78716C',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {service.category}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({ id: service.id, x: e.clientX, y: e.clientY });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          color: '#78716C'
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <h6 style={{
                      fontFamily: "'Crimson Text', Georgia, serif",
                      fontSize: '1.0625rem',
                      fontWeight: 600,
                      color: '#1C1917',
                      marginBottom: '8px'
                    }}>
                      {service.title}
                    </h6>

                    <p style={{
                      fontSize: '0.8125rem',
                      color: '#78716C',
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {service.description}
                    </p>

                    <div className="d-flex align-items-center gap-3 mb-3 flex-wrap" style={{ fontSize: '0.8125rem', color: '#78716C' }}>
                      <span className="d-flex align-items-center gap-1">
                        <DollarSign size={14} />
                        {service.priceType === 'negotiable' ? 'Negotiable' : `${service.currency} ${service.price}${service.priceType === 'hourly' ? '/hr' : ''}`}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <MapPin size={14} />
                        {service.location}
                      </span>
                      {service.rating && (
                        <span className="d-flex align-items-center gap-1">
                          <Star size={14} fill="#ffab00" color="#ffab00" />
                          {service.rating} ({service.reviewCount})
                        </span>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderTop: '1px solid #F5F5F5'
                    }}>
                      <div className="d-flex gap-4">
                        <div className="text-center">
                          <p style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>{service.views}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#A8A29E' }}>Views</p>
                        </div>
                        <div className="text-center">
                          <p style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>{service.inquiries}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#A8A29E' }}>Inquiries</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleServiceStatus(service.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: service.status === 'active' ? 'rgba(113, 221, 55, 0.1)' : '#F5F5F5',
                          color: service.status === 'active' ? '#71dd37' : '#78716C',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        {service.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {service.status === 'active' ? 'Active' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              padding: '8px',
              zIndex: 1000,
              minWidth: '160px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#1C1917', fontSize: '0.875rem' }}>
              <Eye size={16} />
              View
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#1C1917', fontSize: '0.875rem' }}>
              <Edit2 size={16} />
              Edit
            </button>
            <div style={{ height: '1px', backgroundColor: '#E7E5E4', margin: '4px 0' }} />
            <button
              onClick={() => deleteService(contextMenu.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#ff3e1d', fontSize: '0.875rem' }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Service Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '20px'
            }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '20px', borderBottom: '1px solid #E7E5E4' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", margin: 0 }}>Add New Service</h5>
                  <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#78716C' }}>
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div className="mb-3">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Service Title</label>
                  <input type="text" placeholder="e.g., Professional Plumbing Services" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '0.875rem' }} />
                </div>
                <div className="mb-3">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Category</label>
                  <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '0.875rem' }}>
                    {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Description</label>
                  <textarea rows={3} placeholder="Describe your service..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical' }} />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Price (GHS)</label>
                    <input type="number" placeholder="0" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '0.875rem' }} />
                  </div>
                  <div className="col-6">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Price Type</label>
                    <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '0.875rem' }}>
                      <option value="fixed">Fixed Price</option>
                      <option value="hourly">Per Hour</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Location</label>
                  <input type="text" placeholder="e.g., Accra, Ghana" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E7E5E4', borderRadius: '8px', fontSize: '0.875rem' }} />
                </div>
                <div className="mb-3">
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Service Images</label>
                  <div style={{ border: '2px dashed #E7E5E4', borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer' }}>
                    <ImageIcon size={32} color="#A8A29E" style={{ marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#78716C' }}>Click or drag images to upload</p>
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 20px', borderTop: '1px solid #E7E5E4', backgroundColor: '#FAFAF9', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowAddModal(false)} style={{ padding: '10px 20px', border: '1px solid #E7E5E4', borderRadius: '8px', backgroundColor: 'transparent', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', color: '#78716C' }}>
                  Cancel
                </button>
                <button style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', backgroundColor: '#696cff', color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  Create Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ManageServices;
