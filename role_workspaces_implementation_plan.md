# Implementation Plan: BDE, HR & Software Engineer Workspaces

This plan designs dedicated, minimal, editorial-grade workspace screens for three new internal roles—**Business Development Executive (`bde`)**, **HR (`hr`)**, and **Software Engineer (`engineer`)**—matching AtoZenius's existing `#0A0B0E` / `#FDFBF7` design language, `tracking-tighter` typography, and custom popover/tab controls.

---

## 1. Role, Permission & Routing Architecture

### A. `data/portal.ts` & `types.ts`
Extend `PortalRole` and `TeamPermission`:
- **`PortalRole`**: `'student' | 'mentor' | 'staff' | 'manager' | 'admin' | 'bde' | 'hr' | 'engineer'`
- **New `TeamPermission` keys**:
  - `bde_workspace` — Access to BDE Pipeline, Partnerships & Targets
  - `hr_workspace` — Access to HR People Ops, Hiring & Attendance
  - `engineer_workspace` — Access to Engineering Console, APIs & Releases
- **Default Role Mappings (`getDefaultPermissionsForRole`)**:
  - `bde` → `['bde_workspace', 'manage_admissions']`
  - `hr` → `['hr_workspace', 'manage_team']`
  - `engineer` → `['engineer_workspace', 'edit_website']`
- **`ViewState` (`types.ts`)**:
  - BDE: `'bde-desk' | 'bde-pipeline' | 'bde-partners'`
  - HR: `'hr-desk' | 'hr-hiring' | 'hr-people'`
  - Engineer: `'eng-desk' | 'eng-integrations' | 'eng-tickets'`

### B. Routing & Navigation (`App.tsx`, `Navbar.tsx`, `AdminAccessPage.tsx`)
- Update `roleHome`, `guardViewForSession`, `pathToView` (`/bde/*`, `/hr/*`, `/engineer/*`), and `viewToPath` in `App.tsx`.
- Update `Navbar.tsx` to render role-specific workspace tabs when logged in as `bde`, `hr`, or `engineer`.
- Update `AdminAccessPage.tsx` (`roleLabels`, `roleBadgeClass`, `permissionShortLabel`, and role selector tabs) so Admins can provision, promote, and customize permissions for `BDE`, `HR`, and `Engineer` team members.

---

## 2. Dedicated Workspace Designs

### Workspace 1: Business Development Executive (`bde`)
**Folder:** `components/portal/bde/`
Focused on revenue growth, lead conversion, B2B/college partnerships, and counselor handoffs.

1. **`BdeDeskPage.tsx` (`/bde` — Overview & Targets)**
   - **KPI Strip:** Monthly Revenue Target vs. Achieved, Active Pipeline Value, Conversion Rate (%), Demos Booked Today.
   - **Follow-Up Queue:** Prioritized list of hot leads due today with one-click call/WhatsApp/email logging and status pills (`New`, `Demo Scheduled`, `Negotiation`, `Won`, `Lost`).
   - **Quick Log Activity:** Minimal inline drawer/form to log call outcomes or schedule next follow-up without page reloads.

2. **`BdePipelinePage.tsx` (`/bde/pipeline` — Deal & Admissions Funnel)**
   - **Stage Filter Tabs (Underline style):** `All Deals`, `Discovery`, `Demo Booked`, `Proposal Sent`, `Closed Won`.
   - **Deal Cards / Table:** Lead name, course/corporate interest, deal value (INR), source (`Walk-in`, `Website`, `Referral`, `College MOU`), and one-click **"Hand off to Admissions"** action that syncs to `StaffAdmissionsPage`.

3. **`BdePartnersPage.tsx` (`/bde/partners` — Corporate & College Tie-ups)**
   - **Partner Directory:** Colleges, hiring companies, and channel partners with MOU status (`Active`, `In Talks`, `Renewal Due`), POC contact, and committed seat/hiring volume.
   - **Add Partner Modal/Inline Form:** Clean editorial form to onboard new institutional or hiring partners.

---

### Workspace 2: HR (`hr`)
**Folder:** `components/portal/hr/`
Focused on internal hiring, team onboarding, attendance/leave approvals, and mentor/staff directory.

1. **`HrDeskPage.tsx` (`/hr` — People Ops Overview)**
   - **KPI Strip:** Total Active Team, Open Positions, Pending Leave Requests, Onboarding in Progress.
   - **Action Inbox:** Pending leave/WFH requests with one-click `Approve` / `Decline` buttons, plus upcoming work anniversaries & probation reviews.

2. **`HrHiringPage.tsx` (`/hr/hiring` — Recruitment & Applicants)**
   - **Job Requisitions:** Open roles (e.g., *AI Mentor*, *Admissions Counselor*, *BDE*, *Frontend Engineer*) linked with the public `CompanyCareersPage`.
   - **Candidate Pipeline:** Stage tabs (`Applied`, `Screening`, `Interview`, `Offer Sent`, `Hired`) with resume/portfolio link, interviewer notes, and one-click **"Convert to Team Access"** (pre-fills/creates entry in `AdminAccessPage`).

3. **`HrPeoplePage.tsx` (`/hr/people` — Employee Directory & Attendance)**
   - **Team Roster:** Filterable by department (`Mentors`, `Operations`, `BDE`, `Engineering`, `Admin`) showing role, joining date, reporting manager, and employment type (`Full-time`, `Part-time`, `Visiting Mentor`).
   - **Attendance & Payroll Snapshot:** Clean monthly status table (`Present`, `Leave`, `Remote`) and exportable CSV/print summary.

---

### Workspace 3: Software Engineer (`engineer`)
**Folder:** `components/portal/engineer/`
Focused on platform reliability, third-party API health (Meta WhatsApp, Razorpay, Supabase), release logs, and internal bug/feature triage.

1. **`EngDeskPage.tsx` (`/engineer` — System Health & Releases)**
   - **Service Status Grid:** Real-time style health cards for `Web App (SPA)`, `Database & Auth`, `AtoZenius Messenger`, `WhatsApp Cloud API`, and `Razorpay Webhooks` (uptime %, p95 latency, last incident).
   - **Recent Deployments:** Commit/release timeline with environment badge (`Production`, `Staging`), author, and rollback/inspect action.

2. **`EngIntegrationsPage.tsx` (`/engineer/integrations` — APIs, Webhooks & Config)**
   - **Integration Cards:** Status, webhook endpoint URL, last event timestamp, and test-ping trigger for:
     - Meta WhatsApp Business Cloud API (template sync & delivery status)
     - Razorpay Payment Gateway (webhook signature verification status)
     - Email / SMTP (Resend) & Storage buckets
   - **Feature Flags:** Minimal toggle switches for safely rolling out beta features (e.g., `enableBatchWhatsAppLinks`, `enableLiveAttendance`, `enableRealtimeMessenger`).

3. **`EngTicketsPage.tsx` (`/engineer/tickets` — Bug Reports & Feature Queue)**
   - **Triage Board / List:** Filterable by `All`, `Bugs`, `Enhancements`, `Infra` with priority badges (`P0 Critical`, `P1 High`, `P2 Normal`) and reporter role (`Student`, `Mentor`, `Staff`, `BDE`, `HR`).
   - **Inline Status & Assignment:** Custom popover to move tickets across `Open` → `In Progress` → `In Review` → `Deployed`.

---

## 3. Verification Plan

After implementing the screens, state helpers, and routing:
1. Run `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters` (must exit `0`).
2. Run `pnpm run build` (must exit `0`).
3. Verify each new role (`bde`, `hr`, `engineer`) can:
   - Be provisioned and assigned custom permissions in `AdminAccessPage`.
   - Log in and land on its dedicated home screen (`bde-desk`, `hr-desk`, `eng-desk`).
   - Navigate cleanly across all 3 tabs in its workspace without hitting unauthorized routes.
