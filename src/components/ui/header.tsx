"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home as HomeIcon, BookOpen, Users, Mail, Target } from "lucide-react";

interface HeaderProps {
  alwaysShow?: boolean; // Ana sayfa dışındaki sayfalar için her zaman göster
}

export function Header({ alwaysShow = false }: HeaderProps) {
  const pathname = usePathname();
  const [showFixedHeader, setShowFixedHeader] = useState(alwaysShow);
  
  const navItems = useMemo(() => [
    { name: "Ana Sayfa", url: "/#content", icon: HomeIcon },
    { name: "Dersler", url: "#", icon: BookOpen },
    { name: "Odaklan", url: "/odaklan?auto=true", icon: Target },
    { name: "Kaynaklar", url: "/kaynaklar", icon: Users },
    { name: "İletişim", url: "/iletisim", icon: Mail },
  ], []);

  useEffect(() => {
    if (alwaysShow) {
      setShowFixedHeader(true);
      return;
    }

    // Ana sayfa için scroll kontrolü
    if (pathname === '/') {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        // Hero logosu görünmez olduğunda header'ı göster
        if (scrollY > window.innerHeight * 0.4) {
          setShowFixedHeader(true);
        } else {
          setShowFixedHeader(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pathname, alwaysShow]);

  if (!showFixedHeader) return null;

  return (
    <>
      {/* Masaüstü Header - Yukarıda sabit */}
      <div className="hidden lg:block fixed top-0 left-0 w-full z-40">
        <div className="relative flex items-center px-4 py-2 min-h-[120px]">
          <div className="flex items-center h-full ml-8">
            <Image
              src="/yks.png"
              alt="YKS Şekeri Ana Sayfa"
              width={160}
              height={110}
              priority
              className="rounded"
            />
          </div>
          <div className="absolute inset-x-0 flex justify-center items-center h-full">
            <NavBar 
              items={navItems}
              disableFixed={true}
              className="mb-0 pt-0"
            />
          </div>
        </div>
      </div>

      {/* Mobil Navigation - Aşağıda sabit */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-40">
        <div className="flex justify-center items-center py-2">
          <NavBar 
            items={navItems}
            disableFixed={true}
            className="mb-0 pt-0"
          />
        </div>
      </div>
    </>
  );
} 