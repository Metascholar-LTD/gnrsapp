// ============================================================================
// SCHOLAR SIGN IN PAGE
// ============================================================================
// Modern, clean sign-in form for academic users
// ============================================================================

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type FormData = {
  email: string;
  password: string;
};

const ScholarSignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorField, setErrorField] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Handle OAuth callback after redirect
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if we're coming back from OAuth (check URL params)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          // User is authenticated via OAuth, check profile and redirect
          const user = session.user;
          
          // Check if user has a scholar profile
          const { data: profile } = await supabase
            .from('profiles' as any)
            .select('id, role, full_name')
            .eq('user_id', user.id)
            .single();

          // Create or update profile if needed
          if (!profile || (profile as any).role !== 'scholar') {
            const fullName = user.user_metadata?.full_name || 
                            user.user_metadata?.name || 
                            `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() ||
                            user.email?.split('@')[0] || 
                            null;

            await supabase
              .from('profiles' as any)
              .upsert({
                user_id: user.id,
                role: 'scholar',
                full_name: fullName || undefined,
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'user_id'
              });
          }

          // Clean up URL params
          window.history.replaceState({}, '', window.location.pathname);
          
          // Redirect based on profile status
          if (!profile || !(profile as any).full_name) {
            navigate('/scholarly/auth/complete-profile');
          } else {
            navigate('/scholar/dashboard');
          }
        }
      }
    };

    checkAuthAndRedirect();

    // Listen for auth state changes (for OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        
        // Check if this is an OAuth sign-in
        if (user.app_metadata?.provider === 'google') {
          // Check profile
          const { data: profile } = await supabase
            .from('profiles' as any)
            .select('id, role, full_name')
            .eq('user_id', user.id)
            .single();

          if (!profile || (profile as any).role !== 'scholar') {
            const fullName = user.user_metadata?.full_name || 
                            user.user_metadata?.name || 
                            `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() ||
                            user.email?.split('@')[0] || 
                            null;

            await supabase
              .from('profiles' as any)
              .upsert({
                user_id: user.id,
                role: 'scholar',
                full_name: fullName || undefined,
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'user_id'
              });
          }

          if (!profile || !(profile as any).full_name) {
            navigate('/scholarly/auth/complete-profile');
          } else {
            navigate('/scholar/dashboard');
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const goToForgotPassword = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.preventDefault();
    navigate('/scholarly/auth/reset-password');
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorField('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/scholarly/auth/sign-in`,
        },
      });

      if (error) {
        setErrorField(error.message);
        setIsGoogleLoading(false);
      }
      // If successful, user will be redirected to Google, then back to our callback
      // The useEffect will handle the callback
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorField(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errorField) {
      setErrorField('');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Basic validation
    if (!formData.email.trim()) {
      setErrorField('Email is required');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorField('Please enter a valid email address');
      return;
    }
    
    if (!formData.password) {
      setErrorField('Password is required');
      return;
    }

    setErrorField('');
    setIsSubmitting(true);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorField(error.message);
        setIsSubmitting(false);
        return;
      }

      if (!data.session || !data.user) {
        setErrorField('Sign in failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Check if user has a scholar profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles' as any)
        .select('id, role, full_name')
        .eq('user_id', data.user.id)
        .single();

      // If profile doesn't exist or user is not a scholar, redirect to complete profile
      if (profileError || !profile || (profile as any).role !== 'scholar') {
        // Create or update profile to scholar role
        const { error: upsertError } = await supabase
          .from('profiles' as any)
          .upsert({
            user_id: data.user.id,
            role: 'scholar',
            full_name: data.user.user_metadata?.full_name || 
                      data.user.user_metadata?.name || 
                      data.user.email?.split('@')[0] || 
                      null,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        if (upsertError) {
          console.error('Error creating/updating profile:', upsertError);
        }

        // Redirect to complete profile page
        navigate('/scholarly/auth/complete-profile');
        return;
      }

      // User is authenticated and has scholar profile - redirect to dashboard
      navigate('/scholar/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorField(errorMessage);
      setIsSubmitting(false);
    }
  };

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
      {/* Overlay for better readability */}
      <div className='absolute inset-0 bg-black/40 dark:bg-black/60'></div>
      <div className='relative z-10 w-full max-w-md'>
        {/* Form Container */}
        <div className='bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-10'>
          {/* Header */}
        <div className='text-center mb-8'>
            <Link to="/" className='inline-block mb-4'>
              <img 
                src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944554/Of_Participation_-_1_-_Edited_l53t4f.png" 
                alt="GNRS Logo" 
                className="h-12 w-auto mx-auto"
              />
            </Link>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2'>
              Welcome Back
            </h1>
            <p className='text-slate-600 dark:text-slate-400 text-sm'>
              Sign in to access your scholar account
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
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className='w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label htmlFor="password" className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                  Password
                </label>
                <button
                  type='button'
                  onClick={goToForgotPassword}
                  className='text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors'
                >
                  Forgot?
                </button>
              </div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, 'password')}
                  autoComplete="current-password"
                  className='w-full h-12 px-4 pr-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Error Field */}
            {errorField && (
              <div className='p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <p className='text-red-600 dark:text-red-400 text-sm font-medium'>{errorField}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              className='w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group'
              type='submit'
            >
              {isSubmitting ? (
                <>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-slate-200 dark:border-slate-700'></div>
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-white/95 dark:bg-slate-900/95 px-2 text-slate-500 dark:text-slate-400'>Or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type='button'
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isSubmitting}
              className='w-full h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isGoogleLoading ? (
                <>
                  <div className='w-5 h-5 border-2 border-slate-400/30 border-t-slate-600 rounded-full animate-spin' />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <img
                    src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'
                    width={20}
                    height={20}
                    alt='Google'
                    className='w-5 h-5'
                  />
                  Continue with Google
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className='text-center pt-4'>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Don't have an account?{' '}
                <Link
                  to="/scholarly/auth/sign-up"
                  className='text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScholarSignIn;
