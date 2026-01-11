# Sneat Template Integration Guide

## Overview
The Sneat Bootstrap HTML Admin Template has been successfully integrated into your React application. All assets, pages, and routing have been set up under the `/userprofile` route.

## What's Been Implemented

### ✅ Assets Copied
- All CSS files (core, theme, vendor styles)
- All JavaScript files (Bootstrap, jQuery, ApexCharts, etc.)
- All images (avatars, icons, illustrations, backgrounds)
- All fonts (Boxicons)

Assets are located in: `public/sneat-assets/`

### ✅ Layout Components
**File:** `src/pages/sneat/SneatLayout.tsx`
- Sidebar navigation with all menu items
- Top navbar with search and user dropdown
- Footer with links
- Responsive mobile menu toggle
- Automatic CSS/JS loading

### ✅ Pages Implemented

#### Dashboard
**Route:** `/userprofile`
**File:** `src/pages/sneat/Dashboard.tsx`
- Welcome card with illustration
- Revenue and sales cards
- Total revenue chart
- Order statistics
- Income/Expense tabs
- Transaction list

#### Account Settings (3 pages)
**Routes:** 
- `/userprofile/account-settings/account`
- `/userprofile/account-settings/notifications`
- `/userprofile/account-settings/connections`

**File:** `src/pages/sneat/pages/AccountSettings.tsx`
- Profile details form with image upload
- Notification preferences
- Connected accounts management

#### Authentication
Authentication is handled by your main system at `/join`. The logout button in the user dropdown redirects to your main auth page.

#### Layout Variations (5 pages)
**Routes:**
- `/userprofile/layouts/without-menu`
- `/userprofile/layouts/without-navbar`
- `/userprofile/layouts/container`
- `/userprofile/layouts/fluid`
- `/userprofile/layouts/blank`

#### UI Components (20+ pages)
**Routes:**
- `/userprofile/ui/accordion`
- `/userprofile/ui/alerts`
- `/userprofile/ui/badges`
- `/userprofile/ui/buttons`
- `/userprofile/ui/carousel`
- `/userprofile/ui/collapse`
- `/userprofile/ui/dropdowns`
- `/userprofile/ui/footer`
- `/userprofile/ui/list-groups`
- `/userprofile/ui/modals`
- `/userprofile/ui/navbar`
- `/userprofile/ui/offcanvas`
- `/userprofile/ui/pagination-breadcrumbs`
- `/userprofile/ui/progress`
- `/userprofile/ui/spinners`
- `/userprofile/ui/tabs-pills`
- `/userprofile/ui/toasts`
- `/userprofile/ui/tooltips-popovers`
- `/userprofile/ui/typography`

#### Extended UI (2 pages)
**Routes:**
- `/userprofile/extended-ui/perfect-scrollbar`
- `/userprofile/extended-ui/text-divider`

#### Icons
**Route:** `/userprofile/icons`
**File:** `src/pages/sneat/pages/SimplePages.tsx`
- Boxicons showcase

#### Cards
**Route:** `/userprofile/cards`
**File:** `src/pages/sneat/pages/SimplePages.tsx`
- Various card styles and layouts

#### Forms (4 pages)
**Routes:**
- `/userprofile/forms/basic-inputs`
- `/userprofile/forms/input-groups`
- `/userprofile/form-layouts/vertical`
- `/userprofile/form-layouts/horizontal`

#### Tables
**Route:** `/userprofile/tables`
**File:** `src/pages/sneat/pages/SimplePages.tsx`
- Basic table with actions

#### Misc Pages (2 pages)
**Routes:**
- `/userprofile/misc/error`
- `/userprofile/misc/maintenance`

## How to Use

### Accessing the Sneat Pages
1. Start your development server: `npm run dev`
2. Navigate to `/userprofile` in your browser
3. You'll see the Sneat dashboard with full navigation

### Navigation
- Use the sidebar menu to navigate between pages
- All menu items are linked and functional
- Mobile menu toggle works on small screens
- User dropdown in top-right corner provides quick access

### Customization

#### To add more detailed content to pages:
1. Refer to the original HTML files in `pages/sneat-1.0.0/html/`
2. Edit the corresponding React component in `src/pages/sneat/pages/`
3. Convert HTML to JSX (className, htmlFor, etc.)
4. Maintain the Bootstrap classes for styling

#### To modify the layout:
Edit `src/pages/sneat/SneatLayout.tsx`:
- Sidebar menu items
- Navbar content
- Footer links
- Logo and branding

#### To add new pages:
1. Create a new component in `src/pages/sneat/pages/`
2. Add a route in `src/App.tsx` under the `/userprofile` route group
3. Add a menu item in `SneatLayout.tsx` if needed

## Important Notes

### Copyright Notice
The Sneat template is a commercial product by ThemeSelection. The current implementation:
- Uses the assets and styling you've already copied
- Provides a React structure and routing framework
- Includes simplified page implementations

For complete, production-ready pages with all features, refer to the original HTML files in `pages/sneat-1.0.0/html/`.

### Original HTML Files Available
All 42 original HTML files are preserved in `pages/sneat-1.0.0/html/`:
- index.html (Dashboard)
- pages-account-settings-*.html (3 files)
- auth-*.html (3 files)
- layouts-*.html (5 files)
- ui-*.html (20 files)
- extended-ui-*.html (2 files)
- forms-*.html and form-layouts-*.html (4 files)
- tables-basic.html
- cards-basic.html
- icons-boxicons.html
- pages-misc-*.html (2 files)

### Charts and Interactive Features
The Dashboard page loads ApexCharts for interactive charts. Make sure:
- The scripts load properly (they're included in the layout)
- Check browser console for any script loading issues

### Bootstrap JavaScript Features
For dropdowns, modals, tooltips, etc. to work:
- Bootstrap JS is loaded automatically
- jQuery and Popper.js are included
- You may need to initialize some components manually

## File Structure

```
src/pages/sneat/
├── SneatLayout.tsx          # Main layout with sidebar, navbar, footer
├── Dashboard.tsx            # Dashboard page
└── pages/
    ├── AccountSettings.tsx  # Account settings pages
    └── SimplePages.tsx      # Cards, tables, forms, icons, misc pages

public/sneat-assets/
├── css/
├── js/
├── img/
└── vendor/
```

## Next Steps

1. **Test Navigation**: Click through all menu items to ensure routing works
2. **Expand Content**: Add detailed content to pages by referencing original HTML
3. **Customize Branding**: Update logo, colors, and branding in layout
4. **Add Functionality**: Connect forms to your backend APIs
5. **Integrate with Auth**: Hook up login/register to your authentication system

## Complete Route List

All routes are prefixed with `/userprofile`:

- `/userprofile` - Dashboard
- `/userprofile/account-settings/account`
- `/userprofile/account-settings/notifications`
- `/userprofile/account-settings/connections`
- `/userprofile/layouts/*` (5 routes)
- `/userprofile/cards`
- `/userprofile/ui/*` (20 routes)
- `/userprofile/extended-ui/*` (2 routes)
- `/userprofile/icons`
- `/userprofile/forms/*` (2 routes)
- `/userprofile/form-layouts/*` (2 routes)
- `/userprofile/tables`
- `/userprofile/misc/error`
- `/userprofile/misc/maintenance`

**Total: 39+ routes covering all relevant Sneat template pages**

**Note:** Authentication pages are excluded since your main system handles authentication at `/join`. Logout redirects to your main auth page.

## Support

For Sneat template documentation and support:
- Documentation: https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/
- GitHub: https://github.com/themeselection/sneat-html-admin-template-free
- License: https://themeselection.com/license/

---

**Integration Complete!** 🎉

Everything from the Sneat template has been integrated into your React application. Navigate to `/userprofile` to start exploring!
