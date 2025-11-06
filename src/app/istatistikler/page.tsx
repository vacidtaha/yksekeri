"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { BookOpen, Calculator, TestTube, Globe, Brain, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuestionData {
  [year: string]: number;
}

interface TopicData {
  [topic: string]: QuestionData;
}

interface TYTData {
  [subject: string]: TopicData;
}

interface AYTData {
  [subject: string]: TopicData;
}

const tytSubjectIcons: Record<string, LucideIcon> = {
  "TYT Matematik": Calculator,
  "TYT Geometri": Calculator,
  "TYT Türkçe": BookOpen,
  "TYT Fizik": TestTube,
  "TYT Kimya": TestTube,
  "TYT Biyoloji": TestTube,
  "TYT Tarih": Globe,
  "TYT Coğrafya": MapPin,
  "TYT Felsefe": Brain,
  "TYT Din Kültürü": Brain,
};

const aytSubjectIcons: Record<string, LucideIcon> = {
  "AYT Matematik": Calculator,
  "AYT Geometri": Calculator,
  "AYT Fizik": TestTube,
  "AYT Kimya": TestTube,
  "AYT Biyoloji": TestTube,
  "AYT Türk Dili ve Edebiyatı": BookOpen,
  "AYT Tarih 1": Globe,
  "AYT Tarih 2": Globe,
  "AYT Coğrafya 1": MapPin,
  "AYT Coğrafya 2": MapPin,
  "AYT Felsefe": Brain,
  "AYT Din Kültürü": Brain,
};

export default function TYTIstatistiklerPage() {
  const [tytData, setTytData] = useState<TYTData | null>(null);
  const [aytData, setAytData] = useState<AYTData | null>(null);
  const [selectedTytSubject, setSelectedTytSubject] = useState<string | null>(null);
  const [selectedAytSubject, setSelectedAytSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tytResponse, aytResponse] = await Promise.all([
          fetch('/tytsorular.json'),
          fetch('/aytsorular.json')
        ]);
        
        const tytJsonData = await tytResponse.json();
        const aytJsonData = await aytResponse.json();
        
        setTytData(tytJsonData);
        setAytData(aytJsonData);
        
        // URL parametresinden ders seçimi
        const urlParams = new URLSearchParams(window.location.search);
        const subjectParam = urlParams.get('subject');
        
        if (subjectParam) {
          // TYT derslerinde varsa seç
          if (tytJsonData[subjectParam]) {
            setSelectedTytSubject(subjectParam);
            // AYT için ilk dersi seç
            const firstAytSubject = Object.keys(aytJsonData)[0];
            setSelectedAytSubject(firstAytSubject);
          }
          // AYT derslerinde varsa seç
          else if (aytJsonData[subjectParam]) {
            setSelectedAytSubject(subjectParam);
            // TYT için ilk dersi seç
            const firstTytSubject = Object.keys(tytJsonData)[0];
            setSelectedTytSubject(firstTytSubject);
          }
          // Bulunamazsa varsayılanları seç
          else {
            const firstTytSubject = Object.keys(tytJsonData)[0];
            const firstAytSubject = Object.keys(aytJsonData)[0];
            setSelectedTytSubject(firstTytSubject);
            setSelectedAytSubject(firstAytSubject);
          }
        } else {
          // İlk dersleri varsayılan olarak seç
          const firstTytSubject = Object.keys(tytJsonData)[0];
          const firstAytSubject = Object.keys(aytJsonData)[0];
          setSelectedTytSubject(firstTytSubject);
          setSelectedAytSubject(firstAytSubject);
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hash ile scroll etme
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#ayt') {
      setTimeout(() => {
        const aytElement = document.getElementById('ayt');
        if (aytElement) {
          aytElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [loading]);

  // Seçili ders için mevcut yılları hesapla
  const getYearsForSubject = (subjectData: TopicData): string[] => {
    const allYears = new Set<string>();
    Object.values(subjectData).forEach((topic: QuestionData) => {
      Object.keys(topic).forEach(year => {
        if (year !== 'Toplam') {
          allYears.add(year);
        }
      });
    });
    return Array.from(allYears).sort((a, b) => parseInt(b) - parseInt(a));
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{backgroundColor: '#0a0e27'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!tytData || !selectedTytSubject || !aytData || !selectedAytSubject) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{backgroundColor: '#0a0e27'}}>
        <p className="text-gray-400">Veri bulunamadı.</p>
      </div>
    );
  }

  // TYT verileri
  const tytSubjects = Object.keys(tytData);
  const selectedTytData = tytData[selectedTytSubject];
  const tytTopics = Object.entries(selectedTytData).filter(([key]) => key !== 'Toplam');
  const tytYears = getYearsForSubject(selectedTytData);

  // AYT verileri
  const aytSubjects = Object.keys(aytData);
  const selectedAytData = aytData[selectedAytSubject];
  const aytTopics = Object.entries(selectedAytData).filter(([key]) => key !== 'Toplam');
  const aytYears = getYearsForSubject(selectedAytData);

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#0a0e27'}}>
      <Header alwaysShow={true} />
      
      <div className="pt-20 lg:pt-32 pb-12 lg:pb-24 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Başlık */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4 lg:mb-6 text-white"
                style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
              TYT Soru Dağılım İstatistikleri
            </h1>
            <p className="text-sm lg:text-lg text-gray-400 max-w-2xl mx-auto"
               style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
              Her ders ve konu için yıllara göre çıkan soru sayılarını inceleyin
            </p>
          </div>

          {/* Ders Seçimi */}
          <div className="mb-8 lg:mb-12">
            <div className="flex flex-wrap gap-2 lg:gap-3 justify-center">
              {tytSubjects.map((subject) => {
                const Icon = tytSubjectIcons[subject] || BookOpen;
                const isSelected = selectedTytSubject === subject;
                return (
                  <button
                    key={subject}
                    onClick={() => setSelectedTytSubject(subject)}
                    className={`px-3 lg:px-4 py-2 lg:py-2.5 rounded text-xs lg:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected 
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isSelected 
                        ? 'rgba(30, 64, 175, 0.2)' 
                        : 'rgba(30, 64, 175, 0.08)',
                      border: isSelected 
                        ? '1px solid rgba(30, 64, 175, 0.4)' 
                        : '1px solid rgba(30, 64, 175, 0.2)',
                      fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span>{subject.replace('TYT ', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tablo */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div 
                className="rounded-xl lg:rounded-2xl overflow-hidden border"
                style={{
                  backgroundColor: 'rgba(30, 64, 175, 0.08)',
                  borderColor: 'rgba(30, 64, 175, 0.2)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <table className="min-w-full">
                  <thead>
                    <tr style={{backgroundColor: 'rgba(30, 64, 175, 0.15)'}}>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-white sticky left-0 z-10"
                          style={{
                            backgroundColor: 'rgba(30, 64, 175, 0.2)',
                            fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                          }}>
                        Konu
                      </th>
                      {tytYears.map((year) => (
                        <th key={year} className="px-3 lg:px-4 py-3 lg:py-4 text-center text-xs lg:text-sm font-semibold text-white"
                            style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                          {year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tytTopics.map(([topic, values], index) => {
                      return (
                        <tr 
                          key={topic}
                          className="transition-colors duration-150 cursor-default"
                          style={{
                            backgroundColor: index % 2 === 0 
                              ? 'rgba(30, 64, 175, 0.05)' 
                              : 'rgba(30, 64, 175, 0.02)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(30, 64, 175, 0.15)';
                            const firstCell = e.currentTarget.querySelector('td:first-child') as HTMLElement;
                            if (firstCell) {
                              firstCell.style.backgroundColor = 'rgba(30, 64, 175, 0.25)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = index % 2 === 0 
                              ? 'rgba(30, 64, 175, 0.05)' 
                              : 'rgba(30, 64, 175, 0.02)';
                            const firstCell = e.currentTarget.querySelector('td:first-child') as HTMLElement;
                            if (firstCell) {
                              firstCell.style.backgroundColor = index % 2 === 0 
                                ? 'rgba(30, 64, 175, 0.1)' 
                                : 'rgba(30, 64, 175, 0.08)';
                            }
                          }}
                        >
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-white sticky left-0 z-10 transition-colors duration-150"
                              style={{
                                backgroundColor: index % 2 === 0 
                                  ? 'rgba(30, 64, 175, 0.1)' 
                                  : 'rgba(30, 64, 175, 0.08)',
                                fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                              }}>
                            {topic}
                          </td>
                          {tytYears.map((year) => {
                            const value = values[year] || 0;
                            return (
                              <td key={year} className="px-3 lg:px-4 py-3 lg:py-4 text-center text-xs lg:text-sm text-white"
                                  style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                                {value > 0 ? value : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bilgi Notu */}
          <div className="mt-8 lg:mt-12 text-center">
            <p className="text-xs lg:text-sm text-gray-400"
               style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
              * Veriler ÖSYM sınav sonuçlarına dayanmaktadır. İstatistikler kesin değildir lütfen kendi kaynakların ve araştırmalarınızla doğrulayın.
            </p>
          </div>

        </div>
      </div>

      {/* AYT Bölümü */}
      <div id="ayt" className="w-full py-12 lg:py-16 px-4 lg:px-6" style={{backgroundColor: '#1a0e27'}}>
        <div className="max-w-7xl mx-auto">
            {/* Başlık */}
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4 lg:mb-6 text-white"
                  style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                AYT Soru Dağılım İstatistikleri
              </h2>
              <p className="text-sm lg:text-lg text-gray-400 max-w-2xl mx-auto"
                 style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                Her ders ve konu için yıllara göre çıkan soru sayılarını inceleyin
              </p>
            </div>

            {/* Ders Seçimi */}
            <div className="mb-8 lg:mb-12">
              <div className="flex flex-wrap gap-2 lg:gap-3 justify-center">
                {aytSubjects.map((subject) => {
                  const Icon = aytSubjectIcons[subject] || BookOpen;
                  const isSelected = selectedAytSubject === subject;
                  return (
                    <button
                      key={subject}
                      onClick={() => setSelectedAytSubject(subject)}
                      className={`px-3 lg:px-4 py-2 lg:py-2.5 rounded text-xs lg:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        isSelected 
                          ? 'text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: isSelected 
                          ? 'rgba(139, 92, 246, 0.2)' 
                          : 'rgba(139, 92, 246, 0.08)',
                        border: isSelected 
                          ? '1px solid rgba(139, 92, 246, 0.4)' 
                          : '1px solid rgba(139, 92, 246, 0.2)',
                        fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                      }}
                    >
                      <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      <span>{subject.replace('AYT ', '')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div 
                  className="rounded-xl lg:rounded-2xl overflow-hidden border"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    borderColor: 'rgba(139, 92, 246, 0.2)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <table className="min-w-full">
                    <thead>
                      <tr style={{backgroundColor: 'rgba(139, 92, 246, 0.15)'}}>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-white sticky left-0 z-10"
                            style={{
                              backgroundColor: 'rgba(139, 92, 246, 0.2)',
                              fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                            }}>
                          Konu
                        </th>
                        {aytYears.map((year) => (
                          <th key={year} className="px-3 lg:px-4 py-3 lg:py-4 text-center text-xs lg:text-sm font-semibold text-white"
                              style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
                            {year}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {aytTopics.map(([topic, values], index) => {
                        return (
                          <tr 
                            key={topic}
                            className="transition-colors duration-150 cursor-default"
                            style={{
                              backgroundColor: index % 2 === 0 
                                ? 'rgba(139, 92, 246, 0.05)' 
                                : 'rgba(139, 92, 246, 0.02)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.15)';
                              const firstCell = e.currentTarget.querySelector('td:first-child') as HTMLElement;
                              if (firstCell) {
                                firstCell.style.backgroundColor = 'rgba(139, 92, 246, 0.25)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = index % 2 === 0 
                                ? 'rgba(139, 92, 246, 0.05)' 
                                : 'rgba(139, 92, 246, 0.02)';
                              const firstCell = e.currentTarget.querySelector('td:first-child') as HTMLElement;
                              if (firstCell) {
                                firstCell.style.backgroundColor = index % 2 === 0 
                                  ? 'rgba(139, 92, 246, 0.1)' 
                                  : 'rgba(139, 92, 246, 0.08)';
                              }
                            }}
                          >
                            <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-white sticky left-0 z-10 transition-colors duration-150"
                                style={{
                                  backgroundColor: index % 2 === 0 
                                    ? 'rgba(139, 92, 246, 0.1)' 
                                    : 'rgba(139, 92, 246, 0.08)',
                                  fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                                }}>
                              {topic}
                            </td>
                            {aytYears.map((year) => {
                              const value = values[year] || 0;
                              return (
                                <td key={year} className="px-3 lg:px-4 py-3 lg:py-4 text-center text-xs lg:text-sm text-white"
                                    style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                                  {value > 0 ? value : '-'}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bilgi Notu */}
            <div className="mt-8 lg:mt-12 text-center">
              <p className="text-xs lg:text-sm text-gray-400"
                 style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
                * Veriler ÖSYM sınav sonuçlarına dayanmaktadır. İstatistikler kesin değildir lütfen kendi kaynakların ve araştırmalarınızla doğrulayın.
              </p>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

