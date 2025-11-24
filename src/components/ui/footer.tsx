"use client";

import React, { useRef, useState } from 'react';
import { Balloons, BalloonsRef } from '@/components/ui/balloons';
import { Countdown } from '@/components/ui/countdown';
import * as gtag from '@/lib/gtag';

export function Footer() {
  const balloonsRef = useRef<BalloonsRef>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  
  const handleSurpriseClick = () => {
    // Google Analytics tracking - Sakın Basma butonu
    gtag.event({
      action: 'easter_egg_click',
      category: 'Engagement',
      label: 'Sakın Basma Button',
    });
    
    if (balloonsRef.current) {
      balloonsRef.current.launchAnimation();
    }
    setShowCountdown(true);
  };

  const handleAnimationComplete = () => {
    setShowCountdown(false);
  };

  return (
    <footer className="border-t relative rounded-t-3xl pb-20 lg:pb-0 text-white" style={{ backgroundColor: '#000000', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
      <div className="max-w-6xl mx-auto px-4 py-4 lg:py-8">
        {/* Ana İçerik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6 mb-4 lg:mb-8">
          
          {/* TYT Dersleri */}
          <div>
            <h4 className="text-white font-semibold mb-2 lg:mb-3 text-xs lg:text-sm"
                style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
              TYT Dersleri
            </h4>
            <ul className="space-y-1 lg:space-y-2">
              {[
                { name: 'Türkçe', href: '/dersler/tyt/turkce' },
                { name: 'Matematik', href: '/dersler/tyt/matematik' },
                { name: 'Fen Bilimleri', href: '/dersler/tyt/fen' },
                { name: 'Sosyal Bilimler', href: '/dersler/tyt/sosyal' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} 
                     className="text-gray-300 hover:text-blue-400 text-xs lg:text-sm transition-colors duration-200"
                     style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* AYT Dersleri */}
          <div>
            <h4 className="text-white font-semibold mb-2 lg:mb-3 text-xs lg:text-sm"
                style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
              AYT Dersleri
            </h4>
            <ul className="space-y-1 lg:space-y-2">
              {[
                { name: 'Türk Dili ve Edebiyatı', href: '/dersler/ayt/edebiyat' },
                { name: 'Matematik', href: '/dersler/ayt/matematik' },
                { name: 'Fizik', href: '/dersler/ayt/fizik' },
                { name: 'Kimya', href: '/dersler/ayt/kimya' },
                { name: 'Biyoloji', href: '/dersler/ayt/biyoloji' },
                { name: 'Tarih', href: '/dersler/ayt/tarih' },
                { name: 'Coğrafya', href: '/dersler/ayt/cografya' },
                { name: 'Felsefe Grubu', href: '/dersler/ayt/felsefe' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} 
                     className="text-gray-300 hover:text-blue-400 text-xs lg:text-sm transition-colors duration-200"
                     style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Sayfa Bağlantıları */}
          <div>
            <h4 className="text-white font-semibold mb-2 lg:mb-3 text-xs lg:text-sm"
                style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
              Keşfet
            </h4>
            <ul className="space-y-1 lg:space-y-2">
              {[
                { name: 'Kaynaklar', href: '/kaynaklar' },
                { name: 'İletişim', href: '/iletisim' },
                { name: 'Gizlilik Politikası', href: '/gizlilik' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} 
                     className="text-gray-300 hover:text-blue-400 text-xs lg:text-sm transition-colors duration-200"
                     style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        

        
        {/* Balloon Butonu - Sadece Desktop */}
        <div className="hidden md:block absolute bottom-2 lg:bottom-4 right-2 lg:right-4">
          <button
            onClick={handleSurpriseClick}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-1.5 lg:py-2 px-3 lg:px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs lg:text-sm"
            style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
          >
            Sakın Basma
          </button>
        </div>
        
        {/* Balloons Component */}
        <Balloons ref={balloonsRef} type="default" />
      </div>
      
      {/* Countdown Component - Footer dışında bağımsız konumlandırılıyor */}
      <Countdown 
        isOpen={showCountdown}
        onAnimationComplete={handleAnimationComplete}
      />
    </footer>
  );
} 