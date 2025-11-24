/**
 * Video Cache Service
 * YouTube videolarını local cache'de saklayıp API quota tasarrufu sağlar
 */

import { YouTubeVideo } from './youtube-api';
import type { SubjectType } from './youtube-api-keys';

export interface CachedVideos {
  lastUpdated: string;
  subject: SubjectType;
  topics: Record<string, YouTubeVideo[]>;
}

/**
 * Cache dosyasının yolu
 */
export function getCacheFilePath(subject: SubjectType): string {
  return `/cache/videos/${subject}.json`;
}

/**
 * Cache'den videoları oku
 */
export async function getCachedVideos(
  subject: SubjectType,
  topicId: string
): Promise<YouTubeVideo[] | null> {
  try {
    const cacheUrl = getCacheFilePath(subject);
    const response = await fetch(cacheUrl);
    
    if (!response.ok) {
      console.log(`📦 Cache bulunamadı: ${subject}`);
      return null;
    }

    const cached: CachedVideos = await response.json();
    
    // Cache'in taze olup olmadığını kontrol et (24 saat)
    const isFresh = isCacheFresh(cached.lastUpdated);
    
    if (!isFresh) {
      console.log(`⏰ Cache eski: ${subject} (${cached.lastUpdated})`);
      return null;
    }

    const videos = cached.topics[topicId];
    
    if (!videos || videos.length === 0) {
      console.log(`📦 Cache'de konu bulunamadı: ${topicId}`);
      return null;
    }

    console.log(`✅ Cache'den ${videos.length} video yüklendi: ${subject} - ${topicId}`);
    return videos;
    
  } catch (error) {
    console.error('Cache okuma hatası:', error);
    return null;
  }
}

/**
 * Cache'in taze olup olmadığını kontrol et (24 saat)
 */
export function isCacheFresh(lastUpdated: string): boolean {
  const cacheDate = new Date(lastUpdated);
  const now = new Date();
  const hoursDiff = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff < 24;
}

/**
 * Cache bilgilerini al (son güncelleme zamanı vs)
 */
export async function getCacheInfo(subject: SubjectType): Promise<{
  exists: boolean;
  lastUpdated?: string;
  isFresh?: boolean;
  topicCount?: number;
} | null> {
  try {
    const cacheUrl = getCacheFilePath(subject);
    const response = await fetch(cacheUrl);
    
    if (!response.ok) {
      return { exists: false };
    }

    const cached: CachedVideos = await response.json();
    
    return {
      exists: true,
      lastUpdated: cached.lastUpdated,
      isFresh: isCacheFresh(cached.lastUpdated),
      topicCount: Object.keys(cached.topics).length
    };
    
  } catch (error) {
    console.error('Cache info hatası:', error);
    return null;
  }
}


