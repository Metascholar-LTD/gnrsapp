import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthSwitch } from "@/components/ui/auth-switch";
import { useToast } from "@/hooks/use-toast";
import { ShapeBackground } from "@/components/ui/shape-landing-hero";

const Join = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent scrolling on auth page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Determine redirect path based on where user came from
  const getRedirectPath = () => {
    const state = location.state as { from?: string } | null;
    if (state?.from) {
      return state.from;
    }
    // Default redirect based on referrer or default to home
    return "/";
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    // TODO: Replace with actual authentication API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      const redirectPath = getRedirectPath();
      navigate(redirectPath);
    }, 1500);
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // TODO: Replace with actual authentication API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome! Your account has been created successfully.",
      });
      const redirectPath = getRedirectPath();
      navigate(redirectPath);
    }, 1500);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <ShapeBackground />
      <div style={{ position: "relative", zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AuthSwitch
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          defaultMode="signup"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Join;

