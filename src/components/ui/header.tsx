"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home as HomeIcon, BookOpen, Users, Mail } from "lucide-react";

interface HeaderProps {
  alwaysShow?: boolean; // Ana sayfa dışındaki sayfalar için her zaman göster
}

export function Header({ alwaysShow = false }: HeaderProps) {
  const pathname = usePathname();
  const [showFixedHeader, setShowFixedHeader] = useState(alwaysShow);
  
  const navItems = [
    { name: "Ana Sayfa", url: "/#content", icon: HomeIcon },
    { name: "Dersler", url: "#", icon: BookOpen },
    { name: "Kaynaklar", url: "/kaynaklar", icon: Users },
    { name: "İletişim", url: "/iletisim", icon: Mail },
  ];

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
    <div className="fixed top-0 left-0 w-full z-40">
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
  );
} 