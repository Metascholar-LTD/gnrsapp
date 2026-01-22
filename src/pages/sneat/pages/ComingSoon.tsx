import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from './shared/PageWrapper';

const ComingSoon: React.FC = () => {
  const location = useLocation();
  
  // Extract page name from path
  const getPageName = () => {
    const path = location.pathname;
    if (path.includes('discussion-forums')) return 'Discussion Forums';
    if (path.includes('study-groups')) return 'Study Groups';
    if (path.includes('alumni-connect')) return 'Alumni Connect';
    if (path.includes('mentorship')) return 'Mentorship Program';
    return 'This Page';
  };

  const pageName = getPageName();

  return (
    <PageWrapper>
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', padding: '3rem 1rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
          style={{ maxWidth: '600px' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              margin: '0 auto 2rem',
              maxWidth: '500px',
              width: '100%'
            }}
          >
            <img
              src="https://res.cloudinary.com/dsypclqxk/image/upload/v1769083304/d596bfe5e90bf87c450387e4f9fe59b4_rqqfce.jpg"
              alt="Coming Soon"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </motion.div>

          <h2 style={{
            fontFamily: "'Source Sans Pro', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#37474f',
            marginBottom: '1.5rem'
          }}>
            {pageName}
          </h2>

          <p style={{
            fontFamily: "'Source Sans Pro', sans-serif",
            fontSize: '1.125rem',
            color: '#78909c',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            We're working hard to bring you an amazing experience. This page will be ready soon!
          </p>

          <Link
            to="/userprofile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#5c6bc0',
              color: '#FFFFFF',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: "'Source Sans Pro', sans-serif",
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3f51b5';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5c6bc0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ComingSoon;
