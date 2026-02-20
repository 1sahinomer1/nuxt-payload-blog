# Deployment Guide

Bu projeyi production'a deploy etmek için adım adım rehber.

## 🎯 Önerilen Deployment Stratejisi

**Frontend (Nuxt)**: Vercel (SSR için mükemmel, ücretsiz tier yeterli)  
**CMS (Payload)**: Railway veya Render (PostgreSQL ile, persistent storage)

---

## 📋 Ön Hazırlık

### 1. Database: SQLite → PostgreSQL

Production'da SQLite kullanma (concurrent writes sorunları var). PostgreSQL'e geçmeliyiz.

**Seçenekler:**
- **Railway** (önerilen): PostgreSQL otomatik sağlar, kolay setup
- **Render**: PostgreSQL addon'u var
- **Supabase**: Ücretsiz PostgreSQL (250MB)
- **Neon**: Serverless PostgreSQL, ücretsiz tier

---

## 🚀 Seçenek 1: Vercel (Frontend) + Railway (CMS) - ÖNERİLEN

### Frontend - Vercel'e Deploy

1. **Vercel hesabı oluştur**: https://vercel.com
2. **GitHub'a push et**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```
3. **Vercel'de yeni proje oluştur**:
   - GitHub repo'yu bağla
   - **Root Directory**: `.` (root)
   - **Framework Preset**: Nuxt.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.output`
   - **Install Command**: `pnpm install`

4. **Environment Variables** ekle:
   ```
   PAYLOAD_URL=https://your-cms.railway.app
   SITE_URL=https://your-blog.vercel.app
   ```

5. **Deploy** → Otomatik deploy başlar!

### CMS - Railway'e Deploy

1. **Railway hesabı oluştur**: https://railway.app
2. **Yeni proje oluştur** → "Deploy from GitHub repo"
3. **PostgreSQL ekle**:
   - "New" → "Database" → "Add PostgreSQL"
   - Connection string otomatik `DATABASE_URL` env var olarak eklenir

4. **CMS servisini deploy et**:
   - "New" → "GitHub Repo" → Repo'yu seç
   - **Root Directory**: `cms`
   - **Start Command**: `pnpm start`
   - **Build Command**: `pnpm build`

5. **Environment Variables** ekle:
   ```
   DATABASE_URL=<Railway PostgreSQL connection string>
   PAYLOAD_SECRET=<rastgele güçlü string, örn: openssl rand -base64 32>
   NODE_ENV=production
   ```

6. **CORS & CSRF güncelle** (`cms/payload.config.ts`):
   ```ts
   cors: ['https://your-blog.vercel.app'],
   csrf: ['https://your-blog.vercel.app'],
   ```

7. **Domain ekle** (opsiyonel):
   - Railway → Settings → "Generate Domain" → `your-cms.railway.app`
   - Veya custom domain: Settings → "Custom Domain"

8. **Deploy** → Railway otomatik build edip deploy eder!

---

## 🚀 Seçenek 2: Her İkisi de Vercel'de (Monorepo)

Vercel monorepo desteği var, ama CMS için PostgreSQL external olmalı.

### Setup

1. **Vercel'de 2 proje oluştur**:
   - `nuxt-blog-frontend` (root directory: `.`)
   - `nuxt-blog-cms` (root directory: `cms`)

2. **Frontend projesi**:
   - Build Command: `pnpm build`
   - Output: `.output`
   - Env: `PAYLOAD_URL=https://nuxt-blog-cms.vercel.app`

3. **CMS projesi**:
   - Build Command: `cd cms && pnpm build`
   - Output: `cms/.next`
   - Env: `DATABASE_URL=<external PostgreSQL>`, `PAYLOAD_SECRET=...`

**Not**: Vercel'de SQLite çalışmaz (ephemeral filesystem). Mutlaka external PostgreSQL gerekli.

---

## 🚀 Seçenek 3: Render (Her İkisi)

Render hem frontend hem backend için uygun.

### Frontend - Render Static Site

1. **Render Dashboard** → "New Static Site"
2. **Build Command**: `pnpm build`
3. **Publish Directory**: `.output/public`
4. **Environment**: `PAYLOAD_URL=https://your-cms.onrender.com`

### CMS - Render Web Service

1. **Render Dashboard** → "New Web Service"
2. **Root Directory**: `cms`
3. **Build Command**: `pnpm build`
4. **Start Command**: `pnpm start`
5. **PostgreSQL Addon** ekle
6. **Environment**:
   ```
   DATABASE_URL=<Render PostgreSQL URL>
   PAYLOAD_SECRET=<güçlü secret>
   ```

---

## 🔧 Production için Gerekli Değişiklikler

### 1. PostgreSQL'e Geçiş

`cms/payload.config.ts` dosyasını güncelle:

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  // ...
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  // ...
})
```

`cms/package.json`'a ekle:
```json
"@payloadcms/db-postgres": "^3.0.0"
```

### 2. CORS & CSRF Güncelle

`cms/payload.config.ts`:
```ts
cors: [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://your-blog.vercel.app',
],
csrf: [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://your-blog.vercel.app',
],
```

### 3. Media Storage

Production'da local filesystem yerine cloud storage kullan:
- **AWS S3** + `@payloadcms/storage-s3`
- **Cloudinary** + `@payloadcms/storage-cloudinary`
- **Vercel Blob** (Vercel kullanıyorsan)

---

## 📝 Environment Variables Checklist

### Frontend (Vercel/Render)
```
PAYLOAD_URL=https://your-cms.railway.app
SITE_URL=https://your-blog.vercel.app
```

### CMS (Railway/Render)
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
PAYLOAD_SECRET=<güçlü random string>
NODE_ENV=production
FRONTEND_URL=https://your-blog.vercel.app
```

---

## ✅ Post-Deployment Checklist

- [ ] CMS admin paneli açılıyor mu? (`/admin`)
- [ ] Frontend CMS'den data çekiyor mu?
- [ ] CORS hatası yok mu?
- [ ] Images/media yükleniyor mu?
- [ ] SEO meta tags çalışıyor mu?
- [ ] Sitemap.xml erişilebilir mi? (`/sitemap.xml`)
- [ ] Production database'e seed data ekledin mi?

---

## 🐛 Troubleshooting

### CORS Hatası
- CMS'deki `cors` array'ine frontend URL'ini ekle
- Browser console'da exact error'u kontrol et

### Database Connection Failed
- `DATABASE_URL` formatını kontrol et (PostgreSQL connection string)
- Railway/Render'da database'in "Active" olduğunu kontrol et

### Images Yüklenmiyor
- Media storage'ı cloud'a taşı (S3, Cloudinary)
- Veya CMS'in public URL'ini kontrol et

### Build Fails
- `pnpm install` local'de çalışıyor mu kontrol et
- Build logs'u kontrol et (Vercel/Railway dashboard)

---

## 💰 Maliyet Tahmini (Aylık)

**Ücretsiz Tier:**
- Vercel: Ücretsiz (hobby plan yeterli)
- Railway: $5/ay (PostgreSQL dahil)
- Render: Ücretsiz (yavaş cold start olabilir)

**Toplam**: ~$5/ay (Railway) veya $0 (Render free tier)

---

## 🔐 Güvenlik Notları

1. **PAYLOAD_SECRET**: Güçlü random string kullan (32+ karakter)
2. **Database**: Production'da kesinlikle PostgreSQL
3. **CORS**: Sadece frontend domain'lerini whitelist'le
4. **Admin Panel**: İlk kullanıcıyı oluşturduktan sonra `/create-first-user` route'unu disable et

---

## 📚 Ek Kaynaklar

- [Vercel Nuxt Deployment](https://vercel.com/docs/frameworks/nuxt)
- [Railway Deployment](https://docs.railway.app/deploy/builds)
- [Payload CMS Deployment](https://payloadcms.com/docs/production/deployment)
