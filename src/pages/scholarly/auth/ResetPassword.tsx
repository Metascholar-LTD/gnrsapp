// ============================================================================
// PASSWORD RESET PAGE
// ============================================================================
// Elegant password reset flow for scholars
// ============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// No Navigation or Footer on auth pages - full screen experience
import {
  GraduationCap,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = `
    .sr-auth-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: fixed;
      inset: 0;
      overflow-y: auto;
    }

    .sr-auth-container {
      width: 100%;
      max-width: 440px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sr-auth-card {
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 16px;
      padding: 48px 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 640px) {
      .sr-auth-card {
        padding: 32px 24px;
      }
    }

    .sr-auth-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .sr-auth-header__icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(30, 58, 95, 0.08);
      border-radius: 12px;
      color: #1E3A5F;
      margin: 0 auto 20px;
    }

    .sr-auth-header__icon--success {
      background: rgba(45, 90, 71, 0.1);
      color: #2D5A47;
    }

    .sr-auth-header__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .sr-auth-header__subtitle {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      margin: 0;
      line-height: 1.6;
    }

    .sr-auth-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .sr-auth-form__group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sr-auth-form__label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
    }

    .sr-auth-form__input-wrapper {
      position: relative;
    }

    .sr-auth-form__input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      transition: all 0.2s ease;
    }

    .sr-auth-form__input:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-auth-form__input--error {
      border-color: #7C2D36;
    }

    .sr-auth-form__input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #A8A29E;
      pointer-events: none;
    }

    .sr-auth-form__input--with-icon {
      padding-left: 44px;
    }

    .sr-auth-form__error {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #7C2D36;
      margin-top: 4px;
    }

    .sr-auth-form__submit {
      width: 100%;
      padding: 14px 24px;
      background: #1E3A5F;
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 8px;
    }

    .sr-auth-form__submit:hover:not(:disabled) {
      background: #2D4A6F;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.2);
    }

    .sr-auth-form__submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .sr-auth-success {
      text-align: center;
      padding: 24px 0;
    }

    .sr-auth-success__message {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }

    .sr-auth-success__email {
      font-weight: 600;
      color: #1C1917;
    }

    .sr-auth-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1E3A5F;
      text-decoration: none;
      margin-bottom: 24px;
      transition: color 0.15s ease;
    }

    .sr-auth-back:hover {
      color: #2D4A6F;
    }

    .sr-auth-footer {
      text-align: center;
      margin-top: 32px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
    }

    .sr-auth-footer__link {
      color: #1E3A5F;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.15s ease;
    }

    .sr-auth-footer__link:hover {
      color: #2D4A6F;
      text-decoration: underline;
    }
  `;

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      <>
        <style>{styles}</style>
        <div className="sr-auth-page">
          <div className="sr-auth-container">
            <div className="sr-auth-card">
              <div className="sr-auth-header">
                <div className="sr-auth-header__icon sr-auth-header__icon--success">
                  <CheckCircle2 size={32} />
                </div>
                <h1 className="sr-auth-header__title">Check Your Email</h1>
                <p className="sr-auth-header__subtitle">
                  We've sent password reset instructions to your email address
                </p>
              </div>

              <div className="sr-auth-success">
                <p className="sr-auth-success__message">
                  If an account exists for <span className="sr-auth-success__email">{email}</span>, you will receive password reset instructions shortly.
                </p>
                <p className="sr-auth-success__message" style={{ fontSize: '0.875rem', color: '#78716C' }}>
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="sr-auth-footer">
                <Link to="/scholarly/auth/sign-in" className="sr-auth-footer__link">
                  <ArrowLeft size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="sr-auth-page">
        <div className="sr-auth-container">
          <div className="sr-auth-card">
            <Link to="/scholarly/auth/sign-in" className="sr-auth-back">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>

            <div className="sr-auth-header">
              <div className="sr-auth-header__icon">
                <GraduationCap size={32} />
              </div>
              <h1 className="sr-auth-header__title">Reset Password</h1>
              <p className="sr-auth-header__subtitle">
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </div>

            <form className="sr-auth-form" onSubmit={handleSubmit}>
              <div className="sr-auth-form__group">
                <label className="sr-auth-form__label">Email Address</label>
                <div className="sr-auth-form__input-wrapper">
                  <Mail size={18} className="sr-auth-form__input-icon" />
                  <input
                    type="email"
                    className={`sr-auth-form__input sr-auth-form__input--with-icon ${error ? 'sr-auth-form__input--error' : ''}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="john.doe@university.edu"
                  />
                </div>
                {error && (
                  <div className="sr-auth-form__error">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="sr-auth-form__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>

            <div className="sr-auth-footer">
              Remember your password?{' '}
              <Link to="/scholarly/auth/sign-in" className="sr-auth-footer__link">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
