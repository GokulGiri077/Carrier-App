import React, { useState } from 'react';
import { Target, Sparkles, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const POPULAR_CAREERS = [
  { title: 'Full-Stack Developer', icon: '💻', desc: 'React, Node.js, Express, PostgreSQL, REST APIs' },
  { title: 'AI/ML Engineer', icon: '🤖', desc: 'Python, PyTorch, LLMs, LangChain, Neural Networks' },
  { title: 'Data Scientist', icon: '📊', desc: 'Statistics, Pandas, SQL, ML Models, Data Visualization' },
  { title: 'DevOps & Cloud Engineer', icon: '☁️', desc: 'AWS, Docker, Kubernetes, CI/CD, Infrastructure as Code' },
  { title: 'UI/UX Designer', icon: '🎨', desc: 'Figma, Design Systems, Wireframing, User Research' },
  { title: 'Cybersecurity Specialist', icon: '🛡️', desc: 'Network Security, Ethical Hacking, Threat Analysis' }
];

export default function AuthModal({ onLogin, onSignup }) {
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1); // 1: Career selection, 2: Account details
  const [selectedCareer, setSelectedCareer] = useState('Full-Stack Developer');
  const [customCareer, setCustomCareer] = useState('');
  const [formData, setFormData] = useState({
    name: 'Alex Rivera',
    email: 'alex.student@carrier.ai',
    password: 'password123'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const finalCareer = customCareer || selectedCareer;

    if (isLogin) {
      onLogin(formData.email, formData.password);
    } else {
      if (step === 1) {
        setStep(2);
      } else {
        onSignup(formData.name, formData.email, formData.password, finalCareer);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5 mx-auto mb-3 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-[#080b12] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isLogin ? 'Welcome Back to Carrier AI' : step === 1 ? 'Choose Your Career Goal' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin
              ? 'Sign in to access your proctored roadmap and quizzes'
              : step === 1
              ? 'AI will construct a custom week-by-week roadmap tailored for this goal'
              : 'Setup your profile to begin your AI-guided learning track'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {!isLogin && step === 1 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Select Target Career Path:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {POPULAR_CAREERS.map((c) => (
                  <button
                    key={c.title}
                    type="button"
                    onClick={() => { setSelectedCareer(c.title); setCustomCareer(''); }}
                    className={`p-3.5 rounded-2xl text-left border transition-all relative ${
                      selectedCareer === c.title && !customCareer
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{c.icon}</span>
                      {selectedCareer === c.title && !customCareer && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <div className="font-bold text-xs text-white">{c.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1">Or enter a custom career goal:</label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous Robotics Developer, Blockchain Engineer..."
                  value={customCareer}
                  onChange={(e) => setCustomCareer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {!isLogin && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      placeholder="Alex Rivera"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all mt-4"
          >
            <span>
              {isLogin
                ? 'Sign In to Dashboard'
                : step === 1
                ? 'Continue to Profile Details'
                : 'Generate AI Roadmap & Start'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(false); setStep(1); }}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Create Account & Roadmap
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign In Instead
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
