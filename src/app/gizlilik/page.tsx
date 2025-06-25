"use client";

import { Shield, Lock, Eye, Server, FileText, AlertTriangle } from "lucide-react";
import { Header } from "@/components/ui/header";

export default function GizlilikPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#000000'}}>
      <Header alwaysShow={true} />

      <div className="max-w-5xl mx-auto px-4 py-12 pt-32">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" 
               style={{backgroundColor: 'rgba(255,149,0,0.2)'}}>
            <Shield className="w-8 h-8" style={{color: '#FF9500'}} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" 
              style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
            Gizlilik Politikası
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: '#86868b'}}>
            YKSekeri olarak gizliliğinize saygı duyuyor, minimum veri toplama prensibiyle hareket ediyoruz. Bu belge hangi verileri neden işlediğimizi ve haklarınızı açıklar.
          </p>
          <div className="mt-6 text-sm" style={{color: '#515154'}}>
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
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
                    style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
                  1. Giriş
                </h2>
              </div>
              <p className="text-base leading-relaxed" style={{color: '#86868b'}}>
                YKSekeri (&quot;Site&quot;, &quot;biz&quot;) TYT & AYT hazırlığındaki öğrencilerin ücretsiz, reklamsız ve kâr amacı gütmeyen biçimde içerik, PDF özet, interaktif test ve resmi ÖSYM bağlantılarına ulaşmasını sağlar. Kullanıcı kaydı, üyelik veya giriş sistemi yoktur. Gizliliğinize saygı duyuyor, zorunlu olmadıkça hiçbir kişisel veri işlemiyoruz. Bu metin hangi verileri neden işlediğimizi ve haklarınızı açıklar.
              </p>
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
                    style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
                  2. Topladığımız (ve Toplamadığımız) Veriler
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
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Konu ilerlemesi, test sonuçları, tema tercihi</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Ders haritası ve testleri kullanırken otomatik</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Seçimlerinizi hatırlayıp deneyiminizi kişiselleştirmek</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Yalnızca tarayıcınızın Local Storage alanında; sunucularımıza gönderilmez</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Cihaz/Tarayıcı bilgisi</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Siteye her girişte otomatik</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Arayüzü doğru çözünürlükte sunmak</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Sunucu günlüklerinde en fazla 24 saat</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>IP adresi</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Siteye bağlandığınızda</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>DDoS koruması ve hata ayıklama</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Güvenlik duvarı önbelleğinde birkaç dakika</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Geri bildirim mesajları</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>&quot;Bize Ulaşın&quot; formu</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Sorularınızı yanıtlamak</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>E-posta sistemimizde; 90 gün içinde silinir</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 rounded-xl" style={{backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)'}}>
                <p className="text-sm" style={{color: '#ff9f92'}}>
                  <strong>Toplamadığımız bilgiler:</strong> Ad, soyad, e-posta, telefon, konum, kimlik numarası, ödeme bilgileri ve çerez üzerinden davranış takibi.
                </p>
              </div>
            </div>
          </section>

          {/* Çerezler ve Teknolojiler */}
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
                  <Lock className="w-5 h-5" style={{color: '#FF9500'}} />
                </div>
                <h2 className="text-2xl font-semibold" 
                    style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
                  3. Çerezler, Yerel Depolama ve Benzeri Teknolojiler
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#f5f5f7'}}>Çerez (Cookie)</h4>
                  <p style={{color: '#86868b'}}>Kullanmıyoruz.</p>
                </div>
                
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#f5f5f7'}}>Local Storage</h4>
                  <p style={{color: '#86868b'}}>İlerleme verileri yalnızca sizde saklanır. İsterseniz tarayıcınızın &quot;Site Verilerini Temizle&quot; özelliğini kullanarak silebilirsiniz.</p>
                </div>
                
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <h4 className="font-semibold mb-2" style={{color: '#f5f5f7'}}>Service Worker / PWA Önbelleği</h4>
                  <p style={{color: '#86868b'}}>PDF özetler ve ders haritalarının çevrimdışı görüntülenmesine izin verir; aynı yöntemle temizlenebilir.</p>
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
                    style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
                  4. Veri Paylaşımı
                </h2>
              </div>
              
              <div className="space-y-4">
                <p style={{color: '#86868b'}}>
                  Reklam ağları, analiz şirketleri veya üçüncü taraf pazarlamacılarla veri paylaşmayız.
                </p>
                <p style={{color: '#86868b'}}>
                  Yalnızca yasal zorunluluk hâlinde ve minimum kapsamla yetkili makamlara açıklama yapılabilir.
                </p>
              </div>
            </div>
          </section>

          {/* Üçüncü Taraf Hizmetleri */}
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
                    style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
                  5. Üçüncü Taraf Hizmetleri
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Hizmet</th>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Neden Kullanıyoruz?</th>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>Paylaşılan Veri</th>
                      <th className="text-left py-3 px-2 font-semibold" style={{color: '#f5f5f7'}}>İlgili Politika</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>YouTube (gömülü videolar)</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Konu anlatım videolarını göstermek</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>IP adresi, YouTube&apos;un kendi çerezleri</td>
                      <td className="py-3 px-2">
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-400 hover:text-blue-300 underline">
                          YouTube Gizlilik Politikası
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>osym.gov.tr bağlantıları</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Resmî çıkmış soru PDF'lerine yönlendirme</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Tıklamada tarayıcınız &quot;referer&quot; başlığını gönderebilir</td>
                      <td className="py-3 px-2">
                        <a href="https://www.osym.gov.tr" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-400 hover:text-blue-300 underline">
                          ÖSYM Gizlilik Bildirimi
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 rounded-xl" style={{backgroundColor: 'rgba(0,122,255,0.1)', border: '1px solid rgba(0,122,255,0.2)'}}>
                <p className="text-sm" style={{color: '#64d2ff'}}>
                  YouTube içeriğini görmek istemezseniz tarayıcı eklentileriyle gömülü videoları engelleyebilirsiniz; Site çekirdek işlevlerini kaybetmezsiniz.
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
                     style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
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
                    <strong>Güvenlik İhlali Durumunda:</strong> Herhangi bir güvenlik ihlali tespit edildiğinde, etkilenen kullanıcılar 72 saat içinde bilgilendirilir ve gerekli önlemler hemen alınır.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Haklarınız (KVKK & GDPR) */}
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
                     style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
                   7. Haklarınız (KVKK & GDPR)
                 </h2>
               </div>
              
              <p className="mb-6" style={{color: '#86868b'}}>
                Kişisel veriniz işlenmediği için çoğu hak doğrudan tetiklenmez; yine de:
              </p>
              
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
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Silme / Unutulma</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>E-posta geri bildirimlerinizi sildirebilirsiniz; Local Storage verilerinizi tarayıcınızdan kaldırabilirsiniz.</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>İtiraz & Kısıtlama</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Güvenlik günlüklerindeki IP kaydına itiraz edebilirsiniz; makul sürede silinir.</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Düzeltme</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Yanlış işlenmiş kişisel verilerinizin düzeltilmesini talep edebilirsiniz.</td>
                    </tr>
                    <tr className="border-b" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Taşınabilirlik</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>Local Storage verilerinizi JSON formatında dışa aktarabilirsiniz.</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium" style={{color: '#f5f5f7'}}>Denetim Kurumuna Şikayet</td>
                      <td className="py-3 px-2" style={{color: '#86868b'}}>KVKK Kurulu'na (www.kvkk.gov.tr) veya ilgili AB veri koruma otoritelerine başvurabilirsiniz.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 rounded-xl" style={{backgroundColor: 'rgba(0,122,255,0.1)', border: '1px solid rgba(0,122,255,0.2)'}}>
                <p className="text-sm" style={{color: '#64d2ff'}}>
                  <strong>Yanıt Süresi:</strong> Taleplerinize 30 gün içinde yanıt veririz. Karmaşık durumlarda bu süre 60 güne uzatılabilir.
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
                     style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
                   8. 18 Yaş Altı Kullanıcılar
                 </h2>
               </div>
              
              <div className="space-y-6">
                <p className="text-base leading-relaxed" style={{color: '#86868b'}}>
                  Site lise öğrencilerini hedefler ve çoğu kullanıcımızın 15-18 yaş aralığında olduğunu biliyoruz. 
                  Özel koruma gerektiren durumlar:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                    <h4 className="font-semibold mb-3" style={{color: '#f5f5f7'}}>13 Yaş Altı</h4>
                    <ul className="space-y-2 text-sm" style={{color: '#86868b'}}>
                      <li>• Ebeveyn gözetiminde kullanmanızı öneririz</li>
                      <li>• İletişim formu kullanımında ebeveyn onayı gerekir</li>
                      <li>• Kişisel veri işleme konusunda ekstra dikkatli davranırız</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                    <h4 className="font-semibold mb-3" style={{color: '#f5f5f7'}}>13-18 Yaş Arası</h4>
                    <ul className="space-y-2 text-sm" style={{color: '#86868b'}}>
                      <li>• Siteyi güvenle kullanabilirsiniz</li>
                      <li>• Kişisel veri toplamadığımız için ek onay gerekmez</li>
                      <li>• Sorun yaşadığınızda ebeveynlerinizle birlikte bize ulaşabilirsiniz</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl" style={{backgroundColor: 'rgba(255,204,0,0.1)', border: '1px solid rgba(255,204,0,0.2)'}}>
                  <p className="text-sm" style={{color: '#ffcc73'}}>
                    <strong>Önemli:</strong> Hiçbir yaşta kullanıcıdan gereksiz kişisel bilgi talep etmiyoruz. İlerleme verileriniz sadece kendi cihazınızda saklanır.
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
                     style={{color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
                   9. Politika Değişiklikleri
                 </h2>
               </div>
              
              <div className="space-y-6">
                <p className="text-base leading-relaxed" style={{color: '#86868b'}}>
                  Hukuki/teknik ihtiyaç hâlinde bu sayfayı güncelleyebiliriz. Üstteki &quot;Son güncelleme&quot; tarihi 
                  değiştiğinde yeni sürüm yürürlüğe girmiş sayılır.
                </p>
                
                <div className="space-y-4">
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
                    <strong>Önemli Değişiklik Bildirimi:</strong> Veri işleme şeklimizde köklü değişiklik olduğunda, ana sayfada duyuru yaparak 
                    ve mümkünse e-posta ile (eğer iletişim bilginiz varsa) sizi bilgilendiririz.
                  </p>
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
                  style={{color: '#30d158', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'}}>
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
                    <span style={{color: '#8ee4af'}}>İlerleme bilgileri yalnızca sizin tarayıcınızda durur.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>Reklam, takip çerezi, kâr amacı zaten yok.</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>YouTube ve ÖSYM yönlendirmeleri harici politikalara tabidir.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#30d158'}}></div>
                    <span style={{color: '#8ee4af'}}>Haklarınızı kullanmak için dilediğiniz zaman bize ulaşabilirsiniz.</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-lg font-medium" style={{color: '#30d158'}}>
                  YKSekeri'de başarıya giden yolunuzda yalnızca bilgi iz bırakır; kişisel verileriniz değil!
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
} 