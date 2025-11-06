"use client"

import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon, ChevronDown, BookOpen, Calculator, TestTube, Globe, Book, MapPin, Brain, Atom, Beaker } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  disableFixed?: boolean // Header içinde kullanıldığında fixed positioning'i iptal et
}

export function NavBar({ items, className, disableFixed = false }: NavBarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isMountedRef = useRef(true)
  const itemsRef = useRef(items)
  const activeTabRef = useRef(activeTab)
  
  // items'ı ref'te sakla
  useEffect(() => {
    itemsRef.current = items
  }, [items])
  
  // activeTab'ı ref'te sakla
  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  // Ders sayfası adını döndüren fonksiyon
  const getDersPageName = () => {
    if (pathname.includes('/dersler/tyt/turkce')) return 'Türkçe'
    if (pathname.includes('/dersler/tyt/matematik')) return 'Matematik'
    if (pathname.includes('/dersler/tyt/fen')) return 'Fen Bilimleri'
    if (pathname.includes('/dersler/tyt/sosyal')) return 'Sosyal Bilimler'
    if (pathname.includes('/dersler/ayt/matematik')) return 'AYT Matematik'
    if (pathname.includes('/dersler/ayt/fizik')) return 'Fizik'
    if (pathname.includes('/dersler/ayt/kimya')) return 'Kimya'
    if (pathname.includes('/dersler/ayt/biyoloji')) return 'Biyoloji'
    if (pathname.includes('/dersler/ayt/edebiyat')) return 'Edebiyat'
    if (pathname.includes('/dersler/ayt/tarih')) return 'Tarih'
    if (pathname.includes('/dersler/ayt/cografya')) return 'Coğrafya'
        if (pathname.includes('/dersler/ayt/felsefe')) return 'Felsefe'
    if (pathname.includes('/dersler/ayt/esit/tarih')) return 'EA Tarih'
    if (pathname.includes('/dersler/ayt/esit/cografya')) return 'EA Coğrafya'
    return 'Dersler'
  }

  // TYT Dersleri
  const tytSubjects = [
    { name: "Türkçe", icon: BookOpen, href: "/dersler/tyt/turkce", color: "#007AFF" },
    { name: "Matematik", icon: Calculator, href: "/dersler/tyt/matematik", color: "#34C759" },
    { name: "Fen Bilimleri", icon: TestTube, href: "/dersler/tyt/fen", color: "#FF9F0A" },
    { name: "Sosyal Bilimler", icon: Globe, href: "/dersler/tyt/sosyal", color: "#AF52DE" }
  ]

  // AYT Alanları ve Dersleri
  const aytAreas = {
    sayisal: {
      name: "Sayısal",
      subjects: [
        { name: "Matematik", icon: Calculator, href: "/dersler/ayt/matematik", color: "#34C759" },
        { name: "Fizik", icon: Atom, href: "/dersler/ayt/fizik", color: "#007AFF" },
        { name: "Kimya", icon: Beaker, href: "/dersler/ayt/kimya", color: "#FF9F0A" },
        { name: "Biyoloji", icon: TestTube, href: "/dersler/ayt/biyoloji", color: "#34C759" }
      ]
    },
    sozel: {
      name: "Sözel",
      subjects: [
        { name: "Edebiyat", icon: Book, href: "/dersler/ayt/edebiyat", color: "#FF2D92" },
        { name: "Tarih", icon: Globe, href: "/dersler/ayt/tarih", color: "#FF9F0A" },
        { name: "Coğrafya", icon: MapPin, href: "/dersler/ayt/cografya", color: "#007AFF" },
        { name: "Felsefe", icon: Brain, href: "/dersler/ayt/felsefe", color: "#AF52DE" }
      ]
    },
    esit: {
      name: "Eşit Ağırlık",
      subjects: [
        { name: "Matematik", icon: Calculator, href: "/dersler/ayt/matematik", color: "#34C759" },
        { name: "Edebiyat", icon: Book, href: "/dersler/ayt/edebiyat", color: "#FF2D92" },
        { name: "Tarih", icon: Globe, href: "/dersler/ayt/tarih", color: "#FF9F0A" },
        { name: "Coğrafya", icon: MapPin, href: "/dersler/ayt/cografya", color: "#007AFF" }
      ]
    }
  }

  useEffect(() => {
    // Component mount olduğunda flag'i true yap
    isMountedRef.current = true
    
    // URL ve hash'e göre aktif tab'ı belirle
    const updateActiveTab = () => {
      if (!isMountedRef.current) return
      
      const currentItems = itemsRef.current
      const currentPath = pathname
      const currentHash = typeof window !== 'undefined' ? window.location.hash : ''
      const fullUrl = currentHash ? `${currentPath}${currentHash}` : currentPath
      
      let newActiveTab = ""
      
      const currentItem = currentItems.find(item => item.url === fullUrl)
      if (currentItem) {
        newActiveTab = currentItem.name
      } else {
        // Hash olmadan da kontrol et
        const pathOnlyItem = currentItems.find(item => item.url === currentPath)
        if (pathOnlyItem) {
          newActiveTab = pathOnlyItem.name
        } else {
          // Ders sayfalarında "Dersler" aktif olsun
          if (pathname.includes('/dersler/')) {
            newActiveTab = "Dersler"
          } else if (currentPath === '/' && currentItems.find(item => item.url === '/#content')) {
            newActiveTab = "Ana Sayfa"
          } else if (currentItems.length > 0) {
            newActiveTab = currentItems[0].name
          }
        }
      }
      
      // Sadece değer gerçekten değiştiyse state'i güncelle
      if (newActiveTab && newActiveTab !== activeTabRef.current && isMountedRef.current) {
        setActiveTab(newActiveTab)
      }
    }
    
    // Hemen güncelle
    updateActiveTab()
    
    // Hash değişikliklerini dinle
    const handleHashChange = () => {
      updateActiveTab()
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', handleHashChange)
    }
    
    return () => {
      isMountedRef.current = false
      if (typeof window !== 'undefined') {
        window.removeEventListener('hashchange', handleHashChange)
      }
    }
  }, [pathname])




  // Window size takibi için mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Pathname değiştiğinde dropdown'u kapat
  useEffect(() => {
    setShowDropdown(false)
  }, [pathname])

  // Dropdown dışına tıklanırsa kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (showDropdown) {
        const target = event.target as HTMLElement
        if (!target.closest('.dropdown-container') && !target.closest('.dropdown-menu')) {
          setShowDropdown(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [showDropdown])

  return (
    <>
    <div
      className={cn(
        disableFixed ? "static" : "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div 
        className="flex items-center gap-3 bg-black/20 py-1 px-1 rounded-full"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          // Dersler menüsü için özel dropdown
          if (item.name === "Dersler") {
            return (
              <div 
                key={item.name} 
                className="relative dropdown-container"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab(item.name)
                    setShowDropdown(!showDropdown)
                  }}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors flex items-center gap-1",
                    "text-white/90 hover:text-white",
                    isActive && "bg-white/20 text-white",
                  )}
                >
                  <span className="hidden md:inline">{getDersPageName()}</span>
                  <span className="md:hidden">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  <ChevronDown size={14} className="hidden md:inline" />

                </button>

              </div>
            )
          }

          // Diğer nav itemları için normal rendering
          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => {
                setActiveTab(item.name)
              }}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-white/90 hover:text-white",
                isActive && "bg-white/20 text-white",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>

            </Link>
          )
        })}
      </div>
    </div>

    {/* Dropdown Menu - Navbar container dışında */}
    {showDropdown && (
      <>
        {/* Mobile CSS Keyframes */}
        {isMobile && (
          <style>{`
            @keyframes slideUpAndScale {
              from {
                opacity: 0;
                transform: translateY(10px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        )}
        <div 
          className={`fixed shadow-2xl dropdown-menu ${
            isMobile 
              ? 'left-0 right-0 rounded-2xl z-[10000]' 
              : 'left-1/2 transform -translate-x-1/2 top-24 w-[700px] rounded-2xl'
          }`}
          style={{
            backgroundColor: 'rgba(248, 248, 248, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            zIndex: 10000,
            ...(isMobile ? {
              bottom: '80px', // Navbar'ın üstünde
              animation: 'slideUpAndScale 0.2s ease-out'
            } : {
              top: '96px'
            })
          }}
          onMouseLeave={() => !isMobile && setShowDropdown(false)}
        >
        <div className={isMobile ? "p-3" : "p-6"}>
          <div className="grid grid-cols-2 gap-4">
            
            {/* TYT Bölümü */}
            <div>
              <h3 className={`font-semibold flex items-center gap-2 ${isMobile ? 'text-sm mb-2' : 'text-lg mb-4'}`} style={{color: '#1d1d1f'}}>
                <TestTube size={isMobile ? 16 : 20} style={{color: '#007AFF'}} />
                TYT Dersleri
              </h3>
              <div className={isMobile ? "space-y-1" : "space-y-2"}>
                {tytSubjects.map((subject) => {
                  const SubjectIcon = subject.icon
                  return (
                    <Link
                      key={subject.name}
                      href={subject.href}
                      className={`flex items-center rounded-xl transition-all duration-200 group hover:shadow-md ${
                        isMobile ? 'gap-2 p-2' : 'gap-3 p-3'
                      }`}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}
                      onClick={() => setShowDropdown(false)}
                      onMouseEnter={(e) => {
                        if (!isMobile) {
                          const hex = subject.color.replace('#', '')
                          const r = parseInt(hex.substr(0, 2), 16)
                          const g = parseInt(hex.substr(2, 2), 16)
                          const b = parseInt(hex.substr(4, 2), 16)
                          e.currentTarget.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`
                          e.currentTarget.style.transform = 'translateY(-1px)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'
                          e.currentTarget.style.transform = 'translateY(0px)'
                        }
                      }}
                    >
                      <SubjectIcon size={isMobile ? 14 : 16} style={{color: subject.color}} />
                      <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`} style={{color: '#1d1d1f'}}>
                        {subject.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* AYT Bölümü */}
            <div>
              <h3 className={`font-semibold flex items-center gap-2 ${isMobile ? 'text-sm mb-2' : 'text-lg mb-4'}`} style={{color: '#1d1d1f'}}>
                <Calculator size={isMobile ? 16 : 20} style={{color: '#34C759'}} />
                AYT Alan Dersleri
              </h3>
              <div className={isMobile ? "space-y-2" : "space-y-3"}>
                {Object.entries(aytAreas).map(([areaKey, area]) => (
                  <div 
                    key={areaKey}
                    className="relative rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className={isMobile ? "p-2" : "p-4"}>
                      <div className={isMobile ? "mb-2" : "mb-3"}>
                        <span className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`} style={{color: '#1d1d1f'}}>
                          {area.name}
                        </span>
                      </div>
                      <div className={`grid grid-cols-2 ${isMobile ? 'gap-1' : 'gap-2'}`}>
                        {area.subjects.map((subject) => {
                          const SubjectIcon = subject.icon
                          return (
                            <Link
                              key={subject.name}
                              href={subject.href}
                              className={`flex items-center rounded-lg transition-all duration-200 font-medium ${
                                isMobile ? 'gap-1 p-1.5 text-xs' : 'gap-2 p-2 text-xs'
                              }`}
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid rgba(0, 0, 0, 0.03)',
                                color: '#1d1d1f'
                              }}
                              onClick={() => setShowDropdown(false)}
                              onMouseEnter={(e) => {
                                if (!isMobile) {
                                  const hex = subject.color.replace('#', '')
                                  const r = parseInt(hex.substr(0, 2), 16)
                                  const g = parseInt(hex.substr(2, 2), 16)
                                  const b = parseInt(hex.substr(4, 2), 16)
                                  e.currentTarget.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`
                                  e.currentTarget.style.transform = 'translateY(-1px)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isMobile) {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
                                  e.currentTarget.style.transform = 'translateY(0px)'
                                }
                              }}
                            >
                              <SubjectIcon size={isMobile ? 12 : 14} style={{color: subject.color}} />
                              <span className={`${isMobile ? 'text-xs' : 'text-xs'} truncate`}>
                                {subject.name}
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      </>
    )}
    </>
  )
}
