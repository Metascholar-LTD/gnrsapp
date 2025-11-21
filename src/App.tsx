import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TwentyFirstToolbar } from "@21st-extension/toolbar-react";
import { ReactPlugin } from "@21st-extension/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PastQuestions from "./pages/PastQuestions";
import LectureNotes from "./pages/LectureNotes";
import TrialQuestions from "./pages/TrialQuestions";
import ScholarshipHub from "./pages/Scholarship-Hub";
import ScholarshipView from "./pages/ScholarshipView";
import BrowseJobs from "./pages/BrowseJobs";
import AllJobs from "./pages/AllJobs";
import JobDetails from "./pages/JobDetails";
import CompanyDetails from "./pages/CompanyDetails";

const queryClient = new QueryClient();

// React Router future flags to suppress deprecation warnings
const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />
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
          <Route path="/jobs/browse" element={<BrowseJobs />} />
          <Route path="/jobs/all" element={<AllJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies/:name" element={<CompanyDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
