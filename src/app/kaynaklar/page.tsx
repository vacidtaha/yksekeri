"use client";

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
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f7'}}>
      <Header alwaysShow={true} />
      
      <div className="max-w-6xl mx-auto px-4 py-12 pt-32">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6" style={{color: '#1d1d1f'}}>
            Kaynaklar
          </h1>
          <p className="text-xl max-w-4xl mx-auto font-light leading-relaxed mb-8" style={{color: '#6e6e73'}}>
            Geçmiş yıl sınav sorularına ÖSYM&apos;nin resmi PDF önizleme sayfaları üzerinden erişin.
          </p>
          
          {/* Telif Hakları Uyarısı */}
          <div className="max-w-4xl mx-auto p-6 rounded-2xl mb-8" style={{backgroundColor: 'rgba(255, 149, 0, 0.08)', border: '1px solid rgba(255, 149, 0, 0.2)'}}>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" 
                   style={{backgroundColor: 'rgba(255, 149, 0, 0.2)'}}>
                <span className="text-lg">⚖️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{color: '#1d1d1f'}}>
                  Telif Hakları ve Yasal Uyarı
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{color: '#6e6e73'}}>
                  Sınav soruları <strong>Türk Fikir ve Sanat Eserleri Kanunu (FSEK)</strong> kapsamında telif hakkı koruması altındadır. 
                  Bu nedenle sorular doğrudan sitemizde barındırılmamakta, yalnızca <strong>ÖSYM&apos;nin resmi PDF önizleme sayfalarına</strong> yönlendirme yapılmaktadır.
                </p>
                <p className="text-sm" style={{color: '#86868b'}}>
                  Tüm linkler ÖSYM&apos;nin dokuman.osym.gov.tr ve cdn.osym.gov.tr alt domainlerine yönlendirmektedir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TYT Bölümü */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" 
                 style={{backgroundColor: 'rgba(0, 122, 255, 0.1)'}}>
              <FileText className="w-6 h-6" style={{color: '#007AFF'}} />
            </div>
            <div>
              <h2 className="text-3xl font-semibold" style={{color: '#1d1d1f'}}>
                TYT Çıkmış Sorular
              </h2>
                             <p className="text-base" style={{color: '#6e6e73'}}>
                 Temel Yeterlilik Testi - Geçmiş yıl soruları
               </p>
               <p className="text-sm mt-1" style={{color: '#86868b'}}>
                 💡 Cevap anahtarları PDF&apos;lerin sonunda yer almaktadır
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {years.map((year) => (
              <a
                key={`tyt-${year}`}
                href={tytLinks[year]}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.backgroundColor = '#ffffff'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{color: '#007AFF'}} />
                    <span className="text-lg font-semibold" style={{color: '#1d1d1f'}}>
                      {year}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" 
                               style={{color: '#007AFF'}} />
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" 
                       style={{backgroundColor: 'rgba(0, 122, 255, 0.1)'}}>
                    <Download className="w-5 h-5" style={{color: '#007AFF'}} />
                  </div>
                                     <p className="text-sm font-medium" style={{color: '#6e6e73'}}>
                     TYT Soru Kitapçığı
                   </p>
                   <p className="text-xs mt-1" style={{color: '#86868b'}}>
                     Sorular + Cevap Anahtarı
                   </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* AYT Bölümü */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" 
                 style={{backgroundColor: 'rgba(52, 199, 89, 0.1)'}}>
              <FileText className="w-6 h-6" style={{color: '#34C759'}} />
            </div>
            <div>
              <h2 className="text-3xl font-semibold" style={{color: '#1d1d1f'}}>
                AYT Çıkmış Sorular
              </h2>
                             <p className="text-base" style={{color: '#6e6e73'}}>
                 Alan Yeterlilik Testi - Geçmiş yıl soruları
               </p>
               <p className="text-sm mt-1" style={{color: '#86868b'}}>
                 💡 Cevap anahtarları PDF&apos;lerin sonunda yer almaktadır
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {years.map((year) => (
              <a
                key={`ayt-${year}`}
                href={aytLinks[year]}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.backgroundColor = 'rgba(52, 199, 89, 0.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.backgroundColor = '#ffffff'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{color: '#34C759'}} />
                    <span className="text-lg font-semibold" style={{color: '#1d1d1f'}}>
                      {year}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" 
                               style={{color: '#34C759'}} />
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" 
                       style={{backgroundColor: 'rgba(52, 199, 89, 0.1)'}}>
                    <Download className="w-5 h-5" style={{color: '#34C759'}} />
                  </div>
                                     <p className="text-sm font-medium" style={{color: '#6e6e73'}}>
                     AYT Soru Kitapçığı
                   </p>
                   <p className="text-xs mt-1" style={{color: '#86868b'}}>
                     Sorular + Cevap Anahtarı
                   </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-16 text-center">
          <div className="inline-block p-4 rounded-2xl" style={{backgroundColor: 'rgba(52, 199, 89, 0.08)'}}>
            <p className="text-sm" style={{color: '#6e6e73'}}>
              <span style={{color: '#34C759'}}>✓</span> Tüm linkler resmi ÖSYM kaynaklarına yönlendirmektedir. 
              Güncel duyurular için <a href="https://osym.gov.tr" className="underline font-medium" style={{color: '#007AFF'}}>ÖSYM resmi sitesini</a> takip edin.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
} 