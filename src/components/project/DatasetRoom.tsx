"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Download } from 'lucide-react';
import { getProjectDetail } from '@/data/projectDetails';

export const DatasetRoom = ({ repoName }: { repoName: string }) => {
  const details = getProjectDetail(repoName).dataset;
  const sortedFeatures = [...details.features].sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold">{details.title}</h2>
          {details.source && <p className="text-sm text-gray-400 mt-1 font-mono">Source: <span className="text-blue-400">{details.source}</span></p>}
        </div>
        <button className="flex items-center px-4 py-2 text-sm text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 transition-colors">
          <Download className="w-4 h-4 mr-2" /> Download Artifact
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-lg font-bold mb-4">Overview</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Rows</span>
              <span className="font-mono">{details.rows}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Columns</span>
              <span className="font-mono">{details.cols}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Missing Values</span>
              <span className="font-mono text-emerald-400">{details.missing}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Imbalance Ratio</span>
              <span className="font-mono text-red-400">{details.ratio}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Feature Importance</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedFeatures} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                <Bar dataKey="value" fill="url(#colorValue)" radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="value" position="right" fill="#fff" fontSize={11} fontFamily="monospace" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
