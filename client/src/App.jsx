import React, { useState, useEffect, useRef } from 'react';
import {
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
  Trash2,
  RefreshCw,
} from 'lucide-react';

// ─── Custom Animated Logo SVG Component ─────────────────────────────────────
// A lotus flower merged with brain-wave pulses — symbolizes Indian wellness + mind
const SankalpLogo = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer glow circle */}
    <circle cx="24" cy="24" r="22" stroke="url(#logoGrad)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="20s" repeatCount="indefinite" />
    </circle>
    {/* Lotus petals — left */}
    <path d="M24 28C20 24 14 22 10 26C14 30 20 30 24 28Z" fill="url(#petalLeft)" opacity="0.85">
      <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite" />
    </path>
    {/* Lotus petals — right */}
    <path d="M24 28C28 24 34 22 38 26C34 30 28 30 24 28Z" fill="url(#petalRight)" opacity="0.85">
      <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite" begin="0.5s" />
    </path>
    {/* Center petal — top */}
    <path d="M24 28C22 22 20 14 24 10C28 14 26 22 24 28Z" fill="url(#petalTop)" opacity="0.9">
      <animate attributeName="opacity" values="0.9;1;0.9" dur="2.5s" repeatCount="indefinite" begin="0.25s" />
    </path>
    {/* Inner mind pulse dot */}
    <circle cx="24" cy="24" r="3.5" fill="#818cf8">
      <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Brain wave line — left */}
    <path d="M12 24C14 21 16 27 18 23C20 19 22 25 24 24" stroke="#a5b4fc" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6">
      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
    </path>
    {/* Brain wave line — right */}
    <path d="M24 24C26 23 28 19 30 23C32 27 34 21 36 24" stroke="#c4b5fd" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6">
      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="1s" />
    </path>
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
      <linearGradient id="petalLeft" x1="10" y1="24" x2="24" y2="28">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
      <linearGradient id="petalRight" x1="38" y1="24" x2="24" y2="28">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
      <linearGradient id="petalTop" x1="24" y1="10" x2="24" y2="28">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Exam Configuration ─────────────────────────────────────────────────────
const EXAMS = [
  { id: 'JEE', name: 'JEE', longName: 'Joint Entrance Examination', desc: 'Engineering (IIT/NIT)', motto: 'Focus & Solve' },
  { id: 'NEET', name: 'NEET', longName: 'National Eligibility cum Entrance Test', desc: 'Medical (AIIMS/Govt)', motto: 'Diligence & Accuracy' },
  { id: 'UPSC', name: 'UPSC', longName: 'Civil Services Examination', desc: 'IAS / IPS / IFS', motto: 'Consistency & Depth' },
  { id: 'GATE', name: 'GATE', longName: 'Graduate Aptitude Test in Engineering', desc: 'Post-Grad & PSU', motto: 'Concepts & Application' },
  { id: 'CAT', name: 'CAT', longName: 'Common Admission Test', desc: 'Management (IIMs)', motto: 'Strategy & Speed' },
  { id: 'CUET', name: 'CUET', longName: 'Common University Entrance Test', desc: 'UG Admissions', motto: 'Concepts & Speed' }
];

// Emoji mapping for auto-detected mood scores
const MOOD_EMOJIS = {
  1: { emoji: '😢', color: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-700' },
  2: { emoji: '😭', color: 'text-rose-400', bg: 'bg-rose-950/30', border: 'border-rose-800' },
  3: { emoji: '😰', color: 'text-orange-400', bg: 'bg-orange-950/30', border: 'border-orange-700' },
  4: { emoji: '😩', color: 'text-orange-400', bg: 'bg-orange-950/20', border: 'border-orange-800' },
  5: { emoji: '😐', color: 'text-yellow-400', bg: 'bg-yellow-950/30', border: 'border-yellow-700' },
  6: { emoji: '😌', color: 'text-yellow-300', bg: 'bg-yellow-950/20', border: 'border-yellow-800' },
  7: { emoji: '🙂', color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-700' },
  8: { emoji: '😸', color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-800' },
  9: { emoji: '😀', color: 'text-teal-400', bg: 'bg-teal-950/30', border: 'border-teal-700' },
  10: { emoji: '🚀', color: 'text-cyan-400', bg: 'bg-cyan-950/30', border: 'border-cyan-700' },
};

// ─── Main Application ───────────────────────────────────────────────────────
export default function App() {
  // Persistent state via localStorage
  const [entries, setEntries] = useState(() => {
    const s = localStorage.getItem('wellness_entries');
    return s ? JSON.parse(s) : [];
  });
  const [streak, setStreak] = useState(() => {
    const s = localStorage.getItem('wellness_streak');
    return s ? parseInt(s, 10) : 0;
  });
  const [lastLoggedDate, setLastLoggedDate] = useState(() => localStorage.getItem('wellness_last_logged_date') || null);
  const [selectedExam, setSelectedExam] = useState(() => localStorage.getItem('wellness_selected_exam') || 'JEE');
  const [chatHistory, setChatHistory] = useState(() => {
    const s = localStorage.getItem('wellness_chat_history');
    return s ? JSON.parse(s) : [];
  });

  // UI state
  const [journalText, setJournalText] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const chatEndRef = useRef(null);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('wellness_entries', JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem('wellness_streak', streak.toString()); }, [streak]);
  useEffect(() => {
    if (lastLoggedDate) localStorage.setItem('wellness_last_logged_date', lastLoggedDate);
    else localStorage.removeItem('wellness_last_logged_date');
  }, [lastLoggedDate]);
  useEffect(() => { localStorage.setItem('wellness_selected_exam', selectedExam); }, [selectedExam]);
  useEffect(() => { localStorage.setItem('wellness_chat_history', JSON.stringify(chatHistory)); }, [chatHistory]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, isChatLoading]);

  const currentExamInfo = EXAMS.find(e => e.id === selectedExam) || EXAMS[0];

  // ─── Streak Logic ─────────────────────────────────────────────────────────
  const updateStreak = () => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
    if (lastLoggedDate === todayStr) return streak;
    const newStreak = lastLoggedDate === yesterdayStr ? streak + 1 : 1;
    setStreak(newStreak);
    setLastLoggedDate(todayStr);
    return newStreak;
  };

  // ─── Submit Journal (AI auto-detects mood) ────────────────────────────────
  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    if (!journalText.trim()) {
      setErrorMsg('Write your thoughts first — Groq AI will read between the lines and figure out how you are actually feeling.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journal: journalText, exam: selectedExam })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error while analyzing journal.');
      }
      const data = await response.json();
      updateStreak();

      const detectedMood = Math.max(1, Math.min(10, data.moodScore || 5));
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-CA'),
        mood: detectedMood,
        moodLabel: data.moodLabel || 'Neutral',
        journal: journalText,
        exam: selectedExam,
        analysis: data.analysis || { anxietyLevel: 'Medium', stressors: ['General Stress'], copingStrategies: ['Take a deep breath'] }
      };
      setEntries(prev => [...prev, newEntry]);

      const systemMessage = {
        id: `sys-${Date.now()}`,
        sender: 'companion',
        text: data.companionResponse || 'I am here for you. Tell me what is on your mind.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory([systemMessage]);
      setJournalText('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to connect to the wellness backend.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Send Chat Message ────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;
    const userMsgText = chatMessage;
    setChatMessage('');
    setIsChatLoading(true);

    const userMessage = { id: `user-${Date.now()}`, sender: 'user', text: userMsgText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);

    try {
      const apiHistory = updatedHistory.slice(0, -1).map(msg => ({ sender: msg.sender, text: msg.text }));
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsgText, history: apiHistory, exam: selectedExam })
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.error); }
      const data = await response.json();
      setChatHistory(prev => [...prev, { id: `comp-${Date.now()}`, sender: 'companion', text: data.companionResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { id: `err-${Date.now()}`, sender: 'companion', text: '⚠️ Connection issue. Please check the backend server.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isError: true }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Clear all logged history, streaks, and chat logs? This cannot be undone.')) {
      setEntries([]); setStreak(0); setLastLoggedDate(null); setChatHistory([]);
      ['wellness_entries','wellness_streak','wellness_last_logged_date','wellness_chat_history'].forEach(k => localStorage.removeItem(k));
    }
  };

  const SUGGESTION_CHIPS = [
    { text: 'Mock test scores dropped, feeling down.', label: 'Test Stress' },
    { text: 'How do I cope with huge syllabus backlog?', label: 'Backlog Help' },
    { text: 'Guilty of wasting time today, self-doubting.', label: 'Procrastination' },
    { text: 'Parents are expecting high ranks. Pressure is immense.', label: 'Family Pressure' },
  ];

  // ─── SVG Chart ────────────────────────────────────────────────────────────
  const renderSVGChart = () => {
    const W = 500, H = 160, px = 40, py = 25;
    const lastLogs = entries.slice(-7);
    if (lastLogs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
          <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm font-medium">No mood history yet.</p>
          <p className="text-xs text-slate-600">Submit a journal entry to see AI-detected mood trends.</p>
        </div>
      );
    }
    const pts = lastLogs.map((log, i) => {
      const x = lastLogs.length === 1 ? W / 2 : px + (i * (W - px * 2)) / (lastLogs.length - 1);
      const y = H - py - ((log.mood - 1) * (H - py * 2)) / 9;
      return { x, y, mood: log.mood, date: log.date };
    });
    let line = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) line += ` L ${pts[i].x} ${pts[i].y}`;
    const area = `${line} L ${pts[pts.length - 1].x} ${H - py} L ${pts[0].x} ${H - py} Z`;

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[320px] h-44 select-none">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1={px} y1={py} x2={W - px} y2={py} stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
          <line x1={px} y1={H / 2} x2={W - px} y2={H / 2} stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
          <line x1={px} y1={H - py} x2={W - px} y2={H - py} stroke="rgba(255,255,255,0.08)" />
          <text x={px - 10} y={py + 4} fill="#64748b" className="text-[10px] font-semibold" textAnchor="end">10</text>
          <text x={px - 10} y={H / 2 + 4} fill="#64748b" className="text-[10px] font-semibold" textAnchor="end">5</text>
          <text x={px - 10} y={H - py + 4} fill="#64748b" className="text-[10px] font-semibold" textAnchor="end">1</text>
          {pts.length > 1 && <path d={area} fill="url(#chartGlow)" />}
          {pts.length > 1 && <path d={line} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
          {pts.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#020617" stroke="#818cf8" strokeWidth="3.5" />
              <rect x={pt.x - 12} y={pt.y - 25} width="24" height="16" rx="4" fill="#1e1b4b" stroke="#3730a3" strokeWidth="1" />
              <text x={pt.x} y={pt.y - 14} fill="#e0e7ff" className="text-[9px] font-bold" textAnchor="middle">{pt.mood}</text>
              <text x={pt.x} y={H - 6} fill="#64748b" className="text-[9px]" textAnchor="middle">
                {new Date(pt.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const lastMoodEmoji = lastEntry ? (MOOD_EMOJIS[lastEntry.mood] || MOOD_EMOJIS[5]) : null;

  const getStreakBadge = (s) => {
    if (s >= 15) return { title: 'Unyielding Zen Master', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' };
    if (s >= 7) return { title: '7-Day Concentration Warrior', color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800' };
    if (s >= 3) return { title: '3-Day Consistency Streak', color: 'bg-amber-950/60 text-amber-300 border-amber-800' };
    if (s > 0) return { title: 'First Sankalp Log', color: 'bg-slate-900 text-slate-300 border-slate-700' };
    return null;
  };
  const activeBadge = getStreakBadge(streak);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 font-sans">

      {/* ─── NAVBAR ──────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-tr from-indigo-600/20 to-violet-600/20 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-900/20">
              <SankalpLogo className="w-10 h-10" />
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
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-500 font-semibold hidden md:inline">Prep Exam:</span>
              <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="bg-transparent text-indigo-300 focus:outline-none font-bold px-2 py-1 cursor-pointer">
                {EXAMS.map(ex => <option key={ex.id} value={ex.id} className="bg-slate-900 text-slate-100 font-medium">{ex.name} ({ex.desc})</option>)}
              </select>
            </div>
            <button aria-label="Clear all data" onClick={handleResetData} title="Clear all local data" className="p-2 bg-slate-900 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-800 rounded-xl transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN ────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

        {/* Exam Motivation Banner */}
        <div className="p-4 rounded-2xl glass-card border border-indigo-500/10 flex items-center justify-between gap-4 overflow-hidden relative shadow-lg">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-3.5 z-10">
            <span className="p-2 bg-indigo-900/40 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-800/40">{currentExamInfo.id}</span>
            <div>
              <h2 className="text-sm font-bold text-slate-200">Preparing for {currentExamInfo.longName}?</h2>
              <p className="text-xs text-indigo-300/80">"{currentExamInfo.motto}" — Focus on your mind, ranks will follow.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-amber-400 animate-bounce">
            <Flame className="w-5 h-5 fill-amber-500" />
            <div className="text-right">
              <div className="text-[10px] text-amber-500/80 font-bold uppercase leading-none">Streak</div>
              <div className="text-sm font-extrabold leading-none">{streak} Days</div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="flex-1 font-medium">{errorMsg}</div>
            <button aria-label="Dismiss error" onClick={() => setErrorMsg('')} className="hover:text-white font-bold px-1 text-sm">×</button>
          </div>
        )}

        {/* ─── GRID ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 flex flex-col gap-8">

            {/* JOURNAL ENTRY (No manual mood — AI detects it!) */}
            <section className="glass-card rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2.5 mb-5">
                <Smile className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100 font-display">Express Yourself</h3>
                <span className="ml-auto text-[10px] bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded-full font-bold uppercase">AI Auto-Detects Mood</span>
              </div>

              <form onSubmit={handleMoodSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                    How was your day? What's weighing on your mind?
                  </label>
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    rows="5"
                    placeholder="Just write freely... e.g. 'Scored badly in today's mock. Physics felt impossible. Couldn't sleep last night thinking about the syllabus backlog. My roommate got 280 and I barely crossed 100...'"
                    className="w-full bg-slate-900/85 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950 focus:outline-none rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 leading-relaxed resize-none transition-all"
                  />
                  <p className="text-[11px] text-indigo-400/80 mt-2 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
                    Just write honestly. Groq AI will read your words, detect your real mood (1-10), identify stress triggers, and create a personalized wellness plan.
                  </p>
                </div>

                <button aria-label="Analyze and detect mood" type="submit" disabled={isLoading || !journalText.trim()} className="py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-950/30 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]">
                  {isLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Reading your mind...</>
                  ) : (
                    <><SankalpLogo className="w-5 h-5" /> Analyze & Detect Mood</>
                  )}
                </button>
              </form>
            </section>

            {/* AUTO-DETECTED MOOD REVEAL + INSIGHTS */}
            {lastEntry ? (
              <section className="glass-card rounded-3xl p-6 border-indigo-500/20 shadow-2xl animate-fade-in">
                {/* Mood Reveal Banner */}
                <div className={`p-4 rounded-2xl flex items-center gap-4 border mb-6 ${lastMoodEmoji.bg} ${lastMoodEmoji.border}`}>
                  <span className="text-4xl filter drop-shadow-lg">{lastMoodEmoji.emoji}</span>
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI-Detected Mood</div>
                    <div className={`text-xl font-black ${lastMoodEmoji.color}`}>{lastEntry.moodLabel}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-black ${lastMoodEmoji.color}`}>{lastEntry.mood}<span className="text-base text-slate-500">/10</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-slate-100 font-display">Groq AI Stress & Coping Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Anxiety Level</span>
                      <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        lastEntry.analysis.anxietyLevel === 'Low' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800' :
                        lastEntry.analysis.anxietyLevel === 'Medium' ? 'bg-yellow-950/40 text-yellow-400 border-yellow-800' :
                        lastEntry.analysis.anxietyLevel === 'High' ? 'bg-orange-950/40 text-orange-400 border-orange-800' :
                        'bg-rose-950/40 text-rose-400 border-rose-800'
                      }`}>{lastEntry.analysis.anxietyLevel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Detected Triggers</span>
                      <div className="flex flex-wrap gap-2">
                        {lastEntry.analysis.stressors.map((trigger, i) => (
                          <span key={i} className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 text-slate-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Custom Mindful Plan</span>
                    <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
                      {lastEntry.analysis.copingStrategies.map((s, i) => (
                        <li key={i} className="flex gap-2 p-2 bg-slate-900/50 border border-slate-800 rounded-xl leading-relaxed">
                          <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ) : (
              <div className="p-8 rounded-3xl border border-dashed border-slate-800 text-center bg-slate-950/20 text-slate-500">
                <SankalpLogo className="w-14 h-14 mx-auto mb-3 opacity-40" />
                <h4 className="text-sm font-semibold text-slate-400">Ready to Read Your Mind</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-sm mx-auto">
                  Write your thoughts above. Groq AI will detect your real mood, map stress factors, and build a mindfulness plan — no manual rating needed.
                </p>
              </div>
            )}

            {/* MOOD TREND CHART */}
            <section className="glass-card rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-slate-100 font-display">AI-Detected Mood Trend</h3>
                </div>
                {lastEntry && (
                  <span className="text-[10px] text-indigo-400 font-semibold px-2 py-0.5 bg-indigo-950/30 border border-indigo-900 rounded-lg">
                    Latest: {lastEntry.mood}/10 ({lastEntry.moodLabel})
                  </span>
                )}
              </div>
              {renderSVGChart()}
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 flex flex-col gap-8">

            {/* STREAK & BADGES */}
            <section className="glass-card rounded-3xl p-6 border-indigo-500/10 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100 font-display">Grit & Streak Milestones</h3>
              </div>
              <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl text-white shadow-md shadow-orange-950/20">
                  <Flame className="w-7 h-7 fill-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white leading-none">{streak} Days</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Daily Journal Streak</div>
                </div>
              </div>
              {activeBadge ? (
                <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${activeBadge.color} animate-fade-in`}>
                  <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
                  <div>
                    <span className="font-semibold block text-[10px] opacity-75 uppercase">Active Badge</span>
                    <span className="font-extrabold">{activeBadge.title}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-slate-600">Log your thoughts daily to build streaks and unlock Grit badges!</div>
              )}
            </section>

            {/* AI COMPANION CHAT */}
            <section className="glass-card rounded-3xl p-6 shadow-2xl border-indigo-500/20 flex flex-col h-[520px]">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="p-2 bg-indigo-900/50 rounded-xl text-indigo-300"><MessageSquare className="w-5 h-5" /></div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Sankalp AI Wellness Guide</h3>
                    <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Empathetic Coach</p>
                  </div>
                </div>
                {chatHistory.length > 0 && (
                  <button aria-label="Clear chat" onClick={() => { if (window.confirm('Reset chat?')) { setChatHistory([]); localStorage.removeItem('wellness_chat_history'); } }} className="text-[10px] text-slate-500 hover:text-rose-400 font-semibold uppercase">Clear</button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4">
                {chatHistory.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <SankalpLogo className="w-14 h-14 mb-3 opacity-40" />
                    <h4 className="text-xs font-bold text-slate-400">Your Empathetic Guide</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed max-w-[200px] mt-1">Write your thoughts in the journal. Sankalp AI will start your wellness conversation.</p>
                  </div>
                ) : (
                  chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end' : 'self-start'} animate-fade-in`}>
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-950/20' : msg.isError ? 'bg-rose-950/40 border border-rose-900/60 text-rose-300 rounded-bl-none' : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'}`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] text-slate-600 mt-1 font-medium ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>{msg.timestamp}</span>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="self-start max-w-[80%] flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-900/40 border border-slate-800/50 rounded-2xl rounded-bl-none">
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

              {chatHistory.length > 0 && !isChatLoading && (
                <div className="pb-3 overflow-x-auto flex gap-1.5 select-none shrink-0">
                  {SUGGESTION_CHIPS.map((chip, i) => (
                    <button key={i} onClick={() => setChatMessage(chip.text)} className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-900/50 text-[10px] font-semibold text-slate-400 hover:text-indigo-300 rounded-full shrink-0 transition-all active:scale-95">{chip.label}</button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-800 pt-3">
                <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder={chatHistory.length === 0 ? "Write a journal first..." : "Talk to your wellness guide..."} disabled={chatHistory.length === 0 || isChatLoading} className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 disabled:opacity-40 transition-all" />
                <button aria-label="Send a message to your wellness guide" type="submit" disabled={!chatMessage.trim() || isChatLoading || chatHistory.length === 0} className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-40 transition-all active:scale-95"><Send className="w-4 h-4" /></button>
              </form>
            </section>
          </div>
        </div>

        {/* HISTORY TABLE */}
        {entries.length > 0 && (
          <section className="glass-card rounded-3xl p-6 shadow-2xl mt-4">
            <div className="flex items-center gap-2.5 mb-5">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-100 font-display">Mindfulness Logs</h3>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 px-4">Exam</th>
                    <th className="pb-3 px-4 text-center">AI Mood</th>
                    <th className="pb-3 px-4">Anxiety</th>
                    <th className="pb-3 px-4 max-w-sm">Entry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {[...entries].reverse().map((entry) => {
                    const em = MOOD_EMOJIS[entry.mood] || MOOD_EMOJIS[5];
                    return (
                      <tr key={entry.id} className="hover:bg-slate-900/35 transition-all">
                        <td className="py-3.5 pr-4 whitespace-nowrap text-slate-400 font-medium">{new Date(entry.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="py-3.5 px-4 font-bold text-indigo-400">{entry.exam}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="mr-1">{em.emoji}</span>
                          <span className="font-extrabold text-sm text-slate-100">{entry.mood}</span>
                          <span className="text-slate-500">/10</span>
                          <div className={`text-[9px] font-semibold ${em.color}`}>{entry.moodLabel}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border uppercase ${
                            entry.analysis.anxietyLevel === 'Low' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/60' :
                            entry.analysis.anxietyLevel === 'Medium' ? 'bg-yellow-950/20 text-yellow-400 border-yellow-900/60' :
                            entry.analysis.anxietyLevel === 'High' ? 'bg-orange-950/20 text-orange-400 border-orange-800/60' :
                            'bg-rose-950/20 text-rose-400 border-rose-800/60'
                          }`}>{entry.analysis.anxietyLevel}</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-sm truncate" title={entry.journal}>{entry.journal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900/80 py-6 text-center bg-slate-950 text-xs">
        <div className="flex items-center justify-center gap-2 mb-1">
          <SankalpLogo className="w-5 h-5" />
          <p className="font-semibold text-slate-500">Sankalp AI Student Mental Wellness Tracker</p>
        </div>
        <p className="text-slate-600">Powered by Groq Llama 3.3. Encouraging mental health for India's competitive exam aspirants.</p>
      </footer>
    </div>
  );
}
