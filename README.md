# 🚀 InterviewPrep AI | Multi-Track Technical Interview Studio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-3.6%20%7C%203.7%20Flash-4285F4?logo=google)
![Ant Design](https://img.shields.io/badge/Ant%20Design-Icons%20%26%20Tokens-0170FE?logo=antdesign)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E?logo=supabase)
![Neon Postgres](https://img.shields.io/badge/Neon-Serverless%20Postgres-00E599?logo=postgresql)
![Resend](https://img.shields.io/badge/Resend-Transactional%20Email-000000?logo=resend)
![pnpm](https://img.shields.io/badge/Package%20Manager-pnpm-F69220?logo=pnpm)
![License](https://img.shields.io/badge/License-MIT-green)

An enterprise-grade, AI-powered tech interview prep studio built with **React**, **Ant Design**, **Google Gemini API**, **Web Speech API**, **Supabase**, and **Neon Serverless Postgres**.

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
- **🔐 Multi-Engine Cloud Auth & Data Sync**:
  - **Primary**: [Supabase](https://supabase.com) Auth & Database with 0-domain email OTP delivery (50,000 users free).
  - **Backup Dual-Sync**: [Neon Serverless Postgres](https://neon.tech) (`@neondatabase/serverless`) for backup cloud persistence.
  - 1-Click **GitHub**, **LinkedIn**, **Email OTP**, and **Direct Password** logins.
- **⭐ User Experience Feedback System**:
  - Built-in floating feedback widget with 1–5 star rating, category categorization, and database + email notifications.
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
| **Primary Auth & DB** | [Supabase](https://supabase.com) (`@supabase/supabase-js`) |
| **Backup Cloud DB** | [Neon Serverless Postgres](https://neon.tech) (`@neondatabase/serverless`) |
| **Transactional Email**| [Resend](https://resend.com) & Supabase Auth |
| **Backend / API** | Vercel Serverless Functions (`/api`), Node.js, JWT, bcryptjs |
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

# Supabase Auth & Cloud Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# (Optional) Neon Postgres Backup Database
DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require

# JWT Secret for Session Authentication
JWT_SECRET=your_jwt_secret_key_here

# (Optional) Resend Transactional Email Key
RESEND_API_KEY=re_your_resend_api_key_here
```

### 4. Run Development Server
```bash
pnpm dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🚢 Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "feat: complete multi-track interview prep ai"
git push origin main

# Deploy to Vercel Production
npx vercel --prod
```

---

## 🔒 Security & Privacy

- **Zero Hardcoded Secrets**: All API keys and connection strings are strictly managed through environment variables and local browser storage.
- **Git Ignore**: `.env`, `.env.local`, and build artifacts are strictly excluded by `.gitignore`.
- **Password Security**: Passwords are encrypted using `bcryptjs` with salt rounds.
- **Client Direct Mode**: Users can also input their own Gemini API keys directly in the UI, stored safely in client `localStorage`.

---

## 📄 License

This project is licensed under the **MIT License**.
