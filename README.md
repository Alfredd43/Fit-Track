# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/472afe8c-6d79-49be-9bc0-863cf87c780e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/472afe8c-6d79-49be-9bc0-863cf87c780e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How do I run the backend (Flask API)?

1. **Install Python dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
2. **Create a `.env` file:**
   - Copy the following into a new file named `.env` in the project root:
     ```
     OPENAI_API_KEY=your-openai-api-key-here
     ```
   - Replace `your-openai-api-key-here` with your actual OpenAI API key.
3. **Initialize the database:**
   - The database tables will be created automatically when you first run the backend.
4. **Run the backend server:**
   ```sh
   python app.py
   ```
   - The backend will start on `http://localhost:5000` by default.

## How do I run the frontend (React app)?

1. **Install Node.js dependencies:**
   ```sh
   npm install
   ```
2. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```
   - The frontend will start on `http://localhost:5173` by default.
   - It will connect to the backend at `http://localhost:5000` (see `src/config.ts`).

## Troubleshooting
- Make sure your backend is running before using the frontend.
- If you change the backend port, update `src/config.ts` accordingly.
- Ensure your `.env` file is present and correct for the backend.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/472afe8c-6d79-49be-9bc0-863cf87c780e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
