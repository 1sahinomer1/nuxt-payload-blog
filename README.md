# Nuxt + Payload Blog

A production-ready blog platform built with **Nuxt 4**, **Payload CMS 3**, **Tailwind CSS v4**, and **TypeScript**.

## Prerequisites

- Node.js >= 20.9.0
- pnpm >= 9.0.0

## Setup

```bash
# Install all dependencies (root + CMS)
pnpm install

# Copy environment files
cp .env.example .env
cp cms/.env.example cms/.env
```

## Development

Start both the CMS and the Nuxt frontend:

```bash
# Terminal 1 — Payload CMS (http://localhost:3001)
pnpm cms:dev

# Terminal 2 — Nuxt frontend (http://localhost:3000)
pnpm dev
```

### CMS Admin Panel

Open [http://localhost:3001/admin](http://localhost:3001/admin) to access the Payload admin panel.

On first launch, create an admin account at the registration screen.

### Seed Data

Populate the CMS with sample content:

```bash
cd cms
pnpm seed
```

This creates:
- 1 admin user (`admin@example.com` / `changeme123`)
- 1 author
- 3 blog posts

## Build

```bash
# Build Nuxt frontend
pnpm build

# Build CMS
cd cms && pnpm build
```

## Preview Production Build

```bash
pnpm preview
```

## Environment Variables

### Nuxt Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PAYLOAD_URL` | `http://localhost:3001` | Payload CMS API URL |
| `SITE_URL` | `http://localhost:3000` | Public site URL (for SEO) |

### CMS (`cms/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./data/payload.db` | SQLite database path |
| `PAYLOAD_SECRET` | — | Secret key for Payload |

## Deployment

**Frontend:** Deploy to Vercel or any Node.js hosting that supports Nuxt SSR.

**CMS:** Deploy as a Node.js server. Run `pnpm build` then `pnpm start` in the `cms` directory.

Set `PAYLOAD_URL` in the frontend environment to point to your deployed CMS URL.

## Project Structure

```
├── app/                    # Nuxt 4 app directory
│   ├── assets/css/         # Tailwind CSS
│   ├── components/         # Vue components
│   ├── composables/        # usePosts composable
│   ├── layouts/            # App layout
│   ├── pages/              # Route pages
│   ├── types/              # TypeScript types
│   └── utils/              # Rich text renderer
├── cms/                    # Payload CMS 3 (Next.js)
│   ├── src/
│   │   ├── app/            # Next.js app router (Payload)
│   │   ├── collections/    # CMS collections
│   │   └── seed.ts         # Database seed script
│   └── payload.config.ts   # Payload configuration
├── server/                 # Nuxt server routes
│   └── routes/             # Sitemap generator
├── public/                 # Static assets
├── nuxt.config.ts          # Nuxt configuration
└── package.json
```

## Tech Stack

- **Nuxt 4** — SSR Vue framework
- **Payload CMS 3** — Headless CMS with admin panel
- **Tailwind CSS v4** — Utility-first CSS
- **TypeScript** — Strict type safety
- **SQLite** — Lightweight database
- **pnpm** — Fast package manager
