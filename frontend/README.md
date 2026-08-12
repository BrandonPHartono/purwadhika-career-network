# Purwadhika Career Network

> Platform rekrutmen digital khusus alumni Purwadhika — menghubungkan lulusan dengan hiring partner melalui smart matching dan automated notifications.

## 🚀 Live Demo

- **App:** https://purwadhika-career-network.vercel.app
- **API:** https://pcn-backend-rpj8.onrender.com

## 🔑 Demo Accounts

| Role    | Email                | Password   |
| ------- | -------------------- | ---------- |
| Alumni  | rizky@alumni.com     | alumni123  |
| Partner | hr@tokopedia.com     | partner123 |
| Admin   | admin@purwadhika.com | admin123   |

## 🎯 Problem Yang Diselesaikan

| Problem                                    | Solusi                                   |
| ------------------------------------------ | ---------------------------------------- |
| Admin kirim info loker manual via WA       | Broadcast email otomatis tersegmentasi   |
| Tidak ada matching skill alumni & lowongan | Smart matching algorithm 0-100%          |
| Scheduling interview via WA bolak-balik    | Integrated slot picker + Google Calendar |
| Admin tidak bisa monitor pipeline hiring   | Kanban pipeline real-time                |

## 🛠️ Tech Stack

| Layer    | Teknologi                                           |
| -------- | --------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS, Zustand, React Router |
| Backend  | Node.js, Express, Prisma ORM                        |
| Database | PostgreSQL via Supabase                             |
| Auth     | JWT + bcrypt                                        |
| Email    | Resend API                                          |
| Calendar | Google Calendar API                                 |
| Deploy   | Vercel (FE) + Render (BE)                           |

## 📋 Fitur

- **Alumni:** Register, profil (0-100%), lihat job match score, apply, track status lamaran
- **Hiring Partner:** Post lowongan, lihat kandidat cocok, kelola pipeline kanban
- **Admin:** Dashboard analytics, broadcast notification, kelola events, kelola user

## 🏃 Cara Jalankan Lokal

### Prerequisites

- Node.js v24+
- Akun Supabase (gratis)

### Setup

```bash
# Clone repository
git clone https://github.com/BrandonPHartono/purwadhika-career-network

# Backend
cd backend && npm install
cp .env.example .env  # isi variable yang dibutuhkan
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (terminal baru)
cd frontend && npm install
cp .env.example .env
npm run dev
```

## 📐 Architecture

```
[ React Frontend ] <-- REST API --> [ Express Backend ]
       |                                    |
  Zustand Store                       Prisma ORM
  React Router                             |
  Tailwind CSS                    PostgreSQL (Supabase)
```
