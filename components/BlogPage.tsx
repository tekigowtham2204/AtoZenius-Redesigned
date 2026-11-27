import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, ArrowLeft, Search, CheckCircle2, Clock, User } from 'lucide-react';
import { blogCategories, blogPosts, BlogCategory, BlogPost } from '../data/blog';
import { ViewState } from '../types';

interface BlogPageProps {
  onNavigate: (view: ViewState) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatePresence mode="wait">
          {activePost ? (
            <motion.article
              key={activePost.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark/70 hover:text-brand-accent transition-colors mb-8"
              >
                <ArrowLeft size={16} /> Back to All Articles
              </button>

              <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-brand-dark/5 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">
                  <span>{activePost.category}</span>
                  <span className="text-brand-dark/25">•</span>
                  <span className="text-brand-dark/50">{activePost.date}</span>
                  <span className="text-brand-dark/25">•</span>
                  <span className="text-brand-dark/50">{activePost.readTime}</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-brand-dark tracking-tight leading-tight mb-5">
                  {activePost.title}
                </h1>

                <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark/60 pb-8 mb-8 border-b border-brand-dark/10">
                  <User size={15} /> By {activePost.author}
                </div>

                <div className="space-y-8 text-brand-dark/75 leading-relaxed">
                  {activePost.sections.map((sec) => (
                    <section key={sec.heading}>
                      <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-3 tracking-tight">
                        {sec.heading}
                      </h2>
                      <p className="text-base leading-relaxed">{sec.body}</p>
                    </section>
                  ))}
                </div>

                <div className="mt-10 p-6 md:p-8 rounded-[1.5rem] bg-brand-cream border border-brand-dark/5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark/50 mb-4">
                    Key Takeaways
                  </h3>
                  <ul className="space-y-3">
                    {activePost.keyTakeaways.map((tip) => (
                      <li key={tip} className="flex items-start gap-2.5 text-sm font-semibold text-brand-dark/80">
                        <CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-dark/10 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-brand-dark/60 font-medium">
                    Want structured mentor guidance on this topic?
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('courses')}
                    className="px-7 py-3 bg-brand-dark text-white rounded-full text-sm font-bold hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                  >
                    Explore Courses <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="blog-index"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-3xl mb-12">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">
                  AtoZenius Journal
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[1.05] mb-6">
                  Guides for <span className="text-brand-accent">Modern Careers.</span>
                </h1>
                <p className="text-lg md:text-xl text-brand-dark/65 font-medium leading-relaxed">
                  Practical roadmaps across AI, full-stack engineering, medical coding, mentorship, and placement preparation.
                </p>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
                <div className="flex flex-wrap gap-2.5">
                  {blogCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                        selectedCategory === cat
                          ? 'bg-brand-dark text-white shadow-sm'
                          : 'bg-white text-brand-dark/70 border border-brand-dark/10 hover:border-brand-dark/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full lg:w-72">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-brand-dark/10 text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              {/* Posts Grid */}
              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-brand-dark/5">
                  <p className="text-brand-dark/60 font-medium">No articles matched your filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-[2rem] p-8 border border-brand-dark/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-dark/45 mb-4">
                          <span className="text-brand-accent inline-flex items-center gap-1.5">
                            <BookOpen size={14} /> {post.category}
                          </span>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-dark tracking-tight mb-3">
                          {post.title}
                        </h2>
                        <p className="text-brand-dark/65 text-sm leading-relaxed mb-6">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-5 border-t border-brand-dark/5 flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold text-brand-dark/50 inline-flex items-center gap-1.5">
                          <Clock size={14} /> {post.readTime}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePost(post)}
                          className="text-sm font-bold text-brand-dark hover:text-brand-accent inline-flex items-center gap-1.5 transition-colors"
                        >
                          Read Article <ArrowRight size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BlogPage;
