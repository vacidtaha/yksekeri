"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { CheckCircle, AlertCircle, Send, User, Mail, MessageSquare, Phone } from "lucide-react";
import { Header } from "@/components/ui/header";
import * as gtag from "@/lib/gtag";
import emailjs from '@emailjs/browser';

export default function IletisimPage() {
  // Apple-style select dropdown CSS
  const selectStyle = `
    select:focus {
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3) !important;
      border-color: #8b5cf6 !important;
    }
    
    select option {
      background-color: #2a2a2a !important;
      color: #f5f5f7 !important;
      padding: 12px 16px !important;
      border: none !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: 1.4 !important;
    }
    
    select option:hover {
      background-color: rgba(139, 92, 246, 0.2) !important;
      color: #ffffff !important;
    }
    
    select option:checked, select option:active {
      background-color: #8b5cf6 !important;
      color: #ffffff !important;
    }
    
    select option[value=""] {
      color: #86868b !important;
      font-weight: 400 !important;
    }
    
    select option[value=""]:hover {
      background-color: rgba(134, 134, 139, 0.1) !important;
      color: #86868b !important;
    }
    
    /* Webkit specific styles for better dropdown appearance */
    select::-webkit-scrollbar {
      width: 8px;
    }
    
    select::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    select::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
    
    select::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    priority: 'normal',
    category: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Ad gerekli';
    if (!formData.lastName.trim()) newErrors.lastName = 'Soyad gerekli';
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gerekli';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Konu gerekli';
    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj gerekli';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Mesaj en az 10 karakter olmalı';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = formRef.current?.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        errorElement?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Google Analytics tracking - Form gönderimi
      gtag.event({
        action: 'form_submit',
        category: 'Contact',
        label: `${formData.category || 'No Category'} - ${formData.priority}`,
      });
      
      // EmailJS ile e-posta gönder
      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone || 'Belirtilmedi',
        subject: formData.subject,
        priority: formData.priority,
        category: formData.category || 'Belirtilmedi',
        message: formData.message,
        to_name: 'YKS Şekeri',
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );
      
      // Başarılı
      setIsSuccess(true);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', 
        subject: '', priority: 'normal', category: '', message: ''
      });
      
      setTimeout(() => setIsSuccess(false), 5000);
      
    } catch (error: any) {
      console.error('Form gönderme hatası:', error);
      
      // Hata durumunda kullanıcıya bilgi ver
      alert('Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya doğrudan tahavacid@gmail.com adresine yazın.');
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    const fields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    const filledFields = fields.filter(field => formData[field as keyof typeof formData].trim() !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen text-white" style={{backgroundColor: '#2a2a2a'}}>
        <Header alwaysShow={true} />
        
        <div className="min-h-screen flex items-center justify-center px-3 lg:px-4 pt-16 lg:pt-20">
          <div className="text-center max-w-xs lg:max-w-md">
            <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 lg:mb-6" style={{color: '#a78bfa'}} />
            <h2 className="text-xl lg:text-3xl font-light tracking-tight mb-3 lg:mb-4 text-white">Mesaj Gönderildi!</h2>
            <p className="mb-4 lg:mb-6 text-sm lg:text-base text-gray-300">
              Mesajınız başarıyla alındı. 24 saat içinde size geri dönüş yapacağız.
            </p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-semibold transition-all duration-200 text-sm lg:text-base"
              style={{
                backgroundColor: '#8b5cf6',
                color: '#ffffff'
              }}
            >
              Yeni Mesaj Gönder
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#2a2a2a'}}>
      <style dangerouslySetInnerHTML={{__html: selectStyle}} />
      
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
        <div className="text-center mb-6 lg:mb-12">
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-light tracking-tight mb-3 lg:mb-4 text-white">
            İletişime Geçin
          </h1>
          <p className="text-sm lg:text-lg max-w-xl lg:max-w-2xl mx-auto px-2 lg:px-0 text-gray-300">
            Sorularınız, önerileriniz teknik destek ihtiyaçlarınız veya içeriğiniz gösteriliyorsa ve bizi dava etmek üzereyseniz <span style={{background: 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: '600'}}>öncelikle sakin olun</span> ✨ ve bizimle iletişime geçin.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Form */}
          <div>
            <div 
              className="rounded-xl lg:rounded-2xl p-4 lg:p-8"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                backdropFilter: 'blur(20px)'
              }}
            >
              
                             {/* Progress Bar */}
               <div className="mb-4 lg:mb-8">
                 <div className="flex justify-between items-center mb-2 lg:mb-3">
                   <span className="text-xs lg:text-sm font-medium text-gray-400">Form Tamamlanma</span>
                   <span className="text-xs lg:text-sm font-medium" style={{color: '#8b5cf6'}}>{getProgressPercentage()}%</span>
                 </div>
                 <div 
                   className="w-full rounded-full h-0.5 lg:h-1"
                   style={{backgroundColor: 'rgba(255,255,255,0.1)'}}
                 >
                   <div 
                     className="h-0.5 lg:h-1 rounded-full transition-all duration-500 ease-out"
                     style={{ 
                       width: `${getProgressPercentage()}%`,
                       background: 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%)'
                     }}
                   ></div>
                 </div>
               </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                
                {/* İsim Soyisim */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                                         <label className="block text-xs lg:text-sm font-medium mb-1.5 lg:mb-2 text-gray-400">
                       <User className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1 lg:mr-2 text-gray-400" />
                       Ad *
                     </label>
                                         <input
                       type="text"
                       name="firstName"
                       value={formData.firstName}
                       onChange={handleChange}
                       onFocus={() => setFocusedField('firstName')}
                       onBlur={() => setFocusedField('')}
                       className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 focus:outline-none text-base"
                       style={{
                         backgroundColor: 'rgba(139, 92, 246, 0.08)',
                         border: `1px solid ${
                           errors.firstName ? '#ff3b30' : 
                           focusedField === 'firstName' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'
                         }`,
                         color: '#f5f5f7'
                       }}
                       placeholder="Adınız"
                     />
                    {errors.firstName && (
                      <p className="mt-1 text-xs lg:text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                                         <label className="block text-xs lg:text-sm font-medium mb-1.5 lg:mb-2 text-gray-400">
                       Soyad *
                     </label>
                                         <input
                       type="text"
                       name="lastName"
                       value={formData.lastName}
                       onChange={handleChange}
                       onFocus={() => setFocusedField('lastName')}
                       onBlur={() => setFocusedField('')}
                       className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 focus:outline-none text-base"
                       style={{
                         backgroundColor: 'rgba(139, 92, 246, 0.08)',
                         border: `1px solid ${
                           errors.lastName ? '#ff3b30' : 
                           focusedField === 'lastName' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'
                         }`,
                         color: '#f5f5f7'
                       }}
                       placeholder="Soyadınız"
                     />
                    {errors.lastName && (
                      <p className="mt-1 text-xs lg:text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* E-posta ve Telefon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                                         <label className="block text-xs lg:text-sm font-medium mb-1.5 lg:mb-2 text-gray-400">
                       <Mail className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1 lg:mr-2 text-gray-400" />
                       E-posta *
                     </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 focus:outline-none text-base"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        border: `1px solid ${
                          errors.email ? '#ff3b30' : 
                          focusedField === 'email' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'
                        }`,
                        color: '#f5f5f7'
                      }}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs lg:text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-medium mb-1.5 lg:mb-2 text-gray-400">
                      <Phone className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1 lg:mr-2 text-gray-400" />
                      Telefon (opsiyonel)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 focus:outline-none text-base"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        border: `1px solid ${
                          errors.phone ? '#ff3b30' : 
                          focusedField === 'phone' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'
                        }`,
                        color: '#f5f5f7'
                      }}
                      placeholder="+90 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs lg:text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Konu */}
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1.5 lg:mb-2 text-gray-400">
                    Konu *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField('')}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 focus:outline-none text-base"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.08)',
                      border: `1px solid ${
                        errors.subject ? '#ff3b30' : 
                        focusedField === 'subject' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'
                      }`,
                      color: '#f5f5f7'
                    }}
                    placeholder="Mesajınızın konusu"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs lg:text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Kategori ve Öncelik */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs lg:text-sm font-medium mb-1.5 lg:mb-2 text-gray-400">
                      Kategori
                    </label>
                                         <select
                       name="category"
                       value={formData.category}
                       onChange={handleChange}
                       className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 focus:outline-none appearance-none cursor-pointer text-base"
                       style={{
                         backgroundColor: 'rgba(139, 92, 246, 0.08)',
                         border: `1px solid ${
                           errors.category ? '#ff3b30' : 'rgba(139, 92, 246, 0.2)'
                         }`,
                         color: '#f5f5f7',
                         fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                         backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f5f5f7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                         backgroundRepeat: 'no-repeat',
                         backgroundPosition: 'right 8px center',
                         backgroundSize: '16px',
                         paddingRight: '32px'
                       }}
                     >
                       <option value="">Konuyu seç (zorunlu değil ama yapsan iyi)</option>
                       <option value="boredom">Can sıkıntısından yazıyorum</option>
                       <option value="broken">Site çöktü, yardım!</option>
                       <option value="praise">Tebrik etmek istiyorum</option>
                       <option value="complaint">Şikayet var (ama kibar şekilde)</option>
                       <option value="suggestion">Gelecek için önerilerim var</option>
                       <option value="business">İş teklifi (kabul etmeyecem ama yaz bakalım)</option>
                       <option value="existential">Dert dinlemesi / Hayat sorgulaması</option>
                     </select>
                    {errors.category && (
                      <p className="mt-1 text-xs lg:text-sm text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-medium mb-1.5 lg:mb-2 text-gray-400">
                      Öncelik
                    </label>
                                         <select
                       name="priority"
                       value={formData.priority}
                       onChange={handleChange}
                       className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 focus:outline-none appearance-none cursor-pointer text-base"
                       style={{
                         backgroundColor: 'rgba(139, 92, 246, 0.08)',
                         border: '1px solid rgba(139, 92, 246, 0.2)',
                         color: '#f5f5f7',
                         fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                         backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f5f5f7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                         backgroundRepeat: 'no-repeat',
                         backgroundPosition: 'right 8px center',
                         backgroundSize: '16px',
                         paddingRight: '32px'
                       }}
                     >
                       <option value="low">Acele yok, kafanda bulunsun</option>
                       <option value="normal">Normal hızda çözülür</option>
                       <option value="high">Biraz hızlı olsa iyi olur</option>
                       <option value="urgent">Çok acil! (gerçekten)</option>
                     </select>
                  </div>
                </div>

                {/* Mesaj */}
                <div>
                  <label className="block text-xs lg:text-sm font-medium mb-1.5 lg:mb-2 text-gray-400">
                    <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1 lg:mr-2 text-gray-400" />
                    Mesaj * 
                    <span className="text-xs ml-1 lg:ml-2" style={{color: '#515154'}}>
                      ({formData.message.length}/1000 karakter)
                    </span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    rows={4}
                    maxLength={1000}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 resize-none focus:outline-none text-base"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.08)',
                      border: `1px solid ${
                        errors.message ? '#ff3b30' : 
                        focusedField === 'message' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'
                      }`,
                      color: '#f5f5f7'
                    }}
                    placeholder="Mesajınızı detaylı bir şekilde yazın..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs lg:text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    Minimum 10 karakter gerekli. Mümkün olduğunca detaylı açıklama yapın.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4 lg:pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-semibold py-3 lg:py-4 px-4 lg:px-6 rounded-lg lg:rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base"
                    style={{
                      backgroundColor: isSubmitting ? 'rgba(139, 92, 246, 0.3)' : '#8b5cf6',
                      color: isSubmitting ? '#a78bfa' : '#ffffff',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-white border-t-transparent"></div>
                        <span>Gönderiliyor...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span>Mesajı Gönder</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 