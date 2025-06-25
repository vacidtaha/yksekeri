export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  duration: string;
  viewCount: string;
  publishedAt: string;
  description: string;
}

export interface YouTubeSearchParams {
  query: string;
  maxResults?: number;
  order?: 'relevance' | 'viewCount' | 'date' | 'rating';
}

class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
  }

  // Video süresini formatla (PT4M13S -> 4:13)
  private formatDuration(duration: string): string {
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

  // View count'u formatla (1234567 -> 1.2M)
  private formatViewCount(viewCount: string): string {
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  // TYT Matematik konularına özel video arama
  async searchVideos(params: YouTubeSearchParams): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      console.warn('🔑 YouTube API key bulunamadı! Mock data kullanılıyor.');
      console.info('📋 Gerçek YouTube videoları için YOUTUBE_API_SETUP.md dosyasını kontrol edin.');
      return this.getMockVideos(params.query);
    }

    try {
      // Basit ve etkili arama sorgusu - YouTube'da ne arıyorsan o çıksın
      const searchQuery = params.query;
      
      console.log(`🔍 YouTube'da aranan: "${searchQuery}"`);
      
      // İlk arama isteği - video listesi
      const searchResponse = await fetch(
        `${this.baseUrl}/search?` +
        `key=${this.apiKey}&` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `part=snippet&` +
        `type=video&` +
        `order=${params.order || 'relevance'}&` +
        `maxResults=${params.maxResults || 20}&` +
        `videoEmbeddable=true&` +
        `videoSyndicated=true&` +
        `relevanceLanguage=tr&` +
        `regionCode=TR`
      );

      if (!searchResponse.ok) {
        throw new Error(`YouTube API error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const videoIds = searchData.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(',');

      // İkinci istek - video detayları (süre, görüntülenme sayısı)
      const detailsResponse = await fetch(
        `${this.baseUrl}/videos?` +
        `key=${this.apiKey}&` +
        `id=${videoIds}&` +
        `part=contentDetails,statistics,snippet`
      );

      if (!detailsResponse.ok) {
        throw new Error(`YouTube API error: ${detailsResponse.status}`);
      }

      const detailsData = await detailsResponse.json();

      // Verileri birleştir ve formatla
      const videos: YouTubeVideo[] = detailsData.items
        .filter((item: {
          contentDetails?: { duration?: string };
        }) => {
          // 5 dakika altındaki videoları filtrele
          const duration = item.contentDetails?.duration || '';
          const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
          if (match) {
            const hours = parseInt((match[1] || '').replace('H', '')) || 0;
            const minutes = parseInt((match[2] || '').replace('M', '')) || 0;
            const seconds = parseInt((match[3] || '').replace('S', '')) || 0;
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            
            // 5 dakika (300 saniye) altındaki videoları filtrele
            return totalSeconds >= 300;
          }
          return true;
        })
        .map((item: {
          id: string;
          snippet: {
            title: string;
            channelTitle: string;
            publishedAt: string;
            description?: string;
            thumbnails: {
              default?: { url: string };
              medium?: { url: string };
              high?: { url: string };
            };
          };
          contentDetails: { duration: string };
          statistics: { viewCount?: string };
        }) => ({
          id: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnails: {
            default: item.snippet.thumbnails.default?.url || '',
            medium: item.snippet.thumbnails.medium?.url || '',
            high: item.snippet.thumbnails.high?.url || '',
          },
          duration: this.formatDuration(item.contentDetails.duration),
          viewCount: this.formatViewCount(item.statistics.viewCount || '0'),
          publishedAt: item.snippet.publishedAt,
          description: item.snippet.description || '',
        }));

      console.log(`📺 YouTube'dan ${videos.length} video bulundu (sadece 5dk+ videolar)`);
      console.log(`🔍 Gevşek filtreleme başlıyor (12.sınıf, uzun videolar OK)...`);

      // TYT seviyesi için akıllı filtreleme
      const filteredVideos = videos.filter(video => {
        const title = video.title.toLowerCase();
        const description = video.description.toLowerCase();
        
        // Çok alakasız içerikleri filtrele
        const irrelevantKeywords = ['music', 'gaming', 'game', 'song', 'şarkı', 'müzik', 'oyun', 'clip', 'short'];
        const isIrrelevant = irrelevantKeywords.some(keyword => title.includes(keyword));
        
        // Sadece çok alakasız seviyelerini filtrele (ortaokul ve altı)
        const wrongGrades = ['5. sınıf', '6. sınıf', '7. sınıf', '8. sınıf', 'lgs', 'ortaokul', 'ilkokul'];
        const isWrongGrade = wrongGrades.some(grade => title.includes(grade) || description.includes(grade));
        
        // Sadece çok basit içerikleri filtrele
        const tooBasic = ['çocuk', 'oyun', 'eğlence', 'animasyon', 'çizgi'];
        const isInappropriateLevel = tooBasic.some(keyword => 
          title.includes(keyword) || description.includes(keyword)
        );
        
        return !isIrrelevant && !isWrongGrade && !isInappropriateLevel;
      }).slice(0, params.maxResults || 8);

      console.log(`🎯 Filtrelemeden sonra ${filteredVideos.length} video gösteriliyor`);
      
      return filteredVideos;

    } catch (error) {
      console.error('YouTube API error:', error);
      return this.getMockVideos(params.query);
    }
  }

  // API yokken test için gerçekçi mock data
  private getMockVideos(query: string): YouTubeVideo[] {
    // Gerçekçi YouTube thumbnail'ları
    const mockThumbnails = [
      'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg',
      'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
      'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
      'https://i.ytimg.com/vi/M7lc1UVf-VE/mqdefault.jpg',
      'https://i.ytimg.com/vi/GtL1huin9EE/mqdefault.jpg',
    ];

    // Gerçekçi kanal isimleri
    const channels = [
      'Matematik Akademi',
      'TYT Matematik Hocası',
      'Prof. Dr. Mehmet Yılmaz',
      'Öğretmen Ayşe',
      'Matematik Dersi',
      'YKS Matematik',
      'Online Matematik',
      'Kolay Matematik'
    ];

    // Video tipleri
    const videoTypes = [
      'Konu Anlatımı',
      'Soru Çözümü', 
      'Örnek Sorular',
      'Pratik Yöntemler',
      'Detaylı Açıklama',
      'Hızlı Tekrar',
      'Sınav Hazırlık',
      'Test Çözümü'
    ];

    // Rastgele süre ve görüntülenme
    const durations = ['8:24', '15:42', '22:18', '18:35', '12:07', '25:13', '16:28', '11:55'];
    const viewCounts = ['1.2K', '856', '634', '2.1K', '987', '1.8K', '445', '3.2K', '721', '1.5K'];

    // 6-8 video oluştur
    const videoCount = Math.floor(Math.random() * 3) + 6; // 6-8 video
    
    return Array.from({ length: videoCount }, (_, i) => {
      const randomChannel = channels[Math.floor(Math.random() * channels.length)];
      const randomType = videoTypes[Math.floor(Math.random() * videoTypes.length)];
      const randomThumbnail = mockThumbnails[Math.floor(Math.random() * mockThumbnails.length)];
      const randomDuration = durations[Math.floor(Math.random() * durations.length)];
      const randomViews = viewCounts[Math.floor(Math.random() * viewCounts.length)];
      
      return {
        id: `mock_${i + 1}_${Date.now()}`,
        title: `${query} - ${randomType}`,
        channelTitle: randomChannel,
        thumbnails: {
          default: randomThumbnail,
          medium: randomThumbnail,
          high: randomThumbnail,
        },
        duration: randomDuration,
        viewCount: randomViews,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: `${query} konusunu ${randomType.toLowerCase()} formatında detaylı olarak işliyoruz. ${randomChannel} kanalından matematik dersleri.`,
      };
    });
  }

  // Video embed URL'i oluştur
  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`;
  }
}

export const youtubeService = new YouTubeService(); 