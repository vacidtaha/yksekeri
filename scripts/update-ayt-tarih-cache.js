/**
 * AYT Tarih Video Cache Update Script
 * Her gece saat 05:00'da çalışacak
 * Tüm konuların videolarını YouTube'dan çekip JSON'a kaydeder
 */

const fs = require('fs');
const path = require('path');

// .env.local dosyasını yükle
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// AYT Tarih konuları (20 konu)
const topics = [
  // İlkçağ Tarihi (5 konu)
  { id: 'tarih-1-1', query: 'AYT tarih Mezopotamya Mısır medeniyetleri' },
  { id: 'tarih-1-2', query: 'AYT tarih Hitit devleti' },
  { id: 'tarih-1-3', query: 'AYT tarih Yunan medeniyeti' },
  { id: 'tarih-1-4', query: 'AYT tarih Roma imparatorluğu' },
  { id: 'tarih-1-5', query: 'AYT tarih İlkçağ Türk devletleri' },
  
  // Ortaçağ Tarihi (5 konu)
  { id: 'tarih-2-1', query: 'AYT tarih Bizans imparatorluğu' },
  { id: 'tarih-2-2', query: 'AYT tarih İslam tarihi medeniyeti' },
  { id: 'tarih-2-3', query: 'AYT tarih Türkiye Selçuklu devleti' },
  { id: 'tarih-2-4', query: 'AYT tarih Anadolu beylikleri' },
  { id: 'tarih-2-5', query: 'AYT tarih Haçlı seferleri' },
  
  // Osmanlı Tarihi (5 konu)
  { id: 'tarih-3-1', query: 'AYT tarih Osmanlı devleti kuruluş' },
  { id: 'tarih-3-2', query: 'AYT tarih Osmanlı klasik çağ' },
  { id: 'tarih-3-3', query: 'AYT tarih Osmanlı duraklama dönemi' },
  { id: 'tarih-3-4', query: 'AYT tarih Osmanlı gerileme dönemi' },
  { id: 'tarih-3-5', query: 'AYT tarih Osmanlı ıslahat hareketleri' },
  
  // Modern Türk Tarihi (5 konu)
  { id: 'tarih-4-1', query: 'AYT tarih Birinci Dünya Savaşı' },
  { id: 'tarih-4-2', query: 'AYT tarih Milli Mücadele' },
  { id: 'tarih-4-3', query: 'AYT tarih Türkiye Cumhuriyeti kuruluş' },
  { id: 'tarih-4-4', query: 'AYT tarih Atatürk ilkeleri inkılapları' },
  { id: 'tarih-4-5', query: 'AYT tarih çok partili hayat geçiş' }
];

// YouTube API key (AYT Tarih için)
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_TARIH;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

async function searchYouTubeVideos(query, maxResults = 32) {
  try {
    console.log(`🔍 Aranıyor: "${query}"`);
    
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

    const detailsUrl = `${YOUTUBE_API_BASE}/videos?` +
      `key=${YOUTUBE_API_KEY}&` +
      `id=${videoIds}&` +
      `part=contentDetails,statistics,snippet`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    const videos = detailsData.items
      .filter(item => {
        const duration = item.contentDetails?.duration || '';
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (match) {
          const hours = parseInt((match[1] || '').replace('H', '')) || 0;
          const minutes = parseInt((match[2] || '').replace('M', '')) || 0;
          const seconds = parseInt((match[3] || '').replace('S', '')) || 0;
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          return totalSeconds >= 300;
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

function formatViewCount(viewCount) {
  const count = parseInt(viewCount);
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

async function updateCache() {
  console.log('\n🚀 AYT Tarih Cache Güncelleme Başladı');
  console.log(`⏰ ${new Date().toLocaleString('tr-TR')}\n`);

  if (!YOUTUBE_API_KEY) {
    console.error('❌ YouTube API key bulunamadı!');
    console.error('   NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_TARIH environment variable\'ını ayarlayın.');
    process.exit(1);
  }

  const cacheData = {
    lastUpdated: new Date().toISOString(),
    subject: 'ayt-tarih',
    topics: {}
  };

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`\n[${i + 1}/${topics.length}] ${topic.id}`);
    const videos = await searchYouTubeVideos(topic.query, 32);
    cacheData.topics[topic.id] = videos;
    if (i < topics.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const outputPath = path.join(__dirname, '../public/cache/videos/ayt-tarih.json');
  const outputDir = path.dirname(outputPath);
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

updateCache().catch(error => {
  console.error('\n❌ HATA:', error);
  process.exit(1);
});

