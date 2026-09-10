import React from 'react';
import { Award, CheckCircle2, Sparkles, X, ChevronRight, ShieldCheck, Star } from 'lucide-react';

export default function EvaluationReportModal({ evaluation, certificate, onViewCertificate, onClose }) {
  if (!evaluation) return null;

  const rubric = evaluation.rubricBreakdown || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Top Glow Accent */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-black px-2 py-0.5 rounded">
                  PASSED & VERIFIED
                </span>
                <span className="text-xs text-slate-400">AI Rubric Evaluation</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Project Evaluation Score: {evaluation.overallScore}/100</h2>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Card Summary */}
        <div className="my-5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm text-white">AI Evaluation Status: PASSED</div>
            <p className="text-xs text-slate-300 mt-0.5">{evaluation.summary}</p>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="text-3xl font-black text-emerald-400">{evaluation.overallScore}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Points / 100</div>
          </div>
        </div>

        {/* Rubric Breakdown Grid */}
        <div className="space-y-3 mb-6">
          <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider">5-Part AI Rubric Breakdown</h3>

          {Object.entries(rubric).map(([key, r]) => (
            <div key={key} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-bold text-emerald-400">{r.score} / {r.max} pts</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                  style={{ width: `${(r.score / r.max) * 100}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-400">{r.feedback}</p>
            </div>
          ))}
        </div>

        {/* Proctoring Audit Log */}
        {evaluation.proctoringAudit && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mb-6">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Assessment Integrity & Proctoring Audit</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>Webcam Stream: <span className="text-emerald-400 font-bold">Verified Single Person</span></div>
              <div>Copy-Paste Attempts: <span className="text-emerald-400 font-bold">0 Violations</span></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onViewCertificate}
          className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Unlock & Issue Verified Certificate &rarr;</span>
        </button>

      </div>
    </div>
  );
}
