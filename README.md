# Purwadhika Career Network (PCN)

> A fullstack career marketplace connecting Purwadhika alumni with hiring partners — featuring smart skill-matching, automated email broadcasts, and Google Calendar scheduling.

**Built by a COO who identified a real operational problem and coded the solution himself.**

## 🚀 Live Demo

**[purwadhika-career-network.vercel.app](https://purwadhika-career-network.vercel.app)**

| Role           | Email                | Password   |
| -------------- | -------------------- | ---------- |
| Alumni         | rizky@alumni.com     | alumni123  |
| Hiring Partner | hr@tokopedia.com     | partner123 |
| Admin          | admin@purwadhika.com | admin123   |

## 🎯 The Problem

As COO of Purwadhika Digital Technology School, I managed a career services team that manually:

- Sent 20-30 WhatsApp messages per job posting to notify alumni
- Tracked applications via spreadsheets
- Scheduled interviews through back-and-forth email chains
- Had no visibility into which alumni matched which job requirements

**I built PCN to solve all of this.**

## ✨ Key Features

### Smart Matching Algorithm

Scores alumni-to-job compatibility 0-100% based on skills (50pts), experience level (25pts), work type preference (15pts), and location (10pts). Alumni see their match score on every job listing.

### Role-Based Platform (3 User Types)

| Alumni                      | Hiring Partner          | Admin                   |
| --------------------------- | ----------------------- | ----------------------- |
| View jobs with match scores | Post job listings       | Dashboard analytics     |
| Apply with cover letter     | View matched candidates | Manage users            |
| Track application status    | Kanban pipeline         | Broadcast notifications |
| Profile completion tracker  | Schedule interviews     | Manage events           |

### Automated Email Broadcast

Admin can send segmented emails to alumni filtered by batch, skills, or employment status — powered by Resend API.

### Google Calendar Integration

When a hiring partner schedules an interview, the system automatically creates a Google Calendar event with a Google Meet link for both parties.

## 🛠️ Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS, Zustand, React Router |
| Backend  | Node.js, Express.js, Prisma ORM v6                  |
| Database | PostgreSQL via Supabase                             |
| Auth     | JWT + bcrypt                                        |
| Email    | Resend API                                          |
| Calendar | Google Calendar API                                 |
| Deploy   | Vercel (frontend) + Render (backend)                |

## 📐 Architecture

```
[React Frontend]  ──REST API──  [Express Backend]
      │                               │
 Zustand Store                   Prisma ORM
 React Router                         │
 Tailwind CSS                  PostgreSQL (Supabase)
```

## 🏃 Run Locally

```bash
# Clone
git clone https://github.com/BrandonPHartono/purwadhika-career-network
cd purwadhika-career-network

# Backend
cd backend
npm install
cp .env.example .env   # fill in your credentials
npx prisma migrate dev
npx prisma db seed
npm run dev            # runs on http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

## 🔑 Environment Variables

```env
DATABASE_URL=          # Supabase PostgreSQL connection string
JWT_SECRET=            # Random string min 64 chars
FRONTEND_URL=          # http://localhost:5173 (dev) or Vercel URL (prod)
RESEND_API_KEY=        # From resend.com
GOOGLE_CLIENT_ID=      # From Google Cloud Console
GOOGLE_CLIENT_SECRET=  # From Google Cloud Console
GOOGLE_REFRESH_TOKEN=  # Generated via OAuth2 flow
```

## 👨‍💻 About the Developer

I'm Brandon — COO at Purwadhika Digital Technology School with 8+ years in operations and cross-functional leadership. I learned fullstack development to solve a real problem I faced daily, and built PCN as my first production application.

Currently open to **remote Fullstack Developer** opportunities.

[LinkedIn](https://www.linkedin.com/in/brandon-purwa-hartono-3b1147126/) · [Live Demo](https://purwadhika-career-network.vercel.app)
