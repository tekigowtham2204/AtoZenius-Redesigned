import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Mail, CheckCircle2, HelpCircle, FileText, Shield, BookOpen, Building2, MessageSquare } from 'lucide-react';
import { ViewState } from '../types';

export type InfoPageType =
  | 'about'
  | 'blog'
  | 'contact'
  | 'company-careers'
  | 'certifications'
  | 'placements'
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
    q: 'How do AtoZenius courses differ from regular video tutorials?',
    a: 'Every course is built around production-grade engineering projects, live hiring signals, and hands-on system design—not passive video lectures.',
  },
  {
    q: 'How does 1-on-1 mentorship work?',
    a: 'You can book dedicated sessions with staff engineers, founders, and hiring managers for code reviews, architecture feedback, and realistic mock interviews.',
  },
  {
    q: 'Do I get direct career support after completing a track?',
    a: 'Yes. Once your skills and projects are verified, your profile is matched directly with vetted full-time, internship, and contract roles.',
  },
  {
    q: 'What is your refund policy?',
    a: 'We offer a full 14-day no-questions-asked refund on all paid cohorts and mentorship plans if the program is not the right fit for you.',
  },
];

const blogPosts = [
  {
    title: 'Why Portfolio Proof Beats Traditional Resumes in 2026',
    date: 'Nov 18, 2026',
    readTime: '5 min read',
    excerpt: 'Engineering teams are moving away from keyword-stuffed PDFs toward verifiable codebases, architecture notes, and live system demos.',
  },
  {
    title: 'Breaking Into Distributed Systems as an Early-Career Engineer',
    date: 'Nov 10, 2026',
    readTime: '7 min read',
    excerpt: 'A practical roadmap covering consensus, caching, queues, and observability—without getting lost in textbook theory.',
  },
  {
    title: 'How to Get the Most Out of Your 1-on-1 Technical Mentorship',
    date: 'Nov 02, 2026',
    readTime: '4 min read',
    excerpt: 'Prepare specific architecture questions, share real PRs, and turn 45-minute mentor sessions into weeks of momentum.',
  },
];

const InfoPage: React.FC<InfoPageProps> = ({ page, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        {page === 'about' && (
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              About <span className="text-brand-accent">AtoZenius.</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/70 leading-relaxed mb-8">
              AtoZenius is a career ecosystem built to close the gap between learning to code and landing your first great engineering role.
            </p>
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-brand-dark/5 shadow-sm space-y-5 text-brand-dark/75 leading-relaxed">
              <p>
                Traditional tech education leaves students stranded after watching tutorials—with no feedback on their code and no bridge to hiring teams.
              </p>
              <p>
                We unite structured <strong>Courses</strong>, 1-on-1 <strong>Mentors</strong> from leading tech companies, and verified <strong>Careers</strong> into one continuous path so talent is judged by real work, not pedigree.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-8 py-3.5 bg-brand-dark text-white rounded-full font-bold text-sm hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                >
                  Explore Courses <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {page === 'blog' && (
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              The AtoZenius <span className="text-brand-accent">Journal.</span>
            </h1>
            <p className="text-lg text-brand-dark/65 mb-10">
              Engineering guides, hiring insights, and stories from mentors and learners.
            </p>
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <article
                  key={post.title}
                  className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-3">
                    <BookOpen size={14} className="text-brand-accent" />
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-3 tracking-tight">{post.title}</h2>
                  <p className="text-brand-dark/70 leading-relaxed">{post.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {page === 'contact' && (
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              Get in <span className="text-brand-accent">Touch.</span>
            </h1>
            <p className="text-lg text-brand-dark/65 mb-10">
              Questions about courses, mentorship, or hiring partnerships? Send us a note.
            </p>
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-brand-dark/5 shadow-sm">
              {contactSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={44} className="text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Message Received</h3>
                  <p className="text-brand-dark/60 mb-6">Our team will get back to you within 24 hours.</p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2">Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How can we help?"
                      className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-sm hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                  >
                    <Mail size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {page === 'company-careers' && (
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              Careers at <span className="text-brand-accent">AtoZenius.</span>
            </h1>
            <p className="text-lg text-brand-dark/65 mb-10">
              Help us build the future of technical education and merit-first hiring.
            </p>
            <div className="space-y-4">
              {[
                { role: 'Curriculum Engineer (Systems & Backend)', team: 'Education', location: 'Remote' },
                { role: 'Senior Full-Stack Engineer', team: 'Platform', location: 'Remote / Hybrid' },
                { role: 'Developer Community & Mentor Lead', team: 'Operations', location: 'Remote' },
              ].map((job) => (
                <div
                  key={job.role}
                  className="bg-white rounded-[1.75rem] p-6 md:p-8 border border-brand-dark/5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">
                      <Building2 size={14} /> {job.team} • {job.location}
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark">{job.role}</h3>
                  </div>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
                  >
                    Apply <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'certifications' && (
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              Verified <span className="text-brand-accent">Certifications.</span>
            </h1>
            <p className="text-base sm:text-lg text-brand-dark/65 mb-10">
              Earn skill-backed credentials when you ship capstone projects and pass mentor code reviews.
            </p>
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 border border-brand-dark/5 shadow-sm space-y-5 text-brand-dark/75 leading-relaxed">
              <p>
                Every AtoZenius course track includes hands-on architecture reviews and production deliverables. Instead of multiple-choice quizzes, you graduate with verified project proof attached to your certificate.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('courses')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-brand-dark text-white rounded-full font-bold text-sm hover:bg-brand-accent transition-colors inline-flex items-center justify-center gap-2"
                >
                  Browse Courses <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {page === 'placements' && (
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              Placements &amp; <span className="text-brand-accent">Success Stories.</span>
            </h1>
            <p className="text-lg text-brand-dark/65 mb-10">
              See how AtoZenius learners go from structured courses and 1-on-1 mentorship to engineering offers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { stat: '92%', label: 'Placement Rate Within 90 Days' },
                { stat: '140+', label: 'Hiring Partner Teams' },
                { stat: '1-on-1', label: 'Mentor-Guided Interview Prep' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-[1.75rem] p-6 border border-brand-dark/5 shadow-sm">
                  <div className="text-3xl font-bold text-brand-accent mb-1">{item.stat}</div>
                  <div className="text-sm font-semibold text-brand-dark/70">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                {
                  name: 'Rohan Kulkarni',
                  outcome: 'Backend Engineer @ Stripe',
                  story: 'Completed the Distributed Systems track, refined my Go services with a staff mentor, and cleared four rounds of interviews.',
                },
                {
                  name: 'Ananya Verma',
                  outcome: 'Applied AI Engineer @ Anthropic',
                  story: 'Built two end-to-end LLM evaluation projects in Courses and practiced system design weekly with my mentor.',
                },
                {
                  name: 'Kabir Sharma',
                  outcome: 'Product Engineer @ Linear',
                  story: 'Turned my capstone into a live portfolio and fast-tracked straight to the hiring team through AtoZenius Careers.',
                },
              ].map((story) => (
                <div key={story.name} className="bg-white rounded-[1.75rem] p-6 md:p-8 border border-brand-dark/5 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">{story.outcome}</div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{story.name}</h3>
                  <p className="text-brand-dark/70 text-sm leading-relaxed">"{story.story}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'faqs' && (
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              Frequently Asked <span className="text-brand-accent">Questions.</span>
            </h1>
            <p className="text-lg text-brand-dark/65 mb-10">
              Everything you need to know about courses, mentorship, and career matching.
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
                        className={`text-brand-dark/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              Help <span className="text-brand-accent">Center.</span>
            </h1>
            <p className="text-lg text-brand-dark/65 mb-10">
              Guides and quick links to get unstuck fast.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: HelpCircle, title: 'Account & Login', desc: 'Manage your profile, reset credentials, or switch tracks.', action: () => onNavigate('auth'), label: 'Go to Login' },
                { icon: MessageSquare, title: 'Mentor Booking Support', desc: 'Reschedule sessions or connect with your assigned mentor.', action: () => onNavigate('mentors'), label: 'Browse Mentors' },
                { icon: BookOpen, title: 'Course Access & Labs', desc: 'Troubleshoot sandbox environments and project submissions.', action: () => onNavigate('courses'), label: 'View Courses' },
                { icon: Mail, title: 'Contact Support', desc: 'Reach our support team directly for billing or technical issues.', action: () => onNavigate('contact'), label: 'Contact Us' },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm flex flex-col justify-between">
                    <div>
                      <Icon size={24} className="text-brand-accent mb-4" />
                      <h3 className="text-xl font-bold text-brand-dark mb-2">{card.title}</h3>
                      <p className="text-brand-dark/65 text-sm mb-6">{card.desc}</p>
                    </div>
                    <button
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
              <span>Legal & Policies</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark tracking-tighter mb-6">
              {page === 'refund-policy' && 'Refund Policy'}
              {page === 'privacy-policy' && 'Privacy Policy'}
              {page === 'terms' && 'Terms & Conditions'}
            </h1>
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-brand-dark/5 shadow-sm space-y-5 text-brand-dark/75 leading-relaxed">
              {page === 'refund-policy' && (
                <>
                  <p>
                    We stand behind the quality of our courses and mentorship programs. If you are not satisfied within the first <strong>14 days</strong> of enrollment, you are eligible for a full refund.
                  </p>
                  <p>
                    To request a refund, contact our support team with your registered email address and order reference. Refunds are processed back to your original payment method within 5–7 business days.
                  </p>
                </>
              )}
              {page === 'privacy-policy' && (
                <>
                  <p>
                    AtoZenius respects your privacy. We collect only the information needed to provide your learning experience, mentor scheduling, and career matching—such as your name, email, and project submissions.
                  </p>
                  <p>
                    We never sell your personal data to third-party advertisers. Employer introductions happen only when you opt in to share your verified profile.
                  </p>
                </>
              )}
              {page === 'terms' && (
                <>
                  <p>
                    By accessing AtoZenius courses, mentorship sessions, and career services, you agree to uphold academic honesty, respect mentor and peer communities, and refrain from redistributing proprietary course materials.
                  </p>
                  <p>
                    AtoZenius reserves the right to update platform features, curriculum tracks, and these terms as the ecosystem evolves.
                  </p>
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
