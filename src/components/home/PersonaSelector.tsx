"use client";
import { motion } from 'framer-motion';
import { usePersona, Persona } from '@/context/PersonaContext';
import { FlaskConical, Rocket, GraduationCap } from 'lucide-react';

const personas: { type: Persona; label: string; icon: any; color: string; desc: string }[] = [
  { type: 'Data Scientist', label: 'Data Scientist', icon: FlaskConical, color: 'from-purple-500 to-pink-500', desc: 'Dive deep into algorithms, research, and model architectures.' },
  { type: 'Entrepreneur', label: 'Entrepreneur', icon: Rocket, color: 'from-orange-500 to-yellow-500', desc: 'Explore products built, scalability, and market impact.' },
  { type: 'Student', label: 'Student', icon: GraduationCap, color: 'from-slate-500 to-gray-500', desc: 'View learning roadmaps, notes, and academic growth.' }
];

export const PersonaSelector = () => {
  const { setPersona } = usePersona();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-4">
      {personas.map((p, i) => (
        <motion.div key={p.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setPersona(p.type)} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/10" >
          <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${p.color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
          <p.icon className="mb-4 h-12 w-12 text-white" />
          <h3 className="text-xl font-bold text-white">{p.label}</h3>
          <p className="mt-2 text-sm text-gray-400">{p.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};
