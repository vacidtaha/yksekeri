"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ChevronDown, ChevronRight, ChevronLeft, BookOpen, Play, CheckCircle, Loader2 } from "lucide-react";
import { YouTubeVideo, youtubeService } from "@/lib/youtube-api";
import { YouTubePlayer, VideoCard } from "@/components/ui/youtube-player";

interface SubTopic {
  id: string;
  title: string;
  completed?: boolean;
  hasVideo?: boolean;
  hasPDF?: boolean;
  hasQuiz?: boolean;
}

interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
  color: string;
  completedCount?: number;
}

export default function TytSosyalPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [showProgressWarning, setShowProgressWarning] = useState(true);
  
  // YouTube integration states
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 8;
  const totalPages = 4;
  
  // Current search query for channel videos
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');

  // TYT Sosyal Bilimler Konu Başlıkları
  const topics: Topic[] = [
    {
      id: "tarih",
      title: "1. Tarih",
      color: "#007AFF",
      subTopics: [
        { id: "tarih-bilimi", title: "Tarih Bilimi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "ilk-orta-cag-dunya", title: "İlk ve Orta Çağ'da Dünya", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "islamiyet-oncesi-turk", title: "İslamiyet Öncesi Türk Tarihi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "islam-tarihi-uygarlik", title: "İslam Tarihi ve Uygarlığı", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "turk-islam-devletleri", title: "Türk–İslam Devletleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "turkiye-tarihi-1071-1308", title: "Türkiye Tarihi (1071–1308)", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "osmanli-kurulus", title: "Osmanlı'nın Kuruluş Dönemi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "osmanli-yukselme", title: "Osmanlı'nın Yükselme Dönemi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "osmanli-duraklama-gerileme", title: "Osmanlı'nın Duraklama–Gerileme Dönemi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "yuzyl-osmanli", title: "Yüzyıl Osmanlı", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "yuzyl-baslari-osmanli", title: "Yüzyıl Başlarında Osmanlı ve Savaşlar", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "kurtulus-savasi-hazirlik", title: "Kurtuluş Savaşı Hazırlık Dönemi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "kurtulus-savasi-muharebeler", title: "Kurtuluş Savaşı Muharebeler Dönemi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "ataturk-ilke-inkilaplari", title: "Atatürk İlke ve İnkılapları", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "cagdas-turk-dunya-tarihi", title: "Çağdaş Türk ve Dünya Tarihi", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    },
    {
      id: "cografya",
      title: "2. Coğrafya",
      color: "#34C759",
      subTopics: [
        { id: "cografyaya-giris", title: "Coğrafya'ya Giriş", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "dunyanin-sekli-hareketleri", title: "Dünya'nın Şekli ve Hareketleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "iklim-hava-olaylari", title: "İklim ve Hava Olayları", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "yeryuzu-sekilleri", title: "Yeryüzü Şekilleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "su-toprak-bitki-ortusu", title: "Su, Toprak ve Bitki Örtüsü", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "beseri-cografya-nufus", title: "Beşeri Coğrafya ve Nüfus", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "yerlesme-ekonomik-faaliyetler", title: "Yerleşme ve Ekonomik Faaliyetler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "doga-insan-etkilesimi", title: "Doğa ve İnsan Etkileşimi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "turkiye-cografi-konum", title: "Türkiye'nin Coğrafi Konumu", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "harita-grafik-okuma", title: "Harita ve Grafik Okuma Becerileri", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    },
    {
      id: "felsefe",
      title: "3. Felsefe",
      color: "#FF9F0A",
      subTopics: [
        { id: "felsefenin-tanimi-ozellikleri", title: "Felsefenin Tanımı ve Özellikleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "felsefenin-temel-alanlari", title: "Felsefenin Temel Alanları", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "bilgi-felsefesi", title: "Bilgi Felsefesi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "varlik-felsefesi", title: "Varlık Felsefesi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "ahlak-etik-felsefesi", title: "Ahlak (Etik) Felsefesi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "sanat-felsefesi", title: "Sanat Felsefesi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "siyaset-felsefesi", title: "Siyaset Felsefesi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "din-felsefesi", title: "Din Felsefesi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "bilim-felsefesi", title: "Bilim Felsefesi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "felsefi-dusuncenin-tarihi", title: "Felsefi Düşüncenin Tarihi Gelişimi", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    },
    {
      id: "din-kulturu",
      title: "4. Din Kültürü ve Ahlak Bilgisi",
      color: "#AF52DE",
      subTopics: [
        { id: "inanc-iman-esaslari", title: "İnanç (İman Esasları)", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "islam-dusuncesinde-yorumlar", title: "İslam Düşüncesinde Yorumlar ve Mezhepler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "islam-bilim-dusunce", title: "İslam ve Bilim–Düşünce İlişkisi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "islam-ahlaki-degerler", title: "İslam Ahlakı ve Değerler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "ibadetler", title: "İbadetler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "vahiy-din", title: "Vahiy ve Din", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "hz-muhammed-hayati", title: "Hz. Muhammed'in Hayatı ve Örnekliği", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "din-laiklik", title: "Din ve Laiklik", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "gunumuz-dini-ahlaki-sorunlar", title: "Günümüz Dinî ve Ahlaki Sorunlar", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "dinler-tarihi", title: "Dinler Tarihi", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    }
  ];

  // Progress tracking
  useEffect(() => {
    const saved = localStorage.getItem('tyt-sosyal-completed');
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (completedTopics.length > 0) {
      localStorage.setItem('tyt-sosyal-completed', JSON.stringify(completedTopics));
    }
  }, [completedTopics]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Her konu için özelleştirilmiş arama sorguları
  const getOptimizedSearchQuery = (topicId: string): string => {
    const searchQueries: Record<string, string> = {
      // Tarih konuları
      "tarih-bilimi": "TYT tarih bilimi",
      "ilk-orta-cag-dunya": "TYT tarih ilk orta çağ dünya",
      "islamiyet-oncesi-turk": "TYT tarih İslamiyet öncesi Türk tarihi",
      "islam-tarihi-uygarlik": "TYT tarih İslam tarihi uygarlığı",
      "turk-islam-devletleri": "TYT tarih Türk İslam devletleri",
      "turkiye-tarihi-1071-1308": "TYT tarih Türkiye tarihi 1071 1308",
      "osmanli-kurulus": "TYT tarih Osmanlı kuruluş dönemi",
      "osmanli-yukselme": "TYT tarih Osmanlı yükselme dönemi",
      "osmanli-duraklama-gerileme": "TYT tarih Osmanlı duraklama gerileme",
      "yuzyl-osmanli": "TYT tarih 19. yüzyıl Osmanlı",
      "yuzyl-baslari-osmanli": "TYT tarih 20. yüzyıl başları Osmanlı",
      "kurtulus-savasi-hazirlik": "TYT tarih Kurtuluş Savaşı hazırlık",
      "kurtulus-savasi-muharebeler": "TYT tarih Kurtuluş Savaşı muharebeler",
      "ataturk-ilke-inkilaplari": "TYT tarih Atatürk ilke inkılap",
      "cagdas-turk-dunya-tarihi": "TYT tarih çağdaş Türk dünya tarihi",
      
      // Coğrafya konuları
      "cografyaya-giris": "TYT coğrafya giriş",
      "dunyanin-sekli-hareketleri": "TYT coğrafya dünya şekli hareketleri",
      "iklim-hava-olaylari": "TYT coğrafya iklim hava olayları",
      "yeryuzu-sekilleri": "TYT coğrafya yeryüzü şekilleri",
      "su-toprak-bitki-ortusu": "TYT coğrafya su toprak bitki örtüsü",
      "beseri-cografya-nufus": "TYT coğrafya beşeri nüfus",
      "yerlesme-ekonomik-faaliyetler": "TYT coğrafya yerleşme ekonomik",
      "doga-insan-etkilesimi": "TYT coğrafya doğa insan etkileşimi",
      "turkiye-cografi-konum": "TYT coğrafya Türkiye coğrafi konum",
      "harita-grafik-okuma": "TYT coğrafya harita grafik okuma",
      
      // Felsefe konuları
      "felsefenin-tanimi-ozellikleri": "TYT felsefe tanımı özellikleri",
      "felsefenin-temel-alanlari": "TYT felsefe temel alanları",
      "bilgi-felsefesi": "TYT felsefe bilgi felsefesi",
      "varlik-felsefesi": "TYT felsefe varlık felsefesi",
      "ahlak-etik-felsefesi": "TYT felsefe ahlak etik",
      "sanat-felsefesi": "TYT felsefe sanat felsefesi",
      "siyaset-felsefesi": "TYT felsefe siyaset felsefesi",
      "din-felsefesi": "TYT felsefe din felsefesi",
      "bilim-felsefesi": "TYT felsefe bilim felsefesi",
      "felsefi-dusuncenin-tarihi": "TYT felsefe düşünce tarihi",
      
      // Din Kültürü konuları
      "inanc-iman-esaslari": "TYT din kültürü inanç iman esasları",
      "islam-dusuncesinde-yorumlar": "TYT din kültürü İslam düşünce mezhep",
      "islam-bilim-dusunce": "TYT din kültürü İslam bilim düşünce",
      "islam-ahlaki-degerler": "TYT din kültürü İslam ahlak değer",
      "ibadetler": "TYT din kültürü ibadetler",
      "vahiy-din": "TYT din kültürü vahiy din",
      "hz-muhammed-hayati": "TYT din kültürü Hz Muhammed hayat",
      "din-laiklik": "TYT din kültürü din laiklik",
      "gunumuz-dini-ahlaki-sorunlar": "TYT din kültürü günümüz sorunlar",
      "dinler-tarihi": "TYT din kültürü dinler tarihi"
    };

    return searchQueries[topicId] || `TYT sosyal ${topicId}`;
  };

  const selectTopic = async (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentPage(1); // Yeni konu seçildiğinde sayfa 1'e dön
    
    // Seçilen konuya göre YouTube video arama
    const currentSubTopic = getCurrentSubTopicById(topicId);
    if (currentSubTopic) {
      setVideosLoading(true);
      setVideos([]);
      
      try {
        // Konuya özel optimize edilmiş sorgu
        const searchQuery = getOptimizedSearchQuery(topicId);
        setCurrentSearchQuery(searchQuery); // Arama sorgusunu sakla
        console.log(`🔍 Aranan konu: "${searchQuery}"`);
        
        const searchResults = await youtubeService.searchVideos({
          query: searchQuery,
          maxResults: 32, // 4 sayfa x 8 video = 32 video
          order: 'relevance'
        });
        setVideos(searchResults);
      } catch (error) {
        console.error('Video arama hatası:', error);
      } finally {
        setVideosLoading(false);
      }
    }
  };

  // Helper function to get subtopic by ID
  const getCurrentSubTopicById = (topicId: string) => {
    for (const topic of topics) {
      const subTopic = topic.subTopics.find(sub => sub.id === topicId);
      if (subTopic) return subTopic;
    }
    return null;
  };

  const markTopicComplete = (topicId: string) => {
    setCompletedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const getCurrentTopic = () => {
    if (!selectedTopic) return null;
    return topics.find(topic => 
      topic.subTopics.some(sub => sub.id === selectedTopic)
    );
  };

  const getCurrentSubTopic = () => {
    if (!selectedTopic) return null;
    for (const topic of topics) {
      const subTopic = topic.subTopics.find(sub => sub.id === selectedTopic);
      if (subTopic) return subTopic;
    }
    return null;
  };

  const getTopicProgress = (topic: Topic) => {
    const completedCount = topic.subTopics.filter(sub => 
      completedTopics.includes(sub.id)
    ).length;
    return Math.round((completedCount / topic.subTopics.length) * 100);
  };

  const getTotalProgress = () => {
    const totalSubTopics = topics.reduce((acc, topic) => acc + topic.subTopics.length, 0);
    return Math.round((completedTopics.length / totalSubTopics) * 100);
  };

  // Video player functions
  const playVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  // Pagination helper functions
  const getCurrentPageVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    return videos.slice(startIndex, endIndex);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#1d1d1d'}}>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <Header alwaysShow={true} />
      
      <div className="pt-32">
        {/* Ana Header */}
        <div className="text-center mb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-white"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
              TYT Sosyal Bilimler
            </h1>
            
            {/* Overall Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-400">Genel İlerleme</span>
                <span className="text-sm font-semibold" style={{color: '#007AFF'}}>{getTotalProgress()}%</span>
              </div>
              <div 
                className="w-full rounded-full h-2"
                style={{backgroundColor: 'rgba(255,255,255,0.1)'}}
              >
                <div 
                  className="h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${getTotalProgress()}%`,
                    background: 'linear-gradient(90deg, #007AFF 0%, #34C759 100%)'
                  }}
                ></div>
              </div>
            </div>
            
            <p className="text-lg text-gray-400 max-w-3xl mx-auto"
               style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
              Sağ panelden konu seçin, eğitici videolar izleyin, PDF materyallerini indirin ve pratik sorularla bilginizi pekiştirin. 
              <span style={{
                background: 'linear-gradient(135deg, #32D74B 0%, #30D158 25%, #34C759 50%, #30D158 75%, #32D74B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '600',
                backgroundSize: '200% 200%',
                animation: 'gradient 3s ease infinite'
              }}>
                Tamamladığınız konuları tıklayarak işaretleyin.
              </span>
            </p>
            
            {/* İlerleme Uyarısı */}
            {showProgressWarning && (
              <div className="max-w-2xl mx-auto mt-6">
                <div 
                  className="rounded-xl p-4 border relative"
                  style={{
                    backgroundColor: 'rgba(255, 149, 0, 0.1)',
                    borderColor: 'rgba(255, 149, 0, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <button
                    onClick={() => setShowProgressWarning(false)}
                    className="absolute top-3 right-3 text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    ✕
                  </button>
                  <p className="text-sm text-center leading-relaxed pr-6"
                     style={{ 
                       color: '#FF9500',
                       fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                     }}>
                    İlerleme durumunuz tarayıcıda önbelleği temizlemediğiniz sürece otomatik olarak kaydedilir. İstediğiniz zaman kaldığınız yerden devam edebilirsiniz.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ana İçerik - 3 Sütun */}
        <div className="w-full">
          <div className="flex min-h-[600px]">
            
            {/* Sol Sütun - PDF ve Sorular (0-30%) */}
            <div className="w-[30%] flex justify-center">
              <div className="sticky top-32 w-full max-w-xs">
                {selectedTopic ? (
                  <div className="space-y-4">
                    {/* PDF Özet */}
                    <div 
                      className="rounded-xl p-5 border border-white/8 hover:border-white/12 transition-all duration-200"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(15px)'
                      }}
                    >
                      <div className="mb-4">
                        <h3 className="font-semibold text-white text-sm mb-1"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                          {getCurrentSubTopic()?.title}
                        </h3>
                        <p className="text-xs text-gray-500">Konu Özeti</p>
                      </div>
                      
                      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        Bu konunun tüm önemli noktalarını, kurallarını ve ipuçlarını içeren kapsamlı özet. 
                        Hızlı tekrar için ideal.
                      </p>
                      
                      <button 
                        className="w-full py-2.5 rounded-lg transition-all duration-200 text-xs font-medium"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        PDF&apos;i Önizle
                      </button>
                    </div>

                    {/* Örnek Sorular */}
                    <div 
                      className="rounded-xl p-5 border border-white/8 hover:border-white/12 transition-all duration-200"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(15px)'
                      }}
                    >
                      <div className="mb-4">
                        <h3 className="font-semibold text-white text-sm mb-1"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                          İnteraktif Sorular
                        </h3>
                        <p className="text-xs text-gray-500">Sınavdan Örnek Sorular</p>
                      </div>
                      
                      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        Geçmiş TYT sınavlarından yayınlanmış örnek sorulardan ve yapay zeka&apos;nın ürettiği sorulardan 
                        oluşan {getCurrentSubTopic()?.title.toLowerCase()} soruları. Adım adım çözümlerle interaktif deneyim.
                      </p>
                      
                      <button 
                        className="w-full py-2.5 rounded-lg transition-all duration-200 text-xs font-medium"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        Kendini Test Et
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                         style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                      <BookOpen className="w-6 h-6 text-gray-500" />
                    </div>
                    <h3 className="text-base font-medium text-gray-400 mb-2"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      Konu Kaynakları
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-40 mx-auto">
                      Sağ panelden bir konu seçerek kaynaklara erişin
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Orta Sütun - YouTube Videoları (30-70%) */}
            <div className="w-[40%] flex justify-center">
              <div className="sticky top-40 w-full max-w-4xl">
                {selectedTopic ? (
                  <div>
                    <div className="mb-8">
                      <div className="mb-4">
                        <h2 className="text-2xl font-semibold text-white mb-1"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                          {getCurrentSubTopic()?.title}
                        </h2>
                        <p className="text-sm text-gray-400">
                          Seçilmiş eğitici videolar • {getCurrentTopic()?.title}
                          {videos.length > 0 && ` • Sayfa ${currentPage}/${totalPages}`}
                        </p>
                      </div>
                    </div>
                    
                    {/* YouTube Video Grid */}
                    <div className="space-y-4">
                      {videosLoading ? (
                        // Loading skeleton
                        Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="rounded-2xl p-5 border border-white/10" 
                               style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
                            <div className="flex items-start gap-5">
                              <div className="w-40 h-24 rounded-xl bg-gray-700 animate-pulse flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-700 rounded animate-pulse" />
                                <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
                                <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : videos.length > 0 ? (
                        // Real YouTube videos
                        getCurrentPageVideos().map((video) => (
                          <VideoCard
                            key={video.id}
                            video={video}
                            onClick={() => playVideo(video)}
                            currentQuery={currentSearchQuery}
                            onChannelVideoClick={(channelVideo) => playVideo(channelVideo)}
                          />
                        ))
                      ) : (
                        // No results state
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                               style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                            <Play className="w-8 h-8 text-gray-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-400 mb-2"
                              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                            Video bulunamadı
                          </h3>
                          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                            Bu konu için henüz video bulunamadı. Lütfen başka bir konu deneyin.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {videos.length > 0 && (
                      <div className="flex items-center justify-center mt-8 space-x-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                              currentPage === page
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                            style={{
                              backgroundColor: currentPage === page
                                ? 'rgba(0, 122, 255, 0.2)'
                                : 'rgba(255,255,255,0.05)',
                              border: currentPage === page
                                ? '1px solid rgba(0, 122, 255, 0.3)'
                                : '1px solid rgba(255,255,255,0.1)',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                            }}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-32">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                         style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                      <Play className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-400 mb-4"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      YouTube Eğitici Videolar
                    </h3>
                    <p className="text-gray-500 max-w-lg mx-auto leading-relaxed text-lg"
                       style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      Sağ panelden bir konu seçtiğinizde, o konuyu anlatan popüler YouTube eğitmenlerinin videoları burada görünecek. İstediğinizi seçip izleyebilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ Sütun - Konu Başlıkları (70-100%) */}
            <div className="w-[30%] flex justify-center">
              <div className="sticky top-40 w-full max-w-xs">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-xs text-gray-500 mr-3">
                    {completedTopics.length}/{topics.reduce((acc, topic) => acc + topic.subTopics.length, 0)}
                  </div>
                  <h3 className="text-lg font-semibold text-white"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Konu Başlıkları
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {topics.map((topic) => {
                    const topicProgress = getTopicProgress(topic);
                    const isTopicCompleted = topicProgress === 100;
                    
                    return (
                      <div key={topic.id}>
                        {/* Ana Başlık */}
                        <button
                          onClick={() => toggleSection(topic.id)}
                          className="w-full text-left p-4 rounded-xl transition-all duration-200 border hover:border-white/20"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(20px)',
                            borderColor: 'rgba(255,255,255,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.transform = 'translateY(0px)';
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-white"
                                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                                {topic.title}
                              </span>
                              {isTopicCompleted && (
                                <CheckCircle className="w-4 h-4" style={{color: '#34C759'}} />
                              )}
                            </div>
                            {openSections.includes(topic.id) ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div 
                                className="w-full rounded-full h-1.5"
                                style={{backgroundColor: 'rgba(255,255,255,0.1)'}}
                              >
                                <div 
                                  className="h-1.5 rounded-full transition-all duration-500 ease-out"
                                  style={{ 
                                    width: `${topicProgress}%`,
                                    backgroundColor: topic.color
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-xs font-medium text-gray-400">
                              {topicProgress}%
                            </div>
                          </div>
                        </button>

                        {/* Alt Başlıklar */}
                        {openSections.includes(topic.id) && (
                          <div className="mt-2 pl-2 space-y-1.5">
                            {topic.subTopics.map((subTopic) => {
                              const isCompleted = completedTopics.includes(subTopic.id);
                              const isSelected = selectedTopic === subTopic.id;
                              
                              return (
                                <button
                                  key={subTopic.id}
                                  onClick={() => selectTopic(subTopic.id)}
                                  className={`w-full text-left p-3 rounded-lg text-xs transition-all duration-200 ${
                                    isSelected
                                      ? 'text-white'
                                      : 'text-gray-300 hover:text-white'
                                  }`}
                                  style={{
                                    backgroundColor: isSelected 
                                      ? 'rgba(0, 122, 255, 0.15)' 
                                      : isCompleted 
                                        ? 'rgba(52, 199, 89, 0.1)' 
                                        : 'rgba(255,255,255,0.03)',
                                    border: isSelected 
                                      ? '1px solid rgba(0, 122, 255, 0.3)' 
                                      : isCompleted 
                                        ? '1px solid rgba(52, 199, 89, 0.2)' 
                                        : '1px solid rgba(255,255,255,0.06)',
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = isCompleted 
                                        ? 'rgba(52, 199, 89, 0.1)' 
                                        : 'rgba(255,255,255,0.03)';
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="leading-relaxed">{subTopic.title}</span>
                                    </div>
                                    
                                    {/* Completion Button */}
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markTopicComplete(subTopic.id);
                                      }}
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer ${
                                        isCompleted
                                          ? 'border-green-500 bg-green-500'
                                          : 'border-gray-500 hover:border-green-400'
                                      }`}
                                    >
                                      {isCompleted && (
                                        <CheckCircle className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />

      {/* YouTube Player Modal */}
      {selectedVideo && (
        <YouTubePlayer
          video={selectedVideo}
          isOpen={isPlayerOpen}
          onClose={closePlayer}
        />
      )}
    </div>
  );
} 