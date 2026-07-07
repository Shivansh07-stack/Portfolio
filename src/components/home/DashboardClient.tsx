"use client";
import { usePersona } from '@/context/PersonaContext';
import { PersonaSelector } from '@/components/home/PersonaSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeGraph } from '@/components/canvas/KnowledgeGraph';
import { ErrorBoundary } from '@/components/canvas/ErrorBoundary';
import { MindChat } from '@/components/ai/MindChat';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export const DashboardClient = ({ repos }: { repos: any[] }) => {
  const { persona } = usePersona();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShow3D(false);
    }
  }, []);

  const getFilteredRepos = () => {
    let baseRepos = repos;
    switch (persona) {
      case 'Data Scientist':
        baseRepos = repos.filter(r => ['Object-Detection-Distance-Estimation-for-Robotics-Navigation', 'Credit_Card_Fraud_Detection', 'Wildlife_Spread_Prediction', 'Bank_Data_Churn', 'Twitter-Recent-Tweets-Sentiment-Analysis', 'cabin_price_ai'].includes(r.name));
        break;
      case 'Entrepreneur':
        baseRepos = repos.filter(r => ['AI_Business_Analyst', 'ai-job-search', 'AI_Job_Analyzer', 'Multi-Document_RAG_Chatbot'].includes(r.name));
        break;
      case 'Student':
        baseRepos = repos.filter(r => ['Credit_Card_Fraud_Detection', 'Multi-Document_RAG_Chatbot', 'Twitter-Recent-Tweets-Sentiment-Analysis', 'PoisonScope', 'cabin_price_ai'].includes(r.name));
        break;
      default:
        baseRepos = repos;
    }

    if (activeTopic && activeTopic !== 'root') {
      const topicFilterMap: Record<string, string[]> = {
        ml: ['Expression-Analysis', 'Wildlife_Spread_Prediction', 'Bank_Data_Churn', 'Credit_Card_Fraud_Detection', 'cabin_price_ai'],
        data: ['AI_Job_Analyzer', 'AI_Business_Analyst'],
        ai: ['Multi-Document_RAG_Chatbot', 'ai-job-search', 'AI_Business_Analyst'],
        eng: ['Object-Detection-Distance-Estimation-for-Robotics-Navigation', 'PoisonScope', 'Twitter-Recent-Tweets-Sentiment-Analysis']
      };
      const allowed = topicFilterMap[activeTopic] || [];
      return baseRepos.filter(r => allowed.includes(r.name));
    }
    return baseRepos;
  };

  const getPersonaSkills = () => {
    switch (persona) {
      case 'Data Scientist':
        return [
          { name: 'Python', weight: 0.94, impact: 'Critical Path', color: 'text-emerald-400' },
          { name: 'PyTorch', weight: 0.88, impact: 'Critical Path', color: 'text-emerald-400' },
          { name: 'SQL Optimization', weight: 0.72, impact: 'High Impact', color: 'text-blue-400' },
          { name: 'ONNX/TensorRT', weight: 0.61, impact: 'Supporting Skill', color: 'text-purple-400' },
          { name: 'Docker', weight: 0.54, impact: 'Supporting Skill', color: 'text-purple-400' }
        ].sort((a, b) => b.weight - a.weight);
      case 'Entrepreneur':
        return [
          { name: 'Product Strategy', weight: 0.95, impact: 'Critical Path', color: 'text-emerald-400' },
          { name: 'Next.js / React', weight: 0.82, impact: 'High Impact', color: 'text-blue-400' },
          { name: 'Prompt Engineering', weight: 0.75, impact: 'High Impact', color: 'text-blue-400' },
          { name: 'Market Analysis', weight: 0.68, impact: 'Supporting Skill', color: 'text-purple-400' }
        ].sort((a, b) => b.weight - a.weight);
      case 'Student':
        return [
          { name: 'Machine Learning Basics', weight: 0.92, impact: 'Critical Path', color: 'text-emerald-400' },
          { name: 'Algorithms', weight: 0.89, impact: 'Critical Path', color: 'text-emerald-400' },
          { name: 'Linear Algebra', weight: 0.78, impact: 'High Impact', color: 'text-blue-400' },
          { name: 'Research Methodologies', weight: 0.65, impact: 'Supporting Skill', color: 'text-purple-400' }
        ].sort((a, b) => b.weight - a.weight);
      default:
        return [];
    }
  };

  const getPersonaRepoDesc = (repoName: string) => {
    const customDescriptions: Record<string, {problem: string, approach: string, result: string}> = {
      'Credit_Card_Fraud_Detection': {
        problem: 'A model predicting "not fraud" hits 98% accuracy while catching zero fraud — accuracy is the wrong metric.',
        approach: 'Applied SMOTE for the 98:2 imbalance, then tuned the decision threshold from 0.5 to 0.3 based on cost asymmetry.',
        result: '99.64% accuracy, 97.75% recall, recovered 391/400 frauds, ~$200k in projected losses prevented.'
      },
      'Object-Detection-Distance-Estimation-for-Robotics-Navigation': {
        problem: 'LiDAR is too expensive for small robotics platforms needing spatial mapping.',
        approach: 'Used BDD100K for monocular distance estimation. Found it lacked cone/stop-sign labels, substituted "traffic sign" and documented the gap.',
        result: 'Achieved 45 FPS inference and ±5cm depth error running on quantized ONNX edge hardware.'
      },
      'Wildlife_Spread_Prediction': {
        problem: 'Emergency response teams lack real-time, predictive disaster mapping.',
        approach: 'Engineered 40+ features from meteorological data, building a LightGBM/XGBoost ensemble to predict 6-hr spread probability.',
        result: 'Deployed a live Streamlit dashboard for dynamic risk forecasting based on adjustable weather inputs.'
      },
      'Multi-Document_RAG_Chatbot': {
        problem: 'Standard vector search fails on multi-document follow-up questions because they lack context.',
        approach: 'Implemented a contextualization chain that rewrites follow-up queries before hitting the FAISS vector store.',
        result: '10x faster query retrieval across mixed PDF/CSV knowledge bases with accurate page-level attribution.'
      },
      'AI_Business_Analyst': {
        problem: 'Small ops teams spend hours calculating manual KPIs without narrative context.',
        approach: 'Automated ingestion via Pandas and tied anomaly detection (Z-scores) to a strictly grounded GPT-4o-mini prompt.',
        result: 'Generates zero-hallucination executive reports and anomaly flags from raw CSVs in <60 seconds.'
      },
      'Twitter-Recent-Tweets-Sentiment-Analysis': {
        problem: 'Researchers need to gauge public discourse on emerging topics instantly.',
        approach: 'Connected to Twitter API v2 for live pulling, using NLP tokenization and lexicon matching for rapid classification.',
        result: 'Real-time structured output (CSV) of sentiment polarity scores for downstream visualization.'
      },
      'AI_Job_Analyzer': {
        problem: 'Job seekers struggle to quantify which technical skills are most vulnerable to automation or market shifts.',
        approach: 'Merged 7 years of Stack Overflow survey data (49k+ rows), computing YoY deltas and skill growth regression.',
        result: 'Interactive dashboard scoring technologies on automation risk and long-term demand through 2030.'
      },
      'PoisonScope': {
        problem: 'Deploying Hugging Face models blindly introduces supply-chain security risks.',
        approach: 'Built a CLI tool scanning model weights, author verification, and dataset anomalies via the HF Hub API.',
        result: 'Batch scans top search results to flag suspicious payloads before deployment.'
      },
      'Bank_Data_Churn': {
        problem: 'Retail banks lose immense value when they cannot proactively identify at-risk accounts.',
        approach: 'Swapped linear Logistic Regression for XGBoost to capture non-linear interactions across 14 tabular variables.',
        result: 'Improved churn prediction accuracy to 86%, surfacing key retention drivers.'
      },
      'Expression-Analysis': {
        problem: 'HCI teams need robust, real-time emotion classification for responsive UIs.',
        approach: 'Trained a deep CNN on FER2013, focusing on difficult facial landmarks under varying lighting conditions.',
        result: '72% accuracy on edge devices, generalizing well across diverse live webcam inputs.'
      },
      'cabin_price_ai': {
        problem: 'Manual real estate valuation is inconsistent and slow.',
        approach: 'Built a TensorFlow neural network regression model predicting prices from unstructured property features.',
        result: 'Data-driven pricing baseline replacing heuristic estimates.'
      }
    };

    return customDescriptions[repoName] || {
      problem: 'Exploration needed for this specific repository.',
      approach: 'Investigating standard architectures.',
      result: 'Pending full integration.'
    };
  };

  return (
    <AnimatePresence mode="wait">
      {!persona ? (
        <motion.section key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-screen flex-col items-center justify-center space-y-12 px-4 py-12" >
          <div className="text-center max-w-4xl">
            <motion.h1 initial={{ y: 20 }} animate={{ y: 0 }} className="text-5xl font-extrabold tracking-tighter md:text-7xl bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-6">
              Shivansh Sharma
            </motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-2xl font-bold text-white mb-4">
              Data Scientist building ML systems that ship — not just notebooks.
            </motion.p>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-400 mb-8 leading-relaxed">
              Final-year IT student at MAIT, with a Data Science internship shipping forecasting APIs and offline LLM inference, plus projects with real, measured results: 99.64% fraud-detection accuracy, a wildfire-spread ensemble model, and a robotics vision pipeline running on quantized edge hardware. I turn messy data into deployed, decision-ready systems — and I'm upfront about what didn't work along the way.
            </motion.p>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4 mb-12">
              <a href="/Shivansh_Sharma_Resume.pdf" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors">
                View Resume
              </a>
              <a href="/Shivansh_Sharma_Resume.pdf" download className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Download PDF
              </a>
            </motion.div>
          </div>
          <div className="w-full max-w-4xl text-center">
            <h2 className="mb-8 text-sm uppercase tracking-[0.3em] text-gray-500">Who are you?</h2>
            <PersonaSelector />
          </div>
        </motion.section>
      ) : (
        <motion.div key="mind-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
          <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-black/50 p-6 backdrop-blur-md">
            <div className="font-bold uppercase tracking-widest">Mind Module: {persona}</div>
            <button onClick={() => window.location.reload()} className="text-xs text-gray-500 hover:text-white">Reset Perspective</button>
          </header>
          <div className="container mx-auto grid grid-cols-1 gap-12 py-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
                <h2 className="mb-6 text-3xl font-bold flex flex-wrap items-center gap-4">
                  Digital Synapse Graph
                  {activeTopic && activeTopic !== 'root' && (
                    <span className="text-sm font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                      Filtering: {activeTopic.toUpperCase()}
                    </span>
                  )}
                  <button onClick={() => setShow3D(!show3D)} className="ml-auto text-sm px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 transition-colors">
                    {show3D ? "Switch to List View" : "Switch to 3D View"}
                  </button>
                </h2>
                <div className="mb-4 flex flex-wrap gap-3 text-xs font-medium">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#8b5cf6] shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div> Machine Learning
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#10b981]"></div> Big Data
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> LLMs & GenAI
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ec4899]/10 border border-[#ec4899]/20 text-[#ec4899] shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#ec4899]"></div> Engineering
                  </div>
                </div>
                {show3D ? (
                  <ErrorBoundary>
                    <KnowledgeGraph onNodeClick={(id) => setActiveTopic(prev => prev === id ? null : id)} />
                  </ErrorBoundary>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 pb-4">
                    {[
                      { id: 'ml', label: 'Machine Learning', desc: 'Predictive modeling, computer vision, and predictive tabular models.' },
                      { id: 'data', label: 'Big Data', desc: 'Data engineering, statistical analysis, and dashboarding.' },
                      { id: 'ai', label: 'LLMs & GenAI', desc: 'Generative AI, RAG architectures, and agentic workflows.' },
                      { id: 'eng', label: 'Engineering', desc: 'Full-stack deployment, cybersecurity tools, and system architecture.' }
                    ].map(node => (
                      <button 
                        key={node.id} 
                        onClick={() => setActiveTopic(activeTopic === node.id ? null : node.id)}
                        className={`p-6 rounded-2xl border text-left transition-colors flex flex-col justify-center min-h-[150px] ${activeTopic === node.id ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}
                      >
                        <h3 className={`font-bold text-xl mb-2 ${activeTopic === node.id ? 'text-emerald-400' : 'text-white'}`}>{node.label}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{node.desc}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
                <h2 className="mb-6 text-2xl font-bold flex items-center justify-between">
                  <span>Mission Control (Repositories)</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredRepos().map(repo => {
                    const desc = getPersonaRepoDesc(repo.name);
                    return (
                      <Link key={repo.id} href={`/projects/${repo.name}`} className="block group">
                        <div className="p-6 rounded-2xl border border-white/10 bg-black/40 hover:bg-white/5 transition-colors h-full flex flex-col">
                          <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors mb-4">{repo.name}</h3>
                          <div className="text-sm text-gray-400 space-y-3 mb-6 flex-1">
                            <p><span className="text-gray-200 font-semibold">Problem:</span> {desc.problem}</p>
                            <p><span className="text-gray-200 font-semibold">Approach:</span> {desc.approach}</p>
                            <p><span className="text-gray-200 font-semibold">Result:</span> {desc.result}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {repo.topics?.slice(0, 3).map((t: string) => (
                              <span key={t} className="text-xs px-2 py-1 bg-white/10 rounded border border-white/5 text-gray-300">{t}</span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
                <h2 className="mb-2 text-2xl font-bold">The Dataset: Shivansh.csv</h2>
                <p className="text-sm text-gray-500 mb-6 italic">Weight = frequency-weighted usage across shipped projects</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="pb-4">Feature</th>
                        <th className="pb-4">Weight</th>
                        <th className="pb-4">Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPersonaSkills().map(skill => (
                        <tr key={skill.name} className="border-b border-white/5">
                          <td className="py-4 font-mono">{skill.name}</td>
                          <td className="py-4 font-mono text-gray-400">{skill.weight.toFixed(3)}</td>
                          <td className={`py-4 font-bold ${skill.color}`}>{skill.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Certifications & Extracurriculars */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
                  <h2 className="mb-6 text-2xl font-bold">Certifications & Leadership</h2>
                  <div className="space-y-4 text-sm text-gray-300">
                    <div>
                      <h3 className="font-bold text-white mb-1">Certifications</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>Neural Networks & Deep Learning (Coursera)</li>
                        <li>CRAC AI Security Summer Training</li>
                        <li>Machine Learning Fundamentals (Coursera)</li>
                        <li>Data Science Program (Masai x IIT Guwahati)</li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <h3 className="font-bold text-white mb-1">Extracurricular</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>Operations Lead, E-Summit 2025/2026 (10+ events)</li>
                        <li>Climate Change Ideathon (IIT Delhi)</li>
                        <li>MindMaze Strategy Case Study (DTU)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 backdrop-blur-lg flex flex-col justify-between">
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-emerald-400">Establish Connection</h2>
                    <p className="text-sm text-gray-400 mb-6">Want to bypass the Neural Interface and speak with the biological version of Shivansh? Download my raw data schema (Resume) or initiate a direct protocol.</p>
                  </div>
                  <div className="space-y-4">
                    <a href="/Shivansh_Sharma_Resume.pdf" download className="block w-full py-3 px-4 bg-emerald-500 text-black font-bold text-center rounded-xl hover:bg-emerald-400 transition-colors">
                      Download Resume (PDF)
                    </a>
                    <div className="flex gap-4">
                      <a href="mailto:shivaansh07@gmail.com" className="flex-1 py-3 px-4 border border-white/10 text-center rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">Email</a>
                      <a href="https://linkedin.com/in/shivanshsharma355" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 px-4 border border-white/10 text-center rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">LinkedIn</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <aside className="lg:col-span-5">
              <MindChat />
            </aside>
          </div>
        </motion.div>
      )}

      {/* Floating Contact Widget */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        <a href="mailto:shivaansh07@gmail.com" className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg hover:bg-blue-500 transition-colors border border-blue-400/30">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </a>
        <button onClick={() => {navigator.clipboard.writeText('shivaansh07@gmail.com'); alert('Email copied!');}} className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-gray-300 shadow-lg hover:text-white transition-colors border border-white/10 group relative" aria-label="Copy Email">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <span className="absolute left-14 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap border border-white/10 pointer-events-none">Copy Email</span>
        </button>
        <a href="https://linkedin.com/in/shivanshsharma355" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-gray-300 shadow-lg hover:text-[#0a66c2] hover:border-[#0a66c2]/50 transition-colors border border-white/10" aria-label="LinkedIn">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </a>
        <a href="https://github.com/Shivansh07-stack" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-gray-300 shadow-lg hover:text-white transition-colors border border-white/10" aria-label="GitHub">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </div>
    </AnimatePresence>
  );
};
