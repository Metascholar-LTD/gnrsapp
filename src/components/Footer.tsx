import { Link } from "react-router-dom";
import { useState } from "react";
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube, ArrowRight, Send } from "lucide-react";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail("");
  };

  return (
    <>
      <footer className="relative overflow-hidden" style={{ backgroundColor: '#0A0E27' }}>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="container-fluid py-12 relative z-10">
          <div className="container">
            <div className="row g-8">
              {/* Company Info */}
              <div className="col-lg-3 col-md-6 mb-6 mb-lg-0">
                <div className="mb-4">
                  <Link to="/" className="text-decoration-none">
                    <img 
                      src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944554/Of_Participation_-_1_-_Edited_l53t4f.png" 
                      alt="GNRS Logo" 
                      style={{ 
                        height: '65px', 
                        width: 'auto',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '6px',
                        marginBottom: '1.5rem'
                      }}
                    />
                  </Link>
                </div>
                <p className="text-gray-400 mb-4" style={{ 
                  fontSize: '0.95rem', 
                  lineHeight: '1.7',
                  color: '#9CA3AF'
                }}>
                  Empowering Ghana through accessible national resources, education, and opportunities. 
                  Your gateway to a brighter future.
                </p>
                <div className="d-flex gap-3">
                  <a 
                    href="https://www.facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#1E293B',
                      color: '#64748B',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(100, 116, 139, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3B82F6';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="https://www.twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#1E293B',
                      color: '#64748B',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(100, 116, 139, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3B82F6';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Twitter size={18} />
                  </a>
                  <a 
                    href="https://www.linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#1E293B',
                      color: '#64748B',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(100, 116, 139, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3B82F6';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Linkedin size={18} />
                  </a>
                  <a 
                    href="https://www.youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#1E293B',
                      color: '#64748B',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(100, 116, 139, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EF4444';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Youtube size={18} />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6 mb-6 mb-lg-0">
                <h5 className="text-white mb-4" style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  Quick Links
                </h5>
                <ul className="list-unstyled" style={{ padding: 0 }}>
                  <li className="mb-3">
                    <Link 
                      to="/" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      Home
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/education" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      Education
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/jobs" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      Jobs
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/news" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      News
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/contact" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Services */}
              <div className="col-lg-2 col-md-6 mb-6 mb-lg-0">
                <h5 className="text-white mb-4" style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  Services
                </h5>
                <ul className="list-unstyled" style={{ padding: 0 }}>
                  <li className="mb-3">
                    <Link 
                      to="/education/past-questions" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      Past Questions
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/scholarship-hub" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      Scholarships
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/jobs/listings" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      Job Listings
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/jobs/career-resources" 
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <ArrowRight size={14} style={{ marginRight: '8px', opacity: 0.6 }} />
                      Career Resources
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Partner Networks */}
              <div className="col-lg-2 col-md-6 mb-6 mb-lg-0">
                <h5 className="text-white mb-4" style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  Partner Networks
                </h5>
                <ul className="list-unstyled" style={{ padding: 0 }}>
                  <li className="mb-3">
                    <a 
                      href="https://academicdigital.space/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <img 
                        src="https://res.cloudinary.com/dsypclqxk/image/upload/v1756325702/Meta_fqxtsp.jpg" 
                        alt="Metascholar Institute Logo" 
                        style={{
                          width: '24px',
                          height: '24px',
                          marginRight: '10px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />
                      <span>Metascholar Institute</span>
                    </a>
                  </li>
                  <li className="mb-3">
                    <a 
                      href="https://metascholarturnitinmoodle.com/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <img 
                        src="https://res.cloudinary.com/dsypclqxk/image/upload/v1758014075/tn_elksc3.png" 
                        alt="Metascholar Turnitin Logo" 
                        style={{
                          width: '24px',
                          height: '24px',
                          marginRight: '10px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />
                      <span>Metascholar Turnitin</span>
                    </a>
                  </li>
                  <li className="mb-3">
                    <a 
                      href="https://scholarindexing.com/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <img 
                        src="https://res.cloudinary.com/dsypclqxk/image/upload/v1758014075/SIS_wcdf5h.png" 
                        alt="Scholar Indexing Logo" 
                        style={{
                          width: '24px',
                          height: '24px',
                          marginRight: '10px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />
                      <span>Scholar Indexing</span>
                    </a>
                  </li>
                  <li className="mb-3">
                    <a 
                      href="https://ijmsirjournal.com/index.php/ojs" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none d-flex align-items-center"
                      style={{
                        color: '#9CA3AF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontWeight: 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <img 
                        src="https://res.cloudinary.com/dsypclqxk/image/upload/v1758014188/IJMSIR_ljip1d.jpg" 
                        alt="CUG International Journal Logo" 
                        style={{
                          width: '24px',
                          height: '24px',
                          marginRight: '10px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />
                      <span>CUG International Journal</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="col-lg-3 col-md-6">
                <h5 className="text-white mb-4" style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  Newsletter
                </h5>
                <p className="text-gray-400 mb-4" style={{ 
                  fontSize: '0.9rem', 
                  lineHeight: '1.6',
                  color: '#9CA3AF'
                }}>
                  Stay updated with the latest news, job opportunities, and educational resources.
                </p>
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="position-relative mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="form-control"
                      style={{
                        backgroundColor: '#1E293B',
                        border: '1px solid rgba(100, 116, 139, 0.2)',
                        borderRadius: '12px',
                        padding: '14px 50px 14px 20px',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3B82F6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="submit"
                      className="position-absolute"
                      style={{
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: '#3B82F6',
                        border: 'none',
                        borderRadius: '10px',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#3B82F6';
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <div className="d-flex align-items-center mb-3" style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                    <MapPin size={16} style={{ marginRight: '12px', color: '#64748B' }} />
                    <span>Accra, Ghana</span>
                  </div>
                  <div className="d-flex align-items-center mb-3" style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                    <Phone size={16} style={{ marginRight: '12px', color: '#64748B' }} />
                    <span>+233 XX XXX XXXX</span>
            </div>
                  <div className="d-flex align-items-center" style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                    <Mail size={16} style={{ marginRight: '12px', color: '#64748B' }} />
                    <span>info@gnrs.gov.gh</span>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Copyright Section */}
        <div style={{
          borderTop: '1px solid rgba(100, 116, 139, 0.1)',
          backgroundColor: '#050813',
          padding: '24px 0'
        }}>
        <div className="container">
            <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <p className="mb-0" style={{ 
                  color: '#64748B', 
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  &copy; {new Date().getFullYear()} <span style={{ color: '#FFFFFF', fontWeight: 500 }}>Ghana National Resource System (GNRS)</span>. All rights reserved.
                </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
                <div className="d-flex justify-content-center justify-content-md-end gap-4" style={{ fontSize: '0.875rem' }}>
                  <Link 
                    to="/terms" 
                    className="text-decoration-none"
                    style={{ color: '#64748B', transition: 'color 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#3B82F6'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                  >
                    Terms & Conditions
                  </Link>
                  <span style={{ color: '#64748B' }}>|</span>
                  <Link 
                    to="/privacy" 
                    className="text-decoration-none"
                    style={{ color: '#64748B', transition: 'color 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#3B82F6'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <a 
        href="#" 
        className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '50px',
          height: '50px',
          backgroundColor: '#3B82F6',
          border: 'none',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 99
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2563EB';
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3B82F6';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </>
  );
};
