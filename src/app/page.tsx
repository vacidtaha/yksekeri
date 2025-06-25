"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { BookOpen, Calculator, TestTube, Globe, BarChart3, Target, Zap, ArrowRight, Atom, Beaker, Book, MapPin, Brain } from "lucide-react";

export default function Home() {
  const [showWarning, setShowWarning] = useState(true);
  const [showScrollText, setShowScrollText] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

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
      <div className="min-h-screen flex flex-col py-12 px-2 bg-gray-50">
        
        {/* Uyarı Kutusu */}
        {showWarning && (
          <div className="mb-6 max-w-4xl mx-auto px-4">
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <div className="flex justify-between items-start gap-4">
                <p className="text-red-800 text-sm leading-relaxed">
                  ⚠️ <strong>Uyarı:</strong> Bu site tamamen hayrına yapılmıştır. hiçbir reklam, işbirliği veya kâr amacı içermez. Buradaki içeriklerin resmi güncelliğini her zaman öğretmeninle, araştırmalarınla ve ÖSYM duyurularıyla karşılaştır; biz sadece kolaylaştırıcı bir arayüz sunuyoruz.
                </p>
                <button 
                  onClick={() => setShowWarning(false)}
                  className="text-red-600 hover:text-red-800 text-xl flex-shrink-0"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Sol Taraf - Logo */}
          <div className="flex justify-center items-center h-full">
            <Image
              src="/yks.png"
              alt="YKS Şekeri - YKS TYT AYT hazırlık platformu logosu"
              width={500}
              height={350}
              priority
              className="rounded-lg"
            />
          </div>

          {/* Sağ Taraf - Karşılama Mesajı */}
          <div className="text-left space-y-4 text-gray-700 leading-relaxed pr-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Hoş geldin</h2>
            
            <p className="text-base">
              Biz <span className="text-gray-900 font-semibold">Taha Vacid ve Haktan Köksal</span>. Bu siteyi can sıkıntısından ve bir iddia sonucu kurduk — (tabiki biz kazandık). İşin gerçeği harcayamayacak kadar çok paramız, Tövbeyle geçiremeyeceğimiz kadar da çok günahımız var , o yüzden buraya <span className="text-gray-900 font-semibold">reklâm sıkıştırmaya hiç niyetimiz yok duanız yeterli</span>. 
            </p>
            
            <p className="text-base">
              Açık konuşalım: Bugün üniversite okumayı <span className="text-gray-900 font-semibold">hararetle savunduğumuz söylenemez</span>. Yine de &quot;ille de sınava gireceğim&quot; diyorsan, burası işini kolaylaştırır.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Burada bulacakların</h3>
            
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-2 flex items-start text-sm max-w-lg">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-blue-800"><strong>Düzenli konu haritası</strong> – müfredatın tamamı sistematik sıralanmış, &quot;sırada ne var&quot; diye düşünmene gerek yok.</span>
            </div>
            
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-2 flex items-start text-sm max-w-lg">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-blue-800"><strong>Kaliteli video dersleri</strong> – her konu için özenle seçilmiş, en açık anlatan hocaların ders arşivi.</span>
            </div>
            
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-2 flex items-start text-sm max-w-lg">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-blue-800"><strong>Kapsamlı soru havuzu</strong> – hem resmi ÖSYM soruları hem de yapay zeka destekli interaktif sorularla pratik yap.</span>
            </div>
            
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 flex items-start text-sm max-w-lg">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-blue-800"><strong>Pratik özet kağıtları</strong> – son tekrar için bir sayfalık özetler; yazdır, çantana at, her yerde çalış.</span>
            </div>

            <p className="text-base">
              <span className="text-gray-900 font-semibold">Müfredatı olabildiğince toparladım</span>; sitenin seni sınavdan bile daha çok geren bir bug&apos;una rastlarsan hemen haber et, <span className="text-gray-900 font-semibold">gece yarısı kararnamelerinden bile hızlı düzeltiriz</span>. Estetik kusurlar mı? Bi ara el atar, eklerim.
            </p>

            <p className="text-base">
              Biliyoruz: kiminiz <span className="text-gray-900 font-semibold">askere 30&apos;unda gitmek için</span>, kiminiz <span className="text-gray-900 font-semibold">aile evinden kaçmak için</span>, kiminiz &quot;insan sevgisi&quot;nden bihaberken yine de <span className="text-gray-900 font-semibold">tıp yazmak için</span>, kiminiz adalet duygusuyla pek işi yokken <span className="text-gray-900 font-semibold">hukuk kapısını çalmak için</span>, kiminiz &quot;ben zaten konuşkanım&quot; özgüveniyle <span className="text-gray-900 font-semibold">psikoloji yazmak için</span>, kiminiz formüllere alerjisi var ama &quot;statü sağlar&quot; diye <span className="text-gray-900 font-semibold">mühendislik için</span>, kiminiz de &quot;girişimciliğin mega starı olacağım&quot; derken belki bir <span className="text-gray-900 font-semibold">işletme diplomasına sığınmak için</span> buradasınız.
            </p>

            <p className="text-base font-medium text-gray-600 my-5">
              Haddimize değil, inanın umurumuzda da değil — ama şunu unutmayın: <span className="text-gray-900 font-semibold">Sınav hayatın tamamı değil</span>; inan, <span className="text-gray-900 font-semibold">küçük bir oyun</span>. İstediğini, istediğin niyetle kazan — fark etmez. <span className="text-gray-900 font-semibold">Kendi ayaklarının üzerinde durduğunda asıl oyun başlayacak</span>. Kendini bir an önce hayata at; <span className="text-gray-900 font-semibold">çalış, üret, öğren, biraz da keyif al</span>. Diploma tek başına kimseyi büyütmüyor; <span className="text-gray-900 font-semibold">deneyim, yetenek ve azim</span> olmadanda hiçbir yere varılmıyor. Bu site hayatının bir noktasında işe yararsa ne mutlu. <span className="text-gray-900 font-bold text-lg">Başarılar.</span>
            </p>
          </div>

          </div>
        </div>

        {/* Basit Aşağı Kaydırma Uyarısı */}
        {showScrollText && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center transition-opacity duration-300">
            <p className="text-gray-600 text-lg font-semibold">
              Arayüze erişmek için aşağı kaydırın ↓
            </p>
          </div>
        )}
      </div>

      {/* İçerik Bölümü - TYT Dersleri */}
      <div id="content" className="min-h-screen py-24 px-6" style={{backgroundColor: '#2d2d2d'}}>
        <div className="max-w-7xl mx-auto">
          
          {/* Başlık */}
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-light tracking-tight mb-8 text-white" 
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' }}>
              TYT Dersleri
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
               style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif' }}>
              Yapılandırılmış müfredat, seçilmiş kaynak arşivi ve 
              kişiselleştirilmiş ilerleme takibi ile öğrenme deneyiminizi geliştirin.
            </p>
          </div>

          {/* Ders Kartları Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-24">
            
            {/* Türkçe */}
            <Link href="/dersler/tyt/turkce" className="group cursor-pointer">
              <div 
                className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <div className="flex flex-col">
                  <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500/30" 
                       style={{backgroundColor: 'rgba(0,122,255,0.2)'}}>
                    <BookOpen className="w-7 h-7 transition-all duration-300" style={{color: '#007AFF'}} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3" 
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Türkçe
                  </h3>
                  <p className="text-gray-400 text-sm font-normal leading-relaxed" 
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    Dil bilgisi, paragraf anlama ve şiir analizi ile 
                    dil yetkinliğinizi geliştirin.
                  </p>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                  <span>30 konu</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                </div>
              </div>
            </Link>

            {/* Matematik */}
            <Link href="/dersler/tyt/matematik" className="group cursor-pointer">
              <div 
                className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <div className="flex flex-col">
                  <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-green-500/30" 
                       style={{backgroundColor: 'rgba(52,199,89,0.2)'}}>
                    <Calculator className="w-7 h-7 transition-all duration-300" style={{color: '#34C759'}} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3" 
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Matematik
                  </h3>
                  <p className="text-gray-400 text-sm font-normal leading-relaxed" 
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    Temel kavramlar, problem çözme stratejileri ve 
                    adım adım çözüm yöntemleri.
                  </p>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                  <span>35 konu</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                </div>
              </div>
            </Link>

            {/* Fen Bilimleri */}
            <Link href="/dersler/tyt/fen" className="group cursor-pointer">
              <div 
                className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <div className="flex flex-col">
                  <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500/30" 
                       style={{backgroundColor: 'rgba(255,159,10,0.2)'}}>
                    <TestTube className="w-7 h-7 transition-all duration-300" style={{color: '#FF9F0A'}} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3" 
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Fen Bilimleri
                  </h3>
                  <p className="text-gray-400 text-sm font-normal leading-relaxed" 
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    Fizik yasaları, kimya reaksiyonları ve biyoloji 
                    süreçleri ile bilimsel düşünce.
                  </p>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                  <span>25 konu</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                </div>
              </div>
            </Link>

            {/* Sosyal Bilimler */}
            <Link href="/dersler/tyt/sosyal" className="group cursor-pointer">
              <div 
                className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <div className="flex flex-col">
                  <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-500/30" 
                       style={{backgroundColor: 'rgba(175,82,222,0.2)'}}>
                    <Globe className="w-7 h-7 transition-all duration-300" style={{color: '#AF52DE'}} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3" 
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Sosyal Bilimler
                  </h3>
                  <p className="text-gray-400 text-sm font-normal leading-relaxed" 
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    Tarih kronolojisi, coğrafya sistemleri ve felsefe 
                    akımları ile toplumsal anlayış.
                  </p>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                  <span>22 konu</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                </div>
              </div>
            </Link>

          </div>

          {/* AYT Bölümü */}
          <div className="mt-48">
            
            {/* AYT Başlık */}
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-6 text-white" 
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' }}>
                AYT Alan Dersleri
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif' }}>
                Önce hedeflediğiniz alanı seçin, sonra o alana özel 
                dersler ve stratejik hazırlık planınıza erişin.
              </p>
            </div>

            {/* Alan Seçim Bilgisi */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-400" 
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Devam etmek için alanınızı seçin
              </p>
            </div>

            {/* Alan Seçim Kartları - Küçük */}
            <div className="flex justify-center gap-4 mb-16">
              
              {/* Sayısal */}
              <div 
                className={`group cursor-pointer transition-all duration-300 ${selectedArea === 'sayisal' ? 'scale-105' : ''} ${selectedArea && selectedArea !== 'sayisal' ? 'opacity-30' : ''}`}
                onClick={() => setSelectedArea(selectedArea === 'sayisal' ? null : 'sayisal')}
              >
                <div 
                  className={`rounded-xl p-4 w-32 h-20 flex items-center justify-center transition-all duration-300 border`}
                  style={{
                    backgroundColor: selectedArea === 'sayisal' ? 'rgba(239,68,68,0.2)' : (selectedArea && selectedArea !== 'sayisal' ? '#2d2d2d' : '#ffffff'),
                    border: selectedArea === 'sayisal' ? '2px solid #EF4444' : (selectedArea && selectedArea !== 'sayisal' ? '1px solid #4a4a4a' : '1px solid #e5e7eb'),
                    color: selectedArea === 'sayisal' ? '#ffffff' : (selectedArea && selectedArea !== 'sayisal' ? '#666666' : '#000000')
                  }}
                >
                  <h3 className="text-base font-semibold" 
                      style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                        color: selectedArea === 'sayisal' ? '#ffffff' : (selectedArea && selectedArea !== 'sayisal' ? '#666666' : '#000000')
                      }}>
                    Sayısal
                  </h3>
                </div>
              </div>

              {/* Eşit Ağırlık */}
              <div 
                className={`group cursor-pointer transition-all duration-300 ${selectedArea === 'esit' ? 'scale-105' : ''} ${selectedArea && selectedArea !== 'esit' ? 'opacity-30' : ''}`}
                onClick={() => setSelectedArea(selectedArea === 'esit' ? null : 'esit')}
              >
                <div 
                  className={`rounded-xl p-4 w-32 h-20 flex items-center justify-center transition-all duration-300 border`}
                  style={{
                    backgroundColor: selectedArea === 'esit' ? 'rgba(99,102,241,0.2)' : (selectedArea && selectedArea !== 'esit' ? '#2d2d2d' : '#ffffff'),
                    border: selectedArea === 'esit' ? '2px solid #6366F1' : (selectedArea && selectedArea !== 'esit' ? '1px solid #4a4a4a' : '1px solid #e5e7eb'),
                    color: selectedArea === 'esit' ? '#ffffff' : (selectedArea && selectedArea !== 'esit' ? '#666666' : '#000000')
                  }}
                >
                  <h3 className="text-base font-semibold text-center" 
                      style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                        color: selectedArea === 'esit' ? '#ffffff' : (selectedArea && selectedArea !== 'esit' ? '#666666' : '#000000')
                      }}>
                    Eşit Ağırlık
                  </h3>
                </div>
              </div>

              {/* Sözel */}
              <div 
                className={`group cursor-pointer transition-all duration-300 ${selectedArea === 'sozel' ? 'scale-105' : ''} ${selectedArea && selectedArea !== 'sozel' ? 'opacity-30' : ''}`}
                onClick={() => setSelectedArea(selectedArea === 'sozel' ? null : 'sozel')}
              >
                <div 
                  className={`rounded-xl p-4 w-32 h-20 flex items-center justify-center transition-all duration-300 border`}
                  style={{
                    backgroundColor: selectedArea === 'sozel' ? 'rgba(16,185,129,0.2)' : (selectedArea && selectedArea !== 'sozel' ? '#2d2d2d' : '#ffffff'),
                    border: selectedArea === 'sozel' ? '2px solid #10B981' : (selectedArea && selectedArea !== 'sozel' ? '1px solid #4a4a4a' : '1px solid #e5e7eb'),
                    color: selectedArea === 'sozel' ? '#ffffff' : (selectedArea && selectedArea !== 'sozel' ? '#666666' : '#000000')
                  }}
                >
                  <h3 className="text-base font-semibold" 
                      style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                        color: selectedArea === 'sozel' ? '#ffffff' : (selectedArea && selectedArea !== 'sozel' ? '#666666' : '#000000')
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
                    <h3 className="text-3xl font-semibold text-white mb-8 text-center" 
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      Sayısal Alan Dersleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
                      
                      {/* Matematik */}
                      <Link href="/dersler/ayt/matematik" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500/30" 
                                 style={{backgroundColor: 'rgba(59,130,246,0.2)'}}>
                              <Calculator className="w-7 h-7" style={{color: '#3B82F6'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Matematik</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Limit, türev, integral ve analitik geometri ile ileri matematik konuları.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>45 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Fizik */}
                      <Link href="/dersler/ayt/fizik" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-500/30" 
                                 style={{backgroundColor: 'rgba(168,85,247,0.2)'}}>
                              <Atom className="w-7 h-7" style={{color: '#A855F7'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Fizik</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Elektrik, manyetizma, optik ve modern fizik konularında derinlemesine.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>28 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Kimya */}
                      <Link href="/dersler/ayt/kimya" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-yellow-500/30" 
                                 style={{backgroundColor: 'rgba(234,179,8,0.2)'}}>
                              <Beaker className="w-7 h-7" style={{color: '#EAB308'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Kimya</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Organik kimya, elektrokimya ve çözeltiler ile kimyasal dengeler.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>24 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Biyoloji */}
                      <Link href="/dersler/ayt/biyoloji" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-green-500/30" 
                                 style={{backgroundColor: 'rgba(34,197,94,0.2)'}}>
                              <TestTube className="w-7 h-7" style={{color: '#22C55E'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Biyoloji</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Genetik, ekoloji, sinir sistemi ve biyomoleküller detaylı analizi.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>32 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Eşit Ağırlık Dersleri */}
                {selectedArea === 'esit' && (
                  <div>
                    <h3 className="text-3xl font-semibold text-white mb-8 text-center" 
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      Eşit Ağırlık Dersleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
                      
                      {/* Matematik */}
                      <Link href="/dersler/ayt/matematik" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500/30" 
                                 style={{backgroundColor: 'rgba(59,130,246,0.2)'}}>
                              <Calculator className="w-7 h-7" style={{color: '#3B82F6'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Matematik</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Temel matematik konuları ile istatistik ve olasılık temelleri.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>20 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Edebiyat */}
                      <Link href="/dersler/ayt/edebiyat" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-rose-500/30" 
                                 style={{backgroundColor: 'rgba(244,63,94,0.2)'}}>
                              <Book className="w-7 h-7" style={{color: '#F43F5E'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Edebiyat</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Türk ve dünya edebiyatı, edebi akımlar ve metin analizi teknikleri.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>25 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Tarih */}
                      <Link href="/dersler/ayt/tarih" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500/30" 
                                 style={{backgroundColor: 'rgba(249,115,22,0.2)'}}>
                              <Globe className="w-7 h-7" style={{color: '#F97316'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Tarih</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Osmanlı tarihi, Türkiye Cumhuriyeti ve çağdaş dünya tarihi.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>20 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Coğrafya */}
                      <Link href="/dersler/ayt/cografya" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-teal-500/30" 
                                 style={{backgroundColor: 'rgba(20,184,166,0.2)'}}>
                              <MapPin className="w-7 h-7" style={{color: '#14B8A6'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Coğrafya</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Beşeri coğrafya, ekonomik faaliyetler ve çevre coğrafyası.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>25 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Sözel Alan Dersleri */}
                {selectedArea === 'sozel' && (
                  <div>
                    <h3 className="text-3xl font-semibold text-white mb-8 text-center" 
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      Sözel Alan Dersleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
                      
                      {/* Edebiyat */}
                      <Link href="/dersler/ayt/edebiyat" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-rose-500/30" 
                                 style={{backgroundColor: 'rgba(244,63,94,0.2)'}}>
                              <BookOpen className="w-7 h-7" style={{color: '#F43F5E'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Edebiyat</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Türk ve dünya edebiyatı, roman analizi ve edebi metin yorumlama.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>25 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Tarih */}
                      <Link href="/dersler/ayt/tarih" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500/30" 
                                 style={{backgroundColor: 'rgba(249,115,22,0.2)'}}>
                              <Globe className="w-7 h-7" style={{color: '#F97316'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Tarih</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Detaylı Osmanlı tarihi, siyasi olaylar ve kültürel gelişmeler.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>20 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Coğrafya */}
                      <Link href="/dersler/ayt/cografya" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-teal-500/30" 
                                 style={{backgroundColor: 'rgba(20,184,166,0.2)'}}>
                              <MapPin className="w-7 h-7" style={{color: '#14B8A6'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Coğrafya</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Türkiye ve dünya coğrafyası, iklim özellikleri ve nüfus yapısı.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>25 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
                          </div>
                        </div>
                      </Link>

                      {/* Felsefe */}
                      <Link href="/dersler/ayt/felsefe" className="group cursor-pointer">
                        <div className="rounded-3xl p-8 h-72 flex flex-col justify-between transition-all duration-300 border hover:bg-white/8 hover:border-white/20"
                             style={{backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)'}}>
                          <div className="flex flex-col">
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-violet-500/30" 
                                 style={{backgroundColor: 'rgba(139,92,246,0.2)'}}>
                              <Brain className="w-7 h-7" style={{color: '#8B5CF6'}} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3" 
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Felsefe Grubu</h3>
                            <p className="text-gray-400 text-sm font-normal leading-relaxed">
                              Felsefe, psikoloji, sosyoloji ve mantık disiplinlerinin kapsamlı analizi.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                            <span>32 konu</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
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
              <div className="max-w-4xl mx-auto mb-16">
                <div 
                  className="rounded-3xl p-8 border text-center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(24px)'
                  }}
                >
                  <h4 className="text-xl font-semibold text-white mb-3"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    🎯 Alan Seçimi Rehberi
                  </h4>
                  <p className="text-gray-400 text-base leading-relaxed max-w-3xl mx-auto"
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    Hedeflediğiniz üniversite bölümüne göre yukarıdan bir alan seçin. 
                    Her alan farklı ders ağırlıkları ve soru dağılımına sahiptir.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Platform Özellikleri */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center mx-auto transition-all duration-300 hover:scale-105" 
                   style={{backgroundColor: 'rgba(156,163,175,0.15)'}}>
                <BarChart3 className="w-6 h-6" style={{color: '#9CA3AF'}} />
              </div>
              <h4 className="text-lg font-medium mb-3" style={{color: '#9CA3AF'}}>
                Yapılandırılmış İçerik
              </h4>
              <p className="text-sm leading-relaxed" style={{color: '#9CA3AF'}}>
                Müfredata uygun konu sıralaması ve detaylı açıklamalar 
                ile sistematik öğrenme deneyimi
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center mx-auto transition-all duration-300 hover:scale-105" 
                   style={{backgroundColor: 'rgba(156,163,175,0.15)'}}>
                <Target className="w-6 h-6" style={{color: '#9CA3AF'}} />
              </div>
              <h4 className="text-lg font-medium mb-3" style={{color: '#9CA3AF'}}>
                İlerleme Takibi
              </h4>
              <p className="text-sm leading-relaxed" style={{color: '#9CA3AF'}}>
                Hangi konularda eksik olduğunuzu görsel olarak takip edin 
                ve hedeflerinize odaklanın
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center mx-auto transition-all duration-300 hover:scale-105" 
                   style={{backgroundColor: 'rgba(156,163,175,0.15)'}}>
                <Zap className="w-6 h-6" style={{color: '#9CA3AF'}} />
              </div>
              <h4 className="text-lg font-medium mb-3" style={{color: '#9CA3AF'}}>
                Etkileşimli Platform
              </h4>
              <p className="text-sm leading-relaxed" style={{color: '#9CA3AF'}}>
                Video dersleri, PDF kaynakları ve soru arşivine 
                tek yerden hızlı erişim imkanı
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* YÖK Atlas Bölümü - Eğlenceli */}
      <div className="py-20 px-6 border-t border-white/10" style={{backgroundColor: '#1d1d1f'}}>
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Başlık */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-white" 
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' }}>
              Üniversite Bilgileri
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-8"
               style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif' }}>
              Üniversite araştırması için resmi kaynaklara yönlendiriyoruz (telif yerim) 🙈
            </p>
          </div>

          {/* YÖK Atlas Butonu */}
          <div className="flex justify-center mb-4">
            <a 
              href="https://yokatlas.yok.gov.tr/index.php" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 group"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff'
              }}
            >
              <span>YÖK Atlas&apos;a Git</span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/20">
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          </div>

          {/* Alt Bilgi */}
          <p className="text-gray-500 text-sm text-center mb-8"
             style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
            * Yeni sekmede açılır. Oraya gittikten sonra buraya geri dönmeyi unutmayın.
          </p>

          {/* Eğlenceli Açıklama Kutusu */}
          <div 
            className="rounded-3xl p-8 text-left"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px)'
            }}
          >
            <p className="text-gray-300 text-base leading-relaxed mb-4"
               style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
              <span className="text-white font-semibold">YÖK Atlas</span> — devletin resmi üniversite arşivi. 
              Arayüzü ömrü uzun olsun dedemin kokusunu hatırlatıyor... 
              Ama yiğidi öldür hakkını yeme, işlerini iyi yapıyorlar, <span className="text-white font-semibold">patron onlar</span>, mecbur saygı duyuyoruz.
            </p>
            
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              Tabii <span className="text-white font-semibold">kampüs ortamı, sosyal hayat, gece hayatı</span> gibi konularda sessizler. 
              Hele sanki hepiniz sadece akademi için gidiyorsunuz. <span className="text-gray-400 line-through">&quot;Bu şehirde eğlence nasıl&quot;</span> diye sorunca 
                              gözlerini kırpıştırıp konuyu değiştiriyorlar. Siz bu merak ettiklerinizi YouTube&apos;dan bakın.
            </p>

            <p className="text-gray-300 text-base leading-relaxed">
              Yine de <span className="text-white font-semibold">resmi bilgiler, kontenjanlar, geçmiş yıl puanları</span> konusunda 
              elimizden iyiler.
            </p>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
