import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CareerSelectionScreen from './components/CareerSelectionScreen';
import RoadmapView from './components/RoadmapView';
import TimetableVideoHub from './components/TimetableVideoHub';
import AdaptiveRemediationModal from './components/AdaptiveRemediationModal';
import QuizProctorMode from './components/QuizProctorMode';
import FinalProjectProctorMode from './components/FinalProjectProctorMode';
import EvaluationReportModal from './components/EvaluationReportModal';
import CertificateView from './components/CertificateView';
import DashboardView from './components/DashboardView';

import { API_BASE_URL, apiFetch } from './config';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'timetable' | 'quiz' | 'project' | 'certificate' | 'dashboard'
  const [isGenerating, setIsGenerating] = useState(false);

  const [roadmap, setRoadmap] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const [remediationOpen, setRemediationOpen] = useState(false);
  const [remediationSubTopic, setRemediationSubTopic] = useState('Core Fundamentals');
  const [remediationLogs, setRemediationLogs] = useState([
    { sub_topic: 'State Management', issue_type: 'video', attempt_count: 1, escalated: false }
  ]);

  const [evaluationReport, setEvaluationReport] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [certificates, setCertificates] = useState([]);

  // Restore authenticated session from localStorage if present
  useEffect(() => {
    const savedToken = localStorage.getItem('carrier_jwt_token');
    const savedUser = JSON.parse(localStorage.getItem('carrier_user') || 'null');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      if (savedUser.career_goal) {
        generateRoadmap(savedUser.career_goal, savedToken);
      }
    }
  }, []);

  const generateRoadmap = async (careerGoal, activeToken = token) => {
    setIsGenerating(true);
    try {
      const res = await apiFetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken || 'demo_token'}`
        },
        body: JSON.stringify({ career_goal: careerGoal, duration_weeks: 6 })
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap.roadmap_json || data.roadmap);
        setTopics(data.topics || []);
      }
    } catch (err) {
      console.warn('Roadmap API call fallback:', err);
      // Offline fallback roadmap
      const fallbackRoadmap = {
        careerGoal,
        totalWeeks: 6,
        summary: `Personalized week-by-week AI roadmap for ${careerGoal} with adaptive remediation loops and proctored milestone checks.`,
        weeklyMilestones: [
          {
            week: 1,
            title: `Week 1: ${careerGoal} Core Fundamentals`,
            objective: 'Master foundational syntax, component architecture, and state models.',
            topics: [
              {
                name: `${careerGoal} Fundamentals & Environment`,
                subTopics: ['Architecture & Setup', 'State & Props Flow', 'Best Practices'],
                estimatedHours: 6
              },
              {
                name: 'Modern Asynchronous Control Flow',
                subTopics: ['Promises & Async/Await', 'Error Handling Boundaries'],
                estimatedHours: 5
              }
            ]
          }
        ]
      };
      setRoadmap(fallbackRoadmap);
      setTopics([
        { id: 1, roadmap_id: 1, week_number: 1, topic_name: `${careerGoal} Fundamentals & Environment`, sub_topics: ['Architecture & Setup', 'State & Props Flow'], status: 'pending' },
        { id: 2, roadmap_id: 1, week_number: 1, topic_name: 'Modern Asynchronous Control Flow', sub_topics: ['Promises & Async/Await', 'Error Boundaries'], status: 'pending' }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('carrier_jwt_token', data.token);
        localStorage.setItem('carrier_user', JSON.stringify(data.user));
        if (data.user.career_goal) {
          generateRoadmap(data.user.career_goal, data.token);
        }
      }
    } catch (err) {
      const mockUser = { id: 1, name: 'Alex Rivera', email, career_goal: '' };
      setUser(mockUser);
      setToken('demo_token');
      localStorage.setItem('carrier_jwt_token', 'demo_token');
      localStorage.setItem('carrier_user', JSON.stringify(mockUser));
    }
  };

  const handleSignup = async (name, email, password, career_goal) => {
    try {
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, career_goal: career_goal || '' })
      });
      const data = await res.json();
      if (data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('carrier_jwt_token', data.token);
        localStorage.setItem('carrier_user', JSON.stringify(data.user));
        if (data.user.career_goal) {
          generateRoadmap(data.user.career_goal, data.token);
        }
      }
    } catch (err) {
      const newUser = { id: 1, name, email, career_goal: career_goal || '' };
      setUser(newUser);
      setToken('demo_token');
      localStorage.setItem('carrier_jwt_token', 'demo_token');
      localStorage.setItem('carrier_user', JSON.stringify(newUser));
    }
  };

  const handleSelectCareer = async (selectedCareerGoal) => {
    const updatedUser = { ...user, career_goal: selectedCareerGoal };
    setUser(updatedUser);
    localStorage.setItem('carrier_user', JSON.stringify(updatedUser));

    // Update profile on backend
    try {
      await apiFetch('/api/auth/profile', {
        method: 'POST',
        body: JSON.stringify({ career_goal: selectedCareerGoal })
      });
    } catch (e) {}

    await generateRoadmap(selectedCareerGoal, token);
  };

  const completedCount = topics.filter(t => t.status === 'completed').length;
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 15;

  // ROUTING GUARD 1: Unauthenticated -> Show AuthModal (Login/Signup)
  if (!user) {
    return <AuthModal onLogin={handleLogin} onSignup={handleSignup} />;
  }

  // ROUTING GUARD 2: Authenticated but No Career Goal Selected -> Show CareerSelectionScreen
  if (!user.career_goal || user.career_goal.trim() === '' || !roadmap) {
    return <CareerSelectionScreen user={user} onSelectCareer={handleSelectCareer} isSubmitting={isGenerating} />;
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col">
      
      {/* Top Bar */}
      <Navbar
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        progressPercent={progressPercent}
        countdown={{ months: 1, days: 15, hours: 8 }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
        
        {/* If Mobile View Toggle is enabled, render inside Stylized Mobile Frame Simulator */}
        {isMobileView ? (
          <div className="mobile-frame-container shadow-2xl relative my-4">
            <div className="mobile-notch"></div>
            
            {/* Mobile App Viewport */}
            <div className="p-4 pt-10 h-full overflow-y-auto space-y-4">
              
              {/* Mobile Tab Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px] font-bold">
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className={`px-3 py-1.5 rounded-full shrink-0 ${activeTab === 'roadmap' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Roadmap
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 rounded-full shrink-0 ${activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Quiz
                </button>
                <button
                  onClick={() => setActiveTab('project')}
                  className={`px-3 py-1.5 rounded-full shrink-0 ${activeTab === 'project' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Final Project
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-full shrink-0 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Stats
                </button>
              </div>

              {activeTab === 'roadmap' && (
                <RoadmapView
                  roadmap={roadmap}
                  topics={topics}
                  onSelectTopic={handleSelectTopic}
                  onStartQuiz={handleStartQuiz}
                />
              )}

              {activeTab === 'timetable' && (
                <TimetableVideoHub
                  topic={selectedTopic || topics[0]}
                  onBack={() => setActiveTab('roadmap')}
                  onOpenRemediation={handleOpenRemediation}
                  onMarkCompleted={(topicId) => {
                    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: 'completed' } : t));
                  }}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizProctorMode
                  topic={selectedTopic || topics[0]}
                  onSubmitQuiz={handleSubmitQuiz}
                  onCancel={() => setActiveTab('roadmap')}
                />
              )}

              {activeTab === 'project' && (
                <FinalProjectProctorMode
                  roadmap={roadmap}
                  onSubmitProject={handleSubmitProject}
                />
              )}

              {activeTab === 'certificate' && (
                <CertificateView certificate={certificate} user={user} />
              )}

              {activeTab === 'dashboard' && (
                <DashboardView
                  user={user}
                  topics={topics}
                  countdown={{ months: 1, days: 15, hours: 8 }}
                  certificates={certificates}
                  remediationLogs={remediationLogs}
                  onNavigate={setActiveTab}
                />
              )}

            </div>
          </div>
        ) : (
          /* Web Dashboard Full Width View */
          <div>
            {activeTab === 'roadmap' && (
              <RoadmapView
                roadmap={roadmap}
                topics={topics}
                onSelectTopic={handleSelectTopic}
                onStartQuiz={handleStartQuiz}
              />
            )}

            {activeTab === 'timetable' && (
              <TimetableVideoHub
                topic={selectedTopic || topics[0]}
                onBack={() => setActiveTab('roadmap')}
                onOpenRemediation={handleOpenRemediation}
                onMarkCompleted={(topicId) => {
                  setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: 'completed' } : t));
                }}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizProctorMode
                topic={selectedTopic || topics[0]}
                onSubmitQuiz={handleSubmitQuiz}
                onCancel={() => setActiveTab('roadmap')}
              />
            )}

            {activeTab === 'project' && (
              <FinalProjectProctorMode
                roadmap={roadmap}
                onSubmitProject={handleSubmitProject}
              />
            )}

            {activeTab === 'certificate' && (
              <CertificateView certificate={certificate} user={user} />
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                user={user}
                topics={topics}
                countdown={{ months: 1, days: 15, hours: 8 }}
                certificates={certificates}
                remediationLogs={remediationLogs}
                onNavigate={setActiveTab}
              />
            )}
          </div>
        )}

      </main>

      {/* Adaptive Remediation Modal */}
      <AdaptiveRemediationModal
        isOpen={remediationOpen}
        onClose={() => setRemediationOpen(false)}
        subTopic={remediationSubTopic}
        onResolveRemediation={() => {
          setRemediationLogs(prev => [...prev, { sub_topic: remediationSubTopic, issue_type: 'video', attempt_count: 1, escalated: false }]);
        }}
      />

      {/* AI Evaluation Report Modal */}
      {evaluationReport && (
        <EvaluationReportModal
          evaluation={evaluationReport}
          certificate={certificate}
          onViewCertificate={() => {
            setEvaluationReport(null);
            setActiveTab('certificate');
          }}
          onClose={() => setEvaluationReport(null)}
        />
      )}

    </div>
  );
}
