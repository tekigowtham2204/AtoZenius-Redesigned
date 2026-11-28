import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Plus,
  Save,
  Users,
} from 'lucide-react';
import { CourseCategory } from '../../../data/courses';
import { MentorSpecialty } from '../../../data/mentors';
import { StoryTrack } from '../../../data/stories';
import { BlogCategory } from '../../../data/blog';
import {
  addCustomBlogPost,
  addCustomCourse,
  addCustomMentor,
  addCustomStory,
  getAllAdminBlogPosts,
  getAllAdminCourses,
  getAllAdminMentors,
  getAllAdminStories,
  getSiteConfig,
  saveCourseOverride,
  saveSiteConfig,
  SiteControlConfig,
  toggleBlogVisibility,
  toggleCourseVisibility,
  toggleMentorVisibility,
  toggleStoryVisibility,
} from '../../../data/portal';

type CmsTab = 'brand' | 'courses' | 'mentors-stories' | 'blog';

const AdminWebsitePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CmsTab>('brand');
  const [, setRefreshTick] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  // Tab 1: Brand & Contact
  const [config, setConfig] = useState<SiteControlConfig>(() => getSiteConfig());

  // Tab 2: Courses
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editDuration, setEditDuration] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState<CourseCategory>('IT');
  const [newCourseDuration, setNewCourseDuration] = useState('3-4 Months');
  const [newCourseSkills, setNewCourseSkills] = useState('React, TypeScript, Node.js');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // Tab 3: Mentors & Stories
  const [newMentorName, setNewMentorName] = useState('');
  const [newMentorRole, setNewMentorRole] = useState('');
  const [newMentorOrg, setNewMentorOrg] = useState('AtoZenius Faculty');
  const [newMentorSpec, setNewMentorSpec] =
    useState<Exclude<MentorSpecialty, 'All'>>('IT & Engineering');
  const [newMentorExp, setNewMentorExp] = useState('7+ yrs');
  const [newMentorBio, setNewMentorBio] = useState('');

  const [newStoryName, setNewStoryName] = useState('');
  const [newStoryTrack, setNewStoryTrack] =
    useState<Exclude<StoryTrack, 'All'>>('Python Full Stack');
  const [newStoryOutcome, setNewStoryOutcome] = useState('');
  const [newStoryQuote, setNewStoryQuote] = useState('');

  // Tab 4: Blog
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] =
    useState<Exclude<BlogCategory, 'All'>>('AI & Tech');
  const [newPostAuthor, setNewPostAuthor] = useState('AtoZenius Editorial Team');
  const [newPostExcerpt, setNewPostExcerpt] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  const flash = (msg: string) => {
    setNotice(msg);
    setRefreshTick((n) => n + 1);
    window.setTimeout(() => setNotice(null), 2000);
  };

  const courses = getAllAdminCourses();
  const mentors = getAllAdminMentors();
  const stories = getAllAdminStories();
  const posts = getAllAdminBlogPosts();

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = saveSiteConfig(config);
    setConfig(saved);
    flash('Brand & contact info updated live');
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCourseDesc.trim()) return;
    addCustomCourse({
      title: newCourseTitle.trim(),
      category: newCourseCategory,
      tag: newCourseCategory,
      level: 'Intermediate',
      duration: newCourseDuration.trim() || '3-4 Months',
      minorProjects: 3,
      majorProjects: 2,
      description: newCourseDesc.trim(),
      skills: newCourseSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      curriculum: [
        'Foundations & Core Concepts',
        'Applied Lab Workflows & Case Studies',
        '3 Minor Projects with Mentor Critique',
        '2 Major Capstones & Placement Prep',
      ],
      outcomes: [
        'Build 3 minor and 2 major real-world portfolio projects',
        'Earn Course Completion & Internship Completion Certificates',
      ],
      whatsappQuery: `${newCourseTitle.trim()} Program`,
    });
    setNewCourseTitle('');
    setNewCourseDesc('');
    flash('New course published to /courses & Contact form');
  };

  const handleAddMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMentorName.trim() || !newMentorRole.trim() || !newMentorBio.trim()) return;
    addCustomMentor({
      name: newMentorName.trim(),
      role: newMentorRole.trim(),
      organization: newMentorOrg.trim() || 'AtoZenius Faculty',
      specialty: newMentorSpec,
      experience: newMentorExp.trim() || '6+ yrs',
      rating: '5.0',
      sessions: 40,
      bio: newMentorBio.trim(),
      tags: [newMentorSpec, 'Project Reviews', 'Mock Interviews'],
    });
    setNewMentorName('');
    setNewMentorRole('');
    setNewMentorBio('');
    flash('Mentor added to /mentors');
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryName.trim() || !newStoryOutcome.trim() || !newStoryQuote.trim()) return;
    addCustomStory({
      name: newStoryName.trim(),
      track: newStoryTrack,
      outcome: newStoryOutcome.trim(),
      quote: newStoryQuote.trim(),
    });
    setNewStoryName('');
    setNewStoryOutcome('');
    setNewStoryQuote('');
    flash('Student story published to /placements');
  };

  const handleAddBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostExcerpt.trim() || !newPostBody.trim()) return;
    addCustomBlogPost({
      title: newPostTitle.trim(),
      category: newPostCategory,
      date: 'Nov 2026',
      readTime: '4 min read',
      author: newPostAuthor.trim() || 'AtoZenius Team',
      excerpt: newPostExcerpt.trim(),
      sections: [{ heading: 'Key Insights', body: newPostBody.trim() }],
      keyTakeaways: [
        'Apply practical frameworks alongside mentor feedback.',
        'Build demonstrable minor & major project proof.',
      ],
    });
    setNewPostTitle('');
    setNewPostExcerpt('');
    setNewPostBody('');
    flash('Article published to /blog');
  };

  const tabs: { id: CmsTab; label: string; icon: React.ElementType }[] = [
    { id: 'brand', label: 'Brand & Contact', icon: Globe },
    { id: 'courses', label: `Courses (${courses.filter((c) => !c.isHidden).length}/${courses.length})`, icon: BookOpen },
    { id: 'mentors-stories', label: 'Mentors & Stories', icon: Users },
    { id: 'blog', label: `Blog Journal (${posts.filter((p) => !p.isHidden).length})`, icon: FileText },
  ];

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
            <p className="text-xs font-mono uppercase tracking-widest text-brand-accent font-semibold mb-2">
              Live Content Management Studio
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Website CMS.
            </h1>
          </div>
          {notice && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
              <CheckCircle2 size={14} /> {notice}
            </span>
          )}
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 transition-colors ${
                  active
                    ? 'bg-brand-dark text-white'
                    : 'bg-white border border-brand-dark/10 text-brand-dark/70 hover:border-brand-dark/30'
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Brand & Contact */}
        {activeTab === 'brand' && (
          <form
            onSubmit={handleSaveBrand}
            className="bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 sm:p-10 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
                Hero Copy, WhatsApp &amp; Social Channels
              </h2>
              <p className="text-xs text-brand-dark/60 mt-1">
                Updates reflect live on the Home Hero, Contact page, Auth help link, and Footer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                  Hero Tagline Lead
                </label>
                <input
                  type="text"
                  required
                  value={config.heroTaglinePrefix}
                  onChange={(e) => setConfig({ ...config, heroTaglinePrefix: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                  Primary WhatsApp / Phone
                </label>
                <input
                  type="text"
                  required
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                Hero Subtitle Copy
              </label>
              <textarea
                rows={3}
                required
                value={config.heroSubtitle}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                Top Announcement Banner (Optional)
              </label>
              <input
                type="text"
                value={config.announcementText}
                onChange={(e) => setConfig({ ...config, announcementText: e.target.value })}
                placeholder="Leave empty to hide public banner"
                className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={config.linkedinUrl}
                  onChange={(e) => setConfig({ ...config, linkedinUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={config.youtubeUrl}
                  onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-dark/55 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={config.instagramUrl}
                  onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-7 py-3.5 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
            >
              <Save size={14} /> Save Brand &amp; Contact Settings
            </button>
          </form>
        )}

        {/* Tab 2: Courses Catalog */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleAddCourse}
              className="lg:col-span-5 bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 space-y-4"
            >
              <div className="text-xs font-mono text-[#60A5FA] inline-flex items-center gap-1.5">
                <Plus size={14} /> ADD NEW COURSE
              </div>
              <h2 className="text-xl font-bold tracking-tight">Publish Program to Catalog</h2>
              <p className="text-xs text-white/60">
                New courses appear immediately on /courses and in the Contact inquiry dropdown.
              </p>

              <input
                type="text"
                required
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                placeholder="Course Title (e.g., Generative AI Engineering)"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value as CourseCategory)}
                  className="px-3.5 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:border-[#60A5FA]"
                >
                  <option value="IT" className="text-brand-dark">IT</option>
                  <option value="Pharma" className="text-brand-dark">Pharma</option>
                  <option value="Non IT & Management" className="text-brand-dark">Non IT &amp; Management</option>
                  <option value="Agriculture" className="text-brand-dark">Agriculture</option>
                  <option value="Advanced Courses" className="text-brand-dark">Advanced Courses</option>
                </select>
                <input
                  type="text"
                  value={newCourseDuration}
                  onChange={(e) => setNewCourseDuration(e.target.value)}
                  placeholder="Duration (e.g., 3-4 Months)"
                  className="px-3.5 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
                />
              </div>

              <input
                type="text"
                value={newCourseSkills}
                onChange={(e) => setNewCourseSkills(e.target.value)}
                placeholder="Skills (comma-separated)"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
              />

              <textarea
                rows={3}
                required
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                placeholder="Concise course overview..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#60A5FA]"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors"
              >
                + Publish Course Live
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {courses.map((course) => {
                const isEditing = editingCourseId === course.id;
                return (
                  <div
                    key={course.id}
                    className={`bg-white rounded-[1.5rem] border p-5 transition-opacity ${
                      course.isHidden ? 'border-brand-dark/10 opacity-65' : 'border-brand-dark/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-mono text-brand-accent font-semibold">
                          {course.category} · {course.duration} {course.isCustom ? '· Custom' : ''}
                        </div>
                        <h3 className="text-base font-bold text-brand-dark">{course.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (isEditing) {
                              setEditingCourseId(null);
                            } else {
                              setEditingCourseId(course.id);
                              setEditDuration(course.duration);
                              setEditDescription(course.description);
                            }
                          }}
                          className="px-3 py-1.5 rounded-full border border-brand-dark/15 text-xs font-bold text-brand-dark/70 hover:border-brand-dark/40"
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleCourseVisibility(course.id);
                            flash(course.isHidden ? 'Course set Live' : 'Course hidden from site');
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                            course.isHidden
                              ? 'bg-brand-cream text-brand-dark/65 border border-brand-dark/15'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {course.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                          {course.isHidden ? 'Hidden' : 'Live'}
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="mt-4 pt-4 border-t border-brand-dark/10 space-y-3">
                        <input
                          type="text"
                          value={editDuration}
                          onChange={(e) => setEditDuration(e.target.value)}
                          placeholder="Duration"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs"
                        />
                        <textarea
                          rows={2}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            saveCourseOverride(course.id, {
                              duration: editDuration.trim() || course.duration,
                              description: editDescription.trim() || course.description,
                            });
                            setEditingCourseId(null);
                            flash('Course details saved');
                          }}
                          className="px-5 py-2 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent"
                        >
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-brand-dark/60 mt-2 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Mentors & Success Stories */}
        {activeTab === 'mentors-stories' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form
                onSubmit={handleAddMentor}
                className="lg:col-span-5 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 space-y-4"
              >
                <div className="text-xs font-mono text-brand-accent font-semibold">
                  + ADD FACULTY MENTOR
                </div>
                <h2 className="text-xl font-bold text-brand-dark">Add Mentor to /mentors</h2>
                <input
                  type="text"
                  required
                  value={newMentorName}
                  onChange={(e) => setNewMentorName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm"
                />
                <input
                  type="text"
                  required
                  value={newMentorRole}
                  onChange={(e) => setNewMentorRole(e.target.value)}
                  placeholder="Role (e.g., Cloud & DevOps Lead)"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newMentorSpec}
                    onChange={(e) =>
                      setNewMentorSpec(e.target.value as Exclude<MentorSpecialty, 'All'>)
                    }
                    className="px-3 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs"
                  >
                    <option value="IT & Engineering">IT &amp; Engineering</option>
                    <option value="AI & Data">AI &amp; Data</option>
                    <option value="Pharma & Healthcare">Pharma &amp; Healthcare</option>
                    <option value="Management & Growth">Management &amp; Growth</option>
                    <option value="AgriTech">AgriTech</option>
                  </select>
                  <input
                    type="text"
                    value={newMentorExp}
                    onChange={(e) => setNewMentorExp(e.target.value)}
                    placeholder="Experience (8+ yrs)"
                    className="px-3 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs"
                  />
                </div>
                <input
                  type="text"
                  value={newMentorOrg}
                  onChange={(e) => setNewMentorOrg(e.target.value)}
                  placeholder="Organization"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs"
                />
                <textarea
                  rows={2}
                  required
                  value={newMentorBio}
                  onChange={(e) => setNewMentorBio(e.target.value)}
                  placeholder="Short mentor bio..."
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors"
                >
                  Publish Mentor
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-brand-dark/50">
                  Mentors Roster ({mentors.filter((m) => !m.isHidden).length} visible)
                </h3>
                {mentors.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border border-brand-dark/10 p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-brand-dark">{m.name}</div>
                      <div className="text-xs text-brand-dark/60">
                        {m.role} · {m.specialty}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        toggleMentorVisibility(m.id);
                        flash(m.isHidden ? 'Mentor visible' : 'Mentor hidden');
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                        m.isHidden
                          ? 'bg-brand-cream text-brand-dark/65 border border-brand-dark/15'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {m.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                      {m.isHidden ? 'Hidden' : 'Live'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-brand-dark/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form
                onSubmit={handleAddStory}
                className="lg:col-span-5 bg-white rounded-[1.75rem] border border-brand-dark/10 p-7 space-y-4"
              >
                <div className="text-xs font-mono text-brand-accent font-semibold">
                  + ADD STUDENT TESTIMONIAL
                </div>
                <h2 className="text-xl font-bold text-brand-dark">Add Review to /placements</h2>
                <input
                  type="text"
                  required
                  value={newStoryName}
                  onChange={(e) => setNewStoryName(e.target.value)}
                  placeholder="Student Name"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm"
                />
                <select
                  value={newStoryTrack}
                  onChange={(e) => setNewStoryTrack(e.target.value as Exclude<StoryTrack, 'All'>)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-xs"
                >
                  <option value="Medical Coding">Medical Coding</option>
                  <option value="Python Full Stack">Python Full Stack</option>
                  <option value="Java Full Stack">Java Full Stack</option>
                </select>
                <input
                  type="text"
                  required
                  value={newStoryOutcome}
                  onChange={(e) => setNewStoryOutcome(e.target.value)}
                  placeholder="Outcome (e.g., Placed as Junior Coder)"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm"
                />
                <textarea
                  rows={3}
                  required
                  value={newStoryQuote}
                  onChange={(e) => setNewStoryQuote(e.target.value)}
                  placeholder="Student testimonial quote..."
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream border border-brand-dark/10 text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-dark text-white rounded-full text-xs font-bold hover:bg-brand-accent transition-colors"
                >
                  Publish Testimonial
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-brand-dark/50">
                  Placement Stories ({stories.filter((s) => !s.isHidden).length} visible)
                </h3>
                {stories.map((st) => (
                  <div
                    key={st.id}
                    className="bg-white rounded-2xl border border-brand-dark/10 p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-brand-dark">
                        {st.name} <span className="text-xs font-normal text-brand-accent">· {st.track}</span>
                      </div>
                      <div className="text-xs text-brand-dark/60 truncate">{st.outcome}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        toggleStoryVisibility(st.id);
                        flash(st.isHidden ? 'Story visible' : 'Story hidden');
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 inline-flex items-center gap-1.5 ${
                        st.isHidden
                          ? 'bg-brand-cream text-brand-dark/65 border border-brand-dark/15'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {st.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                      {st.isHidden ? 'Hidden' : 'Live'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Blog Journal */}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleAddBlogPost}
              className="lg:col-span-5 bg-[#0A0B0E] text-white rounded-[1.75rem] p-7 space-y-4"
            >
              <div className="text-xs font-mono text-[#60A5FA]">+ PUBLISH BLOG ARTICLE</div>
              <h2 className="text-xl font-bold">Write to /blog Journal</h2>
              <input
                type="text"
                required
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Article Headline"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newPostCategory}
                  onChange={(e) =>
                    setNewPostCategory(e.target.value as Exclude<BlogCategory, 'All'>)
                  }
                  className="px-3 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white"
                >
                  <option value="AI & Tech" className="text-brand-dark">AI &amp; Tech</option>
                  <option value="Pharma & Healthcare" className="text-brand-dark">Pharma &amp; Healthcare</option>
                  <option value="Career Growth" className="text-brand-dark">Career Growth</option>
                  <option value="Mentorship" className="text-brand-dark">Mentorship</option>
                </select>
                <input
                  type="text"
                  value={newPostAuthor}
                  onChange={(e) => setNewPostAuthor(e.target.value)}
                  placeholder="Author"
                  className="px-3 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/40"
                />
              </div>
              <input
                type="text"
                required
                value={newPostExcerpt}
                onChange={(e) => setNewPostExcerpt(e.target.value)}
                placeholder="Short 1-2 line summary excerpt"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/40"
              />
              <textarea
                rows={4}
                required
                value={newPostBody}
                onChange={(e) => setNewPostBody(e.target.value)}
                placeholder="Main article body..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-accent text-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-colors"
              >
                Publish Article
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-[1.5rem] border border-brand-dark/10 p-5 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="text-[11px] font-mono text-brand-accent font-semibold mb-1">
                      {post.category} · {post.date} · {post.author}
                    </div>
                    <h3 className="text-base font-bold text-brand-dark mb-1">{post.title}</h3>
                    <p className="text-xs text-brand-dark/60 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toggleBlogVisibility(post.id);
                      flash(post.isHidden ? 'Article published' : 'Article hidden');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 inline-flex items-center gap-1.5 ${
                      post.isHidden
                        ? 'bg-brand-cream text-brand-dark/65 border border-brand-dark/15'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {post.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                    {post.isHidden ? 'Hidden' : 'Live'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminWebsitePage;
