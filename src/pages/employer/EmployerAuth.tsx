import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmployerAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state for sign in
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  
  // Form state for sign up
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] });
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Prevent scrolling on auth page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Determine redirect path
  const getRedirectPath = () => {
    const state = location.state as { from?: string } | null;
    if (state?.from) {
      return state.from;
    }
    return "/employer";
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) throw error;

      if (data.user) {
        // Check if employer profile exists
        const { data: employerProfile, error: profileError } = await supabase
          .from('employers' as any)
          .select('id, user_id, company_id, company_name')
          .eq('user_id', data.user.id)
          .single();

        // If profile doesn't exist, create one (shouldn't happen, but handle it)
        if (profileError || !employerProfile) {
          // Create employer profile
          const { error: createError } = await supabase
            .from('employers' as any)
            .insert([{
              user_id: data.user.id,
              company_name: data.user.user_metadata?.full_name || 'My Company',
              email: signInEmail,
              created_at: new Date().toISOString()
            }]);

          if (createError) {
            console.error("Error creating employer profile:", createError);
            // Continue anyway - profile can be created later
          }
        }

        toast.success("Welcome back! Redirecting to your dashboard...");
        const redirectPath = getRedirectPath();
        setTimeout(() => {
          navigate(redirectPath);
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) score++;
    else feedback.push("Lowercase letter");

    if (/[A-Z]/.test(password)) score++;
    else feedback.push("Uppercase letter");

    if (/[0-9]/.test(password)) score++;
    else feedback.push("Number");

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push("Special character");

    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Check for common patterns
    const commonPatterns = [
      /12345|abcde|qwerty|password|admin/i,
      /(.)\1{3,}/, // Same character repeated
      /012|abc|qwe/i
    ];

    const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
    if (hasCommonPattern && score > 0) {
      score = Math.max(0, score - 2);
      feedback.push("Avoid common patterns");
    }

    setPasswordStrength({ score, feedback });
  };

  const handlePasswordChange = (password: string) => {
    setSignUpPassword(password);
    checkPasswordStrength(password);
    if (confirmPassword) {
      setPasswordMismatch(password !== confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (confirm: string) => {
    setConfirmPassword(confirm);
    setPasswordMismatch(signUpPassword !== confirm);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return "#ff3e1d"; // Weak - red
    if (passwordStrength.score <= 4) return "#ffab00"; // Medium - orange
    if (passwordStrength.score <= 6) return "#03c3ec"; // Good - blue
    return "#71dd37"; // Strong - green
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength.score <= 2) return "Weak";
    if (passwordStrength.score <= 4) return "Medium";
    if (passwordStrength.score <= 6) return "Good";
    return "Strong";
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
    if (passwordStrength.score < 4) {
      toast.error("Password is too weak. Please use a stronger password.");
      return;
    }

    // Validate password match
    if (signUpPassword !== confirmPassword) {
      setPasswordMismatch(true);
      toast.error("Passwords do not match. Please check and try again.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            full_name: signUpName,
            user_type: 'employer'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Step 2: Create employer profile in employers table
        // This ensures new accounts get a fresh start with no existing data
        const { error: profileError } = await supabase
          .from('employers' as any)
          .insert([{
            user_id: data.user.id,
            company_name: signUpName || 'My Company',
            email: signUpEmail,
            created_at: new Date().toISOString()
          }]);

        if (profileError) {
          console.error("Error creating employer profile:", profileError);
          // If profile creation fails, still allow signup but show warning
          toast.warning("Account created, but profile setup incomplete. Please contact support.");
        } else {
          toast.success("Account created successfully! Welcome to your fresh dashboard.");
        }

        // Check if user is automatically signed in (email confirmation disabled)
        if (data.session) {
          // User is automatically signed in, redirect to dashboard
          setTimeout(() => {
            navigate("/employer");
          }, 1500);
        } else {
          // Email confirmation required
          toast.info("Please check your email to verify your account.");
          setTimeout(() => {
            navigate("/employer");
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .employer-auth-page {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #030303;
        }

         .employer-auth-shape-bg {
           position: fixed;
           inset: 0;
           width: 100%;
           height: 100%;
           overflow: hidden;
           background: #030303;
           pointer-events: none;
           z-index: 0;
         }

         .employer-auth-video {
           position: absolute;
           top: 50%;
           left: 50%;
           transform: translate(-50%, -50%) scale(1.1);
           min-width: 100%;
           min-height: 100%;
           width: auto;
           height: auto;
           object-fit: cover;
           z-index: 0;
           filter: blur(8px);
         }

         .employer-auth-video-overlay {
           position: absolute;
           inset: 0;
           background: rgba(0, 0, 0, 0.5);
           pointer-events: none;
           z-index: 1;
         }

        .employer-auth-wrapper {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: transparent;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .employer-auth-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          height: 550px;
          max-height: 90vh;
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          margin: auto;
        }

        .employer-auth-container.employer-sign-up-mode::before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .employer-auth-container::before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: 
            linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
            url('https://res.cloudinary.com/dsypclqxk/image/upload/v1756210673/team_nfbyzu.jpg') center 30%/200% 200%;
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
          opacity: 0.2;
        }

        .employer-forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .employer-signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        .employer-auth-container.employer-sign-up-mode .employer-signin-signup {
          left: 25%;
        }

        .employer-signin-signup form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 3rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
          width: 100%;
          max-width: 100%;
        }

        .employer-signin-signup form.employer-sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        .employer-signin-signup form.employer-sign-in-form {
          z-index: 2;
        }

        .employer-auth-container.employer-sign-up-mode form.employer-sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .employer-auth-container.employer-sign-up-mode form.employer-sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .employer-title {
          font-size: 2.2rem;
          color: #444;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .employer-input-field {
          max-width: 100%;
          width: 100%;
          background-color: #f0f0f0;
          margin: 10px 0;
          height: 55px;
          border-radius: 55px;
          display: grid;
          grid-template-columns: 15% 70% 15%;
          padding: 0 0.4rem;
          position: relative;
          transition: 0.3s;
          align-items: center;
        }

        .employer-input-field:focus-within {
          background-color: #e8e8e8;
          box-shadow: 0 0 0 2px hsl(220 70% 50%);
        }

        .employer-input-icon {
          text-align: center;
          color: #666;
          transition: 0.5s;
          font-size: 1.1rem;
          width: 20px;
          height: 20px;
          margin: 0 auto;
        }

        .employer-input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 1rem;
          color: #333;
          width: 100%;
        }

        .employer-input-field input::placeholder {
          color: #aaa;
          font-weight: 400;
        }

        .employer-input-field input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .employer-password-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: 0.3s;
        }

        .employer-password-toggle:hover {
          color: hsl(220 70% 50%);
        }

        .employer-password-toggle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .employer-btn {
          width: 150px;
          background-color: hsl(220 70% 50%);
          border: none;
          outline: none;
          height: 49px;
          border-radius: 49px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 600;
          margin: 10px 0;
          cursor: pointer;
          transition: 0.5s;
          font-size: 0.9rem;
        }

        .employer-btn:hover:not(:disabled) {
          background-color: hsl(220 70% 45%);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }

        .employer-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .employer-btn.employer-solid {
          width: 150px;
        }

        .employer-panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .employer-panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .employer-left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .employer-right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .employer-auth-container.employer-sign-up-mode .employer-left-panel {
          pointer-events: none;
        }

        .employer-auth-container.employer-sign-up-mode .employer-right-panel {
          pointer-events: all;
        }

        .employer-panel .employer-content {
          color: hsl(220 30% 15%);
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .employer-panel h3 {
          font-weight: 600;
          line-height: 1;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .employer-panel p {
          font-size: 0.95rem;
          padding: 0.7rem 0;
        }

        .employer-btn.employer-transparent {
          margin: 0;
          background: none;
          border: 2px solid hsl(220 30% 15%);
          width: 130px;
          height: 41px;
          font-weight: 600;
          font-size: 0.8rem;
          color: hsl(220 30% 15%);
        }

        .employer-btn.employer-transparent:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .employer-right-panel .employer-content {
          transform: translateX(800px);
        }

        .employer-auth-container.employer-sign-up-mode .employer-left-panel .employer-content {
          transform: translateX(-800px);
        }

        .employer-auth-container.employer-sign-up-mode .employer-right-panel .employer-content {
          transform: translateX(0%);
        }

        .employer-social-text {
          padding: 0.7rem 0;
          font-size: 1rem;
          color: #666;
        }

        .employer-social-media {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .employer-social-icon {
          height: 46px;
          width: 46px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 50%;
          color: hsl(220 70% 50%);
          font-size: 1.2rem;
          transition: 0.3s;
          cursor: pointer;
          text-decoration: none;
        }

        .employer-social-icon:hover {
          border-color: hsl(220 70% 45%);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .employer-social-icon svg {
          transition: 0.3s;
        }

        /* Mobile Tabs - Hidden on desktop */
        .employer-mobile-tabs {
          display: none;
        }

        @media (max-width: 870px) {
          .employer-auth-container {
            min-height: auto;
            height: auto;
            max-height: 95vh;
            width: 95%;
            border-radius: 24px 24px 0 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          /* Hide panels on mobile */
          .employer-panels-container {
            display: none;
          }

          /* Hide background image on mobile */
          .employer-auth-container::before {
            display: none;
          }

          /* Form container adjustments */
          .employer-forms-container {
            position: relative;
            height: auto;
            min-height: 0;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
          }

          .employer-signin-signup {
            position: relative;
            top: 0;
            left: 0;
            transform: none;
            width: 100%;
            transition: none;
            min-height: 100%;
          }

          .employer-auth-container.employer-sign-up-mode .employer-signin-signup {
            left: 0;
            top: 0;
            transform: none;
          }

          /* Mobile Tabs */
          .employer-mobile-tabs {
            display: flex;
            background: #f8f9fa;
            border-radius: 24px 24px 0 0;
            padding: 8px;
            gap: 8px;
            margin-bottom: 0;
            flex-shrink: 0;
          }

          .employer-mobile-tab {
            flex: 1;
            padding: 12px 20px;
            background: transparent;
            border: none;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 600;
            color: #666;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
          }

          .employer-mobile-tab.active {
            background: white;
            color: hsl(220 70% 50%);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .employer-mobile-tab:not(.active) {
            color: #999;
          }

          /* Form visibility on mobile */
          .employer-signin-signup form {
            padding: 1.5rem 1.5rem 2rem;
            opacity: 1;
            position: relative;
            z-index: 1;
            min-height: auto;
          }

          .employer-signin-signup form.employer-sign-in-form {
            display: flex;
          }

          .employer-signin-signup form.employer-sign-up-form {
            display: flex;
          }

          .employer-auth-container.employer-sign-up-mode form.employer-sign-in-form {
            display: none;
          }

          .employer-auth-container.employer-sign-up-mode form.employer-sign-up-form {
            display: flex;
          }

          .employer-auth-container:not(.employer-sign-up-mode) form.employer-sign-up-form {
            display: none;
          }

          .employer-title {
            font-size: 1.75rem;
            margin-bottom: 1.25rem;
          }

          .employer-input-field {
            margin: 10px 0;
          }

          .employer-btn {
            width: 100%;
            max-width: 300px;
            margin-top: 8px;
            margin-bottom: 8px;
          }

          .employer-social-text {
            padding: 0.5rem 0;
            font-size: 0.875rem;
          }

          .employer-social-media {
            margin-bottom: 0.5rem;
          }
        }

        @media (max-width: 570px) {
          .employer-auth-container {
            max-height: 100vh;
            width: 100%;
            border-radius: 24px 24px 0 0;
          }

          .employer-mobile-tabs {
            border-radius: 24px 24px 0 0;
          }

          .employer-signin-signup form {
            padding: 1.25rem 1.25rem 1.5rem;
          }
          .employer-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          .employer-mobile-tab {
            padding: 10px 16px;
            font-size: 0.875rem;
          }
          .employer-input-field {
            height: 50px;
            margin: 8px 0;
          }
          .employer-btn {
            height: 45px;
            font-size: 0.85rem;
            margin-top: 6px;
            margin-bottom: 6px;
          }
          .employer-social-text {
            padding: 0.4rem 0;
            font-size: 0.8rem;
          }
          .employer-social-media {
            gap: 12px;
            margin-bottom: 0.25rem;
          }
          .employer-social-icon {
            height: 42px;
            width: 42px;
          }
        }
      `}</style>

      <div className="employer-auth-page">
        <div className="employer-auth-shape-bg">
          <video
            className="employer-auth-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="https://res.cloudinary.com/dsypclqxk/video/upload/v1768931977/83bc498132dbb7ebfa6633e5d8e5080c_il7pnj.mp4" type="video/mp4" />
          </video>
          <div className="employer-auth-video-overlay"></div>
        </div>
        <div className="employer-auth-wrapper">
          <div className={`employer-auth-container ${isSignUp ? 'employer-sign-up-mode' : ''}`}>
            {/* Mobile Tabs - Only visible on mobile */}
            <div className="employer-mobile-tabs">
              <button
                type="button"
                className={`employer-mobile-tab ${!isSignUp ? 'active' : ''}`}
                onClick={() => setIsSignUp(false)}
                disabled={isLoading}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`employer-mobile-tab ${isSignUp ? 'active' : ''}`}
                onClick={() => setIsSignUp(true)}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </div>

            <div className="employer-forms-container">
              <div className="employer-signin-signup">
                {/* Sign In Form */}
                <form className="employer-sign-in-form" onSubmit={handleSignIn}>
                  <h2 className="employer-title">Sign in</h2>
                  <div className="employer-input-field">
                    <Mail className="employer-input-icon" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="employer-input-field">
                    <Lock className="employer-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="employer-password-toggle"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="employer-btn employer-solid"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Login"}
                  </button>
                  <p className="employer-social-text">Or sign in with social platforms</p>
                  <div className="employer-social-media">
                    <a href="#" className="employer-social-icon" aria-label="Sign in with Google">
                      <GoogleIcon />
                    </a>
                    <a href="#" className="employer-social-icon" aria-label="Sign in with Facebook">
                      <FacebookIcon />
                    </a>
                    <a href="#" className="employer-social-icon" aria-label="Sign in with Twitter">
                      <TwitterIcon />
                    </a>
                    <a href="#" className="employer-social-icon" aria-label="Sign in with LinkedIn">
                      <LinkedInIcon />
                    </a>
                  </div>
                </form>

                {/* Sign Up Form */}
                <form className="employer-sign-up-form" onSubmit={handleSignUp}>
                  <h2 className="employer-title">Sign up</h2>
                  <div className="employer-input-field">
                    <User className="employer-input-icon" />
                    <input
                      type="text"
                      placeholder="Company/Full Name"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="employer-input-field">
                    <Mail className="employer-input-icon" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="employer-input-field">
                    <Lock className="employer-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signUpPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="employer-password-toggle"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {signUpPassword && (
                    <div className="employer-password-strength" style={{
                      width: '100%',
                      marginTop: '4px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        height: '4px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${(passwordStrength.score / 7) * 100}%`,
                          backgroundColor: getPasswordStrengthColor(),
                          transition: 'all 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  )}
                  <div className="employer-input-field" style={{
                    borderColor: passwordMismatch ? '#ff3e1d' : undefined,
                    borderWidth: passwordMismatch ? '2px' : undefined
                  }}>
                    <Lock className="employer-input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      required
                      disabled={isLoading}
                      style={{
                        border: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="employer-password-toggle"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordMismatch && confirmPassword && (
                    <div style={{
                      color: '#ff3e1d',
                      fontSize: '0.75rem',
                      marginTop: '-8px',
                      marginBottom: '8px',
                      paddingLeft: '4px'
                    }}>
                      Passwords do not match
                    </div>
                  )}
                  <button
                    type="submit"
                    className="employer-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign up"}
                  </button>
                  <p className="employer-social-text">Or sign up with social platforms</p>
                  <div className="employer-social-media">
                    <a href="#" className="employer-social-icon" aria-label="Sign up with Google">
                      <GoogleIcon />
                    </a>
                    <a href="#" className="employer-social-icon" aria-label="Sign up with Facebook">
                      <FacebookIcon />
                    </a>
                    <a href="#" className="employer-social-icon" aria-label="Sign up with Twitter">
                      <TwitterIcon />
                    </a>
                    <a href="#" className="employer-social-icon" aria-label="Sign up with LinkedIn">
                      <LinkedInIcon />
                    </a>
                  </div>
                </form>
              </div>
            </div>

            <div className="employer-panels-container">
              <div className="employer-panel employer-left-panel">
                <div className="employer-content">
                  <h3>New employer?</h3>
                  <p>
                    Join us today and start hiring the best talent. Create your employer account in seconds!
                  </p>
                  <button
                    className="employer-btn employer-transparent"
                    onClick={() => setIsSignUp(true)}
                    disabled={isLoading}
                    type="button"
                  >
                    Sign up
                  </button>
                </div>
              </div>

              <div className="employer-panel employer-right-panel">
                <div className="employer-content">
                  <h3>Already registered?</h3>
                  <p>Welcome back! Sign in to access your employer dashboard.</p>
                  <button
                    className="employer-btn employer-transparent"
                    onClick={() => setIsSignUp(false)}
                    disabled={isLoading}
                    type="button"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Social Icon Components
function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default EmployerAuth;
