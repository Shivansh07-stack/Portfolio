"use client";
import { getProjectDetail } from '@/data/projectDetails';
import Image from 'next/image';

export const ResultsRoom = ({ repoName }: { repoName: string }) => {
  const details = getProjectDetail(repoName);
  const results = details.results;

  if (!results) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
      <h2 className="text-2xl font-bold mb-8">Model Results in Action</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {results.metrics.map((m: any, i: number) => (
          <div key={i} className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-xl border border-white/5">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{m.value}</span>
            <span className="text-sm text-gray-400 uppercase tracking-widest mt-2">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-6">System Architecture</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 p-6 rounded-2xl border border-white/5">
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-mono text-gray-300">Camera Input</div>
          <div className="hidden md:block w-8 h-px bg-blue-500/50" />
          <div className="text-blue-400">→</div>
          <div className="hidden md:block w-8 h-px bg-blue-500/50" />
          <div className="px-4 py-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-sm font-mono text-blue-300">Object Detection</div>
          <div className="hidden md:block w-8 h-px bg-purple-500/50" />
          <div className="text-purple-400">→</div>
          <div className="hidden md:block w-8 h-px bg-purple-500/50" />
          <div className="px-4 py-3 bg-purple-900/20 border border-purple-500/30 rounded-lg text-sm font-mono text-purple-300">Distance Estimation</div>
          <div className="hidden md:block w-8 h-px bg-emerald-500/50" />
          <div className="text-emerald-400">→</div>
          <div className="hidden md:block w-8 h-px bg-emerald-500/50" />
          <div className="px-4 py-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-sm font-mono text-emerald-300">Navigation Output</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h3 className="text-sm text-gray-400 uppercase tracking-widest ml-2">Raw Camera Feed</h3>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
            <Image src={results.beforeImg} alt="Before" fill className="object-cover" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm text-emerald-400 uppercase tracking-widest ml-2">Inference Output</h3>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-emerald-500/30">
            <Image src={results.afterImg} alt="After" fill className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};
