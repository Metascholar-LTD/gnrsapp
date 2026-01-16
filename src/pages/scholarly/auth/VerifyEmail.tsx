// ============================================================================
// EMAIL VERIFICATION PAGE
// ============================================================================
// Confirmation page after sign up - matches auth pages design
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  return (
    <div 
      className='min-h-screen flex items-center justify-center px-4 py-12 relative'
      style={{
        backgroundImage: 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/38816/image-from-rawpixel-id-2210775-jpeg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Blurred Background Overlay */}
      <div className='absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md'></div>
      
      <div className='relative z-10 w-full max-w-md'>
        {/* Form Container */}
        <div className='bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-10'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2'>
              Verify Your Email
            </h1>
            <p className='text-slate-600 dark:text-slate-400 text-sm'>
              We've sent a verification link to your email address
            </p>
          </div>

          {/* Message */}
          <div className='mb-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/50'>
            <p className='text-sm text-slate-700 dark:text-slate-300 leading-relaxed'>
              Please check your inbox and click the verification link to activate your account. 
              The link will expire in 24 hours.
            </p>
          </div>

          {/* Actions */}
          <div className='space-y-3 mb-6'>
            <Link 
              to="/scholarly/auth/complete-profile" 
              className='w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 group'
            >
              <span>Continue to Profile Setup</span>
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>
            
            <button className='w-full h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md'>
              <Mail className='w-5 h-5' />
              Resend Verification Email
            </button>
            
            <Link 
              to="/scholarly/auth/sign-in" 
              className='w-full h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md'
            >
              Back to Sign In
            </Link>
          </div>

          {/* Help Text */}
          <div className='pt-4 border-t border-slate-200 dark:border-slate-700'>
            <p className='text-xs text-center text-slate-600 dark:text-slate-400'>
              Didn't receive the email? Check your spam folder or{' '}
              <a href="#" className='text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors'>
                contact support
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
