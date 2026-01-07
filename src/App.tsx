import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIAssistant } from "@/components/AIAssistant";
import { PageLoader } from "@/components/PageLoader";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PastQuestions from "./pages/PastQuestions";
import LectureNotes from "./pages/LectureNotes";
import LectureNoteViewer from "./pages/LectureNoteViewer";
import UploadLectureNote from "./pages/UploadLectureNote";
import TrialQuestions from "./pages/TrialQuestions";
import TrialQuestionDetail from "./pages/TrialQuestionDetail";
import ScholarshipHub from "./pages/scholarship/ScholarshipHub";
import ScholarshipView from "./pages/scholarship/ScholarshipView";
import FieldBasedScholarships from "./pages/scholarship/FieldBasedScholarships";
import GetFundScholarships from "./pages/scholarship/GetFundScholarships";
import GnpcScholarships from "./pages/scholarship/GnpcScholarships";
import MtnScholarships from "./pages/scholarship/MtnScholarships";
import OtherLocalScholarships from "./pages/scholarship/OtherLocalScholarships";
import BrowseJobs from "./pages/BrowseJobs";
import AllJobs from "./pages/AllJobs";
import JobDetails from "./pages/JobDetails";
import CompanyDetails from "./pages/CompanyDetails";
import InternshipListings from "./pages/jobs/InternshipListings";
import NationalServiceSupport from "./pages/jobs/NationalServiceSupport";
import GraduateRecruitment from "./pages/jobs/GraduateRecruitment";
import YouthEmploymentAgency from "./pages/jobs/YouthEmploymentAgency";
import ShsBeceQuestions from "./pages/education/ShsBeceQuestions";
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
import ResumeBuilderIndex from "./pages/resume-builder/Index";
import ResumeBuilderBuilder from "./pages/resume-builder/Builder";
import ResumeBuilderTemplates from "./pages/resume-builder/Templates";
import ResumeBuilderAbout from "./pages/resume-builder/About";
import ResumeBuilderLogin from "./pages/resume-builder/Login";
import ResumeBuilderSignup from "./pages/resume-builder/Signup";
import ResumeBuilderNotFound from "./pages/resume-builder/NotFound";
import Join from "./pages/Join";
import SkilledWorkers from "./pages/SkilledWorkers";
import SkilledWorkersBrowse from "./pages/SkilledWorkersBrowse";
import SkilledWorkersJoin from "./pages/SkilledWorkersJoin";
import { SkilledWorkerProfile } from "./pages/SkilledWorkerProfile";
import { SkilledWorkersList } from "./pages/SkilledWorkersList";
import Directories from "./pages/Directories";
import Hotels from "./pages/directories/Hotels";
import HotelView from "./pages/directories/HotelView";
import Universities from "./pages/directories/Universities";
import UniversityView from "./pages/directories/UniversityView";
import SeniorHighSchools from "./pages/directories/SeniorHighSchools";
import SeniorHighSchoolView from "./pages/directories/SeniorHighSchoolView";
import Restaurants from "./pages/directories/Restaurants";
import RestaurantView from "./pages/directories/RestaurantView";
import WriteReview from "./pages/directories/WriteReview";
import Hospitals from "./pages/directories/Hospitals";
import HospitalView from "./pages/directories/HospitalView";
import HospitalCategories from "./pages/directories/HospitalCategories";
import ListFacility from "./pages/directories/ListFacility";
import AllHospitals from "./pages/directories/AllHospitals";
import Banks from "./pages/directories/Banks";
import Datasets from "./pages/directories/Datasets";
import DatasetCategory from "./pages/directories/DatasetCategory";
import NewsHub from "./pages/news/NewsHub";
import NewsArticle from "./pages/news/NewsArticle";
import InfoHub from "./pages/info/InfoHub";
import GettingStarted from "./pages/info/GettingStarted";
import EducationResources from "./pages/info/EducationResources";
import JobPortal from "./pages/info/JobPortal";
import InfoDirectories from "./pages/info/Directories";
import FAQs from "./pages/info/FAQs";
import FastExecutions from "./pages/info/FastExecutions";
import GuideSupport from "./pages/info/GuideSupport";
import FinancialSecure from "./pages/info/FinancialSecure";
import "./pages/resume-builder/resume-builder.css";
import AdminLayout from "./pages/admin/components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminFAQsPage from "./pages/admin/adminInfo/AdminFAQsPage";
import AdminEducationHub from "./pages/admin/AdminEducationHub";
import AdminScholarshipHub from "./pages/admin/AdminScholarshipHub";
import AdminUniversities from "./pages/admin/AdminUniversities";
import AdminTrialQuestionManage from "./pages/admin/components/AdminTrialQuestionManage";
import AdminJobsHub from "./pages/admin/AdminJobsHub";

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
        <PageLoader />
        <AIAssistant />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/education/past-questions" element={<PastQuestions />} />
          <Route path="/education/shs-bece-questions" element={<ShsBeceQuestions />} />
          <Route path="/education/lecture-notes" element={<LectureNotes />} />
          <Route path="/education/lecture-notes/upload" element={<UploadLectureNote />} />
          <Route path="/education/lecture-notes/:id" element={<LectureNoteViewer />} />
          <Route path="/education/trial-questions" element={<TrialQuestions />} />
          <Route path="/education/trial-questions/:id" element={<TrialQuestionDetail />} />
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
          <Route path="/scholarship-hub/other-local" element={<OtherLocalScholarships />} />
          <Route path="/scholarship-hub" element={<ScholarshipHub />} />
          <Route path="/scholarship/:id" element={<ScholarshipView />} />
          <Route path="/jobs/browse" element={<BrowseJobs />} />
          <Route path="/jobs/all" element={<AllJobs />} />
          <Route path="/jobs/internships" element={<InternshipListings />} />
          <Route path="/jobs/nss" element={<NationalServiceSupport />} />
          <Route path="/jobs/graduate-recruitment" element={<GraduateRecruitment />} />
          <Route path="/jobs/yea-jobs" element={<YouthEmploymentAgency />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies/:name" element={<CompanyDetails />} />
          {/* Skilled Workers Directory */}
          <Route path="/skilled-workers" element={<SkilledWorkers />} />
          <Route path="/skilled-workers/browse" element={<SkilledWorkersBrowse />} />
          <Route path="/skilled-workers/join" element={<SkilledWorkersJoin />} />
          <Route path="/skilled-workers/category/:category" element={<SkilledWorkersList />} />
          <Route path="/skilled-workers/profile/:id" element={<SkilledWorkerProfile />} />
          {/* Directories Routes */}
          <Route path="/directories" element={<Directories />} />
          <Route path="/directories/hotels" element={<Hotels />} />
          <Route path="/directories/hotels/:id" element={<HotelView />} />
          <Route path="/directories/universities" element={<Universities />} />
          <Route path="/directories/universities/:id" element={<UniversityView />} />
          <Route path="/directories/shs" element={<SeniorHighSchools />} />
          <Route path="/directories/shs/:id" element={<SeniorHighSchoolView />} />
          <Route path="/directories/restaurants" element={<Restaurants />} />
          <Route path="/directories/restaurants/:id" element={<RestaurantView />} />
          <Route path="/directories/restaurants/:id/write-review" element={<WriteReview />} />
          <Route path="/directories/hospitals" element={<Hospitals />} />
          <Route path="/directories/hospitals/all" element={<AllHospitals />} />
          <Route path="/directories/hospitals/:id" element={<HospitalView />} />
          <Route path="/directories/hospitals/categories" element={<HospitalCategories />} />
          <Route path="/directories/hospitals/list-facility" element={<ListFacility />} />
          <Route path="/directories/banks" element={<Banks />} />
          <Route path="/directories/datasets" element={<Datasets />} />
          <Route path="/directories/datasets/:category" element={<DatasetCategory />} />
          {/* News Routes */}
          <Route path="/news" element={<NewsHub />} />
          <Route path="/news/:id" element={<NewsArticle />} />
          {/* Info Routes */}
          <Route path="/info" element={<InfoHub />} />
          <Route path="/info/getting-started" element={<GettingStarted />} />
          <Route path="/info/education" element={<EducationResources />} />
          <Route path="/info/jobs" element={<JobPortal />} />
          <Route path="/info/directories" element={<InfoDirectories />} />
          <Route path="/info/faqs" element={<FAQs />} />
          <Route path="/info/fast-executions" element={<FastExecutions />} />
          <Route path="/info/guide-support" element={<GuideSupport />} />
          <Route path="/info/financial-secure" element={<FinancialSecure />} />
          {/* Auth Routes */}
          <Route path="/join" element={<Join />} />
          {/* Resume Builder Routes */}
          <Route path="/jobs/cv-builder" element={<ResumeBuilderIndex />} />
          <Route path="/jobs/cv-builder/builder" element={<ResumeBuilderBuilder />} />
          <Route path="/jobs/cv-builder/templates" element={<ResumeBuilderTemplates />} />
          <Route path="/jobs/cv-builder/about" element={<ResumeBuilderAbout />} />
          <Route path="/jobs/cv-builder/login" element={<ResumeBuilderLogin />} />
          <Route path="/jobs/cv-builder/signup" element={<ResumeBuilderSignup />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="profile" element={<AdminDashboard />} />
            <Route path="sign-in" element={<AdminDashboard />} />
            <Route path="sign-up" element={<AdminDashboard />} />
            <Route path="blank" element={<AdminDashboard />} />
            <Route path="news" element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobsHub />} />
            <Route path="jobs/all" element={<AdminJobsHub />} />
            <Route path="jobs/internships" element={<AdminJobsHub />} />
            <Route path="jobs/nss" element={<AdminJobsHub />} />
            <Route path="jobs/graduate-recruitment" element={<AdminJobsHub />} />
            <Route path="jobs/yea" element={<AdminJobsHub />} />
            <Route path="education" element={<AdminEducationHub />} />
            <Route path="education/trial-questions/:id/manage" element={<AdminTrialQuestionManage />} />
            <Route path="directories" element={<AdminDashboard />} />
            <Route path="directories/universities" element={<AdminUniversities />} />
            <Route path="skilled-workers" element={<AdminDashboard />} />
            <Route path="scholarships" element={<AdminScholarshipHub />} />
            <Route path="ui-buttons" element={<AdminDashboard />} />
            <Route path="ui-forms" element={<AdminDashboard />} />
            <Route path="ui-cards" element={<AdminDashboard />} />
            <Route path="ui-typography" element={<AdminDashboard />} />
            <Route path="icons" element={<AdminDashboard />} />
            <Route path="charts" element={<AdminDashboard />} />
            <Route path="maps" element={<AdminDashboard />} />
            <Route path="info/faqs" element={<AdminFAQsPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
