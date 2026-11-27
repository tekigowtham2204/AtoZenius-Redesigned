export type BlogCategory = 'All' | 'AI & Tech' | 'Pharma & Healthcare' | 'Career Growth' | 'Mentorship';

export interface BlogPost {
  id: string;
  title: string;
  category: Exclude<BlogCategory, 'All'>;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  sections: { heading: string; body: string }[];
  keyTakeaways: string[];
}

export const blogCategories: BlogCategory[] = [
  'All',
  'AI & Tech',
  'Pharma & Healthcare',
  'Career Growth',
  'Mentorship',
];

export const blogPosts: BlogPost[] = [
  {
    id: 'projects-over-passive-certificates',
    title: 'Why Minor & Major Projects Matter More Than Passive Course Videos',
    category: 'Career Growth',
    date: 'Nov 20, 2026',
    readTime: '5 min read',
    author: 'AtoZenius Curriculum Team',
    excerpt:
      'Hiring teams test what you have actually built and debugged. Here is how combining 3 minor and 2 major capstone projects changes interview outcomes.',
    sections: [
      {
        heading: 'The Gap Between Watching and Shipping',
        body: 'Thousands of graduates complete video playlists every month yet freeze when asked to explain architectural trade-offs or debug an unfamiliar requirement. Passive viewing creates familiarity, not engineering fluency.',
      },
      {
        heading: 'How Structured Project Escalation Works',
        body: 'Inside every AtoZenius track, learners start with 3 focused minor projects to isolate core skills—such as API routing, SQL querying, or diagnostic coding—before uniting everything inside 2 production-scale major projects reviewed by an industry mentor.',
      },
      {
        heading: 'Turning Projects into Interview Leverage',
        body: 'When you walk into a technical or domain interview with deployed deliverables and internship experience, conversations shift from trivia quizzes to real discussions about your design decisions.',
      },
    ],
    keyTakeaways: [
      'Isolate fundamentals first with targeted minor builds.',
      'Combine backend, frontend, and data workflows in major capstones.',
      'Document architecture choices clearly for hiring managers.',
    ],
  },
  {
    id: 'medical-coding-cpc-roadmap',
    title: 'Breaking Into Medical Coding: Mastering ICD-10-CM, CPT & HCPCS for the CPC Exam',
    category: 'Pharma & Healthcare',
    date: 'Nov 14, 2026',
    readTime: '6 min read',
    author: 'Sairam Lankadasari, M.Pharm, CPC',
    excerpt:
      'A practical guide for pharmacy and life-science graduates aiming to launch stable healthcare careers in medical coding and clinical auditing.',
    sections: [
      {
        heading: 'Understanding the Three Core Code Sets',
        body: 'Medical coders translate clinical documentation into standardized codes. ICD-10-CM captures diagnoses, CPT describes medical and surgical procedures, and HCPCS Level II covers supplies, equipment, and specialized services.',
      },
      {
        heading: 'Anatomy & Terminology Come First',
        body: 'Memorizing code numbers without understanding clinical pathology slows you down under timed exam conditions. Strong anatomical foundations let you locate accurate codes rapidly during CPC certification tests.',
      },
      {
        heading: 'Practice on Real Clinical Scenarios',
        body: 'Working through real medical charts alongside CPC-certified mentors helps bridge textbook rules with payer guidelines, modifiers, and compliance checks expected by healthcare employers.',
      },
    ],
    keyTakeaways: [
      'Build solid anatomy and pathology fluency before timed drills.',
      'Focus on official ICD-10-CM chapter guidelines and modifiers.',
      'Pair course completion with practical internship audit charts.',
    ],
  },
  {
    id: 'ai-fullstack-career-shift',
    title: 'What Full-Stack Hiring Managers Expect in the Era of Applied AI',
    category: 'AI & Tech',
    date: 'Nov 08, 2026',
    readTime: '6 min read',
    author: 'Aditya Venugopal',
    excerpt:
      'Modern full-stack roles combine solid TypeScript, backend APIs, and database fundamentals with practical LLM integration and evaluation.',
    sections: [
      {
        heading: 'Core Software Craft Still Wins',
        body: 'AI coding tools speed up boilerplate, which means teams value engineers who understand clean state management, secure authentication, relational schemas, and error handling even more.',
      },
      {
        heading: 'Integrating AI Safely into Products',
        body: 'Instead of treating AI as magic, full-stack developers need to design streaming responses, latency budgets, structured outputs, and clear fallback states.',
      },
      {
        heading: 'Demonstrating Ownership',
        body: 'Candidates who pair Python or Node/Java backends with crisp frontend interfaces and clear deployment pipelines stand out immediately during campus and lateral hiring.',
      },
    ],
    keyTakeaways: [
      'Strong fundamentals in SQL, APIs, and React/TypeScript remain essential.',
      'Learn structured prompting, streaming UX, and validation patterns.',
      'Deploy live demos instead of keeping code only on localhost.',
    ],
  },
  {
    id: 'mentor-led-interview-prep',
    title: 'How 1-on-1 Mentorship Cuts Months Off Your Job Search',
    category: 'Mentorship',
    date: 'Oct 29, 2026',
    readTime: '4 min read',
    author: 'Turpati Durga Prasad',
    excerpt:
      'Blindly applying to hundreds of listings drains momentum. Structured feedback on your code, resume, and mock interviews turns effort into offers.',
    sections: [
      {
        heading: 'Spotting Blind Spots Early',
        body: 'Most learners do not realize why their applications stall. Sometimes it is missing live project links; other times it is rushing explanations during technical screening.',
      },
      {
        heading: 'Making Every Mentor Session Count',
        body: 'Bring specific code snippets, architecture questions, or resume bullets to each session. Honest critique from experienced operators saves weeks of trial and error.',
      },
    ],
    keyTakeaways: [
      'Ask for actionable code and resume critiques early.',
      'Practice explaining trade-offs out loud in mock interviews.',
      'Iterate weekly until your portfolio proves readiness.',
    ],
  },
];
