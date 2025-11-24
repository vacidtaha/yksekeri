/**
 * AYT Matematik Video Cache Update Script
 * Her gece saat 05:00'da çalışacak
 * Tüm konuların videolarını YouTube'dan çekip JSON'a kaydeder
 */

const fs = require('fs');
const path = require('path');

// .env.local dosyasını yükle
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// AYT Matematik konuları (40 konu)
const topics = [
  // Matematik (25 konu)
  { id: "permutasyon", query: "AYT matematik permütasyon" },
  { id: "kombinasyon", query: "AYT matematik kombinasyon" },
  { id: "binom", query: "AYT matematik binom açılımı" },
  { id: "olasilik", query: "AYT matematik olasılık" },
  { id: "polinomlar", query: "AYT matematik polinomlar" },
  { id: "dereceden-denklemler", query: "AYT matematik dereceden denklemler" },
  { id: "karmasik-sayilar", query: "AYT matematik karmaşık sayılar" },
  { id: "esitsizlikler", query: "AYT matematik eşitsizlikler" },
  { id: "parabol", query: "AYT matematik parabol" },
  { id: "fonksiyonlar", query: "AYT matematik fonksiyonlar" },
  { id: "bileske-ters-fonksiyon", query: "AYT matematik bileşke ters fonksiyon" },
  { id: "trigonometri", query: "AYT matematik trigonometri" },
  { id: "logaritma", query: "AYT matematik logaritma" },
  { id: "ustel-fonksiyonlar", query: "AYT matematik üstel fonksiyonlar" },
  { id: "diziler", query: "AYT matematik diziler" },
  { id: "seriler", query: "AYT matematik seriler" },
  { id: "limit", query: "AYT matematik limit" },
  { id: "sureklilik", query: "AYT matematik süreklilik" },
  { id: "turev", query: "AYT matematik türev" },
  { id: "turev-uygulamalari", query: "AYT matematik türev uygulamaları" },
  { id: "integral", query: "AYT matematik integral" },
  { id: "belirli-belirsiz-integral", query: "AYT matematik belirli belirsiz integral" },
  { id: "alan-hesaplama", query: "AYT matematik alan hesaplama" },
  { id: "matrisler", query: "AYT matematik matrisler" },
  { id: "determinant", query: "AYT matematik determinant" },
  
  // Geometri (15 konu)
  { id: "dogruda-acilar", query: "AYT geometri doğruda açılar" },
  { id: "ucgende-acilar", query: "AYT geometri üçgende açılar" },
  { id: "ucgende-kenar-aci", query: "AYT geometri üçgende kenar açı" },
  { id: "aciortay-kenarortay-yukseklik", query: "AYT geometri açıortay kenarortay yükseklik" },
  { id: "ucgende-alan", query: "AYT geometri üçgende alan" },
  { id: "ucgende-eslik-benzerlik", query: "AYT geometri üçgende eşlik benzerlik" },
  { id: "dik-ucgen-oklid", query: "AYT geometri dik üçgen öklid" },
  { id: "trigonometri-ucgende", query: "AYT geometri trigonometri üçgende" },
  { id: "cokgenler", query: "AYT geometri çokgenler" },
  { id: "dortgenler", query: "AYT geometri dörtgenler yamuk paralelkenar" },
  { id: "cember", query: "AYT geometri çember" },
  { id: "daire", query: "AYT geometri daire" },
  { id: "kati-cisimler", query: "AYT geometri katı cisimler prizma silindir" },
  { id: "analitik-geometri-dogru", query: "AYT geometri analitik doğru" },
  { id: "analitik-geometri-cember-parabol", query: "AYT geometri analitik çember parabol" }
];

// YouTube API key (AYT Matematik için)
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_MATEMATIK;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * YouTube'dan video ara
 */
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
  console.log('\n🚀 AYT Matematik Cache Güncelleme Başladı');
  console.log(`⏰ ${new Date().toLocaleString('tr-TR')}\n`);

  if (!YOUTUBE_API_KEY) {
    console.error('❌ YouTube API key bulunamadı!');
    console.error('   NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_MATEMATIK environment variable\'ını ayarlayın.');
    process.exit(1);
  }

  const cacheData = {
    lastUpdated: new Date().toISOString(),
    subject: 'ayt-matematik',
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

  const outputPath = path.join(__dirname, '../public/cache/videos/ayt-matematik.json');
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

