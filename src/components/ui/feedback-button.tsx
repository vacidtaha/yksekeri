"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

export function FeedbackButton() {
  return (
    <Link
      href="/iletisim"
      className="hidden lg:flex fixed bottom-8 left-8 z-50 items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
      style={{
        backgroundColor: '#8b5cf6',
        color: '#ffffff',
        fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
      }}
    >
      <MessageSquare className="w-5 h-5" />
      <span className="text-sm">Sorun Bildir / Öneri Ver</span>
    </Link>
  );
}

