"use client";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

export default function HesaplaPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f7'}}>
      <Header alwaysShow={true} />

      <div className="max-w-6xl mx-auto px-4 py-20 pt-32">
        
        {/* ÇOK YAKINDA - Üstte */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight" 
              style={{ 
                color: '#ef4444',
                fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                textShadow: '0 4px 20px rgba(239, 68, 68, 0.2)'
              }}>
            ÇOK YAKINDA
          </h1>
        </div>

        {/* Başlık Skeleton */}
        <div className="mb-12">
          <div className="h-12 bg-gray-200 rounded-xl w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
        </div>

        {/* İçerik Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Sol Kolon */}
          <div className="space-y-6">
            {/* Kart 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>

            {/* Kart 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>

            {/* Kart 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon */}
          <div className="space-y-6">
            {/* Kart 4 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse"></div>
              </div>
            </div>

            {/* Kart 5 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>

            {/* Kart 6 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Alt Buton Skeleton */}
        <div className="flex justify-center mb-12">
          <div className="h-14 bg-gray-200 rounded-full w-48 animate-pulse"></div>
        </div>

        {/* Ekstra İçerik Skeleton */}
        <div className="space-y-6 mb-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="h-10 bg-gray-200 rounded-lg w-1/2 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

