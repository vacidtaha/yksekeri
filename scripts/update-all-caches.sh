#!/bin/bash

# Tüm cache'leri güncelleme master script
# VPS'te cron job ile her gece saat 05:00'da çalışacak

echo "=========================================="
echo "🚀 YKS Şekeri - Tüm Cache Güncelleme"
echo "⏰ $(date '+%d.%m.%Y %H:%M:%S')"
echo "=========================================="
echo ""

# Proje dizinine git
cd /var/www/yksekeri

# Node.js ve npm'in yolunu kontrol et
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# Başlangıç zamanı
START_TIME=$(date +%s)

# TYT Dersleri
echo "📚 TYT DERSLERİ BAŞLIYOR..."
echo ""

echo "1/12 - TYT Matematik..."
node scripts/update-tyt-matematik-cache.js
echo ""

echo "2/12 - TYT Türkçe..."
node scripts/update-tyt-turkce-cache.js
echo ""

echo "3/12 - TYT Fen..."
node scripts/update-tyt-fen-cache.js
echo ""

echo "4/12 - TYT Sosyal..."
node scripts/update-tyt-sosyal-cache.js
echo ""

# AYT Dersleri
echo "📚 AYT DERSLERİ BAŞLIYOR..."
echo ""

echo "5/12 - AYT Matematik..."
node scripts/update-ayt-matematik-cache.js
echo ""

echo "6/12 - AYT Fizik..."
node scripts/update-ayt-fizik-cache.js
echo ""

echo "7/12 - AYT Kimya..."
node scripts/update-ayt-kimya-cache.js
echo ""

echo "8/12 - AYT Biyoloji..."
node scripts/update-ayt-biyoloji-cache.js
echo ""

echo "9/12 - AYT Edebiyat..."
node scripts/update-ayt-edebiyat-cache.js
echo ""

echo "10/12 - AYT Tarih..."
node scripts/update-ayt-tarih-cache.js
echo ""

echo "11/12 - AYT Coğrafya..."
node scripts/update-ayt-cografya-cache.js
echo ""

echo "12/12 - AYT Felsefe..."
node scripts/update-ayt-felsefe-cache.js
echo ""

# Bitiş zamanı
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo "=========================================="
echo "✅ TÜM CACHE'LER GÜNCELLENDİ!"
echo "⏱️  Toplam Süre: ${MINUTES} dakika ${SECONDS} saniye"
echo "⏰ $(date '+%d.%m.%Y %H:%M:%S')"
echo "=========================================="

# Cache dosyalarının boyutlarını göster
echo ""
echo "📦 Cache Dosyaları:"
ls -lh /var/www/yksekeri/public/cache/videos/ | tail -n +2
echo ""

