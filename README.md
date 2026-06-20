# 🧘 Sankalp AI — Student Mental Wellness Tracker

Sankalp AI is a full-stack mental wellness application built specifically for Indian competitive exam aspirants preparing for **JEE, NEET, UPSC, GATE, CAT, and CUET**.

Students simply **write their thoughts freely** — the AI reads between the lines, auto-detects their real mood (1-10), identifies hidden stress triggers, generates a custom mindfulness plan, and opens a warm companion chat. No manual mood sliders needed.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🧠 AI Auto-Mood Detection** | No manual mood selector — Groq AI reads the journal text and assigns a mood score (1-10) with a descriptive label (e.g. "Overwhelmed", "Focused", "Calm") |
| **📊 Stress Trigger Analysis** | Detects up to 3 specific stressors (mock test anxiety, sleep deprivation, parental pressure, syllabus backlog, etc.) using Llama 3.3 |
| **💡 Custom Coping Strategies** | Generates 2-3 actionable mindfulness plans tailored to the student's specific exam (JEE physics stress → Pomodoro for numericals, UPSC → answer writing breaks) |
| **💬 Empathetic AI Companion** | Real-time chat with an AI mentor who speaks like a friendly Indian counselor — understands coaching pressure, Kota stress, and family expectations |
| **🔥 Streak & Badge System** | Tracks consecutive journaling days with milestone badges (3-Day Streak → 7-Day Warrior → Zen Master) |
| **📈 SVG Mood Trend Chart** | Pure React SVG line chart showing AI-detected mood changes over the last 7 entries |
| **🪷 Animated Lotus-Brain Logo** | Custom SVG logo combining lotus petals (Indian wellness symbol) + brain-wave pulses with breathing animations |
| **💾 localStorage Persistence** | All data persists in the browser — no database needed, no data leaves the device |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 (Vite), Tailwind CSS v3, PostCSS, Lucide-react icons |
| **Backend** | Node.js, Express, CORS, dotenv |
| **AI Model** | Groq SDK → `llama-3.3-70b-versatile` (Llama 3.3 70B) |
| **Deployment** | Express serves the built React app as static files |

---

## 📁 Directory Structure

```
prompt_wars/
├── package.json            # Workspace config (concurrent dev servers)
├── .gitignore              # Git ignore (includes .env)
├── README.md               # This file
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.jsx         # Core UI — journal, auto-mood reveal, chat, charts
│   │   ├── index.css       # Tailwind entry + glassmorphism + custom animations
│   │   └── main.jsx        # React DOM mount
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── vite.config.js
│   └── package.json
└── server/                 # Express Backend
    ├── server.js           # API proxy + Groq integration + static file serving
    ├── .env                # GROQ_API_KEY (git-ignored)
    ├── .env.example        # Template for environment variables
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- A **Groq API Key** — get one free at [console.groq.com](https://console.groq.com/)

### 1. Install Dependencies
```bash
# From root directory — installs both client and server dependencies
npm run install-all
```

### 2. Configure API Key
```bash
cd server
cp .env.example .env
```
Edit `server/.env`:
```env
PORT=5000
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

> 🔒 **Security**: The API key stays strictly on the server. The frontend has **zero** API key configuration — it only calls `/api/chat` on the Express proxy.

### 3. Run in Development Mode
```bash
# From root — starts both Vite dev server + Express concurrently
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`

### 4. Build & Deploy (Production)
```bash
# Build the React client
cd client
npm run build

# Start the Express server (serves built React app + API)
cd ../server
node server.js
```
The Express server serves the built React app from `client/dist/` and handles API requests — everything runs on a single port (`http://localhost:5000`).

---

## 🔄 Changelog — What Changed in the Deployed Version

### v2.0 — Auto-Mood Detection + Creative Redesign

#### 🧠 AI Auto-Mood Detection (New Core Feature)
- **Removed** the manual emoji grid / mood scale slider entirely
- Students now just **write freely** in the journal textarea
- Groq AI (Llama 3.3) reads the text and **auto-assigns**:
  - `moodScore` (1-10) — based on emotional tone, burnout markers, sleep cues
  - `moodLabel` — descriptive label like "Overwhelmed", "Focused", "Unstoppable"
- The detected mood is revealed in a color-coded banner after analysis
- This removes friction and produces **more honest, objective** mood scores

#### 🪷 Custom Animated SVG Logo
- Replaced the generic Lucide `Brain` icon with a **custom lotus-brain SVG**
- The logo combines:
  - **Lotus petals** (3 directions) with breathing opacity animations
  - **Brain-wave pulse lines** across the center with shimmer effects
  - A **pulsing indigo core** representing mindfulness
  - A **rotating dashed orbit ring** for dynamism
- Used throughout: navbar, empty states, submit button, footer

#### 🚀 Production Deployment Support
- Added **static file serving** to Express server (`server.js`)
- Express now serves the built React app from `../client/dist/`
- Catch-all `*` route serves `index.html` for client-side routing
- **Single port deployment** — both API and frontend run on port 5000

### v1.5 — Groq Migration
- Migrated from Gemini API to **Groq SDK** with `llama-3.3-70b-versatile`
- Updated all frontend strings from "Gemini" to "Groq AI"
- Added JSON response format enforcement for reliable structured output

### v1.0 — Initial Release
- Daily mood logger with 10-point emoji scale
- Journal entry with Gemini AI stress analysis
- Companion chat with exam-specific empathy
- Streak tracking with milestone badges
- SVG mood trend chart (last 7 entries)
- localStorage persistence for all data
- Dark glassmorphism UI with Tailwind CSS

---

## 🔒 Data Privacy & Reset

Your journal data is stored **locally in your browser** via `localStorage` and is never sent to any external database. The only external call is to the Groq API for AI analysis (via your own server proxy).

To clear all data: click the **🗑️ Trash icon** in the top-right corner of the navbar.

---

## 📐 Architecture

```
┌──────────────┐     POST /api/chat     ┌──────────────┐     Groq SDK     ┌───────────┐
│  React App   │ ──────────────────────► │  Express     │ ───────────────► │  Groq API │
│  (Vite)      │ ◄────────────────────── │  Server      │ ◄─────────────── │  Llama3.3 │
│              │     JSON response       │              │   JSON response  │           │
│  localStorage│                         │  .env has    │                  │  70B      │
│  (persist)   │                         │  GROQ_API_KEY│                  │           │
└──────────────┘                         └──────────────┘                  └───────────┘
       │                                        │
       │  Mood, journal, chat logs               │  Static files (production)
       │  stored in browser only                 │  from client/dist/
       ▼                                        ▼
  User's Browser                          Single Port :5000
```

---

*Built with ❤️ for India's competitive exam warriors. Take care of your mind — the ranks will follow.*
