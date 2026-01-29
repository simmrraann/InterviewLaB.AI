# InterviewLaB.AI 🎙️🤖

**Master Technical Interviews Through Voice & Logic.**

InterviewLaB.AI is a high-fidelity AI-powered voice interview coach designed to help engineering students bridge the gap between "knowing the answer" and "explaining the logic." Built by an AI & DS Engineering student, this platform focuses on real-time communication evaluation for technical roles.

## 🚀 The Vision
Most interview tools focus on coding syntax. **InterviewLaB.AI** focuses on the **communication of logic**. In a real-world interview, how you explain your thought process is just as important as the final solution. This tool ensures you are ready for the high-pressure environment of technical screenings.

## ✨ Key Features
- **Real-Time Voice Interaction:** Engage in a seamless 5-minute technical interview powered by Nimrobo Voice AI.
- **AI Logic Analysis:** After each session, the AI evaluates your transcript to identify specific strengths and weaknesses.
- **Performance Radar Chart:** A visual data-driven breakdown of your performance across Logic, Confidence, Clarity, and Communication.
- **Interview Journey Tracking:** A persistent history of your sessions stored in Supabase to track your improvement over time.
- **PDF Feedback Reports:** Download a detailed summary of your session for offline review.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Shadcn UI.
- **Backend/Database:** Supabase (PostgreSQL & Auth).
- **AI Engine:** Nimrobo Voice AI & LLM-based Transcript Analysis.
- **Data Visualization:** Recharts (Radar Charts).

## 📂 Project Structure
```text
src/
├── components/     # UI components (Header, VoiceAgent, Radar Charts)
├── pages/          # Application views (Home, History, Feedback)
├── services/       # Supabase and Analysis logic
├── hooks/          # Custom React hooks (Session Timers)
└── lib/            # Utility functions