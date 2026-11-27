import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Mail,
  HelpCircle,
  FileText,
  Shield,
  BookOpen,
  MessageSquare,
  Award,
} from 'lucide-react';
import { ViewState } from '../types';

export type InfoPageType =
  | 'faqs'
  | 'help-center'
  | 'refund-policy'
  | 'privacy-policy'
  | 'terms';

interface InfoPageProps {
  page: InfoPageType;
  onNavigate: (view: ViewState) => void;
}

const faqsList = [
  {
    q: 'How do AtoZenius programs differ from regular video courses?',
    a: 'Every flagship program blends live expert-led training with 3 minor projects and 2 mentor-reviewed major capstones, plus internship and placement preparation—rather than leaving you alone with passive videos.',
  },
  {
    q: 'What course domains does AtoZenius offer?',
    a: 'We offer structured tracks across IT & Software (AI Full-Stack, Python Full Stack, Java Full Stack, Data Science, Cyber Security), Pharma & Healthcare (Advanced Medical Coding, Clinical Research & Pharmacovigilance), Non-IT & Management (Digital Marketing, Business Analytics, HR, Finance), and Agriculture (AgriTech & Data Analytics).',
  },
  {
    q: 'How does 1-on-1 mentorship work?',
    a: 'Learners receive dedicated mentor support for doubt resolution, code and project feedback, CPC/interview readiness, and career roadmap guidance throughout their 3–4 month cohort.',
  },
  {
    q: 'What certificates do graduates receive?',
    a: 'Upon completing the coursework and required minor/major projects, students receive both a Course Completion Certificate and an Internship Completion Certificate.',
  },
  {
    q: 'Do you provide internship and placement support?',
    a: 'Yes. We prepare learners with resume workshops, mock technical and domain interviews, and direct introductions to hiring partner opportunities.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Eligible enrollments are covered under a 14-day refund window as outlined on our Refund Policy page. Contact our admissions team with your registration details for assistance.',
  },
];

const InfoPage: React.FC<InfoPageProps> = ({ page, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        {page === 'faqs' && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
              Support
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              Frequently Asked <span className="text-brand-accent">Questions.</span>
            </h1>
            <p className="text-lg text-brand-dark/65 mb-10">
              Clear answers about AtoZenius programs, minor/major projects, mentorship, internships, and certificates.
            </p>
            <div className="space-y-4">
              {faqsList.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={item.q}
                    className="bg-white rounded-[1.5rem] border border-brand-dark/5 shadow-sm overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-brand-dark"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-brand-dark/50 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-brand-dark/70 text-sm leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {page === 'help-center' && (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
              Learner Support
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              Help <span className="text-brand-accent">Center.</span>
            </h1>
            <p className="text-lg text-brand-dark/65 mb-10">
              Quick pathways for enrollment help, mentor scheduling, certificates, and admissions support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: HelpCircle,
                  title: 'Account & Portal Login',
                  desc: 'Sign in, request cohort onboarding, or reach student support for account updates.',
                  action: () => onNavigate('auth'),
                  label: 'Go to Login',
                },
                {
                  icon: MessageSquare,
                  title: 'Mentor Guidance & Doubt Support',
                  desc: 'Browse faculty mentors across IT, Pharma, Management, and AgriTech or book a session.',
                  action: () => onNavigate('mentors'),
                  label: 'Browse Mentors',
                },
                {
                  icon: BookOpen,
                  title: 'Courses & Project Syllabus',
                  desc: 'Review full module breakdowns, minor/major projects, and program durations.',
                  action: () => onNavigate('courses'),
                  label: 'View All Courses',
                },
                {
                  icon: Award,
                  title: 'Certificates & Verification',
                  desc: 'Learn how Course Completion and Internship Completion credentials are issued and verified.',
                  action: () => onNavigate('certifications'),
                  label: 'View Certifications',
                },
                {
                  icon: Mail,
                  title: 'Admissions & Billing Help',
                  desc: 'Connect directly with our team by form or WhatsApp (+91 9502886626).',
                  action: () => onNavigate('contact'),
                  label: 'Contact Support',
                },
                {
                  icon: FileText,
                  title: 'Refund Eligibility',
                  desc: 'Read our transparent 14-day refund policy and processing timelines.',
                  action: () => onNavigate('refund-policy'),
                  label: 'Read Refund Policy',
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <Icon size={24} className="text-brand-accent mb-4" />
                      <h2 className="text-xl font-bold text-brand-dark mb-2">{card.title}</h2>
                      <p className="text-brand-dark/65 text-sm mb-6 leading-relaxed">{card.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={card.action}
                      className="text-sm font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
                    >
                      {card.label} <ArrowRight size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(page === 'refund-policy' || page === 'privacy-policy' || page === 'terms') && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">
              {page === 'privacy-policy' ? <Shield size={15} /> : <FileText size={15} />}
              <span>AtoZenius Private Limited • Legal &amp; Policies</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              {page === 'refund-policy' && 'Refund Policy'}
              {page === 'privacy-policy' && 'Privacy Policy'}
              {page === 'terms' && 'Terms & Conditions'}
            </h1>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-brand-dark/5 shadow-sm space-y-6 text-brand-dark/75 leading-relaxed text-sm md:text-base">
              {page === 'refund-policy' && (
                <>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">1. 14-Day Refund Window</h2>
                    <p>
                      AtoZenius Private Limited stands behind the quality of our training cohorts and mentor support. If a paid program does not meet your expectations, you may request a refund within <strong>14 calendar days</strong> of your enrollment date.
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">2. How to Request a Refund</h2>
                    <p>
                      Submit a request via our Contact page or reach admissions on WhatsApp (+91 9502886626) with your full name, registered email address, enrolled program name, and payment reference.
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">3. Processing Timeline</h2>
                    <p>
                      Approved refunds are processed back to your original payment method within <strong>5–7 business days</strong>, subject to your bank or payment gateway settlement window. Certificates or internship access tied to refunded enrollments are deactivated upon processing.
                    </p>
                  </section>
                </>
              )}

              {page === 'privacy-policy' && (
                <>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">1. Information We Collect</h2>
                    <p>
                      We collect only the details necessary to deliver your courses, mentor sessions, project evaluations, and placement assistance—such as your name, email address, phone/WhatsApp number, educational track, and submitted capstone assignments.
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">2. How We Use Your Data</h2>
                    <p>
                      Your information is used solely to coordinate live training batches, issue verified Course Completion and Internship Completion certificates, provide academic support, and connect eligible learners with hiring partner opportunities when you opt in.
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">3. Data Protection &amp; Rights</h2>
                    <p>
                      AtoZenius Private Limited never sells personal learner data to third-party advertisers. You may request access to, correction of, or deletion of your contact records at any time through our Contact page.
                    </p>
                  </section>
                </>
              )}

              {page === 'terms' && (
                <>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">1. Platform Usage &amp; Enrollment</h2>
                    <p>
                      By enrolling in AtoZenius courses, mentorship sessions, or internship tracks, you agree to provide accurate registration details and abide by respectful conduct during live classes, community discussions, and mentor reviews.
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">2. Intellectual Property &amp; Course Content</h2>
                    <p>
                      All curriculum materials, recorded sessions, assignments, and project templates provided by AtoZenius Private Limited are licensed strictly for personal learning and may not be resold, redistributed, or published commercially.
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-bold text-brand-dark mb-2">3. Certifications &amp; Placement Support</h2>
                    <p>
                      Course Completion and Internship Completion certificates are awarded upon genuine completion of required minor and major projects. Placement support includes interview coaching and employer introductions; final hiring decisions rest with partner employers.
                    </p>
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InfoPage;
