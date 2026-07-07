"use client";
import { motion } from 'framer-motion';
import { getProjectDetail } from '@/data/projectDetails';

export const ProblemVault = ({ repoName, description }: { repoName: string, description: string }) => {
  const details = getProjectDetail(repoName).problem;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Problem Vault</h2>
      <div className="space-y-4 text-gray-300">
        <p className="text-lg text-white font-medium">Why this matters</p>
        <p>{description || 'This project addresses key industry challenges by leveraging data to uncover insights.'}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {details.metrics.map((metric: any, i: number) => (
            <div key={i} className="p-5 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-colors">
              <h4 className="text-xs text-gray-500 uppercase tracking-widest">{metric.label}</h4>
              <p className={`text-3xl font-extrabold mt-3 mb-2 ${metric.color}`}>{metric.value}</p>
              {metric.subtext && <p className="text-sm text-gray-400">{metric.subtext}</p>}
            </div>
          ))}
        </div>
        
        {details.note && (
          <div className="mt-8 p-4 rounded-xl bg-orange-900/10 border border-orange-500/20 text-orange-200 text-sm">
            <span className="font-bold text-orange-400 mr-2">Honesty Note:</span>
            {details.note}
          </div>
        )}
      </div>
    </motion.div>
  );
};
