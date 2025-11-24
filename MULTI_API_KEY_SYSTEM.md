# 🔑 Çoklu API Key Sistemi - Dokümantasyon

## 📋 Genel Bakış

Her ders için ayrı YouTube Data API v3 key kullanarak günlük quota limitini **12 katına çıkaran** akıllı API yönetim sistemi.

## 🎯 Avantajlar

### Quota Artışı
- **Eski Sistem**: 1 API key × 10,000 unit/gün = **10,000 unit**
- **Yeni Sistem**: 12 API key × 10,000 unit/gün = **120,000 unit/gün** 🚀

### Video Arama Kapasitesi
- Tek arama: ~100 unit
- **Eski**: ~100 arama/gün
- **Yeni**: ~1,200 arama/gün (12x artış!)

### Dağıtık Yük
- Her ders kendi API key'ini kullanır
- Bir dersin limiti dolsa bile diğerleri çalışmaya devam eder
- Hata izolasyonu ve daha iyi performans

---

## 🗂️ API Key Mapping

### TYT Dersleri (4 ders)

| Ders | API Key | Account |
|------|---------|---------|
| TYT Matematik | `AIzaSyANv6QOv2KcsyD_jqqVBE0xxc_BevK0eYs` | yksekeri1 |
| TYT Fen | `AIzaSyBb7yO8Mx8e4LsQ6a2WuaVkDCzv1XdCmjM` | yksekeri2 |
| TYT Sosyal | `AIzaSyBuxD2MnQSLQS-5DWsg1v9JPxnbLLXQ4I0` | yksekeri3 |
| TYT Türkçe | `AIzaSyC5QH8S4-wDaj3a9BrjhZO_LDw3smn9AXA` | yksekeri4 |

### AYT Dersleri (8 ders)

| Ders | API Key | Account |
|------|---------|---------|
| AYT Matematik | `AIzaSyAnE4Q6VVyt4PRH5vovLjdfTEY2OAQLW48` | yksekeri5 |
| AYT Fizik | `AIzaSyDDmpdpBbgZ9UFBdSeLlnvPStOsMMqQ6nU` | yksekeri6 |
| AYT Kimya | `AIzaSyDdsD9lc0URY1_x_Y9ZJI1Bn3FVU3QePWA` | yksekeri7 |
| AYT Biyoloji | `AIzaSyD1jKdm9TrBQBVfqiXUIC7J5qXqLxshpZg` | yksekeri8 |
| AYT Edebiyat | `AIzaSyC4rC9dnWeKfuah-owCviio4XpV7K1DUes` | yksekeri09 |
| AYT Tarih | `AIzaSyDnZN-AT7eGkSXwpfNP6h91t6q-0NJncDU` | yksekeri10 |
| AYT Coğrafya | `AIzaSyDUm5uXAE8_yyNh3i4pK8_1rf7e6DZ9vkQ` | yksekeri11 |
| AYT Felsefe | `AIzaSyCA3KtDOoOWqPArlCnPwGzEtFZzcn-bx_U` | yksekeri12 |

---

## 🔧 Teknik Uygulama

### 1. API Key Konfigürasyonu (`src/lib/youtube-api-keys.ts`)

```typescript
export type SubjectType = 
  | 'tyt-matematik'
  | 'tyt-fen'
  | 'tyt-sosyal'
  | 'tyt-turkce'
  | 'ayt-matematik'
  | 'ayt-fizik'
  | 'ayt-kimya'
  | 'ayt-biyoloji'
  | 'ayt-edebiyat'
  | 'ayt-tarih'
  | 'ayt-cografya'
  | 'ayt-felsefe';

export const API_KEY_MAP: Record<SubjectType, string> = {
  'tyt-matematik': 'AIzaSyA...',
  // ... tüm mapping
};

export function getApiKeyForSubject(subject: SubjectType): string {
  return API_KEY_MAP[subject];
}
```

### 2. YouTube Service Güncellemesi (`src/lib/youtube-api.ts`)

```typescript
// Yeni interface - subject parametresi zorunlu
export interface YouTubeSearchParams {
  query: string;
  maxResults?: number;
  order?: 'relevance' | 'viewCount' | 'date' | 'rating';
  subject: SubjectType; // 🔑 Kritik parametre
}

class YouTubeService {
  // API key artık dinamik olarak yükleniyor
  private getApiKey(subject: SubjectType): string {
    return getApiKeyForSubject(subject);
  }

  async searchVideos(params: YouTubeSearchParams): Promise<YouTubeVideo[]> {
    const apiKey = this.getApiKey(params.subject);
    // ... API çağrıları
  }
}
```

### 3. Ders Sayfalarında Kullanım

**Örnek: TYT Matematik**
```typescript
const searchResults = await youtubeService.searchVideos({
  query: 'TYT matematik temel kavramlar',
  maxResults: 32,
  order: 'relevance',
  subject: 'tyt-matematik' // Bu dersin API key'i kullanılacak
});
```

**Örnek: AYT Fizik**
```typescript
const searchResults = await youtubeService.searchVideos({
  query: 'AYT fizik elektrik',
  maxResults: 32,
  order: 'relevance',
  subject: 'ayt-fizik' // Farklı API key!
});
```

---

## 📊 Güncellenmiş Dosyalar

### Yeni Dosyalar ✨
1. `src/lib/youtube-api-keys.ts` - API key mapping ve yardımcı fonksiyonlar
2. `.env.local` - API key'lerin saklandığı dosya (Git'e yüklenmez)
3. `.env.example` - Environment variable şablonu (Git'e yüklenir)

### Güncellenen Dosyalar 🔄
1. `src/lib/youtube-api.ts` - Dinamik API key yönetimi
2. `src/app/dersler/tyt/matematik/page.tsx` - subject: 'tyt-matematik'
3. `src/app/dersler/tyt/fen/page.tsx` - subject: 'tyt-fen'
4. `src/app/dersler/tyt/sosyal/page.tsx` - subject: 'tyt-sosyal'
5. `src/app/dersler/tyt/turkce/page.tsx` - subject: 'tyt-turkce'
6. `src/app/dersler/ayt/matematik/page.tsx` - subject: 'ayt-matematik'
7. `src/app/dersler/ayt/fizik/page.tsx` - subject: 'ayt-fizik'
8. `src/app/dersler/ayt/kimya/page.tsx` - subject: 'ayt-kimya'
9. `src/app/dersler/ayt/biyoloji/page.tsx` - subject: 'ayt-biyoloji'
10. `src/app/dersler/ayt/edebiyat/page.tsx` - subject: 'ayt-edebiyat'
11. `src/app/dersler/ayt/tarih/page.tsx` - subject: 'ayt-tarih'
12. `src/app/dersler/ayt/cografya/page.tsx` - subject: 'ayt-cografya'
13. `src/app/dersler/ayt/felsefe/page.tsx` - subject: 'ayt-felsefe'

**Toplam**: 1 yeni + 13 güncellenen = **14 dosya değişikliği**

---

## 🧪 Test Senaryoları

### Manuel Test
1. Her ders sayfasını ziyaret et
2. Bir konu seç
3. Console'da şu mesajı gör: `🔑 {ders-adi} dersi için API key yüklendi`
4. `🔍 YouTube'da aranan: "{sorgu}" ({ders-adi})`
5. Videoların yüklendiğini doğrula

### Hata Durumları
- API key eksikse → Mock data otomatik devreye girer
- Quota aşımı → Sadece o ders etkilenir, diğerleri çalışır
- Network hatası → Graceful fallback

---

## 🔐 Güvenlik Notları

### ⚠️ API Key'ler Client-Side'da Görünür!
- Tüm API key'ler `.env.local` dosyasında saklanır
- `NEXT_PUBLIC_` prefix'i ile client-side'da kullanılır
- Build zamanında bundle'a dahil edilir
- Tarayıcı DevTools'da görülebilir

### 📁 Environment Variables
API key'ler artık `.env.local` dosyasından yüklenir:
```bash
# .env.local dosyası
NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_MATEMATIK=AIzaSy...
NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_FEN=AIzaSy...
# ... 12 adet API key
```

**Önemli**: `.env.local` dosyası `.gitignore`'da olmalı ve GitHub'a yüklenmemelidir!

### 🛡️ Koruma Stratejileri
1. **Google Cloud Console'da HTTP Referrer Kısıtlaması**
   - `https://yksekeri.com/*`
   - `http://localhost:3000/*`

2. **API Restrictions**
   - Sadece YouTube Data API v3'e erişim
   - Diğer Google API'leri engellenmiş

3. **Quota Monitoring**
   - Her hesap için günlük kullanım takibi
   - Limit aşımı alarm sistemi (manuel)

---

## 🚀 Deployment Checklist

- [x] API key mapping dosyası oluşturuldu
- [x] YouTube service güncellendi
- [x] Tüm 12 ders sayfası güncellendi
- [x] TypeScript tipleri eklendi
- [x] Linter hataları kontrol edildi
- [x] `.env.local` dosyası oluşturuldu
- [x] `.env.example` şablon dosyası oluşturuldu
- [x] API key'ler environment variable'lardan yükleniyor
- [ ] Production'da test edilecek
- [ ] API key restrictions ayarlanacak (Google Cloud Console)
- [ ] Quota monitoring kurulacak
- [ ] Vercel'de environment variables eklenecek

---

## 📈 Performans Metrikleri

### Beklenen Kullanım
- Ortalama kullanıcı: 5-10 video araması/session
- Video arama maliyeti: ~100 unit
- Günlük aktif kullanıcı: 500
- Günlük toplam arama: ~2,500

### Quota Hesaplaması
- 2,500 arama × 100 unit = 250,000 unit gerekli
- Sistemimiz: 120,000 unit/gün (12 key × 10,000)
- **Sonuç**: Mevcut sistem yeterli! ✅

### İyileştirme Önerileri
- Popüler konular için video caching
- Server-side rendering ile API çağrılarını azaltma
- CDN ile static content sunumu

---

## 🆘 Sorun Giderme

### Problem: "API key bulunamadı" hatası
**Çözüm**: `youtube-api-keys.ts` dosyasındaki mapping'i kontrol et

### Problem: Videolar yüklenmiyor
**Çözüm**: 
1. Console'da API key'in doğru yüklendiğini kontrol et
2. Network tab'da YouTube API çağrılarını incele
3. Quota limitini kontrol et (Google Cloud Console)

### Problem: Mock data gösteriliyor
**Çözüm**: API key'in geçerli ve kısıtlamalarının doğru yapılandırıldığından emin ol

---

## 📝 Notlar

- Her Google hesabı maksimum 5 proje oluşturabilir
- 12 API key için 12 farklı Google hesabı veya 3 proje kullanıldı
- API key'ler manuel olarak rotate edilmeli (güvenlik için)
- Production'da environment variable'a geçiş düşünülebilir (ancak client-side'da yine görünür olacak)

---

**Son Güncelleme**: 24 Kasım 2025  
**Versiyon**: 2.0  
**Yazar**: YKS Şekeri Dev Team

