<h1 align="center"> BuddyBliss</h1>

<p align="center">
  <b>Your all-in-one wellness companion</b><br>
  🍎 Food & water tracking | 🏋️ Exercise logging | 🤖 AI chat | 📊 Beautiful, modern UI
</p>

---

## ✨ Overview

**BuddyBliss** is a playful, production-ready wellness tracker and AI companion. Log your meals, hydration, and workouts. See your progress. Get motivation and tips from AI—all in a slick, responsive app.

- ✅ Food, water, and exercise logging
- ✅ Wellness dashboard with streaks and stats
- ✅ AI-powered chat for motivation and tips
- ✅ Modern, mobile-friendly UI
- ✅ Secure authentication

---

## 🚀 Features

- 🍽️ **Food Log** – Track what you eat, calories, and macros
- 💧 **Water Log** – Stay hydrated, visualize your daily intake
- 🏃 **Exercise Log** – Record workouts, duration, intensity, calories burnt
- 📈 **Wellness Dashboard** – See daily stats, streaks, and motivational banners
- 🤖 **AI Chat** – Get wellness tips, encouragement, and answers from AI
- 🔐 **Authentication** – Register/login with secure token-based auth
- ⚡ **Fast, Responsive UI** – React + TypeScript + Tailwind + shadcn/ui
- 🗄️ **Backend** – Flask API with SQLite (local) or AWS RDS (production)

---

## 🛠️ Tech Stack

| Layer        | Technology                                    |
|--------------|-----------------------------------------------|
| 🧠 Backend   | Flask (Python), SQLAlchemy, Flask-CORS        |
| 💻 Frontend  | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| 🗄️ Database  | SQLite (local dev) or AWS RDS (production)    |
| 🤖 AI/LLM    | OpenAI, Cohere, Google Generative AI          |
| 🔐 Auth      | Token-based (in-memory, localStorage on FE)   |

---

## 🧪 Example Workflow

1. User logs in or registers.
2. Logs food, water, and exercise via the dashboard or quick actions.
3. Views daily stats, streaks, and motivational banners.
4. Chats with the AI for wellness tips or encouragement.
5. All data is stored securely in SQLite (or AWS RDS in production).

---

## 🧰 Usage

### 🔧 Installation

```bash
# Clone the repo
https://github.com/Alfredd43/buddybliss.git
cd buddybliss

# Backend setup
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python app.py

# Frontend setup
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

## 🗺️ Main Pages
- `/` – Dashboard (overview, quick log, stats)
- `/food` – Food journal
- `/water` – Water intake tracker
- `/exercise` – Exercise journal
- `/exercises` – Browse exercises by muscle group
- `/login`, `/register` – Auth

---

> Made with joy, color, and a little AI magic ✨