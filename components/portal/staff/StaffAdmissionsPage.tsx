import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  KeyRound,
  MessageCircle,
  Plus,
  X,
} from 'lucide-react';
import {
  addAdmissionsLead,
  AdmissionsLead,
  buildCredentialsWhatsAppUrl,
  findProvisionedStudentByEmail,
  getActiveTrackIds,
  getAdmissionsLeads,
  getResolvedTrackData,
  getWhatsappDigits,
  LeadSource,
  PortalTrackId,
  ProvisionedStudent,
  provisionStudentAccount,
  resolveTrackIdFromProgram,
  updateAdmissionsLeadStatus,
} from '../../../data/portal';

const statusFilterOptions = ['All', 'New', 'Counseling', 'Enrolled'] as const;

const statusDotColor: Record<AdmissionsLead['status'], string> = {
  New: 'bg-brand-accent',
  Counseling: 'bg-amber-600',
  Enrolled: 'bg-emerald-600',
};

interface StaffAdmissionsPageProps {
  embedded?: boolean;
}

const StaffAdmissionsPage: React.FC<StaffAdmissionsPageProps> = ({ embedded = false }) => {
  const [leads, setLeads] = useState<AdmissionsLead[]>(() => getAdmissionsLeads());
  const [filterStatus, setFilterStatus] = useState<(typeof statusFilterOptions)[number]>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [latestProvisioned, setLatestProvisioned] = useState<ProvisionedStudent | null>(null);

  // Manual Entry Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [trackId, setTrackId] = useState<PortalTrackId>('ai-full-stack');
  const [source, setSource] = useState<
    Extract<LeadSource, 'WhatsApp Enrollment' | 'Walk-In Counseling' | 'Phone Inquiry'>
  >('WhatsApp Enrollment');
  const [initialStatus, setInitialStatus] = useState<AdmissionsLead['status']>('Enrolled');
  const [notes, setNotes] = useState('');

  const filteredLeads =
    filterStatus === 'All' ? leads : leads.filter((l) => l.status === filterStatus);

  const handleStatusChange = (lead: AdmissionsLead, status: AdmissionsLead['status']) => {
    const updated = updateAdmissionsLeadStatus(lead.id, status);
    setLeads(updated);

    if (status === 'Enrolled') {
      const resolvedTrackId = resolveTrackIdFromProgram(lead.program);
      const provSource =
        lead.source === 'WhatsApp Enrollment' ||
        lead.source === 'Walk-In Counseling' ||
        lead.source === 'Phone Inquiry'
          ? lead.source
          : 'Walk-In Counseling';
      const prov = provisionStudentAccount({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        trackId: resolvedTrackId,
        source: provSource,
      });
      setLatestProvisioned(prov);
    }
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    const track = getResolvedTrackData(trackId);
    addAdmissionsLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      program: track.courseTitle,
      source,
      status: initialStatus,
      notes: notes.trim() || `${source} · Assigned ${track.batchCode}`,
    });

    if (initialStatus === 'Enrolled') {
      const prov = provisionStudentAccount({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        trackId,
        source,
      });
      setLatestProvisioned(prov);
    }

    setLeads(getAdmissionsLeads());
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleCopyCreds = (prov: ProvisionedStudent) => {
    const text = `AtoZenius Portal Access (${prov.batchCode})\nEmail: ${prov.email}\nTemp Password: ${prov.tempPassword}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(prov.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const content = (
    <div className={embedded ? '' : 'container mx-auto px-6 max-w-6xl'}>
      {!embedded && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono text-brand-accent font-semibold mb-2">
              Admissions Pipeline · Syncs with Contact Form, WhatsApp &amp; Signups
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Leads &amp; Enrollments.
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="px-6 py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2 self-start md:self-auto"
          >
            {showAddForm ? <X size={14} /> : <Plus size={14} />}
            {showAddForm ? 'Close Entry Form' : 'Add Walk-In / WhatsApp Student'}
          </button>
        </div>
      )}

      {/* Toolbar: Filter Pills + Manual Entry Button (when embedded) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
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

        {embedded && (
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
          >
            {showAddForm ? <X size={14} /> : <Plus size={14} />}
            {showAddForm ? 'Close Entry Form' : 'Add Walk-In / WhatsApp Student'}
          </button>
        )}
      </div>

      {/* Latest Generated Credentials Banner */}
      {latestProvisioned && (
        <div className="mb-6 bg-[#0A0B0E] text-white rounded-[1.5rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 inline-flex items-center gap-1.5 mb-1">
              <CheckCircle2 size={13} /> STUDENT PORTAL CREDENTIALS GENERATED
            </div>
            <div className="text-base font-bold">
              {latestProvisioned.name} · {latestProvisioned.batchCode}
            </div>
            <div className="text-xs font-mono text-white/75 mt-1">
              Email: <span className="text-white">{latestProvisioned.email}</span> · Temp Password:{' '}
              <span className="text-[#60A5FA] font-bold">{latestProvisioned.tempPassword}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleCopyCreds(latestProvisioned)}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Copy size={13} />
              {copiedId === latestProvisioned.id ? 'Copied!' : 'Copy Credentials'}
            </button>
            <a
              href={buildCredentialsWhatsAppUrl({
                name: latestProvisioned.name,
                email: latestProvisioned.email,
                phone: latestProvisioned.phone,
                batchCode: latestProvisioned.batchCode,
                courseTitle: getResolvedTrackData(latestProvisioned.trackId).courseTitle,
                tempPassword: latestProvisioned.tempPassword,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <MessageCircle size={13} /> Send Credentials on WhatsApp ↗
            </a>
          </div>
        </div>
      )}

      {/* Manual Walk-In / WhatsApp Student Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateManualLead}
          className="mb-8 bg-white rounded-[1.75rem] border border-brand-dark/15 p-6 sm:p-8 space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-brand-dark/10">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-accent font-semibold">
                Offline Enrollment Desk
              </span>
              <h2 className="text-xl font-bold text-brand-dark">
                Add Walk-In or WhatsApp Student
              </h2>
            </div>
            <span className="text-xs text-brand-dark/55">
              Setting status to <strong>Enrolled</strong> auto-generates portal credentials
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5">
                Student Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Arjun Rao"
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5">
                WhatsApp / Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9XXXXXXXXX"
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5">
                Course &amp; Batch
              </label>
              <select
                value={trackId}
                onChange={(e) => setTrackId(e.target.value as PortalTrackId)}
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm font-semibold focus:outline-none focus:border-brand-accent"
              >
                {getActiveTrackIds().map((id) => {
                  const t = getResolvedTrackData(id);
                  return (
                    <option key={id} value={id}>
                      {t.courseTitle} ({t.batchCode})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5">
                Enrollment Source
              </label>
              <select
                value={source}
                onChange={(e) =>
                  setSource(
                    e.target.value as Extract<
                      LeadSource,
                      'WhatsApp Enrollment' | 'Walk-In Counseling' | 'Phone Inquiry'
                    >
                  )
                }
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm font-semibold focus:outline-none focus:border-brand-accent"
              >
                <option value="WhatsApp Enrollment">WhatsApp Enrollment</option>
                <option value="Walk-In Counseling">Walk-In Counseling</option>
                <option value="Phone Inquiry">Phone Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1.5">
                Pipeline Status
              </label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value as AdmissionsLead['status'])}
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm font-semibold focus:outline-none focus:border-brand-accent"
              >
                <option value="Enrolled">Enrolled (Auto-Generate Login)</option>
                <option value="Counseling">Counseling Scheduled</option>
                <option value="New">New Inquiry</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional counselor notes (fee receipt ref, preferred shift, background)..."
            className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-7 py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors"
            >
              {initialStatus === 'Enrolled'
                ? 'Save Student & Generate Credentials'
                : 'Add to Admissions Pipeline'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-3 text-xs font-bold text-brand-dark/60 hover:text-brand-dark"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => {
          const provisioned =
            lead.status === 'Enrolled' ? findProvisionedStudentByEmail(lead.email) : undefined;
          const trackForLead = provisioned
            ? getResolvedTrackData(provisioned.trackId)
            : getResolvedTrackData(resolveTrackIdFromProgram(lead.program));

          return (
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
                    Program: {lead.program}
                  </p>
                  {lead.notes && (
                    <p className="text-sm text-brand-dark/70 leading-relaxed mb-4">
                      {lead.notes}
                    </p>
                  )}

                  {provisioned && (
                    <div className="mb-4 p-3.5 rounded-xl bg-[#EEF3FF] border border-brand-accent/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="font-mono text-brand-dark">
                        <KeyRound size={12} className="inline mr-1.5 text-brand-accent" />
                        Temp Password:{' '}
                        <strong className="text-brand-accent">{provisioned.tempPassword}</strong> ·{' '}
                        {provisioned.batchCode} ({provisioned.status})
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCreds(provisioned)}
                        className="font-bold text-brand-dark/75 hover:text-brand-accent inline-flex items-center gap-1"
                      >
                        <Copy size={12} /> {copiedId === provisioned.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-brand-dark/10 flex flex-wrap gap-4 text-xs text-brand-dark/60 font-mono">
                  <span>{lead.email}</span>
                  <span>{lead.phone}</span>
                </div>
              </div>

              <div className="lg:w-80 shrink-0 bg-[#F7F4EE]/80 border-t lg:border-t-0 lg:border-l border-brand-dark/10 p-6 flex flex-col justify-center gap-3">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/55">
                  Update Pipeline Status
                </label>
                <select
                  value={lead.status}
                  onChange={(e) =>
                    handleStatusChange(lead, e.target.value as AdmissionsLead['status'])
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-brand-dark/15 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-accent"
                >
                  <option value="New">New Inquiry</option>
                  <option value="Counseling">Counseling Scheduled</option>
                  <option value="Enrolled">Enrolled in Batch</option>
                </select>

                {provisioned ? (
                  <a
                    href={buildCredentialsWhatsAppUrl({
                      name: provisioned.name,
                      email: provisioned.email,
                      phone: provisioned.phone,
                      batchCode: trackForLead.batchCode,
                      courseTitle: trackForLead.courseTitle,
                      tempPassword: provisioned.tempPassword,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle size={14} /> Send Credentials on WhatsApp ↗
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/${lead.phone.replace(/\D/g, '') || getWhatsappDigits()}?text=${encodeURIComponent(
                      `Hi ${lead.name}, thanks for your interest in ${lead.program} at AtoZenius! How can we help you pick your batch?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle size={14} /> Follow up on WhatsApp
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      {content}
    </motion.div>
  );
};

export default StaffAdmissionsPage;
