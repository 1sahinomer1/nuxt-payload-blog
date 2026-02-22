# Nuxt + Payload Blog

A production-ready blog platform built with **Nuxt 4**, **Payload CMS 3**, **Tailwind CSS v4**, and **TypeScript**.

## Prerequisites

- Node.js >= 20.9.0
- pnpm >= 9.0.0

## Local Development (Quick Start)

```bash
# 1. Install all dependencies
pnpm install

# 2. Create environment files (see Environment Variables below for values)
# Root: .env
# CMS: cms/.env

# 3. Start Payload CMS (Terminal 1)
pnpm cms:dev
# → http://localhost:3001 (Admin panel: http://localhost:3001/admin)

# 4. Start Nuxt frontend (Terminal 2)
pnpm dev
# → http://localhost:3000

# 5. (Optional) Seed the database with sample content
pnpm cms:seed
```

### CMS Admin Panel

Open [http://localhost:3001/admin](http://localhost:3001/admin) to access the Payload admin panel.

On first launch, create an admin account at the registration screen.

### Seed Data

`pnpm cms:seed` creates:
- 1 admin user (`admin@example.com` / `changeme123`)
- 1 author
- 3 blog posts

## Build

```bash
# Build Nuxt frontend
pnpm build

# Build CMS
pnpm cms:build
# or: cd cms && pnpm build
```

## Preview Production Build

```bash
pnpm preview
```

## Environment Variables

### Nuxt Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NUXT_PUBLIC_PAYLOAD_URL` | `http://localhost:3001` | Payload CMS API URL |
| `NUXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site URL (for SEO) |

### CMS (`cms/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (required). Example: `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `PAYLOAD_SECRET` | Secret key for Payload (required in production) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob Storage token for media uploads (Vercel deploy için) |

## Deployment

**Önerilen**: Vercel (Frontend) + Vercel/Railway (CMS)

1. **Frontend (Nuxt)** — Vercel
   - GitHub repo'yu bağla, root: project root
   - Build command: `pnpm build`
   - Environment: `NUXT_PUBLIC_PAYLOAD_URL`, `NUXT_PUBLIC_SITE_URL`

2. **CMS (Payload)** — Vercel (veya Railway/Render)
   - Root directory: `cms`
   - Build: `pnpm build`, Start: `pnpm start`
   - Environment: `DATABASE_URL` (PostgreSQL), `PAYLOAD_SECRET`, `FRONTEND_URL` (optional, for CORS)

CMS yalnızca PostgreSQL kullanacak şekilde yapılandırılmıştır (production ve local için `DATABASE_URL` gerekir).

### Payload Config (`cms/payload.config.ts`) Özeti

- **serverURL**: CMS API adresi
- **collections**: Posts, Authors, Media, Users
- **plugins**: vercelBlobStorage — medya dosyaları Vercel Blob'da saklanır
- **db**: postgresAdapter — PostgreSQL bağlantısı
- **secret**: Payload oturum şifrelemesi
- **cors/csrf**: Frontend origin'leri

## Project Structure

```
├── app/                    # Nuxt 4 app directory
│   ├── assets/css/        # Tailwind + dark mode, prose, code blocks
│   ├── components/        # Vue components (Header, Footer, PostCard, TOC, Share, BackToTop, etc.)
│   ├── composables/       # usePosts, useColorMode
│   ├── constants/         # Meta titles, site name
│   ├── layouts/           # Default layout
│   ├── pages/             # Home, blog list, blog/[slug]
│   ├── types/             # TypeScript types
│   └── utils/             # format, media, post, richtext, share, slug, toc
├── cms/                   # Payload CMS 3 (Next.js)
│   ├── src/
│   │   ├── app/           # Next.js app router (Payload)
│   │   ├── collections/   # Posts, Authors, Media, Users
│   │   └── seed.ts        # Database seed script
│   └── payload.config.ts  # Payload config (PostgreSQL)
├── server/routes/         # Nuxt server (e.g. sitemap)
├── public/                # Static assets
├── nuxt.config.ts
└── package.json
```

## Tech Stack

- **Nuxt 4** — SSR Vue framework
- **Payload CMS 3** — Headless CMS with admin panel (PostgreSQL)
- **Tailwind CSS v4** — Utility-first CSS, class-based dark mode
- **TypeScript** — Strict type safety
- **pnpm** — Package manager

## Documentation

- [TEKNIK_DOKUMAN.md](./TEKNIK_DOKUMAN.md) — Teknik dokümantasyon
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — Uygulama notları
