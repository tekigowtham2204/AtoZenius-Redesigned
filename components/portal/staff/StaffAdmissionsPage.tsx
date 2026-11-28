import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import {
  AdmissionsLead,
  getAdmissionsLeads,
  updateAdmissionsLeadStatus,
} from '../../../data/portal';

const statusFilterOptions = ['All', 'New', 'Counseling', 'Enrolled'] as const;

const statusDotColor: Record<AdmissionsLead['status'], string> = {
  New: 'bg-brand-accent',
  Counseling: 'bg-amber-600',
  Enrolled: 'bg-emerald-600',
};

const StaffAdmissionsPage: React.FC = () => {
  const [leads, setLeads] = useState<AdmissionsLead[]>(() => getAdmissionsLeads());
  const [filterStatus, setFilterStatus] = useState<(typeof statusFilterOptions)[number]>('All');

  const filteredLeads =
    filterStatus === 'All' ? leads : leads.filter((l) => l.status === filterStatus);

  const handleStatusChange = (id: string, status: AdmissionsLead['status']) => {
    setLeads(updateAdmissionsLeadStatus(id, status));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono text-brand-accent font-semibold mb-2">
              Admissions Pipeline · Syncs with Contact Form &amp; Signups
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Leads &amp; Enrollments.
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilterOptions.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  filterStatus === st
                    ? 'bg-brand-dark text-white'
                    : 'bg-white border border-brand-dark/10 text-brand-dark/70'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <article
              key={lead.id}
              className="bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden flex flex-col lg:flex-row items-stretch"
            >
              <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs">
                    <span className="inline-flex items-center gap-2 font-semibold text-brand-dark/80">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor[lead.status]}`} />
                      {lead.status}
                      <span className="text-brand-dark/30">/</span>
                      <span className="text-brand-dark/55">{lead.source}</span>
                    </span>
                    <span className="font-mono text-brand-dark/45">{lead.createdAt}</span>
                  </div>

                  <h2 className="text-xl font-bold text-brand-dark mb-1">{lead.name}</h2>
                  <p className="text-xs font-semibold text-brand-accent mb-3">
                    Interested in: {lead.program}
                  </p>
                  {lead.notes && (
                    <p className="text-sm text-brand-dark/70 leading-relaxed mb-4">
                      {lead.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-brand-dark/10 flex flex-wrap gap-4 text-xs text-brand-dark/60 font-mono">
                  <span>{lead.email}</span>
                  <span>{lead.phone}</span>
                </div>
              </div>

              <div className="lg:w-72 shrink-0 bg-[#F7F4EE]/80 border-t lg:border-t-0 lg:border-l border-brand-dark/10 p-6 flex flex-col justify-center gap-3">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55">
                  Update Pipeline Status
                </label>
                <select
                  value={lead.status}
                  onChange={(e) =>
                    handleStatusChange(lead.id, e.target.value as AdmissionsLead['status'])
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-brand-dark/15 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-accent"
                >
                  <option value="New">New Inquiry</option>
                  <option value="Counseling">Counseling Scheduled</option>
                  <option value="Enrolled">Enrolled in Batch</option>
                </select>

                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, '') || '919502886626'}?text=${encodeURIComponent(
                    `Hi ${lead.name}, thanks for your interest in ${lead.program} at AtoZenius! How can we help you pick your batch?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} /> Follow up on WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StaffAdmissionsPage;
