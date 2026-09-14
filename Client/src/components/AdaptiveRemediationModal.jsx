import React, { useState } from 'react';
import { X, Sparkles, Video, Code, MessageSquare, AlertCircle, ArrowRight, CheckCircle2, UserCheck, Play } from 'lucide-react';
import { apiFetch } from '../config/api';

export default function AdaptiveRemediationModal({ isOpen, onClose, subTopic, onResolveRemediation }) {
  const [step, setStep] = useState('diagnose'); // 'diagnose' | 'recommendation' | 'mentor'
  const [issueType, setIssueType] = useState(null); // 'video' | 'application'
  const [attemptCount, setAttemptCount] = useState(1);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectIssue = async (type) => {
    setIssueType(type);
    setLoading(true);

    try {
      const res = await apiFetch('/api/remediation/feedback', {
        method: 'POST',
        body: JSON.stringify({
          topicId: 1,
          subTopic: subTopic || 'Core Fundamentals',
          issueType: type
        })
      });
      const data = await res.json();
      
      if (data.escalated || data.remediation?.attempt_count >= 3 || attemptCount >= 3) {
        setStep('mentor');
      } else {
        setRecommendation(data.remediation?.suggested_resource);
        setStep('recommendation');
      }
    } catch (err) {
      // Mock fallback diagnostic recommendation
      if (attemptCount >= 3) {
        setStep('mentor');
      } else {
        setRecommendation(
          type === 'video'
            ? {
                type: 'video',
                title: `Alternative Explanation: ${subTopic} Conceptual Deep Dive`,
                platform: 'Coursera / YouTube Interactive',
                url: 'https://www.youtube.com/embed/2LhktLMf3fU',
                description: 'Uses intuitive visual analogies and architectural diagrams instead of abstract theory.'
              }
            : {
                type: 'exercise',
                title: `Targeted Practice Exercise: ${subTopic}`,
                platform: 'Interactive CodeSandbox',
                url: 'https://codesandbox.io/s/new',
                description: 'Solve a 5-step guided code sandbox challenge designed specifically for this sub-topic.'
              }
        );
        setStep('recommendation');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecheck = (helped) => {
    if (helped) {
      onResolveRemediation();
      onClose();
    } else {
      const nextAttempts = attemptCount + 1;
      setAttemptCount(nextAttempts);
      if (nextAttempts >= 3) {
        setStep('mentor');
      } else {
        setStep('diagnose');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-card rounded-3xl p-6 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Adaptive Remediation Loop</h3>
              <p className="text-[10px] text-slate-400">Sub-topic: <span className="text-amber-300 font-semibold">{subTopic}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
              Attempt {attemptCount}/3
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step 1: Diagnose Root Cause */}
        {step === 'diagnose' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-300 font-semibold">
              Where is the breakdown happening? Let AI diagnose your exact learning block:
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleSelectIssue('video')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500 text-left transition-all group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white group-hover:text-indigo-300">Explanation / Video Issue</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">"The video explanation wasn't clear, fast-paced, or didn't use relatable visual examples."</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectIssue('application')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500 text-left transition-all group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white group-hover:text-emerald-300">Application / Practice Issue</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">"I understand the concept theoretically, but need a guided hands-on practice exercise."</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Adaptive AI Recommendation */}
        {step === 'recommendation' && recommendation && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
              ⚡ AI Recommendation generated for <span className="font-bold">{subTopic}</span>:
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-indigo-400 uppercase">{recommendation.platform}</span>
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-semibold uppercase">{recommendation.type}</span>
              </div>
              
              <div className="font-bold text-sm text-white">{recommendation.title}</div>
              <p className="text-xs text-slate-300">{recommendation.description}</p>

              {recommendation.type === 'video' ? (
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mt-2">
                  <iframe
                    className="w-full h-full"
                    src={recommendation.url}
                    title={recommendation.title}
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <a
                  href={recommendation.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition-all"
                >
                  Open Interactive Practice Sandbox &rarr;
                </a>
              )}
            </div>

            {/* Re-check Checkpoint */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300">Did this alternative resource clear up your doubt?</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRecheck(true)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                >
                  Yes, Doubt Resolved!
                </button>
                <button
                  onClick={() => handleRecheck(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Still Stuck
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Mentor Escalation (Triggered after 3 failed attempts) */}
        {step === 'mentor' && (
          <div className="space-y-4 text-center py-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6" />
            </div>
            
            <div>
              <h4 className="font-extrabold text-base text-white">Escalating to 1-on-1 AI / Human Mentor</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                You've completed {attemptCount} remediation attempts on <span className="text-amber-300 font-semibold">{subTopic}</span>. To prevent getting stuck in loops, an AI Mentor live session has been reserved for you.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-left space-y-2 text-xs">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Live Doubt Resolution Queue Active
              </div>
              <p className="text-slate-400">Your mentor has received your quiz sub-topic flags and video interaction log.</p>
            </div>

            <button
              onClick={() => { onResolveRemediation(); onClose(); }}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30"
            >
              Join 1-on-1 Mentor Session Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
