import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  KeyRound,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  addTeamMemberAccess,
  allTrackIds,
  buildCredentialsWhatsAppUrl,
  getProvisionedStudents,
  getResolvedTrackData,
  getTeamAccessList,
  PortalRole,
  PortalTrackId,
  ProvisionedStudent,
  removeTeamMemberAccess,
  resetProvisionedStudentPassword,
  TeamMemberAccess,
  toggleProvisionedStudentStatus,
  updateProvisionedStudentBatch,
} from '../../../data/portal';

const AdminAccessPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMemberAccess[]>(() => getTeamAccessList());
  const [students, setStudents] = useState<ProvisionedStudent[]>(() => getProvisionedStudents());
  const [notice, setNotice] = useState<string | null>(null);

  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<Exclude<PortalRole, 'student'>>('mentor');
  const [memberTrack, setMemberTrack] = useState<PortalTrackId>('ai-full-stack');

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2000);
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;
    const next = addTeamMemberAccess({
      name: memberName.trim(),
      email: memberEmail.trim().toLowerCase(),
      role: memberRole,
      assignedTrackId: memberTrack,
    });
    setTeam(next);
    setMemberName('');
    setMemberEmail('');
    flash(`Granted ${memberRole.toUpperCase()} access to ${memberEmail.trim().toLowerCase()}`);
  };

  const handleCopyCredentials = (s: ProvisionedStudent) => {
    const text = `AtoZenius Portal Access (${s.batchCode})\nEmail: ${s.email}\nTemp Password: ${s.tempPassword}`;
    navigator.clipboard?.writeText(text);
    flash(`Copied credentials for ${s.name}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-accent font-semibold mb-2">
              Team Permissions &amp; Offline Student Credentials
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Access &amp; Roles.
            </h1>
          </div>
          {notice && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
              <CheckCircle2 size={14} /> {notice}
            </span>
          )}
        </div>

        {/* Section 1: Team Role Directory */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleAddTeamMember}
            className="lg:col-span-5 bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 space-y-4"
          >
            <div className="text-xs font-mono text-[#60A5FA] inline-flex items-center gap-1.5">
              <UserPlus size={14} /> GRANT TEAM ACCESS
            </div>
            <h2 className="text-xl font-bold tracking-tight">Assign Role by Email</h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Any email added here routes automatically to its assigned Admin, Mentor, or Staff workspace upon sign-in.
            </p>

            <input
              type="text"
              required
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Team Member Name (e.g., Ravi Kumar)"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />

            <input
              type="email"
              required
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Email (e.g., ravi@atozenius.in)"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  Role
                </label>
                <select
                  value={memberRole}
                  onChange={(e) =>
                    setMemberRole(e.target.value as Exclude<PortalRole, 'student'>)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white"
                >
                  <option value="mentor" className="text-brand-dark">Mentor</option>
                  <option value="staff" className="text-brand-dark">Staff / Ops</option>
                  <option value="admin" className="text-brand-dark">Admin / Owner</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  Default Batch
                </label>
                <select
                  value={memberTrack}
                  onChange={(e) => setMemberTrack(e.target.value as PortalTrackId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white"
                >
                  {allTrackIds.map((id) => {
                    const t = getResolvedTrackData(id);
                    return (
                      <option key={id} value={id} className="text-brand-dark">
                        {t.batchCode}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors"
            >
              Grant Role Access
            </button>
          </form>

          <div className="lg:col-span-7 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-dark/55">
                <ShieldCheck size={15} className="text-brand-accent" /> Team Role Directory ({team.length})
              </div>
            </div>

            <div className="divide-y divide-brand-dark/10">
              {team.map((member) => {
                const track = member.assignedTrackId
                  ? getResolvedTrackData(member.assignedTrackId)
                  : null;
                return (
                  <div
                    key={member.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-brand-dark">{member.name}</span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                            member.role === 'admin'
                              ? 'bg-[#0A0B0E] text-white'
                              : member.role === 'mentor'
                              ? 'bg-[#EEF3FF] text-brand-accent'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-brand-dark/55 mt-0.5">
                        {member.email}
                        {track && member.role === 'mentor' ? ` · ${track.batchCode}` : ''}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTeam(removeTeamMemberAccess(member.id));
                        flash(`Revoked access for ${member.email}`);
                      }}
                      className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1 self-start sm:self-center"
                    >
                      <Trash2 size={13} /> Revoke
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2: Provisioned Student Credentials Ledger */}
        <section className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-brand-dark/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-accent font-semibold mb-1">
                <KeyRound size={14} /> PROVISIONED OFFLINE STUDENTS ({students.length})
              </div>
              <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
                Student Portal Credentials Ledger
              </h2>
            </div>
            <span className="text-xs text-brand-dark/55">
              Generated from WhatsApp / Walk-In enrollments
            </span>
          </div>

          {students.length === 0 ? (
            <p className="text-sm text-brand-dark/60 py-6">
              No provisioned offline students yet. Add one from Operations → Admissions.
            </p>
          ) : (
            <div className="space-y-4">
              {students.map((st) => {
                const track = getResolvedTrackData(st.trackId);
                const waUrl = buildCredentialsWhatsAppUrl({
                  name: st.name,
                  email: st.email,
                  phone: st.phone,
                  batchCode: track.batchCode,
                  courseTitle: track.courseTitle,
                  tempPassword: st.tempPassword,
                });

                return (
                  <div
                    key={st.id}
                    className="rounded-2xl border border-brand-dark/10 bg-brand-cream/40 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-base font-bold text-brand-dark">{st.name}</span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                            st.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {st.status}
                        </span>
                        <span className="text-[11px] font-mono text-brand-dark/45">
                          {st.source} · {st.createdAt}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-brand-dark/70">
                        {st.email} · {st.phone}
                      </div>
                      <div className="text-xs font-mono text-brand-accent font-bold">
                        Temp Password: {st.tempPassword}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <select
                        value={st.trackId}
                        aria-label={`Batch for ${st.name}`}
                        onChange={(e) => {
                          setStudents(
                            updateProvisionedStudentBatch(st.id, e.target.value as PortalTrackId)
                          );
                          flash(`Updated batch for ${st.name}`);
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-brand-dark/15 text-xs font-bold text-brand-dark"
                      >
                        {allTrackIds.map((id) => {
                          const t = getResolvedTrackData(id);
                          return (
                            <option key={id} value={id}>
                              {t.batchCode}
                            </option>
                          );
                        })}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setStudents(resetProvisionedStudentPassword(st.id));
                          flash(`Reset access code for ${st.name}`);
                        }}
                        className="px-3.5 py-2 rounded-full bg-white border border-brand-dark/15 text-xs font-bold text-brand-dark hover:border-brand-dark/40 inline-flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} /> Reset Code
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(st)}
                        className="px-3.5 py-2 rounded-full bg-white border border-brand-dark/15 text-xs font-bold text-brand-dark hover:border-brand-dark/40 inline-flex items-center gap-1.5"
                      >
                        <Copy size={12} /> Copy
                      </button>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 inline-flex items-center gap-1.5"
                      >
                        <MessageCircle size={12} /> WhatsApp
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setStudents(toggleProvisionedStudentStatus(st.id));
                          flash(
                            st.status === 'Active'
                              ? `Revoked access for ${st.name}`
                              : `Restored access for ${st.name}`
                          );
                        }}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold ${
                          st.status === 'Active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {st.status === 'Active' ? 'Revoke' : 'Restore'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default AdminAccessPage;
