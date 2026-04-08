# NowieFakie

Aplikasi kuis web buat ngetes seberapa kenal temen-temen lo sama lo. Lo jawab 10 pertanyaan tentang diri sendiri, share linknya ke temen, terus liat siapa yang paling kenal lo di leaderboard.

## Tech Stack

- Next.js (App Router)
- Tailwind CSS v4
- Firebase Firestore

## Cara Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Konfigurasi Firebase

Buat project baru di Firebase Console, aktifin Firestore Database, lalu bikin file `.env.local` di root project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=isi_di_sini
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=isi_di_sini
NEXT_PUBLIC_FIREBASE_PROJECT_ID=isi_di_sini
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=isi_di_sini
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=isi_di_sini
NEXT_PUBLIC_FIREBASE_APP_ID=isi_di_sini
```

### 3. Jalanin development server

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

## Build Production

```bash
npm run build
npm start
```

## Halaman

| Route | Fungsi |
| --- | --- |
| `/` | Landing page |
| `/create` | Bikin kuis baru |
| `/quiz/[quizId]` | Temen ngerjain kuis |
| `/quiz/[quizId]/result` | Lihat hasil kuis |
| `/quiz/[quizId]/leaderboard` | Ranking semua peserta |

## Alur Penggunaan

1. Buka halaman utama, klik tombol buat kuis
2. Isi nama lo, jawab 10 pertanyaan tentang diri sendiri
3. Copy link yang keluar dan share ke temen-temen
4. Temen lo buka link tersebut, isi namanya, dan nebak jawaban lo
5. Setelah selesai, mereka bisa liat skor dan rekap jawaban
6. Cek leaderboard untuk liat ranking semua yang udah ikutan

## Struktur Project

```
src/
  app/
    page.js               # Landing page
    layout.js             # Root layout
    globals.css           # Global styles dan design tokens
    create/
      page.js             # Halaman bikin kuis
    quiz/[quizId]/
      page.js             # Halaman ngerjain kuis
      result/
        page.js           # Halaman hasil
      leaderboard/
        page.js           # Leaderboard
  lib/
    firebase.js           # Inisialisasi Firebase
    firestore.js          # Fungsi database
    questions.js          # Daftar pertanyaan
```
