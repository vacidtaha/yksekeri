# 📧 EmailJS Kurulum Rehberi (2 Dakika!)

İletişim formu **EmailJS** ile çalışıyor - backend gerektirmiyor, tamamen ücretsiz! 🚀

## 🚀 Hızlı Kurulum (2 Dakika)

### 1️⃣ EmailJS Hesabı Oluşturun

1. [EmailJS.com](https://www.emailjs.com) adresine gidin
2. **Sign Up** ile ücretsiz hesap oluşturun
3. E-postanızı doğrulayın

### 2️⃣ E-posta Servisinizi Bağlayın

1. Dashboard'da **"Email Services"** sekmesine gidin
2. **"Add New Service"** butonuna tıklayın
3. E-posta sağlayıcınızı seçin:
   - **Gmail** (önerilen - en kolay)
   - Outlook
   - Yahoo
   - Veya başka bir sağlayıcı
4. **"Connect Account"** ile Gmail hesabınıza bağlanın
5. İzin verin
6. **Service ID**'yi kopyalayın (örn: `service_abc1234`)

### 3️⃣ E-posta Şablonu Oluşturun

1. **"Email Templates"** sekmesine gidin
2. **"Create New Template"** butonuna tıklayın
3. Aşağıdaki şablonu kullanın:

**Subject (Konu):**
```
YKS Şekeri İletişim - {{subject}}
```

**Body (İçerik):**
```
Yeni İletişim Formu Mesajı

👤 Ad Soyad: {{from_name}}
📧 E-posta: {{from_email}}
📱 Telefon: {{phone}}

📋 Konu: {{subject}}
🏷️ Kategori: {{category}}
⚡ Öncelik: {{priority}}

💬 Mesaj:
{{message}}

---
Bu mesaj YKS Şekeri iletişim formundan gönderildi.
https://yksekeri.com
```

4. **"Save"** deyin
5. **Template ID**'yi kopyalayın (örn: `template_xyz5678`)

### 4️⃣ Public Key'i Alın

1. Sol menüden **"Account"** (hesap ayarları) bölümüne gidin
2. **"General"** sekmesinde **"Public Key"** bölümünü bulun
3. Public Key'i kopyalayın (örn: `AbC123dEf456XYZ`)

### 5️⃣ Bilgileri .env.local Dosyasına Ekleyin

`.env.local` dosyasını açın ve şu satırları bulun:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Kopyaladığınız bilgileri yapıştırın:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc1234
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz5678
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=AbC123dEf456XYZ
```

### 6️⃣ Development Server'ı Yeniden Başlatın

```bash
npm run dev
```

## ✅ Test Edin

1. [http://localhost:3000/iletisim](http://localhost:3000/iletisim) sayfasına gidin
2. Formu doldurun
3. **"Mesajı Gönder"** butonuna tıklayın
4. Gmail kutunuzu kontrol edin! 📬

## 📊 Ücretsiz Plan

- ✅ **200 e-posta/ay** - Ücretsiz!
- ✅ Sınırsız template
- ✅ Spam koruması
- ✅ E-posta logları

## 🎨 E-posta Şablonu Özelleştirme

EmailJS dashboard'dan template'i istediğiniz gibi özelleştirebilirsiniz:

- HTML/CSS ile güzel görünüm
- Değişkenler: `{{from_name}}`, `{{message}}` vs.
- Farklı priority için farklı şablonlar

## 🔧 Sorun Giderme

### E-posta Gelmiyor?

1. **ID'leri kontrol edin:** `.env.local` dosyasında doğru mu?
2. **Server'ı yeniden başlatın:** `npm run dev` komutunu tekrar çalıştırın
3. **Spam klasörünü kontrol edin**
4. **EmailJS Dashboard:** [Logs](https://dashboard.emailjs.com/admin) sayfasından e-postaların durumunu görün
5. **Console'u kontrol edin:** Browser'da F12 → Console'da hata var mı?

### "Service ID Invalid" Hatası

- Service ID, Template ID ve Public Key'i doğru kopyaladığınızdan emin olun
- `.env.local` dosyasında `NEXT_PUBLIC_` öneki olmalı
- Tırnak işareti kullanmayın
- `.env.local` değişikliği sonrası server'ı yeniden başlatın

### Rate Limit Hatası

- Ücretsiz planda 200 e-posta/ay limiti var
- EmailJS dashboard'dan kullanımınızı kontrol edin
- Gerekirse ücretli plana geçin (1000 e-posta/ay $15)

## 🎯 Avantajları

✅ **Backend gerektirmiyor** - Sadece frontend, API route yok  
✅ **Tamamen ücretsiz** - 200 e-posta/ay  
✅ **Gmail'e direkt düşüyor** - Kendi hesabınıza  
✅ **2 dakika kurulum** - Çok basit  
✅ **Spam koruması** - reCAPTCHA entegrasyonu mevcut  
✅ **Auto-reply** - Kullanıcıya otomatik cevap gönderebilirsiniz  

## 📧 Otomatik Cevap Eklemek (Opsiyonel)

Kullanıcıya "Mesajınız alındı" e-postası göndermek için:

1. EmailJS'te ikinci bir template oluşturun
2. Kullanıcının e-postasına gönderecek şekilde ayarlayın
3. Form submit'te iki kez `emailjs.send()` çağırın:
   - Biri size
   - Biri kullanıcıya

## 🚀 Production'da Kullanım

Vercel'de deploy ederken:

1. Vercel dashboard'a gidin
2. Project'inizi seçin
3. **Settings** → **Environment Variables**
4. Şu 3 değişkeni ekleyin:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
5. **Save** deyin
6. Projeyi yeniden deploy edin

**Not:** `NEXT_PUBLIC_` prefix'i olan değişkenler client-side'da görünür olduğu için güvenli. EmailJS zaten public API kullanır.

## 🎉 Tamamlandı!

Artık iletişim formunuz tam çalışır durumda! 

- ✉️ E-postalar direkt Gmail'inize gelir
- 📊 Google Analytics'te form gönderimi kaydedilir
- 🎨 UI hiç değişmeden aynı kalır
- 🚀 Backend gerektirmez, tamamen ücretsiz!

---

**İpucu:** EmailJS dashboard'dan e-posta geçmişini görebilir, başarılı/başarısız gönderimler takip edebilirsiniz.

