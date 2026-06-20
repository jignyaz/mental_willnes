import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Smile, 
  Flame, 
  MessageSquare, 
  Send, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Award, 
  Sparkles, 
  Clock, 
  Trash2, 
  RefreshCw,
  HelpCircle,
  BookOpen,
  Frown,
  Meh,
  Laugh
} from 'lucide-react';

// Configuration of Indian competitive exams with descriptions and themes
const EXAMS = [
  { id: 'JEE', name: 'JEE', longName: 'Joint Entrance Examination', desc: 'Engineering (IIT/NIT)', themeColor: 'indigo', motto: 'Focus & Solve' },
  { id: 'NEET', name: 'NEET', longName: 'National Eligibility cum Entrance Test', desc: 'Medical (AIIMS/Govt)', themeColor: 'emerald', motto: 'Diligence & Accuracy' },
  { id: 'UPSC', name: 'UPSC', longName: 'Civil Services Examination', desc: 'IAS / IPS / IFS', themeColor: 'amber', motto: 'Consistency & Depth' },
  { id: 'GATE', name: 'GATE', longName: 'Graduate Aptitude Test in Engineering', desc: 'Post-Grad & PSU', themeColor: 'blue', motto: 'Concepts & Application' },
  { id: 'CAT', name: 'CAT', longName: 'Common Admission Test', desc: 'Management (IIMs)', themeColor: 'teal', motto: 'Strategy & Speed' },
  { id: 'CUET', name: 'CUET', longName: 'Common University Entrance Test', desc: 'UG Admissions', themeColor: 'purple', motto: 'Concepts & Speed' }
];

// Descriptive emoji scale mapping
const MOOD_LEVELS = [
  { value: 1, emoji: '😢', text: 'Overwhelmed', color: 'text-rose-500', bg: 'bg-rose-950/30', border: 'border-rose-800' },
  { value: 2, emoji: '😭', text: 'Distressed', color: 'text-rose-400', bg: 'bg-rose-950/20', border: 'border-rose-900' },
  { value: 3, emoji: '😰', text: 'Anxious', color: 'text-orange-500', bg: 'bg-orange-950/30', border: 'border-orange-800' },
  { value: 4, emoji: '😩', text: 'Exhausted', color: 'text-orange-400', bg: 'bg-orange-950/20', border: 'border-orange-900' },
  { value: 5, emoji: '😐', text: 'Flat / Tired', color: 'text-yellow-500', bg: 'bg-yellow-950/30', border: 'border-yellow-800' },
  { value: 6, emoji: '😌', text: 'Okay / Coping', color: 'text-yellow-400', bg: 'bg-yellow-950/20', border: 'border-yellow-900' },
  { value: 7, emoji: '🙂', text: 'Balanced', color: 'text-emerald-500', bg: 'bg-emerald-950/30', border: 'border-emerald-800' },
  { value: 8, emoji: '😸', text: 'Focused', color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-900' },
  { value: 9, emoji: '😀', text: 'Calm & Happy', color: 'text-teal-500', bg: 'bg-teal-950/30', border: 'border-teal-800' },
  { value: 10, emoji: '🚀', text: 'Unstoppable', color: 'text-cyan-400', bg: 'bg-cyan-950/30', border: 'border-cyan-800' },
];

export default function App() {
  // --- Persistent React State using LocalStorage ---
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('wellness_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('wellness_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastLoggedDate, setLastLoggedDate] = useState(() => {
    return localStorage.getItem('wellness_last_logged_date') || null;
  });

  const [selectedExam, setSelectedExam] = useState(() => {
    return localStorage.getItem('wellness_selected_exam') || 'JEE';
  });

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('wellness_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  // --- UI Interactive State ---
  const [currentMood, setCurrentMood] = useState(6); // default 'Okay'
  const [journalText, setJournalText] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'history'

  const chatEndRef = useRef(null);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('wellness_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('wellness_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    if (lastLoggedDate) {
      localStorage.setItem('wellness_last_logged_date', lastLoggedDate);
    } else {
      localStorage.removeItem('wellness_last_logged_date');
    }
  }, [lastLoggedDate]);

  useEffect(() => {
    localStorage.setItem('wellness_selected_exam', selectedExam);
  }, [selectedExam]);

  useEffect(() => {
    localStorage.setItem('wellness_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Scroll to bottom of chat when history changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  // Find info about the current active exam
  const currentExamInfo = EXAMS.find(e => e.id === selectedExam) || EXAMS[0];

  // --- Core Logics & API Handlers ---

  // Calculate and update journaling streak
  const updateStreak = () => {
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');

    if (lastLoggedDate === todayStr) {
      // Already logged today, streak stays the same
      return streak;
    } else if (lastLoggedDate === yesterdayStr) {
      // Logged yesterday, increment streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      setLastLoggedDate(todayStr);
      return newStreak;
    } else {
      // Gap of more than 1 day, reset streak to 1
      const newStreak = 1;
      setStreak(newStreak);
      setLastLoggedDate(todayStr);
      return newStreak;
    }
  };

  // Submits the journal entry for mood analysis and companion response
  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    if (!journalText.trim()) {
      setErrorMsg('Please write a short journal entry first to let Gemini analyze your mental state.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Call backend POST /api/chat
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journal: journalText,
          mood: currentMood,
          exam: selectedExam
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error occurred while analyzing journal.');
      }

      const data = await response.json();
      
      // Update streak
      const activeStreak = updateStreak();

      // Create new entry record
      const todayStr = new Date().toLocaleDateString('en-CA');
      const newEntry = {
        id: Date.now().toString(),
        date: todayStr,
        mood: currentMood,
        journal: journalText,
        exam: selectedExam,
        analysis: data.analysis || {
          anxietyLevel: 'Medium',
          stressors: ['General Exam Stress'],
          copingStrategies: ['Take brief hourly breaks to walk', 'Practice deep breathing']
        }
      };

      // Add to entry list (append at the end, so chronologically correct)
      const updatedEntries = [...entries, newEntry];
      setEntries(updatedEntries);

      // Hydrate companion response into chat companion history
      const systemMessage = {
        id: `sys-${Date.now()}`,
        sender: 'companion',
        text: data.companionResponse || 'I am here for you. Tell me what is on your mind.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory([systemMessage]);

      // Reset form fields
      setJournalText('');
      
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to connect to the wellness backend. Ensure server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sends follow-up message to the chat companion guide
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userMsgText = chatMessage;
    setChatMessage('');
    setIsChatLoading(true);
    setErrorMsg('');

    // Append user message immediately
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);

    try {
      // Map history formats for the backend API
      const apiHistory = updatedHistory.slice(0, -1).map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          history: apiHistory,
          exam: selectedExam
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error occurred in companion chat.');
      }

      const data = await response.json();

      const companionMessage = {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text: data.companionResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, companionMessage]);

    } catch (err) {
      console.error(err);
      // Append an error notice to chat
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: 'companion',
        text: '⚠️ I had trouble connecting to my cognitive system. Please check the backend server state.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper to clear all tracker data
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all your logged history, streaks, and chat logs? This cannot be undone.')) {
      setEntries([]);
      setStreak(0);
      setLastLoggedDate(null);
      setChatHistory([]);
      localStorage.removeItem('wellness_entries');
      localStorage.removeItem('wellness_streak');
      localStorage.removeItem('wellness_last_logged_date');
      localStorage.removeItem('wellness_chat_history');
      setErrorMsg('All mood history and data cleared.');
    }
  };

  // Preset prompts for Quick suggestion chips in Chat Companion
  const SUGGESTION_CHIPS = [
    { text: 'Mock test scores dropped, feeling down.', label: 'Test Stress' },
    { text: 'How do I cope with huge syllabus backlog?', label: 'Backlog Help' },
    { text: 'Guilty of wasting time today, self-doubting.', label: 'Procrastination' },
    { text: 'Parents are expecting high ranks. Pressure is immense.', label: 'Family Pressure' },
  ];

  // Helper to trigger a chat suggestion click
  const handleSuggestionClick = (text) => {
    setChatMessage(text);
  };

  // --- SVG Chart Computations ---
  const renderSVGChart = () => {
    const chartWidth = 500;
    const chartHeight = 160;
    const paddingX = 40;
    const paddingY = 25;

    // Get last 7 logs
    const lastLogs = entries.slice(-7);

    if (lastLogs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
          <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm font-medium">No mood history available.</p>
          <p className="text-xs text-slate-600">Submit your daily journal entry above to see trends.</p>
        </div>
      );
    }

    // Map logs to coordinates
    const points = lastLogs.map((log, idx) => {
      // calculate horizontal division
      const x = lastLogs.length === 1 
        ? chartWidth / 2 
        : paddingX + (idx * (chartWidth - paddingX * 2)) / (lastLogs.length - 1);
      // scale Y coordinate representing mood scale 1-10
      const y = chartHeight - paddingY - ((log.mood - 1) * (chartHeight - paddingY * 2)) / 9;
      return { x, y, mood: log.mood, date: log.date };
    });

    // Create SVG Path line
    let linePath = '';
    let areaPath = '';

    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        linePath += ` L ${points[i].x} ${points[i].y}`;
      }

      // Close the area to render the gradient below the line
      areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;
    }

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[320px] h-44 select-none">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal for moods 1, 5, 10) */}
          <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3,3" />
          <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3,3" />
          <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="rgba(255, 255, 255, 0.08)" />

          {/* Axis Labels */}
          <text x={paddingX - 10} y={paddingY + 4} fill="#64748b" className="text-[10px] font-semibold text-right" textAnchor="end">10</text>
          <text x={paddingX - 10} y={chartHeight / 2 + 4} fill="#64748b" className="text-[10px] font-semibold" textAnchor="end">5</text>
          <text x={paddingX - 10} y={chartHeight - paddingY + 4} fill="#64748b" className="text-[10px] font-semibold" textAnchor="end">1</text>

          {/* Area Fill */}
          {points.length > 1 && (
            <path d={areaPath} fill="url(#chartGlow)" />
          )}

          {/* Line Path */}
          {points.length > 1 && (
            <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Individual Points / Dots */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#020617" stroke="#818cf8" strokeWidth="3.5" className="transition-all hover:r-7 cursor-pointer" />
              {/* Mood value popup above point */}
              <rect x={pt.x - 12} y={pt.y - 25} width="24" height="16" rx="4" fill="#1e1b4b" stroke="#3730a3" strokeWidth="1" />
              <text x={pt.x} y={pt.y - 14} fill="#e0e7ff" className="text-[9px] font-bold" textAnchor="middle">
                {pt.mood}
              </text>
              {/* Date tag below point */}
              <text x={pt.x} y={chartHeight - 6} fill="#64748b" className="text-[9px]" textAnchor="middle">
                {new Date(pt.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // Get current active mood representation
  const activeMoodInfo = MOOD_LEVELS.find(m => m.value === currentMood) || MOOD_LEVELS[5];

  // Get last entry analysis to display as insights
  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  // Streak badge determination
  const getStreakBadge = (s) => {
    if (s >= 15) return { title: 'Unyielding Zen Master', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' };
    if (s >= 7) return { title: '7-Day Concentration Warrior', color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800' };
    if (s >= 3) return { title: '3-Day Consistency Streak', color: 'bg-amber-950/60 text-amber-300 border-amber-800' };
    if (s > 0) return { title: 'First Sankalp Log', color: 'bg-slate-900 text-slate-300 border-slate-700' };
    return null;
  };
  const activeBadge = getStreakBadge(streak);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 font-sans">
      
      {/* --- Premium Navbar --- */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-900/30">
              <Brain className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 font-display">
                Sankalp AI
              </h1>
              <p className="text-[10px] text-indigo-400 font-medium tracking-wide uppercase">
                Student Wellness Companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Exam selector pills */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-500 font-semibold hidden md:inline">Prep Exam:</span>
              <select 
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="bg-transparent text-indigo-300 focus:outline-none font-bold px-2 py-1 cursor-pointer"
              >
                {EXAMS.map(exam => (
                  <option key={exam.id} value={exam.id} className="bg-slate-900 text-slate-100 font-medium">
                    {exam.name} ({exam.desc})
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleResetData}
              title="Clear all local data"
              className="p-2 bg-slate-900 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900/50 border border-slate-850 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Dashboard Container --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Exam Motivation Banner */}
        <div className={`p-4 rounded-2xl glass-card border border-indigo-500/10 flex items-center justify-between gap-4 overflow-hidden relative shadow-lg`}>
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-3.5 z-10">
            <span className="p-2 bg-indigo-900/40 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-800/40">
              {currentExamInfo.id}
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-200">
                Preparing for {currentExamInfo.longName}?
              </h2>
              <p className="text-xs text-indigo-300/80">
                "{currentExamInfo.motto}" — Wellness keeps your preparation sustainable. Focus on your mind, ranks will follow.
              </p>
            </div>
          </div>
          
          {/* Streak Flame */}
          <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-amber-400 animate-bounce">
            <Flame className="w-5 h-5 fill-amber-500" />
            <div className="text-right">
              <div className="text-[10px] text-amber-500/80 font-bold uppercase leading-none">Streak</div>
              <div className="text-sm font-extrabold leading-none">{streak} Days</div>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
            <div className="flex-1 font-medium">{errorMsg}</div>
            <button onClick={() => setErrorMsg('')} className="hover:text-white font-bold px-1 text-sm">×</button>
          </div>
        )}

        {/* Main Grid: Left Logger & Insights / Right Streak & Companion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SECTION (Col 12 to 7 on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* CARD: DAILY MOOD & JOURNAL LOGGER */}
            <section className="glass-card rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2.5 mb-5">
                <Smile className="w-5.5 h-5.5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100 font-display">Daily Mind Log</h3>
              </div>

              <form onSubmit={handleMoodSubmit} className="flex flex-col gap-6">
                
                {/* Mood Scale Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-3 uppercase tracking-wider">
                    How is your state of mind today? (Scale 1 - 10)
                  </label>

                  {/* Active Selector Display */}
                  <div className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${activeMoodInfo.bg} ${activeMoodInfo.border} mb-4 animate-fade-in`}>
                    <span className="text-3xl filter drop-shadow">{activeMoodInfo.emoji}</span>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Self-rated: {activeMoodInfo.value}/10</div>
                      <div className={`text-base font-bold ${activeMoodInfo.color}`}>{activeMoodInfo.text}</div>
                    </div>
                  </div>

                  {/* Horizontal Quick Select Circles */}
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-3">
                    {MOOD_LEVELS.map((ml) => (
                      <button
                        key={ml.value}
                        type="button"
                        onClick={() => setCurrentMood(ml.value)}
                        className={`py-2 rounded-xl text-center border text-lg flex flex-col items-center justify-center transition-all hover:scale-105 ${
                          currentMood === ml.value 
                            ? 'bg-indigo-600/35 border-indigo-500 scale-105 shadow-md shadow-indigo-900/20' 
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{ml.emoji}</span>
                        <span className="text-[9px] font-bold mt-1 text-slate-300">{ml.value}</span>
                      </button>
                    ))}
                  </div>

                  {/* Backup slider */}
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentMood}
                    onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 bg-slate-900 h-2.5 rounded-lg appearance-none cursor-pointer border border-slate-850"
                  />
                </div>

                {/* Journal Area */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Write your thoughts & stressors
                    </label>
                    <span className="text-[10px] text-slate-500">Express backlogs, sleep quality, anxiety levels</span>
                  </div>

                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    rows="4"
                    placeholder="Example: Feeling stressed about chemistry syllabus backlog and mock test. Struggling to get sound sleep since JEE physics has become really difficult..."
                    className="w-full bg-slate-900/85 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950 focus:outline-none rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 leading-relaxed resize-none transition-all"
                  ></textarea>

                  {/* Hints */}
                  <p className="text-[11px] text-indigo-400/80 mt-1.5 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
                    Gemini AI will analyze your journal to find anxiety levels, key stress triggers, and custom coping strategies.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !journalText.trim()}
                  className="py-3 px-6 bg-gradient-to-r from-indigo-650 to-violet-650 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Stress Triggers...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4.5 h-4.5" />
                      Log Mood & Analyze with Gemini
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* CARD: STRESS & EMOTIONAL INSIGHTS */}
            {lastEntry ? (
              <section className="glass-card rounded-3xl p-6 border-indigo-500/20 shadow-2xl animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5.5 h-5.5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-slate-100 font-display">Gemini Stress & Coping Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Anxiety Badge & Triggers */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Anxiety Level</span>
                      <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        lastEntry.analysis.anxietyLevel === 'Low' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800' :
                        lastEntry.analysis.anxietyLevel === 'Medium' ? 'bg-yellow-950/40 text-yellow-400 border-yellow-800' :
                        lastEntry.analysis.anxietyLevel === 'High' ? 'bg-orange-950/40 text-orange-400 border-orange-850' :
                        'bg-rose-950/40 text-rose-400 border-rose-850'
                      }`}>
                        {lastEntry.analysis.anxietyLevel}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Detected Triggers</span>
                      <div className="flex flex-wrap gap-2">
                        {lastEntry.analysis.stressors.map((trigger, idx) => (
                          <span 
                            key={idx}
                            className="bg-slate-900 border border-slate-800 text-slate-350 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Coping Strategies list */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Custom Mindful Plan</span>
                    <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
                      {lastEntry.analysis.copingStrategies.map((strategy, idx) => (
                        <li key={idx} className="flex gap-2 p-2 bg-slate-900/50 border border-slate-850 rounded-xl leading-relaxed">
                          <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ) : (
              <div className="p-8 rounded-3xl border border-dashed border-slate-850 text-center bg-slate-950/20 text-slate-500">
                <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <h4 className="text-sm font-semibold">Ready to Analyze Triggers</h4>
                <p className="text-xs text-slate-655 mt-1 leading-relaxed max-w-sm mx-auto">
                  Submit today's journal entry to let Gemini map out stress factors, sleep issues, or competitive preparation triggers.
                </p>
              </div>
            )}

            {/* CARD: MOOD TREND CHART (LAST 7 ENTRIES) */}
            <section className="glass-card rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-5.5 h-5.5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-slate-100 font-display">Mood Trend (Last 7 Entries)</h3>
                </div>
                {entries.length > 0 && (
                  <span className="text-[10px] text-indigo-400 font-semibold px-2 py-0.5 bg-indigo-950/30 border border-indigo-900 rounded-lg">
                    Latest Rating: {entries[entries.length - 1].mood}/10
                  </span>
                )}
              </div>

              {renderSVGChart()}
            </section>

          </div>

          {/* RIGHT SECTION: STREAK BADGE & AI COMPANION (Col 12 to 5 on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* STREAK & BADGES DISPLAY */}
            <section className="glass-card rounded-3xl p-6 border-indigo-500/10 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-5.5 h-5.5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100 font-display">Grit & Streak milestones</h3>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
                <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl text-white shadow-md shadow-orange-950/20">
                  <Flame className="w-7 h-7 fill-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white leading-none">{streak} Days</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Daily journal Streak</div>
                </div>
              </div>

              {/* Dynamic Badge */}
              {activeBadge ? (
                <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${activeBadge.color} animate-fade-in`}>
                  <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
                  <div>
                    <span className="font-semibold block text-[10px] opacity-75 uppercase">Active Badge</span>
                    <span className="font-extrabold">{activeBadge.title}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-slate-600">
                  Log your mood daily to build streaks and unlock Grit badges!
                </div>
              )}
            </section>

            {/* CARD: EMPATHETIC AI COMPANION */}
            <section className="glass-card rounded-3xl p-6 shadow-2xl border-indigo-500/20 flex flex-col h-[520px]">
              <div className="flex justify-between items-center pb-4 border-b border-slate-850">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="p-2 bg-indigo-900/50 rounded-xl text-indigo-300">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Sankalp AI Wellness Guide</h3>
                    <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Empathetic Coach</p>
                  </div>
                </div>
                {chatHistory.length > 0 && (
                  <button 
                    onClick={() => {
                      if (window.confirm('Reset current chat?')) {
                        setChatHistory([]);
                        localStorage.removeItem('wellness_chat_history');
                      }
                    }}
                    className="text-[10px] text-slate-500 hover:text-rose-400 font-semibold uppercase"
                  >
                    Clear Chat
                  </button>
                )}
              </div>

              {/* Chat Message Box */}
              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4">
                {chatHistory.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <Sparkles className="w-10 h-10 mb-3 opacity-30 text-indigo-400 animate-pulse" />
                    <h4 className="text-xs font-bold text-slate-400">Your Empathetic Guide</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed max-w-[200px] mt-1">
                      Log your daily thoughts in the left panel to begin. Sankalp AI will start supporting your exam journey.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === 'user' ? 'self-end' : 'self-start'
                      } animate-fade-in`}
                    >
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-indigo-650 text-white rounded-br-none shadow-md shadow-indigo-950/20' 
                          : msg.isError
                          ? 'bg-rose-950/40 border border-rose-900/60 text-rose-300 rounded-bl-none'
                          : 'bg-slate-900/80 border border-slate-850 text-slate-200 rounded-bl-none shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] text-slate-600 mt-1 font-medium ${
                        msg.sender === 'user' ? 'self-end' : 'self-start'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="self-start max-w-[80%] flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-900/40 border border-slate-850/50 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                    <span>Sankalp AI is typing...</span>
                  </div>
                )}
                <div ref={chatEndRef}></div>
              </div>

              {/* Chat Quick Chips */}
              {chatHistory.length > 0 && !isChatLoading && (
                <div className="pb-3 overflow-x-auto flex gap-1.5 select-none no-scrollbar shrink-0">
                  {SUGGESTION_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(chip.text)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-950/40 border border-slate-850 hover:border-indigo-900/50 text-[10px] font-semibold text-slate-400 hover:text-indigo-300 rounded-full shrink-0 transition-all active:scale-95"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-850 pt-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={chatHistory.length === 0 ? "Log your mood first to activate companion" : "Speak to your wellness companion..."}
                  disabled={chatHistory.length === 0 || isChatLoading}
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 disabled:opacity-40 transition-all"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim() || isChatLoading || chatHistory.length === 0}
                  className="p-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl disabled:opacity-40 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </section>

          </div>

        </div>

        {/* --- History Table Card --- */}
        {entries.length > 0 && (
          <section className="glass-card rounded-3xl p-6 shadow-2xl mt-4">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5.5 h-5.5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100 font-display">Mindfulness logs</h3>
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 px-4">Prep Exam</th>
                    <th className="pb-3 px-4 text-center">Mood Rating</th>
                    <th className="pb-3 px-4">Anxiety Status</th>
                    <th className="pb-3 px-4 max-w-sm">Logged Entry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/80 text-slate-350">
                  {[...entries].reverse().map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-900/35 transition-all">
                      <td className="py-3.5 pr-4 whitespace-nowrap text-slate-400 font-medium">
                        {new Date(entry.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-400">
                        {entry.exam}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-sm text-slate-100">{entry.mood}</span>
                        <span className="text-slate-500">/10</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border uppercase ${
                          entry.analysis.anxietyLevel === 'Low' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/60' :
                          entry.analysis.anxietyLevel === 'Medium' ? 'bg-yellow-950/20 text-yellow-400 border-yellow-900/60' :
                          entry.analysis.anxietyLevel === 'High' ? 'bg-orange-950/20 text-orange-400 border-orange-850/60' :
                          'bg-rose-950/20 text-rose-400 border-rose-850/60'
                        }`}>
                          {entry.analysis.anxietyLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm truncate text-slate-300" title={entry.journal}>
                        {entry.journal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-slate-900/80 py-6 text-center text-slate-650 bg-slate-950 text-xs">
        <p className="font-semibold text-slate-500">
          Sankalp AI Student Mental Wellness Tracker
        </p>
        <p className="text-slate-600 mt-1">
          Powered by Gemini 1.5 Flash. Encouraging mental health for India's competitive exam aspirants.
        </p>
      </footer>

    </div>
  );
}
