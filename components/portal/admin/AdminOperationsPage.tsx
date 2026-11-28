import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, UserPlus } from 'lucide-react';
import StaffAdmissionsPage from '../staff/StaffAdmissionsPage';
import StaffBatchesPage from '../staff/StaffBatchesPage';
import StaffPlacementsPage from '../staff/StaffPlacementsPage';

type OperationsTab = 'admissions' | 'batches' | 'placements';

const AdminOperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OperationsTab>('admissions');

  const tabs: { id: OperationsTab; label: string; icon: React.ElementType }[] = [
    { id: 'admissions', label: 'Admissions & Walk-Ins', icon: UserPlus },
    { id: 'batches', label: 'Offline Batches', icon: Calendar },
    { id: 'placements', label: 'Certificates & Alerts', icon: Award },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pt-28 md:pt-36 pb-24 min-h-screen bg-brand-cream"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-brand-dark/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-accent font-semibold mb-2">
              Unified Owner Operations Desk
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-dark tracking-tighter">
              Operations.
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-brand-dark text-white'
                      : 'bg-white border border-brand-dark/10 text-brand-dark/70 hover:border-brand-dark/30'
                  }`}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'admissions' && <StaffAdmissionsPage embedded />}
        {activeTab === 'batches' && <StaffBatchesPage embedded />}
        {activeTab === 'placements' && <StaffPlacementsPage embedded />}
      </div>
    </motion.div>
  );
};

export default AdminOperationsPage;
