# YouTube Data API v3 Kurulum Talimatları

## 🚀 **Adım 1: Google Cloud Console'a Giriş**

1. [Google Cloud Console](https://console.cloud.google.com/)'a git
2. Google hesabınla giriş yap
3. Yeni proje oluştur veya mevcut projeyi seç

## 🔑 **Adım 2: YouTube Data API v3'ü Aktifleştir**

1. Sol menüden "APIs & Services" > "Library" seç
2. "YouTube Data API v3" ara
3. API'yi seç ve "ENABLE" butonuna tık

## 🗝️ **Adım 3: API Key Oluştur**

1. "APIs & Services" > "Credentials" git
2. "+ CREATE CREDENTIALS" > "API key" seç
3. API key'ini kopyala

## 🔒 **Adım 4: API Key'i Kısıtla (Güvenlik)**

1. Oluşturduğun API key'e tıkla
2. "Application restrictions" bölümünde:
   - "HTTP referrers (web sites)" seç
   - `http://localhost:3000/*` ekle
   - `https://yourdomain.com/*` ekle (canlı site için)
3. "API restrictions" bölümünde:
   - "Restrict key" seç
   - "YouTube Data API v3" seç
4. "SAVE" tıkla

## ⚙️ **Adım 5: Projeye Entegre Et**

1. Proje dizininde `.env.local` dosyası oluştur:
```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSy...your_actual_api_key_here
```

2. Development server'ı yeniden başlat:
```bash
npm run dev
```

## 🎯 **Test Et**

1. TYT Matematik sayfasına git
2. Herhangi bir konu seç (örn: "Temel Kavramlar")
3. Gerçek YouTube videoları otomatik yüklenecek!

## 📊 **Quota Bilgisi**

- Günlük **10,000 unit** ücretsiz quota
- Tek video arama: ~100 unit
- Günde ~100 arama yapabilirsin (yeterli!)

## 🔧 **Sorun Giderme**

- API key çalışmıyorsa: Browser console'u kontrol et
- 403 hatası: API restrictions'ı kontrol et
- 429 hatası: Quota aşımı, yarın tekrar dene

---

**Not**: API key'i GitHub'a push etme! `.env.local` dosyası `.gitignore'da. 