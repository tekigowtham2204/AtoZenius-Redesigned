import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Target, ArrowRight } from 'lucide-react';

const ContentBlock: React.FC = () => {
  return (
    <section className="py-20 md:py-40 relative z-10 overflow-hidden" id="insights">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-secondary/30 rounded-full blur-[80px] md:blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column (Sticky only on Large screens) */}
          <div className="lg:w-5/12 relative">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8 lg:mb-0"
              >
                <span className="flex items-center gap-3 text-brand-accent font-bold tracking-[0.2em] uppercase text-xs mb-6">
                  <span className="w-8 h-[2px] bg-brand-accent"></span>
                  The Journey
                </span>
                
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-dark leading-[1.1] mb-6 md:mb-8 tracking-tighter">
                  One path from <br/>
                  <span className="text-brand-accent italic font-serif">learning</span> <br/>
                  to getting hired.
                </h2>
                
                <p className="text-base md:text-lg text-brand-dark/60 font-medium leading-relaxed max-w-md mb-8 md:mb-10">
                  Breaking into your dream career shouldn't feel like guesswork. We connect structured courses, industry mentorship, and verified career opportunities into a single flow.
                </p>

                <div className="hidden lg:block">
                  <ArrowRight className="text-brand-dark/20 w-12 h-12" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Scrolling Cards */}
          <div className="lg:w-7/12 flex flex-col gap-6 md:gap-12">
            
            {/* Card 1: The Problem */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-brand-dark/5 relative overflow-hidden group hover:shadow-xl transition-shadow duration-500"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Layers size={120} />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-dark/10 flex items-center justify-center text-xs text-brand-dark font-bold">01</span>
                The Solo Grind
              </h3>
              <p className="text-brand-dark/70 text-lg leading-relaxed relative z-10">
                Most learners watch endless tutorials alone, build projects nobody reviews, and send hundreds of applications into a void—never knowing what is actually holding them back.
              </p>
            </motion.div>

            {/* Card 2: The Solution (Highlighted) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-brand-dark text-white p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap size={120} />
              </div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <span className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-xs text-brand-dark font-bold">02</span>
                Guided Momentum
              </h3>
              <p className="text-white/80 text-lg leading-relaxed mb-8 relative z-10">
                <strong className="text-white">AtoZenius</strong> turns chaos into a clear sequence. You build production-ready skills in our <strong>Courses</strong>, sharpen your craft with 1-on-1 <strong>Mentors</strong>, and step directly into vetted <strong>Careers</strong>.
              </p>
              
              <div className="pl-6 border-l-2 border-brand-accent/50 italic text-white/90 font-serif text-xl relative z-10">
                "You don't need another certificate collecting dust. You need real skills, honest feedback, and a direct bridge to teams hiring today."
              </div>
            </motion.div>

            {/* Card 3: The Outcome */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-brand-secondary/50 p-8 md:p-12 rounded-[2rem] border border-brand-accent/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-brand-dark">
                <Target size={120} />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-xs text-brand-dark font-bold">03</span>
                Hired with Confidence
              </h3>
              <p className="text-brand-dark/80 text-lg leading-relaxed relative z-10">
                By uniting <strong>Courses</strong>, <strong>Mentors</strong>, and <strong>Careers</strong> in one ecosystem, you stop guessing what employers want—and walk into every interview ready to prove it.
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentBlock;