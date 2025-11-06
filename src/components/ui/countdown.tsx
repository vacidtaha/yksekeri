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
        className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 w-full max-w-xs lg:max-w-md mx-4 shadow-xl border border-gray-200"
      >
        <div className="text-center">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4" 
              style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
            YKS 2026
          </h2>
          
          <div className="flex justify-center items-center gap-3 lg:gap-4">
            <div className="bg-gray-100 rounded-lg p-4 min-w-[70px] lg:min-w-[90px]">
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-1" 
                   style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600"
                   style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                Gün
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 min-w-[70px] lg:min-w-[90px]">
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-1"
                   style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600"
                   style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                Saat
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 min-w-[70px] lg:min-w-[90px]">
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-1"
                   style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600"
                   style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                Dakika
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 min-w-[70px] lg:min-w-[90px]">
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-1"
                   style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600"
                   style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                Saniye
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 