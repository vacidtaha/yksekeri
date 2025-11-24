"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as gtag from "@/lib/gtag";

function OdaklanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUI, setShowUI] = useState(true);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const hasRequestedFullscreen = useRef(false);
  
  // Kronometro state'leri
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [showStorageWarning, setShowStorageWarning] = useState(true);
  const [savedSessions, setSavedSessions] = useState<Array<{
    id: string;
    subject: string;
    duration: number;
    date: string;
    correct?: number;
    wrong?: number;
  }>>([]);

  // Tüm dersler listesi
  const allSubjects = [
    { category: 'DENEME', name: 'TYT Denemesi' },
    { category: 'DENEME', name: 'AYT Denemesi' },
    { category: 'TYT', name: 'TYT Türkçe' },
    { category: 'TYT', name: 'TYT Matematik' },
    { category: 'TYT', name: 'TYT Fen Bilimleri' },
    { category: 'TYT', name: 'TYT Sosyal Bilimler' },
    { category: 'AYT', name: 'AYT Matematik' },
    { category: 'AYT', name: 'AYT Fizik' },
    { category: 'AYT', name: 'AYT Kimya' },
    { category: 'AYT', name: 'AYT Biyoloji' },
    { category: 'AYT', name: 'AYT Edebiyat' },
    { category: 'AYT', name: 'AYT Tarih' },
    { category: 'AYT', name: 'AYT Coğrafya' },
    { category: 'AYT', name: 'AYT Felsefe' },
  ];

  // Tam ekran modunu aç
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowFullscreenPrompt(false);
      gtag.event({
        action: 'fullscreen_enter',
        category: 'Odaklan',
        label: 'Fullscreen Mode',
      });
    } catch (error) {
      console.log("Fullscreen hatası:", error);
    }
  }, []);

  // Tam ekrandan çık
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.log("Fullscreen çıkış hatası:", error);
    }
  }, []);

  // Ana sayfaya dön (content bölümüne)
  const goToHome = useCallback(async () => {
    // Analytics tracking
    gtag.event({
      action: 'exit_odaklan',
      category: 'Odaklan',
      label: 'Return to Homepage',
      value: timerSeconds > 0 ? Math.floor(timerSeconds / 60) : undefined,
    });
    
    // Tam ekrandaysa önce çık
    if (document.fullscreenElement) {
      await exitFullscreen();
    }
    router.push('/#content');
  }, [router, exitFullscreen, timerSeconds]);

  // Kronometro fonksiyonları
  const toggleTimer = useCallback(() => {
    if (isTimerRunning) {
      // Durdur
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setIsTimerRunning(false);
      gtag.event({
        action: 'timer_pause',
        category: 'Odaklan',
        label: selectedSubject || 'Genel',
        value: timerSeconds,
      });
    } else {
      // Başlat
      setIsTimerRunning(true);
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
      gtag.event({
        action: timerSeconds > 0 ? 'timer_resume' : 'timer_start',
        category: 'Odaklan',
        label: selectedSubject || 'Genel',
      });
    }
  }, [isTimerRunning, timerSeconds, selectedSubject]);

  const resetTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsTimerRunning(false);
    setTimerSeconds(0);
  }, []);

  // Tarih formatla
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    return `${formattedDate} ${formattedTime}`;
  }, []);

  // Kronometro formatı (HH:MM:SS)
  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // LocalStorage'dan kayıtları yükle
  useEffect(() => {
    const saved = localStorage.getItem('studySessions');
    if (saved) {
      try {
        setSavedSessions(JSON.parse(saved));
      } catch (e) {
        console.error('Kayıtlar yüklenemedi:', e);
      }
    }
  }, []);

  // Seans kaydet
  const saveSession = useCallback(() => {
    if (timerSeconds === 0) return;
    
    const newSession = {
      id: Date.now().toString(),
      subject: selectedSubject || 'Genel Çalışma',
      duration: timerSeconds,
      date: new Date().toISOString()
    };

    const updated = [newSession, ...savedSessions];
    setSavedSessions(updated);
    localStorage.setItem('studySessions', JSON.stringify(updated));
    
    // Analytics tracking
    gtag.event({
      action: 'study_session_save',
      category: 'Odaklan',
      label: selectedSubject || 'Genel Çalışma',
      value: Math.floor(timerSeconds / 60), // Dakika cinsinden
    });
    
    // Sıfırla
    resetTimer();
    setSelectedSubject('');
  }, [timerSeconds, selectedSubject, savedSessions, resetTimer]);

  // Kayıt güncelle
  const updateSession = useCallback((id: string, updates: { subject?: string; correct?: number; wrong?: number }) => {
    const updated = savedSessions.map(session => 
      session.id === id ? { ...session, ...updates } : session
    );
    setSavedSessions(updated);
    localStorage.setItem('studySessions', JSON.stringify(updated));
  }, [savedSessions]);

  // Kayıt sil
  const deleteSession = useCallback((id: string) => {
    const updated = savedSessions.filter(s => s.id !== id);
    setSavedSessions(updated);
    localStorage.setItem('studySessions', JSON.stringify(updated));
  }, [savedSessions]);

  // Cleanup - component unmount olduğunda timer'ı temizle
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Video otomatik oynatma
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay engellendi:", error);
      });
    }
  }, []);

  useEffect(() => {
    // Saat güncelleme
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fullscreen değişikliklerini dinle
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Ana sayfadan geliyorsa otomatik tam ekrana geç
  useEffect(() => {
    const autoFullscreen = searchParams.get('auto');
    if (autoFullscreen === 'true' && !hasRequestedFullscreen.current) {
      hasRequestedFullscreen.current = true; // Sadece bir kere çalışsın
      setShowFullscreenPrompt(false); // Prompt'u kapat
      // Kullanıcı etkileşimi gerektiği için biraz bekle
      const timer = setTimeout(() => {
        enterFullscreen();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, enterFullscreen]);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds();
    const showColon = seconds % 2 === 0; // Her saniye yanıp sönsün
    return { hours, minutes, showColon };
  };

  const formatDateDisplay = (date: Date) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    return `${day}, ${dateNum} ${month}`;
  };

  const ambientSounds = [
    { id: 'rain', name: 'Yağmur', file: '/sounds/rain.mp3' },
    { id: 'fire', name: 'Şömine', file: '/sounds/fire.mp3' },
    { id: 'ocean', name: 'Deniz', file: '/sounds/ocean.mp3' },
    { id: 'forest', name: 'Orman', file: '/sounds/forest.mp3' },
    { id: 'plane', name: 'Uçak', file: '/sounds/plane.mp3' },
    { id: 'traffic', name: 'Trafik', file: '/sounds/traffic.mp3' },
  ];

  const getSoundIcon = (soundId: string) => {
    // Her ses için uygun renk
    const getIconColor = () => {
      if (activeSound !== soundId) return '#ffffff'; // Pasif durum
      
      switch (soundId) {
        case 'rain': return '#60a5fa'; // Parlak mavi
        case 'fire': return '#f97316'; // Turuncu
        case 'ocean': return '#06b6d4'; // Turkuaz
        case 'forest': return '#22c55e'; // Yeşil
        case 'plane': return '#94a3b8'; // Açık gri
        case 'traffic': return '#facc15'; // Sarı (trafik ışığı)
        default: return '#ffffff';
      }
    };
    
    const iconColor = getIconColor();
    
    switch (soundId) {
      case 'rain':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            <path d="M12 16v6"/>
            <path d="M8 19v3"/>
            <path d="M16 19v3"/>
          </svg>
        );
      case 'fire':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
        );
      case 'ocean':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12c.6 1.1 1.6 2 2.8 2 1.5 0 2.5-1.2 3.5-2.5.9-1.2 2-2.5 3.7-2.5s2.8 1.3 3.7 2.5c1 1.3 2 2.5 3.5 2.5 1.2 0 2.2-.9 2.8-2"/>
            <path d="M2 17c.6 1.1 1.6 2 2.8 2 1.5 0 2.5-1.2 3.5-2.5.9-1.2 2-2.5 3.7-2.5s2.8 1.3 3.7 2.5c1 1.3 2 2.5 3.5 2.5 1.2 0 2.2-.9 2.8-2"/>
            <path d="M2 7c.6 1.1 1.6 2 2.8 2 1.5 0 2.5-1.2 3.5-2.5C9.2 5.3 10.3 4 12 4s2.8 1.3 3.7 2.5c1 1.3 2 2.5 3.5 2.5 1.2 0 2.2-.9 2.8-2"/>
          </svg>
        );
      case 'forest':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l4 7h-3v8h-2v-8H8l4-7z"/>
            <path d="M17 8l3 5h-2v7h-2v-7h-2l3-5z"/>
            <path d="M7 8l3 5H8v7H6v-7H4l3-5z"/>
          </svg>
        );
      case 'plane':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
          </svg>
        );
      case 'traffic':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <circle cx="12" cy="7" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="17" r="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const playSound = (soundId: string, soundFile: string) => {
    if (activeSound === soundId) {
      // Aynı sese tıklandıysa durdur
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setActiveSound(null);
      gtag.event({
        action: 'ambient_sound_stop',
        category: 'Odaklan',
        label: soundId,
      });
    } else {
      // Yeni ses çal
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(soundFile);
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(error => console.log('Ses oynatma hatası:', error));
      audioRef.current = audio;
      setActiveSound(soundId);
      gtag.event({
        action: 'ambient_sound_play',
        category: 'Odaklan',
        label: soundId,
      });
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Tam Ekran Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      >
        <source src="/film.mov" type="video/mp4" />
        <source src="/film.mov" type="video/quicktime" />
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>

      {/* Tam Ekran Başlatma Prompt */}
      {showFullscreenPrompt && !isFullscreen && (
        <div 
          className="fixed inset-0 flex items-center justify-center"
          style={{ 
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="text-center">
            <h1 
              className="text-4xl lg:text-6xl font-semibold text-white mb-6"
              style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
            >
              Odaklan
            </h1>
            <p 
              className="text-lg lg:text-xl text-white/60 mb-12 max-w-md mx-auto"
              style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
            >
              En iyi deneyim için tam ekran modunu başlatın
            </p>
            <button
              onClick={enterFullscreen}
              className="px-8 py-4 rounded-full font-medium text-lg transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: '#0071e3',
                color: '#ffffff',
              }}
            >
              Tam Ekran Başlat
            </button>
          </div>
        </div>
      )}

      {/* Arka Plan Sesleri - Sağ Üst */}
      {showUI && (
        <div
          style={{
            position: 'fixed',
            top: '32px',
            right: '32px',
            zIndex: 9999,
            display: 'flex',
            gap: '10px',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
        >
          {ambientSounds.map((sound) => (
            <div
              key={sound.id}
              className="group"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative'
              }}
            >
              {/* Ses İsmi - Hover'da Görünür */}
              <span 
                style={{ 
                  fontSize: '14px', 
                  color: 'white',
                  fontWeight: '500',
                  fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                  letterSpacing: '0.3px',
                  opacity: 0,
                  transform: 'translateX(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                  whiteSpace: 'nowrap'
                }}
                className="group-hover:opacity-100 group-hover:translate-x-0"
              >
                {sound.name}
              </span>
              
              {/* Ses Butonu */}
              <button
              onClick={() => playSound(sound.id, sound.file)}
                className="backdrop-blur-lg transition-all duration-300"
              style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                backgroundColor: activeSound === sound.id 
                    ? 'rgba(255, 255, 255, 0.25)' 
                    : 'rgba(255, 255, 255, 0.12)',
                border: activeSound === sound.id
                    ? '2px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: activeSound === sound.id
                    ? '0 8px 24px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                  cursor: 'pointer',
                  transform: activeSound === sound.id ? 'scale(1.05)' : 'scale(1)',
              }}
              aria-label={sound.name}
                onMouseEnter={(e) => {
                  if (activeSound !== sound.id) {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSound !== sound.id) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  }
                }}
              >
                <div style={{ 
                  transform: 'scale(0.85)',
                  filter: activeSound === sound.id ? 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3))' : 'none'
                }}>
              {getSoundIcon(sound.id)}
                </div>
              </button>
            </div>
          ))}

          {/* Kronometro Butonu */}
          <div
            className="group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              position: 'relative',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Kronometro Zamanı - Hover'da Görünür */}
            <span 
              style={{ 
                fontSize: '14px', 
                color: 'white',
                fontWeight: '500',
                fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                letterSpacing: '0.3px',
                opacity: 0,
                transform: 'translateX(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                whiteSpace: 'nowrap'
              }}
              className="group-hover:opacity-100 group-hover:translate-x-0"
            >
              {formatTimer(timerSeconds)}
              </span>
            
            {/* Kronometro Butonu */}
            <button
              onClick={() => {
                setShowTimerModal(true);
                gtag.event({
                  action: 'timer_modal_open',
                  category: 'Odaklan',
                  label: 'Study Timer',
                });
              }}
              className="backdrop-blur-lg transition-all duration-300"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: isTimerRunning 
                  ? 'rgba(34, 197, 94, 0.25)' 
                  : 'rgba(255, 255, 255, 0.12)',
                border: isTimerRunning
                  ? '2px solid rgba(34, 197, 94, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: isTimerRunning
                  ? '0 8px 24px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transform: isTimerRunning ? 'scale(1.05)' : 'scale(1)',
              }}
              aria-label={isTimerRunning ? "Kronometreyi Durdur" : "Kronometreyi Başlat"}
              title="Tek tıkla: Başlat/Durdur, Çift tıkla: Sıfırla"
              onMouseEnter={(e) => {
                if (!isTimerRunning) {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isTimerRunning) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                }
              }}
            >
              <div style={{ 
                transform: 'scale(0.85)',
                filter: isTimerRunning ? 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))' : 'none'
              }}>
                {/* Kronometro İkonu */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isTimerRunning ? '#22c55e' : '#ffffff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="13" r="8"/>
                  <path d="M12 9v4l2 2"/>
                  <path d="M5 3L3 5"/>
                  <path d="M19 3l2 2"/>
                  <path d="M10 2h4"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Şık Saat */}
      {showUI && (
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '80px',
          zIndex: 9999,
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          transition: 'opacity 0.3s ease',
          opacity: showUI ? 1 : 0
        }}
      >
        <div style={{ 
          fontSize: '80px', 
          fontWeight: '300', 
          color: 'white',
          lineHeight: '1',
          letterSpacing: '-2px',
          textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span>{formatTime(currentTime).hours}</span>
          <span style={{ 
            opacity: formatTime(currentTime).showColon ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}>:</span>
          <span>{formatTime(currentTime).minutes}</span>
        </div>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: '400', 
          color: 'rgba(255, 255, 255, 0.8)',
          marginTop: '12px',
          letterSpacing: '0.5px',
          textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)'
        }}>
          {formatDateDisplay(currentTime)}
        </div>
      </div>
      )}

      {/* Ayar Menüsü - Sol Alt */}
      <div 
        style={{ 
          position: 'fixed',
          bottom: '32px',
          left: '32px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'flex-start'
        }}
        onMouseEnter={() => setShowSettings(true)}
        onMouseLeave={() => setShowSettings(false)}
      >
        {/* Ayar Menü Butonları - Yukarıdan aşağıya */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          
          {/* Ana Ayar Butonu */}
          <button
            className="backdrop-blur-lg transition-all duration-300"
            style={{ 
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Ayarlar"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            {/* Ayar İkonu (Dişli) */}
            <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24" style={{ transform: 'scale(0.85)' }}>
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
      </button>

          {/* Hover Menü Butonları */}
          {showSettings && (
            <>
              {/* Gizle/Göster Butonu */}
      <button
        onClick={() => {
          setShowUI(!showUI);
          gtag.event({
            action: showUI ? 'ui_hide' : 'ui_show',
            category: 'Odaklan',
            label: 'Toggle UI',
          });
        }}
                className="backdrop-blur-lg transition-all duration-200"
        style={{ 
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  animation: 'slideDown 0.2s ease-out'
        }}
        aria-label={showUI ? "Gizle" : "Göster"}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                }}
      >
        {showUI ? (
                  <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24" style={{ transform: 'scale(0.85)' }}>
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
          </svg>
        ) : (
                  <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24" style={{ transform: 'scale(0.85)' }}>
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        )}
      </button>

              {/* Kapat Butonu - Ana Sayfaya Dön */}
      <button
                onClick={goToHome}
                className="backdrop-blur-lg transition-all duration-200"
                style={{ 
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  animation: 'slideDown 0.2s ease-out 0.05s backwards'
                }}
                aria-label="Ana Sayfaya Dön"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                {/* X İkonu (Kapat) - Kırmızı */}
                <svg className="w-6 h-6" fill="#ef4444" viewBox="0 0 24 24" style={{ transform: 'scale(0.85)' }}>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Kronometro Modal */}
      {showTimerModal && (
        <div
        style={{ 
          position: 'fixed',
            inset: 0,
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowTimerModal(false)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '1100px',
              height: '75vh',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '32px',
              padding: '40px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(60px)',
              animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#ffffff',
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              }}>
                Çalışma Takibi
              </h2>
              <button
                onClick={() => setShowTimerModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                title="Gizle"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" strokeWidth="0">
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
          </svg>
              </button>
            </div>

            {/* Ana İçerik - İki Kolon */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '380px 1fr',
              gap: '32px',
              flex: 1,
              minHeight: 0,
              overflow: 'hidden'
            }}>
              
              {/* Sol Taraf - Geçmiş */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#ffffff',
                    fontFamily: "'SF Pro Display', -apple-system, sans-serif"
                  }}>
                    Süre ve Başarı Takibi
                  </h3>
                  {savedSessions.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Tüm geçmişi silmek istediğinizden emin misiniz?')) {
                          setSavedSessions([]);
                          localStorage.removeItem('studySessions');
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                    >
                      Tümünü Sil
                    </button>
                  )}
                </div>

                {/* Uyarı Mesajı */}
                {showStorageWarning && (
                  <div style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <p style={{
                      fontSize: '11px',
                      color: 'rgba(251, 191, 36, 0.9)',
                      fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                      lineHeight: '1.4',
                      flex: 1
                    }}>
                      Kayıtlarınız tarayıcıda önbelleği temizlemediğiniz sürece otomatik olarak kaydedilir. İstediğiniz zaman kaldığınız yerden devam edebilirsiniz.
                    </p>
                    <button
                      onClick={() => setShowStorageWarning(false)}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(251, 191, 36, 0.2)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.2)';
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                )}

                <div style={{
                  height: 'calc(75vh - 200px)',
                  overflowY: 'auto',
                  paddingRight: '8px'
                }}>
                  {savedSessions.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontFamily: "'SF Pro Text', -apple-system, sans-serif"
                    }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <p>Henüz kayıt yok</p>
                      <p style={{ fontSize: '13px', marginTop: '8px' }}>İlk seansı başlat</p>
                    </div>
                  ) : (
                    savedSessions.map((session) => (
                      <div
                        key={session.id}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '10px',
                          padding: '10px',
                          marginBottom: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '8px' }}>
                            {editingNameId === session.id ? (
                              <input
                                type="text"
                                defaultValue={session.subject}
                                onBlur={(e) => {
                                  if (e.target.value.trim()) {
                                    updateSession(session.id, { subject: e.target.value });
                                  }
                                  setEditingNameId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    if (e.currentTarget.value.trim()) {
                                      updateSession(session.id, { subject: e.currentTarget.value });
                                    }
                                    setEditingNameId(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingNameId(null);
                                  }
                                }}
                                autoFocus
                                style={{
                                  flex: 1,
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(59, 130, 246, 0.4)',
                                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                  color: '#ffffff',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                                  outline: 'none'
                                }}
                              />
                            ) : (
                              <>
                                <h4 style={{
                                  fontSize: '15px',
                                  fontWeight: '600',
                                  color: session.subject === 'Genel Çalışma' ? 'rgba(255, 255, 255, 0.6)' : '#ffffff',
                                  fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                                  fontStyle: session.subject === 'Genel Çalışma' ? 'italic' : 'normal'
                                }}>
                                  {session.subject}
                                </h4>
                                <button
                                  onClick={() => setEditingNameId(session.id)}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: 0.6
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.opacity = '1';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.opacity = '0.6';
                                  }}
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
                                </button>
                              </>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                            <span style={{
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#22c55e',
                              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                              fontVariantNumeric: 'tabular-nums'
                            }}>
                              {formatTimer(session.duration)}
                            </span>
                            <button
                              onClick={() => deleteSession(session.id)}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
      </button>
                          </div>
                        </div>
                        
                        {/* Doğru/Yanlış Gösterimi veya Düzenleme */}
                        {editingId === session.id && (
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '10px',
                            paddingTop: '10px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                          }}>
                            <div style={{ flex: 1 }}>
                              <label style={{
                                fontSize: '10px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                                marginBottom: '4px',
                                display: 'block'
                              }}>
                                Doğru
                              </label>
                              <input
                                type="number"
                                placeholder="0"
                                defaultValue={session.correct || ''}
                                min="0"
                                onBlur={(e) => {
                                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                                  updateSession(session.id, { correct: value });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(34, 197, 94, 0.3)',
                                  backgroundColor: 'rgba(34, 197, 94, 0.05)',
                                  color: '#22c55e',
                                  fontSize: '13px',
                                  fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                                  outline: 'none',
                                  fontWeight: '600'
                                }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{
                                fontSize: '10px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                                marginBottom: '4px',
                                display: 'block'
                              }}>
                                Yanlış
                              </label>
                              <input
                                type="number"
                                placeholder="0"
                                defaultValue={session.wrong || ''}
                                min="0"
                                onBlur={(e) => {
                                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                                  updateSession(session.id, { wrong: value });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                  color: '#ef4444',
                                  fontSize: '13px',
                                  fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                                  outline: 'none',
                                  fontWeight: '600'
                                }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Doğru/Yanlış Badge'leri - Sadece düzenleme değilken ve değer varsa */}
                        {editingId !== session.id && (session.correct !== undefined || session.wrong !== undefined) && (
                          <div style={{
                            display: 'flex',
                            gap: '6px',
                            marginBottom: '8px'
                          }}>
                            {session.correct !== undefined && (
                              <div style={{
                                padding: '3px 8px',
                                borderRadius: '5px',
                                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <span style={{
                                  fontSize: '11px',
                                  color: '#22c55e',
                                  fontWeight: '600',
                                  fontFamily: "'SF Pro Text', -apple-system, sans-serif"
                                }}>
                                  ✓ {session.correct}
                                </span>
                              </div>
                            )}
                            {session.wrong !== undefined && (
                              <div style={{
                                padding: '3px 8px',
                                borderRadius: '5px',
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <span style={{
                                  fontSize: '11px',
                                  color: '#ef4444',
                                  fontWeight: '600',
                                  fontFamily: "'SF Pro Text', -apple-system, sans-serif"
                                }}>
                                  ✗ {session.wrong}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div style={{
                          paddingTop: '6px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            fontFamily: "'SF Pro Text', -apple-system, sans-serif"
                          }}>
                            {formatDate(session.date)}
                          </span>
                          <button
                            onClick={() => setEditingId(editingId === session.id ? null : session.id)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '5px',
                              backgroundColor: editingId === session.id ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              border: editingId === session.id ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                              color: editingId === session.id ? '#22c55e' : 'rgba(255, 255, 255, 0.5)',
                              fontSize: '10px',
                              fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              fontWeight: '500'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = editingId === session.id ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = editingId === session.id ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)';
                            }}
                          >
                            {editingId === session.id ? 'Kaydet' : '+ D/Y Ekle'}
      </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sağ Taraf - Zamanlayıcı */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {/* Ders Seçimi */}
                <div style={{ marginBottom: '32px' }}>
                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                    marginBottom: '16px',
                    fontWeight: '400'
                  }}>
                    İsterseniz hangi dersi çalıştığınızı seçerek takip yapabilirsiniz
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '4px'
                  }}>
                    {allSubjects.map((subject) => (
                      <button
                        key={subject.name}
                        onClick={() => {
                          setSelectedSubject(subject.name);
                          gtag.event({
                            action: 'subject_select',
                            category: 'Odaklan',
                            label: subject.name,
                          });
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: selectedSubject === subject.name 
                            ? '1.5px solid rgba(59, 130, 246, 0.6)' 
                            : '1px solid rgba(255, 255, 255, 0.15)',
                          backgroundColor: selectedSubject === subject.name 
                            ? 'rgba(59, 130, 246, 0.2)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                          fontWeight: selectedSubject === subject.name ? '600' : '500',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedSubject !== subject.name) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSubject !== subject.name) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          }
                        }}
                      >
                        {subject.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Büyük Timer Display */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '40px'
                }}>
                  <div style={{
                    fontSize: '72px',
                    fontWeight: '200',
                    color: '#ffffff',
                    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                    letterSpacing: '-2px',
                    lineHeight: '1',
                    textShadow: '0 4px 20px rgba(255, 255, 255, 0.2)'
                  }}>
                    {formatTimer(timerSeconds)}
                  </div>
                </div>
            {/* Kontrol Butonları */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                {/* Başlat/Durdur Butonu */}
                <button
                  onClick={toggleTimer}
                  style={{
                    flex: 1,
                    maxWidth: '200px',
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: isTimerRunning ? '#ef4444' : '#22c55e',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: isTimerRunning 
                      ? '0 8px 24px rgba(239, 68, 68, 0.4)'
                      : '0 8px 24px rgba(34, 197, 94, 0.4)',
                    transition: 'all 0.2s',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    fontFamily: "'SF Pro Text', -apple-system, sans-serif"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {isTimerRunning ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                      Durdur
                    </>
                  ) : timerSeconds > 0 ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Devam Et
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Başlat
                    </>
                  )}
                </button>

                {/* Kaydet Butonu - Sadece durduğunda ve süre varsa */}
                {!isTimerRunning && timerSeconds > 0 && (
                  <button
                    onClick={saveSession}
                    style={{
                      flex: 1,
                      maxWidth: '200px',
                      padding: '16px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(59, 130, 246, 0.9)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.2s',
                      animation: 'fadeIn 0.3s ease-out',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#ffffff',
                      fontFamily: "'SF Pro Text', -apple-system, sans-serif"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Kaydet
                  </button>
                )}

                {/* Sıfırla Butonu - Sadece durduğunda ve süre varsa */}
                {!isTimerRunning && timerSeconds > 0 && (
                  <button
                    onClick={resetTimer}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      animation: 'fadeIn 0.3s ease-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10"/>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            </div>
          </div>
        </div>
      )}

      {/* Animasyon CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Scrollbar stilleri */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        /* Number input arrow'larını kaldır */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default function OdaklanPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
        <div style={{
          fontSize: '20px',
          color: '#ffffff',
          fontFamily: "'SF Pro Display', -apple-system, sans-serif"
        }}>
          Yükleniyor...
        </div>
      </div>
    }>
      <OdaklanContent />
    </Suspense>
  );
}
