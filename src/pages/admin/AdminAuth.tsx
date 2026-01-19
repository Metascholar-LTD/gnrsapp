import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useToast } from '@/hooks/use-toast';

const AdminAuth = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/admin/sign-up');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Form state for sign in
  const [signInUser, setSignInUser] = useState({ email: '', password: '' });
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  
  // Form state for sign up
  const [signUpUser, setSignUpUser] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update mode when URL changes (for direct navigation)
  useEffect(() => {
    setIsSignUp(location.pathname === '/admin/sign-up');
  }, [location.pathname]);

  // Prevent scrolling on auth page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSignInInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignInUser({ ...signInUser, [e.target.name]: e.target.value });
  };

  const handleSignUpInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpUser({ ...signUpUser, [name]: value });
    
    // Clear password match error when user types
    if (passwordMatchError) {
      setPasswordMatchError('');
    }
    
    // Real-time password match validation
    if (name === 'confirmPassword') {
      if (value && value !== signUpUser.password) {
        setPasswordMatchError('Passwords do not match');
      } else if (value && value === signUpUser.password) {
        setPasswordMatchError('');
      }
    } else if (name === 'password' && signUpUser.confirmPassword) {
      if (value !== signUpUser.confirmPassword) {
        setPasswordMatchError('Passwords do not match');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Replace with actual authentication API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate('/admin');
    }, 1500);
  };

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate password match
    if (signUpUser.password !== signUpUser.confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      toast({
        title: "Validation Error",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // TODO: Replace with actual authentication API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome! Your account has been created successfully.",
      });
      navigate('/admin');
    }, 1500);
  };

  const switchToSignUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isSignUp) return; // Already on sign up
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignUp(true);
      // Update URL without navigation
      window.history.replaceState({}, '', '/admin/sign-up');
      setTimeout(() => setIsAnimating(false), 10);
    }, 150);
  };

  const switchToSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isSignUp) return; // Already on sign in
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignUp(false);
      // Reset sign up form state
      setSignUpUser({ name: '', email: '', password: '', confirmPassword: '' });
      setPasswordMatchError('');
      // Update URL without navigation
      window.history.replaceState({}, '', '/admin/sign-in');
      setTimeout(() => setIsAnimating(false), 10);
    }, 150);
  };

  const isolatedStyles = `
    #admin-auth-wrapper {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      padding-top: 3.5rem;
      padding-bottom: 3.5rem;
      position: relative;
      overflow: hidden;
    }

    #admin-auth-video-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
      filter: blur(8px);
      transform: scale(1.1);
    }

    #admin-auth-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    #admin-auth-content {
      position: relative;
      z-index: 2;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #admin-auth-logo {
      position: absolute;
      top: 24px;
      left: 24px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #111827;
      z-index: 3;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    #admin-auth-logo:hover {
      opacity: 0.8;
    }

    #admin-auth-logo-img {
      height: 50px;
      width: auto;
      max-width: 200px;
    }

    #admin-auth-paper {
      background: rgba(30, 41, 59, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 2rem;
      width: 100%;
      max-width: 380px;
      border-radius: 24px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }

    .admin-auth-form-container {
      position: relative;
    }

    .admin-auth-form-content {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .admin-auth-form-content.animating {
      opacity: 0;
      transform: translateY(-10px);
    }

    .admin-auth-form-content:not(.animating) {
      opacity: 1;
      transform: translateY(0);
      animation: fadeInUp 0.4s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    #admin-auth-title {
      text-align: center;
      font-size: 1.875rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }

    #admin-auth-subtitle {
      text-align: center;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0.5rem 0 1.5rem 0;
    }

    #admin-auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .admin-auth-input-wrapper {
      position: relative;
      width: 100%;
    }

    .admin-auth-input {
      width: 100%;
      padding: 0.875rem 0.875rem 0.875rem 2.75rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.5rem;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      font-size: 0.875rem;
      color: #ffffff;
      transition: all 0.2s ease;
    }

    .admin-auth-input:focus {
      outline: none;
      background-color: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
    }

    .admin-auth-input--error {
      border-color: rgba(239, 68, 68, 0.6) !important;
      background-color: rgba(239, 68, 68, 0.1) !important;
    }

    .admin-auth-input--error:focus {
      border-color: rgba(239, 68, 68, 0.8) !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
    }

    .admin-auth-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
      opacity: 1;
    }

    .admin-auth-input:-webkit-autofill,
    .admin-auth-input:-webkit-autofill:hover,
    .admin-auth-input:-webkit-autofill:focus {
      -webkit-text-fill-color: #ffffff;
      -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset;
      transition: background-color 5000s ease-in-out 0s;
    }

    .admin-auth-input-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: rgba(255, 255, 255, 0.6);
      pointer-events: none;
      transition: color 0.2s ease;
    }

    .admin-auth-input-wrapper:focus-within .admin-auth-input-icon {
      color: rgba(255, 255, 255, 0.9);
    }

    .admin-auth-password-toggle {
      position: absolute;
      right: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    .admin-auth-password-toggle.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .admin-auth-password-toggle-icon {
      width: 18px;
      height: 18px;
      color: rgba(255, 255, 255, 0.6);
      transition: color 0.2s ease;
    }

    .admin-auth-password-toggle:hover .admin-auth-password-toggle-icon {
      color: rgba(255, 255, 255, 0.9);
    }

    .admin-auth-remember-forgot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: -0.5rem;
      margin-bottom: 0.5rem;
    }

    .admin-auth-remember-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
    }

    .admin-auth-checkbox {
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: #2563eb;
      filter: brightness(1.2);
    }

    .admin-auth-error-message {
      margin-top: -0.5rem;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      background-color: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      color: #fca5a5;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .admin-auth-forgot-link {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .admin-auth-forgot-link:hover {
      text-decoration: underline;
    }

    .admin-auth-submit-btn {
      width: 100%;
      padding: 0.875rem 1rem;
      border: none;
      border-radius: 0.5rem;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }

    .admin-auth-submit-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.4);
    }

    .admin-auth-submit-btn:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    }

    .admin-auth-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    #admin-auth-switch-link {
      margin-top: 2.5rem;
      text-align: center;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: 0.025em;
    }

    .admin-auth-switch-link {
      color: rgba(255, 255, 255, 0.95);
      text-decoration: none;
      margin-left: 0.25rem;
      cursor: pointer;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .admin-auth-switch-link:hover {
      text-decoration: underline;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      #admin-auth-wrapper {
        padding: 0.5rem;
        padding-top: 3rem;
        padding-bottom: 3rem;
      }

      #admin-auth-logo {
        top: 16px;
        left: 16px;
      }

      #admin-auth-logo-img {
        height: 40px;
      }

      #admin-auth-paper {
        padding: 1.25rem;
      }
    }
  `;

  return (
    <div id="admin-auth-wrapper">
      <style>{isolatedStyles}</style>
      <video
        id="admin-auth-video-background"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://res.cloudinary.com/dsypclqxk/video/upload/v1768821020/19264a464315513c06c2dc242649e340_w36wot.mp4" type="video/mp4" />
      </video>
      <div id="admin-auth-overlay"></div>
      <Link to="/" id="admin-auth-logo">
        <img 
          src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944554/Of_Participation_-_1_-_Edited_l53t4f.png" 
          alt="GNRS Logo" 
          id="admin-auth-logo-img"
        />
      </Link>
      <div id="admin-auth-content">
        <div id="admin-auth-paper">
        <div className="admin-auth-form-container">
          <div className={`admin-auth-form-content ${isAnimating ? 'animating' : ''}`} key={isSignUp ? 'signup' : 'signin'}>
          {isSignUp ? (
            <>
              <h1 id="admin-auth-title">Sign Up</h1>
              <p id="admin-auth-subtitle">Let's Join us! Create your account.</p>

              <form id="admin-auth-form" onSubmit={handleSignUpSubmit}>
                <div className="admin-auth-input-wrapper">
                  <Icon 
                    icon="hugeicons:user-circle-02" 
                    className="admin-auth-input-icon" 
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={signUpUser.name}
                    onChange={handleSignUpInputChange}
                    className="admin-auth-input"
                    placeholder="Your Name"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="admin-auth-input-wrapper">
                  <Icon 
                    icon="hugeicons:mail-at-sign-02" 
                    className="admin-auth-input-icon" 
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={signUpUser.email}
                    onChange={handleSignUpInputChange}
                    className="admin-auth-input"
                    placeholder="Your Email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="admin-auth-input-wrapper">
                  <Icon 
                    icon="hugeicons:lock-key" 
                    className="admin-auth-input-icon" 
                  />
                  <input
                    id="password"
                    name="password"
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={signUpUser.password}
                    onChange={handleSignUpInputChange}
                    className="admin-auth-input"
                    placeholder="Your Password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className={`admin-auth-password-toggle ${signUpUser.password ? 'visible' : ''}`}
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    aria-label="toggle password visibility"
                  >
                    <Icon
                      icon={showSignUpPassword ? 'fluent-mdl2:view' : 'fluent-mdl2:hide-3'}
                      className="admin-auth-password-toggle-icon"
                    />
                  </button>
                </div>
                <div className="admin-auth-input-wrapper">
                  <Icon 
                    icon="hugeicons:lock-key" 
                    className="admin-auth-input-icon" 
                  />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signUpUser.confirmPassword}
                    onChange={handleSignUpInputChange}
                    className={`admin-auth-input ${passwordMatchError ? 'admin-auth-input--error' : ''}`}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className={`admin-auth-password-toggle ${signUpUser.confirmPassword ? 'visible' : ''}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="toggle password visibility"
                  >
                    <Icon
                      icon={showConfirmPassword ? 'fluent-mdl2:view' : 'fluent-mdl2:hide-3'}
                      className="admin-auth-password-toggle-icon"
                    />
                  </button>
                </div>
                {passwordMatchError && (
                  <div className="admin-auth-error-message">
                    {passwordMatchError}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="admin-auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>

              <p id="admin-auth-switch-link">
                Already have an account?{' '}
                <a onClick={switchToSignIn} className="admin-auth-switch-link">
                  Signin
                </a>
              </p>
            </>
          ) : (
            <>
              <h1 id="admin-auth-title">Sign In</h1>
              <p id="admin-auth-subtitle">Welcome back! Let's continue.</p>

              <form id="admin-auth-form" onSubmit={handleSignInSubmit}>
                <div className="admin-auth-input-wrapper">
                  <Icon 
                    icon="hugeicons:mail-at-sign-02" 
                    className="admin-auth-input-icon" 
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={signInUser.email}
                    onChange={handleSignInInputChange}
                    className="admin-auth-input"
                    placeholder="Your Email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="admin-auth-input-wrapper">
                  <Icon 
                    icon="hugeicons:lock-key" 
                    className="admin-auth-input-icon" 
                  />
                  <input
                    id="password"
                    name="password"
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInUser.password}
                    onChange={handleSignInInputChange}
                    className="admin-auth-input"
                    placeholder="Your Password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className={`admin-auth-password-toggle ${signInUser.password ? 'visible' : ''}`}
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    aria-label="toggle password visibility"
                  >
                    <Icon
                      icon={showSignInPassword ? 'fluent-mdl2:view' : 'fluent-mdl2:hide-3'}
                      className="admin-auth-password-toggle-icon"
                    />
                  </button>
                </div>

                <div className="admin-auth-remember-forgot">
                  <label className="admin-auth-remember-label">
                    <input
                      type="checkbox"
                      id="checkbox"
                      name="checkbox"
                      className="admin-auth-checkbox"
                    />
                    Remember me
                  </label>
                  <a href="#!" className="admin-auth-forgot-link">
                    Forgot password?
                  </a>
                </div>

                <button 
                  type="submit" 
                  className="admin-auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p id="admin-auth-switch-link">
                Don't have an account?{' '}
                <a onClick={switchToSignUp} className="admin-auth-switch-link">
                  Signup
                </a>
              </p>
            </>
          )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminAuth;
