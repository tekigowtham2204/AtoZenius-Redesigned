import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import {
  createCustomCohort,
  deleteCustomCohort,
  getAllAdminCourses,
  getAllTrackIds,
  getCohortsForCourse,
  getResolvedCourses,
  getResolvedTrackData,
  isCustomCohort,
  PortalTrackId,
  saveBatchOverride,
  toggleBatchStatus,
} from '../../../data/portal';

interface StaffBatchesPageProps {
  embedded?: boolean;
}

const StaffBatchesPage: React.FC<StaffBatchesPageProps> = ({ embedded = false }) => {
  const [, setRefreshTick] = useState(0);
  const allIds = getAllTrackIds(true);
  const allCourses = getAllAdminCourses();
  const liveCourses = getResolvedCourses();
  const [selectedTrackId, setSelectedTrackId] = useState<PortalTrackId>(
    allIds[0] || 'ai-full-stack'
  );
  const track = getResolvedTrackData(selectedTrackId);

  const [courseId, setCourseId] = useState(track.courseId || track.id);
  const [batchCode, setBatchCode] = useState(track.batchCode);
  const [branchLocation, setBranchLocation] = useState(track.branchLocation);
  const [nextSessionTime, setNextSessionTime] = useState(track.nextSessionTime);
  const [nextSessionTopic, setNextSessionTopic] = useState(track.nextSessionTopic);
  const [mentorName, setMentorName] = useState(track.mentorName);
  const [mentorRole, setMentorRole] = useState(track.mentorRole);
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState(track.whatsappGroupUrl);
  const [prepChecklistText, setPrepChecklistText] = useState(
    track.prepChecklist.join('\n')
  );
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Add New Cohort form state (driven by Course selection)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourseId, setNewCourseId] = useState(
    liveCourses[0]?.id || allCourses[0]?.id || 'ai-full-stack'
  );
  const [newBatchCode, setNewBatchCode] = useState('');
  const [newBranchLocation, setNewBranchLocation] = useState('Madhapur Tech Hub · Room 201');
  const [newNextSessionTime, setNewNextSessionTime] = useState('Monday · 10:00 AM – 12:30 PM');
  const [newNextSessionTopic, setNewNextSessionTopic] = useState('Orientation & Foundation Lab');
  const [newMentorName, setNewMentorName] = useState('');
  const [newMentorRole, setNewMentorRole] = useState('Lead Cohort Mentor');

  const syncFormFromTrack = (id: PortalTrackId) => {
    const resolved = getResolvedTrackData(id);
    setCourseId(resolved.courseId || resolved.id);
    setBatchCode(resolved.batchCode);
    setBranchLocation(resolved.branchLocation);
    setNextSessionTime(resolved.nextSessionTime);
    setNextSessionTopic(resolved.nextSessionTopic);
    setMentorName(resolved.mentorName);
    setMentorRole(resolved.mentorRole);
    setWhatsappGroupUrl(resolved.whatsappGroupUrl);
    setPrepChecklistText(resolved.prepChecklist.join('\n'));
  };

  useEffect(() => {
    syncFormFromTrack(selectedTrackId);
  }, [selectedTrackId]);

  const flashNotice = (msg: string) => {
    setSavedMessage(msg);
    setRefreshTick((n) => n + 1);
    window.setTimeout(() => setSavedMessage(null), 2200);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const linkedCourse = allCourses.find((c) => c.id === courseId);
    const normalizedCode = batchCode.trim().startsWith('Batch')
      ? batchCode.trim()
      : `Batch #${batchCode.trim().replace(/^#/, '')}`;
    const checklist = prepChecklistText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    saveBatchOverride(selectedTrackId, {
      courseId,
      courseTitle: linkedCourse?.title || track.courseTitle,
      batchCode: normalizedCode || track.batchCode,
      branchLocation: branchLocation.trim(),
      nextSessionTime: nextSessionTime.trim(),
      nextSessionTopic: nextSessionTopic.trim(),
      mentorName: mentorName.trim(),
      mentorRole: mentorRole.trim() || track.mentorRole,
      whatsappGroupUrl: whatsappGroupUrl.trim(),
      prepChecklist: checklist.length > 0 ? checklist : track.prepChecklist,
    });
    setBatchCode(normalizedCode || track.batchCode);
    flashNotice('Cohort & Course link synced across all portals');
  };

  const handleCreateCohort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseId || !newBatchCode.trim() || !newMentorName.trim()) return;
    const created = createCustomCohort({
      courseId: newCourseId,
      batchCode: newBatchCode,
      branchLocation: newBranchLocation,
      nextSessionTime: newNextSessionTime,
      nextSessionTopic: newNextSessionTopic,
      mentorName: newMentorName,
      mentorRole: newMentorRole,
    });
    setShowAddForm(false);
    setNewBatchCode('');
    setNewMentorName('');
    setSelectedTrackId(created.id);
    syncFormFromTrack(created.id);
    flashNotice(`Launched ${created.batchCode} for ${created.courseTitle}`);
  };

  const handleToggleArchive = () => {
    const nextStatus = toggleBatchStatus(selectedTrackId);
    flashNotice(
      nextStatus === 'archived'
        ? `${track.batchCode} archived (hidden from active selectors)`
        : `${track.batchCode} restored to Active`
    );
  };

  const handleDeleteCohort = () => {
    if (!isCustomCohort(selectedTrackId)) return;
    const deletedLabel = track.batchCode;
    deleteCustomCohort(selectedTrackId);
    const remaining = getAllTrackIds(true);
    const nextId = remaining[0] || 'ai-full-stack';
    setSelectedTrackId(nextId);
    syncFormFromTrack(nextId);
    flashNotice(`Deleted ${deletedLabel}`);
  };

  const isArchived = track.status === 'archived';
  const isCustom = isCustomCohort(selectedTrackId);
  const linkedCourseObj = allCourses.find((c) => c.id === (track.courseId || track.id));

  const content = (
    <div className={embedded ? '' : 'container mx-auto px-6 max-w-5xl'}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-brand-dark/10">
        {!embedded ? (
          <div>
            <p className="text-xs font-mono text-brand-accent font-semibold mb-2">
              Batch Schedules &amp; Classrooms
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Batches.
            </h1>
          </div>
        ) : (
          <div className="text-xs font-mono text-brand-accent font-semibold">
            Each batch connects directly to a course on your website
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2 self-start md:self-auto"
        >
          {showAddForm ? <X size={14} /> : <Plus size={14} />}
          {showAddForm ? 'Close Form' : 'Start a New Batch'}
        </button>
      </div>

      {/* Add New Cohort Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateCohort}
          className="mb-8 bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 sm:p-9 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] font-mono text-[#60A5FA]">
                NEW BATCH
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-0.5">
                Start a New Classroom Batch
              </h2>
            </div>
            <span className="text-xs text-white/55">
              Class notes and projects are set up automatically from the selected course
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                Course
              </label>
              <select
                value={newCourseId}
                onChange={(e) => setNewCourseId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-[#60A5FA]"
              >
                {allCourses.map((c) => {
                  const count = getCohortsForCourse(c.id).length;
                  return (
                    <option key={c.id} value={c.id} className="text-brand-dark">
                      {c.title} · {count > 0 ? `${count} running` : 'No batch yet'}
                      {c.isHidden ? ' (Hidden)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                Batch Code
              </label>
              <input
                type="text"
                required
                value={newBatchCode}
                onChange={(e) => setNewBatchCode(e.target.value)}
                placeholder="e.g., PFS-04 or FS-09"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={newMentorName}
              onChange={(e) => setNewMentorName(e.target.value)}
              placeholder="Lead Mentor Name"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />
            <input
              type="text"
              value={newMentorRole}
              onChange={(e) => setNewMentorRole(e.target.value)}
              placeholder="Mentor Role / Credential"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={newBranchLocation}
              onChange={(e) => setNewBranchLocation(e.target.value)}
              placeholder="Center & Classroom"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />
            <input
              type="text"
              required
              value={newNextSessionTime}
              onChange={(e) => setNewNextSessionTime(e.target.value)}
              placeholder="Session Timing"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
            />
          </div>

          <input
            type="text"
            required
            value={newNextSessionTopic}
            onChange={(e) => setNewNextSessionTopic(e.target.value)}
            placeholder="First / Upcoming Lecture Topic"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-7 py-3 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors"
            >
              Create &amp; Link Cohort
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-3 text-xs font-bold text-white/60 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Cohort Selector Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allIds.map((id) => {
          const t = getResolvedTrackData(id);
          const archived = t.status === 'archived';
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedTrackId(id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-2 ${
                id === selectedTrackId
                  ? 'bg-brand-dark text-white'
                  : 'bg-white border border-brand-dark/10 text-brand-dark/70 hover:border-brand-dark/30'
              }`}
            >
              <span>{t.batchCode}</span>
              {archived && (
                <span className="text-[10px] font-mono uppercase opacity-70">(Archived)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Edit Selected Cohort Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-10 space-y-6"
      >
        <div className="pb-5 border-b border-brand-dark/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono text-brand-accent font-semibold">
                {track.batchCode}
              </span>
              <span
                className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                  isArchived
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isArchived ? 'Archived' : 'Active'}
              </span>
              {linkedCourseObj && (
                <span className="text-[11px] font-mono text-brand-dark/55 inline-flex items-center gap-1">
                  <BookOpen size={11} className="text-brand-accent" />
                  {linkedCourseObj.category} · {linkedCourseObj.duration}
                  {linkedCourseObj.isHidden ? ' (Course Hidden)' : ''}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mt-1">{track.courseTitle}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleArchive}
              className="px-4 py-2 rounded-full border border-brand-dark/15 text-xs font-bold text-brand-dark/75 hover:border-brand-dark/40 inline-flex items-center gap-1.5"
            >
              {isArchived ? <RotateCcw size={13} /> : <Archive size={13} />}
              {isArchived ? 'Restore Cohort' : 'Archive Cohort'}
            </button>
            {isCustom && (
              <button
                type="button"
                onClick={handleDeleteCohort}
                className="px-4 py-2 rounded-full border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 inline-flex items-center gap-1.5"
              >
                <Trash2 size={13} /> Delete
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
              Linked Course
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm font-semibold focus:outline-none focus:border-brand-accent"
            >
              {allCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.category}) {c.isHidden ? '— Hidden' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
              Batch Code
            </label>
            <input
              type="text"
              required
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm font-mono focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
              Center &amp; Classroom
            </label>
            <input
              type="text"
              required
              value={branchLocation}
              onChange={(e) => setBranchLocation(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
              Next Session Timing
            </label>
            <input
              type="text"
              required
              value={nextSessionTime}
              onChange={(e) => setNextSessionTime(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
            Upcoming Lecture Topic
          </label>
          <input
            type="text"
            required
            value={nextSessionTopic}
            onChange={(e) => setNextSessionTopic(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
              Lead Batch Mentor
            </label>
            <input
              type="text"
              required
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
              Mentor Role / Credential
            </label>
            <input
              type="text"
              required
              value={mentorRole}
              onChange={(e) => setMentorRole(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
            Batch WhatsApp Invite Link
          </label>
          <input
            type="url"
            required
            value={whatsappGroupUrl}
            onChange={(e) => setWhatsappGroupUrl(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
            Offline Class Prep Checklist (One item per line)
          </label>
          <textarea
            rows={3}
            value={prepChecklistText}
            onChange={(e) => setPrepChecklistText(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            className="px-7 py-3.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
          >
            <Save size={14} /> Update Cohort Details
          </button>

          {savedMessage && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={15} /> {savedMessage}
            </span>
          )}
        </div>
      </form>
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

export default StaffBatchesPage;
