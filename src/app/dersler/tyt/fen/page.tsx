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

export default function TytFenPage() {
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

  // TYT Fen Bilimleri Konu Başlıkları
  const topics: Topic[] = [
    {
      id: "fizik",
      title: "1. Fizik",
      color: "#007AFF",
      subTopics: [
        { id: "fizik-bilimine-giris", title: "Fizik Bilimine Giriş", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "madde-ozellikleri", title: "Madde ve Özellikleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "hareket-kuvvet", title: "Hareket ve Kuvvet", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "is-enerji-guc", title: "İş, Enerji ve Güç", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "isi-sicaklik-genlesme", title: "Isı, Sıcaklık ve Genleşme", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "elektrik-manyetizma", title: "Elektrik ve Manyetizma", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "basinc", title: "Basınç", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "dalgalar", title: "Dalgalar", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "aydinlanma-isik-golge", title: "Aydınlanma – Işık – Gölge", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "aynalar-mercekler", title: "Aynalar ve Mercekler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "modern-fizik", title: "Modern Fizik (Tanıtım Seviyesinde)", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    },
    {
      id: "kimya",
      title: "2. Kimya",
      color: "#34C759",
      subTopics: [
        { id: "kimya-bilimi-uygulama", title: "Kimya Bilimi ve Uygulama Alanları", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "atom-periyodik-sistem", title: "Atom ve Periyodik Sistem", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "kimyasal-turler-etkilesim", title: "Kimyasal Türler Arası Etkileşimler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "maddenin-halleri", title: "Maddenin Halleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "karisimlar", title: "Karışımlar", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "asit-baz-tuzlar", title: "Asit, Baz ve Tuzlar", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "kimyasal-hesaplamalar", title: "Kimyasal Hesaplamalar", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "kimyasal-tepkimeler-enerji", title: "Kimyasal Tepkimeler ve Enerji", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "endustriyel-canlilarda-kimya", title: "Endüstride ve Canlılarda Kimya", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    },
    {
      id: "biyoloji",
      title: "3. Biyoloji",
      color: "#FF9F0A",
      subTopics: [
        { id: "canlilar-ortak-ozellikler", title: "Canlıların Ortak Özellikleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "canlilar-siniflandirilmasi", title: "Canlıların Sınıflandırılması", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "hucre-organeller", title: "Hücre ve Organeller", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "hucre-zari-madde-gecisi", title: "Hücre Zarından Madde Geçişi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "canlilar-temel-bilesenler", title: "Canlıların Temel Bileşenleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "metabolizma", title: "Metabolizma", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "canlilar-enerji-donusumleri", title: "Canlılarda Enerji Dönüşümleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "nukleik-asitler-protein", title: "Nükleik Asitler ve Protein Sentezi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "hucre-bolunmeleri", title: "Hücre Bölünmeleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "kalitim-genetik", title: "Kalıtım (Genetik)", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "ekosistem-canlilar-iliski", title: "Ekosistem ve Canlılar Arası İlişkiler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "guncel-biyolojik-uygulamalar", title: "Güncel Biyolojik Uygulamalar", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    }
  ];

  // Progress tracking
  useEffect(() => {
    const saved = localStorage.getItem('tyt-fen-completed');
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (completedTopics.length > 0) {
      localStorage.setItem('tyt-fen-completed', JSON.stringify(completedTopics));
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
      // Fizik konuları
      "fizik-bilimine-giris": "TYT fizik bilimine giriş",
      "madde-ozellikleri": "TYT fizik madde özellikleri",
      "hareket-kuvvet": "TYT fizik hareket kuvvet",
      "is-enerji-guc": "TYT fizik iş enerji güç",
      "isi-sicaklik-genlesme": "TYT fizik ısı sıcaklık genleşme",
      "elektrik-manyetizma": "TYT fizik elektrik manyetizma",
      "basinc": "TYT fizik basınç",
      "dalgalar": "TYT fizik dalgalar",
      "aydinlanma-isik-golge": "TYT fizik aydınlanma ışık gölge",
      "aynalar-mercekler": "TYT fizik aynalar mercekler",
      "modern-fizik": "TYT fizik modern fizik",
      
      // Kimya konuları
      "kimya-bilimi-uygulama": "TYT kimya bilimi uygulama alanları",
      "atom-periyodik-sistem": "TYT kimya atom periyodik sistem",
      "kimyasal-turler-etkilesim": "TYT kimya kimyasal türler etkileşim",
      "maddenin-halleri": "TYT kimya maddenin halleri",
      "karisimlar": "TYT kimya karışımlar",
      "asit-baz-tuzlar": "TYT kimya asit baz tuzlar",
      "kimyasal-hesaplamalar": "TYT kimya kimyasal hesaplamalar",
      "kimyasal-tepkimeler-enerji": "TYT kimya kimyasal tepkimeler enerji",
      "endustriyel-canlilarda-kimya": "TYT kimya endüstri canlılar",
      
      // Biyoloji konuları
      "canlilar-ortak-ozellikler": "TYT biyoloji canlıların ortak özellikleri",
      "canlilar-siniflandirilmasi": "TYT biyoloji canlıların sınıflandırılması",
      "hucre-organeller": "TYT biyoloji hücre organeller",
      "hucre-zari-madde-gecisi": "TYT biyoloji hücre zarı madde geçişi",
      "canlilar-temel-bilesenler": "TYT biyoloji canlıların temel bileşenleri",
      "metabolizma": "TYT biyoloji metabolizma",
      "canlilar-enerji-donusumleri": "TYT biyoloji canlılar enerji dönüşümleri",
      "nukleik-asitler-protein": "TYT biyoloji nükleik asitler protein sentezi",
      "hucre-bolunmeleri": "TYT biyoloji hücre bölünmeleri",
      "kalitim-genetik": "TYT biyoloji kalıtım genetik",
      "ekosistem-canlilar-iliski": "TYT biyoloji ekosistem canlılar ilişki",
      "guncel-biyolojik-uygulamalar": "TYT biyoloji güncel uygulamalar"
    };

    return searchQueries[topicId] || `TYT fen ${topicId}`;
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
              TYT Fen Bilimleri
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
                          <Play className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 text-base">
                            Bu konu için video bulunamadı.
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            Lütfen başka bir konu seçin.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {videos.length > 0 && !videosLoading && (
                      <div className="mt-8 flex justify-center">
                        <div className="flex items-center gap-2">
                          {/* Previous Button */}
                          <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-lg transition-all duration-200 text-sm font-medium bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-4 h-4 mx-auto" />
                          </button>

                          {/* Page Numbers */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`w-10 h-10 rounded-lg transition-all duration-200 text-sm font-medium ${
                                currentPage === page
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                              }`}
                              style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                              }}
                            >
                              {page}
                            </button>
                          ))}

                          {/* Next Button */}
                          <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-lg transition-all duration-200 text-sm font-medium bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
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
      
      {/* YouTube Video Player */}
      <YouTubePlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={closePlayer}
      />
      
      <Footer />
    </div>
  );
} 