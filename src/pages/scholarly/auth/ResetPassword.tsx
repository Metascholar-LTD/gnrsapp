// ============================================================================
// PASSWORD RESET PAGE
// ============================================================================
// Modern password reset flow matching auth pages design
// ============================================================================

import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
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
                Check Your Email
              </h1>
              <p className='text-slate-600 dark:text-slate-400 text-sm'>
                We've sent password reset instructions to your email address
              </p>
            </div>

            {/* Success Message */}
            <div className='mb-6 p-4 rounded-xl bg-green-50/50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/50'>
              <p className='text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2'>
                If an account exists for <span className='font-semibold text-slate-900 dark:text-slate-100'>{email}</span>, you will receive password reset instructions shortly.
              </p>
              <p className='text-xs text-slate-600 dark:text-slate-400'>
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            {/* Back Button */}
            <Link 
              to="/scholarly/auth/sign-in" 
              className='w-full h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md'
            >
              <ArrowLeft className='w-5 h-5' />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Back Link */}
          <Link 
            to="/scholarly/auth/sign-in" 
            className='inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-6 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Sign In
          </Link>

          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2'>
              Reset Password
            </h1>
            <p className='text-slate-600 dark:text-slate-400 text-sm'>
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email Field */}
            <div className='space-y-2'>
              <label htmlFor="email" className='text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2'>
                <Mail className='w-4 h-4' />
                Email Address
              </label>
              <div className='relative'>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full h-12 px-4 rounded-xl border-2 ${
                    error 
                      ? 'border-red-300 dark:border-red-700' 
                      : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200`}
                  required
                />
              </div>
              {error && (
                <div className='flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                  <AlertCircle className='w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0' />
                  <p className='text-red-600 dark:text-red-400 text-sm font-medium'>{error}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group'
            >
              {isSubmitting ? (
                <>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                  <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='text-center pt-6 mt-6 border-t border-slate-200 dark:border-slate-700'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Remember your password?{' '}
              <Link
                to="/scholarly/auth/sign-in"
                className='text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
