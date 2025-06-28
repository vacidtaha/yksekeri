"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Play, Maximize2 } from "lucide-react";
import { YouTubeVideo, youtubeService } from "@/lib/youtube-api";
import Image from "next/image";

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
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
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
  currentQuery?: string;
  onChannelVideoClick?: (video: YouTubeVideo) => void;
}

export function VideoCard({ video, onClick, isLoading = false, currentQuery, onChannelVideoClick }: VideoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMoreVideos, setShowMoreVideos] = useState(false);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleShowMoreVideos = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Ana kart tıklamasını engelle
    
    if (!showMoreVideos && currentQuery) {
      setLoadingMore(true);
      try {
        // Aynı kanaldan aynı konuda daha fazla video ara
        const searchQuery = `${currentQuery} ${video.channelTitle}`;
        const moreVideos = await youtubeService.searchVideos({
          query: searchQuery,
          maxResults: 6,
          order: 'relevance'
        });
        
        // Mevcut videoyu çıkar ve sadece farklı videoları göster
        const filteredVideos = moreVideos.filter((v: YouTubeVideo) => v.id !== video.id).slice(0, 4);
        setChannelVideos(filteredVideos);
      } catch (error) {
        console.error('Kanal videoları yüklenirken hata:', error);
      } finally {
        setLoadingMore(false);
      }
    }
    
    setShowMoreVideos(!showMoreVideos);
  };

  return (
    <div 
      className={`rounded-xl lg:rounded-2xl border border-white/10 hover:border-white/15 transition-all duration-300 group ${
        isLoading ? 'opacity-50' : 'hover:bg-white/5 hover:-translate-y-1 cursor-pointer'
      } ${showMoreVideos ? 'pb-1 lg:pb-2' : 'p-3 lg:p-5'}`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)'
      }}
      onClick={!isLoading ? onClick : undefined}
    >
      {/* Ana Video Kartı */}
      <div className={`${showMoreVideos ? 'p-3 lg:p-5 border-b border-white/10' : 'p-3 lg:p-5'} relative`}>
        {/* Mobile Diğer Button - Top Right */}
        <button 
          onClick={handleShowMoreVideos}
          disabled={isLoading}
          className="lg:hidden absolute top-2 right-2 px-2 py-1 rounded-md transition-all duration-200 text-xs font-medium border border-gray-600 hover:border-red-400 hover:bg-red-400/10 disabled:opacity-50 z-10"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
          }}
        >
          {loadingMore ? '...' : showMoreVideos ? '−' : '+'}
        </button>

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
          <div className="flex-1 min-w-0 flex flex-col justify-between h-16 lg:h-24 pr-8 lg:pr-0">
            <div>
              <h3 className="font-semibold text-white mb-1 lg:mb-2 text-sm lg:text-base leading-tight line-clamp-2"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                {video.title}
              </h3>
              
              {/* Channel Name - More Prominent */}
              <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                <span className="text-xs lg:text-sm font-medium text-red-400 truncate">{video.channelTitle}</span>
                <span className="text-gray-600 hidden lg:inline">•</span>
                <span className="text-xs text-gray-500 hidden lg:inline">{video.viewCount} görüntülenme</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 lg:justify-between">
              <button 
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                disabled={isLoading}
                className="hidden lg:flex items-center gap-1 px-2 lg:px-3 py-1 lg:py-1.5 rounded-md lg:rounded-lg transition-all duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#EF4444',
                  color: 'white',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
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
              
              {/* Desktop Diğer Button */}
              <button 
                onClick={handleShowMoreVideos}
                disabled={isLoading}
                className="hidden lg:block px-2 lg:px-3 py-1 lg:py-1.5 rounded-md lg:rounded-lg transition-all duration-200 text-xs font-medium border border-gray-600 hover:border-red-400 hover:bg-red-400/10 disabled:opacity-50"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && window.innerWidth >= 1024) {
                    e.currentTarget.style.color = '#EF4444';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.color = 'white';
                  }
                }}
              >
                {loadingMore ? 'Yükleniyor...' : showMoreVideos ? 'Daha Az' : 'Diğer Videoları'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Channel Videos */}
      {showMoreVideos && (
        <div className="px-3 lg:px-5 pb-2 lg:pb-3">
          {loadingMore ? (
            <div className="flex justify-center py-2 lg:py-4">
              <div className="w-4 h-4 lg:w-6 lg:h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
                     ) : channelVideos.length > 0 ? (
             <div className="space-y-1.5 lg:space-y-2">
               {channelVideos.map((channelVideo) => (
                                 <div 
                   key={channelVideo.id} 
                   className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-md lg:rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                   onClick={(e) => { 
                     e.stopPropagation(); 
                     if (onChannelVideoClick) {
                       onChannelVideoClick(channelVideo);
                     } else {
                       // Fallback: Open in new tab
                       window.open(`https://www.youtube.com/watch?v=${channelVideo.id}`, '_blank');
                     }
                   }}
                 >
                  <Image
                    src={channelVideo.thumbnails.default}
                    alt={channelVideo.title}
                    width={64}
                    height={48}
                    className="w-12 h-9 lg:w-16 lg:h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs lg:text-sm text-white font-medium line-clamp-1 mb-0.5 lg:mb-1">
                      {channelVideo.title}
                    </h4>
                    <div className="flex items-center gap-1.5 lg:gap-2 text-xs text-gray-500">
                      <span>{channelVideo.duration}</span>
                      <span className="hidden lg:inline">•</span>
                      <span className="hidden lg:inline">{channelVideo.viewCount} görüntülenme</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-2 lg:py-3 text-center">
              Bu kanaldan bu konu hakkında başka video bulunamadı.
            </p>
          )}
        </div>
      )}
    </div>
  );
} 