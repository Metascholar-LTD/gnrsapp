import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PastQuestions from "./pages/PastQuestions";
import LectureNotes from "./pages/LectureNotes";
import TrialQuestions from "./pages/TrialQuestions";
import ScholarshipHub from "./pages/Scholarship-Hub";
import ScholarshipView from "./pages/ScholarshipView";
import JobListings from "./pages/jobs/JobListings";
import JobDetails from "./pages/jobs/JobDetails";
import PostJob from "./pages/jobs/PostJob";
import FindTalent from "./pages/jobs/FindTalent";
import CareerResources from "./pages/jobs/CareerResources";
import ProfessionalDevelopment from "./pages/jobs/ProfessionalDevelopment";

const queryClient = new QueryClient();

// React Router future flags to suppress deprecation warnings
const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={routerFutureFlags}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/education/past-questions" element={<PastQuestions />} />
          <Route path="/education/lecture-notes" element={<LectureNotes />} />
          <Route path="/education/trial-questions" element={<TrialQuestions />} />
          <Route path="/scholarship-hub" element={<ScholarshipHub />} />
          <Route path="/scholarship/:id" element={<ScholarshipView />} />
          {/* Jobs Routes */}
          <Route path="/jobs/listings" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/post-job" element={<PostJob />} />
          <Route path="/jobs/find-talent" element={<FindTalent />} />
          <Route path="/jobs/career-resources" element={<CareerResources />} />
          <Route path="/jobs/professional-development" element={<ProfessionalDevelopment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
