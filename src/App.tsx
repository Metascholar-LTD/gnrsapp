import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import InternshipDetail from "./pages/jobs/InternshipDetail";
import NationalServiceSupport from "./pages/jobs/NationalServiceSupport";
import NSSProgramDetail from "./pages/jobs/NSSProgramDetail";
import GraduateRecruitment from "./pages/jobs/GraduateRecruitment";
import GraduateProgramDetail from "./pages/jobs/GraduateProgramDetail";
import YouthEmploymentAgency from "./pages/jobs/YouthEmploymentAgency";
import YEAProgramDetail from "./pages/jobs/YEAProgramDetail";
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
import LocalJobGigs from "./pages/LocalJobGigs";
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
import CompanyManager from "./pages/admin/components/CompanyManager";
import JobsApprovalsManager from "./pages/admin/components/JobsApprovalsManager";
import AdminUsersList from "./pages/admin/AdminUsersList";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminSkilledWorkers from "./pages/admin/AdminSkilledWorkers";
import AdminLocalJobGigs from "./pages/admin/AdminLocalJobGigs";
import AdminUniRanking from "./pages/admin/AdminUniRanking";
import SneatLayout from "./pages/sneat/SneatLayout";
import Dashboard from "./pages/sneat/Dashboard";
import AccountSettings from "./pages/sneat/pages/AccountSettings";
import { GenericPage, CardsPage, TablesPage, IconsPage, FormsBasicInputs, FormLayouts, ErrorPage, MaintenancePage } from "./pages/sneat/pages/SimplePages";
// User Profile Pages
import UserMyResources from "./pages/sneat/pages/MyResources";
import SavedResources from "./pages/sneat/pages/SavedResources";
import SavedScholarships from "./pages/sneat/pages/SavedScholarships";
import MyArtisanProfile from "./pages/sneat/pages/MyArtisanProfile";
import Messages from "./pages/sneat/pages/Messages";
import ComingSoon from "./pages/sneat/pages/ComingSoon";
import MentorshipSessions from "./pages/sneat/pages/MentorshipSessions";
import FindMentor from "./pages/sneat/pages/FindMentor";
import BecomeMentor from "./pages/sneat/pages/BecomeMentor";
import ManageServices from "./pages/sneat/pages/ManageServices";
import CustomerInquiries from "./pages/sneat/pages/CustomerInquiries";
import RatingsReviews from "./pages/sneat/pages/RatingsReviews";
import UserProfile from "./pages/sneat/pages/MyProfile";
import PrivacySettings from "./pages/sneat/pages/PrivacySettings";
import NotificationSettings from "./pages/sneat/pages/NotificationSettings";
import ProfileVisibility from "./pages/sneat/pages/ProfileVisibility";
import HelpSupport from "./pages/sneat/pages/HelpSupport";
import EmployerLayout from "./pages/employer/EmployerLayout";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerAuth from "./pages/employer/EmployerAuth";
import PostNewJob from "./pages/employer/PostNewJob";
import PostNewGig from "./pages/employer/PostNewGig";
import EmployerAllJobs from "./pages/employer/AllJobs";
import EmployerCompanyManagement from "./pages/employer/EmployerCompanyManagement";
import AllGigs from "./pages/employer/AllGigs";
import Applications from "./pages/employer/Applications";
import ApplicationDetail from "./pages/employer/ApplicationDetail";
import Drafts from "./pages/employer/Drafts";
import EmployerProfileSettings from "./pages/employer/EmployerProfileSettings";
// Scholarly Ranking Platform
import ScholarlyIndex from "./pages/scholarly/Index";
import ScholarlyRankings from "./pages/scholarly/Rankings";
import ScholarlyUniversityProfile from "./pages/scholarly/UniversityProfile";
import ScholarlyArticles from "./pages/scholarly/Articles";
import ScholarlyArticleView from "./pages/scholarly/ArticleView";
// Scholar Auth & Management
import ScholarSignUp from "./pages/scholarly/auth/SignUp";
import ScholarSignIn from "./pages/scholarly/auth/SignIn";
import CompleteProfile from "./pages/scholarly/auth/CompleteProfile";
import ResetPassword from "./pages/scholarly/auth/ResetPassword";
import VerifyEmail from "./pages/scholarly/auth/VerifyEmail";
import ScholarProfile from "./pages/scholarly/ScholarProfile";
import ScholarLayout from "./pages/scholarly/ScholarLayout";
import ScholarDashboard from "./pages/scholarly/ScholarDashboard";
import SubmitPaper from "./pages/scholarly/SubmitPaper";
import MyProfile from "./pages/scholarly/MyProfile";
import AllPapers from "./pages/scholarly/AllPapers";
import MyPaperView from "./pages/scholarly/MyPaperView";
import PendingReview from "./pages/scholarly/PendingReview";

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
          <Route path="/jobs/internships/:id" element={<InternshipDetail />} />
          <Route path="/jobs/nss" element={<NationalServiceSupport />} />
          <Route path="/jobs/nss/:id" element={<NSSProgramDetail />} />
          <Route path="/jobs/graduate-recruitment" element={<GraduateRecruitment />} />
          <Route path="/jobs/graduate-recruitment/:id" element={<GraduateProgramDetail />} />
          <Route path="/jobs/yea-jobs" element={<YouthEmploymentAgency />} />
          <Route path="/jobs/yea-jobs/:id" element={<YEAProgramDetail />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies/:name" element={<CompanyDetails />} />
          {/* Skilled Workers Directory */}
          <Route path="/skilled-workers" element={<SkilledWorkers />} />
          <Route path="/skilled-workers/browse" element={<SkilledWorkersBrowse />} />
          <Route path="/skilled-workers/join" element={<SkilledWorkersJoin />} />
          <Route path="/skilled-workers/category/:category" element={<SkilledWorkersList />} />
          <Route path="/skilled-workers/profile/:id" element={<SkilledWorkerProfile />} />
          {/* Local Job Gigs */}
          <Route path="/local-job-gigs" element={<LocalJobGigs />} />
          <Route path="/local-job-gigs/:id" element={<LocalJobGigs />} />
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
          {/* Scholarly Ranking Platform Routes */}
          <Route path="/scholarly" element={<ScholarlyIndex />} />
          <Route path="/scholarly/rankings" element={<ScholarlyRankings />} />
          <Route path="/scholarly/universities/:slug" element={<ScholarlyUniversityProfile />} />
          <Route path="/scholarly/articles" element={<ScholarlyArticles />} />
          <Route path="/scholarly/articles/:id" element={<ScholarlyArticleView />} />
          {/* Scholar Auth Routes */}
          <Route path="/scholarly/auth/sign-up" element={<ScholarSignUp />} />
          <Route path="/scholarly/auth/sign-in" element={<ScholarSignIn />} />
          <Route path="/scholarly/auth/complete-profile" element={<CompleteProfile />} />
          <Route path="/scholarly/auth/reset-password" element={<ResetPassword />} />
          <Route path="/scholarly/auth/verify-email" element={<VerifyEmail />} />
          {/* Scholar Public Routes */}
          <Route path="/scholarly/scholars/:id" element={<ScholarProfile />} />
          {/* Scholar Dashboard Routes - Inside Layout */}
          <Route path="/scholar" element={<ScholarLayout />}>
            <Route index element={<ScholarDashboard />} />
            <Route path="dashboard" element={<ScholarDashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="submit-paper" element={<SubmitPaper />} />
            <Route path="papers" element={<AllPapers />} />
            <Route path="papers/:id" element={<MyPaperView />} />
            <Route path="papers/pending" element={<PendingReview />} />
          </Route>
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
          {/* Admin Auth Routes - Standalone (not in AdminLayout) */}
          <Route path="/admin/sign-in" element={<AdminAuth />} />
          <Route path="/admin/sign-up" element={<AdminAuth />} />
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
            <Route path="blank" element={<AdminDashboard />} />
            <Route path="news" element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobsHub />} />
            {/* Back-compat: keep old URL but unify UI to a single Jobs entry */}
            <Route path="jobs/all" element={<Navigate to="/admin/jobs" replace />} />
            <Route path="jobs/internships" element={<AdminJobsHub />} />
            <Route path="jobs/nss" element={<AdminJobsHub />} />
            <Route path="jobs/graduate-recruitment" element={<AdminJobsHub />} />
            <Route path="jobs/yea" element={<AdminJobsHub />} />
            <Route path="jobs/companies" element={<CompanyManager />} />
            <Route path="jobs/approvals" element={<JobsApprovalsManager />} />
            <Route path="education" element={<AdminEducationHub />} />
            <Route path="education/trial-questions/:id/manage" element={<AdminTrialQuestionManage />} />
            <Route path="directories" element={<AdminDashboard />} />
            <Route path="directories/universities" element={<AdminUniversities />} />
            <Route path="skilled-workers" element={<AdminSkilledWorkers />} />
            <Route path="skilled-workers/categories" element={<AdminSkilledWorkers />} />
            <Route path="skilled-workers/profiles" element={<AdminSkilledWorkers />} />
            <Route path="skilled-workers/approval" element={<AdminSkilledWorkers />} />
            <Route path="local-job-gigs" element={<AdminLocalJobGigs />} />
            <Route path="local-job-gigs/categories" element={<AdminLocalJobGigs />} />
            <Route path="local-job-gigs/gigs" element={<AdminLocalJobGigs />} />
            <Route path="local-job-gigs/approval" element={<AdminLocalJobGigs />} />
            <Route path="uni-ranking" element={<AdminUniRanking />} />
            <Route path="uni-ranking/institutions" element={<AdminUniRanking />} />
            <Route path="uni-ranking/approval" element={<AdminUniRanking />} />
            <Route path="scholarships" element={<AdminScholarshipHub />} />
            <Route path="ui-buttons" element={<AdminDashboard />} />
            <Route path="ui-forms" element={<AdminDashboard />} />
            <Route path="ui-cards" element={<AdminDashboard />} />
            <Route path="ui-typography" element={<AdminDashboard />} />
            <Route path="icons" element={<AdminDashboard />} />
            <Route path="charts" element={<AdminDashboard />} />
            <Route path="maps" element={<AdminDashboard />} />
            <Route path="info/faqs" element={<AdminFAQsPage />} />
            <Route path="users" element={<AdminUsersList />} />
          </Route>

          {/* Sneat User Profile Routes */}
          <Route path="/userprofile" element={<SneatLayout />}>
            <Route index element={<Dashboard />} />

            {/* Learning Section */}
            <Route path="courses" element={<UserMyResources />} />
            <Route path="saved-questions" element={<SavedResources />} />

            {/* Scholarships */}
            <Route path="scholarships/saved" element={<SavedScholarships />} />

            {/* Jobs */}
            <Route path="jobs/artisan-profile" element={<MyArtisanProfile />} />

            {/* Messages */}
            <Route path="messages" element={<Messages />} />

            {/* Community */}
            <Route path="community/discussion-forums" element={<ComingSoon />} />
            <Route path="community/study-groups" element={<ComingSoon />} />
            <Route path="community/alumni-connect" element={<ComingSoon />} />
            <Route path="community/mentorship" element={<ComingSoon />} />
            <Route path="community/mentorship/my-sessions" element={<MentorshipSessions />} />
            <Route path="community/mentorship/find-mentor" element={<FindMentor />} />
            <Route path="community/mentorship/become-mentor" element={<BecomeMentor />} />

            {/* Services (for providers) */}
            <Route path="services/manage" element={<ManageServices />} />
            <Route path="services/inquiries" element={<CustomerInquiries />} />

            {/* Ratings */}
            <Route path="ratings" element={<RatingsReviews />} />

            {/* Profile */}
            <Route path="profile" element={<UserProfile />} />

            {/* Settings */}
            <Route path="settings/account" element={<AccountSettings />} />
            <Route path="settings/privacy" element={<PrivacySettings />} />
            <Route path="settings/notifications" element={<NotificationSettings />} />
            <Route path="settings/visibility" element={<ProfileVisibility />} />

            {/* Help & Support */}
            <Route path="support" element={<HelpSupport />} />

            {/* Legacy Account Settings Routes */}
            <Route path="account-settings/account" element={<AccountSettings />} />
            <Route path="account-settings/notifications" element={<NotificationSettings />} />
            <Route path="account-settings/connections" element={<AccountSettings />} />
            
            {/* Layout Pages */}
            <Route path="layouts/without-menu" element={<GenericPage title="Without Menu" description="Layout without menu sidebar" />} />
            <Route path="layouts/without-navbar" element={<GenericPage title="Without Navbar" description="Layout without top navbar" />} />
            <Route path="layouts/container" element={<GenericPage title="Container Layout" />} />
            <Route path="layouts/fluid" element={<GenericPage title="Fluid Layout" />} />
            <Route path="layouts/blank" element={<GenericPage title="Blank Layout" />} />
            
            {/* Cards */}
            <Route path="cards" element={<CardsPage />} />
            
            {/* UI Components */}
            <Route path="ui/accordion" element={<GenericPage title="Accordion" description="Bootstrap accordion components" />} />
            <Route path="ui/alerts" element={<GenericPage title="Alerts" description="Bootstrap alert components" />} />
            <Route path="ui/badges" element={<GenericPage title="Badges" description="Bootstrap badge components" />} />
            <Route path="ui/buttons" element={<GenericPage title="Buttons" description="Bootstrap button components" />} />
            <Route path="ui/carousel" element={<GenericPage title="Carousel" description="Bootstrap carousel components" />} />
            <Route path="ui/collapse" element={<GenericPage title="Collapse" description="Bootstrap collapse components" />} />
            <Route path="ui/dropdowns" element={<GenericPage title="Dropdowns" description="Bootstrap dropdown components" />} />
            <Route path="ui/footer" element={<GenericPage title="Footer" description="Footer components" />} />
            <Route path="ui/list-groups" element={<GenericPage title="List Groups" description="Bootstrap list group components" />} />
            <Route path="ui/modals" element={<GenericPage title="Modals" description="Bootstrap modal components" />} />
            <Route path="ui/navbar" element={<GenericPage title="Navbar" description="Bootstrap navbar components" />} />
            <Route path="ui/offcanvas" element={<GenericPage title="Offcanvas" description="Bootstrap offcanvas components" />} />
            <Route path="ui/pagination-breadcrumbs" element={<GenericPage title="Pagination & Breadcrumbs" />} />
            <Route path="ui/progress" element={<GenericPage title="Progress" description="Bootstrap progress bars" />} />
            <Route path="ui/spinners" element={<GenericPage title="Spinners" description="Bootstrap spinner components" />} />
            <Route path="ui/tabs-pills" element={<GenericPage title="Tabs & Pills" description="Bootstrap tabs and pills" />} />
            <Route path="ui/toasts" element={<GenericPage title="Toasts" description="Bootstrap toast components" />} />
            <Route path="ui/tooltips-popovers" element={<GenericPage title="Tooltips & Popovers" />} />
            <Route path="ui/typography" element={<GenericPage title="Typography" description="Typography styles and examples" />} />
            
            {/* Extended UI */}
            <Route path="extended-ui/perfect-scrollbar" element={<GenericPage title="Perfect Scrollbar" />} />
            <Route path="extended-ui/text-divider" element={<GenericPage title="Text Divider" />} />
            
            {/* Icons */}
            <Route path="icons" element={<IconsPage />} />
            
            {/* Forms */}
            <Route path="forms/basic-inputs" element={<FormsBasicInputs />} />
            <Route path="forms/input-groups" element={<GenericPage title="Input Groups" description="Bootstrap input group components" />} />
            <Route path="form-layouts/vertical" element={<FormLayouts layout="vertical" />} />
            <Route path="form-layouts/horizontal" element={<FormLayouts layout="horizontal" />} />
            
            {/* Tables */}
            <Route path="tables" element={<TablesPage />} />
            
            {/* Misc */}
            <Route path="misc/error" element={<ErrorPage />} />
            <Route path="misc/maintenance" element={<MaintenancePage />} />
          </Route>

          {/* Employer Auth Route */}
          <Route path="/employer/auth" element={<EmployerAuth />} />

          {/* Employer Dashboard Routes */}
          <Route path="/employer" element={<EmployerLayout />}>
            <Route index element={<EmployerDashboard />} />
            <Route path="job-listings/post" element={<PostNewJob />} />
            <Route path="job-listings/all" element={<EmployerAllJobs />} />
            <Route path="job-listings/drafts" element={<Drafts />} />
            <Route path="job-listings/*" element={<GenericPage title="Job Listings" description="Post and manage job listings" />} />
            <Route path="company" element={<EmployerCompanyManagement />} />
            <Route path="gigs-listing/post" element={<PostNewGig />} />
            <Route path="gigs-listing/all" element={<AllGigs />} />
            <Route path="gigs-listing/*" element={<GenericPage title="Gigs Listing" description="Post and manage gig listings" />} />
            <Route path="applications/all" element={<Applications status="all" />} />
            <Route path="applications/pending" element={<Applications status="pending" />} />
            <Route path="applications/:id" element={<ApplicationDetail />} />
            <Route path="applications/shortlisted" element={<Applications status="shortlisted" />} />
            <Route path="applications/rejected" element={<Applications status="rejected" />} />
            <Route path="applications/*" element={<Applications status="all" />} />
            <Route path="candidates/*" element={<GenericPage title="Candidates" description="Shortlist and message candidates" />} />
            <Route path="analytics" element={<GenericPage title="Analytics" description="View candidate analytics" />} />
            <Route path="subscription/*" element={<GenericPage title="Subscription & Billing" description="Manage subscription and billing" />} />
            <Route path="settings/account" element={<EmployerProfileSettings />} />
            <Route path="settings/*" element={<GenericPage title="Settings" description="Account settings" />} />
            <Route path="support" element={<GenericPage title="Support" description="Help & Support" />} />
            <Route path="*" element={<GenericPage title="Page" />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
