import React from 'react';
import {
  Cpu,
  Code2,
  ShieldCheck,
  BarChart3,
  Stethoscope,
  Megaphone,
  Sprout,
  Terminal,
  Coffee,
  Briefcase,
  FlaskConical,
} from 'lucide-react';

export type CourseCategory =
  | 'IT'
  | 'Pharma'
  | 'Non IT & Management'
  | 'Agriculture'
  | 'Advanced Courses';

export interface CourseItem {
  id: string;
  title: string;
  category: CourseCategory;
  tag: string;
  level: 'Beginner to Pro' | 'Intermediate' | 'Advanced';
  duration: string;
  minorProjects: number;
  majorProjects: number;
  description: string;
  skills: string[];
  curriculum: string[];
  outcomes: string[];
  whatsappQuery: string;
  icon: React.ElementType;
}

export const courseCategories: ('All' | CourseCategory)[] = [
  'All',
  'IT',
  'Pharma',
  'Non IT & Management',
  'Agriculture',
  'Advanced Courses',
];

export const coursesData: CourseItem[] = [
  {
    id: 'advanced-ai-ml',
    title: 'Advanced AI & Machine Learning',
    category: 'Advanced Courses',
    tag: 'Artificial Intelligence',
    level: 'Advanced',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Master supervised and unsupervised learning, deep neural networks, NLP, and Generative AI workflows built around live industry datasets.',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'Generative AI'],
    curriculum: [
      'Python for Data Science, NumPy & Pandas Foundations',
      'Feature Engineering, Regression, Classification & Ensemble Models',
      'Deep Learning with Neural Networks, CNNs & Transformers',
      'Generative AI, Prompt Engineering & Model Deployment Capstones',
    ],
    outcomes: [
      'Build 3 minor ML models & 2 end-to-end production AI major projects',
      'Earn Course Completion & Internship Completion Certificates',
    ],
    whatsappQuery: 'Advanced AI & Machine Learning Program',
    icon: Cpu,
  },
  {
    id: 'ai-full-stack',
    title: 'AI Full-Stack Development',
    category: 'IT',
    tag: 'Information Technology',
    level: 'Intermediate',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Architect modern full-stack web applications powered by React, scalable backend APIs, databases, and integrated AI capabilities.',
    skills: ['TypeScript', 'React', 'Node.js', 'AI APIs', 'SQL'],
    curriculum: [
      'Modern HTML, CSS, Tailwind & Responsive UI Architecture',
      'React State Management, Routing & Component Engineering',
      'REST APIs, Authentication, Database Design & Cloud Hosting',
      'Integrating LLM Workflows & Deploying Production Web Apps',
    ],
    outcomes: [
      'Ship deployed full-stack apps with mentor code reviews',
      'Qualify for Full-Stack Developer & AI Engineer roles',
    ],
    whatsappQuery: 'AI Full-Stack Development Program',
    icon: Code2,
  },
  {
    id: 'advanced-medical-coding',
    title: 'Advanced Medical Coding',
    category: 'Pharma',
    tag: 'Pharma & Healthcare',
    level: 'Beginner to Pro',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Comprehensive training in ICD-10-CM, CPT, and HCPCS coding standards with dedicated CPC exam preparation and real clinical chart practice.',
    skills: ['ICD-10-CM', 'CPT', 'HCPCS', 'CPC Prep', 'Medical Terminology'],
    curriculum: [
      'Human Anatomy, Physiology & Medical Terminology',
      'ICD-10-CM Diagnostic Coding Rules & Case Scenarios',
      'CPT Procedural Coding & HCPCS Level II Modifiers',
      'Mock Audits, Real Patient Chart Projects & CPC Exam Prep',
    ],
    outcomes: [
      'Hands-on clinical coding audits with M.Pharm, CPC mentors',
      'Course + Internship Completion Certificates for healthcare hiring',
    ],
    whatsappQuery: 'Advanced Medical Coding Program',
    icon: Stethoscope,
  },
  {
    id: 'data-science-analytics',
    title: 'Data Science & Analytics Mastery',
    category: 'IT',
    tag: 'Data Science',
    level: 'Beginner to Pro',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Turn raw business data into executive insights with SQL, Python, Power BI, statistical analysis, and predictive modeling.',
    skills: ['Python', 'SQL', 'Power BI', 'Statistics', 'Tableau'],
    curriculum: [
      'Excel, SQL Querying & Relational Data Modeling',
      'Exploratory Data Analysis & Visualization with Python',
      'Interactive Business Dashboards in Power BI',
      'Predictive Modeling & Business Storytelling Capstones',
    ],
    outcomes: [
      'Portfolio of live BI dashboards and analytical case studies',
      'Placement prep for Data Analyst & Business Analyst interviews',
    ],
    whatsappQuery: 'Data Science & Analytics Mastery Program',
    icon: BarChart3,
  },
  {
    id: 'cyber-security-essentials',
    title: 'Cyber Security Essentials',
    category: 'IT',
    tag: 'Cyber Security',
    level: 'Intermediate',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Learn network defense, vulnerability assessment, ethical hacking fundamentals, and SOC monitoring through guided security labs.',
    skills: ['Network Security', 'Linux', 'VAPT', 'SIEM', 'OWASP Top 10'],
    curriculum: [
      'Networking Protocols, Linux Security & Threat Landscapes',
      'Web Application Security & OWASP Vulnerability Testing',
      'Incident Response, Log Analysis & SIEM Monitoring',
      'Simulated Security Audit & Penetration Testing Capstones',
    ],
    outcomes: [
      'Hands-on vulnerability reports and defensive hardening labs',
      'Readiness for SOC Analyst & Junior Security Engineer tracks',
    ],
    whatsappQuery: 'Cyber Security Essentials Program',
    icon: ShieldCheck,
  },
  {
    id: 'python-full-stack',
    title: 'Python Full Stack & Internship Track',
    category: 'IT',
    tag: 'Software Development',
    level: 'Beginner to Pro',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Step-by-step mastery of Python, Django/FastAPI backends, responsive frontends, and database-driven web applications.',
    skills: ['Python', 'Django', 'React', 'PostgreSQL', 'REST APIs'],
    curriculum: [
      'Core Python Programming, OOP & Problem Solving',
      'Frontend Craft with HTML, CSS, JavaScript & React',
      'Django / FastAPI Backend Architecture & ORM',
      'End-to-End Capstone Deployment & Internship Assessment',
    ],
    outcomes: [
      'Course & Internship Completion Certificates backed by projects',
      'Dedicated placement training and mock technical interviews',
    ],
    whatsappQuery: 'Python Full Stack Program',
    icon: Terminal,
  },
  {
    id: 'java-full-stack',
    title: 'Java Full Stack Engineering',
    category: 'IT',
    tag: 'Enterprise Engineering',
    level: 'Beginner to Pro',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Build enterprise-grade backend services with Core Java, Spring Boot, microservices, and modern frontend interfaces.',
    skills: ['Java', 'Spring Boot', 'Microservices', 'SQL', 'React'],
    curriculum: [
      'Core Java, Collections, Multithreading & DSA Foundations',
      'Spring Boot, JPA/Hibernate & RESTful Web Services',
      'Frontend Integration & Responsive UI Workflows',
      'Enterprise Capstone Project & Placement Readiness Drills',
    ],
    outcomes: [
      'Production-style Spring Boot + React capstone project',
      'Structured placement training and hiring partner referrals',
    ],
    whatsappQuery: 'Java Full Stack Program',
    icon: Coffee,
  },
  {
    id: 'clinical-research-pv',
    title: 'Clinical Research & Pharmacovigilance',
    category: 'Pharma',
    tag: 'Clinical & Regulatory',
    level: 'Intermediate',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Gain practical expertise in ICH-GCP guidelines, clinical trial operations, adverse event case processing, and drug safety reporting.',
    skills: ['ICH-GCP', 'Pharmacovigilance', 'ICSR', 'Clinical Trials', 'Regulatory'],
    curriculum: [
      'Drug Development Lifecycle & Clinical Trial Phases',
      'ICH-GCP Compliance, Protocols & Ethics Documentation',
      'Pharmacovigilance, ICSR Processing & Signal Detection',
      'Case Narrative Drafting & Regulatory Submission Projects',
    ],
    outcomes: [
      'Real-world safety case processing portfolio',
      'Preparation for Clinical Research Associate & Drug Safety roles',
    ],
    whatsappQuery: 'Clinical Research & Pharmacovigilance Program',
    icon: FlaskConical,
  },
  {
    id: 'digital-marketing-pro',
    title: 'Digital Marketing Pro',
    category: 'Non IT & Management',
    tag: 'Growth & Marketing',
    level: 'Beginner to Pro',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Plan and execute high-converting performance marketing, SEO, content strategy, and analytics campaigns across real brand funnels.',
    skills: ['SEO', 'Performance Ads', 'Meta & Google Ads', 'GA4', 'Content Strategy'],
    curriculum: [
      'Digital Funnel Strategy, Positioning & Audience Research',
      'Technical & On-Page SEO with Search Console',
      'Paid Acquisition on Google Ads & Meta Ads Manager',
      'Campaign Attribution, Analytics & Live Brand Capstone',
    ],
    outcomes: [
      'Launch and measure real multi-channel campaign plans',
      'Build proof-of-work case studies for marketing teams',
    ],
    whatsappQuery: 'Digital Marketing Pro Program',
    icon: Megaphone,
  },
  {
    id: 'business-hr-analytics',
    title: 'Business Analytics, Finance & HR Management',
    category: 'Non IT & Management',
    tag: 'Management & Operations',
    level: 'Intermediate',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Bridge management decision-making with practical KPI dashboards, people analytics, financial modeling, and operational strategy.',
    skills: ['Business Analytics', 'HR Operations', 'Financial Modeling', 'Excel', 'Reporting'],
    curriculum: [
      'Management Metrics, Forecasting & Financial Statements',
      'Talent Lifecycle, HR Compliance & People Analytics',
      'Operational Dashboards & Executive Reporting',
      'Cross-Functional Case Study & Capstone Presentation',
    ],
    outcomes: [
      'Ready-to-present business & HR analytics portfolio',
      'Interview preparation for Analyst, HR & Operations roles',
    ],
    whatsappQuery: 'Business Analytics, Finance & HR Program',
    icon: Briefcase,
  },
  {
    id: 'agritech-analytics',
    title: 'AgriTech & Agricultural Data Analytics',
    category: 'Agriculture',
    tag: 'Modern Agriculture',
    level: 'Intermediate',
    duration: '3-4 Months',
    minorProjects: 3,
    majorProjects: 2,
    description:
      'Apply precision agriculture, AI crop-monitoring concepts, supply-chain analytics, and agribusiness intelligence to modern farming.',
    skills: ['AgriTech', 'AI in Agriculture', 'Agribusiness', 'Data Analytics', 'Supply Chain'],
    curriculum: [
      'Agribusiness Value Chains & Modern Farm Operations',
      'Remote Sensing, Soil & Yield Data Fundamentals',
      'AI & Predictive Analytics for Crop & Weather Insights',
      'Agri-Supply Chain Optimization Capstone Project',
    ],
    outcomes: [
      'Practical agribusiness & precision-ag analytics projects',
      'Career readiness for AgriTech startups and rural supply firms',
    ],
    whatsappQuery: 'AgriTech & Agricultural Data Analytics Program',
    icon: Sprout,
  },
];
