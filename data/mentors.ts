export type MentorSpecialty =
  | 'All'
  | 'IT & Engineering'
  | 'AI & Data'
  | 'Pharma & Healthcare'
  | 'Management & Growth'
  | 'AgriTech';

export interface MentorItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  specialty: Exclude<MentorSpecialty, 'All'>;
  experience: string;
  rating: string;
  sessions: number;
  bio: string;
  tags: string[];
  initials: string;
  linkedinUrl?: string;
}

export const mentorSpecialties: MentorSpecialty[] = [
  'All',
  'IT & Engineering',
  'AI & Data',
  'Pharma & Healthcare',
  'Management & Growth',
  'AgriTech',
];

export const mentorsData: MentorItem[] = [
  {
    id: 'sairam-lankadasari',
    name: 'Sairam Lankadasari',
    role: 'Medical Coding Mentor (M.Pharm, CPC)',
    organization: 'AtoZenius Healthcare Faculty',
    specialty: 'Pharma & Healthcare',
    experience: '8+ yrs',
    rating: '5.0',
    sessions: 320,
    bio: 'Certified Professional Coder (CPC) and M.Pharm specialist guiding learners through ICD-10-CM, CPT, HCPCS, and clinical audit workflows with clarity.',
    tags: ['ICD-10-CM', 'CPT & HCPCS', 'CPC Exam Prep'],
    initials: 'SL',
    linkedinUrl: 'https://www.linkedin.com/in/sairam-lankadasari-m-pharm-cpc-a59837168',
  },
  {
    id: 'aditya-venugopal',
    name: 'Aditya Venugopal',
    role: 'Industry Mentor & Career Advisor',
    organization: 'AtoZenius Leadership & Tech',
    specialty: 'IT & Engineering',
    experience: '10+ yrs',
    rating: '4.98',
    sessions: 245,
    bio: 'Mentors students and early-career engineers on production engineering standards, technical problem solving, and career transitions into high-growth teams.',
    tags: ['Software Architecture', 'Career Roadmaps', 'Mock Interviews'],
    initials: 'AV',
    linkedinUrl: 'https://www.linkedin.com/in/aditya-venugopal-a18709127',
  },
  {
    id: 'turpati-durga-prasad',
    name: 'Turpati Durga Prasad',
    role: 'Full-Stack & Systems Mentor',
    organization: 'AtoZenius Engineering Track',
    specialty: 'IT & Engineering',
    experience: '9+ yrs',
    rating: '4.97',
    sessions: 210,
    bio: 'Coaches Python and Java Full-Stack cohorts on clean backend design, REST APIs, database modeling, and deployment-ready capstone projects.',
    tags: ['Python & Java', 'Full-Stack', 'Project Reviews'],
    initials: 'TD',
    linkedinUrl: 'https://www.linkedin.com/in/turpati-durga-prasad',
  },
  {
    id: 'ananya-deshmukh',
    name: 'Ananya Deshmukh',
    role: 'Applied AI & Data Science Lead',
    organization: 'AtoZenius AI & Data Faculty',
    specialty: 'AI & Data',
    experience: '8+ yrs',
    rating: '4.96',
    sessions: 164,
    bio: 'Specializes in machine learning pipelines, SQL/Power BI analytics, and practical Generative AI applications for real-world business problems.',
    tags: ['Machine Learning', 'Generative AI', 'Data Analytics'],
    initials: 'AD',
  },
  {
    id: 'karthik-nair',
    name: 'Karthik Nair',
    role: 'Growth Marketing & Management Coach',
    organization: 'AtoZenius Management Track',
    specialty: 'Management & Growth',
    experience: '10+ yrs',
    rating: '4.95',
    sessions: 138,
    bio: 'Guides Non-IT, Digital Marketing, HR, and Business Analytics learners on campaign strategy, KPI storytelling, and portfolio interviews.',
    tags: ['Digital Marketing', 'Business Analytics', 'HR & Strategy'],
    initials: 'KN',
  },
  {
    id: 'raghav-reddy',
    name: 'Dr. Raghav Reddy',
    role: 'AgriTech & Data Systems Specialist',
    organization: 'AtoZenius Agriculture Track',
    specialty: 'AgriTech',
    experience: '11+ yrs',
    rating: '4.97',
    sessions: 92,
    bio: 'Works at the intersection of modern agriculture, crop telemetry, and supply-chain analytics, mentoring students entering AgriTech careers.',
    tags: ['AgriTech', 'AI in Agriculture', 'Agribusiness'],
    initials: 'RR',
  },
];
