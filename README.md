# ✈️ ProfilePilot

AI-powered LinkedIn profile analyzer that scores, roasts, and rewrites your profile instantly.

## ✨ Features
- 📊 Profile score out of 100 with animated ring
- 🔥 Honest roast of your profile weaknesses
- ✅ Strengths and weaknesses breakdown
- ✨ AI-rewritten headline and about section
- 🎯 Prioritized action plan
- 🌙 Stunning dark glassmorphism UI

## 🛠️ Tech Stack
- **Frontend:** React + Vite + CSS animations
- **Backend:** Python + FastAPI
- **AI:** Groq API (LLaMA 3.3 70B)

## ⚙️ Setup

### Backend
```bash
cd backend
pip install fastapi uvicorn groq python-dotenv
echo "GROQ_API_KEY=your_key" > .env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173
