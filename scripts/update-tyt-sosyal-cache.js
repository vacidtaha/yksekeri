/**
 * TYT Sosyal Bilimler Video Cache Update Script
 * Her gece saat 05:00'da çalışacak
 * Tüm konuların videolarını YouTube'dan çekip JSON'a kaydeder
 */

const fs = require('fs');
const path = require('path');

// .env.local dosyasını yükle
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// TYT Sosyal Bilimler konuları (45 konu)
const topics = [
  // Tarih (15 konu)
  { id: "tarih-bilimi", query: "TYT tarih bilimi" },
  { id: "ilk-orta-cag-dunya", query: "TYT tarih ilk orta çağ dünya" },
  { id: "islamiyet-oncesi-turk", query: "TYT tarih İslamiyet öncesi Türk tarihi" },
  { id: "islam-tarihi-uygarlik", query: "TYT tarih İslam tarihi uygarlığı" },
  { id: "turk-islam-devletleri", query: "TYT tarih Türk İslam devletleri" },
  { id: "turkiye-tarihi-1071-1308", query: "TYT tarih Türkiye tarihi 1071 1308" },
  { id: "osmanli-kurulus", query: "TYT tarih Osmanlı kuruluş dönemi" },
  { id: "osmanli-yukselme", query: "TYT tarih Osmanlı yükselme dönemi" },
  { id: "osmanli-duraklama-gerileme", query: "TYT tarih Osmanlı duraklama gerileme" },
  { id: "yuzyl-osmanli", query: "TYT tarih yüzyıl Osmanlı" },
  { id: "yuzyl-baslari-osmanli", query: "TYT tarih yüzyıl başları Osmanlı savaşlar" },
  { id: "kurtulus-savasi-hazirlik", query: "TYT tarih Kurtuluş Savaşı hazırlık" },
  { id: "kurtulus-savasi-muharebeler", query: "TYT tarih Kurtuluş Savaşı muharebeler" },
  { id: "ataturk-ilke-inkilaplari", query: "TYT tarih Atatürk ilke inkılapları" },
  { id: "cagdas-turk-dunya-tarihi", query: "TYT tarih çağdaş Türk dünya tarihi" },
  
  // Coğrafya (10 konu)
  { id: "cografyaya-giris", query: "TYT coğrafya giriş" },
  { id: "dunyanin-sekli-hareketleri", query: "TYT coğrafya dünya şekli hareketleri" },
  { id: "iklim-hava-olaylari", query: "TYT coğrafya iklim hava olayları" },
  { id: "yeryuzu-sekilleri", query: "TYT coğrafya yeryüzü şekilleri" },
  { id: "su-toprak-bitki-ortusu", query: "TYT coğrafya su toprak bitki örtüsü" },
  { id: "beseri-cografya-nufus", query: "TYT coğrafya beşeri nüfus" },
  { id: "yerlesme-ekonomik-faaliyetler", query: "TYT coğrafya yerleşme ekonomik" },
  { id: "doga-insan-etkilesimi", query: "TYT coğrafya doğa insan etkileşimi" },
  { id: "turkiye-cografi-konum", query: "TYT coğrafya Türkiye coğrafi konum" },
  { id: "harita-grafik-okuma", query: "TYT coğrafya harita grafik okuma" },
  
  // Felsefe (10 konu)
  { id: "felsefenin-tanimi-ozellikleri", query: "TYT felsefe tanım özellikler" },
  { id: "felsefenin-temel-alanlari", query: "TYT felsefe temel alanlar" },
  { id: "bilgi-felsefesi", query: "TYT felsefe bilgi felsefesi" },
  { id: "varlik-felsefesi", query: "TYT felsefe varlık felsefesi" },
  { id: "ahlak-etik-felsefesi", query: "TYT felsefe ahlak etik" },
  { id: "sanat-felsefesi", query: "TYT felsefe sanat felsefesi" },
  { id: "siyaset-felsefesi", query: "TYT felsefe siyaset felsefesi" },
  { id: "din-felsefesi", query: "TYT felsefe din felsefesi" },
  { id: "bilim-felsefesi", query: "TYT felsefe bilim felsefesi" },
  { id: "felsefi-dusuncenin-tarihi", query: "TYT felsefe felsefi düşünce tarihi" },
  
  // Din Kültürü (10 konu)
  { id: "inanc-iman-esaslari", query: "TYT din kültürü inanç iman esasları" },
  { id: "islam-dusuncesinde-yorumlar", query: "TYT din kültürü İslam düşünce yorumlar mezhepler" },
  { id: "islam-bilim-dusunce", query: "TYT din kültürü İslam bilim düşünce" },
  { id: "islam-ahlaki-degerler", query: "TYT din kültürü İslam ahlak değerler" },
  { id: "ibadetler", query: "TYT din kültürü ibadetler" },
  { id: "vahiy-din", query: "TYT din kültürü vahiy din" },
  { id: "hz-muhammed-hayati", query: "TYT din kültürü Hz Muhammed hayatı" },
  { id: "din-laiklik", query: "TYT din kültürü din laiklik" },
  { id: "gunumuz-dini-ahlaki-sorunlar", query: "TYT din kültürü günümüz dini ahlaki sorunlar" },
  { id: "dinler-tarihi", query: "TYT din kültürü dinler tarihi" }
];

// YouTube API key (TYT Sosyal için)
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_SOSYAL;
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
  console.log('\n🚀 TYT Sosyal Bilimler Cache Güncelleme Başladı');
  console.log(`⏰ ${new Date().toLocaleString('tr-TR')}\n`);

  if (!YOUTUBE_API_KEY) {
    console.error('❌ YouTube API key bulunamadı!');
    console.error('   NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_SOSYAL environment variable\'ını ayarlayın.');
    process.exit(1);
  }

  const cacheData = {
    lastUpdated: new Date().toISOString(),
    subject: 'tyt-sosyal',
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
  const outputPath = path.join(__dirname, '../public/cache/videos/tyt-sosyal.json');
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

