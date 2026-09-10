import React from 'react';
import { Play, CheckCircle2, AlertCircle, Clock, BookOpen, Sparkles, ChevronRight, Video, Target } from 'lucide-react';

export default function RoadmapView({ roadmap, topics, onSelectTopic, onStartQuiz }) {
  if (!roadmap || !roadmap.weeklyMilestones) {
    return (
      <div className="text-center py-16 glass-card rounded-3xl p-8 border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Generating Personalized AI Roadmap...</h3>
        <p className="text-xs text-slate-400">AI is mapping your topics, sub-concepts, timetable, and multi-platform video curation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                AI Roadmap Active
              </span>
              <span className="text-xs text-slate-400">{roadmap.totalWeeks} Weeks Track</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{roadmap.careerGoal} Path</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">{roadmap.summary}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-4">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Milestones</div>
              <div className="text-lg font-extrabold text-indigo-300">{topics.length} Topics</div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Progress
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Milestones Stream */}
      <div className="space-y-4">
        {roadmap.weeklyMilestones.map((m) => {
          const weekTopics = topics.filter(t => t.week_number === m.week);
          return (
            <div key={m.week} className="glass-card rounded-3xl p-5 border border-slate-800 glass-card-hover relative">
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-extrabold text-sm flex items-center justify-center">
                    W{m.week}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{m.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      {m.objective}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onStartQuiz(weekTopics[0] || { id: m.week, week_number: m.week, topic_name: m.title })}
                  className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>Week {m.week} AI Quiz</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {m.topics.map((t, idx) => {
                  const matchingDbTopic = topics.find(dt => dt.topic_name === t.name) || { status: 'pending' };
                  const isCompleted = matchingDbTopic.status === 'completed';
                  const needsReview = matchingDbTopic.status === 'needs_review';

                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectTopic(matchingDbTopic.id ? matchingDbTopic : { ...t, id: idx + 1, topic_name: t.name, week_number: m.week, sub_topics: t.subTopics })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        needsReview
                          ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-500'
                          : isCompleted
                          ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500'
                          : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-xs text-white line-clamp-1">{t.name}</span>
                        
                        {needsReview ? (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            Needs Review (&lt;50%)
                          </span>
                        ) : isCompleted ? (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Completed
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t.estimatedHours}h Est
                          </span>
                        )}
                      </div>

                      {/* SubTopics Pill Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {t.subTopics.map((st, stIdx) => (
                          <span key={stIdx} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50">
                            {st}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                          <Video className="w-3.5 h-3.5 text-indigo-400" />
                          {t.videos ? t.videos.length : 2} Curated Videos
                        </span>
                        <span className="text-indigo-400 font-bold hover:underline flex items-center gap-0.5">
                          Start Topic & Video Hub &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
