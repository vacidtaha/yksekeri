"use client";

import { Shield, Lock, Eye, Server, FileText, AlertTriangle, Cookie } from "lucide-react";
import { Header } from "@/components/ui/header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function GizlilikPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#000000'}}>
      <Header alwaysShow={true} />

      <div className="max-w-5xl mx-auto px-4 py-12 pt-20 lg:pt-32 pb-24 lg:pb-12">
        
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
        <div className="text-center mb-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" 
               style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
            <Shield className="w-8 h-8" style={{color: '#FF9500'}} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" 
              style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
            Gizlilik Politikası
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: '#86868b'}}>
            YKS Şekeri olarak gizliliğinize saygı duyuyor, minimum veri toplama prensibiyle hareket ediyoruz. 
            Bu belge hangi verileri neden işlediğimizi ve haklarınızı açıklar.
          </p>
          <div className="mt-6 text-sm" style={{color: '#515154'}}>
            Son güncelleme: {mounted ? new Date().toLocaleDateString('tr-TR') : '06.11.2025'}
          </div>
        </div>

        {/* İçerik */}
        <div className="space-y-16">
          
          {/* Giriş */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <FileText className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  1. Giriş
                </h2>
              </div>
              <p className="text-base leading-relaxed" style={{color: '#86868b'}}>
                YKS Şekeri (&quot;Site&quot;, &quot;biz&quot;) TYT & AYT hazırlığındaki öğrencilerin ücretsiz, reklamsız ve 
                kâr amacı gütmeyen biçimde eğitim içeriğine, video derslere ve kaynaklara ulaşmasını sağlar. 
                Kullanıcı kaydı, üyelik veya giriş sistemi yoktur. Gizliliğinize saygı duyuyor, zorunlu olmadıkça 
                hiçbir kişisel veri işlemiyoruz.
              </p>
            </div>
          </section>

          {/* Çerezler ve Yerel Depolama */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <Cookie className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  2. Çerez Kullanımı ve Yerel Depolama
                </h2>
              </div>
              
              <p className="mb-6" style={{color: '#86868b'}}>
                Sitemizde deneyiminizi iyileştirmek için çerezler ve tarayıcı yerel depolaması kullanılmaktadır.
              </p>

              <div className="space-y-4">
                {/* Gerekli Çerezler */}
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#f5f5f7'}}>
                    🔒 Gerekli Çerezler ve Yerel Depolama
                  </h4>
                  <p className="mb-3 text-sm" style={{color: '#86868b'}}>
                    Bu veriler sitenin çalışması için zorunludur ve devre dışı bırakılamaz:
                  </p>
                  <ul className="space-y-2 text-sm" style={{color: '#86868b'}}>
                    <li>• <strong>Çerez Tercihleri:</strong> Hangi çerezleri kabul ettiğiniz bilgisi (localStorage)</li>
                    <li>• <strong>Konu İlerlemesi:</strong> Hangi konuları tamamladığınız (localStorage)</li>
                    <li>• <strong>Test Sonuçları:</strong> Quiz ve soru çözüm geçmişiniz (localStorage)</li>
                    <li>• <strong>Çalışma Takibi:</strong> Odaklan sayfasında kaydettiğiniz çalışma seansları, süreleri ve başarı bilgileri (localStorage)</li>
                    <li>• <strong>Tema ve Tercihler:</strong> Görsel ayarlarınız (localStorage)</li>
                  </ul>
                  <p className="mt-3 text-xs" style={{color: '#515154'}}>
                    ⚠️ Bu veriler SADECE tarayıcınızda saklanır, sunucularımıza GÖNDERİLMEZ.
                  </p>
                </div>

                {/* Analitik Çerezler */}
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#a78bfa'}}>
                    📊 Analitik Çerezler (Google Analytics) - OPSİYONEL
                  </h4>
                  <p className="mb-3 text-sm" style={{color: '#86868b'}}>
                    Site kullanımını analiz etmek için Google Analytics kullanıyoruz. 
                    <strong> Bu çerezler SADECE siz kabul ederseniz aktif olur.</strong>
                  </p>
                  <div className="mb-3">
                    <p className="font-semibold mb-2 text-sm" style={{color: '#f5f5f7'}}>Toplanan Bilgiler:</p>
                    <ul className="space-y-1 text-sm" style={{color: '#86868b'}}>
                      <li>• Ziyaret edilen sayfalar ve kalış süreleri</li>
                      <li>• Hangi ders ve konuların seçildiği</li>
                      <li>• Hangi videoların izlendiği</li>
                      <li>• Hangi PDF'lerin indirildiği</li>
                      <li>• Cihaz türü (mobil/tablet/masaüstü)</li>
                      <li>• Tarayıcı ve işletim sistemi</li>
                      <li>• Yaklaşık coğrafi konum (şehir düzeyinde, IP'den)</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(0,0,0,0.2)'}}>
                    <p className="text-xs" style={{color: '#a78bfa'}}>
                      <strong>Measurement ID:</strong> G-Z9CYVQH0FK<br/>
                      <strong>Veri Sahibi:</strong> Google LLC<br/>
                      <strong>Gizlilik:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Google Gizlilik Politikası</a><br/>
                      <strong>Opt-out:</strong> Çerez banner'ından &quot;Reddet&quot; seçeneği ile tamamen kapatabilirsiniz
                    </p>
                  </div>
                </div>

                {/* Fonksiyonel Çerezler */}
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#f5f5f7'}}>
                    ⚙️ Fonksiyonel Çerezler - OPSİYONEL
                  </h4>
                  <p className="mb-2 text-sm" style={{color: '#86868b'}}>
                    Gelişmiş özellikler için kullanılır. İsterseniz kapatabilirsiniz:
                  </p>
                  <ul className="space-y-1 text-sm" style={{color: '#86868b'}}>
                    <li>• Video oynatıcı tercihleri (ses seviyesi, otomatik oynatma)</li>
                    <li>• Favori ders listeleri</li>
                    <li>• Özelleştirilmiş ders yol haritası</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Topladığımız Veriler */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <Eye className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  3. Veri Toplama ve Saklama Detayları
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Veri Kategorisi</th>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Ne Zaman/Kimden</th>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Amaç</th>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Saklama Yeri / Süresi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Konu ilerlemesi, test sonuçları, çalışma seansları</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Ders sayfaları ve Odaklan modu kullanımı</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Kaldığınız yerden devam edebilmeniz ve çalışma takibi</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Tarayıcınızın localStorage'ında (sunucuya gönderilmez)</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Çerez tercihleri</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>İlk ziyaret ve tercih değişikliklerinde</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Çerez onayınızı hatırlamak</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>localStorage'da kalıcı (siz silene kadar)</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Analytics verileri (opsiyonel)</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Sadece çerez onayı verdiyseniz</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Site kullanımını analiz etmek</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Google Analytics'te 26 ay</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Sunucu logları (IP, tarayıcı)</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Her sayfa ziyaretinde otomatik</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Güvenlik ve hata ayıklama</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Sunucuda maksimum 7 gün</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>İletişim formu verileri</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>İletişim formu gönderiminde</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Sorularınızı yanıtlamak</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>E-posta sisteminde 90 gün, sonra silinir</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 rounded-xl" style={{backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)'}}>
                <p className="text-sm" style={{color: '#ff9f92'}}>
                  <strong>Toplamadığımız bilgiler:</strong> Ad-soyad (form dışında), TC kimlik no, telefon (zorunlu değil), 
                  kesin konum (GPS), ödeme bilgileri, sosyal medya profilleri, üçüncü taraf hesap bilgileri.
                </p>
              </div>
            </div>
          </section>

          {/* Google Analytics Detayları */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.3)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(139,92,246,0.2)'}}>
                  <Eye className="w-5 h-5" style={{color: '#a78bfa'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#a78bfa', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  4. Google Analytics 4 (GA4) Kullanımı
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{color: '#f5f5f7'}}>Neden Kullanıyoruz?</h4>
                  <p className="text-sm leading-relaxed" style={{color: '#86868b'}}>
                    Sitenin nasıl kullanıldığını anlamak, hangi içeriklerin popüler olduğunu görmek ve 
                    kullanıcı deneyimini iyileştirmek için anonim kullanım istatistikleri topluyoruz.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3" style={{color: '#f5f5f7'}}>Toplanan Analytics Verileri:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(0,0,0,0.2)'}}>
                      <h5 className="font-medium mb-2 text-sm" style={{color: '#a78bfa'}}>Genel İstatistikler</h5>
                      <ul className="space-y-1 text-xs" style={{color: '#86868b'}}>
                        <li>• Sayfa görüntülemeleri</li>
                        <li>• Oturum süreleri</li>
                        <li>• Bounce rate (hemen çıkma oranı)</li>
                        <li>• Kullanıcı akışı (hangi sayfadan hangi sayfaya)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(0,0,0,0.2)'}}>
                      <h5 className="font-medium mb-2 text-sm" style={{color: '#a78bfa'}}>Eğitim Metrikleri</h5>
                      <ul className="space-y-1 text-xs" style={{color: '#86868b'}}>
                        <li>• Hangi dersler/konular seçiliyor</li>
                        <li>• Hangi videolar izleniyor</li>
                        <li>• Hangi PDF'ler indiriliyor</li>
                        <li>• Konu tamamlama oranları</li>
                        <li>• Odaklan modu kullanım süreleri ve kronometro aktiviteleri</li>
                        <li>• Ambient ses tercihleri ve kullanım sıklıkları</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(0,0,0,0.2)'}}>
                      <h5 className="font-medium mb-2 text-sm" style={{color: '#a78bfa'}}>Teknik Bilgiler</h5>
                      <ul className="space-y-1 text-xs" style={{color: '#86868b'}}>
                        <li>• Cihaz türü ve ekran çözünürlüğü</li>
                        <li>• Tarayıcı ve işletim sistemi</li>
                        <li>• Dil tercihi</li>
                        <li>• Nereden geldiğiniz (referrer)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(0,0,0,0.2)'}}>
                      <h5 className="font-medium mb-2 text-sm" style={{color: '#a78bfa'}}>Demografi (Opsiyonel)</h5>
                      <ul className="space-y-1 text-xs" style={{color: '#86868b'}}>
                        <li>• Yaş grubu (tahmini)</li>
                        <li>• Cinsiyet (tahmini)</li>
                        <li>• İlgi alanları (tahmini)</li>
                        <li>• Şehir/Bölge</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.2)'}}>
                  <p className="text-sm" style={{color: '#8ee4af'}}>
                    ✅ <strong>Gizliliğiniz korunur:</strong> Google Analytics anonim/takma ad (pseudonymized) veri toplar. 
                    Tam IP adresiniz maskelenir, kişisel kimliğiniz belirlenmez. İsterseniz çerez banner&apos;ından veya 
                    tarayıcı ayarlarınızdan tamamen kapatabilirsiniz.
                  </p>
                </div>

                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(0,122,255,0.1)', border: '1px solid rgba(0,122,255,0.2)'}}>
                  <p className="text-sm" style={{color: '#64d2ff'}}>
                    <strong>Çerezleri Reddetme Hakkınız:</strong> İlk ziyaretinizde görünen çerez banner'ından 
                    &quot;Reddet&quot; veya &quot;Özelleştir&quot; seçenekleriyle analytics çerezlerini kapatabilirsiniz. 
                    Reddederseniz Google Analytics hiçbir veri toplamaz.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Veri Paylaşımı */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <AlertTriangle className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  5. Veri Paylaşımı ve Üçüncü Taraflar
                </h2>
              </div>
              
              <div className="space-y-4">
                <p style={{color: '#86868b'}}>
                  Kişisel verilerinizi reklam ağları, pazarlama şirketleri veya veri aracılarıyla <strong>KESİNLİKLE PAYLAŞMAYIZ</strong>.
                </p>
                
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#f5f5f7'}}>Üçüncü Taraf Hizmetler:</h4>
                  <ul className="space-y-2 text-sm" style={{color: '#86868b'}}>
                    <li>• <strong>Google Analytics:</strong> Sadece sizin onayınızla anonim kullanım verileri</li>
                    <li>• <strong>YouTube:</strong> Video embed'leri için (YouTube'un kendi politikalarına tabi)</li>
                    <li>• <strong>ÖSYM:</strong> Resmi soru PDF linklerinin yönlendirmeleri</li>
                  </ul>
                </div>
                
                <p style={{color: '#86868b'}}>
                  Yasal zorunluluk hâlinde ve minimum kapsamla yetkili makamlara açıklama yapılabilir 
                  (mahkeme kararı, savcılık talebi, vb.).
                </p>
              </div>
            </div>
          </section>

          {/* Veri Güvenliği */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <Shield className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  6. Veri Güvenliği
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <h4 className="font-semibold mb-3 flex items-center" style={{color: '#f5f5f7'}}>
                    <Lock className="w-4 h-4 mr-2" style={{color: '#34C759'}} />
                    Teknik Güvenlik Önlemleri
                  </h4>
                  <ul className="space-y-2" style={{color: '#86868b'}}>
                    <li>• Sunucu–tarayıcı trafiği TLS 1.3/HTTPS ile şifrelenir</li>
                    <li>• Sunucu erişimleri çok faktörlü kimlik doğrulamaya ve sınırlı IP listelerine tabidir</li>
                    <li>• Site kodu düzenli olarak güncellenir ve güvenlik yamaları uygulanır</li>
                    <li>• CDN servisleri ile DDoS saldırılarına karşı korunma sağlanır</li>
                    <li>• XSS, CSRF ve SQL injection saldırılarına karşı koruma aktiftir</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <h4 className="font-semibold mb-3 flex items-center" style={{color: '#f5f5f7'}}>
                    <Server className="w-4 h-4 mr-2" style={{color: '#6366F1'}} />
                    Fiziksel ve Altyapı Güvenliği
                  </h4>
                  <ul className="space-y-2" style={{color: '#86868b'}}>
                    <li>• Sunucular ISO 27001 sertifikalı veri merkezlerinde barındırılır</li>
                    <li>• Günlük otomatik yedekleme sistemi mevcuttur</li>
                    <li>• Sistem logları güvenli ortamda saklanır ve izlenir</li>
                    <li>• Yetkisiz erişim girişimleri anlık olarak algılanır ve engellenir</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.2)'}}>
                  <p className="text-sm" style={{color: '#8ee4af'}}>
                    <strong>Güvenlik İhlali Durumunda:</strong> Herhangi bir güvenlik ihlali tespit edildiğinde, 
                    etkilenen kullanıcılar 72 saat içinde bilgilendirilir ve gerekli önlemler hemen alınır.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Haklarınız */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <FileText className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  7. Haklarınız (KVKK & GDPR)
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Hak</th>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Nasıl Kullanılır?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Bilgi Alma</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Hangi verilerin işlenip saklandığını bize sorabilirsiniz.</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Çerezleri Reddetme</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Çerez banner'ından analytics çerezlerini reddedebilir veya tarayıcı ayarlarından silebilirsiniz.</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Silme / Unutulma</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>
                        E-posta geri bildirimlerinizi sildirebilirsiniz. localStorage verilerinizi tarayıcınızdan silebilirsiniz. 
                        Google Analytics verilerinizi Google'dan talep edebilirsiniz.
                      </td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>İtiraz & Kısıtlama</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Veri işlemeye itiraz edebilir, işlemenin durdurulmasını talep edebilirsiniz.</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Düzeltme</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Yanlış işlenmiş kişisel verilerinizin düzeltilmesini talep edebilirsiniz.</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Taşınabilirlik</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Verilerinizi yapılandırılmış, yaygın formatta (JSON) talep edebilirsiniz.</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Denetim Kurumuna Şikayet</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>
                        KVKK Kurulu'na (<a href="https://www.kvkk.gov.tr" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">www.kvkk.gov.tr</a>) 
                        veya AB veri koruma otoritelerine başvurabilirsiniz.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 rounded-xl" style={{backgroundColor: 'rgba(0,122,255,0.1)', border: '1px solid rgba(0,122,255,0.2)'}}>
                <p className="text-sm" style={{color: '#64d2ff'}}>
                  <strong>Yanıt Süresi:</strong> Taleplerinize 30 gün içinde yanıt veririz. Karmaşık durumlarda bu süre 60 güne uzatılabilir. 
                  Taleplerinizi <a href="/iletisim" className="underline font-medium">iletişim sayfası</a> üzerinden iletebilirsiniz.
                </p>
              </div>
            </div>
          </section>

          {/* 18 Yaş Altı Kullanıcılar */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <AlertTriangle className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  8. Çocukların Gizliliği (18 Yaş Altı)
                </h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-base leading-relaxed" style={{color: '#86868b'}}>
                  Site lise öğrencilerini hedefler ve çoğu kullanıcımızın 15-18 yaş aralığında olduğunu biliyoruz. 
                  Çocukların gizliliğini korumak için özel önem gösteriyoruz:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                    <h4 className="font-semibold mb-3" style={{color: '#f5f5f7'}}>13 Yaş Altı</h4>
                    <ul className="space-y-2 text-sm" style={{color: '#86868b'}}>
                      <li>• Ebeveyn gözetiminde kullanmanızı öneririz</li>
                      <li>• İletişim formu kullanımında ebeveyn onayı gerekir</li>
                      <li>• Analytics çerezleri için ebeveyn onayı alınmalıdır</li>
                      <li>• Kişisel veri işleme konusunda ekstra dikkatli davranırız</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                    <h4 className="font-semibold mb-3" style={{color: '#f5f5f7'}}>13-18 Yaş Arası</h4>
                    <ul className="space-y-2 text-sm" style={{color: '#86868b'}}>
                      <li>• Siteyi güvenle kullanabilirsiniz</li>
                      <li>• Kişisel veri toplamadığımız için ek onay gerekmez</li>
                      <li>• Çerez tercihlerinizi kendiniz yönetebilirsiniz</li>
                      <li>• Sorun yaşadığınızda ebeveynlerinizle birlikte bize ulaşabilirsiniz</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,204,0,0.1)', border: '1px solid rgba(255,204,0,0.2)'}}>
                  <p className="text-sm" style={{color: '#ffcc73'}}>
                    <strong>Önemli:</strong> Hiçbir yaşta kullanıcıdan gereksiz kişisel bilgi talep etmiyoruz. 
                    İlerleme verileriniz sadece kendi cihazınızda saklanır, sunucumuza gönderilmez.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Politika Değişiklikleri */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <FileText className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  9. Politika Değişiklikleri
                </h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-base leading-relaxed" style={{color: '#86868b'}}>
                  Hukuki/teknik ihtiyaç hâlinde bu sayfayı güncelleyebiliriz. Üstteki &quot;Son güncelleme&quot; tarihi 
                  değiştiğinde yeni sürüm yürürlüğe girmiş sayılır.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                    <h4 className="font-semibold mb-3" style={{color: '#f5f5f7'}}>Önemsiz Değişiklikler</h4>
                    <ul className="space-y-2 text-sm" style={{color: '#86868b'}}>
                      <li>• Yazım yanlışları düzeltmeleri</li>
                      <li>• İletişim bilgileri güncellemesi</li>
                      <li>• Görsel iyileştirmeler</li>
                      <li>• Açıklama metinlerinin netleştirilmesi</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                    <h4 className="font-semibold mb-3" style={{color: '#f5f5f7'}}>Önemli Değişiklikler</h4>
                    <ul className="space-y-2 text-sm" style={{color: '#86868b'}}>
                      <li>• Yeni veri toplama kategorileri</li>
                      <li>• Üçüncü taraf entegrasyonları</li>
                      <li>• Veri saklama sürelerinde değişiklik</li>
                      <li>• Kullanıcı hakları konusunda güncellemeler</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(0,122,255,0.1)', border: '1px solid rgba(0,122,255,0.2)'}}>
                  <p className="text-sm" style={{color: '#64d2ff'}}>
                    <strong>Önemli Değişiklik Bildirimi:</strong> Veri işleme şeklimizde köklü değişiklik olduğunda, 
                    ana sayfada duyuru yaparak ve mümkünse e-posta ile (eğer iletişim bilginiz varsa) sizi bilgilendiririz.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* İletişim */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl mr-4 flex items-center justify-center" 
                     style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
                  <Server className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                  10. Bize Ulaşın
                </h2>
              </div>
              
              <p className="text-base leading-relaxed mb-6" style={{color: '#86868b'}}>
                Gizlilik politikası hakkında sorularınız, veri işleme talepleriniz veya şikayetleriniz için:
              </p>
              
              <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)'}}>
                <div className="text-sm space-y-2" style={{color: '#a78bfa'}}>
                  <p><strong>İletişim:</strong> <a href="/iletisim" className="underline">İletişim Formu</a></p>
                  <p><strong>Web:</strong> <a href="https://yksekeri.com" className="underline">yksekeri.com</a></p>
                  <p><strong>Yanıt Süresi:</strong> 30 gün (en geç 60 gün)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Özet */}
          <section>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(52,199,89,0.1)',
                border: '1px solid rgba(52,199,89,0.2)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center" 
                  style={{color: '#30d158', fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
                Özetle
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>Üyelik yok, kişisel veri toplamıyoruz.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>İlerleme ve çalışma takibi bilgileri yalnızca sizin tarayıcınızda durur.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>Analytics sadece onay verirseniz çalışır.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>Çerezleri istediğiniz zaman reddedebilirsiniz.</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>Reklam, takip çerezi, kâr amacı zaten yok.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>YouTube ve ÖSYM yönlendirmeleri harici politikalara tabidir.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>Haklarınızı kullanmak için dilediğiniz zaman bize ulaşabilirsiniz.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>KVKK ve GDPR uyumlu çalışıyoruz.</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-lg font-medium" style={{color: '#30d158'}}>
                  YKS Şekeri'de başarıya giden yolunuzda yalnızca bilgi iz bırakır; kişisel verileriniz değil! 🍬
                </p>
                <p className="text-sm mt-3" style={{color: '#8ee4af'}}>
                  Çalışma takibi ve kronometro kayıtlarınız da sadece sizin tarayıcınızda saklanır, asla sunucumuza gönderilmez.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
