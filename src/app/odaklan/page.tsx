"use client";

import { useEffect, useRef, useState } from "react";

export default function OdaklanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUI, setShowUI] = useState(true);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds();
    const showColon = seconds % 2 === 0; // Her saniye yanıp sönsün
    return { hours, minutes, showColon };
  };

  const formatDate = (date: Date) => {
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
    { id: 'snow', name: 'Kar', file: '/sounds/snow.mp3' },
  ];

  const getSoundIcon = (soundId: string) => {
    const iconColor = activeSound === soundId ? '#ffffff' : '#e2e8f0';
    
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
      case 'snow':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20"/>
            <path d="m4.93 4.93 14.14 14.14"/>
            <path d="m19.07 4.93-14.14 14.14"/>
            <path d="M12 2 9 5m3-3 3 3M12 22l3-3m-3 3-3-3"/>
            <path d="M2 12h20"/>
            <path d="M5 9h14"/>
            <path d="M5 15h14"/>
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

      {/* Arka Plan Sesleri - Sağ Üst */}
      {showUI && (
        <div
          style={{
            position: 'fixed',
            top: '32px',
            right: '32px',
            zIndex: 9999,
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            maxWidth: '280px'
          }}
        >
          {ambientSounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => playSound(sound.id, sound.file)}
              className="backdrop-blur-md transition-all duration-300 hover:scale-105"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '20px',
                backgroundColor: activeSound === sound.id 
                  ? 'rgba(59, 130, 246, 0.95)' 
                  : 'rgba(15, 23, 42, 0.95)',
                border: activeSound === sound.id
                  ? '2px solid rgba(96, 165, 250, 0.8)'
                  : '1px solid rgba(30, 41, 59, 0.6)',
                boxShadow: activeSound === sound.id
                  ? '0 8px 32px rgba(59, 130, 246, 0.5)'
                  : '0 8px 32px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
              aria-label={sound.name}
            >
              {getSoundIcon(sound.id)}
              <span style={{ 
                fontSize: '11px', 
                color: 'white',
                fontWeight: '500',
                fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                letterSpacing: '0.2px'
              }}>
                {sound.name}
              </span>
            </button>
          ))}
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
          {formatDate(currentTime)}
        </div>
      </div>
      )}

      {/* Şık Oynat/Duraklat Butonu */}
      {showUI && (
      <button
        onClick={togglePlay}
        className="rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{ 
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 9999,
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(30, 41, 59, 0.6)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)'
        }}
        aria-label={isPlaying ? "Duraklat" : "Oynat"}
      >
        {isPlaying ? (
          // Pause İkonu
          <svg
            className="w-6 h-6"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          // Play İkonu
          <svg
            className="w-6 h-6"
            style={{ marginLeft: '3px' }}
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      )}

      {/* Gizle/Göster Butonu - Sol Alt */}
      <button
        onClick={() => setShowUI(!showUI)}
        className="rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{ 
          position: 'fixed',
          bottom: '32px',
          left: '32px',
          zIndex: 9999,
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(30, 41, 59, 0.6)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)'
        }}
        aria-label={showUI ? "Gizle" : "Göster"}
      >
        {showUI ? (
          // Göz Kapalı İkonu (Gizle)
          <svg
            className="w-6 h-6"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
          </svg>
        ) : (
          // Göz Açık İkonu (Göster)
          <svg
            className="w-6 h-6"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        )}
      </button>
    </div>
  );
}

