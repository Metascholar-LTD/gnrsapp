# Comprehensive Prompt for GNRS User Profile Sidebar Pages Development

## Context & Overview
You are tasked with developing all user profile sidebar pages for the GNRS (Ghana National Resource System) platform. These pages should represent the personal dashboard experience for users, excluding the Jobs section (which is handled separately). Each page must be thoughtfully designed, highly functional, mobile-responsive, and provide an exceptional user experience.

## Design Principles & Requirements

### Visual Design
- **No gradient colors** - Use solid colors only
- **Clean, modern UI** - Inspired by modern SaaS platforms (Notion, Linear, Stripe)
- **Consistent color palette** - Use the existing design system colors:
  - Primary: `#696cff` (blue-purple)
  - Success: `#71dd37` (green)
  - Warning: `#ffab00` (orange)
  - Danger: `#ff3e1d` (red)
  - Info: `#03c3ec` (cyan)
  - Neutral grays for text and backgrounds
- **Card-based layouts** - Use subtle shadows, rounded corners (8-12px), clean borders
- **Typography** - Use system fonts with clear hierarchy (Crimson Text for headings, Source Sans Pro/Inter for body)
- **Spacing** - Generous whitespace, consistent padding (16-24px)

### Mobile Responsiveness
- **Mobile-first approach** - Design for mobile, enhance for desktop
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Responsive grids** - Stack on mobile, multi-column on desktop
- **Touch-friendly** - Minimum 44px touch targets
- **Optimized performance** - Lazy loading, efficient rendering
- **Mobile navigation** - Collapsible sections, bottom sheets for filters

### Technical Stack
- **React** with TypeScript
- **React Router** for navigation
- **Supabase** for backend/database
- **Lucide React** for icons
- **Framer Motion** for animations (subtle, purposeful)
- **Tailwind CSS** or inline styles (consistent with existing codebase)
- **Existing components** from `@/components/ui/` (Button, Card, Input, etc.)

### Code Quality Standards
- **TypeScript** - Full type safety, proper interfaces
- **Error handling** - Comprehensive try-catch, user-friendly error messages
- **Loading states** - Skeleton loaders, spinners where appropriate
- **Empty states** - Beautiful, helpful empty state designs
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- **Performance** - React.memo, useMemo, useCallback where needed
- **Code organization** - Modular, reusable components

## Page Specifications

### 1. LEARNING SECTION

#### 1.1 My Resources (`/userprofile/courses`)
**Purpose**: Display all educational resources the user has accessed/downloaded
**Data Sources**: 
- University Past Questions
- SHS and BECE Past Questions
- Lecture Notes & E-learning materials
- Trial Questions
- E-books and Training Resources

**Features**:
- **Resource Library Grid/List View**:
  - Toggle between grid and list views
  - Filter by resource type (Past Questions, Lecture Notes, E-books, etc.)
  - Sort by: Recently accessed, Name, Type, Date downloaded
  - Search functionality
- **Resource Cards**:
  - Thumbnail/preview image
  - Resource title and category
  - Download date and last accessed
  - Quick actions: View, Download again, Share, Remove
  - Progress indicator (if applicable)
- **Categories/Tabs**:
  - All Resources
  - University Past Questions
  - SHS/BECE Past Questions
  - Lecture Notes
  - E-books
  - Trial Questions
- **Stats Overview**:
  - Total resources downloaded
  - Storage used (if applicable)
  - Most accessed resource
- **Empty State**: Beautiful illustration with "Start exploring resources" message and link to browse

#### 1.2 Past Questions (`/userprofile/past-questions`)
**Purpose**: Track and manage past question attempts and performance
**Features**:
- **Question Sets List**:
  - Subject/Exam type (WASSCE, BECE, University exams)
  - Year, Paper type
  - Attempt status (Not Started, In Progress, Completed)
  - Score/Performance metrics
- **Performance Analytics**:
  - Subject-wise performance breakdown
  - Progress charts (time-based)
  - Strengths and weaknesses analysis
  - Improvement trends
- **Recent Attempts**:
  - Quick access to recent question sets
  - Continue where you left off
- **Practice Mode**:
  - Quick practice button
  - Randomized questions
  - Timed practice sessions
- **Empty State**: Encourage to start practicing with a clear CTA

#### 1.3 Saved Resources (`/userprofile/saved-questions`)
**Purpose**: Bookmarked/favorited resources for quick access
**Features**:
- **Saved Items Grid**:
  - All bookmarked resources
  - Organize by tags/folders
  - Quick unsave option
- **Collections/Folders**:
  - Create custom collections
  - Organize saved items by topic/subject
  - Share collections (optional)
- **Quick Access**:
  - Recently saved items
  - Most accessed saved items
- **Empty State**: "Start saving resources you find useful"

---

### 2. OPPORTUNITIES SECTION - SCHOLARSHIPS

#### 2.1 My Applications (`/userprofile/scholarships/applications`)
**Purpose**: Track scholarship applications and their status
**Features**:
- **Application Status Dashboard**:
  - Applied (count badge)
  - Under Review
  - Shortlisted
  - Accepted
  - Rejected
- **Application Cards/Table**:
  - Scholarship name and provider
  - Application date
  - Status with color coding
  - Deadline countdown
  - Required documents checklist
  - Actions: View details, Track status, Download application
- **Timeline View**:
  - Visual timeline of application process
  - Important dates and deadlines
  - Status updates history
- **Document Management**:
  - Uploaded documents checklist
  - Missing documents alert
  - Document expiry warnings
- **Filters**: Status, Date applied, Scholarship type
- **Empty State**: "Start applying to scholarships" with link to browse

#### 2.2 Recommendations (`/userprofile/scholarships/recommendations`)
**Purpose**: Personalized scholarship recommendations based on user profile
**Features**:
- **Recommendation Engine Display**:
  - Match score percentage
  - Why this scholarship is recommended
  - Eligibility criteria match indicators
- **Recommendation Cards**:
  - Scholarship details
  - Match reasons
  - Quick apply button
  - Save for later
- **Filtering**:
  - Match score threshold
  - Scholarship type
  - Eligibility status
  - Deadline proximity
- **Recommendation Settings**:
  - Update profile to get better matches
  - Preference settings
  - Notification preferences
- **Empty State**: "Complete your profile to get personalized recommendations"

---

### 3. ACTIVITIES SECTION

#### 3.1 Messages (`/userprofile/messages`)
**Purpose**: Modern Telegram-like chat interface for user communication
**Critical Requirements**: This must be a SUPER MODERN chat interface

**Features**:

**Left Sidebar (Chat List)**:
- **Conversation List**:
  - User avatar (online/offline indicator)
  - User name
  - Last message preview (truncated)
  - Timestamp (relative: "2m ago", "Today", "Yesterday")
  - Unread message count badge
  - Pinned conversations at top
- **Search Bar**:
  - Real-time search across conversations
  - Filter by unread, groups, etc.
- **New Chat Button**: Start new conversation
- **Group Chats Support**: If applicable
- **Categories/Tabs**: All, Unread, Groups, Archived

**Right Side (Chat View)**:
- **Chat Header**:
  - User/group name and avatar
  - Online status
  - Call/video call buttons (if applicable)
  - Menu (view profile, mute, archive, etc.)
- **Message Area**:
  - Scrollable message thread
  - Message bubbles (sent/received styling)
  - Message status indicators (sent, delivered, read)
  - Timestamps grouped logically
  - Message reactions (emoji)
  - Reply to message feature
  - Forward message feature
  - Edit message (for user's own messages)
  - Delete message (for user's own messages)
- **Message Input**:
  - Rich text input with formatting
  - Emoji picker
  - File/image attachment button
  - Voice message recording
  - Send button (with Enter key support)
  - Typing indicator
- **Message Features**:
  - Media gallery (photos, videos)
  - File downloads
  - Link previews
  - Code blocks formatting
  - Message search within chat
  - Date separators
- **Real-time Features**:
  - Live typing indicators
  - Real-time message delivery
  - Read receipts
  - Online/offline status
  - Message reactions updates

**Advanced Features**:
- **Voice Messages**: Record, playback, pause/resume
- **File Sharing**: Drag & drop, preview, progress indicator
- **Media Viewer**: Full-screen image/video viewer
- **Message Actions**: Long-press menu (reply, forward, copy, delete)
- **Search**: Global search across all conversations
- **Notifications**: In-app notifications for new messages
- **Settings**: Notification preferences, privacy settings
- **Block/Report**: User blocking and reporting functionality

**Mobile Optimizations**:
- Single-pane view (chat list OR chat view, toggle)
- Swipe gestures (swipe to archive, delete)
- Pull to refresh
- Bottom sheet for message actions
- Optimized keyboard handling
- Sticky input bar

**Empty State**: "No messages yet. Start a conversation!"

#### 3.2 Mentorship - My Sessions (`/userprofile/mentorship/my-sessions`)
**Purpose**: Track and manage mentorship sessions
**Features**:
- **Session Calendar View**:
  - Monthly/weekly calendar
  - Upcoming sessions highlighted
  - Session count per day
- **Session List**:
  - Upcoming sessions (with countdown)
  - Past sessions (with notes/feedback)
  - Session cards with:
    - Mentor/Mentee info
    - Date and time
    - Duration
    - Session topic/agenda
    - Status (Scheduled, Completed, Cancelled)
    - Join/Reschedule/Cancel actions
- **Session Details**:
  - Session agenda
  - Pre-session preparation notes
  - Post-session feedback form
  - Session recordings (if available)
  - Action items and follow-ups
- **Filters**: Upcoming, Past, By mentor, By topic
- **Empty State**: "No mentorship sessions yet"

#### 3.3 Mentorship - Find a Mentor (`/userprofile/mentorship/find-mentor`)
**Purpose**: Discover and connect with mentors
**Features**:
- **Mentor Discovery**:
  - Mentor cards with:
    - Profile photo
    - Name and title
    - Expertise areas
    - Rating and review count
    - Availability status
    - Bio preview
  - Filter by: Expertise, Industry, Availability, Rating
  - Search functionality
- **Mentor Profile View**:
  - Full profile
  - Experience and credentials
  - Specializations
  - Reviews and ratings
  - Availability calendar
  - Request mentorship button
- **Recommendations**: Personalized mentor suggestions
- **Empty State**: "Search for mentors by expertise area"

#### 3.4 Mentorship - Become a Mentor (`/userprofile/mentorship/become-mentor`)
**Purpose**: Allow users to become mentors and set up their mentor profile
**Features**:
- **Onboarding Flow**:
  - Application form
  - Expertise selection
  - Experience and credentials
  - Availability preferences
  - Bio and profile photo
- **Mentor Dashboard**:
  - Pending mentorship requests
  - Active mentees
  - Session calendar
  - Earnings/stats (if applicable)
- **Profile Management**:
  - Edit mentor profile
  - Update availability
  - Set session rates (if applicable)
  - Manage specializations
- **Settings**: Notification preferences, auto-accept rules

---

### 4. MY BUSINESS SECTION (For Service Providers/Artisans)

#### 4.1 Manage Services (`/userprofile/services/manage`)
**Purpose**: Manage service listings for artisans/service providers
**Features**:
- **Services Dashboard**:
  - Total active services
  - Services with inquiries
  - Views and engagement stats
- **Service List**:
  - Service cards with:
    - Service title and category
    - Thumbnail image
    - Price
    - Status (Active, Inactive, Pending)
    - View count, inquiry count
    - Quick actions: Edit, Deactivate, View, Promote
  - Filter by: Status, Category, Performance
  - Sort options
- **Add New Service**:
  - Multi-step form
  - Service details
  - Pricing and packages
  - Upload photos
  - Service area/location
- **Bulk Actions**: Activate/deactivate multiple services
- **Empty State**: "Add your first service to get started"

#### 4.2 Customer Inquiries (`/userprofile/services/inquiries`)
**Purpose**: Manage customer inquiries and bookings
**Features**:
- **Inquiry List**:
  - Inquiry cards with:
    - Customer name and avatar
    - Service name
    - Inquiry date
    - Status (New, Responded, Quoted, Booked, Declined)
    - Message preview
    - Priority indicator
  - Filter by: Status, Service, Date
  - Sort by: Newest, Oldest, Priority
- **Inquiry Detail View**:
  - Full conversation thread
  - Customer details
  - Service details
  - Response interface
  - Quote/booking options
  - Status updates
- **Quick Actions**: Mark as read, Archive, Respond
- **Stats**: Response rate, Average response time
- **Empty State**: "No inquiries yet"

#### 4.3 Ratings & Reviews (`/userprofile/ratings`)
**Purpose**: View and respond to customer reviews
**Features**:
- **Reviews Overview**:
  - Overall rating (star display)
  - Rating breakdown (5-star to 1-star)
  - Total reviews count
  - Recent trend
- **Reviews List**:
  - Review cards with:
    - Customer name and avatar
    - Star rating
    - Review text
    - Date
    - Service context
    - Response button
  - Filter by: Rating, Date, Service
- **Review Response Interface**:
  - Public response to reviews
  - Thank you messages
  - Professional responses
- **Analytics**: Rating trends over time
- **Empty State**: "No reviews yet. Keep delivering great service!"

#### 4.4 Performance Analytics (`/userprofile/analytics`)
**Purpose**: Business performance metrics and insights
**Features**:
- **Key Metrics Dashboard**:
  - Total views
  - Inquiry count
  - Conversion rate
  - Average response time
  - Customer satisfaction score
- **Charts & Visualizations**:
  - Views over time (line chart)
  - Inquiry trends (bar chart)
  - Service performance comparison
  - Geographic distribution
- **Time Period Filters**: Last 7 days, 30 days, 3 months, 1 year
- **Export Options**: Download reports as PDF/CSV
- **Insights**: AI-powered recommendations for improvement
- **Empty State**: "Start receiving inquiries to see your analytics"

---

### 5. ACCOUNT & SETTINGS SECTION

#### 5.1 My Profile (`/userprofile/profile`)
**Purpose**: User profile management
**Features**:
- **Profile Overview**:
  - Profile photo (upload/edit)
  - Cover photo (optional)
  - Name, title, bio
  - Location
  - Social links
- **Profile Sections**:
  - Personal Information
  - Contact Details
  - Education & Qualifications
  - Work Experience
  - Skills & Expertise
  - Portfolio/Projects
  - Certifications
- **Edit Interface**: Inline editing, save changes
- **Privacy Settings**: Control visibility of profile sections
- **Profile Completeness**: Progress indicator with suggestions

#### 5.2 Subscription Pages

##### 5.2.1 Current Plan (`/userprofile/subscription/current`)
**Purpose**: View current subscription details
**Features**:
- **Current Plan Card**:
  - Plan name and tier
  - Features included (checklist)
  - Billing cycle
  - Next billing date
  - Amount
- **Usage Metrics**:
  - Feature usage stats
  - Limits vs. usage
- **Billing Information**:
  - Payment method
  - Billing address
  - Update payment method
- **Manage Subscription**: Cancel, upgrade, change plan

##### 5.2.2 Upgrade Plan (`/userprofile/subscription/upgrade`)
**Purpose**: Upgrade subscription plan
**Features**:
- **Plan Comparison Table**:
  - Feature comparison across plans
  - Pricing
  - Popular/recommended badge
- **Plan Cards**: Visual cards for each tier
- **Benefits Highlight**: What you get with upgrade
- **Upgrade CTA**: Clear upgrade buttons

##### 5.2.3 Payment History (`/userprofile/subscription/history`)
**Purpose**: View payment transactions
**Features**:
- **Transaction List**:
  - Date, amount, status
  - Invoice download
  - Payment method
  - Description
- **Filters**: Date range, status, type
- **Export**: Download history as PDF/CSV
- **Empty State**: "No payment history"

#### 5.3 Settings Pages

##### 5.3.1 Account Settings (`/userprofile/settings/account`)
**Purpose**: Manage account details
**Features**:
- **Account Information**:
  - Email address (with verification status)
  - Username
  - Password change
  - Phone number
- **Security**:
  - Two-factor authentication
  - Login history
  - Active sessions
  - Password strength indicator
- **Account Actions**:
  - Deactivate account
  - Delete account (with confirmation)

##### 5.3.2 Privacy Settings (`/userprofile/settings/privacy`)
**Purpose**: Control privacy and data settings
**Features**:
- **Profile Visibility**:
  - Who can see your profile
  - Visibility per section
  - Search visibility
- **Data Privacy**:
  - Data download
  - Data deletion requests
  - Cookie preferences
- **Sharing Settings**:
  - Social sharing preferences
  - Activity visibility

##### 5.3.3 Notification Settings (`/userprofile/settings/notifications`)
**Purpose**: Manage notification preferences
**Features**:
- **Notification Categories**:
  - Email notifications (toggle per category)
  - Push notifications
  - SMS notifications
  - In-app notifications
- **Categories**:
  - Job applications
  - Scholarship updates
  - Messages
  - Mentorship
  - Services
  - Marketing (opt-in/out)
- **Quiet Hours**: Set do-not-disturb hours
- **Notification Center**: Recent notifications list

##### 5.3.4 Profile Visibility (`/userprofile/settings/visibility`)
**Purpose**: Control profile visibility settings
**Features**:
- **Visibility Toggles**:
  - Public/Private profile
  - Profile sections visibility
  - Search engine indexing
  - Directory listings
- **Contact Visibility**:
  - Who can contact you
  - Message filtering
  - Connection requests

#### 5.4 Help & Support (`/userprofile/support`)
**Purpose**: User support and help center
**Features**:
- **Help Center**:
  - FAQ section with search
  - Category-based articles
  - Popular articles
- **Contact Support**:
  - Support ticket creation
  - Category selection
  - Priority level
  - Attach files
  - Ticket history
- **Live Chat** (if available): Real-time support chat
- **Resources**:
  - Video tutorials
  - Documentation links
  - Community forum link

---

## Implementation Guidelines

### State Management
- Use React hooks (useState, useEffect, useContext) for local state
- Use Supabase real-time subscriptions where needed
- Implement optimistic updates for better UX

### Data Fetching
- Use Supabase client for all data operations
- Implement proper loading states
- Error handling with user-friendly messages
- Pagination for large datasets
- Infinite scroll or "Load More" for lists

### Navigation
- Use React Router for all navigation
- Breadcrumbs for nested pages
- Back button support
- Deep linking support

### Performance
- Lazy load images and heavy components
- Virtual scrolling for long lists
- Debounce search inputs
- Memoize expensive computations
- Code splitting per route

### Testing Considerations
- Handle edge cases (empty states, errors, loading)
- Responsive design testing
- Cross-browser compatibility
- Accessibility testing

## Special Focus: Messages Page
The Messages page should be a **premium, modern chat experience** comparable to Telegram, WhatsApp Web, or Discord. Consider:

- **Real-time Communication**: WebSocket/SSE for instant messaging
- **Rich Media Support**: Images, videos, files, voice messages
- **Message Threading**: Reply to specific messages
- **Search**: Full-text search across all messages
- **Archiving**: Archive conversations
- **Blocking**: Block users
- **Groups**: If applicable, support group chats
- **End-to-End Encryption**: Consider security (future enhancement)

## Deliverables
For each page, provide:
1. Complete React component with TypeScript
2. Proper error handling and loading states
3. Mobile-responsive design
4. Empty states
5. Accessibility features
6. Integration with Supabase
7. Clean, maintainable code
8. Comments for complex logic

## Final Notes
- Think like a senior software engineer
- Prioritize user experience above all
- Make it beautiful, functional, and fast
- Consider edge cases and error scenarios
- Follow existing codebase patterns and conventions
- Test on multiple devices and screen sizes
- Ensure accessibility standards (WCAG 2.1 AA)

---

**Start developing these pages one by one, ensuring each meets the highest standards of modern web application development.**
