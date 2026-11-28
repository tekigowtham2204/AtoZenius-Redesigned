import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import {
  allTrackIds,
  getIssuedCertificates,
  getResolvedTrackData,
  IssuedCertificate,
  issueNewCertificate,
  PortalTrackId,
  postBatchThread,
} from '../../../data/portal';

const StaffPlacementsPage: React.FC = () => {
  const [certs, setCerts] = useState<IssuedCertificate[]>(() => getIssuedCertificates());
  const [studentName, setStudentName] = useState('');
  const [certTrackId, setCertTrackId] = useState<PortalTrackId>('ai-full-stack');
  const [lastIssued, setLastIssued] = useState<IssuedCertificate | null>(null);

  const [alertTrackId, setAlertTrackId] = useState<PortalTrackId>('ai-full-stack');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertBody, setAlertBody] = useState('');
  const [alertSent, setAlertSent] = useState(false);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    const track = getResolvedTrackData(certTrackId);
    const created = issueNewCertificate({
      studentName: studentName.trim(),
      programTitle: track.courseTitle,
      batchCode: track.batchCode,
      type: 'Course + Internship Completion',
    });
    setCerts(getIssuedCertificates());
    setLastIssued(created);
    setStudentName('');
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertBody.trim()) return;
    postBatchThread(alertTrackId, {
      id: `placement-${Date.now()}`,
      category: 'Placement Alerts',
      author: 'AtoZenius Placement Cell',
      authorInitials: 'AZ',
      timeAgo: 'Just now',
      title: alertTitle.trim(),
      body: alertBody.trim(),
      replies: [],
    });
    setAlertTitle('');
    setAlertBody('');
    setAlertSent(true);
    window.setTimeout(() => setAlertSent(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-10 pb-6 border-b border-brand-dark/10">
          <p className="text-xs font-mono text-brand-accent font-semibold mb-2">
            Placements &amp; Credentials · Live Sync with /certifications &amp; Batch Community
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
            Certificates &amp; Placement Desk.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Issue Certificate Form */}
          <form
            onSubmit={handleIssueCertificate}
            className="lg:col-span-6 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-9 space-y-5"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-brand-accent font-semibold">
              <Award size={15} /> Issue Verifiable Certificate
            </div>
            <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
              Approve Course &amp; Internship Credential
            </h2>
            <p className="text-xs text-brand-dark/65 leading-relaxed">
              Generated Credential IDs become immediately verifiable on the public Certifications page.
            </p>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                Graduate Full Name
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                Completed Program &amp; Batch
              </label>
              <select
                value={certTrackId}
                onChange={(e) => setCertTrackId(e.target.value as PortalTrackId)}
                className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
              >
                {allTrackIds.map((id) => {
                  const t = getResolvedTrackData(id);
                  return (
                    <option key={id} value={id}>
                      {t.courseTitle} ({t.batchCode})
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              type="submit"
              className="px-7 py-3.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
            >
              <ShieldCheck size={15} /> Generate &amp; Issue ID
            </button>

            {lastIssued && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                Issued <strong>{lastIssued.id}</strong> for{' '}
                <strong>{lastIssued.studentName}</strong>. Try verifying it on Certifications!
              </div>
            )}
          </form>

          {/* Broadcast Placement Alert */}
          <form
            onSubmit={handleBroadcastAlert}
            className="lg:col-span-6 bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 sm:p-9 space-y-5"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-[#60A5FA]">
              <Send size={14} /> Placement Alert Broadcast
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Push Hiring Drive to Batch Community
            </h2>
            <p className="text-xs text-white/65 leading-relaxed">
              Posts directly into the selected cohort’s Placement Alerts tab inside Student Community.
            </p>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/55 mb-2">
                Target Cohort
              </label>
              <select
                value={alertTrackId}
                onChange={(e) => setAlertTrackId(e.target.value as PortalTrackId)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white focus:outline-none focus:border-[#60A5FA]"
              >
                {allTrackIds.map((id) => {
                  const t = getResolvedTrackData(id);
                  return (
                    <option key={id} value={id} className="text-brand-dark">
                      {t.batchCode} · {t.courseTitle}
                    </option>
                  );
                })}
              </select>
            </div>

            <input
              type="text"
              required
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              placeholder="Hiring drive headline (e.g., Junior Coder Drive — Hyderabad)"
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />

            <textarea
              rows={3}
              required
              value={alertBody}
              onChange={(e) => setAlertBody(e.target.value)}
              placeholder="Interview dates, eligibility, and registration instructions..."
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                className="px-7 py-3.5 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors inline-flex items-center gap-2"
              >
                <Send size={14} /> Broadcast Alert
              </button>
              {alertSent && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 size={14} /> Posted to Batch Community
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Issued Certificates Registry */}
        <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-9">
          <h3 className="text-xl font-bold text-brand-dark mb-5">Issued Credentials Registry</h3>
          <div className="divide-y divide-brand-dark/10">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
              >
                <div>
                  <span className="font-mono font-bold text-brand-accent mr-3">{cert.id}</span>
                  <span className="font-bold text-brand-dark">{cert.studentName}</span>
                </div>
                <div className="text-xs text-brand-dark/60">
                  {cert.programTitle} · {cert.batchCode} · {cert.issuedDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StaffPlacementsPage;
