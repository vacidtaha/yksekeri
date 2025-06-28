"use client";

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  isOpen: boolean;
  onAnimationComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export function Countdown({ isOpen, onAnimationComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });

  useEffect(() => {
    if (!isOpen) return;
    
    const targetDate = new Date('2026-06-20T10:00:00+03:00'); // 20 Haziran 2026 sabah 10:00 Türkiye saati

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((difference % 1000) / 10); // 2 haneli salise için 10'a böl

        setTimeLeft({ days, hours, minutes, seconds, milliseconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 10); // 10ms'de bir güncele (salise için)

    // 6 saniye sonra otomatik olarak kaybol
    const autoHideTimer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(autoHideTimer);
    };
  }, [isOpen, onAnimationComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div 
        className="bg-white/98 rounded-2xl lg:rounded-3xl p-4 lg:p-8 w-full max-w-sm lg:max-w-4xl mx-4 shadow-2xl border border-white/40"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="text-center">
          <div className="mb-8">
            {/* Özel mesaj */}
            <p className="text-sm lg:text-lg font-bold mb-4 px-4 leading-relaxed" 
               style={{ 
                 fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                 background: 'linear-gradient(90deg, #7C3AED, #EC4899, #EAB308)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 backgroundClip: 'text'
               }}>
              Az söz dinle vakit daralıyor<br className="hidden lg:inline" />
              <span className="lg:ml-1"> içinden geçmen gereken bir sınav var</span><br />
              <span className="text-xl lg:text-2xl">BAASSS LAN</span>
            </p>
            
            <h2 className="text-2xl lg:text-3xl font-semibold text-black mb-3" 
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
              YKS 2026
            </h2>
            <p className="text-gray-800 text-base lg:text-lg font-medium"
               style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
              20 Haziran 2026 • 10:00
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-2 lg:gap-6 flex-wrap">
            <div className="bg-gray-200/90 border border-gray-300/60 rounded-xl lg:rounded-2xl p-3 lg:p-6 min-w-[80px] lg:min-w-[120px]">
              <div className="text-2xl lg:text-4xl font-light text-black mb-1 lg:mb-3" 
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs lg:text-base text-black font-semibold"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Gün
              </div>
            </div>
            
            <div className="bg-gray-200/90 border border-gray-300/60 rounded-xl lg:rounded-2xl p-3 lg:p-6 min-w-[80px] lg:min-w-[120px]">
              <div className="text-2xl lg:text-4xl font-light text-black mb-1 lg:mb-3"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs lg:text-base text-black font-semibold"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Saat
              </div>
            </div>
            
            <div className="bg-gray-200/90 border border-gray-300/60 rounded-xl lg:rounded-2xl p-3 lg:p-6 min-w-[80px] lg:min-w-[120px]">
              <div className="text-2xl lg:text-4xl font-light text-black mb-1 lg:mb-3"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs lg:text-base text-black font-semibold"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Dakika
              </div>
            </div>
            
            <div className="bg-gray-200/90 border border-gray-300/60 rounded-xl lg:rounded-2xl p-3 lg:p-6 min-w-[80px] lg:min-w-[120px]">
              <div className="text-2xl lg:text-4xl font-light text-black mb-1 lg:mb-3"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs lg:text-base text-black font-semibold"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Saniye
              </div>
            </div>
            
            <div className="bg-gray-200/90 border border-gray-300/60 rounded-xl lg:rounded-2xl p-3 lg:p-6 min-w-[80px] lg:min-w-[120px]">
              <div className="text-2xl lg:text-4xl font-light text-black mb-1 lg:mb-3"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                {timeLeft.milliseconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs lg:text-base text-black font-semibold"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Salise
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 