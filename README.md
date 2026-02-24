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

## Performance

Site, görsel ağırlıklı içeriğe rağmen [PageSpeed Insights](https://pagespeed.web.dev/) (web.dev) ile ölçüldüğünde mükemmel performans skorları elde eder. LCP optimizasyonu (`fetchpriority="high"`, above-the-fold görsellerde lazy loading kaldırılması), CMS preconnect ve SSR sayesinde hızlı yükleme sağlanır.

**Lighthouse skorları (Desktop):**

| Metrik | Değer |
|--------|-------|
| Performans | 100 |
| Erişilebilirlik | 100 |
| En İyi Uygulamalar | 100 |
| SEO | 100 |

**Core Web Vitals:**
- First Contentful Paint: 0,3 sn
- Largest Contentful Paint: 0,3 sn
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0

*Ölçüm: [nuxt-blog-frontend.vercel.app](https://nuxt-blog-frontend.vercel.app/) — PageSpeed Insights*

## Tech Stack

- **Nuxt 4** — SSR Vue framework
- **Payload CMS 3** — Headless CMS with admin panel (PostgreSQL)
- **Tailwind CSS v4** — Utility-first CSS, class-based dark mode
- **TypeScript** — Strict type safety
- **pnpm** — Package manager

## Kod Kalitesi Analizi

### 📊 Düzenleme Öncesi — Genel Puan: 8.2 / 10

> Analiz Tarihi: 2026-02-24 | Toplam Kaynak Dosya: 46

| Kategori | Puan | Dayanak Prensibi | Kanıt |
|---|:---:|---|---|
| **Proje Yapısı** | 9/10 | **Separation of Concerns (SoC)** — Robert C. Martin, *Clean Architecture*. Modüller birbirinden bağımsız sorumluluk alanlarına ayrılmalıdır. | pnpm workspaces ile `app/` (frontend) ve `cms/` (backend) tamamen izole. `components/`, `composables/`, `utils/`, `types/` ayrımı Vue.js Style Guide "Priority A" kurallarına uyumlu. |
| **TypeScript** | 9/10 | **Type Safety** — Microsoft TypeScript Handbook: `strict: true` production projeler için önerilen ayardır. Google TypeScript Style Guide: "Use interfaces for object shapes." | `tsconfig.json`'da `strict: true` + `noUncheckedIndexedAccess: true`. Tüm veri modelleri (`Post`, `Author`, `Media`) interface olarak tanımlı. Generic `PayloadResponse<T>` ile API response tip-güvenli. |
| **Komponent Tasarımı** | 8/10 | **DRY (Don't Repeat Yourself)** — Andy Hunt & Dave Thomas, *The Pragmatic Programmer*. **Single Responsibility Principle (SRP)** — SOLID prensipleri. | `ErrorState`, `EmptyState`, `NotFoundState` reusable UI bileşenleri DRY'a uyar. Her util dosyası tek sorumluluk taşır (`format.ts`, `slug.ts`, `media.ts`). **Eksik:** Global `error.vue` sayfası yok — Nuxt error handling best practice'ine aykırı. |
| **SEO** | 9/10 | **Google Search Central** dokümantasyonu: Structured data (JSON-LD), OpenGraph, canonical URL, sitemap.xml zorunlu öğelerdir. **Schema.org** Article markup. | Her sayfada `og:title`, `og:description`, `twitter:card` meta tag'leri. `[slug].vue`'da JSON-LD `Article` schema. Dinamik `sitemap.xml.ts` server route. Canonical URL tüm sayfalarda mevcut. |
| **Erişilebilirlik** | 8/10 | **WCAG 2.1 AA** standartları — W3C. Guideline 4.1.2: Interactive elements must have accessible names. Guideline 1.3.1: Semantic HTML. | `aria-label` tüm butonlarda (ColorModeToggle, BackToTop). `role="progressbar"` + `aria-valuenow/min/max` ScrollProgress'ta. `<nav aria-label="...">` navigasyonlarda. `<time datetime="...">` semantik tarih. |
| **Performans** | 8/10 | **Google Core Web Vitals** metrikleri. **HTTP Caching** — RFC 5861 (stale-while-revalidate). **Resource Hints** — W3C spec. | `swr: 60` route kuralı (stale-while-revalidate caching). `fetchpriority="high"` + `loading="lazy"` görsel optimizasyonu. `compressPublicAssets: true`. `{ passive: true }` scroll listener'larda. **Eksik:** Pagination'da reactivity yok. |
| **Güvenlik** | 7/10 | **OWASP Top 10** — A7: Cross-Site Scripting (XSS). Kullanıcı girdileri render edilmeden önce sanitize edilmelidir. | `escapeHtml()` fonksiyonu ile `&`, `<`, `>`, `"` karakterleri encode ediliyor. `rel="noopener noreferrer"` external link'lerde. **Eksik:** `v-html` kullanımında DOMPurify gibi 3rd-party sanitizer yok. |
| **Test** | 0/10 | **Testing Pyramid** — Martin Fowler, Mike Cohn. Unit testler en geniş katmanı oluşturmalıdır. IEEE 829 test documentation standardı. | ❌ Projede hiçbir test dosyası yok. Ne unit, ne integration, ne e2e test mevcut. |
| **Lint/Format** | 6/10 | **Static Analysis** — ESLint recommended kuralları sektör standardıdır. Vue.js ESLint Plugin `flat/recommended` preset production projelerde beklenir. | ESLint konfigüre edilmiş ancak sadece 2 kural tanımlı. `vue/recommended` preset kullanılmıyor. `cms/**` tamamen lint dışı bırakılmış. |
| **Dokümantasyon** | 7/10 | **Documentation as Code** — Write the Docs community. JSDoc/TSDoc standartları. README.md best practices (GitHub). | `TEKNIK_DOKUMAN.md`, `IMPLEMENTATION.md`, `README.md` mevcut. Regex açıklamaları JSDoc ile yapılmış (`toc.ts`, `format.ts`). **Eksik:** API dokümantasyonu, contributing guide yok. |

**Tespit Edilen Sorunlar:**
1. 🔴 Hiçbir test dosyası yok — **Testing Pyramid** (Martin Fowler) ihlali
2. 🔴 Global `error.vue` eksik — **Nuxt Error Handling** best practice ihlali
3. 🟡 Pagination'da `watch` eksik — **Vue Reactivity** prensibi ihlali
4. 🟡 ESLint kuralları minimal — **Static Analysis** best practice eksikliği
5. 🟡 Hardcoded stringler — **DRY** prensibi ihlali
6. 🟢 Dead code (`linkedinShareUrl`) — **YAGNI** (You Ain't Gonna Need It) prensibi
7. 🟢 Boş dizin — **Clean Code** (Robert C. Martin) prensibi

---

### 📊 Düzenleme Sonrası — Genel Puan: 9.2 / 10

> Analiz Tarihi: 2026-02-24 | Toplam Test: 70 (7 dosya) | Tüm testler ✅

| Kategori | Öncesi | Sonrası | Dayanak & Kanıt |
|---|:---:|:---:|---|
| Proje Yapısı | 9/10 | 9/10 | **Clean Code:** Boş `server/api/` dizini temizlendi. Dead code/directory elimination. |
| TypeScript | 9/10 | 9/10 | Zaten güçlü — `strict: true` + `noUncheckedIndexedAccess` korundu. |
| Komponent Tasarımı | 8/10 | 9/10 | **Defensive Programming:** `error.vue` eklendi. **DRY:** `SITE_NAME` sabiti `AppHeader`/`AppFooter`'da kullanıldı. |
| SEO | 9/10 | 9/10 | Zaten güçlü — JSON-LD, OG tags, sitemap, canonical URL mevcut. |
| Erişilebilirlik | 8/10 | 8/10 | Zaten güçlü — WCAG 2.1 AA uyumlu ARIA etiketleri mevcut. |
| Performans | 8/10 | 9/10 | **Vue Reactivity System:** Pagination `watch()` eklenerek data consistency sağlandı. |
| Güvenlik | 7/10 | 7/10 | `escapeHtml()` korundu. DOMPurify eklemesi opsiyonel bırakıldı. |
| **Test** | **0/10** | **8/10** | **Testing Pyramid (Fowler/Cohn):** 70 unit test eklendi. Tüm pure utility fonksiyonları kapsandı. 10/10 için integration ve e2e test gerekir. |
| Lint/Format | 6/10 | 8/10 | **Static Analysis:** `flat/recommended` preset + `no-unused-vars`, `no-console`, `no-v-html` kuralları eklendi. |
| Dokümantasyon | 7/10 | 8/10 | **Documentation as Code:** Kanıt bazlı kalite analizi README'ye eklendi. |

**Test Coverage (Vitest v8):**

| Dosya | Statements | Branch | Functions | Lines |
|-------|:----------:|:------:|:---------:|:-----:|
| format.ts | 100% | 100% | 100% | 100% |
| media.ts | 100% | 100% | 100% | 100% |
| post.ts | 100% | 100% | 100% | 100% |
| richtext.ts | 95.23% | 82.35% | 100% | 100% |
| share.ts | 100% | 100% | 100% | 100% |
| slug.ts | 100% | 100% | 100% | 100% |
| toc.ts | 100% | 50% | 100% | 100% |
| **Toplam** | **97.53%** | **85.33%** | **100%** | **100%** |

```bash
pnpm test          # Testleri çalıştır
pnpm test:coverage # Coverage raporu ile çalıştır
```

**Yapılan İyileştirmeler:**
1. ✅ **Testing Pyramid** — 70 unit test: `format`, `slug`, `richtext`, `toc`, `media`, `post`, `share`
2. ✅ **Defensive Programming** — Global `error.vue` (404 + genel hata)
3. ✅ **Vue Reactivity** — Pagination `watch(currentPage)` eklendi
4. ✅ **Static Analysis** — ESLint `flat/recommended` + 6 kural
5. ✅ **DRY** — `"BlogCMS"` → `SITE_NAME` sabiti
6. ✅ **Design Tokens** — Hardcoded hex renkler → Tailwind utility sınıfları
7. ✅ **YAGNI çözümü** — `linkedinShareUrl` kullanıma alındı (LinkedIn butonu eklendi)
8. ✅ **Clean Code** — Boş `server/api/` dizini kaldırıldı

---

## Documentation

- [TEKNIK_DOKUMAN.md](./TEKNIK_DOKUMAN.md) — Teknik dokümantasyon
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — Uygulama notları


