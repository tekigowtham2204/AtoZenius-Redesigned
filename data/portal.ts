export type PortalTrackId = 'ai-full-stack' | 'advanced-medical-coding' | 'data-science-analytics';

export interface StudentSession {
  name: string;
  email: string;
  initials: string;
  trackId: PortalTrackId;
}

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

const STORAGE_KEYS = {
  session: 'atozenius_portal_session_v1',
  bookmarks: 'atozenius_portal_bookmarks_v1',
  revised: 'atozenius_portal_revised_v1',
  personalNotes: 'atozenius_portal_personal_notes_v1',
  submissions: 'atozenius_portal_submissions_v1',
  customThreads: 'atozenius_portal_custom_threads_v1',
  customReplies: 'atozenius_portal_custom_replies_v1',
};

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

export function getSavedSession(): StudentSession | null {
  return readStorage<StudentSession | null>(STORAGE_KEYS.session, null);
}

export function saveSession(session: StudentSession | null): void {
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

export { STORAGE_KEYS };
