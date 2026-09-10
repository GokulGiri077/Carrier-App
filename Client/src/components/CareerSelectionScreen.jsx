import React, { useState } from 'react';
import { Target, Sparkles, Code, Cpu, Shield, Smartphone, Palette, Database, ArrowRight, CheckCircle2, User } from 'lucide-react';

export default function CareerSelectionScreen({ user, onSelectCareer, isSubmitting }) {
  const [selectedGoal, setSelectedGoal] = useState('Full-Stack Developer');
  const [customGoal, setCustomGoal] = useState('');

  const popularCareers = [
    {
      id: 'fullstack',
      title: 'Full-Stack Developer',
      icon: Code,
      badge: 'High Demand',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      description: 'Master front-end React, back-end Node.js, Express REST APIs, and PostgreSQL relational database design.',
      techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind']
    },
    {
      id: 'aiml',
      title: 'AI / ML Engineer',
      icon: Cpu,
      badge: 'Trending 🔥',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Build neural networks, fine-tune LLMs, integrate PyTorch models, and master MLOps pipeline deployment.',
      techStack: ['Python', 'PyTorch', 'LangChain', 'LLMs', 'MLOps']
    },
    {
      id: 'datascientist',
      title: 'Data Scientist',
      icon: Database,
      badge: 'Analytics',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Transform complex raw data into actionable insights using SQL, Pandas, statistical modeling, and Tableau.',
      techStack: ['SQL', 'Pandas', 'Scikit-Learn', 'Tableau', 'Stats']
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Specialist',
      icon: Shield,
      badge: 'Essential',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description: 'Protect enterprise infrastructure, conduct penetration testing, and master cryptographic security protocols.',
      techStack: ['Network Sec', 'Pentesting', 'Wireshark', 'Crypto']
    },
    {
      id: 'mobile',
      title: 'Mobile App Developer',
      icon: Smartphone,
      badge: 'Cross-Platform',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Craft native mobile applications for iOS and Android using React Native, Expo, and native APIs.',
      techStack: ['React Native', 'Expo', 'iOS & Android', 'WebRTC']
    },
    {
      id: 'uiux',
      title: 'UI/UX & Frontend Architect',
      icon: Palette,
      badge: 'Design System',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      description: 'Design intuitive digital experiences with modern typography, glassmorphism, responsive grid layouts, and Tailwind CSS.',
      techStack: ['Figma', 'React', 'Tailwind CSS', 'Micro-Animations']
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCareer = customGoal.trim() !== '' ? customGoal.trim() : selectedGoal;
    onSelectCareer(finalCareer);
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Top Header Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/30 text-center relative overflow-hidden space-y-3">
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs text-indigo-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Personalized AI Learning Roadmap Setup</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome, <span className="text-indigo-400">{user?.name || 'Learner'}</span>! Select Your Career Goal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Choose your target career path below or enter a custom goal. Carrier AI will instantly generate your multi-week roadmap, video hubs, weekly quizzes, and final project.
          </p>
        </div>

        {/* Popular Career Grid */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularCareers.map((c) => {
              const IconComp = c.icon;
              const isSelected = selectedGoal === c.title && customGoal.trim() === '';

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedGoal(c.title);
                    setCustomGoal('');
                  }}
                  className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 relative flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-2xl shadow-indigo-600/20 scale-[1.02]'
                      : 'glass-card border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Top Row: Icon + Badge + Selected Radio */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        isSelected ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${c.badgeColor}`}>
                          {c.badge}
                        </span>
                        <h3 className="font-extrabold text-base text-white mt-1">{c.title}</h3>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                    {c.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Custom Career Goal Input Option */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Or Enter a Custom Career Goal / Specialty</span>
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">Optional Custom Field</span>
            </div>

            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="e.g. Cloud Solutions Architect, DevOps Engineer, Game Developer..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-2xl shadow-indigo-600/30 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <span>{isSubmitting ? 'Generating AI Roadmap & Timetable...' : 'Generate My AI Career Roadmap & Start Learning'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </form>

      </div>
    </div>
  );
}
