import React from 'react';
import { Smartphone, LayoutDashboard, Clock, User, Sparkles, ShieldAlert, Award } from 'lucide-react';

export default function Navbar({ isMobileView, setIsMobileView, activeTab, setActiveTab, user, countdown, progressPercent }) {
  return (
    <header className="sticky top-0 z-40 bg-[#080b12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#080b12] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white tracking-tight">Carrier <span className="text-indigo-400">AI</span></h1>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase">
                {user?.career_goal || 'Full-Stack'}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI-Powered Verified Career Path</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop/Web Dashboard View) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roadmap' || activeTab === 'timetable'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Roadmap & Timetable
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Weekly Quiz
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'project'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Final Project
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Dashboard & Stats
          </button>
        </div>

        {/* Live Deadline Ticker & Controls */}
        <div className="flex items-center gap-3">
          {/* Deadline Countdown Ticker */}
          <div className="hidden lg:flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400">Target Goal: </span>
              <span className="font-bold text-indigo-300">{countdown ? `${countdown.months}m ${countdown.days}d ${countdown.hours}h` : '45 Days'}</span>
            </div>
          </div>

          {/* Progress Ring / Percentage Pill */}
          <div className="flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-xl text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span>{progressPercent}% Done</span>
          </div>

          {/* Frame Switcher Toggle */}
          <button
            onClick={() => setIsMobileView(!isMobileView)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 transition-all"
            title="Toggle between Mobile App Frame View and Web Dashboard View"
          >
            {isMobileView ? (
              <>
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Web View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Mobile Frame</span>
              </>
            )}
          </button>

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 pl-2.5 rounded-xl">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white hidden md:inline">{user?.name || 'Student'}</span>
            <button
              onClick={() => {
                localStorage.removeItem('carrier_jwt_token');
                localStorage.removeItem('carrier_user');
                window.location.reload();
              }}
              className="text-[10px] bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 px-2 py-1 rounded-lg transition-all"
              title="Log Out & Return to Login Screen"
            >
              Log Out
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
