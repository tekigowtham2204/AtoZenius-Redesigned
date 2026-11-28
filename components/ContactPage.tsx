import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, CheckCircle2, ChevronDown, Clock, MapPin } from 'lucide-react';
import {
  addAdmissionsLead,
  getResolvedCourses,
  getSiteConfig,
  getWhatsappDigits,
} from '../data/portal';

const contactFaqs = [
  {
    q: 'How can I enroll in an AtoZenius course or internship?',
    a: 'Select your program on the Courses page, register via Get Started, or connect directly with our academic counselors on WhatsApp (+91 9502886626).',
  },
  {
    q: 'Do all courses include live projects and certificates?',
    a: 'Yes. Every flagship program includes 3 minor projects, 2 major capstone projects, and both Course Completion and Internship Completion certificates upon evaluation.',
  },
  {
    q: 'Can non-IT or pharma graduates join?',
    a: 'Yes. Alongside IT, AI, Data Science, and Cyber Security, we offer dedicated Pharma (Medical Coding, Clinical Research), Non-IT & Management, and AgriTech tracks.',
  },
  {
    q: 'What is the duration of most programs?',
    a: 'Core cohorts run 3 to 4 months with flexible learning access, live mentor doubt-clearing, and dedicated placement preparation.',
  },
];

const ContactPage: React.FC = () => {
  const siteConfig = getSiteConfig();
  const whatsappDigits = getWhatsappDigits(siteConfig);
  const resolvedCourses = getResolvedCourses();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState(
    resolvedCourses[0]?.title || 'AI Full-Stack Development'
  );
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const whatsappText = encodeURIComponent(
    `Hi AtoZenius, my name is ${name || 'a prospective learner'}. I'd like details about ${program}. ${message}`
  );
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${whatsappText}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAdmissionsLead({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      program,
      source: 'Contact Form',
      notes: message.trim(),
    });
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
            Contact &amp; Admissions
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
            Talk With <span className="text-brand-accent">Our Team.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/65 font-medium leading-relaxed">
            Have questions about syllabi, batch schedules, mentorship, or hiring partnerships? Reach us directly or send a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-dark text-white rounded-[2rem] p-8 shadow-xl">
              <h2 className="text-2xl font-bold tracking-tight mb-3">Direct Channels</h2>
              <p className="text-white/65 text-sm leading-relaxed mb-8">
                AtoZenius Private Limited counselors are available to help match you with the right track.
              </p>

              <div className="space-y-5">
                <a
                  href={`tel:${whatsappDigits.replace(/^91/, '')}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wider font-bold">Phone</div>
                    <div className="text-sm font-bold text-white">{siteConfig.whatsappNumber}</div>
                  </div>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?phone=${whatsappDigits}&text=Hi%2C%20Can%20we%20connect%20to%20get%20more%20details%20about%20AtoZenius%20Program%3F`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wider font-bold">WhatsApp</div>
                    <div className="text-sm font-bold text-white">Chat on WhatsApp</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wider font-bold">Counseling Hours</div>
                    <div className="text-sm font-semibold text-white/85">Mon – Sat, 9:30 AM – 7:30 PM IST</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase tracking-wider font-bold">Delivery Mode</div>
                    <div className="text-sm font-semibold text-white/85">Live Online &amp; Hybrid Cohorts (India)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-10 border border-brand-dark/5 shadow-sm">
            {submitted ? (
              <div className="py-10 text-center max-w-md mx-auto">
                <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-brand-dark mb-2">Inquiry Ready</h3>
                <p className="text-brand-dark/65 text-sm leading-relaxed mb-6">
                  Thanks, <strong>{name}</strong>. Your inquiry for <strong>{program}</strong> has been prepared. Continue directly on WhatsApp for the fastest response from our admissions team.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> Send via WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-7 py-3.5 border border-brand-dark/15 text-brand-dark rounded-full text-sm font-bold hover:border-brand-dark/40 transition-colors"
                  >
                    Edit Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-bold text-brand-dark tracking-tight mb-2">
                  Send Us a Message
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9XXXXXXXXX"
                      className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2">
                      Program of Interest
                    </label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                    >
                      {resolvedCourses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/60 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us your background or what you'd like to learn..."
                    className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-sm hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                  >
                    <Mail size={16} /> Submit Inquiry
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 text-sm font-bold text-green-700 hover:underline inline-flex items-center gap-1.5"
                  >
                    <MessageCircle size={16} /> Connect Directly on WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Embedded FAQ Anchor (#faq) */}
        <section id="faq" className="max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-6">
            Common Questions
          </h2>
          <div className="space-y-4">
            {contactFaqs.map((item, idx) => {
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
                    <div className="px-6 pb-5 text-sm text-brand-dark/70 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default ContactPage;
