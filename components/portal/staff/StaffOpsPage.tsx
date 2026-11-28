import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Users, Award, UserPlus } from 'lucide-react';
import {
  getActiveTrackIds,
  getAdmissionsLeads,
  getIssuedCertificates,
  getResolvedTrackData,
  PortalSession,
} from '../../../data/portal';
import { ViewState } from '../../../types';

interface StaffOpsPageProps {
  session: PortalSession;
  onNavigate: (view: ViewState) => void;
}

const StaffOpsPage: React.FC<StaffOpsPageProps> = ({ session, onNavigate }) => {
  const leads = getAdmissionsLeads();
  const certs = getIssuedCertificates();
  const activeTrackIds = getActiveTrackIds();
  const openLeads = leads.filter((l) => l.status !== 'Enrolled').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-8 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-accent font-semibold mb-2">
              AtoZenius Private Limited · Internal Operations
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Operations Hub.
            </h1>
          </div>
          <div className="text-xs font-mono text-brand-dark/60">
            Signed in as {session.name}
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-dark/10 mb-10">
          <div className="p-7 flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-2">
                Active Offline Cohorts
              </span>
              <div className="text-3xl font-extrabold text-brand-dark">{activeTrackIds.length}</div>
              <button
                type="button"
                onClick={() => onNavigate('staff-batches')}
                className="mt-3 text-xs font-bold text-brand-accent hover:underline inline-flex items-center gap-1"
              >
                Manage schedules <ArrowRight size={13} />
              </button>
            </div>
            <Users size={20} className="text-brand-dark/40" />
          </div>

          <div className="p-7 flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-2">
                Open Admissions Leads
              </span>
              <div className="text-3xl font-extrabold text-brand-accent">{openLeads}</div>
              <button
                type="button"
                onClick={() => onNavigate('staff-admissions')}
                className="mt-3 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1"
              >
                Open admissions desk <ArrowRight size={13} />
              </button>
            </div>
            <UserPlus size={20} className="text-brand-dark/40" />
          </div>

          <div className="p-7 flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 block mb-2">
                Issued Certificates
              </span>
              <div className="text-3xl font-extrabold text-brand-dark">{certs.length}</div>
              <button
                type="button"
                onClick={() => onNavigate('staff-placements')}
                className="mt-3 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1"
              >
                Issue &amp; broadcast alerts <ArrowRight size={13} />
              </button>
            </div>
            <Award size={20} className="text-brand-dark/40" />
          </div>
        </div>

        {/* Live Offline Batch Schedule Snapshot */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
            Offline Batch Snapshot
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('staff-batches')}
            className="text-xs font-bold text-brand-accent hover:underline"
          >
            Edit rooms &amp; timings →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTrackIds.map((id) => {
            const track = getResolvedTrackData(id);
            return (
              <article
                key={id}
                className="bg-white rounded-[1.75rem] border border-brand-dark/10 overflow-hidden flex flex-col justify-between"
              >
                <div className="px-6 pt-5 pb-6 bg-[#F7F4EE] border-b border-brand-dark/10">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono mb-3">
                    <span className="font-bold text-brand-accent">{track.batchCode}</span>
                    <span className="text-brand-dark/55">{track.mentorName}</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark leading-snug">
                    {track.courseTitle}
                  </h3>
                </div>

                <div className="p-6 space-y-3 text-xs text-brand-dark/75">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-brand-accent shrink-0 mt-0.5" />
                    <span className="font-semibold">{track.branchLocation}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="text-brand-dark/45 shrink-0 mt-0.5" />
                    <span>{track.nextSessionTime}</span>
                  </div>
                  <div className="pt-3 border-t border-brand-dark/10 text-brand-dark/60 leading-relaxed">
                    <strong className="text-brand-dark">Next Topic:</strong> {track.nextSessionTopic}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StaffOpsPage;
