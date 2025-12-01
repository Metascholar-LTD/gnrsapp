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
import ScholarshipHub from "./pages/scholarship/ScholarshipHub";
import ScholarshipView from "./pages/scholarship/ScholarshipView";
import FieldBasedScholarships from "./pages/scholarship/FieldBasedScholarships";
import GetFundScholarships from "./pages/scholarship/GetFundScholarships";
import GnpcScholarships from "./pages/scholarship/GnpcScholarships";
import MtnScholarships from "./pages/scholarship/MtnScholarships";
import BrowseJobs from "./pages/BrowseJobs";
import AllJobs from "./pages/AllJobs";
import JobDetails from "./pages/JobDetails";
import CompanyDetails from "./pages/CompanyDetails";
import ShsBeceQuestions from "./pages/education/ShsBeceQuestions";
import StudyGuides from "./pages/education/StudyGuides";
import Ebooks from "./pages/education/Ebooks";
import CourseRecommendations from "./pages/education/CourseRecommendations";
import DepartmentalResources from "./pages/education/DepartmentalResources";
import ResearchTools from "./pages/education/ResearchTools";
import InternshipGuidance from "./pages/education/InternshipGuidance";
import DiscussionForums from "./pages/education/DiscussionForums";
import StudyGroups from "./pages/education/StudyGroups";
import AlumniConnect from "./pages/education/AlumniConnect";
import Mentorship from "./pages/education/Mentorship";
import CampusAnnouncements from "./pages/education/CampusAnnouncements";
import AcademicNotifications from "./pages/education/AcademicNotifications";
import CgpaCalculator from "./pages/education/CgpaCalculator";
import TimetableBuilder from "./pages/education/TimetableBuilder";
import AiTutor from "./pages/education/AiTutor";
import MyResources from "./pages/education/MyResources";
import LearningPath from "./pages/education/LearningPath";

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
          <Route path="/education/shs-bece-questions" element={<ShsBeceQuestions />} />
          <Route path="/education/lecture-notes" element={<LectureNotes />} />
          <Route path="/education/trial-questions" element={<TrialQuestions />} />
          <Route path="/education/study-guides" element={<StudyGuides />} />
          <Route path="/education/ebooks" element={<Ebooks />} />
          <Route path="/education/course-recommendations" element={<CourseRecommendations />} />
          <Route path="/education/departmental-resources" element={<DepartmentalResources />} />
          <Route path="/education/research-tools" element={<ResearchTools />} />
          <Route path="/education/internship-guidance" element={<InternshipGuidance />} />
          <Route path="/education/discussion-forums" element={<DiscussionForums />} />
          <Route path="/education/study-groups" element={<StudyGroups />} />
          <Route path="/education/alumni-connect" element={<AlumniConnect />} />
          <Route path="/education/mentorship" element={<Mentorship />} />
          <Route path="/education/campus-announcements" element={<CampusAnnouncements />} />
          <Route path="/education/academic-notifications" element={<AcademicNotifications />} />
          <Route path="/education/cgpa-calculator" element={<CgpaCalculator />} />
          <Route path="/education/timetable-builder" element={<TimetableBuilder />} />
          <Route path="/education/ai-tutor" element={<AiTutor />} />
          <Route path="/education/my-resources" element={<MyResources />} />
          <Route path="/education/learning-path" element={<LearningPath />} />
          <Route path="/scholarship-hub/field-based" element={<FieldBasedScholarships />} />
          <Route path="/scholarship-hub/getfund" element={<GetFundScholarships />} />
          <Route path="/scholarship-hub/gnpc" element={<GnpcScholarships />} />
          <Route path="/scholarship-hub/mtn" element={<MtnScholarships />} />
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
