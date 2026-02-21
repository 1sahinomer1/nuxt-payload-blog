# Nuxt + Payload CMS Blog — Teknik Doküman

## Genel Bakış

Bu proje, **Nuxt 4** ile oluşturulmuş bir blog ön yüzü ve **Payload CMS 3** ile oluşturulmuş bir headless CMS arka yüzünden oluşan bir monorepo yapısındadır. Her iki proje aynı Git deposunda, `pnpm workspace` ile yönetilmektedir.

```
nuxt-payload-blog/
├── app/                  # Nuxt 4 frontend (Vue bileşenleri, sayfalar, composable'lar)
├── cms/                  # Payload CMS 3 backend (Next.js üzerinde çalışır)
├── server/               # Nuxt server route'ları (sitemap vb.)
├── public/               # Statik dosyalar (robots.txt, favicon)
├── nuxt.config.ts        # Nuxt yapılandırması
├── pnpm-workspace.yaml   # Monorepo workspace tanımı
├── package.json          # Kök bağımlılıklar ve scriptler
└── vercel.json           # Vercel deployment yapılandırması
```

---

## Tech Stack

### Frontend (Nuxt 4)

| Teknoloji | Versiyon | Açıklama |
|---|---|---|
| **Nuxt** | 4.0 | Vue tabanlı full-stack framework; SSR, dosya tabanlı routing, otomatik import |
| **Vue** | 3.5+ | Composition API ile reaktif UI geliştirme |
| **Tailwind CSS** | 4.0 | Utility-first CSS framework; `@theme` ile CSS-first konfigürasyon |
| **TypeScript** | 5.7+ | Tip güvenliği; strict mod aktif |

### Backend / CMS (Payload CMS 3)

| Teknoloji | Versiyon | Açıklama |
|---|---|---|
| **Payload CMS** | 3.x | Code-first headless CMS; koleksiyonlar TypeScript ile tanımlanır |
| **Next.js** | 15.x | Payload CMS 3 çalışma ortamı; App Router kullanılır |
| **Lexical Editor** | — | Payload'un zengin metin editörü; içerik JSON olarak saklanır |
| **PostgreSQL** | — | Üretim veritabanı (Neon.tech üzerinde) |
| **SQLite** | — | Yerel geliştirme veritabanı |

### Altyapı & Araçlar

| Teknoloji | Açıklama |
|---|---|
| **Vercel** | Frontend ve CMS ayrı proje olarak deploy edilir |
| **Neon** | Serverless PostgreSQL veritabanı servisi |
| **pnpm** | Hızlı, disk-verimli paket yöneticisi; workspace desteği |
| **Git / GitHub** | Versiyon kontrolü ve CI/CD tetikleyicisi |

---

## Mimari Yapı

```
┌──────────────────────────┐         ┌──────────────────────────┐
│     Nuxt 4 Frontend      │         │     Payload CMS 3        │
│     (Vercel — SSR)       │ ──────> │     (Vercel — Next.js)   │
│                          │  REST   │                          │
│  • Vue 3 bileşenleri     │   API   │  • Admin paneli (/admin) │
│  • Tailwind CSS v4       │         │  • Koleksiyonlar         │
│  • SEO (meta, JSON-LD)   │         │  • Medya yönetimi        │
│  • Sitemap               │         │  • Lexical rich text     │
└──────────────────────────┘         └──────────┬───────────────┘
                                                │
                                     ┌──────────▼───────────────┐
                                     │     PostgreSQL (Neon)     │
                                     │     veya SQLite (local)   │
                                     └──────────────────────────┘
```

### Veri Akışı

1. **İçerik oluşturma**: Yönetici, CMS admin paneline (`/admin`) giriş yapar ve blog yazısı ekler/düzenler.
2. **API üzerinden erişim**: Payload CMS otomatik olarak her koleksiyon için REST API endpoint'leri oluşturur (`/api/posts`, `/api/authors`, `/api/media`).
3. **Frontend render**: Nuxt frontend, SSR sırasında Payload API'sine `$fetch` ile istek atar, veriyi alır ve HTML olarak render eder.
4. **SWR cache**: Sayfalar 60 saniye boyunca cache'lenir (`swr: 60`), ardından arka planda yeniden doğrulanır. Bu sayede hem performans hem güncellik sağlanır.

---

## Koleksiyonlar (CMS Veri Modelleri)

### Posts (Blog Yazıları)
- `title` — Başlık (zorunlu)
- `slug` — URL yolu (zorunlu, benzersiz)
- `excerpt` — Kısa özet (SEO ve kartlar için)
- `content` — Zengin metin içeriği (Lexical JSON formatı)
- `coverImage` — Kapak görseli (Media koleksiyonuna ilişki)
- `author` — Yazar (Authors koleksiyonuna ilişki)
- `publishedAt` — Yayın tarihi
- `tags` — Etiketler (dizi)

### Authors (Yazarlar)
- `name` — İsim (zorunlu)
- `bio` — Biyografi
- `avatar` — Profil görseli

### Media (Medya)
- `url` — Dosya yolu (otomatik)
- `alt` — Alternatif metin (zorunlu, erişilebilirlik için)
- Desteklenen format: `image/*`

### Users (Kullanıcılar)
- `email` — E-posta (giriş için)
- `password` — Şifre (hash'lenmiş saklanır)
- Payload'un yerleşik auth sistemi kullanılır

---

## Frontend Detayları

### Sayfa Yapısı

| Sayfa | Yol | Açıklama |
|---|---|---|
| Ana sayfa | `/` | Hero bölümü + son 3 blog yazısı |
| Blog listesi | `/blog` | Tüm yazılar, sayfalama ile |
| Blog detay | `/blog/[slug]` | Tekil yazı; SEO meta, JSON-LD, kapak görseli |

### Composable: `usePosts()`

Payload API'sine yapılan tüm istekler bu composable üzerinden yönetilir:

- **`getPosts(page, limit)`** — Sayfalı blog listesi döndürür
- **`getPostBySlug(slug)`** — Slug'a göre tekil yazı döndürür

Her iki fonksiyon `useAsyncData` kullanarak SSR uyumlu çalışır. `getCachedData: () => undefined` ile Nuxt'un istemci tarafı cache'i devre dışı bırakılmıştır; böylece her navigasyonda güncel veri çekilir.

### Rich Text Render

Payload'un Lexical editörü içeriği JSON ağacı olarak saklar. `app/utils/richtext.ts` dosyasındaki `renderRichText()` fonksiyonu bu JSON'u HTML'e dönüştürür:

- Başlıklar (h1–h4)
- Paragraflar
- Listeler (sıralı/sırasız)
- Bağlantılar
- Alıntılar
- Metin biçimlendirmeleri (kalın, italik, altı çizili, üstü çizili, kod)

### SEO

- **Meta etiketleri**: Her sayfada `useHead()` ile dinamik title, description, Open Graph ve Twitter Card meta'ları
- **Canonical URL**: Her blog yazısında canonical link
- **JSON-LD**: Blog yazılarında Article şeması
- **Sitemap**: `/sitemap.xml` — Payload API'sinden dinamik olarak oluşturulur
- **robots.txt**: Tüm bot'lara izin verir, sitemap yolunu bildirir

### Stil ve Tasarım

- **Tailwind CSS v4** — `@theme` direktifi ile özel renk paleti (indigo tabanlı primary)
- **Inter** fontu
- **Responsive** tasarım (mobil, tablet, masaüstü)
- **Prose** sınıfı ile zengin metin içeriği stillendirilir
- **Geçiş animasyonları** (hover efektleri, ölçeklendirme)

---

## CMS Detayları

### Admin Paneli

CMS'in admin paneline `/admin` yolundan erişilir. Burada:

- Blog yazıları oluşturma, düzenleme, silme
- Yazarları yönetme
- Medya dosyalarını yükleme
- Kullanıcı hesaplarını yönetme

### Erişim Kontrolü (Access Control)

- **Posts, Authors, Media**: Herkes okuyabilir (`read: () => true`), yalnızca giriş yapmış kullanıcılar oluşturabilir/düzenleyebilir/silebilir
- **Users**: Yalnızca giriş yapmış kullanıcılar tüm işlemleri yapabilir

### Veritabanı Stratejisi

`payload.config.ts` dosyasında `DATABASE_URL` ortam değişkenine göre otomatik seçim yapılır:

- `DATABASE_URL` `postgres` ile başlıyorsa → **PostgreSQL** (üretim)
- Aksi halde → **SQLite** (yerel geliştirme)

### CORS ve CSRF

CMS, aşağıdaki origin'lerden gelen isteklere izin verir:
- `http://localhost:3000` (yerel frontend)
- `http://localhost:3001` (yerel CMS)
- `FRONTEND_URL` ortam değişkeni (üretim frontend URL'i)
- `SERVER_URL` veya `VERCEL_PROJECT_PRODUCTION_URL` (CMS'in kendi URL'i)

---

## Yerel Geliştirme

### Gereksinimler

- Node.js ≥ 20.9.0
- pnpm ≥ 9.0.0

### Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# CMS'i başlat (localhost:3001)
pnpm cms:dev

# Seed verilerini yükle (ilk kurulumda)
pnpm cms:seed

# Frontend'i başlat (localhost:3000)
pnpm dev
```

### Varsayılan Giriş Bilgileri

- **E-posta**: `admin@example.com`
- **Şifre**: `changeme123`

---

## Deployment (Vercel)

### Yapı

İki ayrı Vercel projesi olarak deploy edilir:

1. **Frontend (Nuxt)** — Kök dizinden deploy, `nuxtjs` framework
2. **CMS (Payload)** — `cms/` dizininden deploy, `nextjs` framework

### Ortam Değişkenleri

**Frontend projesi:**

| Değişken | Açıklama |
|---|---|
| `NUXT_PUBLIC_PAYLOAD_URL` | CMS'in üretim URL'i (ör: `https://nuxt-blog-cms.vercel.app`) |
| `NUXT_PUBLIC_SITE_URL` | Frontend'in üretim URL'i |

**CMS projesi:**

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | PostgreSQL bağlantı dizesi (Neon) |
| `PAYLOAD_SECRET` | JWT token imzalama anahtarı |
| `FRONTEND_URL` | Frontend'in üretim URL'i (CORS için) |
| `SERVER_URL` | CMS'in kendi üretim URL'i |

### Cache Stratejisi

Frontend'de `routeRules` ile SWR (Stale-While-Revalidate) cache kullanılır:
- Tüm sayfalar 60 saniye cache'lenir
- Cache süresi dolduğunda arka planda yeni veri çekilir
- Kullanıcı her zaman hızlı yanıt alır, en fazla 60 saniye gecikmeli güncel veri görür

---

## Scriptler

| Script | Açıklama |
|---|---|
| `pnpm dev` | Nuxt frontend geliştirme sunucusu |
| `pnpm build` | Nuxt üretim build'i |
| `pnpm preview` | Üretim build'ini yerel önizleme |
| `pnpm cms:dev` | Payload CMS geliştirme sunucusu |
| `pnpm cms:build` | Payload CMS üretim build'i |
| `pnpm cms:seed` | Veritabanına örnek veri yükleme |
