"use client";

import Image from "next/image";
import { Header } from "@/components/ui/header";
import { Download, FileText, Calendar, ExternalLink } from "lucide-react";

export default function KaynaklarPage() {
  // TYT ve AYT yılları
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

  // TYT PDF linkleri
  const tytLinks: Record<number, string> = {
    2025: "https://cdn.osym.gov.tr/pdfdokuman/2025/YKS/TSK/yks_tyt_2025_kitapcik_d250.pdf",
    2024: "https://dokuman.osym.gov.tr/pdfdokuman/2024/YKS/TSK/yks_tyt_2024_kitapcik_T24kt.pdf",
    2023: "https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf",
    2022: "https://dokuman.osym.gov.tr/pdfdokuman/2022/YKS/TSK/yks_2022_tyt.pdf",
    2021: "https://dokuman.osym.gov.tr/pdfdokuman/2021/YKS/TSK/tyt_yks_2021.pdf",
    2020: "https://dokuman.osym.gov.tr/pdfdokuman/2020/YKS/TSK/tyt_yks_2020.pdf",
    2019: "https://dokuman.osym.gov.tr/pdfdokuman/2019/YKS/TSK/tyt_yks_2019_web.pdf"
  };

  // AYT PDF linkleri
  const aytLinks: Record<number, string> = {
    2025: "https://cdn.osym.gov.tr/pdfdokuman/2025/YKS/TSK/yks_ayt_2025_kitapcik_st12.pdf",
    2024: "https://dokuman.osym.gov.tr/pdfdokuman/2024/YKS/TSK/yks_ayt_2024_kitapcik_ts85k.pdf",
    2023: "https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_ayt_2023_kitapcik_g5A2H.pdf",
    2022: "https://dokuman.osym.gov.tr/pdfdokuman/2022/YKS/TSK/yks_2022_ayt.pdf",
    2021: "https://dokuman.osym.gov.tr/pdfdokuman/2021/YKS/TSK/ayt_yks_2021.pdf",
    2020: "https://dokuman.osym.gov.tr/pdfdokuman/2020/YKS/TSK/ayt_yks_2020.pdf",
    2019: "https://dokuman.osym.gov.tr/pdfdokuman/2019/YKS/TSK/ayt_yks_2019_web.pdf"
  };

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#2a2a2a'}}>
      <Header alwaysShow={true} />
      
      <div className="max-w-6xl mx-auto px-3 lg:px-4 py-6 lg:py-12 pt-20 lg:pt-32 pb-24 lg:pb-6">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-4 left-4 z-10">
          <Image
            src="/yks.png"
            alt="YKS Şekeri Logo"
            width={60}
            height={42}
            priority
            className="rounded-lg"
          />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8 lg:mb-16">
          <h1 className="text-2xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-3 lg:mb-6 text-white">
            Kaynaklar
          </h1>
          <p className="text-sm lg:text-xl max-w-2xl lg:max-w-4xl mx-auto font-light leading-relaxed mb-4 lg:mb-8 px-2 lg:px-0 text-gray-300">
            Geçmiş yıl sınav sorularına ÖSYM&apos;nin resmi PDF önizleme sayfaları üzerinden erişin.
          </p>
          
          {/* Telif Hakları Uyarısı */}
          <div className="max-w-2xl lg:max-w-4xl mx-auto p-3 lg:p-6 rounded-xl lg:rounded-2xl mb-4 lg:mb-8" style={{backgroundColor: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
            <div className="flex items-start gap-2 lg:gap-4">
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 lg:mt-1" 
                   style={{backgroundColor: 'rgba(139, 92, 246, 0.25)'}}>
                <span className="text-sm lg:text-lg">⚖️</span>
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-semibold mb-1.5 lg:mb-2 text-white">
                  Telif Hakları ve Yasal Uyarı
                </h3>
                <p className="text-xs lg:text-sm leading-relaxed mb-2 lg:mb-3 text-gray-300">
                  Sınav soruları <strong>Türk Fikir ve Sanat Eserleri Kanunu (FSEK)</strong> kapsamında telif hakkı koruması altındadır. 
                  Bu nedenle sorular doğrudan sitemizde barındırılmamakta, yalnızca <strong>ÖSYM&apos;nin resmi PDF önizleme sayfalarına</strong> yönlendirme yapılmaktadır.
                </p>
                <p className="text-xs lg:text-sm text-gray-400">
                  Tüm linkler ÖSYM&apos;nin dokuman.osym.gov.tr ve cdn.osym.gov.tr alt domainlerine yönlendirmektedir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TYT Bölümü */}
        <div className="mb-12 lg:mb-20">
          <div className="flex items-center gap-2 lg:gap-4 mb-4 lg:mb-8">
            <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center" 
                 style={{backgroundColor: 'rgba(139, 92, 246, 0.15)'}}>
              <FileText className="w-4 h-4 lg:w-6 lg:h-6" style={{color: '#8b5cf6'}} />
            </div>
            <div>
              <h2 className="text-xl lg:text-3xl font-semibold text-white">
                TYT Çıkmış Sorular
              </h2>
                             <p className="text-sm lg:text-base text-gray-300">
                 Temel Yeterlilik Testi - Geçmiş yıl soruları
               </p>
               <p className="text-xs lg:text-sm mt-0.5 lg:mt-1 text-gray-400">
                 💡 Cevap anahtarları PDF&apos;lerin sonunda yer almaktadır
               </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
            {years.map((year) => (
              <a
                key={`tyt-${year}`}
                href={tytLinks[year]}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-3 lg:p-6 rounded-lg lg:rounded-2xl transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)'
                }}
              >
                <div className="flex items-center justify-between mb-2 lg:mb-4">
                  <div className="flex items-center gap-1.5 lg:gap-3">
                    <Calendar className="w-3 h-3 lg:w-5 lg:h-5" style={{color: '#8b5cf6'}} />
                    <span className="text-sm lg:text-lg font-semibold text-white">
                      {year}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 opacity-50 group-hover:opacity-100 transition-opacity" 
                               style={{color: '#8b5cf6'}} />
                </div>
                
                <div className="text-center">
                  <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl mx-auto mb-1.5 lg:mb-3 flex items-center justify-center" 
                       style={{backgroundColor: 'rgba(139, 92, 246, 0.2)'}}>
                    <Download className="w-3 h-3 lg:w-5 lg:h-5" style={{color: '#8b5cf6'}} />
                  </div>
                                     <p className="text-xs lg:text-sm font-medium text-gray-300">
                     TYT Soru Kitapçığı
                   </p>
                   <p className="text-xs mt-0.5 lg:mt-1 text-gray-400">
                     Sorular + Cevap Anahtarı
                   </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* AYT Bölümü */}
        <div>
          <div className="flex items-center gap-2 lg:gap-4 mb-4 lg:mb-8">
            <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center" 
                 style={{backgroundColor: 'rgba(167, 139, 250, 0.15)'}}>
              <FileText className="w-4 h-4 lg:w-6 lg:h-6" style={{color: '#a78bfa'}} />
            </div>
            <div>
              <h2 className="text-xl lg:text-3xl font-semibold text-white">
                AYT Çıkmış Sorular
              </h2>
                             <p className="text-sm lg:text-base text-gray-300">
                 Alan Yeterlilik Testi - Geçmiş yıl soruları
               </p>
               <p className="text-xs lg:text-sm mt-0.5 lg:mt-1 text-gray-400">
                 💡 Cevap anahtarları PDF&apos;lerin sonunda yer almaktadır
               </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
            {years.map((year) => (
              <a
                key={`ayt-${year}`}
                href={aytLinks[year]}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-3 lg:p-6 rounded-lg lg:rounded-2xl transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: 'rgba(167, 139, 250, 0.08)',
                  border: '1px solid rgba(167, 139, 250, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.backgroundColor = 'rgba(167, 139, 250, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.backgroundColor = 'rgba(167, 139, 250, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.2)'
                }}
              >
                <div className="flex items-center justify-between mb-2 lg:mb-4">
                  <div className="flex items-center gap-1.5 lg:gap-3">
                    <Calendar className="w-3 h-3 lg:w-5 lg:h-5" style={{color: '#a78bfa'}} />
                    <span className="text-sm lg:text-lg font-semibold text-white">
                      {year}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 opacity-50 group-hover:opacity-100 transition-opacity" 
                               style={{color: '#a78bfa'}} />
                </div>
                
                <div className="text-center">
                  <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl mx-auto mb-1.5 lg:mb-3 flex items-center justify-center" 
                       style={{backgroundColor: 'rgba(167, 139, 250, 0.2)'}}>
                    <Download className="w-3 h-3 lg:w-5 lg:h-5" style={{color: '#a78bfa'}} />
                  </div>
                                     <p className="text-xs lg:text-sm font-medium text-gray-300">
                     AYT Soru Kitapçığı
                   </p>
                   <p className="text-xs mt-0.5 lg:mt-1 text-gray-400">
                     Sorular + Cevap Anahtarı
                   </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 lg:mt-16 text-center">
          <div className="inline-block p-3 lg:p-4 rounded-xl lg:rounded-2xl" style={{backgroundColor: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
            <p className="text-xs lg:text-sm text-gray-300">
              <span style={{color: '#8b5cf6'}}>✓</span> Tüm linkler resmi ÖSYM kaynaklarına yönlendirmektedir. 
              Güncel duyurular için <a href="https://osym.gov.tr" className="underline font-medium" style={{color: '#a78bfa'}}>ÖSYM resmi sitesini</a> takip edin.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
} 