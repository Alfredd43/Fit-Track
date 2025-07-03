# 🌈 BuddyBliss

Your all-in-one wellness companion: track food, water, workouts, and chat with AI—all in a beautiful, modern app.

---

## 🚀 What is BuddyBliss?
A playful, full-stack wellness tracker for real people. Log your meals, hydration, and exercise. See your progress. Get motivation and tips from AI. All in a slick, responsive UI.

---

## ✨ Features
- **Dashboard:** See your daily stats, streaks, and motivational banners
- **Food Log:** Track what you eat, calories, and macros
- **Water Log:** Stay hydrated, visualize your daily intake
- **Exercise Log:** Record workouts, duration, intensity, calories burnt
- **AI Chat:** Get wellness tips, encouragement, and answers from AI
- **Authentication:** Register/login with secure token-based auth
- **Responsive UI:** React + TypeScript + Tailwind + shadcn/ui
- **Backend:** Flask API with SQLite (local) or AWS RDS (production)

---

## 🛠️ Tech Stack
| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Backend     | Flask (Python), SQLAlchemy, Flask-CORS        |
| Frontend    | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Database    | SQLite (local dev) or AWS RDS (production)    |
| AI/LLM      | OpenAI, Cohere, Google Generative AI          |
| Auth        | Token-based (in-memory, localStorage on FE)   |

---

## 📁 Project Structure
```
buddybliss/
├── app.py                # Flask backend API
├── requirements.txt      # Python backend dependencies
├── src/
│   ├── App.tsx           # Main React app
│   ├── pages/            # FoodLog, WaterLog, ExerciseLog, Exercises, etc.
│   ├── components/       # Navigation, ChatInterface, WellnessStats, etc.
│   └── ...               # UI primitives, hooks, assets
├── public/               # Static assets
├── instance/site.db      # SQLite database
├── package.json          # Frontend dependencies/scripts
├── tailwind.config.ts    # Tailwind CSS config
├── vite.config.ts        # Vite config
└── README.md             # This file
```

---

## ⚡ Getting Started

### Backend (Flask)
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python app.py
```

### Frontend (Vite + React)
```bash
npm install
npm run dev
```

---

## 🔑 Environment Variables
Create a `.env` file in the root with:
```
COHERE_API_KEY=your-cohere-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_API_KEY=your-google-api-key
AWS_RDS_URI=your-aws-rds-uri  # (optional, for production)
```

---

## 🧩 Notable Components
- `ChatInterface`: AI-powered chat for wellness tips
- `WellnessStats`: Dashboard for streaks, calories, water, etc.
- `MotivationalBanner`: Rotating motivational messages
- `Navigation`: Main app navigation
- `ui/`: Modern, accessible UI primitives (shadcn/ui)

---

## 🗺️ Main Pages
- `/` – Dashboard (overview, quick log, stats)
- `/food` – Food journal
- `/water` – Water intake tracker
- `/exercise` – Exercise journal
- `/exercises` – Browse exercises by muscle group
- `/login`, `/register` – Auth

---

## 📄 License
MIT

---

> Made with joy, color, and a little AI magic ✨