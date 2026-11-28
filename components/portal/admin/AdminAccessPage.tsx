import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Edit3,
  KeyRound,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import {
  addTeamMemberAccess,
  ALL_TEAM_PERMISSIONS,
  buildCredentialsWhatsAppUrl,
  getActiveTrackIds,
  getDefaultPermissionsForRole,
  getProvisionedStudents,
  getResolvedTrackData,
  getTeamAccessList,
  PortalRole,
  PortalTrackId,
  ProvisionedStudent,
  removeTeamMemberAccess,
  resetProvisionedStudentPassword,
  TeamMemberAccess,
  TeamPermission,
  toggleProvisionedStudentStatus,
  updateProvisionedStudentBatch,
  updateTeamMemberAccess,
} from '../../../data/portal';
import MinimalSelect from '../../ui/MinimalSelect';

const roleLabels: Record<Exclude<PortalRole, 'student'>, string> = {
  staff: 'Staff',
  manager: 'Manager',
  mentor: 'Mentor',
  admin: 'Admin',
};

const roleBadgeClass: Record<Exclude<PortalRole, 'student'>, string> = {
  admin: 'bg-[#0A0B0E] text-white',
  manager: 'bg-brand-accent text-white',
  mentor: 'bg-[#EEF3FF] text-brand-accent',
  staff: 'bg-amber-50 text-amber-800 border border-amber-200',
};

const permissionShortLabel: Record<TeamPermission, string> = {
  manage_admissions: 'Admissions',
  manage_batches: 'Batches',
  manage_placements: 'Certificates',
  view_overview: 'Overview',
  manage_team: 'Team & Access',
  edit_website: 'Website',
  mentor_workspace: 'Mentor Desk',
};

const AdminAccessPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMemberAccess[]>(() => getTeamAccessList());
  const [students, setStudents] = useState<ProvisionedStudent[]>(() => getProvisionedStudents());
  const [notice, setNotice] = useState<string | null>(null);

  // Add Team Member Form
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<Exclude<PortalRole, 'student'>>('staff');
  const [memberTitle, setMemberTitle] = useState('');
  const [memberTrack, setMemberTrack] = useState<PortalTrackId>('ai-full-stack');
  const [memberPermissions, setMemberPermissions] = useState<TeamPermission[]>(() =>
    getDefaultPermissionsForRole('staff')
  );
  const [showCustomPerms, setShowCustomPerms] = useState(false);
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);

  // Inline Edit Team Member State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<Exclude<PortalRole, 'student'>>('staff');
  const [editTitle, setEditTitle] = useState('');
  const [editTrack, setEditTrack] = useState<PortalTrackId>('ai-full-stack');
  const [editPermissions, setEditPermissions] = useState<TeamPermission[]>([]);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2200);
  };

  const handleNewRoleChange = (role: Exclude<PortalRole, 'student'>) => {
    setMemberRole(role);
    setMemberPermissions(getDefaultPermissionsForRole(role));
  };

  const togglePermissionInList = (
    list: TeamPermission[],
    key: TeamPermission
  ): TeamPermission[] =>
    list.includes(key) ? list.filter((p) => p !== key) : [...list, key];

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;
    const next = addTeamMemberAccess({
      name: memberName.trim(),
      email: memberEmail.trim().toLowerCase(),
      role: memberRole,
      title: memberTitle.trim() || undefined,
      permissions:
        memberPermissions.length > 0
          ? memberPermissions
          : getDefaultPermissionsForRole(memberRole),
      assignedTrackId: memberTrack,
    });
    setTeam(next);
    setMemberName('');
    setMemberEmail('');
    setMemberTitle('');
    flash(`Added ${memberName.trim()} as ${roleLabels[memberRole]}`);
  };

  const startEditingMember = (member: TeamMemberAccess) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
    setEditTitle(member.title || '');
    setEditTrack(member.assignedTrackId || 'ai-full-stack');
    setEditPermissions(
      member.permissions && member.permissions.length > 0
        ? member.permissions
        : getDefaultPermissionsForRole(member.role)
    );
  };

  const handleEditRoleChange = (role: Exclude<PortalRole, 'student'>) => {
    setEditRole(role);
    setEditPermissions(getDefaultPermissionsForRole(role));
  };

  const handleSaveMemberEdit = (id: string) => {
    if (!editName.trim()) return;
    const next = updateTeamMemberAccess(id, {
      name: editName.trim(),
      role: editRole,
      title: editTitle.trim() || undefined,
      assignedTrackId: editTrack,
      permissions:
        editPermissions.length > 0
          ? editPermissions
          : getDefaultPermissionsForRole(editRole),
    });
    setTeam(next);
    setEditingId(null);
    flash(`Updated role & permissions for ${editName.trim()}`);
  };

  const handleCopyCredentials = (s: ProvisionedStudent) => {
    const text = `AtoZenius Portal Access (${s.batchCode})\nEmail: ${s.email}\nTemp Password: ${s.tempPassword}`;
    navigator.clipboard?.writeText(text);
    flash(`Copied login for ${s.name}`);
  };

  const activeTrackIds = getActiveTrackIds();

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
              Team Members &amp; Student Logins
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Team &amp; Access.
            </h1>
          </div>
          {notice && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
              <CheckCircle2 size={14} /> {notice}
            </span>
          )}
        </div>

        {/* Section 1: Team Members & Permissions */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleAddTeamMember}
            className="lg:col-span-5 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-8 space-y-6"
          >
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-accent font-semibold inline-flex items-center gap-1.5 mb-2">
                <UserPlus size={13} /> Add Team Member
              </span>
              <h2 className="text-2xl font-bold text-brand-dark tracking-[-0.02em]">
                Invite to workspace.
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full px-4 py-3 rounded-2xl bg-brand-cream/70 border border-brand-dark/10 text-sm text-brand-dark placeholder:text-brand-dark/35 focus:outline-none focus:bg-white focus:border-brand-dark transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="priya@atozenius.com"
                  className="w-full px-4 py-3 rounded-2xl bg-brand-cream/70 border border-brand-dark/10 text-sm text-brand-dark placeholder:text-brand-dark/35 focus:outline-none focus:bg-white focus:border-brand-dark transition-all"
                />
              </div>

              {/* Minimal Editorial Tab Role Selector */}
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 mb-2">
                  Role
                </span>
                <div className="grid grid-cols-4 border-b border-brand-dark/10">
                  {(['staff', 'manager', 'mentor', 'admin'] as Exclude<PortalRole, 'student'>[]).map(
                    (roleKey) => {
                      const isSelected = memberRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => {
                            handleNewRoleChange(roleKey);
                            setBatchDropdownOpen(false);
                          }}
                          className={`pb-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
                            isSelected
                              ? 'border-brand-dark text-brand-dark'
                              : 'border-transparent text-brand-dark/40 hover:text-brand-dark/75'
                          }`}
                        >
                          {roleLabels[roleKey]}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Job Title or Custom Minimal Batch Picker */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-dark/45 mb-1.5">
                  {memberRole === 'mentor' ? 'Assigned batch' : 'Title (optional)'}
                </label>
                {memberRole === 'mentor' ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setBatchDropdownOpen((prev) => !prev)}
                      className="w-full px-4 py-3 rounded-2xl bg-brand-cream/70 border border-brand-dark/10 text-xs font-bold text-brand-dark flex items-center justify-between gap-2 hover:border-brand-dark/30 transition-colors"
                    >
                      <span className="truncate">
                        {getResolvedTrackData(memberTrack).batchCode} ·{' '}
                        {getResolvedTrackData(memberTrack).courseTitle}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-brand-dark/50 shrink-0 transition-transform ${
                          batchDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {batchDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl bg-white border border-brand-dark/12 shadow-xl overflow-hidden z-30 divide-y divide-brand-dark/5">
                        {activeTrackIds.map((id) => {
                          const t = getResolvedTrackData(id);
                          const selected = id === memberTrack;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                setMemberTrack(id);
                                setBatchDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                                selected
                                  ? 'bg-brand-cream font-bold text-brand-dark'
                                  : 'text-brand-dark/70 hover:bg-brand-cream/50'
                              }`}
                            >
                              <span className="truncate">
                                {t.batchCode} · {t.courseTitle}
                              </span>
                              {selected && <Check size={13} className="text-brand-accent shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={memberTitle}
                    onChange={(e) => setMemberTitle(e.target.value)}
                    placeholder="e.g., Center Manager"
                    className="w-full px-4 py-3 rounded-2xl bg-brand-cream/70 border border-brand-dark/10 text-sm text-brand-dark placeholder:text-brand-dark/35 focus:outline-none focus:bg-white focus:border-brand-dark transition-all"
                  />
                )}
              </div>
            </div>

            {/* Quiet Progressive-Disclosure Permissions Summary */}
            <div className="pt-4 border-t border-brand-dark/10">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-brand-dark/40">
                    Access
                  </span>
                  <span className="text-xs font-medium text-brand-dark/75 block truncate">
                    {memberPermissions.length === ALL_TEAM_PERMISSIONS.length
                      ? 'Full workspace access'
                      : memberPermissions.length === 0
                      ? 'No sections selected'
                      : memberPermissions.map((p) => permissionShortLabel[p]).join(' · ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomPerms((prev) => !prev)}
                  className="text-xs font-semibold text-brand-dark/60 hover:text-brand-accent inline-flex items-center gap-1 shrink-0 transition-colors"
                >
                  {showCustomPerms ? 'Done' : 'Customize'}
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${showCustomPerms ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              {showCustomPerms && (
                <div className="mt-4 pt-3 border-t border-brand-dark/5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {ALL_TEAM_PERMISSIONS.map((perm) => {
                    const active = memberPermissions.includes(perm.key);
                    return (
                      <button
                        key={perm.key}
                        type="button"
                        onClick={() =>
                          setMemberPermissions((prev) => togglePermissionInList(prev, perm.key))
                        }
                        className="py-1 text-left flex items-center gap-2.5 group"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
                            active
                              ? 'bg-brand-dark text-white'
                              : 'border border-brand-dark/25 group-hover:border-brand-dark/50'
                          }`}
                        >
                          {active && <Check size={9} strokeWidth={3} />}
                        </span>
                        <span
                          className={`text-xs transition-colors ${
                            active
                              ? 'font-semibold text-brand-dark'
                              : 'text-brand-dark/45 group-hover:text-brand-dark/75'
                          }`}
                        >
                          {permissionShortLabel[perm.key]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors"
            >
              Add Team Member
            </button>
          </form>

          <div className="lg:col-span-7 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-dark/55">
                <ShieldCheck size={15} className="text-brand-accent" /> Team Members ({team.length})
              </div>
              <span className="text-xs text-brand-dark/50">
                Click Edit to promote or adjust permissions
              </span>
            </div>

            <div className="divide-y divide-brand-dark/10">
              {team.map((member) => {
                const track = member.assignedTrackId
                  ? getResolvedTrackData(member.assignedTrackId)
                  : null;
                const isEditing = editingId === member.id;
                const perms =
                  member.permissions && member.permissions.length > 0
                    ? member.permissions
                    : getDefaultPermissionsForRole(member.role);

                return (
                  <div key={member.id} className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-brand-dark">{member.name}</span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                              roleBadgeClass[member.role]
                            }`}
                          >
                            {roleLabels[member.role]}
                          </span>
                          {member.title && (
                            <span className="text-xs font-semibold text-brand-dark/60">
                              · {member.title}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-brand-dark/55 mt-0.5">
                          {member.email}
                          {track && member.role === 'mentor' ? ` · ${track.batchCode}` : ''}
                        </div>
                        <div className="text-[11px] text-brand-dark/60 mt-1">
                          Access:{' '}
                          <span className="font-semibold text-brand-dark/80">
                            {perms.map((p) => permissionShortLabel[p]).join(' · ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            isEditing ? setEditingId(null) : startEditingMember(member)
                          }
                          className="text-xs font-bold text-brand-dark/75 hover:text-brand-accent hover:bg-brand-cream px-3 py-1.5 rounded-full inline-flex items-center gap-1 border border-brand-dark/10"
                        >
                          {isEditing ? <X size={13} /> : <Edit3 size={13} />}
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTeam(removeTeamMemberAccess(member.id));
                            flash(`Removed ${member.name}`);
                          }}
                          className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Inline Role, Promotion & Permission Editor */}
                    {isEditing && (
                      <div className="mt-4 p-5 rounded-2xl bg-[#F7F4EE] border border-brand-dark/10 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-brand-dark/15 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1">
                              Role / Promotion
                            </label>
                            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white border border-brand-dark/15">
                              {(
                                ['staff', 'manager', 'mentor', 'admin'] as Exclude<
                                  PortalRole,
                                  'student'
                                >[]
                              ).map((roleKey) => {
                                const selected = editRole === roleKey;
                                return (
                                  <button
                                    key={roleKey}
                                    type="button"
                                    onClick={() => handleEditRoleChange(roleKey)}
                                    className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                                      selected
                                        ? 'bg-brand-dark text-white'
                                        : 'text-brand-dark/65 hover:text-brand-dark hover:bg-brand-cream'
                                    }`}
                                  >
                                    {roleLabels[roleKey]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-dark/55 mb-1">
                              {editRole === 'mentor' ? 'Assigned Batch' : 'Title'}
                            </label>
                            {editRole === 'mentor' ? (
                              <MinimalSelect
                                value={editTrack}
                                onChange={(val) => setEditTrack(val as PortalTrackId)}
                                tone="light"
                                size="sm"
                                options={activeTrackIds.map((id) => {
                                  const t = getResolvedTrackData(id);
                                  return {
                                    value: id,
                                    label: t.batchCode,
                                    meta: t.courseTitle,
                                  };
                                })}
                              />
                            ) : (
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="e.g., Operations Manager"
                                className="w-full px-3 py-2 rounded-xl bg-white border border-brand-dark/15 text-xs"
                              />
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                            Custom Permissions
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ALL_TEAM_PERMISSIONS.map((perm) => {
                              const checked = editPermissions.includes(perm.key);
                              return (
                                <button
                                  key={perm.key}
                                  type="button"
                                  onClick={() =>
                                    setEditPermissions((prev) =>
                                      togglePermissionInList(prev, perm.key)
                                    )
                                  }
                                  className={`p-2.5 rounded-xl border text-left transition-colors flex items-start gap-2.5 ${
                                    checked
                                      ? 'bg-white border-brand-accent/40 text-brand-dark'
                                      : 'bg-white/50 border-brand-dark/10 text-brand-dark/55'
                                  }`}
                                >
                                  <span
                                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                      checked
                                        ? 'bg-brand-accent text-white'
                                        : 'border border-brand-dark/25 bg-white'
                                    }`}
                                  >
                                    {checked && <Check size={10} strokeWidth={3} />}
                                  </span>
                                  <span>
                                    <span className="block text-xs font-bold">{perm.label}</span>
                                    <span className="block text-[10px] text-brand-dark/55 leading-snug">
                                      {perm.description}
                                    </span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveMemberEdit(member.id)}
                            className="px-5 py-2 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 text-xs font-bold text-brand-dark/60 hover:text-brand-dark"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2: Student Portal Passwords */}
        <section className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-brand-dark/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-accent font-semibold mb-1">
                <KeyRound size={14} /> ENROLLED STUDENT LOGINS ({students.length})
              </div>
              <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
                Student Portal Passwords
              </h2>
            </div>
            <span className="text-xs text-brand-dark/55">
              Created when students join via WhatsApp or walk-in
            </span>
          </div>

          {students.length === 0 ? (
            <p className="text-sm text-brand-dark/60 py-6">
              No student logins created yet. Add an enrolled student under Operations → Admissions.
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
                      <MinimalSelect
                        value={st.trackId}
                        ariaLabel={`Batch for ${st.name}`}
                        tone="light"
                        size="sm"
                        align="right"
                        onChange={(val) => {
                          setStudents(
                            updateProvisionedStudentBatch(st.id, val as PortalTrackId)
                          );
                          flash(`Updated batch for ${st.name}`);
                        }}
                        options={activeTrackIds.map((id) => {
                          const t = getResolvedTrackData(id);
                          return {
                            value: id,
                            label: t.batchCode,
                            meta: t.courseTitle,
                          };
                        })}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setStudents(resetProvisionedStudentPassword(st.id));
                          flash(`Reset password for ${st.name}`);
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
                              ? `Paused access for ${st.name}`
                              : `Restored access for ${st.name}`
                          );
                        }}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold ${
                          st.status === 'Active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {st.status === 'Active' ? 'Pause' : 'Restore'}
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
