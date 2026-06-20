# Sankalp AI - Student Mental Wellness Tracker

Sankalp AI is a full-stack mental wellness application tailored specifically for Indian competitive exam aspirants preparing for **JEE, NEET, UPSC, GATE, CAT, and CUET**. 

It allows students to log their daily mood, write journal entries expressing study pressures, receive structured Gemini AI emotional insights (stress triggers and coping plans), track streaks, view progress, and converse with an empathetic AI guide.

---

## ✨ Features

- **Daily Mood Logger**: Scale (1-10) selector with descriptive emojis matching various stress states (e.g. Overwhelmed, Exhausted, Focused, Calm).
- **Gemini AI Stress Trigger Analysis**: Analyzes student journals to detect anxiety levels, categorizes stress factors (e.g., backlog pileups, mock test scores, parental expectations), and generates custom study-mindfulness plans.
- **Empathetic Companion Chat**: Converse in real time with an AI guide tailored to the specific exam context. Supports quick suggestion chips (e.g., "how to deal with mock test drops", "syllabus backlog management").
- **SVG Mood Trend Visualization**: Beautiful custom SVG line chart displaying mood changes over the last 7 entries (rendered purely in React with no external chart packages).
- **Streak & Milestones Tracker**: Tracks consecutive days of journaling, unlocking motivational badges (e.g., "7-Day Concentration Warrior").
- **LocalStorage Data Resilience**: Preserves journal logs, streak values, active exam types, and chat logs inside the browser's `localStorage` (perfect data safety without database overhead).

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite template), Tailwind CSS v3, PostCSS, Lucide-react (icons).
- **Backend**: Node.js, Express, Cors, Dotenv, Google Gen AI SDK (`@google/generative-ai` with Gemini 1.5 Flash).

---

## 📁 Directory Structure

```
prompt_wars/
├── package.json         # Workspace package config (running client/server concurrently)
├── .gitignore           # Global git ignore configurations
├── client/              # React Frontend Project
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── src/
│   │   ├── App.jsx      # Core UI Container
│   │   ├── index.css    # Tailwind entry point + custom styles
│   │   └── main.jsx
│   └── package.json
└── server/              # Express Backend Project
    ├── server.js        # Express server and Gemini integration
    ├── .env             # Active environment variables (git-ignored)
    ├── .env.example     # Environment template
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed (v18 or higher recommended).
- A **Gemini API Key**. Get one from [Google AI Studio](https://aistudio.google.com/).

### 2. Install Dependencies
From the root workspace directory, run:
```bash
# Installs root, client, and server dependencies in one command
npm run install-all
```
*(Alternatively, you can run `npm install` inside both the `client/` and `server/` folders manually).*

### 3. Configure API Keys
Go to the `server/` directory:
1. Rename/Copy `.env.example` to `.env`.
2. Insert your active API key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
> 🔒 **Security Notice:** The Gemini API key remains strictly on the server-side environment. The client app contains zero API key configuration and communicates exclusively via the server proxy endpoint.

### 4. Run Development Servers
Start both servers concurrently from the root directory:
```bash
npm run dev
```
- **Backend Server**: Launches on `http://localhost:5000`
- **React Frontend**: Launches on `http://localhost:5173`

---

## 🔒 Data Privacy & Reset
Your journal data is stored locally in your browser cache via `localStorage` and never sent to any database.
To clear all logged journal entries, streak milestones, and chat logs, click the **Trash Icon** in the top right corner of the navbar.
