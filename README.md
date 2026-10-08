# For Caca — Birthday Web App

A personal, interactive birthday experience made with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

---

## Personalizing the Content

All text, names, captions, and asset paths live in one file:

**`src/data/birthdayContent.ts`**

Edit this file to change:
- Recipient and sender names
- Age
- Opening text
- Memory captions
- Letter paragraphs
- Final message
- Music path

You do **not** need to touch any component files.

---

## Replacing Photos

Place your image files in:

```
public/images/
  memory-01.jpg
  memory-02.jpg
  memory-03.jpg
  memory-04.jpg
  memory-05.jpg
  final.jpg
```

The app uses a graceful placeholder when images are missing — so the experience still works before photos are added.

---

## Adding Music

Place your audio file at:

```
public/audio/birthday-song.mp3
```

The music toggle button appears automatically when the file is present. If the file is missing, no button is shown and no errors occur.

---

## Deploying to GitHub Pages

1. In `vite.config.ts`, set the `base` option to your repository name:

   ```ts
   base: '/your-repo-name/'
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Deploy the `dist/` folder to GitHub Pages using your preferred method (GitHub Actions, `gh-pages` npm package, etc.).

---

## Deploying to Vercel

### Option 1: Via Vercel CLI (Paling Cepat)
1. Install & login Vercel CLI jika belum:
   ```bash
   npm i -g vercel
   vercel login
   ```
2. Jalankan perintah deploy dari root folder:
   ```bash
   vercel --prod
   ```

### Option 2: Via GitHub & Vercel Dashboard
1. Push project ini ke repository GitHub Anda.
2. Buka [vercel.com](https://vercel.com) > **Add New...** > **Project**.
3. Import repository GitHub project ini.
4. Framework Preset otomatis mendeteksi **Vite**.
5. Klik **Deploy**!

---

## Project Structure

```
src/
  components/
    OpeningScreen.tsx     — Intro screen
    HomeScreen.tsx        — Navigation hub
    MemoryCarousel.tsx    — Swipeable memory story
    LetterScreen.tsx      — Letter reveal experience
    WishScreen.tsx        — Candle blowing interaction
    Candle.tsx            — CSS + Framer Motion candle
    FinalScreen.tsx       — Final surprise reveal
    EndingScreen.tsx      — Closing screen
    MusicToggle.tsx       — Optional music control
    SafeImage.tsx         — Image with graceful fallback

  data/
    birthdayContent.ts    — ALL personal content here

  App.tsx                 — Screen state & navigation
  main.tsx                — Entry point
  index.css               — Global styles & design tokens

public/
  images/                 — Place photos here
  audio/                  — Place music here
  icons/                  — PWA icons
  manifest.json           — PWA manifest
  favicon.svg             — App favicon
```

---

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React

No backend. No database. No authentication. Fully static.
