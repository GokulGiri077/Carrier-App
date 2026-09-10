import React, { useState } from 'react';
import { Play, CheckCircle2, HelpCircle, ArrowLeft, ExternalLink, Sparkles, AlertTriangle, BookOpen, Layers } from 'lucide-react';

export default function TimetableVideoHub({ topic, onBack, onOpenRemediation, onMarkCompleted }) {
  const subTopics = topic?.sub_topics || topic?.subTopics || ['Core Fundamentals', 'Hands-on Example', 'Best Practices'];
  
  const videos = [
    {
      id: 1,
      title: `${topic?.topic_name || 'Topic'} - Complete Theory & Conceptual Deep Dive`,
      platform: 'YouTube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      style_tag: 'theory',
      subTopic: subTopics[0] || 'Core Fundamentals',
      duration: '18 mins'
    },
    {
      id: 2,
      title: `Hands-on Project & Live Coding: ${topic?.topic_name || 'Topic'}`,
      platform: 'YouTube',
      url: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
      style_tag: 'example-based',
      subTopic: subTopics[1] || 'Hands-on Example',
      duration: '24 mins'
    }
  ];

  const [activeVideo, setActiveVideo] = useState(videos[0]);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [understood, setUnderstood] = useState(null);

  const handleFeedback = (didUnderstand) => {
    setUnderstood(didUnderstand);
    setFeedbackGiven(true);
    if (!didUnderstand) {
      // Trigger Adaptive Remediation Loop!
      onOpenRemediation(activeVideo.subTopic);
    } else {
      onMarkCompleted(topic?.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Week {topic?.week_number || 1} Timetable</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
            Video Hub
          </span>
        </div>
      </div>

      {/* Main Video & Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Video Player Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-3xl p-4 border border-indigo-500/20 space-y-3">
            {/* Embed Video Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <iframe
                className="w-full h-full"
                src={activeVideo.url}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Title & Style Tags */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                    Style: {activeVideo.style_tag}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    Sub-topic: {activeVideo.subTopic}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white">{activeVideo.title}</h2>
              </div>
            </div>

            {/* Post-Video Interactive Check-In ("Did you understand this?") */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Post-Video Understanding Check:</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Adaptive Remediation Trigger</span>
              </div>

              <p className="text-xs text-slate-300">"Did you understand the core principles and implementation in this video?"</p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => handleFeedback(true)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    understood === true
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Yes, I understood completely!</span>
                </button>

                <button
                  onClick={() => handleFeedback(false)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    understood === false
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>No, I need extra help / practice</span>
                </button>
              </div>

              {feedbackGiven && understood === false && (
                <div className="text-[11px] text-amber-300 font-semibold bg-amber-950/50 p-2.5 rounded-xl border border-amber-500/30 flex items-center justify-between">
                  <span>Launching AI Adaptive Remediation Diagnostic...</span>
                  <button
                    onClick={() => onOpenRemediation(activeVideo.subTopic)}
                    className="text-xs bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-extrabold hover:bg-amber-400"
                  >
                    Open Diagnostic &rarr;
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Video Playlist & Subtopics Sidebar */}
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Curated Video Recommendations
            </h3>

            <div className="space-y-2.5">
              {videos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => { setActiveVideo(v); setFeedbackGiven(false); setUnderstood(null); }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    activeVideo.id === v.id
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-indigo-300 uppercase">{v.platform}</span>
                    <span>{v.duration}</span>
                  </div>
                  <div className="font-semibold text-xs text-white line-clamp-2">{v.title}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {v.style_tag}
                    </span>
                    <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                      Watch Video &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SubTopics Checklist */}
            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 mb-2">Sub-concepts in this Topic:</div>
              <div className="space-y-1.5">
                {subTopics.map((st, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
