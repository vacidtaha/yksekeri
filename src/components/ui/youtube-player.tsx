"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Play, Maximize2 } from "lucide-react";
import { YouTubeVideo } from "@/lib/youtube-api";
import Image from "next/image";

// CSS animasyonları için style tag ekle
if (typeof document !== 'undefined' && !document.getElementById('video-card-animations')) {
  const style = document.createElement('style');
  style.id = 'video-card-animations';
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
      }
    }
  `;
  document.head.appendChild(style);
}

interface YouTubePlayerProps {
  video: YouTubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function YouTubePlayer({ video, isOpen, onClose }: YouTubePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ESC tuşu ile kapama
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isFullscreen, onClose]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Video yüklendiğinde loading'i kaldır
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!isOpen || !video) return null;

  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&start=0&end=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Player Container */}
      <div 
        ref={playerRef}
        className={`relative bg-black rounded-lg lg:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full rounded-none' 
            : 'w-[92vw] lg:w-[90vw] max-w-5xl h-[50vh] lg:h-[80vh] max-h-[350px] lg:max-h-[600px]'
        }`}
        style={{
          aspectRatio: isFullscreen ? 'unset' : '16/9'
        }}
      >
        {/* Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-1.5 lg:p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-xs lg:text-lg leading-tight truncate pr-1 lg:pr-4"
                  style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                {video.title}
              </h3>
              <div className="flex items-center gap-1.5 lg:gap-4 mt-0.5 lg:mt-1 text-xs lg:text-sm text-gray-300">
                <span className="truncate max-w-24 lg:max-w-none">{video.channelTitle}</span>
                <span className="hidden lg:inline">•</span>
                <span className="text-xs">{video.duration}</span>
                <span className="hidden lg:inline">•</span>
                <span className="hidden lg:inline">{video.viewCount} görüntülenme</span>
              </div>
            </div>
            
            <div className="flex items-center gap-0.5 lg:gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-1 lg:p-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                title={isFullscreen ? 'Fullscreen\'dan çık' : 'Fullscreen'}
              >
                <Maximize2 className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-white" />
              </button>
              
              <button
                onClick={onClose}
                className="p-1 lg:p-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                title="Kapat"
              >
                <X className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="flex flex-col items-center gap-1.5 lg:gap-4">
              <div className="w-8 h-8 lg:w-16 lg:h-16 border-2 lg:border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white text-xs lg:text-lg font-medium">Yükleniyor...</p>
            </div>
          </div>
        )}

        {/* YouTube Iframe */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={video.title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleIframeLoad}
        />

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 lg:h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Close Button (Mobile) */}
      <button
        onClick={onClose}
        className="absolute top-1 right-1 p-1.5 rounded-full bg-black/70 backdrop-blur-sm lg:hidden z-50 border border-white/20"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

// Video Card Component
interface VideoCardProps {
  video: YouTubeVideo;
  onClick: () => void;
  isLoading?: boolean;
}

// Basit VideoCard - Diğer videolar özelliği yok
export function VideoCard({ video, onClick, isLoading = false }: VideoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className={`rounded-xl lg:rounded-2xl border border-white/10 hover:border-white/15 transition-all duration-300 group p-3 lg:p-5 ${
        isLoading ? 'opacity-50' : 'hover:bg-white/5 hover:-translate-y-1 cursor-pointer'
      }`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)'
      }}
      onClick={!isLoading ? onClick : undefined}
    >
      <div className="flex items-start gap-3 lg:gap-5">
        {/* Thumbnail */}
        <div className="w-24 h-16 lg:w-40 lg:h-24 rounded-lg lg:rounded-xl overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse" />
          )}
          <Image
            src={video.thumbnails.medium || video.thumbnails.high || video.thumbnails.default}
            alt={video.title}
            width={160}
            height={96}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          
          {/* Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
            <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-red-600/80 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Play className="w-4 h-4 lg:w-6 lg:h-6 text-white ml-0.5 lg:ml-1" />
            </div>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 bg-black/80 text-white text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded font-medium">
            {video.duration}
          </div>
        </div>
        
        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1 lg:mb-2 text-sm lg:text-base leading-tight line-clamp-2"
              style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
            {video.title}
          </h3>
          
          <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
            <span className="text-xs lg:text-sm font-medium text-red-400 truncate">{video.channelTitle}</span>
            <span className="text-gray-600 hidden lg:inline">•</span>
            <span className="text-xs text-gray-500 hidden lg:inline">{video.viewCount} görüntülenme</span>
          </div>
          
          <button 
            onClick={(e) => { 
              e.stopPropagation();
              onClick();
            }}
            disabled={isLoading}
            className="hidden lg:flex items-center gap-1 px-2 lg:px-3 py-1 lg:py-1.5 rounded-md lg:rounded-lg transition-all duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#EF4444',
              color: 'white',
              fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#DC2626';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#EF4444';
              }
            }}
          >
            <Play className="w-3 h-3" />
            İzle
          </button>
        </div>
      </div>
    </div>
  );
}

