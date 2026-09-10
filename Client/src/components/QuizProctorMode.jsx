import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2, XCircle, ArrowRight, HelpCircle, EyeOff } from 'lucide-react';

export default function QuizProctorMode({ topic, onSubmitQuiz, onCancel }) {
  const [violations, setViolations] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes quiz timer
  const [submitting, setSubmitting] = useState(false);

  const questions = [
    {
      id: 1,
      question: `What primary architectural goal does ${topic?.topic_name || 'this topic'} fulfill?`,
      options: [
        'Separation of concerns & high scalability',
        'Single giant monolithic file',
        'Disabling error boundaries',
        'Bypassing data validation'
      ],
      correct_answer: 0,
      sub_topic: topic?.sub_topics?.[0] || 'Core Fundamentals',
      explanation: 'Separation of concerns maintains codebase health.'
    },
    {
      id: 2,
      question: `How are async state updates correctly handled in ${topic?.topic_name || 'this topic'}?`,
      options: [
        'Blocking main UI thread',
        'Using Promises and Async/Await with try/catch',
        'Global infinite while loops',
        'Ignoring network failures'
      ],
      correct_answer: 1,
      sub_topic: topic?.sub_topics?.[0] || 'Core Fundamentals',
      explanation: 'Async/await with defensive try/catch prevents uncaught failures.'
    },
    {
      id: 3,
      question: `What is the recommended practice when implementing practical features in ${topic?.topic_name || 'this topic'}?`,
      options: [
        'Exposing private tokens in source code',
        'Decoupling logic into reusable modular hooks/functions',
        'Using non-descriptive variable names',
        'Skipping unit tests'
      ],
      correct_answer: 1,
      sub_topic: topic?.sub_topics?.[1] || 'Practical Application',
      explanation: 'Modular design enables code reuse across team features.'
    },
    {
      id: 4,
      question: `When deploying production code for ${topic?.topic_name || 'this topic'}, which check is essential?`,
      options: [
        'Deploying unminified dev builds',
        'Environment variables validation and security auditing',
        'Disabling CORS',
        'Hardcoding database IPs'
      ],
      correct_answer: 1,
      sub_topic: topic?.sub_topics?.[2] || 'Best Practices',
      explanation: 'Environment variables protect sensitive production keys.'
    }
  ];

  // -------------------------------------------------------------------
  // PROCTORING ENGINE: Tab-Switch & Window Blur Detection
  // -------------------------------------------------------------------
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const violationEvent = {
          type: 'tab_switch',
          time: new Date().toLocaleTimeString(),
          details: 'User switched browser tab or minimized window'
        };
        setViolations((prev) => [...prev, violationEvent]);
        setShowWarning(true);
      }
    };

    const handleWindowBlur = () => {
      const violationEvent = {
        type: 'window_blur',
        time: new Date().toLocaleTimeString(),
        details: 'Browser window lost focus'
      };
      setViolations((prev) => [...prev, violationEvent]);
      setShowWarning(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      clearInterval(timer);
    };
  }, []);

  const handleSelectOption = (optIndex) => {
    setUserAnswers({ ...userAnswers, [currentQIndex]: optIndex });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmitQuiz({
      quizId: topic?.id || 1,
      topicId: topic?.id || 1,
      userAnswers,
      violationFlags: violations
    });
    setSubmitting(false);
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6 relative">
      
      {/* Tab-Switch Proctor Violation Alert Drawer / Banner */}
      {showWarning && (
        <div className="bg-rose-950/90 border-2 border-rose-500 rounded-3xl p-4 proctor-alert-border text-rose-200 flex items-start justify-between gap-4 shadow-2xl relative z-30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center shrink-0">
              <EyeOff className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>PROCTOR VIOLATION FLAG DETECTED!</span>
                <span className="bg-rose-500 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-black">
                  Strict Enforcement
                </span>
              </div>
              <p className="text-xs text-rose-300 mt-0.5">
                Page visibility lost (Tab switch or window blur recorded). Total Violations: <span className="font-black text-white">{violations.length}</span>. This alert will be logged on your certificate audit log.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-xs bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 px-3 py-1.5 rounded-xl font-bold transition-all"
          >
            Acknowledge & Continue
          </button>
        </div>
      )}

      {/* Quiz Top Header */}
      <div className="glass-card rounded-3xl p-5 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              Proctored Exam Mode Active
            </span>
            <span className="text-xs text-slate-400">Week {topic?.week_number || 1} Quiz</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">{topic?.topic_name || 'Weekly Quiz'}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Proctoring Status Pill */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${violations.length > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></div>
            <span className="text-slate-300 font-semibold">
              {violations.length > 0 ? `${violations.length} Violation Flag(s)` : 'Visibility Shield On'}
            </span>
          </div>

          {/* Quiz Timer */}
          <div className="bg-indigo-950/60 border border-indigo-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-indigo-300 font-extrabold">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Question {currentQIndex + 1} of {questions.length}</span>
          <span className="text-indigo-400">Sub-topic Tag: <span className="text-amber-300 font-bold">{currentQ.sub_topic}</span></span>
        </div>

        {/* Question Text */}
        <div className="text-base font-bold text-white bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          {currentQ.question}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = userAnswers[currentQIndex] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 shadow-md shadow-indigo-600/20 text-white font-bold'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xs">{opt}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
            disabled={currentQIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous Question
          </button>

          {currentQIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQIndex(currentQIndex + 1)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Evaluating AI Score...' : 'Submit Proctored Quiz'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
