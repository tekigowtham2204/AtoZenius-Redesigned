import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle2 } from 'lucide-react';
import {
  allTrackIds,
  BatchOverride,
  getResolvedTrackData,
  PortalTrackId,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../../../data/portal';

interface StaffBatchesPageProps {
  embedded?: boolean;
}

const StaffBatchesPage: React.FC<StaffBatchesPageProps> = ({ embedded = false }) => {
  const [selectedTrackId, setSelectedTrackId] = useState<PortalTrackId>('ai-full-stack');
  const track = getResolvedTrackData(selectedTrackId);

  const [branchLocation, setBranchLocation] = useState(track.branchLocation);
  const [nextSessionTime, setNextSessionTime] = useState(track.nextSessionTime);
  const [nextSessionTopic, setNextSessionTopic] = useState(track.nextSessionTopic);
  const [mentorName, setMentorName] = useState(track.mentorName);
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState(track.whatsappGroupUrl);
  const [savedFlag, setSavedFlag] = useState(false);

  useEffect(() => {
    const resolved = getResolvedTrackData(selectedTrackId);
    setBranchLocation(resolved.branchLocation);
    setNextSessionTime(resolved.nextSessionTime);
    setNextSessionTopic(resolved.nextSessionTopic);
    setMentorName(resolved.mentorName);
    setWhatsappGroupUrl(resolved.whatsappGroupUrl);
  }, [selectedTrackId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = readStorage<Record<string, BatchOverride>>(
      STORAGE_KEYS.batchOverrides,
      {}
    );
    writeStorage(STORAGE_KEYS.batchOverrides, {
      ...existing,
      [selectedTrackId]: {
        branchLocation: branchLocation.trim(),
        nextSessionTime: nextSessionTime.trim(),
        nextSessionTopic: nextSessionTopic.trim(),
        mentorName: mentorName.trim(),
        whatsappGroupUrl: whatsappGroupUrl.trim(),
      },
    });
    setSavedFlag(true);
    window.setTimeout(() => setSavedFlag(false), 1800);
  };

  const content = (
    <div className={embedded ? '' : 'container mx-auto px-6 max-w-5xl'}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-brand-dark/10">
        {!embedded ? (
          <div>
            <p className="text-xs font-mono text-brand-accent font-semibold mb-2">
              Classroom &amp; Schedule Control · Live Sync
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Offline Batches.
            </h1>
          </div>
        ) : (
          <div className="text-xs font-mono text-brand-accent font-semibold">
            Select cohort to edit classroom, timings &amp; WhatsApp invite
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {allTrackIds.map((id) => {
            const t = getResolvedTrackData(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedTrackId(id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  id === selectedTrackId
                    ? 'bg-brand-dark text-white'
                    : 'bg-white border border-brand-dark/10 text-brand-dark/70'
                }`}
              >
                {t.batchCode}
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-10 space-y-6"
      >
        <div className="pb-5 border-b border-brand-dark/10">
          <span className="text-xs font-mono text-brand-accent font-semibold">
            {track.batchCode}
          </span>
          <h2 className="text-2xl font-bold text-brand-dark mt-1">{track.courseTitle}</h2>
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
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            className="px-7 py-3.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
          >
            <Save size={14} /> Update Batch Schedule
          </button>

          {savedFlag && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={15} /> Synced live to Student Dashboard &amp; Mentor Desk
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
