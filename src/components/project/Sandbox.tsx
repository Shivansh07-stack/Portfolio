"use client";
import { useState } from 'react';
import { Play } from 'lucide-react';
import { getProjectDetail } from '@/data/projectDetails';
import { motion } from 'framer-motion';

export const Sandbox = ({ repoName }: { repoName: string }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sandboxConfig = getProjectDetail(repoName).sandbox;

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(sandboxConfig.type === 'nlp' ? 'Analysis Complete: Match Found (98%)' : 'Prediction Result: 84% Confidence');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-900/10 p-8 backdrop-blur-lg">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
        <Play className="h-5 w-5" /> Live Sandbox
      </h2>
      <p className="text-gray-400 mb-6 text-sm">Test the model in real-time. Adjust the parameters below.</p>
      
      <div className="space-y-4">
        {sandboxConfig.type === 'nlp' ? (
          <textarea 
            placeholder="Enter text to analyze..."
            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500/50 h-32"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {sandboxConfig.inputs.map((inputLabel: string, idx: number) => (
              <div key={idx}>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{inputLabel}</label>
                <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-emerald-500" />
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={handleRun}
          className="w-full py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
        >
          {loading ? 'Running Inference...' : sandboxConfig.action}
        </button>

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 rounded-xl bg-black border border-emerald-500/30 text-emerald-400 font-mono text-center font-bold"
          >
            {result}
          </motion.div>
        )}
      </div>
    </div>
  );
};
