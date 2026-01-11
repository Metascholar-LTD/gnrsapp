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
  const [signUpUser, setSignUpUser] = useState({ name: '', email: '', password: '' });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  
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
    setSignUpUser({ ...signUpUser, [e.target.name]: e.target.value });
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
      background-color: #ffffff;
      padding: 1.25rem;
      width: 100%;
      max-width: 380px;
      border-radius: 24px;
      box-shadow: none;
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
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    #admin-auth-subtitle {
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
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
      border: none;
      border-radius: 0.375rem;
      background-color: #f3f4f6;
      font-size: 0.875rem;
      color: #111827;
      transition: background-color 0.2s;
    }

    .admin-auth-input:focus {
      outline: none;
      background-color: #e5e7eb;
    }

    .admin-auth-input::placeholder {
      color: #9ca3af;
    }

    .admin-auth-input-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #6b7280;
      pointer-events: none;
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
      color: #6b7280;
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
      color: #374151;
      cursor: pointer;
    }

    .admin-auth-checkbox {
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: #2563eb;
    }

    .admin-auth-forgot-link {
      font-size: 0.875rem;
      color: #2563eb;
      text-decoration: none;
    }

    .admin-auth-forgot-link:hover {
      text-decoration: underline;
    }

    .admin-auth-submit-btn {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 0.375rem;
      background-color: #2563eb;
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-top: 0.5rem;
    }

    .admin-auth-submit-btn:hover:not(:disabled) {
      background-color: #1d4ed8;
    }

    .admin-auth-submit-btn:active:not(:disabled) {
      background-color: #1e40af;
    }

    .admin-auth-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    #admin-auth-switch-link {
      margin-top: 2.5rem;
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
      letter-spacing: 0.025em;
    }

    .admin-auth-switch-link {
      color: #2563eb;
      text-decoration: none;
      margin-left: 0.25rem;
      cursor: pointer;
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
      <Link to="/" id="admin-auth-logo">
        <img 
          src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944554/Of_Participation_-_1_-_Edited_l53t4f.png" 
          alt="GNRS Logo" 
          id="admin-auth-logo-img"
        />
      </Link>
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
  );
};

export default AdminAuth;
