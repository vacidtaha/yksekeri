/**
 * TYT Matematik Video Cache Update Script
 * Her gece saat 05:00'da çalışacak
 * Tüm konuların videolarını YouTube'dan çekip JSON'a kaydeder
 */

const fs = require('fs');
const path = require('path');

// .env.local dosyasını yükle
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// TYT Matematik konuları
const topics = [
  { id: "temel-kavramlar", query: "TYT matematik temel kavramlar kümeler" },
  { id: "sayi-basamaklari", query: "TYT matematik sayı basamakları" },
  { id: "bolme-bolunebilme", query: "TYT matematik bölme bölünebilme kuralları" },
  { id: "rasyonel-sayilar", query: "TYT matematik rasyonel sayılar ondalık kesirler" },
  { id: "basit-esitsizlikler", query: "TYT matematik eşitsizlikler" },
  { id: "mutlak-deger", query: "TYT matematik mutlak değer" },
  { id: "uslu-sayilar", query: "TYT matematik üslü sayılar üs kuralları" },
  { id: "koklu-sayilar", query: "TYT matematik köklü sayılar" },
  { id: "carpanlara-ayirma", query: "TYT matematik çarpanlara ayırma" },
  { id: "oran-oranti", query: "TYT matematik oran orantı" },
  { id: "problemler", query: "TYT matematik problemler" },
  { id: "kumeler", query: "TYT matematik kümeler" },
  { id: "mantik", query: "TYT matematik mantık" },
  { id: "islem-moduler", query: "TYT matematik işlem modüler aritmetik" },
  { id: "fonksiyonlar", query: "TYT matematik fonksiyonlar giriş" },
  { id: "grafik-tablo", query: "TYT matematik grafik tablo okuma" },
  { id: "sayisal-yetenek", query: "TYT matematik sayısal yetenek akıl yürütme" },
  { id: "nokta-dogru-duzlem", query: "TYT geometri nokta doğru düzlem" },
  { id: "aci-aci-olculeri", query: "TYT geometri açı ölçüleri" },
  { id: "ucgenler", query: "TYT geometri üçgenler" },
  { id: "ucgen-aci-kenar", query: "TYT geometri üçgen açı kenar bağıntıları" },
  { id: "ucgen-alan", query: "TYT geometri üçgen alan" },
  { id: "aciortay-kenarortay", query: "TYT geometri açıortay kenarortay" },
  { id: "dik-ucgen-pisagor", query: "TYT geometri dik üçgen pisagor" },
  { id: "ikizkenar-eskenar", query: "TYT geometri ikizkenar eşkenar üçgen" },
  { id: "oklid-bagintilari", query: "TYT geometri öklid bağıntıları" },
  { id: "cokgenler", query: "TYT geometri çokgenler" },
  { id: "dortgenler", query: "TYT geometri dörtgenler paralelkenar" },
  { id: "cember-daire", query: "TYT geometri çember daire" },
  { id: "analitik-geometri", query: "TYT geometri analitik koordinat" },
  { id: "kati-cisimler", query: "TYT geometri katı cisimler hacim alan" }
];

// YouTube API key (TYT Matematik için)
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_MATEMATIK;
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
  console.log('\n🚀 TYT Matematik Cache Güncelleme Başladı');
  console.log(`⏰ ${new Date().toLocaleString('tr-TR')}\n`);

  if (!YOUTUBE_API_KEY) {
    console.error('❌ YouTube API key bulunamadı!');
    console.error('   NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_MATEMATIK environment variable\'ını ayarlayın.');
    process.exit(1);
  }

  const cacheData = {
    lastUpdated: new Date().toISOString(),
    subject: 'tyt-matematik',
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
  const outputPath = path.join(__dirname, '../public/cache/videos/tyt-matematik.json');
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

