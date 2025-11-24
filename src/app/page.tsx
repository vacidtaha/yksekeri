"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { BookOpen, Calculator, TestTube, Globe, BarChart3, Target, Zap, ArrowRight, Atom, Beaker, Book, MapPin, Brain, TrendingUp } from "lucide-react";
import * as gtag from "@/lib/gtag";

export default function Home() {
  const [showWarning, setShowWarning] = useState(true);
  const [showScrollText, setShowScrollText] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [visibleWords, setVisibleWords] = useState<number>(0);

  // Typing animation için tam metin (vurgulu kelimeler için özel işaretler)
  const fullText = `Biz **Taha Vacid ve Haktan Köksal**. Bu siteyi can sıkıntısından ve bir iddia sonucu kurduk — (tabiki biz kazandık). İşin gerçeği harcayamayacak kadar çok paramız, Tövbeyle geçiremeyeceğimiz kadar da çok günahımız var, o yüzden buraya **reklâm sıkıştırmaya hiç niyetimiz yok duanız yeterli**.

Açık konuşalım: Bugün üniversite okumayı **hararetle savunduğumuz söylenemez**. Yine de "ille de sınava gireceğim" diyorsan, burası işini kolaylaştırır.

**Müfredatı olabildiğince toparladım**; sitenin seni sınavdan bile daha çok geren bir bug'una rastlarsan hemen haber et, **gece yarısı kararnamelerinden bile hızlı düzeltiriz**. Estetik kusurlar mı? Bi ara el atar, eklerim.

Biliyoruz: kiminiz **askere 30'unda gitmek için**, kiminiz **aile evinden kaçmak için**, kiminiz "insan sevgisi"nden bihaberken yine de **tıp yazmak için**, kiminiz adalet duygusuyla pek işi yokken **hukuk kapısını çalmak için**, kiminiz "ben zaten konuşkanım" özgüveniyle **psikoloji yazmak için**, kiminiz formüllere alerjisi var ama "statü sağlar" diye **mühendislik için**, kiminiz de "girişimciliğin mega starı olacağım" derken belki bir **işletme diplomasına sığınmak için** buradasınız.

Haddimize değil, inanın umurumuzda da değil — ama şunu unutmayın: **Sınav hayatın tamamı değil**; inan, **küçük bir oyun**. İstediğini, istediğin niyetle kazan — fark etmez. **Kendi ayaklarının üzerinde durduğunda asıl oyun başlayacak**. Kendini bir an önce hayata at; **çalış, üret, öğren, biraz da keyif al**. Diploma tek başına kimseyi büyütmüyor; **deneyim, yetenek ve azim** olmadan da hiçbir yere varılmıyor. Bu site hayatının bir noktasında işe yararsa ne mutlu. **Başarılar.**`;

  // Metni önce ** işaretlerine göre parse et, sonra kelimelere ayır
  // Böylece vurgulu yerler doğru şekilde korunur
  const parseTextWithEmphasis = (text: string) => {
    const parts = text.split(/(\*\*)/);
    const words: Array<{ text: string; isEmphasized: boolean; isSpace: boolean; isNewline: boolean }> = [];
    let isEmphasized = false;
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === '**') {
        isEmphasized = !isEmphasized;
        continue;
      }
      
      // Parçayı kelimelere ayır (boşlukları ve satır atlamalarını koru)
      // Önce satır atlamalarını ayır, sonra boşlukları
      const lines = parts[i].split(/(\n+)/);
      for (let j = 0; j < lines.length; j++) {
        if (lines[j].includes('\n')) {
          // Satır atlaması
          words.push({ text: '\n', isEmphasized: false, isSpace: false, isNewline: true });
        } else if (lines[j].length > 0) {
          // Satır içindeki metni kelimelere ve boşluklara ayır
          const wordParts = lines[j].split(/(\s+)/);
          for (const wordPart of wordParts) {
            if (wordPart.length > 0) {
              const isSpace = /^\s+$/.test(wordPart);
              words.push({ text: wordPart, isEmphasized, isSpace, isNewline: false });
            }
          }
        }
      }
    }
    
    return words;
  };
  
  const words = parseTextWithEmphasis(fullText);

  // Animasyon kapalı - tüm metni direkt göster
  useEffect(() => {
    setVisibleWords(words.length);
  }, [words.length]);


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Scroll yazısı kontrolü
      if (scrollY > 50) {
        setShowScrollText(false);
      } else {
        setShowScrollText(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hash navigation için smooth scroll
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#content') {
      setTimeout(() => {
        const element = document.getElementById('content');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, []);

  // Hash değişikliklerini dinle
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#content') {
        const element = document.getElementById('content');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header Component */}
      <Header />

      {/* Hero Section - İki Kolon */}
      <div className="min-h-screen flex flex-col py-12 px-2" style={{backgroundColor: '#000000'}}>
        
        {/* Uyarı Kutusu */}
        {showWarning && (
          <div className="mb-3 lg:mb-6 max-w-sm lg:max-w-4xl mx-auto px-2 lg:px-4">
            <div className="rounded-md lg:rounded-lg p-1.5 lg:p-4" style={{backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)', backdropFilter: 'blur(10px)'}}>
              <div className="flex justify-between items-start gap-1.5 lg:gap-4">
                <p className="text-xs lg:text-sm leading-tight lg:leading-relaxed" style={{color: '#dc2626'}}>
                  ⚠️ <strong style={{color: '#b91c1c'}}>Uyarı:</strong> Bu site tamamen hayrına yapılmıştır. hiçbir reklam, işbirliği veya kâr amacı içermez. Buradaki içeriklerin resmi güncelliğini her zaman öğretmeninle, araştırmalarınla ve ÖSYM duyurularıyla karşılaştır; biz sadece kolaylaştırıcı bir arayüz sunuyoruz.
                </p>
                <button 
                  onClick={() => setShowWarning(false)}
                  className="text-red-600 hover:text-red-700 text-sm lg:text-xl flex-shrink-0 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logo - Mobilde Göster, Desktop'ta Gizle */}
        <div className="flex lg:hidden justify-center items-center mb-4">
          <Image
            src="/yks.png"
            alt="YKS Şekeri - YKS TYT AYT hazırlık platformu logosu"
            width={200}
            height={140}
            priority
            className="rounded-lg"
          />
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Sol Taraf - Logo - Sadece Desktop */}
          <div className="hidden lg:flex justify-center items-center h-full">
            <Image
              src="/yks.png"
              alt="YKS Şekeri - YKS TYT AYT hazırlık platformu logosu"
              width={500}
              height={350}
              priority
              className="rounded-lg"
            />
          </div>

          {/* Sağ Taraf - Karşılama Mesajı - Mobilde Ortalı */}
          <div className="text-center lg:text-left space-y-3 lg:space-y-4 text-white leading-relaxed px-4 lg:pr-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6">Hoş geldin</h2>
            
            <div className="text-sm lg:text-base">
              <style>{`
                @keyframes fadeInWord {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }
              `}</style>
              {words.slice(0, visibleWords).map((word, index) => {
                // Satır atlamaları için özel işlem
                if (word.isNewline) {
                  return <br key={index} />;
                }
                
                // Boşluklar için animasyonsuz gösterim
                if (word.isSpace) {
                  return <span key={index} className="inline">{word.text}</span>;
                }
                
                // Animasyon yok - direkt göster
                return (
                  <span
                    key={index}
                    className="inline"
                  >
                    {word.isEmphasized ? (
                      <span className="text-blue-400 font-semibold">{word.text}</span>
                    ) : (
                      <span className="text-white">{word.text}</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          </div>
        </div>

        {/* Basit Aşağı Kaydırma Uyarısı - Mobilde Gizli */}
        {showScrollText && (
          <div className="hidden lg:block absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center transition-opacity duration-300">
            <p className="text-white text-lg font-semibold">
              Arayüze erişmek için aşağı kaydırın ↓
            </p>
          </div>
        )}
      </div>

      {/* İstatistikler Bölümü */}
      <div 
        id="content"
        className="pt-12 lg:pt-24 pb-12 lg:pb-24 px-4 lg:px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        }}
      >
        {/* Dekoratif arka plan efektleri */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Başlık */}
          <div className="mb-8 lg:mb-12">
            <div className="inline-block mb-4">
              <TrendingUp className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 lg:mb-6 text-white drop-shadow-lg" 
                style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
              Soru Dağılım İstatistikleri
            </h2>
            <p className="text-base lg:text-xl text-white/90 max-w-2xl font-light leading-relaxed"
               style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
              Her ders ve konu için yıllara göre çıkan soru sayılarını detaylı tablolarda inceleyin
            </p>
          </div>

          {/* Ana İçerik Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            
            {/* TYT İstatistikleri Kartı */}
            <Link 
              href="/istatistikler"
              className="group"
            >
              <div 
                className="rounded-3xl p-6 lg:p-8 backdrop-blur-xl border-2 border-white/20 shadow-2xl hover:border-white/40 transition-all duration-300 h-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center"
                       style={{backgroundColor: 'rgba(30, 64, 175, 0.3)'}}>
                    <Calculator className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2"
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      TYT İstatistikleri
                    </h3>
                    <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-4"
                       style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                      Temel Yeterlilik Testi için tüm derslerin konu bazında soru dağılımlarını görüntüleyin. 
                      Hangi konulardan ne kadar soru çıktığını yıllara göre analiz edin.
                    </p>
                    <div className="flex items-center gap-2 text-white/90 text-sm lg:text-base font-medium group-hover:gap-3 transition-all duration-300"
                         style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                      <span>İncele</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* AYT İstatistikleri Kartı */}
            <Link 
              href="/istatistikler#ayt"
              className="group"
            >
              <div 
                className="rounded-3xl p-6 lg:p-8 backdrop-blur-xl border-2 border-white/20 shadow-2xl hover:border-white/40 transition-all duration-300 h-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center"
                       style={{backgroundColor: 'rgba(139, 92, 246, 0.3)'}}>
                    <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2"
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      AYT İstatistikleri
                    </h3>
                    <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-4"
                       style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                      Alan Yeterlilik Testi için tüm derslerin detaylı soru istatistiklerini inceleyin. 
                      Matematik, Fen, Sosyal ve Edebiyat derslerinin konu bazında analizlerini görüntüleyin.
                    </p>
                    <div className="flex items-center gap-2 text-white/90 text-sm lg:text-base font-medium group-hover:gap-3 transition-all duration-300"
                         style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                      <span>İncele</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

          </div>

        </div>
      </div>

      {/* İçerik Bölümü - TYT Dersleri */}
      <div className="min-h-screen py-8 lg:py-24 px-3 lg:px-6" style={{backgroundColor: '#0a0e27'}}>
        <div className="max-w-7xl mx-auto">
          
          {/* Başlık */}
          <div className="text-left mb-8 lg:mb-24">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-light tracking-tight mb-4 lg:mb-8 text-white" 
                style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
              TYT Dersleri
            </h2>
            <p className="text-sm lg:text-2xl text-white max-w-3xl font-light leading-relaxed"
               style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
              Yapılandırılmış müfredat, seçilmiş kaynak arşivi ve 
              kişiselleştirilmiş ilerleme takibi ile öğrenme deneyiminizi geliştirin.
            </p>
          </div>

          {/* Ders Kartları Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-24">
            
            {/* Türkçe */}
            <Link 
              href="/dersler/tyt/turkce" 
              className="group cursor-pointer"
              onClick={() => gtag.event({
                action: 'subject_card_click',
                category: 'Homepage',
                label: 'TYT Türkçe',
              })}
            >
              <div 
                className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:border-white/20"
                style={{
                  backgroundColor: 'rgba(30, 64, 175, 0.08)',
                  border: '1px solid rgba(30, 64, 175, 0.2)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 20px rgba(30, 64, 175, 0.1)'
                }}
              >
                <div className="flex flex-col">
                  <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-500/30" 
                       style={{backgroundColor: 'rgba(30, 64, 175, 0.25)'}}>
                    <BookOpen className="w-5 h-5 lg:w-7 lg:h-7 transition-all duration-300" style={{color: '#3b82f6'}} />
                  </div>
                  <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                      style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    Türkçe
                  </h3>
                  <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                      style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Dil bilgisi, paragraf anlama ve şiir analizi ile 
                    dil yetkinliğinizi geliştirin.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                     style={{color: '#ffffff'}}>
                  <span>10 konu</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                </div>
              </div>
            </Link>

            {/* Matematik */}
            <Link 
              href="/dersler/tyt/matematik" 
              className="group cursor-pointer"
              onClick={() => gtag.event({
                action: 'subject_card_click',
                category: 'Homepage',
                label: 'TYT Matematik',
              })}
            >
              <div 
                className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:border-white/20"
                style={{
                  backgroundColor: 'rgba(30, 64, 175, 0.08)',
                  border: '1px solid rgba(30, 64, 175, 0.2)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 20px rgba(30, 64, 175, 0.1)'
                }}
              >
                <div className="flex flex-col">
                  <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-500/30" 
                       style={{backgroundColor: 'rgba(30, 64, 175, 0.25)'}}>
                    <Calculator className="w-5 h-5 lg:w-7 lg:h-7 transition-all duration-300" style={{color: '#3b82f6'}} />
                  </div>
                  <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                      style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    Matematik
                  </h3>
                  <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                      style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Temel kavramlar, problem çözme stratejileri ve 
                    adım adım çözüm yöntemleri.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                     style={{color: '#ffffff'}}>
                  <span>31 konu</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                </div>
              </div>
            </Link>

            {/* Fen Bilimleri */}
            <Link 
              href="/dersler/tyt/fen" 
              className="group cursor-pointer"
              onClick={() => gtag.event({
                action: 'subject_card_click',
                category: 'Homepage',
                label: 'TYT Fen Bilimleri',
              })}
            >
              <div 
                className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:border-white/20"
                style={{
                  backgroundColor: 'rgba(30, 64, 175, 0.08)',
                  border: '1px solid rgba(30, 64, 175, 0.2)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 20px rgba(30, 64, 175, 0.1)'
                }}
              >
                <div className="flex flex-col">
                  <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-500/30" 
                       style={{backgroundColor: 'rgba(30, 64, 175, 0.25)'}}>
                    <TestTube className="w-5 h-5 lg:w-7 lg:h-7 transition-all duration-300" style={{color: '#3b82f6'}} />
                  </div>
                  <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                      style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    Fen Bilimleri
                  </h3>
                  <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                      style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Fizik yasaları, kimya reaksiyonları ve biyoloji 
                    süreçleri ile bilimsel düşünce.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                     style={{color: '#ffffff'}}>
                  <span>32 konu</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                </div>
              </div>
            </Link>

            {/* Sosyal Bilimler */}
            <Link 
              href="/dersler/tyt/sosyal" 
              className="group cursor-pointer"
              onClick={() => gtag.event({
                action: 'subject_card_click',
                category: 'Homepage',
                label: 'TYT Sosyal Bilimler',
              })}
            >
              <div 
                className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:border-white/20"
                style={{
                  backgroundColor: 'rgba(30, 64, 175, 0.08)',
                  border: '1px solid rgba(30, 64, 175, 0.2)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 20px rgba(30, 64, 175, 0.1)'
                }}
              >
                <div className="flex flex-col">
                  <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-500/30" 
                       style={{backgroundColor: 'rgba(30, 64, 175, 0.25)'}}>
                    <Globe className="w-5 h-5 lg:w-7 lg:h-7 transition-all duration-300" style={{color: '#3b82f6'}} />
                  </div>
                  <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                      style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    Sosyal Bilimler
                  </h3>
                  <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                      style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Tarih kronolojisi, coğrafya sistemleri ve felsefe 
                    akımları ile toplumsal anlayış.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                     style={{color: '#ffffff'}}>
                  <span>45 konu</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                </div>
              </div>
            </Link>

          </div>

        </div>
          </div>

          {/* AYT Bölümü */}
      <div className="min-h-screen py-8 lg:py-24 px-3 lg:px-6" style={{backgroundColor: '#1a0e27'}}>
        <div className="max-w-7xl mx-auto">
          <div className="mt-0">
            
            {/* AYT Başlık */}
            <div className="text-left mb-8 lg:mb-20">
              <h2 className="text-2xl md:text-5xl lg:text-6xl font-light tracking-tight mb-3 lg:mb-6 text-white" 
                  style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
                AYT Alan Dersleri
              </h2>
              <p className="text-xs lg:text-xl text-white max-w-3xl font-light leading-relaxed"
                 style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
                Önce hedeflediğiniz alanı seçin, sonra o alana özel 
                dersler ve stratejik hazırlık planınıza erişin.
              </p>
            </div>

            {/* Alan Seçim Bilgisi */}
            <div className="text-center mb-6 lg:mb-8">
              <p className="text-sm lg:text-lg text-white" 
                 style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                Devam etmek için alanınızı seçin
              </p>
            </div>

            {/* Alan Seçim Kartları - Küçük */}
            <div className="flex justify-center gap-2 lg:gap-4 mb-8 lg:mb-16">
              
              {/* Sayısal */}
              <div 
                className={`group cursor-pointer transition-all duration-300 ${selectedArea === 'sayisal' ? 'scale-105' : ''} ${selectedArea && selectedArea !== 'sayisal' ? 'opacity-30' : ''}`}
                onClick={() => {
                  const newArea = selectedArea === 'sayisal' ? null : 'sayisal';
                  setSelectedArea(newArea);
                  if (newArea) {
                    gtag.event({
                      action: 'area_select',
                      category: 'Homepage',
                      label: 'Sayısal',
                    });
                  }
                }}
              >
                <div 
                  className={`rounded-lg lg:rounded-xl p-2 lg:p-4 w-20 h-12 lg:w-32 lg:h-20 flex items-center justify-center transition-all duration-300 border`}
                  style={{
                    backgroundColor: selectedArea === 'sayisal' ? 'rgba(139, 92, 246, 0.2)' : (selectedArea && selectedArea !== 'sayisal' ? '#0a0e27' : 'rgba(139, 92, 246, 0.15)'),
                    border: selectedArea === 'sayisal' ? '2px solid #8b5cf6' : (selectedArea && selectedArea !== 'sayisal' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)'),
                    color: selectedArea === 'sayisal' ? '#ffffff' : (selectedArea && selectedArea !== 'sayisal' ? '#666666' : '#ffffff')
                  }}
                >
                  <h3 className="text-xs lg:text-base font-semibold" 
                      style={{ 
                        fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                        color: selectedArea === 'sayisal' ? '#ffffff' : (selectedArea && selectedArea !== 'sayisal' ? '#666666' : '#ffffff')
                      }}>
                    Sayısal
                  </h3>
                </div>
              </div>

              {/* Eşit Ağırlık */}
              <div 
                className={`group cursor-pointer transition-all duration-300 ${selectedArea === 'esit' ? 'scale-105' : ''} ${selectedArea && selectedArea !== 'esit' ? 'opacity-30' : ''}`}
                onClick={() => {
                  const newArea = selectedArea === 'esit' ? null : 'esit';
                  setSelectedArea(newArea);
                  if (newArea) {
                    gtag.event({
                      action: 'area_select',
                      category: 'Homepage',
                      label: 'Eşit Ağırlık',
                    });
                  }
                }}
              >
                <div 
                  className={`rounded-lg lg:rounded-xl p-2 lg:p-4 w-20 h-12 lg:w-32 lg:h-20 flex items-center justify-center transition-all duration-300 border`}
                  style={{
                    backgroundColor: selectedArea === 'esit' ? 'rgba(139, 92, 246, 0.2)' : (selectedArea && selectedArea !== 'esit' ? '#0a0e27' : 'rgba(139, 92, 246, 0.15)'),
                    border: selectedArea === 'esit' ? '2px solid #8b5cf6' : (selectedArea && selectedArea !== 'esit' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)'),
                    color: selectedArea === 'esit' ? '#ffffff' : (selectedArea && selectedArea !== 'esit' ? '#666666' : '#ffffff')
                  }}
                >
                  <h3 className="text-xs lg:text-base font-semibold text-center" 
                      style={{ 
                        fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                        color: selectedArea === 'esit' ? '#ffffff' : (selectedArea && selectedArea !== 'esit' ? '#666666' : '#ffffff')
                      }}>
                    E. Ağırlık
                  </h3>
                </div>
              </div>

              {/* Sözel */}
              <div 
                className={`group cursor-pointer transition-all duration-300 ${selectedArea === 'sozel' ? 'scale-105' : ''} ${selectedArea && selectedArea !== 'sozel' ? 'opacity-30' : ''}`}
                onClick={() => {
                  const newArea = selectedArea === 'sozel' ? null : 'sozel';
                  setSelectedArea(newArea);
                  if (newArea) {
                    gtag.event({
                      action: 'area_select',
                      category: 'Homepage',
                      label: 'Sözel',
                    });
                  }
                }}
              >
                <div 
                  className={`rounded-lg lg:rounded-xl p-2 lg:p-4 w-20 h-12 lg:w-32 lg:h-20 flex items-center justify-center transition-all duration-300 border`}
                  style={{
                    backgroundColor: selectedArea === 'sozel' ? 'rgba(139, 92, 246, 0.2)' : (selectedArea && selectedArea !== 'sozel' ? '#0a0e27' : 'rgba(139, 92, 246, 0.15)'),
                    border: selectedArea === 'sozel' ? '2px solid #8b5cf6' : (selectedArea && selectedArea !== 'sozel' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)'),
                    color: selectedArea === 'sozel' ? '#ffffff' : (selectedArea && selectedArea !== 'sozel' ? '#666666' : '#ffffff')
                  }}
                >
                  <h3 className="text-xs lg:text-base font-semibold" 
                      style={{ 
                        fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                        color: selectedArea === 'sozel' ? '#ffffff' : (selectedArea && selectedArea !== 'sozel' ? '#666666' : '#ffffff')
                      }}>
                    Sözel
                  </h3>
                </div>
              </div>

            </div>

            {/* Seçilen Alana Göre Ders Kartları */}
            {selectedArea && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                
                {/* Sayısal Alan Dersleri */}
                {selectedArea === 'sayisal' && (
                  <div>
                    <h3 className="text-lg lg:text-3xl font-semibold text-white mb-4 lg:mb-8 text-center" 
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      Sayısal Alan Dersleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-16">
                      
                      {/* Matematik */}
                      <Link href="/dersler/ayt/matematik" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <Calculator className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Matematik</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Limit, türev, integral ve analitik geometri ile ileri matematik konuları.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>40 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Fizik */}
                      <Link href="/dersler/ayt/fizik" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <Atom className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Fizik</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Elektrik, manyetizma, optik ve modern fizik konularında derinlemesine.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>26 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Kimya */}
                      <Link href="/dersler/ayt/kimya" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <Beaker className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Kimya</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Organik kimya, elektrokimya ve çözeltiler ile kimyasal dengeler.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>17 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Biyoloji */}
                      <Link href="/dersler/ayt/biyoloji" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-green-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <TestTube className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Biyoloji</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Genetik, ekoloji, sinir sistemi ve biyomoleküller detaylı analizi.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>18 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Eşit Ağırlık Dersleri */}
                {selectedArea === 'esit' && (
                  <div>
                    <h3 className="text-lg lg:text-3xl font-semibold text-white mb-4 lg:mb-8 text-center" 
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      Eşit Ağırlık Dersleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-16">
                      
                      {/* Matematik */}
                      <Link href="/dersler/ayt/matematik" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <Calculator className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Matematik</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Temel matematik konuları ile istatistik ve olasılık temelleri.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>40 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Edebiyat */}
                      <Link href="/dersler/ayt/edebiyat" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-rose-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <Book className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Edebiyat</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Türk ve dünya edebiyatı, edebi akımlar ve metin analizi teknikleri.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>25 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Tarih */}
                      <Link href="/dersler/ayt/tarih" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <Globe className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Tarih</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Osmanlı tarihi, Türkiye Cumhuriyeti ve çağdaş dünya tarihi.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>20 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Coğrafya */}
                      <Link href="/dersler/ayt/cografya" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-teal-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <MapPin className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Coğrafya</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Beşeri coğrafya, ekonomik faaliyetler ve çevre coğrafyası.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>20 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Sözel Alan Dersleri */}
                {selectedArea === 'sozel' && (
                  <div>
                    <h3 className="text-lg lg:text-3xl font-semibold text-white mb-4 lg:mb-8 text-center" 
                        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                      Sözel Alan Dersleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-16">
                      
                      {/* Edebiyat */}
                      <Link href="/dersler/ayt/edebiyat" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-rose-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <BookOpen className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Edebiyat</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Türk ve dünya edebiyatı, roman analizi ve edebi metin yorumlama.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>20 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Tarih */}
                      <Link href="/dersler/ayt/tarih" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <Globe className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Tarih</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Detaylı Osmanlı tarihi, siyasi olaylar ve kültürel gelişmeler.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>20 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Coğrafya */}
                      <Link href="/dersler/ayt/cografya" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-teal-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <MapPin className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Coğrafya</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Türkiye ve dünya coğrafyası, iklim özellikleri ve nüfus yapısı.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>20 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>

                      {/* Felsefe */}
                      <Link href="/dersler/ayt/felsefe" className="group cursor-pointer">
                        <div className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-auto lg:h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl mb-3 lg:mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-violet-500/30" 
                                 style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                              <Brain className="w-5 h-5 lg:w-7 lg:h-7" style={{color: '#ffffff'}} />
                            </div>
                            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                                style={{color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>Felsefe Grubu</h3>
                            <p className="text-xs lg:text-sm font-normal leading-relaxed mb-3 lg:mb-0"
                                style={{color: '#ffffff'}}>
                              Felsefe, psikoloji, sosyoloji ve mantık disiplinlerinin kapsamlı analizi.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs lg:text-sm font-medium"
                               style={{color: '#ffffff'}}>
                            <span>19 konu</span>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-300" style={{color: '#ffffff'}} />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Alan Seçimi Bilgi Kutusu */}
            {!selectedArea && (
              <div className="max-w-4xl mx-auto mb-8 lg:mb-16">
                <div 
                  className="rounded-2xl lg:rounded-3xl p-4 lg:p-8 border text-center"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    backdropFilter: 'blur(24px)'
                  }}
                >
                  <h4 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-3"
                      style={{ color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    🎯 Alan Seçimi Rehberi
                  </h4>
                  <p className="text-sm lg:text-base leading-relaxed max-w-3xl mx-auto"
                     style={{ color: '#ffffff', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Hedeflediğiniz üniversite bölümüne göre yukarıdan bir alan seçin. 
                    Her alan farklı ders ağırlıkları ve soru dağılımına sahiptir.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Platform Özellikleri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl mb-2 lg:mb-4 flex items-center justify-center mx-auto transition-all duration-300 hover:scale-105" 
                   style={{backgroundColor: 'rgba(139, 92, 246, 0.15)'}}>
                <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6" style={{color: '#ffffff'}} />
              </div>
              <h4 className="text-sm lg:text-lg font-medium mb-2 lg:mb-3"
                  style={{color: '#ffffff'}}>
                Yapılandırılmış İçerik
              </h4>
              <p className="text-xs lg:text-sm leading-relaxed"
                 style={{color: '#ffffff'}}>
                Müfredata uygun konu sıralaması ve detaylı açıklamalar 
                ile sistematik öğrenme deneyimi
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl mb-2 lg:mb-4 flex items-center justify-center mx-auto transition-all duration-300 hover:scale-105" 
                   style={{backgroundColor: 'rgba(139, 92, 246, 0.15)'}}>
                <Target className="w-4 h-4 lg:w-6 lg:h-6" style={{color: '#ffffff'}} />
              </div>
              <h4 className="text-sm lg:text-lg font-medium mb-2 lg:mb-3"
                  style={{color: '#ffffff'}}>
                İlerleme Takibi
              </h4>
              <p className="text-xs lg:text-sm leading-relaxed"
                 style={{color: '#ffffff'}}>
                Hangi konularda eksik olduğunuzu görsel olarak takip edin 
                ve hedeflerinize odaklanın
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl mb-2 lg:mb-4 flex items-center justify-center mx-auto transition-all duration-300 hover:scale-105" 
                   style={{backgroundColor: 'rgba(139, 92, 246, 0.15)'}}>
                <Zap className="w-4 h-4 lg:w-6 lg:h-6" style={{color: '#ffffff'}} />
              </div>
              <h4 className="text-sm lg:text-lg font-medium mb-2 lg:mb-3"
                  style={{color: '#ffffff'}}>
                Etkileşimli Platform
              </h4>
              <p className="text-xs lg:text-sm leading-relaxed"
                 style={{color: '#ffffff'}}>
                Video dersleri, PDF kaynakları ve soru arşivine 
                tek yerden hızlı erişim imkanı
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Odaklan Bölümü */}
      <div 
        className="py-20 lg:py-32 px-4 lg:px-6"
        style={{
          backgroundColor: '#000000',
        }}
      >
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Sol Taraf - İçerik */}
            <div className="text-center lg:text-left">
              
              {/* Başlık */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-white" 
                  style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                Odaklanarak Çalış
              </h2>
              
              {/* Açıklama */}
              <p className="text-base lg:text-xl text-white/60 mb-10 font-normal leading-relaxed"
                 style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                Tam ekran çalışma ortamında, ambient sesler eşliğinde dikkat dağıtıcılardan uzak maksimum verim alın.
              </p>

              {/* Özellikler */}
              <div className="space-y-4 mb-10 text-left max-w-md mx-auto lg:mx-0">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: '15px' }}>
                      Ambient Sesler
                    </h4>
                    <p className="text-white/50 text-sm" style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                      Yağmur, şömine, deniz ve daha fazlası
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: '15px' }}>
                      Çalışma Takibi
                    </h4>
                    <p className="text-white/50 text-sm" style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                      Kronometro ile süre ve başarı takibi
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: '15px' }}>
                      Minimal Arayüz
                    </h4>
                    <p className="text-white/50 text-sm" style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                      Sadece saat, ses kontrolleri ve kronometro
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link 
                href="/odaklan?auto=true"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-base lg:text-lg transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: '#0071e3',
                  color: '#ffffff',
                }}
                onClick={() => gtag.event({
                  action: 'odaklan_click',
                  category: 'Homepage',
                  label: 'Odaklan Mode',
                })}
              >
                <span>Dene</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Sağ Taraf - Screenshots */}
            <div className="grid grid-cols-1 gap-6">
              {/* Odaklan Sayfası Görseli */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/odaklan-main.png"
                  alt="Odaklan sayfası - Tam ekran çalışma ortamı"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  style={{
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}
                />
              </div>
              
              {/* Kronometro Görseli */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/odaklan-timer.png"
                  alt="Kronometro ve çalışma takibi sistemi"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  style={{
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Puan Hesaplama Bölümü */}
      <div 
        className="py-28 lg:py-40 px-4 lg:px-6"
        style={{
          backgroundColor: '#f97316',
        }}
      >
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Sol - Metin */}
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white" 
                  style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                Puan ve Sıralama Hesaplama
              </h2>
              
              <p className="text-lg lg:text-xl text-white/80 font-normal leading-relaxed"
                 style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                TYT ve AYT netlerini gir, puanlarını ve geçmiş yıl verilerine göre sıralama tahminini gör.
              </p>
            </div>

            {/* Sağ - Buton */}
            <div className="flex justify-center lg:justify-end">
              <Link 
                href="/hesapla"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-xl lg:text-2xl transition-all duration-200"
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => gtag.event({
                  action: 'hesapla_click',
                  category: 'Homepage',
                  label: 'Puan Hesaplama',
                })}
              >
                <span>Hesapla</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* Üniversite Bilgileri Bölümü - Modern Tasarım */}
      <div 
        className="pt-12 lg:pt-24 pb-0 px-4 lg:px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      >
        {/* Dekoratif arka plan efektleri */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Başlık */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-block mb-4">
              <span className="text-4xl lg:text-6xl">✨</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 lg:mb-6 text-white drop-shadow-lg" 
                style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
              Üniversite Bilgileri
            </h2>
            <p className="text-base lg:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed"
               style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
              Üniversite araştırması için resmi kaynaklara yönlendiriyoruz (telif yeriz) 🙈
            </p>
          </div>

          {/* Ana İçerik Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            
            {/* YÖK Atlas Kartı */}
            <div 
              className="rounded-3xl p-6 lg:p-8 backdrop-blur-xl border-2 border-white/20 shadow-2xl hover:border-white/40 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl"
                     style={{backgroundColor: 'rgba(255,255,255,0.25)'}}>
                  🎓
                </div>
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    YÖK Atlas
                  </h3>
                  <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-4"
                     style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    Devletin resmi üniversite arşivi. Arayüzü ömrü uzun olsun dedemin kokusunu hatırlatıyor... 
                    Ama yiğidi öldür hakkını yeme, işlerini iyi yapıyorlar, <span className="text-yellow-200 font-semibold">patron onlar</span>, mecbur saygı duyuyoruz.
                  </p>
            <a 
              href="https://yokatlas.yok.gov.tr/index.php" 
              target="_blank" 
              rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-105 group shadow-lg"
              style={{
                background: 'linear-gradient(145deg, #F3C623, #E6B800)',
                color: '#ffffff',
                      boxShadow: '0 4px 20px rgba(243, 198, 35, 0.4)'
                    }}
                  >
                    <span>YÖK Atlas&apos;a Git</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
          </div>

            {/* Bilgi Kartı */}
            <div 
              className="rounded-3xl p-6 lg:p-8 backdrop-blur-xl border-2 border-white/20 shadow-2xl"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl"
                     style={{backgroundColor: 'rgba(255,255,255,0.25)'}}>
                  📊
                </div>
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                    Ne Bulursun?
                  </h3>
                  <ul className="space-y-2 text-white/90 text-sm lg:text-base leading-relaxed"
               style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-200">✓</span>
                      <span><span className="font-semibold">Resmi bilgiler</span> — kontenjanlar, geçmiş yıl puanları</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-200">✓</span>
                      <span><span className="font-semibold">Bölüm detayları</span> — müfredat ve akademik bilgiler</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-200">✗</span>
                      <span><span className="line-through">Kampüs ortamı, sosyal hayat, gece hayatı</span> — bunlar için YouTube&apos;a bakın 😉</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Alt Bilgi */}
          <div className="text-center pb-8 lg:pb-12">
            <p className="text-white/70 text-xs lg:text-sm inline-block px-4 py-2 rounded-full backdrop-blur-sm"
               style={{ 
                 backgroundColor: 'rgba(255,255,255,0.1)',
                 fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" 
               }}>
              * Yeni sekmede açılır. Oraya gittikten sonra buraya geri dönmeyi unutmayın.
            </p>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
