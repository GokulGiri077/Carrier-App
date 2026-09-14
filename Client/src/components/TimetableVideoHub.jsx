import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  BookOpen,
  Layers,
  Loader2,
  RefreshCw,
  Tv,
  Check
} from 'lucide-react';
import { apiFetch } from '../config/api';

// Verified, topic-matched educational fallbacks if backend or YouTube is unreachable
const CLIENT_FALLBACK_CATALOG = {
  html_css: [
    {
      id: 'pQN-pnXPaVg',
      title: 'HTML Full Course - Build a Website Tutorial',
      channel: 'freeCodeCamp.org',
      platform: 'YouTube',
      videoId: 'pQN-pnXPaVg',
      url: 'https://www.youtube.com/embed/pQN-pnXPaVg',
      watchUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
      style_tag: 'theory',
      duration: '2 hours'
    },
    {
      id: 'ieTHC78jcEc',
      title: 'CSS Grid Crash Course - Complete Guide with Examples',
      channel: 'Traversy Media',
      platform: 'YouTube',
      videoId: 'ieTHC78jcEc',
      url: 'https://www.youtube.com/embed/ieTHC78jcEc',
      watchUrl: 'https://www.youtube.com/watch?v=ieTHC78jcEc',
      style_tag: 'example-based',
      duration: '35 mins'
    }
  ],
  javascript_async: [
    {
      id: 'W6NZfCO5SIk',
      title: 'JavaScript Tutorial for Beginners: Complete Fundamentals',
      channel: 'Programming with Mosh',
      platform: 'YouTube',
      videoId: 'W6NZfCO5SIk',
      url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
      watchUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
      style_tag: 'theory',
      duration: '48 mins'
    },
    {
      id: 'PoRJizFvM7s',
      title: 'Async JS Crash Course - Callbacks, Promises, Async Await',
      channel: 'Traversy Media',
      platform: 'YouTube',
      videoId: 'PoRJizFvM7s',
      url: 'https://www.youtube.com/embed/PoRJizFvM7s',
      watchUrl: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
      style_tag: 'example-based',
      duration: '25 mins'
    }
  ],
  react: [
    {
      id: 'bMknfKXIFA8',
      title: 'React Course - Beginner to Advanced Components & Architecture',
      channel: 'freeCodeCamp.org',
      platform: 'YouTube',
      videoId: 'bMknfKXIFA8',
      url: 'https://www.youtube.com/embed/bMknfKXIFA8',
      watchUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      style_tag: 'theory',
      duration: '2 hours'
    },
    {
      id: 'w7ejDZ8SWv8',
      title: 'React JS Crash Course - State, Hooks & Projects',
      channel: 'Traversy Media',
      platform: 'YouTube',
      videoId: 'w7ejDZ8SWv8',
      url: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
      watchUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
      style_tag: 'example-based',
      duration: '1.5 hours'
    }
  ],
  node_backend: [
    {
      id: 'fBNz5xF-Kx4',
      title: 'Node.js & Express REST API Architecture Explained',
      channel: 'Traversy Media',
      platform: 'YouTube',
      videoId: 'fBNz5xF-Kx4',
      url: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
      watchUrl: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
      style_tag: 'theory',
      duration: '1.5 hours'
    },
    {
      id: 'pKd0Rpw7O48',
      title: 'Build a Complete REST API with Node.js and Express',
      channel: 'freeCodeCamp.org',
      platform: 'YouTube',
      videoId: 'pKd0Rpw7O48',
      url: 'https://www.youtube.com/embed/pKd0Rpw7O48',
      watchUrl: 'https://www.youtube.com/watch?v=pKd0Rpw7O48',
      style_tag: 'example-based',
      duration: '2 hours'
    }
  ],
  python_ai: [
    {
      id: 'rfscVS0vtbw',
      title: 'Python for Beginners - Full Theory & Practical Course',
      channel: 'freeCodeCamp.org',
      platform: 'YouTube',
      videoId: 'rfscVS0vtbw',
      url: 'https://www.youtube.com/embed/rfscVS0vtbw',
      watchUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
      style_tag: 'theory',
      duration: '4.5 hours'
    },
    {
      id: 'QUT1VHiLmmI',
      title: 'NumPy & Pandas Crash Course for Data Science & ML',
      channel: 'freeCodeCamp.org',
      platform: 'YouTube',
      videoId: 'QUT1VHiLmmI',
      url: 'https://www.youtube.com/embed/QUT1VHiLmmI',
      watchUrl: 'https://www.youtube.com/watch?v=QUT1VHiLmmI',
      style_tag: 'example-based',
      duration: '1 hour'
    }
  ],
  general: [
    {
      id: 'zOjov-2OZ0E',
      title: 'Computer Science & Software Engineering Core Principles',
      channel: 'freeCodeCamp.org',
      platform: 'YouTube',
      videoId: 'zOjov-2OZ0E',
      url: 'https://www.youtube.com/embed/zOjov-2OZ0E',
      watchUrl: 'https://www.youtube.com/watch?v=zOjov-2OZ0E',
      style_tag: 'theory',
      duration: '1.5 hours'
    },
    {
      id: '1rsUV1O25i4',
      title: 'Full Stack Development - Hands-on Project Implementation',
      channel: 'JavaScript Mastery',
      platform: 'YouTube',
      videoId: '1rsUV1O25i4',
      url: 'https://www.youtube.com/embed/1rsUV1O25i4',
      watchUrl: 'https://www.youtube.com/watch?v=1rsUV1O25i4',
      style_tag: 'example-based',
      duration: '2 hours'
    }
  ]
};

function getClientFallbackVideos(topicName = '', subTopic = '') {
  const combined = `${topicName} ${subTopic}`.toLowerCase();
  let selected = CLIENT_FALLBACK_CATALOG.general;

  if (combined.includes('html') || combined.includes('css') || combined.includes('grid') || combined.includes('layout')) {
    selected = CLIENT_FALLBACK_CATALOG.html_css;
  } else if (combined.includes('async') || combined.includes('es6') || combined.includes('promise') || combined.includes('javascript')) {
    selected = CLIENT_FALLBACK_CATALOG.javascript_async;
  } else if (combined.includes('react') || combined.includes('component') || combined.includes('state')) {
    selected = CLIENT_FALLBACK_CATALOG.react;
  } else if (combined.includes('node') || combined.includes('express') || combined.includes('api') || combined.includes('backend')) {
    selected = CLIENT_FALLBACK_CATALOG.node_backend;
  } else if (combined.includes('python') || combined.includes('numpy') || combined.includes('machine learning') || combined.includes('ai')) {
    selected = CLIENT_FALLBACK_CATALOG.python_ai;
  }

  return selected.map((item, idx) => ({
    ...item,
    subTopic: idx === 0 ? (subTopic || 'Core Fundamentals') : 'Hands-on Practice'
  }));
}

export default function TimetableVideoHub({ topic, onBack, onOpenRemediation, onMarkCompleted }) {
  const subTopics = topic?.sub_topics || topic?.subTopics || ['Core Fundamentals', 'Hands-on Example', 'Best Practices'];
  const topicTitle = topic?.topic_name || 'Topic Overview';

  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [understood, setUnderstood] = useState(null);

  // Fetch real topic-matched YouTube videos from backend
  const fetchTopicVideos = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setLoading(true);

    try {
      const primarySubTopic = subTopics[0] || 'Fundamentals';
      const res = await apiFetch(`/api/videos?topic=${encodeURIComponent(topicTitle)}&subTopic=${encodeURIComponent(primarySubTopic)}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          setActiveVideo(data.videos[0]);
          return;
        }
      }
      
      // Fallback if API response empty or not 200
      const fallbacks = getClientFallbackVideos(topicTitle, primarySubTopic);
      setVideos(fallbacks);
      setActiveVideo(fallbacks[0]);
    } catch (err) {
      console.warn('Video fetch fallback triggered:', err);
      const fallbacks = getClientFallbackVideos(topicTitle, subTopics[0]);
      setVideos(fallbacks);
      setActiveVideo(fallbacks[0]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setFeedbackGiven(false);
    setUnderstood(null);
    fetchTopicVideos();
  }, [topic?.id, topic?.topic_name]);

  const handleFeedback = (didUnderstand) => {
    setUnderstood(didUnderstand);
    setFeedbackGiven(true);
    if (!didUnderstand) {
      onOpenRemediation(activeVideo?.subTopic || subTopics[0]);
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
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-all hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTopicVideos(true)}
            disabled={loading || isRefreshing}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 px-2.5 py-1.5 rounded-xl transition-all disabled:opacity-50"
            title="Refresh video recommendations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Refresh Videos</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Week {topic?.week_number || 1} Timetable</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Tv className="w-3 h-3 text-indigo-400" />
            YouTube Curated
          </span>
        </div>
      </div>

      {/* Main Video & Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Video Player Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-3xl p-4 sm:p-5 border border-indigo-500/20 space-y-4">
            
            {/* Embed Video Frame / Skeleton */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-slate-950/80 backdrop-blur">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-xs font-semibold text-slate-400 animate-pulse">
                    Searching relevant YouTube tutorials for "{topicTitle}"...
                  </p>
                </div>
              ) : activeVideo?.url ? (
                <iframe
                  className="w-full h-full"
                  src={activeVideo.url}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                  No video selected
                </div>
              )}
            </div>

            {/* Video Details & Channel Info */}
            {activeVideo && !loading && (
              <div className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                        Style: {activeVideo.style_tag || 'Tutorial'}
                      </span>
                      {activeVideo.channel && (
                        <span className="text-[10px] font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          {activeVideo.channel}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-emerald-400" />
                        Sub-concept: {activeVideo.subTopic || subTopics[0]}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                      {activeVideo.title}
                    </h2>
                  </div>

                  {/* Direct YouTube Link Button */}
                  {activeVideo.watchUrl && (
                    <a
                      href={activeVideo.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                      <span>Watch on YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Post-Video Interactive Check-In ("Did you understand this?") */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Post-Video Understanding Check:</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Adaptive Remediation Trigger</span>
              </div>

              <p className="text-xs text-slate-300">
                "Did you understand the core principles and implementation demonstrated in this video?"
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
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
                    onClick={() => onOpenRemediation(activeVideo?.subTopic || subTopics[0])}
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
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Curated Video Lessons
              </h3>
              <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                {videos.length} Available
              </span>
            </div>

            <div className="space-y-2.5">
              {loading ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="p-3 rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse space-y-2">
                    <div className="h-3 w-1/3 bg-slate-800 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
                    <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
                  </div>
                ))
              ) : (
                videos.map((v, idx) => {
                  const isActive = activeVideo?.videoId === v.videoId || activeVideo?.id === v.id;
                  return (
                    <div
                      key={v.videoId || v.id || idx}
                      onClick={() => {
                        setActiveVideo(v);
                        setFeedbackGiven(false);
                        setUnderstood(null);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-indigo-300 uppercase">{v.channel || v.platform || 'YouTube'}</span>
                        <span>{v.duration || `${15 + idx * 8} mins`}</span>
                      </div>
                      <div className="font-semibold text-xs text-white line-clamp-2 leading-relaxed">
                        {v.title}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 capitalize">
                          {v.style_tag || 'lesson'}
                        </span>
                        <span className={`font-bold flex items-center gap-0.5 ${isActive ? 'text-indigo-300' : 'text-slate-400 hover:text-white'}`}>
                          {isActive ? 'Currently Playing' : 'Watch Lesson →'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
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
