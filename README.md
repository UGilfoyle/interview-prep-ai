# 🚀 InterviewPrep AI | Multi-Track Technical Interview Studio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-3.6%20%7C%203.7%20Flash-4285F4?logo=google)
![Ant Design](https://img.shields.io/badge/Ant%20Design-Icons%20%26%20Tokens-0170FE?logo=antdesign)
![Neon Postgres](https://img.shields.io/badge/Neon-Serverless%20Postgres-00E599?logo=postgresql)
![pnpm](https://img.shields.io/badge/Package%20Manager-pnpm-F69220?logo=pnpm)
![License](https://img.shields.io/badge/License-MIT-green)

An enterprise-grade, AI-powered tech interview prep studio built with **React**, **Ant Design**, **Google Gemini API**, **Web Speech API**, and **Neon Serverless Postgres**.

Practice company-tailored interview loops for **Product Managers (PM)**, **Software Engineers (SWE)**, and **Scrum Masters / Agile Coaches** with real-time voice speech-to-text, 1-click industry framework templates, and calibrated bar-raiser rubric evaluations.

---

## 🌟 Key Highlights

- **🎯 3 Dedicated Role Tracks**:
  - **Product Manager (PM)**: Product Design (CIRCLES), Metrics (North Star / Root Cause), TAM Market Sizing, Prioritization (RICE), and Behavioral (STAR).
  - **Software Engineer (SWE)**: Distributed System Design, Algorithms & DS, Production Debugging & Incident Triage, REST/gRPC API & Database Architecture, and Engineering Leadership.
  - **Scrum Master / Agile Coach**: Ceremony Facilitation (5-Stage Retrospectives), Impediment Resolution (5 Whys), Flow Metrics & CFD Analysis, Team Coaching (GROW model), and Scaled Agile.
- **🎙️ Voice Speech-to-Text & TTS**:
  - Speak your answers naturally using the browser's built-in **Web Speech API** (`webkitSpeechRecognition`).
  - Listen to the interviewer speak questions and feedback via Text-to-Speech (`speechSynthesis`).
- **📋 1-Click Framework Scratchpad Templates**:
  - Instantly inject industry-standard frameworks (e.g. *System Design 5-Step*, *CIRCLES Method*, *5-Stage Retrospective*, *RICE Matrix*, *GROW Coaching*) directly into your answer.
- **💬 Interactive Clarifying Q&A**:
  - Ask the interviewer clarifying questions to narrow scope, confirm assumptions, or check traffic scale before answering.
- **📊 Bar-Raiser Rubric Scoring**:
  - Quantitative 10-point scoring and hiring verdict (*Strong Hire*, *Hire*, *Lean Hire*, *Lean No Hire*, *No Hire*).
  - **What Was Strong**: Bulleted strengths.
  - **What Was Missing**: Omissions, edge cases, failure modes, and unstated assumptions.
  - **High-Impact Coaching Tip**: 1 actionable takeaway to elevate candidate leveling.
  - **Gold-Standard Model Answer**: Benchmark reference answer.
  - **5-Pillar Rubric Breakdown**: Dimension-by-dimension scores with visual progress bars.
- **🐘 Neon Serverless Postgres Authentication & Sync**:
  - Secure user accounts and cloud storage powered by **Neon Serverless Postgres** (`@neondatabase/serverless`).
  - Sync scorecards, practice history, and question records seamlessly across devices with offline fallback.
- **💎 Ant Design UI/UX**:
  - Clean, professional design system with `@ant-design/icons`, clean typography, white background theme, and responsive mobile layout.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite, Vanilla CSS Design System |
| **Iconography & UI** | Ant Design (`@ant-design/icons`, `antd`), Canvas Confetti |
| **AI Intelligence** | Google Gemini API (`gemini-3.6-flash`, `gemini-flash-latest`, `gemini-3.7-flash`) |
| **Voice / Audio** | Web Speech API (`SpeechRecognition`, `speechSynthesis`) |
| **Backend / API** | Vercel Serverless Functions (`/api`), Node.js, JWT, bcryptjs |
| **Cloud Database** | [Neon Serverless Postgres](https://neon.tech) (`@neondatabase/serverless`) |
| **Package Manager** | `pnpm` (v10+) |
| **Deployment** | [Vercel](https://vercel.com) with automatic API routing |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm**: v9.0.0 or higher (`npm install -g pnpm` or `corepack enable pnpm`)
- **Google Gemini API Key**: [Get a Gemini API Key](https://aistudio.google.com/)

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/UGilfoyle/interview-prep-ai.git
cd interview-prep-ai
pnpm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your keys:
```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# (Optional) Neon Postgres Connection for Cloud Auth & Sync
DATABASE_URL=postgresql://neondb_owner:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require

# JWT Secret for Session Authentication
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Run Development Server
```bash
pnpm dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🐘 Neon Serverless Postgres Setup

1. Create a free account at **[neon.tech](https://neon.tech)** and create a new Postgres database project.
2. In your Neon dashboard, copy the **Connection string** (choose `Node.js` or `Pooled connection`).
3. Set the connection string in your `.env` or Vercel Environment Variables as `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://user:password@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Tables (`users`, `interview_sessions`) and indexes are **automatically created** on the first request via `api/db.js`. No manual migration scripts needed!

---

## 🚢 Deploy to Vercel

### Option 1: Vercel CLI
```bash
# Install Vercel CLI if needed
pnpm add -g vercel

# Deploy directly
vercel
```

### Option 2: Deploy from GitHub Dashboard
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete interview prep ai studio with multi-track and neon auth"
   git push origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your GitHub repository.
3. In **Project Settings ➔ Environment Variables**, add:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API Key.
   - `DATABASE_URL`: Your Neon Postgres connection URL.
   - `JWT_SECRET`: Any random 32+ character string for token signing.
4. Click **Deploy**. Vercel will build with `pnpm` and host both the Vite SPA and `/api` serverless functions.

---

## 🔒 Security & Privacy

- **Zero Hardcoded Secrets**: All API keys and connection strings are strictly managed through environment variables and local browser storage.
- **Git Ignore**: `.env`, `.env.local`, and build artifacts are strictly excluded by `.gitignore`.
- **Password Security**: User passwords in Neon Postgres are hashed using `bcryptjs` with salt rounds.
- **Client Direct Mode**: Users can also input their own Gemini API keys directly in the UI, stored safely in client `localStorage`.

---

## 📚 Supported Frameworks Cheatsheet

### 🚀 Product Management
- **CIRCLES Method**: Comprehend, Identify, Report, Cut, List, Evaluate, Summarize.
- **STAR Method**: Situation, Task, Action, Result.
- **Root Cause Diagnostic**: External macro, Internal deployments, Cohort segmentation, Triage.
- **Top-Down & Bottom-Up Sizing**: Addressable market and unit economic arithmetic.
- **RICE Prioritization**: Reach, Impact, Confidence, Effort.

### 💻 Software Engineering
- **System Design 5-Step Architecture**: Requirements, Capacity estimations, High-level architecture, Data model & API, Resiliency & CAP trade-offs.
- **Algorithm & DS Optimization**: Constraints, Brute force baseline, Optimal data structures, Implementation outline, Complexity verification.
- **Production Debugging & Refactoring**: Triage, Hypotheses formulation, Observability flamegraphs, Root cause fix, Long-term hardening.
- **REST / gRPC API & DB Design**: Resource modeling, Idempotency keys, Status contracts, Index strategies.
- **STAR for Engineering Leadership**: Technical trade-offs, architecture RFC consensus, post-mortems.

### 🏃 Scrum Master & Agile
- **5-Stage Retrospective Framework** (Derby & Larsen): Set stage, Gather data, Generate insights, Decide action items, Close.
- **5 Whys Impediment Removal**: Peeling symptom layers to institutional root cause and Definition of Ready (DoR).
- **Flow Metrics & Continuous Delivery**: Cycle time, Lead time, CFD analysis, WIP limits.
- **GROW Coaching Model**: Goal, Reality, Options, Will/Way forward.
- **STAR for Servant Leaders**: Psychological safety, team predictability, cross-team dependency unblocking.

---

## 📄 License

This project is licensed under the **MIT License**.
