"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";

interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  mobileContent?: string; // Mobil için farklı içerik
  waitForAction?: boolean; // Kullanıcıdan eylem bekliyor mu?
  actionType?: "select-topic" | "watch-video" | "mark-complete" | "open-test"; // Beklenen eylem tipi
}

interface OnboardingTourProps {
  steps: TourStep[];
  storageKey: string; // localStorage key (örn: "tyt-turkce-tour-completed")
  onComplete?: () => void;
  onActionComplete?: (stepId: string, actionType: string) => void; // Eylem tamamlandığında çağrılır
  selectedTopic?: string | null; // Seçili konu (state'den)
  isPlayerOpen?: boolean; // Video player açık mı (state'den)
  completedTopics?: string[]; // Tamamlanan konular (state'den)
  onShowVideoMessage?: () => void; // Video mesajı gösterilmesi gerektiğinde çağrılır
}

export function OnboardingTour({ 
  steps, 
  storageKey, 
  onComplete, 
  onActionComplete,
  selectedTopic,
  isPlayerOpen,
  completedTopics = []
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, visible: false });
  const [spotlightPosition, setSpotlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [waitingForAction, setWaitingForAction] = useState(false);
  const [showVideoMessage, setShowVideoMessage] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const actionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // İlk yüklemede kontrol et
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(storageKey);
    if (!hasSeenTour) {
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, [storageKey]);

  // Video mesajı event'ini dinle
  useEffect(() => {
    const handleVideoMessage = () => {
      setShowVideoMessage(true);
      setTimeout(() => {
        setShowVideoMessage(false);
      }, 3000);
    };

    window.addEventListener('showVideoMessage', handleVideoMessage);
    return () => {
      window.removeEventListener('showVideoMessage', handleVideoMessage);
    };
  }, []);

  // Mevcut adımın target element'ini bul ve pozisyonunu hesapla
  useEffect(() => {
    if (!isOpen || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setWaitingForAction(step.waitForAction || false);
    
    // Eylem bekleniyorsa kontrol et
    if (step.waitForAction && step.actionType) {
      startActionCheck();
    } else {
      stopActionCheck();
    }
    
    // Element'i bul
    const findElement = () => {
      // Mobilde test adımı için mobil test bölümünü hedefle
      const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
      let targetSelector = step.target;
      if (isMobile && step.id === "test" && step.target === "#tour-resources-panel") {
        targetSelector = "#tour-resources-panel-mobile";
      }
      const element = document.querySelector(targetSelector) as HTMLElement;
      
      if (element) {
        // Element'in gerçekten görünür olmasını bekle
        const checkVisibility = () => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          const isVisible = rect.width > 0 && 
                           rect.height > 0 && 
                           style.display !== 'none' &&
                           style.visibility !== 'hidden' &&
                           style.opacity !== '0';
          
          if (isVisible) {
            setTargetElement(element);
            // Pozisyonu hesapla - biraz bekle ki DOM tam render olsun
            setTimeout(() => {
              // 4. adım (mark-complete) için seçili konu butonunu kullan
              // Mobilde test adımı için mobil test bölümünü kullan
              let elementForPosition = element;
              const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
              if (step.id === "mark-complete" && selectedTopic) {
                const topicButton = document.querySelector(`[data-topic-id="${selectedTopic}"]`) as HTMLElement;
                if (topicButton) {
                  const topicRect = topicButton.getBoundingClientRect();
                  if (topicRect.width > 0 && topicRect.height > 0) {
                    elementForPosition = topicButton;
                  }
                }
              } else if (step.id === "test" && isMobile) {
                // Mobilde test adımı için mobil test bölümünü kullan
                const mobileTestPanel = document.querySelector("#tour-resources-panel-mobile") as HTMLElement;
                if (mobileTestPanel) {
                  const mobileRect = mobileTestPanel.getBoundingClientRect();
                  if (mobileRect.width > 0 && mobileRect.height > 0) {
                    elementForPosition = mobileTestPanel;
                  }
                }
              }
              
              // Element hala görünür mü kontrol et
              const currentRect = elementForPosition.getBoundingClientRect();
              const currentStyle = window.getComputedStyle(elementForPosition);
              if (currentRect.width > 0 && currentRect.height > 0 && 
                  currentStyle.display !== 'none') {
                updateTooltipPosition(elementForPosition, step.position || "bottom");
                
                // Element'i görünür alana getir (hem mobil hem masaüstü için)
                const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
                
                // Mark-complete ve test adımları için hem mobil hem masaüstünde scroll yap
                // Diğer adımlar için sadece mobilde scroll yap
                const shouldScroll = step.id === "mark-complete" || step.id === "test" || isMobile;
                
                if (shouldScroll) {
                  // İstatistikler ve test adımları için daha hızlı scroll
                  const isSpecialStep = step.id === "test" || step.id === "statistics";
                  const delay = isSpecialStep ? 100 : (isMobile ? 350 : 250); // Masaüstü için daha kısa delay
                  
                  setTimeout(() => {
                    const rect = elementForPosition.getBoundingClientRect();
                    const elementTop = rect.top + window.scrollY;
                    const viewportHeight = window.innerHeight;
                    const viewportTop = window.scrollY;
                    const viewportBottom = viewportTop + viewportHeight;
                    
                    // Element'in görünürlük oranını hesapla
                    const visibleTop = Math.max(0, -rect.top);
                    const visibleBottom = Math.min(rect.height, viewportBottom - rect.top);
                    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                    const visibleRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
                    
                    // Test ve statistics adımları için özel scroll mantığı
                    if (step.id === "test") {
                      // Test adımı için: masaüstünde en yukarı scroll, mobilde element'i görünür alana getir
                      if (isMobile) {
                        // Mobilde element'i görünür alana getir
                        const targetScroll = elementTop - viewportHeight * 0.2; // Viewport'un %20'si kadar yukarı
                        window.scrollTo({
                          top: Math.max(0, targetScroll),
                          behavior: "auto" // Smooth yerine auto kullan
                        });
                      } else {
                        // Masaüstünde en yukarı scroll - her zaman yap
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth"
                        });
                      }
                    } else if (step.id === "statistics") {
                      // İstatistikler bölümü için direkt scroll - element'i görünür alana getir
                      const targetScroll = elementTop - viewportHeight * 0.2; // Viewport'un %20'si kadar yukarı
                      // Direkt scroll, smooth olmadan daha hızlı
                      window.scrollTo({
                        top: Math.max(0, targetScroll),
                        behavior: "auto" // Smooth yerine auto kullan
                      });
                    } else if (step.id === "mark-complete") {
                      // Mark-complete adımı için: element görünür değilse veya çok aşağıdaysa scroll yap
                      if (visibleRatio < 0.5 || rect.top > viewportHeight * 0.7) {
                        // Element %50'den az görünüyorsa veya viewport'un %70'inden aşağıdaysa scroll yap
                        const targetScroll = elementTop - viewportHeight * 0.25; // Viewport'un %25'i kadar yukarı
                        window.scrollTo({
                          top: Math.max(0, targetScroll),
                          behavior: isMobile ? "smooth" : "smooth"
                        });
                      }
                    } else {
                      // Diğer adımlar için normal scroll mantığı (sadece mobilde)
                      if (isMobile && visibleRatio < 0.4) {
                        const targetScroll = elementTop - viewportHeight * 0.3; // Viewport'un %30'u kadar yukarı
                        window.scrollTo({
                          top: Math.max(0, targetScroll),
                          behavior: "smooth"
                        });
                      }
                    }
                  }, delay);
                }
              } else {
                // Element görünmüyor, tekrar dene
                setTimeout(() => {
                  const retryRect = elementForPosition.getBoundingClientRect();
                  if (retryRect.width > 0 && retryRect.height > 0) {
                    updateTooltipPosition(elementForPosition, step.position || "bottom");
                  }
                }, 300);
              }
            }, 250);
          } else {
            // Element görünmüyor, bir sonraki adıma geç
            if (currentStep < steps.length - 1) {
              setTimeout(() => setCurrentStep(currentStep + 1), 300);
            } else {
              completeTour();
            }
          }
        };
        
        // Hemen kontrol et
        checkVisibility();
        
        // Eğer görünmüyorsa, biraz bekle ve tekrar kontrol et
        const initialRect = element.getBoundingClientRect();
        if (initialRect.width === 0 || initialRect.height === 0) {
          // Element henüz render olmamış, bekle
          let retryCount = 0;
          const maxRetries = 5;
          
          const retryCheck = setInterval(() => {
            retryCount++;
            const currentRect = element.getBoundingClientRect();
            const currentStyle = window.getComputedStyle(element);
            
            if (currentRect.width > 0 && currentRect.height > 0 && 
                currentStyle.display !== 'none') {
              clearInterval(retryCheck);
              checkVisibility();
            } else if (retryCount >= maxRetries) {
              clearInterval(retryCheck);
              // Hala görünmüyor, bir sonraki adıma geç
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                completeTour();
              }
            }
          }, 200);
          
          // Cleanup
          return () => clearInterval(retryCheck);
        }
      } else {
        // Element bulunamadı, bir sonraki adıma geç
        if (currentStep < steps.length - 1) {
          setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
          completeTour();
        }
      }
    };

    const timeout = setTimeout(findElement, 200);
    return () => {
      clearTimeout(timeout);
      stopActionCheck();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isOpen, steps]);

  // Eylem kontrolü başlat
  const startActionCheck = () => {
    stopActionCheck();
    
    const checkAction = () => {
      const step = steps[currentStep];
      if (!step || !step.actionType) return;
      
      let actionCompleted = false;
      
      switch (step.actionType) {
        case "select-topic":
          if (selectedTopic) {
            actionCompleted = true;
          } else {
            const selectedTopicElement = document.querySelector('[data-selected-topic="true"]');
            if (selectedTopicElement) {
              actionCompleted = true;
            }
          }
          break;
        case "watch-video":
          if (isPlayerOpen) {
            actionCompleted = true;
          } else {
            const videoPlayer = document.querySelector('[data-video-player="open"]');
            if (videoPlayer) {
              actionCompleted = true;
            }
          }
          break;
        case "mark-complete":
          if (selectedTopic && completedTopics.includes(selectedTopic)) {
            actionCompleted = true;
          } else {
            const completedTopic = document.querySelector('[data-topic-completed="true"]');
            if (completedTopic) {
              actionCompleted = true;
            }
          }
          break;
        case "open-test":
          const testOpen = document.querySelector('[data-test-open="true"]');
          if (testOpen) {
            actionCompleted = true;
          }
          break;
      }
      
      if (actionCompleted) {
        stopActionCheck();
        if (onActionComplete) {
          onActionComplete(step.id, step.actionType!);
        }
        setTimeout(() => {
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            completeTour();
          }
        }, 500);
      }
    };
    
    checkAction();
    actionCheckInterval.current = setInterval(checkAction, 300);
  };
  
  // State değişikliklerini dinle
  useEffect(() => {
    if (waitingForAction && steps[currentStep]?.waitForAction) {
      const step = steps[currentStep];
      if (step.actionType) {
        let actionCompleted = false;
        
        switch (step.actionType) {
          case "select-topic":
            actionCompleted = !!selectedTopic;
            break;
          case "watch-video":
            actionCompleted = !!isPlayerOpen;
            break;
          case "mark-complete":
            actionCompleted = !!(selectedTopic && completedTopics.includes(selectedTopic));
            break;
        }
        
        if (actionCompleted) {
          stopActionCheck();
          if (onActionComplete) {
            onActionComplete(step.id, step.actionType!);
          }
          setTimeout(() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              completeTour();
            }
          }, 500);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic, isPlayerOpen, completedTopics, waitingForAction, currentStep]);

  const stopActionCheck = () => {
    if (actionCheckInterval.current) {
      clearInterval(actionCheckInterval.current);
      actionCheckInterval.current = null;
    }
  };

  // Scroll ve resize'da pozisyonu güncelle - tooltip ve spotlight hedef element ile birlikte hareket etsin
  useEffect(() => {
    if (!targetElement || !tooltipPosition.visible) return;

    const updatePosition = () => {
      const step = steps[currentStep];
      if (step && targetElement) {
        // 4. adım (mark-complete) için seçili konu butonunu kullan
        // Mobilde test adımı için mobil test bölümünü kullan
        let elementForPosition = targetElement;
        const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
        if (step.id === "mark-complete" && selectedTopic) {
          const topicButton = document.querySelector(`[data-topic-id="${selectedTopic}"]`) as HTMLElement;
          if (topicButton) {
            const topicRect = topicButton.getBoundingClientRect();
            if (topicRect.width > 0 && topicRect.height > 0) {
              elementForPosition = topicButton;
            }
          }
        } else if (step.id === "test" && isMobile) {
          // Mobilde test adımı için mobil test bölümünü kullan
          const mobileTestPanel = document.querySelector("#tour-resources-panel-mobile") as HTMLElement;
          if (mobileTestPanel) {
            const mobileRect = mobileTestPanel.getBoundingClientRect();
            if (mobileRect.width > 0 && mobileRect.height > 0) {
              elementForPosition = mobileTestPanel;
            }
          }
        }
        
        // Element hala görünür mü kontrol et
        const rect = elementForPosition.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          // Tooltip pozisyonunu güncelle - seçili konu butonuna göre
          updateTooltipPosition(elementForPosition, step.position || "bottom");
          
          // Spotlight pozisyonunu güncelle - fixed pozisyon için viewport'a göre (scrollY ekleme)
          // Mobilde test adımı için padding'i artır (overlay'in üzerine gelmemesi için)
          const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
          const padding = (step.id === "test" && isMobile) ? 12 : 8;
          setSpotlightPosition({
            top: rect.top - padding,
            left: Math.max(0, rect.left - padding), // Negatif değerleri önle
            width: rect.width + (padding * 2),
            height: rect.height + (padding * 2),
          });
        }
      }
    };

    // Throttle ile performansı artır
    let timeoutId: NodeJS.Timeout;
    const throttledUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updatePosition, 16); // ~60fps için 16ms
    };

    // İlk pozisyonu hesapla
    updatePosition();

    // Scroll ve resize'da güncelle - tooltip ve spotlight hedef element ile birlikte hareket etsin
    window.addEventListener("scroll", throttledUpdate, true);
    window.addEventListener("resize", throttledUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", throttledUpdate, true);
      window.removeEventListener("resize", throttledUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetElement, currentStep, steps, tooltipPosition.visible, selectedTopic]);

  const updateTooltipPosition = (element: HTMLElement, position: string) => {
    // Element'in gerçek pozisyonunu al - güncel değerleri kullan
    const rect = element.getBoundingClientRect();
    const isMobile = window.innerWidth < 1024;
    const tooltipWidth = isMobile ? Math.min(300, window.innerWidth - 32) : 450;
    const tooltipHeight = isMobile ? 160 : 180;
    const gap = 20;
    
    // Mevcut adımı kontrol et - 3. adımda scroll yapma
    // İstatistikler ve test adımları için mobil scroll mantığı kullanılıyor, buradaki scroll'u devre dışı bırak
    const currentStepData = steps[currentStep];
    const shouldScroll = currentStepData?.id !== "videos" && 
                           currentStepData?.id !== "statistics" && 
                           currentStepData?.id !== "test"; // Bu adımlar için mobil scroll mantığı kullanılıyor

    // Element'in görünür olup olmadığını kontrol et
    if (rect.width === 0 || rect.height === 0) {
      // Element görünmüyor, pozisyonu güncelleme ama tooltip'i göster
      // Çünkü element henüz render olmamış olabilir
      setTooltipPosition({ 
        top: window.innerHeight / 2 - tooltipHeight / 2, 
        left: window.innerWidth / 2 - tooltipWidth / 2, 
        visible: true 
      });
      return;
    }

    let top = 0;
    let left = 0;

    const effectivePosition = isMobile && (position === "left" || position === "right") 
      ? "bottom" 
      : position;

    // Tooltip pozisyonunu hesapla - element'in viewport içindeki pozisyonuna göre
    // getBoundingClientRect() zaten viewport'a göre pozisyon veriyor, scrollY/scrollX ekleyerek absolute yapıyoruz
    // Ama tooltip fixed olduğu için viewport'a göre pozisyon kullanmalıyız
    switch (effectivePosition) {
      case "top":
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        // 4. adım (mark-complete) için biraz daha solda konumlandır
        const isMarkComplete = steps[currentStep]?.id === "mark-complete";
        left = rect.left - tooltipWidth - (isMarkComplete ? gap + 40 : gap);
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        break;
      case "center":
        // 3. adım (videos) için biraz yukarı konumlandır
        const isVideosStep = steps[currentStep]?.id === "videos";
        top = rect.top + rect.height / 2 - tooltipHeight / 2 - (isVideosStep ? 40 : 0);
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      default:
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
    }

    // Ekran sınırlarını kontrol et ve düzelt
    const padding = 20;
    
    // Yatay sınırlar
    if (left < padding) {
      left = padding;
    }
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }
    
    // Dikey sınırlar - viewport'a göre kontrol (scrollY kullanmadan)
    const viewportTop = padding;
    const viewportBottom = window.innerHeight - padding;
    
    // "left" pozisyonu için özel kontrol - tooltip element'in yanında olmalı
    if (effectivePosition === "left") {
      // Tooltip element'in ortasına hizalanmalı
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      
      // Eğer üstte taşıyorsa, element'in üstüne yapıştır
      if (top < viewportTop) {
        top = rect.top + padding;
      }
      
      // Eğer altta taşıyorsa, element'in altına hizala
      if (top + tooltipHeight > viewportBottom) {
        top = rect.bottom - tooltipHeight - padding;
        // Hala taşıyorsa, ekranın altına yapıştır
        if (top + tooltipHeight > viewportBottom) {
          top = viewportBottom - tooltipHeight;
        }
      }
    } else {
      // Diğer pozisyonlar için normal kontrol
      if (top < viewportTop) {
        // Üstte taşıyorsa, element'in altına koy
        top = rect.bottom + gap;
      }
      
      if (top + tooltipHeight > viewportBottom) {
        // Altta taşıyorsa, element'in üstüne koy
        top = rect.top - tooltipHeight - gap;
        // Hala taşıyorsa, ekranın üstüne yapıştır
        if (top < viewportTop) {
          top = viewportTop;
        }
      }
    }

    setTooltipPosition({ top, left, visible: true });
    
    // Spotlight pozisyonunu da güncelle - fixed pozisyon için viewport'a göre (scrollY ekleme)
    // updatePosition fonksiyonunda zaten spotlight pozisyonu güncelleniyor, burada da güncelleyelim
    const stepData = steps[currentStep];
    let spotlightRect = rect;
    if (stepData?.id === "mark-complete" && selectedTopic) {
      const topicButton = document.querySelector(`[data-topic-id="${selectedTopic}"]`) as HTMLElement;
      if (topicButton) {
        const topicRect = topicButton.getBoundingClientRect();
        if (topicRect.width > 0 && topicRect.height > 0) {
          spotlightRect = topicRect;
        }
      }
    }
    
    setSpotlightPosition({
      top: spotlightRect.top - 8,
      left: spotlightRect.left - 8,
      width: spotlightRect.width + 16,
      height: spotlightRect.height + 16,
    });

    // Element'i görünür alana getir - çok minimal, sadece gerçekten gerekirse
    // 3. adım (videos) için scroll yapma
    if (shouldScroll) {
      setTimeout(() => {
        const currentRect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + viewportHeight;
        
        // Element'in görünürlük oranını hesapla
        const elementTop = currentRect.top;
        const elementBottom = currentRect.bottom;
        const elementHeight = currentRect.height;
        
        // Element'in ne kadarının görünür olduğunu hesapla
        const visibleTop = Math.max(0, -elementTop);
        const visibleBottom = Math.min(elementHeight, viewportBottom - elementTop);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibleRatio = elementHeight > 0 ? visibleHeight / elementHeight : 0;
        
        // Scroll'u sadece element tamamen görünmüyorsa ve gerçekten gerekirse yap
        // %10'dan az görünüyorsa VE tamamen ekran dışındaysa
        if (visibleRatio < 0.1 && (elementTop < -300 || elementBottom > viewportHeight + 300)) {
          // Element tamamen ekran dışında, çok minimal scroll yap
          const elementAbsoluteTop = currentRect.top + window.scrollY;
          const currentScroll = window.scrollY;
          
          // Element nerede?
          if (elementTop < -300) {
            // Element çok yukarıda, çok minimal scroll
            const targetScroll = elementAbsoluteTop - 80; // Üstten sadece 80px boşluk
            const scrollDiff = targetScroll - currentScroll;
            
            // Maksimum scroll mesafesini çok sınırla (viewport'un %8'i kadar)
            const maxScroll = viewportHeight * 0.08;
            
            if (Math.abs(scrollDiff) > maxScroll) {
              const limitedScroll = currentScroll + (scrollDiff > 0 ? maxScroll : -maxScroll);
              window.scrollTo({
                top: Math.max(0, limitedScroll),
                behavior: "smooth"
              });
            } else if (Math.abs(scrollDiff) > 80) {
              // Sadece 80px'den fazla fark varsa scroll yap
              window.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: "smooth"
              });
            }
          } else if (elementBottom > viewportHeight + 300) {
            // Element çok aşağıda, çok minimal scroll
            const targetScroll = elementAbsoluteTop - viewportHeight * 0.15; // Viewport'un %15'i kadar yukarı
            const scrollDiff = targetScroll - currentScroll;
            
            // Maksimum scroll mesafesini çok sınırla
            const maxScroll = viewportHeight * 0.08;
            
            if (Math.abs(scrollDiff) > maxScroll) {
              const limitedScroll = currentScroll + (scrollDiff > 0 ? maxScroll : -maxScroll);
              window.scrollTo({
                top: Math.max(0, limitedScroll),
                behavior: "smooth"
              });
            } else if (Math.abs(scrollDiff) > 80) {
              window.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: "smooth"
              });
            }
          }
          // Element zaten görünür alandaysa hiç scroll yapma
        }
      }, 600);
    }
  };

  const nextStep = () => {
    if (waitingForAction) return;
    
    if (currentStep < steps.length - 1) {
      // Önce tooltip'i gizle
      setTooltipPosition(prev => ({ ...prev, visible: false }));
      // Sonra adımı değiştir
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 100);
    } else {
      completeTour();
    }
  };

  const skipTour = () => {
    stopActionCheck();
    completeTour();
  };

  const completeTour = () => {
    stopActionCheck();
    localStorage.setItem(storageKey, "true");
    setIsOpen(false);
    if (onComplete) {
      onComplete();
    }
  };

  // Eğitici tur açıkken videolar ve test butonlarını engelle
  useEffect(() => {
    if (isOpen) {
      // Video kartlarını engelle - daha geniş selector kullan
      const videoCards = document.querySelectorAll('[data-video-card], .video-card, [data-video-id], button[onclick*="playVideo"], div[onclick*="playVideo"]');
      videoCards.forEach((card) => {
        (card as HTMLElement).style.pointerEvents = 'none';
        (card as HTMLElement).style.opacity = '0.6';
        (card as HTMLElement).style.cursor = 'not-allowed';
      });

      // Video kartlarının içindeki tıklanabilir elementleri de engelle
      const videoCardContainers = document.querySelectorAll('div[class*="rounded"]');
      videoCardContainers.forEach((container) => {
        const hasVideoContent = container.querySelector('img[src*="ytimg"], iframe[src*="youtube"]');
        if (hasVideoContent) {
          (container as HTMLElement).style.pointerEvents = 'none';
          (container as HTMLElement).style.opacity = '0.6';
        }
      });

      // Test butonlarını engelle
      const testButtons = document.querySelectorAll('[data-test-button="true"]');
      testButtons.forEach((button) => {
        (button as HTMLElement).style.pointerEvents = 'none';
        (button as HTMLElement).style.opacity = '0.6';
        (button as HTMLElement).style.cursor = 'not-allowed';
      });

      return () => {
        // Cleanup: Eğitici tur kapandığında geri al
        videoCards.forEach((card) => {
          (card as HTMLElement).style.pointerEvents = '';
          (card as HTMLElement).style.opacity = '';
          (card as HTMLElement).style.cursor = '';
        });
        videoCardContainers.forEach((container) => {
          (container as HTMLElement).style.pointerEvents = '';
          (container as HTMLElement).style.opacity = '';
        });
        testButtons.forEach((button) => {
          (button as HTMLElement).style.pointerEvents = '';
          (button as HTMLElement).style.opacity = '';
          (button as HTMLElement).style.cursor = '';
        });
      };
    }
  }, [isOpen]);

  if (!isOpen || currentStep >= steps.length) return null;

  const step = steps[currentStep];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const content = isMobile && step.mobileContent ? step.mobileContent : step.content;

  return (
    <>
      {/* Overlay - 4 parçaya bölünmüş, spotlight'ın olduğu yerde delik */}
      {targetElement && spotlightPosition.width > 0 && spotlightPosition.height > 0 ? (
        <>
          {/* Üst overlay */}
          <div
            className="fixed"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: `${spotlightPosition.top}px`,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9998,
              pointerEvents: "auto",
            }}
          />
          {/* Alt overlay */}
          <div
            className="fixed"
            style={{
              top: `${spotlightPosition.top + spotlightPosition.height}px`,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9998,
              pointerEvents: "auto",
            }}
          />
          {/* Sol overlay */}
          <div
            className="fixed"
            style={{
              top: `${spotlightPosition.top}px`,
              left: 0,
              width: `${Math.max(0, spotlightPosition.left)}px`,
              height: `${spotlightPosition.height}px`,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9998,
              pointerEvents: "auto",
            }}
          />
          {/* Sağ overlay */}
          <div
            ref={overlayRef}
            className="fixed"
            style={{
              top: `${spotlightPosition.top}px`,
              left: `${spotlightPosition.left + spotlightPosition.width}px`,
              right: 0,
              height: `${spotlightPosition.height}px`,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9998,
              pointerEvents: "auto",
            }}
          />
        </>
      ) : (
        <div
          ref={overlayRef}
          className="fixed inset-0"
          style={{
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 9998,
            pointerEvents: "auto",
          }}
        />
      )}
      
      {/* Spotlight efekti - overlay'in dışında, fixed pozisyon */}
      {targetElement && spotlightPosition.width > 0 && spotlightPosition.height > 0 && (
        <div
          className="fixed border-4 border-blue-500 rounded-xl"
          style={{
            top: `${spotlightPosition.top}px`,
            left: `${spotlightPosition.left}px`,
            width: `${spotlightPosition.width}px`,
            height: `${spotlightPosition.height}px`,
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
            zIndex: 9999,
            animation: waitingForAction ? "pulse 2s ease-in-out infinite" : "none",
            pointerEvents: "none", // Spotlight tıklanamaz
            backgroundColor: "transparent", // İçi şeffaf
          }}
        />
      )}
      
      {/* Hedef element'in tıklanabilir olması için - overlay'i hedef element'in üzerinde kapat */}
      {targetElement && waitingForAction && (
        <div
          className="fixed"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999, // Spotlight ile aynı seviye (spotlight pointer-events: none olduğu için sorun olmaz)
            pointerEvents: "auto",
          }}
          onClick={(e) => {
            // Tooltip'e tıklanırsa hiçbir şey yapma
            if (tooltipRef.current?.contains(e.target as Node)) {
              return;
            }
            
            // Eğer tıklama hedef element veya içindeki bir element üzerindeyse, event'i geçir
            const rect = targetElement.getBoundingClientRect();
            const clickX = e.clientX;
            const clickY = e.clientY;
            
            // Tıklama hedef element'in içinde mi?
            if (
              clickX >= rect.left &&
              clickX <= rect.right &&
              clickY >= rect.top &&
              clickY <= rect.bottom
            ) {
              // Event'i durdur
              e.stopPropagation();
              e.preventDefault();
              
              // Overlay'i geçici olarak pointer-events: none yap ki doğru elementi bulabilelim
              const overlayDiv = e.currentTarget as HTMLElement;
              const originalPointerEvents = overlayDiv.style.pointerEvents;
              overlayDiv.style.pointerEvents = 'none';
              
              // Tıklama noktasındaki elementi bul (elementFromPoint kullan)
              const elementAtPoint = document.elementFromPoint(clickX, clickY) as HTMLElement;
              
              // Overlay'i tekrar aktif et
              overlayDiv.style.pointerEvents = originalPointerEvents || 'auto';
              
              if (elementAtPoint && targetElement.contains(elementAtPoint)) {
                // Tik butonunu bul (rounded-full div veya içindeki SVG)
                let clickableElement: HTMLElement | null = null;
                let currentElement: HTMLElement | null = elementAtPoint;
                
                // Yukarı doğru traverse et
                while (currentElement && currentElement !== targetElement) {
                  // Eğer rounded-full div ise (tik butonu)
                  if (currentElement.classList.contains('rounded-full') && 
                      currentElement.classList.contains('cursor-pointer')) {
                    clickableElement = currentElement;
                    break;
                  }
                  // Eğer SVG (CheckCircle icon) içindeyse, parent rounded-full div'i bul
                  if (currentElement.tagName === 'svg' || currentElement.closest('svg')) {
                    const roundedFullDiv = currentElement.closest('div.rounded-full.cursor-pointer');
                    if (roundedFullDiv) {
                      clickableElement = roundedFullDiv as HTMLElement;
                      break;
                    }
                  }
                  // Eğer buton ise (konu butonu)
                  if (currentElement.tagName === 'BUTTON' && 
                      currentElement.getAttribute('data-topic-id')) {
                    // Eğer tik butonuna tıklanmışsa, tik butonunu bul
                    const roundedFullDiv = currentElement.querySelector('div.rounded-full.cursor-pointer');
                    if (roundedFullDiv && 
                        clickX >= roundedFullDiv.getBoundingClientRect().left &&
                        clickX <= roundedFullDiv.getBoundingClientRect().right &&
                        clickY >= roundedFullDiv.getBoundingClientRect().top &&
                        clickY <= roundedFullDiv.getBoundingClientRect().bottom) {
                      clickableElement = roundedFullDiv as HTMLElement;
                      break;
                    }
                    // Tik butonuna tıklanmamışsa, konu butonuna tıkla
                    clickableElement = currentElement;
                    break;
                  }
                  currentElement = currentElement.parentElement;
                }
                
                // Eğer tik butonu bulunduysa ona tıkla
                if (clickableElement) {
                  // Mouse event'leri oluştur ve gönder
                  const mouseDownEvent = new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: clickX,
                    clientY: clickY,
                  });
                  const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: clickX,
                    clientY: clickY,
                  });
                  const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: clickX,
                    clientY: clickY,
                  });
                  
                  clickableElement.dispatchEvent(mouseDownEvent);
                  clickableElement.dispatchEvent(mouseUpEvent);
                  clickableElement.dispatchEvent(clickEvent);
                } else {
                  // Tik butonu bulunamadıysa, elementAtPoint'e tıkla
                  elementAtPoint.click();
                }
              } else {
                // Element bulunamadıysa, hedef element'e tıkla
                targetElement.click();
              }
            }
          }}
        />
      )}

      {/* Tooltip - Overlay'in dışında, en üstte */}
      {tooltipPosition.visible && targetElement && (
        <div
          ref={tooltipRef}
          className="fixed"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            width: isMobile ? `${Math.min(300, window.innerWidth - 32)}px` : "450px",
            maxWidth: isMobile ? `${Math.min(300, window.innerWidth - 32)}px` : "450px",
            zIndex: 10000,
            pointerEvents: "auto",
            position: "fixed", // Sabit pozisyon - scroll ile hareket etmez
            transform: "none", // Transform yok
          }}
        >
          <style>{`
            @keyframes pulse {
              0%, 100% {
                box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
              }
              50% {
                box-shadow: 0 0 50px rgba(59, 130, 246, 0.9);
              }
          `}</style>
          <div
            className="rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-2xl border-2"
            style={{
              backgroundColor: "rgba(26, 14, 39, 1)",
              borderColor: "rgba(59, 130, 246, 0.5)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      color: "#60a5fa",
                    }}
                  >
                    {currentStep + 1}
                  </div>
                  <h3
                    className="text-base lg:text-lg font-semibold text-white"
                    style={{
                      fontFamily:
                        "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                    }}
                  >
                    {step.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Content */}
            <p
              className="text-sm text-gray-300 leading-relaxed mb-4"
              style={{
                fontFamily:
                  "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}
            >
              {content}
            </p>
            
            {/* Video Mesajı */}
            {showVideoMessage && (
              <div
                className="mt-3 p-3 rounded-lg border border-blue-500/50 bg-blue-500/10"
                style={{
                  fontFamily:
                    "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                }}
              >
                <p className="text-sm text-blue-300 text-center">
                  Acele etme şampiyon! Eğitici bitsin, sonra izlersin 😎
                </p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <div
                className="w-full rounded-full h-1.5"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                    background: "linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                {currentStep + 1} / {steps.length}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              {!waitingForAction && (
                <>
                  <button
                    onClick={skipTour}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "#ffffff",
                      fontFamily:
                        "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    }}
                    type="button"
                  >
                    Atla
                  </button>

                  <button
                    onClick={nextStep}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "#ffffff",
                      fontFamily:
                        "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#3b82f6";
                      }}
                    type="button"
                  >
                    <span>{currentStep === steps.length - 1 ? "Bitir" : "İleri"}</span>
                    {currentStep < steps.length - 1 ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
