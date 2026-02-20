# 🚀 Hızlı Deployment Rehberi

## En Kolay Yol: Vercel (Frontend) + Railway (CMS)

### ⚡ 5 Dakikada Deploy

#### 1️⃣ Frontend'i Vercel'e Deploy Et

1. **GitHub'a push et**:
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Vercel'e git**: https://vercel.com/new
   - "Import Git Repository" → Repo'nu seç
   - **Root Directory**: `.` (boş bırak)
   - **Framework Preset**: Nuxt.js (otomatik algılanır)
   - **Build Command**: `pnpm build` (otomatik)
   - **Output Directory**: `.output` (otomatik)

3. **Environment Variables ekle**:
   - `PAYLOAD_URL` → Şimdilik boş bırak, CMS deploy ettikten sonra güncelle
   - `SITE_URL` → Vercel'in verdiği URL (örn: `https://your-blog.vercel.app`)

4. **Deploy** → İlk deploy başlar!

---

#### 2️⃣ CMS'i Railway'e Deploy Et

1. **Railway'e git**: https://railway.app/new
   - "Deploy from GitHub repo" → Repo'nu seç

2. **PostgreSQL ekle**:
   - "New" → "Database" → "Add PostgreSQL"
   - Railway otomatik `DATABASE_URL` env var ekler

3. **CMS servisini ayarla**:
   - "New" → "GitHub Repo" → Aynı repo'yu seç
   - **Root Directory**: `cms` yaz
   - **Start Command**: `pnpm start`
   - **Build Command**: `pnpm build`

4. **Environment Variables ekle**:
   - `DATABASE_URL` → PostgreSQL'den otomatik gelir ✅
   - `PAYLOAD_SECRET` → Random string oluştur:
     ```bash
     openssl rand -base64 32
     ```
   - `NODE_ENV` → `production`
   - `FRONTEND_URL` → Vercel'den aldığın URL (örn: `https://your-blog.vercel.app`)

5. **PostgreSQL adapter'ı ekle**:
   - `cms/package.json`'a ekle:
     ```json
     "dependencies": {
       "@payloadcms/db-postgres": "^3.0.0"
     }
     ```
   - `cms/payload.config.ts`'yi güncelle (DEPLOYMENT.md'deki örneğe göre)

6. **Deploy** → Railway otomatik build edip deploy eder!

7. **Domain'i al**:
   - Railway → Settings → "Generate Domain" → `your-cms.railway.app`

---

#### 3️⃣ Frontend'i Güncelle

1. **Vercel Dashboard** → Settings → Environment Variables
2. `PAYLOAD_URL` → Railway'den aldığın URL (`https://your-cms.railway.app`)
3. **Redeploy** → Deployments → "..." → "Redeploy"

---

#### 4️⃣ İlk Admin Kullanıcısını Oluştur

1. CMS admin panelini aç: `https://your-cms.railway.app/admin`
2. İlk kullanıcı kayıt formunu doldur
3. Artık blog'un hazır! 🎉

---

## ✅ Test Et

- ✅ Frontend: `https://your-blog.vercel.app`
- ✅ CMS Admin: `https://your-cms.railway.app/admin`
- ✅ API: `https://your-cms.railway.app/api/posts`

---

## 💰 Maliyet

- **Vercel**: Ücretsiz (hobby plan)
- **Railway**: $5/ay (PostgreSQL dahil) - İlk ay $5 credit var!

**Toplam**: İlk ay ücretsiz, sonra ~$5/ay

---

## 🐛 Sorun mu var?

### CORS Hatası
- Railway'de `FRONTEND_URL` env var'ı doğru mu?
- `cms/payload.config.ts`'de `cors` array'ine frontend URL'i eklendi mi?

### Database Connection Failed
- Railway'de PostgreSQL "Active" durumda mı?
- `DATABASE_URL` doğru mu? (Railway otomatik ekler)

### Build Fails
- Railway logs'u kontrol et: Deployments → "View Logs"
- `pnpm install` local'de çalışıyor mu?

---

## 📚 Detaylı Rehber

Tam detaylar için `DEPLOYMENT.md` dosyasına bak.
