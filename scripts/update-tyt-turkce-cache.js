/**
 * TYT Türkçe Video Cache Update Script
 * Her gece saat 05:00'da çalışacak
 * Tüm konuların videolarını YouTube'dan çekip JSON'a kaydeder
 */

const fs = require('fs');
const path = require('path');

// .env.local dosyasını yükle
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// TYT Türkçe konuları (sayfadaki konu başlıklarıyla AYNI olmalı!)
const topics = [
  { id: "sozcukte-anlam", query: "TYT Türkçe sözcükte anlam" },
  { id: "cumlede-anlam", query: "TYT Türkçe cümlede anlam" },
  { id: "paragrafta-anlam", query: "TYT Türkçe paragrafta anlam ana düşünce" },
  { id: "ses-bilgisi", query: "TYT Türkçe ses bilgisi ses olayları" },
  { id: "yazim-kurallari", query: "TYT Türkçe yazım kuralları imla" },
  { id: "noktalama", query: "TYT Türkçe noktalama işaretleri" },
  { id: "dil-bilgisi", query: "TYT Türkçe dil bilgisi yapı bilgisi" },
  { id: "anlatim-bozukluklari", query: "TYT Türkçe anlatım bozuklukları" },
  { id: "anlatim-turleri", query: "TYT Türkçe anlatım türleri düşünceyi geliştirme" },
  { id: "metin-turleri", query: "TYT Türkçe metin türleri okuma anlama" }
];

// YouTube API key (TYT Türkçe için)
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_TURKCE;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * YouTube'dan video ara
 */
async function searchYouTubeVideos(query, maxResults = 32) {
  try {
    console.log(`🔍 Aranıyor: "${query}"`);
    
    // Arama isteği
    const searchUrl = `${YOUTUBE_API_BASE}/search?` +
      `key=${YOUTUBE_API_KEY}&` +
      `q=${encodeURIComponent(query)}&` +
      `part=snippet&` +
      `type=video&` +
      `order=relevance&` +
      `maxResults=${maxResults}&` +
      `videoEmbeddable=true&` +
      `videoSyndicated=true&` +
      `relevanceLanguage=tr&` +
      `regionCode=TR`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      console.log(`⚠️ Video bulunamadı: ${query}`);
      return [];
    }

    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    // Video detayları isteği
    const detailsUrl = `${YOUTUBE_API_BASE}/videos?` +
      `key=${YOUTUBE_API_KEY}&` +
      `id=${videoIds}&` +
      `part=contentDetails,statistics,snippet`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    // Video formatla
    const videos = detailsData.items
      .filter(item => {
        // 5 dakika altındaki videoları filtrele
        const duration = item.contentDetails?.duration || '';
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (match) {
          const hours = parseInt((match[1] || '').replace('H', '')) || 0;
          const minutes = parseInt((match[2] || '').replace('M', '')) || 0;
          const seconds = parseInt((match[3] || '').replace('S', '')) || 0;
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          return totalSeconds >= 300; // 5 dakika
        }
        return true;
      })
      .map(item => ({
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnails: {
          default: item.snippet.thumbnails.default?.url || '',
          medium: item.snippet.thumbnails.medium?.url || '',
          high: item.snippet.thumbnails.high?.url || ''
        },
        duration: formatDuration(item.contentDetails.duration),
        viewCount: formatViewCount(item.statistics.viewCount || '0'),
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description || ''
      }));

    console.log(`✅ ${videos.length} video bulundu`);
    return videos;

  } catch (error) {
    console.error(`❌ Hata: ${query}`, error.message);
    return [];
  }
}

/**
 * Video süresini formatla
 */
function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
}

/**
 * View count formatla
 */
function formatViewCount(viewCount) {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Ana fonksiyon
 */
async function updateCache() {
  console.log('\n🚀 TYT Türkçe Cache Güncelleme Başladı');
  console.log(`⏰ ${new Date().toLocaleString('tr-TR')}\n`);

  if (!YOUTUBE_API_KEY) {
    console.error('❌ YouTube API key bulunamadı!');
    console.error('   NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_TURKCE environment variable\'ını ayarlayın.');
    process.exit(1);
  }

  const cacheData = {
    lastUpdated: new Date().toISOString(),
    subject: 'tyt-turkce',
    topics: {}
  };

  // Her konu için videoları çek
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`\n[${i + 1}/${topics.length}] ${topic.id}`);
    
    const videos = await searchYouTubeVideos(topic.query, 32);
    cacheData.topics[topic.id] = videos;

    // Rate limiting - her istekten sonra 1 saniye bekle
    if (i < topics.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // JSON'a kaydet
  const outputPath = path.join(__dirname, '../public/cache/videos/tyt-turkce.json');
  const outputDir = path.dirname(outputPath);

  // Klasör yoksa oluştur
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(cacheData, null, 2), 'utf-8');

  console.log('\n✅ Cache güncellendi!');
  console.log(`📁 Dosya: ${outputPath}`);
  console.log(`📊 Toplam konu: ${topics.length}`);
  console.log(`📹 Toplam video: ${Object.values(cacheData.topics).reduce((sum, videos) => sum + videos.length, 0)}`);
  console.log(`💾 Dosya boyutu: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
  console.log(`⏰ ${new Date().toLocaleString('tr-TR')}\n`);
}

// Script'i çalıştır
updateCache().catch(error => {
  console.error('\n❌ HATA:', error);
  process.exit(1);
});

