# 📱 Muskaan Assessment & Quiz - iOS Progressive Web App (PWA)

A mobile-first, login-gated Progressive Web App built for **iOS**, featuring **Supabase authentication & database**, questionnaire management for educators/admins, interactive test-taking with live timers, automated answer checking, and comprehensive mark inspection.

---

## 🌟 Key Features

### 1. 📲 iOS PWA Optimization
- **Add to Home Screen**: Runs in full-screen standalone mode with native iOS feel (`display: standalone`, `apple-mobile-web-app-capable`).
- **iOS Safe Area Support**: Supports iPhone dynamic islands, notches, and home indicator bars (`viewport-fit=cover`, `env(safe-area-inset-top)` / `bottom`).
- **Cupertino Glassmorphism**: Frosted glass top header and bottom tab navigation bar (`backdrop-blur-md`).
- **Offline Resilience**: Built-in Service Worker (`public/sw.js`) and PWA web manifest (`public/manifest.webmanifest`).

### 2. 🔐 Login-Gated Authentication & Role-Based Access
- **Supabase Auth**: Email & Password sign in and registration.
- **Roles**:
  - **Admin (Teacher / Examiner)**: Upload test papers, set correct answer keys, toggle published status, and review marks & answers of all students.
  - **Student**: Access published questionnaires, take tests interactively, view immediate marks, and review answer solutions.
- **Instant Demo Switcher**: Pre-seeded demo accounts (`admin@muskaan.edu`, `student@muskaan.edu`) allowing instant preview in both roles with zero setup.

### 3. 📝 Admin Test Paper & Questionnaire Uploader
- **Form Builder**:
  - Test Title, Category/Subject, Duration (minutes), and Description.
  - Multiple Question types: **Multiple Choice (MCQ)**, **True/False**, and **Short Answer**.
  - Interactive radio-based answer key selection (click the checkmark next to the correct choice).
  - Custom marks/points per question.
  - Teacher explanation / solution note for students.
- **Bulk JSON Questionnaire Uploader**:
  - Paste or load a JSON array of questions to generate a complete test paper in seconds.
  - Sample JSON template button included in the UI.

### 4. ⏱️ Interactive Student Test-Taking Experience
- Live countdown timer with automatic submit on expiry.
- Progress bar and answered/unanswered question counters.
- Question quick-jump palette/grid to navigate between questions.
- Interactive question options with touch-friendly selection feedback.
- Pre-submission review modal warning if questions remain unanswered.

### 5. 🎯 Automated Marking & Score Breakdown
- **Instant Result Celebration**: Radial score badge and confetti animation.
- **Question-by-Question Solution Review**:
  - Compares student's answer vs teacher's correct answer key.
  - Displays points awarded and correctness pill (`Correct` vs `Incorrect`).
  - Displays teacher's explanation so students learn why an answer is correct.

### 6. 📊 Marks & Gradebook Viewer
- **For Admins**: Class-wide analytics (Total submissions, Class average score, Pass rate percentage), search & filter by test or student name, and detailed answer inspection.
- **For Students**: Past test history, score percentage, date submitted, and "View Solutions" review.

---

## 🚀 Quick Start (Local Demo Sandbox)

The app is pre-configured with a local sandbox mode so you can test all features immediately:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the local server**:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.
4. Click **Demo Admin** or **Demo Student** to log in instantly.

---

## 🗄️ Connecting to Supabase (Production Backend)

To store all users, tests, and marks in your own Supabase database:

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.

### Step 2: Run the SQL Schema
1. In your Supabase Dashboard, open the **SQL Editor** (`/project/_/sql`).
2. Copy the contents of [`supabase/schema.sql`](file:///c:/Users/Hi/OneDrive/Desktop/Projects/Muskaan/supabase/schema.sql) (or click **DB & SQL -> Copy SQL Schema** in the app).
3. Paste it into the SQL Editor and click **Run**.
   - This sets up:
     - `profiles` table with automatic signup triggers
     - `tests` and `questions` tables with Row Level Security (RLS)
     - `submissions` and `submission_answers` tables
     - Secure `submit_test` Postgres RPC function to grade papers securely on the server without exposing answers to client tampering.

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
Restart your Vite server (`npm run dev`), and Muskaan will automatically connect to your live Supabase database!

---

## 📲 How to Install on iOS (iPhone / iPad)

1. Open Safari on your iPhone or iPad.
2. Navigate to your deployed app URL (or local network IP e.g. `http://192.168.x.x:5173`).
3. Tap the **Share** button (box with an arrow pointing up at the bottom of Safari).
4. Scroll down and tap **"Add to Home Screen"**.
5. Tap **Add**. The Muskaan icon will now appear on your iOS home screen as a standalone app!
