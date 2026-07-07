"use client";
import { getProjectDetail } from '@/data/projectDetails';

export const ExperimentEngine = ({ repoName }: { repoName: string }) => {
  const details = getProjectDetail(repoName).experiments;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
      <h2 className="text-2xl font-bold mb-8">{details.title}</h2>
      <div className="space-y-6">
        {details.list.map((exp: any, index: number) => (
          <div key={exp.id} className="relative flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold z-10">
                {exp.id}
              </div>
              {index !== details.list.length - 1 && (
                <div className="w-px h-24 bg-gradient-to-b from-blue-500/50 to-transparent my-2" />
              )}
            </div>
            <div className="flex-1 bg-black/40 border border-white/5 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/10">{exp.model}</span>
              </div>
              <div className="mt-4 flex gap-6 text-sm text-gray-400">
                <div>Accuracy: <span className="text-white font-mono">{exp.accuracy}</span></div>
                <div>Status: <span className={exp.status === 'Deployed' ? 'text-emerald-400' : 'text-red-400'}>
                  {exp.status}
                </span></div>
              </div>
              <p className="mt-4 text-gray-300 text-sm bg-white/5 p-3 rounded-lg border border-white/5">{exp.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
