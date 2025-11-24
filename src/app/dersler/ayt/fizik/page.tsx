"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FeedbackButton } from "@/components/ui/feedback-button";
import { ChevronDown, ChevronRight, ChevronLeft, BookOpen, Play, CheckCircle, Loader2, BarChart3 } from "lucide-react";
import Link from "next/link";
import { YouTubeVideo, youtubeService } from "@/lib/youtube-api";
import { YouTubePlayer, VideoCard } from "@/components/ui/youtube-player";
import { OnboardingTour } from "@/components/ui/onboarding-tour";
import Image from "next/image";
import * as gtag from "@/lib/gtag";
import { getCachedVideos } from "@/lib/video-cache";

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

export default function AytFizikPage() {
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

  // AYT Fizik Konu Başlıkları
  const topics: Topic[] = [
    {
      id: "mekanik",
      title: "1. Mekanik",
      color: "#8b5cf6",
      subTopics: [
        { id: "vektorler", title: "Vektörler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "bagil-hareket", title: "Bağıl Hareket", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "newton-hareket-yasalari", title: "Newton'un Hareket Yasaları", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "atislar", title: "Atışlar", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "is-guc-enerji", title: "İş, Güç ve Enerji", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "itme-momentum", title: "İtme – Momentum", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "tork-denge-agirlik", title: "Tork – Denge – Ağırlık Merkezi", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "basit-makineler", title: "Basit Makineler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "cembersel-hareket", title: "Çembersel Hareket", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "basit-harmonik-hareket", title: "Basit Harmonik Hareket (BHH)", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    },
    {
      id: "elektrik-manyetizma",
      title: "2. Elektrik ve Manyetizma",
      color: "#a78bfa",
      subTopics: [
        { id: "elektriksel-alan", title: "Elektriksel Alan – Potansiyel – İş", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "paralel-seri-devreler", title: "Paralel – Seri Devreler", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "kondansatorler", title: "Kondansatörler (Sığa)", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "manyetizma", title: "Manyetizma", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "induksiyon-ac", title: "İndüksiyon – Alternatif Akım (AC)", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    },
    {
      id: "dalgalar-optik",
      title: "3. Dalgalar ve Optik",
      color: "#a78bfa",
      subTopics: [
        { id: "dalga-mekanigi", title: "Dalga Mekaniği", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "su-yay-dalgalari", title: "Su Dalgaları ve Yay Dalgaları", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "ses-dalgalari", title: "Ses Dalgaları", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "elektromanyetik-dalgalar", title: "Elektromanyetik Dalgalar", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "aydinlanma-golge", title: "Aydınlanma – Gölge", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "aynalar-mercekler", title: "Aynalar – Mercekler (Geometrik Optik)", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    },
    {
      id: "modern-fizik",
      title: "4. Modern Fizik",
      color: "#c4b5fd",
      subTopics: [
        { id: "fotoelektrik-compton", title: "Fotoelektrik Olay – Compton Olayı", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "modern-fizik", title: "Modern Fizik", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "modern-fizik-uygulamalari", title: "Modern Fizik Uygulamaları", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "atom-modelleri", title: "Atom Modelleri", hasVideo: true, hasPDF: true, hasQuiz: true },
        { id: "nukleer-fizik", title: "Nükleer Fizik – Fisyon – Füzyon", hasVideo: true, hasPDF: true, hasQuiz: true }
      ]
    }
  ];

  // Progress tracking
  useEffect(() => {
    const saved = localStorage.getItem('ayt-fizik-completed');
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
    // Tüm konu başlıklarını açık başlat
    setOpenSections(topics.map(topic => topic.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sadece component mount olduğunda çalışsın

  useEffect(() => {
    if (completedTopics.length > 0) {
      localStorage.setItem('ayt-fizik-completed', JSON.stringify(completedTopics));
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
      // Mekanik konuları
      "vektorler": "AYT fizik vektörler",
      "bagil-hareket": "AYT fizik bağıl hareket",
      "newton-hareket-yasalari": "AYT fizik newton hareket yasaları",
      "atislar": "AYT fizik atışlar",
      "is-guc-enerji": "AYT fizik iş güç enerji",
      "itme-momentum": "AYT fizik itme momentum",
      "tork-denge-agirlik": "AYT fizik tork denge ağırlık merkezi",
      "basit-makineler": "AYT fizik basit makineler",
      "cembersel-hareket": "AYT fizik çembersel hareket",
      "basit-harmonik-hareket": "AYT fizik basit harmonik hareket",
      
      // Elektrik ve Manyetizma konuları
      "elektriksel-alan": "AYT fizik elektriksel alan potansiyel",
      "paralel-seri-devreler": "AYT fizik paralel seri devreler",
      "kondansatorler": "AYT fizik kondansatörler sığa",
      "manyetizma": "AYT fizik manyetizma",
      "induksiyon-ac": "AYT fizik indüksiyon alternatif akım",
      
      // Dalgalar ve Optik konuları
      "dalga-mekanigi": "AYT fizik dalga mekaniği",
      "su-yay-dalgalari": "AYT fizik su dalgaları yay dalgaları",
      "ses-dalgalari": "AYT fizik ses dalgaları",
      "elektromanyetik-dalgalar": "AYT fizik elektromanyetik dalgalar",
      "aydinlanma-golge": "AYT fizik aydınlanma gölge",
      "aynalar-mercekler": "AYT fizik aynalar mercekler geometrik optik",
      
      // Modern Fizik konuları
      "fotoelektrik-compton": "AYT fizik fotoelektrik compton olayı",
      "modern-fizik": "AYT fizik modern fizik",
      "modern-fizik-uygulamalari": "AYT fizik modern fizik uygulamaları",
      "atom-modelleri": "AYT fizik atom modelleri",
      "nukleer-fizik": "AYT fizik nükleer fizik fisyon füzyon"
    };

    return searchQueries[topicId] || `AYT fizik ${topicId}`;
  };

  const selectTopic = async (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentPage(1); // Yeni konu seçildiğinde sayfa 1'e dön
    
    // Seçilen konuya göre YouTube video arama
    const currentSubTopic = getCurrentSubTopicById(topicId);
    if (currentSubTopic) {
      gtag.trackTopicSelect(currentSubTopic.title, "AYT Fizik");
      setVideosLoading(true);
      setVideos([]);
      
      try {
        const searchQuery = getOptimizedSearchQuery(topicId);
        setCurrentSearchQuery(searchQuery);
        
        // 🔥 ÖNCELİKLE CACHE'E BAK
        console.log(`📦 Cache kontrol ediliyor: ayt-fizik - ${topicId}`);
        const cachedVideos = await getCachedVideos('ayt-fizik', topicId);
        
        if (cachedVideos && cachedVideos.length > 0) {
          // ✅ CACHE'DEN GELDİ - API'YE GİTMEDİK!
          console.log(`✅ ${cachedVideos.length} video cache'den yüklendi (API kullanılmadı)`);
          setVideos(cachedVideos);
        } else {
          // ❌ CACHE YOK - API'YE GİT
          console.log(`🔍 Cache bulunamadı, YouTube API'ye gidiliyor: "${searchQuery}"`);
          const searchResults = await youtubeService.searchVideos({
            query: searchQuery,
            maxResults: 32,
            order: 'relevance',
            subject: 'ayt-fizik'
          });
          setVideos(searchResults);
        }
      } catch (error) {
        console.error('Video arama hatası:', error);
      } finally {
        setVideosLoading(false);
      }
    }

    // Sayfanın en üstüne çık
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const isAlreadyCompleted = completedTopics.includes(topicId);
    setCompletedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
    if (!isAlreadyCompleted) {
      const currentSubTopic = getCurrentSubTopicById(topicId);
      if (currentSubTopic) {
        gtag.trackTopicComplete(currentSubTopic.title, "AYT Fizik");
      }
    }
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
    gtag.trackVideoPlay(video.title, video.id);
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
    <div className="min-h-screen text-white" style={{backgroundColor: '#1a0e27'}}>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <Header alwaysShow={true} />
      
      <div className="pt-20 lg:pt-32 pb-20 lg:pb-0">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-4 left-4 z-10">
          <Image
            src="/yks.png"
            alt="YKS Şekeri Logo"
            width={60}
            height={42}
            priority
            className="rounded-lg"
          />
        </div>

        {/* Ana Header */}
        <div className="text-center mb-6 lg:mb-12 px-3 lg:px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl lg:text-4xl xl:text-5xl font-light tracking-tight mb-3 lg:mb-6 text-white"
                style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
              AYT Fizik
            </h1>
            
            {/* Overall Progress Bar */}
            <div id="tour-progress-bar" className="max-w-xs lg:max-w-md mx-auto mb-4 lg:mb-6">
              <div className="flex justify-between items-center mb-2 lg:mb-3">
                <span className="text-xs lg:text-sm font-medium text-gray-400">Genel İlerleme</span>
                <span className="text-xs lg:text-sm font-semibold" style={{color: '#8b5cf6'}}>{getTotalProgress()}%</span>
              </div>
              <div 
                className="w-full rounded-full h-1.5 lg:h-2"
                style={{backgroundColor: 'rgba(255,255,255,0.1)'}}
              >
                <div 
                  className="h-1.5 lg:h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${getTotalProgress()}%`,
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)'
                  }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm lg:text-lg text-gray-400 max-w-2xl lg:max-w-3xl mx-auto px-2 lg:px-0"
               style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
              <span className="hidden lg:inline">Sağ panelden konu seçin, eğitici videolar izleyin, PDF materyallerini indirin ve pratik sorularla bilginizi pekiştirin.</span>
              <span className="lg:hidden">Aşağıdan konu seçin, videolar izleyin ve pratik yapın.</span>
              <span style={{
                background: 'linear-gradient(135deg, #32D74B 0%, #30D158 25%, #a78bfa 50%, #30D158 75%, #32D74B 100%)',
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
              <div className="max-w-xl lg:max-w-2xl mx-auto mt-4 lg:mt-6 px-2 lg:px-0">
                <div 
                  className="rounded-lg lg:rounded-xl p-3 lg:p-4 border relative"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <button
                    onClick={() => setShowProgressWarning(false)}
                    className="absolute top-2 right-2 lg:top-3 lg:right-3 text-violet-400 hover:text-violet-300 transition-colors w-6 h-6 lg:w-auto lg:h-auto flex items-center justify-center"
                  >
                    ✕
                  </button>
                  <p className="text-xs lg:text-sm text-center leading-relaxed pr-6 lg:pr-6"
                     style={{ 
                       color: '#a78bfa',
                       fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" 
                     }}>
                    İlerleme durumunuz tarayıcıda önbelleği temizlemediğiniz sürece otomatik olarak kaydedilir. İstediğiniz zaman kaldığınız yerden devam edebilirsiniz.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ana İçerik - Responsive Layout */}
        <div className="w-full">
          <div className="lg:flex lg:min-h-[600px]">
            
            {/* Sol Sütun - PDF ve Sorular (Desktop Only) */}
            <div className="hidden lg:flex lg:w-[30%] justify-center">
              <div id="tour-resources-panel" className="sticky top-32 w-full max-w-xs">
                {selectedTopic ? (
                  <div className="space-y-3 lg:space-y-4">
                    {/* PDF Özet */}
                    <div 
                      className="rounded-lg lg:rounded-xl p-3 lg:p-5 border border-white/8 hover:border-white/12 transition-all duration-200"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.05)',
                        backdropFilter: 'blur(15px)'
                      }}
                    >
                      <div className="mb-3 lg:mb-4">
                        <h3 className="font-semibold text-white text-xs lg:text-sm mb-1"
                            style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                          {getCurrentSubTopic()?.title}
                        </h3>
                        <p className="text-xs text-gray-500">Konu Özeti</p>
                      </div>
                      
                      <p className="text-xs text-gray-400 mb-3 lg:mb-4 leading-relaxed">
                        Bu konunun tüm önemli noktalarını, kurallarını ve ipuçlarını içeren kapsamlı özet. 
                        Hızlı tekrar için ideal.
                      </p>
                      
                      <button 
                        className="w-full py-2.5 rounded-lg transition-all duration-200 text-xs font-medium active:scale-[0.98]"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                        }}
                        onMouseEnter={(e) => {
                          if (window.innerWidth >= 1024) {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                          }
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
                      className="rounded-lg lg:rounded-xl p-3 lg:p-5 border border-white/8 hover:border-white/12 transition-all duration-200"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.05)',
                        backdropFilter: 'blur(15px)'
                      }}
                    >
                      <div className="mb-3 lg:mb-4">
                        <h3 className="font-semibold text-white text-xs lg:text-sm mb-1"
                            style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                          İnteraktif Sorular
                        </h3>
                        <p className="text-xs text-gray-500">Sınavdan Örnek Sorular</p>
                      </div>
                      
                      <p className="text-xs text-gray-400 mb-3 lg:mb-4 leading-relaxed">
                        Geçmiş AYT sınavlarından yayınlanmış örnek sorulardan ve yapay zeka&apos;nın ürettiği sorulardan 
                        oluşan {getCurrentSubTopic()?.title.toLowerCase()} soruları. Adım adım çözümlerle interaktif deneyim.
                      </p>
                      
                      <button 
                        className="w-full py-2.5 rounded-lg transition-all duration-200 text-xs font-medium active:scale-[0.98]"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                        }}
                        onMouseEnter={(e) => {
                          if (window.innerWidth >= 1024) {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                          }
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
                  <div className="text-center py-12 lg:py-16">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl mx-auto mb-3 lg:mb-4 flex items-center justify-center"
                         style={{backgroundColor: 'rgba(139, 92, 246, 0.08)'}}>
                      <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                    </div>
                    <h3 className="text-sm lg:text-base font-medium text-gray-400 mb-2"
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      Konu Kaynakları
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-500 leading-relaxed max-w-32 lg:max-w-40 mx-auto">
                      <span className="lg:hidden">Bir konu seçerek kaynaklara erişin</span>
                      <span className="hidden lg:inline">Sağ panelden bir konu seçerek kaynaklara erişin</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Orta Sütun - YouTube Videoları (Responsive) */}
            <div className="w-full lg:w-[40%] flex justify-center px-3 lg:px-0 mb-8 lg:mb-0">
              <div id="tour-videos-section" className="lg:sticky lg:top-40 w-full max-w-4xl">
                {selectedTopic ? (
                  <div>
                    <div className="mb-4 lg:mb-8">
                      <div className="mb-3 lg:mb-4">
                        <h2 className="text-lg lg:text-2xl font-semibold text-white mb-1"
                            style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                          {getCurrentSubTopic()?.title}
                        </h2>
                        <p className="text-xs lg:text-sm text-gray-400">
                          Seçilmiş eğitici videolar • {getCurrentTopic()?.title}
                          {videos.length > 0 && ` • Sayfa ${currentPage}/${totalPages}`}
                        </p>
                      </div>
                    </div>
                    
                    {/* YouTube Video Grid */}
                    <div className="space-y-3 lg:space-y-4">
                      {videosLoading ? (
                        // Loading skeleton
                        Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="rounded-xl lg:rounded-2xl p-3 lg:p-5 border border-white/10" 
                               style={{ backgroundColor: 'rgba(139, 92, 246, 0.08)', backdropFilter: 'blur(20px)' }}>
                            <div className="flex items-start gap-3 lg:gap-5">
                              <div className="w-24 h-16 lg:w-40 lg:h-24 rounded-lg lg:rounded-xl bg-gray-700 animate-pulse flex items-center justify-center">
                                <Loader2 className="w-6 h-6 lg:w-8 lg:h-8 text-gray-500 animate-spin" />
                              </div>
                              <div className="flex-1 space-y-2 lg:space-y-3">
                                <div className="h-3 lg:h-4 bg-gray-700 rounded animate-pulse" />
                                <div className="h-2 lg:h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
                                <div className="h-2 lg:h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
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
                      
                      {/* Pagination */}
                      {videos.length > 0 && !videosLoading && (
                        <div className="mt-6 lg:mt-8 flex justify-center">
                          <div className="flex items-center gap-1.5 lg:gap-2">
                            {/* Previous Button */}
                            <button
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg transition-all duration-200 text-xs lg:text-sm font-medium bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4 mx-auto" />
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg transition-all duration-200 text-xs lg:text-sm font-medium ${
                                  currentPage === page
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                                }`}
                                style={{
                                  fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                                }}
                              >
                                {page}
                              </button>
                            ))}

                            {/* Next Button */}
                            <button
                              onClick={() => goToPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg transition-all duration-200 text-xs lg:text-sm font-medium bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 lg:py-32">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full mx-auto mb-4 lg:mb-6 flex items-center justify-center"
                         style={{backgroundColor: 'rgba(139, 92, 246, 0.08)'}}>
                      <Play className="w-8 h-8 lg:w-10 lg:h-10 text-gray-600" />
                    </div>
                    <h3 className="text-lg lg:text-2xl font-medium text-gray-400 mb-3 lg:mb-4"
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      YouTube Eğitici Videolar
                    </h3>
                    <p className="text-gray-500 max-w-sm lg:max-w-lg mx-auto leading-relaxed text-sm lg:text-lg px-4 lg:px-0"
                       style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                      <span className="lg:hidden">Aşağıdan bir konu seçtiğinizde videolar burada görünecek.</span>
                      <span className="hidden lg:inline">Sağ panelden bir konu seçtiğinizde, o konuyu anlatan popüler YouTube eğitmenlerinin videoları burada görünecek. İstediğinizi seçip izleyebilirsiniz.</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ Sütun/Alt Kısım - Konu Başlıkları (Responsive) */}
            <div className="w-full lg:w-[30%] flex justify-center px-3 lg:px-0">
              <div id="tour-topics-panel" className="lg:sticky lg:top-40 w-full max-w-xs lg:max-w-xs">
                {/* İstatistikler Butonu */}
                <Link href="/istatistikler?subject=AYT Fizik#ayt" className="block mb-4">
                  <button
                    id="tour-statistics-button"
                    className="w-full py-2.5 px-4 rounded-lg lg:rounded-xl transition-all duration-200 border hover:border-white/30 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      backdropFilter: 'blur(20px)',
                      borderColor: 'rgba(139, 92, 246, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.25)';
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                    }}
                  >
                    <BarChart3 className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white"
                          style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                      Soru İstatistikleri
                    </span>
                  </button>
                </Link>

                <div className="flex items-center justify-center mb-4 lg:mb-6">
                  <div className="text-xs text-gray-500 mr-2 lg:mr-3">
                    {completedTopics.length}/{topics.reduce((acc, topic) => acc + topic.subTopics.length, 0)}
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-white"
                      style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    Konu Başlıkları
                  </h3>
                </div>
                
                <div className="space-y-2 lg:space-y-3">
                  {topics.map((topic) => {
                    const topicProgress = getTopicProgress(topic);
                    const isTopicCompleted = topicProgress === 100;
                    
                    return (
                      <div key={topic.id}>
                        {/* Ana Başlık */}
                        <button
                          onClick={() => toggleSection(topic.id)}
                          className="w-full text-left p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-200 border hover:border-white/20 active:scale-[0.98]"
                          style={{
                            backgroundColor: 'rgba(139, 92, 246, 0.08)',
                            backdropFilter: 'blur(20px)',
                            borderColor: 'rgba(255,255,255,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.12)';
                            if (window.innerWidth >= 1024) {
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.08)';
                            e.currentTarget.style.transform = 'translateY(0px)';
                          }}
                        >
                          <div className="flex items-center justify-between mb-2 lg:mb-3">
                            <div className="flex items-center gap-2 lg:gap-3">
                              <span className="text-sm lg:text-sm font-semibold text-white"
                                    style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                                {topic.title}
                              </span>
                              {isTopicCompleted && (
                                <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" style={{color: '#a78bfa'}} />
                              )}
                            </div>
                            {openSections.includes(topic.id) ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="flex-1">
                              <div 
                                className="w-full rounded-full h-1 lg:h-1.5"
                                style={{backgroundColor: 'rgba(255,255,255,0.1)'}}
                              >
                                <div 
                                  className="h-1 lg:h-1.5 rounded-full transition-all duration-500 ease-out"
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
                          <div className="mt-1.5 lg:mt-2 pl-1 lg:pl-2 space-y-1 lg:space-y-1.5">
                            {topic.subTopics.map((subTopic) => {
                              const isCompleted = completedTopics.includes(subTopic.id);
                              const isSelected = selectedTopic === subTopic.id;
                              
                              return (
                                <button
                                  key={subTopic.id}
                                  data-topic-id={subTopic.id}
                                  onClick={() => selectTopic(subTopic.id)}
                                  className={`w-full text-left p-2.5 lg:p-3 rounded-lg text-xs transition-all duration-200 active:scale-[0.98] ${
                                    isSelected
                                      ? 'text-white'
                                      : 'text-gray-300 hover:text-white'
                                  }`}
                                  style={{
                                    backgroundColor: isSelected 
                                      ? 'rgba(139, 92, 246, 0.15)' 
                                      : isCompleted 
                                        ? 'rgba(139, 92, 246, 0.1)' 
                                        : 'rgba(139, 92, 246, 0.05)',
                                    border: isSelected 
                                      ? '1px solid rgba(139, 92, 246, 0.3)' 
                                      : isCompleted 
                                        ? '1px solid rgba(139, 92, 246, 0.2)' 
                                        : '1px solid rgba(255,255,255,0.06)',
                                    fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                                    minHeight: '44px' // Touch-friendly minimum
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected && window.innerWidth >= 1024) {
                                      e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.12)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = isCompleted 
                                        ? 'rgba(139, 92, 246, 0.1)' 
                                        : 'rgba(139, 92, 246, 0.05)';
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 lg:gap-2 flex-1 min-w-0">
                                      <span className="leading-relaxed truncate">{subTopic.title}</span>
                                    </div>
                                    
                                    {/* Completion Button */}
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        markTopicComplete(subTopic.id);
                                      }}
                                      className={`w-6 h-6 lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer ${
                                        isCompleted
                                          ? 'border-violet-500 bg-violet-500'
                                          : 'border-gray-500 hover:border-violet-400'
                                      }`}
                                    >
                                      {isCompleted && (
                                        <CheckCircle className="w-3 h-3 lg:w-3 lg:h-3 text-white" />
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

      {/* YouTube Player Modal */}
      <YouTubePlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={closePlayer}
      />

      {/* Feedback Button - Desktop Only */}
      <FeedbackButton />

      {/* Mobil Test Bölümü - Konu Başlıklarının Altında */}
      {selectedTopic && (
        <div id="tour-resources-panel-mobile" className="lg:hidden px-4 py-6">
          <div 
            className="rounded-xl p-4 border border-white/8"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(15px)'
            }}
          >
            <div className="mb-3">
              <h3 className="font-semibold text-white text-sm mb-1"
                  style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                İnteraktif Sorular
              </h3>
              <p className="text-xs text-gray-500">Sınavdan Örnek Sorular</p>
            </div>
            
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Geçmiş AYT sınavlarından yayınlanmış örnek sorulardan ve yapay zeka&apos;nın ürettiği sorulardan 
              oluşan {getCurrentSubTopic()?.title.toLowerCase()} soruları. Adım adım çözümlerle interaktif deneyim.
            </p>
            
            <button 
              data-test-button="true"
              onClick={() => {
                const testButton = document.querySelector('[data-test-button="true"]');
                if (testButton) {
                  testButton.setAttribute('data-test-open', 'true');
                }
              }}
              className="w-full py-3 rounded-lg transition-all duration-200 text-sm font-medium active:scale-[0.98]"
              style={{
                backgroundColor: 'white',
                color: 'black',
                fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
              }}
            >
              Kendini Test Et
            </button>
          </div>
        </div>
      )}

      {/* Onboarding Tour */}
      <OnboardingTour
        storageKey="course-onboarding-tour-completed"
        steps={[
          {
            id: "progress",
            target: "#tour-progress-bar",
            title: "İlerleme Takibi",
            content: "İşte ilerleme çubuğun. Şu an boş ama umut var, belki bir gün dolar.",
            position: "bottom",
          },
          {
            id: "select-topic",
            target: "#tour-topics-panel",
            title: "Konu Seç",
            content: "Tamam, şimdi izlemek için bir konu seç. Evet, o kadar.",
            waitForAction: true,
            actionType: "select-topic",
            position: "left",
          },
          {
            id: "statistics",
            target: "#tour-statistics-button",
            title: "Soru İstatistikleri",
            content: "Bak burada soru istatistikleri var. Hangi konudan kaç soru çıkmış, hangi yıllarda ne sorulmuş, hepsi burada. İstersen bak, istersen geç. Ama bakarsan hangi konulara daha çok çalışman gerektiğini anlarsın.",
            waitForAction: false,
            position: "bottom",
          },
          {
            id: "videos",
            target: "#tour-videos-section",
            title: "Videolar",
            content: "Videolar burada. İzlemek istersen izle, istemezsen izleme. Zorla izletmiyoruz, rahat ol. Ama eğitici bitince izlersen daha iyi olur tabii.",
            waitForAction: false,
            position: "center",
          },
          {
            id: "mark-complete",
            target: "#tour-topics-panel",
            title: "Tamamlandı İşaretle",
            content: "İzlediğin diyelim sonrasında konunun yanındaki o küçük daireye tıklıyorsun. Hadi tıkla",
            waitForAction: true,
            actionType: "mark-complete",
            position: "left",
          },
          {
            id: "test",
            target: "#tour-resources-panel",
            title: "Çaldığımız Sorularla Kendini Test Et",
            content: "Son adım! Her sene sorular çalınıyordu bu senede biz çaldık buraya da ekledik git çöz (çalma kısmı şaka)",
            waitForAction: false,
            position: "right",
          },
        ]}
        onComplete={() => {
          console.log("Tour tamamlandı!");
        }}
        onActionComplete={(stepId, actionType) => {
          console.log(`Eylem tamamlandı: ${stepId} - ${actionType}`);
        }}
        selectedTopic={selectedTopic}
        isPlayerOpen={isPlayerOpen}
        completedTopics={completedTopics}
      />

      <Footer />
    </div>
  );
} 