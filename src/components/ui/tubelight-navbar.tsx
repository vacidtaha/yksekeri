"use client"

import React, { useEffect, useState } from "react"
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
    // URL ve hash'e göre aktif tab'ı belirle
    const currentPath = pathname
    const currentHash = window.location.hash
    const fullUrl = currentHash ? `${currentPath}${currentHash}` : currentPath
    
    const currentItem = items.find(item => item.url === fullUrl)
    if (currentItem) {
      setActiveTab(currentItem.name)
    } else {
      // Hash olmadan da kontrol et
      const pathOnlyItem = items.find(item => item.url === currentPath)
      if (pathOnlyItem) {
        setActiveTab(pathOnlyItem.name)
      } else {
        // Ders sayfalarında "Dersler" aktif olsun
        if (pathname.includes('/dersler/')) {
          setActiveTab("Dersler")
        } else if (currentPath === '/' && items.find(item => item.url === '/#content')) {
          setActiveTab("Ana Sayfa")
        } else {
          setActiveTab(items[0].name)
        }
      }
    }
  }, [pathname, items])

  // Hash değişikliklerini dinle
  useEffect(() => {
    const handleHashChange = () => {
      const currentPath = pathname
      const currentHash = window.location.hash
      const fullUrl = currentHash ? `${currentPath}${currentHash}` : currentPath
      
      const currentItem = items.find(item => item.url === fullUrl)
      if (currentItem) {
        setActiveTab(currentItem.name)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [pathname, items])



  // Dropdown dışına tıklanırsa kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        const target = event.target as HTMLElement
        if (!target.closest('.dropdown-container') && !target.closest('.dropdown-menu')) {
          setShowDropdown(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  return (
    <div
      className={cn(
        disableFixed ? "static" : "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div 
        className="flex items-center gap-3 bg-black/20 py-1 px-1 rounded-full border border-white/10"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
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

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div 
                    className="fixed top-24 left-1/2 transform -translate-x-1/2 w-[700px] rounded-2xl shadow-2xl dropdown-menu"
                    style={{
                      backgroundColor: 'rgba(248, 248, 248, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      zIndex: 9999
                    }}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-8">
                        
                        {/* TYT Bölümü */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{color: '#1d1d1f'}}>
                            <TestTube size={20} style={{color: '#007AFF'}} />
                            TYT Dersleri
                          </h3>
                          <div className="space-y-2">
                            {tytSubjects.map((subject) => {
                              const SubjectIcon = subject.icon
                              return (
                                <Link
                                  key={subject.name}
                                  href={subject.href}
                                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group hover:shadow-md"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                    border: '1px solid rgba(0, 0, 0, 0.05)'
                                  }}
                                  onClick={() => setShowDropdown(false)}
                                  onMouseEnter={(e) => {
                                    const hex = subject.color.replace('#', '')
                                    const r = parseInt(hex.substr(0, 2), 16)
                                    const g = parseInt(hex.substr(2, 2), 16)
                                    const b = parseInt(hex.substr(4, 2), 16)
                                    e.currentTarget.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`
                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'
                                    e.currentTarget.style.transform = 'translateY(0px)'
                                  }}
                                >
                                  <SubjectIcon size={16} style={{color: subject.color}} />
                                  <span className="text-sm font-medium" style={{color: '#1d1d1f'}}>
                                    {subject.name}
                                  </span>
                                </Link>
                              )
                            })}
                          </div>
                        </div>

                        {/* AYT Bölümü */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{color: '#1d1d1f'}}>
                            <Calculator size={20} style={{color: '#34C759'}} />
                            AYT Alan Dersleri
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(aytAreas).map(([areaKey, area]) => (
                              <div 
                                key={areaKey}
                                className="relative rounded-xl transition-all duration-200"
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                  border: '1px solid rgba(0, 0, 0, 0.05)'
                                }}
                              >
                                <div className="p-4">
                                  <div className="mb-3">
                                    <span className="text-sm font-semibold" style={{color: '#1d1d1f'}}>
                                      {area.name}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    {area.subjects.map((subject) => {
                                      const SubjectIcon = subject.icon
                                      return (
                                        <Link
                                          key={subject.name}
                                          href={subject.href}
                                          className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-xs font-medium"
                                          style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            border: '1px solid rgba(0, 0, 0, 0.03)',
                                            color: '#1d1d1f'
                                          }}
                                          onClick={() => setShowDropdown(false)}
                                          onMouseEnter={(e) => {
                                            const hex = subject.color.replace('#', '')
                                            const r = parseInt(hex.substr(0, 2), 16)
                                            const g = parseInt(hex.substr(2, 2), 16)
                                            const b = parseInt(hex.substr(4, 2), 16)
                                            e.currentTarget.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`
                                            e.currentTarget.style.transform = 'translateY(-1px)'
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
                                            e.currentTarget.style.transform = 'translateY(0px)'
                                          }}
                                        >
                                          <SubjectIcon size={14} style={{color: subject.color}} />
                                          <span className="truncate">
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
                )}
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
  )
}
