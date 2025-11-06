"use client";

import { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';
import * as gtag from '@/lib/gtag';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Her zaman aktif
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    // Kullanıcı daha önce tercih yaptı mı kontrol et
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // İlk ziyaret - banner'ı göster
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Daha önce tercih yapılmış - ayarları yükle
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      
      // Analytics çerezlerine izin verildiyse GA'yı aktifleştir
      if (savedPreferences.analytics) {
        enableAnalytics();
      }
    }
  }, []);

  const enableAnalytics = () => {
    gtag.updateConsent(true);
  };

  const disableAnalytics = () => {
    gtag.updateConsent(false);
  };

  const acceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    
    setPreferences(newPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    enableAnalytics();
    
    // Tracking - Kullanıcı çerezleri kabul etti
    gtag.event({
      action: 'cookie_consent_accept_all',
      category: 'Privacy',
      label: 'Accept All Cookies',
    });
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    
    setPreferences(newPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    disableAnalytics();
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    
    if (preferences.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
    
    // Tracking - Kullanıcı özel ayarlar yaptı
    gtag.event({
      action: 'cookie_consent_custom',
      category: 'Privacy',
      label: `Analytics: ${preferences.analytics}, Functional: ${preferences.functional}`,
    });
    
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-[100]"
        style={{ backdropFilter: 'blur(4px)' }}
      />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[101] p-3 lg:p-6">
        <div 
          className="max-w-5xl mx-auto rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-2xl border"
          style={{
            backgroundColor: 'rgba(26, 14, 39, 0.98)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {!showSettings ? (
            // Ana Banner
            <div>
              <div className="flex items-start gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div 
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                >
                  <Cookie className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#a78bfa' }} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-3 text-white"
                      style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    🍪 Çerez Kullanımı Hakkında
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-300 leading-relaxed mb-3 lg:mb-4"
                     style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Sitemizde deneyiminizi iyileştirmek ve site kullanımını analiz etmek için çerezler kullanıyoruz. 
                    Google Analytics ile anonim kullanım istatistikleri topluyoruz. Çerez tercihlerinizi özelleştirebilir 
                    veya tümünü kabul edebilirsiniz. Daha fazla bilgi için{' '}
                    <a href="/gizlilik" className="underline font-medium" style={{ color: '#a78bfa' }}>
                      Gizlilik Politikası
                    </a>
                    {' '}sayfamızı ziyaret edin.
                  </p>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <button
                  onClick={acceptAll}
                  className="flex-1 py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl font-semibold transition-all duration-200 text-sm lg:text-base hover:shadow-lg"
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#8b5cf6';
                  }}
                >
                  Tümünü Kabul Et
                </button>
                
                <button
                  onClick={rejectAll}
                  className="flex-1 py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl font-semibold transition-all duration-200 text-sm lg:text-base border hover:bg-white/5"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    color: '#ffffff',
                    fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                  }}
                >
                  Reddet
                </button>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 sm:flex-initial py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl font-semibold transition-all duration-200 text-sm lg:text-base border hover:bg-white/5 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    borderColor: 'rgba(139, 92, 246, 0.2)',
                    color: '#a78bfa',
                    fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Özelleştir
                </button>
              </div>
            </div>
          ) : (
            // Ayarlar Paneli
            <div>
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-base lg:text-xl font-semibold text-white"
                    style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                  Çerez Tercihleri
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                {/* Gerekli Çerezler */}
                <div 
                  className="p-3 lg:p-4 rounded-xl border"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    borderColor: 'rgba(139, 92, 246, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm lg:text-base font-semibold text-white"
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      Gerekli Çerezler
                    </h4>
                    <div className="text-xs lg:text-sm px-2 py-1 rounded-full bg-white/10 text-gray-400">
                      Her zaman aktif
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-400"
                     style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Sitenin çalışması için gerekli temel çerezler. Devre dışı bırakılamaz.
                  </p>
                </div>

                {/* Analitik Çerezler */}
                <div 
                  className="p-3 lg:p-4 rounded-xl border"
                  style={{
                    backgroundColor: preferences.analytics ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
                    borderColor: preferences.analytics ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm lg:text-base font-semibold text-white"
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      Analitik Çerezler (Google Analytics)
                    </h4>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
                        preferences.analytics ? 'bg-violet-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                          preferences.analytics ? 'left-6' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-400"
                     style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Site kullanımını analiz etmemize ve deneyiminizi iyileştirmemize yardımcı olur. 
                    Hangi sayfaların popüler olduğunu ve ziyaretçilerin siteyi nasıl kullandığını görmemizi sağlar.
                  </p>
                </div>

                {/* Fonksiyonel Çerezler */}
                <div 
                  className="p-3 lg:p-4 rounded-xl border"
                  style={{
                    backgroundColor: preferences.functional ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
                    borderColor: preferences.functional ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm lg:text-base font-semibold text-white"
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      Fonksiyonel Çerezler
                    </h4>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                      className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
                        preferences.functional ? 'bg-violet-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                          preferences.functional ? 'left-6' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-400"
                     style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    İlerleme durumunuz ve tercihleriniz gibi verileri saklar. Kaldığınız yerden devam etmenizi sağlar.
                  </p>
                </div>
              </div>

              {/* Ayarlar Butonları */}
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <button
                  onClick={savePreferences}
                  className="flex-1 py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl font-semibold transition-all duration-200 text-sm lg:text-base"
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                  }}
                >
                  Tercihleri Kaydet
                </button>
                
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 sm:flex-initial py-2.5 lg:py-3 px-4 lg:px-6 rounded-xl font-semibold transition-all duration-200 text-sm lg:text-base border"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    color: '#a78bfa',
                    fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                  }}
                >
                  İptal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

