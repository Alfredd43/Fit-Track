# 🍼 Bab Buddy Bliss

A wellness and fitness tracker for nutrition, hydration, and exercise, with a modern UI and AI-powered chat.

---

## ✨ Features

- **Food Logging:** Track what you eat, calories, and macros.
- **Water Tracking:** Log water intake, visualize daily hydration progress.
- **Exercise Logging:** Record workouts, duration, intensity, and calories burnt.
- **Wellness Dashboard:** See daily stats, streaks, and motivational banners.
- **AI Chat:** Get wellness tips and encouragement via integrated AI chat.
- **Authentication:** Register/login with secure token-based auth.
- **Responsive UI:** Built with React, TypeScript, Tailwind, and shadcn/ui.
- **Backend:** Flask API with SQLite (or AWS RDS) and nutrition lookup.

---

## 🛠️ Tech Stack

| Layer       | Technology                |
|-------------|--------------------------|
| Backend     | Flask (Python), SQLAlchemy, Flask-CORS |
| Frontend    | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Database    | SQLite (local) or AWS RDS |
| AI/LLM      | OpenAI, Cohere, Google Generative AI |
| Auth        | Token-based (in-memory)   |

---

## 📁 Project Structure

```
bab-buddy-bliss-1/
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

## 🚀 Getting Started

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

- `ChatInterface`: AI-powered chat for wellness tips.
- `WellnessStats`: Dashboard for streaks, calories, water, etc.
- `MotivationalBanner`: Rotating motivational messages.
- `Navigation`: Main app navigation.
- `ui/`: Modern, accessible UI primitives (shadcn/ui).

---

## 🗺️ Main Pages

- `/` – Dashboard (overview, quick log, stats)
- `/food-log` – Food journal
- `/water-log` – Water intake tracker
- `/exercise-log` – Exercise journal
- `/exercises` – Browse exercises by muscle group
- `/login`, `/register` – Auth

---

## 📄 License

MIT