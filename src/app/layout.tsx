import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { CookieConsent } from "@/components/ui/cookie-consent";

export const metadata: Metadata = {
  title: "YKS Şekeri - YKS Hazırlığının Tatlı Hali",
  description: "YKS hazırlığının tatlı hali. Video dersler, PDF'ler ve sorularla üniversite yolunda şeker gibi geçer. Acı da olsa, tatlı da. TYT matematik, türkçe, fen, sosyal dersleri. AYT matematik, fizik, kimya, biyoloji, edebiyat, tarih, coğrafya, felsefe dersleri. Ücretsiz eğitim kaynakları.",
  keywords: [
    "YKS", "TYT", "AYT", "üniversite hazırlık", "video ders", "PDF materyal", "sınav hazırlık", "ücretsiz eğitim",
    "TYT matematik", "TYT türkçe", "TYT fen bilimleri", "TYT sosyal bilimler",
    "AYT matematik", "AYT fizik", "AYT kimya", "AYT biyoloji", "AYT edebiyat", "AYT tarih", "AYT coğrafya", "AYT felsefe",
    "sayısal alan", "eşit ağırlık", "sözel alan", "üniversite sınavı", "ÖSYM", "Türkiye"
  ],
  authors: [{ name: "YKS Şekeri" }],
  creator: "YKS Şekeri",
  publisher: "YKS Şekeri",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://yksekeri.com",
  },
  metadataBase: new URL("https://yksekeri.com"),
  category: "education",
  classification: "Education",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://yksekeri.com",
    siteName: "YKS Şekeri",
    title: "YKS Şekeri - YKS Hazırlığının Tatlı Hali",
    description: "YKS hazırlığının tatlı hali! 🍬 Ücretsiz video dersler, PDF kaynaklar ve interaktif sorularla TYT & AYT'ye hazırlan. Reklamsız, tamamen hayrına!",
    images: [
      {
        url: "/yks.png",
        width: 1200,
        height: 630,
        alt: "YKS Şekeri - Ücretsiz YKS TYT AYT Hazırlık Platformu",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "YKS Şekeri - YKS Hazırlığının Tatlı Hali",
    description: "YKS hazırlığının tatlı hali! 🍬 Ücretsiz video dersler, PDF kaynaklar ve interaktif sorularla TYT & AYT'ye hazırlan.",
    images: ["/yks.png"],
    creator: "@yksekeri",
    site: "@yksekeri",
  },
  
  other: {
    "geo.region": "TR",
    "geo.country": "Turkey",
    "content-language": "tr",
    "rating": "general",
  },
};

// Structured Data JSON-LD
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://yksekeri.com/#website",
      "url": "https://yksekeri.com",
      "name": "YKS Şekeri",
      "description": "YKS hazırlığının tatlı hali. Video dersler, PDF'ler ve sorularla üniversite yolunda şeker gibi geçer.",
      "inLanguage": "tr",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://yksekeri.com/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://yksekeri.com/#organization",
      "name": "YKS Şekeri",
      "url": "https://yksekeri.com",
      "description": "YKS, TYT ve AYT hazırlığı için ücretsiz eğitim platformu",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "TR",
        "addressRegion": "Turkey"
      },
      "educationalCredentialAwarded": "YKS Hazırlık Eğitimi",
      "hasEducationalUse": [
        "TYT Matematik", "TYT Türkçe", "TYT Fen Bilimleri", "TYT Sosyal Bilimler",
        "AYT Matematik", "AYT Fizik", "AYT Kimya", "AYT Biyoloji", 
        "AYT Edebiyat", "AYT Tarih", "AYT Coğrafya", "AYT Felsefe"
      ]
    },
    {
      "@type": "Course",
      "@id": "https://yksekeri.com/#course",
      "name": "YKS Hazırlık Kursu",
      "description": "TYT ve AYT derslerini kapsayan kapsamlı YKS hazırlık programı",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "YKS Şekeri"
      },
      "courseMode": "online",
      "educationalLevel": "secondary",
      "inLanguage": "tr",
      "isAccessibleForFree": true,
      "hasCourseInstance": [
        {
          "@type": "CourseInstance",
          "name": "TYT Dersleri",
          "courseMode": "online"
        },
        {
          "@type": "CourseInstance", 
          "name": "AYT Dersleri",
          "courseMode": "online"
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon Multiple Sizes */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="180x180" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
        
        {/* Performance Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.youtube.com" />
        <link rel="dns-prefetch" href="//i.ytimg.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'Neue Haas Display', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
      >
        <GoogleAnalytics />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
