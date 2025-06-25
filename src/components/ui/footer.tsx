"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Balloons, BalloonsRef } from '@/components/ui/balloons';
import { Countdown } from '@/components/ui/countdown';

export function Footer() {
  const balloonsRef = useRef<BalloonsRef>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  
  const handleSurpriseClick = () => {
    if (balloonsRef.current) {
      balloonsRef.current.launchAnimation();
    }
    setShowCountdown(true);
  };

  const handleAnimationComplete = () => {
    setShowCountdown(false);
  };

  return (
    <footer className="mt-12 border-t bg-gray-50 relative rounded-t-3xl" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Ana İçerik */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          
          {/* Logo */}
          <div className="md:col-span-2 relative">
            <div className="flex justify-center md:justify-start md:absolute md:left-1/4 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2">
              <Image
                src="/yks.png"
                alt="YKS Şekeri - Ücretsiz YKS TYT AYT hazırlık platformu"
                width={150}
                height={150}
                className="rounded-xl"
              />
            </div>
          </div>
          
          {/* TYT Dersleri */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-3 text-sm"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
              TYT Dersleri
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Türkçe', href: '/dersler/tyt/turkce' },
                { name: 'Matematik', href: '/dersler/tyt/matematik' },
                { name: 'Fen Bilimleri', href: '/dersler/tyt/fen' },
                { name: 'Sosyal Bilimler', href: '/dersler/tyt/sosyal' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} 
                     className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* AYT Dersleri */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-3 text-sm"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
              AYT Dersleri
            </h4>
            <ul className="space-y-2">
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
                     className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Sayfa Bağlantıları */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-3 text-sm"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
              Keşfet
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Kaynaklar', href: '/kaynaklar' },
                { name: 'İletişim', href: '/iletisim' },
                { name: 'Gizlilik Politikası', href: '/gizlilik' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} 
                     className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        

        
        {/* Balloon Butonu */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleSurpriseClick}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            🎈 Sürpriz!
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