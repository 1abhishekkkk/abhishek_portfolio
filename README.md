# Abhishek Kumar Portfolio

Cinematic portfolio site for Abhishek Kumar, built with React, Vite, Tailwind CSS, Framer Motion, and Vercel serverless API routes.

## Features

- Video-first hero and showreel
- Brand partner proof section
- Case studies for campaign work
- Service packages and project CTA
- Before/after color grading comparisons
- AI creative concept generator
- Contact form backed by Postgres on Vercel
- Lightweight admin page for viewing leads

## Local Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

Required environment variables for deployed API routes:

- `DATABASE_URL`
- `GEMINI_API_KEY`
- `ADMIN_PASSWORD`

## Content

Most public-facing text, brand proof, case studies, packages, and project metadata live in `src/portfolioData.js`.
