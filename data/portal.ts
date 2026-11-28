import {
  Briefcase,
  Code2,
  Cpu,
  Sprout,
  Stethoscope,
} from 'lucide-react';
import { CourseCategory, CourseItem, coursesData } from './courses';
import { MentorItem, mentorsData } from './mentors';
import { StudentStory, studentStories } from './stories';
import { BlogPost, blogPosts } from './blog';

export type PortalTrackId = 'ai-full-stack' | 'advanced-medical-coding' | 'data-science-analytics';

export type PortalRole = 'student' | 'mentor' | 'staff' | 'admin';

export interface PortalSession {
  name: string;
  email: string;
  initials: string;
  role: PortalRole;
  trackId: PortalTrackId | null;
}

export type StudentSession = PortalSession;

export interface LectureNote {
  id: string;
  lectureNumber: string;
  weekLabel: string;
  title: string;
  taughtDate: string;
  status: 'taught' | 'upcoming';
  summary: string;
  classHighlight: string;
  keyPoints: { term: string; detail: string }[];
  referenceSnippetTitle: string;
  referenceSnippet: string;
}

export interface PortalProject {
  id: string;
  kind: 'Minor' | 'Major';
  number: string;
  title: string;
  brief: string;
  deliverables: string[];
  defaultStatus: 'Not Started' | 'Submitted' | 'Reviewed';
  defaultFeedback?: string;
}

export interface CommunityReply {
  id: string;
  author: string;
  role: 'Student' | 'Mentor';
  timeAgo: string;
  body: string;
}

export interface CommunityThread {
  id: string;
  category: 'Course Doubts' | 'Mentor Pinned' | 'Placement Alerts';
  lectureRef?: string;
  author: string;
  authorInitials: string;
  timeAgo: string;
  title: string;
  body: string;
  pinned?: boolean;
  replies: CommunityReply[];
}

export interface PortalTrackData {
  id: PortalTrackId;
  courseTitle: string;
  batchCode: string;
  branchLocation: string;
  nextSessionTime: string;
  nextSessionTopic: string;
  nextLectureId: string;
  mentorName: string;
  mentorRole: string;
  prepChecklist: string[];
  whatsappGroupLabel: string;
  whatsappGroupUrl: string;
  whatsappDoubtUrl: string;
  whatsappPlacementUrl: string;
  lectures: LectureNote[];
  projects: PortalProject[];
  threads: CommunityThread[];
}

export interface BatchOverride {
  branchLocation?: string;
  nextSessionTime?: string;
  nextSessionTopic?: string;
  mentorName?: string;
  whatsappGroupUrl?: string;
}

export interface LectureOverride {
  summary?: string;
  classHighlight?: string;
}

export interface ProjectSubmissionRecord {
  url: string;
  submittedAt: string;
}

export interface ProjectReviewOverride {
  status: 'Not Started' | 'Submitted' | 'Reviewed';
  feedback: string;
  reviewedBy?: string;
}

export type LeadSource =
  | 'Contact Form'
  | 'Portal Signup'
  | 'Walk-In Counseling'
  | 'WhatsApp Enrollment'
  | 'Phone Inquiry';

export interface AdmissionsLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  source: LeadSource;
  status: 'New' | 'Counseling' | 'Enrolled';
  createdAt: string;
  notes?: string;
}

export interface SiteControlConfig {
  showDemoPreview: boolean;
  allowSelfSignupExplore: boolean;
  communityReadOnly: boolean;
  showCareersInHeader: boolean;
  announcementText: string;
  heroTaglinePrefix: string;
  heroSubtitle: string;
  whatsappNumber: string;
  linkedinUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
}

export interface ProvisionedStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  trackId: PortalTrackId;
  batchCode: string;
  tempPassword: string;
  status: 'Active' | 'Revoked';
  createdAt: string;
  source: 'WhatsApp Enrollment' | 'Walk-In Counseling' | 'Phone Inquiry' | 'Admin Provisioned';
}

export interface TeamMemberAccess {
  id: string;
  name: string;
  email: string;
  role: Exclude<PortalRole, 'student'>;
  assignedTrackId?: PortalTrackId;
  addedAt: string;
}

export interface CourseOverride {
  duration?: string;
  description?: string;
}

export type StoredCustomCourse = Omit<CourseItem, 'icon'>;

export interface IssuedCertificate {
  id: string;
  studentName: string;
  programTitle: string;
  batchCode: string;
  type: 'Course + Internship Completion';
  issuedDate: string;
}

export const allTrackIds: PortalTrackId[] = [
  'ai-full-stack',
  'advanced-medical-coding',
  'data-science-analytics',
];

export const portalTracks: Record<PortalTrackId, PortalTrackData> = {
  'ai-full-stack': {
    id: 'ai-full-stack',
    courseTitle: 'AI Full-Stack Development',
    batchCode: 'Batch #FS-08',
    branchLocation: 'Madhapur Tech Hub · Room 204',
    nextSessionTime: 'Tomorrow · 10:00 AM – 12:30 PM',
    nextSessionTopic: 'Streaming LLM Responses & Structured JSON Validation in Express/Node',
    nextLectureId: 'fs-l4',
    mentorName: 'Turpati Durga Prasad',
    mentorRole: 'Full-Stack & Systems Mentor',
    prepChecklist: [
      'Bring your laptop with Node 20+ and PostgreSQL running locally',
      'Review Lecture 03 auth middleware notes before class',
      'Push Minor Project #2 repository URL in Projects before Friday',
    ],
    whatsappGroupLabel: 'FS-08 Official Batch Group',
    whatsappGroupUrl:
      'https://wa.me/919502886626?text=Hi%2C%20I%20am%20in%20Batch%20FS-08%20(AI%20Full-Stack)%20and%20want%20to%20join%20the%20official%20batch%20WhatsApp%20group.',
    whatsappDoubtUrl:
      'https://wa.me/919502886626?text=Hi%20Mentor%2C%20I%20have%20a%20doubt%20from%20Batch%20FS-08%20(AI%20Full-Stack).',
    whatsappPlacementUrl:
      'https://wa.me/919502886626?text=Hi%2C%20please%20add%20me%20to%20the%20IT%20%26%20Full-Stack%20Placement%20Alerts%20WhatsApp%20broadcast.',
    lectures: [
      {
        id: 'fs-l1',
        lectureNumber: '01',
        weekLabel: 'Week 01',
        title: 'Responsive Systems & Component Architecture with React + TypeScript',
        taughtDate: 'Taught Nov 14',
        status: 'taught',
        summary:
          'Structured component composition, strict TypeScript prop contracts, and layout grids that scale cleanly from mobile viewports to desktop dashboards.',
        classHighlight:
          'In class we refactored a cramped multi-pill card into a clean two-zone architectural ledger—keep every UI element focused on one clear job.',
        keyPoints: [
          { term: 'Discriminated Unions', detail: 'Model view states and API loading states safely without boolean soup.' },
          { term: 'Composition > Props Explosion', detail: 'Use children and clean slot layouts instead of 15 conditional props.' },
          { term: 'Fluid Spacing', detail: 'Constrain readable copy with max-w-2xl/3xl and consistent container padding.' },
        ],
        referenceSnippetTitle: 'Typed State Pattern',
        referenceSnippet: `type AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'ready'; data: T }\n  | { status: 'error'; message: string };`,
      },
      {
        id: 'fs-l2',
        lectureNumber: '02',
        weekLabel: 'Week 02',
        title: 'Relational Schemas, Joins & Indexing in PostgreSQL',
        taughtDate: 'Taught Nov 18',
        status: 'taught',
        summary:
          'Designing normalized tables for users, batches, and project submissions, plus diagnosing slow queries using EXPLAIN ANALYZE.',
        classHighlight:
          'Always index foreign keys used in dashboard queries (`batch_id`, `student_id`) before adding caching layers.',
        keyPoints: [
          { term: 'Foreign Keys + Cascade', detail: 'Maintain referential integrity between batches, enrollments, and submissions.' },
          { term: 'Composite Indexes', detail: 'Order columns by selectivity and equality predicates first.' },
          { term: 'Transactions', detail: 'Wrap multi-table writes (enrollment + payment receipt) inside BEGIN/COMMIT.' },
        ],
        referenceSnippetTitle: 'Batch Progress Query',
        referenceSnippet: `SELECT s.name, COUNT(p.id) AS completed_projects\nFROM students s\nLEFT JOIN project_submissions p ON p.student_id = s.id AND p.status = 'reviewed'\nWHERE s.batch_id = $1\nGROUP BY s.id;`,
      },
      {
        id: 'fs-l3',
        lectureNumber: '03',
        weekLabel: 'Week 03',
        title: 'REST APIs, JWT Session Middleware & Input Validation',
        taughtDate: 'Taught Nov 22',
        status: 'taught',
        summary:
          'Building predictable Express/Node routes with schema validation, HTTP status discipline, and secure token handling.',
        classHighlight:
          'Validate every external request payload at the controller boundary before touching your database layer.',
        keyPoints: [
          { term: '400 vs 401 vs 403', detail: 'Distinguish invalid input (400), missing auth (401), and forbidden role/batch access (403).' },
          { term: 'Central Error Handler', detail: 'Return consistent JSON `{ error, code }` shapes across all endpoints.' },
          { term: 'Rate Limiting', detail: 'Protect login and AI inference endpoints from burst traffic.' },
        ],
        referenceSnippetTitle: 'Batch Guard Middleware',
        referenceSnippet: `export function requireSameBatch(req, res, next) {\n  if (req.user.batchId !== req.params.batchId) {\n    return res.status(403).json({ error: 'Access restricted to batch members' });\n  }\n  next();\n}`,
      },
      {
        id: 'fs-l4',
        lectureNumber: '04',
        weekLabel: 'Week 04',
        title: 'Streaming LLM Responses & Structured JSON Validation',
        taughtDate: 'Next Class · Tomorrow',
        status: 'upcoming',
        summary:
          'Connecting Node/Express backends to LLM APIs with Server-Sent Events (SSE), timeout guards, and deterministic schema parsing.',
        classHighlight:
          'Pre-read: Understand why streaming tokens improves perceived latency even when total generation time stays 4–5 seconds.',
        keyPoints: [
          { term: 'SSE Streaming', detail: 'Flush chunks progressively with `text/event-stream` and handle client abort signals.' },
          { term: 'Schema Validation', detail: 'Parse model output strictly before rendering structured UI cards.' },
          { term: 'Fallback States', detail: 'Always provide graceful retry UI when upstream APIs rate-limit.' },
        ],
        referenceSnippetTitle: 'Stream Abort Pattern',
        referenceSnippet: `const controller = new AbortController();\nreq.on('close', () => controller.abort());`,
      },
    ],
    projects: [
      {
        id: 'fs-m1',
        kind: 'Minor',
        number: 'Minor 01',
        title: 'Responsive Portfolio & Curriculum Directory',
        brief: 'Build a clean responsive UI with typed filters, keyboard accessibility, and zero layout shift.',
        deliverables: ['GitHub repo link', 'Mobile + desktop screenshots'],
        defaultStatus: 'Reviewed',
        defaultFeedback: 'Clean grid hierarchy and responsive breakpoints. Approved by Turpati Durga Prasad.',
      },
      {
        id: 'fs-m2',
        kind: 'Minor',
        number: 'Minor 02',
        title: 'PostgreSQL Student Ledger API',
        brief: 'Create CRUD endpoints for batch attendance and notes with parameterized queries and schema validation.',
        deliverables: ['REST API repo', 'SQL schema file'],
        defaultStatus: 'Submitted',
      },
      {
        id: 'fs-m3',
        kind: 'Minor',
        number: 'Minor 03',
        title: 'Streaming AI Study Summarizer',
        brief: 'Build a lecture note summarizer with SSE streaming and structured key-takeaway cards.',
        deliverables: ['Working demo URL or repo'],
        defaultStatus: 'Not Started',
      },
      {
        id: 'fs-maj1',
        kind: 'Major',
        number: 'Major 01',
        title: 'Full-Stack Career & Cohort Portal',
        brief: 'End-to-end authenticated workspace with role permissions, search, and deployment pipeline.',
        deliverables: ['Live deployed URL', 'Architecture README', 'Mentor walkthrough'],
        defaultStatus: 'Not Started',
      },
      {
        id: 'fs-maj2',
        kind: 'Major',
        number: 'Major 02',
        title: 'Production AI SaaS Capstone',
        brief: 'Team-built AI product combining RAG/LLM workflows, PostgreSQL persistence, and observability.',
        deliverables: ['Production deployment', 'Final capstone presentation'],
        defaultStatus: 'Not Started',
      },
    ],
    threads: [
      {
        id: 'fs-t1',
        category: 'Mentor Pinned',
        lectureRef: 'Lecture 03 · REST APIs',
        author: 'Turpati Durga Prasad',
        authorInitials: 'TD',
        timeAgo: '3h ago',
        pinned: true,
        title: 'Starter PostgreSQL + Express Boilerplate for Tomorrow’s Class',
        body: 'Make sure you pull the `week-04-streaming` branch tonight and set your `.env` port to `4000` so we start live coding right at 10:00 AM.',
        replies: [
          {
            id: 'fs-r1',
            author: 'Rohan Varma',
            role: 'Student',
            timeAgo: '2h ago',
            body: 'Pulled and tested locally on Node 20 — migrations ran cleanly!',
          },
        ],
      },
      {
        id: 'fs-t2',
        category: 'Course Doubts',
        lectureRef: 'Lecture 02 · PostgreSQL',
        author: 'Kalyan Karadi',
        authorInitials: 'KK',
        timeAgo: '1d ago',
        title: 'When should I use LEFT JOIN vs INNER JOIN on submission counts?',
        body: 'In Minor 02, students with zero submissions disappeared when I used INNER JOIN.',
        replies: [
          {
            id: 'fs-r2',
            author: 'Turpati Durga Prasad',
            role: 'Mentor',
            timeAgo: '20h ago',
            body: 'Use `LEFT JOIN` starting from `students` so learners with 0 submissions still appear with `COUNT(p.id) = 0`. Great catch!',
          },
        ],
      },
      {
        id: 'fs-t3',
        category: 'Placement Alerts',
        author: 'AtoZenius Placement Cell',
        authorInitials: 'AZ',
        timeAgo: '2d ago',
        title: 'Mock Technical Screening — Saturday 3:00 PM (Madhapur Hub)',
        body: 'Students who have completed Minor 01 and Minor 02 can book a 20-minute offline code review slot with Aditya Venugopal.',
        replies: [],
      },
    ],
  },

  'advanced-medical-coding': {
    id: 'advanced-medical-coding',
    courseTitle: 'Advanced Medical Coding',
    batchCode: 'Batch #MC-14',
    branchLocation: 'Ameerpet Health Wing · Lab 3',
    nextSessionTime: 'Tomorrow · 11:00 AM – 1:30 PM',
    nextSessionTopic: 'CPT Modifiers (-25, -59, -76) & Outpatient Surgical Chart Audits',
    nextLectureId: 'mc-l4',
    mentorName: 'Sairam Lankadasari',
    mentorRole: 'Medical Coding Mentor (M.Pharm, CPC)',
    prepChecklist: [
      'Bring your ICD-10-CM & CPT 2026 coding manuals / sticky tabs',
      'Revise Lecture 03 Cardiovascular ICD-10-CM chapter guidelines',
      'Complete the 10-chart Minor 02 audit sheet before tomorrow’s lab',
    ],
    whatsappGroupLabel: 'MC-14 Official Batch Group',
    whatsappGroupUrl:
      'https://wa.me/919502886626?text=Hi%2C%20I%20am%20in%20Batch%20MC-14%20(Medical%20Coding)%20and%20want%20to%20join%20the%20official%20batch%20WhatsApp%20group.',
    whatsappDoubtUrl:
      'https://wa.me/919502886626?text=Hi%20Sai%20Ram%20Sir%2C%20I%20have%20a%20doubt%20from%20Batch%20MC-14%20(Medical%20Coding).',
    whatsappPlacementUrl:
      'https://wa.me/919502886626?text=Hi%2C%20please%20add%20me%20to%20the%20Medical%20Coding%20%26%20Healthcare%20Placement%20Alerts%20WhatsApp%20broadcast.',
    lectures: [
      {
        id: 'mc-l1',
        lectureNumber: '01',
        weekLabel: 'Week 01',
        title: 'Medical Terminology, Prefixes/Suffixes & Human Anatomy Essentials',
        taughtDate: 'Taught Nov 12',
        status: 'taught',
        summary:
          'Decoding clinical notes rapidly using anatomical roots, diagnostic suffixes (-itis, -ectomy, -scopy), and directional planes.',
        classHighlight:
          'Sai Ram Sir tip: Never guess a code from memory—identify the anatomical site and surgical approach from the root word first.',
        keyPoints: [
          { term: '-ectomy vs -otomy', detail: '`-ectomy` means surgical removal/excision; `-otomy` means cutting into / incision.' },
          { term: 'Laterality Rules', detail: 'Always check whether the chart specifies left, right, or bilateral before finalizing.' },
          { term: 'Acute vs Chronic', detail: 'If both acute and chronic are documented and both codes exist, sequence the acute code first.' },
        ],
        referenceSnippetTitle: 'Quick Root Decoder',
        referenceSnippet: `Cholecyst- (Gallbladder) + -ectomy (Removal) = Cholecystectomy\nArthr/o (Joint) + -scopy (Visual exam) = Arthroscopy\nBrady- (Slow) + cardia (Heart) = Bradycardia`,
      },
      {
        id: 'mc-l2',
        lectureNumber: '02',
        weekLabel: 'Week 02',
        title: 'ICD-10-CM Conventions, Excludes1 vs Excludes2 & Sequencing',
        taughtDate: 'Taught Nov 17',
        status: 'taught',
        summary:
          'Navigating the Alphabetic Index and Tabular List accurately, applying 7th-character extensions, and resolving Excludes notes.',
        classHighlight:
          'Excludes1 = "Not coded here" (mutually exclusive conditions). Excludes2 = "Not included here" (both conditions can be coded together if documented).',
        keyPoints: [
          { term: '7th Character (A / D / S)', detail: 'A = Initial encounter (active treatment), D = Subsequent (healing), S = Sequela.' },
          { term: 'Placeholder X', detail: 'Insert `X` in 4th/5th/6th positions whenever a code needs 7 characters but has fewer base digits.' },
          { term: 'Signs & Symptoms', detail: 'Do not code routine symptoms (fever, cough) separately when a definitive diagnosis explains them.' },
        ],
        referenceSnippetTitle: 'ICD-10-CM Sequencing Rule',
        referenceSnippet: `Step 1: Look up main term in Alphabetic Index\nStep 2: Verify full code + laterality in Tabular List\nStep 3: Check "Use additional code" & "Code first" notes`,
      },
      {
        id: 'mc-l3',
        lectureNumber: '03',
        weekLabel: 'Week 03',
        title: 'E/M Services, Cardiovascular ICD-10-CM & Combination Codes',
        taughtDate: 'Taught Nov 23',
        status: 'taught',
        summary:
          'Coding hypertension with heart/kidney disease (I11–I13), diabetes mellitus manifestations (E11.x), and outpatient E/M MDM levels.',
        classHighlight:
          'With ICD-10-CM, hypertension + CKD assumes a causal link ("with" rule) unless the physician explicitly states they are unrelated.',
        keyPoints: [
          { term: 'I10 vs I12 vs I13', detail: 'Use I12 for HTN + CKD, I11 for HTN + Heart Failure, and I13 when both coexist.' },
          { term: 'E11 Combination', detail: 'Code diabetes type + body system complication, plus Z79.4 if long-term insulin is used.' },
          { term: 'MDM Levels', detail: '2 of 3 elements (Problems, Data, Risk) determine outpatient E/M 99202–99215.' },
        ],
        referenceSnippetTitle: 'Cardio-Renal Linkage',
        referenceSnippet: `Documented: "Hypertension and Stage 3 CKD"\nCorrect Code: I12.9 + N18.30 (causal relationship assumed by "with" convention)`,
      },
      {
        id: 'mc-l4',
        lectureNumber: '04',
        weekLabel: 'Week 04',
        title: 'CPT Modifiers (-25, -59, -76) & Outpatient Surgical Audits',
        taughtDate: 'Next Class · Tomorrow',
        status: 'upcoming',
        summary:
          'Preventing claim denials by selecting the exact CPT modifier when E/M and minor procedures happen on the same date of service.',
        classHighlight:
          'Pre-read: Bring your marked CPT Surgery section—we will audit 8 real same-day orthopedic and dermatology charts in Lab 3.',
        keyPoints: [
          { term: 'Modifier -25', detail: 'Significant, separately identifiable E/M service by the same physician on the same day as a procedure.' },
          { term: 'Modifier -59', detail: 'Distinct procedural service (different site, organ, or separate session) not normally reported together.' },
          { term: 'Modifier -50', detail: 'Bilateral procedure performed during the same operative session.' },
        ],
        referenceSnippetTitle: 'Modifier Decision Check',
        referenceSnippet: `Same day E/M + Minor Procedure? -> Check documentation for separate history/exam/MDM -> Apply -25 on E/M code.`,
      },
    ],
    projects: [
      {
        id: 'mc-m1',
        kind: 'Minor',
        number: 'Minor 01',
        title: 'Anatomy & ICD-10-CM Tabular Drill (25 Cases)',
        brief: 'Assign verified ICD-10-CM diagnostic codes with 7th-character extensions across 25 clinical summaries.',
        deliverables: ['Completed coding workbook'],
        defaultStatus: 'Reviewed',
        defaultFeedback: '96% accuracy — great attention to 7th character extensions. Reviewed by Sairam Lankadasari.',
      },
      {
        id: 'mc-m2',
        kind: 'Minor',
        number: 'Minor 02',
        title: 'Diabetes & Cardiovascular Combination Audit',
        brief: 'Audit 10 outpatient charts applying causal "with" conventions and Z-codes.',
        deliverables: ['Audit rationale sheet'],
        defaultStatus: 'Submitted',
      },
      {
        id: 'mc-m3',
        kind: 'Minor',
        number: 'Minor 03',
        title: 'CPT Modifier & HCPCS Level II Coding Lab',
        brief: 'Apply correct CPT surgical codes, modifiers (-25, -59, -50), and HCPCS supply codes.',
        deliverables: ['CPT/HCPCS claim sheet'],
        defaultStatus: 'Not Started',
      },
      {
        id: 'mc-maj1',
        kind: 'Major',
        number: 'Major 01',
        title: 'Multi-Specialty Inpatient & Outpatient Chart Audit',
        brief: 'Full coding + compliance review across 40 anonymized patient encounters.',
        deliverables: ['Audit Excel / PDF report', 'Mentor viva review'],
        defaultStatus: 'Not Started',
      },
      {
        id: 'mc-maj2',
        kind: 'Major',
        number: 'Major 02',
        title: 'CPC Full-Length Timed Mock & Internship Capstone',
        brief: '100-question CPC simulation under timed rules + internship chart compliance dossier.',
        deliverables: ['Mock score breakdown', 'Internship audit sign-off'],
        defaultStatus: 'Not Started',
      },
    ],
    threads: [
      {
        id: 'mc-t1',
        category: 'Mentor Pinned',
        lectureRef: 'Lecture 04 · CPT Modifiers',
        author: 'Sairam Lankadasari',
        authorInitials: 'SL',
        timeAgo: '4h ago',
        pinned: true,
        title: 'Checklist for Tomorrow’s Modifier Lab in Ameerpet Lab 3',
        body: 'Please bring your CPT manual Appendix A tabs and finish charts #1–#10 from Minor 02 tonight. We will review common insurer denial scenarios together.',
        replies: [
          {
            id: 'mc-r1',
            author: 'Mukul Chowdary',
            role: 'Student',
            timeAgo: '3h ago',
            body: 'Thank you Sir! Finished charts #1–#10 and tabbed Appendix A.',
          },
        ],
      },
      {
        id: 'mc-t2',
        category: 'Course Doubts',
        lectureRef: 'Lecture 02 · ICD-10-CM',
        author: 'Venkatesh',
        authorInitials: 'V',
        timeAgo: '1d ago',
        title: 'Sequela (7th char S) — do we code the residual condition first?',
        body: 'In chart #18, the patient has scar contracture due to an old burn. Which code goes first?',
        replies: [
          {
            id: 'mc-r2',
            author: 'Sairam Lankadasari',
            role: 'Mentor',
            timeAgo: '19h ago',
            body: 'Yes! Always sequence the specific residual condition (scar contracture) first, followed by the injury/burn code with 7th character `S` second.',
          },
        ],
      },
      {
        id: 'mc-t3',
        category: 'Placement Alerts',
        author: 'AtoZenius Healthcare Cell',
        authorInitials: 'AZ',
        timeAgo: '2d ago',
        title: 'RCM Trainee Coder Hiring Drive — Next Week',
        body: 'Partner healthcare RCM teams in Hyderabad are scheduling interviews for Batch MC-14 students completing Major 01 with 85%+ accuracy.',
        replies: [],
      },
    ],
  },

  'data-science-analytics': {
    id: 'data-science-analytics',
    courseTitle: 'Data Science & Analytics Mastery',
    batchCode: 'Batch #DS-11',
    branchLocation: 'Madhapur Tech Hub · Room 102',
    nextSessionTime: 'Tomorrow · 2:00 PM – 4:30 PM',
    nextSessionTopic: 'DAX Measures, Row-Level Security & Executive Power BI Dashboards',
    nextLectureId: 'ds-l4',
    mentorName: 'Ananya Deshmukh',
    mentorRole: 'Applied AI & Data Science Lead',
    prepChecklist: [
      'Install Power BI Desktop (or verify sample Superstore PBIX loads)',
      'Review Lecture 03 SQL Window Functions cheat sheet',
      'Upload Minor 02 cohort retention notebook link in Projects',
    ],
    whatsappGroupLabel: 'DS-11 Official Batch Group',
    whatsappGroupUrl:
      'https://wa.me/919502886626?text=Hi%2C%20I%20am%20in%20Batch%20DS-11%20(Data%20Science)%20and%20want%20to%20join%20the%20official%20batch%20WhatsApp%20group.',
    whatsappDoubtUrl:
      'https://wa.me/919502886626?text=Hi%20Mentor%2C%20I%20have%20a%20doubt%20from%20Batch%20DS-11%20(Data%20Science).',
    whatsappPlacementUrl:
      'https://wa.me/919502886626?text=Hi%2C%20please%20add%20me%20to%20the%20Data%20Analytics%20Placement%20Alerts%20WhatsApp%20broadcast.',
    lectures: [
      {
        id: 'ds-l1',
        lectureNumber: '01',
        weekLabel: 'Week 01',
        title: 'Data Cleaning & Exploratory Analysis with Pandas',
        taughtDate: 'Taught Nov 13',
        status: 'taught',
        summary:
          'Handling missing values, outlier checks, grouped aggregations, and tidy dataframe transformations for messy business CSVs.',
        classHighlight:
          'Never drop nulls blindly—always check whether missingness itself correlates with churn or failed transactions.',
        keyPoints: [
          { term: 'Vectorized Ops', detail: 'Prefer `.assign()`, `.loc[]`, and `np.where()` over Python row loops.' },
          { term: 'GroupBy + NamedAgg', detail: 'Compute multiple clean KPIs per segment in one readable pass.' },
          { term: 'Missingness Audit', detail: 'Run `.isna().mean()` across columns before choosing median/mode imputation.' },
        ],
        referenceSnippetTitle: 'Clean Segment Summary',
        referenceSnippet: `summary = df.groupby('region', as_index=False).agg(\n  orders=('order_id', 'nunique'),\n  revenue=('amount', 'sum'),\n  avg_ticket=('amount', 'mean')\n)`,
      },
      {
        id: 'ds-l2',
        lectureNumber: '02',
        weekLabel: 'Week 02',
        title: 'SQL Window Functions: RANK, LAG & Rolling Cohorts',
        taughtDate: 'Taught Nov 18',
        status: 'taught',
        summary:
          'Answering real product & revenue analytics questions without collapsing rows using PARTITION BY and window frames.',
        classHighlight:
          'Interviewers love `DENSE_RANK()` vs `ROW_NUMBER()` edge cases when ties occur in top-N sales queries.',
        keyPoints: [
          { term: 'RANK vs DENSE_RANK', detail: '`RANK` leaves gaps after ties (1, 1, 3); `DENSE_RANK` does not (1, 1, 2).' },
          { term: 'Month-over-Month LAG', detail: 'Use `LAG(rev) OVER (ORDER BY month)` to compute clean growth percentages.' },
          { term: '7-Day Rolling Avg', detail: 'Combine `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`.' },
        ],
        referenceSnippetTitle: 'Top Product Per Category',
        referenceSnippet: `WITH ranked AS (\n  SELECT category, product, SUM(sales) AS total_sales,\n    DENSE_RANK() OVER (PARTITION BY category ORDER BY SUM(sales) DESC) AS rnk\n  FROM orders GROUP BY 1, 2\n)\nSELECT * FROM ranked WHERE rnk <= 3;`,
      },
      {
        id: 'ds-l3',
        lectureNumber: '03',
        weekLabel: 'Week 03',
        title: 'Hypothesis Testing, A/B Metrics & Confidence Intervals',
        taughtDate: 'Taught Nov 23',
        status: 'taught',
        summary:
          'Evaluating experiment lifts rigorously with p-values, sample-size power, and practical business significance.',
        classHighlight:
          'Statistical significance (`p < 0.05`) without meaningful effect size does not justify shipping a complex change.',
        keyPoints: [
          { term: 'Null Hypothesis (H0)', detail: 'Baseline assumption of zero difference between Control and Variant.' },
          { term: 'Type I vs Type II Error', detail: 'False positive (alpha) vs missing a real effect (beta / low power).' },
          { term: 'Guardrail Metrics', detail: 'Track page latency or refund rate alongside conversion lift.' },
        ],
        referenceSnippetTitle: 'Two-Proportion Z-Test Check',
        referenceSnippet: `from statsmodels.stats.proportion import proportions_ztest\nstat, p_val = proportions_ztest(count=[148, 112], nobs=[1000, 1000])`,
      },
      {
        id: 'ds-l4',
        lectureNumber: '04',
        weekLabel: 'Week 04',
        title: 'DAX Measures & Executive Power BI Storytelling',
        taughtDate: 'Next Class · Tomorrow',
        status: 'upcoming',
        summary:
          'Building star-schema data models in Power BI, writing `CALCULATE()` DAX expressions, and designing clutter-free executive views.',
        classHighlight:
          'Pre-read: Review the difference between a Calculated Column (stored per row) and a Measure (evaluated dynamically on filter context).',
        keyPoints: [
          { term: 'Star Schema', detail: 'Keep one clean Fact table connected to Dimension tables (Date, Customer, Product).' },
          { term: 'CALCULATE()', detail: 'Modifies filter context cleanly for YoY, YTD, and segment comparisons.' },
          { term: 'Visual Restraint', detail: 'Limit each dashboard page to 3–4 KPI cards and 2 focused charts.' },
        ],
        referenceSnippetTitle: 'DAX YoY Growth Measure',
        referenceSnippet: `Revenue YoY % =\nVAR PrevYear = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]))\nRETURN DIVIDE([Total Revenue] - PrevYear, PrevYear)`,
      },
    ],
    projects: [
      {
        id: 'ds-m1',
        kind: 'Minor',
        number: 'Minor 01',
        title: 'Retail Operations EDA & Cleaning Report',
        brief: 'Clean a 50k-row sales dataset in Python and summarize seasonal margin patterns.',
        deliverables: ['Jupyter Notebook', 'Executive PDF summary'],
        defaultStatus: 'Reviewed',
        defaultFeedback: 'Strong missing-value diagnosis and clear visual takeaways. Approved by Ananya Deshmukh.',
      },
      {
        id: 'ds-m2',
        kind: 'Minor',
        number: 'Minor 02',
        title: 'SQL Revenue & Cohort Retention Queries',
        brief: 'Solve 12 analytical business scenarios using CTEs and window functions.',
        deliverables: ['SQL query script'],
        defaultStatus: 'Submitted',
      },
      {
        id: 'ds-m3',
        kind: 'Minor',
        number: 'Minor 03',
        title: 'Power BI Executive Revenue Cockpit',
        brief: 'Design a star-schema PBIX dashboard with custom DAX measures and drill-throughs.',
        deliverables: ['PBIX file + dashboard PDF'],
        defaultStatus: 'Not Started',
      },
      {
        id: 'ds-maj1',
        kind: 'Major',
        number: 'Major 01',
        title: 'Customer Churn Prediction & Retention Playbook',
        brief: 'Combine SQL cohort features, classification models, and ROI recommendations.',
        deliverables: ['Model notebook', 'Stakeholder slide deck'],
        defaultStatus: 'Not Started',
      },
      {
        id: 'ds-maj2',
        kind: 'Major',
        number: 'Major 02',
        title: 'End-to-End Business Intelligence & Forecasting Capstone',
        brief: 'Full pipeline from messy operational DB to automated forecast and BI dashboard.',
        deliverables: ['Deployed dashboard / repo', 'Final mentor defense'],
        defaultStatus: 'Not Started',
      },
    ],
    threads: [
      {
        id: 'ds-t1',
        category: 'Mentor Pinned',
        lectureRef: 'Lecture 04 · Power BI & DAX',
        author: 'Ananya Deshmukh',
        authorInitials: 'AD',
        timeAgo: '5h ago',
        pinned: true,
        title: 'Dataset & PBIX Starter Uploaded for Tomorrow’s Room 102 Session',
        body: 'Download the retail star-schema CSV pack before tomorrow 2:00 PM so we jump straight into DAX `CALCULATE` context exercises.',
        replies: [],
      },
      {
        id: 'ds-t2',
        category: 'Course Doubts',
        lectureRef: 'Lecture 02 · SQL Window Functions',
        author: 'Siva Yarra',
        authorInitials: 'SY',
        timeAgo: '1d ago',
        title: 'Why can’t I filter by a window function alias directly in WHERE?',
        body: 'My query failed when writing `WHERE rnk <= 3` in the same SELECT.',
        replies: [
          {
            id: 'ds-r2',
            author: 'Ananya Deshmukh',
            role: 'Mentor',
            timeAgo: '18h ago',
            body: 'SQL evaluates `WHERE` before window functions (`SELECT` phase). Wrap the window calculation in a CTE (`WITH ranked AS (...)`) and filter in the outer query!',
          },
        ],
      },
    ],
  },
};

const defaultLeads: AdmissionsLead[] = [
  {
    id: 'lead-seed-1',
    name: 'Priya Darshini',
    email: 'priya.d@example.com',
    phone: '+91 9848011223',
    program: 'Advanced Medical Coding',
    source: 'Contact Form',
    status: 'Counseling',
    createdAt: 'Today · 9:40 AM',
    notes: 'B.Pharm graduate looking for Ameerpet Lab 3 morning batch.',
  },
  {
    id: 'lead-seed-2',
    name: 'Harsha Vardhan',
    email: 'harsha.v@example.com',
    phone: '+91 9123456780',
    program: 'AI Full-Stack Development',
    source: 'Walk-In Counseling',
    status: 'New',
    createdAt: 'Yesterday · 4:15 PM',
    notes: 'Final year CSE student requesting weekend/weekday schedule details.',
  },
  {
    id: 'lead-seed-3',
    name: 'Sneha Reddy',
    email: 'sneha.r@example.com',
    phone: '+91 9988776655',
    program: 'Data Science & Analytics Mastery',
    source: 'Portal Signup',
    status: 'Enrolled',
    createdAt: 'Nov 25',
    notes: 'Enrolled in Batch #DS-11.',
  },
];

const defaultIssuedCertificates: IssuedCertificate[] = [
  {
    id: 'ATZ-2026-8492',
    studentName: 'Sample Learner Name',
    programTitle: 'AI Full-Stack Development',
    batchCode: 'Batch #FS-08',
    type: 'Course + Internship Completion',
    issuedDate: 'Nov 2026',
  },
  {
    id: 'ATZ-2026-8510',
    studentName: 'Mukul Chowdary',
    programTitle: 'Advanced Medical Coding',
    batchCode: 'Batch #MC-14',
    type: 'Course + Internship Completion',
    issuedDate: 'Nov 2026',
  },
];

export const STORAGE_KEYS = {
  session: 'atozenius_portal_session_v1',
  bookmarks: 'atozenius_portal_bookmarks_v1',
  revised: 'atozenius_portal_revised_v1',
  personalNotes: 'atozenius_portal_personal_notes_v1',
  submissions: 'atozenius_portal_submissions_v1',
  customThreads: 'atozenius_portal_custom_threads_v1',
  customReplies: 'atozenius_portal_custom_replies_v1',
  batchOverrides: 'atozenius_portal_batch_overrides_v1',
  lectureOverrides: 'atozenius_portal_lecture_overrides_v1',
  customLectures: 'atozenius_portal_custom_lectures_v1',
  projectReviews: 'atozenius_portal_project_reviews_v1',
  leads: 'atozenius_portal_leads_v1',
  issuedCertificates: 'atozenius_portal_certificates_v1',
  siteConfig: 'atozenius_portal_site_config_v1',
  provisionedStudents: 'atozenius_portal_provisioned_students_v1',
  teamAccess: 'atozenius_portal_team_access_v1',
  customCourses: 'atozenius_portal_custom_courses_v1',
  courseVisibility: 'atozenius_portal_course_visibility_v1',
  courseOverrides: 'atozenius_portal_course_overrides_v1',
  customMentors: 'atozenius_portal_custom_mentors_v1',
  mentorVisibility: 'atozenius_portal_mentor_visibility_v1',
  customStories: 'atozenius_portal_custom_stories_v1',
  storyVisibility: 'atozenius_portal_story_visibility_v1',
  customBlogPosts: 'atozenius_portal_custom_blog_v1',
  blogVisibility: 'atozenius_portal_blog_visibility_v1',
};

export const SITE_CONFIG_EVENT = 'atozenius-config-updated';

function emitSiteConfigChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SITE_CONFIG_EVENT));
  }
}

export const defaultSiteConfig: SiteControlConfig = {
  showDemoPreview: true,
  allowSelfSignupExplore: true,
  communityReadOnly: false,
  showCareersInHeader: true,
  announcementText: '',
  heroTaglinePrefix: 'Learn Better. Achieve Faster.',
  heroSubtitle:
    'Practical courses across IT, Pharma, Management & Agriculture—backed by 1-on-1 industry mentors, internships, and career placement support.',
  whatsappNumber: '+91 9502886626',
  linkedinUrl: 'https://www.linkedin.com/showcase/atozenius/',
  youtubeUrl: 'https://www.youtube.com/@AtoZenius',
  instagramUrl: 'https://www.instagram.com/atozenius',
};

const defaultTeamAccess: TeamMemberAccess[] = [
  {
    id: 'team-seed-admin',
    name: 'AtoZenius Founder',
    email: 'admin@atozenius.com',
    role: 'admin',
    assignedTrackId: 'ai-full-stack',
    addedAt: 'System Default',
  },
  {
    id: 'team-seed-staff',
    name: 'AtoZenius Operations Team',
    email: 'staff@atozenius.com',
    role: 'staff',
    assignedTrackId: 'ai-full-stack',
    addedAt: 'System Default',
  },
  {
    id: 'team-seed-mentor',
    name: 'Turpati Durga Prasad',
    email: 'mentor@atozenius.in',
    role: 'mentor',
    assignedTrackId: 'ai-full-stack',
    addedAt: 'System Default',
  },
  {
    id: 'team-seed-sairam',
    name: 'Sairam Lankadasari',
    email: 'sairam@faculty.atozenius.in',
    role: 'mentor',
    assignedTrackId: 'advanced-medical-coding',
    addedAt: 'System Default',
  },
];

const defaultProvisionedStudents: ProvisionedStudent[] = [
  {
    id: 'prov-seed-1',
    name: 'Sneha Reddy',
    email: 'sneha.r@example.com',
    phone: '+91 9988776655',
    trackId: 'data-science-analytics',
    batchCode: 'Batch #DS-11',
    tempPassword: 'ATZ-4821',
    status: 'Active',
    createdAt: 'Nov 25',
    source: 'WhatsApp Enrollment',
  },
];

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export function getSiteConfig(): SiteControlConfig {
  const saved = readStorage<Partial<SiteControlConfig> | null>(STORAGE_KEYS.siteConfig, null);
  return { ...defaultSiteConfig, ...(saved || {}) };
}

export function saveSiteConfig(patch: Partial<SiteControlConfig>): SiteControlConfig {
  const next = { ...getSiteConfig(), ...patch };
  writeStorage(STORAGE_KEYS.siteConfig, next);
  emitSiteConfigChange();
  return next;
}

export function getWhatsappDigits(config: SiteControlConfig = getSiteConfig()): string {
  const digits = config.whatsappNumber.replace(/\D/g, '');
  if (!digits) return '919502886626';
  return digits.length === 10 ? `91${digits}` : digits;
}

export function getSavedSession(): PortalSession | null {
  const saved = readStorage<Partial<PortalSession> | null>(STORAGE_KEYS.session, null);
  if (!saved || !saved.email) return null;
  const role: PortalRole = saved.role || 'student';
  const trackId =
    saved.trackId === undefined
      ? role === 'student'
        ? 'ai-full-stack'
        : 'ai-full-stack'
      : saved.trackId;
  return {
    name: saved.name || 'AtoZenius User',
    email: saved.email,
    initials: saved.initials || computeInitials(saved.name || 'AtoZenius'),
    role,
    trackId,
  };
}

export function saveSession(session: PortalSession | null): void {
  if (!session) {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.session);
    } catch {
      // Ignore
    }
    return;
  }
  writeStorage(STORAGE_KEYS.session, session);
}

export function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AZ';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getTeamAccessList(): TeamMemberAccess[] {
  const saved = readStorage<TeamMemberAccess[] | null>(STORAGE_KEYS.teamAccess, null);
  return saved ?? defaultTeamAccess;
}

export function addTeamMemberAccess(
  member: Omit<TeamMemberAccess, 'id' | 'addedAt'>
): TeamMemberAccess[] {
  const normalizedEmail = member.email.trim().toLowerCase();
  const current = getTeamAccessList().filter(
    (m) => m.email.trim().toLowerCase() !== normalizedEmail
  );
  const created: TeamMemberAccess = {
    ...member,
    email: normalizedEmail,
    id: `team-${Date.now()}`,
    addedAt: 'Just now',
  };
  const next = [created, ...current];
  writeStorage(STORAGE_KEYS.teamAccess, next);
  return next;
}

export function removeTeamMemberAccess(id: string): TeamMemberAccess[] {
  const next = getTeamAccessList().filter((m) => m.id !== id);
  writeStorage(STORAGE_KEYS.teamAccess, next);
  return next;
}

export function detectRoleFromEmail(
  email: string,
  fallbackTrackId: PortalTrackId | null = 'ai-full-stack'
): { role: PortalRole; trackId: PortalTrackId | null; suggestedName: string } {
  const normalized = email.trim().toLowerCase();
  const local = normalized.split('@')[0] || '';
  const domain = normalized.split('@')[1] || '';

  // 1. Live Team Access Registry takes priority
  const teamMatch = getTeamAccessList().find(
    (m) => m.email.trim().toLowerCase() === normalized
  );
  if (teamMatch) {
    return {
      role: teamMatch.role,
      trackId: teamMatch.assignedTrackId || fallbackTrackId || 'ai-full-stack',
      suggestedName: teamMatch.name,
    };
  }

  // 2. Admin / Founder / Owner detection
  if (/^(admin|founder|owner)/.test(local)) {
    return {
      role: 'admin',
      trackId: fallbackTrackId || 'ai-full-stack',
      suggestedName: 'AtoZenius Founder',
    };
  }

  // 3. Staff detection: @atozenius.com or staff/ops/admissions/placement prefix
  if (
    domain === 'atozenius.com' ||
    /^(staff|ops|admissions|placement)/.test(local)
  ) {
    return {
      role: 'staff',
      trackId: fallbackTrackId || 'ai-full-stack',
      suggestedName: 'AtoZenius Operations Team',
    };
  }

  // 4. Mentor detection: mentor/faculty prefix or faculty email domain or known mentor names
  if (
    domain === 'faculty.atozenius.in' ||
    /^(mentor|faculty|sairam|durga|turpati|ananya|aditya)/.test(local)
  ) {
    if (local.includes('sairam')) {
      return {
        role: 'mentor',
        trackId: 'advanced-medical-coding',
        suggestedName: 'Sairam Lankadasari',
      };
    }
    if (local.includes('ananya')) {
      return {
        role: 'mentor',
        trackId: 'data-science-analytics',
        suggestedName: 'Ananya Deshmukh',
      };
    }
    return {
      role: 'mentor',
      trackId: local.includes('durga') ? 'ai-full-stack' : fallbackTrackId || 'ai-full-stack',
      suggestedName: 'Turpati Durga Prasad',
    };
  }

  const formatted = local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    role: 'student',
    trackId: fallbackTrackId,
    suggestedName: formatted || 'AtoZenius Learner',
  };
}

export function resolveTrackIdFromProgram(program: string): PortalTrackId {
  const lower = program.toLowerCase();
  if (lower.includes('medical') || lower.includes('pharma') || lower.includes('clinical')) {
    return 'advanced-medical-coding';
  }
  if (lower.includes('data') || lower.includes('analytics') || lower.includes('bi')) {
    return 'data-science-analytics';
  }
  return 'ai-full-stack';
}

export function getProvisionedStudents(): ProvisionedStudent[] {
  const saved = readStorage<ProvisionedStudent[] | null>(
    STORAGE_KEYS.provisionedStudents,
    null
  );
  return saved ?? defaultProvisionedStudents;
}

function generateTempPassword(): string {
  const code = Math.floor(1000 + Math.random() * 9000);
  return `ATZ-${code}`;
}

export function provisionStudentAccount(params: {
  name: string;
  email: string;
  phone: string;
  trackId: PortalTrackId;
  source: ProvisionedStudent['source'];
}): ProvisionedStudent {
  const normalizedEmail = params.email.trim().toLowerCase();
  const current = getProvisionedStudents();
  const existing = current.find((s) => s.email.trim().toLowerCase() === normalizedEmail);
  const track = portalTracks[params.trackId];

  if (existing && existing.status === 'Active' && existing.trackId === params.trackId) {
    return existing;
  }

  const record: ProvisionedStudent = {
    id: existing?.id || `prov-${Date.now()}`,
    name: params.name.trim(),
    email: normalizedEmail,
    phone: params.phone.trim() || getSiteConfig().whatsappNumber,
    trackId: params.trackId,
    batchCode: track.batchCode,
    tempPassword: existing?.tempPassword || generateTempPassword(),
    status: 'Active',
    createdAt: existing?.createdAt || 'Just now',
    source: params.source,
  };

  const filtered = current.filter((s) => s.email.trim().toLowerCase() !== normalizedEmail);
  writeStorage(STORAGE_KEYS.provisionedStudents, [record, ...filtered]);
  return record;
}

export function findProvisionedStudentByEmail(email: string): ProvisionedStudent | undefined {
  const normalized = email.trim().toLowerCase();
  return getProvisionedStudents().find((s) => s.email.trim().toLowerCase() === normalized);
}

export function resetProvisionedStudentPassword(id: string): ProvisionedStudent[] {
  const updated = getProvisionedStudents().map((s) =>
    s.id === id ? { ...s, tempPassword: generateTempPassword(), status: 'Active' as const } : s
  );
  writeStorage(STORAGE_KEYS.provisionedStudents, updated);
  return updated;
}

export function updateProvisionedStudentBatch(
  id: string,
  trackId: PortalTrackId
): ProvisionedStudent[] {
  const batchCode = portalTracks[trackId].batchCode;
  const updated = getProvisionedStudents().map((s) =>
    s.id === id ? { ...s, trackId, batchCode } : s
  );
  writeStorage(STORAGE_KEYS.provisionedStudents, updated);
  return updated;
}

export function toggleProvisionedStudentStatus(id: string): ProvisionedStudent[] {
  const updated = getProvisionedStudents().map((s) =>
    s.id === id
      ? { ...s, status: (s.status === 'Active' ? 'Revoked' : 'Active') as 'Active' | 'Revoked' }
      : s
  );
  writeStorage(STORAGE_KEYS.provisionedStudents, updated);
  return updated;
}

export function claimBatchByCode(rawCode: string): PortalTrackId | null {
  const cleaned = rawCode.trim().toUpperCase();
  if (!cleaned) return null;

  // Match explicit batch codes like FS-08, MC-14, DS-11
  for (const id of allTrackIds) {
    const code = portalTracks[id].batchCode.toUpperCase(); // e.g. BATCH #FS-08
    const shortCode = code.replace('BATCH #', '');
    if (cleaned === code || cleaned === shortCode || cleaned === `#${shortCode}`) {
      return id;
    }
  }

  // Match provisioned ATZ-XXXX temp access password
  const provMatch = getProvisionedStudents().find(
    (s) => s.status === 'Active' && s.tempPassword.toUpperCase() === cleaned
  );
  if (provMatch) {
    return provMatch.trackId;
  }

  return null;
}

export function buildCredentialsWhatsAppUrl(params: {
  name: string;
  email: string;
  phone: string;
  batchCode: string;
  courseTitle: string;
  tempPassword: string;
}): string {
  const digits = params.phone.replace(/\D/g, '');
  const targetPhone =
    digits.length === 10
      ? `91${digits}`
      : digits || getWhatsappDigits();
  const portalUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/get-started` : 'https://atozenius.in/get-started';
  const msg = `Hi ${params.name}, welcome to AtoZenius (${params.courseTitle} · ${params.batchCode})!\n\nYour offline companion portal credentials:\nEmail: ${params.email}\nTemp Password: ${params.tempPassword}\nSign in here: ${portalUrl}`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
}

const categoryIconMap: Record<CourseCategory, CourseItem['icon']> = {
  'Advanced Courses': Cpu,
  IT: Code2,
  Pharma: Stethoscope,
  'Non IT & Management': Briefcase,
  Agriculture: Sprout,
};

export function getAllAdminCourses(): (CourseItem & { isHidden: boolean; isCustom?: boolean })[] {
  const visibility = readStorage<Record<string, boolean>>(STORAGE_KEYS.courseVisibility, {});
  const overrides = readStorage<Record<string, CourseOverride>>(STORAGE_KEYS.courseOverrides, {});
  const customList = readStorage<StoredCustomCourse[]>(STORAGE_KEYS.customCourses, []);

  const baseMapped = coursesData.map((c) => ({
    ...c,
    ...(overrides[c.id] || {}),
    isHidden: visibility[c.id] === false,
    isCustom: false,
  }));

  const customMapped = customList.map((c) => ({
    ...c,
    ...(overrides[c.id] || {}),
    icon: categoryIconMap[c.category] || Code2,
    isHidden: visibility[c.id] === false,
    isCustom: true,
  }));

  return [...customMapped, ...baseMapped];
}

export function getResolvedCourses(): CourseItem[] {
  return getAllAdminCourses().filter((c) => !c.isHidden);
}

export function toggleCourseVisibility(courseId: string): void {
  const visibility = readStorage<Record<string, boolean>>(STORAGE_KEYS.courseVisibility, {});
  const currentlyHidden = visibility[courseId] === false;
  writeStorage(STORAGE_KEYS.courseVisibility, {
    ...visibility,
    [courseId]: currentlyHidden ? true : false,
  });
  emitSiteConfigChange();
}

export function saveCourseOverride(courseId: string, patch: CourseOverride): void {
  const overrides = readStorage<Record<string, CourseOverride>>(STORAGE_KEYS.courseOverrides, {});
  writeStorage(STORAGE_KEYS.courseOverrides, {
    ...overrides,
    [courseId]: { ...(overrides[courseId] || {}), ...patch },
  });
  emitSiteConfigChange();
}

export function addCustomCourse(course: Omit<StoredCustomCourse, 'id'>): StoredCustomCourse {
  const current = readStorage<StoredCustomCourse[]>(STORAGE_KEYS.customCourses, []);
  const created: StoredCustomCourse = {
    ...course,
    id: `custom-course-${Date.now()}`,
  };
  writeStorage(STORAGE_KEYS.customCourses, [created, ...current]);
  emitSiteConfigChange();
  return created;
}

export function getAllAdminMentors(): (MentorItem & { isHidden: boolean; isCustom?: boolean })[] {
  const visibility = readStorage<Record<string, boolean>>(STORAGE_KEYS.mentorVisibility, {});
  const custom = readStorage<MentorItem[]>(STORAGE_KEYS.customMentors, []);
  const all = [
    ...custom.map((m) => ({ ...m, isCustom: true })),
    ...mentorsData.map((m) => ({ ...m, isCustom: false })),
  ];
  return all.map((m) => ({
    ...m,
    isHidden: visibility[m.id] === false,
  }));
}

export function getResolvedMentors(): MentorItem[] {
  return getAllAdminMentors().filter((m) => !m.isHidden);
}

export function toggleMentorVisibility(mentorId: string): void {
  const visibility = readStorage<Record<string, boolean>>(STORAGE_KEYS.mentorVisibility, {});
  const currentlyHidden = visibility[mentorId] === false;
  writeStorage(STORAGE_KEYS.mentorVisibility, {
    ...visibility,
    [mentorId]: currentlyHidden ? true : false,
  });
  emitSiteConfigChange();
}

export function addCustomMentor(
  mentor: Omit<MentorItem, 'id' | 'initials'>
): MentorItem {
  const current = readStorage<MentorItem[]>(STORAGE_KEYS.customMentors, []);
  const created: MentorItem = {
    ...mentor,
    id: `custom-mentor-${Date.now()}`,
    initials: computeInitials(mentor.name),
  };
  writeStorage(STORAGE_KEYS.customMentors, [created, ...current]);
  emitSiteConfigChange();
  return created;
}

export function getAllAdminStories(): (StudentStory & { isHidden: boolean; isCustom?: boolean })[] {
  const visibility = readStorage<Record<string, boolean>>(STORAGE_KEYS.storyVisibility, {});
  const custom = readStorage<StudentStory[]>(STORAGE_KEYS.customStories, []);
  const all = [
    ...custom.map((s) => ({ ...s, isCustom: true })),
    ...studentStories.map((s) => ({ ...s, isCustom: false })),
  ];
  return all.map((s) => ({
    ...s,
    isHidden: visibility[s.id] === false,
  }));
}

export function getResolvedStories(): StudentStory[] {
  return getAllAdminStories().filter((s) => !s.isHidden);
}

export function toggleStoryVisibility(storyId: string): void {
  const visibility = readStorage<Record<string, boolean>>(STORAGE_KEYS.storyVisibility, {});
  const currentlyHidden = visibility[storyId] === false;
  writeStorage(STORAGE_KEYS.storyVisibility, {
    ...visibility,
    [storyId]: currentlyHidden ? true : false,
  });
  emitSiteConfigChange();
}

export function addCustomStory(
  story: Omit<StudentStory, 'id' | 'initials'>
): StudentStory {
  const current = readStorage<StudentStory[]>(STORAGE_KEYS.customStories, []);
  const created: StudentStory = {
    ...story,
    id: `custom-story-${Date.now()}`,
    initials: computeInitials(story.name),
  };
  writeStorage(STORAGE_KEYS.customStories, [created, ...current]);
  emitSiteConfigChange();
  return created;
}

export function getAllAdminBlogPosts(): (BlogPost & { isHidden: boolean; isCustom?: boolean })[] {
  const visibility = readStorage<Record<string, boolean>>(STORAGE_KEYS.blogVisibility, {});
  const custom = readStorage<BlogPost[]>(STORAGE_KEYS.customBlogPosts, []);
  const all = [
    ...custom.map((p) => ({ ...p, isCustom: true })),
    ...blogPosts.map((p) => ({ ...p, isCustom: false })),
  ];
  return all.map((p) => ({
    ...p,
    isHidden: visibility[p.id] === false,
  }));
}

export function getResolvedBlogPosts(): BlogPost[] {
  return getAllAdminBlogPosts().filter((p) => !p.isHidden);
}

export function toggleBlogVisibility(postId: string): void {
  const visibility = readStorage<Record<string, boolean>>(STORAGE_KEYS.blogVisibility, {});
  const currentlyHidden = visibility[postId] === false;
  writeStorage(STORAGE_KEYS.blogVisibility, {
    ...visibility,
    [postId]: currentlyHidden ? true : false,
  });
  emitSiteConfigChange();
}

export function addCustomBlogPost(post: Omit<BlogPost, 'id'>): BlogPost {
  const current = readStorage<BlogPost[]>(STORAGE_KEYS.customBlogPosts, []);
  const created: BlogPost = {
    ...post,
    id: `custom-post-${Date.now()}`,
  };
  writeStorage(STORAGE_KEYS.customBlogPosts, [created, ...current]);
  emitSiteConfigChange();
  return created;
}

export function getResolvedTrackData(trackId: PortalTrackId): PortalTrackData {
  const base = portalTracks[trackId];
  const batchOverrides = readStorage<Record<string, BatchOverride>>(
    STORAGE_KEYS.batchOverrides,
    {}
  );
  const lectureOverrides = readStorage<Record<string, LectureOverride>>(
    STORAGE_KEYS.lectureOverrides,
    {}
  );
  const customLecturesMap = readStorage<Record<string, LectureNote[]>>(
    STORAGE_KEYS.customLectures,
    {}
  );
  const customThreadsMap = readStorage<Record<string, CommunityThread[]>>(
    STORAGE_KEYS.customThreads,
    {}
  );
  const customRepliesMap = readStorage<Record<string, CommunityReply[]>>(
    STORAGE_KEYS.customReplies,
    {}
  );

  const bOverride = batchOverrides[trackId] || {};
  const mergedLectures = [
    ...base.lectures.map((lec) => ({
      ...lec,
      ...(lectureOverrides[lec.id] || {}),
    })),
    ...(customLecturesMap[trackId] || []).map((lec) => ({
      ...lec,
      ...(lectureOverrides[lec.id] || {}),
    })),
  ];

  const mergedThreads = [
    ...(customThreadsMap[trackId] || []),
    ...base.threads,
  ].map((t) => ({
    ...t,
    replies: [...t.replies, ...(customRepliesMap[t.id] || [])],
  }));

  return {
    ...base,
    ...bOverride,
    lectures: mergedLectures,
    threads: mergedThreads,
  };
}

export function postBatchThread(trackId: PortalTrackId, thread: CommunityThread): void {
  const existing = readStorage<Record<string, CommunityThread[]>>(
    STORAGE_KEYS.customThreads,
    {}
  );
  writeStorage(STORAGE_KEYS.customThreads, {
    ...existing,
    [trackId]: [thread, ...(existing[trackId] || [])],
  });
}

export function postBatchReply(threadId: string, reply: CommunityReply): void {
  const existing = readStorage<Record<string, CommunityReply[]>>(
    STORAGE_KEYS.customReplies,
    {}
  );
  writeStorage(STORAGE_KEYS.customReplies, {
    ...existing,
    [threadId]: [...(existing[threadId] || []), reply],
  });
}

export function getAdmissionsLeads(): AdmissionsLead[] {
  const saved = readStorage<AdmissionsLead[] | null>(STORAGE_KEYS.leads, null);
  return saved ?? defaultLeads;
}

export function addAdmissionsLead(
  lead: Omit<AdmissionsLead, 'id' | 'status' | 'createdAt'> & {
    status?: AdmissionsLead['status'];
  }
): AdmissionsLead {
  const current = getAdmissionsLeads();
  const next: AdmissionsLead = {
    ...lead,
    id: `lead-${Date.now()}`,
    status: lead.status ?? 'New',
    createdAt: 'Just now',
  };
  writeStorage(STORAGE_KEYS.leads, [next, ...current]);
  return next;
}

export function updateAdmissionsLeadStatus(
  id: string,
  status: AdmissionsLead['status']
): AdmissionsLead[] {
  const updated = getAdmissionsLeads().map((l) => (l.id === id ? { ...l, status } : l));
  writeStorage(STORAGE_KEYS.leads, updated);
  return updated;
}

export function getIssuedCertificates(): IssuedCertificate[] {
  const saved = readStorage<IssuedCertificate[] | null>(
    STORAGE_KEYS.issuedCertificates,
    null
  );
  return saved ?? defaultIssuedCertificates;
}

export function issueNewCertificate(
  cert: Omit<IssuedCertificate, 'id' | 'issuedDate'>
): IssuedCertificate {
  const current = getIssuedCertificates();
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const created: IssuedCertificate = {
    ...cert,
    id: `ATZ-2026-${randomCode}`,
    issuedDate: 'Nov 2026',
  };
  writeStorage(STORAGE_KEYS.issuedCertificates, [created, ...current]);
  return created;
}

export function verifyCertificateById(id: string): IssuedCertificate | undefined {
  const cleaned = id.trim().toUpperCase();
  return getIssuedCertificates().find((c) => c.id.toUpperCase() === cleaned);
}
