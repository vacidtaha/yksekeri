"use client";

import { X, Terminal, AlertTriangle } from "lucide-react";

interface BetaNotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BetaNotification({ isOpen, onClose }: BetaNotificationProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-4">
        <div 
          className="relative w-full max-w-sm lg:max-w-lg bg-white rounded-lg lg:rounded-xl border border-gray-200 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 lg:p-5 border-b border-gray-200">
            <div className="flex items-center gap-2 lg:gap-3">
              <Terminal className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
              <div>
                <h2 className="text-base lg:text-lg font-mono font-semibold text-gray-900">
                  BETA v0.2.1
                </h2>
                <p className="text-xs lg:text-sm text-gray-600 font-mono hidden lg:block">
                  Development Environment
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 lg:p-5 space-y-3 lg:space-y-4">
            {/* Warning - Mobile Simplified */}
            <div className="lg:hidden flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
              <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <p className="text-xs text-orange-800 font-medium">
                Test aşamasında, geliştirme devam ediyor
              </p>
            </div>

            {/* Warning - Desktop Full */}
            <div className="hidden lg:flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-orange-800 font-medium leading-relaxed">
                  UYARI: Bu sürüm henüz test aşamasında olup geliştirme ortamında çalışmaktadır.
                </p>
              </div>
            </div>

            {/* Release Date - Mobile Compact */}
            <div className="lg:hidden bg-blue-50 border border-blue-200 rounded p-2 text-center">
              <p className="text-xs text-gray-600 mb-1">Kararlı Sürüm</p>
              <div className="text-lg font-bold text-blue-700">1 Eylül 2025</div>
            </div>

            {/* Release Date - Desktop Full */}
            <div className="hidden lg:block bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                  Kararlı Sürüm Yayın Tarihi
                </p>
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  1 Eylül 2025
                </div>
                <p className="text-xs text-gray-600">
                  Tam özellikli ve kararlı sürüm bu tarihte yayınlanacak
                </p>
              </div>
            </div>

            {/* Technical Info - Desktop Only */}
            <div className="hidden lg:block space-y-3">
              <div className="text-sm font-mono text-gray-700 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-600">Build Durumu:</span>
                  <span className="text-orange-600 font-semibold">UNSTABLE</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-600">Environment:</span>
                  <span className="text-blue-600 font-semibold">development</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">API Versiyonu:</span>
                  <span className="text-green-600 font-semibold">v1.0.0-beta</span>
                </div>
              </div>
            </div>

            {/* Main Message - Desktop Only */}
            <div className="hidden lg:block bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed mb-3"
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Bu uygulama şu anda <span className="font-semibold text-gray-900">beta aşamasında</span> olup, 
                active development cycle'ındadır. Production-ready features ve stable API endpoints henüz deploy edilmemiştir.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed"
                 style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Herhangi bir bug, crash veya unexpected behavior ile karşılaştığınızda 
                <span className="font-semibold"> issue tracker</span> üzerinden report edebilirsiniz.
              </p>
            </div>

            {/* Status - Mobile Compact */}
            <div className="lg:hidden flex items-center gap-2 text-xs font-mono bg-yellow-50 p-2 rounded border border-yellow-200">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-800">BETA_ACTIVE</span>
            </div>

            {/* Status - Desktop Full */}
            <div className="hidden lg:flex items-center gap-2 text-sm font-mono bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-800 font-medium">BETA_STATUS=ACTIVE</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 lg:gap-3 pt-1 lg:pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 lg:py-3 px-3 lg:px-4 bg-green-600 hover:bg-green-700 text-white text-xs lg:text-sm font-medium rounded lg:rounded-lg transition-colors"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                <span className="lg:hidden">Devam Et</span>
                <span className="hidden lg:inline">Devam Et --ignore-warnings</span>
              </button>
              <button
                onClick={onClose}
                className="py-2 lg:py-3 px-3 lg:px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs lg:text-sm font-medium rounded lg:rounded-lg transition-colors"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                exit
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 lg:px-5 py-2 lg:py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg lg:rounded-b-xl">
            <p className="text-xs text-gray-500 font-mono text-center">
              <span className="lg:hidden">Build: {new Date().toLocaleDateString()}</span>
              <span className="hidden lg:inline">Build timestamp: {new Date().toISOString()}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 