# MUSLIM LIFE OS™

**Your Complete Islamic Lifestyle Companion**

A world-class, offline-first Progressive Web App (PWA) designed with Apple-level premium aesthetics, elegant Islamic touches, and deep functionality for every aspect of a Muslim's spiritual and daily life.

**Version 1.4** — Major Upgrade

### v1.4 New
- Al-Quran lengkap 114 Surah + Tips Khatam 30 hari + progress Juz
- Hafazan tracker (surah/ayat + tahap)
- Tajwid progress + Tahriri sessions
- Selawat counter berasingan

### v1.3 New
- **Qada Puasa** full tracker (total / completed / remaining / AI forecast)
- **Solat Sunat** tracker (Tahajjud, Dhuha, Rawatib, Witir, Taubat, Hajat, Istikharah, etc.)
- **Puasa Sunat** (Isnin, Khamis, Ayyamul Bidh, Arafah, Ashura, 6 Syawal)

### v1.2 New
- **Real Prayer Times** via AlAdhan API (JAKIM method) for Johor Bahru + daily cache (offline-first)
- **Qada Solat full tracker** — debt / completed / remaining / progress / AI forecast per prayer
- Live Hijri date from API
- Next prayer countdown uses real times

### v1.1
Achievements, Sedekah, Confetti, Zikir Types, XP system, Lucide icons

Built with **pure HTML5 + CSS3 + Vanilla JavaScript** + Tailwind (via CDN) + Chart.js + Lucide Icons + canvas-confetti.

---

## ✨ What's New in v1.1

- **Achievements & Badges** system with 8 unlockable badges + XP + Level
- **Sedekah Tracker** — Log wang / makanan / barangan / volunteer / anonymous with monthly total
- **Digital Tasbih upgraded** — Choose between Subhanallah, Alhamdulillah, Allahu Akbar, Selawat, La ilaha illallah
- **Confetti celebrations** when completing goals, marking all solat, unlocking badges
- **XP & Level system** that rewards every good action
- **Lucide icons** throughout for a more professional look
- Better mobile bottom navigation (Home • Solat • Zikir • Sedekah • Badges)
- Smarter next-prayer countdown
- Improved streak & achievement auto-unlock logic
- More polished micro-interactions

---

## 🚀 Getting Started

1. Open the folder `MUSLIM_LIFE_OS/`

2. Serve locally (required for Service Worker):
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

3. Open **http://localhost:8000**

4. Install as PWA from the browser.

---

## 📱 Fully Interactive Modules

| Module | Status | Features |
|--------|--------|----------|
| Dashboard | ✅ Full | Greeting, Hijri, Prayer countdown, Streak, Scores, Motivation |
| Solat Tracker | ✅ Full | 5 cards, Awal/Lewat/Jemaah/Qada, Heatmap, Mark All |
| Digital Tasbih | ✅ Full | 5 zikir types, big counter, progress, sessions |
| Al-Quran & Khatam | ✅ Full | Log reading + Khatam progress |
| Sedekah | ✅ New | Categories + amount + history + monthly total |
| Muhasabah Journal | ✅ Full | Mood + Gratitude + Reflection |
| Islamic Goals | ✅ Full | 5 goals with progress + increment |
| Achievements | ✅ New | 8 badges, XP, Level system |
| Statistics | ✅ Full | Chart.js weekly + radar |
| Settings | ✅ Full | Theme, Sync, Export, Confetti test |

---

## 🗄 Database

Full schema for **all 29 original modules** is in `sql/database.sql` (PostgreSQL / Supabase ready).

---

## 🛠 Tech Stack

- HTML5 + Tailwind CSS + Custom Glassmorphism CSS
- Vanilla JavaScript (no frameworks)
- Chart.js + Lucide Icons + canvas-confetti
- Service Worker + Manifest (true PWA)
- localStorage persistence (ready for IndexedDB + Supabase)

---

## 🤲 Philosophy

> Built with the intention of helping Muslims beautify their relationship with Allah through consistent ibadah, reflection, and growth — with the elegance such a noble pursuit deserves.

**Barakallahu feekum.**

---

**MUSLIM LIFE OS™** — Version 1.1 • August 2026


### v1.5
- Quran full Surah audio from famous verified sheikhs via Islamic Network CDN (Alafasy, Sudais, Muaiqly, Husary, Minshawi, Shatri)

## Family Cloud (Supabase) — Setup

1. Open Supabase Dashboard → SQL Editor
2. Paste & run file: `sql/family_schema.sql`
3. Auth → Providers → Email enabled
4. (Optional) Auth → Settings → disable "Confirm email" for easier testing
5. Open app → Family Mode → Daftar / Log Masuk
6. Parent: Cipta keluarga → share kod `ML-XXXX`
7. Child: Join dengan kod → tick solat sendiri
8. Parent: Refresh monitor → nampak progress semua ahli

Credentials are in `supabase.js` (anon/publishable key only — safe for client).
