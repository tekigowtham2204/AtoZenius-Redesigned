import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Megaphone,
  Shield,
  Sliders,
  Users,
} from 'lucide-react';
import {
  getActiveTrackIds,
  getAdmissionsLeads,
  getIssuedCertificates,
  getProvisionedStudents,
  getResolvedCourses,
  getResolvedMentors,
  getResolvedTrackData,
  getSiteConfig,
  getTeamAccessList,
  PortalSession,
  ProjectReviewOverride,
  ProjectSubmissionRecord,
  readStorage,
  saveSiteConfig,
  SiteControlConfig,
  STORAGE_KEYS,
} from '../../../data/portal';
import { ViewState } from '../../../types';
import { OperationsTab } from './AdminOperationsPage';

interface AdminOverviewPageProps {
  session: PortalSession;
  onNavigate: (view: ViewState) => void;
  onOpenOperations?: (tab: OperationsTab) => void;
}

const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  session,
  onNavigate,
  onOpenOperations,
}) => {
  const [config, setConfig] = useState<SiteControlConfig>(() => getSiteConfig());
  const [announcementDraft, setAnnouncementDraft] = useState(config.announcementText);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const leads = getAdmissionsLeads();
  const provisioned = getProvisionedStudents();
  const teamMembers = getTeamAccessList();
  const certs = getIssuedCertificates();
  const visibleCourses = getResolvedCourses();
  const visibleMentors = getResolvedMentors();

  const bookmarksMap = readStorage<Record<string, boolean>>(STORAGE_KEYS.bookmarks, {});
  const revisedMap = readStorage<Record<string, boolean>>(STORAGE_KEYS.revised, {});
  const submissionsMap = readStorage<Record<string, ProjectSubmissionRecord>>(
    STORAGE_KEYS.submissions,
    {}
  );
  const reviewsMap = readStorage<Record<string, ProjectReviewOverride>>(
    STORAGE_KEYS.projectReviews,
    {}
  );

  const newLeads = leads.filter((l) => l.status === 'New').length;
  const counselingLeads = leads.filter((l) => l.status === 'Counseling').length;
  const enrolledLeads = leads.filter((l) => l.status === 'Enrolled').length;
  const activeProvisioned = provisioned.filter((s) => s.status === 'Active').length;
  const revokedProvisioned = provisioned.filter((s) => s.status === 'Revoked').length;

  const adminCount = teamMembers.filter((m) => m.role === 'admin').length;
  const mentorCount = teamMembers.filter((m) => m.role === 'mentor').length;
  const staffCount = teamMembers.filter((m) => m.role === 'staff').length;

  const activeTrackIds = getActiveTrackIds();
  let lecturesRevisedCount = 0;
  let notesBookmarkedCount = 0;
  let projectsSubmittedCount = 0;
  let communityPostsCount = 0;

  activeTrackIds.forEach((id) => {
    const track = getResolvedTrackData(id);
    lecturesRevisedCount += track.lectures.filter((l) => revisedMap[l.id]).length;
    notesBookmarkedCount += track.lectures.filter((l) => bookmarksMap[l.id]).length;
    projectsSubmittedCount += track.projects.filter((p) => {
      const rev = reviewsMap[p.id];
      const status = rev?.status || (submissionsMap[p.id] ? 'Submitted' : p.defaultStatus);
      return status !== 'Not Started';
    }).length;
    communityPostsCount += track.threads.length;
  });

  const flashNotice = (label: string) => {
    setSavedNotice(label);
    window.setTimeout(() => setSavedNotice(null), 1800);
  };

  const handleToggle = (key: keyof Pick<
    SiteControlConfig,
    | 'showDemoPreview'
    | 'allowSelfSignupExplore'
    | 'communityReadOnly'
    | 'showCareersInHeader'
    | 'enableBatchWhatsAppLinks'
  >) => {
    const next = saveSiteConfig({ [key]: !config[key] });
    setConfig(next);
    flashNotice('Setting saved');
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const next = saveSiteConfig({ announcementText: announcementDraft.trim() });
    setConfig(next);
    flashNotice(
      next.announcementText ? 'Announcement bar updated' : 'Announcement bar cleared'
    );
  };

  const openOpsTab = (tab: OperationsTab) => {
    if (onOpenOperations) {
      onOpenOperations(tab);
    } else {
      onNavigate('admin-operations');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-8 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-accent font-semibold mb-2">
              Institute Overview &amp; Settings
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Overview.
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {savedNotice && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 size={14} /> {savedNotice}
              </span>
            )}
            <span className="text-xs font-mono text-brand-dark/55">
              Signed in as {session.name}
            </span>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {/* Card 1: Admissions */}
          <div className="bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#60A5FA] mb-4">
                <span>ADMISSIONS</span>
                <Users size={15} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                {leads.length} Student Inquiries
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-white/45 font-mono block">WAITING</span>
                  <span className="font-bold text-white">
                    {newLeads} New · {counselingLeads} Counseling
                  </span>
                </div>
                <div>
                  <span className="text-white/45 font-mono block">JOINED</span>
                  <span className="font-bold text-emerald-400">
                    {enrolledLeads} Enrolled · {activeProvisioned} Logins
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openOpsTab('admissions')}
              className="mt-6 text-xs font-bold text-[#60A5FA] hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              Open Admissions <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 2: Active Batches */}
          <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-brand-accent mb-4">
                <span>ACTIVE BATCHES</span>
                <Activity size={15} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-4">
                {activeTrackIds.length} Running Batches
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-dark/10 text-xs">
                <div>
                  <span className="text-brand-dark/45 font-mono block">CLASS NOTES</span>
                  <span className="font-bold text-brand-dark">
                    {lecturesRevisedCount} Revised · {notesBookmarkedCount} Saved
                  </span>
                </div>
                <div>
                  <span className="text-brand-dark/45 font-mono block">STUDENT WORK</span>
                  <span className="font-bold text-brand-dark">
                    {projectsSubmittedCount} Projects · {communityPostsCount} Posts
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openOpsTab('batches')}
              className="mt-6 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
            >
              Manage Batches <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 3: Team & Access (Dedicated Card) */}
          <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-brand-accent mb-4">
                <span>TEAM &amp; ACCESS</span>
                <KeyRound size={15} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-4">
                {teamMembers.length} Team · {activeProvisioned} Logins
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-dark/10 text-xs">
                <div>
                  <span className="text-brand-dark/45 font-mono block">STAFF &amp; MENTORS</span>
                  <span className="font-bold text-brand-dark">
                    {mentorCount} Mentors · {staffCount + adminCount} Team
                  </span>
                </div>
                <div>
                  <span className="text-brand-dark/45 font-mono block">STUDENT LOGINS</span>
                  <span className="font-bold text-brand-dark">
                    {activeProvisioned} Active · {revokedProvisioned} Paused
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin-access')}
              className="mt-6 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
            >
              Manage Team &amp; Access <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 4: Website & Courses */}
          <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-brand-accent mb-4">
                <span>WEBSITE &amp; COURSES</span>
                <Shield size={15} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-4">
                {visibleCourses.length} Live Courses
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-dark/10 text-xs">
                <div>
                  <span className="text-brand-dark/45 font-mono block">FACULTY</span>
                  <span className="font-bold text-brand-dark">{visibleMentors.length} Mentors</span>
                </div>
                <div>
                  <span className="text-brand-dark/45 font-mono block">CERTIFICATES</span>
                  <span className="font-bold text-brand-dark">{certs.length} Issued</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin-website')}
              className="mt-6 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
            >
              Edit Website <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Site & Student Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
              Site &amp; Student Controls
            </h2>
          </div>
          <span className="text-xs font-mono text-brand-dark/50">
            Changes go live right away
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <ControlToggleCard
            eyebrow="SIGN-IN PAGE"
            title="Show Demo Sign-In Buttons"
            description="Show quick sample accounts on the sign-in page for walkthroughs. Turn off before sharing with real students."
            enabled={config.showDemoPreview}
            onLabel="Shown"
            offLabel="Hidden"
            onToggle={() => handleToggle('showDemoPreview')}
          />

          <ControlToggleCard
            eyebrow="NEW STUDENT SIGNUPS"
            title="Let New Signups Browse Courses"
            description="When on, students who sign up online can browse class notes right away. Turn off to require an admission batch code first."
            enabled={config.allowSelfSignupExplore}
            onLabel="Open Browsing"
            offLabel="Batch Code Only"
            onToggle={() => handleToggle('allowSelfSignupExplore')}
          />

          <ControlToggleCard
            eyebrow="BATCH DISCUSSIONS"
            title="Allow Student Questions & Replies"
            description="Let students post doubts and replies online, or switch to read-only so only mentor updates appear."
            enabled={!config.communityReadOnly}
            onLabel="Students Can Post"
            offLabel="Read-Only"
            onToggle={() => handleToggle('communityReadOnly')}
          />

          <ControlToggleCard
            eyebrow="TOP MENU"
            title="Show Careers Link in Menu"
            description="Show or hide the Careers link in the top navigation bar based on active hiring drives."
            enabled={config.showCareersInHeader}
            onLabel="Visible"
            offLabel="Hidden"
            onToggle={() => handleToggle('showCareersInHeader')}
          />

          <ControlToggleCard
            eyebrow="MENTOR-STUDENT CHAT"
            title="Show External Batch WhatsApp Links"
            description="Keep all student-mentor doubts inside AtoZenius Messages by default, or allow external batch WhatsApp group links."
            enabled={config.enableBatchWhatsAppLinks}
            onLabel="WhatsApp Links Shown"
            offLabel="In-App Only"
            onToggle={() => handleToggle('enableBatchWhatsAppLinks')}
          />
        </div>

        {/* Homepage Announcement Bar */}
        <form
          onSubmit={handleSaveAnnouncement}
          className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-accent font-semibold">
              <Megaphone size={14} /> Homepage Announcement Bar
            </span>
            <span className="text-xs font-mono text-brand-dark/45">
              Leave blank to hide on the website
            </span>
          </div>
          <p className="text-sm text-brand-dark/65 mb-4">
            Show a short notice at the top of the home page (for example, upcoming batch start dates).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={announcementDraft}
              onChange={(e) => setAnnouncementDraft(e.target.value)}
              placeholder="e.g., New Offline Medical Coding & AI Full-Stack Batches Starting Next Monday"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm text-brand-dark focus:outline-none focus:border-brand-accent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors shrink-0"
            >
              Update Notice
            </button>
            {config.announcementText && (
              <button
                type="button"
                onClick={() => {
                  setAnnouncementDraft('');
                  const next = saveSiteConfig({ announcementText: '' });
                  setConfig(next);
                  flashNotice('Announcement bar cleared');
                }}
                className="px-5 py-3 border border-brand-dark/15 text-brand-dark/70 rounded-full text-xs font-bold hover:border-brand-dark/40 transition-colors shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

interface ControlToggleCardProps {
  eyebrow: string;
  title: string;
  description: string;
  enabled: boolean;
  onLabel: string;
  offLabel: string;
  onToggle: () => void;
}

const ControlToggleCard: React.FC<ControlToggleCardProps> = ({
  eyebrow,
  title,
  description,
  enabled,
  onLabel,
  offLabel,
  onToggle,
}) => (
  <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between gap-5">
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-dark/45">
          {eyebrow}
        </span>
        <span
          className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
            enabled
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-brand-cream text-brand-dark/60 border border-brand-dark/10'
          }`}
        >
          {enabled ? onLabel : offLabel}
        </span>
      </div>
      <h3 className="text-lg font-bold text-brand-dark tracking-tight mb-1.5">{title}</h3>
      <p className="text-xs text-brand-dark/65 leading-relaxed">{description}</p>
    </div>

    <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
      <span className="text-xs font-semibold text-brand-dark/60">
        Currently <strong className="text-brand-dark">{enabled ? 'On' : 'Off'}</strong>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          enabled ? 'bg-brand-accent' : 'bg-brand-dark/20'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  </div>
);

export default AdminOverviewPage;
