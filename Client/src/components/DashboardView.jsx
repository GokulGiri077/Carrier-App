import React from 'react';
import { Target, Clock, CheckCircle2, AlertTriangle, Award, Flame, BookOpen, ChevronRight, ShieldCheck, Download, RefreshCw } from 'lucide-react';

export default function DashboardView({ user, topics, countdown, certificates, remediationLogs, onNavigate }) {
  const completedTopics = topics.filter(t => t.status === 'completed');
  const needsReviewTopics = topics.filter(t => t.status === 'needs_review');
  const progressPercent = topics.length > 0 ? Math.round((completedTopics.length / topics.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
              Student Progress Center
            </span>
            <span className="text-xs text-slate-400">Target Track: {user?.career_goal || 'Full-Stack Developer'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome Back, <span className="text-indigo-400">{user?.name || 'Alex'}</span>!
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Track your milestone completion, adaptive remediation history, exam proctoring audit, and final certificate status.
          </p>
        </div>

        {/* Live Deadline Countdown Display */}
        <div className="bg-slate-900/90 border border-indigo-500/30 p-4 rounded-2xl shrink-0 flex items-center gap-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Goal Deadline Countdown</div>
            <div className="text-lg font-black text-white">
              {countdown ? `${countdown.months}m ${countdown.days}d ${countdown.hours}h` : '1m 15d 8h'}
            </div>
            <div className="text-[10px] text-indigo-300 font-semibold">Remaining to reach Career Goal</div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Progress Bar Card */}
        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Roadmap Completion</span>
            <span className="font-black text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400">{completedTopics.length} of {topics.length} topics completed</div>
        </div>

        {/* Study Streak */}
        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Current Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          </div>
          <div className="text-2xl font-black text-white">12 Days 🔥</div>
          <div className="text-[11px] text-slate-400">Daily learning habit active</div>
        </div>

        {/* Remediation Review Count */}
        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Adaptive Remediation</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{needsReviewTopics.length} Topics</div>
          <div className="text-[11px] text-slate-400">Scheduled for review</div>
        </div>

        {/* Certificate Status */}
        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Verified Certificate</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{certificates.length > 0 ? 'ISSUED 🎓' : 'In Progress'}</div>
          <div className="text-[11px] text-slate-400">{certificates.length > 0 ? 'Ready to download' : 'Complete final project'}</div>
        </div>

      </div>

      {/* Detailed Section: Remediation Log History */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Adaptive Remediation Log & Diagnoses</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">{remediationLogs.length} Logged Events</span>
        </div>

        <div className="space-y-2.5">
          {remediationLogs.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
              No remediation loops triggered yet. Complete weekly quizzes or watch videos to generate diagnostic records.
            </div>
          ) : (
            remediationLogs.map((log, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{log.sub_topic || 'Sub-topic'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                      log.issue_type === 'video' ? 'bg-indigo-600/30 text-indigo-300' : 'bg-emerald-600/30 text-emerald-300'
                    }`}>
                      {log.issue_type === 'video' ? 'Explanation Issue' : 'Practice Issue'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Attempt {log.attempt_count}/3 • Status: {log.escalated ? 'Mentor Escalated' : 'Remediation Active'}</div>
                </div>

                <button
                  onClick={() => onNavigate('roadmap')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold"
                >
                  Review Topic &rarr;
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
