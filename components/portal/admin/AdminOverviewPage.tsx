import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Megaphone,
  Shield,
  Sliders,
  Users,
} from 'lucide-react';
import {
  allTrackIds,
  getAdmissionsLeads,
  getIssuedCertificates,
  getProvisionedStudents,
  getResolvedCourses,
  getResolvedMentors,
  getResolvedTrackData,
  getSiteConfig,
  PortalSession,
  ProjectReviewOverride,
  ProjectSubmissionRecord,
  readStorage,
  saveSiteConfig,
  SiteControlConfig,
  STORAGE_KEYS,
} from '../../../data/portal';
import { ViewState } from '../../../types';

interface AdminOverviewPageProps {
  session: PortalSession;
  onNavigate: (view: ViewState) => void;
}

const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ session, onNavigate }) => {
  const [config, setConfig] = useState<SiteControlConfig>(() => getSiteConfig());
  const [announcementDraft, setAnnouncementDraft] = useState(config.announcementText);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const leads = getAdmissionsLeads();
  const provisioned = getProvisionedStudents();
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

  let lecturesRevisedCount = 0;
  let notesBookmarkedCount = 0;
  let projectsSubmittedCount = 0;
  let communityPostsCount = 0;

  allTrackIds.forEach((id) => {
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
    'showDemoPreview' | 'allowSelfSignupExplore' | 'communityReadOnly' | 'showCareersInHeader'
  >) => {
    const next = saveSiteConfig({ [key]: !config[key] });
    setConfig(next);
    flashNotice('Platform setting updated live');
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const next = saveSiteConfig({ announcementText: announcementDraft.trim() });
    setConfig(next);
    flashNotice(
      next.announcementText ? 'Announcement strip published' : 'Announcement strip cleared'
    );
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
              Owner Governance &amp; Live Usage Controls
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Command Overview.
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

        {/* Live Usage Telemetry Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#60A5FA] mb-4">
                <span>ADMISSIONS FUNNEL</span>
                <Users size={15} />
              </div>
              <div className="text-3xl font-extrabold tracking-tight mb-4">
                {leads.length} Total Leads
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-white/45 font-mono block">NEW / COUNSELING</span>
                  <span className="font-bold text-white">
                    {newLeads} New · {counselingLeads} Counseling
                  </span>
                </div>
                <div>
                  <span className="text-white/45 font-mono block">ENROLLED / CREDENTIALS</span>
                  <span className="font-bold text-emerald-400">
                    {enrolledLeads} Enrolled · {activeProvisioned} Active
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin-operations')}
              className="mt-6 text-xs font-bold text-[#60A5FA] hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              Open Admissions Desk <ArrowRight size={13} />
            </button>
          </div>

          <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-brand-accent mb-4">
                <span>LEARNING ACTIVITY</span>
                <Activity size={15} />
              </div>
              <div className="text-3xl font-extrabold text-brand-dark tracking-tight mb-4">
                {allTrackIds.length} Active Cohorts
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-dark/10 text-xs">
                <div>
                  <span className="text-brand-dark/45 font-mono block">STUDY GUIDES</span>
                  <span className="font-bold text-brand-dark">
                    {lecturesRevisedCount} Revised · {notesBookmarkedCount} Saved
                  </span>
                </div>
                <div>
                  <span className="text-brand-dark/45 font-mono block">WORK &amp; Q&amp;A</span>
                  <span className="font-bold text-brand-dark">
                    {projectsSubmittedCount} Projects · {communityPostsCount} Posts
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin-access')}
              className="mt-6 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
            >
              Manage Access &amp; Roles <ArrowRight size={13} />
            </button>
          </div>

          <div className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-brand-accent mb-4">
                <span>CATALOG &amp; FACULTY</span>
                <Shield size={15} />
              </div>
              <div className="text-3xl font-extrabold text-brand-dark tracking-tight mb-4">
                {visibleCourses.length} Live Courses
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-dark/10 text-xs">
                <div>
                  <span className="text-brand-dark/45 font-mono block">FACULTY ROSTER</span>
                  <span className="font-bold text-brand-dark">{visibleMentors.length} Visible Mentors</span>
                </div>
                <div>
                  <span className="text-brand-dark/45 font-mono block">CREDENTIALS</span>
                  <span className="font-bold text-brand-dark">{certs.length} Issued Certs</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin-website')}
              className="mt-6 text-xs font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
            >
              Edit Website CMS <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Governance & Usage-Based Control Switches */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
              Feature &amp; Governance Controls
            </h2>
          </div>
          <span className="text-xs font-mono text-brand-dark/50">
            Changes apply immediately across public site &amp; portals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <ControlToggleCard
            eyebrow="AUTH SCREEN (/get-started)"
            title="Public Demo Preview Buttons"
            description="Show 1-click learner demo track buttons and role autofill hints on the sign-in screen. Turn OFF when launching live to enrolled offline students."
            enabled={config.showDemoPreview}
            onLabel="Demo Visible"
            offLabel="Pure Login Only"
            onToggle={() => handleToggle('showDemoPreview')}
          />

          <ControlToggleCard
            eyebrow="SIGNUP & ONBOARDING (/dashboard)"
            title="Allow Self-Signup Track Exploration"
            description="When ON, self-registered learners can pick a track inside Dashboard to browse study notes. When OFF (Strict Offline Mode), they must claim a staff Batch Code."
            enabled={config.allowSelfSignupExplore}
            onLabel="Explore Allowed"
            offLabel="Strict Batch Code"
            onToggle={() => handleToggle('allowSelfSignupExplore')}
          />

          <ControlToggleCard
            eyebrow="BATCH COMMUNITY (/community)"
            title="Student Community Posting"
            description="Switch between open student doubt posting/replies vs read-only mode where students view Mentor Announcements and use WhatsApp for doubts."
            enabled={!config.communityReadOnly}
            onLabel="Open (Post & Reply)"
            offLabel="Read-Only Mode"
            onToggle={() => handleToggle('communityReadOnly')}
          />

          <ControlToggleCard
            eyebrow="PUBLIC NAVIGATION"
            title="Show Careers Page in Header"
            description="Toggle visibility of the Careers link in the top public navigation bar based on active placement drives and hiring seasons."
            enabled={config.showCareersInHeader}
            onLabel="Visible in Nav"
            offLabel="Hidden from Nav"
            onToggle={() => handleToggle('showCareersInHeader')}
          />
        </div>

        {/* Site-Wide Announcement Strip Control */}
        <form
          onSubmit={handleSaveAnnouncement}
          className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-accent font-semibold">
              <Megaphone size={14} /> Site-Wide Announcement Strip
            </span>
            <span className="text-xs font-mono text-brand-dark/45">
              Leave blank to hide banner on public pages
            </span>
          </div>
          <p className="text-sm text-brand-dark/65 mb-4">
            Displays a crisp announcement strip below the navbar on public landing pages (e.g., new offline batch start dates).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={announcementDraft}
              onChange={(e) => setAnnouncementDraft(e.target.value)}
              placeholder="e.g., New Offline Medical Coding & AI Full-Stack Batches Starting Next Monday"
              className="flex-1 px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm text-brand-dark focus:outline-none focus:border-brand-accent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors shrink-0"
            >
              Update Banner
            </button>
            {config.announcementText && (
              <button
                type="button"
                onClick={() => {
                  setAnnouncementDraft('');
                  const next = saveSiteConfig({ announcementText: '' });
                  setConfig(next);
                  flashNotice('Announcement strip cleared');
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
        Status: <strong className="text-brand-dark">{enabled ? 'Active' : 'Off'}</strong>
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
