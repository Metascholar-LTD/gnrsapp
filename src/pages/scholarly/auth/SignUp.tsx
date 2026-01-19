// ============================================================================
// SCHOLAR SIGN UP PAGE
// ============================================================================
// Minimal, modern sign-up form - like top publishing houses
// Additional profile info collected after email verification
// ============================================================================

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const ScholarSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorField, setErrorField] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorField) {
      setErrorField('');
    }
  };

  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
  };

  const getPasswordStrength = (password: string): { strength: number; percentage: number; color: string } => {
    if (!password) {
      return { strength: 0, percentage: 0, color: 'bg-slate-300 dark:bg-slate-600' };
    }

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /(?=.*[a-z])/.test(password),
      uppercase: /(?=.*[A-Z])/.test(password),
      number: /(?=.*\d)/.test(password),
    };

    if (checks.length) strength++;
    if (checks.lowercase) strength++;
    if (checks.uppercase) strength++;
    if (checks.number) strength++;

    const percentage = (strength / 4) * 100;

    let color = 'bg-red-500';
    if (strength === 1) color = 'bg-red-500';
    else if (strength === 2) color = 'bg-amber-500';
    else if (strength === 3) color = 'bg-blue-500';
    else if (strength === 4) color = 'bg-green-500';

    return { strength, percentage, color };
  };

  // Function to create or update scholar profile
  const createScholarProfile = async (userId: string, fullName?: string, email?: string) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingProfile) {
        // Profile exists, update if needed
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: 'scholar',
            full_name: fullName || existingProfile.full_name,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        }
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            role: 'scholar',
            full_name: fullName || null,
            affiliation: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Don't throw - profile creation failure shouldn't block auth
        }
      }
    } catch (error) {
      console.error('Error in createScholarProfile:', error);
      // Don't throw - profile creation failure shouldn't block auth
    }
  };

  // Handle OAuth callback after redirect
  useEffect(() => {
    const checkAuthAndCreateProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if we're coming back from OAuth (check URL params)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          // User is authenticated via OAuth, create profile if needed
          const user = session.user;
          const fullName = user.user_metadata?.full_name || 
                          user.user_metadata?.name || 
                          `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() ||
                          user.email?.split('@')[0] || 
                          null;

          await createScholarProfile(user.id, fullName || undefined, user.email);
          
          // Clean up URL params
          window.history.replaceState({}, '', window.location.pathname);
          
          // Redirect to complete profile (Google users skip email verification)
          navigate('/scholarly/auth/complete-profile');
        }
      }
    };

    checkAuthAndCreateProfile();

    // Listen for auth state changes (for OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        // Check if this is an OAuth sign-in (has provider metadata)
        if (user.app_metadata?.provider === 'google') {
          const fullName = user.user_metadata?.full_name || 
                          user.user_metadata?.name || 
                          `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() ||
                          user.email?.split('@')[0] || 
                          null;

          await createScholarProfile(user.id, fullName || undefined, user.email);
          // Redirect to complete profile (Google users skip email verification)
          navigate('/scholarly/auth/complete-profile');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validation
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
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setErrorField(passwordValidation.message || 'Invalid password');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorField('Passwords do not match');
      return;
    }

    setErrorField('');
    setIsSubmitting(true);
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorField(error.message);
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        // Create scholar profile
        await createScholarProfile(data.user.id, null, formData.email);
        
        // Check if user is automatically signed in (email confirmation disabled)
        if (data.session) {
          // User is automatically signed in, redirect to complete profile
          navigate('/scholarly/auth/complete-profile');
        } else {
          // Email confirmation required, redirect to verify email page
          navigate('/scholarly/auth/verify-email');
        }
      } else {
        setErrorField('Account creation failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorField(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setErrorField('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/scholarly/auth/sign-up`,
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

  const goToSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate('/scholarly/auth/sign-in');
  };

  const passwordStrengthInfo = getPasswordStrength(formData.password);

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
              Create Account
            </h1>
            <p className='text-slate-600 dark:text-slate-400 text-sm'>
              Start your academic journey. Complete your profile after verification.
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className='w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <label htmlFor="password" className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  autoComplete="new-password"
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
              {formData.password && (
                <div className='mt-2'>
                  <div className='w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                    <div
                      className={`h-full ${passwordStrengthInfo.color} transition-all duration-300 ease-out rounded-full`}
                      style={{ width: `${passwordStrengthInfo.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className='space-y-2'>
              <label htmlFor="confirmPassword" className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                Confirm Password
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                  className='w-full h-12 px-4 pr-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className='flex items-center gap-2 text-xs text-green-600 dark:text-green-400'>
                  <CheckCircle2 className='w-4 h-4' />
                  <span className='font-medium'>Passwords match</span>
                </div>
              )}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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

            {/* Google Sign Up */}
            <button
              type='button'
              onClick={handleGoogleSignUp}
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

            {/* Sign In Link */}
            <div className='text-center pt-4'>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Already have an account?{' '}
                <button
                  onClick={goToSignIn}
                  className='text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScholarSignUp;
