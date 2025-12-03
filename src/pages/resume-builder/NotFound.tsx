import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 resume-builder-app">
      <div className="text-center max-w-md animate-fade-in">
        <Link to="/jobs/cv-builder" className="inline-flex items-center gap-2 mb-8">
          <span className="font-display text-2xl font-bold">MetaResume</span>
        </Link>
        
        <div className="mb-8">
          <h1 className="font-display text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="font-display text-2xl font-bold mb-2">Page not found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/jobs/cv-builder">
              Go Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

